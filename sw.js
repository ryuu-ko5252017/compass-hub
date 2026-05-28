// sw.js
const CACHE_NAME = 'v1';
const ASSETS = [
  './',
  'index.html',
  // もしCSSや画像があればここに追加します
];

// インストール時にキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // すぐに有効化
  );
});

// フェッチ（データ取得）時にキャッシュを優先
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // キャッシュがあればそれを返し、なければネットワークへ
      return response || fetch(e.request);
    })
  );
});