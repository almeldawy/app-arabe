// On utilise un nom de cache qui contient la version
const CACHE_NAME = 'arabe-premium-cache-v' + new Date().getWeek; // Ou n'importe quel identifiant unique

const ASSETS = [
  './',
  './index.html',
  './donnees.js',
  './manifest.json'
];

// Installation : on force la mise à jour
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force le nouveau SW à prendre le contrôle immédiatement
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Nettoyage automatique des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie "Network First" : On essaie internet, si ça rate (hors-ligne), on prend le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
