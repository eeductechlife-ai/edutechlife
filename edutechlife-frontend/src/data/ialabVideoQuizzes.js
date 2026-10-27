// Micro-quizzes de comprensión posteriores al video (Fase 1 pedagógica).
// 3 preguntas por video, con feedback. Se usan para desbloquear el marcado
// "visto" además del gate de reproducción.

const ES = {
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
      q: "¿Qué significa 'multimodal' en Gemini?",
      options: [
        "Que solo procesa texto",
        "Entiende varios formatos",
        "Que funciona sin internet",
      ],
      correct: 1,
      feedback:
        "Multimodal = trabaja con varios tipos de datos a la vez (texto, imagen, audio, video).",
    },
    {
      q: "¿Cómo se conecta Gemini con el trabajo diario?",
      options: [
        "Solo con Google Chrome instalado instalado",
        "Integrado en Docs y Sheets",
        "No tiene integración",
      ],
      correct: 1,
      feedback:
        "Gemini se integra nativamente en las apps de Google Workspace.",
    },
    {
      q: "¿Para qué sirve Deep Research en Gemini?",
      options: [
        "Buscar datos actuales",
        "Inventar datos verosímiles",
        "Solo traducir textos",
      ],
      correct: 0,
      feedback:
        "Deep Research busca, cruza fuentes y entrega informes con citas verificables.",
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

const EN = {
  "intro-video-1": [
    {
      q: "What characterizes generative AI?",
      options: [
        "It creates new text, image or audio",
        "It only sorts data into fixed categories",
        "It replaces all human decisions",
      ],
      correct: 0,
      feedback:
        "Generative AI produces new content; it doesn't just classify or decide for you.",
    },
    {
      q: "If a prompt is vague and generic, what is usually missing?",
      options: [
        "More server speed available",
        "Context and specificity",
        "Changing language",
      ],
      correct: 1,
      feedback: "Context and specificity are what prevent generic answers.",
    },
    {
      q: "What is the student's role with AI?",
      options: [
        "Always accept the first answer",
        "Fully delegate decisions",
        "Review and validate the facts",
      ],
      correct: 2,
      feedback:
        "AI speeds up work, but review and the final decision are yours.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Which formula structures a clear prompt?",
      options: [
        "RTF: Role + Task + Format",
        "HTML",
        "SQL, a language for databases",
      ],
      correct: 0,
      feedback:
        "RTF (Role, Task, Format) orders the instruction for clear answers.",
    },
    {
      q: "Why iterate on the prompt?",
      options: [
        "Because you must be right the first time",
        "Because each adjustment gets you closer",
        "Because the AI gets tired otherwise",
      ],
      correct: 1,
      feedback:
        "Iterating is part of the process: each tweak improves the result.",
    },
    {
      q: "What best defines prompt 'clarity'?",
      options: [
        "Using as many words as possible",
        "Less ambiguity, more precision",
        "Writing in capitals",
      ],
      correct: 1,
      feedback:
        "Clarity = less ambiguity, more precision about the expected result.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "What is ChatGPT?",
      options: ["A link search engine", "A text assistant", "A spreadsheet"],
      correct: 1,
      feedback:
        "ChatGPT is a conversational assistant based on a language model.",
    },
    {
      q: "What helps get better answers from ChatGPT?",
      options: [
        "Giving role, context and goal",
        "Writing a single word",
        "Repeating the same prompt unchanged",
      ],
      correct: 0,
      feedback: "Role, context and goal steer the answer.",
    },
    {
      q: "What is a good security practice with ChatGPT?",
      options: [
        "Sharing confidential data without checking",
        "Not uploading any unneeded sensitive info",
        "Trusting critical data without verifying",
      ],
      correct: 1,
      feedback:
        "Avoid exposing sensitive data and verify critical information.",
    },
  ],
  "gemini-video-1": [
    {
      q: "What does 'multimodal' mean in Gemini?",
      options: [
        "It only processes text",
        "It reads text and images",
        "It works without internet",
      ],
      correct: 1,
      feedback: "Multimodal = works with several data types at once.",
    },
    {
      q: "How does Gemini connect to daily work?",
      options: [
        "Only with Google Chrome installed",
        "Integrated into Docs and Meet",
        "It has no integration",
      ],
      correct: 1,
      feedback: "Gemini is natively integrated into Google Workspace apps.",
    },
    {
      q: "What is Deep Research in Gemini for?",
      options: [
        "Real-time search, cited",
        "Inventing plausible data",
        "Only translating texts",
      ],
      correct: 0,
      feedback: "Deep Research searches, cross-references and cites sources.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "What is the main advantage of Deep Research?",
      options: [
        "It answers from training data",
        "It analyzes many sources",
        "It avoids reading",
      ],
      correct: 1,
      feedback:
        "Deep Research tracks and cites sources: ideal for verifiable reports.",
    },
    {
      q: "Facing two different answers, what is most critical?",
      options: [
        "Choosing the longest",
        "Cross-checking sources",
        "Keeping only the first one",
      ],
      correct: 1,
      feedback: "Cross-checking with evidence is what gives rigor.",
    },
    {
      q: "What improves a research report?",
      options: [
        "Delimiting and citing each source",
        "Avoiding sources",
        "Copying and pasting without reviewing",
      ],
      correct: 0,
      feedback:
        "A delimited question + citations = rigorous, traceable report.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "What does Gemini Notebook base its answers on?",
      options: ["The whole internet", "The files you add", "Random chance"],
      correct: 1,
      feedback:
        "Gemini Notebook answers strictly from the documents you upload.",
    },
    {
      q: "What makes its answers special?",
      options: [
        "It quotes your own docs",
        "It ignores your files",
        "It generates images, too",
      ],
      correct: 0,
      feedback: "It cites your sources, which makes each fact easy to verify.",
    },
    {
      q: "If it can't find a fact you ask for, what does it mean?",
      options: [
        "It is not in your documents",
        "The tool is broken",
        "You should ask it to make it up",
      ],
      correct: 0,
      feedback:
        "Gemini Notebook does not invent: if it's not in your sources, it can't answer.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "What is an Audio Overview in Gemini Notebook?",
      options: ["An audio summary", "A PDF document", "A detailed data table"],
      correct: 0,
      feedback:
        "It turns your sources into a conversational summary to listen to.",
    },
    {
      q: "When is the audio most useful?",
      options: ["To study on the go", "To edit images", "To install software"],
      correct: 0,
      feedback: "It's ideal for passive review during commutes or chores.",
    },
    {
      q: "What should you do before generating the audio?",
      options: [
        "Curate good sources",
        "Upload nothing",
        "Upload files at random",
      ],
      correct: 0,
      feedback:
        "Audio quality depends on the quality and curation of your sources.",
    },
  ],
  "privacy-video-1": [
    {
      q: "What data should NOT be shared with a public AI?",
      options: ["Sensitive data", "A general question", "A public text"],
      correct: 0,
      feedback: "Avoid exposing sensitive personal or confidential data.",
    },
    {
      q: "What does data minimization mean?",
      options: [
        "Collect only what's needed",
        "Collect as much as possible",
        "Store data without limits",
      ],
      correct: 0,
      feedback: "Minimize = use only strictly necessary data.",
    },
    {
      q: "Who is responsible for protecting student data?",
      options: [
        "Nobody",
        "The institution and the user with good practices",
        "Only the AI, with no human control or review at all",
      ],
      correct: 1,
      feedback:
        "Protection is a shared responsibility between institution and user.",
    },
  ],
  "ethics-video-1": [
    {
      q: "What does the transparency principle imply?",
      options: [
        "Hiding that AI is used",
        "Clearly disclosing AI",
        "Hiding decisions",
      ],
      correct: 1,
      feedback: "Transparency is clearly informing the use of AI.",
    },
    {
      q: "What does 'accountability' mean?",
      options: [
        "That AI is solely responsible",
        "That humans are accountable",
        "That nobody is responsible",
      ],
      correct: 1,
      feedback: "There must be human owners and clear processes for outcomes.",
    },
    {
      q: "What does explainability seek?",
      options: [
        "Explainable decisions",
        "That the system never fails",
        "That it is faster",
      ],
      correct: 0,
      feedback:
        "Explainability = being able to understand and justify decisions.",
    },
  ],
  "claude-video-intro-1": [
    {
      q: "What is Claude in everyday use?",
      options: [
        "A search engine that only returns links",
        "An assistant that writes and analyzes",
        "A program that replaces human review",
      ],
      correct: 1,
      feedback:
        "Claude creates and analyzes from your instructions; the review stays yours.",
    },
    {
      q: "What improves a request's result the most?",
      options: [
        "Writing everything in capitals",
        "Give context and goals",
        "Asking faster",
      ],
      correct: 1,
      feedback:
        "Without context Claude has to guess. With goal, audience and format it gets closer.",
    },
    {
      q: "When should you review what Claude delivers most carefully?",
      options: [
        "When it is a style draft",
        "When it has figures, names",
        "Never; review is not needed",
      ],
      correct: 1,
      feedback:
        "Figures, names and decisions must always be checked against the source.",
    },
  ],
  "claude-artifacts-video-1": [
    {
      q: "What is an Artifact?",
      options: [
        "A piece Claude makes next to the chat",
        "A file that is deleted when you close the chat",
        "A password to share chats",
      ],
      correct: 0,
      feedback:
        "An Artifact lives next to the chat: you see it, edit it and share it.",
    },
    {
      q: "Which is the best request for a teacher guide?",
      options: [
        "Make something for teachers.",
        "A 2-page guide for new teachers",
        "Make it nice, long and complete.",
      ],
      correct: 1,
      feedback: "A complete request states format, audience, tone and limits.",
    },
    {
      q: "Claude gives you a figure. What do you do before sharing it?",
      options: [
        "I share it as it is, Claude calculated it",
        "I check it against its original source",
        "I change it so it looks better",
      ],
      correct: 1,
      feedback: "Figures must be checked against a source before sharing.",
    },
  ],
  "claude-video-proyectos-1": [
    {
      q: "What is a Project for?",
      options: [
        "Save instructions and files",
        "Uploading files with no limit",
        "Replacing Claude's memory",
      ],
      correct: 0,
      feedback: "A Project gathers the context of one specific piece of work.",
    },
    {
      q: "What should you check before connecting a tool?",
      options: [
        "Only that it has a nice logo",
        "What permissions it asks you for",
        "Nothing: it is always safe to use",
      ],
      correct: 1,
      feedback:
        "Connectors work with permissions you approve. Check them first.",
    },
    {
      q: "What can a Skill be?",
      options: [
        "A saved repeated process",
        "A backup password",
        "A model other than Claude",
      ],
      correct: 0,
      feedback: "A Skill turns a repeated procedure into something reusable.",
    },
  ],
  "herramientas-video-1": [
    {
      q: "What do you do with a figure from data analysis?",
      options: [
        "Use it directly; it is an automatic calculation",
        "Recalculate a few rows by hand and compare",
        "Ask for another figure until I like it",
      ],
      correct: 1,
      feedback:
        "Recalculating a few rows by hand confirms the analysis is correct.",
    },
    {
      q: "Which question should you ask before turning on a tool?",
      options: [
        "How many tools can I turn on at once?",
        "Which one is newest in the menu?",
        "How will I verify the result?",
      ],
      correct: 2,
      feedback: "If you cannot check the result, rethink the tool or the task.",
    },
    {
      q: "What data is OK to upload to a tool?",
      options: [
        "Only what you would show in a public document",
        "Everything that adds more context",
        "Personal data, to personalize",
      ],
      correct: 0,
      feedback: "Remove personal and confidential data first.",
    },
  ],
  "fachada-video-1": [
    {
      q: "What should you start with for work that repeats?",
      options: [
        "An agent that does it alone",
        "A Project with your instructions and files",
        "A GPT, without checking your account",
      ],
      correct: 1,
      feedback:
        "A Project stores instructions and files; also, OpenAI has scheduled the retirement of custom GPTs for December 11, 2026 (date subject to change).",
    },
    {
      q: "Which test checks that a GPT does not repeat data about minors?",
      options: ["Consistency", "Normal case", "Sensitive data"],
      correct: 2,
      feedback:
        "In the sensitive-data test, the GPT must not ask for or repeat personal data or data about minors.",
    },
    {
      q: "What is your role when an agent runs several steps?",
      options: [
        "Review the plan and approve the important actions",
        "Approve the final result without checking the steps",
        "Leave it alone to save time",
      ],
      correct: 0,
      feedback:
        "An early error spreads to the whole result: supervise the plan and the steps.",
    },
  ],
  "grounding-video-1": [
    {
      q: "What does grounding an answer mean?",
      options: [
        "The AI answers faster",
        "The AI backs what it says with real sources you can open",
        "The AI saves your questions",
      ],
      correct: 1,
      feedback:
        "Grounding means backing the answer with real sources you can open and check.",
    },
    {
      q: "An answer includes a figure with no source. What do you do?",
      options: [
        "Use it if it sounds confident",
        "Round it so it looks exact",
        "Ask for the source and open the link before using it",
      ],
      correct: 2,
      feedback:
        "A figure without a source is not evidence: ask for the source and open it.",
    },
    {
      q: "How many sources should you open to back the key conclusions?",
      options: ["At least three", "Only one", "None, if it sounds confident"],
      correct: 0,
      feedback: "Open at least three sources that support the key conclusions.",
    },
  ],
  "curaduria-video-1": [
    {
      q: "Which notebook usually answers better?",
      options: [
        "One with fifty messy documents",
        "One with five well-chosen sources",
        "One with sources from mixed dates",
      ],
      correct: 1,
      feedback: "A few well-chosen sources beat many messy ones.",
    },
    {
      q: "Which is a good source for your notebook?",
      options: [
        "An anonymous text with no date",
        "Loose notes that contradict each other",
        "An official report with a date and author",
      ],
      correct: 2,
      feedback: "A good source has an author, a date and verifiable backing.",
    },
    {
      q: "A notebook answer includes citations. What do you do?",
      options: [
        "Open at least one to check the passage",
        "Ignore them; they are already reliable",
        "Delete them so it looks clean",
      ],
      correct: 0,
      feedback:
        "An answer with citations still needs your judgment: open one and confirm.",
    },
  ],
};

const PT = {
  "intro-video-1": [
    {
      q: "O que caracteriza a IA generativa?",
      options: [
        "Cria texto, imagem ou áudio novos",
        "Apenas classifica dados em categorias fixas",
        "Substitui toda decisão humana",
      ],
      correct: 0,
      feedback: "A IA generativa produz conteúdo novo; não apenas classifica.",
    },
    {
      q: "Se um prompt é vago e genérico, o que costuma faltar?",
      options: [
        "Mais velocidade do servidor",
        "Dar contexto específico",
        "Mudar de idioma",
      ],
      correct: 1,
      feedback: "Contexto e especificidade evitam respostas genéricas.",
    },
    {
      q: "Qual é o papel do estudante diante da IA?",
      options: [
        "Aceitar sempre a primeira resposta",
        "Delegar totalmente as decisões",
        "Revisar e validar antes de usar",
      ],
      correct: 2,
      feedback: "A revisão e a decisão final são suas.",
    },
  ],
  "prompt-video-1": [
    {
      q: "Qual fórmula estrutura um prompt claro?",
      options: [
        "RTF: Papel + Tarefa + Formato",
        "HTML",
        "SQL, linguagem para bancos de dados",
      ],
      correct: 0,
      feedback: "RTF (Papel, Tarefa, Formato) organiza a instrução.",
    },
    {
      q: "Por que iterar o prompt?",
      options: [
        "Porque é preciso acertar de primeira",
        "Porque cada ajuste aproxima da meta",
        "Porque a IA se cansa",
      ],
      correct: 1,
      feedback: "Iterar faz parte do processo.",
    },
    {
      q: "O que define melhor a 'clareza' de um prompt?",
      options: [
        "Usar o máximo de palavras",
        "Mais precisão no pedido",
        "Escrever em maiúsculas",
      ],
      correct: 1,
      feedback: "Clareza = menos ambiguidade, mais precisão.",
    },
  ],
  "chatgpt-video-1": [
    {
      q: "O que é o ChatGPT?",
      options: ["Um buscador de links", "Um redator digital", "Uma planilha"],
      correct: 1,
      feedback: "ChatGPT é um assistente conversacional.",
    },
    {
      q: "O que ajuda a obter melhores respostas?",
      options: [
        "Dar papel, contexto e objetivo",
        "Escrever uma única palavra",
        "Repetir o mesmo prompt sem mudança",
      ],
      correct: 0,
      feedback: "Papel, contexto e objetivo orientam a resposta.",
    },
    {
      q: "Boa prática de segurança com ChatGPT?",
      options: [
        "Compartilhar dados confidenciais sem revisar",
        "Não enviar dados sensíveis sem necessidade",
        "Confiar sem verificar dados críticos",
      ],
      correct: 1,
      feedback: "Evite expor dados sensíveis e verifique o crítico.",
    },
  ],
  "gemini-video-1": [
    {
      q: "O que significa 'multimodal' no Gemini?",
      options: [
        "Só processa texto",
        "Lê texto e imagens",
        "Funciona sem internet",
      ],
      correct: 1,
      feedback: "Multimodal = trabalha com vários tipos de dados.",
    },
    {
      q: "Como o Gemini se conecta ao trabalho diário?",
      options: [
        "Só com o Google Chrome",
        "Integrado ao Docs e Meet",
        "Não tem nenhuma integração",
      ],
      correct: 1,
      feedback: "Integra-se nativamente ao Google Workspace.",
    },
    {
      q: "Para que serve o Deep Research no Gemini?",
      options: [
        "Buscar ao vivo com fontes",
        "Inventar dados verossímeis",
        "Apenas traduzir textos",
      ],
      correct: 0,
      feedback: "Deep Research busca, cruza e cita fontes.",
    },
  ],
  "gemini-cases-video-1": [
    {
      q: "Qual é a principal vantagem do Deep Research?",
      options: [
        "Responde com dados de treinamento",
        "Analisa centenas de fontes",
        "Evita ler documentos",
      ],
      correct: 1,
      feedback: "Rastreia e cita fontes: ideal para relatórios verificáveis.",
    },
    {
      q: "Diante de duas respostas distintas, o que é mais crítico?",
      options: [
        "Escolher a mais longa",
        "Contrastar com a fonte",
        "Ficar só com a primeira",
      ],
      correct: 1,
      feedback: "Contrastar com evidência dá rigor à decisão.",
    },
    {
      q: "O que melhora um relatório de pesquisa?",
      options: [
        "Delimitar e citar fontes",
        "Evitar fontes",
        "Copiar e colar sem revisar",
      ],
      correct: 0,
      feedback: "Pergunta delimitada + citações = relatório rigoroso.",
    },
  ],
  "notebooklm-video-1": [
    {
      q: "Em que o Gemini Notebook baseia suas respostas?",
      options: ["Em toda a internet", "Nas suas fontes", "No acaso"],
      correct: 1,
      feedback: "Responde estritamente sobre os documentos que você envia.",
    },
    {
      q: "O que há de especial nas respostas?",
      options: ["Cita seus textos", "Ignora seus arquivos", "Gera imagens"],
      correct: 0,
      feedback: "Cita suas fontes, facilitando verificar cada dado.",
    },
    {
      q: "Se não encontra um dado, o que significa?",
      options: [
        "Que o dado não aparece no texto",
        "Que a ferramenta está quebrada",
        "Que deve pedir para inventar algo",
      ],
      correct: 0,
      feedback:
        "O Gemini Notebook não inventa: se não está nas fontes, não responde.",
    },
  ],
  "notebook-audio-video-1": [
    {
      q: "O que é um Audio Overview no Gemini Notebook?",
      options: [
        "Um resumo em áudio",
        "Um documento PDF",
        "Uma tabela de dados",
      ],
      correct: 0,
      feedback:
        "Transforma suas fontes em um resumo conversacional para ouvir.",
    },
    {
      q: "Quando o áudio é mais útil?",
      options: [
        "Para ouvir no trajeto",
        "Para editar imagens",
        "Para instalar software",
      ],
      correct: 0,
      feedback: "Ideal para revisão passiva em trânsito.",
    },
    {
      q: "O que fazer antes de gerar o áudio?",
      options: [
        "Curar fontes relevantes",
        "Não carregar nada",
        "Enviar arquivos aleatórios",
      ],
      correct: 0,
      feedback: "A qualidade do áudio depende da curadoria das fontes.",
    },
  ],
  "privacy-video-1": [
    {
      q: "Qual dado NÃO se deve compartilhar com uma IA pública?",
      options: [
        "Dados pessoais sensíveis",
        "Uma pergunta geral e aberta",
        "Um texto público",
      ],
      correct: 0,
      feedback: "Evite expor dados pessoais ou confidenciais.",
    },
    {
      q: "O que significa minimização de dados?",
      options: [
        "Coletar só o necessário",
        "Coletar o máximo possível",
        "Guardar sem limites",
      ],
      correct: 0,
      feedback: "Minimizar = usar apenas os dados estritamente necessários.",
    },
    {
      q: "Quem é responsável por proteger os dados do estudante?",
      options: [
        "Ninguém, nunca",
        "A instituição e o usuário com boas práticas",
        "Só a IA, sem nenhum controle humano ou revisão possível",
      ],
      correct: 1,
      feedback: "A proteção é corresponsabilidade.",
    },
  ],
  "ethics-video-1": [
    {
      q: "O que implica o princípio de transparência?",
      options: [
        "Ocultar que se usa IA",
        "Avisar quando se usa IA",
        "Esconder as decisões da IA",
      ],
      correct: 1,
      feedback: "Transparência é informar claramente o uso de IA.",
    },
    {
      q: "O que significa 'accountability' (responsabilidade)?",
      options: [
        "Que a IA é a única responsável",
        "Que há pessoas que respondem",
        "Que ninguém responde",
      ],
      correct: 1,
      feedback: "Deve haver responsáveis humanos e processos claros.",
    },
    {
      q: "O que busca a explicabilidade?",
      options: [
        "Que sejam justificáveis",
        "Que o sistema nunca falhe",
        "Que seja mais rápido",
      ],
      correct: 0,
      feedback: "Explicabilidade = entender e justificar as decisões.",
    },
  ],
  "claude-video-intro-1": [
    {
      q: "O que é o Claude no dia a dia?",
      options: [
        "Um buscador que só devolve links",
        "Um assistente que escreve e analisa",
        "Um programa que substitui a revisão humana",
      ],
      correct: 1,
      feedback:
        "O Claude cria e analisa a partir das suas instruções; a revisão continua sendo sua.",
    },
    {
      q: "O que mais melhora o resultado de um pedido?",
      options: [
        "Escrever tudo em maiúsculas",
        "Dar contexto e objetivo",
        "Pedir mais rápido",
      ],
      correct: 1,
      feedback:
        "Sem contexto ele precisa adivinhar. Com objetivo, público e formato acerta mais.",
    },
    {
      q: "Quando convém revisar com mais cuidado o que o Claude entrega?",
      options: [
        "Quando é um rascunho de estilo",
        "Quando traz números ou nomes",
        "Nunca precisa revisar",
      ],
      correct: 1,
      feedback:
        "Números, nomes e decisões devem ser sempre conferidos na fonte.",
    },
  ],
  "claude-artifacts-video-1": [
    {
      q: "O que é um Artifact?",
      options: [
        "Uma peça ao lado do chat, para editar",
        "Um arquivo que é apagado ao fechar o chat",
        "Uma senha para compartilhar chats",
      ],
      correct: 0,
      feedback:
        "Um Artifact fica ao lado do chat: você vê, edita e compartilha.",
    },
    {
      q: "Qual é o melhor pedido para um guia de professores?",
      options: [
        "Faça algo para professores.",
        "Guia de 2 páginas para docentes",
        "Faça bonito, longo e bem completo.",
      ],
      correct: 1,
      feedback: "Um pedido completo diz formato, público, tom e limites.",
    },
    {
      q: "O Claude te dá um número. O que você faz antes de compartilhar?",
      options: [
        "Compartilho como está, o Claude calculou",
        "Confiro o dado na fonte original",
        "Mudo para que pareça melhor",
      ],
      correct: 1,
      feedback:
        "Números devem ser conferidos em uma fonte antes de compartilhar.",
    },
  ],
  "claude-video-proyectos-1": [
    {
      q: "Para que serve um Projeto?",
      options: [
        "Para guardar instruções e arquivos do trabalho",
        "Para subir arquivos sem nenhum limite de tamanho",
        "Para substituir a memória do Claude",
      ],
      correct: 0,
      feedback: "Um Projeto reúne o contexto de um trabalho específico.",
    },
    {
      q: "O que revisar antes de conectar uma ferramenta?",
      options: [
        "Só se tem um logo bonito",
        "Que permissões ela pede",
        "Nada: é sempre seguro",
      ],
      correct: 1,
      feedback:
        "Os conectores funcionam com permissões que você aprova. Revise-as antes.",
    },
    {
      q: "O que pode ser uma Skill?",
      options: [
        "Um processo que se repete",
        "Uma senha de backup",
        "Um modelo diferente do Claude",
      ],
      correct: 0,
      feedback:
        "Uma Skill transforma um procedimento repetido em algo reutilizável.",
    },
  ],
  "herramientas-video-1": [
    {
      q: "O que você faz com um número da análise de dados?",
      options: [
        "Uso direto, é um cálculo automático",
        "Recalculo à mão algumas linhas e comparo",
        "Peço outro número até gostar",
      ],
      correct: 1,
      feedback:
        "Recalcular à mão algumas linhas confirma que a análise está correta.",
    },
    {
      q: "Qual pergunta convém fazer antes de ativar uma ferramenta?",
      options: [
        "Quantas ferramentas posso ativar ao mesmo tempo?",
        "Qual é a mais nova do menu?",
        "Como vou verificar o resultado?",
      ],
      correct: 2,
      feedback:
        "Se você não tem como conferir o resultado, repense a ferramenta ou a tarefa.",
    },
    {
      q: "Que dados convém enviar a uma ferramenta?",
      options: [
        "Só o que você mostraria em um documento público",
        "Tudo que der mais contexto",
        "Dados pessoais, para personalizar",
      ],
      correct: 0,
      feedback: "Remova antes os dados pessoais e confidenciais.",
    },
  ],
  "fachada-video-1": [
    {
      q: "Com o que convém começar em um trabalho que se repete?",
      options: [
        "Com um agente que faça sozinho",
        "Com um Projeto com suas instruções e arquivos",
        "Com um GPT, sem checar sua conta",
      ],
      correct: 1,
      feedback:
        "O Projeto guarda instruções e arquivos; além disso, a OpenAI programou a retirada dos GPTs personalizados para 11 de dezembro de 2026 (data sujeita a mudanças).",
    },
    {
      q: "Qual teste verifica que um GPT não repete dados de menores?",
      options: ["Coerência", "Caso normal", "Dado sensível"],
      correct: 2,
      feedback:
        "No teste de dado sensível, o GPT não deve pedir nem repetir dados pessoais ou de menores.",
    },
    {
      q: "Qual é o seu papel quando um agente executa vários passos?",
      options: [
        "Revisar o plano e aprovar as ações importantes",
        "Aprovar o resultado final sem olhar os passos",
        "Deixá-lo sozinho para ganhar tempo",
      ],
      correct: 0,
      feedback:
        "Um erro inicial se propaga a todo o resultado: supervisione o plano e os passos.",
    },
  ],
  "grounding-video-1": [
    {
      q: "O que significa ancorar uma resposta (grounding)?",
      options: [
        "A IA responde mais rápido",
        "A IA apoia o que diz em fontes reais que você pode abrir",
        "A IA guarda suas perguntas",
      ],
      correct: 1,
      feedback:
        "Ancorar é apoiar a resposta em fontes reais que você pode abrir e conferir.",
    },
    {
      q: "Uma resposta traz um número sem fonte. O que você faz?",
      options: [
        "Uso se parecer seguro",
        "Arredondo para parecer exato",
        "Peço a fonte e abro o link antes de usar",
      ],
      correct: 2,
      feedback: "Um número sem fonte não é evidência: peça a fonte e abra.",
    },
    {
      q: "Quantas fontes convém abrir para sustentar as conclusões-chave?",
      options: ["Pelo menos três", "Só uma", "Nenhuma, se parecer seguro"],
      correct: 0,
      feedback:
        "Abra pelo menos três fontes que sustentem as conclusões-chave.",
    },
  ],
  "curaduria-video-1": [
    {
      q: "Qual caderno costuma responder melhor?",
      options: [
        "Um com cinquenta documentos bagunçados",
        "Um com cinco fontes bem escolhidas",
        "Um com fontes de datas misturadas",
      ],
      correct: 1,
      feedback:
        "Poucas fontes bem escolhidas dão melhores respostas que muitas bagunçadas.",
    },
    {
      q: "Qual é uma boa fonte para o seu caderno?",
      options: [
        "Um texto anônimo sem data",
        "Anotações soltas que se contradizem",
        "Um relatório oficial com data e autor",
      ],
      correct: 2,
      feedback: "Uma boa fonte tem autor, data e respaldo verificável.",
    },
    {
      q: "Uma resposta do caderno traz citações. O que você faz?",
      options: [
        "Abro pelo menos uma para conferir o trecho",
        "Ignoro, já são confiáveis",
        "Apago para ficar limpo",
      ],
      correct: 0,
      feedback:
        "Uma resposta com citações ainda precisa do seu critério: abra uma e confirme.",
    },
  ],
};

// Cuestionarios de videos que salieron de un tema (regla 1 video + 1 PDF + 1 OVA); se conservan para reasignarlos.
export const VIDEO_QUIZZES_RESERVA = {
  es: {
    "bias-video-1": [
      {
        q: "¿Qué es el sesgo de muestreo?",
        options: [
          "Los datos no representan a todos",
          "El sistema funciona lento",
          "El modelo cambia de idioma sin aviso sin aviso",
        ],
        correct: 0,
        feedback:
          "Ocurre cuando la muestra de entrenamiento no representa a la población real.",
      },
      {
        q: "¿Por qué importa auditar sesgos?",
        options: [
          "Para que la IA sea más rápida",
          "Para evitar injusticias",
          "Para gastar menos",
        ],
        correct: 1,
        feedback: "Auditar sesgos protege la equidad de las decisiones.",
      },
      {
        q: "¿Cuál es una buena práctica ante un posible sesgo?",
        options: [
          "Ignorarlo si la IA es rápida",
          "Revisar datos con supervisión",
          "Confiar ciegamente en el modelo",
        ],
        correct: 1,
        feedback:
          "Revisar datos y mantener supervisión humana reduce el riesgo de sesgo.",
      },
    ],
  },
  en: {
    "bias-video-1": [
      {
        q: "What is sampling bias?",
        options: [
          "Training data is biased",
          "The system runs slowly",
          "The model changes language",
        ],
        correct: 0,
        feedback:
          "It happens when the training sample doesn't represent the real population.",
      },
      {
        q: "Why audit for bias?",
        options: ["To make AI faster", "To prevent bias", "To spend less"],
        correct: 1,
        feedback: "Auditing bias protects the fairness of decisions.",
      },
      {
        q: "Good practice for a possible bias?",
        options: [
          "Ignore it if AI is fast",
          "Review data and keep oversight",
          "Trust the model blindly, always",
        ],
        correct: 1,
        feedback:
          "Reviewing data and keeping human oversight reduces bias risk.",
      },
    ],
  },
  pt: {
    "bias-video-1": [
      {
        q: "O que é o viés de amostragem?",
        options: [
          "Os dados não são representativos",
          "O sistema fica lento",
          "O modelo muda de idioma sem aviso",
        ],
        correct: 0,
        feedback: "Ocorre quando a amostra não representa a população real.",
      },
      {
        q: "Por que auditar vieses?",
        options: [
          "Para a IA ser mais rápida",
          "Para evitar injustiças",
          "Para gastar menos",
        ],
        correct: 1,
        feedback: "Auditar vieses protege a equidade das decisões.",
      },
      {
        q: "Boa prática diante de um possível viés?",
        options: [
          "Ignorar se a IA for muito rápida",
          "Revisar dados com supervisão",
          "Confiar cegamente no modelo",
        ],
        correct: 1,
        feedback: "Revisar dados e manter supervisão reduz o risco.",
      },
    ],
  },
};

export const VIDEO_QUIZZES = { es: ES, en: EN, pt: PT };

export function getVideoQuiz(videoId, locale = "es") {
  const lang = String(locale || "es").slice(0, 2);
  const pack = VIDEO_QUIZZES[lang] || VIDEO_QUIZZES.es;
  return (
    pack[videoId] ||
    (VIDEO_QUIZZES_RESERVA[lang] || VIDEO_QUIZZES_RESERVA.es)[videoId] ||
    null
  );
}

export default VIDEO_QUIZZES;
