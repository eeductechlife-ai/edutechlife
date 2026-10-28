export const MODULE_5_PART1 = [
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
    source: "Lección 1 · Conoce a Claude: la IA que trabaja contigo",
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
    source:
      "Lección 2 · Crea con Claude: Artifacts, documentos y presentaciones",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
    feedback:
      "Un Proyecto guarda las instrucciones y los archivos de un trabajo concreto que se repite, para que no los repitas en cada chat. Mezclar temas o subir archivos de más le da contexto que no sirve y puede exponer datos.",
  },
  {
    id: "m5q5",
    question:
      "Quieres que Claude lea tu correo electrónico para preparar la respuesta a un cliente. ¿Qué haces?",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 1 · Conoce a Claude: la IA que trabaja contigo",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 1 · Conoce a Claude: la IA que trabaja contigo",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
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
    source: "Lección 3 · Delega con Claude: Proyectos, conectores y Skills",
    feedback:
      "Las tareas de forma, sin decisión de fondo, son ideales para delegar. Lo que sale a terceros, contiene datos personales o cifras para decidir se delega y se revisa.",
  },
];
