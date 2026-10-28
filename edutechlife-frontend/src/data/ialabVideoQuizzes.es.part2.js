export const ES_PART2 = {
  "claude-video-proyectos-1": [
    {
      q: "¿Para qué sirve un Proyecto?",
      options: [
        "Para guardar instrucciones y archivos de un trabajo",
        "Para subir archivos sin ningún límite de tamaño ni de tipo",
        "Para reemplazar la memoria de Claude",
      ],
      correct: 0,
      feedback: "Un Proyecto reúne el contexto de un trabajo concreto.",
    },
    {
      q: "¿Qué debes revisar antes de conectar una herramienta?",
      options: [
        "Solo que tenga un logo bonito",
        "Qué permisos y accesos pide",
        "Nada: siempre es seguro",
      ],
      correct: 1,
      feedback:
        "Los conectores funcionan con permisos que tú apruebas. Revísalos antes.",
    },
    {
      q: "¿Qué puede ser una Skill?",
      options: [
        "Un procedimiento que se repite",
        "Una contraseña de respaldo",
        "Un modelo distinto de Claude para tareas distintas",
      ],
      correct: 0,
      feedback:
        "Una Skill convierte un procedimiento repetido en algo reutilizable.",
    },
  ],
  "herramientas-video-1": [
    {
      q: "¿Qué haces con una cifra que entrega el análisis de datos?",
      options: [
        "La uso directo, es un cálculo automático",
        "Recalculo a mano unas pocas filas y comparo",
        "Pido otra cifra hasta que me guste",
      ],
      correct: 1,
      feedback:
        "Recalcular a mano unas pocas filas confirma que el análisis es correcto.",
    },
    {
      q: "¿Qué pregunta conviene hacerte antes de activar una herramienta?",
      options: [
        "¿Cuántas herramientas puedo activar a la vez?",
        "¿Cuál es la más nueva del menú?",
        "¿Cómo voy a verificar el resultado?",
      ],
      correct: 2,
      feedback:
        "Si no tienes cómo comprobar el resultado, replantea la herramienta o la tarea.",
    },
    {
      q: "¿Qué datos conviene subir a una herramienta?",
      options: [
        "Solo lo que mostrarías en un documento público",
        "Todo lo que dé más contexto",
        "Datos personales, para personalizar",
      ],
      correct: 0,
      feedback: "Quita antes los datos personales y confidenciales.",
    },
  ],
  "fachada-video-1": [
    {
      q: "¿Con qué conviene empezar en un trabajo que se repite?",
      options: [
        "Con un agente que lo haga solo",
        "Con un Proyecto con tus instrucciones y archivos",
        "Con un GPT, sin revisar tu cuenta",
      ],
      correct: 1,
      feedback:
        "El Proyecto guarda instrucciones y archivos; además, OpenAI programó retirar los GPT personalizados el 11-dic-2026 (fecha sujeta a cambios).",
    },
    {
      q: "¿Qué prueba verifica que un GPT no repita datos de menores?",
      options: ["Coherencia", "Caso normal", "Dato sensible"],
      correct: 2,
      feedback:
        "En la prueba de dato sensible, el GPT no debe pedir ni repetir datos personales o de menores.",
    },
    {
      q: "¿Cuál es tu papel cuando un agente ejecuta varios pasos?",
      options: [
        "Revisar el plan y aprobar las acciones importantes",
        "Aprobar el resultado final sin mirar los pasos",
        "Dejarlo solo para ahorrar tiempo",
      ],
      correct: 0,
      feedback:
        "Un error temprano se propaga a todo el resultado: supervisa el plan y los pasos.",
    },
  ],
  "grounding-video-1": [
    {
      q: "¿Qué significa anclar una respuesta (grounding)?",
      options: [
        "Que la IA responde más rápido",
        "Que la IA apoya lo que dice en fuentes reales que puedes abrir",
        "Que la IA guarda tus preguntas",
      ],
      correct: 1,
      feedback:
        "Anclar es apoyar la respuesta en fuentes reales que puedes abrir y comprobar.",
    },
    {
      q: "Una respuesta trae una cifra sin fuente. ¿Qué haces?",
      options: [
        "La uso si suena segura",
        "La redondeo para que parezca exacta",
        "Pido la fuente y abro el enlace antes de usarla",
      ],
      correct: 2,
      feedback:
        "Una cifra sin fuente no es evidencia: pide la fuente y ábrela.",
    },
    {
      q: "¿Cuántas fuentes conviene abrir para respaldar las conclusiones clave?",
      options: ["Al menos tres", "Solo una", "Ninguna, si suena segura"],
      correct: 0,
      feedback:
        "Abre al menos tres fuentes que respalden las conclusiones clave.",
    },
  ],
  "curaduria-video-1": [
    {
      q: "¿Qué cuaderno suele responder mejor?",
      options: [
        "Uno con cincuenta documentos desordenados",
        "Uno con cinco fuentes bien elegidas",
        "Uno con fuentes de fechas mezcladas",
      ],
      correct: 1,
      feedback:
        "Pocas fuentes bien elegidas dan mejores respuestas que muchas desordenadas.",
    },
    {
      q: "¿Cuál es una buena fuente para tu cuaderno?",
      options: [
        "Un texto anónimo sin fecha",
        "Notas sueltas que se contradicen",
        "Un informe oficial con fecha y autor",
      ],
      correct: 2,
      feedback: "Una buena fuente tiene autor, fecha y respaldo verificable.",
    },
    {
      q: "Una respuesta del cuaderno trae citas. ¿Qué haces?",
      options: [
        "Abro al menos una para comprobar el fragmento",
        "Las ignoro, ya son confiables",
        "Las borro para que se vea limpio",
      ],
      correct: 0,
      feedback:
        "Una respuesta con citas sigue necesitando tu criterio: abre una y confirma.",
    },
  ],
};
