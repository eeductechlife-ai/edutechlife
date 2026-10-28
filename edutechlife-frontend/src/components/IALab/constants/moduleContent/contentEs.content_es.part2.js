export const CONTENT_ES_PART2 = {
  2: {
    objective:
      "Diseña y construye sistemas inteligentes con ChatGPT: desde los cimientos hasta la automatización completa de tu trabajo diario como un verdadero arquitecto digital.",
    learningPoints: [
      {
        text: "Diseñar planos maestros con System Prompts avanzados",
        icon: "fa-sliders",
      },
      {
        text: "Crear Proyectos y usar plugins que trabajan con tu contexto",
        icon: "fa-code",
      },
      {
        text: "Organizar un Proyecto con instrucciones y archivos como módulo arquitectónico",
        icon: "fa-robot",
      },
      {
        text: "Automatizar flujos de obra completos",
        icon: "fa-cog",
      },
    ],
    overviewData: {
      title:
        "El Arquitecto Digital: ChatGPT y Automatización — Construye tu Propio Ecosistema de Trabajo",
      description:
        "Bienvenido a la obra maestra de la automatización. Aquí no solo usarás ChatGPT — construirás con él. Aprenderás a diseñar prompts de sistema como si trazaras planos, a usar herramientas integradas como andamios, a crear GPTs como módulos de construcción, a organizar Proyectos y a delegar tareas de varios pasos al agente de ChatGPT, siempre con tu supervisión.",
      mission:
        "Tu misión como arquitecto: completa cada lección y domina el arte de construir con ChatGPT. Cada estructura que diseñes te acerca a tu certificación como arquitecto de automatización. ¡Construye tu obra maestra digital!",
      topics: [
        {
          title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
          icon: "fa-book-open",
          resources: 3,
          duration: "20 min",
          outcome:
            "Pedirle a ChatGPT una tarea de tu día a día y obtener una respuesta útil a la primera.",
        },
        {
          title: "El Andamio del Arquitecto: Herramientas Integradas",
          icon: "fa-layer-group",
          resources: 3,
          duration: "20 min",
          outcome:
            "Elegir la herramienta de ChatGPT adecuada (búsqueda, archivos, imágenes o voz) y comprobar lo que te entrega.",
        },
        {
          title: "La Fachada del Edificio: GPTs, Proyectos y Agentes",
          icon: "fa-code",
          resources: 3,
          duration: "20 min",
          outcome:
            "Organizar un trabajo repetido en un Proyecto y decidir cuándo conviene un Proyecto, un plugin o un agente.",
        },
      ],
    },
    lessons: [
      {
        id: 1,
        title: "Los Planos del Arquitecto: Guía Completa de ChatGPT",
        description: "Los cimientos de toda gran construcción digital",
        detailedDescription:
          "Todo edificio comienza con un plano. En esta lección conocerás ChatGPT de punta a punta: qué modelos existen, cuándo usar cada uno y cómo escribir prompts profesionales que obtienen resultados en el primer intento. La base que necesitas antes de automatizar cualquier cosa. Nota de vigencia: OpenAI programó retirar los GPT personalizados el 11 de diciembre de 2026 (fecha sujeta a cambios) y reemplazarlos por plugins. Empieza por Proyectos y plugins, y verifica el aviso de tu cuenta. Trabaja desde ya con Proyectos y con los plugins conectados a tu cuenta.",
        duration: "20 min",
        format: "Reading",
        icon: "fa-book-open",
        badgeColor: "bg-cyan-100 text-cyan-800",
        themeColor: "#66CCCC",
      },
      {
        id: 2,
        title: "El Andamio del Arquitecto: Herramientas Integradas",
        description: "Las herramientas que levantan tu construcción digital",
        detailedDescription:
          "Un arquitecto usa las herramientas correctas para cada fase. Descubre el arsenal completo de ChatGPT: Búsqueda Web para datos actuales, Análisis de Datos con Python para procesar cifras, generación de imágenes, Canvas para editar documentos y Proyectos para organizar tu trabajo. Aprende a combinarlos en flujos que multiplican tu productividad real.",
        duration: "20 min",
        format: "Lab",
        icon: "fa-layer-group",
        badgeColor: "bg-purple-100 text-purple-800",
        themeColor: "#9333EA",
      },
      {
        id: 3,
        title: "La Fachada del Edificio: GPTs, Proyectos y Agentes",
        description: "Conecta tu obra con el mundo real",
        detailedDescription:
          "La fachada es lo que el mundo ve. Aquí construyes asistentes a tu medida: Proyectos con tus instrucciones y tu conocimiento, plugins que conectan tus herramientas y el agente de ChatGPT para tareas de varios pasos. Aprende a diseñarlos, probarlos y usarlos sin perder el control de cada decisión. Revisa la nota de vigencia de la lección 1 y considera migrar las instrucciones de un GPT a un Proyecto.",
        duration: "20 min",
        format: "Video",
        icon: "fa-code",
        badgeColor: "bg-emerald-100 text-emerald-800",
        themeColor: "#10B981",
      },
    ],
    accordionContent: {
      1: {
        objective: "🎯 Los Cimientos del Arquitecto",
        objectiveDesc:
          "Domina los fundamentos de ChatGPT: modelos, límites y técnicas profesionales de prompt engineering.",
        achievements: [
          {
            icon: "fa-check",
            text: "Comprender la arquitectura y evolución de los modelos GPT como un plano maestro",
          },
          {
            icon: "fa-check",
            text: "Aplicar técnicas de prompt engineering profesional como herramientas de construcción",
          },
          {
            icon: "fa-check",
            text: "Seleccionar el modelo óptimo según costo y capacidad (el que muestre el selector de tu cuenta)",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Usar el modelo más caro para tareas simples — como usar un martillo pilón para un cuadro",
          },
          {
            icon: "fa-times",
            text: "Ignorar los límites de contexto — como construir sin medir el terreno",
          },
          {
            icon: "fa-times",
            text: "No conocer las actualizaciones de nuevos modelos — un arquitecto ignorante construye castillos de naipes",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Aficionado: Usar el modelo más potente para todo, incluso para tareas que el modelo rápido resuelve en segundos",
          strong:
            "✅ Arquitecto: el modelo rápido para borradores y resúmenes, y el modo más potente para análisis estructurales complejos — el material correcto para cada capa de la construcción, según el selector de tu cuenta",
        },
      },
      2: {
        objective: "🏗️ El Andamio del Arquitecto",
        objectiveDesc:
          "Domina el ecosistema de herramientas de ChatGPT: Búsqueda Web, Código, generación de imágenes, Canvas y Proyectos.",
        achievements: [
          {
            icon: "fa-check",
            text: "Identificar cuándo usar cada herramienta como un arquitecto elige su herramienta precisa",
          },
          {
            icon: "fa-check",
            text: "Combinar múltiples herramientas en un solo flujo de trabajo como fases de una construcción",
          },
          {
            icon: "fa-check",
            text: "Crear automatizaciones que resuelvan problemas reales — tu obra terminada",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Pedir a la generación de imágenes un texto largo o un logo sin revisarlo — el texto dentro de las imágenes sale con errores; escríbelo en Canvas",
          },
          {
            icon: "fa-times",
            text: "Confiar en la base de entrenamiento para datos actuales — como construir con planos desactualizados",
          },
          {
            icon: "fa-times",
            text: "No organizar proyectos por objetivos específicos — como mezclar materiales de 5 obras distintas",
          },
        ],
        example: {
          label: "Ejemplo de flujo integrado",
          weak: "❌ Aislado: Pedir datos actualizados sin activar Búsqueda Web → resultado desactualizado como un edificio sin cimientos",
          strong:
            "✅ Integrado: Buscar datos actuales (Browse) → analizarlos con Python (Code Interpreter) → generar infografía (imagen) → editar en Canvas — una construcción en 4 fases perfectamente orquestadas",
        },
      },
      3: {
        objective: "🧱 La Fachada del Arquitecto",
        objectiveDesc:
          "Crea Proyectos a tu medida, con instrucciones y archivos, para que ChatGPT trabaje con tu contexto en cada tarea.",
        achievements: [
          {
            icon: "fa-check",
            text: "Crear un Proyecto con instrucciones claras, archivos propios y un objetivo definido, o un plugin conectado a tu cuenta",
          },
          {
            icon: "fa-check",
            text: "Organizar un Proyecto con archivos, instrucciones y conversaciones de un mismo trabajo",
          },
          {
            icon: "fa-check",
            text: "Usar el agente de ChatGPT en tareas de varios pasos, revisando cada paso antes de aprobarlo",
          },
        ],
        warnings: [
          {
            icon: "fa-times",
            text: "Cargar datos sensibles o de menores en un Proyecto o plugin sin revisar quién los puede ver — como dejar planos confidenciales en la calle",
          },
          {
            icon: "fa-times",
            text: "Delegar al agente decisiones que requieren tu criterio — el agente ejecuta, tú apruebas",
          },
          {
            icon: "fa-times",
            text: "Compartir un Proyecto o plugin sin probarlo con casos reales — como entregar una fachada sin inspección",
          },
        ],
        example: {
          label: "Ejemplo práctico",
          weak: "❌ Genérico: Empezar cada conversación desde cero, sin instrucciones ni archivos, y repetir el mismo contexto",
          strong:
            "✅ Fachada: Un Proyecto «Asesor de propuestas» con tu tono, tus plantillas y tus precios, que guarda los documentos de cada cliente. Cada respuesta sale con tu contexto ya cargado.",
        },
      },
    },
  },
};
