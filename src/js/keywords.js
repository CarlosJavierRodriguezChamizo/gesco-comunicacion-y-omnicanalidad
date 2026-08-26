/* =========================================================================
   keywords.js — (a) Importador del export de Ahrefs (CSV/TSV, local).
                 (b) Tabla con toggle crudo/normalizado, etiquetado y clusters.
                 (c) Selección y justificación de las 10 keywords del caso.

   Payoff: un treemap donde el tamaño es el volumen importado y el color la
   fase asignada. Revela de golpe si el plan se apoya en cuatro términos
   transaccionales enormes y ningún contenido de la parte alta del embudo.

   Todo el parseo es local: ninguna llamada de red.
   ========================================================================= */
import {
  Header, Section, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml, num,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

/* ----------------------------------------------------------- Constantes */
const INTENCIONES = [
  { id: "", label: "— sin etiquetar" },
  { id: "informacional", label: "Informacional" },
  { id: "comercial", label: "Comercial" },
  { id: "transaccional", label: "Transaccional" },
  { id: "marca", label: "De marca" },
];
const FASES = [
  { id: "", label: "— sin fase" },
  { id: "tofu", label: "TOFU" },
  { id: "mofu", label: "MOFU" },
  { id: "bofu", label: "BOFU" },
];
const COLOR_FASE = { tofu: "#0ae4c3", mofu: "#b79bff", bofu: "#ffffff", "": "rgba(255,255,255,.22)" };
const OBJETIVO = 10;   // el caso pide "al menos 10 keywords"

/* -------------------------------------------------------------- Estado */
const estado = {
  /** Corpus de trabajo: arranca con el del dataset y lo enriquece el import. */
  filas: CASO.keywords.items.map((k) => ({
    id: k.id,
    cruda: k.cruda,
    normalizada: k.normalizada,
    idioma: k.idioma,
    volumen: k.volumen,   // null = dato ausente, nunca 0
    kd: k.kd,
    cpc: k.cpc,
    parent: "",
    intencion: "",
    fase: "",
    cluster: "",
    seleccionada: false,
    justificacion: "",
  })),
  vista: "cruda",         // "cruda" | "normalizada"
  origenDatos: "corpus",  // "corpus" | "ahrefs"
};

/* ============================ Parseo del export de Ahrefs ================ */

/** Detecta el separador dominante de la primera línea (tab, ; o ,). */
function detectarSeparador(linea) {
  const candidatos = ["\t", ";", ","];
  let mejor = ",", max = 0;
  candidatos.forEach((s) => {
    const n = linea.split(s).length;
    if (n > max) { max = n; mejor = s; }
  });
  return mejor;
}

/** Parte una línea CSV respetando comillas dobles y comillas escapadas (""). */
function partirLinea(linea, sep) {
  const out = [];
  let campo = "", dentro = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (dentro) {
      if (c === '"') {
        if (linea[i + 1] === '"') { campo += '"'; i++; }
        else dentro = false;
      } else campo += c;
    } else if (c === '"') dentro = true;
    else if (c === sep) { out.push(campo); campo = ""; }
    else campo += c;
  }
  out.push(campo);
  return out.map((s) => s.trim());
}

/** Normaliza una cabecera para poder reconocerla en varios idiomas/versiones. */
const clave = (h) =>
  h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

/** Sinónimos de cada columna que nos interesa (Ahrefs cambia los títulos). */
const COLUMNAS = {
  keyword: ["keyword", "keywords", "palabraclave", "term"],
  volumen: ["volume", "searchvolume", "volumen", "vol", "volumemonthly"],
  kd: ["kd", "difficulty", "keyworddifficulty", "dificultad"],
  cpc: ["cpc", "costperclick"],
  parent: ["parenttopic", "parenttopics", "temapadre", "topic"],
};

/** Convierte "1 200", "1,200", "1.2K" o "" en número o null (nunca 0 por defecto). */
function aNumero(v) {
  if (v === undefined || v === null) return null;
  let s = String(v).trim();
  if (!s || s === "-" || s === "—" || s === "N/A") return null;
  let mult = 1;
  if (/k$/i.test(s)) { mult = 1000; s = s.slice(0, -1); }
  if (/m$/i.test(s)) { mult = 1000000; s = s.slice(0, -1); }
  s = s.replace(/[\s $€%]/g, "");
  // "1.234,5" (es) vs "1,234.5" (en): la última coma o punto manda como decimal.
  const ultimaComa = s.lastIndexOf(",");
  const ultimoPunto = s.lastIndexOf(".");
  if (ultimaComa > -1 && ultimoPunto > -1) {
    if (ultimaComa > ultimoPunto) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (ultimaComa > -1) {
    // Una sola coma: decimal si deja 1-2 cifras detrás, separador de miles si no.
    s = s.length - ultimaComa <= 3 ? s.replace(",", ".") : s.replace(/,/g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n * mult : null;
}

/** Clave de emparejamiento entre el corpus y el export (keyword normalizada). */
const claveKw = (t) =>
  String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Parsea el texto de un export de Ahrefs.
 * Tolera columnas ausentes, orden distinto y cabeceras en varios idiomas.
 * @param {string} texto
 * @returns {{filas: Array, avisos: string[]}}
 */
function parsearAhrefs(texto) {
  const limpio = String(texto || "").replace(/^﻿/, "").trim();
  if (!limpio) return { filas: [], avisos: ["El archivo está vacío."] };

  const lineas = limpio.split(/\r?\n/).filter((l) => l.trim().length);
  if (lineas.length < 2) return { filas: [], avisos: ["Solo hay una línea: falta la cabecera o faltan los datos."] };

  const sep = detectarSeparador(lineas[0]);
  const cabeceras = partirLinea(lineas[0], sep).map(clave);

  const idx = {};
  Object.entries(COLUMNAS).forEach(([campo, alias]) => {
    idx[campo] = cabeceras.findIndex((h) => alias.includes(h));
  });

  const avisos = [];
  if (idx.keyword < 0) {
    // Sin columna reconocible: asumimos que la keyword es la primera columna.
    idx.keyword = 0;
    avisos.push("No he encontrado una columna «Keyword»: uso la primera columna.");
  }
  ["volumen", "kd", "cpc", "parent"].forEach((c) => {
    if (idx[c] < 0) avisos.push(`Sin columna «${c}» en el export: ese dato queda vacío.`);
  });

  const filas = [];
  for (let i = 1; i < lineas.length; i++) {
    const celdas = partirLinea(lineas[i], sep);
    const kw = (celdas[idx.keyword] || "").trim();
    if (!kw) continue;
    filas.push({
      cruda: kw,
      volumen: idx.volumen >= 0 ? aNumero(celdas[idx.volumen]) : null,
      kd: idx.kd >= 0 ? aNumero(celdas[idx.kd]) : null,
      cpc: idx.cpc >= 0 ? aNumero(celdas[idx.cpc]) : null,
      parent: idx.parent >= 0 ? (celdas[idx.parent] || "").trim() : "",
    });
  }
  if (!filas.length) avisos.push("No he podido leer ninguna fila de datos.");
  return { filas, avisos };
}

/**
 * Vuelca el export sobre el corpus: enriquece las que ya existen (por keyword
 * normalizada) y añade las nuevas. Conserva el etiquetado ya hecho.
 */
function aplicarImport(filasImport) {
  // Un índice por clave devuelve TODAS las filas que comparten esa forma
  // normalizada: en el corpus hay variantes distintas ("azeite", "aceite")
  // que normalizan igual, y las dos tienen que recibir el volumen. Si se
  // quedara solo una, el toggle crudo/normalizado enseñaría datos a medias.
  const indice = new Map();
  const indexar = (fila) => {
    [claveKw(fila.normalizada), claveKw(fila.cruda)].forEach((k) => {
      if (!k) return;
      if (!indice.has(k)) indice.set(k, []);
      if (!indice.get(k).includes(fila)) indice.get(k).push(fila);
    });
  };
  estado.filas.forEach(indexar);

  let enriquecidas = 0, nuevas = 0;

  filasImport.forEach((f, i) => {
    const existentes = indice.get(claveKw(f.cruda));
    if (existentes?.length) {
      existentes.forEach((fila) => {
        fila.volumen = f.volumen;
        fila.kd = f.kd;
        fila.cpc = f.cpc;
        if (f.parent) fila.parent = f.parent;
      });
      enriquecidas += existentes.length;
    } else {
      const fila = {
        id: `imp-${i + 1}`,
        cruda: f.cruda,
        normalizada: f.cruda.toLowerCase().replace(/\s+/g, " ").trim(),
        idioma: "",
        volumen: f.volumen, kd: f.kd, cpc: f.cpc, parent: f.parent,
        intencion: "", fase: "", cluster: "", seleccionada: false, justificacion: "",
      };
      estado.filas.push(fila);
      indexar(fila);
      nuevas++;
    }
  });

  estado.origenDatos = "ahrefs";
  return { enriquecidas, nuevas };
}

/* ------------------------------------------------------ Derivados de estado */
const seleccionadas = () => estado.filas.filter((f) => f.seleccionada);
const conVolumen = () => estado.filas.filter((f) => typeof f.volumen === "number" && f.volumen > 0);
const clustersDe = () => {
  const set = new Set(estado.filas.map((f) => f.cluster.trim()).filter(Boolean));
  return [...set].sort();
};

/* ------------------------------------------------------------- Render */

function filaHtml(f) {
  const termino = estado.vista === "cruda" ? f.cruda : f.normalizada;
  const alterno = estado.vista === "cruda" ? f.normalizada : f.cruda;
  const distinto = f.cruda !== f.normalizada;

  const opcion = (lista, valor) =>
    lista.map((o) => `<option value="${o.id}"${o.id === valor ? " selected" : ""}>${escapeHtml(o.label)}</option>`).join("");

  return `<tr data-fila="${escapeHtml(f.id)}"${f.seleccionada ? ' class="is-sel"' : ""}>
    <td><input class="kw-check" type="checkbox" data-sel="${escapeHtml(f.id)}"${f.seleccionada ? " checked" : ""}
      aria-label="Seleccionar ${escapeHtml(termino)} para el listado final" /></td>
    <td class="kw-term">${escapeHtml(termino)}
      ${distinto ? `<small>${escapeHtml(alterno)}</small>` : ""}</td>
    <td>${f.idioma ? `<span class="kw-idioma">${escapeHtml(f.idioma)}</span>` : ""}</td>
    <td class="num" data-vacio="${f.volumen === null ? "si" : "no"}">${f.volumen === null ? "—" : num(f.volumen)}</td>
    <td class="num" data-vacio="${f.kd === null ? "si" : "no"}">${f.kd === null ? "—" : num(f.kd)}</td>
    <td><select data-campo="intencion" data-id="${escapeHtml(f.id)}" aria-label="Intención de ${escapeHtml(termino)}">${opcion(INTENCIONES, f.intencion)}</select></td>
    <td><select data-campo="fase" data-id="${escapeHtml(f.id)}" aria-label="Fase de ${escapeHtml(termino)}">${opcion(FASES, f.fase)}</select></td>
    <td><input type="text" data-campo="cluster" data-id="${escapeHtml(f.id)}" value="${escapeHtml(f.cluster)}"
      list="clusters" placeholder="nombre del cluster" aria-label="Cluster de ${escapeHtml(termino)}" /></td>
  </tr>`;
}

function tablaHtml() {
  return `<datalist id="clusters">${clustersDe().map((c) => `<option value="${escapeHtml(c)}"></option>`).join("")}</datalist>
  <div class="kw-tabla-wrap">
    <table class="kw-tabla">
      <caption class="visually-hidden">Corpus de keywords con intención, fase y cluster</caption>
      <thead><tr>
        <th scope="col"><span class="visually-hidden">Seleccionar</span></th>
        <th scope="col">Keyword</th>
        <th scope="col">Idioma</th>
        <th scope="col">Volumen</th>
        <th scope="col">KD</th>
        <th scope="col">Intención</th>
        <th scope="col">Fase</th>
        <th scope="col">Cluster</th>
      </tr></thead>
      <tbody>${estado.filas.map(filaHtml).join("")}</tbody>
    </table>
  </div>`;
}

function seleccionHtml() {
  const sel = seleccionadas();
  if (!sel.length) return `<p class="sel-vacia">Marca keywords en la tabla de arriba y aparecerán aquí para justificarlas.</p>`;
  return sel
    .map(
      (f) => `<div class="sel-item" data-justificada="${f.justificacion.trim().length > 15 ? "si" : "no"}">
        <div class="sel-item__kw">${escapeHtml(f.normalizada)}
          <small>${f.fase ? f.fase.toUpperCase() : "sin fase"} · ${f.intencion || "sin intención"} ·
          ${f.volumen === null ? "sin volumen" : `${num(f.volumen)} búsquedas`}</small></div>
        <textarea data-just="${escapeHtml(f.id)}" rows="2"
          placeholder="¿Por qué esta keyword? Qué buyer persona la busca, en qué momento y qué contenido la responde."
          aria-label="Justificación de ${escapeHtml(f.normalizada)}">${escapeHtml(f.justificacion)}</textarea>
        <button class="btn btn--ghost btn--sm" type="button" data-quitar-sel="${escapeHtml(f.id)}">Quitar</button>
      </div>`
    )
    .join("");
}

/* ------------------------------------------- Payoff: treemap por volumen */

/**
 * Reparte rectángulos por área proporcional al valor (squarified treemap
 * simplificado: filas alternando orientación). Suficiente y legible.
 */
function treemapLayout(items, W, H) {
  const total = items.reduce((a, b) => a + b.valor, 0);
  if (!total) return [];
  const out = [];
  let x = 0, y = 0, w = W, h = H;
  let resto = [...items].sort((a, b) => b.valor - a.valor);
  let restoTotal = total;

  while (resto.length) {
    const horizontal = w >= h;
    // Toma tantos elementos como quepan razonablemente en la banda actual.
    const n = Math.max(1, Math.min(resto.length, Math.round(Math.sqrt(resto.length))));
    const banda = resto.slice(0, n);
    const bandaTotal = banda.reduce((a, b) => a + b.valor, 0);
    const grosor = (bandaTotal / restoTotal) * (horizontal ? w : h);

    let cursor = horizontal ? y : x;
    banda.forEach((it) => {
      const largo = (it.valor / bandaTotal) * (horizontal ? h : w);
      out.push(
        horizontal
          ? { ...it, x, y: cursor, w: grosor, h: largo }
          : { ...it, x: cursor, y, w: largo, h: grosor }
      );
      cursor += largo;
    });

    if (horizontal) { x += grosor; w -= grosor; } else { y += grosor; h -= grosor; }
    resto = resto.slice(n);
    restoTotal -= bandaTotal;
    if (w <= 0.5 || h <= 0.5) break;
  }
  return out;
}

function payoffHtml() {
  const conVol = conVolumen();
  const etiquetadas = estado.filas.filter((f) => f.fase);

  if (!conVol.length) {
    return {
      html: `<p class="reveal-moment__empty">Todavía no hay volúmenes. Importa el export de Ahrefs
        y el mapa aparecerá aquí: cada keyword con el tamaño de su volumen real.</p>`,
      pie: `El corpus de partida trae <strong>${estado.filas.length}</strong> términos sin datos de búsqueda —
        <code>volumen: null</code>, no cero. El dato lo traemos de Ahrefs en clase.`,
    };
  }

  const W = 1000, H = 420;
  const items = conVol
    .map((f) => ({ kw: f.normalizada, valor: f.volumen, fase: f.fase, sel: f.seleccionada }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 60);
  const rects = treemapLayout(items, W, H);

  const svg = rects
    .map((r) => {
      const cabe = r.w > 78 && r.h > 30;
      const color = COLOR_FASE[r.fase] ?? COLOR_FASE[""];
      const texto = r.fase === "bofu" || r.fase === "tofu" ? "#00133f" : "#ffffff";
      const recorte = r.kw.length > Math.floor(r.w / 7.2) ? `${r.kw.slice(0, Math.max(3, Math.floor(r.w / 7.2) - 1))}…` : r.kw;
      return `<g>
        <rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${Math.max(0, r.w - 1).toFixed(1)}"
              height="${Math.max(0, r.h - 1).toFixed(1)}" fill="${color}"
              ${r.sel ? 'stroke="#ffffff" stroke-width="3"' : ""}>
          <title>${escapeHtml(r.kw)} — ${num(r.valor)} búsquedas — ${r.fase ? r.fase.toUpperCase() : "sin fase"}</title>
        </rect>
        ${cabe ? `<text class="tm-kw" x="${(r.x + 8).toFixed(1)}" y="${(r.y + 20).toFixed(1)}" font-size="13" fill="${texto}">${escapeHtml(recorte)}</text>
        <text class="tm-vol" x="${(r.x + 8).toFixed(1)}" y="${(r.y + 36).toFixed(1)}" font-size="11" fill="${texto}">${num(r.valor)}</text>` : ""}
      </g>`;
    })
    .join("");

  const leyenda = `<div class="treemap-leyenda">
    ${["tofu", "mofu", "bofu"].map((f) => `<span><i style="background:${COLOR_FASE[f]}"></i>${f.toUpperCase()}</span>`).join("")}
    <span><i style="background:${COLOR_FASE[""]}"></i>Sin fase asignada</span>
    <span><i style="background:transparent;border:3px solid #fff"></i>En vuestras 10</span>
  </div>`;

  // Reparto del volumen por fase: el número que provoca la conversación.
  const porFase = ["tofu", "mofu", "bofu", ""].map((fid) => {
    const v = conVol.filter((f) => f.fase === fid).reduce((a, b) => a + b.volumen, 0);
    return { fid, v };
  });
  const totalVol = porFase.reduce((a, b) => a + b.v, 0) || 1;
  const pct = (fid) => Math.round((porFase.find((p) => p.fid === fid).v / totalVol) * 100);

  const pie = `Cada rectángulo es una keyword y su tamaño es el volumen real importado.
    Del volumen total, <strong>${pct("tofu")}% está en TOFU</strong>, ${pct("mofu")}% en MOFU y
    ${pct("bofu")}% en BOFU (${pct("")}% sin fase, sobre ${etiquetadas.length} de ${estado.filas.length} etiquetadas).
    Si vuestro plan se apoya en cuatro términos transaccionales enormes, se ve aquí antes que en ninguna hoja de cálculo.`;

  return {
    html: `<svg class="treemap" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Mapa de las keywords: el tamaño es el volumen de búsqueda y el color, la fase asignada">${svg}</svg>${leyenda}`,
    pie,
  };
}

/* ------------------------------------------------ Validación estructural */
function checksHtml() {
  const sel = seleccionadas();
  const justificadas = sel.filter((f) => f.justificacion.trim().length > 15);
  const fasesRepresentadas = new Set(sel.map((f) => f.fase).filter(Boolean));
  const clusters = clustersDe();

  const items = [
    { ok: sel.length >= OBJETIVO, txt: `Al menos ${OBJETIVO} keywords seleccionadas (ahora: ${sel.length}).` },
    { ok: sel.length > 0 && justificadas.length === sel.length,
      txt: `Todas las seleccionadas justificadas (ahora: ${justificadas.length} de ${sel.length}).` },
    { ok: fasesRepresentadas.size >= 2,
      txt: `Al menos dos fases del funnel representadas (ahora: ${fasesRepresentadas.size ? [...fasesRepresentadas].map((f) => f.toUpperCase()).join(", ") : "ninguna"}).` },
    { ok: clusters.length >= 2, txt: `Al menos dos clusters temáticos nombrados (ahora: ${clusters.length}).` },
  ];
  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const sel = seleccionadas();
  const l = ["# Listado de keywords", "", `_Caso: ${CASO.meta.caso}_`, ""];

  l.push(`## Las ${sel.length} keywords seleccionadas`, "");
  if (!sel.length) {
    l.push("_(todavía no hay ninguna seleccionada)_", "");
  } else {
    l.push("| # | Keyword | Idioma | Volumen | KD | Intención | Fase | Cluster |", "|---|---|---|---|---|---|---|---|");
    sel.forEach((f, i) => {
      l.push(`| ${i + 1} | ${f.normalizada} | ${f.idioma || "—"} | ${f.volumen === null ? "—" : num(f.volumen)} | ${f.kd === null ? "—" : num(f.kd)} | ${f.intencion || "—"} | ${f.fase ? f.fase.toUpperCase() : "—"} | ${f.cluster || "—"} |`);
    });
    l.push("", "### Justificación de cada elección", "");
    sel.forEach((f, i) => {
      l.push(`${i + 1}. **${f.normalizada}** — ${f.justificacion.trim() || "_(sin justificar)_"}`);
    });
  }

  const cl = clustersDe();
  if (cl.length) {
    l.push("", "## Clusters temáticos", "");
    cl.forEach((c) => {
      const dentro = estado.filas.filter((f) => f.cluster.trim() === c);
      l.push(`- **${c}** (${dentro.length} términos): ${dentro.map((f) => f.normalizada).join(", ")}`);
    });
  }

  l.push("", `_Origen de los datos de búsqueda: ${estado.origenDatos === "ahrefs" ? "export de Ahrefs importado en clase" : "sin importar — el corpus de partida no trae volúmenes"}._`);
  return l.join("\n");
}

/* -------------------------------------------------------------- Prompts */
function promptClusters() {
  const lista = estado.filas
    .map((f) => `- ${f.normalizada} (${f.idioma || "?"}) — volumen: ${f.volumen === null ? "sin dato" : f.volumen}`)
    .join("\n");
  return `Soy responsable de contenidos de una marca de alimentación española que quiere que los turistas extranjeros la recompren al volver a su país.

Este es mi corpus de keywords, tal y como se buscan:

${lista}

Haz tres cosas:
1. Agrúpalas en clusters temáticos y ponle nombre a cada cluster.
2. Para cada cluster, di qué intención de búsqueda predomina (informacional, comercial, transaccional o de marca).
3. Señala qué huecos temáticos ves: qué buscaría mi buyer persona que no está en esta lista.

No inventes volúmenes de búsqueda: si un término no tiene dato, dilo.`;
}

function promptSeleccion() {
  const sel = seleccionadas();
  const lista = sel
    .map((f) => `- ${f.normalizada} | fase: ${f.fase || "sin asignar"} | intención: ${f.intencion || "sin asignar"} | volumen: ${f.volumen === null ? "sin dato" : f.volumen} | mi justificación: ${f.justificacion || "(vacía)"}`)
    .join("\n");
  return `Estoy cerrando el listado de keywords de un plan de contenidos para promocionar un producto agroalimentario español entre turistas extranjeros.

Estas son mis ${sel.length} keywords seleccionadas:

${lista}

Haz tres cosas:
1. Revisa cada justificación: dime cuál es débil y por qué, y cómo la reescribirías en dos líneas.
2. Dime si el reparto entre fases del funnel está desequilibrado y qué implicaría eso para el plan.
3. Para cada keyword, propón un título de contenido concreto que la trabaje.

No cambies mi selección: trabaja sobre ella.`;
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Keywords", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M2", href: "/decks/m2.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Keywords, clusters y las 10 del caso</h1>
        <p class="lead">Importa el export de Ahrefs, etiqueta intención y fase, nombra tus clusters
        y cierra el listado de al menos diez keywords justificadas que pide el caso.</p>
        <span class="fuente">${escapeHtml(CASO.keywords.fuente)}</span>
      </div>

      <div class="tool-part" id="importar">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Importar el export de Ahrefs</h2></div>
        </div>
        <div class="importador">
          <p class="importador__lead">Exporta desde <strong>Keywords Explorer</strong> en CSV o TSV y suéltalo aquí.
          Detecto el separador y las cabeceras (<code>Keyword</code>, <code>Volume</code>, <code>KD</code>,
          <code>CPC</code>, <code>Parent topic</code>) y tolero columnas ausentes. Todo el parseo ocurre en tu
          navegador: <strong>no se sube nada a ningún sitio</strong>.</p>
          <div class="importador__cols">
            <div class="dropzone" data-kw="drop" tabindex="0" role="button">
              <span class="dropzone__icon" aria-hidden="true">⤓</span>
              <span class="dropzone__text">Arrastra el <code>.csv</code> o <code>.tsv</code>, o pulsa para elegirlo</span>
              <input class="visually-hidden" type="file" accept=".csv,.tsv,.txt,text/csv" data-kw="file" />
            </div>
            <div class="field">
              <label for="kw-pegar">…o pega aquí el contenido</label>
              <textarea id="kw-pegar" data-kw="paste" placeholder="Keyword&#9;Volume&#9;KD&#9;CPC&#9;Parent topic"></textarea>
            </div>
          </div>
          <div class="row">
            <button class="btn btn--primary" type="button" data-kw="importar">Importar</button>
            <button class="btn btn--ghost" type="button" data-kw="reset">Volver al corpus de partida</button>
          </div>
          <p class="importador__estado" data-kw="estado" role="status" aria-live="polite"></p>
        </div>
      </div>

      <div class="tool-part" id="tabla">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Etiquetar y agrupar</h2></div>
          <span class="score" data-score-tabla></span>
        </div>
        <div class="toolbar">
          <span class="field__label">Ver la keyword:</span>
          <div class="toggle" role="group" aria-label="Ver la keyword cruda o normalizada">
            <button type="button" data-vista="cruda" aria-pressed="true">Cruda</button>
            <button type="button" data-vista="normalizada" aria-pressed="false">Normalizada</button>
          </div>
          <span class="toolbar__spacer"></span>
          <span class="status-live" data-vista-nota>Tal y como se teclea: con variantes, faltas y mezcla de idiomas.</span>
        </div>
        <div data-tabla></div>
        <div class="pista">
          <button class="pista__btn" type="button" data-pista>Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto hidden>
            <p><strong>No hay una clasificación correcta.</strong> La misma keyword cambia de fase según quién
            la busque. Preguntas que ayudan:</p>
            <ul>
              <li>Léela en voz alta: ¿esa persona sabe ya lo que quiere comprar?</li>
              <li>¿Qué esperaría encontrar al hacer clic: una explicación, una comparativa o un botón de compra?</li>
              <li>Un cluster no es un montón de sinónimos: es un tema del que podríais escribir diez piezas distintas.</li>
              <li>Si una keyword tiene mucho volumen pero no la sabéis justificar, probablemente no es vuestra.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tool-part" id="seleccion">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte C</span><h2>Las ${OBJETIVO} keywords, justificadas</h2></div>
          <span class="score" data-score-sel></span>
        </div>
        <p class="muted" style="max-width:74ch">El caso pide «un listado de, al menos, 10 palabras clave,
        justificando y explicando el porqué de dicha elección». Esto es literalmente ese listado.</p>
        <div class="seleccion" data-seleccion style="margin-top:var(--sp-4)"></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div class="row" style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "clusters", label: "Copiar prompt: agrupar en clusters", hint: "Copia tu corpus completo y pide una propuesta de agrupación temática." })}
        </div>
        <div class="row" style="margin-top:var(--sp-3)">
          ${AskAIButton({ id: "seleccion", label: "Copiar prompt: revisar mis justificaciones", hint: "Copia tus 10 con su justificación y pide que señalen las débiles." })}
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Sobre qué estáis construyendo el plan",
    entradilla: "El tamaño es el volumen real. El color, la fase que le habéis puesto vosotros.",
    html: `<p class="reveal-moment__empty">Importa el export de Ahrefs y etiqueta las fases: el mapa se dibuja solo.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza del entregable: <a href="/tools/funnel.html">el mix de captación y la conversión</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarTabla() { app.querySelector("[data-tabla]").innerHTML = tablaHtml(); }
function pintarSeleccion() { app.querySelector("[data-seleccion]").innerHTML = seleccionHtml(); }
function pintarChecks() { app.querySelector("[data-checks]").innerHTML = checksHtml(); }
function pintarScores() {
  const sel = seleccionadas();
  const etiquetadas = estado.filas.filter((f) => f.fase && f.intencion).length;
  const st = app.querySelector("[data-score-tabla]");
  st.innerHTML = `${etiquetadas}/${estado.filas.length} <small>etiquetadas</small>`;
  st.dataset.ok = etiquetadas === estado.filas.length ? "si" : "no";

  const ss = app.querySelector("[data-score-sel]");
  ss.innerHTML = `${sel.length}/${OBJETIVO} <small>seleccionadas</small>`;
  ss.dataset.ok = sel.length >= OBJETIVO ? "si" : "no";
}
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}
function refrescar({ tabla = true } = {}) {
  if (tabla) pintarTabla();
  pintarSeleccion();
  pintarChecks();
  pintarScores();
  pintarPayoff();
}

/* ------------------------------------------------------- Importador: eventos */
const estadoImport = app.querySelector('[data-kw="estado"]');
const decir = (t, tipo = "ok") => { estadoImport.textContent = t; estadoImport.dataset.tipo = tipo; };

function importarTexto(texto) {
  const { filas, avisos } = parsearAhrefs(texto);
  if (!filas.length) return decir(avisos.join(" ") || "No he podido leer el archivo.", "error");
  const { enriquecidas, nuevas } = aplicarImport(filas);
  refrescar();
  const extra = avisos.length ? ` (${avisos.join(" ")})` : "";
  const pl = (n, sing, plur) => `${n} ${n === 1 ? sing : plur}`;
  decir(
    `Importad${filas.length === 1 ? "a" : "as"} ${pl(filas.length, "fila", "filas")}: ` +
    `${pl(enriquecidas, "término del corpus enriquecido", "términos del corpus enriquecidos")} y ` +
    `${pl(nuevas, "término nuevo", "términos nuevos")}.${extra}`
  );
}

app.addEventListener("click", (e) => {
  const acc = e.target.closest("[data-kw]")?.dataset.kw;
  if (acc === "drop") app.querySelector('[data-kw="file"]').click();
  else if (acc === "importar") importarTexto(app.querySelector('[data-kw="paste"]').value);
  else if (acc === "reset") {
    estado.filas = CASO.keywords.items.map((k) => ({
      id: k.id, cruda: k.cruda, normalizada: k.normalizada, idioma: k.idioma,
      volumen: null, kd: null, cpc: null, parent: "",
      intencion: "", fase: "", cluster: "", seleccionada: false, justificacion: "",
    }));
    estado.origenDatos = "corpus";
    refrescar();
    decir("Vuelta al corpus de partida, sin volúmenes.");
  }
});

const fileInput = app.querySelector('[data-kw="file"]');
fileInput.addEventListener("change", () => {
  const f = fileInput.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => importarTexto(String(r.result));
  r.onerror = () => decir("No se pudo leer el archivo.", "error");
  r.readAsText(f);
});

const dropKw = app.querySelector('[data-kw="drop"]');
["dragenter", "dragover"].forEach((ev) =>
  dropKw.addEventListener(ev, (e) => { e.preventDefault(); dropKw.classList.add("is-over"); })
);
["dragleave", "drop"].forEach((ev) => dropKw.addEventListener(ev, () => dropKw.classList.remove("is-over")));
dropKw.addEventListener("drop", (e) => {
  e.preventDefault();
  const f = e.dataTransfer?.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => importarTexto(String(r.result));
  r.readAsText(f);
});
dropKw.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
});

/* --------------------------------------------------- Tabla y selección */

app.addEventListener("change", (e) => {
  const sel = e.target.dataset.sel;
  if (sel) {
    const f = estado.filas.find((x) => x.id === sel);
    f.seleccionada = e.target.checked;
    e.target.closest("tr").classList.toggle("is-sel", f.seleccionada);
    pintarSeleccion(); pintarChecks(); pintarScores(); pintarPayoff();
    return;
  }
  const campo = e.target.dataset.campo;
  if (campo) {
    const f = estado.filas.find((x) => x.id === e.target.dataset.id);
    f[campo] = e.target.value;
    pintarSeleccion(); pintarChecks(); pintarScores(); pintarPayoff();
  }
});

app.addEventListener("input", (e) => {
  // El cluster se escribe a mano: refrescamos sin repintar la tabla (no perder foco).
  if (e.target.dataset.campo === "cluster") {
    estado.filas.find((x) => x.id === e.target.dataset.id).cluster = e.target.value;
    pintarChecks();
    return;
  }
  const just = e.target.dataset.just;
  if (just) {
    const f = estado.filas.find((x) => x.id === just);
    f.justificacion = e.target.value;
    e.target.closest(".sel-item").dataset.justificada = f.justificacion.trim().length > 15 ? "si" : "no";
    pintarChecks();
  }
});

app.addEventListener("click", (e) => {
  const quitar = e.target.closest("[data-quitar-sel]")?.dataset.quitarSel;
  if (!quitar) return;
  estado.filas.find((f) => f.id === quitar).seleccionada = false;
  refrescar();
});

/* ------------------------------------------------- Toggle crudo/normalizado */
app.addEventListener("click", (e) => {
  const v = e.target.closest("[data-vista]")?.dataset.vista;
  if (!v || v === estado.vista) return;
  estado.vista = v;
  app.querySelectorAll("[data-vista]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vista === v)));
  app.querySelector("[data-vista-nota]").textContent =
    v === "cruda"
      ? "Tal y como se teclea: con variantes, faltas y mezcla de idiomas."
      : "Limpia y agrupada: la forma con la que trabaja el plan de contenidos.";
  pintarTabla();
});

/* ------------------------------------------------------------- Pista */
app.addEventListener("click", (e) => {
  if (!e.target.closest("[data-pista]")) return;
  const txt = app.querySelector("[data-pista-texto]");
  txt.hidden = !txt.hidden;
  e.target.closest("[data-pista]").textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
});

/* ------------------------------------------------------ AskAI + StatePanel */
wireAskAI(app, { clusters: promptClusters, seleccion: promptSeleccion });

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "keywords",
  nombreArchivo: "keywords",
  getState: () => ({ filas: structuredClone(estado.filas), vista: estado.vista, origenDatos: estado.origenDatos }),
  setState: (nuevo) => {
    if (!Array.isArray(nuevo.filas)) throw new Error("el archivo no trae la lista de keywords");
    estado.filas = nuevo.filas.map((f) => ({
      id: f.id, cruda: f.cruda ?? "", normalizada: f.normalizada ?? f.cruda ?? "",
      idioma: f.idioma ?? "", volumen: f.volumen ?? null, kd: f.kd ?? null, cpc: f.cpc ?? null,
      parent: f.parent ?? "", intencion: f.intencion ?? "", fase: f.fase ?? "",
      cluster: f.cluster ?? "", seleccionada: !!f.seleccionada, justificacion: f.justificacion ?? "",
    }));
    estado.vista = nuevo.vista === "normalizada" ? "normalizada" : "cruda";
    estado.origenDatos = nuevo.origenDatos || "corpus";
    app.querySelectorAll("[data-vista]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vista === estado.vista)));
    refrescar();
  },
  toMarkdown,
  ayuda: "Este archivo es la segunda de las dos piezas que hay que traer el 25 de septiembre.",
});

refrescar();
