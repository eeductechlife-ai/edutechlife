export const MODULE_1 = [
  {
    id: "m1q1",
    question: "¿Cuál es el propósito principal de la ingeniería de prompts?",
    options: [
      { id: "m1q1_a", label: "Hacer preguntas más largas a la IA" },
      {
        id: "m1q1_b",
        label:
          "Dar instrucciones claras y efectivas para obtener resultados útiles",
      },
      { id: "m1q1_c", label: "Usar palabras técnicas complicadas" },
      { id: "m1q1_d", label: "Hacer que la IA escriba código automáticamente" },
    ],
    correctAnswer: "m1q1_b",
    topic: "Ingeniería de Prompts",
    difficulty: "fácil",
    feedback:
      'Repasa el tema "IA Generativa: Tu Primer Paso" en los recursos del módulo.',
  },
  {
    id: "m1q2",
    question:
      'Un estudiante escribe: "Escribe un texto sobre inteligencia artificial para estudiantes." Según el método RTF (Rol, Tarea, Formato), ¿qué componentes están presentes y cuáles faltan?',
    options: [
      {
        id: "m1q2_a",
        label:
          "La Tarea está presente; faltan el Rol y el Formato — no define qué perfil adopta la IA ni cómo estructurar la respuesta",
      },
      {
        id: "m1q2_b",
        label: "Todos los componentes de RTF están presentes en el prompt",
      },
      {
        id: "m1q2_c",
        label: "Solo falta el Rol; la Tarea y el Formato están bien definidos",
      },
      {
        id: "m1q2_d",
        label: "Solo falta el Formato; el Rol y la Tarea están bien definidos",
      },
    ],
    correctAnswer: "m1q2_a",
    topic: "Método RTF",
    difficulty: "medio",
    feedback:
      'El prompt tiene una Tarea clara ("escribe un texto") pero no define el Rol de la IA (¿divulgador? ¿profesor?) ni el Formato (¿lista? ¿ensayo? ¿cuántas palabras?). Revisa la guía "Anatomía de un Prompt" (PDF) y el video "Cómo crear un buen prompt".',
  },
  {
    id: "m1q3",
    question:
      "¿Cuál es una ventaja clave del método RTF (Rol, Tarea, Formato)?",
    options: [
      { id: "m1q3_a", label: "Hace las preguntas más cortas" },
      {
        id: "m1q3_b",
        label:
          "Estructura las instrucciones para obtener respuestas organizadas y alineadas",
      },
      { id: "m1q3_c", label: "Elimina la necesidad de contexto" },
      { id: "m1q3_d", label: "Automatiza completamente el proceso" },
    ],
    correctAnswer: "m1q3_b",
    topic: "Marco de Maestría",
    difficulty: "fácil",
    feedback:
      'Repasa "La Fórmula del Prompt Perfecto" en los recursos del módulo.',
  },
  {
    id: "m1q4",
    question:
      'Según la guía "Anatomía de un Prompt" (PDF del módulo) y el video "Cómo crear un buen prompt", ¿cuál de estos prompts está MEJOR estructurado para obtener una respuesta precisa y útil?',
    options: [
      { id: "m1q4_a", label: '"Dime todo sobre el cambio climático"' },
      {
        id: "m1q4_b",
        label:
          '"Actúa como un divulgador científico. Explica 3 causas del cambio climático y sus efectos concretos. Usa un tono accesible para público general y termina con una conclusión de 2 líneas."',
      },
      { id: "m1q4_c", label: '"Cambio climático: causas y efectos"' },
      {
        id: "m1q4_d",
        label:
          '"Necesito información sobre el cambio climático para un trabajo escolar"',
      },
    ],
    correctAnswer: "m1q4_b",
    topic: "Estructura de Prompts",
    difficulty: "medio",
    feedback:
      "El prompt B sigue la estructura recomendada en el PDF y el video: define un Rol (divulgador científico), una Tarea específica (explicar 3 causas y efectos) y un Formato claro (tono accesible, conclusión de 2 líneas).",
  },
  {
    id: "m1q5",
    question:
      'Un estudiante necesita un resumen ejecutivo de un artículo sobre redes neuronales para presentarlo a directivos sin formación técnica. Escribe: "Resume este artículo sobre redes neuronales." La IA devuelve un texto técnico de 3 páginas. ¿Cuál es la causa del problema y cómo debería modificarse el prompt?',
    options: [
      {
        id: "m1q5_a",
        label:
          "El artículo es demasiado extenso; debería dividir el texto en partes más pequeñas",
      },
      {
        id: "m1q5_b",
        label:
          'Falta especificar el Rol, la Audiencia y el Formato. Debería ser: "Actúa como un consultor tecnológico. Resumen ejecutivo en 5 viñetas para directivos sin formación técnica. Máximo 200 palabras."',
      },
      {
        id: "m1q5_c",
        label:
          "La IA no comprende el tema; debería usar otra herramienta de IA",
      },
      {
        id: "m1q5_d",
        label:
          'El problema es la palabra "resume"; debería usar "sintetiza" en su lugar',
      },
    ],
    correctAnswer: "m1q5_b",
    topic: "Aplicación RTF",
    difficulty: "difícil",
    feedback:
      'El prompt original solo tiene una Tarea genérica. Para un resultado útil, necesita definir el Rol (consultor tecnológico), la Audiencia (directivos no técnicos) y el Formato (5 viñetas, 200 palabras). Revisa el OVA "Cómo comunicarte con la IA" y la guía PDF.',
  },
  {
    id: "m1q6",
    question: "¿Qué consideraciones éticas son clave al usar IA generativa?",
    options: [
      { id: "m1q6_a", label: "Solo la velocidad de respuesta" },
      {
        id: "m1q6_b",
        label: "Sesgos, privacidad, transparencia y uso responsable",
      },
      { id: "m1q6_c", label: "El costo de la API" },
      { id: "m1q6_d", label: "La cantidad de tokens usados" },
    ],
    correctAnswer: "m1q6_b",
    topic: "Ética en IA",
    difficulty: "medio",
    feedback: "Repasa los recursos del módulo sobre uso responsable de IA.",
  },
  {
    id: "m1q7",
    question:
      'Compara estos dos prompts para la misma tarea:\n\nPrompt A: "Háblame del ciclo del agua."\nPrompt B: "Actúa como un profesor de ciencias naturales. Explica el ciclo del agua en 4 etapas clave para estudiantes de 10-12 años. Incluye una analogía simple por cada etapa y termina con una pregunta de verificación."\n\n¿Cuál es la razón principal por la que el Prompt B obtendrá un mejor resultado?',
    options: [
      {
        id: "m1q7_a",
        label:
          "El Prompt B es más largo, por lo tanto la IA se esfuerza más en la respuesta",
      },
      {
        id: "m1q7_b",
        label:
          "El Prompt B usa el método RTF completo (Rol + Tarea + Formato + Audiencia), dando instrucciones claras y específicas",
      },
      {
        id: "m1q7_c",
        label: "El Prompt A usa palabras demasiado simples para la IA",
      },
      { id: "m1q7_d", label: "El Prompt B usa un tono más formal y técnico" },
    ],
    correctAnswer: "m1q7_b",
    topic: "Análisis Comparativo RTF",
    difficulty: "difícil",
    feedback:
      'El Prompt B sigue el método RTF: define un Rol (profesor de ciencias), una Tarea específica (explicar en 4 etapas), una Audiencia (estudiantes 10-12 años) y un Formato (analogías + pregunta). El Prompt A es genérico y carece de estructura. Revisa el PDF "Anatomía de un Prompt".',
  },
  {
    id: "m1q8",
    question:
      "¿Cómo se estructura un prompt usando RTF para análisis de mercado?",
    options: [
      { id: "m1q8_a", label: 'Pidiendo directamente "analiza el mercado"' },
      {
        id: "m1q8_b",
        label:
          "Definiendo Rol, Tarea y Formato para guiar la respuesta de la IA",
      },
      { id: "m1q8_c", label: "Usando la menor cantidad de palabras posible" },
      { id: "m1q8_d", label: "Copiando prompts de internet" },
    ],
    correctAnswer: "m1q8_b",
    topic: "Marco de Maestría",
    difficulty: "difícil",
    feedback:
      "Practica con las plantillas JSON del módulo para dominar la estructura RTF.",
  },
  {
    id: "m1q9",
    question:
      "Trabajas en una empresa que lanza un nuevo producto cada mes. Necesitas que ChatGPT redacte correos promocionales consistentes con la voz de la marca. ¿Cuál es la estrategia más eficiente para mantener consistencia sin reescribir instrucciones cada vez?",
    options: [
      {
        id: "m1q9_a",
        label:
          "Crear un GPT personalizado con instrucciones de tono, voz y ejemplos de la marca en la base de conocimiento",
      },
      {
        id: "m1q9_b",
        label:
          "Copiar y pegar las instrucciones manualmente en cada nueva conversación",
      },
      {
        id: "m1q9_c",
        label: "Usar el chat estándar y pedirle que recuerde el tono cada vez",
      },
      {
        id: "m1q9_d",
        label: "Escribir los correos manualmente sin ayuda de IA",
      },
    ],
    correctAnswer: "m1q9_a",
    topic: "GPTs Personalizados",
    difficulty: "medio",
    feedback:
      "Un GPT personalizado con instrucciones persistentes y base de conocimiento es la forma más eficiente de mantener consistencia. Revisa el tema de GPTs personalizados en los recursos del módulo.",
  },
  {
    id: "m1q10",
    question:
      "Escribes un prompt pidiendo un plan de marketing. La IA te da algo genérico. ¿Cuál es el mejor siguiente paso?",
    options: [
      {
        id: "m1q10_a",
        label:
          "Aceptar el resultado genérico porque la IA ya dio lo mejor que podía",
      },
      {
        id: "m1q10_b",
        label:
          "Refinar el prompt agregando contexto específico: industria, presupuesto, audiencia objetivo y ejemplos de campañas anteriores",
      },
      {
        id: "m1q10_c",
        label: "Cambiar completamente de tema y empezar de cero",
      },
      { id: "m1q10_d", label: "Quejarse con el equipo de soporte de la IA" },
    ],
    correctAnswer: "m1q10_b",
    topic: "Refinamiento Iterativo",
    difficulty: "fácil",
    feedback:
      'La ingeniería de prompts es un proceso iterativo. Cada refinamiento agrega contexto que la IA necesita para darte resultados específicos y útiles. Revisa el tema "Refinamiento de Prompts" en los recursos del módulo.',
  },
  {
    id: "m1q11",
    question:
      "¿Cuál es la diferencia clave entre un prompt zero-shot y uno few-shot?",
    options: [
      {
        id: "m1q11_a",
        label:
          "Zero-shot no usa ejemplos; few-shot incluye ejemplos en el prompt para guiar a la IA",
      },
      {
        id: "m1q11_b",
        label: "Zero-shot funciona sin internet; few-shot necesita conexión",
      },
      {
        id: "m1q11_c",
        label: "Zero-shot solo funciona con imágenes; few-shot solo con texto",
      },
      {
        id: "m1q11_d",
        label: "No hay diferencia, son términos intercambiables",
      },
    ],
    correctAnswer: "m1q11_a",
    topic: "Estrategias de Prompting",
    difficulty: "medio",
    feedback:
      "En zero-shot le das una instrucción directa (una sola vez). En few-shot le proporcionas ejemplos (varias muestras) para establecer el patrón de respuesta deseado. Revisa el tema de estrategias de prompting en los recursos del módulo.",
  },
  {
    id: "m1q12",
    question:
      "¿Qué ventaja tiene usar un system prompt (instrucción del sistema) en lugar de incluir instrucciones en cada mensaje?",
    options: [
      {
        id: "m1q12_a",
        label:
          "El system prompt establece el comportamiento base de la IA para toda la conversación, evitando repetir instrucciones",
      },
      {
        id: "m1q12_b",
        label: "El system prompt hace que la IA responda más rápido",
      },
      {
        id: "m1q12_c",
        label: "El system prompt solo funciona en la versión paga de ChatGPT",
      },
      {
        id: "m1q12_d",
        label: "No hay diferencia, ambos métodos funcionan igual",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "System Prompts",
    difficulty: "medio",
    feedback:
      "Los system prompts definen el rol, tono y reglas base para toda la interacción. Esto es especialmente útil en GPTs personalizados y aplicaciones donde la consistencia es clave. Revisa el tema de system prompts en los recursos del módulo.",
  },
];
