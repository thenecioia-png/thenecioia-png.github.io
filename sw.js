/* El Necio Digital — Service Worker
 * Estrategia:
 *  - Estáticos (index/css/js/imágenes/PDFs): stale-while-revalidate (caché rápida + refresco en segundo plano).
 *  - Navegación: network-first con fallback a index.html cacheado (la guarida funciona sin conexión).
 *  - API (cross-origin the-necio-api.onrender.com, clima, geo): nunca se cachean.
 */
const CACHE = 'necio-hub-v6';

const STATIC_ASSETS = [
  './',
  './index.html',
  './hub.css',
  './hub.js',
  './manifest.json',
  './qr-code.png',
  './og-image.jpg',
  './diablito-avatar.png',
  './diablito-sprite.png',
  './fondo.webm',
  './fondo.mp4',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Solo gestionamos recursos del propio origen (GitHub Pages).
  // La API y las APIs de clima/geo son cross-origin y se dejan pasar sin cachear.
  if (url.origin !== location.origin) return;

  // Navegación: red primero, y si no hay conexión, servir la guarida cacheada.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Recursos estáticos: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
