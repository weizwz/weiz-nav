'use client';

import { useEffect } from 'react';
import { App } from 'antd';
import { setMessageApi, setModalApi } from '@/utils/feedback';

/**
 * MessageProvider 组件
 * 初始化全局 message 和 modal API，使 feedback 工具函数可以在任何地方使用
 */
export default function MessageProvider() {
  const { message, modal } = App.useApp();

  useEffect(() => {
    // 设置全局 message 和 modal 实例
    setMessageApi(message);
    setModalApi(modal);
  }, [message, modal]);

  return null;
}
