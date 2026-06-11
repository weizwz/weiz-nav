// Extension Service Worker for caching images and icons
const IMAGE_CACHE = 'weiz-nav-ext-images-v1';

// 判断是否是图片请求
function isImageRequest(url) {
  return (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i) ||
    url.hostname === 'favicon.im' ||
    url.hostname.includes('favicon') ||
    url.hostname === 'cdn.simpleicons.org' ||
    url.hostname === 'api.iconify.design' ||
    url.hostname === 'p.weizwz.com'
  );
}

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('weiz-nav-ext-images-') && cacheName !== IMAGE_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch 事件 - 智能缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 只处理特定的图片/图标请求
  if (isImageRequest(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // 从缓存返回，同时在后台更新缓存（stale-while-revalidate）
            // 避免频繁请求，这里可以选择不每次都 revalidate
            // 但为了保持更新，还是使用 stale-while-revalidate
            fetch(request)
              .then((response) => {
                if (response && response.status === 200) {
                  cache.put(request, response.clone());
                }
              })
              .catch(() => {
                // 网络失败时忽略
              });
            return cachedResponse;
          }

          // 缓存中没有，从网络获取
          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }
              // 缓存图片
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => {
              return new Response('', { status: 404, statusText: 'Not Found' });
            });
        });
      })
    );
  }
});
