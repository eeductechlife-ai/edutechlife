export const MODULE_2 = [
  {
    id: "m2q1",
    question:
      "Tienes un CSV de ventas y quieres hallar qué productos crecen más. ¿Qué combinación de herramientas es la más útil?",
    options: [
      {
        id: "m2q1_a",
        label:
          "Intérprete de Código para el CSV y Búsqueda Web para tendencias",
      },
      {
        id: "m2q1_b",
        label: "Canvas para pegar los datos y DALL-E para los gráficos",
      },
      {
        id: "m2q1_c",
        label: "Solo Búsqueda Web para leer artículos del mercado",
      },
      {
        id: "m2q1_d",
        label: "DALL-E 3 para analizar el archivo automáticamente",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "Herramientas ChatGPT",
    difficulty: "medio",
    source: "OVA: Laboratorio de Herramientas ChatGPT",
    feedback:
      'El Intérprete de Código analiza el CSV y Búsqueda Web trae datos del mercado. Practica en el OVA "Laboratorio: Herramientas ChatGPT".',
  },
  {
    id: "m2q2",
    question:
      "Un despacho quiere un GPT para redactar contratos con plantillas legales y jurisprudencia actualizada. ¿Qué configuración es la adecuada?",
    options: [
      {
        id: "m2q2_a",
        label: "System prompt legal + base de conocimiento + Function Calling",
      },
      {
        id: "m2q2_b",
        label: "Un system prompt que solo diga que eres un asistente legal",
      },
      {
        id: "m2q2_c",
        label: "Activar Búsqueda Web y DALL-E para buscar contratos",
      },
      {
        id: "m2q2_d",
        label: "Un GPT sin instrucciones, solo con análisis de datos",
      },
    ],
    correctAnswer: "m2q2_a",
    topic: "GPTs Personalizados",
    difficulty: "medio",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Un GPT útil combina system prompt especializado, base de conocimiento y Function Calling. Repasa la guía de GPTs y Acciones.",
  },
  {
    id: "m2q3",
    question:
      'Un GPT usa Function Calling para leer pedidos. El usuario escribe "¿Dónde va mi pedido #789, correo ana@ejemplo.com?" ¿Qué pasa internamente?',
    options: [
      {
        id: "m2q3_a",
        label: "Extrae #789 y el correo, y ejecuta la función del pedido",
      },
      { id: "m2q3_b", label: "Le pide al usuario llenar un formulario aparte" },
      { id: "m2q3_c", label: "Busca el número de pedido en internet" },
      {
        id: "m2q3_d",
        label: "Envía el mensaje completo a la API sin procesar",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "Function Calling",
    difficulty: "difícil",
    source: "OVA: Laboratorio de Herramientas ChatGPT",
    feedback:
      "Function Calling extrae parámetros y ejecuta la función. Revisa el tema de Function Calling en el módulo.",
  },
  {
    id: "m2q4",
    question: "¿Qué permite hacer Function Calling con la API de ChatGPT?",
    options: [
      {
        id: "m2q4_a",
        label: "Conectar ChatGPT con APIs, bases de datos y servicios externos",
      },
      {
        id: "m2q4_b",
        label: "Llamar por teléfono al soporte técnico del usuario",
      },
      {
        id: "m2q4_c",
        label: "Crear funciones matemáticas más rápidas en el chat",
      },
      {
        id: "m2q4_d",
        label: "Descargar automáticamente todos los plugins disponibles",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "fácil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Function Calling conecta ChatGPT con el mundo real. Repasa la guía de GPTs y Acciones.",
  },
  {
    id: "m2q5",
    question:
      "Un community manager recibe muchas preguntas frecuentes diarias. ¿Cómo las automatiza mejor con un GPT?",
    options: [
      { id: "m2q5_a", label: "GPT con tono de marca, FAQs y conexión por API" },
      { id: "m2q5_b", label: "Responder cada comentario con ChatGPT estándar" },
      {
        id: "m2q5_c",
        label: "Dejar que la Búsqueda Web responda los comentarios",
      },
      { id: "m2q5_d", label: "Generar imágenes y publicarlas como respuestas" },
    ],
    correctAnswer: "m2q5_a",
    topic: "Automatización",
    difficulty: "medio",
    source: "OVA: Laboratorio: Construye un GPT",
    feedback:
      "Un GPT con instrucciones, base de conocimiento y API automatiza respuestas. Practica en el OVA de construcción de GPTs.",
  },
  {
    id: "m2q6",
    question:
      "Un GPT de quejas da a veces datos incorrectos sobre devoluciones. ¿Cuál es la mejor práctica responsable?",
    options: [
      { id: "m2q6_a", label: "Supervisión humana y alertas cuando la IA dude" },
      { id: "m2q6_b", label: "Desactivar la IA y responder todo a mano" },
      { id: "m2q6_c", label: "Ignorar los errores por la velocidad" },
      { id: "m2q6_d", label: "Dar solo respuestas genéricas sin datos" },
    ],
    correctAnswer: "m2q6_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "La IA acelera y la persona verifica. Repasa las buenas prácticas de uso responsable del módulo.",
  },
  {
    id: "m2q7",
    question:
      "Un equipo de ventas quiere compartir conocimiento de productos actualizado. ¿Qué estrategia es la mejor?",
    options: [
      {
        id: "m2q7_a",
        label: "Un Proyecto compartido con una base de conocimiento común",
      },
      {
        id: "m2q7_b",
        label: "Que cada vendedor guarde sus propias instrucciones",
      },
      { id: "m2q7_c", label: "Usar un GPT público que todos descarguen" },
      { id: "m2q7_d", label: "Compartir capturas de chats por correo" },
    ],
    correctAnswer: "m2q7_a",
    topic: "Proyectos ChatGPT",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Los Proyectos agrupan conversaciones con instrucciones y archivos compartidos. Repasa la guía de ChatGPT.",
  },
  {
    id: "m2q8",
    question:
      "Quieres que un GPT consulte un catálogo que se actualiza a diario. ¿Qué activas?",
    options: [
      {
        id: "m2q8_a",
        label: "Base de conocimiento y Actions (API) para datos vivos",
      },
      {
        id: "m2q8_b",
        label: "Pedir al usuario que pegue el catálogo cada vez",
      },
      { id: "m2q8_c", label: "Generar imágenes del catálogo con DALL-E" },
      { id: "m2q8_d", label: "No se pueden consultar datos actualizados" },
    ],
    correctAnswer: "m2q8_a",
    topic: "GPTs Personalizados",
    difficulty: "medio",
    source: "OVA: Laboratorio: Construye un GPT",
    feedback:
      "La base de conocimiento guarda lo estático y Actions trae lo que cambia. Revisa el laboratorio de GPTs.",
  },
  {
    id: "m2q9",
    question:
      "Vas a publicar en la GPT Store un GPT que usas en tu empresa. ¿Qué revisas primero?",
    options: [
      { id: "m2q9_a", label: "Si guarda datos sensibles de tu empresa" },
      { id: "m2q9_b", label: "Si el nombre es lo bastante llamativo" },
      { id: "m2q9_c", label: "Si tiene funciones para justificar su precio" },
      { id: "m2q9_d", label: "Si su logo se ve profesional" },
    ],
    correctAnswer: "m2q9_a",
    topic: "Privacidad GPT",
    difficulty: "fácil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Antes de publicar, verifica que no contenga datos confidenciales. Repasa el tema de privacidad.",
  },
  {
    id: "m2q10",
    question:
      "Quieres que ChatGPT detecte quejas urgentes en redes y avise al soporte. ¿Qué combinación usas?",
    options: [
      {
        id: "m2q10_a",
        label: "Un GPT con Actions (API) conectado a un webhook",
      },
      { id: "m2q10_b", label: "ChatGPT estándar con la Búsqueda Web activada" },
      {
        id: "m2q10_c",
        label: "DALL-E para responder los comentarios con imágenes",
      },
      {
        id: "m2q10_d",
        label: "Canvas para revisar y editar cada comentario a mano",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "Automatización",
    difficulty: "difícil",
    source: "OVA: Flujos de Automatización en el Mundo Real",
    feedback:
      "Un GPT con Actions y un webhook automatiza el aviso. Repasa el OVA de automatización.",
  },
];
