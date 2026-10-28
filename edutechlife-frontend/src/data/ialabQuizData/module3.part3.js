export const MODULE_3_PART3 = [
  {
    id: "m3q29",
    question:
      "Necesitas que Gemini responda con los acuerdos del acta que guardaste en tu Drive. ¿Qué haces?",
    options: [
      {
        id: "m3q29_a",
        label: "Le doy el acta y pido que responda con ella",
      },
      {
        id: "m3q29_b",
        label: "Le pido que busque en la web actas parecidas",
      },
      {
        id: "m3q29_c",
        label: "Le cuento de memoria lo que dice el acta",
      },
      {
        id: "m3q29_d",
        label: "Le pido que responda con lo que ya sabe",
      },
    ],
    correctAnswer: "m3q29_a",
    topic: "Grounding",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "El grounding también puede usar tus propios archivos de Workspace. Si la respuesta debe salir del acta, dásela como fuente: ni la web ni la memoria del modelo conocen ese documento. Revisa en tu cuenta cómo adjuntar archivos de Drive.",
  },
  {
    id: "m3q30",
    question:
      "¿Cuál es la mejor forma de pedirle a Gemini un análisis de datos?",
    options: [
      {
        id: "m3q30_a",
        label: "Indicar los datos, el objetivo y el formato final",
      },
      {
        id: "m3q30_b",
        label: "Subir el archivo sin explicar qué necesitas de él",
      },
      {
        id: "m3q30_c",
        label: "Pedir 'analiza esto' y aceptar lo que responda",
      },
      {
        id: "m3q30_d",
        label: "Solicitar una conclusión sin mostrar los datos base",
      },
    ],
    correctAnswer: "m3q30_a",
    topic: "Análisis con Gemini",
    difficulty: "medio",
    source: "Gemini a la Práctica: Ejercicios de Campo",
    feedback:
      "Precisa datos, objetivo y formato para un análisis realmente útil. Revisa los ejercicios de campo.",
  },
  {
    id: "m3q31",
    question:
      "Gemini da dos respuestas distintas a la misma pregunta de investigación. ¿Qué haces?",
    options: [
      {
        id: "m3q31_a",
        label: "Pedir una tercera respuesta y quedarte con la que se repita",
      },
      {
        id: "m3q31_b",
        label: "Contrastar ambas con fuentes y decidir después",
      },
      {
        id: "m3q31_c",
        label: "Quedarte con la que cita más fuentes",
      },
      {
        id: "m3q31_d",
        label: "Pedirle a Gemini que compare sus respuestas y elija",
      },
    ],
    correctAnswer: "m3q31_b",
    topic: "Pensamiento Crítico",
    difficulty: "difícil",
    source:
      "Investigación académica con IA en minutos: Gemini y Deep Research sin perder rigor",
    feedback:
      "Dos respuestas distintas se contrastan con fuentes que tú abres. Ni la que se repite, ni la que cita más, ni la elección de Gemini prueban cuál es correcta.",
  },
  {
    id: "m3q32",
    question:
      "Vas a subir a Gemini datos internos de la empresa. ¿Qué es lo más prudente?",
    options: [
      {
        id: "m3q32_a",
        label: "Revisar la política de datos y anonimizar lo confidencial",
      },
      {
        id: "m3q32_b",
        label: "Subir todo sin revisar porque la herramienta es corporativa",
      },
      {
        id: "m3q32_c",
        label: "Subir solo lo que luego no puedas borrar del historial",
      },
      {
        id: "m3q32_d",
        label: "Compartir los accesos del sistema dentro del chat",
      },
    ],
    correctAnswer: "m3q32_a",
    topic: "Privacidad",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Revisa la política y anonimiza antes de subir datos internos. Repasa el manual de campo.",
  },
  {
    id: "m3q33",
    question: "¿Para qué conviene Deep Research y no una búsqueda normal?",
    options: [
      {
        id: "m3q33_a",
        label: "Para un tema con muchas fuentes y un informe citado",
      },
      {
        id: "m3q33_b",
        label: "Para una pregunta rápida con una sola respuesta",
      },
      {
        id: "m3q33_c",
        label: "Para generar imágenes de apoyo para el informe",
      },
      {
        id: "m3q33_d",
        label: "Para responder más rápido que cualquier búsqueda",
      },
    ],
    correctAnswer: "m3q33_a",
    topic: "Deep Research",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Deep Research reúne varias fuentes y entrega un informe con citas. Una pregunta rápida se resuelve con una búsqueda normal.",
  },
  {
    id: "m3q34",
    question:
      "Quieres que Gemini analice un gráfico de ventas que tienes en pantalla. ¿Qué haces?",
    options: [
      {
        id: "m3q34_a",
        label: "Subo una captura del gráfico y pido el análisis",
      },
      {
        id: "m3q34_b",
        label: "Le describo el gráfico con mis propias palabras",
      },
      {
        id: "m3q34_c",
        label: "Le copio solo el título y la leyenda del gráfico",
      },
      {
        id: "m3q34_d",
        label: "Le dicto las cifras que recuerdo del gráfico",
      },
    ],
    correctAnswer: "m3q34_a",
    topic: "Multimodalidad",
    difficulty: "fácil",
    source:
      "Gemini multimodal: tu lupa para imágenes, documentos, audio y video",
    feedback:
      "Gemini puede leer la imagen del gráfico directamente. Describirlo, copiar solo el título o dictar cifras de memoria deja fuera parte de la evidencia o le suma tus errores.",
  },
  {
    id: "m3q35",
    question:
      "¿Qué norma debe cumplir un trabajo académico con apoyo de Gemini?",
    options: [
      {
        id: "m3q35_a",
        label: "Declarar el uso y citar las fuentes que se consultaron",
      },
      {
        id: "m3q35_b",
        label: "Ocultar que se usó IA para evitar sospechas",
      },
      {
        id: "m3q35_c",
        label: "No citar, porque la IA ya resume todo",
      },
      {
        id: "m3q35_d",
        label: "Entregarlo tal cual, aunque el profesor no lo pida",
      },
    ],
    correctAnswer: "m3q35_a",
    topic: "Uso Responsable",
    difficulty: "fácil",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Declarar el uso y citar las fuentes consultadas es la norma honesta. Ocultar la IA o no citar no lo es.",
  },
  {
    id: "m3q36",
    question:
      "¿Cuándo conviene que Gemini consulte la web en vez de responder de memoria?",
    options: [
      {
        id: "m3q36_a",
        label: "Cuando la pregunta es un chiste sin datos",
      },
      {
        id: "m3q36_b",
        label: "Cuando depende de datos que cambian, como precios",
      },
      {
        id: "m3q36_c",
        label: "Para toda pregunta, aunque sea sobre un poema",
      },
      {
        id: "m3q36_d",
        label: "Cuando la pregunta es larga y tiene varias partes",
      },
    ],
    correctAnswer: "m3q36_b",
    topic: "Grounding",
    difficulty: "medio",
    source: "Gemini a la Práctica: Ejercicios de Campo",
    feedback:
      "Los datos que cambian requieren fuentes actuales. Que la pregunta sea larga no lo exige, y un poema o un chiste no necesitan consultar la web.",
  },
  {
    id: "m3q37",
    question:
      "Debes entregar una investigación y Deep Research no aparece en tu cuenta. ¿Qué haces?",
    options: [
      {
        id: "m3q37_a",
        label: "Uso el mismo pedido en el chat y verifico cada fuente",
      },
      {
        id: "m3q37_b",
        label: "Espero a tener Deep Research para empezar",
      },
      {
        id: "m3q37_c",
        label: "Pido en el chat un informe y lo entrego con sus citas",
      },
      {
        id: "m3q37_d",
        label: "Le pido el informe a otra IA que sí investigue",
      },
    ],
    correctAnswer: "m3q37_a",
    topic: "Deep Research",
    difficulty: "difícil",
    source: "Guía: Deep Research paso a paso",
    feedback:
      "Si Deep Research no aparece en tu cuenta, el mismo pedido funciona en la conversación normal; lo que no cambia es tu verificación de cada fuente. Esperar o entregar citas que no abriste no resuelve el caso. Repasa la Guía: Deep Research paso a paso.",
  },
  {
    id: "m3q38",
    question: "¿Qué uso de Gemini para planear un viaje es más responsable?",
    options: [
      {
        id: "m3q38_a",
        label: "Reservar sin revisar nada, solo con la respuesta de Gemini",
      },
      {
        id: "m3q38_b",
        label: "Compartir tu pasaporte para que lo guarde",
      },
      {
        id: "m3q38_c",
        label: "Consultar opciones y confirmar precios en la página oficial",
      },
      {
        id: "m3q38_d",
        label: "Evitar cualquier otro sitio web para siempre",
      },
    ],
    correctAnswer: "m3q38_c",
    topic: "Verificación de fuentes",
    difficulty: "fácil",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Gemini sirve para comparar opciones; la reserva y tus datos personales se confirman en el sitio oficial.",
  },
  {
    id: "m3q39",
    question: "¿Qué miras antes de citar a un autor en tu informe?",
    options: [
      {
        id: "m3q39_a",
        label: "Que sea identificable y el dato esté en su texto",
      },
      {
        id: "m3q39_b",
        label: "Que lo citen varios blogs del tema",
      },
      {
        id: "m3q39_c",
        label: "Que Gemini lo mencione con enlace",
      },
      {
        id: "m3q39_d",
        label: "Que tenga un cargo reconocido en una institución",
      },
    ],
    correctAnswer: "m3q39_a",
    topic: "Verificación de Fuentes",
    difficulty: "difícil",
    source: "Guía: Deep Research paso a paso",
    feedback:
      "Para citar, necesitas saber quién es el autor y encontrar el dato en su propio texto. Que lo citen blogs, que Gemini lo enlace o que tenga un cargo no prueba que el dato sea suyo.",
  },
  {
    id: "m3q40",
    question:
      "Caso: un informe con datos de un tema reciente. ¿Qué verificas antes de entregarlo?",
    options: [
      {
        id: "m3q40_a",
        label: "Que cada cifra tenga una fuente citada por Gemini",
      },
      {
        id: "m3q40_b",
        label: "Que cada cifra tenga una fuente que abriste y su fecha",
      },
      {
        id: "m3q40_c",
        label: "Que las cifras coincidan con el informe de un compañero",
      },
      {
        id: "m3q40_d",
        label: "Que las fuentes sean de los últimos cinco años",
      },
    ],
    correctAnswer: "m3q40_b",
    topic: "Investigación Profesional",
    difficulty: "difícil",
    source:
      "Investigación académica con IA en minutos: Gemini y Deep Research sin perder rigor",
    feedback:
      "En un tema reciente, cada cifra necesita una fuente que tú abriste y su fecha. Una cita de Gemini sin abrir, el informe de un compañero o un rango de años no confirman que la cifra sea correcta y vigente.",
  },
];
