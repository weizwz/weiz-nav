'use client';

import { useEffect } from 'react';
import { App } from 'antd';
import { setMessageApi } from '@/utils/feedback';

/**
 * MessageProvider 组件
 * 初始化全局 message API，使 feedback 工具函数可以在任何地方使用
 */
export default function MessageProvider() {
  const { message } = App.useApp();

  useEffect(() => {
    // 设置全局 message 实例
    setMessageApi(message);
  }, [message]);

  return null;
}
