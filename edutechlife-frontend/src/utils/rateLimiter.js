const buckets = new Map();

export class RateLimitError extends Error {
  constructor(message, retryAfterMs) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

export function createRateLimiter({ key, maxRequests, windowMs }) {
  return function checkLimit() {
    const now = Date.now();
    const bucket = buckets.get(key) || { requests: [], key };

    bucket.requests = bucket.requests.filter((t) => now - t < windowMs);

    if (bucket.requests.length >= maxRequests) {
      const oldestRequest = bucket.requests[0];
      const retryAfterMs = windowMs - (now - oldestRequest);
      throw new RateLimitError(
        `Demasiadas solicitudes. Intenta de nuevo en ${Math.ceil(retryAfterMs / 1000)}s.`,
        retryAfterMs,
      );
    }

    bucket.requests.push(now);
    buckets.set(key, bucket);
    return true;
  };
}

export const PRESET_LIMITERS = {
  chatMessage: createRateLimiter({
    key: "chat_message",
    maxRequests: 10,
    windowMs: 60_000,
  }),
  examSubmission: createRateLimiter({
    key: "exam_submission",
    maxRequests: 3,
    windowMs: 30_000,
  }),
  challengeSubmission: createRateLimiter({
    key: "challenge_submission",
    maxRequests: 5,
    windowMs: 60_000,
  }),
  contactForm: createRateLimiter({
    key: "contact_form",
    maxRequests: 2,
    windowMs: 300_000,
  }),
  apiCall: createRateLimiter({
    key: "api_call",
    maxRequests: 30,
    windowMs: 60_000,
  }),
};

export function resetRateLimiter(key) {
  buckets.delete(key);
}
