let posthogInstance = null;

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key || posthogInstance) return;

  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      loaded: (ph) => {
        posthogInstance = ph;
      },
    });
  });
}

export function track(event, properties = {}) {
  if (posthogInstance) {
    posthogInstance.capture(event, properties);
  }
}

export function identify(userId, traits = {}) {
  if (posthogInstance) {
    posthogInstance.identify(userId, traits);
  }
}

export function reset() {
  if (posthogInstance) {
    posthogInstance.reset();
  }
}

export function getAnalytics() {
  return posthogInstance;
}
