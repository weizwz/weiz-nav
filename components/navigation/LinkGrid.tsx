'use client';

import React, { useMemo, memo, useCallback } from 'react';
import { Empty } from 'antd';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { reorderLinks } from '@/store/slices/linksSlice';
import { LinkCard } from './LinkCard';
import { Link } from '@/types/link';
import { showSuccess } from '@/utils/feedback';

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
const LinkGridBase: React.FC<LinkGridProps> = ({ onEdit, onDelete, className, style }) => {
  const dispatch = useAppDispatch();
  const links = useAppSelector((state) => state.links.items);
  const currentCategory = useAppSelector((state) => state.ui.currentCategory || '主页');
  const searchQuery = useAppSelector((state) => state.search.query);
  const searchResults = useAppSelector((state) => state.search.results);

  // 配置拖拽传感器 - 需要移动 8px 才触发拖拽，避免与点击冲突
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 限制拖拽范围的修饰符
  const restrictToParentElement = ({ transform, containerNodeRect, draggingNodeRect }: any) => {
    if (!containerNodeRect || !draggingNodeRect) {
      return transform;
    }

    return {
      ...transform,
      x: Math.min(
        Math.max(transform.x, containerNodeRect.left - draggingNodeRect.left),
        containerNodeRect.right - draggingNodeRect.right
      ),
      y: transform.y,
    };
  };

  // 过滤显示的链接
  const displayedLinks = useMemo(() => {
    // 如果有搜索关键词，显示搜索结果
    if (searchQuery.trim()) {
      return searchResults;
    }

    // 如果当前分类是"未分类"，显示所有没有分类的链接
    if (currentCategory === '未分类') {
      return links
        .filter((link) => !link.category || link.category === '')
        .sort((a, b) => a.order - b.order);
    }

    // 根据分类过滤链接，并按 order 排序
    return links
      .filter((link) => link.category === currentCategory)
      .sort((a, b) => a.order - b.order);
  }, [links, currentCategory, searchQuery, searchResults]);

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        // 在所有链接中查找索引（不是 displayedLinks）
        const oldIndex = links.findIndex((link) => link.id === active.id);
        const newIndex = links.findIndex((link) => link.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderLinks({ fromIndex: oldIndex, toIndex: newIndex }));
          showSuccess('链接排序已更新');
        }
      }
    },
    [links, dispatch]
  );

  // 空状态判断
  const isEmpty = displayedLinks.length === 0;
  const isSearchEmpty = searchQuery.trim() && isEmpty;
  const isCategoryEmpty = !searchQuery.trim() && isEmpty;

  // 渲染空状态
  if (isEmpty) {
    if (isSearchEmpty) {
      return (
        <div
          className={className}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
          }}
        >
          <Empty description={<span>没有找到与 &quot;{searchQuery}&quot; 相关的链接</span>} />
        </div>
      );
    }

    if (isCategoryEmpty) {
      return (
        <div
          className={className}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
          }}
        >
          <Empty description={`${currentCategory}分类暂无链接`} />
        </div>
      );
    }
  }

  // 搜索模式下禁用拖拽
  const isDraggingEnabled = !searchQuery.trim();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext
        items={displayedLinks.map((link) => link.id)}
        strategy={rectSortingStrategy}
        disabled={!isDraggingEnabled}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 6xl:grid-cols-9 7xl:grid-cols-10 gap-x-8 gap-y-6 p-4 sm:p-8 md:px-10 max-w-full ${
            className || ''
          }`}
          style={{ ...style, width: '100%', boxSizing: 'border-box' }}
          role="region"
          aria-label={
            searchQuery.trim()
              ? `搜索结果：${displayedLinks.length} 个链接`
              : `${currentCategory}分类：${displayedLinks.length} 个链接`
          }
        >
          {displayedLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              isDraggingEnabled={isDraggingEnabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// 使用 React.memo 优化组件
const LinkGrid = memo(LinkGridBase);

LinkGrid.displayName = 'LinkGrid';

export { LinkGrid };
export default LinkGrid;
