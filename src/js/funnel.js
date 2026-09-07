/* =========================================================================
   funnel.js — (a) Mix de captación: reparto de presupuesto con sliders y
                   funnel SVG que se recalcula (alcance → visitas → leads → CPL).
               (b) Cadena de conversión: CTA → lead magnet → landing → formulario,
                   con previsualización de la landing en un marco de móvil.

   No hay reparto correcto. El objetivo es que vean la sensibilidad del modelo
   y tengan que defender su decisión: el sistema calcula, no juzga.
   ========================================================================= */
import {
  Header, Section, AskAIButton, wireAskAI,
  RevealMoment, updateRevealMoment, createStatePanel, escapeHtml, num, appUrl,
} from "../components/index.js";
import CASO from "../data/caso-alimentos.json";

const CANALES = CASO.canales.items;

/* -------------------------------------------------------------- Estado */
const estado = {
  presupuesto: 30000,
  /** { canalId: euros } */
  reparto: Object.fromEntries(CANALES.map((c) => [c.id, 0])),
  /** Supuestos del modelo, ajustables por el alumno. */
  convVisitaLead: 3.5,   // % de visitas que dejan su dato
  convLeadCliente: 8,    // % de leads que acaban comprando
  ticketMedio: 42,       // € por pedido
  /** Cadena de conversión. */
  cadena: {
    cta: "",
    magnetTitulo: "",
    magnetFormato: "",
    landingTitular: "",
    landingPromesa: "",
    campos: [
      { id: "c1", nombre: "Email", obligatorio: true },
    ],
  },
};

/* ------------------------------------------------------- Modelo del funnel */

/**
 * Calcula el embudo a partir del reparto actual.
 * Cada canal aporta impactos (según su CPM, con techo en `alcanceMax`) y
 * visitas (según su CTR). Después se aplican las tasas globales.
 */
function calcular() {
  let impactos = 0, visitas = 0, invertido = 0;
  const porCanal = CANALES.map((c) => {
    const euros = estado.reparto[c.id] || 0;
    invertido += euros;
    const imp = Math.min((euros / c.cpm) * 1000, c.alcanceMax);
    const vis = imp * (c.ctr / 100);
    impactos += imp;
    visitas += vis;
    return { ...c, euros, impactos: imp, visitas: vis, tope: euros > 0 && imp >= c.alcanceMax - 0.5 };
  });

  const leads = visitas * (estado.convVisitaLead / 100);
  const clientes = leads * (estado.convLeadCliente / 100);
  const cpl = leads > 0 ? invertido / leads : null;
  const cac = clientes > 0 ? invertido / clientes : null;
  const ingresos = clientes * estado.ticketMedio;
  const roas = invertido > 0 ? ingresos / invertido : null;

  return { porCanal, invertido, impactos, visitas, leads, clientes, cpl, cac, ingresos, roas };
}

/* ------------------------------------------------------------- Render (a) */

function canalHtml(c, calc) {
  const fila = calc.porCanal.find((x) => x.id === c.id);
  const euros = estado.reparto[c.id] || 0;
  const max = Math.max(estado.presupuesto, 1000);
  return `<div class="canal" data-activo="${euros > 0 ? "si" : "no"}" data-tope="${fila.tope ? "si" : "no"}">
    <div class="canal__head">
      <span class="canal__nombre">${escapeHtml(c.nombre)}<span class="canal__tipo" data-t="${c.tipo}">${c.tipo}</span></span>
      <span class="canal__cifras"><b>${num(euros)} €</b> · ${num(Math.round(fila.impactos))} impactos · ${num(Math.round(fila.visitas))} visitas${fila.tope ? " · tope de alcance" : ""}</span>
    </div>
    <p class="canal__desc">${escapeHtml(c.descripcion)} <span class="fuente">CPM ${c.cpm} € · CTR ${c.ctr}%</span></p>
    <input type="range" min="0" max="${max}" step="${Math.max(100, Math.round(max / 200))}" value="${euros}"
      data-canal="${escapeHtml(c.id)}" aria-label="Presupuesto para ${escapeHtml(c.nombre)}" />
  </div>`;
}

function funnelSvg(calc) {
  const etapas = [
    { lab: "Impactos", v: calc.impactos, color: "rgba(255,255,255,.16)", fg: "#fff" },
    { lab: "Visitas", v: calc.visitas, color: "rgba(10,228,195,.35)", fg: "#fff" },
    { lab: "Leads", v: calc.leads, color: "#0ae4c3", fg: "#00133f" },
    { lab: "Clientes", v: calc.clientes, color: "#ffffff", fg: "#00133f" },
  ];
  const W = 470, H = 320, alto = 62, hueco = 14;
  const maxV = etapas[0].v || 1;
  // Anchura en escala de raíz cuadrada, NO lineal: con caídas de 2,3 M a 128 la
  // escala lineal aplasta los tres tramos de abajo al mismo ancho mínimo y parece
  // que no cae nada. La raíz mantiene el orden visible; las cifras exactas están
  // escritas dentro de cada tramo y el % de caída, a la derecha.
  const ancho = (v) => Math.max(64, Math.sqrt(Math.max(v, 0) / maxV) * (W - 96));

  const tramos = etapas
    .map((e, i) => {
      const y = i * (alto + hueco);
      const w1 = ancho(e.v);
      const siguiente = etapas[i + 1];
      const w2 = ancho(siguiente ? siguiente.v : e.v * 0.55);
      const cx = (W - 62) / 2;                  // centro del embudo (deja aire a la derecha para las tasas)
      const x1 = cx - w1 / 2, x2 = cx - w2 / 2;
      const tasa = siguiente && e.v > 0 ? (siguiente.v / e.v) * 100 : null;
      const anotacion = tasa !== null
        ? `<text x="${W - 4}" y="${y + alto + hueco / 2 + 4}" text-anchor="end" font-size="12" fill="#0ae4c3">${num(tasa, tasa < 1 ? 2 : 1)}%</text>`
        : "";
      return `<g>
        <path d="M${x1} ${y} H${x1 + w1} L${x2 + w2} ${y + alto} H${x2} Z" fill="${e.color}"/>
        <text class="f-num" x="${cx}" y="${y + 30}" text-anchor="middle" font-size="22" fill="${e.fg}">${num(Math.round(e.v))}</text>
        <text x="${cx}" y="${y + 48}" text-anchor="middle" font-size="12" fill="${e.fg}" opacity=".8">${e.lab}</text>
      </g>${anotacion}`;
    })
    .join("");

  return `<svg class="funnel-svg" viewBox="0 0 ${W} ${H}" role="img"
    aria-label="Embudo: ${num(Math.round(calc.impactos))} impactos, ${num(Math.round(calc.visitas))} visitas, ${num(Math.round(calc.leads))} leads, ${num(Math.round(calc.clientes))} clientes">${tramos}</svg>
    <p class="funnel-escala">Anchura en escala de raíz, no proporcional: si no, los tres tramos de abajo
    quedarían idénticos. Las cifras exactas van dentro y el porcentaje que pasa de un tramo al siguiente, a la derecha.</p>`;
}

function panelFunnelHtml(calc) {
  const cpl = calc.cpl === null ? "—" : `${num(calc.cpl, 2)} €`;
  const cac = calc.cac === null ? "—" : `${num(calc.cac, 2)} €`;
  const roas = calc.roas === null ? "—" : `${num(calc.roas, 2)}×`;
  return `${funnelSvg(calc)}
    <div class="funnel-kpis">
      <div class="funnel-kpi"><b>${cpl}</b><span>CPL · coste por lead</span></div>
      <div class="funnel-kpi" data-alerta="${calc.cac !== null && calc.cac > estado.ticketMedio ? "si" : "no"}"><b>${cac}</b><span>CAC · coste por cliente</span></div>
      <div class="funnel-kpi"><b>${num(calc.invertido)} €</b><span>invertido</span></div>
      <div class="funnel-kpi" data-alerta="${calc.roas !== null && calc.roas < 1 ? "si" : "no"}"><b>${roas}</b><span>ROAS con ticket de ${num(estado.ticketMedio)} €</span></div>
    </div>
    <p class="funnel-nota">El modelo aplica el CPM y el CTR orientativos de cada canal y después vuestras
    dos tasas de conversión. Mover un slider cambia el resultado: eso es lo que hay que defender.</p>`;
}

/* ------------------------------------------------------------- Render (b) */

function camposHtml() {
  return estado.cadena.campos
    .map(
      (c) => `<div class="campo-form">
        <input type="text" value="${escapeHtml(c.nombre)}" data-campo-nombre="${escapeHtml(c.id)}"
          placeholder="Nombre del campo" aria-label="Nombre del campo" />
        <select data-campo-obl="${escapeHtml(c.id)}" aria-label="¿Obligatorio?">
          <option value="si"${c.obligatorio ? " selected" : ""}>Obligatorio</option>
          <option value="no"${!c.obligatorio ? " selected" : ""}>Opcional</option>
        </select>
        <button type="button" data-campo-borrar="${escapeHtml(c.id)}" aria-label="Eliminar el campo ${escapeHtml(c.nombre)}">×</button>
      </div>`
    )
    .join("");
}

function movilHtml() {
  const c = estado.cadena;
  const hay = c.landingTitular || c.landingPromesa || c.magnetTitulo;
  if (!hay) {
    return `<div class="movil__pantalla"><p class="movil__vacio">Rellena el titular y la promesa de la
      landing y verás aquí cómo le llega al turista, en el único sitio donde la va a leer: su móvil.</p></div>`;
  }
  const campos = c.campos.length
    ? c.campos
        .map((f) => `<div class="movil__campo" data-op="${f.obligatorio ? "no" : "si"}">
          <b>${escapeHtml(f.nombre || "Campo sin nombre")}</b><i>${f.obligatorio ? "obligatorio" : "opcional"}</i></div>`)
        .join("")
    : `<p class="movil__vacio">Sin campos: no hay formulario.</p>`;

  return `<div class="movil__pantalla">
    ${c.magnetFormato ? `<span class="movil__eyebrow">${escapeHtml(c.magnetFormato)}</span>` : ""}
    <h3 class="movil__titular">${escapeHtml(c.landingTitular || "Titular de la landing")}</h3>
    ${c.landingPromesa ? `<p class="movil__promesa">${escapeHtml(c.landingPromesa)}</p>` : ""}
    ${c.magnetTitulo ? `<p class="movil__magnet">Te llevas: <strong>${escapeHtml(c.magnetTitulo)}</strong></p>` : ""}
    <div class="movil__campos">${campos}</div>
    <div class="movil__optin"><span aria-hidden="true"></span>
      Acepto recibir comunicaciones. Casilla sin marcar por defecto: es obligatorio por RGPD.</div>
    <div class="movil__cta">${escapeHtml(c.cta || "Texto del CTA")}</div>
  </div>`;
}

/* --------------------------------------------------- Payoff (RevealMoment) */

function payoffHtml() {
  const calc = calcular();
  if (!calc.invertido) {
    return {
      html: `<p class="reveal-moment__empty">Reparte el presupuesto entre canales y el embudo se dibuja aquí,
        con el CPL de vuestra decisión.</p>`,
      pie: "",
    };
  }

  // Barras del reparto por canal, ordenadas por inversión.
  const activos = calc.porCanal.filter((c) => c.euros > 0).sort((a, b) => b.euros - a.euros);
  const maxE = activos[0]?.euros || 1;
  const barras = activos
    .map(
      (c) => `<div class="payoff-franja">
        <span class="payoff-franja__lab">${escapeHtml(c.nombre)}</span>
        <span class="payoff-franja__bar"><i style="width:${Math.round((c.euros / maxE) * 100)}%"></i></span>
        <span class="payoff-franja__pct">${num(Math.round((c.euros / calc.invertido) * 100))}%</span>
      </div>`
    )
    .join("");

  const cplTexto = calc.cpl === null ? "—" : `${num(calc.cpl, 2)} €`;
  const online = calc.porCanal.filter((c) => c.tipo === "online").reduce((a, b) => a + b.euros, 0);
  const pctOnline = Math.round((online / calc.invertido) * 100);

  const pie = `Con ${num(calc.invertido)} € repartidos así, salen <strong>${num(Math.round(calc.leads))} leads</strong>
    a <strong>${cplTexto} de CPL</strong> y ${num(Math.round(calc.clientes))} clientes.
    El ${pctOnline}% del presupuesto está en canales online y el ${100 - pctOnline}% en puntos de contacto físicos.
    ${calc.cac !== null && calc.cac > estado.ticketMedio
      ? `<strong>Ojo:</strong> el coste por cliente (${num(calc.cac, 2)} €) supera el ticket medio (${num(estado.ticketMedio)} €).`
      : ""}`;

  return {
    html: `<div style="display:grid;gap:var(--sp-6);grid-template-columns:1fr">
      <div style="max-width:520px;margin-inline:auto;width:100%">${funnelSvg(calc)}</div>
      <div class="payoff-franjas" style="margin-top:0">${barras}</div>
    </div>`,
    pie,
  };
}

/* ------------------------------------------------ Validación estructural */
function checksHtml() {
  const calc = calcular();
  const c = estado.cadena;
  const canalesUsados = calc.porCanal.filter((x) => x.euros > 0).length;
  const obligatorios = c.campos.filter((f) => f.obligatorio).length;

  const items = [
    { ok: calc.invertido > 0, txt: `Presupuesto repartido (ahora: ${num(calc.invertido)} € de ${num(estado.presupuesto)} €).` },
    { ok: canalesUsados >= 3, txt: `Al menos tres canales con inversión (ahora: ${canalesUsados}).` },
    { ok: !!c.cta.trim() && !!c.magnetTitulo.trim(), txt: "CTA y lead magnet definidos." },
    { ok: !!c.landingTitular.trim() && !!c.landingPromesa.trim(), txt: "Landing con titular y promesa." },
    { ok: c.campos.length > 0 && obligatorios > 0 && obligatorios <= 3,
      txt: `Formulario con entre uno y tres campos obligatorios (ahora: ${obligatorios} de ${c.campos.length}).` },
  ];
  return items.map((i) => `<li data-ok="${i.ok ? "si" : "no"}">${escapeHtml(i.txt)}</li>`).join("");
}

/* -------------------------------------------------------- Markdown export */
function toMarkdown() {
  const calc = calcular();
  const c = estado.cadena;
  const l = ["# Plan de acciones online: mix de captación y conversión", "", `_Caso: ${CASO.meta.caso}_`, ""];

  l.push("## Mix de captación", "", `Presupuesto total: **${num(estado.presupuesto)} €** · invertido: **${num(calc.invertido)} €**`, "");
  l.push("| Canal | Tipo | Inversión | % | Impactos | Visitas |", "|---|---|---|---|---|---|");
  calc.porCanal
    .filter((x) => x.euros > 0)
    .sort((a, b) => b.euros - a.euros)
    .forEach((x) => {
      l.push(`| ${x.nombre} | ${x.tipo} | ${num(x.euros)} € | ${num(Math.round((x.euros / (calc.invertido || 1)) * 100))}% | ${num(Math.round(x.impactos))} | ${num(Math.round(x.visitas))} |`);
    });

  l.push("", "### Resultado del modelo", "");
  l.push(`- Impactos: **${num(Math.round(calc.impactos))}**`);
  l.push(`- Visitas: **${num(Math.round(calc.visitas))}**`);
  l.push(`- Leads: **${num(Math.round(calc.leads))}** (conversión visita→lead: ${num(estado.convVisitaLead, 1)}%)`);
  l.push(`- Clientes: **${num(Math.round(calc.clientes))}** (conversión lead→cliente: ${num(estado.convLeadCliente, 1)}%)`);
  l.push(`- **CPL: ${calc.cpl === null ? "—" : `${num(calc.cpl, 2)} €`}** · CAC: ${calc.cac === null ? "—" : `${num(calc.cac, 2)} €`} · ROAS: ${calc.roas === null ? "—" : `${num(calc.roas, 2)}×`}`);

  l.push("", "## Cadena de conversión", "");
  l.push(`- **CTA:** ${c.cta || "_(sin definir)_"}`);
  l.push(`- **Lead magnet:** ${c.magnetTitulo || "_(sin definir)_"}${c.magnetFormato ? ` (${c.magnetFormato})` : ""}`);
  l.push(`- **Landing — titular:** ${c.landingTitular || "_(sin definir)_"}`);
  l.push(`- **Landing — promesa:** ${c.landingPromesa || "_(sin definir)_"}`);
  l.push("", "### Formulario", "");
  if (c.campos.length) {
    l.push("| Campo | Obligatorio |", "|---|---|");
    c.campos.forEach((f) => l.push(`| ${f.nombre || "(sin nombre)"} | ${f.obligatorio ? "Sí" : "No"} |`));
  } else l.push("_(sin campos)_");
  l.push("", "> Consentimiento: casilla de opt-in sin premarcar y, preferiblemente, opt-in doble por email.");
  l.push("", `_Coste y alcance de los canales: ${CASO.canales.fuente}._`);
  return l.join("\n");
}

/* -------------------------------------------------------------- Prompts */
function promptMix() {
  const calc = calcular();
  const reparto = calc.porCanal
    .filter((x) => x.euros > 0)
    .map((x) => `- ${x.nombre} (${x.tipo}): ${x.euros} € — ${Math.round(x.impactos)} impactos, ${Math.round(x.visitas)} visitas`)
    .join("\n");
  return `Estoy diseñando el mix de captación online de un plan para promocionar un producto agroalimentario español entre turistas extranjeros que lo prueban en España y deberían recomprarlo al volver a su país.

Presupuesto: ${estado.presupuesto} €. Este es mi reparto:

${reparto || "(todavía sin reparto)"}

Con mis supuestos (conversión visita→lead ${estado.convVisitaLead}%, lead→cliente ${estado.convLeadCliente}%, ticket medio ${estado.ticketMedio} €) salen ${Math.round(calc.leads)} leads y un CPL de ${calc.cpl === null ? "—" : calc.cpl.toFixed(2)} €.

Haz tres cosas:
1. Critica mi reparto: qué canal está sobreponderado y cuál infrautilizado, y por qué, dado que el impacto ocurre en España y la compra en el país de origen.
2. Dime qué supuesto de mi modelo es el más frágil y qué haría falta para validarlo.
3. Si me recortaran el presupuesto un 30%, ¿qué canal cortarías primero y con qué argumento?

No inventes benchmarks del sector: razona sobre mis números.`;
}

function promptCadena() {
  const c = estado.cadena;
  return `Estoy diseñando la cadena de conversión de una marca de alimentación española que capta leads entre turistas extranjeros mientras están de viaje en España.

- CTA: ${c.cta || "(sin definir)"}
- Lead magnet: ${c.magnetTitulo || "(sin definir)"} ${c.magnetFormato ? `(formato: ${c.magnetFormato})` : ""}
- Titular de la landing: ${c.landingTitular || "(sin definir)"}
- Promesa: ${c.landingPromesa || "(sin definir)"}
- Campos del formulario: ${c.campos.map((f) => `${f.nombre}${f.obligatorio ? " (obligatorio)" : " (opcional)"}`).join(", ") || "(ninguno)"}

Haz tres cosas:
1. Dime si mi lead magnet es algo que alguien de vacaciones querría guardar en el móvil, y por qué sí o por qué no.
2. Propón tres titulares alternativos para la landing, más concretos que el mío.
3. Señala qué campo del formulario sobra y qué campo, si acaso, merece la pena añadir.

No añadas descuentos ni promociones: el planteamiento es de contenido de valor.`;
}

/* ------------------------------------------------------------ Composición */

const app = document.querySelector("#app");
const calcInicial = calcular();

app.innerHTML = [
  Header({
    variant: "light",
    breadcrumb: [{ label: "Hub", href: "/index.html" }, { label: "Mix y conversión", current: true }],
    nav: [{ label: "Hub", href: "/index.html" }, { label: "M2", href: "/decks/m2.html" }],
  }),

  Section({
    variant: "light", wide: true, tag: "main", id: "contenido",
    html: `
      <div class="tool-intro">
        <h1>Mix de captación y cadena de conversión</h1>
        <p class="lead">Repartid un presupuesto entre canales y ved el embudo recalcularse. Después,
        construid la cadena que convierte una visita en un email.</p>
        <span class="fuente">${escapeHtml(CASO.canales.fuente)}</span>
      </div>

      <div class="tool-part" id="mix">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Mix de captación</h2></div>
        </div>

        <div class="presupuesto">
          <div>
            <div class="presupuesto__lab"><label for="presupuesto">Presupuesto total del plan (€)</label></div>
            <input id="presupuesto" type="number" min="1000" step="1000" value="${estado.presupuesto}" data-presupuesto />
          </div>
          <div class="presupuesto__restante" data-restante>
            <b>${num(estado.presupuesto)} €</b>
            <span class="presupuesto__lab">sin asignar</span>
          </div>
        </div>

        <div class="mix" style="margin-top:var(--sp-5)">
          <div>
            <div class="canales" data-canales></div>

            <h3 style="margin-top:var(--sp-6)">Supuestos del modelo</h3>
            <p class="muted small" style="max-width:70ch">Estos tres números son vuestros. Cambiadlos y defended
            de dónde salen: el modelo obedece, no valida.</p>
            <div class="supuestos">
              <div class="supuesto">
                <label for="s-vl">Conversión visita → lead</label>
                <div class="supuesto__val" data-val-vl>${num(estado.convVisitaLead, 1)}%</div>
                <input id="s-vl" type="range" min="0.2" max="15" step="0.1" value="${estado.convVisitaLead}" data-sup="convVisitaLead" />
              </div>
              <div class="supuesto">
                <label for="s-lc">Conversión lead → cliente</label>
                <div class="supuesto__val" data-val-lc>${num(estado.convLeadCliente, 1)}%</div>
                <input id="s-lc" type="range" min="0.5" max="40" step="0.5" value="${estado.convLeadCliente}" data-sup="convLeadCliente" />
              </div>
              <div class="supuesto">
                <label for="s-tm">Ticket medio (€)</label>
                <div class="supuesto__val" data-val-tm>${num(estado.ticketMedio)} €</div>
                <input id="s-tm" type="range" min="5" max="200" step="1" value="${estado.ticketMedio}" data-sup="ticketMedio" />
              </div>
            </div>
          </div>

          <aside class="funnel-panel" data-funnel aria-label="Resultado del embudo">${panelFunnelHtml(calcInicial)}</aside>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="mix">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="mix" hidden>
            <p><strong>No hay un reparto correcto.</strong> Lo que se evalúa es si sabéis explicar el vuestro.
            Preguntas que ayudan:</p>
            <ul>
              <li>El impacto ocurre en España y la compra en el país de origen: ¿qué canal cubre cada mitad?</li>
              <li>Mirad el CPL y después subid el ticket medio: ¿en qué punto deja de tener sentido el canal más caro?</li>
              <li>Si un canal llega a su tope de alcance, el euro siguiente no compra nada. ¿Lo estáis viendo?</li>
              <li>Un canal con CPM bajo y CTR bajo no es barato: es barato por impacto y caro por visita.</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "mix", label: "Copiar prompt: criticar mi reparto", hint: "Copia tu reparto y tus supuestos, y pide que te discutan las decisiones." })}
        </div>
      </div>

      <div class="tool-part" id="conversion">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Cadena de conversión</h2></div>
        </div>

        <div class="cadena">
          <div>
            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">01</span><h3 class="eslabon__t">CTA</h3></div>
              <p class="eslabon__ayuda">El botón o el link. Tiene que invitar a una acción concreta, no a «saber más».</p>
              <div class="field">
                <label for="cta">Texto del CTA</label>
                <input id="cta" type="text" data-cadena="cta" value="${escapeHtml(estado.cadena.cta)}"
                  placeholder="Descárgate la ruta del aceite en Córdoba" />
              </div>
            </div>

            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">02</span><h3 class="eslabon__t">Lead magnet</h3></div>
              <p class="eslabon__ayuda">Contenido gratuito que exige un dato. Que sea algo que quiera guardar en el móvil.</p>
              <div class="fields fields--2">
                <div class="field">
                  <label for="magnet-t">Qué se lleva</label>
                  <input id="magnet-t" type="text" data-cadena="magnetTitulo" value="${escapeHtml(estado.cadena.magnetTitulo)}"
                    placeholder="Guía: cómo leer la etiqueta de un aceite" />
                </div>
                <div class="field">
                  <label for="magnet-f">Formato</label>
                  <input id="magnet-f" type="text" data-cadena="magnetFormato" value="${escapeHtml(estado.cadena.magnetFormato)}"
                    placeholder="PDF, mapa, test, vídeo…" />
                </div>
              </div>
            </div>

            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">03</span><h3 class="eslabon__t">Landing</h3></div>
              <p class="eslabon__ayuda">Página de cierre: disipa la duda y conduce al formulario. Se lee en un móvil, de pie.</p>
              <div class="field">
                <label for="l-tit">Titular</label>
                <input id="l-tit" type="text" data-cadena="landingTitular" value="${escapeHtml(estado.cadena.landingTitular)}"
                  placeholder="El aceite que has probado tiene nombre" />
              </div>
              <div class="field" style="margin-top:var(--sp-3)">
                <label for="l-pro">Promesa</label>
                <textarea id="l-pro" rows="2" data-cadena="landingPromesa"
                  placeholder="Qué obtiene exactamente y por qué le sirve.">${escapeHtml(estado.cadena.landingPromesa)}</textarea>
              </div>
            </div>

            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">04</span><h3 class="eslabon__t">Formulario</h3></div>
              <p class="eslabon__ayuda">Los campos justos para informar sin provocar abandono. Cada campo de más es gente que se va.</p>
              <div class="campos-form" data-campos></div>
              <button class="btn btn--secondary btn--sm" type="button" data-anadir-campo style="margin-top:var(--sp-3)">+ Añadir campo</button>

              <div class="optin-aviso">
                <div><strong>Opt-in, siempre.</strong> El consentimiento tiene que ser previo, expreso y trazable.
                La casilla premarcada es ilegal desde el 25 de mayo de 2018. Y como el lead se capta en España
                pero se le escribe cuando ya está en su país, el consentimiento tiene que cubrir eso desde el
                primer momento. Mejor todavía: <strong>opt-in doble</strong>.</div>
              </div>
            </div>
          </div>

          <aside class="movil" aria-label="Previsualización de la landing en móvil">
            <div class="movil__marco">
              <div class="movil__notch" aria-hidden="true"></div>
              <div data-movil></div>
            </div>
            <p class="movil__pie">Así lo ve el turista: de pie, con una mano y con prisa.</p>
          </aside>
        </div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="conv">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="conv" hidden>
            <p>Preguntas que ayudan a revisar la cadena:</p>
            <ul>
              <li>Leed el CTA en voz alta: ¿dice qué pasa si lo pulso?</li>
              <li>¿Vuestro lead magnet sigue sirviendo dos semanas después, ya en su casa?</li>
              <li>Tapad el logo de la landing: ¿se entiende igual de qué va?</li>
              <li>Por cada campo del formulario, preguntad: ¿qué haremos exactamente con ese dato?</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${AskAIButton({ id: "cadena", label: "Copiar prompt: revisar mi cadena", hint: "Copia tu CTA, magnet, landing y formulario, y pide alternativas." })}
        </div>
      </div>`,
  }),

  RevealMoment({
    id: "payoff",
    titulo: "Lo que compra vuestro presupuesto",
    entradilla: "El embudo con vuestros números y el reparto que lo produce. Mover un slider lo cambia entero.",
    html: `<p class="reveal-moment__empty">Reparte el presupuesto y el embudo aparecerá aquí.</p>`,
  }),

  Section({
    variant: "light", wide: true,
    html: `<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza: <a href="${appUrl("/tools/nurturing.html")}">scoring y workflow de los 90 días</a>.</p>`,
  }),
].join("");

/* ------------------------------------------------------------- Refresco */
function pintarCanales() {
  const calc = calcular();
  app.querySelector("[data-canales]").innerHTML = CANALES.map((c) => canalHtml(c, calc)).join("");
}
function pintarFunnel() { app.querySelector("[data-funnel]").innerHTML = panelFunnelHtml(calcular()); }
function pintarRestante() {
  const calc = calcular();
  const restante = estado.presupuesto - calc.invertido;
  const el = app.querySelector("[data-restante]");
  el.querySelector("b").textContent = `${num(restante)} €`;
  el.dataset.estado = restante < 0 ? "pasado" : restante === 0 ? "ok" : "";
  el.querySelector("span").textContent = restante < 0 ? "por encima del presupuesto" : "sin asignar";
}
function pintarCampos() { app.querySelector("[data-campos]").innerHTML = camposHtml(); }
function pintarMovil() { app.querySelector("[data-movil]").innerHTML = movilHtml(); }
function pintarChecks() { app.querySelector("[data-checks]").innerHTML = checksHtml(); }
function pintarPayoff() {
  const { html, pie } = payoffHtml();
  updateRevealMoment(app, "payoff", html, pie);
}

/** Todo lo que depende del reparto (sin repintar los sliders, para no perder el arrastre). */
function refrescarMix({ canales = false } = {}) {
  if (canales) pintarCanales();
  else {
    // Solo actualiza las cifras de cada canal, sin tocar los <input type=range>.
    const calc = calcular();
    calc.porCanal.forEach((x) => {
      const slider = app.querySelector(`[data-canal="${x.id}"]`);
      if (!slider) return;
      const caja = slider.closest(".canal");
      caja.dataset.activo = x.euros > 0 ? "si" : "no";
      caja.dataset.tope = x.tope ? "si" : "no";
      caja.querySelector(".canal__cifras").innerHTML =
        `<b>${num(x.euros)} €</b> · ${num(Math.round(x.impactos))} impactos · ${num(Math.round(x.visitas))} visitas${x.tope ? " · tope de alcance" : ""}`;
    });
  }
  pintarFunnel();
  pintarRestante();
  pintarChecks();
  pintarPayoff();
}

/* --------------------------------------------------------- Eventos: mix */
app.addEventListener("input", (e) => {
  const canal = e.target.dataset.canal;
  if (canal) { estado.reparto[canal] = Number(e.target.value); refrescarMix(); return; }

  const sup = e.target.dataset.sup;
  if (sup) {
    estado[sup] = Number(e.target.value);
    app.querySelector("[data-val-vl]").textContent = `${num(estado.convVisitaLead, 1)}%`;
    app.querySelector("[data-val-lc]").textContent = `${num(estado.convLeadCliente, 1)}%`;
    app.querySelector("[data-val-tm]").textContent = `${num(estado.ticketMedio)} €`;
    refrescarMix();
    return;
  }

  if (e.target.dataset.presupuesto !== undefined) {
    estado.presupuesto = Math.max(0, Number(e.target.value) || 0);
    refrescarMix({ canales: true });   // los sliders cambian de max
    return;
  }

  /* ------------------------------------------------ Eventos: cadena */
  const campo = e.target.dataset.cadena;
  if (campo) { estado.cadena[campo] = e.target.value; pintarMovil(); pintarChecks(); return; }

  const nombre = e.target.dataset.campoNombre;
  if (nombre) {
    estado.cadena.campos.find((c) => c.id === nombre).nombre = e.target.value;
    pintarMovil(); pintarChecks();
  }
});

app.addEventListener("change", (e) => {
  const obl = e.target.dataset.campoObl;
  if (!obl) return;
  estado.cadena.campos.find((c) => c.id === obl).obligatorio = e.target.value === "si";
  pintarMovil(); pintarChecks();
});

let contadorCampo = 1;
app.addEventListener("click", (e) => {
  if (e.target.closest("[data-anadir-campo]")) {
    contadorCampo++;
    estado.cadena.campos.push({ id: `c${Date.now()}-${contadorCampo}`, nombre: "", obligatorio: false });
    pintarCampos(); pintarMovil(); pintarChecks();
    return;
  }
  const borrar = e.target.closest("[data-campo-borrar]")?.dataset.campoBorrar;
  if (borrar) {
    estado.cadena.campos = estado.cadena.campos.filter((c) => c.id !== borrar);
    pintarCampos(); pintarMovil(); pintarChecks();
  }
});

/* ------------------------------------------------------------- Pistas */
app.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pista]");
  if (!btn) return;
  const txt = app.querySelector(`[data-pista-texto="${btn.dataset.pista}"]`);
  txt.hidden = !txt.hidden;
  btn.textContent = txt.hidden ? "Pista · ¿dónde miro?" : "Ocultar la pista";
});

/* ------------------------------------------------------ AskAI + StatePanel */
wireAskAI(app, { mix: promptMix, cadena: promptCadena });

createStatePanel({
  mount: app.querySelector("[data-statepanel]"),
  toolId: "funnel",
  nombreArchivo: "mix-y-conversion",
  getState: () => structuredClone(estado),
  setState: (nuevo) => {
    estado.presupuesto = Number(nuevo.presupuesto) || estado.presupuesto;
    estado.reparto = Object.fromEntries(CANALES.map((c) => [c.id, Number(nuevo.reparto?.[c.id]) || 0]));
    ["convVisitaLead", "convLeadCliente", "ticketMedio"].forEach((k) => {
      if (typeof nuevo[k] === "number") estado[k] = nuevo[k];
    });
    if (nuevo.cadena) {
      estado.cadena = {
        cta: nuevo.cadena.cta || "", magnetTitulo: nuevo.cadena.magnetTitulo || "",
        magnetFormato: nuevo.cadena.magnetFormato || "", landingTitular: nuevo.cadena.landingTitular || "",
        landingPromesa: nuevo.cadena.landingPromesa || "",
        campos: Array.isArray(nuevo.cadena.campos) && nuevo.cadena.campos.length
          ? nuevo.cadena.campos.map((c, i) => ({ id: c.id || `imp${i}`, nombre: c.nombre || "", obligatorio: !!c.obligatorio }))
          : [{ id: "c1", nombre: "Email", obligatorio: true }],
      };
    }
    // Vuelca los valores en los controles y repinta todo.
    app.querySelector("[data-presupuesto]").value = estado.presupuesto;
    app.querySelector('[data-sup="convVisitaLead"]').value = estado.convVisitaLead;
    app.querySelector('[data-sup="convLeadCliente"]').value = estado.convLeadCliente;
    app.querySelector('[data-sup="ticketMedio"]').value = estado.ticketMedio;
    app.querySelector("[data-val-vl]").textContent = `${num(estado.convVisitaLead, 1)}%`;
    app.querySelector("[data-val-lc]").textContent = `${num(estado.convLeadCliente, 1)}%`;
    app.querySelector("[data-val-tm]").textContent = `${num(estado.ticketMedio)} €`;
    app.querySelectorAll("[data-cadena]").forEach((el) => { el.value = estado.cadena[el.dataset.cadena] || ""; });
    pintarCampos(); pintarMovil();
    refrescarMix({ canales: true });
  },
  toMarkdown,
});

/* ------------------------------------------------------------ Arranque */
pintarCanales();
pintarCampos();
pintarMovil();
refrescarMix();
