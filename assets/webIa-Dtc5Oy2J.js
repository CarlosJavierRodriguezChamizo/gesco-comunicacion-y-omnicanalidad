import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{o as s,t as c}from"./_util-P6weWh_n.js";import{t as l}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var u=[{id:``,label:`— sin tipo`},{id:`home`,label:`Home`},{id:`categoria`,label:`Categoría / catálogo`},{id:`producto`,label:`Ficha de producto`},{id:`contenido`,label:`Contenido / blog`},{id:`formulario`,label:`Formulario`},{id:`cliente`,label:`Área de cliente`},{id:`carrito`,label:`Carrito / checkout`},{id:`legal`,label:`Legal / RGPD`},{id:`marca`,label:`Marca / historia`}],d=[{id:``,label:`— sin fase`},{id:`tofu`,label:`TOFU`},{id:`mofu`,label:`MOFU`},{id:`bofu`,label:`BOFU`}],f=[{id:`home`,tipos:[`home`],min:1,txt:`Home y menú principal (nivel visual inicial del catálogo).`},{id:`categoria`,tipos:[`categoria`],min:1,txt:`Página de categoría o catálogo.`},{id:`producto`,tipos:[`producto`],min:3,txt:`Ficha de producto completa, con al menos tres productos desarrollados.`},{id:`formulario`,tipos:[`formulario`],min:1,txt:`Formularios web, con campos obligatorios y opcionales.`},{id:`cliente`,tipos:[`cliente`],min:1,txt:`Área privada de cliente tras el login.`},{id:`carrito`,tipos:[`carrito`],min:1,txt:`Carrito de compra y proceso de checkout y pago.`},{id:`contenido`,tipos:[`contenido`,`marca`],min:2,txt:`Contenido editorial que trabaje los clusters (blog, historia, recetas…).`},{id:`legal`,tipos:[`legal`],min:1,txt:`Página legal: privacidad, condiciones y consentimiento.`}],p={tofu:`#0ae4c3`,mofu:`#b79bff`,bofu:`#ffffff`,"":`rgba(255,255,255,.28)`},m=[`Wix`,`WordPress`,`Shopify`,`Webflow`,`v0`,`Lovable`,`Otra (escríbela)`],h={producto:l.meta.ejeDemo.producto,mercado:l.meta.ejeDemo.mercado,secciones:[{id:`s1`,nombre:`Producto`,paginas:[{id:`p1`,nombre:`Catálogo`,tipo:`categoria`,cluster:``,fase:`bofu`}]},{id:`s2`,nombre:`Historia`,paginas:[]}],brief:{plataforma:``,idiomas:``,territorio:``,restricciones:``,aceptacion:``}},g=100,_=e=>`${e}${++g}`,v=()=>l.productos.find(e=>e.id===h.producto)||l.productos[0],y=()=>h.secciones.flatMap(e=>e.paginas.map(t=>({...t,seccion:e.nombre}))),b=()=>[...new Set(y().map(e=>e.cluster.trim()).filter(Boolean))].sort();function x(e,t){let n=(e,t)=>e.map(e=>`<option value="${e.id}"${e.id===t?` selected`:``}>${s(e.label)}</option>`).join(``);return`<div class="pagina">
    <input type="text" value="${s(e.nombre)}" data-pg="${e.id}" data-sec="${t}" data-campo="nombre"
      placeholder="Nombre de la página" aria-label="Nombre de la página" />
    <select data-pg="${e.id}" data-sec="${t}" data-campo="tipo" aria-label="Tipo de página">${n(u,e.tipo)}</select>
    <input type="text" value="${s(e.cluster)}" data-pg="${e.id}" data-sec="${t}" data-campo="cluster"
      list="clusters-web" placeholder="Cluster de keywords" aria-label="Cluster de keywords" />
    <select data-pg="${e.id}" data-sec="${t}" data-campo="fase" aria-label="Fase del funnel">${n(d,e.fase)}</select>
    <button type="button" data-borrar-pg="${e.id}" data-sec="${t}" aria-label="Eliminar la página ${s(e.nombre)}">×</button>
  </div>`}function S(e){return`<div class="seccion">
    <div class="seccion__head">
      <input class="seccion__nombre" type="text" value="${s(e.nombre)}" data-sec-nombre="${e.id}"
        placeholder="Sección del menú" aria-label="Nombre de la sección" />
      <span class="seccion__n">${e.paginas.length} ${e.paginas.length===1?`página`:`páginas`}</span>
      <div class="seccion__acciones">
        <button class="btn btn--secondary btn--sm" type="button" data-add-pg="${e.id}">+ Página</button>
        <button class="btn btn--ghost btn--sm" type="button" data-borrar-sec="${e.id}">Eliminar</button>
      </div>
    </div>
    <div class="paginas">
      ${e.paginas.length?e.paginas.map(t=>x(t,e.id)).join(``):`<p class="pagina__vacia">Sección sin páginas. Una rama del menú que no lleva a ningún sitio.</p>`}
    </div>
  </div>`}function C(){return`<datalist id="clusters-web">${b().map(e=>`<option value="${s(e)}"></option>`).join(``)}</datalist>
    ${h.secciones.map(S).join(``)}`}function w(){let e=y();return f.map(t=>{let n=e.filter(e=>t.tipos.includes(e.tipo));return{...t,n:n.length,ok:n.length>=t.min,donde:n.map(e=>e.nombre||`(sin nombre)`)}})}function T(){return w().map(e=>`<div class="anexo-item" data-ok="${e.ok?`si`:`no`}">
        <span class="anexo-item__marca" aria-hidden="true">${e.ok?`●`:`○`}</span>
        <span class="anexo-item__txt">${s(e.txt)}</span>
        <span class="anexo-item__donde">${e.ok?`${e.n}/${e.min}`:`${e.n} de ${e.min}`}</span>
      </div>`).join(``)}function E(){let e=h.secciones.filter(e=>e.nombre.trim()||e.paginas.length);if(!e.length)return{html:`<p class="reveal-moment__empty">Añade secciones y páginas: el árbol se dibuja solo.</p>`,pie:``};let t=Math.max(760,e.length*216),n=150+Math.max(1,...e.map(e=>e.paginas.length))*42+30,r=t/2,i=e.map((e,t)=>{let n=t*216+13,i=`<path d="M${r} 68 V88 M${n+95} 88 V108" stroke="rgba(255,255,255,.45)" stroke-width="2" fill="none"/>`,a=e.paginas.map((e,t)=>{let r=166+t*42,i=p[e.fase]??p[``],a=e.fase===`tofu`||e.fase===`bofu`?`#00133f`:`#ffffff`,o=!e.cluster.trim(),c=(e.nombre||`(sin nombre)`).slice(0,22);return`<g>
            <rect x="${n+14}" y="${r}" width="162" height="34" rx="7"
              fill="${i}" ${o?`stroke="#ffb02e" stroke-width="2" stroke-dasharray="4 3"`:``}>
              <title>${s(e.nombre||`(sin nombre)`)} — ${e.fase?e.fase.toUpperCase():`sin fase`}${o?` — SIN CLUSTER`:` — ${s(e.cluster)}`}</title>
            </rect>
            <text x="${n+95}" y="${r+22}" text-anchor="middle" font-size="13" fill="${a}">${s(c)}</text>
          </g>`}).join(``);return`${i}
        <rect x="${n}" y="108" width="190" height="44" rx="10" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.45)"/>
        <text class="nodo-t" x="${n+95}" y="137" text-anchor="middle" font-size="17" fill="#fff">${s((e.nombre||`(sin nombre)`).slice(0,18))}</text>
        ${a}`}).join(``),a=`<rect x="${r-80}" y="24" width="160" height="44" rx="10" fill="#c01d6a"/>
    <text class="nodo-t" x="${r}" y="53" text-anchor="middle" font-size="19" fill="#fff">Home</text>`,o=y(),c=o.filter(e=>!e.cluster.trim()).length,l=w(),u=l.filter(e=>e.ok).length,d=l.filter(e=>!e.ok),f=`<strong>${e.length} ${e.length===1?`sección`:`secciones`}</strong> y <strong>${o.length} ${o.length===1?`página`:`páginas`}</strong>.
    ${c?`<strong>${c}</strong> sin cluster asociado (${c===1?`marcada`:`marcadas`} en ámbar): ${c===1?`una página que no responde`:`páginas que no responden`} a ninguna búsqueda.`:`Todas las páginas tienen su cluster.`}
    Del Anexo 1 tenéis <strong>${u} de ${l.length}</strong> requisitos cubiertos${d.length?`; falta: ${d.map(e=>e.txt.split(`:`)[0].split(`(`)[0].trim().replace(/\.$/,``)).join(`; `)}.`:`.`}`;return{html:`<div class="scroll-x"><svg class="arbol-svg" viewBox="0 0 ${t} ${n}" style="min-width:${Math.min(t,900)}px"
        role="img" aria-label="Árbol de contenidos con ${e.length} secciones y ${o.length} páginas">
        ${a}${i}
      </svg></div>
      <div class="arbol-leyenda">
        ${[`tofu`,`mofu`,`bofu`].map(e=>`<span><i style="background:${p[e]}"></i>${e.toUpperCase()}</span>`).join(``)}
        <span><i style="background:${p[``]}"></i>Sin fase</span>
        <span><i style="background:transparent;border:2px dashed #ffb02e"></i>Sin cluster</span>
      </div>`,pie:f}}function D(){let e=y(),t=w(),n=e.filter(e=>e.cluster.trim()).length,r=new Set(e.map(e=>e.fase).filter(Boolean)),i=h.brief;return[{ok:h.secciones.length>=3,txt:`Al menos tres secciones en el menú (ahora: ${h.secciones.length}).`},{ok:e.length>=8,txt:`Al menos ocho páginas en el árbol (ahora: ${e.length}).`},{ok:e.length>0&&n===e.length,txt:`Todas las páginas con un cluster asociado (ahora: ${n} de ${e.length}).`},{ok:r.size>=3,txt:`Las tres fases del funnel representadas (ahora: ${r.size?[...r].map(e=>e.toUpperCase()).join(`, `):`ninguna`}).`},{ok:t.every(e=>e.ok),txt:`Los ${t.length} requisitos del Anexo 1 cubiertos (ahora: ${t.filter(e=>e.ok).length}).`},{ok:!!i.territorio.trim()&&!!i.restricciones.trim(),txt:`Brief con territorio de marca y restricciones escritos.`},{ok:!!i.aceptacion.trim(),txt:`Criterio de aceptación definido: qué tiene que existir para dar la web por buena.`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${s(e.txt)}</li>`).join(``)}function O(){let e=v(),t=h.brief,n=[];n.push(`Actúa como desarrollador y redactor web. Construye el sitio de una marca de ${e.nombre} (${e.figura}, ${e.provincia}).`),n.push(``),n.push(`## Contexto`),n.push(`- Producto: ${e.nombre} — ${e.categoria}, figura de calidad ${e.figura}.`),n.push(`- Relato del producto: ${e.relato}`),n.push(`- Mercado objetivo: turistas de ${h.mercado} que probaron el producto durante sus vacaciones en España y vuelven a su país.`),n.push(`- Objetivo del sitio: que compren desde su país lo que probaron aquí, y captar leads de quienes todavía no compran.`),n.push(`- Ventana de consumo: ${e.ventanaConsumo}.`),n.push(`- Conservación y transporte: ${e.temperaturaTransporte}.`),n.push(`- Restricciones de envío: ${e.restriccionesEnvio}`),n.push(`- Precio medio de referencia: ${e.precioMedio} ${e.unidadPrecio}.`),t.territorio.trim()&&n.push(`- Territorio y tono de marca: ${t.territorio.trim()}`),t.idiomas.trim()&&n.push(`- Idiomas del sitio: ${t.idiomas.trim()}`),n.push(``),n.push(`## Árbol de contenidos (respétalo, no lo reordenes)`),h.secciones.forEach(e=>{n.push(`- **${e.nombre||`(sección sin nombre)`}**`),e.paginas.length||n.push(`  - (sin páginas)`),e.paginas.forEach(e=>{let t=u.find(t=>t.id===e.tipo)?.label||`sin tipo`;n.push(`  - ${e.nombre||`(sin nombre)`} — tipo: ${t} — cluster: ${e.cluster||`sin asignar`} — fase: ${e.fase?e.fase.toUpperCase():`sin asignar`}`)})}),n.push(``),t.restricciones.trim()&&(n.push(`## Restricciones`),n.push(t.restricciones.trim()),n.push(``)),n.push(`## Qué quiero que hagas`),n.push(`1. Escribe el contenido de cada página del árbol: titular, subtítulo y cuerpo, en el tono indicado y en los idiomas pedidos.`),n.push(`2. En la ficha de producto, incluye descripción, formatos, precio, conservación y una respuesta visible arriba a «¿envías a mi país, en cuánto tiempo y por cuánto?».`),n.push(`3. Define los campos de cada formulario, separando obligatorios y opcionales, con la casilla de consentimiento SIN premarcar (RGPD).`),n.push(`4. Para cada imagen o vídeo que propongas, escribe su descriptivo de texto: sin él no posiciona.`),n.push(`5. Señala qué información te falta y qué has tenido que suponer.`),n.push(``),n.push(`## Criterio de aceptación`),n.push(t.aceptacion.trim()||`(sin definir — defínelo antes de pedirlo, o cualquier resultado parecerá bueno)`),n.push(``);let r=w().filter(e=>!e.ok);return r.length&&(n.push(`## Aviso`),n.push(`Mi árbol todavía no cubre estos requisitos: ${r.map(e=>e.txt).join(` `)} Dime en qué sección encajarían.`),n.push(``)),n.push(`## Importante`),n.push(`No inventes cifras de mercado, certificaciones, premios ni reseñas. Si necesitas un dato que no te he dado, márcalo como pendiente en lugar de rellenarlo.`),t.plataforma.trim()&&n.push(`Entrega el resultado listo para montarlo en ${t.plataforma.trim()}.`),n.join(`
`)}function k(){let e=v(),t=[`# El sitio web: árbol de contenidos y brief`,``,`_Caso: ${l.meta.caso}_`,`_Producto: ${e.nombre} (${e.figura}) · mercado: ${h.mercado}_`,``];t.push(`## Árbol de contenidos`,``,`| Sección | Página | Tipo | Cluster | Fase |`,`|---|---|---|---|---|`),h.secciones.forEach(e=>{if(!e.paginas.length){t.push(`| **${e.nombre||`(sin nombre)`}** | _(sin páginas)_ | — | — | — |`);return}e.paginas.forEach((n,r)=>{let i=u.find(e=>e.id===n.tipo)?.label||`—`;t.push(`| ${r===0?`**${e.nombre||`(sin nombre)`}**`:``} | ${n.nombre||`(sin nombre)`} | ${i} | ${n.cluster||`—`} | ${n.fase?n.fase.toUpperCase():`—`} |`)})}),t.push(``,`## Cobertura del Anexo 1`,``),w().forEach(e=>t.push(`- [${e.ok?`x`:` `}] ${e.txt} (${e.n}/${e.min})`));let n=h.brief;return t.push(``,`## Brief de construcción`,``),t.push(`- **Plataforma de destino:** ${n.plataforma.trim()||`_(sin definir)_`}`),t.push(`- **Idiomas:** ${n.idiomas.trim()||`_(sin definir)_`}`),t.push(`- **Territorio y tono de marca:** ${n.territorio.trim()||`_(sin definir)_`}`),t.push(`- **Restricciones:** ${n.restricciones.trim()||`_(sin definir)_`}`),t.push(`- **Criterio de aceptación:** ${n.aceptacion.trim()||`_(sin definir)_`}`),t.push(``,`---`,``,`### Brief completo, tal y como se entrega a la IA`,``,"```",O(),"```"),t.join(`
`)}var A=document.querySelector(`#app`);A.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Sitio web con IA`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M4`,href:`/decks/m4.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>El sitio web, con IA</h1>
        <p class="lead">Dibujad el árbol de contenidos de la web que pide el Anexo 1 y componed el brief
        que una IA necesita para construirla. Vosotros decidís la arquitectura; ella ejecuta.</p>
        <span class="fuente">Requisitos del Anexo 1 del enunciado del caso</span>
      </div>

      <div class="tool-part" id="arbol">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Árbol de contenidos</h2></div>
          <span class="score" data-score-arbol></span>
        </div>

        <div class="fields fields--2" style="max-width:820px">
          <div class="field">
            <label for="producto">Producto del equipo</label>
            <select id="producto" data-producto>
              ${l.productos.map(e=>`<option value="${e.id}"${e.id===h.producto?` selected`:``}>${s(e.nombre)} · ${e.figura}</option>`).join(``)}
            </select>
            <span class="field__help" data-producto-info></span>
          </div>
          <div class="field">
            <label for="mercado">Mercado de origen</label>
            <input id="mercado" type="text" data-mercado value="${s(h.mercado)}" placeholder="El país del turista" />
            <span class="field__help">El mismo que elegisteis para las buyer personas.</span>
          </div>
        </div>

        <p class="muted" style="max-width:74ch;margin-top:var(--sp-5)">Cada sección es una rama del menú principal.
        Cada página debe responder a un <strong>cluster</strong> —el mismo nombre que le pusisteis en la herramienta
        de keywords— y ocupar una <strong>fase del funnel</strong>. Si no cumple las dos cosas, sobra.</p>

        <div class="arbol" data-arbol style="margin-top:var(--sp-4)"></div>
        <button class="btn btn--primary" type="button" data-add-sec style="margin-top:var(--sp-4)">+ Añadir sección</button>

        <div class="tool-part" style="margin-top:var(--sp-6)">
          <h3>Cobertura del Anexo 1</h3>
          <p class="muted small" style="max-width:74ch">Los requisitos que el enunciado pide para la web.
          Se marcan solos según los tipos de página que vais creando.</p>
          <div class="anexo" data-anexo style="margin-top:var(--sp-3)"></div>
        </div>

        <div class="pista">
          <button class="pista__btn" type="button" data-pista="arbol">Pista · ¿dónde miro?</button>
          <div class="pista__texto" data-pista-texto="arbol" hidden>
            <p><strong>No hay un árbol correcto.</strong> Lo que se evalúa es si la arquitectura se deduce
            de vuestro trabajo anterior. Preguntas que ayudan:</p>
            <ul>
              <li>Coged vuestros clusters de la herramienta de keywords: ¿aparecen todos en el menú?</li>
              <li>Si una página no tiene cluster, ¿por qué existe? ¿Qué búsqueda la encuentra?</li>
              <li>Si todo vuestro árbol es BOFU, la web solo sirve para quien ya quería comprar.</li>
              <li>Poneos en el sofá de vuestro turista: ¿en cuántos clics resuelve «¿me lo mandas a casa?»</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tool-part" id="brief">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte B</span><h2>El brief para la IA</h2></div>
        </div>
        <p class="muted" style="max-width:74ch">Lo que la IA no puede saber por su cuenta. El árbol de arriba
        se añade solo: aquí va lo que decide un humano.</p>

        <div class="brief-web" style="margin-top:var(--sp-4)">
          <div class="field">
            <label for="b-plat">Plataforma de destino</label>
            <input id="b-plat" type="text" data-brief="plataforma" list="plataformas"
              value="${s(h.brief.plataforma)}" placeholder="Wix, WordPress, v0…" />
            <datalist id="plataformas">${m.map(e=>`<option value="${s(e)}"></option>`).join(``)}</datalist>
          </div>
          <div class="field">
            <label for="b-idiomas">Idiomas del sitio</label>
            <input id="b-idiomas" type="text" data-brief="idiomas"
              value="${s(h.brief.idiomas)}" placeholder="Español, alemán, inglés…" />
          </div>
          <div class="field field--ancho">
            <label for="b-territorio">Territorio y tono de marca</label>
            <textarea id="b-territorio" rows="2" data-brief="territorio"
              placeholder="De qué habla la marca cuando no habla del producto, y cómo suena.">${s(h.brief.territorio)}</textarea>
          </div>
          <div class="field field--ancho">
            <label for="b-restr">Restricciones</label>
            <textarea id="b-restr" rows="2" data-brief="restricciones"
              placeholder="Logística, conservación, aduanas, RGPD, lo que no se puede prometer…">${s(h.brief.restricciones)}</textarea>
          </div>
          <div class="field field--ancho">
            <label for="b-acept">Criterio de aceptación</label>
            <textarea id="b-acept" rows="2" data-brief="aceptacion"
              placeholder="¿Qué tiene que existir para dar la web por buena? Sin esto, cualquier resultado parece bueno.">${s(h.brief.aceptacion)}</textarea>
          </div>
        </div>

        <div class="row" style="margin-top:var(--sp-5)">
          ${a({id:`brief`,label:`Copiar el brief completo para la IA`,hint:`Se copia con vuestro árbol, vuestras restricciones y los datos del producto ya dentro.`})}
        </div>

        <div class="brief-previo">
          <h3>Lo que se va a copiar</h3>
          <pre data-brief-previo></pre>
        </div>

        <div class="check-panel">
          <h3>Comprobación de la forma</h3>
          <ul class="check-list" data-checks></ul>
        </div>
      </div>`}),o({id:`payoff`,titulo:`Vuestro sitio, de un vistazo`,entradilla:`El árbol completo, con la fase de cada página y las que no responden a ninguna búsqueda marcadas en ámbar.`,html:`<p class="reveal-moment__empty">Añade secciones y páginas: el árbol se dibuja solo.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Y mañana, a madurar el lead: <a href="${s(c(`/tools/nurturing.html`))}">scoring y workflow</a>.</p>`})].join(``);function j(){A.querySelector(`[data-arbol]`).innerHTML=C()}function M(){A.querySelector(`[data-anexo]`).innerHTML=T()}function N(){A.querySelector(`[data-checks]`).innerHTML=D()}function P(){A.querySelector(`[data-brief-previo]`).textContent=O()}function F(){let e=y().length,t=w(),n=A.querySelector(`[data-score-arbol]`);n.innerHTML=`${t.filter(e=>e.ok).length}/${t.length} <small>del Anexo 1 · ${e} ${e===1?`página`:`páginas`}</small>`,n.dataset.ok=t.every(e=>e.ok)?`si`:`no`}function I(){let e=v();A.querySelector(`[data-producto-info]`).textContent=`${e.ventanaConsumo} · ${e.restriccionesEnvio}`}function L(){let{html:e,pie:t}=E();i(A,`payoff`,e,t)}function R({conArbol:e=!0}={}){e&&j(),M(),N(),F(),P(),L()}A.addEventListener(`click`,e=>{if(e.target.closest(`[data-add-sec]`)){h.secciones.push({id:_(`s`),nombre:``,paginas:[]}),R();return}let t=e.target.closest(`[data-add-pg]`)?.dataset.addPg;if(t){h.secciones.find(e=>e.id===t).paginas.push({id:_(`p`),nombre:``,tipo:``,cluster:``,fase:``}),R();return}let n=e.target.closest(`[data-borrar-sec]`)?.dataset.borrarSec;if(n){h.secciones=h.secciones.filter(e=>e.id!==n),R();return}let r=e.target.closest(`[data-borrar-pg]`);if(r){let e=h.secciones.find(e=>e.id===r.dataset.sec);e.paginas=e.paginas.filter(e=>e.id!==r.dataset.borrarPg),R();return}let i=e.target.closest(`[data-pista]`);if(i){let e=A.querySelector(`[data-pista-texto="${i.dataset.pista}"]`);e.hidden=!e.hidden,i.textContent=e.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}}),A.addEventListener(`input`,e=>{let t=e.target,n=t.dataset.secNombre;if(n){h.secciones.find(e=>e.id===n).nombre=t.value,R({conArbol:!1});return}if(t.dataset.pg&&t.dataset.campo!==`tipo`&&t.dataset.campo!==`fase`){let e=h.secciones.find(e=>e.id===t.dataset.sec);e.paginas.find(e=>e.id===t.dataset.pg)[t.dataset.campo]=t.value,R({conArbol:!1});return}let r=t.dataset.brief;if(r){h.brief[r]=t.value,N(),P();return}t.dataset.mercado!==void 0&&(h.mercado=t.value,P())}),A.addEventListener(`change`,e=>{let t=e.target;if(t.dataset.pg&&(t.dataset.campo===`tipo`||t.dataset.campo===`fase`)){let e=h.secciones.find(e=>e.id===t.dataset.sec);e.paginas.find(e=>e.id===t.dataset.pg)[t.dataset.campo]=t.value,R({conArbol:!1});return}t.dataset.producto!==void 0&&(h.producto=t.value,I(),R({conArbol:!1}))}),r(A,{brief:O}),e({mount:A.querySelector(`[data-statepanel]`),toolId:`web-ia`,nombreArchivo:`sitio-web`,getState:()=>structuredClone(h),setState:e=>{e.producto&&l.productos.some(t=>t.id===e.producto)&&(h.producto=e.producto),typeof e.mercado==`string`&&(h.mercado=e.mercado),Array.isArray(e.secciones)&&(h.secciones=e.secciones.map((e,t)=>({id:e.id||`s-imp${t}`,nombre:e.nombre||``,paginas:(e.paginas||[]).map((e,n)=>({id:e.id||`p-imp${t}-${n}`,nombre:e.nombre||``,tipo:e.tipo||``,cluster:e.cluster||``,fase:e.fase||``}))}))),e.brief&&Object.keys(h.brief).forEach(t=>{h.brief[t]=e.brief[t]||``}),A.querySelector(`[data-producto]`).value=h.producto,A.querySelector(`[data-mercado]`).value=h.mercado,A.querySelectorAll(`[data-brief]`).forEach(e=>{e.value=h.brief[e.dataset.brief]||``}),I(),R()},toMarkdown:k,ayuda:`El .md incluye el brief entero, listo para pegarlo en el Word o en la IA.`}),I(),R();