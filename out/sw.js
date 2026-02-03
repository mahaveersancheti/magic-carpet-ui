self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Bypass all requests that are not on the same origin (like API calls)
    // or requests specifically meant for the API
    if (url.origin !== self.location.origin || url.pathname.includes('/api/')) {
        return;
    }
    
    // Required for PWA installability, but we don't need to cache everything in dev
    event.respondWith(fetch(event.request));
});
