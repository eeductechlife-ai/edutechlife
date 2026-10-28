export const MODULE_1_PART2 = [
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
    question:
      "El Juramento del Guardián propone tres preguntas para cada resultado de IA: ¿es cierto?, ¿es justo?, ¿lo declaro? ¿Cuándo puedes usar el resultado?",
    options: [
      {
        id: "m1q18_a",
        label: "Cuando las tres tienen un sí: es cierto, es justo y lo declaro",
      },
      {
        id: "m1q18_b",
        label: "Cuando es cierto; ser justo y declararlo son pasos opcionales",
      },
      {
        id: "m1q18_c",
        label: "Cuando al menos dos de las tres preguntas tienen un sí",
      },
      {
        id: "m1q18_d",
        label: "Cuando lo declaras, porque así la responsabilidad pasa a la IA",
      },
    ],
    correctAnswer: "m1q18_a",
    topic: "Tres preguntas del guardián",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Las tres preguntas van juntas: un resultado cierto pero injusto, o justo pero sin declarar, todavía no está listo. Declarar el uso no traslada la responsabilidad a la IA: una persona sigue respondiendo por la decisión final. Repasa la guía de ética.",
  },
  {
    id: "m1q19",
    question:
      "Pegaste por error en un chat de IA una lista de clientes y una contraseña. ¿Qué haces?",
    options: [
      {
        id: "m1q19_a",
        label: "Sigo en esa conversación y le pido a la IA que lo olvide",
      },
      {
        id: "m1q19_b",
        label: "Borro solo mi último mensaje y sigo usando ese chat",
      },
      {
        id: "m1q19_c",
        label:
          "Dejo de pegar datos, borro la conversación si se puede, cambio la clave y aviso al responsable",
      },
      {
        id: "m1q19_d",
        label: "Cambio la clave, pero no aviso a nadie porque fue un error mío",
      },
    ],
    correctAnswer: "m1q19_c",
    topic: "Si ya compartiste un dato sensible",
    difficulty: "fácil",
    source: "Manual de Privacidad en IA",
    feedback:
      "Si ya compartiste algo sensible, actúa rápido y con orden: deja de pegar información, borra la conversación si la herramienta lo permite, cambia las claves y avisa al responsable de datos si son de terceros. Pedirle a la IA que lo olvide o callar el error no protege a nadie. Repasa el «Manual de Privacidad en IA».",
  },
  {
    id: "m1q20",
    question:
      "Necesitas la respuesta en una tabla. ¿Qué debes indicar en el prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "El formato: una tabla con columnas",
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
      "Indicar el formato (tabla, viñetas o lista) hace que la IA entregue la respuesta en la forma que necesitas.",
  },
  {
    id: "m1q21",
    question:
      "Necesitas una respuesta de tres líneas para un chat del móvil. ¿Qué debes precisar?",
    options: [
      {
        id: "m1q21_a",
        label: "La extensión máxima: tres líneas",
      },
      {
        id: "m1q21_b",
        label: "Un tono cercano, como en un chat",
      },
      {
        id: "m1q21_c",
        label: "Que responda en una tabla para leerla mejor",
      },
      {
        id: "m1q21_d",
        label: "Que la IA decida cuánto escribir",
      },
    ],
    correctAnswer: "m1q21_a",
    topic: "Extensión",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Indicar la extensión (tres líneas) evita respuestas largas que no caben en el chat. El tono o una tabla no controlan cuánto escribe la IA.",
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
    topic: "Privacidad",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Un dato personal pegado en una herramienta sale de tu control y puede quedar guardado. Por eso se anonimiza antes de compartirlo.",
  },
  {
    id: "m1q23",
    question:
      "Una profesora quiere que la IA le ayude con los comentarios del boletín. ¿Cómo prepara la lista antes de pegarla?",
    options: [
      {
        id: "m1q23_a",
        label:
          "Cambia los nombres por «Estudiante A, B, C» y quita colegio y documento",
      },
      {
        id: "m1q23_b",
        label: "Deja los nombres, pero quita las notas para no exponerlas",
      },
      {
        id: "m1q23_c",
        label: "Usa las iniciales de cada estudiante y deja el colegio",
      },
      {
        id: "m1q23_d",
        label: "Pega la lista completa y le pide a la IA que no la guarde",
      },
    ],
    correctAnswer: "m1q23_a",
    topic: "Anonimizar",
    difficulty: "fácil",
    source: "Manual de Privacidad en IA",
    feedback:
      "Cambiar personas por roles y quitar colegio y documento permite que la IA ayude con el formato sin conocer a nadie. Las iniciales junto con el colegio todavía pueden identificar a un estudiante, y pedir que no guarde la lista no devuelve el control de esos datos. Repasa el «Manual de Privacidad en IA».",
  },
  {
    id: "m1q24",
    question:
      "Vas a usar por primera vez una herramienta de IA. ¿Cuál es un buen primer paso para cuidar tu privacidad?",
    options: [
      {
        id: "m1q24_a",
        label:
          "Crear una contraseña segura y dar por hecho que tus chats son privados",
      },
      {
        id: "m1q24_b",
        label: "Suponer que, si es gratuita, la herramienta no guarda nada",
      },
      {
        id: "m1q24_c",
        label:
          "Revisar en los ajustes si tus chats se usan para mejorar el servicio",
      },
      {
        id: "m1q24_d",
        label: "Probarla pegando tus datos reales para ver cómo responde",
      },
    ],
    correctAnswer: "m1q24_c",
    topic: "Ajustes de privacidad",
    difficulty: "medio",
    source: "Manual de Privacidad en IA",
    feedback:
      "Muchas veces no sabes si lo que escribes se usa para mejorar el servicio. Revisar los ajustes y desactivarlo si puedes es el primer paso que propone el «Manual de Privacidad en IA». Una contraseña protege tu cuenta, pero no decide qué pasa con lo que escribes.",
  },
  {
    id: "m1q25",
    question:
      "Vas a publicar en el blog del colegio un artículo hecho con apoyo de IA que usa ideas de otros autores. En Colombia, la Ley 23 de 1982 protege sus obras. ¿Qué haces?",
    options: [
      {
        id: "m1q25_a",
        label:
          "Cito las fuentes, no copio textos protegidos y declaro el apoyo de IA",
      },
      {
        id: "m1q25_b",
        label:
          "Copio los fragmentos, porque la IA ya los reescribió con otras palabras",
      },
      {
        id: "m1q25_c",
        label: "Publico sin citar, porque lo que genera la IA no tiene autor",
      },
      {
        id: "m1q25_d",
        label:
          "Cito solo a los autores famosos; los demás no necesitan crédito",
      },
    ],
    correctAnswer: "m1q25_a",
    topic: "Propiedad intelectual",
    difficulty: "fácil",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "La Ley 23 de 1982 protege las obras de sus autores, y usar IA no te da derecho sobre ellas. Por eso citas las fuentes, no copias textos protegidos y declaras lo que generaste con IA al publicarlo. Repasa la guía de ética, sección 6.",
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
    question:
      "Un estudiante de 12 años quiere subir a una IA fotos y nombres de sus compañeros para un proyecto. ¿Qué regla aplica?",
    options: [
      {
        id: "m1q27_a",
        label:
          "Con niñas, niños o adolescentes, un adulto responsable decide qué se comparte",
      },
      {
        id: "m1q27_b",
        label: "Basta con que sus compañeros le digan que sí",
      },
      {
        id: "m1q27_c",
        label: "Puede subirlas si la herramienta es educativa y gratuita",
      },
      {
        id: "m1q27_d",
        label: "Puede subirlas si las borra al terminar el proyecto",
      },
    ],
    correctAnswer: "m1q27_a",
    topic: "Menores de edad",
    difficulty: "medio",
    source: "Manual de Privacidad en IA",
    feedback:
      "Con menores, un adulto responsable decide qué se comparte, elige las herramientas y supervisa el uso; la ley restringe el tratamiento de datos de niñas, niños y adolescentes. El sí de los compañeros, una herramienta educativa o borrar después no cambian esa regla. Repasa el «Manual de Privacidad en IA».",
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
];
