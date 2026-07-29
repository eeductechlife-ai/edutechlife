export const withRetry = (
  fn,
  { attempts = 3, backoff = "exponential", onRetry } = {},
) => {
  return async (...args) => {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err;
        if (err.name === "AbortError") throw err;
        if (i === attempts - 1) throw err;
        if (onRetry) onRetry(err, i + 1);
        const delay = backoff === "exponential" ? 1000 * Math.pow(2, i) : 1000;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw lastError;
  };
};

const inFlight = new Map();

export const deduplicate = (fn, { key } = {}) => {
  return async (...args) => {
    const k = key ? key(...args) : JSON.stringify(args);
    if (inFlight.has(k)) return inFlight.get(k);
    const promise = fn(...args).finally(() => inFlight.delete(k));
    inFlight.set(k, promise);
    return promise;
  };
};
