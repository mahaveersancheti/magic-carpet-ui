self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Bypass API requests to avoid issues with redirects and mixed content
    if (event.request.url.includes('/api/')) {
        return;
    }
    // Required for PWA installability, but we don't need to cache everything in dev
    event.respondWith(fetch(event.request));
});
