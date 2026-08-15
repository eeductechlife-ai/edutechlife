/**
 * Core Web Vitals Capture Script
 *
 * Measures LCP, INP, CLS with attribution and sends to backend.
 * Usage: Call from src/main.jsx or load via dynamic import.
 */

export function captureWebVitals(options = {}) {
  const {
    onReport = () => {},
    endpoint = '/api/vitals',
    sampleRate = 0.1, // 10% sampling to reduce noise
  } = options;

  // Only sample a subset of users to reduce server load
  if (Math.random() > sampleRate) {
    return;
  }

  // Dynamic import: only load web-vitals when needed (doesn't block LCP)
  import('web-vitals').then(({ getLCP, getINP, getCLS, getFID, getLID }) => {
    const vitals = {};

    // Largest Contentful Paint
    getLCP(({ value, entries, rating }) => {
      vitals.lcp = {
        value,
        rating, // 'good', 'needs-improvement', 'poor'
        element: entries.at(-1)?.element?.tagName || 'unknown',
        url: entries.at(-1)?.url || '',
      };
      reportVitals();
    });

    // Interaction to Next Paint (replaces FID)
    getINP(({ value, entries, rating }) => {
      vitals.inp = {
        value,
        rating,
        interaction: entries.at(-1)?.name || 'unknown',
        duration: entries.at(-1)?.duration || 0,
      };
      reportVitals();
    });

    // Cumulative Layout Shift
    getCLS(({ value, entries, rating }) => {
      vitals.cls = {
        value,
        rating,
        shiftCount: entries.length,
        sources: entries.map(e => ({
          hadRecentInput: e.hadRecentInput,
          value: e.value,
        })),
      };
      reportVitals();
    });

    // First Input Delay (legacy, for older browsers)
    if (typeof getFID === 'function') {
      getFID(({ value, rating }) => {
        vitals.fid = { value, rating };
        reportVitals();
      });
    }

    // Long Animation Frames (Chrome 130+, experimental)
    if ('PerformanceObserver' in window) {
      try {
        const loafObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.loaf = {
              count: entries.length,
              maxDuration: Math.max(...entries.map(e => e.duration)),
              entries: entries.slice(0, 3).map(e => ({
                duration: e.duration,
                script: e.scripts?.[0]?.name || 'unknown',
              })),
            };
            reportVitals();
          }
        });

        if (PerformanceObserver.supportedEntryTypes?.includes('long-animation-frame')) {
          loafObserver.observe({ entryTypes: ['long-animation-frame'] });
        }
      } catch (e) {
        // LoAF not supported; continue without it
      }
    }

    // Report once all vitals are collected
    function reportVitals() {
      if (Object.keys(vitals).length < 3) return; // Wait for at least LCP, INP, CLS

      const payload = {
        url: window.location.pathname,
        vitals,
        navigation: {
          timeOrigin: performance.timeOrigin,
          redirectCount: performance.navigation?.redirectCount || 0,
          type: performance.navigation?.type || 'navigate',
        },
        connection: {
          effectiveType: navigator.connection?.effectiveType || 'unknown',
          rtt: navigator.connection?.rtt || 0,
          downlink: navigator.connection?.downlink || 0,
        },
        device: {
          memory: navigator.deviceMemory || 'unknown',
          cores: navigator.hardwareConcurrency || 'unknown',
          userAgent: navigator.userAgent,
        },
      };

      // Send to backend
      navigator.sendBeacon?.(endpoint, JSON.stringify(payload));

      // Also report locally if callback provided
      onReport?.(payload);

      // Log to console in development
      if (import.meta.env.DEV) {
        console.table({
          LCP: `${vitals.lcp?.value.toFixed(0)}ms (${vitals.lcp?.rating})`,
          INP: `${vitals.inp?.value.toFixed(0)}ms (${vitals.inp?.rating})`,
          CLS: `${vitals.cls?.value.toFixed(3)} (${vitals.cls?.rating})`,
        });
      }
    }
  }).catch(() => {
    // web-vitals library failed to load; silently continue
  });
}

/**
 * Soft Navigation Tracking for SPA Route Changes
 *
 * Call this when a route changes in React Router to reset metrics
 * for the new "page" (e.g., when navigating from /smartboard/inicio to /smartboard/misiones).
 */
export function trackSoftNavigation(routePath) {
  // Chrome 130+: Soft Navigation API
  if ('navigation' in performance && typeof performance.navigation === 'object' && 'navigate' in performance.navigation) {
    try {
      performance.navigation.navigate(routePath);
      console.debug(`[Perf] Soft navigation: ${routePath}`);
    } catch (e) {
      // Soft Navigation API not available; use fallback
      trackSoftNavigationFallback(routePath);
    }
  } else {
    trackSoftNavigationFallback(routePath);
  }
}

/**
 * Fallback: Manual soft navigation tracking
 * Dispatches a custom event so listeners can reset metrics
 */
function trackSoftNavigationFallback(routePath) {
  const event = new CustomEvent('softnav', {
    detail: { route: routePath, timestamp: performance.now() },
  });
  window.dispatchEvent(event);

  if (import.meta.env.DEV) {
    console.debug(`[Perf] Soft nav (fallback): ${routePath}`);
  }
}

/**
 * Performance Observer for detecting layout shifts
 *
 * Call this on component mount to log CLS events as they occur
 */
export function observeLayoutShifts(callback) {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries().filter(e => !e.hadRecentInput);
        if (entries.length > 0) {
          callback?.({
            shiftCount: entries.length,
            cumulativeValue: entries.reduce((sum, e) => sum + e.value, 0),
            entries: entries.map(e => ({
              value: e.value,
              sources: e.sources?.map(s => s.node?.tagName || 'unknown'),
            })),
          });
        }
      });

      if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        observer.observe({ entryTypes: ['layout-shift'] });
        return () => observer.disconnect();
      }
    } catch (e) {
      console.warn('Layout shift observer failed:', e);
    }
  }
  return () => {};
}
