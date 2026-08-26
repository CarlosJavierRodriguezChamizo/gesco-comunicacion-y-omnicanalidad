/* =========================================================================
   _util.js — Utilidades compartidas por los componentes.
   Los componentes son funciones puras que devuelven strings de HTML.
   ========================================================================= */

/**
 * Prefijo relativo a la raíz del sitio según la profundidad de la página:
 * "" en la raíz (index.html) y "../" en /decks/ o /tools/. Hace que los
 * enlaces internos funcionen igual servidos desde la raíz de un dominio,
 * desde una subcarpeta (GitHub Pages de proyecto) o abriendo el HTML en local.
 */
export const APP_BASE = /\/(decks|tools)\//.test(location.pathname) ? "../" : "";

/**
 * Convierte un enlace interno "absoluto de app" ("/tools/x.html") en relativo
 * según APP_BASE. Deja intactos anclas (#…), externos (http…) y los ya relativos.
 * @param {string} href
 * @returns {string}
 */
export function appUrl(href) {
  if (!href) return href;
  if (/^([a-z]+:|#|\/\/)/i.test(href)) return href; // http:, mailto:, #ancla, //host
  if (href.startsWith("/")) return APP_BASE + href.slice(1);
  return href; // ya es relativo
}

/**
 * Escapa texto para insertarlo de forma segura en HTML.
 * Úsalo SIEMPRE con cualquier dato que provenga de fuera (dataset, input del
 * alumno, CSV importado).
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Une nombres de clase ignorando valores vacíos/falsy.
 * @param {...(string|false|null|undefined)} parts
 * @returns {string}
 */
export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Convierte un objeto de atributos en una cadena HTML segura.
 * Claves con valor null/undefined/false se omiten; true => atributo booleano.
 * @param {Record<string, unknown>} map
 * @returns {string}
 */
export function attrs(map = {}) {
  return Object.entries(map)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escapeHtml(v)}"`))
    .join("");
}

/**
 * Identificador estable y legible a partir de un texto (para ids del DOM).
 * @param {string} texto
 * @returns {string}
 */
export function slug(texto) {
  return String(texto ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Formatea un número al estilo español (1.234,5). Devuelve "—" si no hay dato:
 * en este proyecto `null` significa "dato ausente", nunca cero.
 * @param {number|null|undefined} n
 * @param {number} [dec=0]
 * @returns {string}
 */
export function num(n, dec = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/**
 * Descarga un texto como archivo, sin red y sin dependencias.
 * @param {string} nombre  Nombre del archivo con extensión.
 * @param {string} texto   Contenido.
 * @param {string} [mime="text/plain;charset=utf-8"]
 */
export function descargar(nombre, texto, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([texto], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Libera la URL en el siguiente tick (Safari necesita que el click haya pasado).
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Copia texto al portapapeles con respaldo para navegadores sin API asíncrona.
 * @param {string} texto
 * @returns {Promise<boolean>} true si se copió.
 */
export async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Respaldo: textarea temporal + execCommand (funciona en file:// y sin permisos).
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
