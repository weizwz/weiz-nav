'use client';

import React, { useCallback, useMemo, memo, useState, useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentCategory } from '@/store/slices/settingsSlice';
import { addCategory, deleteCategory, updateCategory } from '@/store/slices/categoriesSlice';
import { updateLink } from '@/store/slices/linksSlice';
import { EditCategoryModal } from '@/components/modals/EditCategoryModal';
import { Category } from '@/types/category';
import { showSuccess, showConfirm } from '@/utils/feedback';

interface CategorySidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

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

  // 等待客户端挂载，避免 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理分类切换
  const handleCategoryChange: MenuProps['onClick'] = useCallback((e: { key: string }) => {
    dispatch(setCurrentCategory(e.key));
  }, [dispatch]);

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

  // 生成右键菜单
  const getContextMenu = useCallback((category: Category): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditCategory(category),
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteCategory(category),
    },
  ], [handleEditCategory, handleDeleteCategory]);

  // 生成菜单项
  const menuItems: MenuProps['items'] = useMemo(() => 
    categories.map((category) => ({
      key: category.name,
      icon: <span className="text-base">{category.icon}</span>,
      label: (
        <Dropdown
          menu={{ items: getContextMenu(category) }}
          trigger={['contextMenu']}
        >
          <div className="w-full">{category.name}</div>
        </Dropdown>
      ),
    }))
  , [categories, getContextMenu]);

  return (
    <nav 
      className={className} 
      style={style}
      role="navigation"
      aria-label="分类导航"
    >
      <div className="flex flex-col h-full">
        <Menu
          mode="inline"
          selectedKeys={mounted ? [currentCategory] : ['主页']}
          onClick={handleCategoryChange}
          items={menuItems}
          style={{ 
            flex: 1,
            borderRight: 0,
          }}
          aria-label="导航链接分类列表"
        />
        
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
