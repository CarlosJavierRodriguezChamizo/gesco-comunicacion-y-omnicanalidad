import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{o as s,t as c}from"./_util-P6weWh_n.js";import{t as l}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var u=[`Ene`,`Feb`,`Mar`,`Abr`,`May`,`Jun`,`Jul`,`Ago`,`Sep`,`Oct`,`Nov`,`Dic`],d=[`enero`,`febrero`,`marzo`,`abril`,`mayo`,`junio`,`julio`,`agosto`,`septiembre`,`octubre`,`noviembre`,`diciembre`],f=[``,`tofu`,`mofu`,`bofu`],p=[`Blog / web`,`Instagram`,`TikTok`,`YouTube`,`Email`,`Google Ads`,`Meta Ads`],m=[{id:`formato`,label:`Formato`,ph:`Reel de 20″, carrusel, banner 300×250, vídeo…`},{id:`plataforma`,label:`Plataforma`,ph:`¿Dónde se publica exactamente?`},{id:`objetivo`,label:`Objetivo`,ph:`Alcance, tráfico al blog, captación de lead…`},{id:`insight`,label:`Insight`,ph:`La duda o el deseo de tu buyer persona que la pieza toca.`},{id:`mensaje`,label:`Mensaje`,ph:`Qué dice la pieza, en una frase.`},{id:`cta`,label:`CTA`,ph:`Qué le pedimos que haga.`},{id:`especificaciones`,label:`Especificaciones`,ph:`Medidas, duración, texto máximo, requisitos legales…`}],h={producto:l.meta.ejeDemo.producto,plataformas:[`Blog / web`,`Instagram`,`Email`],piezas:[],briefs:Array.from({length:5},(e,t)=>({id:`b${t+1}`,...Object.fromEntries(m.map(e=>[e.id,``]))}))},g=()=>l.productos.find(e=>e.id===h.producto)||l.productos[0];function _(){let e=g().estacionalidadProduccion,t=l.turismo.estacionalidadTuristica.indice;return`<div class="cal-bandas" aria-hidden="true"><div class="cal-bandas__hueco"></div>${u.map((n,r)=>`<div class="cal-banda-col">
      <i class="b-producto" style="height:${Math.round(e[r]/100*100)}%"></i>
      <i class="b-turismo" style="height:${Math.round(t[r]/100*100)}%;opacity:.9"></i>
    </div>`).join(``)}</div>`}function v(){let e=`<div></div>${u.map(e=>`<div class="cal-mes">${e}</div>`).join(``)}`,t=h.plataformas.map(e=>{let t=u.map((t,n)=>{let r=h.piezas.filter(t=>t.plataforma===e&&t.mes===n);return`<div class="cal-celda" tabindex="0" role="button"
          data-celda data-plat="${s(e)}" data-mes="${n}"
          aria-label="${s(e)}, ${d[n]}: ${r.length} piezas. Pulsa para añadir.">
          ${r.map(e=>`<span class="cal-pieza cal-pieza--${e.fase||`sin`}" title="${s(e.titulo)}">${s(e.titulo||`(sin título)`)}</span>`).join(``)}
        </div>`}).join(``);return`<div class="cal-plat">${s(e)}</div>${t}`}).join(``);return`<div class="cal-wrap">
    ${_()}
    <div class="cal-grid">${e}${t}</div>
  </div>`}function y(){return[...new Set([...p,...h.plataformas])].map(e=>`<button class="plat-chip" type="button" data-plat-toggle="${s(e)}"
        aria-pressed="${h.plataformas.includes(e)}">${s(e)}</button>`).join(``)}function b(){return h.piezas.length?h.piezas.slice().sort((e,t)=>e.mes-t.mes).map(e=>`<div class="pieza-fila">
        <span class="fase fase--${e.fase||`sin`}">${e.fase?e.fase.toUpperCase():`sin fase`}</span>
        <strong>${s(e.titulo||`(sin título)`)}</strong>
        <span class="muted">${s(e.plataforma)} · ${d[e.mes]}${e.cluster?` · ${s(e.cluster)}`:``}${e.tipo?` · ${s(e.tipo)}`:``}</span>
        <button type="button" data-borrar-pieza="${s(e.id)}" aria-label="Eliminar la pieza">×</button>
      </div>`).join(``):`<p class="small muted">Todavía no hay piezas. Pulsa una celda del calendario.</p>`}function x(e,t){let n=m.map(t=>{let n=`br-${e.id}-${t.id}`,r=t.id===`mensaje`||t.id===`insight`||t.id===`especificaciones`?`<textarea id="${n}" rows="2" data-brief="${e.id}" data-campo="${t.id}" placeholder="${s(t.ph)}">${s(e[t.id])}</textarea>`:`<input id="${n}" type="text" data-brief="${e.id}" data-campo="${t.id}" value="${s(e[t.id])}" placeholder="${s(t.ph)}" />`;return`<div class="field"><label for="${n}">${s(t.label)}</label>${r}</div>`}).join(``),r=m.filter(t=>e[t.id].trim()).length;return`<article class="brief">
    <div class="brief__head">
      <span class="brief__n">0${t+1}</span>
      <h3 class="brief__t">Creatividad ${t+1}</h3>
      <span class="brief__completo" data-ok="${r===m.length?`si`:`no`}">${r}/${m.length}</span>
    </div>
    ${n}
    ${a({id:`brief-${e.id}`,label:`Copiar prompt: producir esta pieza`,hint:``})}
  </article>`}function S(){let e=g(),t=e.estacionalidadProduccion,n=l.turismo.estacionalidadTuristica.indice,r=908/12,i=e=>274-e/100*228,a=(e,t,n)=>{let a=e.map((e,t)=>`${(46+r*(t+.5)).toFixed(1)},${i(e).toFixed(1)}`).join(` `);return`<polygon points="46,274 ${a} 954,274" fill="${t}" fill-opacity="${n}"/>
            <polyline points="${a}" fill="none" stroke="${t}" stroke-width="2.5"/>`},o=u.map((e,t)=>`<text class="s-mes" x="${(46+r*(t+.5)).toFixed(1)}" y="322" text-anchor="middle" opacity=".8">${e}</text>`).join(``),c=u.map((e,r)=>({m:e,i:r,t:n[r],p:t[r]})),f=c.filter(e=>e.t>=60&&e.p<=25),p=c.filter(e=>e.p>=60&&e.t<=40),m=f.map(e=>`<rect x="${(46+r*e.i).toFixed(1)}" y="46" width="${r.toFixed(1)}" height="228"
      fill="#ffb02e" fill-opacity=".14" stroke="#ffb02e" stroke-opacity=".5" stroke-dasharray="4 4"/>`).join(``),h=e=>e.map(e=>d[e.i]).join(`, `)||`ninguno`,_=`Producto: <strong>${s(e.nombre)}</strong> (${e.figura}).
    Meses con turista y sin cosecha: <strong>${h(f)}</strong>.
    Meses con cosecha y sin turista: <strong>${h(p)}</strong>.
    Ahí es donde el calendario deja de ser una rejilla y se convierte en una decisión:
    ¿se comunica cuando está la gente o cuando está el producto?`;return{html:`<svg class="season" viewBox="0 0 1000 340" role="img"
      aria-label="Dos curvas superpuestas: estacionalidad turística y estacionalidad de producción del producto">
      ${m}
      ${a(n,`#0ae4c3`,`.22`)}
      ${a(t,`#ffffff`,`.16`)}
      <line x1="46" y1="274" x2="954" y2="274" stroke="#ffffff" stroke-opacity=".35"/>
      ${o}
      <text class="s-lab" x="46" y="32" fill="#0ae4c3">Cuándo viaja el turista</text>
      <text class="s-lab" x="954" y="32" text-anchor="end" fill="#ffffff">Cuándo hay producto</text>
    </svg>
    <div class="season-leyenda">
      <span><i style="background:#0ae4c3"></i>Estacionalidad turística</span>
      <span><i style="background:#ffffff"></i>Estacionalidad de producción</span>
      <span><i style="background:transparent;border:2px dashed #ffb02e"></i>Turista sin cosecha</span>
    </div>`,pie:_}}function C(){let e=new Set(h.piezas.map(e=>e.mes)).size,t=new Set(h.piezas.map(e=>e.plataforma)).size,n=h.piezas.filter(e=>e.fase).length,r=h.briefs.filter(e=>m.every(t=>e[t.id].trim())).length;return[{ok:h.plataformas.length>=3,txt:`Al menos tres plataformas elegidas (ahora: ${h.plataformas.length}).`},{ok:h.piezas.length>=12,txt:`Al menos doce piezas en el calendario (ahora: ${h.piezas.length}).`},{ok:e>=9,txt:`Al menos nueve meses con alguna pieza (ahora: ${e} de 12).`},{ok:t>=2,txt:`Piezas en al menos dos plataformas distintas (ahora: ${t}).`},{ok:h.piezas.length>0&&n===h.piezas.length,txt:`Todas las piezas con fase del funnel (ahora: ${n} de ${h.piezas.length}).`},{ok:r===5,txt:`Los cinco briefs de creatividad completos (ahora: ${r} de 5).`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${s(e.txt)}</li>`).join(``)}function w(){let e=g(),t=[`# Calendario anual, cronograma y creatividades`,``,`_Caso: ${l.meta.caso}_`,`_Producto: ${e.nombre} (${e.figura}) · ventana de consumo: ${e.ventanaConsumo}_`,``];return t.push(`## Calendario anual de contenidos`,``),t.push(`| Plataforma | ${u.join(` | `)} |`,`|---|${u.map(()=>`---`).join(`|`)}|`),h.plataformas.forEach(e=>{let n=u.map((t,n)=>{let r=h.piezas.filter(t=>t.plataforma===e&&t.mes===n);return r.length?r.map(e=>e.titulo||`(sin título)`).join(`<br>`):``});t.push(`| **${e}** | ${n.join(` | `)} |`)}),t.push(``,`## Cronograma detallado`,``),h.piezas.length?(t.push(`| Mes | Plataforma | Pieza | Tipo | Cluster | Fase |`,`|---|---|---|---|---|---|`),h.piezas.slice().sort((e,t)=>e.mes-t.mes).forEach(e=>{t.push(`| ${d[e.mes]} | ${e.plataforma} | ${e.titulo||`(sin título)`} | ${e.tipo||`—`} | ${e.cluster||`—`} | ${e.fase?e.fase.toUpperCase():`—`} |`)})):t.push(`_(sin piezas)_`),t.push(``,`## Las 5 creatividades`,``),h.briefs.forEach((e,n)=>{t.push(`### Creatividad ${n+1}`,``),m.forEach(n=>t.push(`- **${n.label}:** ${e[n.id].trim()||`_(sin completar)_`}`)),t.push(``)}),t.push(`---`,``,`_Estacionalidad de producción: dataset del caso. Estacionalidad turística: ${l.turismo.estacionalidadTuristica.fuente}._`),t.join(`
`)}function T(){let e=g(),t=h.piezas.slice().sort((e,t)=>e.mes-t.mes).map(e=>`- ${d[e.mes]} · ${e.plataforma}: ${e.titulo||`(sin título)`} [${e.fase||`sin fase`}]`).join(`
`),n=l.turismo.estacionalidadTuristica.indice;return`Estoy construyendo el calendario anual de contenidos de ${e.nombre} (${e.figura}), dirigido a turistas extranjeros que lo prueban en España y deberían recomprarlo desde su país.

Estacionalidad de producción por mes (0-100): ${e.estacionalidadProduccion.join(`, `)}.
Estacionalidad turística por mes (0-100): ${n.join(`, `)}.
Ventana de consumo del producto: ${e.ventanaConsumo}.
Restricciones de envío: ${e.restriccionesEnvio}

Mi calendario actual:

${t||`(vacío)`}

Haz tres cosas:
1. Señala los meses en los que hay turista pero no hay producto, y propón qué comunicar exactamente en ellos.
2. Señala los meses con producto y sin turista, y di a quién habría que hablarle entonces.
3. Dime qué mes de mi calendario está sobrecargado y cuál está vacío sin motivo.

Trabaja sobre mi calendario: no lo reescribas entero.`}function E(e){let t=h.briefs.find(t=>t.id===e),n=g(),r=m.map(e=>`- ${e.label}: ${t[e.id].trim()||`(sin completar)`}`).join(`
`);return`Necesito producir una pieza creativa para ${n.nombre} (${n.figura}), dentro de un plan que busca que los turistas extranjeros que lo prueban en España lo recompren al volver a su país.

Este es el brief:

${r}

Haz tres cosas:
1. Escribe tres versiones del copy de la pieza, ajustadas al formato y a las especificaciones que indico.
2. Describe la imagen o el vídeo: qué se ve, en qué orden y cuánto dura cada plano.
3. Dime qué falta en mi brief para que un diseñador pudiera producirla sin preguntarme nada.

No cambies el formato ni la plataforma: son fijos.`}var D=document.querySelector(`#app`);D.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Calendario`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M3`,href:`/decks/m3.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Calendario anual y creatividades</h1>
        <p class="lead">Colocad las piezas de contenido sobre los doce meses y ved cómo encajan —o no—
        con la estacionalidad de vuestro producto y con la del viaje.</p>
        <span class="fuente">${s(l.turismo.estacionalidadTuristica.fuente)} · estacionalidad de producción del dataset del caso</span>
      </div>

      <div class="tool-part" id="calendario">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Calendario anual</h2></div>
          <span class="score" data-score-cal></span>
        </div>

        <div class="cal-config">
          <div class="field">
            <label for="producto">Producto del equipo</label>
            <select id="producto" data-producto>
              ${l.productos.map(e=>`<option value="${e.id}"${e.id===h.producto?` selected`:``}>${s(e.nombre)} · ${e.figura}</option>`).join(``)}
            </select>
            <span class="field__help" data-producto-info></span>
          </div>
          <div class="field">
            <span class="field__label">Plataformas del cronograma</span>
            <div class="plataformas" data-plataformas></div>
            <div class="plat-nueva" style="margin-top:var(--sp-2)">
              <input type="text" data-plat-nueva placeholder="Añadir otra plataforma" aria-label="Nueva plataforma" />
              <button class="btn btn--secondary btn--sm" type="button" data-plat-add>Añadir</button>
            </div>
          </div>
        </div>

        <div class="scroll-x" style="margin-top:var(--sp-5)"><div data-grid></div></div>
        <div class="cal-leyenda">
          <span><i style="background:rgba(0,71,233,.35)"></i>Estacionalidad del producto (fondo)</span>
          <span><i style="background:rgba(10,228,195,.6)"></i>Estacionalidad turística (fondo)</span>
          <span><i style="background:var(--c-tofu)"></i>TOFU</span>
          <span><i style="background:var(--c-mofu)"></i>MOFU</span>
          <span><i style="background:var(--c-bofu)"></i>BOFU</span>
        </div>

        <div class="pieza-editor" data-editor hidden>
          <h3 data-editor-titulo>Nueva pieza</h3>
          <div class="fields fields--2">
            <div class="field">
              <label for="pz-titulo">Título de la pieza</label>
              <input id="pz-titulo" type="text" data-pz="titulo" placeholder="Guía: la ruta del aceite en Córdoba" />
            </div>
            <div class="field">
              <label for="pz-tipo">Tipo de contenido</label>
              <input id="pz-tipo" type="text" data-pz="tipo" placeholder="Post, reel, newsletter, vídeo, PDF…" />
            </div>
            <div class="field">
              <label for="pz-cluster">Cluster de keywords asociado</label>
              <input id="pz-cluster" type="text" data-pz="cluster" placeholder="El mismo nombre que usasteis en la tool de keywords" />
            </div>
            <div class="field">
              <label for="pz-fase">Fase del funnel</label>
              <select id="pz-fase" data-pz="fase">
                ${f.map(e=>`<option value="${e}">${e?e.toUpperCase():`— sin fase`}</option>`).join(``)}
              </select>
            </div>
          </div>
          <div class="row" style="margin-top:var(--sp-4)">
            <button class="btn btn--primary btn--sm" type="button" data-pz-guardar>Añadir al calendario</button>
            <button class="btn btn--ghost btn--sm" type="button" data-pz-cerrar>Cancelar</button>
          </div>
        </div>

        <h3 style="margin-top:var(--sp-6)">Cronograma</h3>
        <div class="piezas-lista" data-piezas></div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="cal">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="cal" hidden>
            <p>Preguntas que ayudan a leer el calendario:</p>
            <ul>
              <li>Mirad los meses donde la banda turquesa es alta y la azul baja: ahí hay gente y no hay producto.</li>
              <li>Y al revés: si hay cosecha y no hay turista, ¿a quién le habláis ese mes?</li>
              <li>Una plataforma con piezas solo en dos meses no es un canal: es una campaña.</li>
              <li>Si todas vuestras piezas son BOFU, el calendario está vendiendo doce meses seguidos.</li>
            </ul>
          </div>
        </div>

        <div style="margin-top:var(--sp-5)">
          ${a({id:`calendario`,label:`Copiar prompt: revisar mi calendario`,hint:`Copia tu calendario y las dos estacionalidades, y pide qué comunicar en los meses de tensión.`})}
        </div>
      </div>

      <div class="tool-part" id="briefs">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Las 5 creatividades</h2></div>
          <span class="score" data-score-briefs></span>
        </div>
        <p class="muted" style="max-width:74ch">El caso pide «ejemplos de 5 creatividades finales, ya sean en
        redes sociales, Adwords, banners o cualquier otro formato online». Estos son sus briefs.</p>
        <div class="briefs" data-briefs style="margin-top:var(--sp-5)"></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>
      </div>`}),o({id:`payoff`,titulo:`Cuándo viaja. Cuándo hay producto.`,entradilla:`Las dos estacionalidades, superpuestas. Los meses marcados son aquellos en los que el turista está aquí y la cosecha no.`,html:`<p class="reveal-moment__empty">Elige un producto y las dos curvas aparecerán aquí.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Y ahora, a defenderlo: <a href="${c(`/tools/pitch.html`)}">sala de pitch</a>.</p>`})].join(``);function O(){D.querySelector(`[data-grid]`).innerHTML=v()}function k(){D.querySelector(`[data-plataformas]`).innerHTML=y()}function A(){D.querySelector(`[data-piezas]`).innerHTML=b()}function j(){D.querySelector(`[data-briefs]`).innerHTML=h.briefs.map(x).join(``)}function M(){D.querySelector(`[data-checks]`).innerHTML=C()}function N(){let e=g();D.querySelector(`[data-producto-info]`).textContent=`${e.ventanaConsumo} · ${e.temperaturaTransporte}. ${e.restriccionesEnvio}`}function P(){let e=D.querySelector(`[data-score-cal]`);e.innerHTML=`${h.piezas.length} <small>piezas en ${new Set(h.piezas.map(e=>e.mes)).size} meses</small>`,e.dataset.ok=h.piezas.length>=12?`si`:`no`;let t=h.briefs.filter(e=>m.every(t=>e[t.id].trim())).length,n=D.querySelector(`[data-score-briefs]`);n.innerHTML=`${t}/5 <small>briefs completos</small>`,n.dataset.ok=t===5?`si`:`no`}function F(){let{html:e,pie:t}=S();i(D,`payoff`,e,t)}function I(){O(),A(),M(),P(),F()}var L=null;function R(e,t){L={plat:e,mes:t};let n=D.querySelector(`[data-editor]`);n.hidden=!1,D.querySelector(`[data-editor-titulo]`).textContent=`Nueva pieza · ${e} · ${d[t]}`,n.querySelectorAll(`[data-pz]`).forEach(e=>{e.value=``}),n.scrollIntoView({behavior:`smooth`,block:`nearest`}),D.querySelector(`[data-pz="titulo"]`).focus()}function z(){L=null,D.querySelector(`[data-editor]`).hidden=!0}D.addEventListener(`click`,e=>{let t=e.target.closest(`[data-celda]`);if(t){R(t.dataset.plat,Number(t.dataset.mes));return}if(e.target.closest(`[data-pz-guardar]`)&&L){let e=e=>D.querySelector(`[data-pz="${e}"]`).value.trim();h.piezas.push({id:`pz${Date.now()}`,plataforma:L.plat,mes:L.mes,titulo:e(`titulo`),tipo:e(`tipo`),cluster:e(`cluster`),fase:D.querySelector(`[data-pz="fase"]`).value}),z(),I();return}if(e.target.closest(`[data-pz-cerrar]`)){z();return}let n=e.target.closest(`[data-borrar-pieza]`)?.dataset.borrarPieza;if(n){h.piezas=h.piezas.filter(e=>e.id!==n),I();return}let r=e.target.closest(`[data-plat-toggle]`)?.dataset.platToggle;if(r){let e=h.plataformas.indexOf(r);e>=0?(h.plataformas.splice(e,1),h.piezas=h.piezas.filter(e=>e.plataforma!==r)):h.plataformas.push(r),k(),I();return}if(e.target.closest(`[data-plat-add]`)){let e=D.querySelector(`[data-plat-nueva]`),t=e.value.trim();t&&!h.plataformas.includes(t)&&(h.plataformas.push(t),e.value=``,k(),I());return}let i=e.target.closest(`[data-pista]`);if(i){let e=D.querySelector(`[data-pista-texto="${i.dataset.pista}"]`);e.hidden=!e.hidden,i.textContent=e.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}}),D.addEventListener(`keydown`,e=>{if(e.key!==`Enter`&&e.key!==` `)return;let t=e.target.closest(`[data-celda]`);t&&(e.preventDefault(),R(t.dataset.plat,Number(t.dataset.mes)))}),D.addEventListener(`change`,e=>{e.target.dataset.producto!==void 0&&(h.producto=e.target.value,N(),I())}),D.addEventListener(`input`,e=>{let t=e.target.dataset.brief;if(!t)return;let n=h.briefs.find(e=>e.id===t);n[e.target.dataset.campo]=e.target.value;let r=e.target.closest(`.brief`),i=m.filter(e=>n[e.id].trim()).length,a=r.querySelector(`.brief__completo`);a.textContent=`${i}/${m.length}`,a.dataset.ok=i===m.length?`si`:`no`,M(),P()}),r(D,{calendario:T,...Object.fromEntries(h.briefs.map(e=>[`brief-${e.id}`,()=>E(e.id)]))}),e({mount:D.querySelector(`[data-statepanel]`),toolId:`calendario`,nombreArchivo:`calendario-y-creatividades`,getState:()=>structuredClone(h),setState:e=>{e.producto&&l.productos.some(t=>t.id===e.producto)&&(h.producto=e.producto),Array.isArray(e.plataformas)&&e.plataformas.length&&(h.plataformas=[...e.plataformas]),Array.isArray(e.piezas)&&(h.piezas=e.piezas.map((e,t)=>({...e,id:e.id||`pz-imp${t}`}))),Array.isArray(e.briefs)&&(h.briefs=h.briefs.map((t,n)=>({...t,...e.briefs[n]||{},id:t.id}))),D.querySelector(`[data-producto]`).value=h.producto,N(),k(),j(),I()},toMarkdown:w}),k(),j(),N(),I();