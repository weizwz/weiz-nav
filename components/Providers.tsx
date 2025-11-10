'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, useTheme } from 'next-themes';
import zhCN from 'antd/locale/zh_CN';
import store, { initializeStore } from '@/store';

/**
 * Ant Design 主题配置组件
 * 根据当前主题动态切换 Ant Design 的主题算法
 */
function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, systemTheme } = useTheme();
  
  // 确定实际使用的主题
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontSize: 14,
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
        },
      }}
    >
      {children}
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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <AntdThemeProvider>
          <DataInitializer />
          {children}
        </AntdThemeProvider>
      </ThemeProvider>
    </Provider>
  );
}
