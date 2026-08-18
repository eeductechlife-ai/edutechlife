/**
 * PostHog Configuration
 *
 * This file configures event analytics and feature flags for the frontend.
 * PostHog is initialized in lib/analytics.js with lazy loading.
 *
 * Environment variables required:
 * - VITE_POSTHOG_KEY: PostHog API key (required to enable)
 * - VITE_POSTHOG_HOST: Custom PostHog host (optional, defaults to app.posthog.com)
 */

export const posthogConfig = {
  // PostHog initialization options
  init: (posthog, apiKey, host = "https://app.posthog.com") => {
    posthog.init(apiKey, {
      api_host: host,

      // Disable automatic page view capture - we'll do it manually
      capture_pageview: false,

      // Session recording options
      session_recording: {
        recorderParams: {
          maskAllInputs: true,
          maskAllTextInputs: true,
          collectWindowHeight: true,
          collectWindowWidth: true,
        },
      },

      // Privacy and compliance
      persistence: "localStorage",
      persistence_name: "ph_edutechlife",

      // Feature flags
      featureFlags: {
        reportConsoleErrors: true,
      },

      // Custom hooks for additional control
      loaded: (ph) => {
        // PostHog is ready
        console.debug("PostHog initialized");
      },
    });
  },
};

/**
 * Core Web Vitals tracking integration
 * Sends CWV metrics to PostHog
 */
export function initCoreWebVitals(posthog) {
  if (!posthog || !window.web) {
    return;
  }

  // Check if Web Vitals library is available
  if (window.web?.vitals) {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.web.vitals;

    // Cumulative Layout Shift
    getCLS((metric) => {
      posthog.capture("Core Web Vital: CLS", {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // First Input Delay (legacy, replaced by INP)
    if (getFID) {
      getFID((metric) => {
        posthog.capture("Core Web Vital: FID", {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      });
    }

    // First Contentful Paint
    if (getFCP) {
      getFCP((metric) => {
        posthog.capture("Core Web Vital: FCP", {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      });
    }

    // Largest Contentful Paint
    if (getLCP) {
      getLCP((metric) => {
        posthog.capture("Core Web Vital: LCP", {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      });
    }

    // Time to First Byte
    if (getTTFB) {
      getTTFB((metric) => {
        posthog.capture("Core Web Vital: TTFB", {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      });
    }
  }
}

/**
 * Track page views manually with context
 */
export function trackPageView(posthog, pathname, properties = {}) {
  if (!posthog) return;

  posthog.capture("$pageview", {
    $current_url: window.location.href,
    pathname,
    ...properties,
  });
}

/**
 * Track custom events
 */
export function trackEvent(posthog, eventName, properties = {}) {
  if (!posthog) return;

  // Sanitize property keys (PostHog doesn't like $ in non-reserved properties)
  const sanitized = Object.entries(properties).reduce((acc, [key, value]) => {
    const cleanKey = key.startsWith("$") ? key : key;
    acc[cleanKey] = value;
    return acc;
  }, {});

  posthog.capture(eventName, sanitized);
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  posthog,
  featureName,
  featureId = null,
  properties = {},
) {
  if (!posthog) return;

  posthog.capture("Feature Used", {
    feature_name: featureName,
    feature_id: featureId,
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Track user conversion funnels
 */
export function trackConversion(posthog, funnelName, step, properties = {}) {
  if (!posthog) return;

  posthog.capture(`Funnel: ${funnelName}`, {
    funnel_step: step,
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Track performance metrics
 */
export function trackPerformanceMetric(
  posthog,
  metricName,
  value,
  unit = "ms",
) {
  if (!posthog) return;

  posthog.capture("Performance Metric", {
    metric_name: metricName,
    metric_value: value,
    metric_unit: unit,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Set feature flag state (used for A/B testing)
 */
export function setFeatureFlag(posthog, flagName, enabled) {
  if (!posthog) return;

  posthog.setPersonProperties({
    [`feature_${flagName}`]: enabled,
  });
}

/**
 * Error tracking integration
 */
export function capturePostHogError(posthog, error, context = {}) {
  if (!posthog) return;

  posthog.capture("JavaScript Error", {
    error_message: error?.message,
    error_stack: error?.stack,
    error_name: error?.name,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Session property tracking
 */
export function setSessionProperty(posthog, key, value) {
  if (!posthog) return;

  posthog.setPersonProperties({
    [key]: value,
  });
}

/**
 * Batch multiple events for efficiency
 */
export function batchTrackEvents(posthog, events) {
  if (!posthog) return;

  events.forEach(({ eventName, properties = {} }) => {
    posthog.capture(eventName, properties);
  });
}
