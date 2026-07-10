/* =========================================================
   Service Worker — SIET VLSI
   Strategy: Cache-first for assets, Network-first for HTML
   ========================================================= */
var CACHE  = "siet-VLSI-v2";
var ASSETS = [
  "/",
  "/index.html",
  "/css/main.css",
  "/js/main.js",
  "/js/animations.js",
  "/js/sliders.js",
  "/js/api.js",
  "/js/hod.js",
  "/js/faculty.js",
  "/js/students.js",
  "/js/search.js",
  "/data/site-data.js",
  "/pages/hod.html",
  "/pages/faculty.html",
  "/pages/labs.html",
  "/pages/achievements.html",
  "/pages/placements.html",
  "/pages/gallery.html",
  "/pages/workshops.html",
  "/pages/events.html",
  "/pages/alumni.html",
  "/pages/notices.html",
  "/pages/news.html",
  "/pages/contact.html",
  "/pages/resources.html",
  "/pages/students.html",
  "/pages/research.html",
  "/pages/privacy.html",
  "/404.html",
];

// Install — cache core assets
self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Fetch — HTML network-first, assets cache-first
self.addEventListener("fetch", function(e){
  if(e.request.method!=="GET") return;
  var isHTML = e.request.headers.get("accept") && e.request.headers.get("accept").includes("text/html");
  if(isHTML){
    e.respondWith(
      fetch(e.request).then(function(res){
        var clone=res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request,clone); });
        return res;
      }).catch(function(){
        return caches.match(e.request).then(function(r){ return r||caches.match("/404.html"); });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(r){
        return r || fetch(e.request).then(function(res){
          var clone=res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request,clone); });
          return res;
        });
      })
    );
  }
});
