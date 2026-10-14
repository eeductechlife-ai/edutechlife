// Notificaciones push. vite-plugin-pwa genera el sw.js final con Workbox y lo
// carga con importScripts (vite.config.js → workbox.importScripts); un sw.js
// en public/ quedaría sobrescrito en el build y se perderían estos handlers.

self.addEventListener('push', (e) => {
  if (!e.data) return;
  try {
    const data = e.data.json();
    const options = {
      body: data.message || '',
      icon: data.icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/ialab', type: data.type },
      tag: data.tag || `push_${Date.now()}`,
    };
    e.waitUntil(self.registration.showNotification(data.title || 'Edutechlife', options));
  } catch (err) { console.error('[SW] push error:', err); }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/ialab';
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((wins) => {
      // Si la app ya está abierta, reutiliza esa ventana en lugar de abrir otra
      const win = wins[0];
      if (!win) return self.clients.openWindow(url);
      return win.navigate(url)
        .then((w) => (w || win).focus())
        .catch(() => self.clients.openWindow(url));
    }),
  );
});

// utils/notifications.js → clearOldNotifications()
self.addEventListener('message', (e) => {
  if (e.data?.action !== 'clearNotifications') return;
  e.waitUntil(
    self.registration.getNotifications().then((list) => list.forEach((n) => n.close())),
  );
});
