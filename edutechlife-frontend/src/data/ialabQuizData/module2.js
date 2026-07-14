export const MODULE_2 = [
  {
    id: "m2q1",
    question:
      "Eres analista de datos en una startup de e-commerce. Recibes un CSV con 10,000 registros de ventas del último trimestre y necesitas identificar qué productos crecen más. También debes comparar los resultados con las tendencias actuales del mercado. ¿Cuál es la mejor estrategia combinando herramientas de ChatGPT?",
    options: [
      {
        id: "m2q1_a",
        label:
          "Usar el Intérprete de Código para analizar el CSV y Búsqueda Web para investigar tendencias del sector",
      },
      {
        id: "m2q1_b",
        label:
          "Usar Canvas para pegar los datos manualmente y DALL-E para graficarlos",
      },
      {
        id: "m2q1_c",
        label:
          "Usar solo Búsqueda Web para encontrar artículos sobre tendencias de mercado",
      },
      {
        id: "m2q1_d",
        label:
          "Usar DALL-E 3 para que genere el análisis automáticamente desde el CSV",
      },
    ],
    correctAnswer: "m2q1_a",
    topic: "Herramientas ChatGPT",
    difficulty: "medio",
    feedback:
      'El Intérprete de Código ejecuta Python sobre el CSV para cálculos y gráficos, mientras Búsqueda Web obtiene datos actuales del mercado. Combinarlos da un análisis completo. Revisa el OVA "Laboratorio: Herramientas ChatGPT".',
  },
  {
    id: "m2q2",
    question:
      "¿Qué herramienta de ChatGPT deberías usar para analizar un archivo Excel con datos de ventas y crear gráficos?",
    options: [
      { id: "m2q2_a", label: "DALL-E 3" },
      { id: "m2q2_b", label: "Intérprete de Código (Análisis de Datos)" },
      { id: "m2q2_c", label: "Canvas" },
      { id: "m2q2_d", label: "Búsqueda Web" },
    ],
    correctAnswer: "m2q2_b",
    topic: "Análisis de Datos",
    difficulty: "medio",
    feedback:
      'El Intérprete de Código ejecuta Python para procesar archivos y crear visualizaciones. Repasa el OVA "Laboratorio: Herramientas ChatGPT".',
  },
  {
    id: "m2q3",
    question:
      "Un despacho de abogados te pide crear un GPT personalizado que ayude a sus abogados a redactar contratos. Debe acceder a plantillas legales, verificar jurisprudencia actualizada y generar cláusulas según el caso. ¿Qué configuración es la más adecuada?",
    options: [
      {
        id: "m2q3_a",
        label:
          "System prompt con instrucciones legales detalladas + base de conocimiento con plantillas + Function Calling a base de jurisprudencia",
      },
      {
        id: "m2q3_b",
        label:
          'Solo un system prompt genérico que diga "eres un asistente legal"',
      },
      {
        id: "m2q3_c",
        label:
          "Activar Búsqueda Web y DALL-E 3 para buscar ejemplos visuales de contratos",
      },
      {
        id: "m2q3_d",
        label:
          "Un GPT sin instrucciones personalizadas, solo con análisis de datos activado",
      },
    ],
    correctAnswer: "m2q3_a",
    topic: "GPTs Personalizados",
    difficulty: "medio",
    feedback:
      'Un GPT personalizado efectivo combina: system prompt especializado, base de conocimiento con documentos relevantes y Function Calling para datos externos. Revisa el video "Crea tu Primer GPT en 18 Minutos" y la guía visual de GPTs.',
  },
  {
    id: "m2q4",
    question:
      'Tienes un GPT de atención al cliente conectado a una API de pedidos mediante Function Calling. La función registrada extrae automáticamente datos como número de pedido y email desde la conversación. Cuando un usuario escribe "¿Dónde está mi pedido #789? Mi correo es ana@ejemplo.com", ¿qué ocurre internamente?',
    options: [
      {
        id: "m2q4_a",
        label:
          "ChatGPT identifica los datos relevantes (#789, ana@ejemplo.com) y ejecuta la función automáticamente contra la API de pedidos",
      },
      {
        id: "m2q4_b",
        label:
          "El usuario debe llenar un formulario aparte con sus datos antes de recibir ayuda",
      },
      {
        id: "m2q4_c",
        label: "ChatGPT busca en internet el número de pedido para rastrearlo",
      },
      {
        id: "m2q4_d",
        label:
          "Function Calling envía el mensaje completo del usuario a la API sin procesar",
      },
    ],
    correctAnswer: "m2q4_a",
    topic: "Function Calling",
    difficulty: "difícil",
    feedback:
      'Function Calling permite que ChatGPT extraiga parámetros estructurados del lenguaje natural y ejecute funciones automáticamente. Repasa el tema "Conecta ChatGPT con el Mundo Real" y la Lección 3 del módulo.',
  },
  {
    id: "m2q5",
    question: "¿Qué permite hacer Function Calling con la API de OpenAI?",
    options: [
      { id: "m2q5_a", label: "Llamar por teléfono al soporte técnico" },
      {
        id: "m2q5_b",
        label:
          "Conectar ChatGPT con servicios externos como bases de datos, APIs del clima o sistemas de correo",
      },
      { id: "m2q5_c", label: "Crear funciones matemáticas más rápidas" },
      {
        id: "m2q5_d",
        label: "Descargar automáticamente todos los plugins disponibles",
      },
    ],
    correctAnswer: "m2q5_b",
    topic: "Function Calling",
    difficulty: "difícil",
    feedback:
      'Function Calling conecta ChatGPT con el mundo real. Repasa los recursos del tema "Conecta ChatGPT con el Mundo Real".',
  },
  {
    id: "m2q6",
    question:
      "Estás preparando una tesis y necesitas que ChatGPT recuerde tu marco teórico en cada sesión. ¿Qué función deberías usar?",
    options: [
      { id: "m2q6_a", label: "Búsqueda Web" },
      { id: "m2q6_b", label: "DALL-E 3" },
      { id: "m2q6_c", label: "Proyectos y Memoria" },
      { id: "m2q6_d", label: "Intérprete de Código" },
    ],
    correctAnswer: "m2q6_c",
    topic: "Proyectos ChatGPT",
    difficulty: "difícil",
    feedback:
      "Los Proyectos agrupan conversaciones bajo instrucciones comunes y la Memoria guarda contexto. Revisa la guía de ChatGPT.",
  },
  {
    id: "m2q7",
    question:
      "Un community manager recibe 200+ comentarios diarios en redes sociales. Muchos son preguntas frecuentes (horarios, precios, disponibilidad). Quiere automatizar las respuestas con un GPT personalizado. ¿Cuál es el flujo de trabajo más efectivo?",
    options: [
      {
        id: "m2q7_a",
        label:
          "Crear un GPT con instrucciones sobre tono de marca, subir una base de conocimiento con FAQs y conectarlo por API a la plataforma de redes sociales",
      },
      {
        id: "m2q7_b",
        label:
          "Pedirle a ChatGPT estándar que responda cada comentario manualmente uno por uno",
      },
      {
        id: "m2q7_c",
        label:
          "Configurar Búsqueda Web para que encuentre respuestas automáticas en internet",
      },
      {
        id: "m2q7_d",
        label:
          "Usar DALL-E 3 para generar imágenes que respondan visualmente los comentarios",
      },
    ],
    correctAnswer: "m2q7_a",
    topic: "Automatización",
    difficulty: "medio",
    feedback:
      'Un GPT personalizado con instrucciones y base de conocimiento, conectado por API, automatiza respuestas manteniendo consistencia. Repasa el OVA "Laboratorio: Construye un GPT" y el tema de automatización del módulo.',
  },
  {
    id: "m2q8",
    question:
      "Una empresa implementa un GPT automatizado para responder quejas de clientes en redes sociales. El GPT es rápido pero ocasionalmente da información incorrecta sobre políticas de devolución. ¿Cuál es la mejor práctica para usar la IA responsablemente en este caso?",
    options: [
      {
        id: "m2q8_a",
        label:
          "Implementar supervisión humana con alertas automáticas cuando el GPT tenga baja confianza, y auditar respuestas periódicamente",
      },
      {
        id: "m2q8_b",
        label:
          "Desactivar el GPT y que todo el equipo responda manualmente sin ayuda de IA",
      },
      {
        id: "m2q8_c",
        label:
          "Ignorar los errores porque la velocidad de respuesta es lo más importante",
      },
      {
        id: "m2q8_d",
        label:
          "Configurar el GPT para que siempre dé respuestas genéricas sin información específica",
      },
    ],
    correctAnswer: "m2q8_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    feedback:
      "La IA debe aumentar la capacidad humana, no reemplazarla sin supervisión. La mejor práctica es un sistema híbrido: IA para velocidad + supervisión humana para precisión. Revisa las buenas prácticas del módulo sobre uso responsable de IA.",
  },
  {
    id: "m2q9",
    question:
      "Un equipo de 5 vendedores quiere usar ChatGPT para mantener actualizada su base de conocimientos de productos. Cada vendedor tiene conversaciones diferentes con clientes distintos. ¿Cuál es la mejor estrategia para que todos compartan información actualizada?",
    options: [
      {
        id: "m2q9_a",
        label:
          "Crear un Proyecto compartido con instrucciones de producto y actualizar la base de conocimiento centralizada",
      },
      {
        id: "m2q9_b",
        label:
          "Cada vendedor mantiene su propio chat con las instrucciones que recuerda",
      },
      { id: "m2q9_c", label: "Usar un GPT público que todos puedan descargar" },
      {
        id: "m2q9_d",
        label:
          "Compartir capturas de pantalla de los chats por correo electrónico",
      },
    ],
    correctAnswer: "m2q9_a",
    topic: "Proyectos ChatGPT",
    difficulty: "medio",
    feedback:
      "Los Proyectos en ChatGPT permiten agrupar conversaciones bajo instrucciones y archivos compartidos. Revisa el tema de Proyectos en los recursos del módulo.",
  },
  {
    id: "m2q10",
    question:
      "Estás diseñando un GPT de atención al cliente. Quieres que pueda consultar el catálogo de productos actualizado diariamente. ¿Qué funcionalidad debes activar?",
    options: [
      {
        id: "m2q10_a",
        label:
          "Subir el catálogo como base de conocimiento y usar Actions (API) para consultar actualizaciones en tiempo real",
      },
      {
        id: "m2q10_b",
        label: "Pedir al usuario que copie y pegue el catálogo cada vez",
      },
      {
        id: "m2q10_c",
        label: "Usar DALL-E para generar imágenes del catálogo",
      },
      {
        id: "m2q10_d",
        label: "No es posible consultar datos actualizados en un GPT",
      },
    ],
    correctAnswer: "m2q10_a",
    topic: "GPTs Personalizados",
    difficulty: "difícil",
    feedback:
      'Los GPTs pueden tener base de conocimiento estática + Actions (API calls) para datos dinámicos. Esto permite consultar información actualizada en tiempo real. Revisa el tema "Conecta ChatGPT con el Mundo Real".',
  },
  {
    id: "m2q11",
    question:
      "Un GPT que creaste para tu startup está funcionando muy bien internamente. Tu socio sugiere publicarlo en la GPT Store para que otras startups también lo usen. ¿Qué consideración de privacidad debes evaluar PRIMERO?",
    options: [
      {
        id: "m2q11_a",
        label:
          "Si el GPT contiene datos sensibles de tu empresa en la base de conocimiento o en las instrucciones del sistema",
      },
      {
        id: "m2q11_b",
        label: "Si el nombre del GPT es lo suficientemente llamativo",
      },
      {
        id: "m2q11_c",
        label:
          "Si el GPT tiene suficientes funcionalidades para justificar su precio",
      },
      { id: "m2q11_d", label: "Si el logo del GPT se ve profesional" },
    ],
    correctAnswer: "m2q11_a",
    topic: "Privacidad GPT",
    difficulty: "medio",
    feedback:
      "Antes de publicar un GPT, verifica que no contenga datos confidenciales (secretos comerciales, datos de clientes, estrategias internas). Lo que funciona internamente no siempre es seguro para publicación pública. Repasa el tema de privacidad en GPTs.",
  },
  {
    id: "m2q12",
    question:
      "Quieres crear un flujo automatizado donde ChatGPT analice comentarios de redes sociales, identifique quejas urgentes y envíe notificaciones al equipo de soporte. ¿Qué combinación de herramientas necesitas?",
    options: [
      {
        id: "m2q12_a",
        label:
          "Un GPT personalizado con Actions (API) conectado a la red social + webhook al sistema de tickets del equipo",
      },
      { id: "m2q12_b", label: "ChatGPT estándar con Búsqueda Web activada" },
      {
        id: "m2q12_c",
        label: "DALL-E 3 para generar respuestas visuales automáticas",
      },
      {
        id: "m2q12_d",
        label: "Canvas para editar manualmente cada comentario",
      },
    ],
    correctAnswer: "m2q12_a",
    topic: "Automatización",
    difficulty: "difícil",
    feedback:
      "La automatización con IA requiere: un GPT preparado para la tarea + Actions (API) para conectarse a servicios externos + un webhook o API para disparar acciones. Repasa el tema de automatización y Function Calling en el módulo.",
  },
];
