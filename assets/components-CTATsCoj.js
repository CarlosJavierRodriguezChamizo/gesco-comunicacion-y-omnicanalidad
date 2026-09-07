import{a as e,i as t,n,o as r,r as i,t as a}from"./_util-P6weWh_n.js";var o={light:`site-header__logo--blue`,blue:`site-header__logo--white`};function s(e=[]){return e.length?`<nav class="breadcrumb" aria-label="Migas de pan"><ol>${e.map(e=>{let t=r(e.label);return e.current||!e.href?`<li><span aria-current="page">${t}</span></li>`:`<li><a href="${r(a(e.href))}">${t}</a></li>`}).join(``)}</ol></nav>`:``}function c({variant:e=`light`,brandHref:i=`/index.html`,nav:c=[],breadcrumb:l=[],extra:u={}}={}){let d=t(`site-header`,e===`blue`&&`site-header--blue`),f=o[e]||o.light,p=c.length?`<nav class="site-header__nav" aria-label="Navegación principal">${c.map(e=>`<a href="${r(a(e.href))}"${n({"aria-current":e.current?`page`:null})}>${r(e.label)}</a>`).join(``)}</nav>`:``;return`<header class="${d}"${n(u)}>
    <div class="wrap wrap--wide site-header__inner">
      <div class="site-header__brand">
        <a href="${r(a(i))}" aria-label="Ir al hub">
          <span class="site-header__logo ${f}" role="img" aria-label="ESIC"></span>
        </a>
        ${s(l)}
      </div>
      ${p}
    </div>
  </header>`}function l({html:e=``,variant:r=`light`,wrap:i=!0,wide:a=!1,tight:o=!1,id:s,tag:c=`section`,extra:l={}}={}){let u=t(`section`,`section--${r}`,o&&`section--tight`),d=i?`<div class="wrap${a?` wrap--wide`:``}">${e}</div>`:e;return`<${c} class="${u}"${n({id:s,...l})}>${d}</${c}>`}function u({title:e,body:i=``,href:o,accent:s=!1,eyebrow:c=``,extra:l={}}={}){let u=t(`card`,o&&`card--link`,s&&`card--accent`),d=o?`a`:`div`,f=o?` href="${r(a(o))}"`:``,p=c?`<div class="row" style="margin-bottom:var(--sp-3)">${c}</div>`:``,m=e?`<h3 class="card__title">${r(e)}</h3>`:``;return`<${d} class="${u}"${f}${n(l)}>
    ${p}${m}
    <div class="card__body">${i}</div>
  </${d}>`}function d({label:e,variant:i=`solid`,icon:a=``,extra:o={}}={}){let s=t(`chip`,i===`outline`&&`chip--outline`),c=a?`<span aria-hidden="true">${a}</span>`:``;return`<span class="${s}"${n(o)}>${c}${r(e)}</span>`}function f({value:e,label:t,sub:i=``,fuente:a=``,extra:o={}}={}){let s=i?`<span class="kpi__sub">${r(i)}</span>`:``,c=a?`<span class="fuente">${r(a)}</span>`:``;return`<div class="kpi"${n(o)}>
    <span class="kpi__num">${r(e)}</span>
    <span class="kpi__label">${r(t)}</span>
    ${s}${c}
  </div>`}function p({label:e,href:i,variant:o=`primary`,type:s=`button`,disabled:c=!1,extra:l={}}={}){let u=t(`btn`,`btn--${o}`);return i?`<a class="${u}" href="${r(a(i))}"${n({"aria-disabled":c||null,...l})}>${r(e)}</a>`:`<button class="${u}" type="${r(s)}"${n({disabled:c,...l})}>${r(e)}</button>`}function m({block:e,label:i,extra:a={}}={}){let o=String(e||``).toLowerCase(),s=i??o.toUpperCase();return`<span class="${t(`badge`,[`m1`,`m2`,`m3`,`m4`].includes(o)&&`badge--${o}`)}"${n(a)}>${r(s)}</span>`}var h=1;function g({mount:t,toolId:n,nombreArchivo:a,getState:o,setState:s,toMarkdown:c,ayuda:l=``}){t.innerHTML=`
    <section class="statepanel" aria-labelledby="sp-title-${r(n)}">
      <div class="statepanel__head">
        <h2 class="statepanel__title" id="sp-title-${r(n)}">Guardar y recuperar tu trabajo</h2>
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
             aria-describedby="sp-drop-help-${r(n)}">
          <span class="dropzone__icon" aria-hidden="true">⤓</span>
          <span class="dropzone__text">Arrastra aquí tu <code>.json</code> o pulsa para elegirlo</span>
          <input class="visually-hidden" type="file" accept=".json,application/json" data-sp="file" />
        </div>
        <p class="small muted" id="sp-drop-help-${r(n)}">
          También puedes pegar el contenido del JSON en el cuadro de abajo y pulsar «Importar».
        </p>
        <label class="statepanel__label" for="sp-paste-${r(n)}">Pegar JSON</label>
        <textarea class="statepanel__paste" id="sp-paste-${r(n)}" rows="3"
                  data-sp="paste" placeholder='{"tool":"${r(n)}", …}'></textarea>
        <button class="btn btn--secondary" type="button" data-sp="importar">Importar</button>
      </div>

      <p class="statepanel__status status-live" data-sp="status" role="status" aria-live="polite"></p>
      ${l?`<p class="small muted">${l}</p>`:``}
    </section>`;let u=e=>t.querySelector(`[data-sp="${e}"]`),d=u(`status`),f=u(`file`),p=u(`drop`),m=(e,t=`ok`)=>{d.textContent=e,d.dataset.tipo=t},g=()=>({tool:n,version:h,fecha:new Date().toISOString(),estado:o()});t.addEventListener(`click`,async t=>{let n=t.target.closest(`[data-sp]`)?.dataset.sp;if(n===`md`)e(`${a}.md`,c(),`text/markdown;charset=utf-8`),m(`Markdown descargado. Pégalo en el Word del entregable.`);else if(n===`json`)e(`${a}.json`,JSON.stringify(g(),null,2),`application/json`),m(`JSON descargado. Guárdalo: es lo que tendrás que reimportar.`);else if(n===`copiar-md`){let e=await i(c());m(e?`Markdown copiado al portapapeles.`:`No se pudo copiar; usa «Exportar .md».`,e?`ok`:`error`)}else n===`importar`?_(u(`paste`).value):n===`drop`&&f.click()});function _(e){let t=String(e||``).trim();if(!t)return m(`No hay nada que importar: pega el JSON o arrastra el archivo.`,`error`);let r;try{r=JSON.parse(t)}catch{return m(`Ese texto no es un JSON válido. Copia el archivo entero, desde la primera llave.`,`error`)}let i=r&&typeof r==`object`&&`estado`in r;if(i&&r.tool&&r.tool!==n)return m(`Ese archivo es de la herramienta «${r.tool}», no de esta. Ábrelo en su propia página.`,`error`);let a=i?r.estado:r;if(!a||typeof a!=`object`)return m(`El archivo no contiene un estado reconocible.`,`error`);try{s(a);let e=i&&r.fecha?new Date(r.fecha).toLocaleString(`es-ES`):null;m(e?`Trabajo recuperado (exportado el ${e}).`:`Trabajo recuperado.`)}catch(e){m(`No se pudo aplicar el estado: ${e.message}`,`error`)}}function v(e){if(!e)return;let t=new FileReader;t.onload=()=>_(String(t.result)),t.onerror=()=>m(`No se pudo leer el archivo.`,`error`),t.readAsText(e)}return f.addEventListener(`change`,()=>v(f.files?.[0])),[`dragenter`,`dragover`].forEach(e=>p.addEventListener(e,e=>{e.preventDefault(),p.classList.add(`is-over`)})),[`dragleave`,`drop`].forEach(e=>p.addEventListener(e,()=>p.classList.remove(`is-over`))),p.addEventListener(`drop`,e=>{e.preventDefault(),v(e.dataTransfer?.files?.[0])}),p.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),f.click())}),{refrescar:()=>{}}}function _({id:e,label:t=`Copiar prompt para la IA`,hint:n=``}){return`<div class="askai">
    <button class="btn btn--secondary askai__btn" type="button" data-askai="${r(e)}">
      <span aria-hidden="true">✦</span> ${r(t)}
    </button>
    ${n?`<span class="askai__hint small muted">${r(n)}</span>`:``}
    <span class="askai__ok small" data-askai-ok="${r(e)}" role="status" aria-live="polite"></span>
  </div>`}function v(e,t){e.addEventListener(`click`,async n=>{let r=n.target.closest(`[data-askai]`);if(!r)return;let a=r.dataset.askai,o=t[a];if(!o)return;let s=e.querySelector(`[data-askai-ok="${a}"]`),c=await i(o());s&&(s.textContent=c?`Prompt copiado — pégalo en tu IA.`:`No se pudo copiar.`,s.dataset.tipo=c?`ok`:`error`,clearTimeout(s._t),s._t=setTimeout(()=>{s.textContent=``,delete s.dataset.tipo},4e3))})}function y({id:e,titulo:t,entradilla:i=``,html:a=``,pie:o=``,variant:s=`blue`,extra:c={}}={}){return`<section class="reveal-moment reveal-moment--${s}" id="${r(e)}"${n(c)}>
    <div class="wrap wrap--wide">
      <div class="reveal-moment__head">
        <span class="reveal-moment__eyebrow">Lo que esto enseña</span>
        <h2 class="reveal-moment__title">${r(t)}</h2>
        ${i?`<p class="reveal-moment__lead">${r(i)}</p>`:``}
      </div>
      <div class="reveal-moment__body" data-reveal-body="${r(e)}">${a}</div>
      ${o?`<p class="reveal-moment__foot" data-reveal-foot="${r(e)}">${o}</p>`:`<p class="reveal-moment__foot" data-reveal-foot="${r(e)}"></p>`}
    </div>
  </section>`}function b(e,t,n,r){let i=e.querySelector(`[data-reveal-body="${t}"]`);if(i&&(i.innerHTML=n,i.classList.remove(`is-in`),i.offsetWidth,i.classList.add(`is-in`)),r!==void 0){let n=e.querySelector(`[data-reveal-foot="${t}"]`);n&&(n.innerHTML=r)}}export{g as a,f as c,l as d,c as f,v as i,d as l,b as n,m as o,_ as r,p as s,y as t,u};