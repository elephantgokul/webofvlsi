/* =========================================================================
   SERVICE WORKER (sw.js) — Lightweight offline support & cache
   ========================================================================= */

var CACHE_NAME = 'vlsi-v7';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) {
          return caches.delete(k);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  // Let external CDN and API requests pass through directly
  var url = e.request.url;
  if (url.includes('supabase.co') || url.includes('googleapis.com') || url.includes('cdn.') || url.includes('cdnjs.')) {
    return;
  }

  // Network-first strategy with cache fallback
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});