// Nombre y versión de la caché (Sube este número cada vez que modifiques tu código HTML/CSS/JS)
const CACHE_NAME = 'cota100-v4';

// Lista de todos los archivos que tu celular descargará para funcionar sin internet en el campo
const urlsToCache = [
  './',
  './index.html',
  './configuraciones.html',
  './nivelacion.html',
  './niv-alcan.html', 
  './niv-carreteras.html', /* <--- AQUÍ ESTÁ TU NUEVO MÓDULO */
  './niv-lineal.html',
  './niv-poligonal.html',
  './poligonales.html',
  './pol-abierta.html',
  './pol-cerrada.html',
  './coordenadas.html',
  './atmosfera.html',
  './areas.html',
  './manifest.json',
  './icono.png' /* Asegúrate de que el formato de tu ícono coincida (.jpg o .png) */
];

// 1. INSTALACIÓN: Descarga y guarda los archivos en el celular
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caché abierta: Descargando COTA100 para uso Offline');
                return cache.addAll(urlsToCache);
            })
    );
    // Fuerza a que la nueva versión se instale de inmediato sin esperar
    self.skipWaiting();
});

// 2. ACTIVACIÓN: Borra la basura vieja (Limpieza de versiones anteriores)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Borrando versión antigua de COTA100:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Toma el control de la aplicación inmediatamente después de actualizar
    self.clients.claim();
});

// 3. INTERCEPTOR (FETCH): Cuando no hay internet, saca los archivos de la caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en la caché, lo entrega sin gastar datos
                if (response) {
                    return response;
                }
                // Si no está (como la librería de Excel al exportar), intenta usar el internet
                return fetch(event.request);
            })
    );
});