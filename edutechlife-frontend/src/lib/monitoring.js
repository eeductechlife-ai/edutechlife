let _enabled = false;
let _Sentry = null;
let _initPromise = null;

const SENTRY_CDN_URL = 'https://browser.sentry-cdn.com/9.12.0/bundle.tracing.replay.min.js';

const loadSentryFromCDN = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SENTRY_CDN_URL;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      resolve(window.Sentry);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Sentry from CDN'));
    };
    document.head.appendChild(script);
  });
};

const init = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.log('[monitoring] Sentry disabled — no DSN configured');
    }
    return;
  }
  try {
    const Sentry = await loadSentryFromCDN();
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE || 'production',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        if (event.exception?.values?.[0]?.type === 'AbortError') return null;
        if (event.exception?.values?.[0]?.type === 'ChunkLoadError') return null;
        return event;
      },
    });
    _Sentry = Sentry;
    _enabled = true;
    if (import.meta.env.DEV) {
      console.log('[monitoring] Sentry initialized');
    }
  } catch (error) {
    console.warn('[monitoring] Failed to load Sentry:', error);
  }
};

export const initMonitoring = () => {
  if (_initPromise) return _initPromise;
  _initPromise = init();
  return _initPromise;
};

export const captureError = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.log('[monitoring] Captured error (dev — not sent):', error?.message, context);
    return;
  }
  if (_Sentry) {
    _Sentry.captureException(error, { extra: context });
  }
};

export const captureMessage = (message, level = 'info') => {
  if (import.meta.env.DEV || !_Sentry) return;
  _Sentry.captureMessage(message, level);
};

export const captureErrorBoundaryError = (error, errorInfo, componentName) => {
  captureError(error, { componentStack: errorInfo?.componentStack, componentName });
};

export const isMonitoringEnabled = () => _enabled;
