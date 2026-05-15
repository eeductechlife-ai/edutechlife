/**
 * courseKnowledge.js
 * 
 * Base de conocimiento consolidada de todo el curso IALab.
 * Utilizada por Valerio para responder preguntas de los estudiantes
 * con contexto real del contenido del curso.
 * 
 * Generado automáticamente desde moduleContent.js + moduleResources.js
 */

const COURSE_KNOWLEDGE = [
  {
    id: 1,
    title: "Ingeniería de Prompts",
    objective: "Desarrolla habilidades de prompt engineering para obtener resultados precisos de la IA en contextos reales.",
    description: "En este módulo, hemos diseñado una ruta estratégica que te llevará desde los fundamentos de la Inteligencia Artificial Generativa hasta la creación de instrucciones de alto impacto.",
    challenge: "¡Llegó el momento de la práctica! Aplica todo lo aprendido en este módulo resolviendo un caso real. Atrévete a consolidar tu aprendizaje, supera el reto y lleva tus conocimientos al siguiente nivel.",
    topics: [
      {
        title: "Introducción a la Inteligencia Artificial Generativa",
        description: "Conceptos básicos, historia y aplicaciones prácticas de la inteligencia artificial generativa en el mundo moderno.",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender qué es la IA Generativa y cómo funciona",
          "Diferenciar entre IA débil (narrow) y IA fuerte (general)",
          "Identificar aplicaciones prácticas en educación y negocios",
          "Reconocer los límites éticos y técnicos actuales"
        ],
        resources: [
          { type: "video", title: "Explicación Visual: Anatomía de un Prompt", duration: "6:06" },
          { type: "ova", title: "Laboratorio: Ética en la I.A.", estimatedTime: "10 minutos" }
        ]
      },
      {
        title: "¿Qué es un Prompt?",
        description: "Un prompt es la instrucción o mensaje que le damos a la IA para que realice una tarea específica. Es la clave para comunicarnos efectivamente con modelos como ChatGPT.",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender qué es un prompt y cómo usarlo para comunicarte efectivamente con la IA"
        ],
        resources: [
          { type: "video", title: "Video Introductorio: ¿Qué es la IA Generativa?", duration: "4:30" },
          { type: "pdf", title: "Guía: Anatomía de un Prompt", pages: 12 },
          { type: "ova", title: "Infografía Interactiva: Prompt Engineering" }
        ]
      },
      {
        title: "Estructura Básica de un Prompt Efectivo",
        description: "Patrones y estructuras probadas para crear prompts que generen respuestas precisas y útiles.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Aplicar la estructura ROL-TAREA-FORMATO-CONTEXTO",
          "Utilizar delimitadores y marcadores de sección",
          "Incorporar ejemplos de few-shot learning",
          "Ajustar el nivel de detalle según el objetivo"
        ],
        resources: [
          { type: "video", title: "Tutorial: Construyendo Prompts Paso a Paso", duration: "9:45" },
          { type: "document", title: "Plantillas de Estructura Avanzada (JSON)" },
          { type: "document", title: "Case Study: Prompt para Análisis de Datos" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Potencia ChatGPT",
    objective: "Domina ChatGPT a nivel profesional: crea asistentes inteligentes, automatiza tareas y multiplica tu productividad.",
    description: "Conviértete en un experto en ChatGPT: configura prompts profesionales, crea GPTs personalizados y automatiza tu trabajo diario.",
    challenge: "Estructura un GPT para análisis de mercados cuánticos.",
    topics: [
      {
        title: "Guía Completa de ChatGPT",
        description: "Recurso integral de Edutechlife que cubre todos los aspectos de ChatGPT: desde la interfaz básica hasta técnicas avanzadas de prompt engineering y automatización.",
        difficulty: "Principiante",
        learningObjectives: [
          "Navegar eficientemente por la interfaz de ChatGPT",
          "Configurar conversaciones para diferentes propósitos",
          "Aplicar técnicas de prompt engineering específicas para ChatGPT"
        ],
        resources: [
          { type: "video", title: "Tutorial: Primeros Pasos con ChatGPT", duration: "5:43" },
          { type: "pdf", title: "Guía Completa de ChatGPT", pages: 25 },
          { type: "ova_interactive", title: "Dominando el Ecosistema ChatGPT" }
        ]
      },
      {
        title: "Plantillas de Flujos de Trabajo",
        description: "Descubre las herramientas integradas de ChatGPT y aprende a crear flujos de trabajo automatizados que potencien tu productividad.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Identificar las 5 herramientas clave del ecosistema ChatGPT",
          "Seleccionar la herramienta correcta según el tipo de tarea",
          "Combinar múltiples herramientas en flujos de trabajo eficientes"
        ],
        resources: [
          { type: "pdf", title: "Las Herramientas Integradas de ChatGPT", pages: 20 },
          { type: "ova_interactive", title: "Simulador: Crea tu Primer Flujo" }
        ]
      },
      {
        title: "Function Calling y APIs de OpenAI",
        description: "Descubre cómo crear y usar GPTs personalizados y acciones para automatizar tareas complejas con APIs externas.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Crear GPTs personalizados para necesidades específicas",
          "Configurar acciones para conectar con APIs externas",
          "Compartir y utilizar GPTs de la comunidad"
        ],
        resources: [
          { type: "video", title: "Tutorial: Creando tu Primer GPT", duration: "18:45" },
          { type: "image", title: "Guía de GPTs y Acciones" },
          { type: "ova", title: "Laboratorio: Construye un GPT" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Rastreo Profundo con Gemini",
    objective: "Domina Google Gemini para investigar, verificar datos y analizar información como un profesional de élite.",
    description: "Domina Google Gemini: investiga a fondo, cruza datos en tiempo real, analiza múltiples formatos y verifica información como un profesional.",
    challenge: "Genera una comparativa técnica de latencia entre arquitecturas IA.",
    topics: [
      {
        title: "Introducción a Google Gemini",
        description: "Conoce Gemini, la IA multimodal de Google capaz de procesar texto, imágenes, audio y video simultáneamente.",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender las capacidades multimodales de Gemini",
          "Utilizar Gemini con diferentes tipos de entrada",
          "Comparar Gemini con otros modelos de IA"
        ],
        resources: [
          { type: "video", title: "Introducción a Gemini", duration: "14:10" },
          { type: "pdf", title: "Manual de Gemini", pages: 16 },
          { type: "ova", title: "Laboratorio: Experimenta con Multimodalidad" }
        ]
      },
      {
        title: "Razonamiento Multimodal y Grounding",
        description: "Aprende a integrar Gemini en Google Docs, Sheets, Gmail y otras herramientas de Workspace.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Usar Gemini dentro de Google Docs para redacción",
          "Analizar datos con Gemini en Google Sheets",
          "Gestionar correos electrónicos con Gemini en Gmail"
        ],
        resources: [
          { type: "video", title: "Gemini + Google Workspace: Tutorial Completo", duration: "20:15" },
          { type: "document", title: "Plantillas para Google Workspace" },
          { type: "ova", title: "Simulador: Workspace con Gemini" }
        ]
      },
      {
        title: "Deep Research y Fact-Checking con IA",
        description: "Casos reales de uso profesional de Gemini en marketing, programación, educación e investigación.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Aplicar Gemini en estrategias de marketing",
          "Usar Gemini para asistencia en programación",
          "Implementar Gemini en procesos educativos"
        ],
        resources: [
          { type: "video", title: "Casos de Éxito con Gemini", duration: "16:30" },
          { type: "pdf", title: "Guía de Casos de Uso", pages: 24 },
          { type: "ova", title: "Laboratorio: Casos Prácticos" }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Inmersión NotebookLM",
    objective: "Transforma PDFs y documentos en resúmenes inteligentes, podcasts y asistentes de investigación personalizados.",
    description: "Descubre cómo convertir tus PDFs y apuntes en conocimiento interactivo. Crea resúmenes automáticos, podcasts generados por IA y asistentes de investigación personalizados.",
    challenge: "Genera un podcast analizando 5 papers sobre neuro-plasticidad.",
    topics: [
      {
        title: "¿Qué es NotebookLM y para qué sirve?",
        description: "Descubre NotebookLM, la herramienta de Google para investigación asistida por IA con fuentes personalizadas.",
        difficulty: "Principiante",
        learningObjectives: [
          "Crear notebooks con fuentes personalizadas",
          "Hacer preguntas específicas sobre tus documentos",
          "Generar resúmenes inteligentes de contenido"
        ],
        resources: [
          { type: "video", title: "Primeros Pasos con NotebookLM", duration: "12:30" },
          { type: "pdf", title: "Guía de NotebookLM", pages: 14 },
          { type: "ova", title: "Laboratorio: Crea tu Notebook" }
        ]
      },
      {
        title: "Curaduría de Fuentes y Síntesis de Documentos",
        description: "Aprende a generar resúmenes, FAQ y briefings conectados a tus fuentes originales.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Generar resúmenes ejecutivos automáticos",
          "Crear FAQs basadas en tus documentos",
          "Conectar respuestas a fuentes originales"
        ],
        resources: [
          { type: "video", title: "Resúmenes Inteligentes con NotebookLM", duration: "3:33" },
          { type: "document", title: "Plantillas de Resumen" },
          { type: "ova", title: "Simulador: Análisis de Documentos" }
        ]
      },
      {
        title: "Audio Overviews y Gestión Documental con IA",
        description: "Explora la función de Audio Overview que convierte tus notas en conversaciones de podcast generadas por IA.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Generar Audio Overviews de tus notebooks",
          "Personalizar el estilo y tono del audio",
          "Usar audio para aprendizaje y repaso"
        ],
        resources: [
          { type: "video", title: "Audio Overview: Tu Contenido en Podcast", duration: "10:50" },
          { type: "pdf", title: "Guía de Audio Overview", pages: 10 },
          { type: "ova", title: "Laboratorio: Crea tu Podcast IA" }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Ética Aplicada a IA Generativa",
    objective: "Aprende a usar la IA de forma responsable, ética y legal con frameworks que las empresas exigen hoy.",
    description: "En este módulo final, desarrollarás pensamiento crítico sobre los impactos éticos de la IA. Aprenderás a identificar sesgos, cumplir regulaciones y crear frameworks de IA responsable.",
    challenge: "Propón una automatización integral para una industria local de alto nivel.",
    topics: [
      {
        title: "Ética en la Inteligencia Artificial",
        description: "Fundamentos éticos para el uso de IA generativa: transparencia, equidad, responsabilidad y privacidad.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Comprender los principios éticos fundamentales de la IA",
          "Identificar dilemas éticos en casos reales",
          "Aplicar un checklist ético antes de usar IA"
        ],
        resources: [
          { type: "video", title: "Sesgos en IA: Explicación y Ejemplos", duration: "12:15" },
          { type: "pdf", title: "Guía de Detección de Sesgos", pages: 15 },
          { type: "ova", title: "Laboratorio: Detecta el Sesgo" }
        ]
      },
      {
        title: "Sesgos Algorítmicos y Equidad",
        description: "Estrategias prácticas para proteger tus datos personales y corporativos al usar herramientas de IA.",
        difficulty: "Intermedio",
        learningObjectives: [
          "Comprender cómo las IA procesan tus datos",
          "Identificar riesgos de privacidad",
          "Aplicar mejores prácticas de protección"
        ],
        resources: [
          { type: "video", title: "Privacidad y IA: Lo que Debes Saber", duration: "14:40" },
          { type: "pdf", title: "Manual de Privacidad en IA", pages: 20 },
          { type: "ova", title: "Simulador: Evaluación de Riesgos" }
        ]
      },
      {
        title: "Privacidad, Regulación y IA Responsable",
        description: "Marco ético para el uso responsable de IA en educación, trabajo y vida personal.",
        difficulty: "Avanzado",
        learningObjectives: [
          "Aplicar principios éticos al usar IA",
          "Reconocer usos inapropiados de IA",
          "Promover transparencia en el uso de IA"
        ],
        resources: [
          { type: "video", title: "IA Ética: Principios y Práctica", duration: "16:25" },
          { type: "pdf", title: "Código de Ética para Uso de IA", pages: 18 },
          { type: "ova", title: "Laboratorio: Dilemas Éticos" }
        ]
      }
    ]
  }
];

export default COURSE_KNOWLEDGE;
