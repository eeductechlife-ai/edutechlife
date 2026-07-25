const RESOURCES_ES = {
  // MÓDULO 1: EL ARTESANO DIGITAL — INGENIERÍA DE PROMPTS
  "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?": {
    title: "Los Fundamentos del Artesano: ¿Qué es la IA Generativa?",
    description:
      "Todo artesano conoce su material prima. Descubre qué es la IA Generativa, cómo funciona y por qué dominarla es la herramienta más valiosa en el taller del artesano digital.",
    learningObjectives: [
      "Comprender qué es la IA Generativa y cómo funciona — la materia prima del artesano",
      "Diferenciar entre IA débil (narrow) y IA fuerte (general) como un maestro distingue sus herramientas",
      "Identificar aplicaciones prácticas en educación y negocios para saber dónde aplicar tu oficio",
      "Reconocer los límites éticos y técnicos actuales — todo artesano conoce el alcance de sus herramientas",
    ],
    estimatedTime: "16 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "intro-video-1",
        type: "video",
        title: "Qué es la I.A y como esta cambiando el mundo",
        url: "https://www.youtube.com/embed/Gq6qG_oK6HY",
        duration: "6:11",
        thumbnail: "https://img.youtube.com/vi/Gq6qG_oK6HY/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Descubre qué es la inteligencia artificial, cómo funciona y el impacto que está teniendo en el mundo actual. La introducción perfecta para tu taller de artesano digital.",
      },
      {
        id: "intro-ova-1",
        type: "ova_interactive",
        title: "Comienzos de la Inteligencia Artificial",
        description:
          "Explora los orígenes de la inteligencia artificial con 5 actividades interactivas que te llevarán desde Alan Turing hasta ChatGPT. Como conocer la historia de tu oficio antes de tomar las herramientas.",
        estimatedTime: "10 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "El Cincel del Artesano: ¿Qué es un Prompt?": {
    title: "El Cincel del Artesano: ¿Qué es un Prompt?",
    description:
      "El cincel es la herramienta más básica del escultor — y también la más importante. Domina el arte de escribir instrucciones precisas que la IA entiende a la perfección.",
    learningObjectives: [
      "Comprender qué es un prompt y cómo usarlo como la herramienta principal del artesano digital",
      "Dominar la anatomía de una instrucción: contexto, intención, formato y restricciones",
      "Practicar el arte de la claridad — menos ambigüedad, más precisión, mejores resultados",
    ],
    estimatedTime: "15 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "prompt-video-1",
        type: "video",
        title: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
        url: "https://www.youtube.com/embed/kvQkEIuuFbU",
        duration: "4:34",
        thumbnail: "https://img.youtube.com/vi/kvQkEIuuFbU/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Aprende la fórmula definitiva para crear prompts efectivos y dominar la inteligencia artificial. Como un maestro artesano compartiendo sus secretos de taller.",
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
          "Tu manual de referencia del artesano: técnicas comprobadas, ejemplos listos para usar y secretos del oficio que transformarán tu forma de trabajar con IA.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "prompt-ova-html-1",
        type: "ova_interactive",
        title: "Cómo comunicarte con la IA (prompts)",
        description:
          "Pon en práctica lo aprendido: esculpe tus propios prompts y recibe feedback inmediato. El taller del artesano donde cada práctica te acerca a la maestría.",
        estimatedTime: "10 minutos",
        difficulty: "Principiante",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 2: EL ARQUITECTO DE AUTOMATIZACIÓN — POTENCIA CHATGPT
  // ============================================================================
  "Los Planos del Arquitecto: Guía Completa de ChatGPT": {
    title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
    description:
      "Todo gran edificio comienza con un plano maestro. Conoce la arquitectura completa de ChatGPT: modelos, interfaz, técnicas de prompt engineering y las mejores prácticas del oficio de arquitecto digital.",
    learningObjectives: [
      "Navegar la interfaz de ChatGPT como un arquitecto conoce su estudio",
      "Configurar conversaciones como planos detallados para cada propósito",
      "Aplicar técnicas de prompt engineering como herramientas de construcción profesional",
      "Seleccionar el modelo óptimo como un arquitecto elige el material correcto para cada obra",
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
          "Aprende a usar ChatGPT como un arquitecto usa sus planos: desde el primer trazo hasta la obra terminada, incluso si nunca lo has abierto antes.",
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
          "El manual del arquitecto: tips, trucos y ejemplos prácticos organizados para construir cualquier proyecto con ChatGPT. Consulta rápida para profesionales de la construcción digital.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "chatgpt-ova-ecosystem",
        type: "ova_interactive",
        title: "Explora el Ecosistema ChatGPT",
        description:
          "Recorrido interactivo por el universo ChatGPT: descubre cada herramienta, aprende a combinarlas y conviértete en un arquitecto de automatización. El tour completo de tu nueva obra.",
        estimatedTime: "20 minutos",
        difficulty: "Principiante",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "El Andamio del Arquitecto: Herramientas Integradas": {
    title: "El Andamio del Arquitecto: Herramientas Integradas",
    description:
      "Un arquitecto no construye solo con las manos — usa andamios, grúas y herramientas especializadas. Descubre las 5 herramientas integradas de ChatGPT que multiplicarán tu productividad.",
    learningObjectives: [
      "Identificar las 5 herramientas clave del ecosistema ChatGPT y cuándo usar cada una",
      "Seleccionar la herramienta correcta como un arquitecto elige el material adecuado",
      "Combinar múltiples herramientas en flujos de trabajo eficientes y automatizados",
      "Resolver escenarios reales usando las herramientas integradas como un maestro de obra",
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
          "Descubre cómo Búsqueda Web, Análisis de Datos, DALL-E 3 y Canvas trabajan juntos como un equipo de construcción para resolver problemas complejos.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "workflow-ova-herramientas",
        type: "ova_interactive",
        title: "Laboratorio: Herramientas ChatGPT",
        description:
          "Explora cada herramienta de ChatGPT con ejercicios prácticos y audio guiado. Como un arquitecto probando sus herramientas antes de la gran obra. Completa el desafío para demostrar tu maestría.",
        estimatedTime: "25 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "La Fachada del Edificio: GPTs y Function Calling": {
    title: "La Fachada del Edificio: GPTs y Function Calling",
    description:
      "La fachada es lo que el mundo ve — pero detrás hay una estructura compleja que la sostiene. Construye GPTs personalizados con conexiones a APIs externas que funcionan como la infraestructura invisible de tu obra maestra.",
    learningObjectives: [
      "Crear GPTs personalizados como módulos de construcción reutilizables",
      "Configurar acciones Function Calling para conectar con APIs externas",
      "Compartir tus creaciones y aprender de la comunidad de arquitectos digitales",
      "Evaluar cuándo usar un GPT personalizado vs. la construcción estándar de ChatGPT",
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
          "Guía visual rápida para construir, configurar y publicar tu primer GPT personalizado. Los planos ejecutivos del arquitecto digital.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "gpts-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Construye un GPT",
        description:
          "Manos a la obra: construye un GPT desde cero con ejercicios guiados y retroalimentación en cada paso. Como el arquitecto que supervisa cada detalle de su creación.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 8,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 3: EL DETECTIVE DE DATOS — GEMINI
  // ============================================================================
  "El Despertar del Detective Multimodal": {
    title: "El Despertar del Detective Multimodal",
    description:
      "Tu primera misión como detective: conocer a tu nueva arma secreta. Gemini es la IA que procesa texto, imágenes, audio y video en un solo movimiento. Una lupa multimodal. Todos los formatos.",
    learningObjectives: [
      "Descubrir el poder de procesar cualquier tipo de evidencia en una sola herramienta",
      "Interrogar a Gemini con fotos, documentos, audios y videos como un investigador experto",
      "Saber exactamente por qué Gemini gana en casos multimodales vs. otros modelos",
      "Usar Gemini para análisis forense y creación de contenido de alto impacto",
    ],
    estimatedTime: "29 minutos",
    difficulty: "Principiante",
    resources: [
      {
        id: "gemini-video-1",
        type: "video",
        title: "Gemini en 14 Minutos: Curso de Introducción Acelerado",
        url: "https://www.youtube.com/embed/Y5-5dI3Iero",
        duration: "14:10",
        thumbnail: "https://img.youtube.com/vi/Y5-5dI3Iero/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Descubre el poder de tu nueva lupa: desde analizar imágenes como un forense hasta escribir código como un desarrollador. Todo lo que Gemini puede hacer por ti, explicado en 14 minutos.",
      },
      {
        id: "gemini-guide-1",
        type: "pdf",
        title: "Manual de Campo: Introducción a Gemini",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/2-%20guia_edutechlife_modulo3_gemini.pdf",
        pages: 11,
        format: "PDF",
        size: "2.8 MB",
        description:
          "El manual de campo del detective: aprende a usar Gemini para estudiar, trabajar y crear contenido con la precisión de un investigador profesional.",
        thumbnailType: "premium",
        immersiveView: true,
      },
    ],
  },

  "Grounding: Cuando la Evidencia Toca Tierra": {
    title: "Grounding: Cuando la Evidencia Toca Tierra",
    description:
      "Gemini no flota en el aire — se conecta con tus herramientas diarias. Aprende a integrarlo en Google Docs, Sheets y Gmail para multiplicar tu velocidad de investigación.",
    learningObjectives: [
      "Redactar informes de investigación con Gemini como coautor",
      "Convertir datos crudos en evidencia procesable directamente en Sheets",
      "Dominar tu bandeja de entrada: que Gemini filtre, resuma y priorice por ti",
      "Generar presentaciones de alto impacto con la ayuda de Gemini",
    ],
    estimatedTime: "40 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "workspace-template-1",
        type: "pdf",
        title: "Gemini a la Práctica: Ejercicios de Campo",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/3%20Gemini_Research_Mastery.pdf",
        pages: 10,
        format: "PDF",
        size: "3.2 MB",
        description:
          "El cuaderno de ejercicios del detective: domina Gemini con casos prácticos y aplicaciones reales que multiplican tu productividad.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "workspace-ova-1",
        type: "ova_interactive",
        title: "Misión Interactiva: Domina el Ecosistema Gemini",
        description:
          "Recorrido interactivo por la arquitectura de tu nueva arma secreta: capacidades multimodales, Deep Research e integración Workspace. Incluye audio guiado y examen final para certificar tu rango de detective.",
        estimatedTime: "25 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "Deep Research: La Caja de Herramientas Forenses": {
    title: "Deep Research: La Caja de Herramientas Forenses",
    description:
      "Los casos más impresionantes no se resuelven con suerte — se resuelven con método. Descubre cómo investigadores, marketeros, programadores y educadores usan Gemini para encontrar lo que nadie más encuentra.",
    learningObjectives: [
      "Diseñar estrategias de marketing basadas en datos de investigación profunda",
      "Depurar y optimizar código con la asistencia de un detective digital",
      "Crear experiencias educativas que parecen investigaciones interactivas",
      "Realizar investigación académica con la profundidad de un doctorando y la velocidad de la IA",
    ],
    estimatedTime: "42 minutos",
    difficulty: "Avanzado",
    resources: [
      {
        id: "gemini-cases-video-1",
        type: "video",
        title: "Casos Reales: Detectives Digitales en Acción",
        url: "https://www.youtube.com/embed/XAshixrvG5k",
        duration: "2:41",
        thumbnail: "https://img.youtube.com/vi/XAshixrvG5k/maxresdefault.jpg",
        provider: "youtube",
        description:
          "Empresas y profesionales revelan cómo Gemini transformó su forma de investigar. Resultados que parecen magia — pero son método.",
      },
      {
        id: "gemini-cases-guide-1",
        type: "image",
        title: "Mapa del Ecosistema Gemini: Tu Guía Visual de Investigación",
        url: "https://srirrwpgswlnuqfgtule.supabase.co/storage/v1/object/public/modulo%203/3-infografia.png",
        format: "PNG",
        size: "1.2 MB",
        description:
          "Mapa visual completo del arsenal del detective: herramientas, capacidades y casos de uso en una sola infografía. Imprime, pega en tu pared, conviértete en un experto.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "gemini-cases-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Resuelve el Caso — 6 Desafíos",
        description:
          "Enfréntate a 6 casos reales — desde analizar un contrato hasta verificar una noticia falsa — y resuélvelos usando Gemini como tu asistente de investigación.",
        estimatedTime: "25 minutos",
        difficulty: "Avanzado",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  // ============================================================================
  // MÓDULO 4: EL ALQUIMISTA DEL CONOCIMIENTO — NOTEBOOKLM
  // ============================================================================
  "El Alquimista de Documentos: Tu Primer Hechizo con NotebookLM": {
    title: "El Alquimista de Documentos: Tu Primer Hechizo con NotebookLM",
    description:
      "La herramienta secreta de Google para alquimistas digitales: sube tus PDFs y obtén respuestas precisas con citas textuales. Tu bibliotecario personal con superpoderes de IA.",
    learningObjectives: [
      "Construir tu primera biblioteca inteligente donde los documentos cobran vida",
      "Interrogar tus fuentes como un detective que busca la verdad",
      "Destilar montañas de texto en resúmenes que van al grano",
      "Comparar información entre múltiples fuentes con precisión quirúrgica",
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
          "Descubre en 12 minutos cómo tus documentos cobran vida: haz preguntas, obtén resúmenes y verifica cada dato con citas exactas. La alquimia digital comienza aquí.",
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
          "El grimorio del alquimista: 10 páginas para dominar NotebookLM desde tu primer cuaderno hasta técnicas avanzadas de investigación.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "notebooklm-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Crea tu Notebook",
        description:
          "7 preguntas que te convertirán en experto en NotebookLM. Completa el desafío con Valerio como tu guía personal en este viaje alquímico.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 7,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "El Arte de la Curaduría: Cómo Elegir y Sintetizar Fuentes": {
    title: "El Arte de la Curaduría: Cómo Elegir y Sintetizar Fuentes",
    description:
      "Convierte montañas de documentos en resúmenes, preguntas frecuentes y reportes ejecutivos que parecen obra de un equipo de analistas.",
    learningObjectives: [
      "Generar resúmenes ejecutivos que parecen escritos por un equipo de analistas",
      "Crear FAQs que anticipan cada pregunta antes de que la formules",
      "Conectar cada respuesta a su fuente original con precisión quirúrgica",
      "Validar que la información generada es tan precisa como tu criterio",
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
          "Infografía sobre técnicas avanzadas de resumen y análisis con NotebookLM. El mapa del tesoro del alquimista documental.",
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
          "Plantillas profesionales de resumen para cada tipo de documento: académico, empresarial, técnico y más. El kit de herramientas del alquimista.",
      },
      {
        id: "notebook-summary-ova-1",
        type: "ova_interactive",
        title: "Simulador: Análisis de Documentos",
        description:
          "Simulador práctico: toma documentos reales y genera resúmenes de nivel profesional en minutos. Pon a prueba tus habilidades alquímicas.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "La Fórmula Secreta: Audio Overviews y Gestión Documental": {
    title: "La Fórmula Secreta: Audio Overviews y Gestión Documental",
    description:
      "Convierte tus apuntes en podcasts que suenan a radio profesional: dos voces IA conversan sobre tus documentos como si fueran viejos amigos.",
    learningObjectives: [
      "Dar vida a tus documentos con Audio Overviews que parecen programa de radio",
      "Afilar el tono: sé académico, conversacional o divulgativo según tu audiencia",
      "Aprender mientras te mueves: convertir el estudio en experiencia auditiva",
      "Compartir tus creaciones sonoras con equipos enteros",
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
          "Descubre cómo crear podcasts a partir de tus PDFs. Ideal para aprender mientras viajas, haces ejercicio o descansas. El sonido de la alquimia.",
      },
      {
        id: "notebook-audio-guide-1",
        type: "ova_interactive",
        title: "Notebook LM",
        description:
          "Curso completo de NotebookLM: 6 módulos interactivos con ejercicios prácticos y un desafío final para convertirte en un maestro alquimista.",
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
          "Crea tu primer podcast IA: elige el tema, personaliza el tono y escucha el resultado en minutos. La alquimia del audio en tus manos.",
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
  "El Voto del Guardián: Los 4 Principios Sagrados": {
    title: "El Voto del Guardián: Los 4 Principios Sagrados",
    description:
      "Los 4 pilares que separan a los profesionales responsables de los imprudentes. Transparencia, equidad, responsabilidad y privacidad — tu armadura ética completa.",
    learningObjectives: [
      "Reconocer los 7 tipos de sesgos que acechan en cada modelo de IA",
      "Desarrollar un sexto sentido para detectar sesgos en respuestas de IA",
      "Aplicar estrategias de justicia algorítmica como un guardián experto",
      "Evaluar la equidad de resultados con precisión forense",
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
          "En solo 1:56, descubre los 4 pilares que todo guardián de IA debe conocer. Un video corto que cambiará tu perspectiva para siempre.",
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
          "9 páginas que condensan todo lo que necesitas saber para blindar éticamente tu relación con la IA. Lectura obligatoria para guardianes.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "bias-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: Detecta el Sesgo",
        description:
          "Pon a prueba tu ojo de guardián: analiza respuestas de IA reales y descubre los sesgos que la mayoría de la gente nunca notaría. 6 desafíos que agudizarán tu instinto.",
        estimatedTime: "15 minutos",
        difficulty: "Intermedio",
        interactiveElements: 6,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "El Espejo de la Verdad: ¿Tu IA es Justa?": {
    title: "El Espejo de la Verdad: ¿Tu IA es Justa?",
    description:
      "¿Sabías que tu IA puede estar discriminando sin que lo sepas? Aprende a blindar tus datos y tus algoritmos contra los sesgos más peligrosos.",
    learningObjectives: [
      "Descifrar el viaje oculto de tus datos dentro de los sistemas de IA",
      "Detectar vulnerabilidades de privacidad que otros pasan por alto",
      "Implementar blindajes de protección nivel guardián",
      "Configurar herramientas de IA con la seguridad de un experto en ciberseguridad",
    ],
    estimatedTime: "29 minutos",
    difficulty: "Intermedio",
    resources: [
      {
        id: "privacy-video-1",
        type: "video",
        title: "Privacidad y IA: Lo que Debes Saber",
        url: "https://www.youtube.com/embed/BoR5KjsRK9U",
        duration: "9:20",
        thumbnail: "https://img.youtube.com/vi/BoR5KjsRK9U/maxresdefault.jpg",
        provider: "youtube",
        description:
          "9:20 que pueden salvar tu reputación. Descubre los riesgos de privacidad que acechan en cada herramienta de IA y cómo neutralizarlos.",
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
          "Checklist práctico de 7 pasos para blindar tu privacidad mientras aprovechas al máximo la inteligencia artificial. Tu manual de supervivencia digital.",
        thumbnailType: "premium",
        immersiveView: true,
      },
      {
        id: "privacy-ova-1",
        type: "ova_interactive",
        title: "Simulador: Evaluación de Riesgos",
        description:
          "Enfréntate a escenarios reales de riesgo y aprende a proteger tus datos como un guardián. Incluye el juego de estrellas éticas que pondrá a prueba tus decisiones.",
        estimatedTime: "20 minutos",
        difficulty: "Intermedio",
        interactiveElements: 5,
        thumbnailType: "premium",
        fullscreen: true,
      },
    ],
  },

  "El Legado del Guardián: Navegando la Ley": {
    title: "El Legado del Guardián: Navegando la Ley",
    description:
      "Las leyes de IA están cambiando el mundo. Desde el AI Act de la UE hasta las regulaciones locales, conoce las reglas del juego y conviértete en un referente de gobernanza ética.",
    learningObjectives: [
      "Aplicar principios éticos con la autoridad de un guardián certificado",
      "Detectar y detener usos inapropiados de IA antes de que escalen",
      "Liderar con transparencia: convertir la divulgación ética en tu sello personal",
      "Diseñar políticas de uso responsable que protejan a toda tu organización",
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
          "6:05 que condensan todo lo que necesitas saber para implementar IA ética en el mundo real. La guía definitiva para guardianes.",
      },
      {
        id: "ethics-ova-1",
        type: "ova_interactive",
        title: "Laboratorio: dilemas Éticos",
        description:
          "Enfréntate a 8 dilemas éticos reales donde no hay respuestas fáciles. Cada decisión que tomes tendrá consecuencias. ¿Estás listo para ser guardián?",
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
