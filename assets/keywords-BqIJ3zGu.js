import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{o as s,s as c,t as l}from"./_util-P6weWh_n.js";import{t as u}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var d=[{id:``,label:`— sin etiquetar`},{id:`informacional`,label:`Informacional`},{id:`comercial`,label:`Comercial`},{id:`transaccional`,label:`Transaccional`},{id:`marca`,label:`De marca`}],f=[{id:``,label:`— sin fase`},{id:`tofu`,label:`TOFU`},{id:`mofu`,label:`MOFU`},{id:`bofu`,label:`BOFU`}],p={tofu:`#0ae4c3`,mofu:`#b79bff`,bofu:`#ffffff`,"":`rgba(255,255,255,.22)`},m=10,h={filas:u.keywords.items.map(e=>({id:e.id,cruda:e.cruda,normalizada:e.normalizada,idioma:e.idioma,volumen:e.volumen,kd:e.kd,cpc:e.cpc,parent:``,intencion:``,fase:``,cluster:``,seleccionada:!1,justificacion:``})),vista:`cruda`,origenDatos:`corpus`};function g(e){let t=[`	`,`;`,`,`],n=`,`,r=0;return t.forEach(t=>{let i=e.split(t).length;i>r&&(r=i,n=t)}),n}function _(e,t){let n=[],r=``,i=!1;for(let a=0;a<e.length;a++){let o=e[a];i?o===`"`?e[a+1]===`"`?(r+=`"`,a++):i=!1:r+=o:o===`"`?i=!0:o===t?(n.push(r),r=``):r+=o}return n.push(r),n.map(e=>e.trim())}var v=e=>e.toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^a-z0-9]/g,``),y={keyword:[`keyword`,`keywords`,`palabraclave`,`term`],volumen:[`volume`,`searchvolume`,`volumen`,`vol`,`volumemonthly`],kd:[`kd`,`difficulty`,`keyworddifficulty`,`dificultad`],cpc:[`cpc`,`costperclick`],parent:[`parenttopic`,`parenttopics`,`temapadre`,`topic`]};function b(e){if(e==null)return null;let t=String(e).trim();if(!t||t===`-`||t===`—`||t===`N/A`)return null;let n=1;/k$/i.test(t)&&(n=1e3,t=t.slice(0,-1)),/m$/i.test(t)&&(n=1e6,t=t.slice(0,-1)),t=t.replace(/[\s $€%]/g,``);let r=t.lastIndexOf(`,`),i=t.lastIndexOf(`.`);r>-1&&i>-1?t=r>i?t.replace(/\./g,``).replace(`,`,`.`):t.replace(/,/g,``):r>-1&&(t=t.length-r<=3?t.replace(`,`,`.`):t.replace(/,/g,``));let a=Number(t);return Number.isFinite(a)?a*n:null}var x=e=>String(e||``).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^a-z0-9]+/g,` `).trim();function S(e){let t=String(e||``).replace(/^﻿/,``).trim();if(!t)return{filas:[],avisos:[`El archivo está vacío.`]};let n=t.split(/\r?\n/).filter(e=>e.trim().length);if(n.length<2)return{filas:[],avisos:[`Solo hay una línea: falta la cabecera o faltan los datos.`]};let r=g(n[0]),i=_(n[0],r).map(v),a={};Object.entries(y).forEach(([e,t])=>{a[e]=i.findIndex(e=>t.includes(e))});let o=[];a.keyword<0&&(a.keyword=0,o.push(`No he encontrado una columna «Keyword»: uso la primera columna.`)),[`volumen`,`kd`,`cpc`,`parent`].forEach(e=>{a[e]<0&&o.push(`Sin columna «${e}» en el export: ese dato queda vacío.`)});let s=[];for(let e=1;e<n.length;e++){let t=_(n[e],r),i=(t[a.keyword]||``).trim();i&&s.push({cruda:i,volumen:a.volumen>=0?b(t[a.volumen]):null,kd:a.kd>=0?b(t[a.kd]):null,cpc:a.cpc>=0?b(t[a.cpc]):null,parent:a.parent>=0?(t[a.parent]||``).trim():``})}return s.length||o.push(`No he podido leer ninguna fila de datos.`),{filas:s,avisos:o}}function C(e){let t=new Map,n=e=>{[x(e.normalizada),x(e.cruda)].forEach(n=>{n&&(t.has(n)||t.set(n,[]),t.get(n).includes(e)||t.get(n).push(e))})};h.filas.forEach(n);let r=0,i=0;return e.forEach((e,a)=>{let o=t.get(x(e.cruda));if(o?.length)o.forEach(t=>{t.volumen=e.volumen,t.kd=e.kd,t.cpc=e.cpc,e.parent&&(t.parent=e.parent)}),r+=o.length;else{let t={id:`imp-${a+1}`,cruda:e.cruda,normalizada:e.cruda.toLowerCase().replace(/\s+/g,` `).trim(),idioma:``,volumen:e.volumen,kd:e.kd,cpc:e.cpc,parent:e.parent,intencion:``,fase:``,cluster:``,seleccionada:!1,justificacion:``};h.filas.push(t),n(t),i++}}),h.origenDatos=`ahrefs`,{enriquecidas:r,nuevas:i}}var w=()=>h.filas.filter(e=>e.seleccionada),T=()=>h.filas.filter(e=>typeof e.volumen==`number`&&e.volumen>0),E=()=>[...new Set(h.filas.map(e=>e.cluster.trim()).filter(Boolean))].sort();function D(e){let t=h.vista===`cruda`?e.cruda:e.normalizada,n=h.vista===`cruda`?e.normalizada:e.cruda,r=e.cruda!==e.normalizada,i=(e,t)=>e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${s(e.label)}</option>`).join(``);return`<tr data-fila="${s(e.id)}"${e.seleccionada?` class="is-sel"`:``}>
    <td><input class="kw-check" type="checkbox" data-sel="${s(e.id)}"${e.seleccionada?` checked`:``}
      aria-label="Seleccionar ${s(t)} para el listado final" /></td>
    <td class="kw-term">${s(t)}
      ${r?`<small>${s(n)}</small>`:``}</td>
    <td>${e.idioma?`<span class="kw-idioma">${s(e.idioma)}</span>`:``}</td>
    <td class="num" data-vacio="${e.volumen===null?`si`:`no`}">${e.volumen===null?`—`:c(e.volumen)}</td>
    <td class="num" data-vacio="${e.kd===null?`si`:`no`}">${e.kd===null?`—`:c(e.kd)}</td>
    <td><select data-campo="intencion" data-id="${s(e.id)}" aria-label="Intención de ${s(t)}">${i(d,e.intencion)}</select></td>
    <td><select data-campo="fase" data-id="${s(e.id)}" aria-label="Fase de ${s(t)}">${i(f,e.fase)}</select></td>
    <td><input type="text" data-campo="cluster" data-id="${s(e.id)}" value="${s(e.cluster)}"
      list="clusters" placeholder="nombre del cluster" aria-label="Cluster de ${s(t)}" /></td>
  </tr>`}function O(){return`<datalist id="clusters">${E().map(e=>`<option value="${s(e)}"></option>`).join(``)}</datalist>
  <div class="kw-tabla-wrap">
    <table class="kw-tabla">
      <caption class="visually-hidden">Corpus de keywords con intención, fase y cluster</caption>
      <thead><tr>
        <th scope="col"><span class="visually-hidden">Seleccionar</span></th>
        <th scope="col">Keyword</th>
        <th scope="col">Idioma</th>
        <th scope="col">Volumen</th>
        <th scope="col">KD</th>
        <th scope="col">Intención</th>
        <th scope="col">Fase</th>
        <th scope="col">Cluster</th>
      </tr></thead>
      <tbody>${h.filas.map(D).join(``)}</tbody>
    </table>
  </div>`}function k(){let e=w();return e.length?e.map(e=>`<div class="sel-item" data-justificada="${e.justificacion.trim().length>15?`si`:`no`}">
        <div class="sel-item__kw">${s(e.normalizada)}
          <small>${e.fase?e.fase.toUpperCase():`sin fase`} · ${e.intencion||`sin intención`} ·
          ${e.volumen===null?`sin volumen`:`${c(e.volumen)} búsquedas`}</small></div>
        <textarea data-just="${s(e.id)}" rows="2"
          placeholder="¿Por qué esta keyword? Qué buyer persona la busca, en qué momento y qué contenido la responde."
          aria-label="Justificación de ${s(e.normalizada)}">${s(e.justificacion)}</textarea>
        <button class="btn btn--ghost btn--sm" type="button" data-quitar-sel="${s(e.id)}">Quitar</button>
      </div>`).join(``):`<p class="sel-vacia">Marca keywords en la tabla de arriba y aparecerán aquí para justificarlas.</p>`}function A(e,t,n){let r=e.reduce((e,t)=>e+t.valor,0);if(!r)return[];let i=[],a=0,o=0,s=t,c=n,l=[...e].sort((e,t)=>t.valor-e.valor),u=r;for(;l.length;){let e=s>=c,t=Math.max(1,Math.min(l.length,Math.round(Math.sqrt(l.length)))),n=l.slice(0,t),r=n.reduce((e,t)=>e+t.valor,0),d=r/u*(e?s:c),f=e?o:a;if(n.forEach(t=>{let n=t.valor/r*(e?c:s);i.push(e?{...t,x:a,y:f,w:d,h:n}:{...t,x:f,y:o,w:n,h:d}),f+=n}),e?(a+=d,s-=d):(o+=d,c-=d),l=l.slice(t),u-=r,s<=.5||c<=.5)break}return i}function j(){let e=T(),t=h.filas.filter(e=>e.fase);if(!e.length)return{html:`<p class="reveal-moment__empty">Todavía no hay volúmenes. Importa el export de Ahrefs
        y el mapa aparecerá aquí: cada keyword con el tamaño de su volumen real.</p>`,pie:`El corpus de partida trae <strong>${h.filas.length}</strong> términos sin datos de búsqueda —
        <code>volumen: null</code>, no cero. El dato lo traemos de Ahrefs en clase.`};let n=1e3,r=A(e.map(e=>({kw:e.normalizada,valor:e.volumen,fase:e.fase,sel:e.seleccionada})).sort((e,t)=>t.valor-e.valor).slice(0,60),n,420).map(e=>{let t=e.w>78&&e.h>30,n=p[e.fase]??p[``],r=e.fase===`bofu`||e.fase===`tofu`?`#00133f`:`#ffffff`,i=e.kw.length>Math.floor(e.w/7.2)?`${e.kw.slice(0,Math.max(3,Math.floor(e.w/7.2)-1))}…`:e.kw;return`<g>
        <rect x="${e.x.toFixed(1)}" y="${e.y.toFixed(1)}" width="${Math.max(0,e.w-1).toFixed(1)}"
              height="${Math.max(0,e.h-1).toFixed(1)}" fill="${n}"
              ${e.sel?`stroke="#ffffff" stroke-width="3"`:``}>
          <title>${s(e.kw)} — ${c(e.valor)} búsquedas — ${e.fase?e.fase.toUpperCase():`sin fase`}</title>
        </rect>
        ${t?`<text class="tm-kw" x="${(e.x+8).toFixed(1)}" y="${(e.y+20).toFixed(1)}" font-size="13" fill="${r}">${s(i)}</text>
        <text class="tm-vol" x="${(e.x+8).toFixed(1)}" y="${(e.y+36).toFixed(1)}" font-size="11" fill="${r}">${c(e.valor)}</text>`:``}
      </g>`}).join(``),i=`<div class="treemap-leyenda">
    ${[`tofu`,`mofu`,`bofu`].map(e=>`<span><i style="background:${p[e]}"></i>${e.toUpperCase()}</span>`).join(``)}
    <span><i style="background:${p[``]}"></i>Sin fase asignada</span>
    <span><i style="background:transparent;border:3px solid #fff"></i>En vuestras 10</span>
  </div>`,a=[`tofu`,`mofu`,`bofu`,``].map(t=>({fid:t,v:e.filter(e=>e.fase===t).reduce((e,t)=>e+t.volumen,0)})),o=a.reduce((e,t)=>e+t.v,0)||1,l=e=>Math.round(a.find(t=>t.fid===e).v/o*100),u=`Cada rectángulo es una keyword y su tamaño es el volumen real importado.
    Del volumen total, <strong>${l(`tofu`)}% está en TOFU</strong>, ${l(`mofu`)}% en MOFU y
    ${l(`bofu`)}% en BOFU (${l(``)}% sin fase, sobre ${t.length} de ${h.filas.length} etiquetadas).
    Si vuestro plan se apoya en cuatro términos transaccionales enormes, se ve aquí antes que en ninguna hoja de cálculo.`;return{html:`<svg class="treemap" viewBox="0 0 ${n} 420" role="img"
      aria-label="Mapa de las keywords: el tamaño es el volumen de búsqueda y el color, la fase asignada">${r}</svg>${i}`,pie:u}}function M(){let e=w(),t=e.filter(e=>e.justificacion.trim().length>15),n=new Set(e.map(e=>e.fase).filter(Boolean)),r=E();return[{ok:e.length>=m,txt:`Al menos ${m} keywords seleccionadas (ahora: ${e.length}).`},{ok:e.length>0&&t.length===e.length,txt:`Todas las seleccionadas justificadas (ahora: ${t.length} de ${e.length}).`},{ok:n.size>=2,txt:`Al menos dos fases del funnel representadas (ahora: ${n.size?[...n].map(e=>e.toUpperCase()).join(`, `):`ninguna`}).`},{ok:r.length>=2,txt:`Al menos dos clusters temáticos nombrados (ahora: ${r.length}).`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${s(e.txt)}</li>`).join(``)}function N(){let e=w(),t=[`# Listado de keywords`,``,`_Caso: ${u.meta.caso}_`,``];t.push(`## Las ${e.length} keywords seleccionadas`,``),e.length?(t.push(`| # | Keyword | Idioma | Volumen | KD | Intención | Fase | Cluster |`,`|---|---|---|---|---|---|---|---|`),e.forEach((e,n)=>{t.push(`| ${n+1} | ${e.normalizada} | ${e.idioma||`—`} | ${e.volumen===null?`—`:c(e.volumen)} | ${e.kd===null?`—`:c(e.kd)} | ${e.intencion||`—`} | ${e.fase?e.fase.toUpperCase():`—`} | ${e.cluster||`—`} |`)}),t.push(``,`### Justificación de cada elección`,``),e.forEach((e,n)=>{t.push(`${n+1}. **${e.normalizada}** — ${e.justificacion.trim()||`_(sin justificar)_`}`)})):t.push(`_(todavía no hay ninguna seleccionada)_`,``);let n=E();return n.length&&(t.push(``,`## Clusters temáticos`,``),n.forEach(e=>{let n=h.filas.filter(t=>t.cluster.trim()===e);t.push(`- **${e}** (${n.length} términos): ${n.map(e=>e.normalizada).join(`, `)}`)})),t.push(``,`_Origen de los datos de búsqueda: ${h.origenDatos===`ahrefs`?`export de Ahrefs importado en clase`:`sin importar — el corpus de partida no trae volúmenes`}._`),t.join(`
`)}function P(){return`Soy responsable de contenidos de una marca de alimentación española que quiere que los turistas extranjeros la recompren al volver a su país.

Este es mi corpus de keywords, tal y como se buscan:

${h.filas.map(e=>`- ${e.normalizada} (${e.idioma||`?`}) — volumen: ${e.volumen===null?`sin dato`:e.volumen}`).join(`
`)}

Haz tres cosas:
1. Agrúpalas en clusters temáticos y ponle nombre a cada cluster.
2. Para cada cluster, di qué intención de búsqueda predomina (informacional, comercial, transaccional o de marca).
3. Señala qué huecos temáticos ves: qué buscaría mi buyer persona que no está en esta lista.

No inventes volúmenes de búsqueda: si un término no tiene dato, dilo.`}function F(){let e=w(),t=e.map(e=>`- ${e.normalizada} | fase: ${e.fase||`sin asignar`} | intención: ${e.intencion||`sin asignar`} | volumen: ${e.volumen===null?`sin dato`:e.volumen} | mi justificación: ${e.justificacion||`(vacía)`}`).join(`
`);return`Estoy cerrando el listado de keywords de un plan de contenidos para promocionar un producto agroalimentario español entre turistas extranjeros.

Estas son mis ${e.length} keywords seleccionadas:

${t}

Haz tres cosas:
1. Revisa cada justificación: dime cuál es débil y por qué, y cómo la reescribirías en dos líneas.
2. Dime si el reparto entre fases del funnel está desequilibrado y qué implicaría eso para el plan.
3. Para cada keyword, propón un título de contenido concreto que la trabaje.

No cambies mi selección: trabaja sobre ella.`}var I=document.querySelector(`#app`);I.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Keywords`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M2`,href:`/decks/m2.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Keywords, clusters y las 10 del caso</h1>
        <p class="lead">Importa el export de Ahrefs, etiqueta intención y fase, nombra tus clusters
        y cierra el listado de al menos diez keywords justificadas que pide el caso.</p>
        <span class="fuente">${s(u.keywords.fuente)}</span>
      </div>

      <div class="tool-part" id="importar">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Importar el export de Ahrefs</h2></div>
        </div>
        <div class="importador">
          <p class="importador__lead">Exporta desde <strong>Keywords Explorer</strong> en CSV o TSV y suéltalo aquí.
          Detecto el separador y las cabeceras (<code>Keyword</code>, <code>Volume</code>, <code>KD</code>,
          <code>CPC</code>, <code>Parent topic</code>) y tolero columnas ausentes. Todo el parseo ocurre en tu
          navegador: <strong>no se sube nada a ningún sitio</strong>.</p>
          <div class="importador__cols">
            <div class="dropzone" data-kw="drop" tabindex="0" role="button">
              <span class="dropzone__icon" aria-hidden="true">⤓</span>
              <span class="dropzone__text">Arrastra el <code>.csv</code> o <code>.tsv</code>, o pulsa para elegirlo</span>
              <input class="visually-hidden" type="file" accept=".csv,.tsv,.txt,text/csv" data-kw="file" />
            </div>
            <div class="field">
              <label for="kw-pegar">…o pega aquí el contenido</label>
              <textarea id="kw-pegar" data-kw="paste" placeholder="Keyword&#9;Volume&#9;KD&#9;CPC&#9;Parent topic"></textarea>
            </div>
          </div>
          <div class="row">
            <button class="btn btn--primary" type="button" data-kw="importar">Importar</button>
            <button class="btn btn--ghost" type="button" data-kw="reset">Volver al corpus de partida</button>
          </div>
          <p class="importador__estado" data-kw="estado" role="status" aria-live="polite"></p>
        </div>
      </div>

      <div class="tool-part" id="tabla">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>Etiquetar y agrupar</h2></div>
          <span class="score" data-score-tabla></span>
        </div>
        <div class="toolbar">
          <span class="field__label">Ver la keyword:</span>
          <div class="toggle" role="group" aria-label="Ver la keyword cruda o normalizada">
            <button type="button" data-vista="cruda" aria-pressed="true">Cruda</button>
            <button type="button" data-vista="normalizada" aria-pressed="false">Normalizada</button>
          </div>
          <span class="toolbar__spacer"></span>
          <span class="status-live" data-vista-nota>Tal y como se teclea: con variantes, faltas y mezcla de idiomas.</span>
        </div>
        <div data-tabla></div>
        <div class="pista">
          <button class="pista__btn" type="button" data-pista>Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto hidden>
            <p><strong>No hay una clasificación correcta.</strong> La misma keyword cambia de fase según quién
            la busque. Preguntas que ayudan:</p>
            <ul>
              <li>Léela en voz alta: ¿esa persona sabe ya lo que quiere comprar?</li>
              <li>¿Qué esperaría encontrar al hacer clic: una explicación, una comparativa o un botón de compra?</li>
              <li>Un cluster no es un montón de sinónimos: es un tema del que podríais escribir diez piezas distintas.</li>
              <li>Si una keyword tiene mucho volumen pero no la sabéis justificar, probablemente no es vuestra.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tool-part" id="seleccion">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte C</span><h2>Las ${m} keywords, justificadas</h2></div>
          <span class="score" data-score-sel></span>
        </div>
        <p class="muted" style="max-width:74ch">El caso pide «un listado de, al menos, 10 palabras clave,
        justificando y explicando el porqué de dicha elección». Esto es literalmente ese listado.</p>
        <div class="seleccion" data-seleccion style="margin-top:var(--sp-4)"></div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>

        <div class="row" style="margin-top:var(--sp-5)">
          ${a({id:`clusters`,label:`Copiar prompt: agrupar en clusters`,hint:`Copia tu corpus completo y pide una propuesta de agrupación temática.`})}
        </div>
        <div class="row" style="margin-top:var(--sp-3)">
          ${a({id:`seleccion`,label:`Copiar prompt: revisar mis justificaciones`,hint:`Copia tus 10 con su justificación y pide que señalen las débiles.`})}
        </div>
      </div>`}),o({id:`payoff`,titulo:`Sobre qué estáis construyendo el plan`,entradilla:`El tamaño es el volumen real. El color, la fase que le habéis puesto vosotros.`,html:`<p class="reveal-moment__empty">Importa el export de Ahrefs y etiqueta las fases: el mapa se dibuja solo.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza del entregable: <a href="${l(`/tools/funnel.html`)}">el mix de captación y la conversión</a>.</p>`})].join(``);function L(){I.querySelector(`[data-tabla]`).innerHTML=O()}function R(){I.querySelector(`[data-seleccion]`).innerHTML=k()}function z(){I.querySelector(`[data-checks]`).innerHTML=M()}function B(){let e=w(),t=h.filas.filter(e=>e.fase&&e.intencion).length,n=I.querySelector(`[data-score-tabla]`);n.innerHTML=`${t}/${h.filas.length} <small>etiquetadas</small>`,n.dataset.ok=t===h.filas.length?`si`:`no`;let r=I.querySelector(`[data-score-sel]`);r.innerHTML=`${e.length}/${m} <small>seleccionadas</small>`,r.dataset.ok=e.length>=m?`si`:`no`}function V(){let{html:e,pie:t}=j();i(I,`payoff`,e,t)}function H({tabla:e=!0}={}){e&&L(),R(),z(),B(),V()}var U=I.querySelector(`[data-kw="estado"]`),W=(e,t=`ok`)=>{U.textContent=e,U.dataset.tipo=t};function G(e){let{filas:t,avisos:n}=S(e);if(!t.length)return W(n.join(` `)||`No he podido leer el archivo.`,`error`);let{enriquecidas:r,nuevas:i}=C(t);H();let a=n.length?` (${n.join(` `)})`:``,o=(e,t,n)=>`${e} ${e===1?t:n}`;W(`Importad${t.length===1?`a`:`as`} ${o(t.length,`fila`,`filas`)}: ${o(r,`término del corpus enriquecido`,`términos del corpus enriquecidos`)} y ${o(i,`término nuevo`,`términos nuevos`)}.${a}`)}I.addEventListener(`click`,e=>{let t=e.target.closest(`[data-kw]`)?.dataset.kw;t===`drop`?I.querySelector(`[data-kw="file"]`).click():t===`importar`?G(I.querySelector(`[data-kw="paste"]`).value):t===`reset`&&(h.filas=u.keywords.items.map(e=>({id:e.id,cruda:e.cruda,normalizada:e.normalizada,idioma:e.idioma,volumen:null,kd:null,cpc:null,parent:``,intencion:``,fase:``,cluster:``,seleccionada:!1,justificacion:``})),h.origenDatos=`corpus`,H(),W(`Vuelta al corpus de partida, sin volúmenes.`))});var K=I.querySelector(`[data-kw="file"]`);K.addEventListener(`change`,()=>{let e=K.files?.[0];if(!e)return;let t=new FileReader;t.onload=()=>G(String(t.result)),t.onerror=()=>W(`No se pudo leer el archivo.`,`error`),t.readAsText(e)});var q=I.querySelector(`[data-kw="drop"]`);[`dragenter`,`dragover`].forEach(e=>q.addEventListener(e,e=>{e.preventDefault(),q.classList.add(`is-over`)})),[`dragleave`,`drop`].forEach(e=>q.addEventListener(e,()=>q.classList.remove(`is-over`))),q.addEventListener(`drop`,e=>{e.preventDefault();let t=e.dataTransfer?.files?.[0];if(!t)return;let n=new FileReader;n.onload=()=>G(String(n.result)),n.readAsText(t)}),q.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),K.click())}),I.addEventListener(`change`,e=>{let t=e.target.dataset.sel;if(t){let n=h.filas.find(e=>e.id===t);n.seleccionada=e.target.checked,e.target.closest(`tr`).classList.toggle(`is-sel`,n.seleccionada),R(),z(),B(),V();return}let n=e.target.dataset.campo;if(n){let t=h.filas.find(t=>t.id===e.target.dataset.id);t[n]=e.target.value,R(),z(),B(),V()}}),I.addEventListener(`input`,e=>{if(e.target.dataset.campo===`cluster`){h.filas.find(t=>t.id===e.target.dataset.id).cluster=e.target.value,z();return}let t=e.target.dataset.just;if(t){let n=h.filas.find(e=>e.id===t);n.justificacion=e.target.value,e.target.closest(`.sel-item`).dataset.justificada=n.justificacion.trim().length>15?`si`:`no`,z()}}),I.addEventListener(`click`,e=>{let t=e.target.closest(`[data-quitar-sel]`)?.dataset.quitarSel;t&&(h.filas.find(e=>e.id===t).seleccionada=!1,H())}),I.addEventListener(`click`,e=>{let t=e.target.closest(`[data-vista]`)?.dataset.vista;!t||t===h.vista||(h.vista=t,I.querySelectorAll(`[data-vista]`).forEach(e=>e.setAttribute(`aria-pressed`,String(e.dataset.vista===t))),I.querySelector(`[data-vista-nota]`).textContent=t===`cruda`?`Tal y como se teclea: con variantes, faltas y mezcla de idiomas.`:`Limpia y agrupada: la forma con la que trabaja el plan de contenidos.`,L())}),I.addEventListener(`click`,e=>{if(!e.target.closest(`[data-pista]`))return;let t=I.querySelector(`[data-pista-texto]`);t.hidden=!t.hidden,e.target.closest(`[data-pista]`).textContent=t.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}),r(I,{clusters:P,seleccion:F}),e({mount:I.querySelector(`[data-statepanel]`),toolId:`keywords`,nombreArchivo:`keywords`,getState:()=>({filas:structuredClone(h.filas),vista:h.vista,origenDatos:h.origenDatos}),setState:e=>{if(!Array.isArray(e.filas))throw Error(`el archivo no trae la lista de keywords`);h.filas=e.filas.map(e=>({id:e.id,cruda:e.cruda??``,normalizada:e.normalizada??e.cruda??``,idioma:e.idioma??``,volumen:e.volumen??null,kd:e.kd??null,cpc:e.cpc??null,parent:e.parent??``,intencion:e.intencion??``,fase:e.fase??``,cluster:e.cluster??``,seleccionada:!!e.seleccionada,justificacion:e.justificacion??``})),h.vista=e.vista===`normalizada`?`normalizada`:`cruda`,h.origenDatos=e.origenDatos||`corpus`,I.querySelectorAll(`[data-vista]`).forEach(e=>e.setAttribute(`aria-pressed`,String(e.dataset.vista===h.vista))),H()},toMarkdown:N,ayuda:`Este archivo es la segunda de las dos piezas que hay que traer el 25 de septiembre.`}),H();