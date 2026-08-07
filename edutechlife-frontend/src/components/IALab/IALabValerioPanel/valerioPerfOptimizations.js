/**
 * MAX Performance Optimizations
 * Memoization, caching, debouncing para máximo rendimiento
 */

import React, { useMemo, useCallback, useRef } from "react";

/**
 * Hook para cachear el systemPrompt y evitar recalculos innecesarios
 */
export const useSystemPromptCache = (systemPrompt, isOpen) => {
  const cacheRef = useRef({});
  const promptHashRef = useRef(null);

  const getCachedPrompt = useCallback(() => {
    // Generar hash simple del prompt para cache key
    const hash = systemPrompt?.substring(0, 50) + systemPrompt?.length;

    if (promptHashRef.current === hash && cacheRef.current.prompt) {
      return cacheRef.current.prompt;
    }

    // Actualizar cache
    promptHashRef.current = hash;
    cacheRef.current.prompt = systemPrompt;
    cacheRef.current.timestamp = Date.now();

    return systemPrompt;
  }, [systemPrompt]);

  return useMemo(() => getCachedPrompt(), [getCachedPrompt, isOpen]);
};

/**
 * Debounce input para reducir renders y API calls
 */
export const useDebouncedInput = (inputValue, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = React.useState(inputValue);
  const timeoutRef = useRef(null);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue, delay]);

  return debouncedValue;
};

/**
 * Response caching con stale-while-revalidate strategy
 * Para sesiones académicas: primero devuelve cache, luego actualiza
 */
export class ResponseCache {
  constructor(maxSize = 100, ttl = 3600000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // 1 hora por defecto
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // FIFO - remove oldest
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Track hits for LRU
    entry.hits++;
    return entry.value;
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: `${Math.round((this.cache.size / this.maxSize) * 100)}%`,
    };
  }
}

/**
 * Hook para memoizar callbacks de procesamiento de chunks
 */
export const useStreamingCallbacks = (onChunk, onComplete, onError) => {
  return useMemo(
    () => ({
      handleChunk: useCallback((chunk) => onChunk?.(chunk), [onChunk]),
      handleComplete: useCallback(() => onComplete?.(), [onComplete]),
      handleError: useCallback((err) => onError?.(err), [onError]),
    }),
    [onChunk, onComplete, onError],
  );
};

/**
 * Performance metrics helper
 * Para medir tiempo de respuesta, latencia, etc
 */
export class PerformanceMetrics {
  constructor() {
    this.metrics = {};
  }

  start(label) {
    this.metrics[label] = {
      start: performance.now(),
      end: null,
      duration: null,
    };
  }

  end(label) {
    if (!this.metrics[label]) {
      console.warn(`Metric "${label}" not started`);
      return null;
    }

    this.metrics[label].end = performance.now();
    this.metrics[label].duration =
      this.metrics[label].end - this.metrics[label].start;

    return this.metrics[label].duration;
  }

  get(label) {
    return this.metrics[label]?.duration || null;
  }

  getAll() {
    return Object.entries(this.metrics).reduce((acc, [label, data]) => {
      acc[label] = `${Math.round(data.duration)}ms`;
      return acc;
    }, {});
  }

  logPerformance() {
    if (import.meta.env.DEV) {
      console.table(this.getAll());
    }
  }
}

/**
 * Hook singleton para el cache global de respuestas
 */
let responseCache = null;

export const useResponseCache = () => {
  if (!responseCache) {
    responseCache = new ResponseCache();
  }
  return responseCache;
};

/**
 * Lazy loading indicator helper
 */
export const shouldLazyLoad = (element, options = {}) => {
  const { threshold = 0.1 } = options;

  return new Promise((resolve) => {
    if (!("IntersectionObserver" in window)) {
      resolve(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          resolve(true);
        }
      },
      { threshold },
    );

    observer.observe(element);
  });
};

/**
 * Bundle size optimization: dynamic imports
 * Para componentes pesados que no se usan siempre
 */
export const dynamicImportWithFallback = async (
  importFn,
  fallbackComponent,
) => {
  try {
    return await importFn();
  } catch (err) {
    console.warn("Failed to load component:", err);
    return fallbackComponent;
  }
};

export default {
  useSystemPromptCache,
  useDebouncedInput,
  ResponseCache,
  useStreamingCallbacks,
  PerformanceMetrics,
  useResponseCache,
  shouldLazyLoad,
  dynamicImportWithFallback,
};
