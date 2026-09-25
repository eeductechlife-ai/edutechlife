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

  // Detectar intereses alineados con lo que SÍ hace EdutechLife
  // (pedagogía + IA). No manejamos programación, robótica ni clases privadas.
  const interestPatterns = [
    {
      pattern:
        /vak|estilo.*aprendizaje|visual|auditivo|kinest[eé]sico|adn de aprendizaje|diagn[oó]stico/i,
      interest: "VAK",
    },
    {
      pattern:
        /ialab|curso.*(ia|inteligencia artificial)|prompt|chatgpt|gpt|gemini|notebooklm|herramientas? de ia|max\b/i,
      interest: "IALab",
    },
    {
      pattern:
        /ingenia|smartboard|ni[ñn]os?|j[oó]venes|colegio|acompa[ñn]amiento|tutor dani|dan[ie]/i,
      interest: "IngenIA",
    },
    {
      pattern:
        /empresa|instituc|automatizaci[oó]n|agentes?|consultor[ií]a|b2b|docentes|profesores/i,
      interest: "IA Empresarial",
    },
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

  // Recordar/consultar el nombre (antes de pedirlo, para no responder "¿cómo
  // te llamas?" cuando el usuario justamente pregunta cómo se llama).
  if (
    /c[oó]mo me llamo|cu[aá]l es mi nombre|sabes mi nombre|recuerdas mi nombre|te acuerdas de mi nombre/i.test(
      lowerMessage,
    )
  ) {
    return userContext.userName
      ? `Te llamas ${userContext.userName}. ¿En qué más te puedo ayudar?`
      : "Todavía no me has dicho tu nombre. ¿Cómo te llamas?";
  }

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
    return "¡Hola! Qué gusto saludarte. Cuéntame, ¿en qué te puedo ayudar hoy?";
  }

  // Qué es VAK
  if (
    (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) &&
    (lowerMessage.includes("vak") || lowerMessage.includes("estilo"))
  ) {
    return "VAK son los estilos de aprendizaje: Visual, Auditivo y Kinestésico. Identificamos el tuyo con un diagnóstico gratuito.";
  }

  // Qué es EdutechLife / su método
  if (
    (lowerMessage.includes("qué es") || lowerMessage.includes("que es")) &&
    (lowerMessage.includes("stem") ||
      lowerMessage.includes("steam") ||
      lowerMessage.includes("metodolog") ||
      lowerMessage.includes("método") ||
      lowerMessage.includes("metodo"))
  ) {
    return "Nuestro método une pedagogía e inteligencia artificial: el ADN de Aprendizaje personaliza cada ruta y la IA acompaña el proceso (coach MAX en IALab, tutor Dani en IngenIA). No enseñamos programación ni robótica.";
  }

  // Acompañamiento (no damos clases particulares por materia)
  if (
    lowerMessage.includes("tutoría") ||
    lowerMessage.includes("tutoria") ||
    lowerMessage.includes("clases") ||
    lowerMessage.includes("profesor") ||
    lowerMessage.includes("acompañamiento") ||
    lowerMessage.includes("refuerzo")
  ) {
    return "No damos clases particulares por materia. Acompañamos el aprendizaje con pedagogía e IA: ADN de Aprendizaje, el coach MAX en IALab y el tutor Dani en IngenIA. ¿Es para ti, para un niño o para una institución?";
  }

  // Precios
  if (
    lowerMessage.includes("precio") ||
    lowerMessage.includes("cuesta") ||
    lowerMessage.includes("cuanto") ||
    lowerMessage.includes("costo")
  ) {
    return "Tenemos planes que se ajustan a lo que necesitas y la primera clase es gratis para que conozcas nuestro método. ¿Quieres que te ayude a elegir el ideal?";
  }

  // Primera clase gratis
  if (
    lowerMessage.includes("primera") ||
    lowerMessage.includes("gratis") ||
    lowerMessage.includes("gratuita") ||
    lowerMessage.includes("prueba") ||
    lowerMessage.includes("demo")
  ) {
    return "¡Claro que sí! La primera clase es gratis y sin compromiso, dura 30-45 minutos. ¿Te gustaría agendarla?";
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

  // Programación/Robótica → aclarar que NO lo hacemos
  if (
    lowerMessage.includes("programación") ||
    lowerMessage.includes("programacion") ||
    lowerMessage.includes("robotica") ||
    lowerMessage.includes("robótica") ||
    lowerMessage.includes("scratch") ||
    lowerMessage.includes("python") ||
    lowerMessage.includes("lego")
  ) {
    return "No enseñamos programación ni robótica. En EdutechLife aplicamos pedagogía e IA para mejorar el aprendizaje: en IALab aprender a usar herramientas como ChatGPT, Gemini y NotebookLM. ¿Quieres que te cuente?";
  }

  // Contacto/WhatsApp
  if (
    lowerMessage.includes("whatsapp") ||
    lowerMessage.includes("contacto") ||
    lowerMessage.includes("teléfono") ||
    lowerMessage.includes("escribir")
  ) {
    return "Puedes escribirnos al WhatsApp: +57 323 836 5517 o al email: info@edutechlife.com";
  }

  // Inscripción
  if (
    lowerMessage.includes("inscribir") ||
    lowerMessage.includes("empezar") ||
    lowerMessage.includes("iniciar") ||
    lowerMessage.includes("cómo comenzar")
  ) {
    return "Con gusto te acompaño. Empezamos con tu primera clase gratis y, según lo que necesites, te recomendamos el plan ideal. ¿Te la agendo?";
  }

  // Acerca de EdutechLife
  if (
    lowerMessage.includes("quién eres") ||
    lowerMessage.includes("que es edutechlife") ||
    lowerMessage.includes("qué hacen")
  ) {
    return "Somos EdutechLife: aplicamos pedagogía e inteligencia artificial para mejorar el proceso educativo. Tenemos IALab (curso de IA), IngenIA (acompañamiento con IA para niños y jóvenes), el ADN de Aprendizaje (diagnóstico VAK gratuito) e IA para empresas.";
  }

  // Gratitud
  if (lowerMessage.includes("gracias") || lowerMessage.includes("thank")) {
    return "¡Con mucho gusto! Si necesitas algo más, aquí estoy para ayudarte.";
  }

  // Despedida
  if (
    lowerMessage.includes("adiós") ||
    lowerMessage.includes("chao") ||
    lowerMessage.includes("bye")
  ) {
    return "¡Gracias por escribirnos! Cuando quieras seguimos aquí. ¡Que tengas un lindo día!";
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

  if (
    lastMessages.includes("vak") ||
    lastMessages.includes("estilo") ||
    lastMessages.includes("adn") ||
    lastMessages.includes("aprendizaje")
  )
    mentionedTopics.push("VAK");
  if (
    lastMessages.includes("ialab") ||
    lastMessages.includes("inteligencia artificial") ||
    lastMessages.includes("chatgpt") ||
    lastMessages.includes("gemini") ||
    lastMessages.includes("notebooklm") ||
    lastMessages.includes("prompt") ||
    lastMessages.includes("max")
  )
    mentionedTopics.push("IALab");
  if (
    lastMessages.includes("ingenia") ||
    lastMessages.includes("smartboard") ||
    lastMessages.includes("niño") ||
    lastMessages.includes("niños") ||
    lastMessages.includes("joven") ||
    lastMessages.includes("colegio") ||
    lastMessages.includes("dani")
  )
    mentionedTopics.push("IngenIA");
  if (
    lastMessages.includes("precio") ||
    lastMessages.includes("cuesta") ||
    lastMessages.includes("costo") ||
    lastMessages.includes("plan")
  )
    mentionedTopics.push("Precios");

  // Etapa 1: Inicio - Sin contexto previo
  if (mentionedTopics.length === 0 || conversationStage === "inicio") {
    return [
      "¿Qué hace EdutechLife?",
      "¿Qué es el ADN de Aprendizaje?",
      "¿Qué es IALab?",
      "¿Cómo usan la IA para enseñar?",
    ];
  }

  // Etapa 2: Descubrimiento - Usuario mostró interés en un tema
  if (mentionedTopics.includes("VAK")) {
    suggestions.push(
      "¿Cómo se hace el ADN de Aprendizaje?",
      "¿Cuánto tiempo dura el diagnóstico?",
      "¿Es gratuito?",
      "¿Qué incluye el resultado?",
    );
  } else if (mentionedTopics.includes("IALab")) {
    suggestions.push(
      "¿Qué módulos tiene IALab?",
      "¿Para qué edad es?",
      "¿Necesito experiencia previa?",
      "¿Incluye certificado?",
    );
  } else if (mentionedTopics.includes("IngenIA")) {
    suggestions.push(
      "¿Para qué edades es IngenIA?",
      "¿Cómo acompaña la IA al estudiante?",
      "¿Los padres reciben reportes?",
      "¿Hay prueba gratis?",
    );
  } else if (mentionedTopics.includes("Precios")) {
    suggestions.push(
      "¿Qué planes tienen disponibles?",
      "¿Ofrecen becas?",
      "¿Cómo funciona la primera clase gratuita?",
      "¿En qué moneda están los precios?",
    );
  } else {
    // Sugerencias generales basadas en etapa
    suggestions.push(
      "¿Cómo me inscribo?",
      "¿Tienen modalidad online?",
      "¿Cómo funciona el acompañamiento?",
      "¿La primera clase es gratis?",
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
    lastMessages.includes("ialab") ||
    lastMessages.includes("inteligencia artificial") ||
    lastMessages.includes("ingenia") ||
    lastMessages.includes("niño") ||
    lastMessages.includes("colegio")
  ) {
    currentStage = "interes";
    if (lastMessages.includes("vak")) currentTopic = "VAK";
    else if (
      lastMessages.includes("ingenia") ||
      lastMessages.includes("niño") ||
      lastMessages.includes("colegio")
    )
      currentTopic = "IngenIA";
    else currentTopic = "IALab";
  }

  const options = [];

  // Opciones según etapa y tema
  if (currentStage === "descubrimiento" || currentTopic === null) {
    options.push(
      { text: "Conocer el ADN de Aprendizaje", action: "learn_vak" },
      { text: "Ver IALab (curso de IA)", action: "explore_ialab" },
      { text: "Conocer IngenIA", action: "explore_ingenia" },
    );
  } else if (currentTopic === "VAK") {
    options.push(
      { text: "Agendar ADN de Aprendizaje", action: "schedule_vak" },
      { text: "Más sobre estilos de aprendizaje", action: "more_vak" },
      { text: "Ver otros servicios", action: "other_services" },
    );
  } else if (currentTopic === "IALab") {
    options.push(
      { text: "Ver módulos de IALab", action: "view_ialab" },
      { text: "Conocer a MAX (coach IA)", action: "meet_max" },
      { text: "Agendar clase demo", action: "demo_ialab" },
    );
  } else if (currentTopic === "IngenIA") {
    options.push(
      { text: "Conocer IngenIA para niños", action: "view_ingenia" },
      { text: "Cómo acompaña la IA", action: "how_ai_helps" },
      { text: "Agendar clase demo", action: "demo_ingenia" },
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

// Contexto de la página actual para que Nico ayude acorde a lo que el usuario
// está viendo en edutechlife.co. Devuelve un sintagma nominal en español que
// se incrusta en el system prompt; fallback genérico para rutas desconocidas.
export const getPageContext = (pathname = "") => {
  const p = String(pathname).toLowerCase();
  if (p === "/" || p === "")
    return "la página principal de edutechlife.co (inicio)";
  if (p.startsWith("/ialab-academic")) return "la página de IALab Academic";
  if (p.startsWith("/ialab-pro")) return "la página de IALab Pro";
  if (p.startsWith("/ialab"))
    return "el dashboard o landing de IALab (aprender con IA)";
  if (p.startsWith("/ingenia"))
    return "la plataforma IngenIA (niños y colegios)";
  if (p.startsWith("/vak"))
    return "la página del test VAK y ADN de Aprendizaje";
  if (p.startsWith("/sign-up"))
    return "el formulario de registro de una cuenta";
  if (p.startsWith("/login")) return "la página de inicio de sesión";
  if (p.startsWith("/auth")) return "un flujo de autenticación";
  if (
    p.startsWith("/precios") ||
    p.startsWith("/planes") ||
    p.includes("price")
  )
    return "la página de planes y precios";
  if (
    p.startsWith("/contact") ||
    p.startsWith("/nosotros") ||
    p.startsWith("/about")
  )
    return "la página de contacto / sobre nosotros";
  if (p.startsWith("/blog")) return "el blog de Edutechlife";
  return `la página "${pathname || "/"}" del sitio edutechlife.co`;
};
