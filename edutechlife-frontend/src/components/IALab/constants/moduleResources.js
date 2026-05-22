/**
 * CONSTANTES: moduleResources.js
 * 
 * Datos de recursos educativos para cada tema del módulo
 * Estructura modular que permite escalar a más módulos y temas
 * 
 * Formato:
 * - Módulo 1: Ingeniería de Prompts
 * - 6 temas con recursos variados (video, PDF, imagen, interactivo)
 * - Metadatos completos para cada recurso
 */

export const moduleResources = {
  // MÓDULO 1: INGENIERÍA DE PROMPTS
  "Introducción a la Inteligencia Artificial Generativa": {
    title: "De Cero a Experto en IA",
    description: "Descubre cómo la IA generativa está transformando la educación, los negocios y la vida diaria. Aprende desde cero qué es, cómo funciona y por qué es la habilidad más demandada del momento.",
    learningObjectives: [
      "Comprender qué es la IA Generativa y cómo funciona",
      "Diferenciar entre IA débil (narrow) y IA fuerte (general)",
      "Identificar aplicaciones prácticas en educación y negocios",
      "Reconocer los límites éticos y técnicos actuales"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "intro-video-1",
        type: "video",
        title: "Anatomía de un Prompt en 6 Minutos",
        url: "https://www.youtube.com/embed/6f-FwOE5wIY",
        duration: "6:06",
        thumbnail: "https://img.youtube.com/vi/6f-FwOE5wIY/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende en solo 6 minutos cómo construir prompts que la IA entiende a la primera. Con ejemplos visuales claros."
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Comienzos de la IA",
        description: "Explora los orígenes de la inteligencia artificial con 5 actividades interactivas que te llevarán desde Alan Turing hasta ChatGPT.",
        estimatedTime: "10 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "¿Qué es un Prompt?": {
    title: "El Arte de Dar Instrucciones a la IA",
    description: "Domina el arte de comunicarte con la IA: aprende a escribir instrucciones claras que te den respuestas precisas y útiles en segundos.",
    learningObjectives: [
      "Comprender qué es un prompt y cómo usarlo para comunicarte efectivamente con la IA"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "prompt-video-1",
        type: "video",
        title: "IA Generativa en 4 Minutos",
        url: "https://www.youtube.com/embed/jnePzCTKEqs?start=3",
        duration: "4:30",
        thumbnail: "https://img.youtube.com/vi/jnePzCTKEqs/maxresdefault.jpg",
        provider: "youtube",
        description: "Entiende la IA generativa con ejemplos visuales y prácticos que puedes aplicar desde hoy."
      },
      {
        id: "prompt-guide-1",
        type: "pdf",
        title: "Guía: Anatomía de un Prompt",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 12,
        format: "PDF",
        size: "249 KB",
        description: "Tu manual de referencia con técnicas comprobadas y ejemplos listos para copiar y pegar.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "prompt-ova-html-1",
        type: "ova_interactive",
        title: "Tu Primer Prompt: Laboratorio Interactivo",
        description: "Pon en práctica lo aprendido: escribe tus propios prompts y recibe feedback inmediato. Laboratorio guiado por Valerio.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true
      }
    ]
  },

  "Estructura Básica de un Prompt Efectivo": {
    title: "La Fórmula del Prompt Perfecto",
    description: "Descubre los patrones secretos que usan los expertos para obtener respuestas de IA de nivel profesional.",
    learningObjectives: [
      "Aplicar la estructura ROL-TAREA-FORMATO-CONTEXTO",
      "Utilizar delimitadores y marcadores de sección",
      "Incorporar ejemplos de few-shot learning",
      "Ajustar el nivel de detalle según el objetivo"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "structure-video-1",
        type: "video",
        title: "Construye Prompts como un Profesional",
        url: "https://www.youtube.com/embed/8XxSC2L6QoE",
        duration: "9:45",
        thumbnail: "https://img.youtube.com/vi/8XxSC2L6QoE/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende a construir prompts profesionales paso a paso con ejemplos reales que puedes adaptar a tus necesidades."
      },
      {
        id: "structure-template-1",
        type: "document",
        title: "Plantillas de Estructura Avanzada (JSON)",
        url: "/templates/advanced-prompt-templates.json",
        format: "JSON",
        size: "3.2 MB",
        description: "15 plantillas profesionales listas para usar: solo copia, personaliza y obtén resultados increíbles."
      },
      {
        id: "structure-case-1",
        type: "document",
        title: "Case Study: Prompt para Análisis de Datos",
        url: "/case-studies/data-analysis-prompt-case.pdf",
        pages: 8,
        format: "PDF",
        size: "2.1 MB",
        description: "Estudio de caso real: aprende cómo un prompt bien diseñado transformó un análisis de datos complejo."
      }
    ]
  },

  // ============================================================================
  // MÓDULO 2: POTENCIA CHATGPT
  // ============================================================================
  "ChatGPT de la A a la Z": {
    title: "ChatGPT de la A a la Z",
    description: "Todo lo que necesitas para dominar ChatGPT en un solo lugar: desde lo básico hasta técnicas que te harán destacar.",
    learningObjectives: [
      "Navegar eficientemente por la interfaz de ChatGPT",
      "Configurar conversaciones para diferentes propósitos",
      "Aplicar técnicas de prompt engineering específicas para ChatGPT",
      "Identificar las limitaciones y mejores usos de ChatGPT"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "chatgpt-video-1",
        type: "video",
        title: "ChatGPT desde Cero en 6 Minutos",
        url: "https://www.youtube.com/embed/iOlo-K7yj2M",
        duration: "5:43",
        thumbnail: "https://img.youtube.com/vi/iOlo-K7yj2M/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende a usar ChatGPT como un profesional desde el primer minuto, incluso si nunca lo has abierto."
      },
      {
        id: "chatgpt-guide-modulo2",
        type: "pdf",
        title: "Guía Completa de ChatGPT",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/Las-Herramientas-Integradas-de-ChatGPT.pdf/guia_edutechlife_modulo2.pdf",
        pages: 25,
        format: "PDF",
        size: "4.2 MB",
        description: "Tu guía definitiva de ChatGPT: tips, trucos y ejemplos prácticos organizados para consulta rápida.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "chatgpt-ova-ecosystem",
        type: "ova_interactive",
        title: "Explora el Ecosistema ChatGPT",
        description: "Viaje interactivo por el universo ChatGPT: descubre cada herramienta, aprende a combinarlas y conviértete en un usuario avanzado.",
        estimatedTime: "20 minutos",
        difficulty: "Principiante",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Automatiza tu Trabajo con IA": {
    title: "Automatiza tu Trabajo con IA",
    description: "Aprende a usar las 5 herramientas ocultas de ChatGPT que multiplicarán tu productividad. Automatiza tareas en minutos.",
    learningObjectives: [
      "Identificar las 5 herramientas clave del ecosistema ChatGPT",
      "Seleccionar la herramienta correcta según el tipo de tarea",
      "Combinar múltiples herramientas en flujos de trabajo eficientes",
      "Resolver escenarios reales usando las herramientas integradas"
    ],
    estimatedTime: "30 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "workflow-pdf-modulo2",
        type: "pdf",
        title: "Las Herramientas Integradas de ChatGPT",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%202%20guia%20de%20intro/Las-Herramientas-Integradas-de-ChatGPT.pdf",
        pages: 20,
        format: "PDF",
        size: "4.8 MB",
        description: "Descubre cómo Búsqueda Web, Análisis de Datos, DALL-E 3 y Canvas trabajan juntos para resolver problemas complejos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "workflow-ova-herramientas",
        type: "ova_interactive",
        title: "Laboratorio: Herramientas ChatGPT",
        description: "Explora cada herramienta de ChatGPT con ejercicios prácticos y audio guiado. Completa el desafío para demostrar tu dominio.",
        estimatedTime: "25 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Conecta ChatGPT con el Mundo Real": {
    title: "Conecta ChatGPT con el Mundo Real",
    description: "Crea tu propio asistente IA a medida. Aprende a construir GPTs que trabajan para ti mientras tú te enfocas en lo importante.",
    learningObjectives: [
      "Crear GPTs personalizados para necesidades específicas",
      "Configurar acciones para conectar con APIs externas",
      "Compartir y utilizar GPTs de la comunidad",
      "Evaluar cuándo usar un GPT personalizado vs ChatGPT estándar"
    ],
    estimatedTime: "30 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "gpts-video-1",
        type: "video",
        title: "Crea tu Primer GPT en 18 Minutos",
        url: "https://www.youtube.com/embed/VkZ0VKR3Oe8",
        duration: "18:45",
        thumbnail: "https://img.youtube.com/vi/VkZ0VKR3Oe8/maxresdefault.jpg",
        provider: "youtube",
        description: "Sigue este tutorial paso a paso y al final tendrás tu propio asistente IA entrenado para tus necesidades específicas."
      },
      {
        id: "gpts-guide-1",
        type: "image",
        title: "Guía de GPTs y Acciones",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%20de%20aplicaciones/WhatsApp%20Image%202026-05-07%20at%2020.35.40.jpeg",
        format: "JPEG",
        size: "2.1 MB",
        description: "Guía visual rápida para crear, configurar y publicar tu primer GPT personalizado.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gpts-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Construye un GPT",
        description: "Manos a la obra: crea un GPT desde cero con ejercicios guiados y retroalimentación en cada paso.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MÓDULO 3: DOMINA GEMINI
  // ============================================================================
  "Gemini: La IA que Ve, Lee y Escucha": {
    title: "Gemini: La IA que Ve, Lee y Escucha",
    description: "Conoce Gemini, la IA de Google que entiende texto, imágenes, audio y video al mismo tiempo. Un solo asistente para todo.",
    learningObjectives: [
      "Comprender las capacidades multimodales de Gemini",
      "Utilizar Gemini con diferentes tipos de entrada",
      "Comparar Gemini con otros modelos de IA",
      "Aplicar Gemini en contextos creativos y analíticos"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "gemini-video-1",
        type: "video",
        title: "Gemini en 14 Minutos",
        url: "https://www.youtube.com/embed/XV-2xnFMJqI",
        duration: "14:10",
        thumbnail: "https://img.youtube.com/vi/XV-2xnFMJqI/maxresdefault.jpg",
        provider: "youtube",
        description: "Descubre todo lo que Gemini puede hacer: desde analizar imágenes hasta escribir código. La demo completa en 14 minutos."
      },
      {
        id: "gemini-guide-1",
        type: "pdf",
        title: "Manual de Gemini",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 16,
        format: "PDF",
        size: "2.8 MB",
        description: "Tu guía esencial de Gemini: aprende a usarlo para estudiar, trabajar y crear contenido de forma más inteligente.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-ova-1",
        type: "ova",
        title: "Laboratorio: Experimenta con Multimodalidad",
        description: "Pon a prueba Gemini: súbele imágenes, textos y audios para ver cómo responde en tiempo real.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Imágenes + Texto + Datos en Vivo": {
    title: "Imágenes + Texto + Datos en Vivo",
    description: "Lleva Gemini a donde trabajas: aprende a usarlo dentro de Google Docs, Sheets y Gmail para multiplicar tu velocidad.",
    learningObjectives: [
      "Usar Gemini dentro de Google Docs para redacción",
      "Analizar datos con Gemini en Google Sheets",
      "Gestionar correos electrónicos con Gemini en Gmail",
      "Crear presentaciones asistidas por Gemini"
    ],
    estimatedTime: "30 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "workspace-video-1",
        type: "video",
        title: "Gemini en Google Drive: Guía Completa",
        url: "https://www.youtube.com/embed/0pQKzGzZjZ0",
        duration: "20:15",
        thumbnail: "https://img.youtube.com/vi/0pQKzGzZjZ0/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende a integrar Gemini en todas tus herramientas de Google y automatiza tu trabajo diario en minutos."
      },
      {
        id: "workspace-template-1",
        type: "document",
        title: "Plantillas para Google Workspace",
        url: "/templates/gemini-workspace-templates.json",
        format: "JSON",
        size: "2.1 MB",
        description: "Plantillas listas para usar en cada app de Google Workspace. Solo copia, pega y adapta."
      },
      {
        id: "workspace-ova-1",
        type: "ova",
        title: "Simulador: Workspace con Gemini",
        description: "Simula escenarios reales de trabajo con Gemini integrado en tu Google Workspace.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Investiga como un Detective Digital": {
    title: "Investiga como un Detective Digital",
    description: "Descubre cómo profesionales de diferentes industrias están usando Gemini para destacar. Casos reales y resultados comprobados.",
    learningObjectives: [
      "Aplicar Gemini en estrategias de marketing",
      "Usar Gemini para asistencia en programación",
      "Implementar Gemini en procesos educativos",
      "Leverage Gemini para investigación académica"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "gemini-cases-video-1",
        type: "video",
        title: "Gemini en Acción: Casos Reales",
        url: "https://www.youtube.com/embed/1pG8VvJGQgE",
        duration: "16:30",
        thumbnail: "https://img.youtube.com/vi/1pG8VvJGQgE/maxresdefault.jpg",
        provider: "youtube",
        description: "Empresas y profesionales comparten cómo Gemini transformó su forma de trabajar. Resultados que inspiran."
      },
      {
        id: "gemini-cases-guide-1",
        type: "pdf",
        title: "Guía de Casos de Uso",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 24,
        format: "PDF",
        size: "5.1 MB",
        description: "20 casos de uso reales con los prompts exactos que usaron. Aprende de los mejores.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova",
        title: "Laboratorio: Casos Prácticos",
        description: "Enfréntate a 6 desafíos del mundo real y resuélvelos usando Gemini como tu asistente experto.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MÓDULO 4: NOTEBOOKLM
  // ============================================================================
  "¿Qué es NotebookLM?": {
    title: "¿Qué es NotebookLM?",
    description: "La herramienta secreta de Google para investigadores: sube tus PDFs y obtén respuestas precisas con citas textuales. Sin inventos.",
    learningObjectives: [
      "Crear notebooks con fuentes personalizadas",
      "Hacer preguntas específicas sobre tus documentos",
      "Generar resúmenes inteligentes de contenido",
      "Comparar información entre múltiples fuentes"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "notebooklm-video-1",
        type: "video",
        title: "Primeros Pasos con NotebookLM",
        url: "https://www.youtube.com/embed/PV0oNcmIYII",
        duration: "12:30",
        thumbnail: "https://img.youtube.com/vi/PV0oNcmIYII/maxresdefault.jpg",
        provider: "youtube",
        description: "Descubre en 12 minutos cómo tus documentos cobran vida: haz preguntas, obtén resúmenes y verifica cada dato con citas exactas."
      },
      {
        id: "notebooklm-guide-1",
        type: "pdf",
        title: "Guía de NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/guia_edutechlife_modulo3%20.pdf",
        pages: 14,
        format: "PDF",
        size: "2.3 MB",
        description: "La guía definitiva para dominar NotebookLM: desde tu primer cuaderno hasta técnicas avanzadas de investigación.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebooklm-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Crea tu Notebook",
        description: "7 preguntas que te convertirán en experto en NotebookLM. Completa el desafío con Valerio como tu guía personal.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Organiza tu Investigación como un Pro": {
    title: "Organiza tu Investigación como un Pro",
    description: "Convierte montañas de documentos en resúmenes, preguntas frecuentes y reportes ejecutivos con un solo clic.",
    learningObjectives: [
      "Generar resúmenes ejecutivos automáticos",
      "Crear FAQs basadas en tus documentos",
      "Conectar respuestas a fuentes originales",
      "Validar la precisión de la información generada"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "notebook-summary-video-1",
        type: "image",
        title: "Resúmenes Inteligentes con NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/3-INFOGRAFIA.jpeg",
        format: "JPEG",
        size: "2.5 MB",
        description: "Infografía sobre técnicas avanzadas de resumen y análisis con NotebookLM.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebook-summary-template-1",
        type: "pdf",
        title: "Plantillas de Resumen",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/6-%20NotebookLM_El_Cuaderno_del_Futuro.pdf",
        pages: 20,
        format: "PDF",
        size: "2.5 MB",
        description: "Plantillas profesionales de resumen para cada tipo de documento: académico, empresarial, técnico y más."
      },
      {
        id: "notebook-summary-ova-1",
        type: "ova_interactive",
        title: "Simulador: Análisis de Documentos",
        description: "Simulador práctico: toma documentos reales y genera resúmenes de nivel profesional en minutos.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "De PDF a Podcast en un Clic": {
    title: "De PDF a Podcast en un Clic",
    description: "Convierte tus apuntes en podcasts profesionales: dos voces IA conversan sobre tus documentos mientras tú escuchas.",
    learningObjectives: [
      "Generar Audio Overviews de tus notebooks",
      "Personalizar el estilo y tono del audio",
      "Usar audio para aprendizaje y repaso",
      "Compartir Audio Overviews con equipos"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "notebook-audio-video-1",
        type: "video",
        title: "Audio Overview: Tu Contenido en Podcast",
        url: "https://www.youtube.com/embed/Z3Wq8oum108",
        duration: "10:50",
        thumbnail: "https://img.youtube.com/vi/Z3Wq8oum108/maxresdefault.jpg",
        provider: "youtube",
        description: "Descubre cómo crear podcasts a partir de tus PDFs. Ideal para aprender mientras viajas, haces ejercicio o descansas."
      },
      {
        id: "notebook-audio-guide-1",
        type: "ova_interactive",
        title: "Guía de Audio Overview",
        description: "Curso completo de NotebookLM: 6 módulos interactivos con ejercicios prácticos y un desafío final. Conviértete en un experto.",
        estimatedTime: "30 minutos",
        difficulty: "Intermedio",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      },
      {
        id: "notebook-audio-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Crea tu Podcast IA",
        description: "Crea tu primer podcast IA: elige el tema, personaliza el tono y escucha el resultado en minutos.",
        estimatedTime: "15 minutos",
        difficulty: "Avanzado",
        interactiveElements: 3,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MÓDULO 5: ÉTICA Y PRIVACIDAD
  // ============================================================================
  "Ética en IA: Lo Esencial": {
    title: "Ética en IA: Lo Esencial",
    description: "Aprende a reconocer y mitigar los sesgos inherentes en los modelos de IA generativa.",
    learningObjectives: [
      "Identificar tipos comunes de sesgos en IA",
      "Detectar sesgos en respuestas generadas",
      "Aplicar estrategias para reducir sesgos",
      "Evaluar la equidad de resultados de IA"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "bias-video-1",
        type: "video",
        title: "Sesgos en IA: Explicación y Ejemplos",
        url: "https://www.youtube.com/embed/RDkOIf82v6A",
        duration: "12:15",
        thumbnail: "https://img.youtube.com/vi/RDkOIf82v6A/maxresdefault.jpg",
        provider: "youtube",
        description: "Descubre cómo los sesgos invisibles afectan cada respuesta de IA y aprende a detectarlos antes de que afecten tu trabajo."
      },
      {
        id: "bias-guide-1",
        type: "pdf",
        title: "Guía de Detección de Sesgos",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/2-guia_edutechlife_modulo5.pdf",
        pages: 15,
        format: "PDF",
        size: "2.6 MB",
        description: "Aprende el método paso a paso para identificar, analizar y corregir sesgos en cualquier sistema de IA.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "bias-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Detecta el Sesgo",
        description: "Pon a prueba tu ojo crítico: analiza respuestas de IA reales e identifica los sesgos ocultos. Laboratorio guiado por Valerio.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "¿Es Justa tu IA? Descúbrelo": {
    title: "¿Es Justa tu IA? Descúbrelo",
    description: "Estrategias prácticas para proteger tus datos personales y corporativos al usar herramientas de IA.",
    learningObjectives: [
      "Comprender cómo las IA procesan tus datos",
      "Identificar riesgos de privacidad",
      "Aplicar mejores prácticas de protección",
      "Configurar opciones de privacidad en herramientas de IA"
    ],
    estimatedTime: "25 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "privacy-video-1",
        type: "video",
        title: "Privacidad y IA: Lo que Debes Saber",
        url: "https://www.youtube.com/embed/ADvjzvJjx5c",
        duration: "14:40",
        thumbnail: "https://img.youtube.com/vi/ADvjzvJjx5c/maxresdefault.jpg",
        provider: "youtube",
        description: "Todo lo que necesitas saber para usar la IA sin poner en riesgo tus datos personales. Guía práctica y directa."
      },
      {
        id: "privacy-guide-1",
        type: "pdf",
        title: "Manual de Privacidad en IA",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/7-Ethical_AI_Mastery.pdf",
        pages: 20,
        format: "PDF",
        size: "3.8 MB",
        description: "Checklist práctico de 7 pasos para blindar tu privacidad mientras aprovechas al máximo la inteligencia artificial.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "privacy-ova-1",
        type: "ova_interactive",
        title: "Simulador: Evaluación de Riesgos",
        description: "Simulador interactivo: enfréntate a escenarios reales de riesgo y aprende a proteger tus datos. Incluye juego de estrellas éticas.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Protege tus Datos en la Era de la IA": {
    title: "Protege tus Datos en la Era de la IA",
    description: "Marco ético para el uso responsable de IA en educación, trabajo y vida personal.",
    learningObjectives: [
      "Aplicar principios éticos al usar IA",
      "Reconocer usos inapropiados de IA",
      "Promover transparencia en el uso de IA",
      "Desarrollar políticas de uso responsable"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "ethics-video-1",
        type: "video",
        title: "IA Ética: Principios y Práctica",
        url: "https://www.youtube.com/embed/idplIgnLStI",
        duration: "16:25",
        thumbnail: "https://img.youtube.com/vi/idplIgnLStI/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende los principios éticos esenciales para usar la IA con responsabilidad. La guía que todo profesional debe conocer."
      },
      {
        id: "ethics-guide-1",
        type: "pdf",
        title: "Código de Ética para Uso de IA",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 18,
        format: "PDF",
        size: "3.2 MB",
        description: "Marco ético completo con casos prácticos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "ethics-ova-1",
        type: "ova",
        title: "Laboratorio: dilemas Éticos",
        description: "Resuelve dilemas éticos reales relacionados con el uso de IA.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  }
};

/**
 * Helper functions para trabajar con recursos
 */

// Obtener recursos para un tema específico
export const getResourcesForTopic = (topicTitle) => {
  return moduleResources[topicTitle] || null;
};

// Obtener todos los tipos de recursos disponibles en un tema
export const getResourceTypesForTopic = (topicTitle) => {
  const topic = moduleResources[topicTitle];
  if (!topic) return [];
  
  const types = new Set();
  topic.resources.forEach(resource => types.add(resource.type));
  return Array.from(types);
};

// Contar recursos por tipo
export const countResourcesByType = (topicTitle) => {
  const topic = moduleResources[topicTitle];
  if (!topic) return {};
  
  const counts = {};
  topic.resources.forEach(resource => {
    counts[resource.type] = (counts[resource.type] || 0) + 1;
  });
  return counts;
};

export const getResourceDuration = (resource) => {
  if (resource.duration) return resource.duration;
  if (resource.estimatedTime) return resource.estimatedTime;
  return null;
};

export const formatDuration = (duration) => {
  if (!duration) return null;
  return duration;
};

export const formatFileSize = (size) => {
  if (!size) return null;
  return size;
};

// Obtener icono por tipo de recurso
export const getResourceIcon = (type) => {
  const icons = {
    video: "fa-video",
    documento: "fa-file-lines",
    pdf: "fa-file-pdf",
    ova: "fa-brain",
    imagen: "fa-image",
    interactivo: "fa-puzzle-piece",
    document: "fa-file-lines",
    "pdf-thumbnail": "fa-file-pdf",
    "ova-thumbnail": "fa-brain",
    image: "fa-image",
    interactive: "fa-puzzle-piece"
  };
  return icons[type] || "fa-file";
};

export const RESOURCE_TYPE_CONFIG = {
  video:        { icon: "fa-video",         label: "Video",         color: "#004B63",  bg: "bg-[#004B63]/10" },
  document:     { icon: "fa-file-lines",    label: "Documento",    color: "#00BCD4",  bg: "bg-[#00BCD4]/10" },
  documento:    { icon: "fa-file-lines",    label: "Documento",    color: "#00BCD4",  bg: "bg-[#00BCD4]/10" },
  pdf:          { icon: "fa-file-pdf",      label: "PDF",          color: "#EF4444",  bg: "bg-red-50" },
  "pdf-thumbnail": { icon: "fa-file-pdf",   label: "PDF",          color: "#EF4444",  bg: "bg-red-50" },
  image:        { icon: "fa-image",         label: "Imagen",       color: "#10B981",  bg: "bg-emerald-50" },
  imagen:       { icon: "fa-image",         label: "Imagen",       color: "#10B981",  bg: "bg-emerald-50" },
  interactive:  { icon: "fa-puzzle-piece",  label: "Interactivo",  color: "#F59E0B",  bg: "bg-amber-50" },
  interactivo:  { icon: "fa-puzzle-piece",  label: "Interactivo",  color: "#F59E0B",  bg: "bg-amber-50" },
  ova:          { icon: "fa-brain",         label: "OVA",          color: "#8B5CF6",  bg: "bg-purple-50" },
  "ova-thumbnail": { icon: "fa-brain",      label: "OVA",          color: "#8B5CF6",  bg: "bg-purple-50" },
  ova_interactive: { icon: "fa-brain",      label: "OVA",          color: "#8B5CF6",  bg: "bg-purple-50" },
};

export const getResourceColor = (type) => {
  const cfg = RESOURCE_TYPE_CONFIG[type];
  return cfg ? `text-[${cfg.color}]` : "text-slate-500";
};

export default moduleResources;