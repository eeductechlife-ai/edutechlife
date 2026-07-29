export const GEMINI_SLIDE_TABS = [
  { id: "arquitectura", icon: "fa-brain" },
  { id: "multimodalidad", icon: "fa-eye" },
  { id: "deep-research", icon: "fa-magnifying-glass" },
  { id: "workspace", icon: "fa-briefcase" },
  { id: "quiz", icon: "fa-question-circle" },
];

export const SLIDE_ICONS = [
  "fa-brain",
  "fa-eye",
  "fa-magnifying-glass",
  "fa-briefcase",
  "fa-question-circle",
];

export const SLIDE_TITLES_ES = [
  "Arquitectura de Gemini",
  "Multimodalidad en Acción",
  "Gemini con Deep Research",
  "Gemini en Google Workspace",
  "Quiz Final",
];

export const SLIDE_TITLES_EN = [
  "Gemini Architecture",
  "Multimodality in Action",
  "Gemini with Deep Research",
  "Gemini in Google Workspace",
  "Final Quiz",
];

export const SLIDE_DESCRIPTIONS_ES = [
  "Cómo funciona Gemini por dentro",
  "Ve cómo Gemini procesa texto, imágenes y video al mismo tiempo",
  "Aprende a hacer research profundo con Gemini",
  "Gemini integrado en tu día a día",
  "Pon a prueba lo aprendido",
];

export const SLIDE_DESCRIPTIONS_EN = [
  "How Gemini works internally",
  "See how Gemini processes text, images and video at the same time",
  "Learn to do deep research with Gemini",
  "Gemini integrated into your daily life",
  "Test what you have learned",
];

export const SLIDE_CONTENT_ES = [
  {
    title: "¿Qué hace especial a Gemini?",
    paragraphs: [
      "Gemini es un modelo de inteligencia artificial multimodal desarrollado por Google DeepMind. A diferencia de los modelos tradicionales que solo procesan texto, Gemini puede entender y combinar información de múltiples formatos: texto, imágenes, audio, video y código.",
      'Su arquitectura está diseñada para razonar de manera similar a como lo hace un humano: integrando diferentes tipos de información para llegar a conclusiones más precisas. Esto le permite no solo "ver" una imagen, sino entender el contexto y relacionarlo con el texto que la acompaña.',
      "Una de las innovaciones clave de Gemini es su capacidad de razonamiento multimodal nativo. Esto significa que desde su núcleo, el modelo está entrenado para trabajar con múltiples tipos de datos simultáneamente, en lugar de tener módulos separados para cada formato.",
    ],
    highlights: [
      "Procesa texto, imágenes, audio y video",
      "Razonamiento multimodal nativo",
      "Desarrollado por Google DeepMind",
      "Integra información de múltiples fuentes",
    ],
  },
  {
    title: "Procesamiento Multimodal en Tiempo Real",
    paragraphs: [
      "La multimodalidad de Gemini permite escenarios que antes requerían múltiples herramientas. Por ejemplo, puedes tomar una foto de un problema matemático escrito a mano, agregar un audio explicando tu duda, y Gemini te responderá con una solución paso a paso.",
      "En el ámbito profesional, esto significa que puedes analizar gráficos financieros mientras lees un informe, o revisar un video tutorial mientras Gemini te genera un resumen escrito con los puntos clave.",
      "Gemini también puede procesar video en tiempo real, identificando objetos, acciones y contextos. Esto es especialmente útil para aplicaciones educativas, de seguridad, y de análisis de contenido multimedia.",
    ],
    highlights: [
      "Foto + audio = solución explicada",
      "Analiza gráficos y texto simultáneamente",
      "Procesa video en tiempo real",
      "Ideal para educación y análisis multimedia",
    ],
  },
  {
    title: "Investigación Asistida por IA",
    paragraphs: [
      "Deep Research es una de las capacidades más avanzadas de Gemini. Te permite realizar investigaciones profundas sobre cualquier tema, analizando cientos de fuentes y generando informes estructurados con referencias verificables.",
      "El proceso es simple: le das a Gemini una pregunta de investigación, y él se encarga de buscar, analizar, sintetizar y presentar la información de manera organizada. Incluye citas, referencias cruzadas y un análisis de credibilidad de las fuentes.",
      "Esta función es revolucionaria para estudiantes e investigadores, ya que reduce drásticamente el tiempo de investigación preliminar y te permite enfocarte en el análisis crítico y la creación de nuevo conocimiento.",
    ],
    highlights: [
      "Investigación profunda automatizada",
      "Analiza cientos de fuentes simultáneamente",
      "Genera informes con referencias verificables",
      "Reducción drástica del tiempo de investigación",
    ],
  },
  {
    title: "Productividad en tu Día a Día",
    paragraphs: [
      "Gemini se integra directamente con Google Workspace, lo que significa que puedes usar sus capacidades directamente en Gmail, Google Docs, Sheets y Slides sin cambiar de aplicación.",
      "En Gmail, Gemini puede resumir hilos de correo extensos, sugerir respuestas y ayudarte a redactar mensajes más claros. En Google Docs, puede generar contenido, revisar gramática y estilo, e incluso traducir documentos completos manteniendo el formato.",
      "En Google Sheets, Gemini analiza datos, genera fórmulas complejas y crea visualizaciones automáticamente. Y en Slides, puede crear presentaciones completas a partir de un simple prompt, incluyendo imágenes generadas por IA.",
    ],
    highlights: [
      "Integración nativa con Gmail, Docs, Sheets y Slides",
      "Resume correos y sugiere respuestas",
      "Genera fórmulas y visualizaciones en Sheets",
      "Crea presentaciones completas desde un prompt",
    ],
  },
];

export const SLIDE_CONTENT_EN = [
  {
    title: "What Makes Gemini Special?",
    paragraphs: [
      "Gemini is a multimodal artificial intelligence model developed by Google DeepMind. Unlike traditional models that only process text, Gemini can understand and combine information from multiple formats: text, images, audio, video, and code.",
      'Its architecture is designed to reason similarly to how a human does: integrating different types of information to reach more accurate conclusions. This allows it not only to "see" an image but to understand the context and relate it to accompanying text.',
      "One of Gemini's key innovations is its native multimodal reasoning capability. This means that from its core, the model is trained to work with multiple types of data simultaneously, rather than having separate modules for each format.",
    ],
    highlights: [
      "Processes text, images, audio and video",
      "Native multimodal reasoning",
      "Developed by Google DeepMind",
      "Integrates information from multiple sources",
    ],
  },
  {
    title: "Real-time Multimodal Processing",
    paragraphs: [
      "Gemini's multimodality enables scenarios that previously required multiple tools. For example, you can take a photo of a handwritten math problem, add audio explaining your doubt, and Gemini will respond with a step-by-step solution.",
      "In the professional realm, this means you can analyze financial charts while reading a report, or review a video tutorial while Gemini generates a written summary with key points.",
      "Gemini can also process video in real-time, identifying objects, actions, and contexts. This is especially useful for educational applications, security, and multimedia content analysis.",
    ],
    highlights: [
      "Photo + audio = explained solution",
      "Analyze charts and text simultaneously",
      "Real-time video processing",
      "Ideal for education and multimedia analysis",
    ],
  },
  {
    title: "AI-Powered Research",
    paragraphs: [
      "Deep Research is one of Gemini's most advanced capabilities. It allows you to conduct deep research on any topic, analyzing hundreds of sources and generating structured reports with verifiable references.",
      "The process is simple: give Gemini a research question, and it handles searching, analyzing, synthesizing, and presenting the information in an organized manner. It includes citations, cross-references, and credibility analysis of sources.",
      "This feature is revolutionary for students and researchers, as it dramatically reduces preliminary research time and allows you to focus on critical analysis and the creation of new knowledge.",
    ],
    highlights: [
      "Automated deep research",
      "Analyzes hundreds of sources simultaneously",
      "Generates reports with verifiable references",
      "Dramatic reduction in research time",
    ],
  },
  {
    title: "Daily Productivity",
    paragraphs: [
      "Gemini integrates directly with Google Workspace, meaning you can use its capabilities directly in Gmail, Google Docs, Sheets, and Slides without switching applications.",
      "In Gmail, Gemini can summarize lengthy email threads, suggest replies, and help you draft clearer messages. In Google Docs, it can generate content, review grammar and style, and even translate complete documents while preserving formatting.",
      "In Google Sheets, Gemini analyzes data, generates complex formulas, and creates visualizations automatically. And in Slides, it can create complete presentations from a simple prompt, including AI-generated images.",
    ],
    highlights: [
      "Native integration with Gmail, Docs, Sheets and Slides",
      "Summarizes emails and suggests replies",
      "Generates formulas and visualizations in Sheets",
      "Creates complete presentations from a prompt",
    ],
  },
];

export const OVA_CATALOG = [
  {
    id: 'intro-ova-1',
    title: 'Ética en la IA',
    module: 1,
    icon: 'fa-balance-scale',
    duration: '15 min',
    description: 'Comprende los principios fundamentales de la ética aplicada a la inteligencia artificial y su impacto en la sociedad.',
    component: 'OVAEtica',
  },
  {
    id: 'prompt-ova-html-1',
    title: 'Introducción a Prompts',
    module: 1,
    icon: 'fa-brain',
    duration: '15 min',
    description: 'Domina el arte de crear instrucciones precisas para IA: estructura, tipos y mejores prácticas.',
    component: 'OVAIntroPrompt',
  },
  {
    id: 'workflow-ova-herramientas',
    title: 'ChatGPT Tools',
    module: 2,
    icon: 'fa-wand-magic-sparkles',
    duration: '20 min',
    description: 'Explora las herramientas integradas de ChatGPT: búsqueda web, análisis de datos, DALL·E 3 y más.',
    component: 'OVAChatGPTTools',
  },
  {
    id: 'chatgpt-ova-ecosystem',
    title: 'Ecosistema ChatGPT',
    module: 2,
    icon: 'fa-sitemap',
    duration: '20 min',
    description: 'Conoce el ecosistema completo de ChatGPT: modelos, APIs y casos de uso avanzados.',
    component: 'OVAEcosystemGuide',
  },
  {
    id: 'gpts-ova-1',
    title: 'Build Your GPT',
    module: 2,
    icon: 'fa-robot',
    duration: '20 min',
    description: 'Aprende a construir tus propios GPTs personalizados con instrucciones, conocimientos y acciones.',
    component: 'OVABuildGPT',
  },
  {
    id: 'workspace-ova-1',
    title: 'Gemini en Acción',
    module: 3,
    icon: 'fa-atom',
    duration: '20 min',
    description: 'Descubre Gemini: el modelo multimodal de Google que procesa texto, imágenes, audio y video.',
    component: 'OvaEdutechlife',
  },
  {
    id: 'gemini-cases-ova-1',
    title: 'Casos Prácticos Gemini',
    module: 3,
    icon: 'fa-briefcase',
    duration: '20 min',
    description: 'Aplica Gemini a casos reales de negocio: investigación, análisis y automatización.',
    component: 'OVAPracticalCases',
  },
  {
    id: 'notebooklm-ova-1',
    title: 'NotebookLM Lab',
    module: 4,
    icon: 'fa-flask-vial',
    duration: '15 min',
    description: 'Experimenta con NotebookLM convirtiendo documentos en conversaciones y resúmenes inteligentes.',
    component: 'OVANotebookLab',
  },
  {
    id: 'notebook-summary-ova-1',
    title: 'NotebookLM Resúmenes',
    module: 4,
    icon: 'fa-file-text',
    duration: '15 min',
    description: 'Domina el arte de sintetizar documentos con IA: resúmenes precisos con citas verificables.',
    component: 'OVANotebookSimulator',
  },
  {
    id: 'notebook-audio-guide-1',
    title: 'Guía de Audio Overviews',
    module: 4,
    icon: 'fa-podcast',
    duration: '15 min',
    description: 'Guía interactiva para crear Audio Overviews convincentes a partir de tus documentos.',
    component: 'OVANotebookPodcastGuide',
  },
  {
    id: 'notebook-audio-ova-1',
    title: 'Podcast Studio',
    module: 4,
    icon: 'fa-microphone',
    duration: '20 min',
    description: 'Convierte cualquier documento en un podcast profesional con dos presentadores IA.',
    component: 'OVAPodcastStudio',
  },
  {
    id: 'ethics-ova-1',
    title: 'Dilemas Éticos',
    module: 5,
    icon: 'fa-scale',
    duration: '15 min',
    description: 'Analiza dilemas éticos reales de la IA: privacidad, sesgo, transparencia y responsabilidad.',
    component: 'OVAEthicalDilemmas',
  },
  {
    id: 'bias-ova-1',
    title: 'Bias Lab',
    module: 5,
    icon: 'fa-exclamation-triangle',
    duration: '15 min',
    description: 'Detecta y mitiga sesgos algorítmicos en sistemas de IA con herramientas forenses.',
    component: 'OVABiasLab',
  },
  {
    id: 'privacy-ova-1',
    title: 'Simulador de Riesgos',
    module: 5,
    icon: 'fa-shield-alt',
    duration: '15 min',
    description: 'Simula escenarios de riesgo en IA: privacidad, seguridad y gobernanza responsable.',
    component: 'OVARiskSimulator',
  },
]

export const MODULE_NAMES = {
  1: { es: 'El Artesano Digital — Ingeniería de Prompts', en: 'The Digital Artisan — Prompt Engineering' },
  2: { es: 'El Arquitecto de Automatización — Potencia ChatGPT', en: 'The Automation Architect — ChatGPT Power' },
  3: { es: 'Rastreo Profundo con Gemini', en: 'Deep Tracking with Gemini' },
  4: { es: 'El Alquimista del Conocimiento — NotebookLM', en: 'The Knowledge Alchemist — NotebookLM' },
  5: { es: 'Ética Aplicada a IA Generativa', en: 'Applied Ethics for Generative AI' },
}

export const QUIZ_DATA = {
  es: [
    {
      question: "¿Qué significa que Gemini sea un modelo multimodal?",
      options: [
        { id: "a", text: "Que solo procesa texto" },
        {
          id: "b",
          text: "Que puede entender y procesar texto, imágenes, audio y video",
        },
        { id: "c", text: "Que funciona sin conexión a internet" },
        { id: "d", text: "Que solo está disponible en inglés" },
      ],
      correct: "b",
      explanation:
        "Un modelo multimodal puede trabajar con diferentes tipos de datos (texto, imágenes, audio, video) simultáneamente, lo que le permite entender el mundo de manera más completa.",
    },
    {
      question:
        "¿Cuál de las siguientes es una aplicación práctica de Gemini en Google Workspace?",
      options: [
        { id: "a", text: "Solo puede buscar en Google" },
        {
          id: "b",
          text: "Resumir hilos de correo en Gmail y generar contenido en Docs",
        },
        { id: "c", text: "Solo funciona en Google Chrome" },
        { id: "d", text: "No tiene integración con Workspace" },
      ],
      correct: "b",
      explanation:
        "Gemini se integra nativamente con Gmail, Docs, Sheets y Slides, permitiendo resumir correos, generar contenido, analizar datos y crear presentaciones.",
    },
    {
      question: "¿Qué hace única a la función Deep Research de Gemini?",
      options: [
        { id: "a", text: "Solo busca en Wikipedia" },
        {
          id: "b",
          text: "Analiza cientos de fuentes y genera informes estructurados con referencias verificables",
        },
        { id: "c", text: "No puede citar fuentes" },
        { id: "d", text: "Solo funciona con texto" },
      ],
      correct: "b",
      explanation:
        "Deep Research automatiza la investigación profunda analizando múltiples fuentes y generando informes organizados con citas y referencias verificables.",
    },
    {
      question: "¿Qué ventaja ofrece Gemini al procesar video en tiempo real?",
      options: [
        { id: "a", text: "Solo puede procesar imágenes estáticas" },
        {
          id: "b",
          text: "Identifica objetos, acciones y contextos en movimiento",
        },
        { id: "c", text: "No puede procesar video, solo texto" },
        { id: "d", text: "Requiere conexión por cable para procesar video" },
      ],
      correct: "b",
      explanation:
        "Gemini puede procesar video en tiempo real identificando objetos, acciones y contextos, lo que es útil para educación, seguridad y análisis multimedia.",
    },
    {
      question:
        "¿Cuál es la diferencia clave entre Gemini y los modelos tradicionales de IA?",
      options: [
        {
          id: "a",
          text: "Gemini solo es más rápido que los modelos tradicionales",
        },
        {
          id: "b",
          text: "Gemini tiene razonamiento multimodal nativo desde su núcleo",
        },
        { id: "c", text: "Los modelos tradicionales también son multimodales" },
        { id: "d", text: "Gemini no procesa código, solo los tradicionales" },
      ],
      correct: "b",
      explanation:
        "La innovación clave de Gemini es su razonamiento multimodal nativo: desde su núcleo está entrenado para trabajar con múltiples tipos de datos simultáneamente.",
    },
  ],
  en: [
    {
      question: "What does it mean that Gemini is a multimodal model?",
      options: [
        { id: "a", text: "It only processes text" },
        {
          id: "b",
          text: "It can understand and process text, images, audio and video",
        },
        { id: "c", text: "It works without internet connection" },
        { id: "d", text: "It is only available in English" },
      ],
      correct: "b",
      explanation:
        "A multimodal model can work with different types of data (text, images, audio, video) simultaneously, allowing it to understand the world more completely.",
    },
    {
      question:
        "Which of the following is a practical application of Gemini in Google Workspace?",
      options: [
        { id: "a", text: "It can only search Google" },
        {
          id: "b",
          text: "Summarize email threads in Gmail and generate content in Docs",
        },
        { id: "c", text: "It only works in Google Chrome" },
        { id: "d", text: "It has no integration with Workspace" },
      ],
      correct: "b",
      explanation:
        "Gemini integrates natively with Gmail, Docs, Sheets, and Slides, allowing you to summarize emails, generate content, analyze data, and create presentations.",
    },
    {
      question: "What makes Gemini's Deep Research feature unique?",
      options: [
        { id: "a", text: "It only searches Wikipedia" },
        {
          id: "b",
          text: "It analyzes hundreds of sources and generates structured reports with verifiable references",
        },
        { id: "c", text: "It cannot cite sources" },
        { id: "d", text: "It only works with text" },
      ],
      correct: "b",
      explanation:
        "Deep Research automates in-depth research by analyzing multiple sources and generating organized reports with citations and verifiable references.",
    },
    {
      question:
        "What advantage does Gemini offer when processing video in real time?",
      options: [
        { id: "a", text: "It can only process static images" },
        {
          id: "b",
          text: "It identifies objects, actions, and contexts in motion",
        },
        { id: "c", text: "It cannot process video, only text" },
        { id: "d", text: "It requires a cable connection to process video" },
      ],
      correct: "b",
      explanation:
        "Gemini can process video in real-time identifying objects, actions, and contexts, useful for education, security, and multimedia analysis.",
    },
    {
      question:
        "What is the key difference between Gemini and traditional AI models?",
      options: [
        { id: "a", text: "Gemini is only faster than traditional models" },
        { id: "b", text: "Gemini has native multimodal reasoning at its core" },
        { id: "c", text: "Traditional models are also multimodal" },
        {
          id: "d",
          text: "Gemini does not process code, only traditional ones do",
        },
      ],
      correct: "b",
      explanation:
        "Gemini's key innovation is its native multimodal reasoning: from its core, it is trained to work with multiple types of data simultaneously.",
    },
  ],
};
