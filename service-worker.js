/**
 * Keyfolio PWA Service Worker
 * Provides offline caching for application shell and assets.
 */

const CACHE_NAME = 'keyfolio-v1.0.22';
const ASSETS = [
  './',
  './index.html',
  './theme-preview.html',
  './manifest.json',
  './css/main.css',
  './css/components.css',
  './css/responsive.css',
  './js/app.js',
  './js/store.js',
  './js/constants.js',
  './js/keycap-search-service.js',
  './js/google-drive-service.js',
  './js/firebase-service.js',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests; let external APIs/images pass through directly
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Network First (bypassing browser HTTP max-age cache) with Offline Cache Fallback
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response('Offline', { status: 503 });
      })
  );
});
