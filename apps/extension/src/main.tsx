import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, setupStorageSync } from '@weiz-nav/store';
import App from './App';
import './styles.css';

import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MessageProvider from '@weiz-nav/ui/src/components/MessageProvider';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // 注册 Service Worker 用于缓存图标等资源
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.warn('Service Worker 注册失败:', error);
        });
      });
    }
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        cssVar: { key: 'app' },
        hashed: false,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
          zIndexPopupBase: 1000,
        },
        components: {
          Card: {
            borderRadiusLG: 12,
          },
          Button: {
            borderRadius: 6,
          },
          Input: {
            borderRadius: 6,
          },
          Modal: {
            zIndexPopupBase: 1000,
          },
        },
      }}
    >
      <AntdApp>
        <MessageProvider />
        {children}
      </AntdApp>
    </ConfigProvider>
  );
}

// 开启多标签页数据同步
setupStorageSync();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AntdThemeProvider>
          <App />
        </AntdThemeProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
