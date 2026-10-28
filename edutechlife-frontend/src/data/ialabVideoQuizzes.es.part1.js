export const ES_PART1 = {
  "intro-video-1": [
    {
      q: "¿Qué caracteriza a la IA generativa?",
      options: [
        "Crea texto, imagen o audio nuevos",
        "Solo clasifica datos en categorías fijas",
        "Reemplaza toda decisión humana",
      ],
      correct: 0,
      feedback:
        "La IA generativa produce contenido nuevo; no solo clasifica ni decide por ti.",
    },
    {
      q: "Si un prompt es vago y genérico, ¿qué suele faltar?",
      options: [
        "Más velocidad del servidor",
        "Dar contexto específico",
        "Cambiar de idioma",
      ],
      correct: 1,
      feedback:
        "El contexto y la especificidad son lo que evita respuestas genéricas.",
    },
    {
      q: "¿Cuál es el rol del estudiante frente a la IA?",
      options: [
        "Aceptar siempre la primera respuesta",
        "Delegar todo en la IA",
        "Revisar y validar antes de usar",
      ],
      correct: 2,
      feedback:
        "La IA acelera el trabajo, pero la revisión y la decisión final son tuyas.",
    },
  ],
  "prompt-video-1": [
    {
      q: "¿Qué fórmula estructura un prompt claro?",
      options: [
        "RTF: Rol + Tarea + Formato",
        "HTML",
        "SQL, lenguaje de bases de datos",
      ],
      correct: 0,
      feedback:
        "RTF (Rol, Tarea, Formato) ordena la instrucción para obtener respuestas claras.",
    },
    {
      q: "¿Por qué conviene iterar el prompt?",
      options: [
        "Porque hay que acertar a la primera",
        "Porque cada ajuste ayuda a mejorar",
        "Porque la IA se cansa si no",
      ],
      correct: 1,
      feedback: "Iterar es parte del proceso: cada ajuste mejora el resultado.",
    },
    {
      q: "¿Qué define mejor la 'claridad' de un prompt?",
      options: [
        "Usar el mayor número de palabras posible",
        "Menos ambigüedad y más precisión",
        "Escribir en mayúsculas",
      ],
      correct: 1,
      feedback:
        "Claridad = menos ambigüedad, más precisión sobre el resultado esperado.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "¿Qué es ChatGPT?",
      options: [
        "Un motor de búsqueda de enlaces",
        "Un asistente que genera texto",
        "Una hoja de cálculo",
      ],
      correct: 1,
      feedback:
        "ChatGPT es un asistente conversacional basado en un modelo de lenguaje.",
    },
    {
      q: "¿Qué ayuda a obtener mejores respuestas de ChatGPT?",
      options: [
        "Dar rol, contexto y objetivo",
        "Escribir una sola palabra",
        "Repetir el mismo prompt sin cambios",
      ],
      correct: 0,
      feedback: "Rol, contexto y objetivo orientan la respuesta.",
    },
    {
      q: "¿Cuál es una buena práctica de seguridad con ChatGPT?",
      options: [
        "Compartir datos confidenciales sin revisar",
        "No subir información sensible innecesaria",
        "Confiar sin verificar datos críticos",
      ],
      correct: 1,
      feedback:
        "Evita exponer datos sensibles y verifica la información crítica.",
    },
  ],
  "gemini-video-1": [
    {
      q: "¿Qué significa que Gemini sea multimodal?",
      options: [
        "Que solo lee texto y lo hace rápido",
        "Que lee texto, imágenes, audio y video a la vez",
        "Que solo funciona con documentos de Google",
      ],
      correct: 1,
      feedback:
        "Multimodal quiere decir que procesa varios tipos de material en una misma conversación.",
    },
    {
      q: "¿Qué le pides a Gemini para comprobar un dato de una imagen?",
      options: [
        "Que confirme que tiene razón",
        "El lugar exacto donde aparece el dato",
        "Que la haga más bonita",
      ],
      correct: 1,
      feedback:
        "Pedir el lugar del dato te permite abrirlo y verificarlo en la evidencia.",
    },
    {
      q: "Gemini responde algo muy seguro sobre una imagen borrosa. ¿Qué haces?",
      options: [
        "La acepto porque suena segura",
        "Pido que diga qué no se puede leer",
        "La comparto de inmediato",
      ],
      correct: 1,
      feedback:
        "Una respuesta segura sobre algo borroso es una señal de alerta: pide qué no se puede confirmar.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "¿Cuál es la ventaja principal de Deep Research?",
      options: [
        "Responde con datos de entrenamiento",
        "Analiza cientos de fuentes",
        "Evita leer documentos",
      ],
      correct: 1,
      feedback:
        "Deep Research rastrea y cita fuentes: ideal para informes verificables.",
    },
    {
      q: "Ante dos respuestas distintas, ¿qué es lo más crítico?",
      options: [
        "Elegir la más larga",
        "Contrastar y decidir",
        "Quedarte con la primera",
      ],
      correct: 1,
      feedback: "Contrastar con evidencia es lo que da rigor a la decisión.",
    },
    {
      q: "¿Qué mejora un informe de investigación?",
      options: [
        "Delimitar y citar fuentes",
        "Evitar las fuentes",
        "Copiar y pegar sin revisar",
      ],
      correct: 0,
      feedback: "Pregunta delimitada + citas = informe riguroso y rastreable.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "¿En qué se basa Gemini Notebook para responder?",
      options: ["En todo el internet", "En tus documentos", "En el azar"],
      correct: 1,
      feedback:
        "Gemini Notebook responde estrictamente sobre los documentos que tú subes.",
    },
    {
      q: "¿Qué hace especial a sus respuestas?",
      options: ["Cita tus fuentes", "Ignora tus archivos", "Genera imágenes"],
      correct: 0,
      feedback: "Cita tus fuentes, lo que facilita verificar cada dato.",
    },
    {
      q: "Si no encuentra un dato que preguntas, ¿qué significa?",
      options: [
        "Que el dato no está en el texto",
        "Que la herramienta está dañada",
        "Que debes pedirle que lo invente",
      ],
      correct: 0,
      feedback:
        "Gemini Notebook no inventa: si no está en tus fuentes, no puede responderlo.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "¿Qué es un Audio Overview en Gemini Notebook?",
      options: [
        "Un resumen en audio",
        "Un documento PDF",
        "Una tabla de datos completa completa",
      ],
      correct: 0,
      feedback:
        "Convierte tus fuentes en un resumen conversacional para escuchar.",
    },
    {
      q: "¿Cuándo resulta más útil el audio?",
      options: [
        "Para estudiar en ruta",
        "Para editar imágenes",
        "Para instalar software",
      ],
      correct: 0,
      feedback: "Es ideal para repaso pasivo en traslados o tareas.",
    },
    {
      q: "¿Qué debes hacer antes de generar el audio?",
      options: [
        "Cargar fuentes clave",
        "No cargar nada",
        "Subir archivos al azar",
      ],
      correct: 0,
      feedback:
        "La calidad del audio depende de la calidad y curaduría de tus fuentes.",
    },
  ],
  "privacy-video-1": [
    {
      q: "¿Qué dato NO conviene compartir con una IA pública?",
      options: [
        "Info confidencial",
        "Una pregunta general",
        "Un texto público",
      ],
      correct: 0,
      feedback: "Evita exponer datos personales o confidenciales sensibles.",
    },
    {
      q: "¿Qué implica la minimización de datos?",
      options: [
        "Recoger solo lo necesario",
        "Recoger todo lo posible",
        "Guardar datos sin ningún límite",
      ],
      correct: 0,
      feedback: "Minimizar = usar solo los datos estrictamente necesarios.",
    },
    {
      q: "¿Quién es responsable de proteger los datos del estudiante?",
      options: [
        "Nadie, nunca",
        "La institución y el usuario con buenas prácticas",
        "Solo la IA, sin control humano ni ninguna revisión posible",
      ],
      correct: 1,
      feedback:
        "La protección es corresponsabilidad entre institución y usuario.",
    },
  ],
  "ethics-video-1": [
    {
      q: "¿Qué implica el principio de transparencia?",
      options: [
        "Ocultar que se usa IA",
        "Informar cuándo y cómo",
        "Esconder las decisiones",
      ],
      correct: 1,
      feedback: "Transparencia es informar de forma clara el uso de IA.",
    },
    {
      q: "¿Qué significa 'accountability' (responsabilidad)?",
      options: [
        "Que la IA es la única responsable",
        "Que hay personas que responden",
        "Que nadie responde",
      ],
      correct: 1,
      feedback:
        "Debe haber responsables humanos y procesos claros ante los resultados.",
    },
    {
      q: "¿Qué busca la explicabilidad?",
      options: [
        "Que se puedan justificar",
        "Que el sistema nunca falle",
        "Que sea más rápido",
      ],
      correct: 0,
      feedback:
        "Explicabilidad = poder entender y justificar las decisiones ante las personas.",
    },
  ],
  "claude-video-intro-1": [
    {
      q: "¿Qué es Claude en el día a día?",
      options: [
        "Un buscador que solo devuelve enlaces",
        "Un asistente que escribe, analiza y crea",
        "Un programa que reemplaza la revisión humana",
      ],
      correct: 1,
      feedback:
        "Claude crea y analiza a partir de tus instrucciones; la revisión sigue siendo tuya.",
    },
    {
      q: "¿Qué mejora más el resultado de un pedido?",
      options: [
        "Escribir todo en mayúsculas",
        "Dar contexto y objetivo",
        "Pedirlo más rápido",
      ],
      correct: 1,
      feedback:
        "Sin contexto, Claude tiene que adivinar. Con objetivo, audiencia y formato acierta mejor.",
    },
    {
      q: "¿Cuándo conviene revisar con más cuidado lo que entrega Claude?",
      options: [
        "Cuando es un borrador de estilo",
        "Cuando trae cifras o nombres",
        "Nunca hace falta revisarlo",
      ],
      correct: 1,
      feedback:
        "Las cifras, los nombres y las decisiones deben verificarse siempre contra la fuente.",
    },
  ],
  "claude-artifacts-video-1": [
    {
      q: "¿Qué es un Artifact?",
      options: [
        "Una pieza que Claude crea junto al chat",
        "Un archivo que se borra al cerrar el chat",
        "Una contraseña para compartir chats",
      ],
      correct: 0,
      feedback:
        "Un Artifact vive al lado del chat: lo ves, lo editas y lo compartes.",
    },
    {
      q: "¿Cuál es el mejor pedido para una guía de docentes?",
      options: [
        "Haz algo para docentes.",
        "Guía para docentes nuevos",
        "Hazlo bonito, largo y completo.",
      ],
      correct: 1,
      feedback: "Un pedido completo dice formato, audiencia, tono y límites.",
    },
    {
      q: "Claude te da una cifra. ¿Qué haces antes de compartirla?",
      options: [
        "La comparto tal cual, Claude la calculó",
        "La verifico con su fuente original",
        "La cambio para que se vea mejor",
      ],
      correct: 1,
      feedback:
        "Las cifras se comprueban con una fuente antes de compartirlas.",
    },
  ],
};
