export function registerSW() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    if (import.meta.env.DEV) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((reg) => reg.unregister());
        })
        .catch(() => {});
      if (window.caches) {
        caches
          .keys()
          .then((names) => names.forEach((name) => caches.delete(name)))
          .catch(() => {});
      }
    } else {
      window.addEventListener("load", () => {
        // Si ya había un SW controlando la página, al activarse uno nuevo
        // (nuevo despliegue) se recarga una vez para no mostrar la versión vieja.
        const hadController = Boolean(navigator.serviceWorker.controller);
        let reloaded = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!hadController || reloaded) return;
          reloaded = true;
          window.location.reload();
        });
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }
}
