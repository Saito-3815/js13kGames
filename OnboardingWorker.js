// service-worker.js
const CACHE_NAME = "my-pwa-cache-v6";
const urlsToCache = [
  // '/',
  "/onboarding.html",
  "/onboarding.js",
  "js13kpwa.onboarding.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       fetch(event.request).then(response => {
//         if (response.url.endsWith('/index.html') || response.url === self.registration.scope) {
//           return Response.redirect('/onboarding.html', 302);
//         }
//         return response;
//       }).catch(() => {
//         return caches.match('/onboarding.html');
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request)
//         .then((response) => response || fetch(event.request))
//     );
//   }
// });

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
