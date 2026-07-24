const CACHE_NAME = 'cota100-v8.1';

const urlsToCache = [
  './',
  './index.html',
  './ajustes.html',
  './areas.html',
  './atmosfera.html',
  './coordenadas.html',
  './nivelacion.html',
  './niv-simple.html',
  './niv-alcan.html',
  './niv-poligonal.html',
  './poligonales.html',
  './manifest.json',
  './icono.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché COTA100 instalada');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ESTRATEGIA: NETWORK FIRST (Red Primero, luego Caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si hay internet y responde bien, guardamos una copia fresca en la caché
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si no hay internet (falla el fetch), sacamos la versión de la caché
        return caches.match(event.request);
      })
  );
});
