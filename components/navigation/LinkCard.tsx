'use client';

import React from 'react';
import { Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { motion } from 'framer-motion';
import * as AntdIcons from '@ant-design/icons';
import { Link } from '@/types/link';

interface LinkCardProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
}

/**
 * LinkCard 组件
 * 显示单个导航链接的卡片，支持自定义图标、背景色和悬停动画
 */
export const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete }) => {
  const handleClick = () => {
    // 在新标签页打开链接
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // 阻止默认浏览器右键菜单
    e.preventDefault();
    e.stopPropagation();
  };

  // 右键菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: '编辑',
      icon: <AntdIcons.EditOutlined />,
      onClick: () => {
        if (onEdit) {
          onEdit(link);
        }
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: <AntdIcons.DeleteOutlined />,
      danger: true,
      onClick: () => {
        if (onDelete) {
          onDelete(link.id);
        }
      },
    },
  ];

  // 渲染图标
  const renderIcon = () => {
    if (!link.icon) {
      // 默认图标
      const DefaultIcon = AntdIcons.LinkOutlined;
      return <DefaultIcon style={{ fontSize: 48 }} />;
    }

    // 检查是否是 URL（自定义图片）
    if (link.icon.startsWith('http://') || link.icon.startsWith('https://') || link.icon.startsWith('/')) {
      return (
        <img 
          src={link.icon} 
          alt={link.name}
          style={{ width: 48, height: 48, objectFit: 'contain' }}
          onError={(e) => {
            // 图片加载失败时显示默认图标
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.className = 'anticon';
            fallback.style.fontSize = '48px';
            fallback.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor"><path d="M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path></svg>';
            target.parentNode?.appendChild(fallback);
          }}
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
  };

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['contextMenu']}
    >
      <motion.div
        whileHover={{ 
          y: -8,
          transition: { duration: 0.2 }
        }}
        style={{ height: '100%' }}
        onContextMenu={handleContextMenu}
      >
        <Card
          hoverable
          onClick={handleClick}
          style={{
            height: 120,
            backgroundColor: link.backgroundColor || '#ffffff',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          bodyStyle={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          className="link-card"
        >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 8,
          width: '100%'
        }}>
          {/* 图标 */}
          <div style={{ 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {renderIcon()}
          </div>
          
          {/* 名称 */}
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            color: 'inherit'
          }}>
            {link.name}
          </div>
          
          {/* 描述 */}
          {link.description && (
            <div style={{
              fontSize: 12,
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              opacity: 0.8,
              color: 'inherit'
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

export default LinkCard;
