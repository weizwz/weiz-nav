'use client';

import React, { useCallback, memo, useState, useEffect } from 'react';
import { Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as AntdIcons from '@ant-design/icons';
import { Link } from '@weiz-nav/core/link';
import { getFaviconUrl } from '@weiz-nav/services/api/favicon';
import { showSuccess, showError } from '../../utils/feedback';

declare var chrome: any;

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
 * 图标组件，支持多级回退并基于 Cache API 进行二进制缓存
 * 1. 用户自定义图标
 * 2. Favicon API 图标
 * 3. Ant Design 默认图标
 */
const IconWithFallback: React.FC<{
  src: string;
  alt: string;
  fallbackUrl?: string;
  scale?: number;
  backgroundColor?: string;
}> = ({ src, alt, fallbackUrl, scale = 0.8, backgroundColor }) => {
  // 检测是否处于 Chrome 扩展环境
  const isExtension =
    typeof window !== 'undefined' &&
    typeof chrome !== 'undefined' &&
    !!chrome.runtime &&
    !!chrome.runtime.id;

  // 当前应当显示的实际来源（可能是普通 URL，也可能是 Cache API 生成的 Blob URL）
  // Web 环境直接使用初始 src 进行首次渲染，避免任何异步状态导致的闪烁
  const [displaySrc, setDisplaySrc] = useState<string | null>(() => {
    return isExtension ? null : src;
  });

  // 错误状态记录
  const [hasError, setHasError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // 当 src 发生改变时（如用户在编辑对话框中修改了自定义图标 URL），重置错误状态，强制重新加载
  useEffect(() => {
    setHasError(false);
    setFaviconError(false);
    if (!isExtension) {
      setDisplaySrc(src);
    }
  }, [src, isExtension]);

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    const loadIcon = async () => {
      // 确定当前应该加载哪一级的图片
      const targetUrl = hasError ? fallbackUrl : src;
      if (!targetUrl || faviconError) return;

      // 核心修复：如果是普通 Web 环境，直接将 URL 交给浏览器的原生 <img> 标签处理。
      // 原因：JS 的 fetch 会被严格的 CORS 跨域策略拦截（红字报错），而原生 <img> 具有 no-cors 特性可以完美显示图片，并且自带 HTTP 缓存。
      // 另外，如果是 base64 格式的 data:image/，直接使用，不需要走 Cache API
      if (!isExtension || targetUrl.startsWith('data:image/')) {
        if (isActive) setDisplaySrc(targetUrl);
        return;
      }

      try {
        // 尝试使用现代浏览器的 Cache API (扩展环境专享，具有越权跨域能力，用于极致提速新标签页)
        if (typeof caches !== 'undefined') {
          const cache = await caches.open('weiz-nav-icons-v1');
          let response = await cache.match(targetUrl);

          if (!response) {
            // 如果缓存未命中，发起请求并存入缓存
            response = await fetch(targetUrl);
            if (response.ok) {
              await cache.put(targetUrl, response.clone());
            } else {
              throw new Error(`Fetch error: ${response.status}`);
            }
          }

          // 将响应转为 Blob 并在内存中创建 URL
          const blob = await response.blob();
          if (isActive) {
            objectUrl = URL.createObjectURL(blob);
            setDisplaySrc(objectUrl);
          }
        } else {
          // 环境不支持 Cache API
          if (isActive) setDisplaySrc(targetUrl);
        }
      } catch (error) {
        // 在扩展环境中，如果有任何异常（如偶然的跨域拦截或断网），优雅降级为原生 <img> 加载，失败由 onError 兜底
        if (isActive) {
          setDisplaySrc(targetUrl);
        }
      }
    };

    // 每次层级发生变化（hasError）时，尝试重新加载对应的图片
    loadIcon();

    // 清理函数：组件卸载或 URL 变化时，释放内存中的 Blob URL
    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, fallbackUrl, hasError, faviconError, isExtension]);

  // 第一级或第二级加载中或已完成
  if (!faviconError && displaySrc !== null) {
    return (
      <img
        src={displaySrc}
        alt={`${alt}的图标`}
        decoding="async"
        loading="lazy"
        className="w-[5.5rem] h-[5.5rem] object-contain transition-opacity duration-300"
        style={{
          transform: `scale(${scale})`,
        }}
        onError={() => {
          // <img> 原生加载失败时触发，尝试降级
          // 如果还没有尝试过第一级错误降级，并且存在备用 URL，则降级到备用 URL
          if (!hasError && fallbackUrl) {
            setHasError(true);
          } else {
            // 如果已经是第二级错误，或者根本没有备用 URL，则彻底判定失败，显示默认图标
            setFaviconError(true);
          }
        }}
      />
    );
  }

  // 如果 displaySrc 还是 null（仅扩展环境首次异步 Cache 读取的几毫秒内），
  // 渲染一个透明的占位像素，防止发送多余的 HTTP 请求以及避免布局抖动
  if (!faviconError && displaySrc === null) {
    return (
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt="loading"
        className="w-[5.5rem] h-[5.5rem] object-contain"
        style={{ transform: `scale(${scale})` }}
      />
    );
  }

  // 第三级：所有图片都失败，显示默认图标
  const DefaultIcon = AntdIcons.LinkOutlined;
  // 简化逻辑：统一使用主题蓝，除非背景是深色才用白色（大部分卡片是浅色背景，蓝色最显眼）
  const defaultIconColor = '#1890ff';
  const defaultIconSize = 48;

  return (
    <DefaultIcon
      style={{
        fontSize: defaultIconSize,
        color: defaultIconColor,
      }}
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
    // 在新标签页打开链接
    if (!isDragging) {
      // 检查是否是 chrome:// 或 edge:// 协议
      if (/^(chrome|edge):\/\//.test(link.url)) {
        // 尝试使用 chrome.tabs.create API (仅在扩展环境中可用)
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
          chrome.tabs.create({ url: link.url });
        } else {
          // 非扩展环境或 API 不可用，直接复制链接并提示
          navigator.clipboard
            .writeText(link.url)
            .then(() => {
              showSuccess('已复制，请粘贴到地址栏打开');
            })
            .catch(() => {
              showError('复制失败，请手动复制');
            });
        }
      } else {
        // 普通链接
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
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

  // 渲染图标 - 使用 useMemo 缓存
  const renderIcon = React.useMemo(() => {
    // 判断是否为 favicon.im 的 URL
    const isFaviconUrl = (url: string) => {
      return url.includes('favicon.im');
    };

    // 判断加不加 larger 根据原来的 url 里判断
    let useLarger = true;
    if (link.icon && isFaviconUrl(link.icon)) {
      useLarger = link.icon.includes('larger=true');
    }

    // 获取 favicon URL 作为回退选项
    const faviconUrl = getFaviconUrl(link.url, { larger: useLarger });
    const scale = link.iconScale || 0.7;
    const backgroundColor = link.backgroundColor;

    // 情况1: 用户提供了自定义图标 URL（但不是 favicon.im 的 URL）
    if (
      link.icon &&
      (link.icon.startsWith('http://') ||
        link.icon.startsWith('https://') ||
        link.icon.startsWith('/') ||
        link.icon.startsWith('data:image/')) &&
      !isFaviconUrl(link.icon)
    ) {
      return (
        <IconWithFallback
          src={link.icon}
          alt={link.name}
          fallbackUrl={faviconUrl || undefined}
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
    if (faviconUrl) {
      return (
        <IconWithFallback
          src={faviconUrl}
          alt={link.name}
          scale={scale}
          backgroundColor={backgroundColor}
        />
      );
    }

    // 情况4: 所有方式都失败，显示默认图标
    // 默认图标使用固定大小（48px），不受 iconScale 影响
    // 如果背景是白色，使用主题色；否则使用白色
    const DefaultIcon = AntdIcons.LinkOutlined;
    const defaultIconColor = isWhiteColor(backgroundColor) ? '#1890ff' : '#ffffff';
    const defaultIconSize = 48;

    return (
      <DefaultIcon
        style={{
          fontSize: defaultIconSize,
          color: defaultIconColor,
        }}
      />
    );
  }, [link.icon, link.name, link.url, link.iconScale, link.backgroundColor]);

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className="cursor-pointer"
      {...(isDraggingEnabled ? listeners : {})}
      {...(isDraggingEnabled ? attributes : {})}
    >
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        <motion.div
          whileHover={{
            y: -4,
            transition: { duration: 0.2 },
          }}
          className="h-full cursor-pointer"
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
            className="link-card h-[5.5rem] box-content cursor-pointer! overflow-hidden rounded-xl"
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
              className="flex-none w-[5.5rem] flex items-center justify-center text-white relative overflow-hidden dark:brightness-[0.8]"
              style={{
                backgroundColor: link.backgroundColor || '#bae0ff',
              }}
              aria-hidden="true"
            >
              {renderIcon}
              {(link.backgroundColor === '#ffffff' ||
                link.backgroundColor === 'rgb(255, 255, 255)' ||
                link.backgroundColor?.indexOf('rgba(255, 255, 255') === 0) && (
                <div className="absolute right-0 top-[21.875%] h-[56.25%] w-0 border-r border-card-border z-0"></div>
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
