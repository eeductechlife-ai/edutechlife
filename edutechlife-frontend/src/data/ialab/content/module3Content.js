export const MODULE_3_ES = {
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
        { title: "Introducción a Google Gemini", icon: "fa-google", resources: 2, duration: "20 min" },
        { title: "Razonamiento Multimodal y Grounding", icon: "fa-layer-group", resources: 2, duration: "20 min" },
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
};

export const MODULE_3_EN = {
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
};
