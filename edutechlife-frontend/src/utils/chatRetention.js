/**
 * Retención de los chats de Dani en el navegador.
 *
 * Los chats de menores se guardaban en localStorage sin límite hasta que alguien
 * cerraba sesión: en un computador compartido del colegio, quien no cerraba sesión
 * dejaba conversaciones íntegras para la siguiente persona. La copia buena está
 * en el servidor; en el navegador solo hace falta lo reciente. Aquí se conservan
 * como máximo 14 días y 100 mensajes.
 */
export const CHAT_MAX_AGE_DAYS = 14;
export const CHAT_MAX_MESSAGES = 100;

const DAY_MS = 24 * 60 * 60 * 1000;

const timeOf = (message) => {
  const t = Date.parse(message?.at);
  return Number.isNaN(t) ? null : t;
};

/**
 * Devuelve el historial que se puede guardar en el navegador.
 *
 * - Los mensajes sin fecha (anteriores a este cambio) se fechan «ahora»: desde ese
 *   momento empiezan a contar sus 14 días.
 * - Se descartan los de más de `maxAgeDays` días.
 * - Se conservan los últimos `maxMessages`.
 *
 * No modifica el arreglo original.
 */
export function retainChat(
  history,
  {
    now = Date.now(),
    maxAgeDays = CHAT_MAX_AGE_DAYS,
    maxMessages = CHAT_MAX_MESSAGES,
  } = {},
) {
  if (!Array.isArray(history)) return [];
  const oldest = now - maxAgeDays * DAY_MS;
  const stamped = history
    .filter((m) => m && typeof m === "object")
    .map((m) =>
      timeOf(m) == null ? { ...m, at: new Date(now).toISOString() } : m,
    );
  return stamped.filter((m) => timeOf(m) >= oldest).slice(-maxMessages);
}
