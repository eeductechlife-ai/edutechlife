/**
 * Creates a structured error with context
 */
export function createError(message, context = {}, code = 'UNKNOWN_ERROR') {
  const error = new Error(message);
  error.code = code;
  error.context = context;
  error.timestamp = new Date().toISOString();
  return error;
}

/**
 * Safely logs an error with context without throwing
 */
export function logError(error, context = '') {
  const prefix = context ? `[${context}]` : '';
  if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message, error.context || '', error);
  } else {
    console.error(`${prefix} Error:`, error, error);
  }
}

/**
 * Wraps a function with error handling, returning a fallback on failure
 */
export function withErrorHandling(fn, fallback = null, context = '') {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      return fallback;
    }
  };
}

/**
 * Safely parses JSON with a fallback
 */
export function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Async wrapper for try-catch that returns [data, error] tuple
 */
export async function tryCatch(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
