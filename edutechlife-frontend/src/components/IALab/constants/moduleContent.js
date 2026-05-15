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
      description: "Aprende a comunicarte con la IA como un profesional. Desde los fundamentos hasta técnicas avanzadas que transformarán tu forma de trabajar.",
      mission: "Completa cada lección y recurso multimedia (videos, guías y laboratorios). Cada paso que des te acerca un 20% más a tu certificación. ¡Las instrucciones claras son tu superpoder!",
      topics: [
        { title: "IA Generativa: Tu Primer Paso", icon: "fa-brain", resources: 2, duration: "20 min" },
        { title: "¿Qué es un Prompt y Cómo Dominarlo?", icon: "fa-comments", resources: 3, duration: "20 min" },
        { title: "La Estructura Secreta de un Buen Prompt", icon: "fa-sitemap", resources: 3, duration: "20 min" }
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
        { title: "ChatGPT de la A a la Z", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "Automatiza tu Trabajo con IA", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Conecta ChatGPT con el Mundo Real", icon: "fa-code", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "ChatGPT de la A a la Z",
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
        title: "Automatiza tu Trabajo con IA",
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
        title: "Conecta ChatGPT con APIs Externas",
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
        { title: "Gemini: La IA que Ve, Lee y Escucha", icon: "fa-google", resources: 3, duration: "20 min" },
        { title: "Imágenes + Texto + Datos en Vivo", icon: "fa-layer-group", resources: 3, duration: "20 min" },
        { title: "Investiga como un Detective Digital", icon: "fa-search", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Gemini: La IA que Ve, Lee y Escucha",
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
        title: "Imágenes + Texto + Datos en Vivo",
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
        title: "Investiga como un Detective Digital",
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
        { title: "¿Qué es NotebookLM?", icon: "fa-microphone", resources: 3, duration: "20 min" },
        { title: "Organiza tu Investigación como un Pro", icon: "fa-book-open", resources: 3, duration: "20 min" },
        { title: "De PDF a Podcast en un Clic", icon: "fa-podcast", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "¿Qué es NotebookLM?",
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
        title: "Organiza tu Investigación como un Pro",
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
        title: "De PDF a Podcast en un Clic",
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
        { title: "Ética en IA: Lo Esencial", icon: "fa-balance-scale", resources: 3, duration: "20 min" },
        { title: "¿Es Justa tu IA? Descúbrelo", icon: "fa-exclamation-triangle", resources: 3, duration: "20 min" },
        { title: "Protege tus Datos en la Era de la IA", icon: "fa-shield-alt", resources: 3, duration: "20 min" }
      ]
    },
    lessons: [
      {
        id: 1,
        title: "Ética en IA: Lo Esencial",
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
        title: "¿Es Justa tu IA? Descúbrelo",
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
        title: "Protege tus Datos en la Era de la IA",
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
