var CACHE_NAME = 'vlsi-v3';
var OFFLINE_URL = '/offline.html';
var PRECACHE = [
  '/', '/index.html', '/offline.html',
  '/css/main.css', '/js/main.js', '/js/api.js', '/js/search.js',
  '/data/site-data.js',
  '/pages/students.html', '/pages/faculty.html', '/pages/hod.html',
  '/pages/leaderboard.html', '/pages/stats.html', '/pages/gallery.html', '/pages/calendar.html', '/pages/contact.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(c) { return c.addAll(PRECACHE); })
    .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase') || e.request.url.includes('googleapis') || e.request.url.includes('cdn.') || e.request.url.includes('cdnjs') || e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(fetch(e.request).catch(function() { return caches.match(e.request); }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() { return caches.match(OFFLINE_URL); });
    })
  );
});

self.addEventListener('message', function(e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});