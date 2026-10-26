const CACHE_NAME = 'makrocykle-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-mask.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        try {
          if (resp.ok && new URL(e.request.url).origin === self.location.origin) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
          }
        } catch (err) {}
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
