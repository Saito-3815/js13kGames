self.importScripts("data/games.js");

const cacheName = "js13kPWA-v4";
const appShellFiles = [
  "/",
  "/index.html",
  "/app.js",
  "/style.css",
  "/fonts/graduate.eot",
  "/fonts/graduate.ttf",
  "/fonts/graduate.woff",
  "/favicon.ico",
  "/img/js13kgames.png",
  "/img/bg.png",
  "/icons/icon-32.png",
  "/icons/icon-64.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-168.png",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-512.png",
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`data/img/${games[i].slug}.jpg`);
}
const contentToCache = appShellFiles.concat(gamesImages);

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
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