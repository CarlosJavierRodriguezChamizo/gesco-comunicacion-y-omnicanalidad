/* =========================================================================
   pitch.js — Sala de pitch en formato jigsaw.

   Cinco equipos, cinco mandatos complementarios para que los pitches no se
   repitan. Los equipos que no presentan actúan de Comité de Dirección y
   puntúan. Temporizador configurable (6' de pitch + 3' de preguntas por
   defecto) y ranking al cierre.

   Los mandatos son el ENCARGO de cada equipo, nunca la solución.
   Todo el estado vive en memoria.
   ========================================================================= */
import {
  Header, Section, RevealMoment, updateRevealMoment, escapeHtml, num, descargar,
} from "../components/index.js";
import { MANDATOS, PITCH_RECORDATORIO, PITCH_CRITERIOS } from "../data/contenido.js";

/* -------------------------------------------------------------- Estado */
const estado = {
  /** Nombre editable de cada equipo (por defecto, el número). */
  equipos: MANDATOS.map((m) => ({ id: m.id, nombre: `Equipo ${m.id}`, mandato: m.titulo })),
  /** { equipoId: { criterioId: puntos } } — 0 a 10 por criterio. */
  puntos: Object.fromEntries(
    MANDATOS.map((m) => [m.id, Object.fromEntries(PITCH_CRITERIOS.map((c) => [c.id, 0]))])
  ),
  /** Temporizador. */
  minPitch: 6,
  minPreguntas: 3,
  equipoActivo: null,
  fase: "parado",      // "parado" | "pitch" | "preguntas" | "fin"
  restante: 0,         // segundos
  corriendo: false,
};

let tick = null;

/* ------------------------------------------------------ Cálculo de ranking */
const totalDe = (id) => PITCH_CRITERIOS.reduce((a, c) => a + (Number(estado.puntos[id]?.[c.id]) || 0), 0);
const maxTotal = () => PITCH_CRITERIOS.length * 10;

/* ------------------------------------------------------------- Render */

function mandatoHtml(m) {
  const eq = estado.equipos.find((e) => e.id === m.id);
  return `<article class="mandato" data-activo="${estado.equipoActivo === m.id ? "si" : "no"}">
    <span class="mandato__n">Mandato ${m.id}</span>
    <h3 class="mandato__t">${escapeHtml(m.titulo)}</h3>
    <p class="mandato__lema">${escapeHtml(m.lema)}</p>
    <p class="mandato__encargo">${escapeHtml(m.encargo)}</p>
    <ul class="mandato__puntos">${m.puntos.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
    <div class="mandato__pie">
      <a class="btn btn--ghost btn--sm" href="${escapeHtml(m.prep.href)}">Preparar: ${escapeHtml(m.prep.label)}</a>
      <button class="btn btn--secondary btn--sm" type="button" data-activar="${m.id}">
        ${estado.equipoActivo === m.id ? "Presentando" : "Le toca"}
      </button>
    </div>
    <div class="field">
      <label for="eq-${m.id}">Nombre del equipo</label>
      <input id="eq-${m.id}" type="text" data-equipo="${m.id}" value="${escapeHtml(eq.nombre)}" />
    </div>
  </article>`;
}

/** mm:ss a partir de segundos. */
function reloj(seg) {
  const s = Math.max(0, Math.round(seg));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function cronoHtml() {
  const totalFase = (estado.fase === "preguntas" ? estado.minPreguntas : estado.minPitch) * 60;
  const pct = totalFase > 0 ? Math.max(0, Math.min(100, (estado.restante / totalFase) * 100)) : 0;
  const eq = estado.equipos.find((e) => e.id === estado.equipoActivo);
  const etapa =
    estado.fase === "pitch" ? "Pitch" :
    estado.fase === "preguntas" ? "Preguntas del Comité" :
    estado.fase === "fin" ? "Tiempo" : "Preparado";

  return `<div class="crono__equipo">${eq ? escapeHtml(`${eq.nombre} · ${eq.mandato}`) : "Elige el equipo que presenta"}</div>
    <div class="crono__display" data-crono-num aria-live="off">${reloj(estado.restante)}</div>
    <div class="crono__etapa">${escapeHtml(etapa)}</div>
    <div class="crono__barra"><i style="width:${pct}%"></i></div>
    <div class="crono__controles">
      <button class="btn btn--primary" type="button" data-crono="toggle">${estado.corriendo ? "Pausa" : "Empezar"}</button>
      <button class="btn btn--secondary" type="button" data-crono="preguntas">Pasar a preguntas</button>
      <button class="btn btn--secondary" type="button" data-crono="reset">Reiniciar</button>
    </div>
    <div class="crono__config">
      <label>Pitch <input type="number" min="1" max="30" value="${estado.minPitch}" data-min="minPitch" /> min</label>
      <label>Preguntas <input type="number" min="1" max="20" value="${estado.minPreguntas}" data-min="minPreguntas" /> min</label>
    </div>
    <p class="visually-hidden" role="status" data-crono-aria></p>`;
}

function scoringHtml() {
  const filas = estado.equipos
    .map((e) => {
      const celdas = PITCH_CRITERIOS.map(
        (c) => `<td><input type="number" min="0" max="10" value="${estado.puntos[e.id][c.id]}"
          data-punto-eq="${e.id}" data-punto-cr="${c.id}"
          aria-label="${escapeHtml(c.label)} para ${escapeHtml(e.nombre)}" /></td>`
      ).join("");
      return `<tr>
        <td class="scoretabla__equipo">${escapeHtml(e.nombre)}<small>${escapeHtml(e.mandato)}</small></td>
        ${celdas}
        <td class="total" data-total="${e.id}">${totalDe(e.id)}</td>
      </tr>`;
    })
    .join("");

  return `<table class="scoretabla">
    <caption class="visually-hidden">Puntuación del Comité de Dirección, de 0 a 10 por criterio</caption>
    <thead><tr>
      <th scope="col">Equipo</th>
      ${PITCH_CRITERIOS.map((c) => `<th scope="col" title="${escapeHtml(c.ayuda)}">${escapeHtml(c.label)}</th>`).join("")}
      <th scope="col">Total</th>
    </tr></thead>
    <tbody>${filas}</tbody>
  </table>`;
}

/* --------------------------------------------------- Payoff: el ranking */
function rankingHtml() {
  const orden = estado.equipos
    .map((e) => ({ ...e, total: totalDe(e.id) }))
    .sort((a, b) => b.total - a.total);

  if (!orden.some((e) => e.total > 0)) {
    return { html: `<p class="reveal-moment__empty">El ranking aparece aquí en cuanto el Comité empiece a puntuar.</p>`, pie: "" };
  }

  const max = maxTotal();
  const filas = orden
    .map(
      (e, i) => `<div class="rank-fila">
        <span class="rank-pos">${i + 1}</span>
        <div class="rank-cuerpo">
          <div class="rank-nombre">${escapeHtml(e.nombre)} <span style="opacity:.65;font-size:.7em">${escapeHtml(e.mandato)}</span></div>
          <div class="rank-barra"><i style="width:${Math.round((e.total / max) * 100)}%"></i></div>
        </div>
        <span class="rank-pts">${e.total}<span style="opacity:.5;font-size:.55em">/${max}</span></span>
      </div>`
    )
    .join("");

  const lider = orden[0];
  const segundo = orden[1];
  const pie = `Sobre ${max} puntos posibles. ${escapeHtml(lider.nombre)} va primero con ${lider.total}${
    segundo && lider.total - segundo.total <= 2
      ? `, a solo ${lider.total - segundo.total} de ${escapeHtml(segundo.nombre)}.`
      : "."
  } <strong>${escapeHtml(PITCH_RECORDATORIO)}</strong>`;

  return { html: `<div class="ranking">${filas}</div>`, pie };
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const l = ["# Sala de pitch · resultados", "", "| Equipo | Mandato | " + PITCH_CRITERIOS.map((c) => c.label).join(" | ") + " | Total |",
    "|---|---|" + PITCH_CRITERIOS.map(() => "---").join("|") + "|---|"];
  estado.equipos
    .map((e) => ({ ...e, total: totalDe(e.id) }))
    .sort((a, b) => b.total - a.total)
    .forEach((e) => {
      l.push(`| ${e.nombre} | ${e.mandato} | ${PITCH_CRITERIOS.map((c) => estado.puntos[e.id][c.id]).join(" | ")} | ${e.total} |`);
    });
  l.push("", `_${PITCH_RECORDATORIO}_`);
  return l.join("\n");
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Sala de pitch", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Sala de pitch</h1>
        <p class="lead">Cinco equipos, cinco mandatos complementarios. Quien no presenta,
        es Comité de Dirección y puntúa. Seis minutos de pitch y tres de preguntas.</p>
      </div>
      <div class="recordatorio">${escapeHtml(PITCH_RECORDATORIO)}</div>

      <div class="tool-part" id="mandatos">
        <div class="tool-part__head"><div><span class="tool-part__num">Los encargos</span><h2>Cinco mandatos</h2></div></div>
        <div class="mandatos" data-mandatos></div>
      </div>

      <div class="tool-part" id="crono">
        <div class="tool-part__head"><div><span class="tool-part__num">En vivo</span><h2>Temporizador</h2></div></div>
        <div class="crono" data-crono-panel data-fase="parado"></div>
      </div>

      <div class="tool-part" id="scoring">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Comité de Dirección</span><h2>Puntuación</h2></div>
          <button class="btn btn--ghost btn--sm" type="button" data-exportar>Exportar resultados (.md)</button>
        </div>
        <p class="muted" style="max-width:74ch">De 0 a 10 en cada criterio. Los pesos y descriptores de la
        evaluación real están en la Guía Académica: esto es la conversación del aula.</p>
        <div class="scroll-x" style="margin-top:var(--sp-4)"><div data-scoring></div></div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Cómo ha quedado",
    entradilla: "El ranking del Comité, en vivo.",
    html: `<p class="reveal-moment__empty">El ranking aparece aquí en cuanto el Comité empiece a puntuar.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<p class="tool-footer">Vuelta a la <a href="/index.html">escaleta</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarMandatos() { app.querySelector("[data-mandatos]").innerHTML = MANDATOS.map(mandatoHtml).join(""); }
function pintarCrono() {
  const panel = app.querySelector("[data-crono-panel]");
  panel.dataset.fase = estado.fase;
  panel.innerHTML = cronoHtml();
}
function pintarScoring() { app.querySelector("[data-scoring]").innerHTML = scoringHtml(); }
function pintarRanking() {
  const { html, pie } = rankingHtml();
  updateRevealMoment(app, "payoff", html, pie);
}

/** Solo el número y la barra, sin repintar el panel (no perder el foco). */
function actualizarReloj() {
  const panel = app.querySelector("[data-crono-panel]");
  const numEl = panel.querySelector("[data-crono-num]");
  if (numEl) numEl.textContent = reloj(estado.restante);
  const totalFase = (estado.fase === "preguntas" ? estado.minPreguntas : estado.minPitch) * 60;
  const barra = panel.querySelector(".crono__barra i");
  if (barra) barra.style.width = `${totalFase > 0 ? Math.max(0, Math.min(100, (estado.restante / totalFase) * 100)) : 0}%`;
}

/* ---------------------------------------------------------- Temporizador */
function parar() {
  estado.corriendo = false;
  if (tick) { clearInterval(tick); tick = null; }
}

function arrancar() {
  if (estado.corriendo) return;
  if (estado.fase === "parado" || estado.fase === "fin") {
    estado.fase = "pitch";
    estado.restante = estado.minPitch * 60;
  }
  estado.corriendo = true;
  pintarCrono();
  // setInterval acumula desfase: nos anclamos a un instante de referencia.
  const finPrevisto = Date.now() + estado.restante * 1000;
  tick = setInterval(() => {
    estado.restante = (finPrevisto - Date.now()) / 1000;
    if (estado.restante <= 0) {
      estado.restante = 0;
      parar();
      // Al acabar el pitch, encadena automáticamente con las preguntas.
      if (estado.fase === "pitch") {
        estado.fase = "preguntas";
        estado.restante = estado.minPreguntas * 60;
        pintarCrono();
        avisar("Se acabó el tiempo de pitch. Turno de preguntas del Comité.");
      } else {
        estado.fase = "fin";
        pintarCrono();
        avisar("Tiempo. Pasamos al siguiente equipo.");
      }
      return;
    }
    actualizarReloj();
  }, 250);
}

function avisar(texto) {
  const el = app.querySelector("[data-crono-aria]");
  if (el) el.textContent = texto;
}

/* ----------------------------------------------------------- Eventos */
app.addEventListener("click", (e) => {
  const activar = e.target.closest("[data-activar]")?.dataset.activar;
  if (activar) {
    estado.equipoActivo = Number(activar);
    parar();
    estado.fase = "parado";
    estado.restante = estado.minPitch * 60;
    pintarMandatos(); pintarCrono();
    app.querySelector("#crono").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const c = e.target.closest("[data-crono]")?.dataset.crono;
  if (c === "toggle") {
    if (estado.corriendo) { parar(); pintarCrono(); } else arrancar();
    return;
  }
  if (c === "preguntas") {
    parar();
    estado.fase = "preguntas";
    estado.restante = estado.minPreguntas * 60;
    pintarCrono();
    arrancar();
    return;
  }
  if (c === "reset") {
    parar();
    estado.fase = "parado";
    estado.restante = estado.minPitch * 60;
    pintarCrono();
    return;
  }

  if (e.target.closest("[data-exportar]")) {
    descargar("pitch-resultados.md", toMarkdown(), "text/markdown;charset=utf-8");
  }
});

app.addEventListener("input", (e) => {
  const eq = e.target.dataset.equipo;
  if (eq) {
    estado.equipos.find((x) => x.id === Number(eq)).nombre = e.target.value;
    pintarScoring(); pintarRanking();
    // El nombre del equipo también aparece en el crono si es el que presenta.
    if (estado.equipoActivo === Number(eq)) pintarCrono();
    return;
  }

  const min = e.target.dataset.min;
  if (min) {
    estado[min] = Math.max(1, Number(e.target.value) || 1);
    if (!estado.corriendo) {
      estado.restante = (estado.fase === "preguntas" ? estado.minPreguntas : estado.minPitch) * 60;
      actualizarReloj();
    }
    return;
  }

  const pe = e.target.dataset.puntoEq;
  if (pe) {
    const v = Math.max(0, Math.min(10, Number(e.target.value) || 0));
    estado.puntos[pe][e.target.dataset.puntoCr] = v;
    app.querySelector(`[data-total="${pe}"]`).textContent = totalDe(pe);
    pintarRanking();
  }
});

/* ------------------------------------------------------------ Arranque */
estado.restante = estado.minPitch * 60;
pintarMandatos();
pintarCrono();
pintarScoring();
pintarRanking();
