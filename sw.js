self.importScripts("data/games.js");

const basePath = self.location.hostname === '127.0.0.1' || self.location.hostname === '192.168.11.2' || self.location.hostname === 'localhost' 
  ? '/' 
  : '/js13kpwa/';

const cacheName = "js13kPWA-v27";
const appShellFiles = [
  `${basePath}`,
  `${basePath}index.html`,
  `${basePath}app.js`,
  `${basePath}style.css`,
  `${basePath}fonts/graduate.eot`,
  `${basePath}fonts/graduate.ttf`,
  `${basePath}fonts/graduate.woff`,
  `${basePath}favicon.ico`,
  `${basePath}img/js13kgames.png`,
  `${basePath}img/bg.png`,
  `${basePath}icons/icon-32.png`,
  `${basePath}icons/icon-64.png`,
  `${basePath}icons/icon-96.png`,
  `${basePath}icons/icon-128.png`,
  `${basePath}icons/icon-168.png`,
  `${basePath}icons/icon-192.png`,
  `${basePath}icons/icon-256.png`,
  `${basePath}icons/icon-512.png`
];
const gamesImages = [];
for (let i = 0; i < games.length; i++) {
  gamesImages.push(`${basePath}data/img/${games[i].slug}.jpg`);
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

self.addEventListener("push", function (event) {
  // プッシュメッセージの内容を取得
  const message = event.data.json();
  
  // コンソールにログを出力
  console.log("Push event received:", message);
  
  // 通知を表示
  self.registration.showNotification(message.title, { body: message.text });
});
