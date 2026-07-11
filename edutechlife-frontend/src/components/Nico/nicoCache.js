// Simple response cache with eviction
export const responseCache = new Map();
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const CACHE_MAX_SIZE = 100;

export const setResponseCache = (key, value) => {
  if (responseCache.size >= CACHE_MAX_SIZE) {
    const oldest = responseCache.keys().next().value;
    responseCache.delete(oldest);
  }
  responseCache.set(key, value);
};
