/* section.js — Sección full-bleed con variante clara / azul. */
import { cx, attrs } from "./_util.js";

/**
 * @param {object} o
 * @param {string} o.html                  Contenido interno (HTML ya seguro).
 * @param {"light"|"blue"} [o.variant="light"]
 * @param {boolean} [o.wrap=true]          Envolver el contenido en .wrap.
 * @param {boolean} [o.wide=false]         Usar el contenedor ancho (--maxw-wide).
 * @param {boolean} [o.tight=false]        Menos padding vertical.
 * @param {string} [o.id]
 * @param {string} [o.tag="section"]       Etiqueta HTML (p. ej. "main").
 * @param {Record<string,unknown>} [o.extra]
 * @returns {string} HTML
 */
export function Section({ html = "", variant = "light", wrap = true, wide = false, tight = false, id, tag = "section", extra = {} } = {}) {
  const cls = cx("section", `section--${variant}`, tight && "section--tight");
  const inner = wrap ? `<div class="wrap${wide ? " wrap--wide" : ""}">${html}</div>` : html;
  return `<${tag} class="${cls}"${attrs({ id, ...extra })}>${inner}</${tag}>`;
}
