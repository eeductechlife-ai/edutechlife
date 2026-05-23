const CACHE = 'edutechlife-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (request.url.includes('/rest/v1/') || request.url.includes('clerk.')) {
    e.respondWith(fetch(request).catch(() => new Response(null, { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(request).then((r) => r || fetch(request).then((res) => {
      if (res.ok && request.url.startsWith(self.location.origin)) {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(request, clone));
      }
      return res;
    }).catch(() => new Response(null, { status: 503 })))
  );
});

self.addEventListener('push', (e) => {
  const data = e.data?.json() || { title: 'Edutechlife', body: 'Novedades en tu curso' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
  });
});
