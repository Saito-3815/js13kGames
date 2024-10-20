// service-worker.js
const CACHE_NAME = "my-pwa-cache-v16";
const urlsToCache = [
  "/onboarding.html",
  "/onboarding.js",
  "js13kpwa.onboarding.webmanifest",
];

// function debugLog(message) {
//   console.log(`[ServiceWorker Debug] ${message}`);
// }

self.addEventListener("install", (event) => {
  // debugLog("Install event triggered");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // debugLog(`Caching URLs: ${urlsToCache.join(", ")}`);
      return cache.addAll(urlsToCache);
    })
  );
});

// pc環境では、インストール時にindex.htmlがエントリーポイントとして表示されるのでリダイレクト処理を追加
// self.addEventListener("fetch", (event) => {
//   // debugLog(`Fetch event for: ${event.request.url}`);
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         // debugLog(`Returning cached response for: ${event.request.url}`);
//         return response;
//       }
//       // debugLog(`Fetching from network: ${event.request.url}`);
//       return fetch(event.request).then((networkResponse) => {
//         // debugLog(
//         //   `Network response for: ${event.request.url}, status: ${networkResponse.status}`
//         // );

//         // PWAとして起動されている場合のみ、onboarding.htmlへリダイレクト
//         if (
//           event.request.mode === "navigate" &&
//           (event.request.url.endsWith("/index.html") ||
//             event.request.url === self.registration.scope)
//         ) {
//           debugLog("Navigate mode detected");
//           return clients.matchAll({ type: "window" }).then((clients) => {
//             if (
//               clients.length > 0 &&
//               "display" in clients[0].navigationPreload
//             ) {
//               debugLog("PWA detected, redirecting to onboarding.html");
//               return Response.redirect("/onboarding.html", 302);
//             }
//             debugLog("Regular browser detected, serving index.html");
//             return networkResponse;
//           });
//         }
//         return networkResponse;
//       });
//     })
//   );
// });

self.addEventListener("fetch", (event) => {
  // debugLog(`Fetch event for: ${event.request.url}`);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  // debugLog("Activate event triggered");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // debugLog(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// self.addEventListener("message", (event) => {
//   debugLog(`Message received: ${JSON.stringify(event.data)}`);
// });

// debugLog("Service Worker script loaded");
