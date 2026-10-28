export default {
  badge: "Módulo 2 · Explicación",
  title: "El Taller de Proyectos",
  subtitle:
    "Proyectos, instrucciones, plugins y agentes: qué es cada uno y cuándo usarlo",
  intro:
    "Cuando repites un mismo tipo de trabajo, no conviene empezar de cero cada vez. En esta lección aprenderás los términos clave para organizar ese trabajo con ChatGPT, qué hace cada herramienta y cómo revisar el resultado antes de usarlo.",
  objectives: [
    "Explicar qué es un Proyecto y qué guarda",
    "Definir qué son instrucciones, plugin y agente, con sus diferencias",
    "Escribir instrucciones claras con rol, contexto y límites",
    "Reconocer el error de guardar datos sensibles en un Proyecto",
  ],
  sections: [
    {
      title: "1. ¿Qué es un Proyecto?",
      explain: [
        "Un Proyecto es un espacio para agrupar un trabajo: guarda sus instrucciones y sus archivos, y cada chat dentro del Proyecto usa ese contexto sin que tengas que pegarlo otra vez.",
        "Piensa en una carpeta de trabajo con una hoja de instrucciones pegada en la portada: todo lo que abras dentro parte de esas mismas reglas.",
      ],
      terms: [
        {
          term: "Proyecto",
          def: "Espacio que agrupa chats, archivos e instrucciones de un mismo trabajo.",
        },
        {
          term: "Contexto",
          def: "Lo que la IA sabe sobre tu situación antes de responder: tu tarea, tu público y tus reglas.",
        },
      ],
      how: [
        "Creas el Proyecto y le das un nombre que describa el trabajo.",
        "Escribes sus instrucciones y subes los archivos que el trabajo necesita.",
        "Cada conversación nueva dentro del Proyecto ya trae ese contexto.",
      ],
      example:
        "Un asesor de propuestas crea un Proyecto «Propuestas de clientes» con su tono, sus precios y sus plantillas.",
      mistake:
        "Subir a un Proyecto datos personales o confidenciales de personas que no te autorizaron a usarlos.",
    },
    {
      title: "2. Instrucciones: la base del Proyecto",
      explain: [
        "Las instrucciones son el texto que describe cómo debe trabajar la IA: qué papel tiene, para quién escribe, con qué tono y qué límites respeta.",
        "Unas buenas instrucciones son concretas. «Responde bien» no dice nada; «Eres asesor de un colegio, escribes para familias con frases cortas y nunca incluyes nombres de estudiantes» sí orienta el resultado.",
      ],
      terms: [
        {
          term: "Instrucciones",
          def: "Reglas escritas que guían cada respuesta del Proyecto.",
        },
        {
          term: "Rol",
          def: "El papel que asumes que tiene la IA, por ejemplo «asesor» o «editor».",
        },
        {
          term: "Límite",
          def: "Algo que la IA no debe hacer, como inventar cifras o pedir datos personales.",
        },
      ],
      how: [
        "Describe el rol: quién es la IA en este trabajo.",
        "Explica el contexto: para quién es el resultado y para qué se usa.",
        "Define el formato y los límites: extensión, tono y lo que nunca debe hacer.",
      ],
      example:
        "«Escribes avisos para familias. Usa tono cercano, tres párrafos como máximo y no incluyas nombres de estudiantes.»",
      mistake:
        "Instrucciones vagas o muy largas que se contradicen. Revísalas cuando el resultado no sea el esperado.",
    },
    {
      title: "3. Plugin, agente y GPT: qué los diferencia",
      explain: [
        "Un plugin es un complemento que conecta la IA con una herramienta o servicio externo para una tarea repetida. Reúne reglas, archivos y accesos a aplicaciones.",
        "Un agente hace varios pasos para llegar a un objetivo, por ejemplo buscar, comparar y armar una tabla. Tú revisas el plan y apruebas las acciones importantes.",
        "Un GPT personalizado es una versión de ChatGPT con sus propias instrucciones y archivos. OpenAI programó retirar los GPT personalizados el 11 de diciembre de 2026, y los plugins son el reemplazo previsto. Revisa en tu cuenta qué tienes disponible.",
      ],
      terms: [
        {
          term: "Plugin",
          def: "Complemento que conecta la IA con una herramienta o servicio para una tarea repetida.",
        },
        {
          term: "Agente",
          def: "Asistente que ejecuta varios pasos bajo tu supervisión.",
        },
        {
          term: "API",
          def: "Forma en que dos programas se comunican para pedir o enviar datos.",
        },
        {
          term: "Webhook",
          def: "Aviso automático que un servicio envía a otro cuando ocurre algo, por ejemplo una nueva queja.",
        },
      ],
      how: [
        "Un Proyecto guarda contexto y archivos para tu trabajo.",
        "Un plugin hace una tarea conectada a una herramienta externa.",
        "Un agente encadena pasos: tú apruebas los importantes antes de seguir.",
      ],
      example:
        "Para responder preguntas frecuentes de una marca, un plugin consulta el catálogo; para comparar cinco proveedores y armar una tabla, un agente hace los pasos.",
      mistake:
        "Pensar que el agente se equivoca menos porque trabajó varios minutos. Un error temprano se propaga a todo el resultado.",
    },
    {
      title: "4. Probar antes de usar",
      explain: [
        "Un resultado puede sonar seguro y estar mal. Antes de usarlo, separa lo que viene de tus archivos de lo que la IA supuso.",
        "Probar significa darle un caso real, revisar los datos que no aparecen en tus archivos y confirmarlos en su fuente.",
      ],
      terms: [
        {
          term: "Verificar",
          def: "Comprobar un dato contra una fuente que puedas abrir.",
        },
        {
          term: "Dato inventado",
          def: "Dato que la IA produce sin que exista en tus archivos ni en una fuente.",
        },
      ],
      how: [
        "Lee la respuesta y marca los datos concretos: fechas, cifras y nombres.",
        "Busca cada dato en tus archivos. Si no está, confírmalo en la fuente original.",
        "Si no puedes confirmarlo, no lo uses.",
      ],
      example:
        "Un aviso dice «la reunión será el jueves 5 a las 7 p. m.». Si la fecha no está en tus archivos ni en el calendario oficial, confírmala antes de enviarla.",
      mistake:
        "Enviar el resultado porque el Proyecto «ya lo revisó». El Proyecto solo conoce lo que tiene en sus instrucciones y archivos.",
    },
  ],
  summary: [
    "Un Proyecto agrupa chats, archivos e instrucciones de un mismo trabajo.",
    "Las instrucciones dicen rol, contexto, formato y límites; cuanto más concretas, mejor el resultado.",
    "Un plugin conecta una herramienta; un agente hace varios pasos bajo tu aprobación.",
    "Los GPT personalizados se retiran el 11 de diciembre de 2026; los plugins son el reemplazo previsto.",
    "Antes de usar un resultado, verifica sus datos concretos en una fuente que puedas abrir.",
  ],
  check: [
    {
      q: "¿Qué guarda un Proyecto?",
      options: [
        "Solo el historial de facturación de tu cuenta.",
        "Las instrucciones y los archivos de un mismo trabajo.",
        "Las respuestas de todos los usuarios de la plataforma.",
      ],
      correct: 1,
      feedback:
        "Un Proyecto agrupa instrucciones, archivos y chats de un mismo trabajo.",
    },
    {
      q: "Necesitas que la IA consulte un catálogo que cambia cada día. ¿Qué es lo más adecuado?",
      options: [
        "Escribir los precios de hoy en las instrucciones y no tocarlos más.",
        "Usar un plugin que consulte la fuente actualizada y verificar la fecha del dato.",
        "Pedirle que adivine los precios de hoy.",
      ],
      correct: 1,
      feedback:
        "Un dato que cambia debe venir de una fuente actualizada, no de una instrucción fija ni de una suposición.",
    },
    {
      q: "Un agente te entrega una tabla de proveedores. ¿Qué haces antes de enviarla?",
      options: [
        "La envío, porque el agente trabajó varios minutos.",
        "Reviso las fuentes y confirmo las cifras que usaré.",
        "Borro las fuentes para que la tabla se vea limpia.",
      ],
      correct: 1,
      feedback:
        "El agente ahorra pasos, pero tú verificas los datos antes de usarlos.",
    },
  ],
};
