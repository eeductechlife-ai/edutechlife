/**
 * Historial que Nico envía al modelo junto con el mensaje actual. Sin esto el
 * modelo solo ve la última pregunta y no sabe a qué se refiere "eso" o "y
 * cuánto cuesta".
 *
 * - Solo turnos de texto de usuario y asistente, sin el placeholder de streaming.
 * - Solo los últimos `limit` turnos y cada uno recortado a `maxChars`, para
 *   que el costo no crezca con la conversación.
 * - Arranca en un turno del usuario: los saludos del asistente que van antes
 *   no aportan contexto y algunos modelos rechazan un historial que empieza así.
 */
export function buildNicoHistory(
  messages = [],
  { limit = 10, maxChars = 1200 } = {},
) {
  const turns = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() &&
        !m.isStreaming,
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, maxChars),
    }));

  // Primero se recorta a los últimos turnos y luego se quita cualquier
  // respuesta del asistente que quede al inicio.
  const recent = turns.slice(-limit);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return firstUser < 0 ? [] : recent.slice(firstUser);
}
