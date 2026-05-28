'use client';

import { useState, useEffect } from 'react';
import { Button, App } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const { message } = App.useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return;
    }

    // 检查是否已经关闭过提示
    const hasClosedPrompt = localStorage.getItem('pwa-install-prompt-closed');
    if (hasClosedPrompt) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      message.success('感谢安装！');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-closed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                安装唯知导航
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                快速访问，离线可用
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="关闭"
          >
            <CloseOutlined />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleInstall}
            block
          >
            立即安装
          </Button>
          <Button onClick={handleClose}>
            稍后
          </Button>
        </div>
      </div>
    </div>
  );
}
