export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
      });
      if (window.caches) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }
    }
  }
}
