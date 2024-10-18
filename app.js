const template = `<article>
  <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME'>
  <h3>#POS. NAME</h3>
  <ul>
  <li><span>Author:</span> <strong>AUTHOR</strong></li>
  <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>
  <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>
  <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>
  </ul>
</article>`;
let content = "";
for (let i = 0; i < games.length; i++) {
  let entry = template
    .replace(/POS/g, i + 1)
    .replace(/SLUG/g, games[i].slug)
    .replace(/NAME/g, games[i].name)
    .replace(/AUTHOR/g, games[i].author)
    .replace(/WEBSITE/g, games[i].website)
    .replace(/GITHUB/g, games[i].github);
  entry = entry.replace("<a href='http:///'></a>", "-");
  content += entry;
}
document.getElementById("content").innerHTML = content;

if ("serviceWorker" in navigator) {
  // github pagesデプロイ時はsw.jsのパスを修正
  // const swPath = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
  //   ? '/sw.js' 
  //   : '/js13kpwa/sw.js';

  // const swPath = '/sw.js';
  const swPath = "/OneSignalSDKWorker.js";

  navigator.serviceWorker.register(swPath).then((registration) => {
    console.log("Service Worker registered with scope:", registration.scope);
  }).catch((error) => {
    console.error("Service Worker registration failed:", error);
  });
}

// クリックイベントが発生すると、ーザーに通知の許可を求める
// ユーザーが通知を許可した場合randomNotification()関数が呼び出される
const button = document.getElementById("notifications");
button.addEventListener("click", () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      console.log("Notification permission granted");
      randomNotification();
    } else {
      console.log("Notification permission denied");
    }
  });
});

// ランダムなゲームの情報を使用して通知を生成し、表示する関数
function randomNotification() {
  const randomItem = Math.floor(Math.random() * games.length);
  const notifTitle = games[randomItem].name;
  const notifBody = `Created by ${games[randomItem].author}.`;

  // 環境に応じてベースパスを設定
  // const basePath = window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.11.2' || window.location.hostname === 'localhost' 
  //   ? '/data/img/' 
  //   : '/js13kpwa/data/img/';

  const basePath = '/data/img/';

  const notifImg = `${basePath}${games[randomItem].slug}.jpg`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  console.log(`Creating notification: ${notifTitle}, ${notifBody}, ${notifImg}`);
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}

// 画像の遅延読み込み
const imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}