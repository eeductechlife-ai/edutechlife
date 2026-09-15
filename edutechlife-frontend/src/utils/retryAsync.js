/**
 * Reintenta una promesa ante fallos transitorios (red/RLS temporal). Pensado
 * para escrituras idempotentes (upserts). No altera el resultado en éxito: solo
 * vuelve a intentar antes de propagar el error.
 *
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{ retries?: number, delayMs?: number }} [options]
 * @returns {Promise<T>}
 */
export async function retryAsync(fn, { retries = 1, delayMs = 600 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export default retryAsync;
