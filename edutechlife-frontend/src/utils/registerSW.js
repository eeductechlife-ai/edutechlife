export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
      }).catch(() => {});
      if (window.caches) {
        caches.keys().then(names => names.forEach(name => caches.delete(name))).catch(() => {});
      }
    } else {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }
}
