/* =========================================================================
   contenido.js — Textos editoriales del bloque (placeholders editables).

   IMPORTANTE (regla pedagógica): este archivo es material de ALUMNO.
   No contiene soluciones, ni respuestas correctas, ni rúbricas, ni catálogo
   de errores. Los mandatos de pitch son el ENCARGO de cada equipo; los
   Kahoots se juegan en la plataforma Kahoot!, aquí solo van título y enlace.

   ► PLACEHOLDERS que cierra el profesor antes de clase: busca "TODO:".
   ========================================================================= */

/* -------------------------------------------------------------------------
   1 · Presentación del profesor (slide 2 del deck de apertura).
   ------------------------------------------------------------------------- */
export const PROFESOR = {
  nombre: "TODO: nombre del profesor",
  titular: "TODO: una línea de posicionamiento profesional",
  bio: [
    "TODO: dos o tres frases de trayectoria: dónde trabajas, qué haces y qué has montado.",
    "TODO: una frase que conecte tu experiencia con lo que van a construir estas 20 horas.",
  ],
  contacto: "TODO: email o LinkedIn de contacto para dudas del caso",
};

/* -------------------------------------------------------------------------
   2 · Reglas del taller (slide 3 del deck de apertura).
   ------------------------------------------------------------------------- */
export const REGLAS = [
  { titulo: "20 horas, cuatro sesiones", texto: "11 y 12 de septiembre, y 25 y 26 de septiembre. Cinco horas cada día." },
  { titulo: "Esto es un taller", texto: "Cada bloque de 60' son 15' de teoría, 15' de aplicación al caso y 30' de trabajo vuestro." },
  { titulo: "Todo se construye en clase", texto: "Cada herramienta deja un output exportable que se pega directamente en el entregable." },
  { titulo: "La IA es parte del proceso", texto: "No es una demo ni un ejercicio de prompts: los botones copian el prompt ya construido con lo que acabáis de rellenar." },
  { titulo: "Lo que no se exporta, se pierde", texto: "El estado vive en memoria, sin servidor. Exportad antes de cerrar el navegador." },
];

/* -------------------------------------------------------------------------
   3 · Encargo entre sesiones (12/09 → 25/09). Aparece en el hub y en el
   cierre del día 2. Trece días de hueco: esto es lo que sostiene la continuidad.
   ------------------------------------------------------------------------- */
export const ENCARGO = {
  titulo: "Qué traéis el 25 de septiembre",
  plazo: "Del 12 al 25 de septiembre · 13 días",
  puntos: [
    "Las <strong>dos buyer personas</strong> cerradas, con sus Customer Insights completos.",
    "La <strong>matriz de momentos</strong> sin celdas vacías: los momentos repartidos entre TOFU / MOFU / BOFU y entre antes / durante / después del viaje.",
    "Las <strong>10 keywords</strong> seleccionadas y justificadas una a una.",
    "Los dos archivos <code>.json</code> exportados, uno por herramienta. Sin ellos, el día 25 empezáis en blanco.",
  ],
  aviso: "TODO: añade aquí la instrucción concreta de entrega (Canvas, correo, carpeta compartida) y la hora límite.",
  comoGuardar:
    "En cada herramienta, al final de la página, está el panel «Guardar y recuperar tu trabajo». Pulsa «Exportar .json» y guarda el archivo donde no lo pierdas. El día 25 lo arrastras a esa misma zona y recuperas todo.",
};

/* -------------------------------------------------------------------------
   4 · Kahoots (3). URL y PIN se pegan en vivo desde la propia página.
   Las preguntas y respuestas viven en Kahoot!, nunca en este repositorio.
   ------------------------------------------------------------------------- */
export const KAHOOTS = [
  {
    id: "k1",
    momento: "Día 1 · cierre",
    titulo: "Kahoot 1 · Buyer persona e inbound",
    valida: "Conceptos: crossumer, Customer Insight frente a USP, outbound / inbound / allbound, TOFU-MOFU-BOFU. No pregunta cifras del dataset.",
    url: "", // TODO: URL de la partida
    pin: "", // TODO: PIN de la partida
  },
  {
    id: "k2",
    momento: "Día 3 · cierre",
    titulo: "Kahoot 2 · Atracción y conversión",
    valida: "Conceptos: cluster temático e intención de búsqueda, descriptivos, PPC y post promocionado, CTA → lead magnet → landing → formulario.",
    url: "", // TODO: URL de la partida
    pin: "", // TODO: PIN de la partida
  },
  {
    id: "k3",
    momento: "Día 4 · antes del pitch",
    titulo: "Kahoot 3 · Nurturing, email y medición",
    valida: "Conceptos: lead scoring continuo, workflows, formatos de email, opt-in doble y RGPD, hard/soft bounce, KPIs del funnel.",
    url: "", // TODO: URL de la partida
    pin: "", // TODO: PIN de la partida
  },
];

/* -------------------------------------------------------------------------
   5 · Mandatos del pitch (5). Formato jigsaw: cada equipo defiende una pieza
   distinta para que los pitches no se repitan. Son el ENCARGO, no la solución.
   ------------------------------------------------------------------------- */
export const MANDATOS = [
  {
    id: 1,
    titulo: "Atracción",
    lema: "Antes de que aterrice",
    encargo: "Cómo alcanzamos al turista antes de que aterrice y qué contenido lo justifica.",
    puntos: [
      "Qué clusters temáticos trabajáis y por qué esos y no otros",
      "En qué plataformas y con qué formatos aparecéis",
      "Qué contenido publicáis y qué keyword sostiene cada pieza",
    ],
    prep: { label: "Keywords y clusters", href: "keywords.html" },
  },
  {
    id: 2,
    titulo: "Conversión",
    lema: "Por qué daría su email en vacaciones",
    encargo: "El lead magnet, la landing y el formulario: por qué alguien daría su email estando de viaje.",
    puntos: [
      "Qué lead magnet ofrecéis y por qué querría guardarlo en el móvil",
      "Titular, promesa y campos del formulario (obligatorios y opcionales)",
      "Dónde y cuándo aparece el CTA dentro del viaje",
    ],
    prep: { label: "Cadena de conversión", href: "funnel.html#conversion" },
  },
  {
    id: 3,
    titulo: "Nurturing",
    lema: "Los 90 días de después",
    encargo: "Los 90 días posteriores al vuelo de vuelta: workflow y criterio de scoring.",
    puntos: [
      "Criterios y pesos del lead scoring, y qué dispara cada cambio",
      "El workflow completo: emails, esperas y condiciones",
      "Qué pasa con el lead que no abre nada",
    ],
    prep: { label: "Scoring y workflow", href: "nurturing.html" },
  },
  {
    id: 4,
    titulo: "Calendario y creatividades",
    lema: "Cuándo viaja, cuándo hay producto",
    encargo: "Cómo resolvéis la tensión entre la estacionalidad del producto y la del viaje.",
    puntos: [
      "El calendario anual por plataforma y los meses que quedan descubiertos",
      "Qué hacéis en los meses en los que viaja pero no hay cosecha",
      "Las cinco creatividades: formato, plataforma, insight y CTA",
    ],
    prep: { label: "Calendario y briefs", href: "calendario.html" },
  },
  {
    id: 5,
    titulo: "Medición y presupuesto",
    lema: "Y si baja un 30%",
    encargo: "KPIs, CPL objetivo y qué se corta si el presupuesto baja un 30%.",
    puntos: [
      "Reparto del presupuesto entre canales y CPL resultante",
      "Los KPIs de cada fase del funnel y cuál es vuestro número de cabecera",
      "Qué canal cortáis primero si baja el presupuesto, y con qué argumento",
    ],
    prep: { label: "Mix de captación", href: "funnel.html" },
  },
];

/** Recordatorio fijo de la sala de pitch (el reparto es de clase, no del entregable). */
export const PITCH_RECORDATORIO =
  "En clase dividimos para profundizar; en vuestro entregable real cada equipo cubre todo.";

/** Criterios de scoring del pitch. Son los ejes de la conversación en el aula:
    los pesos y descriptores de la evaluación real están en la Guía Académica. */
export const PITCH_CRITERIOS = [
  { id: "rigor", label: "Rigor", ayuda: "¿Los datos y las decisiones se sostienen?" },
  { id: "caso", label: "Aplicación al caso", ayuda: "¿Es de su producto y su mercado, o vale para cualquiera?" },
  { id: "originalidad", label: "Originalidad", ayuda: "¿Aporta algo que no se le habría ocurrido al resto?" },
  { id: "defensa", label: "Defensa", ayuda: "¿Responde a las preguntas del Comité?" },
];

/* -------------------------------------------------------------------------
   6 · Los cuatro criterios de evaluación ESIC del caso, con sus pesos.
   Del enunciado del caso (resumen de la Guía Académica, págs. 14-16).
   ------------------------------------------------------------------------- */
export const CRITERIOS_ESIC = [
  { peso: 15, titulo: "Teoría y comprensión del marco conceptual", texto: "Identificar y conocer los modelos y contenidos aprendidos, y demostrar su comprensión y aplicación práctica." },
  { peso: 30, titulo: "Análisis y evaluación", texto: "Identificar los aspectos relevantes de una situación real y evaluar datos e información de forma rigurosa y crítica." },
  { peso: 40, titulo: "Recomendación y conclusiones propias", texto: "Fundamentar conclusiones en datos y hechos, con argumentaciones coherentes y soluciones propias." },
  { peso: 15, titulo: "Estilo, estructura y fuentes", texto: "Documento estructurado, estilo profesional, sintaxis y ortografía de nivel de máster, con todas las fuentes referenciadas." },
];

/* -------------------------------------------------------------------------
   7 · Qué entregable sale de este bloque (bloque online del caso).
   ------------------------------------------------------------------------- */
export const ENTREGABLES = [
  { id: "personas", titulo: "2 buyer personas", texto: "El perfil de dos arquetipos de los targets elegidos.", tool: "tools/buyer-persona.html" },
  { id: "keywords", titulo: "10 keywords justificadas", texto: "Al menos diez palabras clave, explicando el porqué de cada elección: son la base de la estrategia de contenidos de web y blog.", tool: "tools/keywords.html" },
  { id: "acciones", titulo: "Plan de acciones online", texto: "Todas las acciones para generar tráfico y captar el mayor número de leads válidos.", tool: "tools/funnel.html" },
  { id: "calendario", titulo: "Calendario y cronograma", texto: "Calendario anual y cronograma de contenidos para las plataformas, web y redes elegidas.", tool: "tools/calendario.html" },
  { id: "creatividades", titulo: "5 creatividades", texto: "Cinco ejemplos finales: redes sociales, Ads, banners o cualquier otro formato online.", tool: "tools/calendario.html#briefs" },
];

/** Lo que este bloque NO cubre (lo ven en los otros dos bloques de la asignatura). */
export const FUERA_DE_ALCANCE = [
  "Estrategia de comunicación y medios offline: relaciones públicas, publicidad y promoción con el turista ya en España.",
  "Multicanalidad y omnicanalidad: estrategia de distribución, e-commerce, marketplace y logística de envío.",
];
