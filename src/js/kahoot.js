/* =========================================================================
   kahoot.js — Enlaces a los tres Kahoots. El profesor pega URL y PIN en vivo
   (o los deja escritos en contenido.js antes de clase).

   Las preguntas y las respuestas viven en la plataforma Kahoot!, nunca aquí:
   este proyecto es material de alumno y no puede contener soluciones.
   ========================================================================= */
import { Header, Section, escapeHtml, appUrl,
} from "../components/index.js";
import { KAHOOTS } from "../data/contenido.js";

function cardHtml(k) {
  return `<article class="kcard">
    <span class="kcard__when">${escapeHtml(k.momento)}</span>
    <h2 class="kcard__title">${escapeHtml(k.titulo)}</h2>
    <p class="kcard__valida"><strong>Valida:</strong> ${escapeHtml(k.valida)}</p>

    <div class="kfield">
      <label for="url-${k.id}">URL / enlace de la partida</label>
      <input id="url-${k.id}" type="url" inputmode="url" data-url="${k.id}"
        placeholder="https://kahoot.it/…" value="${escapeHtml(k.url)}" />
    </div>
    <div class="kfield">
      <label for="pin-${k.id}">PIN de la partida</label>
      <input id="pin-${k.id}" type="text" inputmode="numeric" data-pin="${k.id}"
        placeholder="123456" value="${escapeHtml(k.pin)}" />
    </div>
    <p class="kpin" id="pinshow-${k.id}" aria-live="polite" hidden></p>

    <a class="kcard__open" id="open-${k.id}" data-open="${k.id}" href="#"
       target="_blank" rel="noopener noreferrer" aria-disabled="true">▶ Abrir ${escapeHtml(k.titulo)}</a>
  </article>`;
}

const app = document.querySelector("#app");
app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Kahoots", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }],
  }),
  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Kahoots</h1>
        <p class="lead">Pega aquí la URL y el PIN de cada partida; el botón abre Kahoot! en una pestaña nueva.
        El PIN grande se proyecta para que los alumnos se unan.</p>
        <p class="small muted">Los tres validan <strong>conceptos</strong>, no cifras del dataset.</p>
      </div>
      <div class="kahoots">${KAHOOTS.map(cardHtml).join("")}</div>`,
  }),
  Section({
    variant: "light", wide: true,
    html: `<p class="tool-footer">Vuelta a la <a href="${appUrl("/index.html")}">escaleta</a>.</p>`,
  }),
].join("");

/* --------------------------- Estado de cada tarjeta --------------------------- */
function sincronizar(k) {
  const url = app.querySelector(`[data-url="${k.id}"]`).value.trim();
  const pin = app.querySelector(`[data-pin="${k.id}"]`).value.trim();
  const open = app.querySelector(`[data-open="${k.id}"]`);
  // Solo aceptamos http(s): evita que un pegado accidental cree un enlace raro.
  const valida = /^https?:\/\//i.test(url);
  open.href = valida ? url : "#";
  open.setAttribute("aria-disabled", valida ? "false" : "true");

  const pinShow = app.querySelector(`#pinshow-${k.id}`);
  if (pin) { pinShow.textContent = `PIN ${pin}`; pinShow.hidden = false; }
  else { pinShow.hidden = true; pinShow.textContent = ""; }
}
KAHOOTS.forEach(sincronizar);

app.addEventListener("input", (e) => {
  const id = e.target.dataset.url || e.target.dataset.pin;
  if (id) sincronizar(KAHOOTS.find((k) => k.id === id));
});

/* Evita navegar a "#" si todavía no hay URL válida. */
app.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open && open.getAttribute("aria-disabled") === "true") e.preventDefault();
});
