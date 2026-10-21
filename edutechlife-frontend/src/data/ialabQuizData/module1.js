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
    source: "El Cincel",
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
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
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
    source: "El Martillo",
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
    source: "El Cincel",
    feedback:
      "Pedir ejemplos y lenguaje simple ayuda a que la explicación sea más clara y útil.",
  },
  {
    id: "m1q11",
    question:
      "Una IA generativa produce texto nuevo en lugar de limitarse a clasificar datos. ¿Cuál es la diferencia clave?",
    options: [
      {
        id: "m1q11_a",
        label: "Crea contenido original a partir de patrones aprendidos",
      },
      {
        id: "m1q11_b",
        label: "Solo copia y pega textos ya existentes en internet",
      },
      { id: "m1q11_c", label: "Funciona únicamente con hojas de cálculo" },
      { id: "m1q11_d", label: "No necesita datos para aprender" },
    ],
    correctAnswer: "m1q11_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La IA generativa produce contenido nuevo (texto, imagen, audio) basado en patrones aprendidos. Mira el video del tema 1.",
  },
  {
    id: "m1q12",
    question: "¿Cuál de estas afirmaciones describe MEJOR a la IA generativa?",
    options: [
      {
        id: "m1q12_a",
        label:
          "Aprende patrones de grandes volúmenes de datos y genera respuestas nuevas",
      },
      {
        id: "m1q12_b",
        label:
          "Es un buscador que solo devuelve una lista de enlaces de internet",
      },
      {
        id: "m1q12_c",
        label:
          "Guarda respuestas escritas por personas y las reutiliza tal cual",
      },
      {
        id: "m1q12_d",
        label:
          "Solo sirve para traducir textos de un idioma a otro sin generar nada",
      },
    ],
    correctAnswer: "m1q12_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "Aprende de datos y genera contenido nuevo, no recupera respuestas guardadas. Repasa el video del tema 1.",
  },
  {
    id: "m1q13",
    question:
      "¿Qué aporta conocer los comienzos de la inteligencia artificial al usarla hoy?",
    options: [
      {
        id: "m1q13_a",
        label: "Entender de dónde vienen sus capacidades y límites actuales",
      },
      { id: "m1q13_b", label: "Memorizar fechas para aprobar sin comprender" },
      { id: "m1q13_c", label: "Programar una IA desde cero en una tarde" },
      { id: "m1q13_d", label: "Nada, la historia no influye en el uso actual" },
    ],
    correctAnswer: "m1q13_a",
    topic: "Historia de la IA",
    difficulty: "medio",
    source: "Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La historia explica por qué la IA llegó a generar contenido y dónde están sus límites. Revisa el video 'Comienzos de la Inteligencia Artificial'.",
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
      "Genera y transforma texto, pero no garantiza veracidad ni reemplaza tu criterio. Revisa el tema 1.",
  },
  {
    id: "m1q15",
    question:
      "La IA afirma datos con seguridad aunque sean falsos. ¿Cómo se llama ese fenómeno?",
    options: [
      {
        id: "m1q15_a",
        label:
          "Alucinación: genera información que parece cierta pero no lo es",
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
    question:
      "Antes de usar en un trabajo un dato que dio la IA, ¿qué es lo más responsable?",
    options: [
      {
        id: "m1q16_a",
        label: "Verificarlo en una fuente confiable antes de usarlo",
      },
      { id: "m1q16_b", label: "Usarlo igual porque la IA casi nunca falla" },
      { id: "m1q16_c", label: "Copiarlo tal cual sin revisar" },
      { id: "m1q16_d", label: "Pedirle a la misma IA que confirme y confiar" },
    ],
    correctAnswer: "m1q16_a",
    topic: "Uso responsable",
    difficulty: "fácil",
    source: "El Cincel",
    feedback:
      "Tú eres responsable del resultado: verifica los datos importantes en fuentes confiables.",
  },
  {
    id: "m1q17",
    question:
      "¿Qué tres elementos básicos conviene incluir en un prompt para obtener buenos resultados?",
    options: [
      {
        id: "m1q17_a",
        label: "Rol, tarea y formato (o contexto claro)",
      },
      { id: "m1q17_b", label: "Saludo, emoji y despedida" },
      { id: "m1q17_c", label: "Contraseña, usuario y fecha" },
      { id: "m1q17_d", label: "Tema, opinión y firma" },
    ],
    correctAnswer: "m1q17_a",
    topic: "Fundamentos de Prompts",
    difficulty: "fácil",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "Rol (quién es la IA), tarea (qué quieres) y formato (cómo lo quieres). Revisa la 'Guía: Anatomía de un Prompt'.",
  },
  {
    id: "m1q18",
    question: "¿Para qué sirve dar contexto en un prompt?",
    options: [
      {
        id: "m1q18_a",
        label: "Para que la respuesta se ajuste a tu situación real",
      },
      { id: "m1q18_b", label: "Para que la IA escriba más texto sin sentido" },
      { id: "m1q18_c", label: "Para que la IA tarde menos" },
      { id: "m1q18_d", label: "Para no tener que indicar la tarea" },
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
    question: "¿Cuál prompt es MÁS específico?",
    options: [
      {
        id: "m1q19_a",
        label:
          '"Resume en 5 viñetas los riesgos del sedentarismo para adultos mayores"',
      },
      {
        id: "m1q19_b",
        label:
          '"Háblame de la salud en general y de otros temas parecidos que se te ocurran"',
      },
      {
        id: "m1q19_c",
        label:
          '"Dame información variada y extensa sobre muchos temas de interés general"',
      },
      {
        id: "m1q19_d",
        label:
          '"Escribe algo interesante y útil que pueda usar en mi trabajo diario"',
      },
    ],
    correctAnswer: "m1q19_a",
    topic: "Claridad en Prompts",
    difficulty: "fácil",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "A define tema, formato y audiencia; los demás son vagos. Revisa 'Cómo Crear Prompts Efectivos'.",
  },
  {
    id: "m1q20",
    question:
      "Necesitas la respuesta en una tabla. ¿Qué debes indicar en el prompt?",
    options: [
      {
        id: "m1q20_a",
        label: "El formato de salida: tabla con columnas concretas",
      },
      { id: "m1q20_b", label: "Que responda lo más rápido posible" },
      { id: "m1q20_c", label: "Solo la primera letra de cada idea" },
      { id: "m1q20_d", label: "Que no use números ni detalles" },
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
      "Vas a compartir la respuesta con estudiantes de primaria. ¿Qué deberías precisar?",
    options: [
      {
        id: "m1q21_a",
        label: "La audiencia y el nivel de lenguaje adecuado",
      },
      { id: "m1q21_b", label: "El color de fondo de la herramienta" },
      { id: "m1q21_c", label: "La marca de tu computador" },
      { id: "m1q21_d", label: "El idioma del sistema operativo" },
    ],
    correctAnswer: "m1q21_a",
    topic: "Audiencia",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Indicar la audiencia (niños) y el nivel de lenguaje ajusta el tono y la complejidad.",
  },
  {
    id: "m1q22",
    question:
      "La primera respuesta no es la que quieres. ¿Cuál es la mejor estrategia?",
    options: [
      {
        id: "m1q22_a",
        label: "Ajustar el prompt con más detalle y volver a pedir",
      },
      { id: "m1q22_b", label: "Abandonar porque la IA no sirve para eso" },
      { id: "m1q22_c", label: "Repetir el mismo prompt muchas veces" },
      { id: "m1q22_d", label: "Cambiar de herramienta sin cambiar el prompt" },
    ],
    correctAnswer: "m1q22_a",
    topic: "Refinamiento de Prompts",
    difficulty: "fácil",
    source: "El Martillo",
    feedback:
      "Iterar el prompt es parte del trabajo. Practica en el 'Laboratorio de Prompts en Vivo'.",
  },
  {
    id: "m1q23",
    question:
      "Quieres una explicación breve: 'en máximo 100 palabras'. ¿Qué estás usando?",
    options: [
      { id: "m1q23_a", label: "Una restricción de longitud en el prompt" },
      { id: "m1q23_b", label: "Un error que rompe la IA" },
      { id: "m1q23_c", label: "Un tipo de archivo" },
      { id: "m1q23_d", label: "Una contraseña de la herramienta" },
    ],
    correctAnswer: "m1q23_a",
    topic: "Restricciones",
    difficulty: "medio",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "Las restricciones (longitud, tono, público) acotan la respuesta al resultado deseado.",
  },
  {
    id: "m1q24",
    question:
      "Incluir un ejemplo del resultado esperado dentro del prompt, ¿para qué sirve?",
    options: [
      {
        id: "m1q24_a",
        label: "Guía a la IA con el estilo y la estructura que deseas obtener",
      },
      {
        id: "m1q24_b",
        label:
          "Hace que la IA ignore por completo el ejemplo que le entregaste",
      },
      {
        id: "m1q24_c",
        label:
          "Obliga a la IA a responder siempre en un idioma diferente al tuyo",
      },
      {
        id: "m1q24_d",
        label:
          "No tiene ningún efecto real sobre el resultado que entrega la IA",
      },
    ],
    correctAnswer: "m1q24_a",
    topic: "Ejemplos en el Prompt",
    difficulty: "difícil",
    source: "El Martillo",
    feedback:
      "Dar un ejemplo (pocos disparos) ayuda a la IA a copiar el estilo/formato esperado sin adivinar.",
  },
  {
    id: "m1q25",
    question:
      "El texto es para un informe formal. ¿Qué debes indicar en el prompt?",
    options: [
      { id: "m1q25_a", label: "El tono: formal y profesional" },
      { id: "m1q25_b", label: "Que use emojis y jerga" },
      { id: "m1q25_c", label: "Que escriba como en un chat de amigos" },
      { id: "m1q25_d", label: "Que omita todos los detalles" },
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
      'Prompt: "Hazme algo sobre marketing." ¿Cuál es el principal problema?',
    options: [
      {
        id: "m1q26_a",
        label: "Es ambiguo: no dice tarea, formato ni objetivo",
      },
      {
        id: "m1q26_b",
        label: "Es demasiado largo y contiene muchos datos irrelevantes",
      },
      {
        id: "m1q26_c",
        label: "Incluye demasiados ejemplos que terminan confundiendo a la IA",
      },
      {
        id: "m1q26_d",
        label: "Usa un tono demasiado formal para el público objetivo",
      },
    ],
    correctAnswer: "m1q26_a",
    topic: "Evitar Ambigüedad",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "Sin tarea, formato ni objetivo, la IA adivina. Sé específico y acota el resultado.",
  },
  {
    id: "m1q27",
    question:
      "¿Cuál es la diferencia entre pedir solo la tarea y pedir rol + tarea?",
    options: [
      {
        id: "m1q27_a",
        label: "El rol orienta el enfoque y el estilo de la respuesta",
      },
      {
        id: "m1q27_b",
        label:
          "No hay ninguna diferencia real entre pedir rol o pedir solo la tarea",
      },
      {
        id: "m1q27_c",
        label: "El rol hace que la IA responda con menos detalle que antes",
      },
      {
        id: "m1q27_d",
        label: "El rol reemplaza por completo la tarea que le pediste",
      },
    ],
    correctAnswer: "m1q27_a",
    topic: "Método RTF",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "El rol ('actúa como…') da enfoque; la tarea dice qué hacer. Juntos mejoran el resultado.",
  },
  {
    id: "m1q28",
    question: "Quieres un resumen para gerencia. ¿Cuál prompt es MÁS adecuado?",
    options: [
      {
        id: "m1q28_a",
        label:
          '"Resume este informe en 5 viñetas ejecutivas para gerencia no técnica"',
      },
      {
        id: "m1q28_b",
        label: '"Resume esto de la manera que mejor te parezca y sin límites"',
      },
      {
        id: "m1q28_c",
        label:
          '"Escribe mucho texto sobre el informe y todos sus detalles técnicos"',
      },
      {
        id: "m1q28_d",
        label: '"Traduce el informe a otro idioma para que quede más claro"',
      },
    ],
    correctAnswer: "m1q28_a",
    topic: "Aplicación RTF",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "A define formato (viñetas), extensión (5) y audiencia (gerencia). Es la más útil y clara.",
  },
  {
    id: "m1q29",
    question:
      "Quieres 10 ideas para una campaña. ¿Cuál prompt te dará mejores ideas?",
    options: [
      {
        id: "m1q29_a",
        label:
          '"Genera 10 ideas de campaña para una cafetería local, tono cercano, en viñetas"',
      },
      {
        id: "m1q29_b",
        label:
          '"Dame ideas variadas sobre marketing para negocios de cualquier tipo"',
      },
      {
        id: "m1q29_c",
        label:
          '"¿Qué opinas sobre el marketing y cómo se usa en las empresas?"',
      },
      {
        id: "m1q29_d",
        label:
          '"Escribe un ensayo largo y detallado sobre la publicidad moderna"',
      },
    ],
    correctAnswer: "m1q29_a",
    topic: "Aplicación de Prompts",
    difficulty: "fácil",
    source: "El Martillo",
    feedback:
      "A precisa cantidad, contexto, tono y formato: eso enfoca las ideas hacia lo que necesitas.",
  },
  {
    id: "m1q30",
    question: "Quieres aprender un tema paso a paso. ¿Cuál prompt ayuda más?",
    options: [
      {
        id: "m1q30_a",
        label:
          '"Explícame paso a paso, con un ejemplo en cada paso y lenguaje sencillo"',
      },
      { id: "m1q30_b", label: '"Dame toda la teoría en un párrafo denso"' },
      { id: "m1q30_c", label: '"Háblame de varios temas a la vez"' },
      { id: "m1q30_d", label: '"Resume el tema en una sola frase"' },
    ],
    correctAnswer: "m1q30_a",
    topic: "Aplicación de Prompts",
    difficulty: "medio",
    source: "El Martillo",
    feedback:
      "Pedir pasos, ejemplos y lenguaje sencillo produce una explicación más clara y aplicable.",
  },
  {
    id: "m1q31",
    question: "¿Cuál es un error común al escribir prompts?",
    options: [
      {
        id: "m1q31_a",
        label: "Pedir de forma vaga sin objetivo, audiencia ni formato",
      },
      {
        id: "m1q31_b",
        label:
          "Indicar claramente el rol que debe adoptar la inteligencia artificial",
      },
      {
        id: "m1q31_c",
        label: "Aclarar el formato y la extensión exacta que esperas recibir",
      },
      {
        id: "m1q31_d",
        label: "Dar un ejemplo concreto del resultado que quieres obtener",
      },
    ],
    correctAnswer: "m1q31_a",
    topic: "Errores Comunes",
    difficulty: "medio",
    source: "Cómo Crear Prompts Efectivos: La Fórmula para Dominar la IA",
    feedback:
      "La vaguedad es el error más frecuente: sin objetivo, audiencia ni formato la IA adivina.",
  },
  {
    id: "m1q32",
    question:
      "Un prompt incluye mucha información irrelevante. ¿Qué efecto suele tener?",
    options: [
      {
        id: "m1q32_a",
        label: "Confunde a la IA y desvía la respuesta del objetivo",
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
    difficulty: "difícil",
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
        label: "Ahorrar tiempo y mantener resultados consistentes",
      },
      { id: "m1q33_b", label: "Que la IA deje de aprender" },
      { id: "m1q33_c", label: "Evitar revisar los resultados" },
      { id: "m1q33_d", label: "Impedir ajustar el prompt después" },
    ],
    correctAnswer: "m1q33_a",
    topic: "Reutilización",
    difficulty: "medio",
    source: "El Martillo",
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
        label: "Comparar y validar la información antes de decidir",
      },
      { id: "m1q34_b", label: "Elegir la más larga sin leer" },
      { id: "m1q34_c", label: "Confiar en la primera que salga" },
      {
        id: "m1q34_d",
        label: "Preguntarle a otra IA cuál de las dos prefiere",
      },
    ],
    correctAnswer: "m1q34_a",
    topic: "Evaluación Crítica",
    difficulty: "difícil",
    source: "El Cincel",
    feedback:
      "Ante respuestas divergentes, valida los datos y usa tu criterio. No toda respuesta es igual de fiable.",
  },
  {
    id: "m1q35",
    question:
      "Vas a pegar información confidencial de la empresa en la IA. ¿Qué debes hacer?",
    options: [
      {
        id: "m1q35_a",
        label: "Evitar datos sensibles o anonimizarlos antes de usarlos",
      },
      { id: "m1q35_b", label: "Pegarlos igual sin problema" },
      { id: "m1q35_c", label: "Pedirle a la IA que los borre" },
      { id: "m1q35_d", label: "Compartirlos solo por chat privado" },
    ],
    correctAnswer: "m1q35_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "Guía: Anatomía de un Prompt",
    feedback:
      "No compartas datos confidenciales: anonimiza o evita información sensible antes de pedir ayuda a la IA.",
  },
  {
    id: "m1q36",
    question:
      "La IA responde con un sesgo o información incompleta. ¿Cuál es la mejor acción?",
    options: [
      {
        id: "m1q36_a",
        label: "Cuestionar, pedir otras perspectivas y verificar fuentes",
      },
      {
        id: "m1q36_b",
        label: "Aceptarlo tal cual porque la IA siempre es neutral y objetiva",
      },
      {
        id: "m1q36_c",
        label: "Publicarlo igual sin revisarlo porque el tema no es sensible",
      },
      {
        id: "m1q36_d",
        label: "Ignorar el sesgo detectado y continuar con la siguiente tarea",
      },
    ],
    correctAnswer: "m1q36_a",
    topic: "Pensamiento Crítico",
    difficulty: "difícil",
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
        label: "Usarla como apoyo y declarar cuándo la utilizaste",
      },
      { id: "m1q37_b", label: "Entregar su salida como propia sin revisar" },
      { id: "m1q37_c", label: "Copiar sin citar ninguna parte" },
      { id: "m1q37_d", label: "Usarla para suplantar a otra persona" },
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
    question:
      "La IA es un asistente, no un reemplazo. ¿Qué implica esto para el estudiante?",
    options: [
      {
        id: "m1q38_a",
        label: "Revisar y decidir con criterio propio el resultado final",
      },
      {
        id: "m1q38_b",
        label: "Aceptar todo lo que la IA entregue sin revisarlo antes",
      },
      {
        id: "m1q38_c",
        label: "Delegar por completo en la IA todas las decisiones importantes",
      },
      {
        id: "m1q38_d",
        label: "Evitar aprender el tema porque la IA ya lo resuelve todo",
      },
    ],
    correctAnswer: "m1q38_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "El Cincel",
    feedback:
      "La IA acelera el trabajo, pero la revisión y la decisión final son tuyas.",
  },
  {
    id: "m1q39",
    question:
      "Iterar el prompt varias veces hasta lograr el objetivo es una práctica…",
    options: [
      {
        id: "m1q39_a",
        label: "Recomendada: mejora el resultado con cada ajuste",
      },
      { id: "m1q39_b", label: "Incorrecta: hay que acertar a la primera" },
      { id: "m1q39_c", label: "Prohibida por las herramientas" },
      {
        id: "m1q39_d",
        label: "Opcional, solo si la primera respuesta sale mal",
      },
    ],
    correctAnswer: "m1q39_a",
    topic: "Refinamiento de Prompts",
    difficulty: "medio",
    source: "El Martillo",
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
          '"Actúa como asistente ejecutivo; redacta un correo formal de recordatorio para la reunión del jueves 10 a.m., tono cordial y asunto incluido"',
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
    difficulty: "difícil",
    source: "El Martillo",
    feedback:
      "A reúne rol, tarea, contexto (fecha/hora), tono, formato/extensión y asunto: un prompt completo y profesional.",
  },

  {
    id: "m1e01",
    question:
      "Un sistema de contratación se entrenó con datos de una empresa con mayoría de hombres y penalizaba CVs con ciertos términos. ¿Qué sesgo aparece y dónde se origina?",
    options: [
      {
        id: "m1e01_a",
        label: "Sesgo de muestreo, originado en los datos de entrenamiento",
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
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Los datos históricos no representaban a la población, así que el sesgo nació en la recolección. Repasa el laboratorio de sesgos.",
  },
  {
    id: "m1e02",
    question:
      "Una IA da un diagnóstico que contradice tu criterio profesional. ¿Cómo actúas?",
    options: [
      {
        id: "m1e02_a",
        label: "Cuestiono la IA y consulto con otros expertos",
      },
      {
        id: "m1e02_b",
        label: "Acepto la IA porque es más inteligente",
      },
      {
        id: "m1e02_c",
        label: "Dejo que la IA decida el tratamiento",
      },
      {
        id: "m1e02_d",
        label: "Reinicio el sistema y vuelvo a preguntar",
      },
    ],
    correctAnswer: "m1e02_a",
    topic: "Responsabilidad",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "No caigas en el sesgo de automatización: tu criterio profesional es irremplazable.",
  },
  {
    id: "m1e03",
    question:
      "Un banco rechaza un crédito con IA y no explica el motivo. ¿Qué principio se viola?",
    options: [
      {
        id: "m1e03_a",
        label: "La transparencia y la explicabilidad de la decisión",
      },
      {
        id: "m1e03_b",
        label: "La privacidad por ocultar el uso de la IA",
      },
      {
        id: "m1e03_c",
        label: "La velocidad del proceso de decisión",
      },
      {
        id: "m1e03_d",
        label: "La eficiencia al usar analistas humanos",
      },
    ],
    correctAnswer: "m1e03_a",
    topic: "Transparencia",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Las personas tienen derecho a entender las decisiones automáticas que las afectan. Revisa el código de ética.",
  },
  {
    id: "m1e04",
    question:
      "Un conductor distraído confía en el piloto automático y sufre un accidente. ¿Qué sesgo describe esto?",
    options: [
      {
        id: "m1e04_a",
        label: "Sesgo de automatización: se confió sin supervisión crítica",
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
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "El sesgo de automatización es confiar demasiado en la máquina. Mantén la supervisión activa.",
  },
  {
    id: "m1e05",
    question:
      "Un sistema de IA de alto riesgo (por ejemplo, aprobar una hipoteca) según la UE debe cumplir con:",
    options: [
      {
        id: "m1e05_a",
        label: "Evaluación de conformidad y supervisión humana",
      },
      {
        id: "m1e05_b",
        label: "Prohibición total de usar IA en ese caso",
      },
      {
        id: "m1e05_c",
        label: "Registro voluntario sin obligaciones",
      },
      {
        id: "m1e05_d",
        label: "Pagar una tasa anual por usarlo",
      },
    ],
    correctAnswer: "m1e05_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "Los sistemas de alto riesgo exigen transparencia, documentación y supervisión humana. Revisa el marco regulatorio.",
  },
  {
    id: "m1e06",
    question:
      "¿Cuáles son los 4 principios éticos clave que guían el uso responsable de la IA?",
    options: [
      {
        id: "m1e06_a",
        label: "Transparencia, equidad, responsabilidad y privacidad",
      },
      {
        id: "m1e06_b",
        label: "Velocidad, ahorro, automatización y eficiencia",
      },
      {
        id: "m1e06_c",
        label: "Popularidad, beneficio, escala y competencia",
      },
      {
        id: "m1e06_d",
        label: "Innovación, inversión, patente y propiedad",
      },
    ],
    correctAnswer: "m1e06_a",
    topic: "Principios Éticos",
    difficulty: "fácil",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "Transparencia, equidad, responsabilidad y privacidad son los pilares. Repasa el video de principios y práctica.",
  },
  {
    id: "m1e07",
    question: "¿Qué es el sesgo de muestreo en un modelo de IA?",
    options: [
      {
        id: "m1e07_a",
        label: "Los datos de entrenamiento no representan a toda la población",
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
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "El sesgo de muestreo nace de datos no representativos. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m1e08",
    question: "¿Qué es el sesgo de etiquetado?",
    options: [
      {
        id: "m1e08_a",
        label:
          "Las etiquetas de entrenamiento arrastran prejuicios de quienes las crean",
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
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Si quien etiqueta tiene sesgos, el modelo los aprende. Repasa el laboratorio de sesgos.",
  },
  {
    id: "m1e09",
    question:
      "Una IA penaliza sistemáticamente a cierto grupo en contratación. ¿Qué haces?",
    options: [
      {
        id: "m1e09_a",
        label: "Detener el sistema, documentar el sesgo y corregir los datos",
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
    difficulty: "difícil",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Ante un sesgo detectado, detén, documenta y corrige. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m1e10",
    question: "¿Qué busca la explicabilidad de un modelo de IA?",
    options: [
      {
        id: "m1e10_a",
        label:
          "Que las decisiones automáticas se puedan justificar ante las personas",
      },
      {
        id: "m1e10_b",
        label: "Que el modelo explique por qué consume tantos recursos",
      },
      {
        id: "m1e10_c",
        label: "Que el sistema resuma sus respuestas en menos palabras",
      },
      {
        id: "m1e10_d",
        label: "Que se puedan traducir sus respuestas a otros idiomas",
      },
    ],
    correctAnswer: "m1e10_a",
    topic: "Explicabilidad",
    difficulty: "medio",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La explicabilidad permite justificar decisiones ante las personas afectadas. Repasa el código de ética.",
  },
  {
    id: "m1e11",
    question:
      "Una IA médica sugiere un tratamiento. ¿Cuál es la mejor práctica de supervisión?",
    options: [
      {
        id: "m1e11_a",
        label:
          "Un profesional valida la sugerencia antes de aplicarla al paciente",
      },
      {
        id: "m1e11_b",
        label: "Aplicar el tratamiento recomendado sin ninguna revisión",
      },
      {
        id: "m1e11_c",
        label: "Descartar la IA porque nunca puede ser útil en salud",
      },
      {
        id: "m1e11_d",
        label: "Dejar que el paciente decida sin consultar a nadie",
      },
    ],
    correctAnswer: "m1e11_a",
    topic: "Supervisión Humana",
    difficulty: "medio",
    source: "Video: IA Ética: Principios y Práctica",
    feedback:
      "En ámbitos críticos, la decisión final la valida un profesional. Repasa el video de principios.",
  },
  {
    id: "m1e12",
    question: "¿Qué es la privacidad por diseño?",
    options: [
      {
        id: "m1e12_a",
        label: "Incorporar la protección de datos desde el inicio del sistema",
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
    source: "PDF: Manual de Privacidad en IA",
    feedback:
      "La privacidad se diseña desde el inicio, no se agrega al final. Repasa el manual de privacidad.",
  },
  {
    id: "m1e13",
    question:
      "¿Cómo se clasifican los sistemas de IA según el nivel de riesgo (UE)?",
    options: [
      {
        id: "m1e13_a",
        label: "Riesgo inaceptable, alto, limitado y mínimo",
      },
      {
        id: "m1e13_b",
        label: "Riesgo pequeño, mediano, grande y gigante",
      },
      {
        id: "m1e13_c",
        label: "Riesgo técnico, humano y financiero solamente",
      },
      {
        id: "m1e13_d",
        label: "Riesgo público, privado y confidencial únicamente",
      },
    ],
    correctAnswer: "m1e13_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "La UE distingue riesgo inaceptable, alto, limitado y mínimo. Repasa el código de ética.",
  },
  {
    id: "m1e14",
    question: "Un sistema de IA de alto riesgo debe, entre otras cosas…",
    options: [
      {
        id: "m1e14_a",
        label: "Documentarse, evaluarse y contar con supervisión humana",
      },
      {
        id: "m1e14_b",
        label: "Funcionar sin registro ni evaluación de ningún tipo",
      },
      {
        id: "m1e14_c",
        label: "Operar solo de noche para consumir menos energía",
      },
      {
        id: "m1e14_d",
        label: "Publicar todo su código en abierto de forma obligatoria",
      },
    ],
    correctAnswer: "m1e14_a",
    topic: "Marco Regulatorio",
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "El alto riesgo exige documentación, evaluación y supervisión humana. Repasa el marco regulatorio.",
  },
  {
    id: "m1e15",
    question: "¿Qué es una auditoría de sesgo en un sistema de IA?",
    options: [
      {
        id: "m1e15_a",
        label:
          "Revisar sistemáticamente si el modelo trata injustamente a algún grupo",
      },
      {
        id: "m1e15_b",
        label: "Medir solo la velocidad de respuesta del sistema completo",
      },
      {
        id: "m1e15_c",
        label: "Comprobar cuántos usuarios tiene registrados la plataforma",
      },
      {
        id: "m1e15_d",
        label: "Verificar únicamente el costo mensual de la herramienta",
      },
    ],
    correctAnswer: "m1e15_a",
    topic: "Auditoría",
    difficulty: "medio",
    source: "OVA: Laboratorio: Detecta el Sesgo",
    feedback:
      "Auditar el sesgo es revisar si algún grupo resulta perjudicado. Practica en el laboratorio de sesgos.",
  },
  {
    id: "m1e16",
    question: "¿Cuál es un uso NO ético de la IA?",
    options: [
      {
        id: "m1e16_a",
        label:
          "Suplantar la identidad de una persona con voz o imagen generadas",
      },
      {
        id: "m1e16_b",
        label: "Resumir un informe propio para una reunión de trabajo",
      },
      {
        id: "m1e16_c",
        label: "Revisar la ortografía de un texto antes de publicarlo",
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
      "Un chatbot educativo empieza a dar respuestas inapropiadas a menores. ¿Qué haces?",
    options: [
      {
        id: "m1e17_a",
        label:
          "Pausar el sistema, investigar y añadir salvaguardas de contenido",
      },
      {
        id: "m1e17_b",
        label: "Dejar que siga funcionando y avisar solo si alguien se queja",
      },
      {
        id: "m1e17_c",
        label: "Eliminar la moderación para que responda con más libertad",
      },
      {
        id: "m1e17_d",
        label: "Culpar a los menores por el uso que le dan al sistema",
      },
    ],
    correctAnswer: "m1e17_a",
    topic: "Salvaguardas",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Con menores, pausa, investiga y refuerza las salvaguardas de contenido. Repasa el laboratorio de dilemas.",
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
        label: "Eficiencia, para resolver el caso en el menor tiempo posible",
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
        label: "Obligaciones de transparencia, sin ser de alto riesgo",
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
    difficulty: "difícil",
    source: "PDF: Código de Ética para Uso de IA",
    feedback:
      "El riesgo limitado exige transparencia, no prohibición. Repasa el código de ética.",
  },
  {
    id: "m1e20",
    question:
      "Un empleado usa IA para decidir sobre personas sin dejar rastro. ¿Qué se incumple?",
    options: [
      {
        id: "m1e20_a",
        label: "La trazabilidad y la rendición de cuentas de las decisiones",
      },
      {
        id: "m1e20_b",
        label: "La velocidad del proceso para resolver el caso puntual",
      },
      {
        id: "m1e20_c",
        label: "La popularidad del sistema entre los usuarios internos",
      },
      {
        id: "m1e20_d",
        label: "El costo operativo de mantener esa herramienta activa",
      },
    ],
    correctAnswer: "m1e20_a",
    topic: "Responsabilidad",
    difficulty: "difícil",
    source: "OVA: Laboratorio: Dilemas Éticos",
    feedback:
      "Sin trazabilidad no hay rendición de cuentas posible. Repasa el laboratorio de dilemas éticos.",
  },
];
