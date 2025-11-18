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
          className="transition-theme h-22"
          style={{ 
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
          styles={{
            body: {
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0',
              paddingRight: '16px',
            }
          }}
        >
          <Skeleton.Avatar
            active
            size={86}
            shape='square'
            className='rounded-l-xl overflow-hidden'
          />
          <Skeleton
            active
            avatar={false}
            paragraph={{ rows: 1 }}
            title={true}
            className='flex-1 h-10 pl-5'
          />
        </Card>
      ))}
    </div>
  );
};

export default LinkGridSkeleton;
