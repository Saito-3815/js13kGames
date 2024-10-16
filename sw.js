self.importScripts("data/games.js");

const cacheName = "js13kPWA-v11";
const appShellFiles = [
  "/js13kpwa/",
  "/js13kpwa/index.html",
  "/js13kpwa/app.js",
  "/js13kpwa/style.css",
  "/js13kpwa/fonts/graduate.eot",
  "/js13kpwa/fonts/graduate.ttf",
  "/js13kpwa/fonts/graduate.woff",
  "/js13kpwa/favicon.ico",
  "/js13kpwa/img/js13kgames.png",
  "/js13kpwa/img/bg.png",
  "/js13kpwa/icons/icon-32.png",
  "/js13kpwa/icons/icon-64.png",
  "/js13kpwa/icons/icon-96.png",
  "/js13kpwa/icons/icon-128.png",
  "/js13kpwa/icons/icon-168.png",
  "/js13kpwa/icons/icon-192.png",
  "/js13kpwa/icons/icon-256.png",
  "/js13kpwa/icons/icon-512.png",
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`/js13kpwa/data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      try {
        await cache.addAll(contentToCache);
      } catch (error) {
        console.error("Failed to cache:", error);
      }
    })(),
  );
});

self.addEventListener("activate", (e) => {
  console.log("[Service Worker] Activate");
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      return Promise.all(
        keys.map((key) => {
          if (key !== cacheName) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        }),
      );
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      // リソースがキャッシュに存在する場合はキャッシュから提供
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      // 存在しない場合はネットワークから取得してキャッシュに保存する
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })(),
  );
});
