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

export const moduleContent = {
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
      description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.",
      mission: "Explorar cada tema y sus recursos multimedia (videos, guías y laboratorios). Notarás que tu barra de progreso cobrará vida con cada paso que des. No te detengas: cada recurso completado te acerca un 20% más a tu certificación global. ¡El poder de las instrucciones claras está en tus manos!",
      topics: [
        { title: "Introducción a la Inteligencia Artificial Generativa", icon: "fa-brain", resources: 2, duration: "20 min" },
        { title: "¿Qué es un Prompt?", icon: "fa-comments", resources: 3, duration: "20 min" },
        { title: "Estructura Básica de un Prompt Efectivo", icon: "fa-sitemap", resources: 3, duration: "20 min" }
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
      { text: "Conectar GPT con APIs externas", icon: "fa-plug" },
      { text: "Crear tu propio GPT personalizado", icon: "fa-robot" },
      { text: "Automatizar flujos de trabajo", icon: "fa-gears" }
    ],
    overviewData: {
      title: "Desbloquea ChatGPT al Máximo",
      description: "En este módulo, desbloquearás el verdadero potencial de ChatGPT. Desde configurar prompts de sistema profesionales hasta crear GPTs personalizados que trabajan por ti.",
      mission: "Explorar cada lección y sus recursos multimedia. Cada paso te acerca a dominar la IA más usada del mundo. ¡Prepárate para llevar tus habilidades al siguiente nivel!",
      topics: [
        { title: "Fundamentos de ChatGPT y Modelos GPT", icon: "fa-brain", resources: 3, duration: "20 min" },
        { title: "System Prompts y Configuración Avanzada", icon: "fa-sliders", resources: 3, duration: "20 min" },
        { title: "Function Calling y APIs de OpenAI", icon: "fa-code", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Fundamentos de ChatGPT y Modelos GPT",
        description: "Comprende la arquitectura detrás de ChatGPT",
        detailedDescription: "Comprende la arquitectura detrás de ChatGPT y los modelos GPT. Aprende cómo funciona el entrenamiento, las diferencias entre versiones y cómo aprovechar cada modelo según tus necesidades.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-brain",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC"
      },
      {
        id: 2,
        title: "System Prompts y Configuración Avanzada",
        description: "Configura el comportamiento de tu asistente IA",
        detailedDescription: "Configura el comportamiento de tu asistente IA con System Prompts. Define tono, estilo, restricciones y capacidades para obtener respuestas consistentes y profesionales.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-sliders",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA"
      },
      {
        id: 3,
        title: "Function Calling y APIs de OpenAI",
        description: "Conecta ChatGPT con herramientas externas",
        detailedDescription: "Conecta ChatGPT con herramientas externas mediante Function Calling. Integra APIs, bases de datos y servicios para crear flujos de trabajo automatizados y potentes.",
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
        objectiveDesc: "Comprender cómo funciona ChatGPT por dentro y elegir el modelo correcto para cada tarea.",
        achievements: [
          { icon: "fa-check", text: "Entender la arquitectura de los modelos GPT" },
          { icon: "fa-check", text: "Diferenciar entre GPT-3.5, GPT-4 y modelos especializados" },
          { icon: "fa-check", text: "Seleccionar el modelo óptimo según costo y capacidad" }
        ],
        warnings: [
          { icon: "fa-times", text: "Usar el modelo más caro para todo" },
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
        objective: "🏗️ System Prompts: El Cerebro de tu Asistente",
        objectiveDesc: "Aprende a configurar el comportamiento base de ChatGPT con instrucciones de sistema que definen su personalidad y capacidades.",
        achievements: [
          { icon: "fa-check", text: "Crear System Prompts para roles específicos" },
          { icon: "fa-check", text: "Definir tono, formato y restricciones de respuesta" },
          { icon: "fa-check", text: "Usar variables dinámicas en prompts de sistema" }
        ],
        warnings: [
          { icon: "fa-times", text: "System Prompts demasiado largos o confusos" },
          { icon: "fa-times", text: "No probar el comportamiento antes de usarlo" },
          { icon: "fa-times", text: "Mezclar instrucciones contradictorias" }
        ],
        example: {
          label: "Ejemplo de System Prompt",
          weak: "❌ Débil: Sé un experto en marketing",
          strong: "✅ Fuerte: Eres un estratega de marketing digital con 10 años de experiencia en e-commerce. Responde con datos concretos, métricas y ejemplos accionables. Usa un tono profesional pero cercano. Siempre incluye al menos 3 recomendaciones prácticas."
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
      { text: "Analizar texto, imagen y código juntos", icon: "fa-layer-group" },
      { text: "Obtener datos en tiempo real", icon: "fa-satellite-dish" },
      { text: "Investigar temas a profundidad", icon: "fa-microscope" },
      { text: "Verificar información con IA", icon: "fa-shield-alt" }
    ],
    overviewData: {
      title: "Investigación de Élite con IA",
      description: "En este módulo, dominarás Google Gemini para investigación avanzada. Aprenderás a cruzar datos en tiempo real, analizar múltiples formatos y verificar información con precisión.",
      mission: "Convertirte en un investigador de élite con IA. Cada recurso completado te acerca a dominar la herramienta de investigación más potente del mercado.",
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
        description: "Descubre el poder de la IA multimodal de Google",
        detailedDescription: "Descubre el poder de la IA multimodal de Google. Gemini entiende texto, imágenes, audio y código simultáneamente. Aprende a configurar tu entorno y aprovechar sus capacidades únicas.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4"
      },
      {
        id: 2,
        title: "Razonamiento Multimodal y Grounding",
        description: "Analiza múltiples formatos con datos en tiempo real",
        detailedDescription: "Analiza múltiples formatos con datos en tiempo real. Gemini puede ver imágenes, leer documentos y buscar en internet simultáneamente para darte respuestas fundamentadas y actuales.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4"
      },
      {
        id: 3,
        title: "Deep Research y Fact-Checking con IA",
        description: "Investiga y verifica información a nivel experto",
        detailedDescription: "Investiga y verifica información a nivel experto. Aprende a usar Gemini para Deep Research, fact-checking automático y generación de informes técnicos con fuentes verificables.",
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
      { text: "Crear podcasts desde tus archivos", icon: "fa-podcast" },
      { text: "Gestionar documentación inteligente", icon: "fa-folder-open" }
    ],
    overviewData: {
      title: "Tu Laboratorio de Conocimiento IA",
      description: "En este módulo, transformarás cualquier documento en conocimiento útil. Desde resúmenes inteligentes hasta podcasts generados por IA, todo desde una sola herramienta.",
      mission: "Dominar la curaduría y síntesis de información a escala. Cada recurso completado te convierte en un experto en gestión del conocimiento con IA.",
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
        description: "Descubre tu asistente de investigación personal",
        detailedDescription: "Descubre tu asistente de investigación personal basado en tus propios documentos. NotebookLM transforma PDFs, artículos y notas en conocimiento interactivo con respuestas fundamentadas en tus fuentes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-microphone",
        badgeColor: "bg-amber-100 text-amber-800",
        themeColor: "#F59E0B"
      },
      {
        id: 2,
        title: "Curaduría de Fuentes y Síntesis de Documentos",
        description: "Selecciona, organiza y sintetiza tu conocimiento",
        detailedDescription: "Selecciona, organiza y sintetiza tu conocimiento de forma inteligente. Aprende a elegir las mejores fuentes, conectar ideas entre documentos y generar resúmenes accionables.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-book-open",
        badgeColor: "bg-green-100 text-green-800",
        themeColor: "#10B981"
      },
      {
        id: 3,
        title: "Audio Overviews y Gestión Documental con IA",
        description: "Convierte documentos en podcasts y audio",
        detailedDescription: "Convierte documentos en podcasts y audio interactivo. Genera conversaciones entre dos presentadores IA, crea resúmenes sonoros y gestiona tu biblioteca de conocimiento de forma inteligente.",
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
      { text: "Detectar sesgos algorítmicos", icon: "fa-balance-scale" },
      { text: "Conocer la regulación IA vigente", icon: "fa-gavel" },
      { text: "Proteger datos y privacidad", icon: "fa-lock" },
      { text: "Crear protocolos éticos de IA", icon: "fa-clipboard-check" }
    ],
    overviewData: {
      title: "IA Responsable: Tu Diferenciador Profesional",
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

/**
 * Helper functions
 */
export const getModuleContent = (moduleId) => {
  return moduleContent[moduleId] || null;
};

export const getModuleLessons = (moduleId) => {
  const content = moduleContent[moduleId];
  return content?.lessons || [];
};

export const getModuleLearningPoints = (moduleId) => {
  const content = moduleContent[moduleId];
  return content?.learningPoints || [];
};

export const getModuleOverviewData = (moduleId) => {
  const content = moduleContent[moduleId];
  return content?.overviewData || null;
};

export const getModuleObjective = (moduleId) => {
  const content = moduleContent[moduleId];
  return content?.objective || "";
};

export const getModuleAccordionContent = (moduleId) => {
  const content = moduleContent[moduleId];
  return content?.accordionContent || {};
};

export default moduleContent;
