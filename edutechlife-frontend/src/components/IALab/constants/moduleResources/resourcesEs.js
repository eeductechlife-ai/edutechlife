const RESOURCES_ES = {
  // MÓDULO 1: INGENIERÍA DE PROMPTS
  "Introducción a la Inteligencia Artificial Generativa": {
    title: "De Cero a Experto en IA",
    description:
      "Descubre cómo la IA generativa está transformando la educación, los negocios y la vida diaria. Aprende desde cero qué es, cómo funciona y por qué es la habilidad más demandada del momento.",
    learningObjectives: [
      "Comprender qué es la IA Generativa y cómo funciona",
      "Diferenciar entre IA débil (narrow) y IA fuerte (general)",
      "Identificar aplicaciones prácticas en educación y negocios",
      "Reconocer los límites éticos y técnicos actuales",
    ],
    estimatedTime: "16 minutos",
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
        description:
          "Aprende en solo 6 minutos cómo construir prompts que la IA entiende a la primera. Con ejemplos visuales claros.",
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Comienzos de la Inteligencia Artificial",
        description:
          "Explora los orígenes de la inteligencia artificial con 5 actividades interactivas que te llevarán desde Alan Turing hasta ChatGPT.",
        estimatedTime: "10 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "¿Qué es un Prompt?": {
    title: "El Arte de Dar Instrucciones a la IA",
    description:
      "Domina el arte de comunicarte con la IA: aprende a escribir instrucciones claras que te den respuestas precisas y útiles en segundos.",
    learningObjectives: [
      "Comprender qué es un prompt y cómo usarlo para comunicarte efectivamente con la IA",
    ],
    estimatedTime: "15 minutos",
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
        description:
          "Entiende la IA generativa con ejemplos visuales y prácticos que puedes aplicar desde hoy.",
      },
      {
        id: "prompt-guide-1",
        type: "pdf",
        title: "Guía: Anatomía de un Prompt",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/recursos-edutechlife/guia_edutechlife_modulo1.pdf",
        pages: 12,
        format: "PDF",
        size: "249 KB",
        description:
          "Tu manual de referencia con técnicas comprobadas y ejemplos listos para copiar y pegar.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "prompt-ova-html-1",
        type: "ova_interactive",
        title: "Cómo comunicarte con la IA (prompts)",
        description:
          "Pon en práctica lo aprendido: escribe tus propios prompts y recibe feedback inmediato. Laboratorio guiado por Valerio.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 2: POTENCIA CHATGPT
  // ============================================================================
  "Guía Completa de ChatGPT": {
    title: "Guía Completa de ChatGPT",
    description:
      "Todo lo que necesitas para dominar ChatGPT en un solo lugar: desde lo básico hasta técnicas que te harán destacar.",
    learningObjectives: [
      "Navegar eficientemente por la interfaz de ChatGPT",
      "Configurar conversaciones para diferentes propósitos",
      "Aplicar técnicas de prompt engineering específicas para ChatGPT",
      "Identificar las limitaciones y mejores usos de ChatGPT",
    ],
    estimatedTime: "26 minutos",
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
        description:
          "Aprende a usar ChatGPT como un profesional desde el primer minuto, incluso si nunca lo has abierto.",
      },
      {
        id: "chatgpt-guide-modulo2",
        type: "pdf",
        title: "Guía Completa de ChatGPT",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/Las-Herramientas-Integradas-de-ChatGPT.pdf/guia_edutechlife_modulo2.pdf",
        pages: 12,
        format: "PDF",
        size: "4.2 MB",
        description:
          "Tu guía definitiva de ChatGPT: tips, trucos y ejemplos prácticos organizados para consulta rápida.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "chatgpt-ova-ecosystem",
        type: "ova_interactive",
        title: "Explora el Ecosistema ChatGPT",
        description:
          "Viaje interactivo por el universo ChatGPT: descubre cada herramienta, aprende a combinarlas y conviértete en un usuario avanzado.",
        estimatedTime: "20 minutos",
        difficulty: "Principiante",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Plantillas de Flujos de Trabajo": {
    title: "Plantillas de Flujos de Trabajo",
    description:
      "Aprende a usar las 5 herramientas ocultas de ChatGPT que multiplicarán tu productividad. Automatiza tareas en minutos.",
    learningObjectives: [
      "Identificar las 5 herramientas clave del ecosistema ChatGPT",
      "Seleccionar la herramienta correcta según el tipo de tarea",
      "Combinar múltiples herramientas en flujos de trabajo eficientes",
      "Resolver escenarios reales usando las herramientas integradas",
    ],
    estimatedTime: "25 minutos",
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
        description:
          "Descubre cómo Búsqueda Web, Análisis de Datos, DALL-E 3 y Canvas trabajan juntos para resolver problemas complejos.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "workflow-ova-herramientas",
        type: "ova_interactive",
        title: "Laboratorio: Herramientas ChatGPT",
        description:
          "Explora cada herramienta de ChatGPT con ejercicios prácticos y audio guiado. Completa el desafío para demostrar tu dominio.",
        estimatedTime: "25 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Function Calling y APIs de OpenAI": {
    title: "Function Calling y APIs de OpenAI",
    description:
      "Crea tu propio asistente IA a medida. Aprende a construir GPTs que trabajan para ti mientras tú te enfocas en lo importante.",
    learningObjectives: [
      "Crear GPTs personalizados para necesidades específicas",
      "Configurar acciones para conectar con APIs externas",
      "Compartir y utilizar GPTs de la comunidad",
      "Evaluar cuándo usar un GPT personalizado vs ChatGPT estándar",
    ],
    estimatedTime: "25 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "gpts-guide-1",
        type: "image",
        title: "Guía de GPTs y Acciones",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%20de%20aplicaciones/WhatsApp%20Image%202026-05-07%20at%2020.35.40.jpeg",
        format: "JPEG",
        size: "2.1 MB",
        description:
          "Guía visual rápida para crear, configurar y publicar tu primer GPT personalizado.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "gpts-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Construye un GPT",
        description:
          "Manos a la obra: crea un GPT desde cero con ejercicios guiados y retroalimentación en cada paso.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 3: DOMINA GEMINI
  // ============================================================================
  "Introducción a Google Gemini": {
    title: "Introducción a Google Gemini",
    description:
      "Conoce Gemini, la IA de Google que entiende texto, imágenes, audio y video al mismo tiempo. Un solo asistente para todo.",
    learningObjectives: [
      "Comprender las capacidades multimodales de Gemini",
      "Utilizar Gemini con diferentes tipos de entrada",
      "Comparar Gemini con otros modelos de IA",
      "Aplicar Gemini en contextos creativos y analíticos",
    ],
    estimatedTime: "29 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "gemini-video-1",
        type: "video",
        title: "Aprende de Gemini",
        url: "https://www.youtube.com/embed/Y5-5dI3Iero",
        duration: "14:10",
        thumbnail: "https://img.youtube.com/vi/Y5-5dI3Iero/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Descubre todo lo que Gemini puede hacer: desde analizar imágenes hasta escribir código. La demo completa en un video claro y didáctico.",
      },
      {
        id: "gemini-guide-1",
        type: "pdf",
        title: "Introducción a Gemini",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/2-%20guia_edutechlife_modulo3_gemini.pdf",
        pages: 11,
        format: "PDF",
        size: "2.8 MB",
        description:
          "Tu guía esencial de Gemini: aprende a usarlo para estudiar, trabajar y crear contenido de forma más inteligente.",
        thumbnailType: "premium",
        immersiveView: true,
      },
    ],
  },

  "Razonamiento Multimodal y Grounding": {
    title: "Razonamiento Multimodal y Grounding",
    description:
      "Lleva Gemini a donde trabajas: aprende a usarlo dentro de Google Docs, Sheets y Gmail para multiplicar tu velocidad.",
    learningObjectives: [
      "Usar Gemini dentro de Google Docs para redacción",
      "Analizar datos con Gemini en Google Sheets",
      "Gestionar correos electrónicos con Gemini en Gmail",
      "Crear presentaciones asistidas por Gemini",
    ],
    estimatedTime: "40 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "workspace-template-1",
        type: "pdf",
        title: "Gemini a la Práctica",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/3%20Gemini_Research_Mastery.pdf",
        pages: 10,
        format: "PDF",
        size: "3.2 MB",
        description:
          "Domina Gemini con ejercicios prácticos y casos de aplicación real para potenciar tu productividad.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "workspace-ova-1",
        type: "ova_interactive",
        title: "Gemini: Recorrido Interactivo",
        description:
          "Explora la arquitectura de Gemini, su capacidad multimodal, Deep Research y la integración con Google Workspace en un recorrido interactivo con audio y quiz final.",
        estimatedTime: "25 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Deep Research y Fact-Checking con IA": {
    title: "Deep Research y Fact-Checking con IA",
    description:
      "Descubre cómo profesionales de diferentes industrias están usando Gemini para destacar. Casos reales y resultados comprobados.",
    learningObjectives: [
      "Aplicar Gemini en estrategias de marketing",
      "Usar Gemini para asistencia en programación",
      "Implementar Gemini en procesos educativos",
      "Leverage Gemini para investigación académica",
    ],
    estimatedTime: "42 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "gemini-cases-video-1",
        type: "video",
        title: "Gemini en Acción: Casos Reales",
        url: "https://www.youtube.com/embed/XAshixrvG5k",
        duration: "2:41",
        thumbnail: "https://img.youtube.com/vi/XAshixrvG5k/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Empresas y profesionales comparten cómo Gemini transformó su forma de trabajar. Resultados que inspiran.",
      },
      {
        id: "gemini-cases-guide-1",
        type: "image",
        title: "Domina el Ecosistema de Gemini",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/3-infografia.png",
        format: "PNG",
        size: "1.2 MB",
        description:
          "Infografía completa del ecosistema Gemini: herramientas, capacidades y casos de uso en un vistazo.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Casos Prácticos",
        description:
          "Enfréntate a 6 desafíos del mundo real y resuélvelos usando Gemini como tu asistente experto.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 4: NOTEBOOKLM
  // ============================================================================
  "¿Qué es NotebookLM y para qué sirve?": {
    title: "¿Qué es NotebookLM y para qué sirve?",
    description:
      "La herramienta secreta de Google para investigadores: sube tus PDFs y obtén respuestas precisas con citas textuales. Sin inventos.",
    learningObjectives: [
      "Crear notebooks con fuentes personalizadas",
      "Hacer preguntas específicas sobre tus documentos",
      "Generar resúmenes inteligentes de contenido",
      "Comparar información entre múltiples fuentes",
    ],
    estimatedTime: "28 minutos",
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
        description:
          "Descubre en 12 minutos cómo tus documentos cobran vida: haz preguntas, obtén resúmenes y verifica cada dato con citas exactas.",
      },
      {
        id: "notebooklm-guide-1",
        type: "pdf",
        title: "Guía de NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/guia_edutechlife_modulo3%20.pdf",
        pages: 10,
        format: "PDF",
        size: "2.3 MB",
        description:
          "La guía definitiva para dominar NotebookLM: desde tu primer cuaderno hasta técnicas avanzadas de investigación.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "notebooklm-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Crea tu Notebook",
        description:
          "7 preguntas que te convertirán en experto en NotebookLM. Completa el desafío con Valerio como tu guía personal.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Curaduría de Fuentes y Síntesis de Documentos": {
    title: "Curaduría de Fuentes y Síntesis de Documentos",
    description:
      "Convierte montañas de documentos en resúmenes, preguntas frecuentes y reportes ejecutivos con un solo clic.",
    learningObjectives: [
      "Generar resúmenes ejecutivos automáticos",
      "Crear FAQs basadas en tus documentos",
      "Conectar respuestas a fuentes originales",
      "Validar la precisión de la información generada",
    ],
    estimatedTime: "20 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "notebook-summary-video-1",
        type: "image",
        title: "Resúmenes Inteligentes con NotebookLM",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/3-INFOGRAFIA.jpeg",
        format: "JPEG",
        size: "2.5 MB",
        description:
          "Infografía sobre técnicas avanzadas de resumen y análisis con NotebookLM.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "notebook-summary-template-1",
        type: "pdf",
        title: "Notebook LM cuaderno del futuro",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/guia%204%20nootbook%20lm/6-%20NotebookLM_El_Cuaderno_del_Futuro.pdf",
        pages: 15,
        format: "PDF",
        size: "2.5 MB",
        description:
          "Plantillas profesionales de resumen para cada tipo de documento: académico, empresarial, técnico y más.",
      },
      {
        id: "notebook-summary-ova-1",
        type: "ova_interactive",
        title: "Simulador: Análisis de Documentos",
        description:
          "Simulador práctico: toma documentos reales y genera resúmenes de nivel profesional en minutos.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Audio Overviews y Gestión Documental con IA": {
    title: "Audio Overviews y Gestión Documental con IA",
    description:
      "Convierte tus apuntes en podcasts profesionales: dos voces IA conversan sobre tus documentos mientras tú escuchas.",
    learningObjectives: [
      "Generar Audio Overviews de tus notebooks",
      "Personalizar el estilo y tono del audio",
      "Usar audio para aprendizaje y repaso",
      "Compartir Audio Overviews con equipos",
    ],
    estimatedTime: "47 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "notebook-audio-video-1",
        type: "video",
        title: "Crea tu propio podcast",
        url: "https://www.youtube.com/embed/JdiLO6z9oXY",
        duration: "2:16",
        thumbnail: "https://img.youtube.com/vi/JdiLO6z9oXY/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Descubre cómo crear podcasts a partir de tus PDFs. Ideal para aprender mientras viajas, haces ejercicio o descansas.",
      },
      {
        id: "notebook-audio-guide-1",
        type: "ova_interactive",
        title: "Notebook LM",
        description:
          "Curso completo de NotebookLM: 6 módulos interactivos con ejercicios prácticos y un desafío final. Conviértete en un experto.",
        estimatedTime: "30 minutos",
        difficulty: "Intermedio",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true,
      },
      {
        id: "notebook-audio-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Crea tu Podcast IA",
        description:
          "Crea tu primer podcast IA: elige el tema, personaliza el tono y escucha el resultado en minutos.",
        estimatedTime: "15 minutos",
        difficulty: "Avanzado",
        interactiveElements: 3,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 5: ÉTICA Y PRIVACIDAD
  // ============================================================================
  "Ética en la Inteligencia Artificial": {
    title: "Ética en la Inteligencia Artificial",
    description:
      "Aprende a reconocer y mitigar los sesgos inherentes en los modelos de IA generativa.",
    learningObjectives: [
      "Identificar tipos comunes de sesgos en IA",
      "Detectar sesgos en respuestas generadas",
      "Aplicar estrategias para reducir sesgos",
      "Evaluar la equidad de resultados de IA",
    ],
    estimatedTime: "17 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "bias-video-1",
        type: "video",
        title: "Los Pilares de la I.A",
        url: "https://www.youtube.com/embed/QAyIrImVUx8",
        duration: "1:56",
        thumbnail: "https://img.youtube.com/vi/QAyIrImVUx8/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Descubre cómo los sesgos invisibles afectan cada respuesta de IA y aprende a detectarlos antes de que afecten tu trabajo.",
      },
      {
        id: "bias-guide-1",
        type: "pdf",
        title: "Etica de la Inteligencia artificial",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/2-guia_edutechlife_modulo5.pdf",
        pages: 9,
        format: "PDF",
        size: "2.6 MB",
        description:
          "Aprende el método paso a paso para identificar, analizar y corregir sesgos en cualquier sistema de IA.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "bias-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Detecta el Sesgo",
        description:
          "Pon a prueba tu ojo crítico: analiza respuestas de IA reales e identifica los sesgos ocultos. Laboratorio guiado por Valerio.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Sesgos Algorítmicos y Equidad": {
    title: "Sesgos Algorítmicos y Equidad",
    description:
      "Estrategias prácticas para proteger tus datos personales y corporativos al usar herramientas de IA.",
    learningObjectives: [
      "Comprender cómo las IA procesan tus datos",
      "Identificar riesgos de privacidad",
      "Aplicar mejores prácticas de protección",
      "Configurar opciones de privacidad en herramientas de IA",
    ],
    estimatedTime: "29 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "privacy-video-1",
        type: "video",
        title: "Privacidad y IA: Lo que Debes Saber",
        url: "https://www.youtube.com/embed/ADvjzvJjx5c",
        duration: "9:20",
        thumbnail: "https://img.youtube.com/vi/ADvjzvJjx5c/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Todo lo que necesitas saber para usar la IA sin poner en riesgo tus datos personales. Guía práctica y directa.",
      },
      {
        id: "privacy-guide-1",
        type: "pdf",
        title: "Manual de Privacidad en IA",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%205/7-Ethical_AI_Mastery.pdf",
        pages: 13,
        format: "PDF",
        size: "3.8 MB",
        description:
          "Checklist práctico de 7 pasos para blindar tu privacidad mientras aprovechas al máximo la inteligencia artificial.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "privacy-ova-1",
        type: "ova_interactive",
        title: "Simulador: Evaluación de Riesgos",
        description:
          "Simulador interactivo: enfréntate a escenarios reales de riesgo y aprende a proteger tus datos. Incluye juego de estrellas éticas.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Privacidad, Regulación y IA Responsable": {
    title: "Privacidad, Regulación y IA Responsable",
    description:
      "Marco ético para el uso responsable de IA en educación, trabajo y vida personal.",
    learningObjectives: [
      "Aplicar principios éticos al usar IA",
      "Reconocer usos inapropiados de IA",
      "Promover transparencia en el uso de IA",
      "Desarrollar políticas de uso responsable",
    ],
    estimatedTime: "31 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "ethics-video-1",
        type: "video",
        title: "IA Ética: Principios y Práctica",
        url: "https://www.youtube.com/embed/idplIgnLStI",
        duration: "6:05",
        thumbnail: "https://img.youtube.com/vi/idplIgnLStI/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Aprende los principios éticos esenciales para usar la IA con responsabilidad. La guía que todo profesional debe conocer.",
      },
      {
        id: "ethics-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: dilemas Éticos",
        description:
          "Resuelve dilemas éticos reales relacionados con el uso de IA.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },
};

export { RESOURCES_ES };
