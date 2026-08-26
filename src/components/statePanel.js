/* =========================================================================
   statePanel.js — Exportación e IMPORTACIÓN del estado de una herramienta.

   Es el componente que sostiene los trece días entre la sesión del 12/09 y
   la del 25/09: el alumno exporta su trabajo, cierra el navegador, y el día
   25 lo recupera arrastrando el archivo o pegando el JSON. Sin backend.

   Contrato del archivo .json exportado:
     { "tool": "<id>", "version": 1, "fecha": "<ISO>", "estado": { … } }

   El .md es el mismo contenido en formato pegable en el Word del entregable.
   ========================================================================= */
import { escapeHtml, descargar, copiar } from "./_util.js";

/** Versión del formato de export. Si cambia la forma del estado, súbela. */
const FORMATO = 1;

/**
 * Monta el panel de estado dentro de un contenedor.
 *
 * @param {object} o
 * @param {HTMLElement} o.mount        Contenedor donde se pinta el panel.
 * @param {string} o.toolId            Identificador de la herramienta ("keywords"…).
 * @param {string} o.nombreArchivo     Base del nombre de archivo ("keywords").
 * @param {() => object} o.getState    Devuelve el estado serializable actual.
 * @param {(estado:object) => void} o.setState  Aplica un estado importado.
 * @param {() => string} o.toMarkdown  Genera el Markdown del entregable.
 * @param {string} [o.ayuda]           Texto de ayuda bajo los botones.
 * @returns {{refrescar: () => void}}  API mínima (para actualizar contadores).
 */
export function createStatePanel({ mount, toolId, nombreArchivo, getState, setState, toMarkdown, ayuda = "" }) {
  mount.innerHTML = `
    <section class="statepanel" aria-labelledby="sp-title-${escapeHtml(toolId)}">
      <div class="statepanel__head">
        <h2 class="statepanel__title" id="sp-title-${escapeHtml(toolId)}">Guardar y recuperar tu trabajo</h2>
        <p class="statepanel__lead">
          Exporta antes de cerrar. El día que retomes la sesión, arrastra aquí el
          <code>.json</code> (o pégalo) y recuperas todo donde lo dejaste.
          <strong>El estado vive en memoria: si recargas sin exportar, se pierde.</strong>
        </p>
      </div>

      <div class="statepanel__actions">
        <button class="btn btn--primary" type="button" data-sp="md">Exportar .md (para el Word)</button>
        <button class="btn btn--secondary" type="button" data-sp="json">Exportar .json (para reimportar)</button>
        <button class="btn btn--ghost" type="button" data-sp="copiar-md">Copiar el Markdown</button>
      </div>

      <div class="statepanel__import">
        <div class="dropzone" data-sp="drop" tabindex="0" role="button"
             aria-describedby="sp-drop-help-${escapeHtml(toolId)}">
          <span class="dropzone__icon" aria-hidden="true">⤓</span>
          <span class="dropzone__text">Arrastra aquí tu <code>.json</code> o pulsa para elegirlo</span>
          <input class="visually-hidden" type="file" accept=".json,application/json" data-sp="file" />
        </div>
        <p class="small muted" id="sp-drop-help-${escapeHtml(toolId)}">
          También puedes pegar el contenido del JSON en el cuadro de abajo y pulsar «Importar».
        </p>
        <label class="statepanel__label" for="sp-paste-${escapeHtml(toolId)}">Pegar JSON</label>
        <textarea class="statepanel__paste" id="sp-paste-${escapeHtml(toolId)}" rows="3"
                  data-sp="paste" placeholder='{"tool":"${escapeHtml(toolId)}", …}'></textarea>
        <button class="btn btn--secondary" type="button" data-sp="importar">Importar</button>
      </div>

      <p class="statepanel__status status-live" data-sp="status" role="status" aria-live="polite"></p>
      ${ayuda ? `<p class="small muted">${ayuda}</p>` : ""}
    </section>`;

  const $ = (sel) => mount.querySelector(`[data-sp="${sel}"]`);
  const status = $("status");
  const fileInput = $("file");
  const drop = $("drop");

  /** Mensaje visible + anunciado por lector de pantalla. */
  const decir = (texto, tipo = "ok") => {
    status.textContent = texto;
    status.dataset.tipo = tipo;
  };

  /** Sobre del export, con metadatos para poder validar al importar. */
  const sobre = () => ({
    tool: toolId,
    version: FORMATO,
    fecha: new Date().toISOString(),
    estado: getState(),
  });

  /* ------------------------------- Exportar ------------------------------- */
  mount.addEventListener("click", async (e) => {
    const accion = e.target.closest("[data-sp]")?.dataset.sp;
    if (accion === "md") {
      descargar(`${nombreArchivo}.md`, toMarkdown(), "text/markdown;charset=utf-8");
      decir("Markdown descargado. Pégalo en el Word del entregable.");
    } else if (accion === "json") {
      descargar(`${nombreArchivo}.json`, JSON.stringify(sobre(), null, 2), "application/json");
      decir("JSON descargado. Guárdalo: es lo que tendrás que reimportar.");
    } else if (accion === "copiar-md") {
      const ok = await copiar(toMarkdown());
      decir(ok ? "Markdown copiado al portapapeles." : "No se pudo copiar; usa «Exportar .md».", ok ? "ok" : "error");
    } else if (accion === "importar") {
      aplicarTexto($("paste").value);
    } else if (accion === "drop") {
      fileInput.click();
    }
  });

  /* ------------------------------- Importar ------------------------------- */

  /**
   * Valida y aplica un JSON exportado por esta misma herramienta.
   * Acepta tanto el sobre completo como un estado "pelado" (por si el alumno
   * copia solo el contenido de `estado`).
   * @param {string} texto
   */
  function aplicarTexto(texto) {
    const crudo = String(texto || "").trim();
    if (!crudo) return decir("No hay nada que importar: pega el JSON o arrastra el archivo.", "error");

    let datos;
    try {
      datos = JSON.parse(crudo);
    } catch {
      return decir("Ese texto no es un JSON válido. Copia el archivo entero, desde la primera llave.", "error");
    }

    // ¿Sobre completo o estado pelado?
    const esSobre = datos && typeof datos === "object" && "estado" in datos;
    if (esSobre && datos.tool && datos.tool !== toolId) {
      return decir(`Ese archivo es de la herramienta «${datos.tool}», no de esta. Ábrelo en su propia página.`, "error");
    }
    const estado = esSobre ? datos.estado : datos;
    if (!estado || typeof estado !== "object") {
      return decir("El archivo no contiene un estado reconocible.", "error");
    }

    try {
      setState(estado);
      const cuando = esSobre && datos.fecha ? new Date(datos.fecha).toLocaleString("es-ES") : null;
      decir(cuando ? `Trabajo recuperado (exportado el ${cuando}).` : "Trabajo recuperado.");
    } catch (err) {
      decir(`No se pudo aplicar el estado: ${err.message}`, "error");
    }
  }

  /** Lee un File y lo importa. */
  function aplicarArchivo(file) {
    if (!file) return;
    const lector = new FileReader();
    lector.onload = () => aplicarTexto(String(lector.result));
    lector.onerror = () => decir("No se pudo leer el archivo.", "error");
    lector.readAsText(file);
  }

  fileInput.addEventListener("change", () => aplicarArchivo(fileInput.files?.[0]));

  // Arrastrar y soltar sobre la zona (y también sobre toda la página del panel).
  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-over"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, () => drop.classList.remove("is-over"))
  );
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    aplicarArchivo(e.dataTransfer?.files?.[0]);
  });
  // Accesible por teclado: Enter/Espacio abren el selector de archivo.
  drop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });

  return { refrescar: () => {} };
}
