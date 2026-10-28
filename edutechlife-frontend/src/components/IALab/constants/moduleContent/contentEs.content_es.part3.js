export const CONTENT_ES_PART3 = {
  3: {
    objective:
      "Afila tu lupa digital: investiga a fondo, verifica cada pista y analiza información con la precisión de un detective profesional.",
    learningPoints: [
      {
        text: "Analizar texto, imagen y código como un solo cuerpo de evidencia",
        icon: "fa-cubes",
      },
      {
        text: "Obtener pistas frescas del mundo real al instante",
        icon: "fa-signal",
      },
      {
        text: "Excavar hasta la verdad: investigaciones profundas, paso a paso, con fuentes que puedes revisar",
        icon: "fa-search",
      },
      {
        text: "Separar los hechos de las alucinaciones: verificación forense con IA",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "El Detective de Datos: Investigación de Élite con Gemini",
      description:
        "Bienvenido a la academia de detectives digitales. Aquí aprenderás a cruzar pistas en tiempo real, analizar cualquier tipo de evidencia (texto, imagen, audio, video) y verificar cada hecho con la precisión de un forense de datos.",
      mission:
        "Tu misión: convertirte en el mejor detective de datos del mundo. Domina Google Gemini para cruzar pistas, verificar cada fuente y presentar informes que cualquier director ejecutivo firmaría. Cada lección te acerca a tu insignia de detective digital.",
      topics: [
        {
          title: "El Despertar del Detective Multimodal",
          icon: "fa-google",
          resources: 3,
          duration: "20 min",
          outcome:
            "Pedirle a Gemini que lea una foto, un documento o un audio y comprobar lo que entendió.",
        },
        {
          title: "Grounding: Cuando la Evidencia Toca Tierra",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
          outcome:
            "Distinguir una respuesta con fuentes de una que solo suena bien, y abrir las fuentes para comprobarla.",
        },
        {
          title: "Deep Research: La Caja de Herramientas Forenses",
          icon: "fa-search",
          resources: 3,
          duration: "20 min",
          outcome:
            "Encargarle una investigación a Gemini y revisar su informe fuente por fuente.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "El Despertar del Detective Multimodal",
        description:
          "Gemini: tu lupa todoterreno que ve, lee y escucha a la vez",
        detailedDescription:
          "Imagina una lupa que no solo ve imágenes, sino que también lee documentos, escucha audios y analiza videos — todo al mismo tiempo. Esa es Gemini. En esta lección, aprenderás a usar este superpoder multimodal para analizar, crear y resolver casos que antes requerían 4 herramientas diferentes.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-google",
        badgeColor: "bg-blue-100 text-blue-800",
        themeColor: "#4285F4",
      },
      {
        id: 2,
        title: "Grounding: Cuando la Evidencia Toca Tierra",
        description:
          "Conecta tu lupa con la tierra firme: datos vivos del mundo real",
        detailedDescription:
          "¿De qué sirve una lupa si no puedes verificar lo que ves? El grounding (conectar la IA con fuentes verificables: la web en tiempo real y tus propios archivos de Workspace) hace que Gemini responda con datos vivos, no con conocimiento congelado. Aprende a combinar imágenes, documentos y datos en tiempo real para obtener respuestas que no solo son inteligentes — son verificables.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-teal-100 text-teal-800",
        themeColor: "#00BCD4",
      },
      {
        id: 3,
        title: "Deep Research: La Caja de Herramientas Forenses",
        description:
          "Excava hasta encontrar la verdad con herramientas de investigación profunda",
        detailedDescription:
          "Los casos más complejos requieren las herramientas más poderosas. Domina la investigación profunda con IA: Deep Research para explorar temas en su totalidad, verificación de fuentes para verificar cada fuente, y generación de informes técnicos que cualquier experto firmaría.",
        duration: "20 min",
        format: "Video",
        icon: "fa-search",
        badgeColor: "bg-indigo-100 text-indigo-800",
        themeColor: "#6366F1",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Activa tu Lupa Multimodal",
        objectiveDesc:
          "Gemini procesa texto, imágenes, audio y video como un solo lenguaje. Tu nueva arma secreta de investigación.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender cómo Gemini procesa texto, imágenes, audio y video como un solo lenguaje",
          },
          {
            icon: "fa-check",
            text: "Configurar tu arsenal: los planes de Google AI (revisa precios y modelos disponibles en la web oficial), Google AI Studio y todas las herramientas del detective",
          },
          {
            icon: "fa-check",
            text: "Saber exactamente cuándo usar Gemini vs. otros modelos — la herramienta correcta para cada caso",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Tratar a Gemini como un chatbot común — es como usar un bisturí para cortar pan",
          },
          {
            icon: "fa-times",
            text: "Ignorar su capacidad de análisis visual — la evidencia más rica suele estar en las imágenes",
          },
          {
            icon: "fa-times",
            text: "No usar el grounding — es como investigar con los ojos cerrados",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: Preguntar '¿Qué es Gemini?' — como un turista preguntando la hora",
          strong:
            "✅ Detective: Subir un gráfico financiero, pedir análisis de tendencias con correlación de datos históricos, cruzar con búsqueda en tiempo real de indicadores económicos, y recibir un informe ejecutivo listo para presentar a tu junta directiva",
        },
      },
      2: {
        objective: "🔬 Razonamiento Multimodal",
        objectiveDesc:
          "Procesa varios tipos de evidencia a la vez: texto, imágenes, audio y código. Cuatro detectives en una sola mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Analizar imágenes y documentos como un perito forense digital",
          },
          {
            icon: "fa-check",
            text: "Usar grounding para obtener datos frescos de internet — información viva, no conocimiento congelado",
          },
          {
            icon: "fa-check",
            text: "Fusionar texto, imagen, audio y código en un único análisis coherente",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Subir evidencia borrosa sin contexto — los detectives trabajan con pistas claras",
          },
          {
            icon: "fa-times",
            text: "Confiar en grounding sin verificar — hasta la mejor fuente puede equivocarse",
          },
          {
            icon: "fa-times",
            text: "No decirle a Gemini qué tipo de análisis necesitas — es como pedirle a un forense 'mira esto'",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: 'Analiza esta imagen' — sin contexto, sin instrucciones, sin dirección",
          strong:
            "✅ Detective: 'Analiza este diagrama de arquitectura como si fueras un auditor de sistemas. Identifica cada componente, traza el flujo de datos, señala vulnerabilidades de escalabilidad y compáralo con el estándar AWS 2024. Dame un informe ejecutivo de 3 párrafos con prioridades de acción.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "Para casos complejos: investigaciones profundas con fuentes verificables y verificación de fuentes.",
        achievements: [
          {
            icon: "fa-check",
            text: "Ejecutar investigaciones profundas que cruzan decenas de fuentes automáticamente",
          },
          {
            icon: "fa-check",
            text: "Verificar cada hecho al instante — tu red de seguridad contra la desinformación",
          },
          {
            icon: "fa-check",
            text: "Producir informes de nivel consultor con referencias verificables y citas exactas",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Aceptar fuentes sin verificar — hasta el mejor detective verifica dos veces",
          },
          {
            icon: "fa-times",
            text: "Conformarse con la primera respuesta — la verdad suele estar en la segunda capa",
          },
          {
            icon: "fa-times",
            text: "No contrastar con fuentes primarias — la investigación de calidad se hace con documentos originales",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: '¿Cuáles son las tendencias de IA en 2026?' — una pregunta que cualquiera puede responder con Google",
          strong:
            "✅ Detective: 'Realiza una investigación forense de las 5 tendencias principales de IA generativa en 2026. Para cada tendencia: fuente primaria verificada, datos cuantitativos de adopción empresarial, 2 casos de uso reales con nombres de empresas, riesgos identificados con nivel de criticidad, y proyección a 3 años con fuentes. Presenta como informe ejecutivo con enlaces verificables a cada fuente.'",
        },
      },
    },
  },
};
