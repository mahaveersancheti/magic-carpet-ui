self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Required for PWA installability, but we don't need to cache everything in dev
    event.respondWith(fetch(event.request));
});
