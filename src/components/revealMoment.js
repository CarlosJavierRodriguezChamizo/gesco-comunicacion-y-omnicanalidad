/* =========================================================================
   revealMoment.js — Envoltorio del "momento de payoff" de cada herramienta.

   Todas las tools tienen una imagen que revela algo que el alumno no veía
   (una matriz con celdas vacías, un funnel que se desploma, dos bandas de
   estacionalidad que no encajan). Este componente le da el marco: escala
   tipográfica grande, contraste alto y una transición de entrada, para que
   se lea proyectado a tres metros.
   ========================================================================= */
import { escapeHtml, attrs } from "./_util.js";

/**
 * @param {object} o
 * @param {string} o.id                Id del bloque (para actualizarlo luego).
 * @param {string} o.titulo            Titular del momento (corto y grande).
 * @param {string} [o.entradilla]      Una frase que enmarca lo que se ve.
 * @param {string} [o.html]            Contenido (SVG, rejilla, lo que sea).
 * @param {string} [o.pie]             Lectura del gráfico, en pequeño.
 * @param {"light"|"blue"} [o.variant="blue"]
 * @param {Record<string,unknown>} [o.extra]
 * @returns {string} HTML
 */
export function RevealMoment({ id, titulo, entradilla = "", html = "", pie = "", variant = "blue", extra = {} } = {}) {
  return `<section class="reveal-moment reveal-moment--${variant}" id="${escapeHtml(id)}"${attrs(extra)}>
    <div class="wrap wrap--wide">
      <div class="reveal-moment__head">
        <span class="reveal-moment__eyebrow">Lo que esto enseña</span>
        <h2 class="reveal-moment__title">${escapeHtml(titulo)}</h2>
        ${entradilla ? `<p class="reveal-moment__lead">${escapeHtml(entradilla)}</p>` : ""}
      </div>
      <div class="reveal-moment__body" data-reveal-body="${escapeHtml(id)}">${html}</div>
      ${pie ? `<p class="reveal-moment__foot" data-reveal-foot="${escapeHtml(id)}">${pie}</p>` : `<p class="reveal-moment__foot" data-reveal-foot="${escapeHtml(id)}"></p>`}
    </div>
  </section>`;
}

/**
 * Sustituye el contenido del cuerpo de un RevealMoment y dispara la animación
 * de entrada (respetando prefers-reduced-motion vía CSS).
 * @param {HTMLElement} root
 * @param {string} id
 * @param {string} html
 * @param {string} [pie]
 */
export function updateRevealMoment(root, id, html, pie) {
  const body = root.querySelector(`[data-reveal-body="${id}"]`);
  if (body) {
    body.innerHTML = html;
    // Reinicia la animación quitando y volviendo a poner la clase.
    body.classList.remove("is-in");
    void body.offsetWidth; // fuerza reflow
    body.classList.add("is-in");
  }
  if (pie !== undefined) {
    const foot = root.querySelector(`[data-reveal-foot="${id}"]`);
    if (foot) foot.innerHTML = pie;
  }
}
