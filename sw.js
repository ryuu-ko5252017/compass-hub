// sw.js

// バージョン管理：更新時はここを v3, v4 と上げていく
const CACHE_NAME = 'michibiki-v2'; 

const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// インストール：キャッシュを保存し、即座に有効化
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // 新しいSWを待機させず即座に反映
  );
});

// アクティベート：古いバージョンのキャッシュを自動削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // 制御を即座に開始
  );
});

// フェッチ：オフライン時はキャッシュから返し、オンライン時はネットから取得
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});