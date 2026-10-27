export const learningObjectives = [
  "Entender qué hace ChatGPT y cómo construye una respuesta",
  "Distinguir las formas de responder: rápida o con más razonamiento",
  "Elegir la herramienta adecuada para cada tarea (búsqueda, archivos, Canvas, Proyectos)",
  "Pedir una tarea de tu día a día y revisar la respuesta antes de usarla",
];

export const furtherReading = [
  {
    title: "Centro de ayuda de OpenAI",
    url: "https://help.openai.com/",
    description:
      "Documentación oficial: funciones, planes y disponibilidad según tu cuenta.",
  },
];

export const infographicData = {
  header: {
    title: "El Plano Maestro: tu mapa de ChatGPT",
    subtitle: "De tu primer pedido a una respuesta útil",
  },
  sections: [
    {
      id: "evolution",
      title: "Cómo responde ChatGPT",
      icon: "TrendingUp",
      content:
        "ChatGPT es un asistente conversacional: lees su respuesta, la ajustas con tu siguiente mensaje y la compruebas antes de usarla.",
      details: [
        {
          title: "1 · Tu pedido",
          date: "Paso 1",
          text: "Escribes qué necesitas, para quién y en qué formato.",
          extendedText:
            "Cuanto más claro sea tu pedido, menos adivina. Ejemplo: «Ayúdame a escribir un mensaje de WhatsApp para confirmar una cita, tono amable, máximo 3 líneas».",
        },
        {
          title: "2 · Su respuesta",
          date: "Paso 2",
          text: "ChatGPT construye la respuesta pieza por pieza.",
          extendedText:
            "No busca una respuesta guardada: la construye a partir de patrones. Por eso puede sonar muy segura aunque se equivoque.",
        },
        {
          title: "3 · Tu revisión",
          date: "Paso 3",
          text: "Tú ajustas y compruebas.",
          extendedText:
            "Pide cambios pequeños («hazlo más corto») y comprueba fechas, cifras y nombres antes de usar el resultado.",
        },
      ],
    },
    {
      id: "modes",
      title: "Formas de responder",
      icon: "Cpu",
      content:
        "Según tu cuenta, ChatGPT puede ofrecer distintas formas de responder. Los nombres y las opciones cambian: revisa el selector de la tuya.",
      details: [
        {
          title: "Respuesta rápida",
          text: "Para tareas sencillas y directas.",
          extendedText:
            "Ideal para resumir un correo, proponer ideas, corregir la redacción o traducir. Prioriza la agilidad sobre el análisis profundo.",
        },
        {
          title: "Respuesta con más razonamiento",
          text: "Para tareas que requieren análisis. Tarda un poco más.",
          extendedText:
            "Útil cuando hay varios factores: comparar opciones, planear un viaje con restricciones o revisar un documento largo. Es más lenta, pero suele ser más cuidadosa.",
        },
      ],
    },
    {
      id: "tools",
      title: "La caja de herramientas",
      icon: "Wrench",
      content:
        "ChatGPT es más que un chat: trae herramientas para buscar, leer tus archivos, editar y guardar contexto. Cuáles ves depende de tu plan.",
      details: [
        {
          title: "Búsqueda web y archivos",
          icon: "Search",
          text: "Datos recientes con fuentes y lectura de tus documentos.",
          extendedText:
            "Activa la búsqueda para precios, noticias o normas vigentes y abre las fuentes. Sube un PDF o una hoja de cálculo para pedir un resumen o una tabla, y recalcula una fila a mano para comprobar.",
        },
        {
          title: "Canvas",
          icon: "Layout",
          text: "Un panel al lado del chat para editar un texto contigo.",
          extendedText:
            "En vez de regenerar todo el texto, seleccionas un párrafo y pides «hazlo más formal». Útil para documentos largos.",
        },
        {
          title: "Proyectos y memoria",
          icon: "Database",
          text: "Guardan instrucciones y archivos de un trabajo.",
          extendedText:
            "Un Proyecto reúne el contexto de un trabajo (tono, reglas, archivos) para no repetirlo en cada chat. Revisa la memoria de vez en cuando y borra lo que no quieras que guarde.",
        },
      ],
    },
    {
      id: "automation",
      title: "Aplicaciones y agentes, con tu permiso",
      icon: "Share2",
      content:
        "ChatGPT puede conectarse con otras aplicaciones y hacer tareas de varios pasos, siempre con permisos que tú apruebas.",
      details: [
        {
          title: "Conectores",
          icon: "Zap",
          text: "Permisos para que ChatGPT use tus aplicaciones.",
          extendedText:
            "Un conector es un permiso para que ChatGPT lea una herramienta tuya, como tu calendario o tus documentos. Lee qué permisos pide, concede solo los necesarios y desconecta lo que ya no uses.",
        },
        {
          title: "Agente",
          icon: "Settings",
          text: "Tareas de varios pasos con tu supervisión.",
          extendedText:
            "Le das una meta (por ejemplo, comparar tres opciones y armar una tabla). Revisas el plan, apruebas las acciones importantes y abres las fuentes antes de usar el resultado.",
        },
        {
          title: "Compartir con cuidado",
          icon: "MessageSquare",
          text: "Antes de compartir un chat, revisa qué contiene.",
          extendedText:
            "Un enlace compartido muestra toda la conversación. No incluyas datos personales de terceros, de menores ni documentos confidenciales.",
        },
      ],
    },
  ],
  quiz: {
    questions: [
      {
        question: "¿Cuándo conviene la opción de más razonamiento?",
        options: [
          {
            text: "Para tareas simples, como corregir una frase",
            score: 1,
            feedback:
              "Para eso basta la respuesta rápida: el razonamiento extra tarda más y no aporta.",
          },
          {
            text: "Cuando hay varios factores que comparar, como planear un viaje con restricciones",
            score: 3,
            feedback:
              "¡Correcto! Esa opción suele ser más cuidadosa en tareas con varios factores.",
          },
          {
            text: "Siempre, porque es mejor en todo",
            score: 1,
            feedback:
              "No siempre: es más lenta y para tareas simples no hace falta.",
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
              "La creación de imágenes es otra herramienta. Canvas es un editor al lado del chat.",
          },
          {
            text: "Conecta ChatGPT con redes sociales",
            score: 1,
            feedback: "No: Canvas no tiene que ver con redes sociales.",
          },
          {
            text: "Permite editar un documento junto al chat, en un panel lateral",
            score: 3,
            feedback:
              "¡Exacto! Puedes seleccionar un párrafo y pedir un cambio sin regenerar todo.",
          },
        ],
      },
      {
        question:
          "¿Cómo se beneficiaría un docente al usar Proyectos en ChatGPT?",
        options: [
          {
            text: "Puede guardar el plan de estudios y las guías del curso para no repetir el contexto en cada chat",
            score: 3,
            feedback:
              "¡Correcto! Un Proyecto reúne instrucciones y archivos de un trabajo.",
          },
          {
            text: "Crea exámenes automáticamente sin revisión",
            score: 1,
            feedback:
              "La IA ayuda a preparar exámenes, pero siempre requieren revisión humana.",
          },
          {
            text: "Reemplaza al docente en las clases",
            score: 1,
            feedback:
              "ChatGPT apoya, no reemplaza: el criterio del docente es irremplazable.",
          },
        ],
      },
      {
        question: "Antes de aprobar un conector, ¿qué haces?",
        options: [
          {
            text: "Leo qué permisos pide y concedo solo los necesarios",
            score: 3,
            feedback:
              "¡Correcto! Los permisos son tuyos: da el mínimo y desconecta lo que ya no uses.",
          },
          {
            text: "Apruebo todo para no repetir el trámite",
            score: 1,
            feedback: "Dar más permisos de los necesarios aumenta el riesgo.",
          },
          {
            text: "Comparto mi contraseña en el chat para que acceda",
            score: 1,
            feedback: "Nunca des contraseñas en el chat.",
          },
        ],
      },
      {
        question: "¿Cuál es la mejor forma de empezar con ChatGPT?",
        options: [
          {
            text: "Probar todas las funciones el primer día",
            score: 1,
            feedback: "Es abrumador y no sabrás qué te sirvió.",
          },
          {
            text: "Empezar con una tarea de tu día a día, revisar la respuesta y mejorarla",
            score: 3,
            feedback:
              "¡Exacto! Una tarea concreta, una revisión y un ajuste: así se aprende.",
          },
          {
            text: "Esperar a que la tecnología madure",
            score: 1,
            feedback:
              "Ya sirve para muchas tareas cotidianas; empezar ahora permite aprender poco a poco.",
          },
        ],
      },
    ],
  },
};
