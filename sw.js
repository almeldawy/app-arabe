const CACHE_NAME = 'app-arabe-v1';
const ASSETS = [
  'index.html',
  'donnees.js',
  'manifest.json'
];

// Installation : on met les fichiers en mémoire
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Utilisation : on sert les fichiers depuis la mémoire
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
