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
    title: "Fundamentos de IA Generativa",
    description: "Conceptos básicos, historia y aplicaciones prácticas de la inteligencia artificial generativa en el mundo moderno.",
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
        title: "Explicación Visual: Anatomía de un Prompt",
        url: "https://www.youtube.com/embed/6f-FwOE5wIY",
        duration: "6:06",
        thumbnail: "https://img.youtube.com/vi/6f-FwOE5wIY/maxresdefault.jpg",
        provider: "youtube",
        description: "Desglose visual de las partes que componen un prompt efectivo."
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Comienzos de la IA",
        description: "OVA completo con 5 secciones interactivas y simulador integrado.",
        estimatedTime: "10 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "¿Qué es un Prompt?": {
    title: "Dominando los Prompts",
    description: "Un prompt es la instrucción o mensaje que le damos a la IA para que realice una tarea específica. Es la clave para comunicarnos efectivamente con modelos como ChatGPT y obtener resultados precisos. Explora los recursos disponibles para aprender a dominarlos.",
    learningObjectives: [
      "Comprender qué es un prompt y cómo usarlo para comunicarte efectivamente con la IA"
    ],
    estimatedTime: "20 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "prompt-video-1",
        type: "video",
        title: "Video Introductorio: ¿Qué es la IA Generativa?",
        url: "https://www.youtube.com/embed/jnePzCTKEqs?start=3",
        duration: "4:30",
        thumbnail: "https://img.youtube.com/vi/jnePzCTKEqs/maxresdefault.jpg",
        provider: "youtube",
        description: "Explicación visual de los conceptos fundamentales con ejemplos prácticos."
      },
      {
        id: "prompt-guide-1",
        type: "pdf",
        title: "Guía: Anatomía de un Prompt",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 12,
        format: "PDF",
        size: "249 KB",
        description: "Documento completo con estructura detallada de prompts efectivos, técnicas avanzadas y ejemplos prácticos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "prompt-ova-html-1",
        type: "ova_interactive",
        title: "Aprendamos qué es un Prompt",
        description: "Infografía interactiva sobre cómo comunicarte con la IA mediante prompts efectivos.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true
      }
    ]
  },

  "Estructura Básica de un Prompt Efectivo": {
    title: "Arquitectura de Prompts",
    description: "Patrones y estructuras probadas para crear prompts que generen respuestas precisas y útiles.",
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
        title: "Tutorial: Construyendo Prompts Paso a Paso",
        url: "https://www.youtube.com/embed/8XxSC2L6QoE",
        duration: "9:45",
        thumbnail: "https://img.youtube.com/vi/8XxSC2L6QoE/maxresdefault.jpg",
        provider: "youtube",
        description: "Demostración práctica de construcción de prompts complejos."
      },
      {
        id: "structure-template-1",
        type: "document",
        title: "Plantillas de Estructura Avanzada (JSON)",
        url: "/templates/advanced-prompt-templates.json",
        format: "JSON",
        size: "3.2 MB",
        description: "15 plantillas JSON listas para usar en diferentes escenarios."
      },
      {
        id: "structure-case-1",
        type: "document",
        title: "Case Study: Prompt para Análisis de Datos",
        url: "/case-studies/data-analysis-prompt-case.pdf",
        pages: 8,
        format: "PDF",
        size: "2.1 MB",
        description: "Análisis detallado de un prompt real para análisis de datasets."
      }
    ]
  },

  // ============================================================================
  // MÓDULO 2: POTENCIA CHATGPT
  // ============================================================================
  "Guía Completa de ChatGPT": {
    title: "Guía Completa de ChatGPT",
    description: "Recurso integral de Edutechlife que cubre todos los aspectos de ChatGPT: desde la interfaz básica hasta técnicas avanzadas de prompt engineering y automatización.",
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
        title: "Tutorial: Primeros Pasos con ChatGPT",
        url: "https://www.youtube.com/embed/iOlo-K7yj2M",
        duration: "5:43",
        thumbnail: "https://img.youtube.com/vi/iOlo-K7yj2M/maxresdefault.jpg",
        provider: "youtube",
        description: "Guía completa para comenzar a usar ChatGPT de manera efectiva."
      },
      {
        id: "chatgpt-guide-modulo2",
        type: "pdf",
        title: "Guía Completa de ChatGPT",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/Las-Herramientas-Integradas-de-ChatGPT.pdf/guia_edutechlife_modulo2.pdf",
        pages: 25,
        format: "PDF",
        size: "4.2 MB",
        description: "Guía oficial de Edutechlife - Módulo 2: Las Herramientas Integradas de ChatGPT. Manual completo con tips, trucos y mejores prácticas.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "chatgpt-ova-ecosystem",
        type: "ova_interactive",
        title: "Dominando el Ecosistema ChatGPT",
        description: "Guía interactiva completa: evolución de modelos GPT, modos de operación, herramientas integradas, automatización y el arte del prompt estratégico.",
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
    description: "Descubre las herramientas integradas de ChatGPT y aprende a crear flujos de trabajo automatizados que potencien tu productividad profesional y académica.",
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
        description: "Guía completa de las herramientas integradas de ChatGPT: Búsqueda Web, Intérprete de Código, DALL-E 3, Canvas y Proyectos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "workflow-ova-herramientas",
        type: "ova_interactive",
        title: "Domina las Herramientas ChatGPT",
        description: "Explora interactivamente cada herramienta de ChatGPT, escucha explicaciones en audio y completa un desafío práctico con escenarios reales.",
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
    description: "Descubre cómo crear y usar GPTs personalizados y acciones para automatizar tareas complejas.",
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
        title: "Tutorial: Creando tu Primer GPT",
        url: "https://www.youtube.com/embed/VkZ0VKR3Oe8",
        duration: "18:45",
        thumbnail: "https://img.youtube.com/vi/VkZ0VKR3Oe8/maxresdefault.jpg",
        provider: "youtube",
        description: "Paso a paso para crear un GPT personalizado funcional."
      },
      {
        id: "gpts-guide-1",
        type: "image",
        title: "Guía de GPTs y Acciones",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%20de%20aplicaciones/WhatsApp%20Image%202026-05-07%20at%2020.35.40.jpeg",
        format: "JPEG",
        size: "2.1 MB",
        description: "Guía visual sobre GPTs, acciones y automatizaciones.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gpts-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Construye un GPT",
        description: "Práctica guiada para crear un GPT especializado en tu área.",
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
    description: "Conoce Gemini, la IA multimodal de Google capaz de procesar texto, imágenes, audio y video simultáneamente.",
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
        title: "Introducción a Gemini",
        url: "https://www.youtube.com/embed/XV-2xnFMJqI",
        duration: "14:10",
        thumbnail: "https://img.youtube.com/vi/XV-2xnFMJqI/maxresdefault.jpg",
        provider: "youtube",
        description: "Visión general de las capacidades multimodales de Gemini."
      },
      {
        id: "gemini-guide-1",
        type: "pdf",
        title: "Manual de Gemini",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 16,
        format: "PDF",
        size: "2.8 MB",
        description: "Guía completa para aprovechar Gemini en diferentes contextos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-ova-1",
        type: "ova",
        title: "Laboratorio: Experimenta con Multimodalidad",
        description: "Práctica con entradas de texto, imagen y audio en Gemini.",
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
    description: "Aprende a integrar Gemini en Google Docs, Sheets, Gmail y otras herramientas de Workspace.",
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
        title: "Gemini + Google Workspace: Tutorial Completo",
        url: "https://www.youtube.com/embed/0pQKzGzZjZ0",
        duration: "20:15",
        thumbnail: "https://img.youtube.com/vi/0pQKzGzZjZ0/maxresdefault.jpg",
        provider: "youtube",
        description: "Integración completa de Gemini en el ecosistema Google."
      },
      {
        id: "workspace-template-1",
        type: "document",
        title: "Plantillas para Google Workspace",
        url: "/templates/gemini-workspace-templates.json",
        format: "JSON",
        size: "2.1 MB",
        description: "Prompts optimizados para cada herramienta de Workspace."
      },
      {
        id: "workspace-ova-1",
        type: "ova",
        title: "Simulador: Workspace con Gemini",
        description: "Práctica interactiva con las integraciones de Gemini.",
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
    description: "Casos reales de uso profesional de Gemini en marketing, programación, educación e investigación.",
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
        title: "Casos de Éxito con Gemini",
        url: "https://www.youtube.com/embed/1pG8VvJGQgE",
        duration: "16:30",
        thumbnail: "https://img.youtube.com/vi/1pG8VvJGQgE/maxresdefault.jpg",
        provider: "youtube",
        description: "Testimonios y demostraciones de uso profesional."
      },
      {
        id: "gemini-cases-guide-1",
        type: "pdf",
        title: "Guía de Casos de Uso",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 24,
        format: "PDF",
        size: "5.1 MB",
        description: "20 casos de uso detallados con prompts incluidos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova",
        title: "Laboratorio: Casos Prácticos",
        description: "Resuelve problemas reales usando Gemini como asistente.",
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
    description: "Descubre NotebookLM, la herramienta de Google para investigación asistida por IA con fuentes personalizadas.",
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
        url: "https://www.youtube.com/embed/3eGqDMhqjEY",
        duration: "11:45",
        thumbnail: "https://img.youtube.com/vi/3eGqDMhqjEY/maxresdefault.jpg",
        provider: "youtube",
        description: "Introducción práctica a NotebookLM."
      },
      {
        id: "notebooklm-guide-1",
        type: "pdf",
        title: "Guía de NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 14,
        format: "PDF",
        size: "2.3 MB",
        description: "Manual completo para investigadores y estudiantes.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebooklm-ova-1",
        type: "ova",
        title: "Laboratorio: Crea tu Notebook",
        description: "Práctica guiada creando un notebook con tus propias fuentes.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 4,
        thumbnailType: "premium",
        fullscreen: true
      }
    ]
  },

  "Curaduría de Fuentes y Síntesis de Documentos": {
    title: "Curaduría de Fuentes y Síntesis de Documentos",
    description: "Aprende a generar resúmenes, FAQ y briefings conectados a tus fuentes originales.",
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
        type: "video",
        title: "Resúmenes Inteligentes con NotebookLM",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "3:33",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        provider: "youtube",
        description: "Técnicas avanzadas de resumen y análisis."
      },
      {
        id: "notebook-summary-template-1",
        type: "document",
        title: "Plantillas de Resumen",
        url: "/templates/notebooklm-summary-templates.json",
        format: "JSON",
        size: "1.5 MB",
        description: "Estructuras de resumen predefinidas para diferentes contextos."
      },
      {
        id: "notebook-summary-ova-1",
        type: "ova",
        title: "Simulador: Análisis de Documentos",
        description: "Practica generando resúmenes de documentos complejos.",
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
    description: "Explora la función de Audio Overview que convierte tus notas en conversaciones de podcast generadas por IA.",
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
        url: "https://www.youtube.com/embed/gFjVXUJnGfE",
        duration: "10:50",
        thumbnail: "https://img.youtube.com/vi/gFjVXUJnGfE/maxresdefault.jpg",
        provider: "youtube",
        description: "Cómo transformar documentos en conversaciones de audio."
      },
      {
        id: "notebook-audio-guide-1",
        type: "pdf",
        title: "Guía de Audio Overview",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 10,
        format: "PDF",
        size: "1.8 MB",
        description: "Mejores prácticas para Audio Overviews efectivos.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "notebook-audio-ova-1",
        type: "ova",
        title: "Laboratorio: Crea tu Podcast IA",
        description: "Genera y personaliza tu primer Audio Overview.",
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
        url: "https://www.youtube.com/embed/59bV1ZcgB0Q",
        duration: "12:15",
        thumbnail: "https://img.youtube.com/vi/59bV1ZcgB0Q/maxresdefault.jpg",
        provider: "youtube",
        description: "Análisis detallado de cómo los sesgos afectan las respuestas de IA."
      },
      {
        id: "bias-guide-1",
        type: "pdf",
        title: "Guía de Detección de Sesgos",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 15,
        format: "PDF",
        size: "2.6 MB",
        description: "Framework para identificar y corregir sesgos en IA.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "bias-ova-1",
        type: "ova",
        title: "Laboratorio: Detecta el Sesgo",
        description: "Ejercicios interactivos para identificar sesgos en respuestas de IA.",
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
        url: "https://www.youtube.com/embed/8XxSC2L6QoE",
        duration: "14:40",
        thumbnail: "https://img.youtube.com/vi/8XxSC2L6QoE/maxresdefault.jpg",
        provider: "youtube",
        description: "Guía completa sobre privacidad en el uso de IA."
      },
      {
        id: "privacy-guide-1",
        type: "pdf",
        title: "Manual de Privacidad en IA",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 20,
        format: "PDF",
        size: "3.8 MB",
        description: "Protocolos y checklists de seguridad para uso de IA.",
        thumbnailType: "premium",
        immersiveView: true
      },
      {
        id: "privacy-ova-1",
        type: "ova",
        title: "Simulador: Evaluación de Riesgos",
        description: "Evalúa escenarios reales de riesgo de privacidad con IA.",
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
        url: "https://www.youtube.com/embed/jnePzVXUJnG",
        duration: "16:25",
        thumbnail: "https://img.youtube.com/vi/jnePzVXUJnG/maxresdefault.jpg",
        provider: "youtube",
        description: "Fundamentos de ética aplicada a la IA generativa."
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

// Formatear duración para display
export const formatDuration = (duration) => {
  if (!duration) return "Duración no especificada";
  return `⏱️ ${duration}`;
};

// Formatear tamaño para display
export const formatFileSize = (size) => {
  if (!size) return "Tamaño no especificado";
  return `📦 ${size}`;
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

export const getResourceColor = (type) => {
  const colors = {
    video: "text-[#004B63]",
    documento: "text-[#004B63]",
    pdf: "text-[#004B63]",
    ova: "text-[#004B63]",
    imagen: "text-[#004B63]",
    interactivo: "text-[#004B63]",
    document: "text-[#004B63]",
    "pdf-thumbnail": "text-[#004B63]",
    "ova-thumbnail": "text-[#004B63]",
    image: "text-[#004B63]",
    interactive: "text-[#004B63]"
  };
  return colors[type] || "text-slate-500";
};

export default moduleResources;