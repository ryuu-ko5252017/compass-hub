// sw.js
const CACHE_NAME = 'v2'; // 更新を認識させるためにv2に上げると良いです
const ASSETS = [
  './',
  'index.html',
  'manifest.json', // マニフェスト自体もキャッシュすると安定します
  'icon-192.png',  // ← カンマを追加
  'icon-512.png'   // ← カンマを追加
];

// インストール時にキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 一つでも失敗すると登録されないため、慎重に実行
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除（これがあると更新がスムーズです）
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// フェッチ時にキャッシュを優先
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});