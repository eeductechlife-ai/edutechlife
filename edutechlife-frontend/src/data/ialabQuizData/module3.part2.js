export const MODULE_3_PART2 = [
  {
    id: "m3q15",
    question:
      "Gemini te entrega un informe de Deep Research. ¿Qué revisas antes de usarlo?",
    options: [
      {
        id: "m3q15_a",
        label: "Solo que tenga muchas páginas y títulos",
      },
      {
        id: "m3q15_b",
        label: "Que el tono sea entusiasta y que suene seguro",
      },
      {
        id: "m3q15_c",
        label: "Que se parezca a otro informe que leíste",
      },
      {
        id: "m3q15_d",
        label: "Las fuentes: abre al menos tres que respalden las conclusiones",
      },
    ],
    correctAnswer: "m3q15_d",
    topic: "Deep Research",
    difficulty: "fácil",
    source:
      "Investigación académica con IA en minutos: Gemini y Deep Research sin perder rigor",
    feedback:
      "Un informe con fuentes se comprueba abriendo algunas. Tres fuentes que respalden las conclusiones son el criterio mínimo.",
  },
  {
    id: "m3q16",
    question:
      "Quieres un informe de Deep Research útil. ¿Qué prompt ayuda más a lograrlo?",
    options: [
      {
        id: "m3q16_a",
        label: "Indica el tema, el enfoque y qué tipo de fuentes usar",
      },
      {
        id: "m3q16_b",
        label: "Escribe solo una palabra y deja que adivine el enfoque",
      },
      {
        id: "m3q16_c",
        label: "Pide que busque sin límite de tema ni de fuentes",
      },
      {
        id: "m3q16_d",
        label: "Solicita un resumen sin pedir fuentes ni datos duros",
      },
    ],
    correctAnswer: "m3q16_a",
    topic: "Deep Research",
    difficulty: "medio",
    source: "Guía: Deep Research paso a paso",
    feedback:
      "Delimitar tema, enfoque y tipo de fuentes mejora el informe. Repasa la Guía: Deep Research paso a paso.",
  },
  {
    id: "m3q17",
    question: "¿Qué significa verificar un dato con una fuente independiente?",
    options: [
      {
        id: "m3q17_a",
        label: "Comprobarlo en una fuente que no lo copió de la primera",
      },
      {
        id: "m3q17_b",
        label: "Repetir la misma pregunta a la misma IA",
      },
      {
        id: "m3q17_c",
        label: "Buscarlo en un solo sitio del mismo autor",
      },
      {
        id: "m3q17_d",
        label: "Usar tres navegadores distintos sin leer nada",
      },
    ],
    correctAnswer: "m3q17_a",
    topic: "Verificación de Fuentes",
    difficulty: "medio",
    source: "Gemini a la Práctica: Ejercicios de Campo",
    feedback:
      "Una fuente independiente no copia a la primera. Cuando dos fuentes distintas coinciden, el dato es más firme.",
  },
  {
    id: "m3q18",
    question:
      "Tienes la foto de la pizarra, el audio de la clase y tus apuntes. ¿Cómo lo trabajas con Gemini?",
    options: [
      {
        id: "m3q18_a",
        label: "Subo los tres y pido un análisis que los cruce",
      },
      {
        id: "m3q18_b",
        label: "Pido un resumen de cada uno en chats separados",
      },
      {
        id: "m3q18_c",
        label: "Subo solo los apuntes, que son lo más claro",
      },
      {
        id: "m3q18_d",
        label: "Transcribo todo a mano y subo solo el texto",
      },
    ],
    correctAnswer: "m3q18_a",
    topic: "Multimodalidad",
    difficulty: "medio",
    source: "La Lupa a Prueba",
    feedback:
      "Gemini puede analizar imagen, audio y texto en un mismo pedido. Cruzarlos muestra lo que falta en tus apuntes o lo que no coincide. Practica en la actividad La Lupa a Prueba.",
  },
  {
    id: "m3q19",
    question:
      "Te muestran el video de una reunión. ¿Qué pides a Gemini para ubicar un acuerdo?",
    options: [
      {
        id: "m3q19_a",
        label: "Que lo publique automáticamente en internet",
      },
      {
        id: "m3q19_b",
        label: "El minuto exacto donde se dice el acuerdo",
      },
      {
        id: "m3q19_c",
        label: "Que responda por ti en la reunión",
      },
      {
        id: "m3q19_d",
        label: "Un resumen general, sin indicar dónde está cada cosa",
      },
    ],
    correctAnswer: "m3q19_b",
    topic: "Video y audio con Gemini",
    difficulty: "medio",
    source: "La Lupa Multimodal",
    feedback:
      "Pedir el minuto exacto permite revisar ese momento en el video. Un resumen sin ubicación no se puede comprobar.",
  },
  {
    id: "m3q20",
    question:
      "Tienes la foto de la etiqueta de un producto y quieres saber si su precio de hoy en tiendas en línea es razonable. ¿Qué pedido es mejor?",
    options: [
      {
        id: "m3q20_a",
        label: "Lee la etiqueta, busca precios de hoy y cita cada tienda",
      },
      {
        id: "m3q20_b",
        label: "Lee la etiqueta y estima el precio con lo que sabes",
      },
      {
        id: "m3q20_c",
        label: "Busca en la web el precio promedio de este tipo de producto",
      },
      {
        id: "m3q20_d",
        label: "Describe la etiqueta y dime si el precio te parece bueno",
      },
    ],
    correctAnswer: "m3q20_a",
    topic: "Grounding",
    difficulty: "difícil",
    source: "Grounding: respuestas que puedes comprobar",
    feedback:
      "Este caso combina las dos piezas: la imagen identifica el producto exacto y la búsqueda trae precios actuales con su fuente. Estimar de memoria o buscar un promedio genérico deja fuera una de las dos.",
  },
  {
    id: "m3q21",
    question: "¿Qué debes revisar cuando Gemini redacta en Docs por ti?",
    options: [
      {
        id: "m3q21_a",
        label: "Nada: lo que escribe la IA siempre es correcto",
      },
      {
        id: "m3q21_b",
        label: "Solo la ortografía, sin mirar las cifras",
      },
      {
        id: "m3q21_c",
        label: "Que los datos y nombres coincidan con tus fuentes",
      },
      {
        id: "m3q21_d",
        label: "Que use muchas palabras técnicas",
      },
    ],
    correctAnswer: "m3q21_c",
    topic: "Google Workspace",
    difficulty: "fácil",
    source: "La Lupa Multimodal",
    feedback:
      "Lo que redacta la IA también puede tener errores en datos y nombres. Revísalo contra tus fuentes.",
  },
  {
    id: "m3q22",
    question:
      "Una fórmula de tu hoja de Sheets da un resultado extraño. ¿Qué le pides a Gemini?",
    options: [
      {
        id: "m3q22_a",
        label: "Que la explique paso a paso, y la pruebo con un caso",
      },
      {
        id: "m3q22_b",
        label: "Que escriba otra fórmula para reemplazar la actual",
      },
      {
        id: "m3q22_c",
        label: "Que me diga si la fórmula está bien o mal",
      },
      {
        id: "m3q22_d",
        label: "Que borre la columna que da el resultado raro",
      },
    ],
    correctAnswer: "m3q22_a",
    topic: "Análisis con Gemini",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Entender cada paso de la fórmula muestra dónde está el error, y probarla con un caso cuyo resultado conoces lo confirma. Un sí o un no, o una fórmula nueva que no entiendes, no te dicen qué falló.",
  },
  {
    id: "m3q23",
    question:
      "Gemini, con búsqueda web, te da los requisitos de una beca y cita su página oficial. Al abrirla, ves que es la convocatoria del año pasado. ¿Qué haces?",
    options: [
      {
        id: "m3q23_a",
        label: "Busco la convocatoria vigente y comparo los requisitos",
      },
      {
        id: "m3q23_b",
        label: "Uso los requisitos, porque la página es oficial",
      },
      {
        id: "m3q23_c",
        label: "Le pido a Gemini que confirme que siguen vigentes",
      },
      {
        id: "m3q23_d",
        label: "Uso los requisitos y aclaro que vienen de Gemini",
      },
    ],
    correctAnswer: "m3q23_a",
    topic: "Grounding",
    difficulty: "medio",
    source: "Gemini a la Práctica: Ejercicios de Campo",
    feedback:
      "El grounding también puede equivocarse: una página oficial puede estar desactualizada. Busca la convocatoria vigente y compara antes de usar los requisitos.",
  },
  {
    id: "m3q24",
    question:
      "Tu plan de Gemini muestra los niveles de razonamiento y vas a resolver un problema que exige razonar varios pasos con cuidado. ¿Qué ajustas en el selector?",
    options: [
      {
        id: "m3q24_a",
        label: "Subo el nivel de razonamiento a Medio o Alto",
      },
      {
        id: "m3q24_b",
        label: "Dejo el razonamiento en Bajo, que es más rápido",
      },
      {
        id: "m3q24_c",
        label: "Elijo Flash-Lite para que piense con más calma",
      },
      {
        id: "m3q24_d",
        label: "Activo Deep Research para resolver el problema",
      },
    ],
    correctAnswer: "m3q24_a",
    topic: "Gemini Básico",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "El nivel de razonamiento (Bajo, Medio o Alto; por defecto, Bajo) define cuánto piensa el modelo antes de responder: para varios pasos conviene subirlo. Flash-Lite es la opción más ligera y Deep Research sirve para investigar fuentes, no para razonar un problema.",
  },
  {
    id: "m3q25",
    question: "¿Qué haces si una fuente citada no existe al buscarla?",
    options: [
      {
        id: "m3q25_a",
        label:
          "Buscarla en Google Académico y, si no aparece, citar la más parecida",
      },
      {
        id: "m3q25_b",
        label: "Pedirle a Gemini que corrija la cita y usar la que proponga",
      },
      {
        id: "m3q25_c",
        label: "Mantener el dato y citar la página principal del sitio",
      },
      {
        id: "m3q25_d",
        label: "Quitar el dato y buscar otra fuente que lo respalde",
      },
    ],
    correctAnswer: "m3q25_d",
    topic: "Verificación de Fuentes",
    difficulty: "difícil",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Una cita que no existe no respalda nada. Citar algo parecido, aceptar la cita que proponga Gemini o citar la portada de un sitio deja el dato sin respaldo. Retíralo y busca otra fuente verificable.",
  },
  {
    id: "m3q26",
    question:
      "Revisas un texto de Gemini para separar hechos de alucinaciones. ¿Qué método usas?",
    options: [
      {
        id: "m3q26_a",
        label: "Marco cada afirmación sin respaldo y la compruebo",
      },
      {
        id: "m3q26_b",
        label: "Marco solo las afirmaciones que me suenan raras",
      },
      {
        id: "m3q26_c",
        label: "Le pido a Gemini que marque sus propios errores",
      },
      {
        id: "m3q26_d",
        label: "Reviso que el texto suene coherente y seguro",
      },
    ],
    correctAnswer: "m3q26_a",
    topic: "Verificación",
    difficulty: "fácil",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Una alucinación puede sonar normal y segura. Por eso se marca toda afirmación sin respaldo y se comprueba en una fuente, no solo las que parecen raras.",
  },
  {
    id: "m3q27",
    question: "Un documento de 200 páginas: ¿qué hace un estudiante cuidadoso?",
    options: [
      {
        id: "m3q27_a",
        label: "Pide un resumen por capítulos y cita el resumen",
      },
      {
        id: "m3q27_b",
        label: "Lo divide en partes y acepta las respuestas de cada parte",
      },
      {
        id: "m3q27_c",
        label: "Pide respuestas con sección y página, y verifica las que usará",
      },
      {
        id: "m3q27_d",
        label: "Pide citas textuales para pegarlas en su trabajo",
      },
    ],
    correctAnswer: "m3q27_c",
    topic: "Documentos extensos y citas",
    difficulty: "difícil",
    source: "Gemini a la Práctica: Ejercicios de Campo",
    feedback:
      "Pedir sección y página permite ir al original y verificar lo que usarás. Un resumen, respuestas por partes o citas que no comparas con el documento no confirman lo que dice el texto.",
  },
  {
    id: "m3q28",
    question:
      "¿Qué debes pedir si Gemini describe una imagen con un detalle dudoso?",
    options: [
      {
        id: "m3q28_a",
        label: "Que invente más detalles para convencerte",
      },
      {
        id: "m3q28_b",
        label: "Que señale la parte de la imagen que respalda ese detalle",
      },
      {
        id: "m3q28_c",
        label: "Que no vuelva a mirar la imagen y responda igual",
      },
      {
        id: "m3q28_d",
        label: "Que cambie la descripción sin decir por qué",
      },
    ],
    correctAnswer: "m3q28_b",
    topic: "Multimodalidad",
    difficulty: "medio",
    source: "Manual de Campo: Introducción a Gemini",
    feedback:
      "Pedir la parte de la imagen que respalda el detalle permite comprobarlo. Un detalle sin base visible no se usa.",
  },
];
