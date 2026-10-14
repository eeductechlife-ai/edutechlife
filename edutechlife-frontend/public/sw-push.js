/**
 * Avisos push del padre o acudiente (IngenIA). Se importa dentro del service
 * worker de Workbox (vite.config.js > workbox.importScripts), así que no
 * cambia la caché ni la carga de la app.
 *
 * Decisión del CEO (2026-10-13): la notificación solo dice que el hijo/a está
 * activo. Sin nombre ni datos extra. Al tocarla se abre el panel de padres.
 */

const TITULO_AVISO = 'Tu hijo/a está activo en IngenIA';
const RUTA_PANEL_PADRES = '/ingenia/padres';

self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification(TITULO_AVISO, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'ingenia-padre-activo',
      data: { url: RUTA_PANEL_PADRES },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destino = new URL(RUTA_PANEL_PADRES, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      const existente = ventanas.find((v) => v.url.startsWith(destino));
      if (existente) return existente.focus();
      return self.clients.openWindow(destino);
    }),
  );
});
