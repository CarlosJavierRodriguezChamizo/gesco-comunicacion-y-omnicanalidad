/* =========================================================================
   buyer-persona.js — (a) Dos arquetipos con Customer Insights.
                      (b) Clasificador de momentos en matriz 3×3.

   Payoff: la matriz proyectada con el recuento por celda. Las celdas vacías
   se marcan solas y la barra de "después del viaje" enseña qué parte del
   mapa vive donde está el problema del caso.

   Las validaciones son ESTRUCTURALES: comprueban si el trabajo está completo,
   nunca si un momento está "bien colocado". No hay respuestas correctas.
   ========================================================================= */
import {
  Header, Section, Button, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

/* ----------------------------------------------------------- Constantes */
const FASES = [
  { id: "tofu", label: "TOFU", ayuda: "Tiene una necesidad y no conoce la solución" },
  { id: "mofu", label: "MOFU", ayuda: "Conoce soluciones y no ha elegido" },
  { id: "bofu", label: "BOFU", ayuda: "Está eligiendo dentro de una short list" },
];
const FRANJAS = [
  { id: "antes", label: "Antes del viaje", ayuda: "Todavía no ha reservado o está preparándolo" },
  { id: "durante", label: "Durante la estancia", ayuda: "Ya está en España" },
  { id: "despues", label: "Después del viaje", ayuda: "Ha vuelto a su país" },
];
/** Mínimo de insights por arquetipo para considerarlo trabajado (estructural). */
const MIN_INSIGHTS = 4;

/** Campos de Customer Insight de cada arquetipo. */
const CAMPOS = [
  { id: "nombre", label: "Nombre de la persona", tipo: "text", help: "Un nombre propio, no un segmento." },
  { id: "mercado", label: "Mercado de origen", tipo: "text", help: "El país desde el que viaja." },
  { id: "perfil", label: "En una línea, ¿quién es?", tipo: "text", help: "Edad, con quién viaja, qué hace." },
  { id: "mueve", label: "¿Qué le mueve?", tipo: "area", help: "La motivación real del viaje y de lo que come." },
  { id: "desconfia", label: "¿De qué desconfía?", tipo: "area", help: "Qué le hace dudar de una marca de alimentación." },
  { id: "informa", label: "¿Dónde se informa?", tipo: "area", help: "Plataformas, personas y formatos concretos." },
  { id: "frena", label: "¿Qué le frena a recomprar en origen?", tipo: "area", help: "La barrera real cuando ya está en casa." },
];

/* -------------------------------------------------------------- Estado */
/** Estado en memoria. `ubicacion` = { momentoId: "fase|franja" }. */
const estado = {
  personas: [crearPersona(), crearPersona()],
  ubicacion: {},
};

function crearPersona() {
  return Object.fromEntries(CAMPOS.map((c) => [c.id, ""]));
}

/** Momentos que siguen sin colocar. */
const sinColocar = () => CASO.momentos.items.filter((m) => !estado.ubicacion[m.id]);

/** Momentos de una celda concreta. */
const enCelda = (fase, franja) =>
  CASO.momentos.items.filter((m) => estado.ubicacion[m.id] === `${fase}|${franja}`);

/** Insights rellenos de un arquetipo (cuenta campos no vacíos). */
const insightsDe = (p) => CAMPOS.filter((c) => String(p[c.id] || "").trim().length > 2).length;

/* ------------------------------------------------------------- Render */

function personaHtml(p, i) {
  const campos = CAMPOS.map((c) => {
    const id = `p${i}-${c.id}`;
    const val = escapeHtml(p[c.id]);
    const control =
      c.tipo === "area"
        ? `<textarea id="${id}" data-persona="${i}" data-campo="${c.id}" rows="2">${val}</textarea>`
        : `<input id="${id}" type="text" data-persona="${i}" data-campo="${c.id}" value="${val}" />`;
    return `<div class="field">
      <label for="${id}">${escapeHtml(c.label)}</label>
      ${control}
      <span class="field__help">${escapeHtml(c.help)}</span>
    </div>`;
  }).join("");

  return `<article class="persona">
    <div class="persona__head">
      <span class="persona__tag">Arquetipo ${i + 1}</span>
      <span class="persona__contador" data-contador="${i}"></span>
    </div>
    <div class="fields">${campos}</div>
  </article>`;
}

function momentoHtml(m, colocado) {
  const quitar = colocado
    ? `<button class="momento__quitar" type="button" data-quitar="${escapeHtml(m.id)}" aria-label="Devolver a la bandeja">×</button>`
    : "";
  return `<div class="momento" draggable="true" tabindex="0" role="button"
    data-momento="${escapeHtml(m.id)}"
    aria-label="Momento: ${escapeHtml(m.texto)}. Pulsa para seleccionarlo y luego elige una celda.">
    ${quitar}${escapeHtml(m.texto)}
  </div>`;
}

function bandejaHtml() {
  const items = sinColocar();
  return `<div class="bandeja__head">
      <h3 class="bandeja__title">Momentos por colocar</h3>
      <span class="bandeja__n">${items.length} / ${CASO.momentos.items.length}</span>
    </div>
    <div class="bandeja__list" data-zona="bandeja">
      ${items.length ? items.map((m) => momentoHtml(m, false)).join("")
        : `<p class="bandeja__vacia">Todos colocados. Repasa la matriz: ¿hay alguna celda vacía?</p>`}
    </div>`;
}

function matrizHtml() {
  const cabecerasCol = FASES.map(
    (f) => `<div class="matriz__colhead matriz__colhead--${f.id}"><b>${f.label}</b><small>${escapeHtml(f.ayuda)}</small></div>`
  ).join("");

  const filas = FRANJAS.map((fr) => {
    const celdas = FASES.map((f) => {
      const items = enCelda(f.id, fr.id);
      return `<div class="celda" data-n="${items.length}" data-fase="${f.id}" data-franja="${fr.id}"
        tabindex="0" role="button"
        aria-label="${f.label}, ${fr.label}: ${items.length} momentos. Con un momento seleccionado, pulsa para soltarlo aquí.">
        <span class="celda__n">${items.length}</span>
        ${items.map((m) => momentoHtml(m, true)).join("")}
      </div>`;
    }).join("");
    return `<div class="matriz__rowhead"><b>${escapeHtml(fr.label)}</b><small>${escapeHtml(fr.ayuda)}</small></div>${celdas}`;
  }).join("");

  return `<div class="matriz"><div class="matriz__esquina"></div>${cabecerasCol}${filas}</div>`;
}

/* --------------------------------------------------- Payoff (RevealMoment) */

function payoffHtml() {
  const total = CASO.momentos.items.length;
  const colocados = total - sinColocar().length;
  if (!colocados) {
    return { html: `<p class="reveal-moment__empty">Coloca los primeros momentos y la matriz aparecerá aquí, proyectable.</p>`, pie: "" };
  }

  const cabecera = FASES.map((f) => `<div class="payoff-matriz__h">${f.label}</div>`).join("");
  const filas = FRANJAS.map((fr) => {
    const celdas = FASES.map((f) => {
      const n = enCelda(f.id, fr.id).length;
      return `<div class="payoff-celda" data-n="${n}"><b>${n}</b><small>${n === 0 ? "sin cubrir" : n === 1 ? "momento" : "momentos"}</small></div>`;
    }).join("");
    return `<div class="payoff-matriz__h payoff-matriz__h--row">${escapeHtml(fr.label)}</div>${celdas}`;
  }).join("");

  const porFranja = FRANJAS.map((fr) => {
    const n = FASES.reduce((acc, f) => acc + enCelda(f.id, fr.id).length, 0);
    return { ...fr, n, pct: Math.round((n / colocados) * 100) };
  });
  const barras = porFranja
    .map(
      (fr) => `<div class="payoff-franja${fr.id === "despues" ? " payoff-franja--destacada" : ""}">
        <span class="payoff-franja__lab">${escapeHtml(fr.label)}</span>
        <span class="payoff-franja__bar"><i style="width:${fr.pct}%"></i></span>
        <span class="payoff-franja__pct">${fr.pct}%</span>
      </div>`
    )
    .join("");

  const vacias = FASES.length * FRANJAS.length -
    FASES.reduce((acc, f) => acc + FRANJAS.filter((fr) => enCelda(f.id, fr.id).length > 0).length, 0);
  const despues = porFranja.find((f) => f.id === "despues");

  const pie = `Habéis colocado <strong>${colocados}</strong> de ${total} momentos y quedan
    <strong>${vacias}</strong> celdas sin cubrir. En «después del viaje» hay
    <strong>${despues.n} momentos (${despues.pct}%)</strong> — y ahí es exactamente donde
    el caso dice que se rompe la cadena. Pregunta para el aula: ¿qué parte del plan de
    comunicación de una DOP española se dedica hoy a esa franja?`;

  return { html: `<div class="payoff-matriz">${`<div class="payoff-matriz__h"></div>${cabecera}${filas}`}</div>
    <div class="payoff-franjas">${barras}</div>`, pie };
}

/* ------------------------------------------------ Validación estructural */

function checksHtml() {
  const total = CASO.momentos.items.length;
  const colocados = total - sinColocar().length;
  const celdasVacias = [];
  FRANJAS.forEach((fr) => FASES.forEach((f) => {
    if (!enCelda(f.id, fr.id).length) celdasVacias.push(`${f.label} · ${fr.label}`);
  }));

  const items = [
    { ok: insightsDe(estado.personas[0]) >= MIN_INSIGHTS,
      txt: `Arquetipo 1 con al menos ${MIN_INSIGHTS} campos rellenos (ahora: ${insightsDe(estado.personas[0])}).` },
    { ok: insightsDe(estado.personas[1]) >= MIN_INSIGHTS,
      txt: `Arquetipo 2 con al menos ${MIN_INSIGHTS} campos rellenos (ahora: ${insightsDe(estado.personas[1])}).` },
    { ok: colocados === total, txt: `Los ${total} momentos colocados (ahora: ${colocados}).` },
    { ok: celdasVacias.length === 0,
      txt: celdasVacias.length
        ? `Quedan ${celdasVacias.length} celdas vacías: ${celdasVacias.join(" · ")}.`
        : "Ninguna celda de la matriz está vacía." },
  ];

  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------- Markdown export */

function toMarkdown() {
  const lineas = ["# Buyer personas y mapa de momentos", "", `_Caso: ${CASO.meta.caso}_`, ""];

  estado.personas.forEach((p, i) => {
    lineas.push(`## Arquetipo ${i + 1}${p.nombre ? `: ${p.nombre}` : ""}`, "");
    CAMPOS.filter((c) => c.id !== "nombre").forEach((c) => {
      lineas.push(`**${c.label}**  `, `${p[c.id] || "_(sin completar)_"}`, "");
    });
  });

  lineas.push("## Mapa de momentos", "", "| Franja | TOFU | MOFU | BOFU |", "|---|---|---|---|");
  FRANJAS.forEach((fr) => {
    const cols = FASES.map((f) => {
      const items = enCelda(f.id, fr.id);
      return items.length ? items.map((m) => m.texto).join("<br>") : "—";
    });
    lineas.push(`| **${fr.label}** | ${cols.join(" | ")} |`);
  });

  const pendientes = sinColocar();
  if (pendientes.length) {
    lineas.push("", `> Quedan ${pendientes.length} momentos sin colocar.`);
  }
  lineas.push("", `_Fuente de los datos del caso: ${CASO.momentos.fuente}._`);
  return lineas.join("\n");
}

/* -------------------------------------------------------------- Prompts */

function promptPersonas() {
  const bloques = estado.personas
    .map((p, i) =>
      `Arquetipo ${i + 1}\n` +
      CAMPOS.map((c) => `- ${c.label}: ${p[c.id] || "(sin completar)"}`).join("\n")
    )
    .join("\n\n");

  return `Actúa como planner de un plan de inbound marketing. Contexto: promocionamos un producto agroalimentario español entre turistas extranjeros que lo prueban en España, con el objetivo de que lo recompren al volver a su país.

Estos son mis dos buyer personas:

${bloques}

Haz tres cosas:
1. Señala qué Customer Insight de cada arquetipo es genérico y valdría para cualquier marca, y reescríbelo para que sea específico.
2. Propón, para cada arquetipo, tres preguntas que esa persona se haría y que yo no he recogido.
3. Dime qué información me falta para poder escribir contenido dirigido a esa persona.

No inventes datos de mercado: trabaja solo con lo que te doy.`;
}

function promptMatriz() {
  const filas = FRANJAS.map((fr) =>
    FASES.map((f) => {
      const items = enCelda(f.id, fr.id);
      return `${f.label} · ${fr.label} (${items.length}): ${items.map((m) => m.texto).join(" | ") || "vacío"}`;
    }).join("\n")
  ).join("\n");

  return `Soy responsable de contenidos de una marca de alimentación española que quiere que los turistas extranjeros la recompren al volver a su país.

He repartido los momentos de mi buyer persona en una matriz de fase del funnel (TOFU/MOFU/BOFU) × franja del viaje (antes/durante/después):

${filas}

Haz tres cosas:
1. Para cada celda con momentos, propón un formato de contenido concreto que los responda.
2. Para cada celda vacía, dime si tiene sentido que esté vacía o si es un hueco real, y por qué.
3. Señala el momento en el que, según esta matriz, tengo más riesgo de perder al lead.

No cambies mi clasificación: trabaja sobre ella.`;
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Buyer persona", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M1", href: "/decks/m1.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Buyer persona y mapa de momentos</h1>
        <p class="lead">Dos arquetipos con Customer Insights y ${CASO.momentos.items.length} momentos
        reales de un turista repartidos en una matriz de 3 × 3. Es la primera pieza del entregable.</p>
        <span class="fuente">${escapeHtml(CASO.momentos.fuente)} · los momentos no llevan fase asignada: la decidís vosotros.</span>
      </div>

      <div class="tool-part" id="personas">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Los dos arquetipos</h2></div>
          <span class="score" data-score-personas></span>
        </div>
        <div class="personas">${estado.personas.map(personaHtml).join("")}</div>
        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "personas", label: "Copiar prompt: afinar mis insights", hint: "Copia tus dos arquetipos ya escritos y pide que señalen lo genérico." })}
        </div>
      </div>

      <div class="tool-part" id="matriz">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>El mapa de momentos</h2></div>
          <span class="score" data-score-momentos></span>
        </div>
        <p class="muted" style="max-width:74ch">Arrastra cada momento a su celda, o púlsalo y después
        pulsa la celda. Cada momento cae en una fase del funnel <em>y</em> en una franja del viaje.</p>
        <p class="kbd-hint">Con teclado: <kbd>Tab</kbd> hasta el momento, <kbd>Enter</kbd> para seleccionarlo,
        <kbd>Tab</kbd> hasta la celda y <kbd>Enter</kbd> para soltarlo. <kbd>Esc</kbd> cancela.</p>

        <div class="momentos-layout" style="margin-top:var(--sp-5)">
          <aside class="bandeja" data-bandeja aria-label="Momentos por colocar"></aside>
          <div class="scroll-x"><div data-matriz></div></div>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista>Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto hidden>
            <p><strong>No hay una colocación correcta.</strong> La misma duda cambia de fase según
            lo cerca que esté esa persona de comprar. Estas preguntas ayudan a decidir:</p>
            <ul>
              <li>¿Esta persona sabe ya que existe una solución como la nuestra? Si no lo sabe, está arriba del embudo.</li>
              <li>¿Está comparando entre opciones concretas, o todavía explorando?</li>
              <li>¿En qué momento del viaje se le ocurre esta duda? Léela en voz alta y sitúala.</li>
              <li>Si una celda os queda vacía: ¿es que ese momento no existe, o es que no lo habéis pensado?</li>
            </ul>
          </div>
        </div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "matriz", label: "Copiar prompt: contenidos para mi matriz", hint: "Copia tu matriz tal cual y pide un formato de contenido por celda." })}
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Dónde está vuestro mapa",
    entradilla: "La matriz completa, con el recuento de cada celda. Lo que queda en blanco es lo que nadie va a cubrir.",
    html: `<p class="reveal-moment__empty">Coloca los primeros momentos y la matriz aparecerá aquí, proyectable.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza del entregable: <a href="/tools/keywords.html">las 10 keywords</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */

function pintarBandeja() {
  app.querySelector("[data-bandeja]").innerHTML = bandejaHtml();
}
function pintarMatriz() {
  app.querySelector("[data-matriz]").innerHTML = matrizHtml();
  if (seleccionado) marcarObjetivos(true);
}
function pintarChecks() {
  app.querySelector("[data-checks]").innerHTML = checksHtml();
}
function pintarScores() {
  const total = CASO.momentos.items.length;
  const colocados = total - sinColocar().length;
  const sm = app.querySelector("[data-score-momentos]");
  sm.innerHTML = `${colocados}/${total} <small>momentos colocados</small>`;
  sm.dataset.ok = colocados === total ? "si" : "no";

  const sp = app.querySelector("[data-score-personas]");
  const listos = estado.personas.filter((p) => insightsDe(p) >= MIN_INSIGHTS).length;
  sp.innerHTML = `${listos}/2 <small>arquetipos completos</small>`;
  sp.dataset.ok = listos === 2 ? "si" : "no";

  estado.personas.forEach((p, i) => {
    const el = app.querySelector(`[data-contador="${i}"]`);
    const n = insightsDe(p);
    el.textContent = `${n}/${CAMPOS.length} campos`;
    el.dataset.ok = n >= MIN_INSIGHTS ? "si" : "no";
  });
}
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}

/** Redibuja todo lo derivado del estado (sin tocar los inputs de texto). */
function refrescar({ conBandeja = true } = {}) {
  if (conBandeja) { pintarBandeja(); pintarMatriz(); }
  pintarChecks();
  pintarScores();
  pintarPayoff();
}

/* -------------------------------------------------- Interacción: campos */

app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.persona === undefined) return;
  estado.personas[Number(el.dataset.persona)][el.dataset.campo] = el.value;
  pintarChecks();
  pintarScores();
});

/* ------------------------------- Interacción: selección por clic/teclado */

let seleccionado = null;

/** Resalta (o apaga) las celdas como destino cuando hay un momento elegido. */
function marcarObjetivos(on) {
  app.querySelectorAll(".celda").forEach((c) => c.classList.toggle("is-target", on));
}

function seleccionar(id) {
  seleccionado = id;
  app.querySelectorAll(".momento").forEach((m) => m.classList.toggle("is-sel", m.dataset.momento === id));
  marcarObjetivos(!!id);
}

function colocar(id, fase, franja) {
  if (fase && franja) estado.ubicacion[id] = `${fase}|${franja}`;
  else delete estado.ubicacion[id];
  seleccionado = null;
  refrescar();
  // Repintar destruye el nodo que tenía el foco: lo devolvemos al destino,
  // si no quien navega con teclado se queda tirado en el <body>.
  const destino = fase && franja
    ? app.querySelector(`.celda[data-fase="${fase}"][data-franja="${franja}"]`)
    : app.querySelector(`.bandeja [data-momento="${id}"]`);
  destino?.focus();
}

app.addEventListener("click", (e) => {
  // Devolver a la bandeja
  const quitar = e.target.closest("[data-quitar]");
  if (quitar) { colocar(quitar.dataset.quitar, null, null); return; }

  // Seleccionar / deseleccionar un momento
  const momento = e.target.closest("[data-momento]");
  if (momento) {
    seleccionar(seleccionado === momento.dataset.momento ? null : momento.dataset.momento);
    return;
  }

  // Soltar en una celda
  const celda = e.target.closest(".celda");
  if (celda && seleccionado) { colocar(seleccionado, celda.dataset.fase, celda.dataset.franja); return; }

  // Devolver a la bandeja pulsando la zona de bandeja
  const zona = e.target.closest('[data-zona="bandeja"]');
  if (zona && seleccionado) { colocar(seleccionado, null, null); }
});

app.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { seleccionar(null); return; }
  if (e.key !== "Enter" && e.key !== " ") return;
  const momento = e.target.closest("[data-momento]");
  if (momento) { e.preventDefault(); seleccionar(seleccionado === momento.dataset.momento ? null : momento.dataset.momento); return; }
  const celda = e.target.closest(".celda");
  if (celda && seleccionado) { e.preventDefault(); colocar(seleccionado, celda.dataset.fase, celda.dataset.franja); }
});

/* ------------------------------------------ Interacción: arrastrar y soltar */

app.addEventListener("dragstart", (e) => {
  const m = e.target.closest("[data-momento]");
  if (!m) return;
  e.dataTransfer.setData("text/plain", m.dataset.momento);
  e.dataTransfer.effectAllowed = "move";
  m.classList.add("is-drag");
});
app.addEventListener("dragend", (e) => e.target.closest("[data-momento]")?.classList.remove("is-drag"));

app.addEventListener("dragover", (e) => {
  const zona = e.target.closest(".celda, [data-zona='bandeja']");
  if (!zona) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  zona.classList.add("is-over");
});
app.addEventListener("dragleave", (e) => e.target.closest(".celda, [data-zona='bandeja']")?.classList.remove("is-over"));
app.addEventListener("drop", (e) => {
  const zona = e.target.closest(".celda, [data-zona='bandeja']");
  if (!zona) return;
  e.preventDefault();
  zona.classList.remove("is-over");
  const id = e.dataTransfer.getData("text/plain");
  if (!id) return;
  if (zona.classList.contains("celda")) colocar(id, zona.dataset.fase, zona.dataset.franja);
  else colocar(id, null, null);
});

/* ------------------------------------------------------------- Pista */
app.addEventListener("click", (e) => {
  if (!e.target.closest("[data-pista]")) return;
  const txt = app.querySelector("[data-pista-texto]");
  txt.hidden = !txt.hidden;
  e.target.closest("[data-pista]").textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
});

/* ------------------------------------------------------ AskAI + StatePanel */

wireAskAI(app, { personas: promptPersonas, matriz: promptMatriz });

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "buyer-persona",
  nombreArchivo: "buyer-persona",
  getState: () => structuredClone(estado),
  setState: (nuevo) => {
    if (Array.isArray(nuevo.personas)) {
      estado.personas = [0, 1].map((i) => ({ ...crearPersona(), ...(nuevo.personas[i] || {}) }));
    }
    estado.ubicacion = { ...(nuevo.ubicacion || {}) };
    // Vuelca los valores importados en los inputs y redibuja todo.
    app.querySelectorAll("[data-persona]").forEach((el) => {
      el.value = estado.personas[Number(el.dataset.persona)][el.dataset.campo] || "";
    });
    refrescar();
  },
  toMarkdown,
  ayuda: "Este archivo es una de las dos piezas que hay que traer el 25 de septiembre.",
});

refrescar();
