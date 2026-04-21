const CACHE_NAME = 'landsat-alphabet-v1';

const STATIC_ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './manifest.json',
    './background/background1.png'
];

// Add A-Z letters to cache
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
letters.forEach(char => {
    STATIC_ASSETS.push(`./Landsat_Alphabet/${char}.png`);
});

// Install Event - Cache all static assets required for offline rendering
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean up old caches if any
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Cache First, Fallback to Network Strategy
self.addEventListener('fetch', event => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            // Return from cache if found
            if (response) {
                return response;
            }

            // Fallback to network
            return fetch(event.request).then(networkResponse => {
                // Determine if we should dynamically cache this new response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Cache dynamic responses for future offline use (like new backgrounds)
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(error => {
                console.log('Fetch failed; returning offline page or placeholder context instead.', error);
                throw error;
            });
        })
    );
});
