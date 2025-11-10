'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

export default function Home() {
  const { theme, setTheme } = useTheme();
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
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">前端导航网站</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          项目初始化完成 - 主题系统已集成
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Button
            type={theme === 'light' ? 'primary' : 'default'}
            icon={<BulbOutlined />}
            onClick={() => setTheme('light')}
          >
            浅色
          </Button>
          <Button
            type={theme === 'dark' ? 'primary' : 'default'}
            icon={<BulbFilled />}
            onClick={() => setTheme('dark')}
          >
            深色
          </Button>
          <Button
            type={theme === 'system' ? 'primary' : 'default'}
            onClick={() => setTheme('system')}
          >
            跟随系统
          </Button>
        </div>
        
        <p className="text-sm text-foreground-tertiary mt-4">
          当前主题: {theme}
        </p>
      </div>
    </main>
  );
}
