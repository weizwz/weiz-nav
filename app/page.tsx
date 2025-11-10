'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ThemeToggle from '@/components/layout/ThemeToggle';

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 transition-theme">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">前端导航网站</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          主题切换组件已实现
        </p>
        
        <p className="text-sm text-foreground-tertiary mt-4">
          当前主题: {theme}
        </p>
        
        <div className="mt-8 p-6 rounded-lg bg-background-secondary border border-border">
          <p className="text-sm">
            点击右上角的图标切换主题
          </p>
          <p className="text-xs text-foreground-tertiary mt-2">
            主题设置会自动保存到 LocalStorage
          </p>
        </div>
      </div>
    </main>
  );
}
