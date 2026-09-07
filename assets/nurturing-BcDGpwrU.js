import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{a as s,o as c,t as l}from"./_util-P6weWh_n.js";import{t as u}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var d=[{id:`aleman`,label:`Viene de Alemania`,cat:`perfil`},{id:`familia`,label:`Viaja en familia`,cat:`perfil`},{id:`repite`,label:`Repite destino`,cat:`perfil`},{id:`gourmet`,label:`Interés gastronómico declarado`,cat:`perfil`},{id:`descarga`,label:`Se descargó el lead magnet`,cat:`comportamiento`},{id:`abre`,label:`Abre todos los emails`,cat:`comportamiento`},{id:`clic`,label:`Ha hecho clic en producto`,cat:`comportamiento`},{id:`visita`,label:`Ha vuelto a la web`,cat:`comportamiento`},{id:`envio`,label:`Ha mirado los gastos de envío`,cat:`comportamiento`},{id:`almazara`,label:`Vino de una visita a almazara`,cat:`origen`},{id:`hotel`,label:`Vino del QR del hotel`,cat:`origen`},{id:`ads`,label:`Vino de una campaña de pago`,cat:`origen`}],f=[{id:`l01`,nombre:`Anke, 52`,rasgos:[`aleman`,`gourmet`,`almazara`,`descarga`,`abre`,`clic`]},{id:`l02`,nombre:`Tomas, 34`,rasgos:[`aleman`,`hotel`,`descarga`]},{id:`l03`,nombre:`Birgit y Klaus, 60`,rasgos:[`aleman`,`repite`,`gourmet`,`almazara`,`abre`,`envio`]},{id:`l04`,nombre:`Sofie, 29`,rasgos:[`ads`,`descarga`]},{id:`l05`,nombre:`Familia Meyer`,rasgos:[`aleman`,`familia`,`hotel`,`descarga`,`abre`]},{id:`l06`,nombre:`Jonas, 41`,rasgos:[`ads`,`clic`,`visita`,`envio`]},{id:`l07`,nombre:`Petra, 47`,rasgos:[`aleman`,`gourmet`,`abre`,`clic`,`visita`,`envio`]},{id:`l08`,nombre:`Lukas, 26`,rasgos:[`ads`]},{id:`l09`,nombre:`Ingrid, 58`,rasgos:[`aleman`,`repite`,`almazara`,`descarga`,`abre`,`clic`,`visita`]},{id:`l10`,nombre:`Marc, 38`,rasgos:[`familia`,`hotel`]},{id:`l11`,nombre:`Hanna, 44`,rasgos:[`aleman`,`gourmet`,`descarga`,`visita`]},{id:`l12`,nombre:`Erik, 31`,rasgos:[`ads`,`descarga`,`abre`]}],p={email:{label:`Email`,ico:`✉`},espera:{label:`Espera`,ico:`⏱`},condicion:{label:`Condición`,ico:`⑂`}},m=[`abre el email`,`hace clic`,`no abre`,`vuelve a la web`,`compra`],h={criterios:[{id:`cr1`,rasgo:`descarga`,nombre:`Se descargó el lead magnet`,cat:`comportamiento`,puntos:20},{id:`cr2`,rasgo:`clic`,nombre:`Ha hecho clic en producto`,cat:`comportamiento`,puntos:25},{id:`cr3`,rasgo:`gourmet`,nombre:`Interés gastronómico declarado`,cat:`perfil`,puntos:15},{id:`cr4`,rasgo:`almazara`,nombre:`Vino de una visita a almazara`,cat:`origen`,puntos:20}],umbralTemplado:25,umbralCaliente:55,rasgosLead:Object.fromEntries(f.map(e=>[e.id,[...e.rasgos]])),nodos:[{id:`n1`,tipo:`email`,dia:1,asunto:``,objetivo:``}]};function g(e){let t=h.rasgosLead[e]||[];return h.criterios.reduce((e,n)=>e+(t.includes(n.rasgo)&&Number(n.puntos)||0),0)}function _(e){return e>=h.umbralCaliente?`caliente`:e>=h.umbralTemplado?`templado`:`frio`}var v=()=>h.criterios.reduce((e,t)=>e+Math.max(0,Number(t.puntos)||0),0);function y(e){return`<div class="criterio">
    <div>
      <span class="criterio__cat" data-c="${c(e.cat)}">${c(e.cat)}</span>
      <input type="text" value="${c(e.nombre)}" data-cr-nombre="${c(e.id)}" aria-label="Nombre del criterio" />
    </div>
    <input type="number" value="${e.puntos}" step="5" data-cr-puntos="${c(e.id)}" aria-label="Puntos del criterio ${c(e.nombre)}" />
    <button type="button" data-cr-borrar="${c(e.id)}" aria-label="Eliminar el criterio ${c(e.nombre)}">×</button>
  </div>`}function b(){let e=new Set(h.criterios.map(e=>e.rasgo)),t=d.filter(t=>!e.has(t.id));return t.length?`<div class="row">
    <select data-nuevo-rasgo aria-label="Rasgo a añadir como criterio">
      ${t.map(e=>`<option value="${e.id}">${c(e.label)} · ${e.cat}</option>`).join(``)}
    </select>
    <button class="btn btn--secondary btn--sm" type="button" data-anadir-criterio>+ Añadir criterio</button>
  </div>`:`<p class="small muted">Ya has usado todos los rasgos disponibles como criterio.</p>`}function x(){let e=v()||1;return f.slice().map(e=>({...e,p:g(e.id)})).sort((e,t)=>t.p-e.p).map(t=>{let n=_(t.p),r=h.rasgosLead[t.id]||[],i=d.map(e=>`<button class="lead-rasgo" type="button" data-rasgo="${c(e.id)}" data-lead="${c(t.id)}"
          aria-pressed="${r.includes(e.id)}">${c(e.label)}</button>`).join(``);return`<div class="lead-fila" data-nivel="${n}">
        <div>
          <span class="lead-fila__nombre">${c(t.nombre)}</span>
          <div class="lead-rasgos">${i}</div>
        </div>
        <div>
          <span class="lead-fila__score">${t.p}</span>
          <span class="lead-fila__nivel">${n} · ${Math.round(t.p/e*100)}%</span>
        </div>
      </div>`}).join(``)}function S(){let e=v()||1,t=Math.min(100,Math.round(h.umbralTemplado/e*100)),n=Math.min(100,Math.round(h.umbralCaliente/e*100)),r={frio:0,templado:0,caliente:0};return f.forEach(e=>r[_(g(e.id))]++),`<h3>La escala que sale de tus pesos</h3>
    <p class="escala__lead">Máximo posible con tus criterios: <strong>${e} puntos</strong>.
    El sistema calcula; los cortes los pones tú.</p>
    <div class="escala__barra" role="img" aria-label="Escala de scoring">
      <i style="width:${t}%;background:rgba(255,255,255,.28)"></i>
      <i style="width:${Math.max(0,n-t)}%;background:#ffb02e"></i>
      <i style="width:${Math.max(0,100-n)}%;background:var(--c-accent)"></i>
    </div>
    <div class="escala__tramos">
      <span>Frío · ${r.frio} leads</span>
      <span>Templado · ${r.templado}</span>
      <span>Caliente · ${r.caliente}</span>
    </div>
    <div class="fields fields--2" style="margin-top:var(--sp-4)">
      <div class="field">
        <label for="ut" style="color:#fff">Corte «templado»</label>
        <input id="ut" type="number" value="${h.umbralTemplado}" step="5" data-umbral="umbralTemplado" />
      </div>
      <div class="field">
        <label for="uc" style="color:#fff">Corte «caliente»</label>
        <input id="uc" type="number" value="${h.umbralCaliente}" step="5" data-umbral="umbralCaliente" />
      </div>
    </div>
    <div class="leads" data-leads>${x()}</div>`}function C(e,t,n){let r=p[e.tipo],i=``;return i=e.tipo===`email`?`<div class="wf-nodo__campos wf-nodo__campos--2">
      <input type="text" value="${c(e.asunto||``)}" data-nodo="${e.id}" data-campo="asunto" placeholder="Asunto del email" aria-label="Asunto" />
      <input type="text" value="${c(e.objetivo||``)}" data-nodo="${e.id}" data-campo="objetivo" placeholder="Objetivo de este email" aria-label="Objetivo" />
    </div>`:e.tipo===`espera`?`<div class="wf-nodo__campos">
      <input type="number" min="1" max="90" value="${e.dias||7}" data-nodo="${e.id}" data-campo="dias" aria-label="Días de espera" />
    </div>`:`<div class="wf-nodo__campos wf-nodo__campos--2">
      <select data-nodo="${e.id}" data-campo="condicion" aria-label="Condición">
        ${m.map(t=>`<option value="${c(t)}"${t===e.condicion?` selected`:``}>${c(t)}</option>`).join(``)}
      </select>
      <input type="text" value="${c(e.siNo||``)}" data-nodo="${e.id}" data-campo="siNo"
        placeholder="Si no se cumple, ¿qué hacemos?" aria-label="Rama alternativa" />
    </div>`,`<div class="wf-nodo wf-nodo--${e.tipo}">
    <div class="wf-nodo__ico" aria-hidden="true">${r.ico}</div>
    <div class="wf-nodo__cuerpo">
      <div><span class="wf-nodo__tipo">${r.label}</span>
        <span class="wf-nodo__dia">día ${w(t)}</span></div>
      ${i}
    </div>
    <div class="wf-nodo__acciones">
      <button type="button" data-mover="${e.id}" data-dir="-1" ${t===0?`disabled`:``} aria-label="Subir">▲</button>
      <button type="button" data-mover="${e.id}" data-dir="1" ${t===n-1?`disabled`:``} aria-label="Bajar">▼</button>
      <button type="button" data-borrar-nodo="${e.id}" aria-label="Eliminar nodo">×</button>
    </div>
  </div>`}function w(e){let t=1;for(let n=0;n<e;n++)h.nodos[n].tipo===`espera`&&(t+=Number(h.nodos[n].dias)||0);return t}var T=()=>w(h.nodos.length);function E(){return h.nodos.length?`<div class="wf-lista">${h.nodos.map((e,t)=>C(e,t,h.nodos.length)+(t<h.nodos.length-1?`<div class="wf-conector" aria-hidden="true"></div>`:``)).join(``)}</div>`:`<p class="wf-vacio">Workflow vacío. Añade el primer email de bienvenida.</p>`}function D(){let e=h.nodos.map((e,t)=>({n:e,i:t,dia:w(t)})).filter(e=>e.n.tipo===`email`).map(e=>`<span class="wf-regla__marca" style="left:${Math.min(100,e.dia/90*100)}%"><span>día ${e.dia}</span></span>`).join(``),t=T();return`<div class="wf-regla__linea">${e}</div>
    <div class="wf-regla__eje">
      <span>Vuelo de vuelta</span>
      <span>día 45</span>
      <span>día 90 · fin de la ventana</span>
    </div>
    <p class="small muted" style="margin-top:var(--sp-2)">Tu workflow dura <strong>${t} días</strong>
    ${t>90?`— te sales de la ventana de 90 días del caso.`:`y deja ${90-t} días de la ventana sin usar.`}</p>`}function O({paraDescarga:e=!1}={}){let t=h.nodos,n=Math.max(120,t.length*108+40),r=e?`#00133f`:`none`,i=t.map((e,n)=>{let r=20+n*108,i=e.tipo===`email`?`#0ae4c3`:e.tipo===`espera`?`#ffb02e`:`#b79bff`,a=e.tipo===`email`?e.asunto||`Email sin asunto`:e.tipo===`espera`?`Esperar ${e.dias||0} días`:`Si ${e.condicion||`…`}`,o=e.tipo===`email`?e.objetivo||`sin objetivo definido`:e.tipo===`condicion`?e.siNo?`si no: ${e.siNo}`:`sin rama alternativa`:``,s=(e,t)=>e.length>t?`${e.slice(0,t-1)}…`:e,l=n<t.length-1?`<path d="M130 ${r+74} V${r+74+34-8}" stroke="${i}" stroke-width="2" fill="none"/>
           <path d="M125 ${r+74+34-12} L130 ${r+74+34-4} L135 ${r+74+34-12} Z" fill="${i}"/>`:``;return`<g>
        <rect x="30" y="${r}" width="200" height="74" rx="12"
          fill="${i}" fill-opacity="0.14" stroke="${i}" stroke-width="1.5"/>
        <text class="wf-t" x="42" y="${r+22}" font-size="11" fill="${i}"
          style="text-transform:uppercase;letter-spacing:1px">${p[e.tipo].label} · día ${w(n)}</text>
        <text class="wf-t" x="42" y="${r+44}" font-size="15" fill="#ffffff">${c(s(a,26))}</text>
        <text x="42" y="${r+62}" font-size="11" fill="#ffffff" opacity=".7">${c(s(o,32))}</text>
      </g>${l}`}).join(``);return`<svg class="wf-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 ${n}" width="260" height="${n}"
    role="img" aria-label="Esquema del workflow de nurturing con ${t.length} pasos">
    <rect width="260" height="${n}" fill="${r}"/>${i}</svg>`}function k(){let e=h.nodos.filter(e=>e.tipo===`email`);if(!e.length)return{html:`<p class="reveal-moment__empty">Añade emails, esperas y condiciones: el esquema se dibuja solo.</p>`,pie:``};let t=T(),n=e.filter(e=>e.asunto?.trim()).length,r=h.nodos.filter(e=>e.tipo===`condicion`).length,i=`<strong>${e.length} emails</strong> repartidos en <strong>${t} días</strong>,
    con ${r} bifurcación${r===1?``:`es`} por comportamiento
    (${n} de ${e.length} con asunto escrito).
    ${t>90?`Se sale de la ventana de 90 días: para entonces la despensa ya se ha llenado con otra cosa.`:`Quedan ${90-t} días de la ventana sin tocar.`}
    Si no hay ninguna condición, esto no es nurturing: es una secuencia de envíos.`;return{html:`<div style="display:flex;justify-content:center">${O()}</div>`,pie:i}}function A(){let e=h.nodos.filter(e=>e.tipo===`email`),t=new Set(h.criterios.map(e=>e.cat)),n=T();return[{ok:h.criterios.length>=3,txt:`Al menos tres criterios de scoring (ahora: ${h.criterios.length}).`},{ok:t.size>=2,txt:`Criterios de al menos dos categorías —perfil, comportamiento u origen— (ahora: ${t.size}).`},{ok:h.umbralCaliente>h.umbralTemplado,txt:`El corte «caliente» está por encima del corte «templado».`},{ok:e.length>=3,txt:`Al menos tres emails en el workflow (ahora: ${e.length}).`},{ok:e.length>0&&e.every(e=>e.asunto?.trim()&&e.objetivo?.trim()),txt:`Todos los emails con asunto y objetivo.`},{ok:h.nodos.some(e=>e.tipo===`condicion`),txt:`Al menos una condición por comportamiento.`},{ok:n<=90,txt:`El workflow cabe en la ventana de 90 días (ahora: ${n} días).`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${c(e.txt)}</li>`).join(``)}function j(){let e=[`# Lead scoring y workflow de nurturing`,``,`_Caso: ${u.meta.caso}_`,``];return e.push(`## Criterios de lead scoring`,``,`| Criterio | Categoría | Puntos |`,`|---|---|---|`),h.criterios.forEach(t=>e.push(`| ${t.nombre} | ${t.cat} | ${t.puntos} |`)),e.push(``,`Máximo posible: **${v()} puntos**. Cortes: templado ≥ ${h.umbralTemplado}, caliente ≥ ${h.umbralCaliente}.`,``),e.push(`### Clasificación de los 12 leads`,``,`| Lead | Puntos | Nivel |`,`|---|---|---|`),f.map(e=>({...e,p:g(e.id)})).sort((e,t)=>t.p-e.p).forEach(t=>e.push(`| ${t.nombre} | ${t.p} | ${_(t.p)} |`)),e.push(``,`## Workflow · ${T()} días desde el vuelo de vuelta`,``),h.nodos.length?(e.push(`| Día | Tipo | Contenido | Objetivo / rama |`,`|---|---|---|---|`),h.nodos.forEach((t,n)=>{let r=w(n);t.tipo===`email`?e.push(`| ${r} | Email | ${t.asunto||`_(sin asunto)_`} | ${t.objetivo||`—`} |`):t.tipo===`espera`?e.push(`| ${r} | Espera | ${t.dias||0} días | — |`):e.push(`| ${r} | Condición | Si ${t.condicion||`—`} | Si no: ${t.siNo||`—`} |`)})):e.push(`_(workflow vacío)_`),e.join(`
`)}function M(){let e=h.criterios.map(e=>`- ${e.nombre} (${e.cat}): ${e.puntos} puntos`).join(`
`),t=f.map(e=>`- ${e.nombre}: ${g(e.id)} puntos (${_(g(e.id))})`).join(`
`);return`Estoy definiendo el lead scoring de una marca de alimentación española que capta leads entre turistas extranjeros en España y quiere que recompren desde su país.

Mis criterios y pesos:

${e}

Cortes: templado a partir de ${h.umbralTemplado} puntos, caliente a partir de ${h.umbralCaliente}. Máximo posible: ${v()}.

Con esto, mis 12 leads quedan así:

${t}

Haz tres cosas:
1. Dime qué criterio está mal pesado y por qué, teniendo en cuenta que la compra ocurre a distancia y meses después del contacto.
2. Propón dos criterios que no he incluido y que serían buenos predictores en este contexto.
3. Señala si mis cortes dejan demasiados leads en un solo tramo y qué implicaría eso para el workflow.

No inventes benchmarks: razona sobre mis números.`}function N(){return`Estoy diseñando el workflow de nurturing de los 90 días posteriores al vuelo de vuelta de un turista que probó un producto agroalimentario español durante sus vacaciones en España.

Este es mi workflow:

${h.nodos.map((e,t)=>{let n=w(t);return e.tipo===`email`?`Día ${n} — Email: "${e.asunto||`(sin asunto)`}" · objetivo: ${e.objetivo||`(sin definir)`}`:e.tipo===`espera`?`Día ${n} — Esperar ${e.dias||0} días`:`Día ${n} — Si ${e.condicion||`(?)`}; si no: ${e.siNo||`(sin definir)`}`}).join(`
`)||`(vacío)`}

Haz tres cosas:
1. Escribe tres alternativas de asunto para cada email, pensadas para alguien que ya no está de viaje y tiene el recuerdo diluyéndose.
2. Dime en qué punto del recorrido tengo más riesgo de que el lead deje de abrir, y qué haría falta ahí.
3. Propón qué hacer con el lead que no abre ninguno de los emails, sin recurrir a un descuento.

Respeta mi estructura de días: no la reordenes.`}var P=document.querySelector(`#app`);P.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Nurturing`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M3`,href:`/decks/m3.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Lead scoring y workflow de nurturing</h1>
        <p class="lead">Definid los criterios que puntúan a vuestros leads y dibujad el recorrido de los
        90 días posteriores al vuelo de vuelta. La ventana del caso es esa.</p>
      </div>

      <div class="tool-part" id="scoring">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Lead scoring</h2></div>
        </div>
        <div class="scoring">
          <div>
            <p class="muted" style="max-width:70ch">Cada criterio suma puntos cuando el lead cumple ese rasgo.
            Los pesos son vuestros: el sistema calcula, no juzga. Podéis marcar y desmarcar los rasgos de cada
            lead para ver cómo se mueve la escala.</p>
            <div data-criterios style="margin-top:var(--sp-4)"></div>
            <div data-nuevo-criterio style="margin-top:var(--sp-3)"></div>
          </div>
          <aside class="escala" data-escala aria-label="Escala de lead scoring"></aside>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="sc">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="sc" hidden>
            <p><strong>No hay pesos correctos.</strong> Lo que se evalúa es la coherencia entre lo que puntuáis
            y lo que decís que os importa. Preguntas que ayudan:</p>
            <ul>
              <li>¿Qué pesa más en vuestra escala: quién es o qué ha hecho? ¿Es lo que queríais?</li>
              <li>Mirad los tres leads con menos puntos: ¿de verdad no merecen nada?</li>
              <li>Si todos los leads caen en el mismo tramo, la escala no está separando nada.</li>
              <li>Recordad que el scoring es continuo: cambia con cada clic. ¿Qué rasgo cambiaría mañana?</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${a({id:`scoring`,label:`Copiar prompt: revisar mis pesos`,hint:`Copia tus criterios y la clasificación resultante.`})}
        </div>
      </div>

      <div class="tool-part" id="workflow">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Workflow de los 90 días</h2></div>
          <span class="score" data-score-wf></span>
        </div>
        <div class="wf-toolbar">
          <button class="btn btn--secondary btn--sm" type="button" data-add="email">+ Email</button>
          <button class="btn btn--secondary btn--sm" type="button" data-add="espera">+ Espera</button>
          <button class="btn btn--secondary btn--sm" type="button" data-add="condicion">+ Condición</button>
          <span class="toolbar__spacer"></span>
          <button class="btn btn--ghost btn--sm" type="button" data-descargar-svg>Descargar el esquema (.svg)</button>
        </div>
        <div class="wf-canvas" data-workflow></div>
        <div class="wf-regla" data-regla></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="wf">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="wf" hidden>
            <p>Preguntas que ayudan a revisar el recorrido:</p>
            <ul>
              <li>¿Cuándo sale el primer email? El recuerdo empieza a diluirse desde que recoge la maleta.</li>
              <li>Por cada email, preguntad: ¿qué gana quien lo abre? Si la respuesta es «se entera de que existimos», falta algo.</li>
              <li>Un workflow sin condiciones es una lista de envíos programados, no nurturing.</li>
              <li>¿Qué pasa con el que no abre nada? Esa rama también es una decisión.</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${a({id:`workflow`,label:`Copiar prompt: asuntos y ramas`,hint:`Copia tu workflow y pide alternativas de asunto y qué hacer con quien no abre.`})}
        </div>
      </div>`}),o({id:`payoff`,titulo:`Los 90 días, dibujados`,entradilla:`El esquema del workflow tal y como lo habéis construido. Descargable en SVG para el entregable.`,html:`<p class="reveal-moment__empty">Añade emails, esperas y condiciones: el esquema se dibuja solo.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza: <a href="${l(`/tools/calendario.html`)}">calendario y creatividades</a>.</p>`})].join(``);function F(){P.querySelector(`[data-criterios]`).innerHTML=h.criterios.map(y).join(``),P.querySelector(`[data-nuevo-criterio]`).innerHTML=b()}function I(){P.querySelector(`[data-escala]`).innerHTML=S()}function L(){P.querySelector(`[data-workflow]`).innerHTML=E(),P.querySelector(`[data-regla]`).innerHTML=D()}function R(){P.querySelector(`[data-checks]`).innerHTML=A()}function z(){let e=h.nodos.filter(e=>e.tipo===`email`).length,t=P.querySelector(`[data-score-wf]`);t.innerHTML=`${e} <small>emails en ${T()} días</small>`,t.dataset.ok=e>=3&&T()<=90?`si`:`no`}function B(){let{html:e,pie:t}=k();i(P,`payoff`,e,t)}function V(){L(),R(),z(),B()}P.addEventListener(`input`,e=>{let t=e.target.dataset.crNombre;if(t){h.criterios.find(e=>e.id===t).nombre=e.target.value;return}let n=e.target.dataset.crPuntos;if(n){h.criterios.find(e=>e.id===n).puntos=Number(e.target.value)||0,I(),R();return}let r=e.target.dataset.umbral;if(r){h[r]=Number(e.target.value)||0,I(),R();return}let i=e.target.dataset.nodo;if(i){let t=h.nodos.find(e=>e.id===i),n=e.target.dataset.campo;t[n]=n===`dias`?Number(e.target.value)||0:e.target.value,n===`dias`?V():(R(),z(),B())}}),P.addEventListener(`change`,e=>{let t=e.target.dataset.nodo;t&&e.target.dataset.campo===`condicion`&&(h.nodos.find(e=>e.id===t).condicion=e.target.value,R(),B())}),P.addEventListener(`click`,e=>{if(e.target.closest(`[data-anadir-criterio]`)){let e=P.querySelector(`[data-nuevo-rasgo]`),t=d.find(t=>t.id===e.value);t&&(h.criterios.push({id:`cr${Date.now()}`,rasgo:t.id,nombre:t.label,cat:t.cat,puntos:10}),F(),I(),R());return}let t=e.target.closest(`[data-cr-borrar]`)?.dataset.crBorrar;if(t){h.criterios=h.criterios.filter(e=>e.id!==t),F(),I(),R();return}let n=e.target.closest(`[data-rasgo]`);if(n){let{lead:e,rasgo:t}=n.dataset,r=h.rasgosLead[e],i=r.indexOf(t);i>=0?r.splice(i,1):r.push(t),I();return}let r=e.target.closest(`[data-add]`)?.dataset.add;if(r){let e=`n${Date.now()}`;r===`email`?h.nodos.push({id:e,tipo:`email`,asunto:``,objetivo:``}):r===`espera`?h.nodos.push({id:e,tipo:`espera`,dias:7}):h.nodos.push({id:e,tipo:`condicion`,condicion:m[0],siNo:``}),V();return}let i=e.target.closest(`[data-borrar-nodo]`)?.dataset.borrarNodo;if(i){h.nodos=h.nodos.filter(e=>e.id!==i),V();return}let a=e.target.closest(`[data-mover]`);if(a){let e=h.nodos.findIndex(e=>e.id===a.dataset.mover),t=e+Number(a.dataset.dir);t>=0&&t<h.nodos.length&&([h.nodos[e],h.nodos[t]]=[h.nodos[t],h.nodos[e]],V());return}if(e.target.closest(`[data-descargar-svg]`)){s(`workflow-nurturing.svg`,O({paraDescarga:!0}),`image/svg+xml;charset=utf-8`);return}let o=e.target.closest(`[data-pista]`);if(o){let e=P.querySelector(`[data-pista-texto="${o.dataset.pista}"]`);e.hidden=!e.hidden,o.textContent=e.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}}),r(P,{scoring:M,workflow:N}),e({mount:P.querySelector(`[data-statepanel]`),toolId:`nurturing`,nombreArchivo:`nurturing`,getState:()=>structuredClone({criterios:h.criterios,umbralTemplado:h.umbralTemplado,umbralCaliente:h.umbralCaliente,rasgosLead:h.rasgosLead,nodos:h.nodos}),setState:e=>{Array.isArray(e.criterios)&&(h.criterios=e.criterios),typeof e.umbralTemplado==`number`&&(h.umbralTemplado=e.umbralTemplado),typeof e.umbralCaliente==`number`&&(h.umbralCaliente=e.umbralCaliente),e.rasgosLead&&(h.rasgosLead=Object.fromEntries(f.map(t=>[t.id,[...e.rasgosLead[t.id]||t.rasgos]]))),Array.isArray(e.nodos)&&(h.nodos=e.nodos),F(),I(),V()},toMarkdown:j}),F(),I(),V();