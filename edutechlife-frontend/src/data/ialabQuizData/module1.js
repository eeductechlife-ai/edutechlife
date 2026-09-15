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
  {
    id: "m1q11",
    question:
      "Una IA generativa produce texto nuevo en lugar de limitarse a clasificar datos. ¿Cuál es la diferencia clave?",
    options: [
      {
        id: "m1q11_a",
        label: "Crea contenido original a partir de patrones aprendidos",
      },
      { id: "m1q11_b", label: "Solo copia y pega textos ya existentes en internet" },
      { id: "m1q11_c", label: "Funciona únicamente con hojas de cálculo" },
      { id: "m1q11_d", label: "No necesita datos para aprender" },
    ],
    correctAnswer: "m1q11_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
    feedback:
      "La IA generativa produce contenido nuevo (texto, imagen, audio) basado en patrones aprendidos. Mira el video del tema 1.",
  },
  {
    id: "m1q12",
    question: "¿Cuál de estas afirmaciones describe MEJOR a la IA generativa?",
    options: [
      {
        id: "m1q12_a",
        label: "Aprende patrones de grandes volúmenes de datos y genera respuestas nuevas",
      },
      { id: "m1q12_b", label: "Es un buscador que solo devuelve una lista de enlaces de internet" },
      { id: "m1q12_c", label: "Guarda respuestas escritas por personas y las reutiliza tal cual" },
      { id: "m1q12_d", label: "Solo sirve para traducir textos de un idioma a otro sin generar nada" },
    ],
    correctAnswer: "m1q12_a",
    topic: "IA Generativa",
    difficulty: "fácil",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
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
    source: "Video: Comienzos de la Inteligencia Artificial",
    feedback:
      "La historia explica por qué la IA llegó a generar contenido y dónde están sus límites. Revisa el video 'Comienzos de la Inteligencia Artificial'.",
  },
  {
    id: "m1q14",
    question: "¿Cuál de estas es una capacidad típica de la IA generativa?",
    options: [
      {
        id: "m1q14_a",
        label: "Redactar, resumir y reformular textos a partir de una instrucción",
      },
      { id: "m1q14_b", label: "Garantizar que toda la información entregada esté verificada y sea verdadera" },
      { id: "m1q14_c", label: "Tomar decisiones legales y médicas sin necesidad de supervisión humana" },
      { id: "m1q14_d", label: "Acceder a tus recuerdos personales y a tus archivos privados" },
    ],
    correctAnswer: "m1q14_a",
    topic: "IA Generativa",
    difficulty: "medio",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
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
        label: "Alucinación: genera información que parece cierta pero no lo es",
      },
      { id: "m1q15_b", label: "Traducción automática: cambia el idioma del texto sin revisar su sentido" },
      { id: "m1q15_c", label: "Compresión de datos: reduce el tamaño de los archivos para enviarlos" },
      { id: "m1q15_d", label: "Actualización en tiempo real: consulta internet y muestra datos al instante" },
    ],
    correctAnswer: "m1q15_a",
    topic: "Límites de la IA",
    difficulty: "medio",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
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
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
    source: "Guía PDF: Anatomía de un Prompt",
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
    source: "Guía PDF: Anatomía de un Prompt",
    feedback:
      "El contexto (objetivo, audiencia, situación) dirige la respuesta hacia lo que necesitas.",
  },
  {
    id: "m1q19",
    question: "¿Cuál prompt es MÁS específico?",
    options: [
      {
        id: "m1q19_a",
        label: '"Resume en 5 viñetas los riesgos del sedentarismo para adultos mayores"',
      },
      { id: "m1q19_b", label: '"Háblame de la salud en general y de otros temas parecidos que se te ocurran"' },
      { id: "m1q19_c", label: '"Dame información variada y extensa sobre muchos temas de interés general"' },
      { id: "m1q19_d", label: '"Escribe algo interesante y útil que pueda usar en mi trabajo diario"' },
    ],
    correctAnswer: "m1q19_a",
    topic: "Claridad en Prompts",
    difficulty: "fácil",
    source: "Video: Cómo Crear Prompts Efectivos",
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
    source: "Guía PDF: Anatomía de un Prompt",
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
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
    source: "OVA: Laboratorio de Prompts en Vivo",
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
    source: "Video: Cómo Crear Prompts Efectivos",
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
      { id: "m1q24_b", label: "Hace que la IA ignore por completo el ejemplo que le entregaste" },
      { id: "m1q24_c", label: "Obliga a la IA a responder siempre en un idioma diferente al tuyo" },
      { id: "m1q24_d", label: "No tiene ningún efecto real sobre el resultado que entrega la IA" },
    ],
    correctAnswer: "m1q24_a",
    topic: "Ejemplos en el Prompt",
    difficulty: "difícil",
    source: "OVA: Laboratorio de Prompts en Vivo",
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
    source: "Guía PDF: Anatomía de un Prompt",
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
      { id: "m1q26_b", label: "Es demasiado largo y contiene muchos datos irrelevantes" },
      { id: "m1q26_c", label: "Incluye demasiados ejemplos que terminan confundiendo a la IA" },
      { id: "m1q26_d", label: "Usa un tono demasiado formal para el público objetivo" },
    ],
    correctAnswer: "m1q26_a",
    topic: "Evitar Ambigüedad",
    difficulty: "medio",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
      { id: "m1q27_b", label: "No hay ninguna diferencia real entre pedir rol o pedir solo la tarea" },
      { id: "m1q27_c", label: "El rol hace que la IA responda con menos detalle que antes" },
      { id: "m1q27_d", label: "El rol reemplaza por completo la tarea que le pediste" },
    ],
    correctAnswer: "m1q27_a",
    topic: "Método RTF",
    difficulty: "medio",
    source: "Guía PDF: Anatomía de un Prompt",
    feedback:
      "El rol ('actúa como…') da enfoque; la tarea dice qué hacer. Juntos mejoran el resultado.",
  },
  {
    id: "m1q28",
    question:
      "Quieres un resumen para gerencia. ¿Cuál prompt es MÁS adecuado?",
    options: [
      {
        id: "m1q28_a",
        label:
          '"Resume este informe en 5 viñetas ejecutivas para gerencia no técnica"',
      },
      { id: "m1q28_b", label: '"Resume esto de la manera que mejor te parezca y sin límites"' },
      { id: "m1q28_c", label: '"Escribe mucho texto sobre el informe y todos sus detalles técnicos"' },
      { id: "m1q28_d", label: '"Traduce el informe a otro idioma para que quede más claro"' },
    ],
    correctAnswer: "m1q28_a",
    topic: "Aplicación RTF",
    difficulty: "medio",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
      { id: "m1q29_b", label: '"Dame ideas variadas sobre marketing para negocios de cualquier tipo"' },
      { id: "m1q29_c", label: '"¿Qué opinas sobre el marketing y cómo se usa en las empresas?"' },
      { id: "m1q29_d", label: '"Escribe un ensayo largo y detallado sobre la publicidad moderna"' },
    ],
    correctAnswer: "m1q29_a",
    topic: "Aplicación de Prompts",
    difficulty: "fácil",
    source: "OVA: Laboratorio de Prompts en Vivo",
    feedback:
      "A precisa cantidad, contexto, tono y formato: eso enfoca las ideas hacia lo que necesitas.",
  },
  {
    id: "m1q30",
    question:
      "Quieres aprender un tema paso a paso. ¿Cuál prompt ayuda más?",
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
    source: "OVA: Laboratorio de Prompts en Vivo",
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
      { id: "m1q31_b", label: "Indicar claramente el rol que debe adoptar la inteligencia artificial" },
      { id: "m1q31_c", label: "Aclarar el formato y la extensión exacta que esperas recibir" },
      { id: "m1q31_d", label: "Dar un ejemplo concreto del resultado que quieres obtener" },
    ],
    correctAnswer: "m1q31_a",
    topic: "Errores Comunes",
    difficulty: "medio",
    source: "Video: Cómo Crear Prompts Efectivos",
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
      { id: "m1q32_b", label: "Mejora siempre la calidad del resultado que entrega la IA" },
      { id: "m1q32_c", label: "No tiene ningún efecto real sobre la respuesta final" },
      { id: "m1q32_d", label: "Obliga a la IA a responder mucho más rápido que antes" },
    ],
    correctAnswer: "m1q32_a",
    topic: "Estructura de Prompts",
    difficulty: "difícil",
    source: "Guía PDF: Anatomía de un Prompt",
    feedback:
      "Menos es más: incluye solo lo relevante (tarea, contexto, formato) para no diluir el objetivo.",
  },
  {
    id: "m1q33",
    question:
      "Guardar y reutilizar buenas plantillas de prompt sirve para…",
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
    source: "OVA: Laboratorio de Prompts en Vivo",
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
      { id: "m1q34_d", label: "Combinar fragmentos al azar" },
    ],
    correctAnswer: "m1q34_a",
    topic: "Evaluación Crítica",
    difficulty: "difícil",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
    source: "Guía PDF: Anatomía de un Prompt",
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
      { id: "m1q36_b", label: "Aceptarlo tal cual porque la IA siempre es neutral y objetiva" },
      { id: "m1q36_c", label: "Publicarlo igual sin revisarlo porque el tema no es sensible" },
      { id: "m1q36_d", label: "Ignorar el sesgo detectado y continuar con la siguiente tarea" },
    ],
    correctAnswer: "m1q36_a",
    topic: "Pensamiento Crítico",
    difficulty: "difícil",
    source: "Video: Qué es la IA y cómo está cambiando el mundo",
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
    source: "Guía PDF: Anatomía de un Prompt",
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
      { id: "m1q38_b", label: "Aceptar todo lo que la IA entregue sin revisarlo antes" },
      { id: "m1q38_c", label: "Delegar por completo en la IA todas las decisiones importantes" },
      { id: "m1q38_d", label: "Evitar aprender el tema porque la IA ya lo resuelve todo" },
    ],
    correctAnswer: "m1q38_a",
    topic: "Uso Responsable",
    difficulty: "medio",
    source: "OVA: Cómo comunicarte con la IA (prompts)",
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
      { id: "m1q39_d", label: "Inútil, la IA nunca cambia" },
    ],
    correctAnswer: "m1q39_a",
    topic: "Refinamiento de Prompts",
    difficulty: "medio",
    source: "OVA: Laboratorio de Prompts en Vivo",
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
      { id: "m1q40_b", label: '"Escribe un correo breve para recordar una reunión de trabajo a un compañero del equipo"' },
      { id: "m1q40_c", label: '"Redacta un mensaje sencillo para avisar que tendremos una reunión pronto, sin más detalles"' },
      { id: "m1q40_d", label: '"Haz un texto sobre las reuniones de trabajo y su importancia en las empresas modernas"' },
    ],
    correctAnswer: "m1q40_a",
    topic: "Aplicación RTF",
    difficulty: "difícil",
    source: "OVA: Laboratorio de Prompts en Vivo",
    feedback:
      "A reúne rol, tarea, contexto (fecha/hora), tono, formato/extensión y asunto: un prompt completo y profesional.",
  },
];
