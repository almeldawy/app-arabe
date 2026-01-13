const CACHE_NAME = 'arabe-premium-v1';
const ASSETS = [
  './',
  './index.html',
  './donnees.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation : on met les fichiers dans le cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation : on nettoie les vieux caches si besoin
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Récupération : on sert les fichiers du cache même sans internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
