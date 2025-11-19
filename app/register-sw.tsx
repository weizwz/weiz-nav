'use client';

import { useEffect } from 'react';
import { App } from 'antd';

export default function RegisterServiceWorker() {
  const { message } = App.useApp();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // 监听来自 Service Worker 的消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('缓存已更新到版本:', event.data.version);
          message.success('应用已更新到最新版本！');
        }
      });

      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker 注册成功:', registration.scope);

            // 定期检查更新（每小时）
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);

            // 检查更新
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 新的 Service Worker 已安装，自动激活
                    console.log('发现新版本，准备更新...');
                    
                    // 显示更新提示
                    message.info({
                      content: '发现新版本，正在更新...',
                      duration: 2,
                      onClose: () => {
                        // 自动激活新版本
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                      },
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('Service Worker 注册失败:', error);
          });

        // 监听 Service Worker 控制器变化
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          
          // 检查是否是首次加载（没有旧的 controller）
          const isFirstLoad = !navigator.serviceWorker.controller;
          if (isFirstLoad) {
            console.log('首次加载 Service Worker，无需刷新');
            return;
          }
          
          refreshing = true;
          console.log('Service Worker 已更新，3秒后刷新页面...');
          
          // 延迟刷新，给用户时间看到提示
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
      });
    }
  }, [message]);

  return null;
}
