export const MODULE_1 = [
  {
    id: "m1q1",
    question: "¿Para qué sirve darle buenos prompts a una IA generativa?",
    options: [
      {
        id: "m1q1_a",
        label: "Para que las respuestas sean más largas y detalladas",
      },
      {
        id: "m1q1_b",
        label: "Respuestas útiles y alineadas con lo que necesito",
      },
      {
        id: "m1q1_c",
        label: "Para que la IA funcione más rápido sin errores",
      },
      {
        id: "m1q1_d",
        label: "Para que la IA escriba el código por mí",
      },
    ],
    correctAnswer: "m1q1_b",
    topic: "Ingeniería de Prompts",
    difficulty: "fácil",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      'Un buen prompt es una instrucción clara. Revisa el video "Cómo Crear Prompts Efectivos" y la "Guía: Anatomía de un Prompt".',
  },
  {
    id: "m1q2",
    question:
      'Un estudiante escribe: "Escribe un texto sobre inteligencia artificial para estudiantes." Con el método RTF (Rol, Tarea, Formato), ¿qué tiene y qué le falta?',
    options: [
      {
        id: "m1q2_a",
        label: "Tiene la Tarea; le faltan el Rol y el Formato",
      },
      {
        id: "m1q2_b",
        label: "Tiene el Rol, pero le faltan la Tarea y el Formato",
      },
      {
        id: "m1q2_c",
        label: "Tiene el Formato, pero le faltan el Rol y la Tarea",
      },
      {
        id: "m1q2_d",
        label: "Ya incluye los tres componentes de RTF",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      'Ese prompt pide "escribir un texto" (Tarea), pero no dice qué rol adopta la IA ni cómo debe entregarse (Formato). Revisa la "Guía: Anatomía de un Prompt".',
  },
  {
    id: "m1q3",
    question: "¿Qué logra el método RTF (Rol, Tarea, Formato)?",
    options: [
      {
        id: "m1q3_a",
        label: "Convierte la instrucción en un prompt más corto",
      },
      {
        id: "m1q3_b",
        label: "Estructura el pedido para obtener una respuesta clara",
      },
      {
        id: "m1q3_c",
        label: "Evita que la IA necesite cualquier contexto adicional",
      },
      {
        id: "m1q3_d",
        label: "Garantiza que la IA responda sin necesidad de revisarla",
      },
    ],
    correctAnswer: "m1q3_b",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "El Cincel",
    feedback:
      "RTF ordena el pedido en Rol, Tarea y Formato. Practica en el OVA El Cincel.",
  },
  {
    id: "m1q4",
    question:
      "Tienes que pedir un resumen sobre el ciclo del agua. ¿Cuál prompt te dará el mejor resultado?",
    options: [
      {
        id: "m1q4_a",
        label: '"Actúa como profesor y resume el ciclo del agua en 4 pasos."',
      },
      {
        id: "m1q4_b",
        label:
          '"Explícame todo lo que sepas sobre el ciclo del agua, sin límites."',
      },
      {
        id: "m1q4_c",
        label: '"Ciclo del agua. Dame información general y variada."',
      },
      {
        id: "m1q4_d",
        label: '"Háblame sobre el agua y de otros temas de la naturaleza."',
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Estructura de Prompts",
    difficulty: "medio",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      'La respuesta correcta define rol, tarea y un formato claro. Las demás son vagas o mezclan temas. Revisa el video "Cómo Crear Prompts Efectivos".',
  },
  {
    id: "m1q5",
    question:
      'Pides un resumen ejecutivo para directivos que no saben de tecnología. El prompt es: "Resume este artículo." La IA devuelve un texto muy técnico. ¿Qué hace falta?',
    options: [
      {
        id: "m1q5_a",
        label: "Aclarar a quién va dirigido y el estilo del resumen",
      },
      {
        id: "m1q5_b",
        label: "Dividir el artículo en fragmentos más pequeños",
      },
      {
        id: "m1q5_c",
        label: "Cambiar de herramienta porque la IA no entendió el tema",
      },
      {
        id: "m1q5_d",
        label: "Usar sinónimos de la palabra resumen en el prompt",
      },
    ],
    correctAnswer: "m1q5_a",
    topic: "Aplicación RTF",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      'El prompt genérico no indica audiencia ni formato. Agrega rol, público y extensión (p. ej. "resumen en 5 viñetas para directivos no técnicos").',
  },
  {
    id: "m1q6",
    question: "¿Qué es la inteligencia artificial generativa?",
    options: [
      {
        id: "m1q6_a",
        label: "Un sistema que crea textos nuevos con lo aprendido",
      },
      {
        id: "m1q6_b",
        label: "Una base de datos que guarda respuestas ya escritas",
      },
      {
        id: "m1q6_c",
        label: "Un programa que solo clasifica imágenes y textos",
      },
      {
        id: "m1q6_d",
        label: "Un buscador que devuelve páginas de internet",
      },
    ],
    correctAnswer: "m1q6_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      'La IA generativa produce texto, imágenes u otro contenido nuevo. Mira el video "Qué es la IA y cómo está cambiando el mundo".',
  },
  {
    id: "m1q7",
    question: "¿Qué es un prompt?",
    options: [
      {
        id: "m1q7_a",
        label: "La instrucción o mensaje que le escribes a la IA",
      },
      {
        id: "m1q7_b",
        label: "La respuesta automática que genera la IA",
      },
      {
        id: "m1q7_c",
        label: "El diseño visual de la interfaz de la herramienta",
      },
      {
        id: "m1q7_d",
        label: "Un tipo de archivo que la IA puede abrir",
      },
    ],
    correctAnswer: "m1q7_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "El Cincel",
    feedback:
      'Un prompt es lo que le pides a la IA. La "Guía: Anatomía de un Prompt" explica cómo armarlo.',
  },
  {
    id: "m1q8",
    question:
      '¿Por qué conviene indicarle un rol a la IA (por ejemplo, "actúa como un tutor")?',
    options: [
      {
        id: "m1q8_a",
        label: "Porque ajusta el estilo, el enfoque y la forma",
      },
      {
        id: "m1q8_b",
        label: "Porque hace que la IA responda siempre más corto",
      },
      {
        id: "m1q8_c",
        label: "Porque evita que la IA necesite ver el contexto",
      },
      {
        id: "m1q8_d",
        label: "Porque es obligatorio para que la IA funcione",
      },
    ],
    correctAnswer: "m1q8_a",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "El rol le da a la IA un enfoque y un tono. Así obtienes respuestas más adecuadas a tu objetivo.",
  },
  {
    id: "m1q9",
    question:
      "La IA te devuelve una respuesta genérica o fuera de tema. ¿Cuál es la mejor siguiente acción?",
    options: [
      {
        id: "m1q9_a",
        label: "Dar contexto claro: objetivo, audiencia y tono de salida",
      },
      {
        id: "m1q9_b",
        label: "Repetir el mismo prompt sin cambiar ninguna palabra",
      },
      {
        id: "m1q9_c",
        label: "Elegir otra herramienta de IA sin entender el problema",
      },
      {
        id: "m1q9_d",
        label: "Pedir más de una vez hasta que la respuesta mejore sola",
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "Refinamiento de Prompts",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Refina el prompt agregando contexto. Practica con la guía Anatomía de un Prompt.",
  },
  {
    id: "m1q10",
    question: "Quieres que la IA escriba mensajes con tu estilo. ¿Qué le das?",
    options: [
      {
        id: "m1q10_a",
        label: "Dos mensajes que ya escribiste y te gustaron",
      },
      {
        id: "m1q10_b",
        label: "Una frase vaga: escribe bonito",
      },
      {
        id: "m1q10_c",
        label: "Solo el nombre de la empresa",
      },
      {
        id: "m1q10_d",
        label: "Nada: la IA ya conoce tu estilo",
      },
    ],
    correctAnswer: "m1q10_a",
    topic: "Claridad en Prompts",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Ejemplos reales de tu estilo dan a la IA un modelo concreto. Una frase vaga o nada no le dan referencia.",
  },
  {
    id: "m1q11",
    question:
      "Caso: tu jefe pide un resumen de un informe de 40 páginas para mañana. ¿Qué pedido a la IA da el resultado más útil?",
    options: [
      {
        id: "m1q11_a",
        label: "Resume el informe en 5 viñetas con cifras clave",
      },
      {
        id: "m1q11_b",
        label: "Resume el informe completo para hoy",
      },
      {
        id: "m1q11_c",
        label: "Haz lo que puedas con el informe, sin límites ni formato",
      },
      {
        id: "m1q11_d",
        label: "Escribe algo sobre el informe para el jefe",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "Un buen pedido fija formato, extensión y lo que debe incluir. Con 'resume' a secas, la IA improvisa.",
  },
  {
    id: "m1q12",
    question:
      "Caso: una estudiante copia un párrafo de la IA a su trabajo sin revisarlo. ¿Cuál es el error principal?",
    options: [
      {
        id: "m1q12_a",
        label: "No verificar datos ni citas antes de usar el texto",
      },
      {
        id: "m1q12_b",
        label: "Usar la IA para escribir",
      },
      {
        id: "m1q12_c",
        label: "Escribir demasiado rápido para el tiempo disponible",
      },
      {
        id: "m1q12_d",
        label:
          "Usar un tono demasiado formal en un trabajo escolar de investigación",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La IA puede inventar datos con seguridad. Antes de usar un texto, verifica datos y citas en la fuente.",
  },
  {
    id: "m1q13",
    question:
      "¿Qué aporta conocer los comienzos de la inteligencia artificial al usarla hoy?",
    options: [
      {
        id: "m1q13_a",
        label: "Entender sus capacidades y límites actuales",
      },
      {
        id: "m1q13_b",
        label: "Memorizar fechas para aprobar sin comprender",
      },
      {
        id: "m1q13_c",
        label: "Programar una IA desde cero en una tarde",
      },
      {
        id: "m1q13_d",
        label: "Nada, la historia no influye en el uso actual",
      },
    ],
    correctAnswer: "m1q13_a",
    topic: "Historia de la IA",
    difficulty: "medio",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La historia explica por qué la IA llegó a generar contenido y dónde están sus límites. Revisa el video 'Qué es la IA y cómo está cambiando el mundo'.",
  },
  {
    id: "m1q14",
    question: "¿Cuál de estas es una capacidad típica de la IA generativa?",
    options: [
      {
        id: "m1q14_a",
        label:
          "Redactar, resumir y reformular textos a partir de una instrucción",
      },
      {
        id: "m1q14_b",
        label:
          "Garantizar que toda la información entregada esté verificada y sea verdadera",
      },
      {
        id: "m1q14_c",
        label:
          "Tomar decisiones legales y médicas sin necesidad de supervisión humana",
      },
      {
        id: "m1q14_d",
        label: "Acceder a tus recuerdos personales y a tus archivos privados",
      },
    ],
    correctAnswer: "m1q14_a",
    topic: "IA Generativa",
    difficulty: "medio",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "Genera y transforma texto, pero no garantiza veracidad ni reemplaza tu criterio. Revisa el video 'Qué es la IA y cómo está cambiando el mundo'.",
  },
  {
    id: "m1q15",
    question:
      "La IA afirma datos con seguridad aunque sean falsos. ¿Cómo se llama ese fenómeno?",
    options: [
      {
        id: "m1q15_a",
        label:
          "Alucinación: genera datos falsos que parecen completamente verdaderos",
      },
      {
        id: "m1q15_b",
        label:
          "Traducción automática: cambia el idioma del texto sin revisar su sentido",
      },
      {
        id: "m1q15_c",
        label:
          "Compresión de datos: reduce el tamaño de los archivos para enviarlos",
      },
      {
        id: "m1q15_d",
        label:
          "Actualización en tiempo real: consulta internet y muestra datos al instante",
      },
    ],
    correctAnswer: "m1q15_a",
    topic: "Límites de la IA",
    difficulty: "medio",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "Las alucinaciones son respuestas plausibles pero incorrectas. Verifica siempre datos críticos.",
  },
  {
    id: "m1q16",
    question: "¿Qué conviene saber sobre los datos recientes que da una IA?",
    options: [
      {
        id: "m1q16_a",
        label: "Pueden estar desactualizados: pide fuentes y fechas",
      },
      {
        id: "m1q16_b",
        label: "Siempre incluyen lo último que pasó en el mundo",
      },
      {
        id: "m1q16_c",
        label: "Se actualizan solos cada minuto sin avisar",
      },
      {
        id: "m1q16_d",
        label: "Solo describen lo que pasó hace diez años, sin fuentes",
      },
    ],
    correctAnswer: "m1q16_a",
    topic: "Uso responsable",
    difficulty: "fácil",
    source: "El Cincel",
    feedback:
      "Un modelo puede no tener la información más reciente. Para datos actuales, pide fuentes con fecha y verifícalas.",
  },
  {
    id: "m1q17",
    question: "¿Qué conviene hacer cuando la tarea es muy grande?",
    options: [
      {
        id: "m1q17_a",
        label: "Dividirla en pasos y revisar cada parte",
      },
      {
        id: "m1q17_b",
        label: "Pedirla toda de una vez, sin pausas",
      },
      {
        id: "m1q17_c",
        label: "Pedirle que decida sola cuándo terminar",
      },
      {
        id: "m1q17_d",
        label: "Escribirla en mayúsculas para que no se pierda",
      },
    ],
    correctAnswer: "m1q17_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Dividir en pasos reduce errores y te permite revisar cada parte. Repasa la guía Anatomía de un Prompt.",
  },
  {
    id: "m1q18",
    question: "¿Para qué sirve dar contexto en un prompt?",
    options: [
      {
        id: "m1q18_a",
        label: "Para que la respuesta se ajuste a tu situación real",
      },
      {
        id: "m1q18_b",
        label: "Para que la IA escriba más texto sin sentido",
      },
      {
        id: "m1q18_c",
        label: "Para que la IA tarde menos",
      },
      {
        id: "m1q18_d",
        label: "Para no tener que indicar la tarea",
      },
    ],
    correctAnswer: "m1q18_a",
    topic: "Estructura de Prompts",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "El contexto (objetivo, audiencia, situación) dirige la respuesta hacia lo que necesitas.",
  },
  {
    id: "m1q19",
    question: "¿Qué ayuda la instrucción «Actúa como un profesor de primaria»?",
    options: [
      {
        id: "m1q19_a",
        label: "Hace que la IA responda más rápido",
      },
      {
        id: "m1q19_b",
        label: "Cambia el idioma de la respuesta sin avisar",
      },
      {
        id: "m1q19_c",
        label: "Fija el punto de vista y el nivel con que responde",
      },
      {
        id: "m1q19_d",
        label: "Obliga a la IA a no usar ejemplos",
      },
    ],
    correctAnswer: "m1q19_c",
    topic: "Claridad en Prompts",
    difficulty: "fácil",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "Asignar un rol define desde qué mirada y con qué nivel responde la IA. No cambia su velocidad ni su idioma.",
  },
  {
    id: "m1q20",
    question:
      "Necesitas la respuesta en una tabla. ¿Qué debes indicar en el prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "El formato: una tabla con filas",
      },
      {
        id: "m1q20_b",
        label: "Que responda lo más rápido posible",
      },
      {
        id: "m1q20_c",
        label: "Solo la primera letra de cada idea",
      },
      {
        id: "m1q20_d",
        label: "Que no use números ni detalles",
      },
    ],
    correctAnswer: "m1q20_a",
    topic: "Formato de Salida",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Indicar el formato (tabla, viñetas, extensión) hace que la IA entregue justo lo que necesitas.",
  },
  {
    id: "m1q21",
    question:
      "Necesitas una respuesta de tres líneas para un chat del móvil. ¿Qué debes precisar?",
    options: [
      {
        id: "m1q21_a",
        label: "La extensión máxima que necesitas",
      },
      {
        id: "m1q21_b",
        label: "El color de fondo de la herramienta",
      },
      {
        id: "m1q21_c",
        label: "La marca de tu computador",
      },
      {
        id: "m1q21_d",
        label: "El idioma del sistema operativo",
      },
    ],
    correctAnswer: "m1q21_a",
    topic: "Audiencia",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Indicar la extensión (tres líneas) evita respuestas largas que no caben en el chat.",
  },
  {
    id: "m1q22",
    question:
      "¿Qué pasa si pegas en el chat una lista con nombres y teléfonos de clientes?",
    options: [
      {
        id: "m1q22_a",
        label: "La IA los borra al instante, sin dejar ningún rastro",
      },
      {
        id: "m1q22_b",
        label: "Nada: el chat es privado y solo lo ves tú",
      },
      {
        id: "m1q22_c",
        label: "La IA los usa para mejorar tu puntaje del curso",
      },
      {
        id: "m1q22_d",
        label: "Esos datos salen de tu control y pueden quedar guardados",
      },
    ],
    correctAnswer: "m1q22_d",
    topic: "Refinamiento de Prompts",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Un dato personal pegado en una herramienta sale de tu control y puede quedar guardado. Por eso se anonimiza antes de compartirlo.",
  },
  {
    id: "m1q23",
    question: "Quieres una explicación para un niño de 10 años. ¿Qué precisas?",
    options: [
      {
        id: "m1q23_a",
        label: "El público: un niño de 10 años, con palabras sencillas",
      },
      {
        id: "m1q23_b",
        label: "El color del texto de la respuesta",
      },
      {
        id: "m1q23_c",
        label: "El nombre de la herramienta que vas a usar",
      },
      {
        id: "m1q23_d",
        label: "Que use la mayor cantidad de palabras técnicas",
      },
    ],
    correctAnswer: "m1q23_a",
    topic: "Restricciones",
    difficulty: "fácil",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "Indicar el público define el lenguaje de la respuesta. El color, el nombre de la herramienta o la jerga no dan esa referencia.",
  },
  {
    id: "m1q24",
    question:
      "Quieres una respuesta que puedas pegar en un correo. ¿Qué indicas?",
    options: [
      {
        id: "m1q24_a",
        label: "Que la responda en otro idioma",
      },
      {
        id: "m1q24_b",
        label: "Que incluya muchos emojis",
      },
      {
        id: "m1q24_c",
        label: "Que no use markdown ni tablas, solo texto",
      },
      {
        id: "m1q24_d",
        label: "Que la escriba toda en mayúsculas",
      },
    ],
    correctAnswer: "m1q24_c",
    topic: "Ejemplos en el Prompt",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Pedir texto simple evita símbolos y tablas que se ven mal al pegar en un correo. Los emojis, el idioma o las mayúsculas no lo resuelven.",
  },
  {
    id: "m1q25",
    question:
      "El texto es para un informe formal. ¿Qué debes indicar en el prompt?",
    options: [
      {
        id: "m1q25_a",
        label: "El tono: formal y profesional",
      },
      {
        id: "m1q25_b",
        label: "Que use emojis y jerga",
      },
      {
        id: "m1q25_c",
        label: "Que escriba como en un chat de amigos",
      },
      {
        id: "m1q25_d",
        label: "Que omita todos los detalles",
      },
    ],
    correctAnswer: "m1q25_a",
    topic: "Tono del Prompt",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "El tono (formal/informal, técnico/cercano) ajusta el registro de la respuesta.",
  },
  {
    id: "m1q26",
    question:
      "En la fórmula RTF, ¿qué parte indica la acción concreta que debe hacer la IA?",
    options: [
      {
        id: "m1q26_a",
        label: "El color de la pantalla donde se lee la respuesta",
      },
      {
        id: "m1q26_b",
        label: "La tarea",
      },
      {
        id: "m1q26_c",
        label: "El historial de compras del usuario",
      },
      {
        id: "m1q26_d",
        label: "La velocidad del servidor que responde",
      },
    ],
    correctAnswer: "m1q26_b",
    topic: "Evitar Ambigüedad",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "En RTF, la tarea es la acción concreta. Las otras opciones no forman parte del prompt.",
  },
  {
    id: "m1q27",
    question: "¿Qué aporta un ejemplo de estilo dentro de un prompt?",
    options: [
      {
        id: "m1q27_a",
        label: "Muestra el tono y la forma que quieres sin copiar el contenido",
      },
      {
        id: "m1q27_b",
        label:
          "Obliga a la IA a copiar el ejemplo palabra por palabra, sin cambiar nada",
      },
      {
        id: "m1q27_c",
        label: "Hace que la IA responda con menos detalle que antes",
      },
      {
        id: "m1q27_d",
        label: "Reemplaza la tarea que le pediste a la IA",
      },
    ],
    correctAnswer: "m1q27_a",
    topic: "Método RTF",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Un ejemplo de estilo transmite tono y forma mejor que una descripción. Úsalo sin pedir que lo copie.",
  },
  {
    id: "m1q28",
    question: "Escribes a un cliente y quieres un tono cercano. ¿Qué pides?",
    options: [
      {
        id: "m1q28_a",
        label: "Un tono de bibliografía académica, con citas",
      },
      {
        id: "m1q28_b",
        label: "Que la respuesta sea lo más técnica posible",
      },
      {
        id: "m1q28_c",
        label: "Un tono cercano, sin jerga y con una despedida breve",
      },
      {
        id: "m1q28_d",
        label: "Que suene como un abogado, sin ninguna frase amable",
      },
    ],
    correctAnswer: "m1q28_c",
    topic: "Aplicación RTF",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "El tono se pide con palabras concretas: cercano, sin jerga, con despedida breve. Lo académico o lo técnico no sirven para un cliente.",
  },
  {
    id: "m1q29",
    question: "Quieres 10 ideas para una campaña. ¿Qué pides?",
    options: [
      {
        id: "m1q29_a",
        label: "Una sola idea, la mejor que tengas",
      },
      {
        id: "m1q29_b",
        label: "10 ideas, cada una con su razón de éxito",
      },
      {
        id: "m1q29_c",
        label: "Ideas al azar, sin tema ni público",
      },
      {
        id: "m1q29_d",
        label: "La campaña completa, sin preguntar nada",
      },
    ],
    correctAnswer: "m1q29_b",
    topic: "Aplicación de Prompts",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Pedir la cantidad y una razón por idea permite comparar y elegir. Una sola idea o ideas al azar no dan dónde elegir.",
  },
  {
    id: "m1q30",
    question: "Quieres practicar un tema que acabas de leer. ¿Qué pides?",
    options: [
      {
        id: "m1q30_a",
        label: "Un resumen de una línea, sin preguntas",
      },
      {
        id: "m1q30_b",
        label: "Que te dé la respuesta antes de que intentes",
      },
      {
        id: "m1q30_c",
        label: "Que cambie de tema para no aburrirte",
      },
      {
        id: "m1q30_d",
        label: "Cinco preguntas de práctica, con las respuestas al final",
      },
    ],
    correctAnswer: "m1q30_d",
    topic: "Aplicación de Prompts",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Las preguntas de práctica con respuestas al final permiten comprobar lo aprendido. Dar la respuesta antes quita el esfuerzo.",
  },
  {
    id: "m1q31",
    question: "¿Qué debes cuidar al compartir un prompt con un colega?",
    options: [
      {
        id: "m1q31_a",
        label: "Quitar datos personales y sensibles antes de compartirlo",
      },
      {
        id: "m1q31_b",
        label: "Pegar también tus contraseñas y accesos para que lo reproduzca",
      },
      {
        id: "m1q31_c",
        label: "Compartirlo sin revisar la respuesta que dio",
      },
      {
        id: "m1q31_d",
        label: "Enviarlo como si la respuesta fuera de tu autoría",
      },
    ],
    correctAnswer: "m1q31_a",
    topic: "Errores Comunes",
    difficulty: "medio",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "Un prompt puede contener datos de otras personas. Anonimízalo antes de compartirlo.",
  },
  {
    id: "m1q32",
    question:
      "Un prompt incluye mucha información irrelevante. ¿Qué efecto suele tener?",
    options: [
      {
        id: "m1q32_a",
        label: "Confunde a la IA y desvía la respuesta de su objetivo",
      },
      {
        id: "m1q32_b",
        label: "Mejora siempre la calidad del resultado que entrega la IA",
      },
      {
        id: "m1q32_c",
        label: "No tiene ningún efecto real sobre la respuesta final",
      },
      {
        id: "m1q32_d",
        label: "Obliga a la IA a responder mucho más rápido que antes",
      },
    ],
    correctAnswer: "m1q32_a",
    topic: "Estructura de Prompts",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Menos es más: incluye solo lo relevante (tarea, contexto, formato) para no diluir el objetivo.",
  },
  {
    id: "m1q33",
    question: "Guardar y reutilizar buenas plantillas de prompt sirve para…",
    options: [
      {
        id: "m1q33_a",
        label: "Ahorrar tiempo y ser consistente",
      },
      {
        id: "m1q33_b",
        label: "Que la IA memorice todo lo que escribes",
      },
      {
        id: "m1q33_c",
        label: "Evitar revisar los resultados",
      },
      {
        id: "m1q33_d",
        label: "Cambiar el modelo sin avisar al equipo",
      },
    ],
    correctAnswer: "m1q33_a",
    topic: "Reutilización",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Las plantillas reutilizables ahorran tiempo y hacen consistentes tus resultados; ajústalas según el caso.",
  },
  {
    id: "m1q34",
    question:
      "La IA te da dos respuestas distintas al mismo prompt. ¿Qué es lo más crítico?",
    options: [
      {
        id: "m1q34_a",
        label: "Comparar y validar la información",
      },
      {
        id: "m1q34_b",
        label: "Elegir la más larga sin leer",
      },
      {
        id: "m1q34_c",
        label: "Confiar en la primera que salga",
      },
      {
        id: "m1q34_d",
        label: "Preguntarle a otra IA cuál de las dos prefiere",
      },
    ],
    correctAnswer: "m1q34_a",
    topic: "Evaluación Crítica",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Ante respuestas divergentes, valida los datos y usa tu criterio. No toda respuesta es igual de fiable.",
  },
  {
    id: "m1q35",
    question: "¿Qué debes hacer antes de compartir un texto que la IA redactó?",
    options: [
      {
        id: "m1q35_a",
        label: "Revisar datos, nombres y cifras, y declarar IA",
      },
      {
        id: "m1q35_b",
        label: "Compartirlo tal cual, porque la IA no se equivoca",
      },
      {
        id: "m1q35_c",
        label: "Cambiar solo el logo del documento",
      },
      {
        id: "m1q35_d",
        label: "Enviarlo a otra persona sin decir que lo generó la IA",
      },
    ],
    correctAnswer: "m1q35_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "La IA puede equivocarse en datos y nombres. Revisar el texto y declarar su uso es parte del trabajo responsable.",
  },
  {
    id: "m1q36",
    question:
      "La IA responde con un sesgo o información incompleta. ¿Cuál es la mejor acción?",
    options: [
      {
        id: "m1q36_a",
        label: "Cuestionar, pedir otras perspectivas y verificar las fuentes",
      },
      {
        id: "m1q36_b",
        label: "Aceptarlo tal cual porque la IA siempre es neutral y objetiva",
      },
      {
        id: "m1q36_c",
        label: "Publicarlo igual porque el tema no es sensible",
      },
      {
        id: "m1q36_d",
        label: "Ignorar el sesgo detectado y continuar con la siguiente tarea",
      },
    ],
    correctAnswer: "m1q36_a",
    topic: "Pensamiento Crítico",
    difficulty: "medio",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La IA puede sesgarse: contrasta, pide otras perspectivas y valida. Tú aportas el criterio.",
  },
  {
    id: "m1q37",
    question: "¿Cuál es el uso más honesto de la IA en un trabajo académico?",
    options: [
      {
        id: "m1q37_a",
        label: "Usarla como apoyo y declarar su uso",
      },
      {
        id: "m1q37_b",
        label: "Entregar su salida como propia sin revisar",
      },
      {
        id: "m1q37_c",
        label: "Copiar sin citar ninguna parte",
      },
      {
        id: "m1q37_d",
        label: "Usarla para suplantar a otra persona",
      },
    ],
    correctAnswer: "m1q37_a",
    topic: "Ética y Uso Responsable",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "La IA es apoyo: revisa, aporta valor propio y sé transparente sobre su uso.",
  },
  {
    id: "m1q38",
    question: "¿Qué debes indicar al entregar un trabajo con apoyo de IA?",
    options: [
      {
        id: "m1q38_a",
        label: "Nada: el trabajo es tuyo aunque la IA lo haya escrito",
      },
      {
        id: "m1q38_b",
        label: "Solo tu nombre, sin mencionar la herramienta",
      },
      {
        id: "m1q38_c",
        label: "Qué herramienta usaste y en qué parte la usaste",
      },
      {
        id: "m1q38_d",
        label: "Una copia completa de la conversación, sin revisar",
      },
    ],
    correctAnswer: "m1q38_c",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Declarar la herramienta y la parte en que se usó es la forma honesta de hacerlo. Presentar el trabajo como si no hubiera IA no lo es.",
  },
  {
    id: "m1q39",
    question:
      "Iterar el prompt varias veces hasta lograr el objetivo es una práctica…",
    options: [
      {
        id: "m1q39_a",
        label: "Recomendada: mejora con cada ajuste",
      },
      {
        id: "m1q39_b",
        label: "Incorrecta: hay que acertar a la primera",
      },
      {
        id: "m1q39_c",
        label: "Prohibida por las herramientas",
      },
      {
        id: "m1q39_d",
        label: "Opcional, solo si la primera respuesta sale mal",
      },
    ],
    correctAnswer: "m1q39_a",
    topic: "Refinamiento de Prompts",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Iterar es normal y efectivo: cada ajuste del prompt acerca la respuesta a lo que necesitas.",
  },
  {
    id: "m1q40",
    question:
      "Caso: necesitas un correo para recordar una reunión. ¿Cuál prompt reúne MÁS elementos de calidad?",
    options: [
      {
        id: "m1q40_a",
        label:
          "Como asistente, redacta un recordatorio formal y cordial de la reunión del jueves 10 a.m.",
      },
      {
        id: "m1q40_b",
        label:
          '"Escribe un correo breve para recordar una reunión de trabajo a un compañero del equipo"',
      },
      {
        id: "m1q40_c",
        label:
          '"Redacta un mensaje sencillo para avisar que tendremos una reunión pronto, sin más detalles"',
      },
      {
        id: "m1q40_d",
        label:
          '"Haz un texto sobre las reuniones de trabajo y su importancia en las empresas modernas"',
      },
    ],
    correctAnswer: "m1q40_a",
    topic: "Aplicación RTF",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "El prompt correcto reúne rol, tarea, contexto (fecha y hora) y tono: es el prompt más completo de los cuatro.",
  },
  {
    id: "m1e01",
    question:
      "Un sistema de contratación se entrenó con datos de una empresa con mayoría de hombres y penalizaba CVs con ciertos términos. ¿Qué sesgo aparece y dónde se origina?",
    options: [
      {
        id: "m1e01_a",
        label: "Sesgo histórico de representación en datos pasados",
      },
      {
        id: "m1e01_b",
        label: "Sesgo de automatización, por falta de supervisión humana",
      },
      {
        id: "m1e01_c",
        label: "Sesgo de confirmación, por ideas previas del reclutador",
      },
      {
        id: "m1e01_d",
        label: "Sesgo de etiquetado, por anotadores equivocados",
      },
    ],
    correctAnswer: "m1e01_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "Los datos históricos reflejaban una contratación pasada mayoritariamente masculina: el sesgo viene de los datos. Repasa el OVA El Espejo de la Verdad.",
  },
  {
    id: "m1e02",
    question:
      "Una IA recomienda una compra y no sabes por qué. ¿Qué te conviene pedir?",
    options: [
      {
        id: "m1e02_a",
        label: "Que explique los criterios de su recomendación",
      },
      {
        id: "m1e02_b",
        label: "Que solo muestre el precio más bajo",
      },
      {
        id: "m1e02_c",
        label: "Que decida por ti sin preguntar nada ni explicarse",
      },
      {
        id: "m1e02_d",
        label: "Que ignore tus gustos anteriores",
      },
    ],
    correctAnswer: "m1e02_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Pedir los criterios permite evaluar si la recomendación te sirve. Repasa la guía de ética.",
  },
  {
    id: "m1e03",
    question:
      "Un chatbot de un banco da tasas de interés inventadas con total seguridad. ¿Qué principio se viola?",
    options: [
      {
        id: "m1e03_a",
        label: "Veracidad: verificar datos y no inventarlos",
      },
      {
        id: "m1e03_b",
        label: "La velocidad de respuesta del chatbot",
      },
      {
        id: "m1e03_c",
        label: "La popularidad del banco entre sus clientes",
      },
      {
        id: "m1e03_d",
        label: "El costo del servicio de atención al cliente en línea",
      },
    ],
    correctAnswer: "m1e03_a",
    topic: "Transparencia",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "La veracidad exige verificar cada dato antes de compartirlo. La IA puede inventar con seguridad. Repasa la guía de ética.",
  },
  {
    id: "m1e04",
    question:
      "Un conductor distraído confía en el piloto automático y sufre un accidente. ¿Qué sesgo describe esto?",
    options: [
      {
        id: "m1e04_a",
        label: "Sesgo de automatización: confió sin revisar",
      },
      {
        id: "m1e04_b",
        label: "Sesgo de muestreo en los datos de entrenamiento",
      },
      {
        id: "m1e04_c",
        label: "Sesgo algorítmico contra ciertos objetos",
      },
      {
        id: "m1e04_d",
        label: "Un error humano normal sin sesgo alguno",
      },
    ],
    correctAnswer: "m1e04_a",
    topic: "Sesgo de Automatización",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "El sesgo de automatización es confiar demasiado en la máquina. Mantén la supervisión activa. Practica en el OVA El Espejo de la Verdad.",
  },
  {
    id: "m1e05",
    question:
      "Un sistema de IA de alto riesgo (por ejemplo, aprobar una hipoteca) según la UE debe cumplir con:",
    options: [
      {
        id: "m1e05_a",
        label: "Evaluación de conformidad y supervisión",
      },
      {
        id: "m1e05_b",
        label: "Solo publicar una declaración de uso en la web",
      },
      {
        id: "m1e05_c",
        label: "Auditoría única al lanzar el producto",
      },
      {
        id: "m1e05_d",
        label: "Registro en un sitio web sin evaluar riesgos",
      },
    ],
    correctAnswer: "m1e05_a",
    topic: "Marco Regulatorio",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Los sistemas de alto riesgo exigen transparencia, documentación y supervisión humana. Revisa la guía de ética. El Reglamento (UE) 2026/1744 está en vigor desde el 27 de julio de 2026; sus obligaciones de alto riesgo para sistemas independientes se aplican desde diciembre de 2027.",
  },
  {
    id: "m1e06",
    question:
      "¿Cuáles son los 5 principios éticos clave que guían el uso responsable de la IA?",
    options: [
      {
        id: "m1e06_a",
        label:
          "Transparencia, equidad, responsabilidad, privacidad y veracidad",
      },
      {
        id: "m1e06_b",
        label: "Velocidad, equidad, automatización, privacidad y veracidad",
      },
      {
        id: "m1e06_c",
        label: "Competencia, equidad, escala, innovación y veracidad",
      },
      {
        id: "m1e06_d",
        label:
          "Transparencia, rentabilidad, responsabilidad, privacidad y eficiencia",
      },
    ],
    correctAnswer: "m1e06_a",
    topic: "Principios Éticos",
    difficulty: "fácil",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Transparencia, equidad, responsabilidad, privacidad y veracidad son los cinco pilares. Repasa el video de principios y práctica.",
  },
  {
    id: "m1e07",
    question: "¿Qué es el sesgo de muestreo en un modelo de IA?",
    options: [
      {
        id: "m1e07_a",
        label: "Los datos de entrenamiento no representan a todos",
      },
      {
        id: "m1e07_b",
        label: "El sistema funciona lento con bases de datos grandes",
      },
      {
        id: "m1e07_c",
        label: "El modelo cambia de idioma sin que se lo pidas",
      },
      {
        id: "m1e07_d",
        label: "El modelo se reentrena solo con cada consulta del usuario",
      },
    ],
    correctAnswer: "m1e07_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "El sesgo de muestreo nace de datos no representativos. Practica en el OVA El Espejo de la Verdad.",
  },
  {
    id: "m1e08",
    question: "¿Qué es el sesgo de etiquetado?",
    options: [
      {
        id: "m1e08_a",
        label: "Las etiquetas arrastran los prejuicios de quienes las crean",
      },
      {
        id: "m1e08_b",
        label: "El sistema clasifica los datos de forma automática y neutral",
      },
      {
        id: "m1e08_c",
        label: "La IA coloca una etiqueta visible a cada respuesta generada",
      },
      {
        id: "m1e08_d",
        label: "El modelo desactiva las etiquetas cuando hay muchos datos",
      },
    ],
    correctAnswer: "m1e08_a",
    topic: "Sesgos en IA",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "Si quien etiqueta tiene sesgos, el modelo los aprende. Repasa el OVA El Espejo de la Verdad.",
  },
  {
    id: "m1e09",
    question:
      "Una IA penaliza sistemáticamente a cierto grupo en contratación. ¿Qué haces?",
    options: [
      {
        id: "m1e09_a",
        label: "Detener el sistema, documentar el sesgo y corregirlo",
      },
      {
        id: "m1e09_b",
        label: "Ignorarlo porque el modelo funciona rápido y barato",
      },
      {
        id: "m1e09_c",
        label: "Ocultar los resultados para evitar reclamos legales",
      },
      {
        id: "m1e09_d",
        label: "Subir más datos históricos iguales al sistema afectado",
      },
    ],
    correctAnswer: "m1e09_a",
    topic: "Mitigación de Sesgos",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "Ante un sesgo detectado, detén, documenta y corrige. Practica en el OVA El Espejo de la Verdad.",
  },
  {
    id: "m1e10",
    question: "¿Qué dato no debes compartir con una IA pública?",
    options: [
      {
        id: "m1e10_a",
        label: "Un texto de ejemplo ya publicado en internet",
      },
      {
        id: "m1e10_b",
        label: "Una pregunta general sobre historia",
      },
      {
        id: "m1e10_c",
        label: "Una lista de ideas sin nombres",
      },
      {
        id: "m1e10_d",
        label: "Datos personales de estudiantes o clientes, sin anonimizar",
      },
    ],
    correctAnswer: "m1e10_d",
    topic: "Explicabilidad",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Los datos personales sin anonimizar no deben ir a una herramienta pública. Los textos publicados y las ideas generales no son ese tipo de riesgo.",
  },
  {
    id: "m1e11",
    question:
      "¿Qué debe registrar un hospital cuando usa IA para apoyar una decisión clínica?",
    options: [
      {
        id: "m1e11_a",
        label: "Quién revisó la sugerencia y qué decidió",
      },
      {
        id: "m1e11_b",
        label: "Solo el nombre comercial del software",
      },
      {
        id: "m1e11_c",
        label: "La velocidad con que la IA respondió a la consulta",
      },
      {
        id: "m1e11_d",
        label: "Nada, porque la IA no necesita registro",
      },
    ],
    correctAnswer: "m1e11_a",
    topic: "Supervisión Humana",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Registrar quién revisó y decidió permite auditar y atribuir responsabilidad. Repasa la guía de ética.",
  },
  {
    id: "m1e12",
    question: "¿Qué es la privacidad por diseño?",
    options: [
      {
        id: "m1e12_a",
        label: "Incorporar la protección de datos desde el diseño inicial",
      },
      {
        id: "m1e12_b",
        label: "Añadir la privacidad solo si hay una queja de usuarios",
      },
      {
        id: "m1e12_c",
        label: "Ocultar el uso de datos en la letra pequeña del contrato",
      },
      {
        id: "m1e12_d",
        label: "Recolectar todo y decidir la privacidad al final del proyecto",
      },
    ],
    correctAnswer: "m1e12_a",
    topic: "Privacidad por Diseño",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "La privacidad se diseña desde el inicio, no se agrega al final. Repasa la Guía de privacidad.",
  },
  {
    id: "m1e13",
    question:
      "Un sistema de IA guarda los datos de un paciente sin consentimiento. ¿Qué principio se incumple?",
    options: [
      {
        id: "m1e13_a",
        label: "Privacidad: tratar datos solo con consentimiento",
      },
      {
        id: "m1e13_b",
        label: "Velocidad del servidor y capacidad de almacenamiento",
      },
      {
        id: "m1e13_c",
        label: "Popularidad del software entre los estudiantes",
      },
      {
        id: "m1e13_d",
        label: "Costo de la licencia, del soporte y de toda la infraestructura",
      },
    ],
    correctAnswer: "m1e13_a",
    topic: "Marco Regulatorio",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Los datos personales requieren consentimiento y protección. Repasa la guía de ética.",
  },
  {
    id: "m1e14",
    question:
      "Un sistema puntúa la conducta de ciudadanos y usa esa puntuación para limitar sus servicios públicos. ¿Qué categoría de riesgo tiene?",
    options: [
      {
        id: "m1e14_a",
        label: "Inaceptable: prohibido por la normativa de la UE",
      },
      {
        id: "m1e14_b",
        label: "Alto, con evaluación de conformidad",
      },
      {
        id: "m1e14_c",
        label: "Limitado, solo debe avisar que es IA",
      },
      {
        id: "m1e14_d",
        label: "Mínimo, sin obligaciones específicas para ningún uso",
      },
    ],
    correctAnswer: "m1e14_a",
    topic: "Marco Regulatorio",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "La puntuación social de ciudadanos está prohibida: es riesgo inaceptable. Repasa la guía de ética.",
  },
  {
    id: "m1e15",
    question:
      "¿Qué debe revisar una persona antes de usar un resultado que afecta a personas?",
    options: [
      {
        id: "m1e15_a",
        label: "La velocidad con que el sistema lo generó",
      },
      {
        id: "m1e15_b",
        label: "Si el resultado trata injustamente a algún grupo",
      },
      {
        id: "m1e15_c",
        label: "Cuántos usuarios tiene la plataforma",
      },
      {
        id: "m1e15_d",
        label: "Solo el costo mensual de la herramienta",
      },
    ],
    correctAnswer: "m1e15_b",
    topic: "Auditoría",
    difficulty: "medio",
    source: "OVA: El Espejo de la Verdad",
    feedback:
      "Antes de usar un resultado sobre personas, revisa si trata injustamente a algún grupo: eso es un sesgo.",
  },
  {
    id: "m1e16",
    question: "¿Cuál es un uso NO ético de la IA?",
    options: [
      {
        id: "m1e16_a",
        label: "Suplantar la identidad de alguien con voz o imagen",
      },
      {
        id: "m1e16_b",
        label: "Resumir un informe propio para una reunión de trabajo",
      },
      {
        id: "m1e16_c",
        label: "Revisar la ortografía de un texto",
      },
      {
        id: "m1e16_d",
        label: "Generar ideas para un proyecto personal de aprendizaje",
      },
    ],
    correctAnswer: "m1e16_a",
    topic: "Uso Responsable",
    difficulty: "fácil",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Suplantar identidades con IA es un uso no ético y puede ser ilegal. Repasa el video de principios.",
  },
  {
    id: "m1e17",
    question:
      "Un chatbot educativo para niños de primaria debe protegerlos. ¿Qué política es la adecuada?",
    options: [
      {
        id: "m1e17_a",
        label: "Limitar el contenido por edad y revisar con un adulto",
      },
      {
        id: "m1e17_b",
        label: "Dejar que responda sin límites para no censurar nada",
      },
      {
        id: "m1e17_c",
        label: "Recopilar más datos de los menores para personalizar mejor",
      },
      {
        id: "m1e17_d",
        label: "Ocultar a los padres cómo funciona el sistema",
      },
    ],
    correctAnswer: "m1e17_a",
    topic: "Salvaguardas",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Con menores, la política debe limitar el contenido, revisar las respuestas con un adulto y no recopilar datos de más. Repasa la guía de ética.",
  },
  {
    id: "m1e18",
    question:
      "La IA sugiere una decisión que afecta a muchas personas. ¿Qué principio exige revisarla?",
    options: [
      {
        id: "m1e18_a",
        label: "Responsabilidad y transparencia con supervisión humana",
      },
      {
        id: "m1e18_b",
        label: "Eficiencia, para resolver el caso rápido",
      },
      {
        id: "m1e18_c",
        label: "Escalabilidad, para que la IA decida el mayor volumen posible",
      },
      {
        id: "m1e18_d",
        label: "Automatización, para eliminar la intervención de las personas",
      },
    ],
    correctAnswer: "m1e18_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Decisiones con impacto requieren transparencia y supervisión humana. Repasa el video de principios.",
  },
  {
    id: "m1e19",
    question: "¿Qué caracteriza a los sistemas de IA de riesgo limitado (UE)?",
    options: [
      {
        id: "m1e19_a",
        label: "Obligaciones de transparencia, como avisar que se usa IA",
      },
      {
        id: "m1e19_b",
        label: "Prohibición total de su uso en cualquier contexto posible",
      },
      {
        id: "m1e19_c",
        label: "Exigencia de licencia especial para poder desarrollarlos",
      },
      {
        id: "m1e19_d",
        label: "Prohibición de publicar que se está usando IA en ellos",
      },
    ],
    correctAnswer: "m1e19_a",
    topic: "Marco Regulatorio",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "El riesgo limitado exige transparencia, no prohibición. Repasa la guía de ética.",
  },
  {
    id: "m1e20",
    question:
      "Un sistema trata a los usuarios sin decirles que participa una IA. ¿Qué principio se incumple?",
    options: [
      {
        id: "m1e20_a",
        label: "Transparencia: avisar cuando una IA participa en una decisión",
      },
      {
        id: "m1e20_b",
        label: "Velocidad: resolver el caso en el menor tiempo",
      },
      {
        id: "m1e20_c",
        label: "Popularidad: que el sistema guste a los usuarios",
      },
      {
        id: "m1e20_d",
        label: "Ahorro: reducir el costo operativo de la herramienta",
      },
    ],
    correctAnswer: "m1e20_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "La transparencia exige avisar cuando una IA participa en una decisión. Velocidad, popularidad y ahorro no son el principio que se incumple.",
  },
];
