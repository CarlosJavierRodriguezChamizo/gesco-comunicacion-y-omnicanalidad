/* =========================================================================
   intro.js — Deck de apertura. Rellena los huecos editoriales del HTML con
   los textos de contenido.js ANTES de arrancar Reveal (si no, Reveal mide
   slides vacías) y luego carga la inicialización común del deck.
   ========================================================================= */
import { escapeHtml } from "../components/_util.js";
import { PROFESOR, REGLAS, ENTREGABLES, FUERA_DE_ALCANCE, CRITERIOS_ESIC } from "../data/contenido.js";

/** Escribe HTML en el hueco marcado con data-slot. */
function slot(nombre, html) {
  const el = document.querySelector(`[data-slot="${nombre}"]`);
  if (el) el.innerHTML = html;
}

/* --- 2 · Presentación del profesor (placeholders editables) --- */
slot("prof-nombre", escapeHtml(PROFESOR.nombre));
slot("prof-titular", escapeHtml(PROFESOR.titular));
slot("prof-bio", PROFESOR.bio.map((p) => `<p style="font-size:.7em">${escapeHtml(p)}</p>`).join(""));
slot("prof-contacto", escapeHtml(PROFESOR.contacto));

/* --- 3 · Reglas del taller --- */
slot(
  "reglas",
  REGLAS.map(
    (r, i) => `<div class="feat${i === REGLAS.length - 1 ? " feat--accent" : ""}">
      <span class="feat__n">0${i + 1}</span>
      <h3>${escapeHtml(r.titulo)}</h3>
      <p>${escapeHtml(r.texto)}</p>
    </div>`
  ).join("")
);

/* --- 6 · Qué no cubre este bloque --- */
slot(
  "fuera",
  FUERA_DE_ALCANCE.map((t, i) => {
    const [titulo, resto] = t.split(":");
    return `<div class="ccard"><h3>Bloque ${i === 0 ? "1" : "3"} · ${escapeHtml(titulo)}</h3><p>${escapeHtml((resto || "").trim())}</p></div>`;
  }).join("")
);

/* --- 7 · Los cinco entregables --- */
slot(
  "entregables",
  ENTREGABLES.map(
    (e, i) => `<div class="feat">
      <span class="feat__n">0${i + 1}</span>
      <h3>${escapeHtml(e.titulo)}</h3>
      <p>${escapeHtml(e.texto)}</p>
    </div>`
  ).join("")
);

/* --- 8 · Los cuatro criterios de evaluación, con su peso --- */
slot(
  "criterios",
  CRITERIOS_ESIC.map(
    (c) => `<div class="crit__row">
      <span class="crit__peso">${c.peso}%</span>
      <span class="crit__bar" aria-hidden="true"><i style="width:${c.peso * 2.2}%"></i></span>
      <span class="crit__txt"><strong>${escapeHtml(c.titulo)}</strong><br><small>${escapeHtml(c.texto)}</small></span>
    </div>`
  ).join("")
);

/* Arranca Reveal una vez el DOM ya tiene su contenido definitivo. */
import("./deck.js");
