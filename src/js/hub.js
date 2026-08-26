/* =========================================================================
   hub.js — Render del Hub / Escaleta viva + interacción de estado.

   La home es la agenda que se proyecta entre bloques: cuatro columnas (una
   por sesión), un separador explícito entre el día 2 y el día 3 con el
   encargo de los trece días, y un contador de horas restantes del bloque.

   El estado de cada bloque (pendiente / en curso / hecho) vive en memoria.
   ========================================================================= */
import { Header, Section, Kpi, escapeHtml } from "../components/index.js";
import ESCALETA from "../data/escaleta.json";
import CASO from "../data/caso-alimentos.json";
import { ENCARGO, ENTREGABLES } from "../data/contenido.js";

/* ----- Estado en memoria (no persiste entre recargas, por diseño) ----- */
const ESTADOS = ["pendiente", "encurso", "hecho"];
const ESTADO_LABEL = { pendiente: "Pendiente", encurso: "En curso", hecho: "Hecho" };
/** Map<string,string>  id de bloque -> estado actual. */
const estados = new Map();

/* --------------------------- Helpers de render --------------------------- */

/** Minutos de un bloque a partir de su duración ("45'" -> 45). */
function minutos(dur) {
  const m = /(\d+)/.exec(dur || "");
  return m ? Number(m[1]) : 0;
}

/** Un enlace de acción (deck / tool / kahoot / pitch). */
function linkHtml({ label, href, kind }) {
  return `<a class="agenda-link agenda-link--${escapeHtml(kind)}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

/** Botón de estado de un bloque. */
function statusButton(id) {
  const st = estados.get(id) || "pendiente";
  return `<button class="status" type="button" data-status="${st}" data-toggle="${escapeHtml(id)}"
    aria-label="Estado del bloque: ${ESTADO_LABEL[st]}. Pulsa para cambiar.">
    <span class="status__dot" aria-hidden="true"></span>
    <span class="status__label">${ESTADO_LABEL[st]}</span>
  </button>`;
}

/** Una tarjeta de bloque de la escaleta. */
function itemHtml(b, id) {
  const cat = ESCALETA.cats[b.cat] || { label: b.cat, cls: "cat--framing" };
  const st = estados.get(id) || "pendiente";
  const block = b.block
    ? `<span class="badge badge--${escapeHtml(b.block)}">${escapeHtml(b.block.toUpperCase())}</span>`
    : "";
  const contenido = b.contenido ? `<p class="agenda-item__note">${escapeHtml(b.contenido)}</p>` : "";
  const links = b.links?.length
    ? `<div class="agenda-links">${b.links.map(linkHtml).join("")}</div>`
    : "";
  const dur = b.dur ? `<span class="agenda-item__dur">${escapeHtml(b.dur)}</span>` : "";

  return `<article class="agenda-item ${cat.cls}" data-status="${st}" data-min="${minutos(b.dur)}">
    <div class="agenda-item__time">
      <span class="agenda-item__hour">${escapeHtml(b.time)}</span>
      ${dur}
      ${statusButton(id)}
    </div>
    <div class="agenda-item__main">
      <div class="agenda-item__head">
        <span class="cat ${cat.cls}">${escapeHtml(cat.label)}</span>
        ${block}
      </div>
      <h3 class="agenda-item__title">${escapeHtml(b.title)}</h3>
      ${contenido}
      ${links}
    </div>
  </article>`;
}

/** Una columna de día con su lista de bloques. */
function dayHtml(d) {
  const items = d.bloques.map((b, i) => itemHtml(b, `${d.id}-${i}`)).join("");
  return `<div class="day" id="${escapeHtml(d.id)}">
    <header class="day__head">
      <h2 class="day__name">${escapeHtml(d.dia)} <span class="day__franja">${escapeHtml(d.fecha)}</span></h2>
      <p class="day__lema">${escapeHtml(d.lema)}</p>
    </header>
    <div class="day__list">${items}</div>
  </div>`;
}

/** Leyenda de tipos de bloque. */
function legendHtml() {
  return `<div class="legend">${Object.entries(ESCALETA.cats)
    .map(([, c]) => `<span class="cat ${c.cls}">${escapeHtml(c.label)}</span>`)
    .join("")}</div>`;
}

/** Separador de los trece días entre el día 2 y el día 3. */
function huecoHtml() {
  const puntos = ENCARGO.puntos.map((p) => `<li>${p}</li>`).join("");
  return `<section class="hueco" id="encargo" aria-labelledby="hueco-title">
    <div class="wrap wrap--wide hueco__inner">
      <div class="hueco__marca" aria-hidden="true">
        <span class="hueco__linea"></span>
        <span class="hueco__num">${ESCALETA.hueco.dias}</span>
        <span class="hueco__dias">días</span>
        <span class="hueco__linea"></span>
      </div>
      <div class="hueco__texto">
        <h2 id="hueco-title">${escapeHtml(ESCALETA.hueco.titulo)}</h2>
        <p class="hueco__lead">${escapeHtml(ESCALETA.hueco.texto)}</p>
      </div>
      <div class="hueco__encargo">
        <h3>${escapeHtml(ENCARGO.titulo)}</h3>
        <p class="hueco__plazo">${escapeHtml(ENCARGO.plazo)}</p>
        <ul class="hueco__puntos">${puntos}</ul>
        <p class="hueco__como">${escapeHtml(ENCARGO.comoGuardar)}</p>
        <div class="hueco__acciones">
          <a class="btn btn--primary" href="tools/buyer-persona.html">Reabrir buyer persona</a>
          <a class="btn btn--primary" href="tools/keywords.html">Reabrir keywords</a>
        </div>
      </div>
    </div>
  </section>`;
}

/** Tarjetas de los cinco entregables que salen de este bloque. */
function entregablesHtml() {
  return `<div class="entregables">${ENTREGABLES.map(
    (e) => `<a class="entregable" href="${escapeHtml(e.tool)}">
      <h3>${escapeHtml(e.titulo)}</h3>
      <p>${escapeHtml(e.texto)}</p>
    </a>`
  ).join("")}</div>`;
}

/* ------------------------------- Composición ------------------------------- */

const app = document.querySelector("#app");
const turistas = CASO.turismo.cifras.find((c) => c.id === "turistas");
const export_ = CASO.sector.cifras.find((c) => c.id === "exportaciones");

app.innerHTML = [
  Header({
    variant: "light",
    nav: ESCALETA.dias.map((d) => ({ label: d.dia, href: `#${d.id}` })),
  }),

  /* Hero */
  Section({
    variant: "light",
    wide: true,
    html: `
      <p class="hero__eyebrow">${escapeHtml(ESCALETA.asignatura)}</p>
      <h1 class="hero__title">${escapeHtml(ESCALETA.titulo)}</h1>
      <p class="hero__subtitle">${escapeHtml(CASO.meta.caso)}</p>
      <div class="hero__acciones">
        <a class="btn btn--primary" href="decks/intro.html">Abrir el deck de apertura</a>
        <a class="btn btn--secondary" href="#encargo">Ver el encargo entre sesiones</a>
      </div>`,
  }),

  /* Banda azul con el gancho numérico del caso */
  Section({
    variant: "blue",
    wide: true,
    html: `
      <div class="gancho">
        <div class="gancho__kpis">
          ${Kpi({ value: "82,8 M", label: "turistas extranjeros prueban nuestros productos en España", fuente: CASO.turismo.fuente })}
          ${Kpi({ value: "30.470 M€", label: "de exportación de alimentación y bebidas", fuente: CASO.sector.fuente })}
        </div>
        <p class="gancho__q">¿Tira lo uno de lo otro? El turista prueba, disfruta… y al aterrizar en casa no vuelve a comprarlo.</p>
      </div>`,
  }),

  /* Contador de horas + leyenda + escaleta de los cuatro días */
  Section({
    variant: "light",
    wide: true,
    html: `
      <div class="escaleta__head">
        <div>
          <h2>Escaleta de las cuatro sesiones</h2>
          <p class="muted">${escapeHtml(ESCALETA.estructuraBloque)} Pulsa el estado para marcar
          <strong>pendiente → en curso → hecho</strong> durante la clase.</p>
        </div>
        <div class="reloj" role="status" aria-live="polite">
          <span class="reloj__num" data-reloj-num>20 h</span>
          <span class="reloj__label" data-reloj-label>de 20 h por delante</span>
        </div>
      </div>
      ${legendHtml()}
      <div class="days" style="margin-top:var(--sp-6)">
        ${ESCALETA.dias.slice(0, 2).map(dayHtml).join("")}
      </div>`,
  }),

  /* Separador de los trece días */
  huecoHtml(),

  Section({
    variant: "light",
    wide: true,
    html: `<div class="days">${ESCALETA.dias.slice(2).map(dayHtml).join("")}</div>`,
  }),

  /* Qué sale de aquí */
  Section({
    variant: "light",
    wide: true,
    tight: true,
    html: `
      <h2>Qué entregable sale de este bloque</h2>
      <p class="muted">Los cinco puntos del bloque online del caso. Cada uno tiene su herramienta.</p>
      ${entregablesHtml()}`,
  }),

  `<footer class="hub-footer wrap wrap--wide">
     Comunicación y Omnicanalidad · GESCO — ESIC · Bloque Inbound Marketing y Medios Digitales<br>
     <span class="fuente">${escapeHtml(CASO.meta.avisoDato)}</span>
   </footer>`,
].join("");

/* --------------------- Interacción: alternar estado --------------------- */

/** Recalcula el contador de horas restantes a partir de los bloques hechos. */
function actualizarReloj() {
  const total = ESCALETA.horasTotales * 60;
  let hechos = 0;
  app.querySelectorAll('.agenda-item[data-status="hecho"]').forEach((el) => {
    hechos += Number(el.dataset.min || 0);
  });
  const restan = Math.max(0, total - hechos);
  const h = Math.floor(restan / 60);
  const m = restan % 60;
  const texto = m ? `${h} h ${m}′` : `${h} h`;
  app.querySelector("[data-reloj-num]").textContent = texto;
  app.querySelector("[data-reloj-label]").textContent =
    restan === 0 ? "bloque completado" : `de ${ESCALETA.horasTotales} h por delante`;
}

/* Delegación de eventos: un único listener para todos los botones de estado. */
app.addEventListener("click", (e) => {
  const btn = e.target.closest(".status");
  if (!btn) return;
  const id = btn.dataset.toggle;
  const actual = estados.get(id) || "pendiente";
  const siguiente = ESTADOS[(ESTADOS.indexOf(actual) + 1) % ESTADOS.length];
  estados.set(id, siguiente);

  // Actualiza el botón y la tarjeta sin re-renderizar (conserva el foco).
  btn.dataset.status = siguiente;
  btn.setAttribute("aria-label", `Estado del bloque: ${ESTADO_LABEL[siguiente]}. Pulsa para cambiar.`);
  btn.querySelector(".status__label").textContent = ESTADO_LABEL[siguiente];
  btn.closest(".agenda-item").dataset.status = siguiente;
  actualizarReloj();
});

actualizarReloj();
