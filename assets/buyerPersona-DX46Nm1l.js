import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{o as s,t as c}from"./_util-P6weWh_n.js";import{t as l}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var u=[{id:`tofu`,label:`TOFU`,ayuda:`Tiene una necesidad y no conoce la solución`},{id:`mofu`,label:`MOFU`,ayuda:`Conoce soluciones y no ha elegido`},{id:`bofu`,label:`BOFU`,ayuda:`Está eligiendo dentro de una short list`}],d=[{id:`antes`,label:`Antes del viaje`,ayuda:`Todavía no ha reservado o está preparándolo`},{id:`durante`,label:`Durante la estancia`,ayuda:`Ya está en España`},{id:`despues`,label:`Después del viaje`,ayuda:`Ha vuelto a su país`}],f=4,p=[{id:`nombre`,label:`Nombre de la persona`,tipo:`text`,help:`Un nombre propio, no un segmento.`},{id:`mercado`,label:`Mercado de origen`,tipo:`text`,help:`El país desde el que viaja.`},{id:`perfil`,label:`En una línea, ¿quién es?`,tipo:`text`,help:`Edad, con quién viaja, qué hace.`},{id:`mueve`,label:`¿Qué le mueve?`,tipo:`area`,help:`La motivación real del viaje y de lo que come.`},{id:`desconfia`,label:`¿De qué desconfía?`,tipo:`area`,help:`Qué le hace dudar de una marca de alimentación.`},{id:`informa`,label:`¿Dónde se informa?`,tipo:`area`,help:`Plataformas, personas y formatos concretos.`},{id:`frena`,label:`¿Qué le frena a recomprar en origen?`,tipo:`area`,help:`La barrera real cuando ya está en casa.`}],m={personas:[h(),h()],ubicacion:{}};function h(){return Object.fromEntries(p.map(e=>[e.id,``]))}var g=()=>l.momentos.items.filter(e=>!m.ubicacion[e.id]),_=(e,t)=>l.momentos.items.filter(n=>m.ubicacion[n.id]===`${e}|${t}`),v=e=>p.filter(t=>String(e[t.id]||``).trim().length>2).length;function y(e,t){let n=p.map(n=>{let r=`p${t}-${n.id}`,i=s(e[n.id]),a=n.tipo===`area`?`<textarea id="${r}" data-persona="${t}" data-campo="${n.id}" rows="2">${i}</textarea>`:`<input id="${r}" type="text" data-persona="${t}" data-campo="${n.id}" value="${i}" />`;return`<div class="field">
      <label for="${r}">${s(n.label)}</label>
      ${a}
      <span class="field__help">${s(n.help)}</span>
    </div>`}).join(``);return`<article class="persona">
    <div class="persona__head">
      <span class="persona__tag">Arquetipo ${t+1}</span>
      <span class="persona__contador" data-contador="${t}"></span>
    </div>
    <div class="fields">${n}</div>
  </article>`}function b(e,t){let n=t?`<button class="momento__quitar" type="button" data-quitar="${s(e.id)}" aria-label="Devolver a la bandeja">×</button>`:``;return`<div class="momento" draggable="true" tabindex="0" role="button"
    data-momento="${s(e.id)}"
    aria-label="Momento: ${s(e.texto)}. Pulsa para seleccionarlo y luego elige una celda.">
    ${n}${s(e.texto)}
  </div>`}function x(){let e=g();return`<div class="bandeja__head">
      <h3 class="bandeja__title">Momentos por colocar</h3>
      <span class="bandeja__n">${e.length} / ${l.momentos.items.length}</span>
    </div>
    <div class="bandeja__list" data-zona="bandeja">
      ${e.length?e.map(e=>b(e,!1)).join(``):`<p class="bandeja__vacia">Todos colocados. Repasa la matriz: ¿hay alguna celda vacía?</p>`}
    </div>`}function S(){return`<div class="matriz"><div class="matriz__esquina"></div>${u.map(e=>`<div class="matriz__colhead matriz__colhead--${e.id}"><b>${e.label}</b><small>${s(e.ayuda)}</small></div>`).join(``)}${d.map(e=>{let t=u.map(t=>{let n=_(t.id,e.id);return`<div class="celda" data-n="${n.length}" data-fase="${t.id}" data-franja="${e.id}"
        tabindex="0" role="button"
        aria-label="${t.label}, ${e.label}: ${n.length} momentos. Con un momento seleccionado, pulsa para soltarlo aquí.">
        <span class="celda__n">${n.length}</span>
        ${n.map(e=>b(e,!0)).join(``)}
      </div>`}).join(``);return`<div class="matriz__rowhead"><b>${s(e.label)}</b><small>${s(e.ayuda)}</small></div>${t}`}).join(``)}</div>`}function C(){let e=l.momentos.items.length,t=e-g().length;if(!t)return{html:`<p class="reveal-moment__empty">Coloca los primeros momentos y la matriz aparecerá aquí, proyectable.</p>`,pie:``};let n=u.map(e=>`<div class="payoff-matriz__h">${e.label}</div>`).join(``),r=d.map(e=>{let t=u.map(t=>{let n=_(t.id,e.id).length;return`<div class="payoff-celda" data-n="${n}"><b>${n}</b><small>${n===0?`sin cubrir`:n===1?`momento`:`momentos`}</small></div>`}).join(``);return`<div class="payoff-matriz__h payoff-matriz__h--row">${s(e.label)}</div>${t}`}).join(``),i=d.map(e=>{let n=u.reduce((t,n)=>t+_(n.id,e.id).length,0);return{...e,n,pct:Math.round(n/t*100)}}),a=i.map(e=>`<div class="payoff-franja${e.id===`despues`?` payoff-franja--destacada`:``}">
        <span class="payoff-franja__lab">${s(e.label)}</span>
        <span class="payoff-franja__bar"><i style="width:${e.pct}%"></i></span>
        <span class="payoff-franja__pct">${e.pct}%</span>
      </div>`).join(``),o=u.length*d.length-u.reduce((e,t)=>e+d.filter(e=>_(t.id,e.id).length>0).length,0),c=i.find(e=>e.id===`despues`),f=`Habéis colocado <strong>${t}</strong> de ${e} momentos y quedan
    <strong>${o}</strong> celdas sin cubrir. En «después del viaje» hay
    <strong>${c.n} momentos (${c.pct}%)</strong> — y ahí es exactamente donde
    el caso dice que se rompe la cadena. Pregunta para el aula: ¿qué parte del plan de
    comunicación de una DOP española se dedica hoy a esa franja?`;return{html:`<div class="payoff-matriz">${`<div class="payoff-matriz__h"></div>${n}${r}`}</div>
    <div class="payoff-franjas">${a}</div>`,pie:f}}function w(){let e=l.momentos.items.length,t=e-g().length,n=[];return d.forEach(e=>u.forEach(t=>{_(t.id,e.id).length||n.push(`${t.label} · ${e.label}`)})),[{ok:v(m.personas[0])>=f,txt:`Arquetipo 1 con al menos ${f} campos rellenos (ahora: ${v(m.personas[0])}).`},{ok:v(m.personas[1])>=f,txt:`Arquetipo 2 con al menos ${f} campos rellenos (ahora: ${v(m.personas[1])}).`},{ok:t===e,txt:`Los ${e} momentos colocados (ahora: ${t}).`},{ok:n.length===0,txt:n.length?`Quedan ${n.length} celdas vacías: ${n.join(` · `)}.`:`Ninguna celda de la matriz está vacía.`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${s(e.txt)}</li>`).join(``)}function T(){let e=[`# Buyer personas y mapa de momentos`,``,`_Caso: ${l.meta.caso}_`,``];m.personas.forEach((t,n)=>{e.push(`## Arquetipo ${n+1}${t.nombre?`: ${t.nombre}`:``}`,``),p.filter(e=>e.id!==`nombre`).forEach(n=>{e.push(`**${n.label}**  `,`${t[n.id]||`_(sin completar)_`}`,``)})}),e.push(`## Mapa de momentos`,``,`| Franja | TOFU | MOFU | BOFU |`,`|---|---|---|---|`),d.forEach(t=>{let n=u.map(e=>{let n=_(e.id,t.id);return n.length?n.map(e=>e.texto).join(`<br>`):`—`});e.push(`| **${t.label}** | ${n.join(` | `)} |`)});let t=g();return t.length&&e.push(``,`> Quedan ${t.length} momentos sin colocar.`),e.push(``,`_Fuente de los datos del caso: ${l.momentos.fuente}._`),e.join(`
`)}function E(){return`Actúa como planner de un plan de inbound marketing. Contexto: promocionamos un producto agroalimentario español entre turistas extranjeros que lo prueban en España, con el objetivo de que lo recompren al volver a su país.

Estos son mis dos buyer personas:

${m.personas.map((e,t)=>`Arquetipo ${t+1}\n`+p.map(t=>`- ${t.label}: ${e[t.id]||`(sin completar)`}`).join(`
`)).join(`

`)}

Haz tres cosas:
1. Señala qué Customer Insight de cada arquetipo es genérico y valdría para cualquier marca, y reescríbelo para que sea específico.
2. Propón, para cada arquetipo, tres preguntas que esa persona se haría y que yo no he recogido.
3. Dime qué información me falta para poder escribir contenido dirigido a esa persona.

No inventes datos de mercado: trabaja solo con lo que te doy.`}function D(){return`Soy responsable de contenidos de una marca de alimentación española que quiere que los turistas extranjeros la recompren al volver a su país.

He repartido los momentos de mi buyer persona en una matriz de fase del funnel (TOFU/MOFU/BOFU) × franja del viaje (antes/durante/después):

${d.map(e=>u.map(t=>{let n=_(t.id,e.id);return`${t.label} · ${e.label} (${n.length}): ${n.map(e=>e.texto).join(` | `)||`vacío`}`}).join(`
`)).join(`
`)}

Haz tres cosas:
1. Para cada celda con momentos, propón un formato de contenido concreto que los responda.
2. Para cada celda vacía, dime si tiene sentido que esté vacía o si es un hueco real, y por qué.
3. Señala el momento en el que, según esta matriz, tengo más riesgo de perder al lead.

No cambies mi clasificación: trabaja sobre ella.`}var O=document.querySelector(`#app`);O.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Buyer persona`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M1`,href:`/decks/m1.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Buyer persona y mapa de momentos</h1>
        <p class="lead">Dos arquetipos con Customer Insights y ${l.momentos.items.length} momentos
        reales de un turista repartidos en una matriz de 3 × 3. Es la primera pieza del entregable.</p>
        <span class="fuente">${s(l.momentos.fuente)} · los momentos no llevan fase asignada: la decidís vosotros.</span>
      </div>

      <div class="tool-part" id="personas">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Los dos arquetipos</h2></div>
          <span class="score" data-score-personas></span>
        </div>
        <div class="personas">${m.personas.map(y).join(``)}</div>
        <div style="margin-top:var(--sp-5)">
          ${a({id:`personas`,label:`Copiar prompt: afinar mis insights`,hint:`Copia tus dos arquetipos ya escritos y pide que señalen lo genérico.`})}
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
          ${a({id:`matriz`,label:`Copiar prompt: contenidos para mi matriz`,hint:`Copia tu matriz tal cual y pide un formato de contenido por celda.`})}
        </div>
      </div>`}),o({id:`payoff`,titulo:`Dónde está vuestro mapa`,entradilla:`La matriz completa, con el recuento de cada celda. Lo que queda en blanco es lo que nadie va a cubrir.`,html:`<p class="reveal-moment__empty">Coloca los primeros momentos y la matriz aparecerá aquí, proyectable.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza del entregable: <a href="${c(`/tools/keywords.html`)}">las 10 keywords</a>.</p>`})].join(``);function k(){O.querySelector(`[data-bandeja]`).innerHTML=x()}function A(){O.querySelector(`[data-matriz]`).innerHTML=S(),F&&I(!0)}function j(){O.querySelector(`[data-checks]`).innerHTML=w()}function M(){let e=l.momentos.items.length,t=e-g().length,n=O.querySelector(`[data-score-momentos]`);n.innerHTML=`${t}/${e} <small>momentos colocados</small>`,n.dataset.ok=t===e?`si`:`no`;let r=O.querySelector(`[data-score-personas]`),i=m.personas.filter(e=>v(e)>=f).length;r.innerHTML=`${i}/2 <small>arquetipos completos</small>`,r.dataset.ok=i===2?`si`:`no`,m.personas.forEach((e,t)=>{let n=O.querySelector(`[data-contador="${t}"]`),r=v(e);n.textContent=`${r}/${p.length} campos`,n.dataset.ok=r>=f?`si`:`no`})}function N(){let{html:e,pie:t}=C();i(O,`payoff`,e,t)}function P({conBandeja:e=!0}={}){e&&(k(),A()),j(),M(),N()}O.addEventListener(`input`,e=>{let t=e.target;t.dataset.persona!==void 0&&(m.personas[Number(t.dataset.persona)][t.dataset.campo]=t.value,j(),M())});var F=null;function I(e){O.querySelectorAll(`.celda`).forEach(t=>t.classList.toggle(`is-target`,e))}function L(e){F=e,O.querySelectorAll(`.momento`).forEach(t=>t.classList.toggle(`is-sel`,t.dataset.momento===e)),I(!!e)}function R(e,t,n){t&&n?m.ubicacion[e]=`${t}|${n}`:delete m.ubicacion[e],F=null,P(),(t&&n?O.querySelector(`.celda[data-fase="${t}"][data-franja="${n}"]`):O.querySelector(`.bandeja [data-momento="${e}"]`))?.focus()}O.addEventListener(`click`,e=>{let t=e.target.closest(`[data-quitar]`);if(t){R(t.dataset.quitar,null,null);return}let n=e.target.closest(`[data-momento]`);if(n){L(F===n.dataset.momento?null:n.dataset.momento);return}let r=e.target.closest(`.celda`);if(r&&F){R(F,r.dataset.fase,r.dataset.franja);return}e.target.closest(`[data-zona="bandeja"]`)&&F&&R(F,null,null)}),O.addEventListener(`keydown`,e=>{if(e.key===`Escape`){L(null);return}if(e.key!==`Enter`&&e.key!==` `)return;let t=e.target.closest(`[data-momento]`);if(t){e.preventDefault(),L(F===t.dataset.momento?null:t.dataset.momento);return}let n=e.target.closest(`.celda`);n&&F&&(e.preventDefault(),R(F,n.dataset.fase,n.dataset.franja))}),O.addEventListener(`dragstart`,e=>{let t=e.target.closest(`[data-momento]`);t&&(e.dataTransfer.setData(`text/plain`,t.dataset.momento),e.dataTransfer.effectAllowed=`move`,t.classList.add(`is-drag`))}),O.addEventListener(`dragend`,e=>e.target.closest(`[data-momento]`)?.classList.remove(`is-drag`)),O.addEventListener(`dragover`,e=>{let t=e.target.closest(`.celda, [data-zona='bandeja']`);t&&(e.preventDefault(),e.dataTransfer.dropEffect=`move`,t.classList.add(`is-over`))}),O.addEventListener(`dragleave`,e=>e.target.closest(`.celda, [data-zona='bandeja']`)?.classList.remove(`is-over`)),O.addEventListener(`drop`,e=>{let t=e.target.closest(`.celda, [data-zona='bandeja']`);if(!t)return;e.preventDefault(),t.classList.remove(`is-over`);let n=e.dataTransfer.getData(`text/plain`);n&&(t.classList.contains(`celda`)?R(n,t.dataset.fase,t.dataset.franja):R(n,null,null))}),O.addEventListener(`click`,e=>{if(!e.target.closest(`[data-pista]`))return;let t=O.querySelector(`[data-pista-texto]`);t.hidden=!t.hidden,e.target.closest(`[data-pista]`).textContent=t.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}),r(O,{personas:E,matriz:D}),e({mount:O.querySelector(`[data-statepanel]`),toolId:`buyer-persona`,nombreArchivo:`buyer-persona`,getState:()=>structuredClone(m),setState:e=>{Array.isArray(e.personas)&&(m.personas=[0,1].map(t=>({...h(),...e.personas[t]||{}}))),m.ubicacion={...e.ubicacion||{}},O.querySelectorAll(`[data-persona]`).forEach(e=>{e.value=m.personas[Number(e.dataset.persona)][e.dataset.campo]||``}),P()},toMarkdown:T,ayuda:`Este archivo es una de las dos piezas que hay que traer el 25 de septiembre.`}),P();