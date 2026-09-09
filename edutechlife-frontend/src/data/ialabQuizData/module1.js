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
        label: "Para obtener respuestas útiles y alineadas con lo que necesito",
      },
      { id: "m1q1_c", label: "Para que la IA funcione más rápido sin errores" },
      { id: "m1q1_d", label: "Para que la IA escriba el código por mí" },
    ],
    correctAnswer: "m1q1_b",
    topic: "Ingeniería de Prompts",
    difficulty: "fácil",
    source: "Video: Cómo Crear Prompts Efectivos",
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
        label: "Tiene la Tarea, pero le faltan el Rol y el Formato",
      },
      {
        id: "m1q2_b",
        label: "Tiene el Rol, pero le faltan la Tarea y el Formato",
      },
      {
        id: "m1q2_c",
        label: "Tiene el Formato, pero le faltan el Rol y la Tarea",
      },
      { id: "m1q2_d", label: "Ya incluye los tres componentes de RTF" },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "medio",
    source: "Guía PDF: Anatomía de un Prompt",
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
        label:
          "Estructura el pedido para obtener una respuesta clara y organizada",
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
    source: "OVA: Cómo comunicarte con la IA (prompts)",
    feedback:
      'RTF ordena el pedido en Rol, Tarea y Formato. Practica en el OVA "Cómo comunicarte con la IA".',
  },
  {
    id: "m1q4",
    question:
      "Tienes que pedir un resumen sobre el ciclo del agua. ¿Cuál prompt te dará el mejor resultado?",
    options: [
      {
        id: "m1q4_a",
        label:
          '"Actúa como profesor de ciencias y resume el ciclo del agua en 4 pasos."',
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
    source: "Video: Cómo Crear Prompts Efectivos",
    feedback:
      'La opción A define rol, tarea y un formato claro. Las demás son vagas o mezclan temas. Revisa el video "Cómo Crear Prompts Efectivos".',
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
      { id: "m1q5_b", label: "Dividir el artículo en fragmentos más pequeños" },
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
    source: "OVA: Cómo comunicarte con la IA (prompts)",
    feedback:
      'El prompt genérico no indica audiencia ni formato. Agrega rol, público y extensión (p. ej. "resumen en 5 viñetas para directivos no técnicos").',
  },
  {
    id: "m1q6",
    question: "¿Qué es la inteligencia artificial generativa?",
    options: [
      {
        id: "m1q6_a",
        label: "Un sistema que crea contenido nuevo a partir de lo aprendido",
      },
      {
        id: "m1q6_b",
        label: "Una base de datos que guarda respuestas ya escritas",
      },
      {
        id: "m1q6_c",
        label: "Un programa que solo clasifica imágenes y textos",
      },
      { id: "m1q6_d", label: "Un buscador que devuelve páginas de internet" },
    ],
    correctAnswer: "m1q6_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
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
      { id: "m1q7_b", label: "La respuesta automática que genera la IA" },
      {
        id: "m1q7_c",
        label: "El diseño visual de la interfaz de la herramienta",
      },
      { id: "m1q7_d", label: "Un tipo de archivo que la IA puede abrir" },
    ],
    correctAnswer: "m1q7_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
        label: "Porque ajusta el estilo y el enfoque de la respuesta",
      },
      {
        id: "m1q8_b",
        label: "Porque hace que la IA responda siempre más corto",
      },
      {
        id: "m1q8_c",
        label: "Porque evita que la IA necesite ver el contexto",
      },
      { id: "m1q8_d", label: "Porque es obligatorio para que la IA funcione" },
    ],
    correctAnswer: "m1q8_a",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "Guía PDF: Anatomía de un Prompt",
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
        label: "Agregar contexto claro: objetivo, audiencia y formato deseado",
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
    source: "OVA: Laboratorio de Prompts en Vivo",
    feedback:
      'Refina el prompt agregando contexto. Practica en el "Laboratorio de Prompts en Vivo".',
  },
  {
    id: "m1q10",
    question:
      "Quieres que la IA te explique un tema complicado. ¿Cuál prompt pide una explicación más clara?",
    options: [
      {
        id: "m1q10_a",
        label: '"Explícame con ejemplos simples y un lenguaje cotidiano."',
      },
      {
        id: "m1q10_b",
        label: '"Dame toda la teoría del tema en una sola respuesta."',
      },
      {
        id: "m1q10_c",
        label: '"Háblame del tema y también de otros similares."',
      },
      {
        id: "m1q10_d",
        label: '"Explica este tema como lo haría un experto avanzado."',
      },
    ],
    correctAnswer: "m1q10_a",
    topic: "Claridad en Prompts",
    difficulty: "medio",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
    feedback:
      "Pedir ejemplos y lenguaje simple ayuda a que la explicación sea más clara y útil.",
  },
];
