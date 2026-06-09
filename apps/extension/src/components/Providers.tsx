'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, theme as antdTheme, App } from 'antd';
import { ThemeProvider, useTheme } from 'next-themes';

import zhCN from 'antd/locale/zh_CN';
import store, { initializeStore } from '@weiz-nav/store';
import { storageService } from '@weiz-nav/services/storage';
import MessageProvider from './MessageProvider';

/**
 * Ant Design 主题配置组件
 * 根据当前主题动态切换 Ant Design 的主题算法
 */
function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 等待客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在挂载前使用默认主题，避免 hydration 不匹配
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        cssVar: { key: 'app' },
        hashed: false, // 禁用 hash 类名，减少 CSS-in-JS 警告
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
      <App>
        <MessageProvider />
        {children}
      </App>
    </ConfigProvider>
  );
}

/**
 * 数据初始化组件
 * 在客户端加载时从 Storage 恢复数据
 */
function DataInitializer() {
  useEffect(() => {
    // 初始化 store，从 Storage 加载数据
    initializeStore();

    // 监听 storage 事件，实现多标签页数据同步 (仅 LocalStorage)
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'nav_links') {
        const savedLinks = await storageService.loadLinks();
        if (savedLinks) {
          store.dispatch({ type: 'links/loadLinks', payload: savedLinks });
        }
      } else if (event.key === 'nav_settings') {
        const savedSettings = await storageService.loadSettings();
        if (savedSettings) {
          store.dispatch({ type: 'settings/loadSettings', payload: savedSettings });
        }
      } else if (event.key === 'nav_categories') {
        const savedCategories = await null;
        if (savedCategories) {
          store.dispatch({ type: 'categories/loadCategories', payload: savedCategories });
        }
      }
    };

    // 监听 Chrome Storage 变化
    const handleChromeStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local') {
        if (changes.nav_links) {
          store.dispatch({ type: 'links/loadLinks', payload: changes.nav_links.newValue });
        }
        if (changes.nav_settings) {
          store.dispatch({ type: 'settings/loadSettings', payload: changes.nav_settings.newValue });
        }
        if (changes.nav_categories) {
          store.dispatch({
            type: 'categories/loadCategories',
            payload: changes.nav_categories.newValue,
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleChromeStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.removeListener(handleChromeStorageChange);
      }
    };
  }, []);

  return null;
}

/**
 * 根 Providers 组件
 * 集成 Redux Provider、ThemeProvider 和 Ant Design ConfigProvider
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="theme"
        >
          <AntdThemeProvider>
            <DataInitializer />
            {children}
          </AntdThemeProvider>
        </ThemeProvider>
      </>
    </Provider>
  );
}
