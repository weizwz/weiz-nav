'use client';

import React, { useCallback, memo, useState } from 'react';
import { Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import * as AntdIcons from '@ant-design/icons';
import { Link } from '@/types/link';

/**
 * 图标组件，支持加载失败时显示默认图标
 */
const IconWithFallback: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // 显示默认图标
    const DefaultIcon = AntdIcons.LinkOutlined;
    return <DefaultIcon style={{ fontSize: 48 }} aria-label={`${alt}的默认图标`} />;
  }

  return (
    <img 
      src={src} 
      alt={`${alt}的图标`}
      loading="lazy"
      style={{ width: 48, height: 48, objectFit: 'contain' }}
      onError={() => {
        console.warn(`图标加载失败: ${src}`);
        setHasError(true);
      }}
    />
  );
};

interface LinkCardProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
}

/**
 * LinkCard 组件
 * 显示单个导航链接的卡片，支持自定义图标、背景色和悬停动画
 * 使用 React.memo 优化避免不必要的重渲染
 */
const LinkCardBase: React.FC<LinkCardProps> = ({ link, onEdit, onDelete }) => {
  // 使用 useCallback 缓存事件处理函数
  const handleClick = useCallback(() => {
    // 在新标签页打开链接
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }, [link.url]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // 阻止默认浏览器右键菜单
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(link);
    }
  }, [onEdit, link]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(link.id);
    }
  }, [onDelete, link.id]);

  // 右键菜单项 - 使用 useMemo 缓存
  const menuItems: MenuProps['items'] = React.useMemo(() => [
    {
      key: 'edit',
      label: '编辑',
      icon: <AntdIcons.EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <AntdIcons.DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ], [handleEdit, handleDelete]);

  // 渲染图标 - 使用 useMemo 缓存
  const renderIcon = React.useMemo(() => {
    if (!link.icon) {
      // 默认图标
      const DefaultIcon = AntdIcons.LinkOutlined;
      return <DefaultIcon style={{ fontSize: 48 }} />;
    }

    // 检查是否是 URL（自定义图片）
    if (link.icon.startsWith('http://') || link.icon.startsWith('https://') || link.icon.startsWith('/')) {
      return (
        <IconWithFallback 
          src={link.icon} 
          alt={link.name}
        />
      );
    }

    // Ant Design 图标名称
    const IconComponent = (AntdIcons as any)[link.icon];
    if (IconComponent) {
      return <IconComponent style={{ fontSize: 48 }} />;
    }

    // 如果图标名称无效，显示默认图标
    const DefaultIcon = AntdIcons.LinkOutlined;
    return <DefaultIcon style={{ fontSize: 48 }} />;
  }, [link.icon, link.name]);

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['contextMenu']}
    >
      <motion.div
        whileHover={{ 
          y: -4,
          transition: { duration: 0.2 }
        }}
        style={{ height: '100%' }}
        onContextMenu={handleContextMenu}
        role="article"
        aria-label={`导航链接：${link.name}`}
      >
        <Card
          hoverable
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`打开 ${link.name}${link.description ? `，${link.description}` : ''}`}
          style={{
            height: 100,
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '12px',
          }}
          styles={{
            body: {
              height: '100%',
              padding: 0,
              display: 'flex',
            }
          }}
          className="link-card"
        >
          {/* 左侧：背景色 + 图标 */}
          <div 
            style={{ 
              width: '40%',
              backgroundColor: link.backgroundColor || '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
            aria-hidden="true"
          >
            {renderIcon}
          </div>
          
          {/* 右侧：名称 + 描述 */}
          <div style={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'var(--background)',
            gap: 4,
          }}>
            {/* 名称 */}
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
            }}>
              {link.name}
            </div>
            
            {/* 描述 */}
            {link.description && (
              <div style={{
                fontSize: 12,
                color: 'var(--foreground-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.5,
              }}>
                {link.description}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Dropdown>
  );
};

// 使用 React.memo 优化组件，只在 props 变化时重新渲染
const LinkCard = memo(LinkCardBase, (prevProps, nextProps) => {
  // 自定义比较函数：只比较关键属性
  return (
    prevProps.link.id === nextProps.link.id &&
    prevProps.link.name === nextProps.link.name &&
    prevProps.link.url === nextProps.link.url &&
    prevProps.link.description === nextProps.link.description &&
    prevProps.link.icon === nextProps.link.icon &&
    prevProps.link.backgroundColor === nextProps.link.backgroundColor &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});

LinkCard.displayName = 'LinkCard';

export { LinkCard };
export default LinkCard;
