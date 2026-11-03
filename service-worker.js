/**
 * Keyfolio PWA Service Worker
 * Provides offline caching for application shell and assets.
 */

const CACHE_NAME = 'keyfolio-v1.0.7';
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
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis') || event.request.url.includes('gstatic')) {
    return;
  }

  // Network First for development freshness
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
