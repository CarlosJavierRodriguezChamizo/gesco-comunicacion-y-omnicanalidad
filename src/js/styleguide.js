/* =========================================================================
   styleguide.js — Guía de estilo del sistema de diseño.
   Página interna, no enlazada en la navegación: sirve para comprobar de un
   vistazo que todos los componentes se ven bien sobre fondo claro y azul,
   con contraste correcto y foco visible.
   ========================================================================= */
import {
  Header, Section, Card, Chip, Kpi, Button, Badge,
  AskAIButton, wireAskAI, RevealMoment, createStatePanel, escapeHtml,
} from "../components/index.js";

/* --------------------------------------------------- Muestras de color */
const TOKENS_COLOR = [
  ["--c-ink", "Títulos"],
  ["--c-body", "Texto largo"],
  ["--c-bg-blue", "Fondo azul"],
  ["--c-accent", "Énfasis turquesa"],
  ["--c-accent-blue", "Énfasis azul"],
  ["--c-m1", "Módulo M1"],
  ["--c-m2", "Módulo M2"],
  ["--c-m3", "Módulo M3"],
  ["--c-tofu", "Fase TOFU"],
  ["--c-mofu", "Fase MOFU"],
  ["--c-bofu", "Fase BOFU"],
];

const swatch = ([token, label]) => `<div class="sg-swatch">
  <span class="sg-swatch__box" style="background:var(${token})"></span>
  <span class="sg-swatch__lab"><b>${escapeHtml(label)}</b><code>${escapeHtml(token)}</code></span>
</div>`;

/** Bloque de demostración de componentes, para repetir sobre claro y azul. */
const demo = () => `
  <div class="row">
    ${Button({ label: "Primario" })}
    ${Button({ label: "Secundario", variant: "secondary" })}
    ${Button({ label: "Ghost", variant: "ghost" })}
    ${Button({ label: "Deshabilitado", disabled: true, extra: { disabled: true } })}
  </div>
  <div class="row" style="margin-top:var(--sp-4)">
    ${Chip({ label: "Chip sólido" })}
    ${Chip({ label: "Chip contorno", variant: "outline" })}
    ${Badge({ block: "m1" })}
    ${Badge({ block: "m2" })}
    ${Badge({ block: "m3" })}
    <span class="fase fase--tofu">TOFU</span>
    <span class="fase fase--mofu">MOFU</span>
    <span class="fase fase--bofu">BOFU</span>
    <span class="fase fase--sin">sin fase</span>
  </div>
  <div class="grid grid--3" style="margin-top:var(--sp-5)">
    ${Card({ title: "Tarjeta", body: "<p>Cuerpo de la tarjeta con un <a href='#contenido'>enlace</a>.</p>" })}
    ${Card({ title: "Tarjeta con filo", accent: true, body: "<p>Filo turquesa como detalle gráfico.</p>", eyebrow: Chip({ label: "Etiqueta" }) })}
    ${Card({ title: "Tarjeta enlazable", href: "/tools/_styleguide.html", body: "<p>Toda la tarjeta es un enlace.</p>" })}
  </div>
  <div class="grid grid--3" style="margin-top:var(--sp-5)">
    ${Kpi({ value: "82,8 M", label: "turistas extranjeros", fuente: "Dossier del caso · datos 2018" })}
    ${Kpi({ value: "30.470 M€", label: "de exportación", fuente: "Dossier del caso · datos 2018" })}
    ${Kpi({ value: "4–7", label: "noches de estancia", sub: "tramo mayoritario", fuente: "Dossier del caso · datos 2018" })}
  </div>`;

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Guía de estilo", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Guía de estilo</h1>
        <p class="lead">Página interna de comprobación. No está enlazada en la navegación:
        sirve para ver todos los componentes sobre los dos fondos del sistema.</p>
      </div>

      <h2 style="margin-top:var(--sp-7)">Tipografía</h2>
      <h1>Titular H1 en Sofia Sans Extra Condensed</h1>
      <h2>Titular H2</h2>
      <h3>Titular H3</h3>
      <p class="lead">Entradilla (<code>.lead</code>): texto de apoyo bajo un titular.</p>
      <p>Cuerpo de texto en la sans del sistema. <strong>Negrita</strong>, <em>cursiva</em> y
      <a href="#contenido">enlace</a>. <span class="muted">Texto atenuado (<code>.muted</code>).</span></p>
      <p class="fuente">Etiqueta de fuente del dato (<code>.fuente</code>) — siempre visible junto a las cifras del caso.</p>

      <h2 style="margin-top:var(--sp-7)">Color</h2>
      <div class="sg-swatches">${TOKENS_COLOR.map(swatch).join("")}</div>

      <h2 style="margin-top:var(--sp-7)">Componentes sobre fondo claro</h2>
      ${demo()}`,
  }),

  Section({
    variant: "blue", wide: true,
    html: `<h2>Componentes sobre fondo azul</h2>
      <p class="lead">Las mismas piezas, con las variantes invertidas.</p>
      ${demo()}`,
  }),

  Section({
    variant: "light", wide: true,
    html: `
      <h2>Campos de formulario</h2>
      <div class="fields fields--2" style="max-width:760px">
        <div class="field">
          <label for="sg-txt">Campo de texto</label>
          <input id="sg-txt" type="text" placeholder="Escribe algo" />
          <span class="field__help">Texto de ayuda bajo el campo.</span>
        </div>
        <div class="field">
          <label for="sg-sel">Desplegable</label>
          <select id="sg-sel"><option>Una opción</option><option>Otra opción</option></select>
        </div>
        <div class="field" style="grid-column:1/-1">
          <label for="sg-area">Área de texto</label>
          <textarea id="sg-area" rows="2" placeholder="Varias líneas"></textarea>
        </div>
      </div>

      <h2 style="margin-top:var(--sp-7)">Validación estructural y pista</h2>
      <div class="check-panel">
        <h3>Comprobación de la forma</h3>
        <ul class="check-list">
          <li data-ok="si">Un criterio cumplido.</li>
          <li data-ok="no">Un criterio pendiente, con el número que falta.</li>
        </ul>
      </div>
      <div class="pista">
        <button class="pista__btn" type="button" data-pista>Pista · ¿dónde miro?</button>
        <div class="pista__texto" data-pista-texto hidden>
          <p>La pista orienta dónde mirar; <strong>nunca da la solución</strong>.</p>
        </div>
      </div>

      <h2 style="margin-top:var(--sp-7)">AskAIButton</h2>
      ${AskAIButton({ id: "demo", label: "Copiar prompt de ejemplo", hint: "Un clic: copia un prompt ya construido con el estado actual." })}

      <h2 style="margin-top:var(--sp-7)">Marcadores y barra de acciones</h2>
      <div class="toolbar">
        <span class="score" data-ok="no">3/10 <small>seleccionadas</small></span>
        <span class="score" data-ok="si">10/10 <small>completadas</small></span>
        <span class="toolbar__spacer"></span>
        <span class="status-live">Región viva de estado.</span>
      </div>
      <p class="kbd-hint">Con teclado: <kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>.</p>`,
  }),

  RevealMoment({
    id: "sg-payoff",
    titulo: "RevealMoment",
    entradilla: "El envoltorio del momento de payoff de cada herramienta: escala grande, contraste alto y transición de entrada.",
    html: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      <div class="payoff-celda" data-n="7"><b>7</b><small>momentos</small></div>
      <div class="payoff-celda" data-n="0"><b>0</b><small>sin cubrir</small></div>
      <div class="payoff-celda" data-n="4"><b>4</b><small>momentos</small></div>
    </div>`,
    pie: "El pie explica <strong>qué hay que mirar</strong> en el gráfico.",
  }),

  Section({
    variant: "light", wide: true,
    html: `<h2>StatePanel</h2>
      <p class="muted">Exporta a <code>.md</code> y a <code>.json</code>, y reimporta su propio export.
      Es lo que sostiene los trece días entre la sesión del 12 y la del 25.</p>
      <div data-statepanel style="margin-top:var(--sp-4)"></div>`,
  }),
].join("");

/* Estilos propios de la guía (solo se usan aquí). */
const css = document.createElement("style");
css.textContent = `
  .sg-swatches { display: grid; gap: var(--sp-3); grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); margin-top: var(--sp-4); }
  .sg-swatch { display: flex; align-items: center; gap: var(--sp-3); }
  .sg-swatch__box { width: 46px; height: 46px; border-radius: 10px; border: 1px solid var(--c-line); flex: none; }
  .sg-swatch__lab { font-size: .82rem; }
  .sg-swatch__lab b { display: block; color: var(--c-ink); }
  .sg-swatch__lab code { color: var(--c-ink-soft); font-size: .74rem; }
`;
document.head.appendChild(css);

/* Pista de ejemplo */
app.addEventListener("click", (e) => {
  if (!e.target.closest("[data-pista]")) return;
  const txt = app.querySelector("[data-pista-texto]");
  txt.hidden = !txt.hidden;
  e.target.closest("[data-pista]").textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
});

/* AskAI de ejemplo (no llama a ninguna API: solo copia texto). */
wireAskAI(app, { demo: () => "Este es un prompt de ejemplo compuesto con el estado actual de la herramienta." });

/* StatePanel de ejemplo, con un estado de juguete para probar el ciclo completo. */
const demoEstado = { probado: false, nota: "" };
createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "styleguide",
  nombreArchivo: "styleguide-demo",
  getState: () => ({ ...demoEstado, cuando: "estado de prueba" }),
  setState: (nuevo) => { Object.assign(demoEstado, nuevo); },
  toMarkdown: () => "# Estado de prueba\n\nEste Markdown se genera desde `toMarkdown()` de la herramienta.",
  ayuda: "Prueba el ciclo completo: exportar, recargar la página e importar el archivo.",
});
