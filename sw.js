const CACHE_NAME = 'arabe-premium-v1';
const ASSETS = [
  'index.html',
  'donnees.js',
  'manifest.json',
  // Ajoute ici tes images si tu en as, ex: 'icon-512.png'
];

// 1. Installation : On télécharge et on met en cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('App : Mise en cache des fichiers');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activation : On nettoie les vieux caches si tu mets à jour l'app
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Stratégie "Cache First" : On pioche dans la mémoire d'abord, sinon on va sur le web
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
