// Service Worker for PWA
const CACHE_NAME = 'weiz-nav-v0_1_1';
const RUNTIME_CACHE = 'weiz-nav-runtime-v0_1_1';
const IMAGE_CACHE = 'weiz-nav-images-v0_1_1';

// 需要预缓存的静态资源
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // 立即控制所有页面
      self.clients.claim(),
      // 通知所有客户端刷新
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            version: CACHE_NAME,
          });
        });
      }),
    ])
  );
});

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

// Fetch 事件 - 智能缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // 对于图片资源（包括 favicon），使用缓存优先策略，长期缓存
  if (isImageRequest(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // 从缓存返回，同时在后台更新缓存（stale-while-revalidate）
            const fetchPromise = fetch(request).then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            }).catch(() => {
              // 网络失败时忽略，继续使用缓存
            });
            return cachedResponse;
          }

          // 缓存中没有，从网络获取
          return fetch(request).then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            // 缓存图片，设置较长的过期时间
            cache.put(request, response.clone());
            return response;
          }).catch(() => {
            // 网络失败，返回默认图标（可选）
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
        });
      })
    );
    return;
  }

  // 对于 API 请求，使用网络优先策略
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 克隆响应并缓存
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 网络失败时，尝试从缓存获取
          return caches.match(request);
        })
    );
    return;
  }

  // 对于其他静态资源，使用缓存优先策略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // 只缓存成功的响应
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // 克隆响应并缓存
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      });
    })
  );
});

// 消息事件 - 处理来自页面的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
