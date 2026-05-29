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

const RESOURCES_ES = {
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
        title: "Qué es la I.A y como esta cambiando el mundo",
        url: "https://www.youtube.com/embed/6f-FwOE5wIY",
        duration: "6:06",
        thumbnail: "https://img.youtube.com/vi/6f-FwOE5wIY/maxresdefault.jpg",
        provider: "youtube",
        description: "Aprende en solo 6 minutos cómo construir prompts que la IA entiende a la primera. Con ejemplos visuales claros."
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Comienzos de la Inteligencia Artificial",
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
        title: "Como crear un buen prompt",
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
        title: "Cómo comunicarte con la IA (prompts)",
        description: "Pon en práctica lo aprendido: escribe tus propios prompts y recibe feedback inmediato. Laboratorio guiado por Valerio.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MÓDULO 2: POTENCIA CHATGPT
  // ============================================================================
  "Guía Completa de ChatGPT": {
    title: "Guía Completa de ChatGPT",
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
        pages: 12,
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

  "Plantillas de Flujos de Trabajo": {
    title: "Plantillas de Flujos de Trabajo",
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
        pages: 10,
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

  "Function Calling y APIs de OpenAI": {
    title: "Function Calling y APIs de OpenAI",
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
  "Introducción a Google Gemini": {
    title: "Introducción a Google Gemini",
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
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_gemini_modulo3.pdf",
        pages: 16,
        format: "PDF",
        size: "2.8 MB",
        description: "Tu guía esencial de Gemini: aprende a usarlo para estudiar, trabajar y crear contenido de forma más inteligente.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-ova-1",
        type: "ova_interactive",
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

  "Razonamiento Multimodal y Grounding": {
    title: "Razonamiento Multimodal y Grounding",
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
        type: "ova_interactive",
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

  "Deep Research y Fact-Checking con IA": {
    title: "Deep Research y Fact-Checking con IA",
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
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_casos_de_uso_gemini_modulo3.pdf",
        pages: 24,
        format: "PDF",
        size: "5.1 MB",
        description: "20 casos de uso reales con los prompts exactos que usaron. Aprende de los mejores.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova_interactive",
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
  "¿Qué es NotebookLM y para qué sirve?": {
    title: "¿Qué es NotebookLM y para qué sirve?",
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
        pages: 10,
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

  "Curaduría de Fuentes y Síntesis de Documentos": {
    title: "Curaduría de Fuentes y Síntesis de Documentos",
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
        title: "Notebook LM cuaderno del futuro",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/6-%20NotebookLM_El_Cuaderno_del_Futuro.pdf",
        pages: 15,
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

  "Audio Overviews y Gestión Documental con IA": {
    title: "Audio Overviews y Gestión Documental con IA",
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
        title: "Crea tu propio podcast",
        url: "https://www.youtube.com/embed/Z3Wq8oum108",
        duration: "2:15",
        thumbnail: "https://img.youtube.com/vi/Z3Wq8oum108/maxresdefault.jpg",
        provider: "youtube",
        description: "Descubre cómo crear podcasts a partir de tus PDFs. Ideal para aprender mientras viajas, haces ejercicio o descansas."
      },
      {
        id: "notebook-audio-guide-1",
        type: "ova_interactive",
        title: "Notebook LM",
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
  "Ética en la Inteligencia Artificial": {
    title: "Ética en la Inteligencia Artificial",
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

  "Sesgos Algorítmicos y Equidad": {
    title: "Sesgos Algorítmicos y Equidad",
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

  "Privacidad, Regulación y IA Responsable": {
    title: "Privacidad, Regulación y IA Responsable",
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
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/codigo_etica_ia_modulo5.pdf",
        pages: 18,
        format: "PDF",
        size: "3.2 MB",
        description: "Marco ético completo con casos prácticos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "ethics-ova-1",
        type: "ova_interactive",
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

// ============================================================================
// ENGLISH RESOURCES
// ============================================================================
const RESOURCES_EN = {
  "Introduction to Generative Artificial Intelligence": {
    title: "Introduction to Generative Artificial Intelligence",
    description: "Discover how generative AI is transforming education, business, and daily life. Learn from scratch what it is, how it works, and why it's the most in-demand skill right now.",
    learningObjectives: [
      "Understand what Generative AI is and how it works",
      "Differentiate between narrow AI and general AI",
      "Identify practical applications in education and business",
      "Recognize current ethical and technical limitations"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Beginner",
    resources: [
      {
        id: "intro-video-1",
        type: "video",
        title: "What is AI and how it is changing the world",
        url: "https://www.youtube.com/embed/6f-FwOE5wIY",
        duration: "6:06",
        thumbnail: "https://img.youtube.com/vi/6f-FwOE5wIY/maxresdefault.jpg",
        provider: "youtube",
        description: "Learn in just 6 minutes how to build prompts that AI understands on the first try. With clear visual examples."
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Beginnings of Artificial Intelligence",
        description: "Explore the origins of artificial intelligence with 5 interactive activities that will take you from Alan Turing to ChatGPT.",
        estimatedTime: "10 minutes",
        difficulty: "Intermediate",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "What is a Prompt?": {
    title: "What is a Prompt?",
    description: "Master the art of communicating with AI: learn to write clear instructions that give you precise and useful answers in seconds.",
    learningObjectives: [
      "Understand what a prompt is and how to use it to communicate effectively with AI"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Beginner",
    resources: [
      {
        id: "prompt-video-1",
        type: "video",
        title: "How to create a good prompt",
        url: "https://www.youtube.com/embed/jnePzCTKEqs?start=3",
        duration: "4:30",
        thumbnail: "https://img.youtube.com/vi/jnePzCTKEqs/maxresdefault.jpg",
        provider: "youtube",
        description: "Understand generative AI with visual and practical examples you can apply starting today."
      },
      {
        id: "prompt-guide-1",
        type: "pdf",
        title: "Guide: Anatomy of a Prompt",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 12,
        format: "PDF",
        size: "249 KB",
        description: "Your reference manual with proven techniques and ready-to-copy examples.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "prompt-ova-html-1",
        type: "ova_interactive",
        title: "How to communicate with AI (prompts)",
        description: "Put what you've learned into practice: write your own prompts and get immediate feedback. Guided lab by Valerio.",
        estimatedTime: "10 minutes",
        difficulty: "Beginner",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MODULE 2: CHATGPT POWER
  // ============================================================================
  "Complete ChatGPT Guide": {
    title: "Complete ChatGPT Guide",
    description: "Everything you need to master ChatGPT in one place: from the basics to techniques that will make you stand out.",
    learningObjectives: [
      "Navigate the ChatGPT interface efficiently",
      "Set up conversations for different purposes",
      "Apply ChatGPT-specific prompt engineering techniques",
      "Identify ChatGPT's limitations and best use cases"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Beginner",
    resources: [
      {
        id: "chatgpt-video-1",
        type: "video",
        title: "ChatGPT from Scratch in 6 Minutes",
        url: "https://www.youtube.com/embed/iOlo-K7yj2M",
        duration: "5:43",
        thumbnail: "https://img.youtube.com/vi/iOlo-K7yj2M/maxresdefault.jpg",
        provider: "youtube",
        description: "Learn to use ChatGPT like a professional from the first minute, even if you've never opened it before."
      },
      {
        id: "chatgpt-guide-modulo2",
        type: "pdf",
        title: "Complete ChatGPT Guide",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/Las-Herramientas-Integradas-de-ChatGPT.pdf/guia_edutechlife_modulo2.pdf",
        pages: 12,
        format: "PDF",
        size: "4.2 MB",
        description: "Your ultimate ChatGPT guide: tips, tricks, and practical examples organized for quick reference.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "chatgpt-ova-ecosystem",
        type: "ova_interactive",
        title: "Explore the ChatGPT Ecosystem",
        description: "Interactive journey through the ChatGPT universe: discover each tool, learn to combine them, and become an advanced user.",
        estimatedTime: "20 minutes",
        difficulty: "Beginner",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Workflow Templates": {
    title: "Workflow Templates",
    description: "Learn to use the 5 hidden ChatGPT tools that will multiply your productivity. Automate tasks in minutes.",
    learningObjectives: [
      "Identify the 5 key tools of the ChatGPT ecosystem",
      "Select the right tool for each type of task",
      "Combine multiple tools into efficient workflows",
      "Solve real-world scenarios using integrated tools"
    ],
    estimatedTime: "30 minutes",
    difficulty: "Intermediate",
    resources: [
      {
        id: "workflow-pdf-modulo2",
        type: "pdf",
        title: "Integrated ChatGPT Tools",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%202%20guia%20de%20intro/Las-Herramientas-Integradas-de-ChatGPT.pdf",
        pages: 10,
        format: "PDF",
        size: "4.8 MB",
        description: "Discover how Web Search, Data Analysis, DALL-E 3, and Canvas work together to solve complex problems.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "workflow-ova-herramientas",
        type: "ova_interactive",
        title: "Lab: ChatGPT Tools",
        description: "Explore each ChatGPT tool with practical exercises and guided audio. Complete the challenge to prove your mastery.",
        estimatedTime: "25 minutes",
        difficulty: "Intermediate",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Function Calling and OpenAI APIs": {
    title: "Function Calling and OpenAI APIs",
    description: "Create your own custom AI assistant. Learn to build GPTs that work for you while you focus on what matters.",
    learningObjectives: [
      "Create custom GPTs for specific needs",
      "Configure actions to connect with external APIs",
      "Share and use community GPTs",
      "Evaluate when to use a custom GPT vs standard ChatGPT"
    ],
    estimatedTime: "30 minutes",
    difficulty: "Advanced",
    resources: [
      {
        id: "gpts-guide-1",
        type: "image",
        title: "GPTs and Actions Guide",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%20de%20aplicaciones/WhatsApp%20Image%202026-05-07%20at%2020.35.40.jpeg",
        format: "JPEG",
        size: "2.1 MB",
        description: "Quick visual guide to create, configure, and publish your first custom GPT.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gpts-ova-1",
        type: "ova_interactive",
        title: "Lab: Build a GPT",
        description: "Hands-on: create a GPT from scratch with guided exercises and feedback at every step.",
        estimatedTime: "25 minutes",
        difficulty: "Advanced",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MODULE 3: MASTER GEMINI
  // ============================================================================
  "Introduction to Google Gemini": {
    title: "Introduction to Google Gemini",
    description: "Meet Gemini, Google's AI that understands text, images, audio, and video all at once. One assistant for everything.",
    learningObjectives: [
      "Understand Gemini's multimodal capabilities",
      "Use Gemini with different input types",
      "Compare Gemini with other AI models",
      "Apply Gemini in creative and analytical contexts"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Beginner",
    resources: [
      {
        id: "gemini-video-1",
        type: "video",
        title: "Gemini in 14 Minutes",
        url: "https://www.youtube.com/embed/XV-2xnFMJqI",
        duration: "14:10",
        thumbnail: "https://img.youtube.com/vi/XV-2xnFMJqI/maxresdefault.jpg",
        provider: "youtube",
        description: "Discover everything Gemini can do: from analyzing images to writing code. The complete demo in 14 minutes."
      },
      {
        id: "gemini-guide-1",
        type: "pdf",
        title: "Gemini Manual",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_gemini_modulo3.pdf",
        pages: 16,
        format: "PDF",
        size: "2.8 MB",
        description: "Your essential Gemini guide: learn to use it to study, work, and create content more intelligently.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-ova-1",
        type: "ova_interactive",
        title: "Lab: Experiment with Multimodality",
        description: "Put Gemini to the test: upload images, texts, and audio to see how it responds in real time.",
        estimatedTime: "15 minutes",
        difficulty: "Intermediate",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Multimodal Reasoning and Grounding": {
    title: "Multimodal Reasoning and Grounding",
    description: "Take Gemini where you work: learn to use it inside Google Docs, Sheets, and Gmail to multiply your speed.",
    learningObjectives: [
      "Use Gemini inside Google Docs for writing",
      "Analyze data with Gemini in Google Sheets",
      "Manage emails with Gemini in Gmail",
      "Create Gemini-assisted presentations"
    ],
    estimatedTime: "30 minutes",
    difficulty: "Intermediate",
    resources: [
      {
        id: "workspace-video-1",
        type: "video",
        title: "Gemini in Google Drive: Complete Guide",
        url: "https://www.youtube.com/embed/0pQKzGzZjZ0",
        duration: "20:15",
        thumbnail: "https://img.youtube.com/vi/0pQKzGzZjZ0/maxresdefault.jpg",
        provider: "youtube",
        description: "Learn to integrate Gemini into all your Google tools and automate your daily work in minutes."
      },
      {
        id: "workspace-template-1",
        type: "document",
        title: "Google Workspace Templates",
        url: "/templates/gemini-workspace-templates.json",
        format: "JSON",
        size: "2.1 MB",
        description: "Ready-to-use templates for each Google Workspace app. Just copy, paste, and adapt."
      },
      {
        id: "workspace-ova-1",
        type: "ova_interactive",
        title: "Simulator: Workspace with Gemini",
        description: "Simulate real work scenarios with Gemini integrated into your Google Workspace.",
        estimatedTime: "20 minutes",
        difficulty: "Intermediate",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Deep Research and Fact-Checking with AI": {
    title: "Deep Research and Fact-Checking with AI",
    description: "Discover how professionals from different industries are using Gemini to stand out. Real cases and proven results.",
    learningObjectives: [
      "Apply Gemini in marketing strategies",
      "Use Gemini for programming assistance",
      "Implement Gemini in educational processes",
      "Leverage Gemini for academic research"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Advanced",
    resources: [
      {
        id: "gemini-cases-video-1",
        type: "video",
        title: "Gemini in Action: Real Cases",
        url: "https://www.youtube.com/embed/1pG8VvJGQgE",
        duration: "16:30",
        thumbnail: "https://img.youtube.com/vi/1pG8VvJGQgE/maxresdefault.jpg",
        provider: "youtube",
        description: "Companies and professionals share how Gemini transformed their way of working. Results that inspire."
      },
      {
        id: "gemini-cases-guide-1",
        type: "pdf",
        title: "Use Cases Guide",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_casos_de_uso_gemini_modulo3.pdf",
        pages: 24,
        format: "PDF",
        size: "5.1 MB",
        description: "20 real use cases with the exact prompts they used. Learn from the best.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova_interactive",
        title: "Lab: Practical Cases",
        description: "Face 6 real-world challenges and solve them using Gemini as your expert assistant.",
        estimatedTime: "25 minutes",
        difficulty: "Advanced",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MODULE 4: NOTEBOOKLM
  // ============================================================================
  "What is NotebookLM and how is it used?": {
    title: "What is NotebookLM and how is it used?",
    description: "Google's secret tool for researchers: upload your PDFs and get precise answers with verbatim citations. No hallucinations.",
    learningObjectives: [
      "Create notebooks with custom sources",
      "Ask specific questions about your documents",
      "Generate intelligent content summaries",
      "Compare information across multiple sources"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Beginner",
    resources: [
      {
        id: "notebooklm-video-1",
        type: "video",
        title: "First Steps with NotebookLM",
        url: "https://www.youtube.com/embed/PV0oNcmIYII",
        duration: "12:30",
        thumbnail: "https://img.youtube.com/vi/PV0oNcmIYII/maxresdefault.jpg",
        provider: "youtube",
        description: "Discover in 12 minutes how your documents come to life: ask questions, get summaries, and verify every fact with exact citations."
      },
      {
        id: "notebooklm-guide-1",
        type: "pdf",
        title: "NotebookLM Guide",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/guia_edutechlife_modulo3%20.pdf",
        pages: 10,
        format: "PDF",
        size: "2.3 MB",
        description: "The ultimate guide to mastering NotebookLM: from your first notebook to advanced research techniques.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebooklm-ova-1",
        type: "ova_interactive",
        title: "Lab: Create Your Notebook",
        description: "7 questions that will make you a NotebookLM expert. Complete the challenge with Valerio as your personal guide.",
        estimatedTime: "15 minutes",
        difficulty: "Intermediate",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Source Curation and Document Synthesis": {
    title: "Source Curation and Document Synthesis",
    description: "Turn mountains of documents into summaries, FAQs, and executive reports with a single click.",
    learningObjectives: [
      "Generate automatic executive summaries",
      "Create FAQs based on your documents",
      "Connect answers to original sources",
      "Validate the accuracy of generated information"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Intermediate",
    resources: [
      {
        id: "notebook-summary-video-1",
        type: "image",
        title: "Smart Summaries with NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/3-INFOGRAFIA.jpeg",
        format: "JPEG",
        size: "2.5 MB",
        description: "Infographic on advanced summary and analysis techniques with NotebookLM.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebook-summary-template-1",
        type: "pdf",
        title: "Notebook LM cuaderno del futuro",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/6-%20NotebookLM_El_Cuaderno_del_Futuro.pdf",
        pages: 15,
        format: "PDF",
        size: "2.5 MB",
        description: "Professional summary templates for each document type: academic, business, technical, and more."
      },
      {
        id: "notebook-summary-ova-1",
        type: "ova_interactive",
        title: "Simulator: Document Analysis",
        description: "Practical simulator: take real documents and generate professional-level summaries in minutes.",
        estimatedTime: "20 minutes",
        difficulty: "Intermediate",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Audio Overviews and AI Document Management": {
    title: "Audio Overviews and AI Document Management",
    description: "Turn your notes into professional podcasts: two AI voices discuss your documents while you listen.",
    learningObjectives: [
      "Generate Audio Overviews from your notebooks",
      "Customize the audio style and tone",
      "Use audio for learning and review",
      "Share Audio Overviews with teams"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Advanced",
    resources: [
      {
        id: "notebook-audio-video-1",
        type: "video",
        title: "Create Your Own Podcast",
        url: "https://www.youtube.com/embed/Z3Wq8oum108",
        duration: "2:15",
        thumbnail: "https://img.youtube.com/vi/Z3Wq8oum108/maxresdefault.jpg",
        provider: "youtube",
        description: "Discover how to create podcasts from your PDFs. Ideal for learning while traveling, exercising, or resting."
      },
      {
        id: "notebook-audio-guide-1",
        type: "ova_interactive",
        title: "Notebook LM",
        description: "Complete NotebookLM course: 6 interactive modules with practical exercises and a final challenge. Become an expert.",
        estimatedTime: "30 minutes",
        difficulty: "Intermediate",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      },
      {
        id: "notebook-audio-ova-1",
        type: "ova_interactive",
        title: "Lab: Create Your AI Podcast",
        description: "Create your first AI podcast: choose the topic, customize the tone, and hear the result in minutes.",
        estimatedTime: "15 minutes",
        difficulty: "Advanced",
        interactiveElements: 3,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  // ============================================================================
  // MODULE 5: ETHICS AND PRIVACY
  // ============================================================================
  "Ethics in Artificial Intelligence": {
    title: "Ethics in Artificial Intelligence",
    description: "Learn to recognize and mitigate the inherent biases in generative AI models.",
    learningObjectives: [
      "Identify common types of AI biases",
      "Detect biases in generated responses",
      "Apply strategies to reduce biases",
      "Evaluate the fairness of AI results"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Intermediate",
    resources: [
      {
        id: "bias-video-1",
        type: "video",
        title: "AI Biases: Explanation and Examples",
        url: "https://www.youtube.com/embed/RDkOIf82v6A",
        duration: "12:15",
        thumbnail: "https://img.youtube.com/vi/RDkOIf82v6A/maxresdefault.jpg",
        provider: "youtube",
        description: "Discover how invisible biases affect every AI response and learn to detect them before they affect your work."
      },
      {
        id: "bias-guide-1",
        type: "pdf",
        title: "Bias Detection Guide",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/2-guia_edutechlife_modulo5.pdf",
        pages: 15,
        format: "PDF",
        size: "2.6 MB",
        description: "Learn the step-by-step method to identify, analyze, and correct biases in any AI system.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "bias-ova-1",
        type: "ova_interactive",
        title: "Lab: Detect the Bias",
        description: "Put your critical eye to the test: analyze real AI responses and identify hidden biases. Lab guided by Valerio.",
        estimatedTime: "15 minutes",
        difficulty: "Intermediate",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Algorithmic Biases and Fairness": {
    title: "Algorithmic Biases and Fairness",
    description: "Practical strategies to protect your personal and corporate data when using AI tools.",
    learningObjectives: [
      "Understand how AIs process your data",
      "Identify privacy risks",
      "Apply best protection practices",
      "Configure privacy options in AI tools"
    ],
    estimatedTime: "25 minutes",
    difficulty: "Intermediate",
    resources: [
      {
        id: "privacy-video-1",
        type: "video",
        title: "Privacy and AI: What You Need to Know",
        url: "https://www.youtube.com/embed/ADvjzvJjx5c",
        duration: "14:40",
        thumbnail: "https://img.youtube.com/vi/ADvjzvJjx5c/maxresdefault.jpg",
        provider: "youtube",
        description: "Everything you need to know to use AI without risking your personal data. Practical and direct guide."
      },
      {
        id: "privacy-guide-1",
        type: "pdf",
        title: "AI Privacy Manual",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/7-Ethical_AI_Mastery.pdf",
        pages: 20,
        format: "PDF",
        size: "3.8 MB",
        description: "Practical 7-step checklist to protect your privacy while making the most of artificial intelligence.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "privacy-ova-1",
        type: "ova_interactive",
        title: "Simulator: Risk Assessment",
        description: "Interactive simulator: face real risk scenarios and learn to protect your data. Includes ethical stars game.",
        estimatedTime: "20 minutes",
        difficulty: "Intermediate",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Privacy, Regulation, and Responsible AI": {
    title: "Privacy, Regulation, and Responsible AI",
    description: "Ethical framework for responsible AI use in education, work, and personal life.",
    learningObjectives: [
      "Apply ethical principles when using AI",
      "Recognize inappropriate uses of AI",
      "Promote transparency in AI use",
      "Develop responsible use policies"
    ],
    estimatedTime: "20 minutes",
    difficulty: "Advanced",
    resources: [
      {
        id: "ethics-video-1",
        type: "video",
        title: "Ethical AI: Principles and Practice",
        url: "https://www.youtube.com/embed/idplIgnLStI",
        duration: "16:25",
        thumbnail: "https://img.youtube.com/vi/idplIgnLStI/maxresdefault.jpg",
        provider: "youtube",
        description: "Learn the essential ethical principles for using AI responsibly. The guide every professional should know."
      },
      {
        id: "ethics-guide-1",
        type: "pdf",
        title: "Code of Ethics for AI Use",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/codigo_etica_ia_modulo5.pdf",
        pages: 18,
        format: "PDF",
        size: "3.2 MB",
        description: "Complete ethical framework with practical cases.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "ethics-ova-1",
        type: "ova_interactive",
        title: "Lab: Ethical Dilemmas",
        description: "Solve real ethical dilemmas related to AI use.",
        estimatedTime: "25 minutes",
        difficulty: "Advanced",
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
const getResources = (locale = 'es') => {
  return locale === 'en' ? RESOURCES_EN : RESOURCES_ES;
};

// Obtener recursos para un tema específico
export const getResourcesForTopic = (topicTitle, locale = 'es') => {
  const resources = getResources(locale);
  return resources[topicTitle] || null;
};

// Obtener todos los tipos de recursos disponibles en un tema
export const getResourceTypesForTopic = (topicTitle, locale = 'es') => {
  const resources = getResources(locale);
  const topic = resources[topicTitle];
  if (!topic) return [];

  const types = new Set();
  topic.resources.forEach(resource => types.add(resource.type));
  return Array.from(types);
};

// Contar recursos por tipo
export const countResourcesByType = (topicTitle, locale = 'es') => {
  const resources = getResources(locale);
  const topic = resources[topicTitle];
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

// Default export for backward compatibility (Spanish)
export const moduleResources = RESOURCES_ES;
export default moduleResources;
