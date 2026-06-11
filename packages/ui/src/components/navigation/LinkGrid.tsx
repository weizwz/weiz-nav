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
import { useAppSelector, useAppDispatch } from '@weiz-nav/store/hooks';
import { reorderLinks } from '@weiz-nav/store/slices/linksSlice';
import { LinkCard } from './LinkCard';
import { Link } from '@weiz-nav/core/link';
import { showSuccess } from '../../utils/feedback';

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
  const categories = useAppSelector((state) => state.categories.items);

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

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        // 在所有链接中查找索引
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

  // 提取所有需要渲染的分类名称（预设分类 + 实际存在的未分类）
  const allCategoryNames = useMemo(() => {
    const names = new Set(categories.map((c) => c.name));
    // 确保包含所有链接所在的分类，防止孤儿分类无法显示
    links.forEach((l) => {
      names.add(l.category || '未分类');
    });
    // 确保当前选中的分类也在其中（比如刚添加的空分类）
    names.add(currentCategory);
    return Array.from(names);
  }, [categories, links, currentCategory]);

  // 渲染单个分类或搜索结果的网格
  const renderGrid = (items: Link[], isSearch: boolean, categoryName?: string) => {
    if (items.length === 0) {
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
          <Empty
            description={
              isSearch ? `没有找到与 "${searchQuery}" 相关的链接` : `${categoryName}分类暂无链接`
            }
          />
        </div>
      );
    }

    const isDraggingEnabled = !isSearch;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={items.map((link) => link.id)}
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
              isSearch
                ? `搜索结果：${items.length} 个链接`
                : `${categoryName}分类：${items.length} 个链接`
            }
          >
            {items.map((link) => (
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

  const isSearchMode = searchQuery.trim().length > 0;

  return (
    <>
      {/* 搜索结果（不需要 DOM 缓存，每次搜索动态渲染） */}
      {isSearchMode && <div style={{ display: 'block' }}>{renderGrid(searchResults, true)}</div>}

      {/* 分类模式 DOM 缓存 (KeepAlive) */}
      {allCategoryNames.map((categoryName) => {
        // 只有在非搜索模式，且当前分类匹配时才可见
        const isVisible = !isSearchMode && categoryName === currentCategory;

        // 提取该分类下的所有链接
        const categoryLinks = links
          .filter((link) => (link.category || '未分类') === categoryName)
          .sort((a, b) => a.order - b.order);

        return (
          <div key={categoryName} style={{ display: isVisible ? 'block' : 'none' }}>
            {renderGrid(categoryLinks, false, categoryName)}
          </div>
        );
      })}
    </>
  );
};

// 使用 React.memo 优化组件
const LinkGrid = memo(LinkGridBase);

LinkGrid.displayName = 'LinkGrid';

export { LinkGrid };
export default LinkGrid;
