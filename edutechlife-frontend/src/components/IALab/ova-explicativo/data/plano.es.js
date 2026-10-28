export default {
  badge: "Módulo 2 · Explicación",
  title: "El Plano Maestro",
  subtitle:
    "Cómo responde ChatGPT, qué significan sus modos y qué permiso das cuando conectas una cuenta",
  intro:
    "Antes de elegir una herramienta, conviene entender cómo funciona el sistema que la sostiene. Aquí aprenderás los términos del ecosistema de ChatGPT: modelo, modo, conector y memoria, y qué debes revisar en cada caso.",
  objectives: [
    "Explicar qué es un modelo de lenguaje y cómo construye una respuesta",
    "Distinguir modelo, modo y plan",
    "Entender qué es un conector y qué permiso concede",
    "Controlar qué recuerda la memoria de tu cuenta",
  ],
  sections: [
    {
      title: "1. Cómo construye una respuesta un modelo",
      explain: [
        "Un modelo de lenguaje no busca una respuesta guardada: escribe una pieza tras otra, eligiendo la que tiene más sentido después de la anterior. Por eso una misma pregunta puede tener respuestas distintas.",
        "Trabaja con fragmentos de texto llamados tokens. Lo que cabe en una conversación tiene un límite: la ventana de contexto. Si el texto es muy largo, las partes lejanas pueden perderse.",
      ],
      terms: [
        {
          term: "Modelo de lenguaje",
          def: "Sistema entrenado con grandes cantidades de texto para predecir y generar lenguaje.",
        },
        {
          term: "Token",
          def: "Fragmento de texto (una palabra, parte de una palabra o un signo) que el modelo procesa.",
        },
        {
          term: "Ventana de contexto",
          def: "Cantidad de texto que el modelo puede considerar a la vez en una conversación.",
        },
      ],
      how: [
        "Recibe tu pedido y lo divide en tokens.",
        "Predice la siguiente pieza, una tras otra.",
        "Entrega la respuesta completa. Puede equivocarse aunque suene segura.",
      ],
      example:
        "Si pegas un documento muy largo y luego preguntas por su primera página, el modelo puede no tenerla en cuenta si queda fuera de la ventana de contexto.",
      mistake:
        "Pensar que la IA «busca» en una base de datos interna. Genera la respuesta en el momento, por eso debes verificarla.",
    },
    {
      title: "2. Modelo, modo y plan",
      explain: [
        "El modelo es el motor que responde. Los modos son formas de usarlo: unos priorizan la velocidad y otros razonan más despacio para tareas complejas.",
        "El plan define qué modelos y qué funciones tienes disponibles. Los nombres y las opciones cambian con frecuencia, así que revisa el selector de tu cuenta.",
      ],
      terms: [
        {
          term: "Modo",
          def: "Forma de usar un modelo: más rápido para tareas simples, más detenido para problemas complejos.",
        },
        {
          term: "Plan",
          def: "Conjunto de modelos y funciones que incluye tu cuenta.",
        },
      ],
      how: [
        "Abre el selector de modelo de tu cuenta.",
        "Usa el modo rápido para borradores y resúmenes simples.",
        "Usa el modo más detenido para análisis con varios pasos.",
      ],
      example:
        "Para resumir un correo, basta el modo rápido. Para comparar tres contratos con cláusulas distintas, conviene el modo más detenido.",
      mistake:
        "Creer que el modo más potente siempre es mejor. Para una tarea simple tarda más y no mejora el resultado.",
    },
    {
      title: "3. Herramientas y conectores",
      explain: [
        "Las herramientas integradas amplían lo que el modelo puede hacer: buscar en la web, analizar archivos, generar imágenes o trabajar con documentos.",
        "Un conector es un permiso para que la IA lea o use una cuenta externa, por ejemplo un correo o un calendario. Antes de conectar, revisa qué datos podrá ver.",
      ],
      terms: [
        {
          term: "Herramienta",
          def: "Función que permite al modelo hacer algo más que escribir texto.",
        },
        {
          term: "Conector",
          def: "Permiso que da acceso a una cuenta o servicio externo.",
        },
        {
          term: "Permiso",
          def: "Lo que la app puede leer o hacer en tu nombre. Se concede al conectar.",
        },
      ],
      how: [
        "Elige la herramienta según la tarea: buscar, analizar, crear imagen o leer archivos.",
        "Antes de conectar una cuenta, revisa qué permisos pide.",
        "Desconecta lo que no uses.",
      ],
      example:
        "Conectar tu calendario permite preguntar «¿qué tengo el jueves?». Pero también le da acceso a tus eventos: concédelo solo si lo necesitas.",
      mistake:
        "Aceptar todos los permisos sin leerlos, o conectar una cuenta con datos de otras personas.",
    },
    {
      title: "4. Memoria y control",
      explain: [
        "La memoria es lo que la cuenta recuerda de tus conversaciones para responder mejor en el futuro. Puedes revisarla, editarla y decidir qué se guarda.",
        "Recordar más no siempre es mejor: una preferencia útil ayuda, pero un dato sensible guardado sin necesidad es un riesgo.",
      ],
      terms: [
        {
          term: "Memoria",
          def: "Lo que la cuenta conserva de tus conversaciones para usarlo en otras.",
        },
        {
          term: "Instrucciones personalizadas",
          def: "Preferencias que defines una vez y se aplican a tus chats.",
        },
      ],
      how: [
        "Revisa en la configuración qué recuerda la memoria.",
        "Borra lo que no quieras que se conserve.",
        "Para un trabajo puntual, usa un chat sin memoria o un Proyecto.",
      ],
      example:
        "Guardar «respóndeme en tono formal» es útil. Guardar la cédula de un cliente no lo es.",
      mistake:
        "Olvidar que la memoria existe y compartir datos pensando que cada chat empieza de cero.",
    },
  ],
  summary: [
    "Un modelo escribe la respuesta pieza por pieza; puede equivocarse aunque suene seguro.",
    "El modelo es el motor, el modo es la forma de usarlo y el plan define qué tienes.",
    "Una herramienta amplía lo que hace el modelo; un conector le da acceso a una cuenta externa.",
    "La memoria conserva lo que decides; revísala y bórrala cuando sea necesario.",
    "Antes de conectar o guardar algo, pregúntate qué permiso das y qué datos quedan.",
  ],
  check: [
    {
      q: "¿Qué es un token?",
      options: [
        "Un pago que se hace por cada respuesta.",
        "Un fragmento de texto que el modelo procesa.",
        "La contraseña de tu cuenta.",
      ],
      correct: 1,
      feedback:
        "Un token es un fragmento de texto (una palabra, parte de una palabra o un signo) que el modelo procesa.",
    },
    {
      q: "Quieres que la IA lea tu calendario para avisarte de citas. ¿Qué debes revisar primero?",
      options: [
        "Nada: conectar siempre es seguro.",
        "Qué permisos pide el conector y si necesitas darle ese acceso.",
        "Que el logo de la app sea bonito.",
      ],
      correct: 1,
      feedback:
        "Un conector concede permisos reales sobre tu cuenta: revisa qué puede ver antes de conectarlo.",
    },
    {
      q: "Resumir un correo corto. ¿Qué modo conviene?",
      options: [
        "El más detenido, porque siempre es mejor.",
        "El rápido, porque la tarea es simple.",
        "Ninguno: la IA no resume correos.",
      ],
      correct: 1,
      feedback: "Para una tarea simple, el modo rápido basta y responde antes.",
    },
  ],
};
