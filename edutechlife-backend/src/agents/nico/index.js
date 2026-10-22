/**
 * Agente Nico (atención al cliente, sitio público).
 *
 * El servidor es dueño del prompt: el navegador solo manda la conversación.
 * Cualquier mensaje con role 'system' que llegue del cliente se descarta, para
 * que nadie pueda cambiarle la personalidad ni las reglas a Nico.
 */
const { NICO_SYSTEM_PROMPT } = require('./prompt.generated');

const NICO_MAX_TURNS = 12;
const NICO_MAX_CHARS = 1000;

/** Solo turnos de texto de usuario y asistente; arranca en un turno del usuario. */
function sanitizeNicoHistory(messages) {
  if (!Array.isArray(messages)) return [];
  const turns = messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, NICO_MAX_CHARS) }));
  // Primero se recorta a los últimos turnos y luego se quita cualquier
  // respuesta del asistente que quede al inicio.
  const recent = turns.slice(-NICO_MAX_TURNS);
  const firstUser = recent.findIndex((m) => m.role === 'user');
  return firstUser < 0 ? [] : recent.slice(firstUser);
}

/** Mensajes listos para el modelo, o null si no hay un mensaje del usuario al final. */
function buildNicoMessages(messages, { memoryBlock = '' } = {}) {
  const history = sanitizeNicoHistory(messages);
  if (!history.length || history[history.length - 1].role !== 'user') return null;
  const system = memoryBlock ? `${NICO_SYSTEM_PROMPT}\n\n${memoryBlock}` : NICO_SYSTEM_PROMPT;
  return [{ role: 'system', content: system }, ...history];
}

module.exports = { buildNicoMessages, sanitizeNicoHistory, NICO_MAX_TURNS, NICO_MAX_CHARS };
