/**
 * AISafetyGateway — safety pipeline for all Dani AI interactions.
 *
 * Pipeline stages:
 *   1. Input validation (length, type)
 *   2. Content moderation (forbidden patterns for children)
 *   3. Age/context policy (grade-appropriate guardrails)
 *   4. Output validation (strip PII leakage, check length)
 */

const MAX_INPUT_CHARS = 2000;
const MAX_OUTPUT_CHARS = 4000;

// Patterns that should never appear in children's educational chat
const FORBIDDEN_INPUT_PATTERNS = [
  /\b(contraseña|password|clave|token|api[_\s]?key)\s*[:=]/i,
  /\b(dirección|dirección exacta|número de casa|número de teléfono)\b/i,
  /\b(pornografía|porno|desnudo|sexual explícito)\b/i,
  /\b(drogas|cocaína|marihuana|heroína)\b/i,
];

const FORBIDDEN_OUTPUT_PATTERNS = [
  /\b(http[s]?:\/\/(?!edutechlife)[^\s]+)\b/g, // external URLs (allow edutechlife)
  /\b\d{10,}\b/g, // long numbers (phone, card)
];

/**
 * Validate and sanitize user input.
 * @returns {{ ok: boolean, reason?: string, sanitized: string }}
 */
function validateInput(text, { studentAge = 10 } = {}) {
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, reason: "empty_input", sanitized: "" };
  }

  const trimmed = text.trim().slice(0, MAX_INPUT_CHARS);

  for (const pattern of FORBIDDEN_INPUT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { ok: false, reason: "forbidden_content", sanitized: "" };
    }
  }

  return { ok: true, sanitized: trimmed };
}

/**
 * Apply age/grade-level content policy.
 * Returns additional system prompt instructions based on student age.
 * @returns {string}
 */
function getAgePolicy(studentAge) {
  if (!studentAge || studentAge < 7) {
    return "\n\n## POLÍTICA DE EDAD (6 años)\nUsa palabras muy simples. Respuestas de máximo 2 oraciones. Usa emojis amigables. Evita temas complejos.";
  }
  if (studentAge <= 9) {
    return "\n\n## POLÍTICA DE EDAD (7-9 años)\nUsa lenguaje simple y claro. Máximo 3 oraciones por respuesta. Explica con ejemplos del mundo real.";
  }
  if (studentAge <= 11) {
    return "\n\n## POLÍTICA DE EDAD (10-11 años)\nUsa lenguaje accesible. Puedes usar términos académicos básicos con explicación. Máximo 4 oraciones.";
  }
  if (studentAge <= 13) {
    return "\n\n## POLÍTICA DE EDAD (12-13 años)\nPuedes usar vocabulario académico estándar. Explica conceptos con analogías.";
  }
  return "\n\n## POLÍTICA DE EDAD (14+ años)\nPuedes usar vocabulario académico completo. Introduce pensamiento crítico.";
}

/**
 * Detect emotional state from user message.
 * @returns {{ state: string, dependencyRisk: boolean }}
 */
function detectEmotionalState(text) {
  const lower = text.toLowerCase();

  const frustrated = /no entiendo|no puedo|es imposible|no sirvo|odio|asco|difícil/.test(lower);
  const confused = /qué es|no sé|cómo|por qué|explícame|no entendí/.test(lower);
  const mastery = /entendí|ya sé|lo logré|fácil|perfecto|gracias dani/.test(lower);
  const dependent = /dame la respuesta|dime la respuesta|sólo dime|simplemente dime|ponme|escríbeme/.test(lower);

  let state = "neutral";
  if (frustrated) state = "frustrated";
  else if (confused) state = "confused";
  else if (mastery) state = "mastery";

  return { state, dependencyRisk: dependent };
}

/**
 * Sanitize AI output — strip forbidden patterns, trim length.
 * @returns {string}
 */
function sanitizeOutput(text) {
  if (typeof text !== "string") return "";
  let out = text.slice(0, MAX_OUTPUT_CHARS);
  for (const pattern of FORBIDDEN_OUTPUT_PATTERNS) {
    out = out.replace(pattern, "[enlace]");
  }
  return out;
}

module.exports = {
  validateInput,
  getAgePolicy,
  detectEmotionalState,
  sanitizeOutput,
};
