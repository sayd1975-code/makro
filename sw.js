const CACHE_NAME = 'makrocykle-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './icon-mask.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) 
