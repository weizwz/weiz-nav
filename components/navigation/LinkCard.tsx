'use client';

import React, { useCallback, memo, useState } from 'react';
import { Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as AntdIcons from '@ant-design/icons';
import { Link } from '@/types/link';
import { getFaviconUrl, getFaviconRootFallbackUrl } from '@/services/api/favicon';
import { showSuccess, showError } from '@/utils/feedback';

/**
 * 判断颜色是否为白色或接近白色
 */
const isWhiteColor = (color?: string): boolean => {
  if (!color) return false;
  const normalizedColor = color.toLowerCase().trim();
  return (
    normalizedColor === '#ffffff' ||
    normalizedColor === '#fff' ||
    normalizedColor === 'white' ||
    normalizedColor === 'rgb(255, 255, 255)' ||
    normalizedColor === 'rgb(255,255,255)' ||
    normalizedColor.startsWith('rgba(255, 255, 255') ||
    normalizedColor.startsWith('rgba(255,255,255')
  );
};

/**
 * 图标组件，支持多级回退
 * 1. 用户自定义图标（或子域名 favicon）
 * 2. 根域名 favicon（子域名找不到时自动回退）
 * 3. Ant Design 默认图标
 */
const IconWithFallback: React.FC<{
  src: string;
  alt: string;
  rootFallbackUrl?: string;
  scale?: number;
  backgroundColor?: string;
}> = ({ src, alt, rootFallbackUrl, scale = 0.8, backgroundColor }) => {
  const [srcError, setSrcError] = useState(false);
  const [rootError, setRootError] = useState(false);

  // 第一级：尝试加载主图标（自定义图标 或 子域名 favicon）
  if (!srcError) {
    return (
      <img
        src={src}
        alt={`${alt}的图标`}
        loading="lazy"
        decoding="async"
        className="w-22 h-22 object-contain"
        style={{ transform: `scale(${scale})` }}
        onError={() => setSrcError(true)}
      />
    );
  }

  // 第二级：主图标失败，尝试根域名 favicon
  if (rootFallbackUrl && !rootError) {
    return (
      <img
        src={rootFallbackUrl}
        alt={`${alt}的图标`}
        loading="lazy"
        decoding="async"
        className="w-22 h-22 object-contain"
        style={{ transform: `scale(${scale})` }}
        onError={() => setRootError(true)}
      />
    );
  }

  // 第三级：全部失败，显示默认图标
  const DefaultIcon = AntdIcons.LinkOutlined;
  const defaultIconColor = isWhiteColor(backgroundColor) ? '#1890ff' : '#ffffff';

  return (
    <DefaultIcon
      style={{ fontSize: 48, color: defaultIconColor }}
      aria-label={`${alt}的默认图标`}
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
const LinkCardBase: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  isDraggingEnabled = true,
}) => {
  // 拖拽功能
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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

  // 使用 useCallback 缓存事件处理函数
  const handleClick = useCallback(() => {
    if (isDragging) return;

    // chrome:// 协议链接无法通过 window.open 打开，自动复制并提示用户
    if (link.url.startsWith('chrome://') || link.url.startsWith('chrome-extension://')) {
      navigator.clipboard
        .writeText(link.url)
        .then(() => showSuccess('已复制，请粘贴到浏览器地址栏打开', 3))
        .catch(() => showError('复制失败，请手动复制地址'));
      return;
    }

    window.open(link.url, '_blank', 'noopener,noreferrer');
  }, [link.url, isDragging]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    if (onEdit) onEdit(link);
  }, [onEdit, link]);

  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(link.id);
  }, [onDelete, link.id]);

  // 右键菜单项
  const menuItems: MenuProps['items'] = React.useMemo(
    () => [
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
    ],
    [handleEdit, handleDelete]
  );

  // 渲染图标
  const renderIcon = React.useMemo(() => {
    const faviconUrl = getFaviconUrl(link.url, { larger: true });
    // 子域名找不到图标时，自动回退到根域名（如 events.vercount.one → vercount.one）
    const rootFaviconUrl = getFaviconRootFallbackUrl(link.url, { larger: true });
    const scale = link.iconScale || 0.7;
    const backgroundColor = link.backgroundColor;

    const isFaviconUrl = (url: string) => url.includes('favicon.im/');

    // 情况1: 用户提供了自定义图标 URL（但不是 favicon.im 的 URL）
    if (
      link.icon &&
      (link.icon.startsWith('http://') ||
        link.icon.startsWith('https://') ||
        link.icon.startsWith('/')) &&
      !isFaviconUrl(link.icon)
    ) {
      return (
        <IconWithFallback
          src={link.icon}
          alt={link.name}
          rootFallbackUrl={faviconUrl || rootFaviconUrl || undefined}
          scale={scale}
          backgroundColor={backgroundColor}
        />
      );
    }

    // 情况2: 用户提供了 Ant Design 图标名称
    if (
      link.icon &&
      !link.icon.startsWith('http://') &&
      !link.icon.startsWith('https://') &&
      !link.icon.startsWith('/')
    ) {
      const IconComponent = (AntdIcons as any)[link.icon];
      if (IconComponent) {
        const antdIconSize = Math.round(60 * scale);
        return <IconComponent style={{ fontSize: antdIconSize }} />;
      }
    }

    // 情况3: 没有自定义图标，或者图标是 favicon.im URL，尝试使用 favicon
    // 优先用子域名，失败后自动回退到根域名
    if (faviconUrl) {
      return (
        <IconWithFallback
          src={faviconUrl}
          alt={link.name}
          rootFallbackUrl={rootFaviconUrl || undefined}
          scale={scale}
          backgroundColor={backgroundColor}
        />
      );
    }

    // 情况4: 所有方式都失败，显示默认图标
    const DefaultIcon = AntdIcons.LinkOutlined;
    const defaultIconColor = isWhiteColor(backgroundColor) ? '#1890ff' : '#ffffff';

    return <DefaultIcon style={{ fontSize: 48, color: defaultIconColor }} />;
  }, [link.icon, link.name, link.url, link.iconScale, link.backgroundColor]);

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...(isDraggingEnabled ? listeners : {})}
      {...(isDraggingEnabled ? attributes : {})}
    >
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        <motion.div
          whileHover={{
            y: -4,
            transition: { duration: 0.2 },
          }}
          className="h-full"
          onContextMenu={handleContextMenu}
          role="article"
          aria-label={`导航链接：${link.name}`}
        >
          <Card
            hoverable
            onClick={handleClick}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`打开 ${link.name}${link.description ? `，${link.description}` : ''}`}
            className="link-card h-22 box-content cursor-pointer overflow-hidden rounded-xl"
            styles={{
              body: {
                height: '100%',
                padding: 0,
                display: 'flex',
              },
            }}
          >
            {/* 左侧：背景色 + 图标 */}
            <div
              className="flex-none w-22 flex items-center justify-center text-white relative overflow-hidden dark:brightness-[0.8]"
              style={{
                backgroundColor: link.backgroundColor || '#bae0ff',
              }}
              aria-hidden="true"
            >
              {renderIcon}
              {(link.backgroundColor === '#ffffff' ||
                link.backgroundColor === 'rgb(255, 255, 255)' ||
                link.backgroundColor?.indexOf('rgba(255, 255, 255') === 0) && (
                <div className="absolute right-0 top-7/32 h-9/16 w-0 border-r border-card-border z-0"></div>
              )}
            </div>

            {/* 右侧：名称 + 描述 */}
            <div className="w-full flex-1 flex flex-col justify-center p-3 bg-(--background-main) gap-1 overflow-hidden">
              {/* 名称 */}
              <div className="text-[15px] font-semibold text-(--foreground) overflow-hidden text-ellipsis whitespace-nowrap leading-snug">
                {link.name}
              </div>

              {/* 描述 */}
              {link.description && (
                <div className="text-xs text-(--foreground-secondary) overflow-hidden text-ellipsis line-clamp-2">
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
