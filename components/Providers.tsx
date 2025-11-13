'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, theme as antdTheme, App } from 'antd';
import { ThemeProvider, useTheme } from 'next-themes';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import zhCN from 'antd/locale/zh_CN';
import store, { initializeStore } from '@/store';
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
 * 在客户端加载时从 LocalStorage 恢复数据
 */
function DataInitializer() {
  useEffect(() => {
    // 初始化 store，从 LocalStorage 加载数据
    initializeStore();
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
      <AntdRegistry>
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
      </AntdRegistry>
    </Provider>
  );
}
