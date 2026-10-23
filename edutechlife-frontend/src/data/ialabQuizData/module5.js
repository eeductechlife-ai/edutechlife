// Banco del módulo 5 (Claude), en español: 30 preguntas sobre el pedido de cinco partes, Artifacts, verificación, Proyectos, memoria, conectores, Skills y delegación.
// La correcta nunca es la opción más larga ni la más corta. Ids, orden de opciones y correctAnswer deben coincidir con la clave de src/data/ialab.js.
export const MODULE_5 = [
  {
    id: "m5q1",
    question:
      "Vas a pedirle a Claude una propuesta para un cliente. ¿Qué pedido evita que Claude tenga que suponer datos clave?",
    options: [
      {
        id: "m5q1_a",
        label: "Objetivo, cliente que la lee, formato, tono y qué no prometer",
      },
      {
        id: "m5q1_b",
        label:
          "El objetivo y el formato; el tono y los límites los decide Claude por su cuenta",
      },
      {
        id: "m5q1_c",
        label: "Una propuesta anterior y la frase 'haz una igual'",
      },
      {
        id: "m5q1_d",
        label:
          "Una lista de adjetivos: profesional, creativa, completa y persuasiva",
      },
    ],
    correctAnswer: "m5q1_a",
    topic: "Conocer a Claude",
    difficulty: "fácil",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Un pedido completo tiene cinco partes: objetivo, audiencia, formato, tono y límites. Cada parte que falta es una suposición que Claude hace por ti.",
  },
  {
    id: "m5q2",
    question: "¿Qué te permite hacer un Artifact en Claude?",
    options: [
      {
        id: "m5q2_a",
        label: "Guardar instrucciones fijas que se aplican a todos tus chats",
      },
      {
        id: "m5q2_b",
        label:
          "Conectar Claude con Gmail o con Drive para que pueda leer tus archivos",
      },
      {
        id: "m5q2_c",
        label: "Ver y mejorar una pieza junto al chat sin empezar de cero",
      },
      {
        id: "m5q2_d",
        label: "Recordar tu tono preferido de una conversación a otra",
      },
    ],
    correctAnswer: "m5q2_c",
    topic: "Crear con Claude",
    difficulty: "fácil",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Un Artifact es una pieza (documento, tabla o pequeña app) que vive al lado del chat: la ves, la mejoras por partes y la exportas. Las instrucciones fijas van en un Proyecto, las preferencias en la memoria y el acceso a tus apps en los conectores.",
  },
  {
    id: "m5q3",
    question:
      "Claude te entrega una tabla con cifras de ventas. ¿Qué haces antes de presentarla al equipo?",
    options: [
      {
        id: "m5q3_a",
        label:
          "Pedirle a Claude que revise sus propias cifras y confiar en su respuesta",
      },
      {
        id: "m5q3_b",
        label:
          "Comparar cada cifra con la fuente original y rehacer un cálculo",
      },
      {
        id: "m5q3_c",
        label:
          "Revisar ortografía y formato, porque las cifras salen del archivo",
      },
      {
        id: "m5q3_d",
        label: "Pedirle que agregue la fuente de cada dato y presentarla así",
      },
    ],
    correctAnswer: "m5q3_b",
    topic: "Supervisión",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Claude puede equivocarse con cifras y sonar seguro, incluso cuando se revisa a sí mismo. Citar una fuente no es verificarla: compara con el dato original antes de presentar.",
  },
  {
    id: "m5q4",
    question: "¿Cuál es la mejor forma de usar un Proyecto en Claude?",
    options: [
      {
        id: "m5q4_a",
        label:
          "Un solo Proyecto para todo tu trabajo, así Claude tiene todo el contexto",
      },
      {
        id: "m5q4_b",
        label:
          "Pegar las mismas instrucciones al inicio de cada chat del Proyecto",
      },
      {
        id: "m5q4_c",
        label:
          "Subir todos los archivos de la empresa por si alguno hace falta",
      },
      {
        id: "m5q4_d",
        label:
          "Un Proyecto por trabajo que se repite, con sus reglas y archivos",
      },
    ],
    correctAnswer: "m5q4_d",
    topic: "Proyectos y memoria",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un Proyecto guarda las instrucciones y los archivos de un trabajo concreto que se repite, para que no los repitas en cada chat. Mezclar temas o subir archivos de más le da contexto que no sirve y puede exponer datos.",
  },
  {
    id: "m5q5",
    question:
      "Quieres que Claude lea tu correo de correo para preparar la respuesta a un cliente. ¿Qué haces?",
    options: [
      {
        id: "m5q5_a",
        label:
          "Conectar solo correo, revisar sus permisos y aprobar tú la respuesta",
      },
      {
        id: "m5q5_b",
        label:
          "Conectar correo, archivos y calendario de una vez para no repetir el proceso",
      },
      {
        id: "m5q5_c",
        label:
          "Copiar en el chat los correos completos del cliente, con sus datos",
      },
      {
        id: "m5q5_d",
        label: "Conectar correo y dejar que Claude envíe la respuesta",
      },
    ],
    correctAnswer: "m5q5_a",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Con un conector das acceso solo a lo que la tarea necesita y apruebas sus permisos. Puedes desconectarlo al terminar, y la respuesta la revisas y la envías tú.",
  },
  {
    id: "m5q6",
    question: "¿Qué diferencia hay entre una Skill y un Proyecto?",
    options: [
      {
        id: "m5q6_a",
        label:
          "Una Skill guarda los archivos de un trabajo; un Proyecto guarda los pasos de un procedimiento que se repite",
      },
      {
        id: "m5q6_b",
        label:
          "Una Skill guarda las charlas de un trabajo; un Proyecto guarda tu tono y tus preferencias",
      },
      {
        id: "m5q6_c",
        label:
          "Una Skill guarda un procedimiento con pasos y plantillas; un Proyecto, el contexto de un trabajo",
      },
      {
        id: "m5q6_d",
        label:
          "Son lo mismo con otro nombre: ambos guardan instrucciones y archivos de un trabajo",
      },
    ],
    correctAnswer: "m5q6_c",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Una Skill guarda un procedimiento que haces siempre igual: pasos, plantillas y ejemplos. Un Proyecto guarda el contexto de un trabajo que se repite, con sus instrucciones y archivos. Los conectores dan acceso a tus apps.",
  },
  {
    id: "m5q7",
    question:
      "Cada lunes preparas el mismo informe de pendientes y siempre le explicas a Claude los mismos pasos. ¿Qué te conviene?",
    options: [
      {
        id: "m5q7_a",
        label:
          "Seguir escribiendo los pasos completos en cada chat para que no se pierdan",
      },
      {
        id: "m5q7_b",
        label:
          "Guardar esos pasos en una Skill, usarla cada lunes y revisar el informe",
      },
      {
        id: "m5q7_c",
        label:
          "Usar un chat de incógnito para que Claude empiece siempre limpio",
      },
      {
        id: "m5q7_d",
        label: "Crear un Proyecto nuevo cada lunes con los mismos pasos",
      },
    ],
    correctAnswer: "m5q7_b",
    topic: "Delegar con Claude",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un procedimiento que haces siempre igual se guarda como Skill: Claude aplica los mismos pasos cada vez y tú solo revisas el resultado. El incógnito no guarda el procedimiento para la semana siguiente, y crear un Proyecto por semana repite el trabajo.",
  },
  {
    id: "m5q8",
    question: "¿Qué significa 'delegar con criterio' a Claude?",
    options: [
      {
        id: "m5q8_a",
        label:
          "Delegar solo las tareas fáciles y hacer tú todas las importantes",
      },
      {
        id: "m5q8_b",
        label:
          "Delegar todo lo que Claude hace bien y revisar solo si algo falla",
      },
      {
        id: "m5q8_c",
        label:
          "Entregar la tarea y la decisión si el pedido tiene las cinco partes",
      },
      {
        id: "m5q8_d",
        label:
          "Entregar el borrador, revisar lo que sale y conservar la decisión",
      },
    ],
    correctAnswer: "m5q8_d",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Delegar no es desentenderse: entregas la forma y el borrador, revisas lo que sale a terceros y conservas la decisión. Un buen pedido mejora el resultado, pero no traslada la responsabilidad.",
  },
  {
    id: "m5q9",
    question:
      "Claude parece recordar detalles de conversaciones anteriores. ¿Qué haces si quieres controlar esa información?",
    options: [
      {
        id: "m5q9_a",
        label:
          "Revisar la memoria en la configuración y editar o borrar lo que no quieras",
      },
      {
        id: "m5q9_b",
        label:
          "Crear un Proyecto, porque los Proyectos borran la memoria general",
      },
      {
        id: "m5q9_c",
        label:
          "Escribir siempre en incógnito, aunque necesites que recuerde tu tono",
      },
      {
        id: "m5q9_d",
        label:
          "Pedirle que guarde todo, porque más memoria siempre da mejores respuestas en todos los chats",
      },
    ],
    correctAnswer: "m5q9_a",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "La memoria se revisa y se ajusta en la configuración: decides qué conviene que recuerde. El incógnito sirve para un chat puntual que no quieres que quede en memoria, no para todo tu trabajo.",
  },
  {
    id: "m5q10",
    question:
      "Vas a subir a Claude un contrato que contiene datos personales de clientes. ¿Qué es lo más prudente?",
    options: [
      {
        id: "m5q10_a",
        label: "Subirlo completo, porque es un documento interno de la empresa",
      },
      {
        id: "m5q10_b",
        label: "Subirlo completo y borrar el chat apenas termines",
      },
      {
        id: "m5q10_c",
        label:
          "Anonimizar los datos personales y compartir solo las cláusulas necesarias",
      },
      {
        id: "m5q10_d",
        label:
          "Subirlo completo y pedirle a Claude que no tenga en cuenta los nombres ni los teléfonos",
      },
    ],
    correctAnswer: "m5q10_c",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Minimiza los datos que compartes: anonimiza o pide autorización antes de subirlos, y respeta la política de tu organización y la ley (en Colombia, Ley 1581 de 2012). Borrar el chat después o pedir que ignore los nombres no evita que ya los compartiste.",
  },
  {
    id: "m5q11",
    question: "¿Qué diferencia hay entre un Proyecto y la memoria de Claude?",
    options: [
      {
        id: "m5q11_a",
        label:
          "El Proyecto recuerda tus preferencias en todos los chats; la memoria, solo dentro de uno",
      },
      {
        id: "m5q11_b",
        label:
          "El Proyecto guarda reglas y archivos de un trabajo; la memoria, datos entre chats",
      },
      {
        id: "m5q11_c",
        label: "Ninguna: los dos guardan lo mismo, solo cambia dónde se ven",
      },
      {
        id: "m5q11_d",
        label:
          "La memoria guarda archivos de referencia; el Proyecto, tu tono preferido",
      },
    ],
    correctAnswer: "m5q11_b",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "El Proyecto es el contexto de un trabajo concreto: instrucciones y archivos. La memoria recuerda preferencias y datos útiles entre conversaciones. Por ejemplo, tu marca va en un Proyecto y tu preferencia de tono, en la memoria.",
  },
  {
    id: "m5q12",
    question:
      "Claude te propone un dato con una cita a un estudio. ¿Cuál es el paso correcto?",
    options: [
      {
        id: "m5q12_a",
        label: "Pedirle el enlace del estudio y citarlo si Claude te lo da",
      },
      {
        id: "m5q12_b",
        label: "Citarlo si el autor y la revista suenan reconocidos",
      },
      {
        id: "m5q12_c",
        label:
          "Preguntarle a Claude si está seguro del dato y citarlo si lo confirma",
      },
      {
        id: "m5q12_d",
        label: "Buscar el estudio original y confirmar que dice lo mismo",
      },
    ],
    correctAnswer: "m5q12_d",
    topic: "Límites y errores",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Una cita puede parecer real y no existir o decir otra cosa; un enlace o una confirmación de Claude no lo prueban. Verifica siempre en la fuente primaria.",
  },
  {
    id: "m5q13",
    question:
      "¿Qué tarea es más adecuada para delegar a Claude con revisión mínima?",
    options: [
      {
        id: "m5q13_a",
        label: "Dar formato a una plantilla de acta que ya aprobaste",
      },
      {
        id: "m5q13_b",
        label: "Redactar y enviar la respuesta a la queja de un cliente",
      },
      {
        id: "m5q13_c",
        label: "Clasificar 200 correos de clientes con sus nombres y teléfonos",
      },
      {
        id: "m5q13_d",
        label: "Resumir para la junta un informe con cifras",
      },
    ],
    correctAnswer: "m5q13_a",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Las tareas de forma, sin decisión de fondo, son ideales para delegar. Lo que sale a terceros, contiene datos personales o cifras para decidir se delega y se revisa.",
  },
  {
    id: "m5q14",
    question:
      "Quieres que Claude genere una presentación para tu junta directiva. ¿Qué entregas primero?",
    options: [
      {
        id: "m5q14_a",
        label:
          "El tema y el número de diapositivas; el mensaje lo decide Claude",
      },
      {
        id: "m5q14_b",
        label: "Las cifras del trimestre para que Claude elija qué destacar",
      },
      {
        id: "m5q14_c",
        label:
          "El mensaje central, quién la verá, las cifras verificadas y la extensión",
      },
      {
        id: "m5q14_d",
        label:
          "Una presentación anterior de otra empresa para que copie el diseño y el contenido",
      },
    ],
    correctAnswer: "m5q14_c",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Una buena presentación empieza con el mensaje y la audiencia. Si Claude elige qué destacar, la decisión es suya y no tuya; y las cifras se verifican antes de entrar a la diapositiva.",
  },
  {
    id: "m5q15",
    question:
      "Claude hizo un cambio en un documento que tú ya habías editado. ¿Qué te conviene hacer?",
    options: [
      {
        id: "m5q15_a",
        label:
          "Aceptar la nueva versión, porque cada cambio mejora la anterior",
      },
      {
        id: "m5q15_b",
        label: "Comparar con la versión anterior y quedarte con lo que mejora",
      },
      {
        id: "m5q15_c",
        label: "Pedirle que rehaga todo desde cero con un pedido más largo",
      },
      {
        id: "m5q15_d",
        label: "Volver a tu versión sin revisar qué cambió",
      },
    ],
    correctAnswer: "m5q15_b",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Cada cambio deja una versión distinta: compara el antes y el después y decide tú qué se queda. Empezar de cero o descartar sin mirar desperdicia lo que ya funcionaba.",
  },
  {
    id: "m5q16",
    question:
      "Le escribes a Claude: «Escribe un correo para las familias sobre la reunión del sábado, en tono cercano y sin nombres de estudiantes». ¿Qué parte del pedido falta?",
    options: [
      {
        id: "m5q16_a",
        label: "Ninguna: el pedido ya tiene las cinco partes completas",
      },
      {
        id: "m5q16_b",
        label: "El tono: cómo debe sonar el correo y qué palabras evitar en él",
      },
      {
        id: "m5q16_c",
        label:
          "Los límites: qué datos no debe incluir el correo y qué debe evitar en su redacción",
      },
      {
        id: "m5q16_d",
        label: "El formato: cómo se verá el correo y qué tan largo debe ser",
      },
    ],
    correctAnswer: "m5q16_d",
    topic: "Límites y errores",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Un pedido completo tiene cinco partes: objetivo, audiencia, formato, tono y límites. Este pedido no dice el formato, así que Claude decidiría la extensión y la estructura por su cuenta.",
  },
  {
    id: "m5q17",
    question:
      "¿Cuál es la mejor práctica al escribir las instrucciones de un Proyecto?",
    options: [
      {
        id: "m5q17_a",
        label:
          "Decir quién es Claude, para qué sirve, cómo suena y qué nunca hacer",
      },
      {
        id: "m5q17_b",
        label:
          "Pegar el manual completo de la empresa en lugar de instrucciones",
      },
      {
        id: "m5q17_c",
        label:
          "Escribir solo el tono, porque el resto Claude lo deduce de los archivos que subas",
      },
      {
        id: "m5q17_d",
        label:
          "Incluir los teléfonos de los clientes para personalizar cada respuesta",
      },
    ],
    correctAnswer: "m5q17_a",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Las instrucciones del Proyecto dicen quién es Claude, para qué sirve, cómo suena y qué nunca debe hacer. Los archivos complementan, y los datos personales no se suben sin autorización.",
  },
  {
    id: "m5q18",
    question:
      "Un colega te pide un informe generado con Claude que contiene datos confidenciales de la empresa. ¿Qué haces?",
    options: [
      {
        id: "m5q18_a",
        label: "Publicarlo con enlace abierto, porque solo lo tendrá mi colega",
      },
      {
        id: "m5q18_b",
        label:
          "Compartirlo completo, porque lo hizo una IA y no es un documento oficial",
      },
      {
        id: "m5q18_c",
        label: "Comprobar si puede verlo y compartir solo lo permitido",
      },
      {
        id: "m5q18_d",
        label: "Pedirle a Claude un resumen y enviarlo sin revisarlo",
      },
    ],
    correctAnswer: "m5q18_c",
    topic: "Privacidad y datos",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Que una herramienta genere un documento no cambia su nivel de confidencialidad. Un enlace abierto lo puede ver cualquiera que lo reciba: comparte solo lo que la política permite y con quien corresponde.",
  },
  {
    id: "m5q19",
    question:
      "Llevas semanas trabajando en el Proyecto de una escuela y te piden un texto para otro cliente, sin relación. ¿Dónde lo haces?",
    options: [
      {
        id: "m5q19_a",
        label: "En el mismo Proyecto, porque Claude ya conoce bien tu estilo",
      },
      {
        id: "m5q19_b",
        label:
          "Fuera de ese Proyecto, para no arrastrar sus reglas ni sus archivos",
      },
      {
        id: "m5q19_c",
        label: "En el mismo Proyecto, pidiéndole que ignore sus instrucciones",
      },
      {
        id: "m5q19_d",
        label:
          "En el Proyecto, tras borrar sus instrucciones y volver a escribirlas al terminar",
      },
    ],
    correctAnswer: "m5q19_b",
    topic: "Delegar con Claude",
    difficulty: "difícil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Cada Proyecto aplica sus instrucciones y archivos a todos sus chats. Un trabajo sin relación va en otro Proyecto o en un chat aparte, así no arrastras reglas ni datos que no aplican.",
  },
  {
    id: "m5q20",
    question:
      "Claude comparó las hojas de vida de una vacante y te recomienda a una candidata. ¿Qué haces con esa recomendación?",
    options: [
      {
        id: "m5q20_a",
        label:
          "Contratarla si el análisis cita bien los datos de cada hoja de vida",
      },
      {
        id: "m5q20_b",
        label: "Pedirle a Claude que confirme su elección y seguirla",
      },
      {
        id: "m5q20_c",
        label: "Aceptarla, porque el pedido tenía las cinco partes completas",
      },
      {
        id: "m5q20_d",
        label: "Revisar el análisis como insumo y decidir tú a quién contratar",
      },
    ],
    correctAnswer: "m5q20_d",
    topic: "Supervisión",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Elegir a quién contratar es decidir sobre una persona: esa decisión no se delega. Claude puede ordenar y comparar; tú revisas el análisis y decides. Ni una confirmación de Claude ni un buen pedido trasladan la responsabilidad.",
  },
  {
    id: "m5q21",
    question:
      "Vas a pedirle a Claude un informe de asistencia de un curso. ¿Qué versión de los datos compartes?",
    options: [
      {
        id: "m5q21_a",
        label:
          "La asistencia por código de estudiante, sin nombres ni teléfonos",
      },
      {
        id: "m5q21_b",
        label: "La lista completa con nombres, porque el informe es interno",
      },
      {
        id: "m5q21_c",
        label:
          "La lista completa en un chat de incógnito, porque así no queda guardada",
      },
      {
        id: "m5q21_d",
        label: "La lista completa dentro de un Proyecto privado",
      },
    ],
    correctAnswer: "m5q21_a",
    topic: "Privacidad y datos",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Comparte solo lo necesario: con códigos en lugar de nombres el informe sale igual. Ni el incógnito ni un Proyecto privado te autorizan a compartir datos personales (en Colombia, Ley 1581 de 2012).",
  },
  {
    id: "m5q22",
    question:
      "Le pides a Claude 'escríbeme un correo para un cliente' y el resultado sale largo y demasiado formal. ¿Qué explica mejor lo que pasó?",
    options: [
      {
        id: "m5q22_a",
        label:
          "Claude escribe largo por defecto y siempre toca recortarlo a mano",
      },
      {
        id: "m5q22_b",
        label:
          "Usaste un modelo rápido; con uno más potente el correo habría salido corto y cercano",
      },
      {
        id: "m5q22_c",
        label:
          "El pedido no decía audiencia, formato ni tono, y Claude los supuso",
      },
      {
        id: "m5q22_d",
        label:
          "Claude imita correos formales de internet y ese estilo no se puede cambiar",
      },
    ],
    correctAnswer: "m5q22_c",
    topic: "Límites y errores",
    difficulty: "medio",
    source: "Lección 1: Conoce a Claude",
    feedback:
      "Cada parte que falta en el pedido es algo que Claude supone por ti. Si no dices para qué es, quién lo lee, qué extensión tiene y qué tono usar, Claude lo elige y puede no ser lo que querías. Un pedido completo tiene objetivo, audiencia, formato, tono y límites.",
  },
  {
    id: "m5q23",
    question:
      "¿Cuál de estas es una buena forma de crear un Artifact interactivo?",
    options: [
      {
        id: "m5q23_a",
        label:
          "Pedir todas las funciones en un solo mensaje muy largo para no tener que iterar",
      },
      {
        id: "m5q23_b",
        label:
          "Decir para qué sirve, qué datos recibe y qué muestra; luego iterar",
      },
      {
        id: "m5q23_c",
        label: "Pedir 'una app interactiva' y dejar que Claude elija el resto",
      },
      {
        id: "m5q23_d",
        label: "Compartirlo con el equipo apenas aparezca y corregir después",
      },
    ],
    correctAnswer: "m5q23_b",
    topic: "Crear con Claude",
    difficulty: "medio",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Describe el uso, los datos de entrada y el resultado, mejora con cambios pequeños y prueba la pieza antes de compartirla.",
  },
  {
    id: "m5q24",
    question:
      "¿Qué es una buena práctica al revisar un documento que Claude escribió para tu cliente?",
    options: [
      {
        id: "m5q24_a",
        label:
          "Revisar solo la ortografía, porque el contenido ya lo pediste bien",
      },
      {
        id: "m5q24_b",
        label:
          "Pedirle a Claude que lo revise y enviarlo si no encuentra errores",
      },
      {
        id: "m5q24_c",
        label:
          "Leer la introducción y el cierre, que es lo que el cliente mira",
      },
      {
        id: "m5q24_d",
        label:
          "Revisar datos, nombres, fechas y tono contra lo que quieres decir",
      },
    ],
    correctAnswer: "m5q24_d",
    topic: "Supervisión",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Un texto bien escrito puede tener datos incorrectos o un nombre equivocado, y Claude no siempre detecta sus propios errores. La revisión humana completa es obligatoria.",
  },
  {
    id: "m5q25",
    question:
      "Quieres reutilizar en varios proyectos el mismo procedimiento para redactar actas de reunión. ¿Qué conviene crear?",
    options: [
      {
        id: "m5q25_a",
        label: "Una Skill con los pasos, la plantilla y un acta de ejemplo",
      },
      {
        id: "m5q25_b",
        label:
          "Un Proyecto nuevo por cada reunión, con el procedimiento pegado en las instrucciones",
      },
      {
        id: "m5q25_c",
        label: "Nada: dejar que la memoria lo recuerde y lo aplique sola",
      },
      {
        id: "m5q25_d",
        label: "Un Artifact con el acta anterior para copiarlo cada vez",
      },
    ],
    correctAnswer: "m5q25_a",
    topic: "Conectores y Skills",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Lo que repites se convierte en Skill: el procedimiento queda igual cada vez, sirve en cualquier trabajo y ahorra tiempo.",
  },
  {
    id: "m5q26",
    question:
      "¿Cuál de estas afirmaciones sobre la IA y el trabajo es más responsable?",
    options: [
      {
        id: "m5q26_a",
        label: "Si el pedido está bien hecho, la revisión humana sobra",
      },
      {
        id: "m5q26_b",
        label: "La IA sirve para ideas, pero no para trabajo profesional",
      },
      {
        id: "m5q26_c",
        label: "La IA acelera el trabajo, pero la decisión sigue siendo humana",
      },
      {
        id: "m5q26_d",
        label:
          "Si Claude se equivoca, la responsabilidad del error es de la herramienta",
      },
    ],
    correctAnswer: "m5q26_c",
    topic: "Delegar con Claude",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "La IA acelera el trabajo, también el profesional. La decisión y su consecuencia siguen siendo de la persona, por bueno que sea el pedido.",
  },
  {
    id: "m5q27",
    question:
      "Quieres que Claude analice un archivo grande de datos. ¿Qué haces para obtener un resultado confiable?",
    options: [
      {
        id: "m5q27_a",
        label: "Pedir directamente la conclusión final para ahorrar tiempo",
      },
      {
        id: "m5q27_b",
        label: "Pedir los pasos del análisis y validar una muestra a mano",
      },
      {
        id: "m5q27_c",
        label: "Pedirle a Claude que confirme dos veces el resultado",
      },
      {
        id: "m5q27_d",
        label: "Pedir un gráfico: si se ve coherente, el dato es correcto",
      },
    ],
    correctAnswer: "m5q27_b",
    topic: "Límites y errores",
    difficulty: "difícil",
    source: "Lección 2: Crea con Claude",
    feedback:
      "Pide el método y valida una muestra con un cálculo independiente. Que Claude confirme o que el gráfico se vea bien no prueba que el dato sea correcto.",
  },
  {
    id: "m5q28",
    question:
      "Claude redactó el borrador de un informe para un cliente y tú lo revisaste y ajustaste. ¿Qué haces con el uso de IA al entregarlo?",
    options: [
      {
        id: "m5q28_a",
        label: "Nada: si lo revisé y lo ajusté, el informe ya es solo mío",
      },
      {
        id: "m5q28_b",
        label: "Lo menciono solo si el cliente pregunta cómo se hizo",
      },
      {
        id: "m5q28_c",
        label: "Pongo a Claude como autor, porque escribió la mayor parte",
      },
      {
        id: "m5q28_d",
        label: "Declaro cómo usé la IA y quién responde por el contenido",
      },
    ],
    correctAnswer: "m5q28_d",
    topic: "Delegar con Claude",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Declarar el uso de IA es parte de entregar con honestidad: dices en qué te ayudó y quién revisó y responde por el resultado. Revisarlo no borra que usaste IA, y la responsabilidad es de una persona, no de la herramienta.",
  },
  {
    id: "m5q29",
    question:
      "Quieres hacerle a Claude una consulta puntual que no quede en tu historial ni en su memoria. ¿Qué haces?",
    options: [
      {
        id: "m5q29_a",
        label:
          "Abrir un chat de incógnito y compartir solo los datos necesarios",
      },
      {
        id: "m5q29_b",
        label:
          "Hacerla en tu Proyecto de trabajo, que ya tiene todas tus instrucciones",
      },
      {
        id: "m5q29_c",
        label: "Hacerla en un chat normal, porque la memoria es privada",
      },
      {
        id: "m5q29_d",
        label:
          "Usar el incógnito y pegar datos de clientes, porque ahí sí está permitido",
      },
    ],
    correctAnswer: "m5q29_a",
    topic: "Privacidad y datos",
    difficulty: "fácil",
    source: "Lección 3: Delega con Claude",
    feedback:
      "El incógnito sirve para un chat puntual: no queda en tu historial ni se usa para la memoria del chat. Pero Anthropic puede conservar esas conversaciones un tiempo por seguridad, y el incógnito no te autoriza a compartir datos personales: comparte solo lo necesario. Un chat normal o un Proyecto sí conservan ese contexto.",
  },
  {
    id: "m5q30",
    question:
      "Al terminar un proyecto con Claude, ¿qué práctica deja una mejor base para el siguiente?",
    options: [
      {
        id: "m5q30_a",
        label: "Borrar el Proyecto para empezar el siguiente sin contexto",
      },
      {
        id: "m5q30_b",
        label: "Dejar todo en la memoria para que Claude lo recuerde solo",
      },
      {
        id: "m5q30_c",
        label:
          "Guardar instrucciones, ejemplos y aprendizajes en un Proyecto o Skill",
      },
      {
        id: "m5q30_d",
        label:
          "Guardar el historial completo de chats y releerlo entero la próxima vez",
      },
    ],
    correctAnswer: "m5q30_c",
    topic: "Proyectos y memoria",
    difficulty: "medio",
    source: "Lección 3: Delega con Claude",
    feedback:
      "Lo que funciona debe quedar guardado en un Proyecto o una Skill: así cada nuevo trabajo parte de lo aprendido, sin depender de releer chats ni de lo que la memoria retenga.",
  },
];
