'use client';

import React, { useCallback, useMemo, memo, useState, useEffect } from 'react';
import { Dropdown, Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentCategory } from '@/store/slices/settingsSlice';
import { addCategory, deleteCategory, updateCategory, reorderCategories } from '@/store/slices/categoriesSlice';
import { updateLink } from '@/store/slices/linksSlice';
import { EditCategoryModal } from '@/components/modals/EditCategoryModal';
import { Category } from '@/types/category';
import { showSuccess, showConfirm } from '@/utils/feedback';

interface CategorySidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 可拖拽的分类菜单项组件
 */
interface DraggableCategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryName: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  renderIcon: (iconName: string) => React.ReactNode;
}

const DraggableCategoryItem: React.FC<DraggableCategoryItemProps> = ({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  renderIcon,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const contextMenuItems = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => onEdit(category),
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(category),
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <Dropdown
        menu={{ items: contextMenuItems }}
        trigger={['contextMenu']}
      >
        <div
          {...listeners}
          {...attributes}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer
            ${isSelected 
              ? 'text-white shadow-md bg-(--primary)' 
              : 'hover:bg-blue-100 dark:hover:bg-blue-500/50 text-gray-600 dark:text-gray-400'
            }
          `}
          onClick={(e) => {
            // 只有在没有拖拽的情况下才触发点击
            if (!isDragging) {
              onSelect(category.name);
            }
          }}
        >
          {/* 分类图标 */}
          <div className={`w-5 h-5 flex items-center justify-center ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {renderIcon(category.icon)}
          </div>
          
          {/* 分类名称 */}
          <div className={`flex-1 select-none text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
            {category.name}
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

/**
 * CategorySidebar 组件
 * 左侧分类导航组件，显示分类列表并支持增删改
 */
const CategorySidebarBase: React.FC<CategorySidebarProps> = ({ className, style }) => {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector((state) => state.settings.currentCategory || '主页');
  const categories = useAppSelector((state) => state.categories.items);
  const links = useAppSelector((state) => state.links.items);
  const [mounted, setMounted] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // 配置拖拽传感器 - 需要移动 5px 才触发拖拽，避免与点击冲突
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

  // 等待客户端挂载，避免 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理分类切换
  const handleCategoryChange = useCallback((categoryName: string) => {
    dispatch(setCurrentCategory(categoryName));
  }, [dispatch]);

  // 处理拖拽结束
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderCategories({ fromIndex: oldIndex, toIndex: newIndex }));
        showSuccess('分类排序已更新');
      }
    }
  }, [categories, dispatch]);

  // 处理添加分类
  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setEditModalOpen(true);
  }, []);

  // 处理编辑分类
  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditModalOpen(true);
  }, []);

  // 处理删除分类
  const handleDeleteCategory = useCallback((category: Category) => {
    // 查找该分类下的链接数量
    const linksInCategory = links.filter(link => link.category === category.name);
    
    showConfirm({
      title: '确认删除分类',
      content: linksInCategory.length > 0 
        ? `该分类下有 ${linksInCategory.length} 个链接，删除后这些链接将移动到"其他"分类。确定要删除吗？`
        : '确定要删除这个分类吗？',
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        // 将该分类下的所有链接移动到"其他"分类
        if (linksInCategory.length > 0) {
          linksInCategory.forEach(link => {
            dispatch(updateLink({
              id: link.id,
              category: '其他',
            }));
          });
        }
        
        // 删除分类
        dispatch(deleteCategory(category.id));
        
        // 如果删除的是当前选中的分类，切换到"主页"
        if (currentCategory === category.name) {
          dispatch(setCurrentCategory('主页'));
        }
        
        showSuccess('分类已删除');
      },
    });
  }, [dispatch, links, currentCategory]);

  // 处理分类编辑提交
  const handleCategorySubmit = useCallback((data: { name: string; icon: string }) => {
    if (editingCategory) {
      // 更新分类
      const oldName = editingCategory.name;
      dispatch(updateCategory({
        id: editingCategory.id,
        ...data,
      }));
      
      // 更新所有使用该分类的链接
      const linksToUpdate = links.filter(link => link.category === oldName);
      linksToUpdate.forEach(link => {
        dispatch(updateLink({
          id: link.id,
          category: data.name,
        }));
      });
      
      // 如果修改的是当前选中的分类，更新当前分类
      if (currentCategory === oldName) {
        dispatch(setCurrentCategory(data.name));
      }
      
      showSuccess('分类已更新');
    } else {
      // 添加新分类
      dispatch(addCategory(data));
      showSuccess('分类已添加');
    }
    
    setEditModalOpen(false);
    setEditingCategory(null);
  }, [dispatch, editingCategory, links, currentCategory]);

  // 渲染图标
  const renderIcon = useCallback((iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : <Icons.AppstoreOutlined />;
  }, []);

  // 排序后的分类列表
  const sortedCategories = useMemo(() => 
    [...categories].sort((a, b) => a.order - b.order)
  , [categories]);

  // 在挂载前不渲染菜单，避免 hydration 不匹配
  if (!mounted) {
    return (
      <nav 
        className={className} 
        style={style}
        role="navigation"
        aria-label="分类导航"
      >
        <div className="flex flex-col h-full">
          <div style={{ flex: 1 }} />
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={className} 
      style={style}
      role="navigation"
      aria-label="分类导航"
    >
      <div className="flex flex-col h-full">
        {/* 拖拽分类列表 */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedCategories.map((cat) => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sortedCategories.map((category) => (
                <DraggableCategoryItem
                  key={category.id}
                  category={category}
                  isSelected={currentCategory === category.name}
                  onSelect={handleCategoryChange}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {/* 添加分类按钮 */}
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddCategory}
            block
          >
            添加分类
          </Button>
        </div>
      </div>

      {/* 分类编辑弹窗 */}
      <EditCategoryModal
        open={editModalOpen}
        category={editingCategory}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
      />
    </nav>
  );
};

// 使用 React.memo 优化组件
const CategorySidebar = memo(CategorySidebarBase);

CategorySidebar.displayName = 'CategorySidebar';

export { CategorySidebar };
export default CategorySidebar;
