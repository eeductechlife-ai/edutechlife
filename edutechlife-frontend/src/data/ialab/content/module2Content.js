export const MODULE_2_ES = {
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
        { title: "Plantillas de Flujos de Trabajo", icon: "fa-layer-group", resources: 2, duration: "20 min" },
        { title: "Function Calling y APIs de OpenAI", icon: "fa-code", resources: 2, duration: "20 min" }
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
};

export const MODULE_2_EN = {
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
        { title: "Workflow Templates", icon: "fa-layer-group", resources: 2, duration: "20 min" },
        { title: "Function Calling and OpenAI APIs", icon: "fa-code", resources: 2, duration: "20 min" }
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
};
