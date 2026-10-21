// Banco del módulo 5 (Claude). Opciones equilibradas: la correcta no se distingue por longitud.
export const MODULE_5 = [
  {
    id: "m5q1",
    question:
      "Quieres que Claude te ayude a preparar una propuesta para un cliente. ¿Qué información le das primero para obtener un buen resultado?",
    options: [
      {
        id: "m5q1_a",
        label: "Solo la palabra 'propuesta', para que tenga libertad creativa",
      },
      {
        id: "m5q1_b",
        label: "El objetivo, el cliente, el tono y el resultado que esperas",
      },
      {
        id: "m5q1_c",
        label: "Un párrafo copiado de internet sin contexto",
      },
      {
        id: "m5q1_d",
        label: "Que decida todo sin preguntarte nada",
      },
    ],
    correctAnswer: "m5q1_b",
    topic: "Conocer a Claude",
    difficulty: "fácil",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Claude responde mejor cuando conoce el objetivo, la audiencia y el formato. Sin contexto, adivina.",
  },
  {
    id: "m5q2",
    question: "¿Qué te permite hacer un Artifact en Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Guardar tu contraseña de forma segura",
      },
      {
        id: "m5q2_b",
        label: "Crear y editar documentos o piezas dentro de la conversación",
      },
      {
        id: "m5q2_c",
        label: "Conectar Claude a la cuenta bancaria de la empresa",
      },
      {
        id: "m5q2_d",
        label: "Borrar el historial de todas tus conversaciones",
      },
    ],
    correctAnswer: "m5q2_b",
    topic: "Crear con Claude",
    difficulty: "fácil",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Los Artifacts son piezas que se ven y se editan a la derecha de la conversación: documentos, gráficos o pequeñas aplicaciones.",
  },
  {
    id: "m5q3",
    question:
      "Claude te entrega una tabla con cifras de ventas. ¿Qué debes hacer antes de presentarla al equipo?",
    options: [
      {
        id: "m5q3_a",
        label:
          "Presentarla tal cual, porque Claude nunca se equivoca con números",
      },
      {
        id: "m5q3_b",
        label:
          "Verificar las cifras contra la fuente original y revisar los cálculos",
      },
      {
        id: "m5q3_c",
        label: "Pedirle que cambie las cifras para que cuadren con la meta",
      },
      {
        id: "m5q3_d",
        label: "Ocultar que la tabla la hizo una IA",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Supervisión",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Claude puede equivocarse en cifras y cálculos. El criterio humano verifica el dato antes de usarlo.",
  },
  {
    id: "m5q4",
    question: "¿Cuál es la mejor forma de usar un Proyecto en Claude?",
    options: [
      {
        id: "m5q4_a",
        label: "Mezclar en un mismo Proyecto temas que no tienen relación",
      },
      {
        id: "m5q4_b",
        label:
          "Crear un Proyecto por tema y guardar allí instrucciones y archivos de referencia",
      },
      {
        id: "m5q4_c",
        label: "No usar Proyectos, porque siempre es mejor empezar de cero",
      },
      {
        id: "m5q4_d",
        label: "Subir a cada Proyecto todos tus archivos personales",
      },
    ],
    correctAnswer: "m5q4_b",
    topic: "Proyectos y memoria",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un Proyecto reúne el contexto de un trabajo: instrucciones y documentos de referencia. Así no repites todo en cada chat.",
  },
  {
    id: "m5q5",
    question:
      "Quieres que Claude revise tu correo de Gmail antes de responder a un cliente. ¿Qué debes tener en cuenta?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Conectar Gmail sin revisar qué permisos pides, porque es automático",
      },
      {
        id: "m5q5_b",
        label:
          "Conectar la cuenta mediante un conector, revisar qué permisos concede y decidir qué compartir",
      },
      {
        id: "m5q5_c",
        label: "Dar tu contraseña en el chat para que Claude entre por ti",
      },
      {
        id: "m5q5_d",
        label: "Pedir que envíe la respuesta sin que tú la revises",
      },
    ],
    correctAnswer: "m5q5_b",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Los conectores dan acceso a tus apps con permisos que apruebas. Nunca des contraseñas en el chat, y revisa siempre antes de enviar.",
  },
  {
    id: "m5q6",
    question: "¿Qué es una Skill en Claude?",
    options: [
      {
        id: "m5q6_a",
        label: "Un tipo de contraseña para proteger tus archivos",
      },
      {
        id: "m5q6_b",
        label:
          "Un paquete de instrucciones, plantillas y referencias que Claude reutiliza para una tarea",
      },
      {
        id: "m5q6_c",
        label: "Un modelo de IA distinto a Opus, Sonnet o Haiku",
      },
      {
        id: "m5q6_d",
        label: "Una función que apaga la memoria del chat",
      },
    ],
    correctAnswer: "m5q6_b",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Una Skill convierte un procedimiento que repites en algo reutilizable: instrucciones, plantillas y ejemplos.",
  },
  {
    id: "m5q7",
    question:
      "Quieres un resumen semanal de tus pendientes. ¿Qué modalidad de Claude te sirve mejor?",
    options: [
      {
        id: "m5q7_a",
        label: "Pedírselo a mano cada lunes, sin ninguna automatización",
      },
      {
        id: "m5q7_b",
        label:
          "Programar una tarea recurrente en Cowork, con las fuentes que necesita",
      },
      {
        id: "m5q7_c",
        label: "Pegar todo tu historial de correos en cada conversación",
      },
      {
        id: "m5q7_d",
        label: "Crear una cuenta nueva por cada semana",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegar con Claude",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Las tareas programadas en Cowork ejecutan trabajos recurrentes. Tú defines qué fuentes usa y revisas el resultado.",
  },
  {
    id: "m5q8",
    question: "¿Qué significa 'delegar con criterio' a Claude?",
    options: [
      {
        id: "m5q8_a",
        label: "Dejar que decida y ejecute todo sin revisión humana",
      },
      {
        id: "m5q8_b",
        label: "Definir objetivo y límites, revisar y decidir tú",
      },
      {
        id: "m5q8_c",
        label: "Pedir cualquier cosa sin especificar nada",
      },
      {
        id: "m5q8_d",
        label: "Usarlo solo para tareas que no importan",
      },
    ],
    correctAnswer: "m5q8_b",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Delegar no es desentenderse: tú pones el objetivo, los límites y la revisión. La responsabilidad final sigue siendo tuya.",
  },
  {
    id: "m5q9",
    question:
      "Claude parece recordar detalles de conversaciones anteriores. ¿Qué debes hacer si quieres controlar esa información?",
    options: [
      {
        id: "m5q9_a",
        label: "No hacer nada: la memoria no se puede revisar",
      },
      {
        id: "m5q9_b",
        label:
          "Revisar qué recuerda Claude y editar o borrar lo que no quieras que guarde",
      },
      {
        id: "m5q9_c",
        label: "Compartir tu contraseña para que Claude la guarde",
      },
      {
        id: "m5q9_d",
        label: "Pedir que guarde datos de tus clientes para siempre",
      },
    ],
    correctAnswer: "m5q9_b",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "La memoria es una función que puedes revisar y ajustar. Decide qué conviene que recuerde y qué no.",
  },
  {
    id: "m5q10",
    question:
      "Vas a subir a Claude un contrato que contiene datos personales de clientes. ¿Qué es lo más prudente?",
    options: [
      {
        id: "m5q10_a",
        label: "Subirlo completo, porque Claude no guarda nada nunca",
      },
      {
        id: "m5q10_b",
        label: "Anonimizar datos personales y compartir solo lo necesario",
      },
      {
        id: "m5q10_c",
        label: "Publicarlo en un blog para que otros lo revisen",
      },
      {
        id: "m5q10_d",
        label: "Enviarlo por WhatsApp a un desconocido para traducirlo",
      },
    ],
    correctAnswer: "m5q10_b",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Minimiza los datos que compartes y respeta la política de tu organización y la ley de protección de datos (en Colombia, Ley 1581 de 2012).",
  },
  {
    id: "m5q11",
    question: "¿Qué diferencia hay entre un Proyecto y la memoria de Claude?",
    options: [
      {
        id: "m5q11_a",
        label: "No hay ninguna diferencia entre ambos",
      },
      {
        id: "m5q11_b",
        label:
          "El Proyecto guarda instrucciones de un tema; la memoria, datos útiles",
      },
      {
        id: "m5q11_c",
        label: "La memoria sirve para subir archivos de 10 GB",
      },
      {
        id: "m5q11_d",
        label: "El Proyecto es un tipo de contraseña",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "El Proyecto es el contexto de un trabajo concreto. La memoria recuerda preferencias y datos útiles entre conversaciones.",
  },
  {
    id: "m5q12",
    question:
      "Claude te propone un dato con una cita a un estudio. ¿Cuál es el paso correcto?",
    options: [
      {
        id: "m5q12_a",
        label: "Citarlo tal cual sin buscar el estudio",
      },
      {
        id: "m5q12_b",
        label:
          "Buscar el estudio original y confirmar que dice lo que Claude afirma",
      },
      {
        id: "m5q12_c",
        label: "Cambiar el año de la cita para que suene más reciente",
      },
      {
        id: "m5q12_d",
        label: "Suponer que es correcto porque suena profesional",
      },
    ],
    correctAnswer: "m5q12_b",
    topic: "Límites y errores",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Una cita puede parecer real y no existir o decir otra cosa. Verifica siempre contra la fuente primaria.",
  },
  {
    id: "m5q13",
    question:
      "¿Qué tarea es más adecuada para delegar a Claude con revisión mínima?",
    options: [
      {
        id: "m5q13_a",
        label: "Firmar un contrato en nombre de tu empresa",
      },
      {
        id: "m5q13_b",
        label: "Dar formato a un borrador que luego tú revisas",
      },
      {
        id: "m5q13_c",
        label: "Decidir sobre el despido de una persona",
      },
      {
        id: "m5q13_d",
        label: "Hacer un diagnóstico médico de un paciente",
      },
    ],
    correctAnswer: "m5q13_b",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Las tareas de borrador y formato son ideales para delegar. Las decisiones legales, médicas o de personas requieren criterio humano.",
  },
  {
    id: "m5q14",
    question:
      "Quieres que Claude genere una presentación para tu junta directiva. ¿Qué entregas primero?",
    options: [
      {
        id: "m5q14_a",
        label: "Nada: Claude puede deducir el mensaje solo",
      },
      {
        id: "m5q14_b",
        label:
          "La idea central, el público, las cifras verificadas y las diapositivas",
      },
      {
        id: "m5q14_c",
        label: "Solo la palabra 'presentación', sin más detalles",
      },
      {
        id: "m5q14_d",
        label: "Un video de otra empresa para copiar literalmente",
      },
    ],
    correctAnswer: "m5q14_b",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Una buena presentación empieza con el mensaje y la audiencia. Las cifras deben estar verificadas antes de entrar a la diapositiva.",
  },
  {
    id: "m5q15",
    question:
      "Claude hizo un cambio en un documento que tú ya habías editado. ¿Qué te conviene hacer?",
    options: [
      {
        id: "m5q15_a",
        label: "Aceptar todo sin leerlo, para ahorrar tiempo",
      },
      {
        id: "m5q15_b",
        label: "Comparar el cambio, aceptar lo que mejora y revertir lo demás",
      },
      {
        id: "m5q15_c",
        label: "Borrar el documento y empezar de cero, sin revisar",
      },
      {
        id: "m5q15_d",
        label: "Pedir que cambie también la versión de tu colega",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Editar en conjunto requiere revisión. Tú decides qué versión se queda.",
  },
  {
    id: "m5q16",
    question:
      "¿Qué modelo de Claude conviene usar para una tarea sencilla y repetitiva, como clasificar correos?",
    options: [
      {
        id: "m5q16_a",
        label: "Siempre el modelo más grande, aunque la tarea sea simple",
      },
      {
        id: "m5q16_b",
        label: "Un modelo rápido para lo simple y uno capaz para lo complejo",
      },
      {
        id: "m5q16_c",
        label: "Ninguno: siempre hay que hacerlo a mano",
      },
      {
        id: "m5q16_d",
        label: "El que tenga el nombre más largo, sin más criterio",
      },
    ],
    correctAnswer: "m5q16_b",
    topic: "Límites y errores",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Elige el modelo según la tarea: rápido y económico para lo simple, más capaz para lo complejo. Así cuidas tiempo y costo.",
  },
  {
    id: "m5q17",
    question:
      "¿Cuál es la mejor práctica al escribir instrucciones para un Proyecto?",
    options: [
      {
        id: "m5q17_a",
        label: "Escribir una sola frase genérica sobre el tema",
      },
      {
        id: "m5q17_b",
        label: "Describir el rol, el objetivo, las reglas, el tono y ejemplos",
      },
      {
        id: "m5q17_c",
        label: "Pegar el manual completo de la empresa sin resumir",
      },
      {
        id: "m5q17_d",
        label: "Pedir que 'haga lo que quiera' con el tema",
      },
    ],
    correctAnswer: "m5q17_b",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Unas buenas instrucciones combinan rol, objetivo, reglas y ejemplos. Son la base para que cada conversación del Proyecto sea consistente.",
  },
  {
    id: "m5q18",
    question:
      "Un colega te pide que le compartas un informe generado con Claude que contiene datos confidenciales de la empresa. ¿Qué haces?",
    options: [
      {
        id: "m5q18_a",
        label: "Se lo envío completo porque es mi colega",
      },
      {
        id: "m5q18_b",
        label:
          "Verifico la clasificación del dato y comparto solo lo que está permitido",
      },
      {
        id: "m5q18_c",
        label: "Lo publico en redes para que todos lo vean",
      },
      {
        id: "m5q18_d",
        label: "Le paso mi contraseña para que entre a la carpeta",
      },
    ],
    correctAnswer: "m5q18_b",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Que una herramienta genere un documento no cambia su nivel de confidencialidad. Comparte solo lo que la política permite.",
  },
  {
    id: "m5q19",
    question:
      "¿Qué papel juega el 'agente' en una tarea de varios pasos, por ejemplo organizar archivos y redactar un resumen?",
    options: [
      {
        id: "m5q19_a",
        label:
          "Ejecuta pasos hacia el objetivo que definiste, bajo tu supervisión",
      },
      {
        id: "m5q19_b",
        label: "Actúa sin que nadie lo sepa ni lo revise",
      },
      {
        id: "m5q19_c",
        label: "Reemplaza tu cuenta de correo electrónico",
      },
      {
        id: "m5q19_d",
        label: "No existe en Claude; es solo una idea",
      },
    ],
    correctAnswer: "m5q19_a",
    topic: "Delegar con Claude",
    difficulty: "difícil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un agente ejecuta pasos hacia un objetivo. La buena práctica es definir alcance, pedir confirmación en acciones importantes y revisar el resultado.",
  },
  {
    id: "m5q20",
    question:
      "¿Por qué conviene que Claude explique sus pasos antes de ejecutar una acción importante?",
    options: [
      {
        id: "m5q20_a",
        label: "Para aumentar el tiempo de espera sin motivo",
      },
      {
        id: "m5q20_b",
        label:
          "Para detectar errores de interpretación antes de que tengan consecuencias",
      },
      {
        id: "m5q20_c",
        label: "Porque Claude no puede ejecutar nada",
      },
      {
        id: "m5q20_d",
        label: "Para evitar que el usuario lea la respuesta",
      },
    ],
    correctAnswer: "m5q20_b",
    topic: "Supervisión",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Revisar el plan antes de la acción evita errores costosos. Es parte de delegar con criterio.",
  },
  {
    id: "m5q21",
    question:
      "¿Qué tipo de información es más riesgoso compartir con cualquier herramienta de IA?",
    options: [
      {
        id: "m5q21_a",
        label: "Una lista de temas para un blog",
      },
      {
        id: "m5q21_b",
        label: "Contraseñas, datos bancarios e identidades de otras personas",
      },
      {
        id: "m5q21_c",
        label: "Un texto de ejemplo sin datos reales",
      },
      {
        id: "m5q21_d",
        label: "Un esquema de clase con temas generales",
      },
    ],
    correctAnswer: "m5q21_b",
    topic: "Privacidad y datos",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Nunca compartas contraseñas ni datos sensibles de terceros. Usa datos ficticios cuando puedas.",
  },
  {
    id: "m5q22",
    question:
      "Claude te da una respuesta correcta sobre un tema que cambió después de su última actualización. ¿Qué debes hacer?",
    options: [
      {
        id: "m5q22_a",
        label: "Confiar siempre en lo que dice la IA",
      },
      {
        id: "m5q22_b",
        label: "Pedir información actual o verificarla en una fuente reciente",
      },
      {
        id: "m5q22_c",
        label: "Ignorar cualquier dato reciente por completo",
      },
      {
        id: "m5q22_d",
        label: "Cambiar la fecha del documento para que sea reciente",
      },
    ],
    correctAnswer: "m5q22_b",
    topic: "Límites y errores",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Los modelos no siempre conocen lo más reciente. Para datos que cambian, usa búsqueda o una fuente actual.",
  },
  {
    id: "m5q23",
    question:
      "¿Cuál de estas es una buena forma de crear un Artifact interactivo?",
    options: [
      {
        id: "m5q23_a",
        label: "Pedir 'algo bonito' sin describir qué debe hacer",
      },
      {
        id: "m5q23_b",
        label:
          "Describir el uso, los datos de entrada y el resultado esperado, y luego iterar",
      },
      {
        id: "m5q23_c",
        label: "Copiar el código de la app de otra empresa",
      },
      {
        id: "m5q23_d",
        label: "Nunca probarlo antes de compartirlo con el equipo",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Describe el uso y el resultado, pide ajustes pequeños y prueba la pieza antes de compartirla.",
  },
  {
    id: "m5q24",
    question:
      "¿Qué es una buena práctica al revisar un documento que Claude escribió para tu cliente?",
    options: [
      {
        id: "m5q24_a",
        label: "Leerlo solo por encima, porque ya está bien escrito",
      },
      {
        id: "m5q24_b",
        label:
          "Revisar datos, tono, nombres, fechas y que refleje lo que realmente quieres decir",
      },
      {
        id: "m5q24_c",
        label: "Enviarlo sin cambiar el nombre del cliente anterior",
      },
      {
        id: "m5q24_d",
        label: "Eliminar la firma para que parezca neutral",
      },
    ],
    correctAnswer: "m5q24_b",
    topic: "Supervisión",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un texto bien escrito puede tener datos incorrectos o un nombre equivocado. La revisión humana es obligatoria.",
  },
  {
    id: "m5q25",
    question:
      "Quieres reutilizar en varios proyectos el mismo procedimiento para redactar actas de reunión. ¿Qué conviene crear?",
    options: [
      {
        id: "m5q25_a",
        label: "Una Skill con instrucciones, plantilla y un ejemplo de acta",
      },
      {
        id: "m5q25_b",
        label: "Un chat nuevo cada vez, pidiendo todo de nuevo",
      },
      {
        id: "m5q25_c",
        label: "Una contraseña para proteger el documento",
      },
      {
        id: "m5q25_d",
        label: "Un correo a Claude con el procedimiento completo",
      },
    ],
    correctAnswer: "m5q25_a",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Lo que repites se convierte en Skill: así el procedimiento queda igual cada vez y se ahorra tiempo.",
  },
  {
    id: "m5q26",
    question:
      "¿Cuál de estas afirmaciones sobre la IA y el trabajo es más responsable?",
    options: [
      {
        id: "m5q26_a",
        label: "La IA reemplaza por completo la revisión humana",
      },
      {
        id: "m5q26_b",
        label: "La IA acelera el trabajo, pero la decisión es humana",
      },
      {
        id: "m5q26_c",
        label: "Usar IA siempre es hacer trampa",
      },
      {
        id: "m5q26_d",
        label: "Nunca hay que decir que se usó IA",
      },
    ],
    correctAnswer: "m5q26_b",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "La IA acelera el trabajo. La decisión y su consecuencia siguen siendo de la persona.",
  },
  {
    id: "m5q27",
    question:
      "Quieres que Claude analice un archivo grande de datos. ¿Qué haces para obtener un resultado confiable?",
    options: [
      {
        id: "m5q27_a",
        label: "Pedir una conclusión sin revisar el método",
      },
      {
        id: "m5q27_b",
        label: "Pedir los pasos y validar una muestra con tu propio cálculo",
      },
      {
        id: "m5q27_c",
        label: "Usar solo el primer resultado que aparezca",
      },
      {
        id: "m5q27_d",
        label: "Cambiar los datos para que den un resultado bonito",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Límites y errores",
    difficulty: "difícil",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Pide el método y valida una muestra con un cálculo independiente. Así detectas errores antes de decidir.",
  },
  {
    id: "m5q28",
    question:
      "¿Qué es lo primero que conviene definir antes de dar una tarea compleja a Claude?",
    options: [
      {
        id: "m5q28_a",
        label: "El color y la tipografía del documento",
      },
      {
        id: "m5q28_b",
        label: "El resultado, el criterio de éxito y los límites",
      },
      {
        id: "m5q28_c",
        label: "La cantidad de emojis en el texto",
      },
      {
        id: "m5q28_d",
        label: "Nada: cuanto menos se diga, mejor",
      },
    ],
    correctAnswer: "m5q28_b",
    topic: "Delegar con Claude",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Definir el resultado, el criterio de éxito y los límites es el paso que más calidad aporta.",
  },
  {
    id: "m5q29",
    question:
      "Recibes un correo de un 'soporte de Claude' que pide tu contraseña para 'verificar tu cuenta'. ¿Qué haces?",
    options: [
      {
        id: "m5q29_a",
        label: "Respondo con mi contraseña para no perder la cuenta",
      },
      {
        id: "m5q29_b",
        label:
          "No respondo: verifico directamente en la aplicación oficial y reporto el correo",
      },
      {
        id: "m5q29_c",
        label: "Reenvío el correo a todos mis contactos",
      },
      {
        id: "m5q29_d",
        label: "Hago clic y ingreso la contraseña en el enlace del correo",
      },
    ],
    correctAnswer: "m5q29_b",
    topic: "Privacidad y datos",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Ninguna empresa seria pide tu contraseña por correo. Accede siempre desde la app o el sitio oficial.",
  },
  {
    id: "m5q30",
    question:
      "Al terminar un proyecto con Claude, ¿qué práctica deja una mejor base para el siguiente?",
    options: [
      {
        id: "m5q30_a",
        label: "Borrar todo y no dejar ningún registro",
      },
      {
        id: "m5q30_b",
        label:
          "Guardar instrucciones, modelos y aprendizajes en un Proyecto o Skill",
      },
      {
        id: "m5q30_c",
        label: "Compartir el historial completo con cualquier persona",
      },
      {
        id: "m5q30_d",
        label: "Olvidar lo que funcionó para no repetir errores",
      },
    ],
    correctAnswer: "m5q30_b",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Lo que funciona debe quedar guardado en un Proyecto o una Skill. Así cada nuevo trabajo parte de lo aprendido.",
  },
];
