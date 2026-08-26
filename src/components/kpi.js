/* kpi.js — KPI grande: número en display + etiqueta (+ fuente del dato).
   La fuente se muestra SIEMPRE que la cifra venga del dossier del caso:
   es parte del contrato editorial del proyecto. */
import { escapeHtml, attrs } from "./_util.js";

/**
 * @param {object} o
 * @param {string|number} o.value   Número/valor destacado (ej. "82,8 M").
 * @param {string} o.label          Etiqueta descriptiva.
 * @param {string} [o.sub]          Línea secundaria opcional.
 * @param {string} [o.fuente]       Procedencia del dato (se pinta en cursiva).
 * @param {Record<string,unknown>} [o.extra]
 * @returns {string} HTML
 */
export function Kpi({ value, label, sub = "", fuente = "", extra = {} } = {}) {
  const subHtml = sub ? `<span class="kpi__sub">${escapeHtml(sub)}</span>` : "";
  const fuenteHtml = fuente ? `<span class="fuente">${escapeHtml(fuente)}</span>` : "";
  return `<div class="kpi"${attrs(extra)}>
    <span class="kpi__num">${escapeHtml(value)}</span>
    <span class="kpi__label">${escapeHtml(label)}</span>
    ${subHtml}${fuenteHtml}
  </div>`;
}
