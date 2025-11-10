'use client';

import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

/**
 * 全局错误边界组件
 * 捕获应用中的未处理错误并显示友好的错误页面
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
    }}>
      <Result
        status="error"
        title="出错了"
        subTitle="抱歉，应用遇到了一个错误。您可以尝试重新加载页面或返回主页。"
        extra={[
          <Button
            key="retry"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={reset}
          >
            重新加载
          </Button>,
          <Button
            key="home"
            icon={<HomeOutlined />}
            onClick={() => window.location.href = '/'}
          >
            返回主页
          </Button>,
        ]}
      >
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            textAlign: 'left',
            maxWidth: 600,
          }}>
            <h4 style={{ marginBottom: 8 }}>错误详情（仅开发环境显示）：</h4>
            <pre style={{
              fontSize: 12,
              overflow: 'auto',
              maxHeight: 200,
              margin: 0,
            }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}
      </Result>
    </div>
  );
}
