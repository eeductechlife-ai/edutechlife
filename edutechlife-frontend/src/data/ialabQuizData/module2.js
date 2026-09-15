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
  {
    id: "m2q11",
    question: "¿Qué es ChatGPT en esencia?",
    options: [
      {
        id: "m2q11_a",
        label: "Un modelo de lenguaje conversacional que responde a tus instrucciones",
      },
      { id: "m2q11_b", label: "Una hoja de cálculo con funciones de inteligencia artificial" },
      { id: "m2q11_c", label: "Un buscador que devuelve siempre enlaces de internet" },
      { id: "m2q11_d", label: "Un programa para diseñar imágenes sin escribir nada" },
    ],
    correctAnswer: "m2q11_a",
    topic: "ChatGPT Básico",
    difficulty: "fácil",
    source: "Video: ChatGPT desde Cero en 6 Minutos",
    feedback:
      "ChatGPT es un modelo conversacional: respondes con instrucciones y genera texto. Mira el video 'ChatGPT desde Cero en 6 Minutos'.",
  },
  {
    id: "m2q12",
    question:
      "De forma predeterminada, ¿qué conviene recordar sobre la información de ChatGPT?",
    options: [
      {
        id: "m2q12_a",
        label: "Puede no estar actualizada y conviene verificar los datos críticos",
      },
      { id: "m2q12_b", label: "Siempre conoce todas las noticias del día en tiempo real" },
      { id: "m2q12_c", label: "Nunca comete errores en fechas ni en cifras exactas" },
      { id: "m2q12_d", label: "Solo responde con enlaces verificados a portales oficiales" },
    ],
    correctAnswer: "m2q12_a",
    topic: "Modelos y Capacidades",
    difficulty: "fácil",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Sin herramientas de búsqueda, el conocimiento tiene una fecha de corte: verifica lo importante. Repasa la Guía Completa de ChatGPT.",
  },
  {
    id: "m2q13",
    question: "¿Para qué tarea es más apropiado activar la Búsqueda Web?",
    options: [
      {
        id: "m2q13_a",
        label: "Para consultar noticias, precios o datos recientes del mercado hoy",
      },
      { id: "m2q13_b", label: "Para generar una imagen decorativa desde una descripción" },
      { id: "m2q13_c", label: "Para hacer cálculos con un archivo de ventas local" },
      { id: "m2q13_d", label: "Para crear un GPT personalizado con acciones propias" },
    ],
    correctAnswer: "m2q13_a",
    topic: "Búsqueda Web",
    difficulty: "medio",
    source: "OVA: Explora el Ecosistema ChatGPT",
    feedback:
      "La Búsqueda Web trae información actualizada de internet. Explora el OVA 'Explora el Ecosistema ChatGPT'.",
  },
  {
    id: "m2q14",
    question: "Tienes un CSV y necesitas calcular promedios y tendencias. ¿Qué usas?",
    options: [
      {
        id: "m2q14_a",
        label: "El Intérprete de Código, que ejecuta el análisis sobre el archivo",
      },
      { id: "m2q14_b", label: "La Búsqueda Web para leer artículos sobre el sector" },
      { id: "m2q14_c", label: "DALL-E 3 para convertir el CSV en una imagen de barras" },
      { id: "m2q14_d", label: "Canvas para reescribir cada fila del archivo a mano" },
    ],
    correctAnswer: "m2q14_a",
    topic: "Intérprete de Código",
    difficulty: "medio",
    source: "OVA: Laboratorio de Herramientas ChatGPT",
    feedback:
      "El Intérprete de Código ejecuta el cálculo sobre el archivo. Practica en el laboratorio de herramientas ChatGPT.",
  },
  {
    id: "m2q15",
    question: "Necesitas una imagen ilustrativa para una publicación. ¿Qué herramienta usas?",
    options: [
      {
        id: "m2q15_a",
        label: "DALL-E 3, describiendo la escena que quieres generar",
      },
      { id: "m2q15_b", label: "El Intérprete de Código, escribiendo una fórmula nueva" },
      { id: "m2q15_c", label: "La Búsqueda Web, para copiar cualquier imagen del portal" },
      { id: "m2q15_d", label: "Un Proyecto, agrupando los archivos del equipo del área" },
    ],
    correctAnswer: "m2q15_a",
    topic: "DALL-E",
    difficulty: "medio",
    source: "OVA: Laboratorio de Herramientas ChatGPT",
    feedback:
      "DALL-E 3 genera imágenes a partir de una descripción detallada. Revisa el laboratorio de herramientas.",
  },
  {
    id: "m2q16",
    question:
      "Quieres editar un texto largo resaltando cambios sin perder la versión original. ¿Qué usas?",
    options: [
      {
        id: "m2q16_a",
        label: "Canvas, que permite editar y reescribir sobre un lienzo de trabajo",
      },
      { id: "m2q16_b", label: "DALL-E 3, para convertir el texto en una imagen completa" },
      { id: "m2q16_c", label: "La Búsqueda Web, para encontrar el mismo texto publicado" },
      { id: "m2q16_d", label: "El Intérprete de Código, para borrar el párrafo original" },
    ],
    correctAnswer: "m2q16_a",
    topic: "Canvas",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Canvas es el lienzo para escribir y editar textos y código con control de cambios. Repasa la Guía Completa de ChatGPT.",
  },
  {
    id: "m2q17",
    question: "¿Para qué sirve un Proyecto en ChatGPT?",
    options: [
      {
        id: "m2q17_a",
        label: "Para agrupar conversaciones, archivos e instrucciones de un trabajo",
      },
      { id: "m2q17_b", label: "Para publicar un GPT en la tienda oficial de la plataforma" },
      { id: "m2q17_c", label: "Para generar imágenes con estilo consistente de marca" },
      { id: "m2q17_d", label: "Para conectarse a internet con la Búsqueda Web activada" },
    ],
    correctAnswer: "m2q17_a",
    topic: "Proyectos ChatGPT",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Los Proyectos reúnen contexto y archivos para trabajar de forma continua. Repasa la Guía Completa de ChatGPT.",
  },
  {
    id: "m2q18",
    question: "Quieres que ChatGPT analice un PDF que tienes en tu equipo. ¿Qué haces?",
    options: [
      {
        id: "m2q18_a",
        label: "Subes el archivo a la conversación y le pides trabajar sobre él",
      },
      { id: "m2q18_b", label: "Transcribes a mano todo el PDF dentro del mensaje" },
      { id: "m2q18_c", label: "Le pides que lo busque en internet y lo resuma solo" },
      { id: "m2q18_d", label: "Le pides que dibuje el PDF con la herramienta DALL-E" },
    ],
    correctAnswer: "m2q18_a",
    topic: "Archivos",
    difficulty: "fácil",
    source: "Video: ChatGPT desde Cero en 6 Minutos",
    feedback:
      "Puedes adjuntar archivos y trabajar sobre ellos. Repasa el video de introducción a ChatGPT.",
  },
  {
    id: "m2q19",
    question:
      "El Intérprete de Código te da una gráfica de ventas. ¿Cuál es el paso más responsable?",
    options: [
      {
        id: "m2q19_a",
        label: "Revisar que los datos y el cálculo correspondan a tu archivo real",
      },
      { id: "m2q19_b", label: "Publicar la gráfica sin revisar porque la hizo el código" },
      { id: "m2q19_c", label: "Asumir que cualquier resultado del código es correcto" },
      { id: "m2q19_d", label: "Cambiar los ejes hasta que la gráfica se vea mejor" },
    ],
    correctAnswer: "m2q19_a",
    topic: "Análisis de Datos",
    difficulty: "difícil",
    source: "OVA: Laboratorio de Herramientas ChatGPT",
    feedback:
      "Verifica entradas, supuestos y resultados antes de decidir con ellos. Revisa el laboratorio de herramientas.",
  },
  {
    id: "m2q20",
    question:
      "Debes comparar tu CSV con tendencias actuales del sector. ¿Qué combinación es la mejor?",
    options: [
      {
        id: "m2q20_a",
        label: "Intérprete de Código para el CSV y Búsqueda Web para las tendencias",
      },
      { id: "m2q20_b", label: "DALL-E 3 para graficar y Canvas para buscar en internet" },
      { id: "m2q20_c", label: "Un Proyecto vacío, sin archivos ni instrucciones concretas" },
      { id: "m2q20_d", label: "Solo Búsqueda Web, ignorando por completo tus propios datos" },
    ],
    correctAnswer: "m2q20_a",
    topic: "Herramientas ChatGPT",
    difficulty: "medio",
    source: "OVA: Flujos de Automatización en el Mundo Real",
    feedback:
      "Combina herramientas: los datos locales con el Intérprete de Código y el contexto actual con Búsqueda Web.",
  },
  {
    id: "m2q21",
    question: "¿Qué es un GPT personalizado?",
    options: [
      {
        id: "m2q21_a",
        label: "Una versión de ChatGPT con instrucciones, conocimiento y acciones propias",
      },
      { id: "m2q21_b", label: "Un modelo nuevo entrenado desde cero por cada estudiante" },
      { id: "m2q21_c", label: "Un buscador que solo responde sobre un tema concreto" },
      { id: "m2q21_d", label: "Un archivo PDF que se carga y responde por sí solo" },
    ],
    correctAnswer: "m2q21_a",
    topic: "GPTs Personalizados",
    difficulty: "fácil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Un GPT personalizado define su rol, su conocimiento y sus capacidades. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q22",
    question: "¿Dónde se define el rol y las reglas de un GPT personalizado?",
    options: [
      {
        id: "m2q22_a",
        label: "En sus instrucciones (system prompt), que guían su comportamiento",
      },
      { id: "m2q22_b", label: "En el color y el logo elegidos para la tienda oficial" },
      { id: "m2q22_c", label: "En la cantidad de conversaciones que acumule el usuario" },
      { id: "m2q22_d", label: "En el precio que se le asigne dentro de la tienda" },
    ],
    correctAnswer: "m2q22_a",
    topic: "Instrucciones GPT",
    difficulty: "medio",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Las instrucciones (rol, tono y reglas) definen cómo responde el GPT. Revisa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q23",
    question: "Un GPT debe responder con políticas internas de la empresa. ¿Qué configuras?",
    options: [
      {
        id: "m2q23_a",
        label: "Una base de conocimiento con esos documentos y reglas internas",
      },
      { id: "m2q23_b", label: "Solo un tono amable, sin ninguna fuente de información" },
      { id: "m2q23_c", label: "DALL-E 3 activado para ilustrar cada respuesta posible" },
      { id: "m2q23_d", label: "Búsqueda Web, aunque las políticas no estén publicadas" },
    ],
    correctAnswer: "m2q23_a",
    topic: "Base de Conocimiento",
    difficulty: "medio",
    source: "OVA: Laboratorio: Construye un GPT",
    feedback:
      "La base de conocimiento es donde vive la información propia del GPT. Practica en el laboratorio de GPTs.",
  },
  {
    id: "m2q24",
    question:
      "Un GPT debe consultar un catálogo que cambia todos los días. ¿Qué usas?",
    options: [
      {
        id: "m2q24_a",
        label: "Actions (API) para traer los datos vivos desde el sistema externo",
      },
      { id: "m2q24_b", label: "Una base de conocimiento, aunque quede desactualizada rápido" },
      { id: "m2q24_c", label: "Instrucciones nuevas, escribiendo el catálogo a mano en el rol" },
      { id: "m2q24_d", label: "DALL-E 3, para generar imágenes de cada producto del catálogo" },
    ],
    correctAnswer: "m2q24_a",
    topic: "Actions / APIs",
    difficulty: "difícil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Para datos que cambian, las Actions (API) traen información viva. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q25",
    question: "¿Qué hace Function Calling cuando el usuario pide algo concreto?",
    options: [
      {
        id: "m2q25_a",
        label: "Extrae los parámetros necesarios y ejecuta la función definida",
      },
      { id: "m2q25_b", label: "Genera una imagen que explica la petición del usuario" },
      { id: "m2q25_c", label: "Pide al usuario que reescriba su mensaje más despacio" },
      { id: "m2q25_d", label: "Responde siempre con un texto genérico sin usar datos" },
    ],
    correctAnswer: "m2q25_a",
    topic: "Function Calling",
    difficulty: "difícil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "El modelo detecta la intención, extrae parámetros y llama a la función. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q26",
    question: "Compartes tu GPT con otras personas en la GPT Store. ¿Qué implica?",
    options: [
      {
        id: "m2q26_a",
        label: "Definir quién puede usarlo y si guarda información sensible",
      },
      { id: "m2q26_b", label: "Perder el acceso a tus conversaciones anteriores del chat" },
      { id: "m2q26_c", label: "Que el GPT deje de admitir archivos en sus respuestas" },
      { id: "m2q26_d", label: "Que se borren automáticamente las Actions creadas" },
    ],
    correctAnswer: "m2q26_a",
    topic: "GPT Store",
    difficulty: "medio",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Antes de compartir, decide el alcance y protege datos sensibles. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q27",
    question:
      "Vas a publicar un GPT que construiste con datos del trabajo. ¿Qué revisas primero?",
    options: [
      {
        id: "m2q27_a",
        label: "Que no exponga información confidencial de la empresa ni de clientes",
      },
      { id: "m2q27_b", label: "Que su nombre sea corto y fácil de recordar por todos" },
      { id: "m2q27_c", label: "Que incluya la mayor cantidad de capacidades posibles" },
      { id: "m2q27_d", label: "Que su descripción tenga muchas palabras clave de moda" },
    ],
    correctAnswer: "m2q27_a",
    topic: "Privacidad GPT",
    difficulty: "medio",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Lo primero es no filtrar datos confidenciales. Repasa el tema de privacidad de GPTs.",
  },
  {
    id: "m2q28",
    question:
      "Quieres que tu GPT responda solo sobre un tema y no invente en otros. ¿Qué haces?",
    options: [
      {
        id: "m2q28_a",
        label: "Acotas su alcance y sus fuentes, y le indicas decir 'no sé' si aplica",
      },
      { id: "m2q28_b", label: "Le pides responder con seguridad sobre cualquier tema posible" },
      { id: "m2q28_c", label: "Activas todas las capacidades para que improvise si falta dato" },
      { id: "m2q28_d", label: "Le indicas completar los huecos con información aproximada" },
    ],
    correctAnswer: "m2q28_a",
    topic: "Alcance del GPT",
    difficulty: "fácil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Acotar el alcance y permitir 'no sé' reduce las alucinaciones. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q29",
    question:
      "Un GPT de atención debe responder con el tono de la marca. ¿Qué configuras?",
    options: [
      {
        id: "m2q29_a",
        label: "Instrucciones de tono y estilo, con ejemplos de respuestas de marca",
      },
      { id: "m2q29_b", label: "Solo la Búsqueda Web, para copiar el tono de otros sitios" },
      { id: "m2q29_c", label: "DALL-E 3, para que las respuestas incluyan siempre imágenes" },
      { id: "m2q29_d", label: "Nada: el tono se ajusta solo según el primer mensaje" },
    ],
    correctAnswer: "m2q29_a",
    topic: "Instrucciones GPT",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Define tono, reglas y ejemplos en las instrucciones para mantener la voz de la marca.",
  },
  {
    id: "m2q30",
    question: "Después de crear tu GPT, ¿cuál es un buen siguiente paso?",
    options: [
      {
        id: "m2q30_a",
        label: "Probarlo con casos reales y ajustar instrucciones o conocimiento",
      },
      { id: "m2q30_b", label: "Publicarlo de inmediato sin hacer ninguna prueba previa" },
      { id: "m2q30_c", label: "Eliminar las reglas, porque limitan sus respuestas libres" },
      { id: "m2q30_d", label: "Añadir capacidades nuevas aunque no aporten a la tarea" },
    ],
    correctAnswer: "m2q30_a",
    topic: "Iteración de GPT",
    difficulty: "medio",
    source: "OVA: Laboratorio: Construye un GPT",
    feedback:
      "Iterar con casos reales mejora el GPT. Practica en el laboratorio de construcción de GPTs.",
  },
  {
    id: "m2q31",
    question:
      "El GPT de soporte responde con mucha seguridad pero a veces se equivoca. ¿Qué haces?",
    options: [
      {
        id: "m2q31_a",
        label: "Añadir supervisión y pasos de verificación en el flujo de atención",
      },
      { id: "m2q31_b", label: "Confiar en él porque responde con un tono muy seguro" },
      { id: "m2q31_c", label: "Apagar la IA y responder todo manualmente para siempre" },
      { id: "m2q31_d", label: "Ocultar las fuentes para que el usuario no pregunte más" },
    ],
    correctAnswer: "m2q31_a",
    topic: "Uso Responsable",
    difficulty: "fácil",
    source: "Guía Completa de ChatGPT",
    feedback:
      "La seguridad del tono no garantiza acierto: agrega verificación. Repasa la Guía Completa de ChatGPT.",
  },
  {
    id: "m2q32",
    question: "Un GPT debe usar datos de clientes. ¿Qué práctica es la más adecuada?",
    options: [
      {
        id: "m2q32_a",
        label: "Minimizar y anonimizar los datos, y limitar quién puede acceder",
      },
      { id: "m2q32_b", label: "Cargar todos los datos disponibles porque ayudan al contexto" },
      { id: "m2q32_c", label: "Compartirlos en la GPT Store para mejorar el modelo global" },
      { id: "m2q32_d", label: "Guardarlos en las instrucciones para no buscarlos después" },
    ],
    correctAnswer: "m2q32_a",
    topic: "Privacidad GPT",
    difficulty: "medio",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Minimiza y anonimiza los datos y controla el acceso. Repasa el tema de privacidad de GPTs.",
  },
  {
    id: "m2q33",
    question:
      "Quieres automatizar alertas de quejas urgentes sin perder control humano. ¿Cuál es el mejor diseño?",
    options: [
      {
        id: "m2q33_a",
        label: "GPT con Actions que detecta y notifica, dejando la decisión a una persona",
      },
      { id: "m2q33_b", label: "GPT que responde y resuelve todas las quejas sin supervisión" },
      { id: "m2q33_c", label: "Un GPT que solo traduce las quejas a otro idioma distinto" },
      { id: "m2q33_d", label: "Un GPT que responde con imágenes en lugar de soluciones" },
    ],
    correctAnswer: "m2q33_a",
    topic: "Automatización",
    difficulty: "difícil",
    source: "OVA: Flujos de Automatización en el Mundo Real",
    feedback:
      "Automatiza la detección y el aviso y deja la decisión clave a la persona. Repasa el OVA de automatización.",
  },
  {
    id: "m2q34",
    question:
      "Recibes muchas preguntas repetidas cada día. ¿Cómo lo automatizas mejor con un GPT?",
    options: [
      {
        id: "m2q34_a",
        label: "Instrucciones + base de conocimiento + conexión por API para responder",
      },
      { id: "m2q34_b", label: "Responder una por una usando ChatGPT estándar sin configurar" },
      { id: "m2q34_c", label: "Dejar que la Búsqueda Web conteste lo que encuentre primero" },
      { id: "m2q34_d", label: "Generar una imagen distinta para cada pregunta frecuente" },
    ],
    correctAnswer: "m2q34_a",
    topic: "Automatización",
    difficulty: "medio",
    source: "OVA: Laboratorio: Construye un GPT",
    feedback:
      "Un GPT con instrucciones, conocimiento y API automatiza lo repetitivo. Practica en el laboratorio de GPTs.",
  },
  {
    id: "m2q35",
    question: "¿Cuál es la mejor manera de pedirle algo a ChatGPT?",
    options: [
      {
        id: "m2q35_a",
        label: "Con una instrucción clara que indique tarea, contexto y formato",
      },
      { id: "m2q35_b", label: "Con una palabra suelta y confiando en que adivine bien" },
      { id: "m2q35_c", label: "Repitiendo el mismo mensaje muchas veces seguidas" },
      { id: "m2q35_d", label: "Escribiendo en mayúsculas para que entienda mejor" },
    ],
    correctAnswer: "m2q35_a",
    topic: "ChatGPT Básico",
    difficulty: "fácil",
    source: "Video: ChatGPT desde Cero en 6 Minutos",
    feedback:
      "Tarea, contexto y formato: una instrucción clara rinde mejor. Repasa el video de introducción.",
  },
  {
    id: "m2q36",
    question:
      "¿Cuál es la diferencia principal entre las herramientas integradas y un GPT personalizado?",
    options: [
      {
        id: "m2q36_a",
        label: "La herramienta resuelve tareas puntuales; el GPT reúne rol y reglas propias",
      },
      { id: "m2q36_b", label: "Ninguna: son exactamente la misma función con distinto nombre" },
      { id: "m2q36_c", label: "La herramienta es de pago y el GPT siempre es gratuito" },
      { id: "m2q36_d", label: "La herramienta genera imágenes y el GPT solo escribe código" },
    ],
    correctAnswer: "m2q36_a",
    topic: "Ecosistema ChatGPT",
    difficulty: "medio",
    source: "OVA: Explora el Ecosistema ChatGPT",
    feedback:
      "Las herramientas cubren tareas puntuales; un GPT empaqueta rol, conocimiento y acciones. Explora el ecosistema.",
  },
  {
    id: "m2q37",
    question:
      "La información de tu GPT cambia poco, pero debe estar siempre disponible. ¿Qué eliges?",
    options: [
      {
        id: "m2q37_a",
        label: "Base de conocimiento para lo estable y Actions para lo que cambia",
      },
      { id: "m2q37_b", label: "Escribir toda la información dentro de las instrucciones del rol" },
      { id: "m2q37_c", label: "Solo Búsqueda Web, ignorando los documentos internos propios" },
      { id: "m2q37_d", label: "Generar imágenes de los documentos con la herramienta DALL-E" },
    ],
    correctAnswer: "m2q37_a",
    topic: "Arquitectura del GPT",
    difficulty: "difícil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Lo estable va en la base de conocimiento; lo vivo, en Actions. Repasa la Guía de GPTs y Acciones.",
  },
  {
    id: "m2q38",
    question:
      "Un equipo quiere compartir el conocimiento de sus productos con ChatGPT. ¿Qué opción es la mejor?",
    options: [
      {
        id: "m2q38_a",
        label: "Un Proyecto compartido con archivos e instrucciones comunes al equipo",
      },
      { id: "m2q38_b", label: "Que cada persona guarde sus propias notas por separado" },
      { id: "m2q38_c", label: "Compartir capturas de pantalla de los chats por correo" },
      { id: "m2q38_d", label: "Un GPT público que cada vendedor descargue por su lado" },
    ],
    correctAnswer: "m2q38_a",
    topic: "Proyectos ChatGPT",
    difficulty: "medio",
    source: "Guía Completa de ChatGPT",
    feedback:
      "Los Proyectos comparten archivos e instrucciones con el equipo. Repasa la Guía Completa de ChatGPT.",
  },
  {
    id: "m2q39",
    question:
      "Un GPT de soporte inventa políticas que no existen. ¿Cuál es la mejor corrección?",
    options: [
      {
        id: "m2q39_a",
        label: "Anclar sus respuestas a la base de conocimiento y exigir citar la fuente",
      },
      { id: "m2q39_b", label: "Subir el tono de confianza para que responda más seguro" },
      { id: "m2q39_c", label: "Quitar la base de conocimiento para que sea más creativo" },
      { id: "m2q39_d", label: "Desactivar la verificación para que responda mucho más rápido" },
    ],
    correctAnswer: "m2q39_a",
    topic: "Alucinaciones GPT",
    difficulty: "difícil",
    source: "Guía de GPTs y Acciones",
    feedback:
      "Ancla las respuestas a las fuentes y pide citarlas para reducir invenciones. Repasa la guía de GPTs.",
  },
  {
    id: "m2q40",
    question:
      "Caso: montar un GPT de soporte que use datos vivos y derive casos complejos. ¿Cuál es el diseño más completo?",
    options: [
      {
        id: "m2q40_a",
        label: "Instrucciones + base de conocimiento + Actions por API + derivación a un humano",
      },
      { id: "m2q40_b", label: "Solo un system prompt que diga que eres un agente de soporte" },
      { id: "m2q40_c", label: "Búsqueda Web activada y ninguna fuente propia de la empresa" },
      { id: "m2q40_d", label: "DALL-E 3 para responder con imágenes en vez de soluciones" },
    ],
    correctAnswer: "m2q40_a",
    topic: "Arquitectura del GPT",
    difficulty: "difícil",
    source: "OVA: Flujos de Automatización en el Mundo Real",
    feedback:
      "El flujo ideal combina rol, conocimiento, datos vivos por API y supervisión humana. Repasa el OVA de automatización.",
  },
];
