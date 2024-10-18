// onboarding.js
// PWAの主要機能を初期化
function initApp() {
  // アプリの初期化コード
  console.log('PWA initialized');
}

// PWAのインストールを促す関数（オプショナル）
function promptInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  }
}

// アプリの初期化
document.addEventListener('DOMContentLoaded', initApp);

// インストールボタンのイベントリスナー（もし表示する場合）
// document.getElementById('installButton').addEventListener('click', promptInstall);