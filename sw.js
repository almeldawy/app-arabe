const CACHE_NAME = 'arabe-v3'; // On change le nom pour forcer le refresh

// On ne met que le strict minimum pour que ça ne plante pas
const ASSETS = [
  './',
  './index.html',
  './donnees.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // On utilise "addAll" mais on capture les erreurs
      return cache.addAll(ASSETS).catch(err => console.log("Erreur cache:", err));
    })
  );
  self.skipWaiting(); // Force le nouveau SW à prendre la place tout de suite
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Si le fichier est dans le cache, on le donne, sinon on va sur internet
      return response || fetch(e.request);
    }).catch(() => {
        // Si même le fetch rate (hors-ligne complet), on renvoie l'index
        return caches.match('./index.html');
    })
  );
});
