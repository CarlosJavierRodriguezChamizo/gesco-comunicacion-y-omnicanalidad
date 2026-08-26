/* =========================================================================
   nurturing.js — (a) Lead scoring: criterios, pesos y 12 leads del caso.
                  (b) Constructor de workflow sobre los 90 días post-viaje.

   El sistema calcula, no juzga: los pesos los pone el alumno y la escala se
   recoloca sola. El payoff es el workflow dibujándose como esquema, y se
   puede descargar en SVG para pegarlo en el entregable.
   ========================================================================= */
import {
  Header, Section, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml, num, descargar,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

/* -------------------------------------------------------------- Datos */

/** Rasgos observables de un lead. Sin puntuación: la pone el alumno. */
const RASGOS = [
  { id: "aleman", label: "Viene de Alemania", cat: "perfil" },
  { id: "familia", label: "Viaja en familia", cat: "perfil" },
  { id: "repite", label: "Repite destino", cat: "perfil" },
  { id: "gourmet", label: "Interés gastronómico declarado", cat: "perfil" },
  { id: "descarga", label: "Se descargó el lead magnet", cat: "comportamiento" },
  { id: "abre", label: "Abre todos los emails", cat: "comportamiento" },
  { id: "clic", label: "Ha hecho clic en producto", cat: "comportamiento" },
  { id: "visita", label: "Ha vuelto a la web", cat: "comportamiento" },
  { id: "envio", label: "Ha mirado los gastos de envío", cat: "comportamiento" },
  { id: "almazara", label: "Vino de una visita a almazara", cat: "origen" },
  { id: "hotel", label: "Vino del QR del hotel", cat: "origen" },
  { id: "ads", label: "Vino de una campaña de pago", cat: "origen" },
];

/** 12 leads ficticios del caso. Cada uno es una combinación de rasgos. */
const LEADS = [
  { id: "l01", nombre: "Anke, 52", rasgos: ["aleman", "gourmet", "almazara", "descarga", "abre", "clic"] },
  { id: "l02", nombre: "Tomas, 34", rasgos: ["aleman", "hotel", "descarga"] },
  { id: "l03", nombre: "Birgit y Klaus, 60", rasgos: ["aleman", "repite", "gourmet", "almazara", "abre", "envio"] },
  { id: "l04", nombre: "Sofie, 29", rasgos: ["ads", "descarga"] },
  { id: "l05", nombre: "Familia Meyer", rasgos: ["aleman", "familia", "hotel", "descarga", "abre"] },
  { id: "l06", nombre: "Jonas, 41", rasgos: ["ads", "clic", "visita", "envio"] },
  { id: "l07", nombre: "Petra, 47", rasgos: ["aleman", "gourmet", "abre", "clic", "visita", "envio"] },
  { id: "l08", nombre: "Lukas, 26", rasgos: ["ads"] },
  { id: "l09", nombre: "Ingrid, 58", rasgos: ["aleman", "repite", "almazara", "descarga", "abre", "clic", "visita"] },
  { id: "l10", nombre: "Marc, 38", rasgos: ["familia", "hotel"] },
  { id: "l11", nombre: "Hanna, 44", rasgos: ["aleman", "gourmet", "descarga", "visita"] },
  { id: "l12", nombre: "Erik, 31", rasgos: ["ads", "descarga", "abre"] },
];

const TIPOS_NODO = {
  email: { label: "Email", ico: "✉" },
  espera: { label: "Espera", ico: "⏱" },
  condicion: { label: "Condición", ico: "⑂" },
};
const CONDICIONES = ["abre el email", "hace clic", "no abre", "vuelve a la web", "compra"];

/* -------------------------------------------------------------- Estado */
const estado = {
  /** Criterios de scoring definidos por el alumno: rasgo → puntos. */
  criterios: [
    { id: "cr1", rasgo: "descarga", nombre: "Se descargó el lead magnet", cat: "comportamiento", puntos: 20 },
    { id: "cr2", rasgo: "clic", nombre: "Ha hecho clic en producto", cat: "comportamiento", puntos: 25 },
    { id: "cr3", rasgo: "gourmet", nombre: "Interés gastronómico declarado", cat: "perfil", puntos: 15 },
    { id: "cr4", rasgo: "almazara", nombre: "Vino de una visita a almazara", cat: "origen", puntos: 20 },
  ],
  /** Umbrales de la escala: frío < t1 ≤ templado < t2 ≤ caliente. */
  umbralTemplado: 25,
  umbralCaliente: 55,
  /** Rasgos activos por lead (el alumno puede editarlos). */
  rasgosLead: Object.fromEntries(LEADS.map((l) => [l.id, [...l.rasgos]])),
  /** Nodos del workflow, en orden. */
  nodos: [
    { id: "n1", tipo: "email", dia: 1, asunto: "", objetivo: "" },
  ],
};

/* --------------------------------------------------------- Cálculo scoring */
function puntuar(leadId) {
  const activos = estado.rasgosLead[leadId] || [];
  return estado.criterios.reduce((acc, c) => acc + (activos.includes(c.rasgo) ? Number(c.puntos) || 0 : 0), 0);
}
function nivel(p) {
  if (p >= estado.umbralCaliente) return "caliente";
  if (p >= estado.umbralTemplado) return "templado";
  return "frio";
}
const maxPosible = () => estado.criterios.reduce((a, c) => a + Math.max(0, Number(c.puntos) || 0), 0);

/* ------------------------------------------------------------- Render (a) */

function criterioHtml(c) {
  return `<div class="criterio">
    <div>
      <span class="criterio__cat" data-c="${escapeHtml(c.cat)}">${escapeHtml(c.cat)}</span>
      <input type="text" value="${escapeHtml(c.nombre)}" data-cr-nombre="${escapeHtml(c.id)}" aria-label="Nombre del criterio" />
    </div>
    <input type="number" value="${c.puntos}" step="5" data-cr-puntos="${escapeHtml(c.id)}" aria-label="Puntos del criterio ${escapeHtml(c.nombre)}" />
    <button type="button" data-cr-borrar="${escapeHtml(c.id)}" aria-label="Eliminar el criterio ${escapeHtml(c.nombre)}">×</button>
  </div>`;
}

function selectorRasgoHtml() {
  const usados = new Set(estado.criterios.map((c) => c.rasgo));
  const libres = RASGOS.filter((r) => !usados.has(r.id));
  if (!libres.length) return `<p class="small muted">Ya has usado todos los rasgos disponibles como criterio.</p>`;
  return `<div class="row">
    <select data-nuevo-rasgo aria-label="Rasgo a añadir como criterio">
      ${libres.map((r) => `<option value="${r.id}">${escapeHtml(r.label)} · ${r.cat}</option>`).join("")}
    </select>
    <button class="btn btn--secondary btn--sm" type="button" data-anadir-criterio>+ Añadir criterio</button>
  </div>`;
}

function leadsHtml() {
  const max = maxPosible() || 1;
  return LEADS.slice()
    .map((l) => ({ ...l, p: puntuar(l.id) }))
    .sort((a, b) => b.p - a.p)
    .map((l) => {
      const n = nivel(l.p);
      const activos = estado.rasgosLead[l.id] || [];
      const rasgos = RASGOS.map(
        (r) => `<button class="lead-rasgo" type="button" data-rasgo="${escapeHtml(r.id)}" data-lead="${escapeHtml(l.id)}"
          aria-pressed="${activos.includes(r.id)}">${escapeHtml(r.label)}</button>`
      ).join("");
      return `<div class="lead-fila" data-nivel="${n}">
        <div>
          <span class="lead-fila__nombre">${escapeHtml(l.nombre)}</span>
          <div class="lead-rasgos">${rasgos}</div>
        </div>
        <div>
          <span class="lead-fila__score">${l.p}</span>
          <span class="lead-fila__nivel">${n} · ${Math.round((l.p / max) * 100)}%</span>
        </div>
      </div>`;
    })
    .join("");
}

function escalaHtml() {
  const max = maxPosible() || 1;
  const pctT = Math.min(100, Math.round((estado.umbralTemplado / max) * 100));
  const pctC = Math.min(100, Math.round((estado.umbralCaliente / max) * 100));
  const reparto = { frio: 0, templado: 0, caliente: 0 };
  LEADS.forEach((l) => reparto[nivel(puntuar(l.id))]++);

  return `<h3>La escala que sale de tus pesos</h3>
    <p class="escala__lead">Máximo posible con tus criterios: <strong>${max} puntos</strong>.
    El sistema calcula; los cortes los pones tú.</p>
    <div class="escala__barra" role="img" aria-label="Escala de scoring">
      <i style="width:${pctT}%;background:rgba(255,255,255,.28)"></i>
      <i style="width:${Math.max(0, pctC - pctT)}%;background:#ffb02e"></i>
      <i style="width:${Math.max(0, 100 - pctC)}%;background:var(--c-accent)"></i>
    </div>
    <div class="escala__tramos">
      <span>Frío · ${reparto.frio} leads</span>
      <span>Templado · ${reparto.templado}</span>
      <span>Caliente · ${reparto.caliente}</span>
    </div>
    <div class="fields fields--2" style="margin-top:var(--sp-4)">
      <div class="field">
        <label for="ut" style="color:#fff">Corte «templado»</label>
        <input id="ut" type="number" value="${estado.umbralTemplado}" step="5" data-umbral="umbralTemplado" />
      </div>
      <div class="field">
        <label for="uc" style="color:#fff">Corte «caliente»</label>
        <input id="uc" type="number" value="${estado.umbralCaliente}" step="5" data-umbral="umbralCaliente" />
      </div>
    </div>
    <div class="leads" data-leads>${leadsHtml()}</div>`;
}

/* ------------------------------------------------------------- Render (b) */

function nodoHtml(n, i, total) {
  const t = TIPOS_NODO[n.tipo];
  let campos = "";
  if (n.tipo === "email") {
    campos = `<div class="wf-nodo__campos wf-nodo__campos--2">
      <input type="text" value="${escapeHtml(n.asunto || "")}" data-nodo="${n.id}" data-campo="asunto" placeholder="Asunto del email" aria-label="Asunto" />
      <input type="text" value="${escapeHtml(n.objetivo || "")}" data-nodo="${n.id}" data-campo="objetivo" placeholder="Objetivo de este email" aria-label="Objetivo" />
    </div>`;
  } else if (n.tipo === "espera") {
    campos = `<div class="wf-nodo__campos">
      <input type="number" min="1" max="90" value="${n.dias || 7}" data-nodo="${n.id}" data-campo="dias" aria-label="Días de espera" />
    </div>`;
  } else {
    campos = `<div class="wf-nodo__campos wf-nodo__campos--2">
      <select data-nodo="${n.id}" data-campo="condicion" aria-label="Condición">
        ${CONDICIONES.map((c) => `<option value="${escapeHtml(c)}"${c === n.condicion ? " selected" : ""}>${escapeHtml(c)}</option>`).join("")}
      </select>
      <input type="text" value="${escapeHtml(n.siNo || "")}" data-nodo="${n.id}" data-campo="siNo"
        placeholder="Si no se cumple, ¿qué hacemos?" aria-label="Rama alternativa" />
    </div>`;
  }

  return `<div class="wf-nodo wf-nodo--${n.tipo}">
    <div class="wf-nodo__ico" aria-hidden="true">${t.ico}</div>
    <div class="wf-nodo__cuerpo">
      <div><span class="wf-nodo__tipo">${t.label}</span>
        <span class="wf-nodo__dia">día ${diaDe(i)}</span></div>
      ${campos}
    </div>
    <div class="wf-nodo__acciones">
      <button type="button" data-mover="${n.id}" data-dir="-1" ${i === 0 ? "disabled" : ""} aria-label="Subir">▲</button>
      <button type="button" data-mover="${n.id}" data-dir="1" ${i === total - 1 ? "disabled" : ""} aria-label="Bajar">▼</button>
      <button type="button" data-borrar-nodo="${n.id}" aria-label="Eliminar nodo">×</button>
    </div>
  </div>`;
}

/** Día acumulado en el que ocurre el nodo i (las esperas suman días). */
function diaDe(i) {
  let d = 1;
  for (let k = 0; k < i; k++) {
    if (estado.nodos[k].tipo === "espera") d += Number(estado.nodos[k].dias) || 0;
  }
  return d;
}
const duracionTotal = () => diaDe(estado.nodos.length);

function workflowHtml() {
  if (!estado.nodos.length) return `<p class="wf-vacio">Workflow vacío. Añade el primer email de bienvenida.</p>`;
  return `<div class="wf-lista">${estado.nodos
    .map((n, i) => nodoHtml(n, i, estado.nodos.length) + (i < estado.nodos.length - 1 ? `<div class="wf-conector" aria-hidden="true"></div>` : ""))
    .join("")}</div>`;
}

function reglaHtml() {
  const marcas = estado.nodos
    .map((n, i) => ({ n, i, dia: diaDe(i) }))
    .filter((x) => x.n.tipo === "email")
    .map((x) => {
      const pct = Math.min(100, (x.dia / 90) * 100);
      return `<span class="wf-regla__marca" style="left:${pct}%"><span>día ${x.dia}</span></span>`;
    })
    .join("");
  const total = duracionTotal();
  return `<div class="wf-regla__linea">${marcas}</div>
    <div class="wf-regla__eje">
      <span>Vuelo de vuelta</span>
      <span>día 45</span>
      <span>día 90 · fin de la ventana</span>
    </div>
    <p class="small muted" style="margin-top:var(--sp-2)">Tu workflow dura <strong>${total} días</strong>
    ${total > 90 ? "— te sales de la ventana de 90 días del caso." : `y deja ${90 - total} días de la ventana sin usar.`}</p>`;
}

/* --------------------------------------------------- Payoff (RevealMoment) */

/** Genera el esquema del workflow como SVG (también sirve para descargarlo). */
function workflowSvg({ paraDescarga = false } = {}) {
  const nodos = estado.nodos;
  const anchoNodo = 200, altoNodo = 74, hueco = 34;
  const W = 260, H = Math.max(120, nodos.length * (altoNodo + hueco) + 40);
  const fondo = paraDescarga ? "#00133f" : "none";

  const cuerpo = nodos
    .map((n, i) => {
      const y = 20 + i * (altoNodo + hueco);
      const x = (W - anchoNodo) / 2;
      const color = n.tipo === "email" ? "#0ae4c3" : n.tipo === "espera" ? "#ffb02e" : "#b79bff";
      const titulo =
        n.tipo === "email" ? (n.asunto || "Email sin asunto")
        : n.tipo === "espera" ? `Esperar ${n.dias || 0} días`
        : `Si ${n.condicion || "…"}`;
      const sub =
        n.tipo === "email" ? (n.objetivo || "sin objetivo definido")
        : n.tipo === "condicion" ? (n.siNo ? `si no: ${n.siNo}` : "sin rama alternativa")
        : "";
      const corta = (t, max) => (t.length > max ? `${t.slice(0, max - 1)}…` : t);

      const flecha = i < nodos.length - 1
        ? `<path d="M${W / 2} ${y + altoNodo} V${y + altoNodo + hueco - 8}" stroke="${color}" stroke-width="2" fill="none"/>
           <path d="M${W / 2 - 5} ${y + altoNodo + hueco - 12} L${W / 2} ${y + altoNodo + hueco - 4} L${W / 2 + 5} ${y + altoNodo + hueco - 12} Z" fill="${color}"/>`
        : "";

      return `<g>
        <rect x="${x}" y="${y}" width="${anchoNodo}" height="${altoNodo}" rx="12"
          fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="1.5"/>
        <text class="wf-t" x="${x + 12}" y="${y + 22}" font-size="11" fill="${color}"
          style="text-transform:uppercase;letter-spacing:1px">${TIPOS_NODO[n.tipo].label} · día ${diaDe(i)}</text>
        <text class="wf-t" x="${x + 12}" y="${y + 44}" font-size="15" fill="#ffffff">${escapeHtml(corta(titulo, 26))}</text>
        <text x="${x + 12}" y="${y + 62}" font-size="11" fill="#ffffff" opacity=".7">${escapeHtml(corta(sub, 32))}</text>
      </g>${flecha}`;
    })
    .join("");

  return `<svg class="wf-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
    role="img" aria-label="Esquema del workflow de nurturing con ${nodos.length} pasos">
    <rect width="${W}" height="${H}" fill="${fondo}"/>${cuerpo}</svg>`;
}

function payoffHtml() {
  const emails = estado.nodos.filter((n) => n.tipo === "email");
  if (!emails.length) {
    return { html: `<p class="reveal-moment__empty">Añade emails, esperas y condiciones: el esquema se dibuja solo.</p>`, pie: "" };
  }
  const total = duracionTotal();
  const conAsunto = emails.filter((e) => e.asunto?.trim()).length;
  const condiciones = estado.nodos.filter((n) => n.tipo === "condicion").length;

  const pie = `<strong>${emails.length} emails</strong> repartidos en <strong>${total} días</strong>,
    con ${condiciones} bifurcación${condiciones === 1 ? "" : "es"} por comportamiento
    (${conAsunto} de ${emails.length} con asunto escrito).
    ${total > 90
      ? "Se sale de la ventana de 90 días: para entonces la despensa ya se ha llenado con otra cosa."
      : `Quedan ${90 - total} días de la ventana sin tocar.`}
    Si no hay ninguna condición, esto no es nurturing: es una secuencia de envíos.`;

  return {
    html: `<div style="display:flex;justify-content:center">${workflowSvg()}</div>`,
    pie,
  };
}

/* ------------------------------------------------ Validación estructural */
function checksHtml() {
  const emails = estado.nodos.filter((n) => n.tipo === "email");
  const cats = new Set(estado.criterios.map((c) => c.cat));
  const total = duracionTotal();
  const items = [
    { ok: estado.criterios.length >= 3, txt: `Al menos tres criterios de scoring (ahora: ${estado.criterios.length}).` },
    { ok: cats.size >= 2, txt: `Criterios de al menos dos categorías —perfil, comportamiento u origen— (ahora: ${cats.size}).` },
    { ok: estado.umbralCaliente > estado.umbralTemplado, txt: "El corte «caliente» está por encima del corte «templado»." },
    { ok: emails.length >= 3, txt: `Al menos tres emails en el workflow (ahora: ${emails.length}).` },
    { ok: emails.length > 0 && emails.every((e) => e.asunto?.trim() && e.objetivo?.trim()),
      txt: "Todos los emails con asunto y objetivo." },
    { ok: estado.nodos.some((n) => n.tipo === "condicion"), txt: "Al menos una condición por comportamiento." },
    { ok: total <= 90, txt: `El workflow cabe en la ventana de 90 días (ahora: ${total} días).` },
  ];
  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const l = ["# Lead scoring y workflow de nurturing", "", `_Caso: ${CASO.meta.caso}_`, ""];

  l.push("## Criterios de lead scoring", "", "| Criterio | Categoría | Puntos |", "|---|---|---|");
  estado.criterios.forEach((c) => l.push(`| ${c.nombre} | ${c.cat} | ${c.puntos} |`));
  l.push("", `Máximo posible: **${maxPosible()} puntos**. Cortes: templado ≥ ${estado.umbralTemplado}, caliente ≥ ${estado.umbralCaliente}.`, "");

  l.push("### Clasificación de los 12 leads", "", "| Lead | Puntos | Nivel |", "|---|---|---|");
  LEADS.map((x) => ({ ...x, p: puntuar(x.id) }))
    .sort((a, b) => b.p - a.p)
    .forEach((x) => l.push(`| ${x.nombre} | ${x.p} | ${nivel(x.p)} |`));

  l.push("", `## Workflow · ${duracionTotal()} días desde el vuelo de vuelta`, "");
  if (!estado.nodos.length) l.push("_(workflow vacío)_");
  else {
    l.push("| Día | Tipo | Contenido | Objetivo / rama |", "|---|---|---|---|");
    estado.nodos.forEach((n, i) => {
      const dia = diaDe(i);
      if (n.tipo === "email") l.push(`| ${dia} | Email | ${n.asunto || "_(sin asunto)_"} | ${n.objetivo || "—"} |`);
      else if (n.tipo === "espera") l.push(`| ${dia} | Espera | ${n.dias || 0} días | — |`);
      else l.push(`| ${dia} | Condición | Si ${n.condicion || "—"} | Si no: ${n.siNo || "—"} |`);
    });
  }
  return l.join("\n");
}

/* -------------------------------------------------------------- Prompts */
function promptScoring() {
  const cr = estado.criterios.map((c) => `- ${c.nombre} (${c.cat}): ${c.puntos} puntos`).join("\n");
  const clas = LEADS.map((x) => `- ${x.nombre}: ${puntuar(x.id)} puntos (${nivel(puntuar(x.id))})`).join("\n");
  return `Estoy definiendo el lead scoring de una marca de alimentación española que capta leads entre turistas extranjeros en España y quiere que recompren desde su país.

Mis criterios y pesos:

${cr}

Cortes: templado a partir de ${estado.umbralTemplado} puntos, caliente a partir de ${estado.umbralCaliente}. Máximo posible: ${maxPosible()}.

Con esto, mis 12 leads quedan así:

${clas}

Haz tres cosas:
1. Dime qué criterio está mal pesado y por qué, teniendo en cuenta que la compra ocurre a distancia y meses después del contacto.
2. Propón dos criterios que no he incluido y que serían buenos predictores en este contexto.
3. Señala si mis cortes dejan demasiados leads en un solo tramo y qué implicaría eso para el workflow.

No inventes benchmarks: razona sobre mis números.`;
}

function promptWorkflow() {
  const pasos = estado.nodos
    .map((n, i) => {
      const dia = diaDe(i);
      if (n.tipo === "email") return `Día ${dia} — Email: "${n.asunto || "(sin asunto)"}" · objetivo: ${n.objetivo || "(sin definir)"}`;
      if (n.tipo === "espera") return `Día ${dia} — Esperar ${n.dias || 0} días`;
      return `Día ${dia} — Si ${n.condicion || "(?)"}; si no: ${n.siNo || "(sin definir)"}`;
    })
    .join("\n");

  return `Estoy diseñando el workflow de nurturing de los 90 días posteriores al vuelo de vuelta de un turista que probó un producto agroalimentario español durante sus vacaciones en España.

Este es mi workflow:

${pasos || "(vacío)"}

Haz tres cosas:
1. Escribe tres alternativas de asunto para cada email, pensadas para alguien que ya no está de viaje y tiene el recuerdo diluyéndose.
2. Dime en qué punto del recorrido tengo más riesgo de que el lead deje de abrir, y qué haría falta ahí.
3. Propón qué hacer con el lead que no abre ninguno de los emails, sin recurrir a un descuento.

Respeta mi estructura de días: no la reordenes.`;
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Nurturing", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M3", href: "/decks/m3.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Lead scoring y workflow de nurturing</h1>
        <p class="lead">Definid los criterios que puntúan a vuestros leads y dibujad el recorrido de los
        90 días posteriores al vuelo de vuelta. La ventana del caso es esa.</p>
      </div>

      <div class="tool-part" id="scoring">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Lead scoring</h2></div>
        </div>
        <div class="scoring">
          <div>
            <p class="muted" style="max-width:70ch">Cada criterio suma puntos cuando el lead cumple ese rasgo.
            Los pesos son vuestros: el sistema calcula, no juzga. Podéis marcar y desmarcar los rasgos de cada
            lead para ver cómo se mueve la escala.</p>
            <div data-criterios style="margin-top:var(--sp-4)"></div>
            <div data-nuevo-criterio style="margin-top:var(--sp-3)"></div>
          </div>
          <aside class="escala" data-escala aria-label="Escala de lead scoring"></aside>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="sc">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="sc" hidden>
            <p><strong>No hay pesos correctos.</strong> Lo que se evalúa es la coherencia entre lo que puntuáis
            y lo que decís que os importa. Preguntas que ayudan:</p>
            <ul>
              <li>¿Qué pesa más en vuestra escala: quién es o qué ha hecho? ¿Es lo que queríais?</li>
              <li>Mirad los tres leads con menos puntos: ¿de verdad no merecen nada?</li>
              <li>Si todos los leads caen en el mismo tramo, la escala no está separando nada.</li>
              <li>Recordad que el scoring es continuo: cambia con cada clic. ¿Qué rasgo cambiaría mañana?</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "scoring", label: "Copiar prompt: revisar mis pesos", hint: "Copia tus criterios y la clasificación resultante." })}
        </div>
      </div>

      <div class="tool-part" id="workflow">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Workflow de los 90 días</h2></div>
          <span class="score" data-score-wf></span>
        </div>
        <div class="wf-toolbar">
          <button class="btn btn--secondary btn--sm" type="button" data-add="email">+ Email</button>
          <button class="btn btn--secondary btn--sm" type="button" data-add="espera">+ Espera</button>
          <button class="btn btn--secondary btn--sm" type="button" data-add="condicion">+ Condición</button>
          <span class="toolbar__spacer"></span>
          <button class="btn btn--ghost btn--sm" type="button" data-descargar-svg>Descargar el esquema (.svg)</button>
        </div>
        <div class="wf-canvas" data-workflow></div>
        <div class="wf-regla" data-regla></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="wf">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="wf" hidden>
            <p>Preguntas que ayudan a revisar el recorrido:</p>
            <ul>
              <li>¿Cuándo sale el primer email? El recuerdo empieza a diluirse desde que recoge la maleta.</li>
              <li>Por cada email, preguntad: ¿qué gana quien lo abre? Si la respuesta es «se entera de que existimos», falta algo.</li>
              <li>Un workflow sin condiciones es una lista de envíos programados, no nurturing.</li>
              <li>¿Qué pasa con el que no abre nada? Esa rama también es una decisión.</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "workflow", label: "Copiar prompt: asuntos y ramas", hint: "Copia tu workflow y pide alternativas de asunto y qué hacer con quien no abre." })}
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Los 90 días, dibujados",
    entradilla: "El esquema del workflow tal y como lo habéis construido. Descargable en SVG para el entregable.",
    html: `<p class="reveal-moment__empty">Añade emails, esperas y condiciones: el esquema se dibuja solo.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza: <a href="/tools/calendario.html">calendario y creatividades</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarCriterios() {
  app.querySelector("[data-criterios]").innerHTML = estado.criterios.map(criterioHtml).join("");
  app.querySelector("[data-nuevo-criterio]").innerHTML = selectorRasgoHtml();
}
function pintarEscala() { app.querySelector("[data-escala]").innerHTML = escalaHtml(); }
function pintarLeads() { app.querySelector("[data-leads]").innerHTML = leadsHtml(); }
function pintarWorkflow() {
  app.querySelector("[data-workflow]").innerHTML = workflowHtml();
  app.querySelector("[data-regla]").innerHTML = reglaHtml();
}
function pintarChecks() { app.querySelector("[data-checks]").innerHTML = checksHtml(); }
function pintarScoreWf() {
  const emails = estado.nodos.filter((n) => n.tipo === "email").length;
  const el = app.querySelector("[data-score-wf]");
  el.innerHTML = `${emails} <small>emails en ${duracionTotal()} días</small>`;
  el.dataset.ok = emails >= 3 && duracionTotal() <= 90 ? "si" : "no";
}
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}
function refrescarWf() { pintarWorkflow(); pintarChecks(); pintarScoreWf(); pintarPayoff(); }

/* --------------------------------------------------------- Eventos (a) */
app.addEventListener("input", (e) => {
  const crN = e.target.dataset.crNombre;
  if (crN) { estado.criterios.find((c) => c.id === crN).nombre = e.target.value; return; }

  const crP = e.target.dataset.crPuntos;
  if (crP) { estado.criterios.find((c) => c.id === crP).puntos = Number(e.target.value) || 0; pintarEscala(); pintarChecks(); return; }

  const um = e.target.dataset.umbral;
  if (um) { estado[um] = Number(e.target.value) || 0; pintarEscala(); pintarChecks(); return; }

  /* -------------------------------------------------- Eventos (b) */
  const nodoId = e.target.dataset.nodo;
  if (nodoId) {
    const n = estado.nodos.find((x) => x.id === nodoId);
    const campo = e.target.dataset.campo;
    n[campo] = campo === "dias" ? Number(e.target.value) || 0 : e.target.value;
    // Cambiar los días recoloca toda la línea temporal, así que repintamos.
    if (campo === "dias") refrescarWf();
    else { pintarChecks(); pintarScoreWf(); pintarPayoff(); }
  }
});

app.addEventListener("change", (e) => {
  const nodoId = e.target.dataset.nodo;
  if (nodoId && e.target.dataset.campo === "condicion") {
    estado.nodos.find((x) => x.id === nodoId).condicion = e.target.value;
    pintarChecks(); pintarPayoff();
  }
});

app.addEventListener("click", (e) => {
  /* --- Criterios --- */
  if (e.target.closest("[data-anadir-criterio]")) {
    const sel = app.querySelector("[data-nuevo-rasgo]");
    const r = RASGOS.find((x) => x.id === sel.value);
    if (r) {
      estado.criterios.push({ id: `cr${Date.now()}`, rasgo: r.id, nombre: r.label, cat: r.cat, puntos: 10 });
      pintarCriterios(); pintarEscala(); pintarChecks();
    }
    return;
  }
  const borrarCr = e.target.closest("[data-cr-borrar]")?.dataset.crBorrar;
  if (borrarCr) {
    estado.criterios = estado.criterios.filter((c) => c.id !== borrarCr);
    pintarCriterios(); pintarEscala(); pintarChecks();
    return;
  }

  /* --- Rasgos de un lead --- */
  const rasgo = e.target.closest("[data-rasgo]");
  if (rasgo) {
    const { lead, rasgo: rid } = rasgo.dataset;
    const lista = estado.rasgosLead[lead];
    const i = lista.indexOf(rid);
    if (i >= 0) lista.splice(i, 1); else lista.push(rid);
    pintarEscala();
    return;
  }

  /* --- Nodos del workflow --- */
  const add = e.target.closest("[data-add]")?.dataset.add;
  if (add) {
    const id = `n${Date.now()}`;
    if (add === "email") estado.nodos.push({ id, tipo: "email", asunto: "", objetivo: "" });
    else if (add === "espera") estado.nodos.push({ id, tipo: "espera", dias: 7 });
    else estado.nodos.push({ id, tipo: "condicion", condicion: CONDICIONES[0], siNo: "" });
    refrescarWf();
    return;
  }
  const borrarN = e.target.closest("[data-borrar-nodo]")?.dataset.borrarNodo;
  if (borrarN) { estado.nodos = estado.nodos.filter((n) => n.id !== borrarN); refrescarWf(); return; }

  const mover = e.target.closest("[data-mover]");
  if (mover) {
    const i = estado.nodos.findIndex((n) => n.id === mover.dataset.mover);
    const j = i + Number(mover.dataset.dir);
    if (j >= 0 && j < estado.nodos.length) {
      [estado.nodos[i], estado.nodos[j]] = [estado.nodos[j], estado.nodos[i]];
      refrescarWf();
    }
    return;
  }

  if (e.target.closest("[data-descargar-svg]")) {
    descargar("workflow-nurturing.svg", workflowSvg({ paraDescarga: true }), "image/svg+xml;charset=utf-8");
    return;
  }

  /* --- Pistas --- */
  const btn = e.target.closest("[data-pista]");
  if (btn) {
    const txt = app.querySelector(`[data-pista-texto="${btn.dataset.pista}"]`);
    txt.hidden = !txt.hidden;
    btn.textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
  }
});

/* ------------------------------------------------------ AskAI + StatePanel */
wireAskAI(app, { scoring: promptScoring, workflow: promptWorkflow });

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "nurturing",
  nombreArchivo: "nurturing",
  getState: () => structuredClone({
    criterios: estado.criterios, umbralTemplado: estado.umbralTemplado,
    umbralCaliente: estado.umbralCaliente, rasgosLead: estado.rasgosLead, nodos: estado.nodos,
  }),
  setState: (nuevo) => {
    if (Array.isArray(nuevo.criterios)) estado.criterios = nuevo.criterios;
    if (typeof nuevo.umbralTemplado === "number") estado.umbralTemplado = nuevo.umbralTemplado;
    if (typeof nuevo.umbralCaliente === "number") estado.umbralCaliente = nuevo.umbralCaliente;
    if (nuevo.rasgosLead) {
      estado.rasgosLead = Object.fromEntries(LEADS.map((l) => [l.id, [...(nuevo.rasgosLead[l.id] || l.rasgos)]]));
    }
    if (Array.isArray(nuevo.nodos)) estado.nodos = nuevo.nodos;
    pintarCriterios(); pintarEscala(); refrescarWf();
  },
  toMarkdown,
});

/* ------------------------------------------------------------ Arranque */
pintarCriterios();
pintarEscala();
refrescarWf();
