export const MODULE_1_PART1 = [
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
      "Un buen prompt le dice a la IA qué necesitas, para quién y cómo lo quieres; por eso la respuesta se ajusta a tu objetivo. Más largo o más rápido no es lo que mejora.",
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
    question: "¿Qué significan las tres letras del método RTF?",
    options: [
      {
        id: "m1q3_a",
        label: "Rol, Tono y Formato",
      },
      {
        id: "m1q3_b",
        label: "Rol, Tarea y Formato",
      },
      {
        id: "m1q3_c",
        label: "Respuesta, Tema y Formato",
      },
      {
        id: "m1q3_d",
        label: "Rol, Tarea y Fuente",
      },
    ],
    correctAnswer: "m1q3_b",
    topic: "Método RTF",
    difficulty: "fácil",
    source: "El Cincel",
    feedback:
      "RTF significa Rol (desde qué mirada responde la IA), Tarea (la acción concreta) y Formato (cómo entrega la respuesta). El tono y la extensión se suman aparte. Practica en el OVA El Cincel.",
  },
  {
    id: "m1q4",
    question:
      "Sospechas que una IA describe distinto a las personas según su origen. ¿Qué prueba sencilla puedes hacer?",
    options: [
      {
        id: "m1q4_a",
        label: "Pedir la misma tarea con perfiles distintos y comparar",
      },
      {
        id: "m1q4_b",
        label: "Preguntarle a la IA si tiene sesgos y creerle",
      },
      {
        id: "m1q4_c",
        label: "Repetir el mismo prompt varias veces con el mismo perfil",
      },
      {
        id: "m1q4_d",
        label: "Pedirle que responda más corto para reducir el sesgo",
      },
    ],
    correctAnswer: "m1q4_a",
    topic: "Detectar sesgos",
    difficulty: "medio",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "Si cambias solo el perfil y la respuesta trata distinto a cada persona, encontraste un sesgo. Preguntarle a la IA si es neutral o repetir el mismo perfil no muestra esa diferencia. Repasa la guía de ética, sección 4.",
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
      "Pides a la IA un plan de estudio y te da uno genérico que no te sirve. ¿Qué le falta al prompt?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Tu situación: cuánto tiempo tienes, tu nivel y la fecha del examen",
      },
      {
        id: "m1q9_b",
        label: 'Un rol más llamativo, como "actúa como un genio"',
      },
      {
        id: "m1q9_c",
        label: "Que lo haga más largo y con muchos más detalles",
      },
      {
        id: "m1q9_d",
        label: 'Palabras amables como "por favor" para que se esfuerce',
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "Contexto",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      'La IA no conoce tu situación. El contexto (tu tiempo, tu nivel y tu fecha límite) es lo que convierte un plan genérico en uno útil. Un rol llamativo, más extensión o palabras amables no le dan esa información. Repasa la "Guía: Anatomía de un Prompt".',
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
      "Pides ejemplos de profesiones y todos muestran a hombres de ciudad. Ningún dato es falso. ¿Qué pregunta te ayuda a ver el problema?",
    options: [
      {
        id: "m1q11_a",
        label: "¿Qué personas o perspectivas quedan por fuera?",
      },
      {
        id: "m1q11_b",
        label: "¿Alguno de los datos de la respuesta es falso?",
      },
      {
        id: "m1q11_c",
        label: "¿La respuesta cita alguna fuente confiable?",
      },
      {
        id: "m1q11_d",
        label: "¿Las profesiones de la lista existen de verdad?",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Sesgo por omisión",
    difficulty: "fácil",
    source: "PDF: Ética de la Inteligencia artificial",
    feedback:
      "El sesgo a veces no está en lo que la respuesta dice, sino en lo que omite. Preguntar qué personas o perspectivas quedan por fuera lo revela; revisar si los datos son ciertos o si hay fuentes no lo muestra. Repasa la guía de ética, sección 4.",
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
];
