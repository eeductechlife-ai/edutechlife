export default {
  badge: "Módulo 1 · Explicación",
  title: "El Cincel",
  subtitle:
    "Qué es un prompt, cómo se arma y por qué la IA responde mejor a una instrucción clara",
  intro:
    "El prompt es la instrucción que escribes para la IA. Como el cincel del artesano, da forma al resultado: cuanto más preciso el golpe, mejor la pieza. Aquí aprenderás las partes de un prompt y cómo la IA interpreta lo que escribes.",
  objectives: [
    "Definir qué es un prompt y para qué sirve",
    "Identificar sus partes: rol, tarea, formato, contexto y restricciones",
    "Explicar qué es un token y la ventana de contexto",
    "Corregir un prompt vago paso a paso",
  ],
  sections: [
    {
      title: "1. Qué es un prompt",
      explain: [
        "Un prompt es todo lo que escribes para pedirle algo a la IA: una pregunta, una orden, un texto de ejemplo o una combinación de estos.",
        "La IA no lee tu intención: lee tus palabras. Lo que no escribes, no lo sabe. Por eso un buen prompt dice lo que quieres con claridad.",
      ],
      terms: [
        {
          term: "Prompt",
          def: "La instrucción o pregunta que escribes para obtener una respuesta de la IA.",
        },
        {
          term: "Respuesta",
          def: "Lo que la IA genera a partir de tu prompt; puede variar aunque repitas la pregunta.",
        },
      ],
      how: [
        "Escribes tu pedido.",
        "La IA lo interpreta con las palabras que usaste.",
        "Genera una respuesta. Si no te sirve, ajustas el prompt y repites.",
      ],
      example:
        "«Escribe algo sobre el agua» da una respuesta general. «Explica a estudiantes de 10 años por qué el agua se evapora, en cinco frases» da una respuesta útil.",
      mistake:
        "Pensar que la IA sabe el contexto que tienes en la cabeza. Si no lo escribes, no existe para ella.",
    },
    {
      title: "2. Las cinco partes de un prompt",
      explain: [
        "Un prompt completo suele tener cinco partes. No todas son obligatorias, pero cuantas más incluyas, menos supondrá la IA.",
        "Rol: el papel que debe asumir. Tarea: la acción concreta. Formato: cómo debe verse la respuesta. Contexto: para quién y para qué. Restricciones: lo que no debe hacer.",
      ],
      terms: [
        {
          term: "Rol",
          def: "El papel que la IA asume, por ejemplo «profesor de primaria» o «editor».",
        },
        {
          term: "Tarea",
          def: "La acción concreta que debe realizar: resumir, comparar, redactar, explicar.",
        },
        {
          term: "Formato",
          def: "La forma de la respuesta: lista, tabla, tres párrafos, extensión máxima.",
        },
        {
          term: "Contexto",
          def: "La información sobre la situación: público, propósito, datos que sí debe usar.",
        },
        {
          term: "Restricción",
          def: "Un límite: lo que no debe incluir o hacer.",
        },
      ],
      how: [
        "Empieza por la tarea: qué quieres que haga.",
        "Añade el contexto: para quién es.",
        "Define el formato y las restricciones.",
        "Si quieres un tono o un punto de vista, agrega el rol.",
      ],
      example:
        "«Actúa como editor escolar. Resume este texto para padres de familia en tres párrafos, sin tecnicismos ni nombres de estudiantes.» Tiene rol, tarea, contexto, formato y restricción.",
      mistake:
        "Escribir solo la tarea, sin contexto ni formato, y luego quejarse de que la respuesta es genérica.",
    },
    {
      title: "3. Cómo lee la IA tu prompt",
      explain: [
        "La IA procesa el texto en tokens, fragmentos de palabras. Trabaja con una cantidad limitada de texto a la vez: la ventana de contexto. Lo que queda fuera puede perderse.",
        "Además, muchas herramientas tienen cierta aleatoriedad: la misma pregunta puede dar respuestas distintas. Por eso conviene revisar y comparar, no confiar en una sola respuesta.",
      ],
      terms: [
        {
          term: "Token",
          def: "Fragmento de texto que la IA procesa; una palabra puede ser uno o varios tokens.",
        },
        {
          term: "Ventana de contexto",
          def: "Cantidad de texto que la IA puede considerar a la vez.",
        },
        {
          term: "Aleatoriedad",
          def: "Variación natural de las respuestas aunque el prompt sea el mismo.",
        },
      ],
      how: [
        "Pon lo más importante al principio del prompt.",
        "En conversaciones largas, recuerda las instrucciones clave.",
        "Compara dos respuestas antes de decidir.",
      ],
      example:
        "Si pegas diez páginas y al final pides «usa solo la sección 2», la IA puede no recordar bien la sección 2. Pide la sección por su título.",
      mistake:
        "Creer que la respuesta es siempre la misma. Cambia con cada intento y con la longitud del texto.",
    },
    {
      title: "4. Corregir un prompt vago",
      explain: [
        "Un prompt vago deja demasiado a la suposición. Corregirlo es agregar lo que falta: la tarea clara, el público, el formato y un límite.",
        "Este método sirve para cualquier pedido: pregúntate qué falta y añádelo.",
      ],
      terms: [
        {
          term: "Prompt vago",
          def: "Instrucción sin tarea clara, sin contexto o sin formato.",
        },
        {
          term: "Iterar",
          def: "Mejorar el prompt paso a paso según lo que la respuesta te devuelve.",
        },
      ],
      how: [
        "Lee la respuesta y di qué te falta.",
        "Añade la parte que falta al prompt.",
        "Repite hasta que la respuesta sirva para tu fin.",
      ],
      example:
        "«Hazme un plan» → «Hazme un plan de estudio de cuatro semanas para álgebra, con dos horas diarias, en tabla semanal».",
      mistake:
        "Dar muchas órdenes en un solo mensaje: la IA puede cumplir solo una parte. Pide una cosa por vez o numera las tareas.",
    },
  ],
  summary: [
    "Un prompt es la instrucción que escribes; la IA solo sabe lo que escribes.",
    "Un prompt completo tiene tarea, rol, formato, contexto y restricciones.",
    "La IA trabaja con tokens y una ventana de contexto limitada; pon lo importante claro y al inicio.",
    "La respuesta puede variar: compara y revisa antes de usarla.",
    "Para corregir un prompt vago, agrega lo que falta y repite.",
  ],
  check: [
    {
      q: "¿Qué son las cinco partes de un prompt completo?",
      options: [
        "Rol, tarea, formato, contexto y restricciones.",
        "Título, fecha, autor, precio y correo.",
        "Inicio, medio, final, firma y número de página.",
      ],
      correct: 0,
      feedback:
        "Rol, tarea, formato, contexto y restricciones son las piezas que hacen que la respuesta sea precisa.",
    },
    {
      q: "¿Qué es la ventana de contexto?",
      options: [
        "La pantalla donde se muestra la respuesta.",
        "La cantidad de texto que la IA puede considerar a la vez.",
        "El tiempo que tarda la IA en responder.",
      ],
      correct: 1,
      feedback:
        "La ventana de contexto es el límite de texto que la IA procesa a la vez; lo que queda fuera puede perderse.",
    },
    {
      q: "Tu prompt dice solo «haz un resumen». ¿Qué debes hacer para mejorarlo?",
      options: [
        "Dejarlo así, la IA sabe qué hacer.",
        "Agregar para quién es, la extensión y el formato que necesitas.",
        "Repetirlo tres veces seguidas.",
      ],
      correct: 1,
      feedback:
        "Agregar público, extensión y formato le da a la IA lo que le falta para acertar.",
    },
  ],
};
