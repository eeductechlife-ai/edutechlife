export function createUserMessage(content) {
  return {
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  };
}

export function createAssistantMessage(content, extraProps = {}) {
  return {
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    ...extraProps,
  };
}

export function createStreamingPlaceholder() {
  return {
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString(),
    isStreaming: true,
  };
}

export function buildErrorContent(isTimeout) {
  return isTimeout
    ? `El servicio esta tardando mucho en responder. \u00bfQuieres preguntarme por el ADN de Aprendizaje, IALab (curso de IA) o IngenIA?`
    : `Hubo un problema de conexion. Puedo contarte sobre el ADN de Aprendizaje, IALab o IngenIA. \u00bfTe interesa alguno?`;
}
