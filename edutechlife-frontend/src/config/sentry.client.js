/**
 * Sentry Client Configuration
 *
 * This file configures error tracking and performance monitoring for the frontend.
 * Sentry is initialized lazily in main.jsx to avoid blocking LCP.
 *
 * Environment variables required:
 * - VITE_SENTRY_DSN: Sentry project DSN (required to enable)
 * - VITE_SENTRY_TRACES_RATE: Performance traces sample rate (0-1, default 0)
 * - VITE_SENTRY_REPLAYS_RATE: Session replays sample rate (default 0)
 * - VITE_SENTRY_REPLAYS_ERROR_RATE: Error replays sample rate (default 1)
 */

export const sentryConfig = {
  // Initialize Sentry with proper configuration
  init: (Sentry, dsn) => {
    Sentry.init({
      dsn,
      integrations: [
        // Browser tracing for performance monitoring
        Sentry.browserTracingIntegration(),
        // Replay integration for session recording on errors
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
        // Custom error boundary integration
        Sentry.captureConsoleIntegration({
          levels: ["error", "warn"],
        }),
      ],

      // Performance monitoring
      tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE || 0.05),

      // Session replay on errors
      replaysSessionSampleRate: Number(
        import.meta.env.VITE_SENTRY_REPLAYS_RATE || 0,
      ),
      replaysOnErrorSampleRate: Number(
        import.meta.env.VITE_SENTRY_REPLAYS_ERROR_RATE || 1,
      ),

      // Environment detection
      environment: import.meta.env.MODE || "development",

      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || "unknown",

      // Ignore certain errors and breadcrumbs
      ignoreErrors: [
        // Browser extensions
        "top.GLOBALS",
        // Random plugins/extensions
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        // Network timeouts (handled separately)
        "NetworkTimeout",
        // ResizeObserver loop limit exceeded (benign)
        "ResizeObserver loop limit exceeded",
      ],

      // Custom hooks for filtering and processing
      beforeSend(event, hint) {
        // Filter out certain errors
        if (event.exception) {
          const error = hint.originalException;

          // Ignore network errors from analytics
          if (error?.message?.includes("analytics")) {
            return null;
          }

          // Ignore storage errors (quota exceeded, etc.)
          if (error?.name === "QuotaExceededError") {
            return null;
          }
        }

        return event;
      },

      beforeBreadcrumb(breadcrumb, hint) {
        // Filter sensitive breadcrumbs
        if (breadcrumb.category === "xhr" || breadcrumb.category === "fetch") {
          // Don't include URLs with auth tokens
          if (breadcrumb.data?.url?.includes("token")) {
            return null;
          }
        }

        return breadcrumb;
      },

      // Attachment size limit (in bytes)
      maxAttachmentSize: 5_000_000,

      // Server name (for development/production differentiation)
      serverName: import.meta.env.VITE_ENVIRONMENT || "unknown",
    });
  },
};

/**
 * Capture a custom error with context
 */
export function captureError(error, context = {}) {
  try {
    const Sentry = window?.__SENTRY__;
    if (Sentry) {
      Sentry.captureException(error, {
        contexts: {
          custom: context,
        },
      });
    }
  } catch (e) {
    console.error("Failed to capture error:", e);
  }
}

/**
 * Capture a custom message for tracking
 */
export function captureMessage(message, level = "info", context = {}) {
  try {
    const Sentry = window?.__SENTRY__;
    if (Sentry) {
      Sentry.captureMessage(message, level, {
        contexts: {
          custom: context,
        },
      });
    }
  } catch (e) {
    console.error("Failed to capture message:", e);
  }
}

/**
 * Set user context for error tracking
 */
export function setSentryUser(userId, email = null, username = null) {
  try {
    const Sentry = window?.__SENTRY__;
    if (Sentry) {
      Sentry.setUser({
        id: userId,
        email,
        username,
      });
    }
  } catch (e) {
    console.error("Failed to set Sentry user:", e);
  }
}

/**
 * Clear user context (on logout)
 */
export function clearSentryUser() {
  try {
    const Sentry = window?.__SENTRY__;
    if (Sentry) {
      Sentry.setUser(null);
    }
  } catch (e) {
    console.error("Failed to clear Sentry user:", e);
  }
}

/**
 * Add custom context data
 */
export function addSentryContext(name, data) {
  try {
    const Sentry = window?.__SENTRY__;
    if (Sentry) {
      Sentry.setContext(name, data);
    }
  } catch (e) {
    console.error("Failed to add Sentry context:", e);
  }
}
