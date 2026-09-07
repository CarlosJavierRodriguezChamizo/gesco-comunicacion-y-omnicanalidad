import"./modulepreload-polyfill-P2Xu9kJm.js";import{a as e,d as t,f as n,i as r,n as i,r as a,t as o}from"./components-CTATsCoj.js";import{o as s,s as c,t as l}from"./_util-P6weWh_n.js";import{t as u}from"./caso-alimentos-C5aG6gja.js";/* empty css             */var d=u.canales.items,f={presupuesto:3e4,reparto:Object.fromEntries(d.map(e=>[e.id,0])),convVisitaLead:3.5,convLeadCliente:8,ticketMedio:42,cadena:{cta:``,magnetTitulo:``,magnetFormato:``,landingTitular:``,landingPromesa:``,campos:[{id:`c1`,nombre:`Email`,obligatorio:!0}]}};function p(){let e=0,t=0,n=0,r=d.map(r=>{let i=f.reparto[r.id]||0;n+=i;let a=Math.min(i/r.cpm*1e3,r.alcanceMax),o=a*(r.ctr/100);return e+=a,t+=o,{...r,euros:i,impactos:a,visitas:o,tope:i>0&&a>=r.alcanceMax-.5}}),i=t*(f.convVisitaLead/100),a=i*(f.convLeadCliente/100),o=i>0?n/i:null,s=a>0?n/a:null,c=a*f.ticketMedio,l=n>0?c/n:null;return{porCanal:r,invertido:n,impactos:e,visitas:t,leads:i,clientes:a,cpl:o,cac:s,ingresos:c,roas:l}}function m(e,t){let n=t.porCanal.find(t=>t.id===e.id),r=f.reparto[e.id]||0,i=Math.max(f.presupuesto,1e3);return`<div class="canal" data-activo="${r>0?`si`:`no`}" data-tope="${n.tope?`si`:`no`}">
    <div class="canal__head">
      <span class="canal__nombre">${s(e.nombre)}<span class="canal__tipo" data-t="${e.tipo}">${e.tipo}</span></span>
      <span class="canal__cifras"><b>${c(r)} €</b> · ${c(Math.round(n.impactos))} impactos · ${c(Math.round(n.visitas))} visitas${n.tope?` · tope de alcance`:``}</span>
    </div>
    <p class="canal__desc">${s(e.descripcion)} <span class="fuente">CPM ${e.cpm} € · CTR ${e.ctr}%</span></p>
    <input type="range" min="0" max="${i}" step="${Math.max(100,Math.round(i/200))}" value="${r}"
      data-canal="${s(e.id)}" aria-label="Presupuesto para ${s(e.nombre)}" />
  </div>`}function h(e){let t=[{lab:`Impactos`,v:e.impactos,color:`rgba(255,255,255,.16)`,fg:`#fff`},{lab:`Visitas`,v:e.visitas,color:`rgba(10,228,195,.35)`,fg:`#fff`},{lab:`Leads`,v:e.leads,color:`#0ae4c3`,fg:`#00133f`},{lab:`Clientes`,v:e.clientes,color:`#ffffff`,fg:`#00133f`}],n=t[0].v||1,r=e=>Math.max(64,Math.sqrt(Math.max(e,0)/n)*374),i=t.map((e,n)=>{let i=n*76,a=r(e.v),o=t[n+1],s=r(o?o.v:e.v*.55),l=204-a/2,u=204-s/2,d=o&&e.v>0?o.v/e.v*100:null,f=d===null?``:`<text x="466" y="${i+62+7+4}" text-anchor="end" font-size="12" fill="#0ae4c3">${c(d,d<1?2:1)}%</text>`;return`<g>
        <path d="M${l} ${i} H${l+a} L${u+s} ${i+62} H${u} Z" fill="${e.color}"/>
        <text class="f-num" x="204" y="${i+30}" text-anchor="middle" font-size="22" fill="${e.fg}">${c(Math.round(e.v))}</text>
        <text x="204" y="${i+48}" text-anchor="middle" font-size="12" fill="${e.fg}" opacity=".8">${e.lab}</text>
      </g>${f}`}).join(``);return`<svg class="funnel-svg" viewBox="0 0 470 320" role="img"
    aria-label="Embudo: ${c(Math.round(e.impactos))} impactos, ${c(Math.round(e.visitas))} visitas, ${c(Math.round(e.leads))} leads, ${c(Math.round(e.clientes))} clientes">${i}</svg>
    <p class="funnel-escala">Anchura en escala de raíz, no proporcional: si no, los tres tramos de abajo
    quedarían idénticos. Las cifras exactas van dentro y el porcentaje que pasa de un tramo al siguiente, a la derecha.</p>`}function g(e){let t=e.cpl===null?`—`:`${c(e.cpl,2)} €`,n=e.cac===null?`—`:`${c(e.cac,2)} €`,r=e.roas===null?`—`:`${c(e.roas,2)}×`;return`${h(e)}
    <div class="funnel-kpis">
      <div class="funnel-kpi"><b>${t}</b><span>CPL · coste por lead</span></div>
      <div class="funnel-kpi" data-alerta="${e.cac!==null&&e.cac>f.ticketMedio?`si`:`no`}"><b>${n}</b><span>CAC · coste por cliente</span></div>
      <div class="funnel-kpi"><b>${c(e.invertido)} €</b><span>invertido</span></div>
      <div class="funnel-kpi" data-alerta="${e.roas!==null&&e.roas<1?`si`:`no`}"><b>${r}</b><span>ROAS con ticket de ${c(f.ticketMedio)} €</span></div>
    </div>
    <p class="funnel-nota">El modelo aplica el CPM y el CTR orientativos de cada canal y después vuestras
    dos tasas de conversión. Mover un slider cambia el resultado: eso es lo que hay que defender.</p>`}function _(){return f.cadena.campos.map(e=>`<div class="campo-form">
        <input type="text" value="${s(e.nombre)}" data-campo-nombre="${s(e.id)}"
          placeholder="Nombre del campo" aria-label="Nombre del campo" />
        <select data-campo-obl="${s(e.id)}" aria-label="¿Obligatorio?">
          <option value="si"${e.obligatorio?` selected`:``}>Obligatorio</option>
          <option value="no"${e.obligatorio?``:` selected`}>Opcional</option>
        </select>
        <button type="button" data-campo-borrar="${s(e.id)}" aria-label="Eliminar el campo ${s(e.nombre)}">×</button>
      </div>`).join(``)}function v(){let e=f.cadena;if(!(e.landingTitular||e.landingPromesa||e.magnetTitulo))return`<div class="movil__pantalla"><p class="movil__vacio">Rellena el titular y la promesa de la
      landing y verás aquí cómo le llega al turista, en el único sitio donde la va a leer: su móvil.</p></div>`;let t=e.campos.length?e.campos.map(e=>`<div class="movil__campo" data-op="${e.obligatorio?`no`:`si`}">
          <b>${s(e.nombre||`Campo sin nombre`)}</b><i>${e.obligatorio?`obligatorio`:`opcional`}</i></div>`).join(``):`<p class="movil__vacio">Sin campos: no hay formulario.</p>`;return`<div class="movil__pantalla">
    ${e.magnetFormato?`<span class="movil__eyebrow">${s(e.magnetFormato)}</span>`:``}
    <h3 class="movil__titular">${s(e.landingTitular||`Titular de la landing`)}</h3>
    ${e.landingPromesa?`<p class="movil__promesa">${s(e.landingPromesa)}</p>`:``}
    ${e.magnetTitulo?`<p class="movil__magnet">Te llevas: <strong>${s(e.magnetTitulo)}</strong></p>`:``}
    <div class="movil__campos">${t}</div>
    <div class="movil__optin"><span aria-hidden="true"></span>
      Acepto recibir comunicaciones. Casilla sin marcar por defecto: es obligatorio por RGPD.</div>
    <div class="movil__cta">${s(e.cta||`Texto del CTA`)}</div>
  </div>`}function y(){let e=p();if(!e.invertido)return{html:`<p class="reveal-moment__empty">Reparte el presupuesto entre canales y el embudo se dibuja aquí,
        con el CPL de vuestra decisión.</p>`,pie:``};let t=e.porCanal.filter(e=>e.euros>0).sort((e,t)=>t.euros-e.euros),n=t[0]?.euros||1,r=t.map(t=>`<div class="payoff-franja">
        <span class="payoff-franja__lab">${s(t.nombre)}</span>
        <span class="payoff-franja__bar"><i style="width:${Math.round(t.euros/n*100)}%"></i></span>
        <span class="payoff-franja__pct">${c(Math.round(t.euros/e.invertido*100))}%</span>
      </div>`).join(``),i=e.cpl===null?`—`:`${c(e.cpl,2)} €`,a=e.porCanal.filter(e=>e.tipo===`online`).reduce((e,t)=>e+t.euros,0),o=Math.round(a/e.invertido*100),l=`Con ${c(e.invertido)} € repartidos así, salen <strong>${c(Math.round(e.leads))} leads</strong>
    a <strong>${i} de CPL</strong> y ${c(Math.round(e.clientes))} clientes.
    El ${o}% del presupuesto está en canales online y el ${100-o}% en puntos de contacto físicos.
    ${e.cac!==null&&e.cac>f.ticketMedio?`<strong>Ojo:</strong> el coste por cliente (${c(e.cac,2)} €) supera el ticket medio (${c(f.ticketMedio)} €).`:``}`;return{html:`<div style="display:grid;gap:var(--sp-6);grid-template-columns:1fr">
      <div style="max-width:520px;margin-inline:auto;width:100%">${h(e)}</div>
      <div class="payoff-franjas" style="margin-top:0">${r}</div>
    </div>`,pie:l}}function b(){let e=p(),t=f.cadena,n=e.porCanal.filter(e=>e.euros>0).length,r=t.campos.filter(e=>e.obligatorio).length;return[{ok:e.invertido>0,txt:`Presupuesto repartido (ahora: ${c(e.invertido)} € de ${c(f.presupuesto)} €).`},{ok:n>=3,txt:`Al menos tres canales con inversión (ahora: ${n}).`},{ok:!!t.cta.trim()&&!!t.magnetTitulo.trim(),txt:`CTA y lead magnet definidos.`},{ok:!!t.landingTitular.trim()&&!!t.landingPromesa.trim(),txt:`Landing con titular y promesa.`},{ok:t.campos.length>0&&r>0&&r<=3,txt:`Formulario con entre uno y tres campos obligatorios (ahora: ${r} de ${t.campos.length}).`}].map(e=>`<li data-ok="${e.ok?`si`:`no`}">${s(e.txt)}</li>`).join(``)}function x(){let e=p(),t=f.cadena,n=[`# Plan de acciones online: mix de captación y conversión`,``,`_Caso: ${u.meta.caso}_`,``];return n.push(`## Mix de captación`,``,`Presupuesto total: **${c(f.presupuesto)} €** · invertido: **${c(e.invertido)} €**`,``),n.push(`| Canal | Tipo | Inversión | % | Impactos | Visitas |`,`|---|---|---|---|---|---|`),e.porCanal.filter(e=>e.euros>0).sort((e,t)=>t.euros-e.euros).forEach(t=>{n.push(`| ${t.nombre} | ${t.tipo} | ${c(t.euros)} € | ${c(Math.round(t.euros/(e.invertido||1)*100))}% | ${c(Math.round(t.impactos))} | ${c(Math.round(t.visitas))} |`)}),n.push(``,`### Resultado del modelo`,``),n.push(`- Impactos: **${c(Math.round(e.impactos))}**`),n.push(`- Visitas: **${c(Math.round(e.visitas))}**`),n.push(`- Leads: **${c(Math.round(e.leads))}** (conversión visita→lead: ${c(f.convVisitaLead,1)}%)`),n.push(`- Clientes: **${c(Math.round(e.clientes))}** (conversión lead→cliente: ${c(f.convLeadCliente,1)}%)`),n.push(`- **CPL: ${e.cpl===null?`—`:`${c(e.cpl,2)} €`}** · CAC: ${e.cac===null?`—`:`${c(e.cac,2)} €`} · ROAS: ${e.roas===null?`—`:`${c(e.roas,2)}×`}`),n.push(``,`## Cadena de conversión`,``),n.push(`- **CTA:** ${t.cta||`_(sin definir)_`}`),n.push(`- **Lead magnet:** ${t.magnetTitulo||`_(sin definir)_`}${t.magnetFormato?` (${t.magnetFormato})`:``}`),n.push(`- **Landing — titular:** ${t.landingTitular||`_(sin definir)_`}`),n.push(`- **Landing — promesa:** ${t.landingPromesa||`_(sin definir)_`}`),n.push(``,`### Formulario`,``),t.campos.length?(n.push(`| Campo | Obligatorio |`,`|---|---|`),t.campos.forEach(e=>n.push(`| ${e.nombre||`(sin nombre)`} | ${e.obligatorio?`Sí`:`No`} |`))):n.push(`_(sin campos)_`),n.push(``,`> Consentimiento: casilla de opt-in sin premarcar y, preferiblemente, opt-in doble por email.`),n.push(``,`_Coste y alcance de los canales: ${u.canales.fuente}._`),n.join(`
`)}function S(){let e=p(),t=e.porCanal.filter(e=>e.euros>0).map(e=>`- ${e.nombre} (${e.tipo}): ${e.euros} € — ${Math.round(e.impactos)} impactos, ${Math.round(e.visitas)} visitas`).join(`
`);return`Estoy diseñando el mix de captación online de un plan para promocionar un producto agroalimentario español entre turistas extranjeros que lo prueban en España y deberían recomprarlo al volver a su país.

Presupuesto: ${f.presupuesto} €. Este es mi reparto:

${t||`(todavía sin reparto)`}

Con mis supuestos (conversión visita→lead ${f.convVisitaLead}%, lead→cliente ${f.convLeadCliente}%, ticket medio ${f.ticketMedio} €) salen ${Math.round(e.leads)} leads y un CPL de ${e.cpl===null?`—`:e.cpl.toFixed(2)} €.

Haz tres cosas:
1. Critica mi reparto: qué canal está sobreponderado y cuál infrautilizado, y por qué, dado que el impacto ocurre en España y la compra en el país de origen.
2. Dime qué supuesto de mi modelo es el más frágil y qué haría falta para validarlo.
3. Si me recortaran el presupuesto un 30%, ¿qué canal cortarías primero y con qué argumento?

No inventes benchmarks del sector: razona sobre mis números.`}function C(){let e=f.cadena;return`Estoy diseñando la cadena de conversión de una marca de alimentación española que capta leads entre turistas extranjeros mientras están de viaje en España.

- CTA: ${e.cta||`(sin definir)`}
- Lead magnet: ${e.magnetTitulo||`(sin definir)`} ${e.magnetFormato?`(formato: ${e.magnetFormato})`:``}
- Titular de la landing: ${e.landingTitular||`(sin definir)`}
- Promesa: ${e.landingPromesa||`(sin definir)`}
- Campos del formulario: ${e.campos.map(e=>`${e.nombre}${e.obligatorio?` (obligatorio)`:` (opcional)`}`).join(`, `)||`(ninguno)`}

Haz tres cosas:
1. Dime si mi lead magnet es algo que alguien de vacaciones querría guardar en el móvil, y por qué sí o por qué no.
2. Propón tres titulares alternativos para la landing, más concretos que el mío.
3. Señala qué campo del formulario sobra y qué campo, si acaso, merece la pena añadir.

No añadas descuentos ni promociones: el planteamiento es de contenido de valor.`}var w=document.querySelector(`#app`),T=p();w.innerHTML=[n({variant:`light`,breadcrumb:[{label:`Hub`,href:`/index.html`},{label:`Mix y conversión`,current:!0}],nav:[{label:`Hub`,href:`/index.html`},{label:`M2`,href:`/decks/m2.html`}]}),t({variant:`light`,wide:!0,tag:`main`,id:`contenido`,html:`
      <div class="tool-intro">
        <h1>Mix de captación y cadena de conversión</h1>
        <p class="lead">Repartid un presupuesto entre canales y ved el embudo recalcularse. Después,
        construid la cadena que convierte una visita en un email.</p>
        <span class="fuente">${s(u.canales.fuente)}</span>
      </div>

      <div class="tool-part" id="mix">
        <div class="tool-part__head">
          <div><span class="tool-part__num">Parte A</span><h2>Mix de captación</h2></div>
        </div>

        <div class="presupuesto">
          <div>
            <div class="presupuesto__lab"><label for="presupuesto">Presupuesto total del plan (€)</label></div>
            <input id="presupuesto" type="number" min="1000" step="1000" value="${f.presupuesto}" data-presupuesto />
          </div>
          <div class="presupuesto__restante" data-restante>
            <b>${c(f.presupuesto)} €</b>
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
                <div class="supuesto__val" data-val-vl>${c(f.convVisitaLead,1)}%</div>
                <input id="s-vl" type="range" min="0.2" max="15" step="0.1" value="${f.convVisitaLead}" data-sup="convVisitaLead" />
              </div>
              <div class="supuesto">
                <label for="s-lc">Conversión lead → cliente</label>
                <div class="supuesto__val" data-val-lc>${c(f.convLeadCliente,1)}%</div>
                <input id="s-lc" type="range" min="0.5" max="40" step="0.5" value="${f.convLeadCliente}" data-sup="convLeadCliente" />
              </div>
              <div class="supuesto">
                <label for="s-tm">Ticket medio (€)</label>
                <div class="supuesto__val" data-val-tm>${c(f.ticketMedio)} €</div>
                <input id="s-tm" type="range" min="5" max="200" step="1" value="${f.ticketMedio}" data-sup="ticketMedio" />
              </div>
            </div>
          </div>

          <aside class="funnel-panel" data-funnel aria-label="Resultado del embudo">${g(T)}</aside>
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
          ${a({id:`mix`,label:`Copiar prompt: criticar mi reparto`,hint:`Copia tu reparto y tus supuestos, y pide que te discutan las decisiones.`})}
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
                <input id="cta" type="text" data-cadena="cta" value="${s(f.cadena.cta)}"
                  placeholder="Descárgate la ruta del aceite en Córdoba" />
              </div>
            </div>

            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">02</span><h3 class="eslabon__t">Lead magnet</h3></div>
              <p class="eslabon__ayuda">Contenido gratuito que exige un dato. Que sea algo que quiera guardar en el móvil.</p>
              <div class="fields fields--2">
                <div class="field">
                  <label for="magnet-t">Qué se lleva</label>
                  <input id="magnet-t" type="text" data-cadena="magnetTitulo" value="${s(f.cadena.magnetTitulo)}"
                    placeholder="Guía: cómo leer la etiqueta de un aceite" />
                </div>
                <div class="field">
                  <label for="magnet-f">Formato</label>
                  <input id="magnet-f" type="text" data-cadena="magnetFormato" value="${s(f.cadena.magnetFormato)}"
                    placeholder="PDF, mapa, test, vídeo…" />
                </div>
              </div>
            </div>

            <div class="eslabon">
              <div class="eslabon__head"><span class="eslabon__n">03</span><h3 class="eslabon__t">Landing</h3></div>
              <p class="eslabon__ayuda">Página de cierre: disipa la duda y conduce al formulario. Se lee en un móvil, de pie.</p>
              <div class="field">
                <label for="l-tit">Titular</label>
                <input id="l-tit" type="text" data-cadena="landingTitular" value="${s(f.cadena.landingTitular)}"
                  placeholder="El aceite que has probado tiene nombre" />
              </div>
              <div class="field" style="margin-top:var(--sp-3)">
                <label for="l-pro">Promesa</label>
                <textarea id="l-pro" rows="2" data-cadena="landingPromesa"
                  placeholder="Qué obtiene exactamente y por qué le sirve.">${s(f.cadena.landingPromesa)}</textarea>
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
          ${a({id:`cadena`,label:`Copiar prompt: revisar mi cadena`,hint:`Copia tu CTA, magnet, landing y formulario, y pide alternativas.`})}
        </div>
      </div>`}),o({id:`payoff`,titulo:`Lo que compra vuestro presupuesto`,entradilla:`El embudo con vuestros números y el reparto que lo produce. Mover un slider lo cambia entero.`,html:`<p class="reveal-moment__empty">Reparte el presupuesto y el embudo aparecerá aquí.</p>`}),t({variant:`light`,wide:!0,html:`<div data-statepanel></div>
      <p class="tool-footer">Siguiente pieza: <a href="${l(`/tools/nurturing.html`)}">scoring y workflow de los 90 días</a>.</p>`})].join(``);function E(){let e=p();w.querySelector(`[data-canales]`).innerHTML=d.map(t=>m(t,e)).join(``)}function D(){w.querySelector(`[data-funnel]`).innerHTML=g(p())}function O(){let e=p(),t=f.presupuesto-e.invertido,n=w.querySelector(`[data-restante]`);n.querySelector(`b`).textContent=`${c(t)} €`,n.dataset.estado=t<0?`pasado`:t===0?`ok`:``,n.querySelector(`span`).textContent=t<0?`por encima del presupuesto`:`sin asignar`}function k(){w.querySelector(`[data-campos]`).innerHTML=_()}function A(){w.querySelector(`[data-movil]`).innerHTML=v()}function j(){w.querySelector(`[data-checks]`).innerHTML=b()}function M(){let{html:e,pie:t}=y();i(w,`payoff`,e,t)}function N({canales:e=!1}={}){e?E():p().porCanal.forEach(e=>{let t=w.querySelector(`[data-canal="${e.id}"]`);if(!t)return;let n=t.closest(`.canal`);n.dataset.activo=e.euros>0?`si`:`no`,n.dataset.tope=e.tope?`si`:`no`,n.querySelector(`.canal__cifras`).innerHTML=`<b>${c(e.euros)} €</b> · ${c(Math.round(e.impactos))} impactos · ${c(Math.round(e.visitas))} visitas${e.tope?` · tope de alcance`:``}`}),D(),O(),j(),M()}w.addEventListener(`input`,e=>{let t=e.target.dataset.canal;if(t){f.reparto[t]=Number(e.target.value),N();return}let n=e.target.dataset.sup;if(n){f[n]=Number(e.target.value),w.querySelector(`[data-val-vl]`).textContent=`${c(f.convVisitaLead,1)}%`,w.querySelector(`[data-val-lc]`).textContent=`${c(f.convLeadCliente,1)}%`,w.querySelector(`[data-val-tm]`).textContent=`${c(f.ticketMedio)} €`,N();return}if(e.target.dataset.presupuesto!==void 0){f.presupuesto=Math.max(0,Number(e.target.value)||0),N({canales:!0});return}let r=e.target.dataset.cadena;if(r){f.cadena[r]=e.target.value,A(),j();return}let i=e.target.dataset.campoNombre;i&&(f.cadena.campos.find(e=>e.id===i).nombre=e.target.value,A(),j())}),w.addEventListener(`change`,e=>{let t=e.target.dataset.campoObl;t&&(f.cadena.campos.find(e=>e.id===t).obligatorio=e.target.value===`si`,A(),j())});var P=1;w.addEventListener(`click`,e=>{if(e.target.closest(`[data-anadir-campo]`)){P++,f.cadena.campos.push({id:`c${Date.now()}-${P}`,nombre:``,obligatorio:!1}),k(),A(),j();return}let t=e.target.closest(`[data-campo-borrar]`)?.dataset.campoBorrar;t&&(f.cadena.campos=f.cadena.campos.filter(e=>e.id!==t),k(),A(),j())}),w.addEventListener(`click`,e=>{let t=e.target.closest(`[data-pista]`);if(!t)return;let n=w.querySelector(`[data-pista-texto="${t.dataset.pista}"]`);n.hidden=!n.hidden,t.textContent=n.hidden?`Pista · ¿dónde miro?`:`Ocultar la pista`}),r(w,{mix:S,cadena:C}),e({mount:w.querySelector(`[data-statepanel]`),toolId:`funnel`,nombreArchivo:`mix-y-conversion`,getState:()=>structuredClone(f),setState:e=>{f.presupuesto=Number(e.presupuesto)||f.presupuesto,f.reparto=Object.fromEntries(d.map(t=>[t.id,Number(e.reparto?.[t.id])||0])),[`convVisitaLead`,`convLeadCliente`,`ticketMedio`].forEach(t=>{typeof e[t]==`number`&&(f[t]=e[t])}),e.cadena&&(f.cadena={cta:e.cadena.cta||``,magnetTitulo:e.cadena.magnetTitulo||``,magnetFormato:e.cadena.magnetFormato||``,landingTitular:e.cadena.landingTitular||``,landingPromesa:e.cadena.landingPromesa||``,campos:Array.isArray(e.cadena.campos)&&e.cadena.campos.length?e.cadena.campos.map((e,t)=>({id:e.id||`imp${t}`,nombre:e.nombre||``,obligatorio:!!e.obligatorio})):[{id:`c1`,nombre:`Email`,obligatorio:!0}]}),w.querySelector(`[data-presupuesto]`).value=f.presupuesto,w.querySelector(`[data-sup="convVisitaLead"]`).value=f.convVisitaLead,w.querySelector(`[data-sup="convLeadCliente"]`).value=f.convLeadCliente,w.querySelector(`[data-sup="ticketMedio"]`).value=f.ticketMedio,w.querySelector(`[data-val-vl]`).textContent=`${c(f.convVisitaLead,1)}%`,w.querySelector(`[data-val-lc]`).textContent=`${c(f.convLeadCliente,1)}%`,w.querySelector(`[data-val-tm]`).textContent=`${c(f.ticketMedio)} €`,w.querySelectorAll(`[data-cadena]`).forEach(e=>{e.value=f.cadena[e.dataset.cadena]||``}),k(),A(),N({canales:!0})},toMarkdown:x}),E(),k(),A(),N();