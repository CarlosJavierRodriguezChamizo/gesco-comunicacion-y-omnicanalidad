# Comunicación y Omnicanalidad · Inbound Marketing y Medios Digitales — ESIC (GESCO)

Web docente de aula que sustituye al PowerPoint en el bloque **Inbound Marketing y
Medios Digitales** (20 h, cuatro sesiones de 5 h) de la asignatura *Comunicación y
Omnicanalidad*, anclada al caso **Alimentos España**: *"El turismo extranjero en
España como instrumento de promoción de los alimentos y bebidas españoles"*.

> 82,8 millones de turistas prueban nuestros productos en España.
> Casi ninguno los vuelve a comprar al aterrizar en casa.

Incluye teoría en **RevealJS**, seis herramientas interactivas que dejan al alumno
un output pegable en su entregable y una **sala de pitch** con temporizador y scoring.

## Stack

- **Vite** (vanilla JS, sin frameworks) · multipágina.
- **reveal.js** por npm, nunca por CDN.
- **Offline-first**: fuente, logos, JS y CSS se sirven localmente. Funciona aunque
  caiga el wifi del aula. Ninguna herramienta llama a una API.
- Estado de los interactivos **en memoria**, sin backend — con export/import
  para recuperarlo entre sesiones (ver más abajo).

## Arranque

```bash
npm install
```

```bash
npm run dev
```

Servidor de desarrollo en `http://localhost:5173`.

## Build y previsualización

```bash
npm run build
```

```bash
npm run preview
```

`vite.config.js` usa `base: './'` (rutas relativas), así que `/dist` se sirve igual
desde la raíz de un dominio, desde una subcarpeta (`usuario.github.io/repo/`) o
abriendo los HTML en local.

## Despliegue

Sitio estático en `/dist`.

- **GitHub Pages**: `.github/workflows/deploy.yml` construye con Vite y publica
  `/dist` en la rama `gh-pages` en cada push a `main`. Ajuste inicial, una sola vez:
  *Settings → Pages → Build and deployment → Source: Deploy from a branch →
  Branch: `gh-pages` / `(root)`*. A partir de ahí el sitio se actualiza solo.
- **Vercel / Netlify**: framework *Vite*, build `npm run build`, output `dist`.

## Estructura

```
index.html                    Hub / escaleta viva de las 4 sesiones
decks/
  intro.html                  Apertura: el caso, las reglas y qué se entrega
  m1.html                     El buyer persona en la digitalización
  m2.html                     Atracción y conversión
  m3.html                     Nurturing, automatización y postventa
  m4.html                     Del plan al sitio web, con IA
tools/
  buyer-persona.html          2 arquetipos + matriz de momentos 3×3
  keywords.html               Importador de Ahrefs, clusters y las 10 keywords
  funnel.html                 Mix de captación + cadena de conversión
  web-ia.html                 Árbol de contenidos del site + brief para la IA
  nurturing.html              Lead scoring + workflow de los 90 días
  calendario.html             Calendario anual + 5 briefs de creatividad
  pitch.html                  Sala de pitch: mandatos, cronómetro y ranking
  _styleguide.html            Guía de estilo (no enlazada en la navegación)
src/
  components/                 Header, Section, Card, Kpi, Button, Badge, Chip,
                              StatePanel, AskAIButton, RevealMoment
  data/                       escaleta.json · caso-alimentos.json · contenido.js
  js/                         Lógica de cada página
  styles/                     tokens · base · components · deck · tool + una por tool
public/assets/                Fuente y logos (offline)
```

## Las dos quincenas: export e import

Entre el día 2 (12/09) y el día 3 (25/09) hay **trece días**. El estado vive en
memoria y no hay backend, así que **toda herramienta que exporta puede reimportar su
propio export**: el alumno descarga un `.json`, y el día 25 lo arrastra al panel
«Guardar y recuperar tu trabajo» y sigue donde lo dejó.

Cada herramienta exporta además un `.md` con el contenido ya formateado para pegarlo
en el Word del entregable.

Formato del archivo:

```json
{ "tool": "keywords", "version": 1, "fecha": "2025-09-12T18:00:00.000Z", "estado": { } }
```

Si se importa un archivo de otra herramienta, el panel lo detecta y avisa.

## Qué entregable sale de este bloque

Los cinco puntos del bloque online del caso, uno por herramienta:

1. **2 buyer personas** → `tools/buyer-persona.html`
2. **10 keywords justificadas** → `tools/keywords.html`
3. **Plan de acciones online** → `tools/funnel.html`
4. **Calendario anual y cronograma** → `tools/calendario.html`
5. **5 creatividades** → `tools/calendario.html#briefs`

Y, como puente al tercer bloque de la asignatura:

6. **El sitio web del Anexo 1** → `tools/web-ia.html` — árbol de contenidos, ficha de
   producto, formularios y checkout, con el brief listo para construirlo con IA. La
   estrategia de distribución y la logística que lo rodean son del tercer bloque.

## La IA en el aula

Dos usos, y ninguno es escribir prompts:

- **Como asistente** (M1–M3): cada herramienta tiene un botón que copia al portapapeles
  un prompt ya compuesto con lo que el alumno acaba de rellenar. Un clic, sin campos de
  texto ni explicaciones de prompting.
- **Como constructora** (M4): la herramienta del sitio web compone un brief completo
  —contexto, árbol de contenidos, restricciones y criterio de aceptación— para generar
  la web con la plataforma que elijan (Wix, v0, Lovable, la que sea).

**Ninguna herramienta llama a una API.** Todo es local y offline: los botones copian
texto, no envían nada.

## Sobre las cifras

Todos los datos del caso proceden del **dossier del enunciado (2018)** y se muestran
siempre con esa etiqueta visible. Son las cifras que evalúa el caso. Si en algún
momento se quiere la serie viva, las fuentes son el INE (FRONTUR/EGATUR) y el Informe
Económico de FIAB — y **no se mezclan años dentro de un mismo gráfico**.

La estacionalidad turística por mes de `caso-alimentos.json` es un perfil orientativo
de aula, no una cifra del dossier, y va etiquetada como tal.

## Nota pedagógica (importante)

Este proyecto es **material de alumno**. No contiene —ni puede contener— soluciones,
respuestas correctas, catálogos de errores ni rúbricas: un alumno puede probar URLs o
leer el código fuente. No existe ninguna página de profesor.

Las validaciones de los interactivos son **estructurales**, no de contenido:
comprueban si el trabajo está completo («¿has cubierto las tres fases?», «¿has
justificado las diez keywords?»), nunca si una decisión es la correcta. El botón
«Pista» orienta dónde mirar y nunca da la respuesta.

En `caso-alimentos.json`, los bloques `momentos` y `keywords` **no llevan fase ni
intención preasignadas**, y `volumen` vale `null` de forma explícita para que se vea
que el dato falta y no se confunda con un cero.

El material de profesor (qué esperar en cada celda de la matriz, clusters de
referencia, rúbrica de scoring del pitch) se gestiona **fuera de este repositorio**.

## Antes de clase: qué hay que cerrar

Busca `TODO:` en `src/data/contenido.js`:

1. **Texto de presentación del profesor** (slide 2 del deck de apertura).
2. **Instrucción concreta de entrega** del encargo entre sesiones.

Y, fuera del código:

3. **Export de Ahrefs.** El importador de `tools/keywords.html` se prueba con un
   export real *antes* del día 2: es el único punto del taller que depende de un
   archivo externo. Conviene llevar un CSV de reserva en un USB.
4. **Cuenta de la plataforma de IA** que se vaya a usar el día 3 para construir la web,
   probada antes de clase con el brief que genera la herramienta.
5. **Documento confidencial de profesor**, fuera del repo.

## Accesibilidad

Roles ARIA, foco visible, contraste AA, navegación completa por teclado (el
clasificador de momentos y el calendario se manejan con `Tab` + `Enter`), y respeto a
`prefers-reduced-motion`.
