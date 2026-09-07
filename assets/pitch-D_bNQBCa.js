import"./modulepreload-polyfill-P2Xu9kJm.js";import{d as e,f as t,n,t as r}from"./components-CTATsCoj.js";import{a as i,o as a,t as o}from"./_util-P6weWh_n.js";import{a as s,o as c,s as l}from"./contenido-fo8BtRp9.js";/* empty css             */var u={equipos:s.map(e=>({id:e.id,nombre:`Equipo ${e.id}`,mandato:e.titulo})),puntos:Object.fromEntries(s.map(e=>[e.id,Object.fromEntries(c.map(e=>[e.id,0]))])),minPitch:6,minPreguntas:3,equipoActivo:null,fase:`parado`,restante:0,corriendo:!1},d=null,f=e=>c.reduce((t,n)=>t+(Number(u.puntos[e]?.[n.id])||0),0),p=()=>c.length*10;function m(e){let t=u.equipos.find(t=>t.id===e.id);return`<article class="mandato" data-activo="${u.equipoActivo===e.id?`si`:`no`}">
    <span class="mandato__n">Mandato ${e.id}</span>
    <h3 class="mandato__t">${a(e.titulo)}</h3>
    <p class="mandato__lema">${a(e.lema)}</p>
    <p class="mandato__encargo">${a(e.encargo)}</p>
    <ul class="mandato__puntos">${e.puntos.map(e=>`<li>${a(e)}</li>`).join(``)}</ul>
    <div class="mandato__pie">
      <a class="btn btn--ghost btn--sm" href="${a(e.prep.href)}">Preparar: ${a(e.prep.label)}</a>
      <button class="btn btn--secondary btn--sm" type="button" data-activar="${e.id}">
        ${u.equipoActivo===e.id?`Presentando`:`Le toca`}
      </button>
    </div>
    <div class="field">
      <label for="eq-${e.id}">Nombre del equipo</label>
      <input id="eq-${e.id}" type="text" data-equipo="${e.id}" value="${a(t.nombre)}" />
    </div>
  </article>`}function h(e){let t=Math.max(0,Math.round(e));return`${String(Math.floor(t/60)).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`}function g(){let e=(u.fase===`preguntas`?u.minPreguntas:u.minPitch)*60,t=e>0?Math.max(0,Math.min(100,u.restante/e*100)):0,n=u.equipos.find(e=>e.id===u.equipoActivo),r=u.fase===`pitch`?`Pitch`:u.fase===`preguntas`?`Preguntas del Comité`:u.fase===`fin`?`Tiempo`:`Preparado`;return`<div class="crono__equipo">${n?a(`${n.nombre} · ${n.mandato}`):`Elige el equipo que presenta`}</div>
    <div class="crono__display" data-crono-num aria-live="off">${h(u.restante)}</div>
    <div class="crono__etapa">${a(r)}</div>
    <div class="crono__barra"><i style="width:${t}%"></i></div>
    <div class="crono__controles">
      <button class="btn btn--primary" type="button" data-crono="toggle">${u.corriendo?`Pausa`:`Empezar`}</button>
      <button class="btn btn--secondary" type="button" data-crono="preguntas">Pasar a preguntas</button>
      <button class="btn btn--secondary" type="button" data-crono="reset">Reiniciar</button>
    </div>
    <div class="crono__config">
      <label>Pitch <input type="number" min="1" max="30" value="${u.minPitch}" data-min="minPitch" /> min</label>
      <label>Preguntas <input type="number" min="1" max="20" value="${u.minPreguntas}" data-min="minPreguntas" /> min</label>
    </div>
    <p class="visually-hidden" role="status" data-crono-aria></p>`}function _(){let e=u.equipos.map(e=>{let t=c.map(t=>`<td><input type="number" min="0" max="10" value="${u.puntos[e.id][t.id]}"
          data-punto-eq="${e.id}" data-punto-cr="${t.id}"
          aria-label="${a(t.label)} para ${a(e.nombre)}" /></td>`).join(``);return`<tr>
        <td class="scoretabla__equipo">${a(e.nombre)}<small>${a(e.mandato)}</small></td>
        ${t}
        <td class="total" data-total="${e.id}">${f(e.id)}</td>
      </tr>`}).join(``);return`<table class="scoretabla">
    <caption class="visually-hidden">Puntuación del Comité de Dirección, de 0 a 10 por criterio</caption>
    <thead><tr>
      <th scope="col">Equipo</th>
      ${c.map(e=>`<th scope="col" title="${a(e.ayuda)}">${a(e.label)}</th>`).join(``)}
      <th scope="col">Total</th>
    </tr></thead>
    <tbody>${e}</tbody>
  </table>`}function v(){let e=u.equipos.map(e=>({...e,total:f(e.id)})).sort((e,t)=>t.total-e.total);if(!e.some(e=>e.total>0))return{html:`<p class="reveal-moment__empty">El ranking aparece aquí en cuanto el Comité empiece a puntuar.</p>`,pie:``};let t=p(),n=e.map((e,n)=>`<div class="rank-fila">
        <span class="rank-pos">${n+1}</span>
        <div class="rank-cuerpo">
          <div class="rank-nombre">${a(e.nombre)} <span style="opacity:.65;font-size:.7em">${a(e.mandato)}</span></div>
          <div class="rank-barra"><i style="width:${Math.round(e.total/t*100)}%"></i></div>
        </div>
        <span class="rank-pts">${e.total}<span style="opacity:.5;font-size:.55em">/${t}</span></span>
      </div>`).join(``),r=e[0],i=e[1],o=`Sobre ${t} puntos posibles. ${a(r.nombre)} va primero con ${r.total}${i&&r.total-i.total<=2?`, a solo ${r.total-i.total} de ${a(i.nombre)}.`:`.`} <strong>${a(l)}</strong>`;return{html:`<div class="ranking">${n}</div>`,pie:o}}function y(){let e=[`# Sala de pitch · resultados`,``,`| Equipo | Mandato | `+c.map(e=>e.label).join(` | `)+` | Total |`,`|---|---|`+c.map(()=>`---`).join(`|`)+`|---|`];return u.equipos.map(e=>({...e,total:f(e.id)})).sort((e,t)=>t.total-e.total).forEach(t=>{e.push(`| ${t.nombre} | ${t.mandato} | ${c.map(e=>u.puntos[t.id][e.id]).join(` | `)} | ${t.total} |`)}),e.push(``,`_${l}_`),e.join(`
`)}var b=document.querySelector(`#app`);b.innerHTML=[t({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Sala de pitch`,current:!0}],nav:[{label:`Hub`,href:`/index.html`}]}),e({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Sala de pitch</h1>
        <p class="lead">Cinco equipos, cinco mandatos complementarios. Quien no presenta,
        es Comité de Dirección y puntúa. Seis minutos de pitch y tres de preguntas.</p>
      </div>
      <div class="recordatorio">${a(l)}</div>

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
      </div>`}),r({id:`payoff`,titulo:`Cómo ha quedado`,entradilla:`El ranking del Comité, en vivo.`,html:`<p class="reveal-moment__empty">El ranking aparece aquí en cuanto el Comité empiece a puntuar.</p>`}),e({variant:`light`,wide:!0,html:`<p class="tool-footer">Vuelta a la <a href="${o(`/index.html`)}">escaleta</a>.</p>`})].join(``);function x(){b.querySelector(`[data-mandatos]`).innerHTML=s.map(m).join(``)}function S(){let e=b.querySelector(`[data-crono-panel]`);e.dataset.fase=u.fase,e.innerHTML=g()}function C(){b.querySelector(`[data-scoring]`).innerHTML=_()}function w(){let{html:e,pie:t}=v();n(b,`payoff`,e,t)}function T(){let e=b.querySelector(`[data-crono-panel]`),t=e.querySelector(`[data-crono-num]`);t&&(t.textContent=h(u.restante));let n=(u.fase===`preguntas`?u.minPreguntas:u.minPitch)*60,r=e.querySelector(`.crono__barra i`);r&&(r.style.width=`${n>0?Math.max(0,Math.min(100,u.restante/n*100)):0}%`)}function E(){u.corriendo=!1,d&&=(clearInterval(d),null)}function D(){if(u.corriendo)return;(u.fase===`parado`||u.fase===`fin`)&&(u.fase=`pitch`,u.restante=u.minPitch*60),u.corriendo=!0,S();let e=Date.now()+u.restante*1e3;d=setInterval(()=>{if(u.restante=(e-Date.now())/1e3,u.restante<=0){u.restante=0,E(),u.fase===`pitch`?(u.fase=`preguntas`,u.restante=u.minPreguntas*60,S(),O(`Se acabó el tiempo de pitch. Turno de preguntas del Comité.`)):(u.fase=`fin`,S(),O(`Tiempo. Pasamos al siguiente equipo.`));return}T()},250)}function O(e){let t=b.querySelector(`[data-crono-aria]`);t&&(t.textContent=e)}b.addEventListener(`click`,e=>{let t=e.target.closest(`[data-activar]`)?.dataset.activar;if(t){u.equipoActivo=Number(t),E(),u.fase=`parado`,u.restante=u.minPitch*60,x(),S(),b.querySelector(`#crono`).scrollIntoView({behavior:`smooth`,block:`start`});return}let n=e.target.closest(`[data-crono]`)?.dataset.crono;if(n===`toggle`){u.corriendo?(E(),S()):D();return}if(n===`preguntas`){E(),u.fase=`preguntas`,u.restante=u.minPreguntas*60,S(),D();return}if(n===`reset`){E(),u.fase=`parado`,u.restante=u.minPitch*60,S();return}e.target.closest(`[data-exportar]`)&&i(`pitch-resultados.md`,y(),`text/markdown;charset=utf-8`)}),b.addEventListener(`input`,e=>{let t=e.target.dataset.equipo;if(t){u.equipos.find(e=>e.id===Number(t)).nombre=e.target.value,C(),w(),u.equipoActivo===Number(t)&&S();return}let n=e.target.dataset.min;if(n){u[n]=Math.max(1,Number(e.target.value)||1),u.corriendo||(u.restante=(u.fase===`preguntas`?u.minPreguntas:u.minPitch)*60,T());return}let r=e.target.dataset.puntoEq;if(r){let t=Math.max(0,Math.min(10,Number(e.target.value)||0));u.puntos[r][e.target.dataset.puntoCr]=t,b.querySelector(`[data-total="${r}"]`).textContent=f(r),w()}}),u.restante=u.minPitch*60,x(),S(),C(),w();