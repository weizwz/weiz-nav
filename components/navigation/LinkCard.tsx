'use client';

import React, { useCallback, memo, useState, useEffect, useRef } from 'react';
import { Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as AntdIcons from '@ant-design/icons';
import { Link } from '@/types/link';
import { getFaviconUrl } from '@/api/favicon';

/**
 * 图标组件，支持多级回退
 * 1. 用户自定义图标
 * 2. Favicon API 图标
 * 3. Ant Design 默认图标
 */
const IconWithFallback: React.FC<{ 
  src: string; 
  alt: string; 
  fallbackUrl?: string;
  scale?: number;
}> = ({ src, alt, fallbackUrl, scale = 0.8 }) => {
  const [hasError, setHasError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // 计算图标大小（基础大小 60px）
  const iconSize = Math.round(60 * scale);

  // 如果用户图标和 favicon 都失败，显示默认图标
  if (hasError && faviconError) {
    const DefaultIcon = AntdIcons.LinkOutlined;
    return <DefaultIcon style={{ fontSize: iconSize }} aria-label={`${alt}的默认图标`} />;
  }

  // 如果用户图标失败，尝试 favicon
  if (hasError && fallbackUrl && !faviconError) {
    return (
      <img 
        src={fallbackUrl} 
        alt={`${alt}的图标`}
        loading="lazy"
        className="w-25 h-25 object-contain"
        style={{ 
          transform: `scale(${scale})`,
        }}
        onError={() => {
          console.warn(`Favicon 加载失败: ${fallbackUrl}`);
          setFaviconError(true);
        }}
      />
    );
  }

  // 显示用户自定义图标
  return (
    <img 
      src={src} 
      alt={`${alt}的图标`}
      loading="lazy"
      className="w-25 h-25 object-contain"
      style={{ 
        transform: `scale(${scale})`,
      }}
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
  isDraggingEnabled?: boolean;
}

/**
 * LinkCard 组件
 * 显示单个导航链接的卡片，支持自定义图标、背景色和悬停动画
 * 使用 React.memo 优化避免不必要的重渲染
 */
const LinkCardBase: React.FC<LinkCardProps> = ({ link, onEdit, onDelete, isDraggingEnabled = true }) => {
  // 拖拽功能
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id,
    disabled: !isDraggingEnabled,
  });

  const dragStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  // 使用 ref 跟踪组件挂载状态，避免在卸载后执行操作
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 使用 useCallback 缓存事件处理函数
  const handleClick = useCallback(() => {
    // 在新标签页打开链接
    if (!isDragging) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  }, [link.url, isDragging]);

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
    // 获取 favicon URL 作为回退选项，使用 larger=true 获取更高质量的图标
    const faviconUrl = getFaviconUrl(link.url, { larger: true });
    const scale = link.iconScale || 0.7;
    const iconSize = Math.round(60 * scale);

    // 情况1: 用户提供了自定义图标 URL
    if (link.icon && (link.icon.startsWith('http://') || link.icon.startsWith('https://') || link.icon.startsWith('/'))) {
      return (
        <IconWithFallback 
          src={link.icon} 
          alt={link.name}
          fallbackUrl={faviconUrl || undefined}
          scale={scale}
        />
      );
    }

    // 情况2: 用户提供了 Ant Design 图标名称
    if (link.icon) {
      const IconComponent = (AntdIcons as any)[link.icon];
      if (IconComponent) {
        return <IconComponent style={{ fontSize: iconSize }} />;
      }
    }

    // 情况3: 没有自定义图标，尝试使用 favicon
    if (faviconUrl) {
      return (
        <IconWithFallback 
          src={faviconUrl} 
          alt={link.name}
          scale={scale}
        />
      );
    }

    // 情况4: 所有方式都失败，显示默认图标
    const DefaultIcon = AntdIcons.LinkOutlined;
    return <DefaultIcon style={{ fontSize: iconSize }} />;
  }, [link.icon, link.name, link.url, link.iconScale]);

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...(isDraggingEnabled ? listeners : {})}
      {...(isDraggingEnabled ? attributes : {})}
    >
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['contextMenu']}
      >
        <motion.div
          whileHover={{ 
            y: -4,
            transition: { duration: 0.2 }
          }}
          className="h-full"
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
            className="link-card h-25 box-content cursor-pointer overflow-hidden rounded-xl"
            styles={{
              body: {
                height: '100%',
                padding: 0,
                display: 'flex',
              }
            }}
          >
          {/* 左侧：背景色 + 图标 */}
          <div 
            className="flex-none w-25 flex items-center justify-center text-white relative overflow-hidden"
            style={{ 
              backgroundColor: link.backgroundColor || '#bae0ff',
            }}
            aria-hidden="true"
          > 
            {renderIcon}
            {
              (link.backgroundColor === '#ffffff' || link.backgroundColor === 'rgb(255, 255, 255)' || link.backgroundColor?.indexOf('rgba(255, 255, 255') === 0) &&
              <div className='absolute right-0 top-7/32 h-9/16 w-0 border-r border-card-border z-0'></div>
            }
          </div>
          
          {/* 右侧：名称 + 描述 */}
          <div className="flex-1 flex flex-col justify-center p-4 bg-(--background-main) gap-1">
            {/* 名称 */}
            <div className="text-[15px] font-semibold text-(--foreground) overflow-hidden text-ellipsis whitespace-nowrap leading-snug">
              {link.name}
            </div>
            
            {/* 描述 */}
            {link.description && (
              <div className="text-xs text-(--foreground-secondary) overflow-hidden text-ellipsis line-clamp-2 leading-relaxed">
                {link.description}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Dropdown>
    </div>
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
    prevProps.link.iconScale === nextProps.link.iconScale &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.isDraggingEnabled === nextProps.isDraggingEnabled
  );
});

LinkCard.displayName = 'LinkCard';

export { LinkCard };
export default LinkCard;
