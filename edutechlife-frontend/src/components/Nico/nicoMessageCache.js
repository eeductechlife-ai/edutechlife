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
    ? `El servicio esta tardando mucho en responder. \u00bfQuieres preguntarme por nuestros servicios educativos como VAK, STEM, tutor\u00edas o bienestar?`
    : `Hubo un problema de conexion. Puedo contarte sobre VAK, STEM, tutor\u00edas y bienestar. \u00bfTe interesa alguno?`;
}
