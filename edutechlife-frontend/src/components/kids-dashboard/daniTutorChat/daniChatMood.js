export function getMoodSupportPrompt(mood, userMessage) {
  if (!mood || !["triste", "enojado", "ansioso"].includes(mood.mood) || mood.confidence < 0.7) {
    return null;
  }
  return `\n\n## INSTRUCCI\u00d3N DE APOYO EMOCIONAL\nEl estudiante est\u00e1 mostrando signos de ${mood.mood} en su mensaje: "${userMessage.substring(0, 100)}". Prioriza la VALIDACI\u00d3N EMOCIONAL antes de continuar con contenido acad\u00e9mico. Ofrece estrategias de afrontamiento concretas y un espacio seguro para que el estudiante se exprese.`;
}

export function getCrisisUserMessage(mood) {
  if (!mood || mood.mood !== "CRISIS_ALERT" || mood.confidence < 0.9) {
    return null;
  }
  return `[ALERTA DE CRISIS - RESPUESTA OBLIGATORIA]\nEl estudiante ha expresado pensamientos de crisis. Es CR\u00cdTICO que:\n1. Respondas con apoyo emocional inmediato\n2. Proporciones las siguientes l\u00edneas de ayuda colombianas:\n   \u2022 L\u00ednea 106 \u2014 Atenci\u00f3n en salud mental (24/7)\n   \u2022 L\u00ednea 123 \u2014 Emergencias\n   \u2022 L\u00ednea 141 \u2014 ICBF\n3. NO contin\u00faes con contenido acad\u00e9mico hasta abordar esto\n\nTu prioridad #1 es la seguridad y bienestar del estudiante.`;
}

export function isEmotionalBannerNeeded(mood) {
  return mood && ["triste", "enojado", "ansioso"].includes(mood.mood) && mood.confidence >= 0.7;
}

export function isCrisisAlert(mood) {
  return mood && mood.mood === "CRISIS_ALERT" && mood.confidence >= 0.9;
}

export function recordMoodIfNeeded(mood, userMessage, recordMoodInference) {
  if (mood) {
    recordMoodInference(mood.mood, mood.confidence, userMessage.substring(0, 100));
  }
}
