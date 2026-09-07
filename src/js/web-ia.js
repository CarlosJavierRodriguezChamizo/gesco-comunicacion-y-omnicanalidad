/* =========================================================================
   web-ia.js — (a) Árbol de contenidos del sitio: secciones y páginas, cada
                   una con su cluster de keywords y su fase del funnel.
               (b) Brief completo para construirlo con una IA.

   Payoff: el árbol dibujándose como diagrama, con las páginas sin cluster
   marcadas y el recuento de requisitos del Anexo 1 que quedan por cubrir.

   La validación es ESTRUCTURAL: detecta qué tipos de página faltan según el
   Anexo 1 del caso, nunca si una página concreta está "bien pensada".
   Ninguna llamada a API: el botón de IA solo copia el brief al portapapeles.
   ========================================================================= */
import {
  Header, Section, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml, appUrl,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

/* ----------------------------------------------------------- Constantes */

/** Tipos de página. Los marcados `anexo` son requisitos explícitos del Anexo 1. */
const TIPOS = [
  { id: "", label: "— sin tipo" },
  { id: "home", label: "Home" },
  { id: "categoria", label: "Categoría / catálogo" },
  { id: "producto", label: "Ficha de producto" },
  { id: "contenido", label: "Contenido / blog" },
  { id: "formulario", label: "Formulario" },
  { id: "cliente", label: "Área de cliente" },
  { id: "carrito", label: "Carrito / checkout" },
  { id: "legal", label: "Legal / RGPD" },
  { id: "marca", label: "Marca / historia" },
];

const FASES = [
  { id: "", label: "— sin fase" },
  { id: "tofu", label: "TOFU" },
  { id: "mofu", label: "MOFU" },
  { id: "bofu", label: "BOFU" },
];

/** Requisitos del Anexo 1 que se pueden comprobar mirando el árbol. */
const ANEXO = [
  { id: "home", tipos: ["home"], min: 1, txt: "Home y menú principal (nivel visual inicial del catálogo)." },
  { id: "categoria", tipos: ["categoria"], min: 1, txt: "Página de categoría o catálogo." },
  { id: "producto", tipos: ["producto"], min: 3, txt: "Ficha de producto completa, con al menos tres productos desarrollados." },
  { id: "formulario", tipos: ["formulario"], min: 1, txt: "Formularios web, con campos obligatorios y opcionales." },
  { id: "cliente", tipos: ["cliente"], min: 1, txt: "Área privada de cliente tras el login." },
  { id: "carrito", tipos: ["carrito"], min: 1, txt: "Carrito de compra y proceso de checkout y pago." },
  { id: "contenido", tipos: ["contenido", "marca"], min: 2, txt: "Contenido editorial que trabaje los clusters (blog, historia, recetas…)." },
  { id: "legal", tipos: ["legal"], min: 1, txt: "Página legal: privacidad, condiciones y consentimiento." },
];

const COLOR_FASE = { tofu: "#0ae4c3", mofu: "#b79bff", bofu: "#ffffff", "": "rgba(255,255,255,.28)" };

/** Plataformas de destino habituales. El alumno puede escribir otra. */
const PLATAFORMAS = ["Wix", "WordPress", "Shopify", "Webflow", "v0", "Lovable", "Otra (escríbela)"];

/* -------------------------------------------------------------- Estado */
const estado = {
  producto: CASO.meta.ejeDemo.producto,
  mercado: CASO.meta.ejeDemo.mercado,
  secciones: [
    { id: "s1", nombre: "Producto", paginas: [
      { id: "p1", nombre: "Catálogo", tipo: "categoria", cluster: "", fase: "bofu" },
    ] },
    { id: "s2", nombre: "Historia", paginas: [] },
  ],
  brief: {
    plataforma: "",
    idiomas: "",
    territorio: "",
    restricciones: "",
    aceptacion: "",
  },
};

let contador = 100;
const nuevoId = (p) => `${p}${++contador}`;

const productoActual = () => CASO.productos.find((p) => p.id === estado.producto) || CASO.productos[0];
const todasLasPaginas = () => estado.secciones.flatMap((s) => s.paginas.map((p) => ({ ...p, seccion: s.nombre })));
const clustersUsados = () => [...new Set(todasLasPaginas().map((p) => p.cluster.trim()).filter(Boolean))].sort();

/* ------------------------------------------------------------- Render */

function paginaHtml(p, sid) {
  const opt = (lista, v) =>
    lista.map((o) => `<option value="${o.id}"${o.id === v ? " selected" : ""}>${escapeHtml(o.label)}</option>`).join("");
  return `<div class="pagina">
    <input type="text" value="${escapeHtml(p.nombre)}" data-pg="${p.id}" data-sec="${sid}" data-campo="nombre"
      placeholder="Nombre de la página" aria-label="Nombre de la página" />
    <select data-pg="${p.id}" data-sec="${sid}" data-campo="tipo" aria-label="Tipo de página">${opt(TIPOS, p.tipo)}</select>
    <input type="text" value="${escapeHtml(p.cluster)}" data-pg="${p.id}" data-sec="${sid}" data-campo="cluster"
      list="clusters-web" placeholder="Cluster de keywords" aria-label="Cluster de keywords" />
    <select data-pg="${p.id}" data-sec="${sid}" data-campo="fase" aria-label="Fase del funnel">${opt(FASES, p.fase)}</select>
    <button type="button" data-borrar-pg="${p.id}" data-sec="${sid}" aria-label="Eliminar la página ${escapeHtml(p.nombre)}">×</button>
  </div>`;
}

function seccionHtml(s) {
  return `<div class="seccion">
    <div class="seccion__head">
      <input class="seccion__nombre" type="text" value="${escapeHtml(s.nombre)}" data-sec-nombre="${s.id}"
        placeholder="Sección del menú" aria-label="Nombre de la sección" />
      <span class="seccion__n">${s.paginas.length} ${s.paginas.length === 1 ? "página" : "páginas"}</span>
      <div class="seccion__acciones">
        <button class="btn btn--secondary btn--sm" type="button" data-add-pg="${s.id}">+ Página</button>
        <button class="btn btn--ghost btn--sm" type="button" data-borrar-sec="${s.id}">Eliminar</button>
      </div>
    </div>
    <div class="paginas">
      ${s.paginas.length ? s.paginas.map((p) => paginaHtml(p, s.id)).join("")
        : `<p class="pagina__vacia">Sección sin páginas. Una rama del menú que no lleva a ningún sitio.</p>`}
    </div>
  </div>`;
}

function arbolHtml() {
  return `<datalist id="clusters-web">${clustersUsados().map((c) => `<option value="${escapeHtml(c)}"></option>`).join("")}</datalist>
    ${estado.secciones.map(seccionHtml).join("")}`;
}

/* ------------------------------------------------- Cobertura del Anexo 1 */

function coberturaAnexo() {
  const pags = todasLasPaginas();
  return ANEXO.map((r) => {
    const encontradas = pags.filter((p) => r.tipos.includes(p.tipo));
    return { ...r, n: encontradas.length, ok: encontradas.length >= r.min, donde: encontradas.map((p) => p.nombre || "(sin nombre)") };
  });
}

function anexoHtml() {
  return coberturaAnexo()
    .map(
      (r) => `<div class="anexo-item" data-ok="${r.ok ? "si" : "no"}">
        <span class="anexo-item__marca" aria-hidden="true">${r.ok ? "●" : "○"}</span>
        <span class="anexo-item__txt">${escapeHtml(r.txt)}</span>
        <span class="anexo-item__donde">${r.ok ? `${r.n}/${r.min}` : `${r.n} de ${r.min}`}</span>
      </div>`
    )
    .join("");
}

/* --------------------------------------------------- Payoff (RevealMoment) */

function payoffHtml() {
  const secciones = estado.secciones.filter((s) => s.nombre.trim() || s.paginas.length);
  if (!secciones.length) {
    return { html: `<p class="reveal-moment__empty">Añade secciones y páginas: el árbol se dibuja solo.</p>`, pie: "" };
  }

  const anchoSec = 190, huecoSec = 26, altoPag = 34, huecoPag = 8;
  const W = Math.max(760, secciones.length * (anchoSec + huecoSec));
  const maxPags = Math.max(1, ...secciones.map((s) => s.paginas.length));
  const H = 150 + maxPags * (altoPag + huecoPag) + 30;
  const cx = W / 2;

  const cajas = secciones
    .map((s, i) => {
      const x = i * (anchoSec + huecoSec) + huecoSec / 2;
      const ySec = 108;
      const conexion = `<path d="M${cx} 68 V88 M${x + anchoSec / 2} 88 V${ySec}" stroke="rgba(255,255,255,.45)" stroke-width="2" fill="none"/>`;
      const pags = s.paginas
        .map((p, j) => {
          const y = ySec + 58 + j * (altoPag + huecoPag);
          const color = COLOR_FASE[p.fase] ?? COLOR_FASE[""];
          const txt = p.fase === "tofu" || p.fase === "bofu" ? "#00133f" : "#ffffff";
          const sinCluster = !p.cluster.trim();
          const nombre = (p.nombre || "(sin nombre)").slice(0, 22);
          return `<g>
            <rect x="${x + 14}" y="${y}" width="${anchoSec - 28}" height="${altoPag}" rx="7"
              fill="${color}" ${sinCluster ? 'stroke="#ffb02e" stroke-width="2" stroke-dasharray="4 3"' : ""}>
              <title>${escapeHtml(p.nombre || "(sin nombre)")} — ${p.fase ? p.fase.toUpperCase() : "sin fase"}${sinCluster ? " — SIN CLUSTER" : ` — ${escapeHtml(p.cluster)}`}</title>
            </rect>
            <text x="${x + anchoSec / 2}" y="${y + 22}" text-anchor="middle" font-size="13" fill="${txt}">${escapeHtml(nombre)}</text>
          </g>`;
        })
        .join("");

      return `${conexion}
        <rect x="${x}" y="${ySec}" width="${anchoSec}" height="44" rx="10" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.45)"/>
        <text class="nodo-t" x="${x + anchoSec / 2}" y="${ySec + 29}" text-anchor="middle" font-size="17" fill="#fff">${escapeHtml((s.nombre || "(sin nombre)").slice(0, 18))}</text>
        ${pags}`;
    })
    .join("");

  const home = `<rect x="${cx - 80}" y="24" width="160" height="44" rx="10" fill="#c01d6a"/>
    <text class="nodo-t" x="${cx}" y="53" text-anchor="middle" font-size="19" fill="#fff">Home</text>`;

  const pags = todasLasPaginas();
  const sinCluster = pags.filter((p) => !p.cluster.trim()).length;
  const cobertura = coberturaAnexo();
  const cubiertos = cobertura.filter((r) => r.ok).length;
  const faltan = cobertura.filter((r) => !r.ok);

  const pie = `<strong>${secciones.length} ${secciones.length === 1 ? "sección" : "secciones"}</strong> y <strong>${pags.length} ${pags.length === 1 ? "página" : "páginas"}</strong>.
    ${sinCluster ? `<strong>${sinCluster}</strong> sin cluster asociado (${sinCluster === 1 ? "marcada" : "marcadas"} en ámbar): ${sinCluster === 1 ? "una página que no responde" : "páginas que no responden"} a ninguna búsqueda.` : "Todas las páginas tienen su cluster."}
    Del Anexo 1 tenéis <strong>${cubiertos} de ${cobertura.length}</strong> requisitos cubiertos${
      faltan.length ? `; falta: ${faltan.map((r) => r.txt.split(":")[0].split("(")[0].trim().replace(/\.$/, "")).join("; ")}.` : "."
    }`;

  return {
    html: `<div class="scroll-x"><svg class="arbol-svg" viewBox="0 0 ${W} ${H}" style="min-width:${Math.min(W, 900)}px"
        role="img" aria-label="Árbol de contenidos con ${secciones.length} secciones y ${pags.length} páginas">
        ${home}${cajas}
      </svg></div>
      <div class="arbol-leyenda">
        ${["tofu", "mofu", "bofu"].map((f) => `<span><i style="background:${COLOR_FASE[f]}"></i>${f.toUpperCase()}</span>`).join("")}
        <span><i style="background:${COLOR_FASE[""]}"></i>Sin fase</span>
        <span><i style="background:transparent;border:2px dashed #ffb02e"></i>Sin cluster</span>
      </div>`,
    pie,
  };
}

/* ------------------------------------------------ Validación estructural */
function checksHtml() {
  const pags = todasLasPaginas();
  const cobertura = coberturaAnexo();
  const conCluster = pags.filter((p) => p.cluster.trim()).length;
  const fases = new Set(pags.map((p) => p.fase).filter(Boolean));
  const b = estado.brief;

  const items = [
    { ok: estado.secciones.length >= 3, txt: `Al menos tres secciones en el menú (ahora: ${estado.secciones.length}).` },
    { ok: pags.length >= 8, txt: `Al menos ocho páginas en el árbol (ahora: ${pags.length}).` },
    { ok: pags.length > 0 && conCluster === pags.length, txt: `Todas las páginas con un cluster asociado (ahora: ${conCluster} de ${pags.length}).` },
    { ok: fases.size >= 3, txt: `Las tres fases del funnel representadas (ahora: ${fases.size ? [...fases].map((f) => f.toUpperCase()).join(", ") : "ninguna"}).` },
    { ok: cobertura.every((r) => r.ok), txt: `Los ${cobertura.length} requisitos del Anexo 1 cubiertos (ahora: ${cobertura.filter((r) => r.ok).length}).` },
    { ok: !!b.territorio.trim() && !!b.restricciones.trim(), txt: "Brief con territorio de marca y restricciones escritos." },
    { ok: !!b.aceptacion.trim(), txt: "Criterio de aceptación definido: qué tiene que existir para dar la web por buena." },
  ];
  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------------- Brief */

function textoBrief() {
  const p = productoActual();
  const b = estado.brief;
  const l = [];

  l.push(`Actúa como desarrollador y redactor web. Construye el sitio de una marca de ${p.nombre} (${p.figura}, ${p.provincia}).`);
  l.push("");
  l.push("## Contexto");
  l.push(`- Producto: ${p.nombre} — ${p.categoria}, figura de calidad ${p.figura}.`);
  l.push(`- Relato del producto: ${p.relato}`);
  l.push(`- Mercado objetivo: turistas de ${estado.mercado} que probaron el producto durante sus vacaciones en España y vuelven a su país.`);
  l.push(`- Objetivo del sitio: que compren desde su país lo que probaron aquí, y captar leads de quienes todavía no compran.`);
  l.push(`- Ventana de consumo: ${p.ventanaConsumo}.`);
  l.push(`- Conservación y transporte: ${p.temperaturaTransporte}.`);
  l.push(`- Restricciones de envío: ${p.restriccionesEnvio}`);
  l.push(`- Precio medio de referencia: ${p.precioMedio} ${p.unidadPrecio}.`);
  if (b.territorio.trim()) l.push(`- Territorio y tono de marca: ${b.territorio.trim()}`);
  if (b.idiomas.trim()) l.push(`- Idiomas del sitio: ${b.idiomas.trim()}`);
  l.push("");

  l.push("## Árbol de contenidos (respétalo, no lo reordenes)");
  estado.secciones.forEach((s) => {
    l.push(`- **${s.nombre || "(sección sin nombre)"}**`);
    if (!s.paginas.length) l.push("  - (sin páginas)");
    s.paginas.forEach((pg) => {
      const tipo = TIPOS.find((t) => t.id === pg.tipo)?.label || "sin tipo";
      l.push(`  - ${pg.nombre || "(sin nombre)"} — tipo: ${tipo} — cluster: ${pg.cluster || "sin asignar"} — fase: ${pg.fase ? pg.fase.toUpperCase() : "sin asignar"}`);
    });
  });
  l.push("");

  if (b.restricciones.trim()) {
    l.push("## Restricciones");
    l.push(b.restricciones.trim());
    l.push("");
  }

  l.push("## Qué quiero que hagas");
  l.push("1. Escribe el contenido de cada página del árbol: titular, subtítulo y cuerpo, en el tono indicado y en los idiomas pedidos.");
  l.push("2. En la ficha de producto, incluye descripción, formatos, precio, conservación y una respuesta visible arriba a «¿envías a mi país, en cuánto tiempo y por cuánto?».");
  l.push("3. Define los campos de cada formulario, separando obligatorios y opcionales, con la casilla de consentimiento SIN premarcar (RGPD).");
  l.push("4. Para cada imagen o vídeo que propongas, escribe su descriptivo de texto: sin él no posiciona.");
  l.push("5. Señala qué información te falta y qué has tenido que suponer.");
  l.push("");

  l.push("## Criterio de aceptación");
  l.push(b.aceptacion.trim() || "(sin definir — defínelo antes de pedirlo, o cualquier resultado parecerá bueno)");
  l.push("");

  const faltan = coberturaAnexo().filter((r) => !r.ok);
  if (faltan.length) {
    l.push("## Aviso");
    l.push(`Mi árbol todavía no cubre estos requisitos: ${faltan.map((r) => r.txt).join(" ")} Dime en qué sección encajarían.`);
    l.push("");
  }

  l.push("## Importante");
  l.push("No inventes cifras de mercado, certificaciones, premios ni reseñas. Si necesitas un dato que no te he dado, márcalo como pendiente en lugar de rellenarlo.");
  if (b.plataforma.trim()) l.push(`Entrega el resultado listo para montarlo en ${b.plataforma.trim()}.`);

  return l.join("\n");
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const p = productoActual();
  const l = ["# El sitio web: árbol de contenidos y brief", "",
    `_Caso: ${CASO.meta.caso}_`,
    `_Producto: ${p.nombre} (${p.figura}) · mercado: ${estado.mercado}_`, ""];

  l.push("## Árbol de contenidos", "", "| Sección | Página | Tipo | Cluster | Fase |", "|---|---|---|---|---|");
  estado.secciones.forEach((s) => {
    if (!s.paginas.length) { l.push(`| **${s.nombre || "(sin nombre)"}** | _(sin páginas)_ | — | — | — |`); return; }
    s.paginas.forEach((pg, i) => {
      const tipo = TIPOS.find((t) => t.id === pg.tipo)?.label || "—";
      l.push(`| ${i === 0 ? `**${s.nombre || "(sin nombre)"}**` : ""} | ${pg.nombre || "(sin nombre)"} | ${tipo} | ${pg.cluster || "—"} | ${pg.fase ? pg.fase.toUpperCase() : "—"} |`);
    });
  });

  l.push("", "## Cobertura del Anexo 1", "");
  coberturaAnexo().forEach((r) => l.push(`- [${r.ok ? "x" : " "}] ${r.txt} (${r.n}/${r.min})`));

  const b = estado.brief;
  l.push("", "## Brief de construcción", "");
  l.push(`- **Plataforma de destino:** ${b.plataforma.trim() || "_(sin definir)_"}`);
  l.push(`- **Idiomas:** ${b.idiomas.trim() || "_(sin definir)_"}`);
  l.push(`- **Territorio y tono de marca:** ${b.territorio.trim() || "_(sin definir)_"}`);
  l.push(`- **Restricciones:** ${b.restricciones.trim() || "_(sin definir)_"}`);
  l.push(`- **Criterio de aceptación:** ${b.aceptacion.trim() || "_(sin definir)_"}`);

  l.push("", "---", "", "### Brief completo, tal y como se entrega a la IA", "", "```", textoBrief(), "```");
  return l.join("\n");
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Sitio web con IA", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M4", href: "/decks/m4.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>El sitio web, con IA</h1>
        <p class="lead">Dibujad el árbol de contenidos de la web que pide el Anexo 1 y componed el brief
        que una IA necesita para construirla. Vosotros decidís la arquitectura; ella ejecuta.</p>
        <span class="fuente">Requisitos del Anexo 1 del enunciado del caso</span>
      </div>

      <div class="tool-part" id="arbol">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Árbol de contenidos</h2></div>
          <span class="score" data-score-arbol></span>
        </div>

        <div class="fields fields--2" style="max-width:820px">
          <div class="field">
            <label for="producto">Producto del equipo</label>
            <select id="producto" data-producto>
              ${CASO.productos.map((p) => `<option value="${p.id}"${p.id === estado.producto ? " selected" : ""}>${escapeHtml(p.nombre)} · ${p.figura}</option>`).join("")}
            </select>
            <span class="field__help" data-producto-info></span>
          </div>
          <div class="field">
            <label for="mercado">Mercado de origen</label>
            <input id="mercado" type="text" data-mercado value="${escapeHtml(estado.mercado)}" placeholder="El país del turista" />
            <span class="field__help">El mismo que elegisteis para las buyer personas.</span>
          </div>
        </div>

        <p class="muted" style="max-width:74ch;margin-top:var(--sp-5)">Cada sección es una rama del menú principal.
        Cada página debe responder a un <strong>cluster</strong> —el mismo nombre que le pusisteis en la herramienta
        de keywords— y ocupar una <strong>fase del funnel</strong>. Si no cumple las dos cosas, sobra.</p>

        <div class="arbol" data-arbol style="margin-top:var(--sp-4)"></div>
        <button class="btn btn--primary" type="button" data-add-sec style="margin-top:var(--sp-4)">+ Añadir sección</button>

        <div class="tool-part" style="margin-top:var(--sp-6)">
          <h3>Cobertura del Anexo 1</h3>
          <p class="muted small" style="max-width:74ch">Los requisitos que el enunciado pide para la web.
          Se marcan solos según los tipos de página que vais creando.</p>
          <div class="anexo" data-anexo style="margin-top:var(--sp-3)"></div>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="arbol">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="arbol" hidden>
            <p><strong>No hay un árbol correcto.</strong> Lo que se evalúa es si la arquitectura se deduce
            de vuestro trabajo anterior. Preguntas que ayudan:</p>
            <ul>
              <li>Coged vuestros clusters de la herramienta de keywords: ¿aparecen todos en el menú?</li>
              <li>Si una página no tiene cluster, ¿por qué existe? ¿Qué búsqueda la encuentra?</li>
              <li>Si todo vuestro árbol es BOFU, la web solo sirve para quien ya quería comprar.</li>
              <li>Poneos en el sofá de vuestro turista: ¿en cuántos clics resuelve «¿me lo mandas a casa?»</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tool-part" id="brief">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>El brief para la IA</h2></div>
        </div>
        <p class="muted" style="max-width:74ch">Lo que la IA no puede saber por su cuenta. El árbol de arriba
        se añade solo: aquí va lo que decide un humano.</p>

        <div class="brief-web" style="margin-top:var(--sp-4)">
          <div class="field">
            <label for="b-plat">Plataforma de destino</label>
            <input id="b-plat" type="text" data-brief="plataforma" list="plataformas"
              value="${escapeHtml(estado.brief.plataforma)}" placeholder="Wix, WordPress, v0…" />
            <datalist id="plataformas">${PLATAFORMAS.map((p) => `<option value="${escapeHtml(p)}"></option>`).join("")}</datalist>
          </div>
          <div class="field">
            <label for="b-idiomas">Idiomas del sitio</label>
            <input id="b-idiomas" type="text" data-brief="idiomas"
              value="${escapeHtml(estado.brief.idiomas)}" placeholder="Español, alemán, inglés…" />
          </div>
          <div class="field field--ancho">
            <label for="b-territorio">Territorio y tono de marca</label>
            <textarea id="b-territorio" rows="2" data-brief="territorio"
              placeholder="De qué habla la marca cuando no habla del producto, y cómo suena.">${escapeHtml(estado.brief.territorio)}</textarea>
          </div>
          <div class="field field--ancho">
            <label for="b-restr">Restricciones</label>
            <textarea id="b-restr" rows="2" data-brief="restricciones"
              placeholder="Logística, conservación, aduanas, RGPD, lo que no se puede prometer…">${escapeHtml(estado.brief.restricciones)}</textarea>
          </div>
          <div class="field field--ancho">
            <label for="b-acept">Criterio de aceptación</label>
            <textarea id="b-acept" rows="2" data-brief="aceptacion"
              placeholder="¿Qué tiene que existir para dar la web por buena? Sin esto, cualquier resultado parece bueno.">${escapeHtml(estado.brief.aceptacion)}</textarea>
          </div>
        </div>

        <div class="row" style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "brief", label: "Copiar el brief completo para la IA", hint: "Se copia con vuestro árbol, vuestras restricciones y los datos del producto ya dentro." })}
        </div>

        <div class="brief-previo">
          <h3>Lo que se va a copiar</h3>
          <pre data-brief-previo></pre>
        </div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Vuestro sitio, de un vistazo",
    entradilla: "El árbol completo, con la fase de cada página y las que no responden a ninguna búsqueda marcadas en ámbar.",
    html: `<p class="reveal-moment__empty">Añade secciones y páginas: el árbol se dibuja solo.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Y mañana, a madurar el lead: <a href="${escapeHtml(appUrl("/tools/nurturing.html"))}">scoring y workflow</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarArbol() { app.querySelector("[data-arbol]").innerHTML = arbolHtml(); }
function pintarAnexo() { app.querySelector("[data-anexo]").innerHTML = anexoHtml(); }
function pintarChecks() { app.querySelector("[data-checks]").innerHTML = checksHtml(); }
function pintarPrevio() { app.querySelector("[data-brief-previo]").textContent = textoBrief(); }
function pintarScore() {
  const pags = todasLasPaginas().length;
  const cob = coberturaAnexo();
  const el = app.querySelector("[data-score-arbol]");
  el.innerHTML = `${cob.filter((r) => r.ok).length}/${cob.length} <small>del Anexo 1 · ${pags} ${pags === 1 ? "página" : "páginas"}</small>`;
  el.dataset.ok = cob.every((r) => r.ok) ? "si" : "no";
}
function pintarInfoProducto() {
  const p = productoActual();
  app.querySelector("[data-producto-info]").textContent = `${p.ventanaConsumo} · ${p.restriccionesEnvio}`;
}
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}
/** Todo lo derivado. `conArbol` en false evita repintar los inputs con foco. */
function refrescar({ conArbol = true } = {}) {
  if (conArbol) pintarArbol();
  pintarAnexo(); pintarChecks(); pintarScore(); pintarPrevio(); pintarPayoff();
}

/* ----------------------------------------------------------- Eventos */

app.addEventListener("click", (e) => {
  if (e.target.closest("[data-add-sec]")) {
    estado.secciones.push({ id: nuevoId("s"), nombre: "", paginas: [] });
    refrescar();
    return;
  }
  const addPg = e.target.closest("[data-add-pg]")?.dataset.addPg;
  if (addPg) {
    estado.secciones.find((s) => s.id === addPg).paginas.push({ id: nuevoId("p"), nombre: "", tipo: "", cluster: "", fase: "" });
    refrescar();
    return;
  }
  const borrarSec = e.target.closest("[data-borrar-sec]")?.dataset.borrarSec;
  if (borrarSec) {
    estado.secciones = estado.secciones.filter((s) => s.id !== borrarSec);
    refrescar();
    return;
  }
  const borrarPg = e.target.closest("[data-borrar-pg]");
  if (borrarPg) {
    const s = estado.secciones.find((x) => x.id === borrarPg.dataset.sec);
    s.paginas = s.paginas.filter((p) => p.id !== borrarPg.dataset.borrarPg);
    refrescar();
    return;
  }
  const pista = e.target.closest("[data-pista]");
  if (pista) {
    const txt = app.querySelector(`[data-pista-texto="${pista.dataset.pista}"]`);
    txt.hidden = !txt.hidden;
    pista.textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
  }
});

app.addEventListener("input", (e) => {
  const el = e.target;

  const secNombre = el.dataset.secNombre;
  if (secNombre) {
    estado.secciones.find((s) => s.id === secNombre).nombre = el.value;
    refrescar({ conArbol: false });
    return;
  }

  if (el.dataset.pg && el.dataset.campo !== "tipo" && el.dataset.campo !== "fase") {
    const s = estado.secciones.find((x) => x.id === el.dataset.sec);
    s.paginas.find((p) => p.id === el.dataset.pg)[el.dataset.campo] = el.value;
    refrescar({ conArbol: false });
    return;
  }

  const campoBrief = el.dataset.brief;
  if (campoBrief) { estado.brief[campoBrief] = el.value; pintarChecks(); pintarPrevio(); return; }

  if (el.dataset.mercado !== undefined) { estado.mercado = el.value; pintarPrevio(); }
});

app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.pg && (el.dataset.campo === "tipo" || el.dataset.campo === "fase")) {
    const s = estado.secciones.find((x) => x.id === el.dataset.sec);
    s.paginas.find((p) => p.id === el.dataset.pg)[el.dataset.campo] = el.value;
    refrescar({ conArbol: false });
    return;
  }
  if (el.dataset.producto !== undefined) {
    estado.producto = el.value;
    pintarInfoProducto();
    refrescar({ conArbol: false });
  }
});

/* ------------------------------------------------------ AskAI + StatePanel */
wireAskAI(app, { brief: textoBrief });

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "web-ia",
  nombreArchivo: "sitio-web",
  getState: () => structuredClone(estado),
  setState: (nuevo) => {
    if (nuevo.producto && CASO.productos.some((p) => p.id === nuevo.producto)) estado.producto = nuevo.producto;
    if (typeof nuevo.mercado === "string") estado.mercado = nuevo.mercado;
    if (Array.isArray(nuevo.secciones)) {
      estado.secciones = nuevo.secciones.map((s, i) => ({
        id: s.id || `s-imp${i}`,
        nombre: s.nombre || "",
        paginas: (s.paginas || []).map((p, j) => ({
          id: p.id || `p-imp${i}-${j}`,
          nombre: p.nombre || "", tipo: p.tipo || "", cluster: p.cluster || "", fase: p.fase || "",
        })),
      }));
    }
    if (nuevo.brief) Object.keys(estado.brief).forEach((k) => { estado.brief[k] = nuevo.brief[k] || ""; });

    app.querySelector("[data-producto]").value = estado.producto;
    app.querySelector("[data-mercado]").value = estado.mercado;
    app.querySelectorAll("[data-brief]").forEach((el) => { el.value = estado.brief[el.dataset.brief] || ""; });
    pintarInfoProducto();
    refrescar();
  },
  toMarkdown,
  ayuda: "El .md incluye el brief entero, listo para pegarlo en el Word o en la IA.",
});

/* ------------------------------------------------------------ Arranque */
pintarInfoProducto();
refrescar();
