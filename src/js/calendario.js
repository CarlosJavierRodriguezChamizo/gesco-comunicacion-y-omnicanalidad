/* =========================================================================
   calendario.js — (a) Calendario anual: 12 meses × plataformas elegidas, con
                       la estacionalidad del producto y la turística de fondo.
                   (b) Briefs de las 5 creatividades que exige el caso.

   Payoff: las dos bandas superpuestas. Deja a la vista los meses en los que
   el turista viaja pero no hay cosecha, y al revés. Esa tensión es el
   problema real del calendario de una DOP.
   ========================================================================= */
import {
  Header, Section, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const FASES = ["", "tofu", "mofu", "bofu"];
const PLATAFORMAS_BASE = ["Blog / web", "Instagram", "TikTok", "YouTube", "Email", "Google Ads", "Meta Ads"];

/** Los cinco briefs que pide el caso: «ejemplos de 5 creatividades finales». */
const CAMPOS_BRIEF = [
  { id: "formato", label: "Formato", ph: "Reel de 20″, carrusel, banner 300×250, vídeo…" },
  { id: "plataforma", label: "Plataforma", ph: "¿Dónde se publica exactamente?" },
  { id: "objetivo", label: "Objetivo", ph: "Alcance, tráfico al blog, captación de lead…" },
  { id: "insight", label: "Insight", ph: "La duda o el deseo de tu buyer persona que la pieza toca." },
  { id: "mensaje", label: "Mensaje", ph: "Qué dice la pieza, en una frase." },
  { id: "cta", label: "CTA", ph: "Qué le pedimos que haga." },
  { id: "especificaciones", label: "Especificaciones", ph: "Medidas, duración, texto máximo, requisitos legales…" },
];

/* -------------------------------------------------------------- Estado */
const estado = {
  producto: CASO.meta.ejeDemo.producto,
  plataformas: ["Blog / web", "Instagram", "Email"],
  /** Piezas de contenido: { id, plataforma, mes, titulo, tipo, cluster, fase } */
  piezas: [],
  briefs: Array.from({ length: 5 }, (_, i) => ({
    id: `b${i + 1}`,
    ...Object.fromEntries(CAMPOS_BRIEF.map((c) => [c.id, ""])),
  })),
};

/** Producto seleccionado del dataset. */
const productoActual = () => CASO.productos.find((p) => p.id === estado.producto) || CASO.productos[0];

/* --------------------------------------------------------- Render (a) */

function bandasHtml() {
  const prod = productoActual().estacionalidadProduccion;
  const tur = CASO.turismo.estacionalidadTuristica.indice;
  const cols = MESES.map((_, i) => {
    const hP = Math.round((prod[i] / 100) * 100);
    const hT = Math.round((tur[i] / 100) * 100);
    return `<div class="cal-banda-col">
      <i class="b-producto" style="height:${hP}%"></i>
      <i class="b-turismo" style="height:${hT}%;opacity:.9"></i>
    </div>`;
  }).join("");
  return `<div class="cal-bandas" aria-hidden="true"><div class="cal-bandas__hueco"></div>${cols}</div>`;
}

function gridHtml() {
  const cabecera = `<div></div>${MESES.map((m) => `<div class="cal-mes">${m}</div>`).join("")}`;
  const filas = estado.plataformas
    .map((p) => {
      const celdas = MESES.map((_, i) => {
        const piezas = estado.piezas.filter((x) => x.plataforma === p && x.mes === i);
        return `<div class="cal-celda" tabindex="0" role="button"
          data-celda data-plat="${escapeHtml(p)}" data-mes="${i}"
          aria-label="${escapeHtml(p)}, ${MESES_LARGO[i]}: ${piezas.length} piezas. Pulsa para añadir.">
          ${piezas.map((x) => `<span class="cal-pieza cal-pieza--${x.fase || "sin"}" title="${escapeHtml(x.titulo)}">${escapeHtml(x.titulo || "(sin título)")}</span>`).join("")}
        </div>`;
      }).join("");
      return `<div class="cal-plat">${escapeHtml(p)}</div>${celdas}`;
    })
    .join("");

  return `<div class="cal-wrap">
    ${bandasHtml()}
    <div class="cal-grid">${cabecera}${filas}</div>
  </div>`;
}

function plataformasHtml() {
  const todas = [...new Set([...PLATAFORMAS_BASE, ...estado.plataformas])];
  return todas
    .map(
      (p) => `<button class="plat-chip" type="button" data-plat-toggle="${escapeHtml(p)}"
        aria-pressed="${estado.plataformas.includes(p)}">${escapeHtml(p)}</button>`
    )
    .join("");
}

function piezasListaHtml() {
  if (!estado.piezas.length) return `<p class="small muted">Todavía no hay piezas. Pulsa una celda del calendario.</p>`;
  return estado.piezas
    .slice()
    .sort((a, b) => a.mes - b.mes)
    .map(
      (x) => `<div class="pieza-fila">
        <span class="fase fase--${x.fase || "sin"}">${x.fase ? x.fase.toUpperCase() : "sin fase"}</span>
        <strong>${escapeHtml(x.titulo || "(sin título)")}</strong>
        <span class="muted">${escapeHtml(x.plataforma)} · ${MESES_LARGO[x.mes]}${x.cluster ? ` · ${escapeHtml(x.cluster)}` : ""}${x.tipo ? ` · ${escapeHtml(x.tipo)}` : ""}</span>
        <button type="button" data-borrar-pieza="${escapeHtml(x.id)}" aria-label="Eliminar la pieza">×</button>
      </div>`
    )
    .join("");
}

/* --------------------------------------------------------- Render (b) */
function briefHtml(b, i) {
  const campos = CAMPOS_BRIEF.map((c) => {
    const id = `br-${b.id}-${c.id}`;
    const largo = c.id === "mensaje" || c.id === "insight" || c.id === "especificaciones";
    const control = largo
      ? `<textarea id="${id}" rows="2" data-brief="${b.id}" data-campo="${c.id}" placeholder="${escapeHtml(c.ph)}">${escapeHtml(b[c.id])}</textarea>`
      : `<input id="${id}" type="text" data-brief="${b.id}" data-campo="${c.id}" value="${escapeHtml(b[c.id])}" placeholder="${escapeHtml(c.ph)}" />`;
    return `<div class="field"><label for="${id}">${escapeHtml(c.label)}</label>${control}</div>`;
  }).join("");

  const rellenos = CAMPOS_BRIEF.filter((c) => b[c.id].trim()).length;
  return `<article class="brief">
    <div class="brief__head">
      <span class="brief__n">0${i + 1}</span>
      <h3 class="brief__t">Creatividad ${i + 1}</h3>
      <span class="brief__completo" data-ok="${rellenos === CAMPOS_BRIEF.length ? "si" : "no"}">${rellenos}/${CAMPOS_BRIEF.length}</span>
    </div>
    ${campos}
    ${AskAIButton({ id: `brief-${b.id}`, label: "Copiar prompt: producir esta pieza", hint: "" })}
  </article>`;
}

/* --------------------------------------------------- Payoff (RevealMoment) */

function payoffHtml() {
  const p = productoActual();
  const prod = p.estacionalidadProduccion;
  const tur = CASO.turismo.estacionalidadTuristica.indice;

  const W = 1000, H = 340, pad = 46;
  const anchoMes = (W - pad * 2) / 12;
  const alto = H - pad * 2 - 20;
  const y = (v) => pad + alto - (v / 100) * alto;

  const area = (serie, color, op) => {
    const pts = serie.map((v, i) => `${(pad + anchoMes * (i + 0.5)).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    return `<polygon points="${pad},${pad + alto} ${pts} ${W - pad},${pad + alto}" fill="${color}" fill-opacity="${op}"/>
            <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
  };

  const ejes = MESES.map(
    (m, i) => `<text class="s-mes" x="${(pad + anchoMes * (i + 0.5)).toFixed(1)}" y="${H - 18}" text-anchor="middle" opacity=".8">${m}</text>`
  ).join("");

  // Meses de tensión: mucho turismo y poca cosecha, y al revés.
  const tension = MESES.map((m, i) => ({ m, i, t: tur[i], p: prod[i] }));
  const turistaSinProducto = tension.filter((x) => x.t >= 60 && x.p <= 25);
  const productoSinTurista = tension.filter((x) => x.p >= 60 && x.t <= 40);

  const marcas = turistaSinProducto
    .map((x) => `<rect x="${(pad + anchoMes * x.i).toFixed(1)}" y="${pad}" width="${anchoMes.toFixed(1)}" height="${alto}"
      fill="#ffb02e" fill-opacity=".14" stroke="#ffb02e" stroke-opacity=".5" stroke-dasharray="4 4"/>`)
    .join("");

  const nombres = (lista) => lista.map((x) => MESES_LARGO[x.i]).join(", ") || "ninguno";

  const pie = `Producto: <strong>${escapeHtml(p.nombre)}</strong> (${p.figura}).
    Meses con turista y sin cosecha: <strong>${nombres(turistaSinProducto)}</strong>.
    Meses con cosecha y sin turista: <strong>${nombres(productoSinTurista)}</strong>.
    Ahí es donde el calendario deja de ser una rejilla y se convierte en una decisión:
    ¿se comunica cuando está la gente o cuando está el producto?`;

  return {
    html: `<svg class="season" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Dos curvas superpuestas: estacionalidad turística y estacionalidad de producción del producto">
      ${marcas}
      ${area(tur, "#0ae4c3", ".22")}
      ${area(prod, "#ffffff", ".16")}
      <line x1="${pad}" y1="${pad + alto}" x2="${W - pad}" y2="${pad + alto}" stroke="#ffffff" stroke-opacity=".35"/>
      ${ejes}
      <text class="s-lab" x="${pad}" y="${pad - 14}" fill="#0ae4c3">Cuándo viaja el turista</text>
      <text class="s-lab" x="${W - pad}" y="${pad - 14}" text-anchor="end" fill="#ffffff">Cuándo hay producto</text>
    </svg>
    <div class="season-leyenda">
      <span><i style="background:#0ae4c3"></i>Estacionalidad turística</span>
      <span><i style="background:#ffffff"></i>Estacionalidad de producción</span>
      <span><i style="background:transparent;border:2px dashed #ffb02e"></i>Turista sin cosecha</span>
    </div>`,
    pie,
  };
}

/* ------------------------------------------------ Validación estructural */
function checksHtml() {
  const mesesCubiertos = new Set(estado.piezas.map((p) => p.mes)).size;
  const platCubiertas = new Set(estado.piezas.map((p) => p.plataforma)).size;
  const conFase = estado.piezas.filter((p) => p.fase).length;
  const briefsCompletos = estado.briefs.filter((b) => CAMPOS_BRIEF.every((c) => b[c.id].trim())).length;

  const items = [
    { ok: estado.plataformas.length >= 3, txt: `Al menos tres plataformas elegidas (ahora: ${estado.plataformas.length}).` },
    { ok: estado.piezas.length >= 12, txt: `Al menos doce piezas en el calendario (ahora: ${estado.piezas.length}).` },
    { ok: mesesCubiertos >= 9, txt: `Al menos nueve meses con alguna pieza (ahora: ${mesesCubiertos} de 12).` },
    { ok: platCubiertas >= 2, txt: `Piezas en al menos dos plataformas distintas (ahora: ${platCubiertas}).` },
    { ok: estado.piezas.length > 0 && conFase === estado.piezas.length, txt: `Todas las piezas con fase del funnel (ahora: ${conFase} de ${estado.piezas.length}).` },
    { ok: briefsCompletos === 5, txt: `Los cinco briefs de creatividad completos (ahora: ${briefsCompletos} de 5).` },
  ];
  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const p = productoActual();
  const l = ["# Calendario anual, cronograma y creatividades", "", `_Caso: ${CASO.meta.caso}_`,
    `_Producto: ${p.nombre} (${p.figura}) · ventana de consumo: ${p.ventanaConsumo}_`, ""];

  l.push("## Calendario anual de contenidos", "");
  l.push(`| Plataforma | ${MESES.join(" | ")} |`, `|---|${MESES.map(() => "---").join("|")}|`);
  estado.plataformas.forEach((plat) => {
    const cols = MESES.map((_, i) => {
      const piezas = estado.piezas.filter((x) => x.plataforma === plat && x.mes === i);
      return piezas.length ? piezas.map((x) => x.titulo || "(sin título)").join("<br>") : "";
    });
    l.push(`| **${plat}** | ${cols.join(" | ")} |`);
  });

  l.push("", "## Cronograma detallado", "");
  if (!estado.piezas.length) l.push("_(sin piezas)_");
  else {
    l.push("| Mes | Plataforma | Pieza | Tipo | Cluster | Fase |", "|---|---|---|---|---|---|");
    estado.piezas.slice().sort((a, b) => a.mes - b.mes).forEach((x) => {
      l.push(`| ${MESES_LARGO[x.mes]} | ${x.plataforma} | ${x.titulo || "(sin título)"} | ${x.tipo || "—"} | ${x.cluster || "—"} | ${x.fase ? x.fase.toUpperCase() : "—"} |`);
    });
  }

  l.push("", "## Las 5 creatividades", "");
  estado.briefs.forEach((b, i) => {
    l.push(`### Creatividad ${i + 1}`, "");
    CAMPOS_BRIEF.forEach((c) => l.push(`- **${c.label}:** ${b[c.id].trim() || "_(sin completar)_"}`));
    l.push("");
  });

  l.push("---", "", `_Estacionalidad de producción: dataset del caso. Estacionalidad turística: ${CASO.turismo.estacionalidadTuristica.fuente}._`);
  return l.join("\n");
}

/* -------------------------------------------------------------- Prompts */
function promptCalendario() {
  const p = productoActual();
  const filas = estado.piezas
    .slice().sort((a, b) => a.mes - b.mes)
    .map((x) => `- ${MESES_LARGO[x.mes]} · ${x.plataforma}: ${x.titulo || "(sin título)"} [${x.fase || "sin fase"}]`)
    .join("\n");
  const tur = CASO.turismo.estacionalidadTuristica.indice;

  return `Estoy construyendo el calendario anual de contenidos de ${p.nombre} (${p.figura}), dirigido a turistas extranjeros que lo prueban en España y deberían recomprarlo desde su país.

Estacionalidad de producción por mes (0-100): ${p.estacionalidadProduccion.join(", ")}.
Estacionalidad turística por mes (0-100): ${tur.join(", ")}.
Ventana de consumo del producto: ${p.ventanaConsumo}.
Restricciones de envío: ${p.restriccionesEnvio}

Mi calendario actual:

${filas || "(vacío)"}

Haz tres cosas:
1. Señala los meses en los que hay turista pero no hay producto, y propón qué comunicar exactamente en ellos.
2. Señala los meses con producto y sin turista, y di a quién habría que hablarle entonces.
3. Dime qué mes de mi calendario está sobrecargado y cuál está vacío sin motivo.

Trabaja sobre mi calendario: no lo reescribas entero.`;
}

function promptBrief(bid) {
  const b = estado.briefs.find((x) => x.id === bid);
  const p = productoActual();
  const campos = CAMPOS_BRIEF.map((c) => `- ${c.label}: ${b[c.id].trim() || "(sin completar)"}`).join("\n");
  return `Necesito producir una pieza creativa para ${p.nombre} (${p.figura}), dentro de un plan que busca que los turistas extranjeros que lo prueban en España lo recompren al volver a su país.

Este es el brief:

${campos}

Haz tres cosas:
1. Escribe tres versiones del copy de la pieza, ajustadas al formato y a las especificaciones que indico.
2. Describe la imagen o el vídeo: qué se ve, en qué orden y cuánto dura cada plano.
3. Dime qué falta en mi brief para que un diseñador pudiera producirla sin preguntarme nada.

No cambies el formato ni la plataforma: son fijos.`;
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Calendario", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M3", href: "/decks/m3.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Calendario anual y creatividades</h1>
        <p class="lead">Colocad las piezas de contenido sobre los doce meses y ved cómo encajan —o no—
        con la estacionalidad de vuestro producto y con la del viaje.</p>
        <span class="fuente">${escapeHtml(CASO.turismo.estacionalidadTuristica.fuente)} · estacionalidad de producción del dataset del caso</span>
      </div>

      <div class="tool-part" id="calendario">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Calendario anual</h2></div>
          <span class="score" data-score-cal></span>
        </div>

        <div class="cal-config">
          <div class="field">
            <label for="producto">Producto del equipo</label>
            <select id="producto" data-producto>
              ${CASO.productos.map((p) => `<option value="${p.id}"${p.id === estado.producto ? " selected" : ""}>${escapeHtml(p.nombre)} · ${p.figura}</option>`).join("")}
            </select>
            <span class="field__help" data-producto-info></span>
          </div>
          <div class="field">
            <span class="field__label">Plataformas del cronograma</span>
            <div class="plataformas" data-plataformas></div>
            <div class="plat-nueva" style="margin-top:var(--sp-2)">
              <input type="text" data-plat-nueva placeholder="Añadir otra plataforma" aria-label="Nueva plataforma" />
              <button class="btn btn--secondary btn--sm" type="button" data-plat-add>Añadir</button>
            </div>
          </div>
        </div>

        <div class="scroll-x" style="margin-top:var(--sp-5)"><div data-grid></div></div>
        <div class="cal-leyenda">
          <span><i style="background:rgba(0,71,233,.35)"></i>Estacionalidad del producto (fondo)</span>
          <span><i style="background:rgba(10,228,195,.6)"></i>Estacionalidad turística (fondo)</span>
          <span><i style="background:var(--c-tofu)"></i>TOFU</span>
          <span><i style="background:var(--c-mofu)"></i>MOFU</span>
          <span><i style="background:var(--c-bofu)"></i>BOFU</span>
        </div>

        <div class="pieza-editor" data-editor hidden>
          <h3 data-editor-titulo>Nueva pieza</h3>
          <div class="fields fields--2">
            <div class="field">
              <label for="pz-titulo">Título de la pieza</label>
              <input id="pz-titulo" type="text" data-pz="titulo" placeholder="Guía: la ruta del aceite en Córdoba" />
            </div>
            <div class="field">
              <label for="pz-tipo">Tipo de contenido</label>
              <input id="pz-tipo" type="text" data-pz="tipo" placeholder="Post, reel, newsletter, vídeo, PDF…" />
            </div>
            <div class="field">
              <label for="pz-cluster">Cluster de keywords asociado</label>
              <input id="pz-cluster" type="text" data-pz="cluster" placeholder="El mismo nombre que usasteis en la tool de keywords" />
            </div>
            <div class="field">
              <label for="pz-fase">Fase del funnel</label>
              <select id="pz-fase" data-pz="fase">
                ${FASES.map((f) => `<option value="${f}">${f ? f.toUpperCase() : "— sin fase"}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="row" style="margin-top:var(--sp-4)">
            <button class="btn btn--primary btn--sm" type="button" data-pz-guardar>Añadir al calendario</button>
            <button class="btn btn--ghost btn--sm" type="button" data-pz-cerrar>Cancelar</button>
          </div>
        </div>

        <h3 style="margin-top:var(--sp-6)">Cronograma</h3>
        <div class="piezas-lista" data-piezas></div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="cal">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="cal" hidden>
            <p>Preguntas que ayudan a leer el calendario:</p>
            <ul>
              <li>Mirad los meses donde la banda turquesa es alta y la azul baja: ahí hay gente y no hay producto.</li>
              <li>Y al revés: si hay cosecha y no hay turista, ¿a quién le habláis ese mes?</li>
              <li>Una plataforma con piezas solo en dos meses no es un canal: es una campaña.</li>
              <li>Si todas vuestras piezas son BOFU, el calendario está vendiendo doce meses seguidos.</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "calendario", label: "Copiar prompt: revisar mi calendario", hint: "Copia tu calendario y las dos estacionalidades, y pide qué comunicar en los meses de tensión." })}
        </div>
      </div>

      <div class="tool-part" id="briefs">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Las 5 creatividades</h2></div>
          <span class="score" data-score-briefs></span>
        </div>
        <p class="muted" style="max-width:74ch">El caso pide «ejemplos de 5 creatividades finales, ya sean en
        redes sociales, Adwords, banners o cualquier otro formato online». Estos son sus briefs.</p>
        <div class="briefs" data-briefs style="margin-top:var(--sp-5)"></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Cuándo viaja. Cuándo hay producto.",
    entradilla: "Las dos estacionalidades, superpuestas. Los meses marcados son aquellos en los que el turista está aquí y la cosecha no.",
    html: `<p class="reveal-moment__empty">Elige un producto y las dos curvas aparecerán aquí.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Y ahora, a defenderlo: <a href="/tools/pitch.html">sala de pitch</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarGrid() { app.querySelector("[data-grid]").innerHTML = gridHtml(); }
function pintarPlataformas() { app.querySelector("[data-plataformas]").innerHTML = plataformasHtml(); }
function pintarPiezas() { app.querySelector("[data-piezas]").innerHTML = piezasListaHtml(); }
function pintarBriefs() { app.querySelector("[data-briefs]").innerHTML = estado.briefs.map(briefHtml).join(""); }
function pintarChecks() { app.querySelector("[data-checks]").innerHTML = checksHtml(); }
function pintarInfoProducto() {
  const p = productoActual();
  app.querySelector("[data-producto-info]").textContent =
    `${p.ventanaConsumo} · ${p.temperaturaTransporte}. ${p.restriccionesEnvio}`;
}
function pintarScores() {
  const c = app.querySelector("[data-score-cal]");
  c.innerHTML = `${estado.piezas.length} <small>piezas en ${new Set(estado.piezas.map((p) => p.mes)).size} meses</small>`;
  c.dataset.ok = estado.piezas.length >= 12 ? "si" : "no";

  const completos = estado.briefs.filter((b) => CAMPOS_BRIEF.every((x) => b[x.id].trim())).length;
  const b = app.querySelector("[data-score-briefs]");
  b.innerHTML = `${completos}/5 <small>briefs completos</small>`;
  b.dataset.ok = completos === 5 ? "si" : "no";
}
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}
function refrescar() {
  pintarGrid(); pintarPiezas(); pintarChecks(); pintarScores(); pintarPayoff();
}

/* --------------------------------------------------------- Editor de pieza */
let celdaActiva = null;

function abrirEditor(plat, mes) {
  celdaActiva = { plat, mes };
  const ed = app.querySelector("[data-editor]");
  ed.hidden = false;
  app.querySelector("[data-editor-titulo]").textContent = `Nueva pieza · ${plat} · ${MESES_LARGO[mes]}`;
  ed.querySelectorAll("[data-pz]").forEach((el) => { el.value = ""; });
  ed.scrollIntoView({ behavior: "smooth", block: "nearest" });
  app.querySelector('[data-pz="titulo"]').focus();
}
function cerrarEditor() {
  celdaActiva = null;
  app.querySelector("[data-editor]").hidden = true;
}

/* ----------------------------------------------------------- Eventos */
app.addEventListener("click", (e) => {
  /* --- Celda del calendario --- */
  const celda = e.target.closest("[data-celda]");
  if (celda) { abrirEditor(celda.dataset.plat, Number(celda.dataset.mes)); return; }

  /* --- Guardar / cancelar pieza --- */
  if (e.target.closest("[data-pz-guardar]") && celdaActiva) {
    const val = (c) => app.querySelector(`[data-pz="${c}"]`).value.trim();
    estado.piezas.push({
      id: `pz${Date.now()}`,
      plataforma: celdaActiva.plat, mes: celdaActiva.mes,
      titulo: val("titulo"), tipo: val("tipo"), cluster: val("cluster"),
      fase: app.querySelector('[data-pz="fase"]').value,
    });
    cerrarEditor();
    refrescar();
    return;
  }
  if (e.target.closest("[data-pz-cerrar]")) { cerrarEditor(); return; }

  const borrar = e.target.closest("[data-borrar-pieza]")?.dataset.borrarPieza;
  if (borrar) { estado.piezas = estado.piezas.filter((p) => p.id !== borrar); refrescar(); return; }

  /* --- Plataformas --- */
  const toggle = e.target.closest("[data-plat-toggle]")?.dataset.platToggle;
  if (toggle) {
    const i = estado.plataformas.indexOf(toggle);
    if (i >= 0) {
      estado.plataformas.splice(i, 1);
      // Las piezas de una plataforma retirada dejan de tener sitio: se eliminan.
      estado.piezas = estado.piezas.filter((p) => p.plataforma !== toggle);
    } else estado.plataformas.push(toggle);
    pintarPlataformas(); refrescar();
    return;
  }
  if (e.target.closest("[data-plat-add]")) {
    const input = app.querySelector("[data-plat-nueva]");
    const v = input.value.trim();
    if (v && !estado.plataformas.includes(v)) { estado.plataformas.push(v); input.value = ""; pintarPlataformas(); refrescar(); }
    return;
  }

  /* --- Pista --- */
  const btn = e.target.closest("[data-pista]");
  if (btn) {
    const txt = app.querySelector(`[data-pista-texto="${btn.dataset.pista}"]`);
    txt.hidden = !txt.hidden;
    btn.textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
  }
});

/* Teclado sobre las celdas del calendario. */
app.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const celda = e.target.closest("[data-celda]");
  if (celda) { e.preventDefault(); abrirEditor(celda.dataset.plat, Number(celda.dataset.mes)); }
});

app.addEventListener("change", (e) => {
  if (e.target.dataset.producto !== undefined) {
    estado.producto = e.target.value;
    pintarInfoProducto();
    refrescar();
  }
});

app.addEventListener("input", (e) => {
  const bid = e.target.dataset.brief;
  if (!bid) return;
  const b = estado.briefs.find((x) => x.id === bid);
  b[e.target.dataset.campo] = e.target.value;
  // Actualiza solo el contador de la ficha, sin repintar (no perder el foco).
  const art = e.target.closest(".brief");
  const rellenos = CAMPOS_BRIEF.filter((c) => b[c.id].trim()).length;
  const cont = art.querySelector(".brief__completo");
  cont.textContent = `${rellenos}/${CAMPOS_BRIEF.length}`;
  cont.dataset.ok = rellenos === CAMPOS_BRIEF.length ? "si" : "no";
  pintarChecks(); pintarScores();
});

/* ------------------------------------------------------ AskAI + StatePanel */
wireAskAI(app, {
  calendario: promptCalendario,
  ...Object.fromEntries(estado.briefs.map((b) => [`brief-${b.id}`, () => promptBrief(b.id)])),
});

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "calendario",
  nombreArchivo: "calendario-y-creatividades",
  getState: () => structuredClone(estado),
  setState: (nuevo) => {
    if (nuevo.producto && CASO.productos.some((p) => p.id === nuevo.producto)) estado.producto = nuevo.producto;
    if (Array.isArray(nuevo.plataformas) && nuevo.plataformas.length) estado.plataformas = [...nuevo.plataformas];
    if (Array.isArray(nuevo.piezas)) estado.piezas = nuevo.piezas.map((p, i) => ({ ...p, id: p.id || `pz-imp${i}` }));
    if (Array.isArray(nuevo.briefs)) {
      estado.briefs = estado.briefs.map((b, i) => ({ ...b, ...(nuevo.briefs[i] || {}), id: b.id }));
    }
    app.querySelector("[data-producto]").value = estado.producto;
    pintarInfoProducto(); pintarPlataformas(); pintarBriefs(); refrescar();
  },
  toMarkdown,
});

/* ------------------------------------------------------------ Arranque */
pintarPlataformas();
pintarBriefs();
pintarInfoProducto();
refrescar();
