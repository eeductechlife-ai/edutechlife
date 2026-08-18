import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Performance Tracking Hook
 *
 * Tracks:
 * - Route changes as "soft navigations" (resets Core Web Vitals per route)
 * - Layout shift sources
 * - Long task detection
 *
 * Usage:
 *   function MyComponent() {
 *     usePerfTracker();
 *     return ...
 *   }
 */

export function usePerfTracker() {
  const location = useLocation();

  // Track soft navigation on route change
  useEffect(() => {
    // Call trackSoftNavigation if available (defined in capture-vitals.js)
    if (window.__trackSoftNavigation) {
      window.__trackSoftNavigation(location.pathname);
    }

    // Log route change for debugging
    if (import.meta.env.DEV) {
      console.debug(`[Route] ${location.pathname}`);
    }
  }, [location.pathname]);

  // Observe layout shifts
  useEffect(() => {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const cumulativeCLS = entries.reduce(
          (sum, e) => sum + (e.hadRecentInput ? 0 : e.value),
          0,
        );

        if (cumulativeCLS > 0.1 && import.meta.env.DEV) {
          const shiftedElements = entries
            .filter((e) => !e.hadRecentInput && e.sources)
            .flatMap((e) => e.sources.map((s) => s.node?.tagName || "unknown"))
            .slice(0, 3);

          console.warn("[CLS] Layout shift detected", {
            value: cumulativeCLS,
            sources: shiftedElements,
            route: location.pathname,
          });
        }
      });

      if (PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) {
        observer.observe({ entryTypes: ["layout-shift"] });
        return () => observer.disconnect();
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.debug("[CLS Observer] Failed:", e.message);
      }
    }
  }, [location.pathname]);

  // Detect long tasks (Chrome 96+)
  useEffect(() => {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (import.meta.env.DEV && entry.duration > 50) {
            console.warn("[Long Task]", {
              duration: entry.duration.toFixed(0),
              name: entry.name,
              route: location.pathname,
            });
          }
        });
      });

      if (PerformanceObserver.supportedEntryTypes?.includes("longtask")) {
        observer.observe({ entryTypes: ["longtask"] });
        return () => observer.disconnect();
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.debug("[Long Task Observer] Failed:", e.message);
      }
    }
  }, [location.pathname]);
}

/**
 * Marks the start of a potentially heavy operation
 * Useful for measuring INP impact of specific interactions
 */
export function markInteractionStart(label) {
  if ("performance" in window && "mark" in performance) {
    try {
      performance.mark(`${label}-start`);
    } catch (e) {
      // Marks not supported
    }
  }
}

/**
 * Marks the end of an operation and measures duration
 */
export function markInteractionEnd(label) {
  if (
    "performance" in window &&
    "measure" in performance &&
    "mark" in performance
  ) {
    try {
      performance.mark(`${label}-end`);
      performance.measure(`${label}`, `${label}-start`, `${label}-end`);

      if (import.meta.env.DEV) {
        const measure = performance.getEntriesByName(`${label}`)[0];
        if (measure?.duration > 50) {
          console.warn(
            `[INP] Slow interaction: ${label} took ${measure.duration.toFixed(0)}ms`,
          );
        }
      }
    } catch (e) {
      // Measurement failed
    }
  }
}

/**
 * Schedules work to yield to the browser (browser.yield polyfill)
 * Prevents long tasks from blocking user input
 */
export async function yieldToMain() {
  if ("scheduler" in window && "yield" in window.scheduler) {
    return await window.scheduler.yield();
  } else {
    // Fallback: setTimeout with 0ms
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
}
