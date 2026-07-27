export const learningObjectives = [
  "Comprender la evolución de los modelos GPT y sus capacidades",
  "Identificar los diferentes modos de operación de ChatGPT",
  "Analizar las herramientas integradas del ecosistema ChatGPT",
  "Aplicar estrategias avanzadas para optimizar el uso de la IA",
];

export const furtherReading = [
  {
    title: "OpenAI Model Reference",
    url: "https://platform.openai.com/docs/models",
    description: "Documentación oficial de todos los modelos OpenAI.",
  },
  {
    title: "ChatGPT Ecosystem Evolution",
    url: "https://openai.com/blog/",
    description:
      "Blog oficial de OpenAI con anuncios de nuevas características.",
  },
];

export const infographicData = {
  header: {
    title: "Dominando el Ecosistema ChatGPT",
    subtitle: "De la Teoría a la Acción Profesional",
  },
  sections: [
    {
      id: "evolution",
      title: "Evolución del Motor de IA (Modelos GPT)",
      icon: "TrendingUp",
      content:
        "ChatGPT se convirtió en la aplicación de más rápido crecimiento en la historia tras su lanzamiento en noviembre de 2022, alcanzando 100 Millones de Usuarios en 2 meses.",
      details: [
        {
          title: "GPT-4o",
          date: "Mayo 2024",
          text: "Multimodal omni (texto, imagen, audio).",
          extendedText:
            "Este modelo rompió las barreras de latencia. Permite interacciones de voz en tiempo real sin los retrasos típicos, puede 'ver' a través de la cámara de un smartphone y analizar el entorno instantáneamente, y procesa audio de forma nativa en lugar de convertirlo previamente a texto.",
        },
        {
          title: "GPT-5",
          date: "Agosto 2025",
          text: "Sistema optimizado, drástica reducción de alucinaciones.",
          extendedText:
            "Un salto cualitativo hacia la fiabilidad empresarial. Se enfoca en flujos de trabajo orientados a agentes (Agentic Workflows), donde la IA puede interactuar de manera más segura con bases de datos externas y cometer significativamente menos errores lógicos o inventar datos.",
        },
        {
          title: "GPT-5.5",
          date: "Abril 2026",
          text: "Razonamiento autónomo y planificación paso a paso.",
          extendedText:
            "Representa el modelo más inteligente de la década. Puede recibir un objetivo complejo (ej. 'Crea una campaña de marketing completa'), desglosarlo en tareas pequeñas, ejecutar el código necesario, corregir sus propios errores y usar múltiples herramientas web sin intervención humana constante.",
        },
      ],
    },
    {
      id: "modes",
      title: "Modos de Operación",
      icon: "Cpu",
      content:
        "La IA adapta su capacidad de procesamiento y tiempo de respuesta según la complejidad de la tarea.",
      details: [
        {
          title: "Modo Fast (Rápido)",
          text: "Respuestas instantáneas a tareas simples y directas.",
          extendedText:
            "Ideal para la productividad diaria: resumir cadenas de correos largos, generar ideas rápidas de contenido (brainstorming), redactar respuestas a clientes o corregir la gramática de un texto en segundos. Prioriza la velocidad sobre el análisis profundo.",
        },
        {
          title: "Modo Thinking (Profundo)",
          text: "Análisis detallados y decisiones estratégicas. Requiere tiempo de procesamiento.",
          extendedText:
            "La IA invierte tiempo en 'pensar' antes de escribir. Es esencial para resolver bugs de código complejos, diseñar arquitecturas de software, escribir ensayos académicos analíticos, o modelar escenarios financieros donde un error superficial sería costoso.",
        },
      ],
    },
    {
      id: "tools",
      title: "La Caja de Herramientas Integrada",
      icon: "Wrench",
      content:
        "ChatGPT evolucionó de ser un simple chatbot a convertirse en un entorno de trabajo digital (Workspace) completo.",
      details: [
        {
          title: "Búsqueda Web e Intérprete de Código",
          text: "Acceso a datos en vivo y ejecución de scripts en Python.",
          icon: "Search",
          extendedText:
            "Puedes subir un archivo Excel crudo y pedirle que limpie los datos, haga análisis estadísticos (como regresiones) y genere gráficos interactivos. La IA escribe el código Python en segundo plano, lo ejecuta y te entrega el resultado visual.",
        },
        {
          title: "Canvas: Edición Colaborativa",
          text: "Un entorno de trabajo conjunto en una ventana lateral.",
          icon: "Layout",
          extendedText:
            "En lugar de regenerar todo un texto en el chat, Canvas te abre un documento lateral. Puedes seleccionar un solo párrafo y pedir 'haz este párrafo más profesional', o editar el código directamente mientras la IA revisa tus cambios. Ideal para proyectos largos.",
        },
        {
          title: "Memoria y Proyectos",
          text: "Recuerda preferencias y organiza contextos complejos bajo 'Proyectos'.",
          icon: "Database",
          extendedText:
            "Si configuras un 'Proyecto' para Edutechlife, puedes subir el manual de marca y directrices. A partir de ahí, cualquier chat dentro de ese proyecto recordará usar tus colores, tono de voz institucional y formatos preferidos sin tener que repetirlo.",
        },
      ],
    },
    {
      id: "automation",
      title: "Conectividad y Automatización",
      icon: "Share2",
      content:
        "El verdadero poder llega al conectar tu IA con el mundo exterior y tus aplicaciones del día a día.",
      details: [
        {
          title: "Zapier",
          text: "Automatizaciones Simples e intuitivas.",
          icon: "Zap",
          extendedText:
            "Excelente para principiantes. Ejemplo: 'Cada vez que reciba un correo etiquetado como Factura en Gmail, usa la IA para extraer el monto y añádelo automáticamente a una fila en Google Sheets'.",
        },
        {
          title: "Make (Integromat)",
          text: "Flujos Complejos y potentes (1,000 operaciones/mes gratis).",
          icon: "Settings",
          extendedText:
            "Permite bifurcaciones lógicas avanzadas. Ejemplo: 'Si entra un lead por Facebook, analiza su mensaje con IA. Si está enojado, notifica en Slack urgente. Si es una duda común, envía un email automático usando el manual de la empresa'.",
        },
        {
          title: "Integración Nativa: Workspace y Slack",
          text: "Capacidad de actuar directamente sobre tus plataformas corporativas.",
          icon: "MessageSquare",
          extendedText:
            "La IA ya no vive solo en su app. Puedes usar @ChatGPT en Slack para que te resuma un hilo de 50 mensajes de tus compañeros mientras estabas en una reunión, ahorrando minutos vitales de lectura.",
        },
      ],
    },
  ],
  quiz: {
    questions: [
      {
        question: "¿Cuál es la principal ventaja del Modo Thinking de ChatGPT?",
        options: [
          {
            text: "Respuestas más rápidas que el modo normal",
            score: 1,
            feedback:
              "El modo Thinking prioriza profundidad, no velocidad. Está diseñado para ser más lento pero más riguroso.",
          },
          {
            text: "Análisis detallados y razonamiento paso a paso antes de responder",
            score: 3,
            feedback:
              "¡Correcto! Thinking invierte tiempo en razonar antes de responder, ideal para tareas complejas.",
          },
          {
            text: "Consume menos recursos del servidor",
            score: 1,
            feedback:
              "En realidad consume más recursos porque realiza un procesamiento más profundo antes de responder.",
          },
        ],
      },
      {
        question: "¿Qué función cumple Canvas en ChatGPT?",
        options: [
          {
            text: "Genera imágenes a partir de texto",
            score: 1,
            feedback:
              "Eso lo hace DALL-E, no Canvas. Canvas es un editor colaborativo de texto y código.",
          },
          {
            text: "Permite editar documentos de forma colaborativa en una ventana lateral",
            score: 3,
            feedback:
              "¡Exacto! Canvas abre un documento lateral donde puedes editar y la IA revisa cambios en tiempo real.",
          },
          {
            text: "Conecta ChatGPT con redes sociales",
            score: 1,
            feedback:
              "No, Canvas no tiene nada que ver con redes sociales. Es un espacio de trabajo colaborativo.",
          },
        ],
      },
      {
        question:
          "¿Cómo se beneficiaría un docente al usar la función de Proyectos en ChatGPT?",
        options: [
          {
            text: "Puede subir el plan de estudios y guías del curso para que la IA recuerde el contexto",
            score: 3,
            feedback:
              "¡Correcto! Los Proyectos permiten cargar documentos de referencia que la IA usará en todos los chats.",
          },
          {
            text: "Crea exámenes automáticamente sin revisión",
            score: 1,
            feedback:
              "La IA puede ayudar a crear exámenes, pero siempre requieren revisión humana para garantizar precisión.",
          },
          {
            text: "Reemplaza al docente en sesiones en vivo",
            score: 1,
            feedback:
              "ChatGPT es una herramienta de apoyo, no un reemplazo. El criterio del docente es irremplazable.",
          },
        ],
      },
      {
        question:
          "¿Qué diferencia principal hay entre Zapier y Make (Integromat)?",
        options: [
          {
            text: "Make permite flujos más complejos con bifurcaciones lógicas avanzadas",
            score: 3,
            feedback:
              "¡Correcto! Make ofrece bifurcaciones lógicas (if/else) y transformaciones de datos más potentes que Zapier.",
          },
          {
            text: "Zapier es más caro que Make",
            score: 1,
            feedback:
              "No necesariamente. Ambos tienen modelos de precios diferentes. Make ofrece 1,000 operaciones gratis al mes.",
          },
          {
            text: "Make solo funciona con Google Workspace",
            score: 1,
            feedback:
              "Make se integra con cientos de aplicaciones, no solo Google Workspace.",
          },
        ],
      },
      {
        question:
          "¿Cuál es la forma más eficiente de comenzar a usar IA generativa en el aula?",
        options: [
          {
            text: "Implementar la IA en todas las áreas de una vez",
            score: 1,
            feedback:
              "Implementar todo a la vez puede ser abrumador. Es mejor comenzar con un área específica.",
          },
          {
            text: "Comenzar con una tarea específica (resumir, crear material) e ir expandiendo",
            score: 3,
            feedback:
              "¡Exacto! La mejor estrategia es comenzar con una tarea concreta, dominarla, y luego expandir gradualmente.",
          },
          {
            text: "Esperar a que la tecnología madure antes de usarla",
            score: 1,
            feedback:
              "La IA ya está lo suficientemente madura para muchas tareas educativas. Comenzar ahora permite aprender progresivamente.",
          },
        ],
      },
    ],
  },
};

export const pricingSection = {
  title: "Planes de ChatGPT: ¿Cuál elegir según tu perfil?",
  subtitle:
    "Cada plan está diseñado para un tipo de usuario. Compara y elige el que mejor se adapte a tus necesidades.",
  plans: [
    {
      name: "Gratuito",
      price: "/tmp/agent_c_work.sh",
      period: "/mes",
      description:
        "Ideal para iniciarse en el mundo de la IA y explorar capacidades básicas.",
      features: [
        "Acceso a GPT-4o mini",
        "Límite de mensajes reducido",
        "Sin acceso a herramientas avanzadas",
        "Sin DALL-E ni navegación web",
      ],
      color: "from-gray-400 to-gray-500",
      icon: "fa-rocket",
    },
    {
      name: "ChatGPT Plus",
      price: "0",
      period: "/mes",
      description:
        "Perfecto para estudiantes y profesionales que usan IA diariamente.",
      features: [
        "Acceso completo a GPT-4o",
        "Mensajes ilimitados",
        "Acceso a DALL-E, Browse y Análisis de Datos",
        "Creación de GPTs personalizados",
        "Límite de voz y video reducido",
      ],
      popular: true,
      color: "from-corporate to-petroleum",
      icon: "fa-star",
    },
    {
      name: "ChatGPT Pro",
      price: "00",
      period: "/mes",
      description:
        "Para investigadores y profesionales que requieren capacidad de procesamiento ilimitada.",
      features: [
        "Todo lo de Plus, sin límites",
        "Acceso ilimitado a GPT-4o, o1 y o1-pro",
        "Modo de voz y video avanzado",
        "Prioridad en nuevos features",
        "Soporte prioritario",
      ],
      color: "from-amber-500 to-orange-600",
      icon: "fa-crown",
    },
  ],
};
