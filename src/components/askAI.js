/* =========================================================================
   askAI.js — Botón de un clic que copia al portapapeles un prompt YA
   construido con lo que el alumno acaba de rellenar.

   Reglas del proyecto:
   · Ninguna llamada a API. Todo local, offline.
   · Nada de campos para escribir prompts ni de explicaciones de prompting:
     el alumno pulsa, pega en su herramienta de IA y sigue trabajando.
   ========================================================================= */
import { escapeHtml, copiar } from "./_util.js";

/**
 * HTML del botón. La lógica se conecta con `wireAskAI` sobre un contenedor.
 * @param {object} o
 * @param {string} o.id            Identificador único dentro de la página.
 * @param {string} [o.label]       Texto del botón.
 * @param {string} [o.hint]        Frase corta bajo el botón (qué hará la IA).
 * @returns {string} HTML
 */
export function AskAIButton({ id, label = "Copiar prompt para la IA", hint = "" }) {
  return `<div class="askai">
    <button class="btn btn--secondary askai__btn" type="button" data-askai="${escapeHtml(id)}">
      <span aria-hidden="true">✦</span> ${escapeHtml(label)}
    </button>
    ${hint ? `<span class="askai__hint small muted">${escapeHtml(hint)}</span>` : ""}
    <span class="askai__ok small" data-askai-ok="${escapeHtml(id)}" role="status" aria-live="polite"></span>
  </div>`;
}

/**
 * Conecta todos los AskAIButton de un contenedor con sus generadores de prompt.
 * @param {HTMLElement} root
 * @param {Record<string, () => string>} generadores  id -> función que devuelve el prompt.
 */
export function wireAskAI(root, generadores) {
  root.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-askai]");
    if (!btn) return;
    const id = btn.dataset.askai;
    const gen = generadores[id];
    if (!gen) return;

    const aviso = root.querySelector(`[data-askai-ok="${id}"]`);
    const ok = await copiar(gen());
    if (aviso) {
      aviso.textContent = ok ? "Prompt copiado — pégalo en tu IA." : "No se pudo copiar.";
      aviso.dataset.tipo = ok ? "ok" : "error";
      // El aviso se borra solo para no dejar ruido en la proyección.
      clearTimeout(aviso._t);
      aviso._t = setTimeout(() => { aviso.textContent = ""; delete aviso.dataset.tipo; }, 4000);
    }
  });
}
