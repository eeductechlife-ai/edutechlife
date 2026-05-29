/**
 * CONSTANTES: moduleContent.js
 * 
 * Datos de contenido educativo para los módulos 2-5 del IALab
 * El Módulo 1 permanece intacto con sus datos hardcodeados originales
 * 
 * Estructura por módulo:
 * - objective: Objetivo central del módulo
 * - learningPoints: 4 puntos de aprendizaje { text, icon }
 * - overviewData: { title, description, mission, topics[] }
 * - lessons: 3 lecciones { id, title, description, detailedDescription, duration, format, icon, badgeColor, themeColor }
 * - accordionContent: { 1: {...}, 2: {...}, 3: {...} }
 */

// ============================================================================
// SPANISH CONTENT
// ============================================================================
const CONTENT_ES = {
  // ============================================================================
  // MÓDULO 1: INGENIERÍA DE PROMPTS (datos de referencia, no se usa directamente)
  // El módulo 1 usa datos hardcodeados originales en cada componente
  // ============================================================================
  1: {
    objective: "Desarrolla habilidades de prompt engineering para obtener resultados precisos de la IA en contextos reales.",
    learningPoints: [
      { text: "Instrucciones claras a la IA", icon: "fa-bullseye" },
      { text: "Mejorar preguntas y respuestas", icon: "fa-wand-magic-sparkles" },
      { text: "Detectar y corregir errores", icon: "fa-exclamation-triangle" },
      { text: "Aplicar IA en estudio y trabajo", icon: "fa-rocket" }
    ],
    overviewData: {
      title: "Domina las Instrucciones",
      description: "Aprende a comunicarte con la IA como un profesional. Desde los fundamentos hasta técnicas avanzadas que transformarán tu forma de trabajar.",
      mission: "Completa cada lección y recurso multimedia (videos, guías y laboratorios). Cada paso que des te acerca un 20% más a tu certificación. ¡Las instrucciones claras son tu superpoder!",
      topics: [
        { title: "Introducción a la Inteligencia Artificial Generativa", icon: "fa-brain", resources: 2, duration: "20 min" },
        { title: "¿Qué es un Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [],
    accordionContent: {}
  },

  // ============================================================================
  // MÓDULO 2: POTENCIA CHATGPT
  // ============================================================================
  2: {
    objective: "Conviértete en un experto en ChatGPT y crea asistentes inteligentes que automaticen tu trabajo diario.",
    learningPoints: [
      { text: "Dominar System Prompts avanzados", icon: "fa-sliders" },
      { text: "Conectar GPT con APIs externas", icon: "fa-code" },
      { text: "Crear tu propio GPT personalizado", icon: "fa-robot" },
      { text: "Automatizar flujos de trabajo", icon: "fa-cog" }
    ],
    overviewData: {
      title: "ChatGPT sin Límites",
      description: "En este módulo, desbloquearás el verdadero potencial de ChatGPT. Desde configurar prompts de sistema profesionales hasta crear GPTs personalizados que trabajan por ti.",
      mission: "Completa cada lección y domina la IA más usada del mundo. Cada recurso completado te acerca a un nivel profesional. ¡Lleva tus habilidades al siguiente nivel!",
      topics: [
        { title: "Guía Completa de ChatGPT", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Plantillas de Flujos de Trabajo", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Function Calling y APIs de OpenAI", icon: "fa-code", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Guía Completa de ChatGPT",
        description: "La guía definitiva para dominar ChatGPT",
        detailedDescription: "Accede a la Guía Completa de ChatGPT de Edutechlife: un recurso integral que cubre desde los fundamentos hasta técnicas avanzadas. Aprende a aprovechar cada modelo, configura conversaciones efectivas y domina las mejores prácticas para obtener resultados profesionales.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC"
      },
      {
        id: 2,
        title: "Plantillas de Flujos de Trabajo",
        description: "Crea automatizaciones que trabajan por ti",
        detailedDescription: "Descubre el arsenal de herramientas de ChatGPT: búsqueda web, análisis de datos con Python, generación de imágenes y más. Aprende a combinarlas para crear automatizaciones poderosas.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA"
      },
      {
        id: 3,
        title: "Function Calling y APIs de OpenAI",
        description: "Conecta ChatGPT con el mundo real",
        detailedDescription: "Lleva ChatGPT al siguiente nivel: conéctalo con APIs, bases de datos y servicios externos. Crea flujos de trabajo automatizados que resuelven problemas reales.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Dominar ChatGPT en su totalidad mediante la guía completa de Edutechlife, desde fundamentos hasta técnicas avanzadas.",
        achievements: [
          { icon: "fa-check", text: "Comprender la arquitectura y evolución de los modelos GPT" },
          { icon: "fa-check", text: "Aplicar técnicas de prompt engineering profesionales" },
          { icon: "fa-check", text: "Seleccionar el modelo óptimo según costo y capacidad" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar el modelo más caro para tareas simples" },
          { icon: "fa-times", text: "Ignorar los límites de contexto (tokens)" },
          { icon: "fa-times", text: "No conocer las actualizaciones de nuevos modelos" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Uso genérico: Usar GPT-4 para tareas simples que GPT-3.5 resuelve igual",
          strong: "✅ Uso inteligente: GPT-3.5 para resúmenes rápidos, GPT-4 para análisis complejos y razonamiento profundo"
        }
      },
      2: {
        objective: "🏗️ Herramientas Integradas: El Ecosistema Completo de ChatGPT",
        objectiveDesc: "Domina todas las herramientas integradas de ChatGPT: Búsqueda Web, Intérprete de Código, DALL-E 3, Canvas y Proyectos. Aprende a combinarlas en flujos de trabajo profesionales.",
        achievements: [
          { icon: "fa-check", text: "Identificar cuándo usar cada herramienta integrada" },
          { icon: "fa-check", text: "Combinar múltiples herramientas en un solo flujo de trabajo" },
          { icon: "fa-check", text: "Crear automatizaciones que resuelvan problemas reales" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar DALL-E 3 para texto largo o logos de marcas" },
          { icon: "fa-times", text: "Confiar en la base de entrenamiento para datos actuales" },
          { icon: "fa-times", text: "No organizar proyectos por objetivos específicos" }
        ],
        example: {
          label: "Ejemplo de flujo integrado",
          weak: "❌ Aislado: Pedir datos actualizados sin activar Búsqueda Web → resultado desactualizado",
          strong: "✅ Integrado: Buscar datos actuales (Browse) → analizarlos con Python (Code Interpreter) → generar infografía (DALL-E 3) → editar en Canvas"
        }
      },
      3: {
        objective: "⚡ Function Calling: Conecta ChatGPT con el Mundo Real",
        objectiveDesc: "Integra ChatGPT con APIs externas para que pueda consultar datos, ejecutar acciones y automatizar flujos de trabajo completos.",
        achievements: [
          { icon: "fa-check", text: "Configurar Function Calling con la API de OpenAI" },
          { icon: "fa-check", text: "Definar funciones con esquemas JSON claros" },
          { icon: "fa-check", text: "Crear flujos automatizados multi-paso" }
        ],
        warnings: [
          { icon: "fa-times", text: "No validar las respuestas de la API antes de usarlas" },
          { icon: "fa-times", text: "Enviar datos sensibles sin autenticación" },
          { icon: "fa-times", text: "No manejar errores de conexión adecuadamente" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Prompt básico: ¿Cuál es el clima hoy?",
          strong: "✅ Function Calling: ChatGPT detecta la intención, llama a la API del clima, recibe datos JSON y genera: El clima actual en Bogotá es 18°C con 65% de humedad. Te recomendamos llevar paraguas por probabilidad de lluvia del 80% esta tarde."
        }
      }
    }
  },

  // ============================================================================
  // MÓDULO 3: RASTREO PROFUNDO CON GEMINI
  // ============================================================================
  3: {
    objective: "Usa Google Gemini para investigar a fondo, verificar datos y analizar información como un profesional.",
    learningPoints: [
      { text: "Analizar texto, imagen y código juntos", icon: "fa-cubes" },
      { text: "Obtener datos en tiempo real", icon: "fa-signal" },
      { text: "Investigar temas a profundidad", icon: "fa-search" },
      { text: "Verificar información con IA", icon: "fa-shield-alt" }
    ],
    overviewData: {
      title: "Investigación de Élite con Gemini",
      description: "En este módulo, dominarás Google Gemini para investigación avanzada. Aprenderás a cruzar datos en tiempo real, analizar múltiples formatos y verificar información con precisión.",
      mission: "Conviértete en un investigador de élite. Domina Google Gemini y descubre cómo cruzar datos, verificar fuentes y crear informes profesionales con IA.",
      topics: [
        { title: "Introducción a Google Gemini", icon: "fa-google", resources: 3, duration: "20 min" },
        { title: "Razonamiento Multimodal y Grounding", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Deep Research y Fact-Checking con IA", icon: "fa-search", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Introducción a Google Gemini",
        description: "Gemini: la IA que ve, lee y escucha",
        detailedDescription: "Gemini es la IA multimodal de Google que procesa texto, imágenes, audio y video a la vez. Aprende a usarla para analizar, crear y resolver problemas complejos.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4"
      },
      {
        id: 2,
        title: "Razonamiento Multimodal y Grounding",
        description: "Analiza imágenes, texto y datos juntos",
        detailedDescription: "Aprende a combinar imágenes, documentos y datos en vivo. Gemini analiza todo simultáneamente para darte respuestas con fuentes verificables del mundo real.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4"
      },
      {
        id: 3,
        title: "Deep Research y Fact-Checking con IA",
        description: "Investiga como un profesional",
        detailedDescription: "Domina la investigación con IA: deep research, verificación automática de datos y generación de informes técnicos con fuentes citadas y verificables.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Conocer Google Gemini, sus capacidades multimodales y cómo se diferencia de otros modelos de IA.",
        achievements: [
          { icon: "fa-check", text: "Entender la arquitectura multimodal de Gemini" },
          { icon: "fa-check", text: "Configurar Gemini Advanced y Google AI Studio" },
          { icon: "fa-check", text: "Comparar Gemini con ChatGPT y otros modelos" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar Gemini como si fuera solo un chatbot" },
          { icon: "fa-times", text: "No aprovechar sus capacidades de análisis de imágenes" },
          { icon: "fa-times", text: "Ignorar el grounding con Google Search" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Uso básico: Preguntar qué es Gemini",
          strong: "✅ Uso avanzado: Subir una imagen de un gráfico financiero, pedir análisis de tendencias, cruzar con datos de búsqueda en tiempo real y generar un informe ejecutivo"
        }
      },
      2: {
        objective: "🔬 Razonamiento Multimodal: Ve, Lee y Analiza",
        objectiveDesc: "Domina la capacidad de Gemini para procesar texto, imágenes, audio y código simultáneamente con grounding en tiempo real.",
        achievements: [
          { icon: "fa-check", text: "Analizar imágenes y documentos con Gemini" },
          { icon: "fa-check", text: "Usar grounding para datos actualizados de internet" },
          { icon: "fa-check", text: "Combinar múltiples entradas en un solo análisis" }
        ],
        warnings: [
          { icon: "fa-times", text: "Subir imágenes de baja calidad sin contexto" },
          { icon: "fa-times", text: "Confiar ciegamente en el grounding sin verificar" },
          { icon: "fa-times", text: "No especificar el tipo de análisis esperado" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Prompt vago: Analiza esta imagen",
          strong: "✅ Prompt multimodal: Analiza este diagrama de arquitectura técnica. Identifica los componentes, explica el flujo de datos, sugiere mejoras de escalabilidad y compara con la arquitectura de referencia de AWS 2024."
        }
      },
      3: {
        objective: "🔍 Deep Research: Investigación de Nivel Experto",
        objectiveDesc: "Usa Gemini para investigaciones profundas con fuentes verificables, fact-checking automático y generación de informes técnicos.",
        achievements: [
          { icon: "fa-check", text: "Ejecutar Deep Research con fuentes citadas" },
          { icon: "fa-check", text: "Verificar información con fact-checking automático" },
          { icon: "fa-check", text: "Generar informes técnicos con referencias" }
        ],
        warnings: [
          { icon: "fa-times", text: "No verificar las fuentes que Gemini cita" },
          { icon: "fa-times", text: "Aceptar la primera respuesta sin profundizar" },
          { icon: "fa-times", text: "No cruzar información con fuentes primarias" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Superficial: ¿Cuáles son las tendencias de IA en 2025?",
          strong: "✅ Deep Research: Investiga las 5 tendencias principales de IA generativa en 2025. Para cada una: fuente primaria, datos de adopción, casos de uso reales, riesgos identificados y proyección a 3 años. Incluye URLs verificables."
        }
      }
    }
  },

  // ============================================================================
  // MÓDULO 4: INMERSIÓN NOTEBOOKLM
  // ============================================================================
  4: {
    objective: "Transforma documentos y fuentes en podcasts, resúmenes y conocimiento accionable en minutos.",
    learningPoints: [
      { text: "Seleccionar y curar tus fuentes", icon: "fa-book-open" },
      { text: "Sintetizar documentos con IA", icon: "fa-file-alt" },
      { text: "Crear podcasts desde tus archivos", icon: "fa-microphone" },
      { text: "Gestionar documentación inteligente", icon: "fa-folder-open" }
    ],
    overviewData: {
      title: "Tu Primer Notebook con IA",
      description: "En este módulo, transformarás cualquier documento en conocimiento útil. Desde resúmenes inteligentes hasta podcasts generados por IA, todo desde una sola herramienta.",
      mission: "Domina el arte de transformar documentos en conocimiento. Convierte PDFs en resúmenes inteligentes, podcasts y asistentes de investigación personalizados.",
      topics: [
        { title: "¿Qué es NotebookLM y para qué sirve?", icon: "fa-microphone", resources: 3, duration: "20 min" },
        { title: "Curaduría de Fuentes y Síntesis de Documentos", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Audio Overviews y Gestión Documental con IA", icon: "fa-podcast", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "¿Qué es NotebookLM y para qué sirve?",
        description: "Tu asistente de investigación con IA",
        detailedDescription: "Conoce NotebookLM, la herramienta de Google que convierte tus PDFs, artículos y apuntes en un asistente personal que responde con citas exactas de tus documentos.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B"
      },
      {
        id: 2,
        title: "Curaduría de Fuentes y Síntesis de Documentos",
        description: "Organiza tu investigación como un pro",
        detailedDescription: "Aprende a seleccionar las mejores fuentes, organizarlas por temas y conectar ideas entre documentos para crear resúmenes y análisis de nivel profesional.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981"
      },
      {
        id: 3,
        title: "Audio Overviews y Gestión Documental con IA",
        description: "Convierte PDFs en podcasts",
        detailedDescription: "Transforma tus documentos en conversaciones de podcast con dos voces IA. Ideal para aprender mientras viajas. Gestiona tu biblioteca de conocimiento de forma inteligente.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Comprender qué es NotebookLM, cómo funciona y por qué es revolucionario para la gestión del conocimiento personal.",
        achievements: [
          { icon: "fa-check", text: "Entender el concepto de IA basada en fuentes propias" },
          { icon: "fa-check", text: "Crear tu primer notebook con documentos" },
          { icon: "fa-check", text: "Diferenciar NotebookLM de chatbots genéricos" }
        ],
        warnings: [
          { icon: "fa-times", text: "Subir documentos sin curar ni organizar" },
          { icon: "fa-times", text: "Esperar que funcione sin fuentes de calidad" },
          { icon: "fa-times", text: "No entender que solo responde basado en tus fuentes" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Notebook vacío: Sin fuentes subidas, sin contexto",
          strong: "✅ Notebook potente: 5 PDFs de investigación académica + 3 artículos de industria = Asistente experto que responde con citas textuales de tus documentos"
        }
      },
      2: {
        objective: "📚 Curaduría de Fuentes: Calidad sobre Cantidad",
        objectiveDesc: "Aprende a seleccionar, organizar y sintetizar documentos para maximizar el valor de tu notebook de investigación.",
        achievements: [
          { icon: "fa-check", text: "Seleccionar fuentes relevantes y confiables" },
          { icon: "fa-check", text: "Organizar documentos por categorías temáticas" },
          { icon: "fa-check", text: "Generar síntesis cruzadas entre múltiples fuentes" }
        ],
        warnings: [
          { icon: "fa-times", text: "Subir 50 documentos sin filtro de calidad" },
          { icon: "fa-times", text: "Mezclar fuentes contradictorias sin contexto" },
          { icon: "fa-times", text: "No actualizar las fuentes regularmente" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Sin curaduría: Subir todo lo que encuentro sobre IA",
          strong: "✅ Con curaduría: 10 papers seleccionados por relevancia, organizados por tema (ética, técnica, aplicaciones), con notas de contexto para cada grupo"
        }
      },
      3: {
        objective: "🎙️ Audio Overviews: Tu Conocimiento en Formato Podcast",
        objectiveDesc: "Transforma documentos complejos en conversaciones de audio engaging generadas por IA con dos presentadores virtuales.",
        achievements: [
          { icon: "fa-check", text: "Generar Audio Overviews desde tus documentos" },
          { icon: "fa-check", text: "Personalizar el tono y enfoque del podcast" },
          { icon: "fa-check", text: "Usar audio para repaso y aprendizaje móvil" }
        ],
        warnings: [
          { icon: "fa-times", text: "Esperar audio perfecto con documentos cortos" },
          { icon: "fa-times", text: "No revisar el contenido generado antes de compartir" },
          { icon: "fa-times", text: "Usar solo audio sin complementar con resúmenes escritos" }
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Audio genérico: Conversación vaga sobre el tema",
          strong: "✅ Audio enfocado: Podcast de 15 minutos donde dos presentadores discuten los hallazgos clave de 5 papers sobre neuroplasticidad, con ejemplos prácticos y analogías claras"
        }
      }
    }
  },

  // ============================================================================
  // MÓDULO 5: ÉTICA APLICADA A IA GENERATIVA
  // ============================================================================
  5: {
    objective: "Aprende a usar la IA de forma responsable, ética y legal con frameworks que las empresas exigen hoy.",
    learningPoints: [
      { text: "Detectar sesgos algorítmicos", icon: "fa-shield-check" },
      { text: "Conocer la regulación IA vigente", icon: "fa-briefcase" },
      { text: "Proteger datos y privacidad", icon: "fa-lock" },
      { text: "Crear protocolos éticos de IA", icon: "fa-clipboard-check" }
    ],
    overviewData: {
      title: "IA Responsable y Ética",
      description: "En este módulo final, desarrollarás pensamiento crítico sobre los impactos éticos de la IA. Aprenderás a identificar sesgos, cumplir regulaciones y crear frameworks de IA responsable.",
      mission: "Convertirte en un profesional de IA ético y responsable. Este módulo cierra tu certificación global con las competencias que las empresas buscan hoy.",
      topics: [
        { title: "Ética en la Inteligencia Artificial", icon: "fa-balance-scale", resources: 3, duration: "20 min" },
        { title: "Sesgos Algorítmicos y Equidad", icon: "fa-exclamation-triangle", resources: 3, duration: "20 min" },
        { title: "Privacidad, Regulación y IA Responsable", icon: "fa-shield-alt", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Ética en la Inteligencia Artificial",
        description: "Fundamentos éticos para el uso de IA generativa",
        detailedDescription: "Fundamentos éticos para el uso de IA generativa. Comprende los principios de transparencia, equidad, responsabilidad y privacidad que todo profesional debe aplicar al trabajar con IA.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444"
      },
      {
        id: 2,
        title: "Sesgos Algorítmicos y Equidad",
        description: "Identifica y mitiga sesgos en sistemas de IA",
        detailedDescription: "Identifica y mitiga sesgos en sistemas de IA. Aprende a detectar discriminación algorítmica, entender sus causas y aplicar estrategias para crear sistemas más justos e inclusivos.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316"
      },
      {
        id: 3,
        title: "Privacidad, Regulación y IA Responsable",
        description: "Marco legal y mejores prácticas de IA ética",
        detailedDescription: "Marco legal y mejores prácticas de IA ética. Conoce la regulación vigente (AI Act de la UE, leyes locales), protección de datos y cómo diseñar frameworks de gobernanza de IA en tu organización.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Objetivo Principal",
        objectiveDesc: "Desarrollar un marco ético sólido para el uso de IA generativa que proteja a usuarios, organizaciones y la sociedad.",
        achievements: [
          { icon: "fa-check", text: "Comprender los principios éticos fundamentales de la IA" },
          { icon: "fa-check", text: "Identificar dilemas éticos en casos reales" },
          { icon: "fa-check", text: "Aplicar un checklist ético antes de usar IA" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar IA sin considerar el impacto en las personas" },
          { icon: "fa-times", text: "Asumir que la IA es neutral por ser tecnología" },
          { icon: "fa-times", text: "Ignorar las consecuencias no intencionadas" }
        ],
        example: {
          label: "Caso ético real",
          weak: "❌ Sin ética: Generar contenido falso con IA y publicarlo como real",
          strong: "✅ Con ética: Siempre divulgar cuando se usa IA, verificar la información generada, respetar derechos de autor y proteger datos personales"
        }
      },
      2: {
        objective: "⚖️ Sesgos Algorítmicos: El Enemigo Invisible",
        objectiveDesc: "Aprende a detectar, entender y mitigar los sesgos que los sistemas de IA heredan de sus datos de entrenamiento.",
        achievements: [
          { icon: "fa-check", text: "Identificar tipos de sesgos algorítmicos" },
          { icon: "fa-check", text: "Analizar casos reales de discriminación por IA" },
          { icon: "fa-check", text: "Aplicar técnicas de mitigación de sesgos" }
        ],
        warnings: [
          { icon: "fa-times", text: "Confiar en resultados sin verificar equidad" },
          { icon: "fa-times", text: "Usar datos de entrenamiento no representativos" },
          { icon: "fa-times", text: "No auditar los outputs de IA regularmente" }
        ],
        example: {
          label: "Caso real de sesgo",
          weak: "❌ Sesgado: IA de contratación que rechaza candidatos por género basada en datos históricos sesgados",
          strong: "✅ Equitativo: Auditar el dataset de entrenamiento, incluir variables de equidad, testear con grupos diversos y revisar resultados periódicamente"
        }
      },
      3: {
        objective: "🔒 Regulación y Gobernanza: El Marco Legal de la IA",
        objectiveDesc: "Conoce las regulaciones vigentes sobre IA y aprende a diseñar protocolos de gobernanza que protejan a tu organización.",
        achievements: [
          { icon: "fa-check", text: "Conocer el AI Act de la Unión Europea" },
          { icon: "fa-check", text: "Entender las obligaciones de privacidad y transparencia" },
          { icon: "fa-check", text: "Diseñar un protocolo ético de IA para tu organización" }
        ],
        warnings: [
          { icon: "fa-times", text: "Ignorar la regulación vigente de IA" },
          { icon: "fa-times", text: "No proteger datos personales en procesos con IA" },
          { icon: "fa-times", text: "Implementar IA sin políticas de gobernanza" }
        ],
        example: {
          label: "Ejemplo de protocolo",
          weak: "❌ Sin protocolo: Usar IA para todo sin supervisión ni auditoría",
          strong: "✅ Con protocolo: Comité de ética de IA, auditorías trimestrales, checklist de privacidad antes de cada implementación, divulgación transparente al usuario final"
        }
      }
    }
  }
};

// ============================================================================
// ENGLISH CONTENT
// ============================================================================
const CONTENT_EN = {
  1: {
    objective: "Develop prompt engineering skills to get accurate AI results in real-world contexts.",
    learningPoints: [
      { text: "Giving clear instructions to AI", icon: "fa-bullseye" },
      { text: "Improving questions and answers", icon: "fa-wand-magic-sparkles" },
      { text: "Detecting and fixing errors", icon: "fa-exclamation-triangle" },
      { text: "Applying AI in study and work", icon: "fa-rocket" }
    ],
    overviewData: {
      title: "Master the Instructions",
      description: "Learn to communicate with AI like a professional. From fundamentals to advanced techniques that will transform how you work.",
      mission: "Complete each lesson and multimedia resource (videos, guides, and labs). Every step brings you 20% closer to your certification. Clear instructions are your superpower!",
      topics: [
        { title: "Introduction to Generative Artificial Intelligence", icon: "fa-brain", resources: 2, duration: "20 min" },
        { title: "What is a Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [],
    accordionContent: {}
  },

  2: {
    objective: "Become a ChatGPT expert and create intelligent assistants that automate your daily work.",
    learningPoints: [
      { text: "Master advanced System Prompts", icon: "fa-sliders" },
      { text: "Connect GPT with external APIs", icon: "fa-code" },
      { text: "Create your own custom GPT", icon: "fa-robot" },
      { text: "Automate workflows", icon: "fa-cog" }
    ],
    overviewData: {
      title: "ChatGPT Without Limits",
      description: "In this module, you will unlock the true potential of ChatGPT. From setting up professional system prompts to creating custom GPTs that work for you.",
      mission: "Complete each lesson and master the world's most used AI. Each completed resource brings you closer to a professional level. Take your skills to the next level!",
      topics: [
        { title: "Complete ChatGPT Guide", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Workflow Templates", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Function Calling and OpenAI APIs", icon: "fa-code", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Complete ChatGPT Guide",
        description: "The ultimate guide to mastering ChatGPT",
        detailedDescription: "Access the Complete ChatGPT Guide from Edutechlife: a comprehensive resource covering everything from fundamentals to advanced techniques. Learn to leverage every model, set up effective conversations, and master best practices for professional results.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC"
      },
      {
        id: 2,
        title: "Workflow Templates",
        description: "Create automations that work for you",
        detailedDescription: "Discover ChatGPT's arsenal of tools: web search, Python data analysis, image generation, and more. Learn to combine them to create powerful automations.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA"
      },
      {
        id: 3,
        title: "Function Calling and OpenAI APIs",
        description: "Connect ChatGPT to the real world",
        detailedDescription: "Take ChatGPT to the next level: connect it with APIs, databases, and external services. Create automated workflows that solve real problems.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Master ChatGPT completely through Edutechlife's comprehensive guide, from fundamentals to advanced techniques.",
        achievements: [
          { icon: "fa-check", text: "Understand the architecture and evolution of GPT models" },
          { icon: "fa-check", text: "Apply professional prompt engineering techniques" },
          { icon: "fa-check", text: "Select the optimal model based on cost and capability" }
        ],
        warnings: [
          { icon: "fa-times", text: "Using the most expensive model for simple tasks" },
          { icon: "fa-times", text: "Ignoring context limits (tokens)" },
          { icon: "fa-times", text: "Not keeping up with new model updates" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic usage: Using GPT-4 for simple tasks that GPT-3.5 handles just as well",
          strong: "✅ Smart usage: GPT-3.5 for quick summaries, GPT-4 for complex analysis and deep reasoning"
        }
      },
      2: {
        objective: "🏗️ Integrated Tools: The Complete ChatGPT Ecosystem",
        objectiveDesc: "Master all of ChatGPT's integrated tools: Web Search, Code Interpreter, DALL-E 3, Canvas, and Projects. Learn to combine them in professional workflows.",
        achievements: [
          { icon: "fa-check", text: "Identify when to use each integrated tool" },
          { icon: "fa-check", text: "Combine multiple tools in a single workflow" },
          { icon: "fa-check", text: "Create automations that solve real problems" }
        ],
        warnings: [
          { icon: "fa-times", text: "Using DALL-E 3 for long text or brand logos" },
          { icon: "fa-times", text: "Relying on training data for current information" },
          { icon: "fa-times", text: "Not organizing projects by specific goals" }
        ],
        example: {
          label: "Integrated workflow example",
          weak: "❌ Isolated: Asking for updated data without enabling Web Search → outdated results",
          strong: "✅ Integrated: Search current data (Browse) → analyze with Python (Code Interpreter) → generate infographic (DALL-E 3) → edit in Canvas"
        }
      },
      3: {
        objective: "⚡ Function Calling: Connect ChatGPT to the Real World",
        objectiveDesc: "Integrate ChatGPT with external APIs so it can query data, execute actions, and automate complete workflows.",
        achievements: [
          { icon: "fa-check", text: "Configure Function Calling with the OpenAI API" },
          { icon: "fa-check", text: "Define functions with clear JSON schemas" },
          { icon: "fa-check", text: "Create multi-step automated workflows" }
        ],
        warnings: [
          { icon: "fa-times", text: "Not validating API responses before using them" },
          { icon: "fa-times", text: "Sending sensitive data without authentication" },
          { icon: "fa-times", text: "Not handling connection errors properly" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Basic prompt: What's the weather today?",
          strong: "✅ Function Calling: ChatGPT detects the intent, calls the weather API, receives JSON data, and generates: The current weather in Bogotá is 18°C with 65% humidity. We recommend bringing an umbrella due to 80% rain probability this afternoon."
        }
      }
    }
  },

  3: {
    objective: "Use Google Gemini to research deeply, verify data, and analyze information like a professional.",
    learningPoints: [
      { text: "Analyze text, images, and code together", icon: "fa-cubes" },
      { text: "Get real-time data", icon: "fa-signal" },
      { text: "Research topics in depth", icon: "fa-search" },
      { text: "Verify information with AI", icon: "fa-shield-alt" }
    ],
    overviewData: {
      title: "Elite Research with Gemini",
      description: "In this module, you will master Google Gemini for advanced research. Learn to cross-reference real-time data, analyze multiple formats, and verify information with precision.",
      mission: "Become an elite researcher. Master Google Gemini and discover how to cross-reference data, verify sources, and create professional reports with AI.",
      topics: [
        { title: "Introduction to Google Gemini", icon: "fa-google", resources: 3, duration: "20 min" },
        { title: "Multimodal Reasoning and Grounding", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Deep Research and Fact-Checking with AI", icon: "fa-search", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Introduction to Google Gemini",
        description: "Gemini: the AI that sees, reads, and listens",
        detailedDescription: "Gemini is Google's multimodal AI that processes text, images, audio, and video simultaneously. Learn to use it to analyze, create, and solve complex problems.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4"
      },
      {
        id: 2,
        title: "Multimodal Reasoning and Grounding",
        description: "Analyze images, text, and data together",
        detailedDescription: "Learn to combine images, documents, and live data. Gemini analyzes everything simultaneously to give you answers with verifiable real-world sources.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4"
      },
      {
        id: 3,
        title: "Deep Research and Fact-Checking with AI",
        description: "Research like a professional",
        detailedDescription: "Master AI-powered research: deep research, automatic data verification, and generation of technical reports with cited and verifiable sources.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Learn about Google Gemini, its multimodal capabilities, and how it differs from other AI models.",
        achievements: [
          { icon: "fa-check", text: "Understand Gemini's multimodal architecture" },
          { icon: "fa-check", text: "Set up Gemini Advanced and Google AI Studio" },
          { icon: "fa-check", text: "Compare Gemini with ChatGPT and other models" }
        ],
        warnings: [
          { icon: "fa-times", text: "Using Gemini as if it were just a chatbot" },
          { icon: "fa-times", text: "Not leveraging its image analysis capabilities" },
          { icon: "fa-times", text: "Ignoring grounding with Google Search" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Basic usage: Asking what Gemini is",
          strong: "✅ Advanced usage: Upload an image of a financial chart, request trend analysis, cross-reference with real-time search data, and generate an executive report"
        }
      },
      2: {
        objective: "🔬 Multimodal Reasoning: See, Read, and Analyze",
        objectiveDesc: "Master Gemini's ability to process text, images, audio, and code simultaneously with real-time grounding.",
        achievements: [
          { icon: "fa-check", text: "Analyze images and documents with Gemini" },
          { icon: "fa-check", text: "Use grounding for up-to-date internet data" },
          { icon: "fa-check", text: "Combine multiple inputs in a single analysis" }
        ],
        warnings: [
          { icon: "fa-times", text: "Uploading low-quality images without context" },
          { icon: "fa-times", text: "Blindly trusting grounding without verification" },
          { icon: "fa-times", text: "Not specifying the expected type of analysis" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Vague prompt: Analyze this image",
          strong: "✅ Multimodal prompt: Analyze this technical architecture diagram. Identify the components, explain the data flow, suggest scalability improvements, and compare with the AWS 2024 reference architecture."
        }
      },
      3: {
        objective: "🔍 Deep Research: Expert-Level Investigation",
        objectiveDesc: "Use Gemini for deep research with verifiable sources, automatic fact-checking, and technical report generation.",
        achievements: [
          { icon: "fa-check", text: "Run Deep Research with cited sources" },
          { icon: "fa-check", text: "Verify information with automatic fact-checking" },
          { icon: "fa-check", text: "Generate technical reports with references" }
        ],
        warnings: [
          { icon: "fa-times", text: "Not verifying the sources Gemini cites" },
          { icon: "fa-times", text: "Accepting the first answer without digging deeper" },
          { icon: "fa-times", text: "Not cross-referencing information with primary sources" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Surface level: What are the AI trends in 2025?",
          strong: "✅ Deep Research: Research the top 5 generative AI trends in 2025. For each: primary source, adoption data, real use cases, identified risks, and 3-year projection. Include verifiable URLs."
        }
      }
    }
  },

  4: {
    objective: "Transform documents and sources into podcasts, summaries, and actionable knowledge in minutes.",
    learningPoints: [
      { text: "Select and curate your sources", icon: "fa-book-open" },
      { text: "Synthesize documents with AI", icon: "fa-file-alt" },
      { text: "Create podcasts from your files", icon: "fa-microphone" },
      { text: "Manage intelligent documentation", icon: "fa-folder-open" }
    ],
    overviewData: {
      title: "Your First AI Notebook",
      description: "In this module, you will transform any document into useful knowledge. From intelligent summaries to AI-generated podcasts, all from a single tool.",
      mission: "Master the art of transforming documents into knowledge. Turn PDFs into intelligent summaries, podcasts, and personalized research assistants.",
      topics: [
        { title: "What is NotebookLM and how is it used?", icon: "fa-microphone", resources: 3, duration: "20 min" },
        { title: "Source Curation and Document Synthesis", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Audio Overviews and AI Document Management", icon: "fa-podcast", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "What is NotebookLM and how is it used?",
        description: "Your AI research assistant",
        detailedDescription: "Discover NotebookLM, Google's tool that turns your PDFs, articles, and notes into a personal assistant that responds with exact citations from your documents.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B"
      },
      {
        id: 2,
        title: "Source Curation and Document Synthesis",
        description: "Organize your research like a pro",
        detailedDescription: "Learn to select the best sources, organize them by topic, and connect ideas across documents to create professional-level summaries and analyses.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981"
      },
      {
        id: 3,
        title: "Audio Overviews and AI Document Management",
        description: "Turn PDFs into podcasts",
        detailedDescription: "Transform your documents into podcast conversations with two AI voices. Ideal for learning on the go. Manage your knowledge library intelligently.",
        duration: "20 min",
        format: "Video",
        icon: "fa-podcast",
        badgeColor: "bg-violet-100 text-violet-800",
        themeColor: "#8B5CF6"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Understand what NotebookLM is, how it works, and why it's revolutionary for personal knowledge management.",
        achievements: [
          { icon: "fa-check", text: "Understand the concept of AI based on your own sources" },
          { icon: "fa-check", text: "Create your first notebook with documents" },
          { icon: "fa-check", text: "Differentiate NotebookLM from generic chatbots" }
        ],
        warnings: [
          { icon: "fa-times", text: "Uploading documents without curating or organizing them" },
          { icon: "fa-times", text: "Expecting it to work without quality sources" },
          { icon: "fa-times", text: "Not understanding it only responds based on your sources" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Empty notebook: No sources uploaded, no context",
          strong: "✅ Powerful notebook: 5 academic research PDFs + 3 industry articles = Expert assistant that responds with verbatim citations from your documents"
        }
      },
      2: {
        objective: "📚 Source Curation: Quality over Quantity",
        objectiveDesc: "Learn to select, organize, and synthesize documents to maximize the value of your research notebook.",
        achievements: [
          { icon: "fa-check", text: "Select relevant and reliable sources" },
          { icon: "fa-check", text: "Organize documents by thematic categories" },
          { icon: "fa-check", text: "Generate cross-syntheses across multiple sources" }
        ],
        warnings: [
          { icon: "fa-times", text: "Uploading 50 documents without quality filtering" },
          { icon: "fa-times", text: "Mixing contradictory sources without context" },
          { icon: "fa-times", text: "Not updating sources regularly" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Without curation: Uploading everything I find about AI",
          strong: "✅ With curation: 10 papers selected by relevance, organized by topic (ethics, technical, applications), with context notes for each group"
        }
      },
      3: {
        objective: "🎙️ Audio Overviews: Your Knowledge in Podcast Format",
        objectiveDesc: "Transform complex documents into engaging audio conversations generated by AI with two virtual hosts.",
        achievements: [
          { icon: "fa-check", text: "Generate Audio Overviews from your documents" },
          { icon: "fa-check", text: "Customize the podcast tone and focus" },
          { icon: "fa-check", text: "Use audio for review and mobile learning" }
        ],
        warnings: [
          { icon: "fa-times", text: "Expecting perfect audio with short documents" },
          { icon: "fa-times", text: "Not reviewing generated content before sharing" },
          { icon: "fa-times", text: "Using only audio without supplementing with written summaries" }
        ],
        example: {
          label: "Practical example",
          weak: "❌ Generic audio: Vague conversation about the topic",
          strong: "✅ Focused audio: 15-minute podcast where two hosts discuss key findings from 5 papers on neuroplasticity, with practical examples and clear analogies"
        }
      }
    }
  },

  5: {
    objective: "Learn to use AI responsibly, ethically, and legally with frameworks that companies demand today.",
    learningPoints: [
      { text: "Detect algorithmic biases", icon: "fa-shield-check" },
      { text: "Know current AI regulations", icon: "fa-briefcase" },
      { text: "Protect data and privacy", icon: "fa-lock" },
      { text: "Create ethical AI protocols", icon: "fa-clipboard-check" }
    ],
    overviewData: {
      title: "Responsible and Ethical AI",
      description: "In this final module, you will develop critical thinking about the ethical impacts of AI. Learn to identify biases, comply with regulations, and create responsible AI frameworks.",
      mission: "Become an ethical and responsible AI professional. This module completes your global certification with the skills companies are looking for today.",
      topics: [
        { title: "Ethics in Artificial Intelligence", icon: "fa-balance-scale", resources: 3, duration: "20 min" },
        { title: "Algorithmic Biases and Fairness", icon: "fa-exclamation-triangle", resources: 3, duration: "20 min" },
        { title: "Privacy, Regulation, and Responsible AI", icon: "fa-shield-alt", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Ethics in Artificial Intelligence",
        description: "Ethical foundations for using generative AI",
        detailedDescription: "Ethical foundations for using generative AI. Understand the principles of transparency, fairness, accountability, and privacy that every professional must apply when working with AI.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-balance-scale",
        badgeColor: "bg-red-100 text-red-800",
        themeColor: "#EF4444"
      },
      {
        id: 2,
        title: "Algorithmic Biases and Fairness",
        description: "Identify and mitigate biases in AI systems",
        detailedDescription: "Identify and mitigate biases in AI systems. Learn to detect algorithmic discrimination, understand its causes, and apply strategies to create fairer and more inclusive systems.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-orange-100 text-orange-800",
        themeColor: "#F97316"
      },
      {
        id: 3,
        title: "Privacy, Regulation, and Responsible AI",
        description: "Legal framework and best practices for ethical AI",
        detailedDescription: "Legal framework and best practices for ethical AI. Learn about current regulations (EU AI Act, local laws), data protection, and how to design AI governance frameworks in your organization.",
        duration: "20 min",
        format: "Video",
        icon: "fa-shield-alt",
        badgeColor: "bg-slate-100 text-slate-800",
        themeColor: "#64748B"
      }
    ],
    accordionContent: {
      1: {
        objective: "🎯 Main Objective",
        objectiveDesc: "Develop a solid ethical framework for using generative AI that protects users, organizations, and society.",
        achievements: [
          { icon: "fa-check", text: "Understand the fundamental ethical principles of AI" },
          { icon: "fa-check", text: "Identify ethical dilemmas in real-world cases" },
          { icon: "fa-check", text: "Apply an ethical checklist before using AI" }
        ],
        warnings: [
          { icon: "fa-times", text: "Using AI without considering the impact on people" },
          { icon: "fa-times", text: "Assuming AI is neutral because it's technology" },
          { icon: "fa-times", text: "Ignoring unintended consequences" }
        ],
        example: {
          label: "Real ethical case",
          weak: "❌ Unethical: Generating fake content with AI and publishing it as real",
          strong: "✅ Ethical: Always disclosing when AI is used, verifying generated information, respecting copyright, and protecting personal data"
        }
      },
      2: {
        objective: "⚖️ Algorithmic Biases: The Invisible Enemy",
        objectiveDesc: "Learn to detect, understand, and mitigate the biases that AI systems inherit from their training data.",
        achievements: [
          { icon: "fa-check", text: "Identify types of algorithmic biases" },
          { icon: "fa-check", text: "Analyze real cases of AI discrimination" },
          { icon: "fa-check", text: "Apply bias mitigation techniques" }
        ],
        warnings: [
          { icon: "fa-times", text: "Trusting results without verifying fairness" },
          { icon: "fa-times", text: "Using non-representative training data" },
          { icon: "fa-times", text: "Not auditing AI outputs regularly" }
        ],
        example: {
          label: "Real bias case",
          weak: "❌ Biased: AI recruiting tool that rejects candidates based on gender, trained on biased historical data",
          strong: "✅ Fair: Audit the training dataset, include fairness variables, test with diverse groups, and review results periodically"
        }
      },
      3: {
        objective: "🔒 Regulation and Governance: The Legal Framework of AI",
        objectiveDesc: "Learn about current AI regulations and how to design governance protocols that protect your organization.",
        achievements: [
          { icon: "fa-check", text: "Know the European Union AI Act" },
          { icon: "fa-check", text: "Understand privacy and transparency obligations" },
          { icon: "fa-check", text: "Design an ethical AI protocol for your organization" }
        ],
        warnings: [
          { icon: "fa-times", text: "Ignoring current AI regulations" },
          { icon: "fa-times", text: "Not protecting personal data in AI processes" },
          { icon: "fa-times", text: "Implementing AI without governance policies" }
        ],
        example: {
          label: "Protocol example",
          weak: "❌ No protocol: Using AI for everything without supervision or audits",
          strong: "✅ With protocol: AI ethics committee, quarterly audits, privacy checklist before each implementation, transparent disclosure to end users"
        }
      }
    }
  }
};

// Backward-compatible export (Spanish)
export const moduleContent = CONTENT_ES;

/**
 * Selector functions - locale-aware
 */
const getContent = (locale = 'es') => {
  return locale === 'en' ? CONTENT_EN : CONTENT_ES;
};

export const getModuleContent = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  return content[moduleId] || null;
};

export const getModuleLessons = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.lessons || [];
};

export const getModuleLearningPoints = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.learningPoints || [];
};

export const getModuleOverviewData = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.overviewData || null;
};

export const getModuleObjective = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.objective || "";
};

export const getModuleAccordionContent = (moduleId, locale = 'es') => {
  const content = getContent(locale);
  const mod = content[moduleId];
  return mod?.accordionContent || {};
};

export default moduleContent;
