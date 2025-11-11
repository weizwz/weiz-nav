'use client';

import React, { useMemo, memo } from 'react';
import { Empty } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { LinkCard } from './LinkCard';
import { Link } from '@/types/link';

interface LinkGridProps {
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LinkGrid 组件
 * 响应式网格布局显示链接卡片
 * 支持根据分类和搜索状态过滤链接
 * 使用 React.memo 和 useMemo 优化性能
 */
const LinkGridBase: React.FC<LinkGridProps> = ({ 
  onEdit, 
  onDelete,
  className,
  style 
}) => {
  const links = useAppSelector((state) => state.links.items);
  const currentCategory = useAppSelector((state) => state.settings.currentCategory || '主页');
  const searchQuery = useAppSelector((state) => state.search.query);
  const searchResults = useAppSelector((state) => state.search.results);
  const isSearching = useAppSelector((state) => state.search.isSearching);

  // 过滤显示的链接
  const displayedLinks = useMemo(() => {
    // 如果正在搜索，显示搜索结果
    if (isSearching && searchQuery.trim()) {
      return searchResults;
    }

    // 否则根据分类过滤
    // 如果分类是"主页"，显示所有链接
    if (currentCategory === '主页') {
      return links;
    }

    // 过滤指定分类的链接
    return links.filter((link) => link.category === currentCategory);
  }, [links, currentCategory, searchQuery, searchResults, isSearching]);

  // 空状态判断
  const isEmpty = displayedLinks.length === 0;
  const isSearchEmpty = isSearching && searchQuery.trim() && isEmpty;
  const isCategoryEmpty = !isSearching && isEmpty;

  // 渲染空状态
  if (isEmpty) {
    if (isSearchEmpty) {
      return (
        <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Empty
            description={
              <span>
                没有找到与 &quot;{searchQuery}&quot; 相关的链接
              </span>
            }
          />
        </div>
      );
    }

    if (isCategoryEmpty) {
      return (
        <div className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Empty
            description={
              currentCategory === '主页' 
                ? '暂无链接，点击右下角按钮添加' 
                : `${currentCategory}分类暂无链接`
            }
          />
        </div>
      );
    }
  }

  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-8 ${className || ''}`}
      style={style}
      role="region"
      aria-label={isSearching ? `搜索结果：${displayedLinks.length} 个链接` : `${currentCategory}分类：${displayedLinks.length} 个链接`}
    >
      {displayedLinks.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// 使用 React.memo 优化组件
const LinkGrid = memo(LinkGridBase);

LinkGrid.displayName = 'LinkGrid';

export { LinkGrid };
export default LinkGrid;
