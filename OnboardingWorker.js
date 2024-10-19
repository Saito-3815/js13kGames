// service-worker.js
const CACHE_NAME = "my-pwa-cache-v3";
const urlsToCache = [
  // '/',
  "/onboarding.html",
  "/onboarding.js",
  "js13kpwa.onbording.webmanifest",
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
