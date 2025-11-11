'use client';

import React from 'react';
import { Card, Skeleton } from 'antd';

/**
 * LinkGridSkeleton 组件
 * 链接网格的骨架屏加载状态
 * 用于页面初始加载时提供视觉反馈
 * 自动适配暗黑主题
 */
export const LinkGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-8">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card 
          key={index} 
          className="transition-theme"
          style={{ 
            height: 120,
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
          styles={{
            body: {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }
          }}
        >
          <Skeleton 
            active 
            avatar={{ size: 48, shape: 'square' }}
            paragraph={{ rows: 1 }}
            title={false}
          />
        </Card>
      ))}
    </div>
  );
};

export default LinkGridSkeleton;
