export const CONTENT_ES_PART3 = {
  3: {
    objective:
      "Afila tu lupa digital: investiga con Gemini, revisa cada pista y comprueba cada dato en su fuente antes de usarlo.",
    learningPoints: [
      {
        text: "Analizar texto, imagen y código como un solo cuerpo de evidencia",
        icon: "fa-cubes",
      },
      {
        text: "Pedir respuestas con fuentes actuales de la web y abrirlas para comprobarlas",
        icon: "fa-signal",
      },
      {
        text: "Excavar hasta la verdad: investigaciones profundas, paso a paso, con fuentes que puedes revisar",
        icon: "fa-search",
      },
      {
        text: "Separar los hechos de las alucinaciones: comprobar cada dato en su fuente",
        icon: "fa-shield-alt",
      },
    ],
    overviewData: {
      title: "El Detective de Datos: Investiga y Verifica con Gemini",
      description:
        "Bienvenido a la academia de detectives digitales. Aquí aprenderás a cruzar pistas en tiempo real, analizar cualquier tipo de evidencia (texto, imagen, audio, video) y comprobar cada dato en su fuente antes de usarlo.",
      mission:
        "Tu misión: investigar como un detective de datos. Usa Google Gemini para cruzar pistas, verificar cada fuente y presentar un informe breve en el que cada dato clave tenga su fuente. Cada lección te acerca a tu insignia de detective digital.",
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
          "Imagina una lupa que no solo ve imágenes, sino que también lee documentos, escucha audios y analiza videos — todo al mismo tiempo. Esa es Gemini. En esta lección, aprenderás a pedirle que analice una foto, un documento o un audio en la misma conversación y a comprobar lo que entendió. Úsala también como tutor: que te explique, te pregunte y te ponga a practicar. A diferencia de un buscador, que te da una lista de enlaces, Gemini redacta una respuesta a tu pregunta; por eso la compruebas. Con un audio, pide la transcripción y compara con la grabación las frases que vas a citar. Dos funciones más de la app (según tu plan; revisa en tu cuenta): Canvas abre un espacio junto al chat donde editas con Gemini un documento o un código, parte por parte. Los Gems son asistentes personalizados que guardan tus instrucciones para reutilizarlas; Google los está convirtiendo en «skills» (instrucciones reutilizables), así que puede que los veas con ese nombre.",
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
          "¿De qué sirve una lupa si no puedes verificar lo que ves? El grounding (conectar la IA con fuentes verificables: la web en tiempo real y tus propios archivos de Workspace) hace que Gemini responda con datos vivos, no con conocimiento congelado. Aprende a combinar imágenes, documentos y datos en tiempo real para obtener respuestas que no solo son inteligentes — son verificables. Pídele también que te explique una fórmula de Sheets paso a paso y pruébala con un caso cuyo resultado conoces. Antes de subir datos internos, revisa la política de tu organización y anonimiza lo confidencial; declara qué partes vienen de Gemini.",
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
          "Para preguntas que necesitan muchas fuentes, Gemini tiene Deep Research: busca en muchas páginas y te entrega un informe con enlaces. Aprenderás a encargarlo, a revisar sus fuentes una por una y a convertir el resultado en un informe breve que puedas defender. Antes de empezar, Deep Research te muestra su plan de investigación: revísalo y ajústalo. Si no aparece en tu cuenta, haz el mismo pedido en una conversación normal y verifica cada fuente. Una alucinación es un dato que la IA inventa con seguridad: marca cada afirmación sin respaldo y compruébala. Presenta las proyecciones como estimaciones, con la fuente en que se basan. Para tareas de varios pasos está el agente de Gemini (en la app puede aparecer como «Task» o «Tarea», según tu idioma): te muestra los pasos que sigue, te pide confirmación antes de acciones sensibles como enviar un mensaje o comprar, y puedes detenerlo cuando quieras. Es para mayores de 18 años con un plan de pago (según tu plan; revisa en tu cuenta).",
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
          "Gemini procesa texto, imágenes, audio y video como un solo lenguaje. Una sola conversación para revisar varios tipos de evidencia.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender cómo Gemini procesa texto, imágenes, audio y video como un solo lenguaje",
          },
          {
            icon: "fa-check",
            text: "Configurar tu arsenal: en la app, el selector ofrece selección automática de modelo, Flash-Lite, Flash y Pro (según tu plan; revisa en tu cuenta) y niveles de razonamiento Bajo, Medio y Alto (por defecto, Bajo). Súbelo para problemas de varios pasos",
          },
          {
            icon: "fa-check",
            text: "Decidir cuándo te conviene Gemini y cuándo otra herramienta, según la tarea",
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
            "✅ Detective: Subir la foto de un gráfico, pedir que describa la tendencia, buscar en la web un dato actual que la explique (con su enlace) y pedir un resumen de 5 líneas que verificas antes de compartirlo",
        },
      },
      2: {
        objective: "🔬 Razonamiento Multimodal",
        objectiveDesc:
          "Procesa varios tipos de evidencia a la vez: texto, imágenes, audio y código. Cuatro detectives en una sola mente.",
        achievements: [
          {
            icon: "fa-check",
            text: "Pedir a Gemini que describa una imagen o un documento y comprobar lo que entendió",
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
            text: "Confiar en grounding sin verificar — hasta la mejor fuente puede equivocarse o estar desactualizada: revisa su fecha",
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
            "✅ Detective: 'Esta es la foto de mi factura de servicios públicos. Dame en una tabla el total, la fecha de vencimiento y el consumo del mes. Si algún dato no se lee bien, dímelo en lugar de adivinarlo.'",
        },
      },
      3: {
        objective: "🔍 Deep Research",
        objectiveDesc:
          "Para casos complejos: investigaciones profundas con fuentes verificables y verificación de fuentes. Confirma cada dato clave con una fuente independiente. Antes de citar a un autor, comprueba quién es y que el dato esté en su texto.",
        achievements: [
          {
            icon: "fa-check",
            text: "Encargar una investigación con Deep Research y revisar su plan antes de que empiece",
          },
          {
            icon: "fa-check",
            text: "Comprobar los datos clave abriendo su fuente — tu red de seguridad contra la desinformación",
          },
          {
            icon: "fa-check",
            text: "Redactar un informe breve en el que cada dato clave lleva su enlace",
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
            text: "No contrastar con fuentes primarias (quien produjo el dato, no quien lo comenta) — la investigación de calidad se hace con documentos originales",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Novato: '¿Cuáles son las tendencias de IA en 2026?' — una pregunta que cualquiera puede responder con Google",
          strong:
            "✅ Detective: 'Investiga 3 usos de la IA en colegios de Colombia en 2026. Para cada uno: qué es, un ejemplo real con su fuente y un riesgo. Cierra con una tabla y marca lo que no pudiste confirmar.'",
        },
      },
    },
  },
};
