import { shouldAskForName } from "./nicoTextUtils";

// Función para optimizar conversaciones largas
export const optimizeLongConversation = (messages, maxMessages = 20) => {
  if (messages.length <= maxMessages) {
    return messages;
  }

  // Mantener los primeros mensajes (saludo inicial)
  const firstMessages = messages.slice(0, 3);

  // Mantener los últimos mensajes (conversación reciente)
  const lastMessages = messages.slice(-(maxMessages - 3));

  // Crear mensaje de resumen si hay muchos mensajes en el medio
  const removedCount =
    messages.length - (firstMessages.length + lastMessages.length);
  if (removedCount > 0) {
    const summaryMessage = {
      role: "system",
      content: `[Se omitieron ${removedCount} mensajes anteriores para optimizar la conversación]`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    };

    return [...firstMessages, summaryMessage, ...lastMessages];
  }

  return [...firstMessages, ...lastMessages];
};

// Función para detectar nombre, edad e intereses del mensaje
export const extractUserContext = (message) => {
  const lowerMessage = message.toLowerCase();
  const context = {
    userName: null,
    detectedInterest: null,
    studentAge: null,
    conversationStage: null,
    detectedTopics: [],
    dontWantName: false,
  };

  // Detectar si el usuario NO quiere dar su nombre
  const dontWantPatterns = [
    /no (quiero|prefiero|me gusta|voy a)/i,
    /no te voy a dar/i,
    /no te dare/i,
    /sin nombre/i,
    /anonimo/i,
    /olvida.*nombre/i,
    /no importa.*nombre/i,
    /no es necesario.*nombre/i,
    /no necesito.*nombre/i,
  ];

  for (const pattern of dontWantPatterns) {
    if (pattern.test(message)) {
      context.dontWantName = true;
      break;
    }
  }

  // Si no quiere dar nombre, no intentar extraer
  if (context.dontWantName) {
    return context;
  }

  // Extraer nombre - patrones más completos
  const namePatterns = [
    // Patterns explícitos comunes
    /me llamo\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i,
    /mi nombre es\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i,
    /soy\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i,
    /(?:llámame|dime|me dicen)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)/i,
    // Nombres simples (respuestas directas) - más flexible
    /^([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)$/i,
    // Con preposiciones
    /([a-záéíóúñ]+)\s+(?:es mi nombre|me dicen|me llama|me llaman)/i,
    // Nombres con artículos o posesivos
    /(?:el|la)\s+([a-záéíóúñ]+)(?:\s+es|$)/i,
    // Nombres compuestos comunes
    /(?:soy |me llamo )?([a-záéíóúñ]+\s+[a-záéíóúñ]+)(?:\s+es|\s+soy|$)/i,
  ];

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1] && match[1].length > 1) {
      context.userName =
        match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      break;
    }
  }

  // Extraer edad
  const agePatterns = [
    /tengo\s+(\d+)\s*años/i,
    /de\s+(\d+)\s*años/i,
    /(\d+)\s*años\s*(?:de|tengo|para)/i,
    /para\s+(?:un|una)\s+niñ[oa]\s+de\s+(\d+)/i,
  ];

  for (const pattern of agePatterns) {
    const match = message.match(pattern);
    if (match) {
      context.studentAge = parseInt(match[1]);
      break;
    }
  }

  // Detectar intereses
  const interestPatterns = [
    {
      pattern: /vak|estilo.*aprendizaje|visual|auditivo|kinestésico/i,
      interest: "VAK",
    },
    {
      pattern:
        /stem|robótica|robotica|programación|scratch|python|lego|arduino/i,
      interest: "STEM",
    },
    {
      pattern: /tutoría|tutoria|clases.*matemáticas|clases.*ciencias|profesor/i,
      interest: "Tutoría",
    },
    {
      pattern: /bienestar|psicología|psicologia|ansiedad|estrés|emocional/i,
      interest: "Bienestar",
    },
    { pattern: /inglés|ingles|english|idioma/i, interest: "Inglés" },
  ];

  for (const { pattern, interest } of interestPatterns) {
    if (pattern.test(lowerMessage)) {
      context.detectedInterest = interest;
      break;
    }
  }

  return context;
};

// Base de conocimientos simplificada para Nico
export const getQuickResponse = (userMessage, userContext = {}) => {
  const lowerMessage = userMessage.toLowerCase().trim();
  const { userName, messagesSinceStart = 0 } = userContext;

  // Pedir nombre después de 2 mensajes si no se tiene
  if (shouldAskForName(userContext)) {
    return "¿Para personalizar mi ayuda, cómo te llamas?";
  }

  // Saludos
  if (
    lowerMessage.includes("hola") ||
    lowerMessage.includes("buenas") ||
    lowerMessage === "hi"
  ) {
    return "¿En qué puedo ayudarte? Puedo informarte sobre VAK, STEM, tutorías y más.";
  }

  // Qué es VAK
  if (
    (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) &&
    (lowerMessage.includes("vak") || lowerMessage.includes("estilo"))
  ) {
    return "VAK son los estilos de aprendizaje: Visual, Auditivo y Kinestésico. Identificamos el tuyo con un diagnóstico gratuito.";
  }

  // Qué es STEM
  if (
    (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) &&
    (lowerMessage.includes("stem") || lowerMessage.includes("steam"))
  ) {
    return "STEM es ciencia, tecnología, ingeniería y matemáticas. Desarrollamos habilidades del futuro con proyectos de robótica y programación.";
  }

  // Tutorías
  if (
    lowerMessage.includes("tutoría") ||
    lowerMessage.includes("tutoria") ||
    lowerMessage.includes("clases") ||
    lowerMessage.includes("profesor")
  ) {
    return "Ofrecemos tutorías en Matemáticas, Ciencias, Inglés y técnicas de estudio. ¿Qué materia necesitas?";
  }

  // Precios
  if (
    lowerMessage.includes("precio") ||
    lowerMessage.includes("cuesta") ||
    lowerMessage.includes("cuanto") ||
    lowerMessage.includes("costo")
  ) {
    return "Tenemos planes según tus necesidades. La primera clase es gratuita para que conozcas nuestro método.";
  }

  // Primera clase gratis
  if (
    lowerMessage.includes("primera") ||
    lowerMessage.includes("gratis") ||
    lowerMessage.includes("gratuita") ||
    lowerMessage.includes("prueba") ||
    lowerMessage.includes("demo")
  ) {
    return "La primera clase es gratuita y sin compromiso. Dura 30-45 minutos. ¿Te gustaría agendar?";
  }

  // Modalidades
  if (
    lowerMessage.includes("online") ||
    lowerMessage.includes("virtual") ||
    lowerMessage.includes("presencial") ||
    lowerMessage.includes("híbrido")
  ) {
    return "Tenemos modalidad presencial en Bogotá, online por videollamada e híbrida. ¿Cuál prefieres?";
  }

  // Programación/Robótica
  if (
    lowerMessage.includes("programación") ||
    lowerMessage.includes("robotica") ||
    lowerMessage.includes("robótica") ||
    lowerMessage.includes("scratch") ||
    lowerMessage.includes("python") ||
    lowerMessage.includes("lego")
  ) {
    return "Ofrecemos robótica con LEGO y Arduino, programación con Scratch, Python y JavaScript. ¿Qué edad tiene el estudiante?";
  }

  // Inglés
  if (
    lowerMessage.includes("inglés") ||
    lowerMessage.includes("ingles") ||
    lowerMessage.includes("english")
  ) {
    return "Clases de inglés para todos los niveles: básico, intermedio, avanzado y preparación para exámenes. ¿Cuál es tu nivel?";
  }

  // Contacto/WhatsApp
  if (
    lowerMessage.includes("whatsapp") ||
    lowerMessage.includes("contacto") ||
    lowerMessage.includes("teléfono") ||
    lowerMessage.includes("escribir")
  ) {
    return "Puedes escribirnos al WhatsApp: +57 300 123 4567 o al email: info@edutechlife.com";
  }

  // Inscripción
  if (
    lowerMessage.includes("inscribir") ||
    lowerMessage.includes("empezar") ||
    lowerMessage.includes("iniciar") ||
    lowerMessage.includes("cómo comenzar")
  ) {
    return "Para comenzar, agendamos tu primera clase gratuita. En esa sesión conocernos tus necesidades. ¿Te gustaría agendar?";
  }

  // Acerca de EdutechLife
  if (
    lowerMessage.includes("quién eres") ||
    lowerMessage.includes("que es edutechlife") ||
    lowerMessage.includes("qué hacen")
  ) {
    return "Somos EdutechLife, una plataforma de educación que ofrece diagnóstico de aprendizaje, programas STEM y tutorías personalizadas.";
  }

  // Gratitud
  if (lowerMessage.includes("gracias") || lowerMessage.includes("thank")) {
    return "De nada. ¿Hay algo más en lo que pueda ayudarte?";
  }

  // Despedida
  if (
    lowerMessage.includes("adiós") ||
    lowerMessage.includes("chao") ||
    lowerMessage.includes("bye")
  ) {
    return "Fue un gusto ayudarte. Puedes contactarnos cuando quieras. ¡Hasta pronto!";
  }

  // Si no hay respuesta rápida, retorna null para que la IA responda
  return null;
};

// Función para generar sugerencias de preguntas basadas en el contexto
export const getQuestionSuggestions = (messages, userContext = {}) => {
  const suggestions = [];
  const { conversationStage, detectedTopics = [], studentAge } = userContext;

  // Obtener los temas ya mencionados en la conversación
  const lastMessages = messages
    .slice(-6)
    .map((m) => m.content.toLowerCase())
    .join(" ");
  const mentionedTopics = [];

  if (lastMessages.includes("vak") || lastMessages.includes("estilo"))
    mentionedTopics.push("VAK");
  if (
    lastMessages.includes("stem") ||
    lastMessages.includes("robótica") ||
    lastMessages.includes("programación")
  )
    mentionedTopics.push("STEM");
  if (
    lastMessages.includes("tutoría") ||
    lastMessages.includes("clase") ||
    lastMessages.includes("matemática")
  )
    mentionedTopics.push("Tutoría");
  if (
    lastMessages.includes("precio") ||
    lastMessages.includes("cuesta") ||
    lastMessages.includes("plan")
  )
    mentionedTopics.push("Precios");
  if (lastMessages.includes("bienestar") || lastMessages.includes("psicología"))
    mentionedTopics.push("Bienestar");
  if (lastMessages.includes("inglés") || lastMessages.includes("ingles"))
    mentionedTopics.push("Inglés");

  // Etapa 1: Inicio - Sin contexto previo
  if (mentionedTopics.length === 0 || conversationStage === "inicio") {
    return [
      "¿Qué servicios ofrecen?",
      "¿Qué es el diagnóstico VAK?",
      "¿Tienen clases de programación?",
      "¿Cuál es el costo de las tutorías?",
    ];
  }

  // Etapa 2: Descubrimiento - Usuario mostró interés en un tema
  if (mentionedTopics.includes("VAK")) {
    suggestions.push(
      "¿Cómo se hace el test VAK?",
      "¿Cuánto tiempo dura el diagnóstico?",
      "¿Es gratuito?",
      "¿Qué incluye el resultado?",
    );
  } else if (mentionedTopics.includes("STEM")) {
    suggestions.push(
      "¿Para qué edad son los programas?",
      "¿Qué proyectos prácticos hacen?",
      "¿Necesito conocimientos previos?",
      "¿Tienen robots LEGO o Arduino?",
    );
  } else if (mentionedTopics.includes("Tutoría")) {
    suggestions.push(
      "¿Qué materias ofrecen?",
      "¿Son clases individuales?",
      "¿Cómo son los tutores?",
      "¿Puedo tomar una clase de prueba?",
    );
  } else if (mentionedTopics.includes("Precios")) {
    suggestions.push(
      "¿Qué planes tienen disponibles?",
      "¿Hay descuentos por pago anticipado?",
      "¿Ofrecen becas?",
      "¿Cómo funciona la primera clase gratuita?",
    );
  } else if (mentionedTopics.includes("Inglés")) {
    suggestions.push(
      "¿Qué nivel de inglés ofrecen?",
      "¿Preparan para exámenes internacionales?",
      "¿Tienen clases de conversación?",
      "¿Cuántas clases por mes incluyen?",
    );
  } else {
    //Sugerencias generales basadas en etapa
    suggestions.push(
      "¿Cómo me inscribo?",
      "¿Tienen modalidad online?",
      "¿Qué horarios tienen disponibles?",
      "¿Primera clase es gratis?",
    );
  }

  return suggestions.slice(0, 4);
};

// Función para generar opciones de conversación después de 3 intercambios
export const getConversationOptions = (messages, userContext = {}) => {
  const userMessages = messages.filter((msg) => msg.role === "user").length;
  const { conversationStage, detectedInterest, studentAge } = userContext;

  // Solo mostrar opciones después de 2 preguntas del usuario
  if (userMessages < 2) {
    return null;
  }

  // Analizar el contexto de la conversación
  const lastMessages = messages
    .slice(-6)
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  // Determinar etapa y tema
  let currentStage = "descubrimiento";
  let currentTopic = null;

  // Detectar etapa basada en palabras clave
  if (
    lastMessages.includes("inscribir") ||
    lastMessages.includes("agendar") ||
    lastMessages.includes("cómo empezar")
  ) {
    currentStage = "accion";
  } else if (
    lastMessages.includes("precio") ||
    lastMessages.includes("cuesta") ||
    lastMessages.includes("valor") ||
    lastMessages.includes("plan")
  ) {
    currentStage = "informacion";
    currentTopic = "Precios";
  } else if (
    lastMessages.includes("vak") ||
    lastMessages.includes("stem") ||
    lastMessages.includes("tutoría")
  ) {
    currentStage = "interes";
    if (lastMessages.includes("vak")) currentTopic = "VAK";
    else if (lastMessages.includes("stem")) currentTopic = "STEM";
    else if (lastMessages.includes("tutoría")) currentTopic = "Tutoría";
  }

  const options = [];

  // Opciones según etapa y tema
  if (currentStage === "descubrimiento" || currentTopic === null) {
    options.push(
      { text: "Conocer diagnóstico VAK", action: "learn_vak" },
      { text: "Ver cursos STEM", action: "explore_stem" },
      { text: "Información de tutorías", action: "info_tutoring" },
    );
  } else if (currentTopic === "VAK") {
    options.push(
      { text: "Agendar diagnóstico VAK", action: "schedule_vak" },
      { text: "Más sobre estilos de aprendizaje", action: "more_vak" },
      { text: "Ver otros servicios", action: "other_services" },
    );
  } else if (currentTopic === "STEM") {
    options.push(
      { text: "Ver proyectos de robótica", action: "view_robotics" },
      { text: "Cursos de programación", action: "view_programming" },
      { text: "Agendar clase demo", action: "demo_stem" },
    );
  } else if (currentTopic === "Tutoría") {
    options.push(
      { text: "Ver materias disponibles", action: "view_subjects" },
      { text: "Agendar tutoría de prueba", action: "trial_tutoring" },
      { text: "Conocer tutores", action: "meet_tutors" },
    );
  } else if (currentStage === "informacion" || currentTopic === "Precios") {
    options.push(
      { text: "Ver planes y precios", action: "view_pricing" },
      { text: "Información de becas", action: "info_scholarships" },
      { text: "Descuentos disponibles", action: "view_discounts" },
    );
  } else if (currentStage === "accion") {
    options.push(
      { text: "Agendar llamada ahora", action: "schedule_call" },
      { text: "Contactar por WhatsApp", action: "contact_whatsapp" },
      { text: "Solicitar más información", action: "request_info" },
    );
  }

  return options.slice(0, 3);
};

// Función para obtener saludo según hora del día
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Buenos días";
  } else if (hour >= 12 && hour < 19) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
};
