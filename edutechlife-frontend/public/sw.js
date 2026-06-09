self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (e) => {
  if (!e.data) return;
  try {
    const data = e.data.json();
    const options = {
      body: data.message || '',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/ialab', type: data.type },
      tag: data.tag || `push_${Date.now()}`,
    };
    e.waitUntil(self.registration.showNotification(data.title || 'IALab', options));
  } catch (err) { console.error('[SW] push error:', err); }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/ialab';
  e.waitUntil(clients.openWindow(url));
});
