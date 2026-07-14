export function analyzeSuccessfulConversations() {
  const successfulConversations = this.metrics.conversationHistory.filter(
    (conv) => conv.leadCaptured || conv.appointmentScheduled,
  );

  if (successfulConversations.length === 0) {
    return {
      patterns: [],
      avgMessagesToLead: 0,
      avgMessagesToAppointment: 0,
    };
  }

  const patterns = {
    greetingStyles: {},
    questionTypes: {},
    responseTimes: [],
    messageLengths: [],
  };

  successfulConversations.forEach((conv) => {
    const firstMessage = conv.messages[0]?.content?.toLowerCase() || "";
    if (firstMessage.includes("buenos días"))
      patterns.greetingStyles.morning =
        (patterns.greetingStyles.morning || 0) + 1;
    if (firstMessage.includes("buenas tardes"))
      patterns.greetingStyles.afternoon =
        (patterns.greetingStyles.afternoon || 0) + 1;
    if (firstMessage.includes("buenas noches"))
      patterns.greetingStyles.evening =
        (patterns.greetingStyles.evening || 0) + 1;
    if (firstMessage.includes("hola"))
      patterns.greetingStyles.hola = (patterns.greetingStyles.hola || 0) + 1;

    conv.messages.forEach((msg) => {
      if (msg.role === "user") {
        const content = msg.content.toLowerCase();
        if (content.includes("precio") || content.includes("costo"))
          patterns.questionTypes.price =
            (patterns.questionTypes.price || 0) + 1;
        if (content.includes("horario") || content.includes("horas"))
          patterns.questionTypes.schedule =
            (patterns.questionTypes.schedule || 0) + 1;
        if (content.includes("programa") || content.includes("curso"))
          patterns.questionTypes.program =
            (patterns.questionTypes.program || 0) + 1;
        if (content.includes("edad") || content.includes("años"))
          patterns.questionTypes.age = (patterns.questionTypes.age || 0) + 1;
      }
    });

    let totalResponseTime = 0;
    let responseCount = 0;

    for (let i = 1; i < conv.messages.length; i++) {
      if (
        conv.messages[i].role === "assistant" &&
        conv.messages[i - 1].role === "user"
      ) {
        const responseTime =
          new Date(conv.messages[i].timestamp) -
          new Date(conv.messages[i - 1].timestamp);
        if (responseTime > 0) {
          patterns.responseTimes.push(responseTime);
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
    }

    conv.messages.forEach((msg) => {
      patterns.messageLengths.push(msg.content.length);
    });
  });

  const avgMessagesToLead =
    successfulConversations
      .filter((conv) => conv.leadCaptured)
      .reduce((sum, conv) => sum + conv.messageCount, 0) /
    Math.max(
      successfulConversations.filter((conv) => conv.leadCaptured).length,
      1,
    );

  const avgMessagesToAppointment =
    successfulConversations
      .filter((conv) => conv.appointmentScheduled)
      .reduce((sum, conv) => sum + conv.messageCount, 0) /
    Math.max(
      successfulConversations.filter((conv) => conv.appointmentScheduled)
        .length,
      1,
    );

  return {
    patterns,
    avgMessagesToLead: Math.round(avgMessagesToLead),
    avgMessagesToAppointment: Math.round(avgMessagesToAppointment),
    sampleSize: successfulConversations.length,
  };
}

export function getOptimizationSuggestions() {
  const suggestions = [];
  const metrics = this.getMetrics("week");
  const patterns = this.analyzeSuccessfulConversations();

  if (metrics.leads.conversionRate < 0.3) {
    suggestions.push({
      title: "Mejorar tasa de conversión de leads",
      description:
        "La tasa de conversión actual es baja. Considera ajustar el momento de solicitar información o mejorar las preguntas de calificación.",
      priority: "high",
      expectedImpact: "+15-25% conversión",
      confidence: 0.8,
      action: "Ajustar umbral de captura de leads en useLeadCaptureLogic",
    });
  }

  if (patterns.avgMessagesToLead > 8) {
    suggestions.push({
      title: "Reducir tiempo para captura de leads",
      description: `Actualmente se requieren ${patterns.avgMessagesToLead} mensajes en promedio para capturar un lead. Considera ser más directo después de identificar interés.`,
      priority: "medium",
      expectedImpact: "-30% tiempo de conversación",
      confidence: 0.7,
      action: "Reducir minMessagesBeforeAsk en useLeadCaptureLogic",
    });
  }

  const totalGreetings = Object.values(
    patterns.patterns?.greetingStyles || {},
  ).reduce((a, b) => a + b, 0);
  if (totalGreetings > 0) {
    const mostEffectiveGreeting = Object.entries(
      patterns.patterns?.greetingStyles || {},
    ).sort((a, b) => b[1] - a[1])[0];

    if (mostEffectiveGreeting) {
      suggestions.push({
        title: "Optimizar saludo inicial",
        description: `El saludo "${mostEffectiveGreeting[0]}" tiene la mayor tasa de éxito. Considera enfatizar este estilo en el prompt.`,
        priority: "low",
        expectedImpact: "+5-10% engagement inicial",
        confidence: 0.6,
        action: "Ajustar getGreeting() en NicoModern.jsx",
      });
    }
  }

  if (metrics.appointments.conversionRate < 0.2) {
    suggestions.push({
      title: "Mejorar conversión de leads a citas",
      description:
        "Solo el 20% de los leads se convierten en citas. Considera mejorar el momento de ofrecer agendamiento o el mensaje de valor.",
      priority: "high",
      expectedImpact: "+20-30% citas agendadas",
      confidence: 0.75,
      action: "Optimizar flujo de agendamiento en AppointmentScheduler",
    });
  }

  if (
    patterns.patterns?.responseTimes &&
    patterns.patterns.responseTimes.length > 0
  ) {
    const avgResponseTime =
      patterns.patterns.responseTimes.reduce((a, b) => a + b, 0) /
      patterns.patterns.responseTimes.length;
    if (avgResponseTime > 5000) {
      suggestions.push({
        title: "Optimizar tiempo de respuesta",
        description: `El tiempo promedio de respuesta es ${Math.round(avgResponseTime / 1000)}s. Considera implementar caché más agresivo o respuestas predefinidas.`,
        priority: "medium",
        expectedImpact: "-40% tiempo de espera",
        confidence: 0.65,
        action: "Mejorar sistema de caché en NicoModern.jsx",
      });
    }
  }

  if (metrics.appointments.completionRate < 0.7) {
    suggestions.push({
      title: "Mejorar tasa de asistencia a citas",
      description:
        "Solo el 70% de las citas agendadas se completan. Considera mejorar el sistema de recordatorios o confirmación previa.",
      priority: "medium",
      expectedImpact: "+15-20% asistencia",
      confidence: 0.7,
      action: "Mejorar sistema de recordatorios en notifications.js",
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export async function runOptimization() {
  const suggestions = this.getOptimizationSuggestions();
  const highPrioritySuggestions = suggestions.filter(
    (s) => s.priority === "high",
  );

  if (highPrioritySuggestions.length === 0) {
    return {
      success: false,
      message: "No hay sugerencias de alta prioridad para optimizar",
      suggestions: suggestions.length,
    };
  }

  this.metrics.optimizations = this.metrics.optimizations || [];
  this.metrics.optimizations.push({
    timestamp: new Date().toISOString(),
    suggestionsApplied: highPrioritySuggestions.map((s) => s.title),
    totalSuggestions: suggestions.length,
  });

  this.saveMetrics();

  return {
    success: true,
    message: `Se identificaron ${highPrioritySuggestions.length} optimizaciones de alta prioridad`,
    suggestions: highPrioritySuggestions.map((s) => ({
      title: s.title,
      action: s.action,
      expectedImpact: s.expectedImpact,
    })),
    totalSuggestions: suggestions.length,
  };
}
