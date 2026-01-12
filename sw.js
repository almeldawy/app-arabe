// On génère un nom de cache unique basé sur le temps
// Cela permet de forcer le renouvellement des fichiers
const VERSION = new Date().getTime();
const CACHE_NAME = `arabe-premium-v-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './donnees.js',
  './manifest.json'
];

// 1. INSTALLATION : On télécharge les fichiers dans le cache
self.addEventListener('install', (event) => {
  // skipWaiting() force le nouveau service worker à s'activer sans attendre
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Mise en cache des fichiers');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVATION : On supprime les anciens caches pour libérer de l'espace
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Si le nom du cache est différent du nouveau, on l'efface
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. RÉPONSE AUX REQUÊTES : Stratégie "Network First"
// On essaie de prendre la version la plus récente sur internet
// Si on n'a pas de réseau, on donne la version en cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
