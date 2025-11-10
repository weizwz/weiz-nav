'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/layout/Header';

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col transition-theme">
      {/* 页头组件 */}
      <Header />
      
      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">欢迎使用前端导航网站</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            页头组件已实现
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            当前主题: {theme}
          </p>
          
          <div className="mt-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              ✓ 搜索栏已集成<br />
              ✓ 主题切换已集成<br />
              ✓ 响应式布局已实现
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              尝试调整浏览器窗口大小查看响应式效果
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
