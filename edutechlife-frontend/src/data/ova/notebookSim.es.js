export const contentScreens = [
  {
    id: 'sourcing',
    title: 'Selección y Curaduría de Fuentes',
    subtitle: 'Calidad sobre cantidad en tu investigación',
    objective: 'Aprender a seleccionar, organizar y evaluar fuentes para tu notebook',
    valerioText: 'La base de un buen análisis documental comienza con la selección de fuentes. No se trata de acumular documentos, sino de elegir los más relevantes y confiables. Una fuente bien curada marca la diferencia entre un análisis superficial y uno profundo. Aprende a identificar fuentes primarias, evaluar su credibilidad y organizarlas temáticamente para maximizar el valor de tu investigación.',
    achievements: [
      { text: 'Identificar fuentes primarias y secundarias relevantes' },
      { text: 'Evaluar la credibilidad y actualidad de cada fuente' },
      { text: 'Organizar documentos por categorías temáticas' },
    ],
    warnings: [
      { text: 'Acumular fuentes sin criterio de selección' },
      { text: 'Confiar en fuentes sin verificar su procedencia' },
      { text: 'Mezclar información de calidad desigual sin contexto' },
    ],
    example: { weak: 'Descargar 30 PDFs sobre IA sin leer títulos ni autores', strong: 'Seleccionar 8 papers revisados por pares, organizados por tema: 3 de ética, 3 de técnicos, 2 de aplicaciones prácticas' },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'synthesis',
    title: 'Síntesis Cruzada entre Fuentes',
    subtitle: 'Conectar ideas entre múltiples documentos',
    objective: 'Generar síntesis que integren información de diversas fuentes',
    valerioText: 'El verdadero poder del análisis documental está en la capacidad de conectar ideas entre diferentes fuentes. Una síntesis cruzada te permite identificar patrones, contradicciones y complementos entre documentos que, vistos por separado, no serían evidentes. NotebookLM facilita este proceso al permitirte hacer preguntas que abarcan todas tus fuentes simultáneamente.',
    achievements: [
      { text: 'Identificar puntos en común entre diferentes autores' },
      { text: 'Detectar contradicciones y debates académicos' },
      { text: 'Construir una visión integral del tema investigado' },
    ],
    warnings: [
      { text: 'Citar fuentes sin haberlas leído completamente' },
      { text: 'Ignorar hallazgos que contradicen tu hipótesis' },
      { text: 'Sintetizar sin mantener el contexto original' },
    ],
    example: { weak: 'Resumir cada paper por separado sin relacionarlos entre sí', strong: 'Crear una matriz comparativa que muestre coincidencias y divergencias entre 5 autores sobre el mismo tema, con citas textuales de respaldo' },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'analysis',
    title: 'Análisis Crítico de Contenido',
    subtitle: 'Evaluar y cuestionar la información',
    objective: 'Desarrollar pensamiento crítico al analizar documentos',
    valerioText: 'El análisis crítico es la habilidad más importante que puedes desarrollar. No se trata solo de entender lo que dice un documento, sino de cuestionarlo, evaluar sus argumentos y determinar su validez. Pregúntate siempre: ¿Quién escribió esto? ¿Con qué propósito? ¿Qué evidencia respalda sus afirmaciones? ¿Qué sesgos podría tener?',
    achievements: [
      { text: 'Evaluar la solidez de los argumentos presentados' },
      { text: 'Identificar sesgos y limitaciones en las fuentes' },
      { text: 'Formular preguntas críticas sobre el contenido' },
    ],
    warnings: [
      { text: 'Aceptar información sin cuestionar su validez' },
      { text: 'Confundir correlación con causalidad' },
      { text: 'Generalizar conclusiones a partir de muestras pequeñas' },
    ],
    example: { weak: 'Aceptar como verdad absoluta un estudio con muestra de 20 personas', strong: 'Analizar críticamente: identificar el tamaño muestral, metodología, posibles sesgos y limitaciones antes de extraer conclusiones' },
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000',
  },
];

export const questionsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    question: "¿Cuál es el primer paso recomendado antes de subir documentos a NotebookLM para análisis?",
    options: [
      "Subir todos los documentos disponibles sin revisarlos.",
      "Seleccionar y curar las fuentes según su relevancia y calidad.",
      "Traducir todos los documentos al mismo idioma.",
      "Comprimir los archivos para que ocupen menos espacio."
    ],
    correct: 1,
    explanation: "Correcto. La curaduría de fuentes es fundamental. Debes seleccionar documentos relevantes, confiables y actualizados antes de subirlos a tu notebook.",
    hint: "Piensa en la calidad versus cantidad. No se trata de acumular, sino de seleccionar."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=1000",
    question: "¿Qué significa hacer una 'síntesis cruzada' entre fuentes?",
    options: [
      "Leer los documentos en orden alfabético.",
      "Comparar y contrastar información de múltiples documentos para encontrar patrones y diferencias.",
      "Copiar textualmente todas las conclusiones en un solo archivo.",
      "Traducir cada fuente a varios idiomas para comparar."
    ],
    correct: 1,
    explanation: "Exacto. La síntesis cruzada te permite conectar ideas entre distintos documentos, identificar dónde coinciden los autores y dónde existen divergencias.",
    hint: "No se trata de resumir cada fuente por separado, sino de encontrar conexiones entre ellas."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    question: "¿Qué debes hacer si encuentras dos fuentes que se contradicen en tu investigación?",
    options: [
      "Ignorar ambas fuentes y buscar otras.",
      "Eliminar la fuente más antigua y quedarte con la nueva.",
      "Analizar ambas, identificar las razones de la contradicción y documentarla en tu análisis.",
      "Elegir la fuente que confirme tu hipótesis inicial."
    ],
    correct: 2,
    explanation: "¡Excelente! Las contradicciones son oportunidades de aprendizaje. Debes analizar por qué discrepan, considerando metodologías, contextos y fechas.",
    hint: "Las controversias académicas son comunes; enfrentarlas críticamente fortalece tu investigación."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    question: "¿Cuál es la mejor práctica al organizar fuentes en NotebookLM?",
    options: [
      "Subir las 50 fuentes permitidas en un solo notebook sin clasificar.",
      "Crear notebooks separados por temas o categorías con fuentes afines.",
      "Subir solo el resumen de cada documento, no el documento completo.",
      "Mezclar fuentes académicas con blogs sin distinción."
    ],
    correct: 1,
    explanation: "Correcto. Organizar tus fuentes por temas o categorías te permite hacer preguntas más precisas y obtener respuestas más relevantes de la IA.",
    hint: "La organización temática te ayuda a mantener el contexto y hacer preguntas más específicas."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    question: "¿Por qué es importante verificar las citas que proporciona NotebookLM?",
    options: [
      "Porque la IA a veces puede alucinar o interpretar incorrectamente el contexto.",
      "Porque las citas siempre están equivocadas.",
      "Porque NotebookLM solo funciona si verificas cada cita manualmente.",
      "Porque las citas son decorativas y no necesitan verificación."
    ],
    correct: 0,
    explanation: "¡Muy bien! Aunque NotebookLM es muy preciso al citar, siempre debes verificar que la cita corresponda al contexto correcto dentro del documento original.",
    hint: "La IA es una herramienta poderosa, pero la verificación humana sigue siendo esencial."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000",
    question: "¿Qué estrategia es más efectiva al hacer preguntas a NotebookLM sobre múltiples fuentes?",
    options: [
      "Hacer preguntas muy generales como '¿de qué tratan estos documentos?'",
      "Formular preguntas específicas que requieran comparar información entre fuentes.",
      "Pedir a la IA que adivine información que no está en los documentos.",
      "Hacer todas las preguntas de una sola vez en un párrafo extenso."
    ],
    correct: 1,
    explanation: "Correcto. Las preguntas específicas que requieren comparación entre fuentes aprovechan al máximo la capacidad de NotebookLM para hacer síntesis cruzadas.",
    hint: "Mientras más específica sea tu pregunta, más útil será la respuesta de la IA."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=1000",
    question: "¿Cuál es el beneficio principal de usar NotebookLM para análisis documental?",
    options: [
      "Reemplaza completamente la lectura de los documentos originales.",
      "Permite procesar y consultar múltiples fuentes simultáneamente con respuestas fundamentadas.",
      "Escribe automáticamente tu tesis sin necesidad de investigación.",
      "Traduce todos los documentos a cualquier idioma en segundos."
    ],
    correct: 1,
    explanation: "¡Exacto! NotebookLM es un asistente que amplifica tu capacidad de análisis, permitiéndote trabajar con múltiples fuentes a la vez, pero siempre requiere tu supervisión y pensamiento crítico.",
    hint: "La IA es una herramienta de aumento, no un reemplazo del pensamiento crítico humano."
  }
];
