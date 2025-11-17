'use client';

import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  DeleteOutlined, 
  TagsOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLink, updateLink, deleteLink, resetLinks } from '@/store/slices/linksSlice';
import { resetCategories, defaultCategories, updateCategory, deleteCategory } from '@/store/slices/categoriesSlice';
import { DataTable } from '@/components/management/DataTable';
import { EditLinkModal } from '@/components/modals/EditLinkModal';
import { EditCategoryModal } from '@/components/modals/EditCategoryModal';
import { ImportExport } from '@/components/management/ImportExport';
import { ResetDataModal } from '@/components/modals/ResetDataModal';
import { BatchCategoryModal } from '@/components/modals/BatchCategoryModal';
import { Link } from '@/types/link';
import { Category } from '@/types/category';
import { defaultLinks } from '@/services/defaultData';
import { storageService } from '@/services/storage';
import { showSuccess, showError, showWarning, showConfirm } from '@/utils/feedback';

/**
 * 数据管理页面
 * 提供链接的可视化管理界面，支持拖拽排序、批量操作
 */
export default function ManagePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const links = useAppSelector((state) => state.links.items);

  const [mounted, setMounted] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Link | null>(null);
  const [categoryEditModalOpen, setCategoryEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [batchCategoryModalOpen, setBatchCategoryModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 等待客户端挂载，避免 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理编辑链接
  const handleEdit = (link: Link) => {
    setCurrentLink(link);
    setEditModalOpen(true);
  };

  // 处理删除链接
  const handleDelete = (id: string) => {
    try {
      dispatch(deleteLink(id));
      showSuccess('删除成功');
    } catch (error) {
      console.error('删除链接失败:', error);
      showError('删除失败，请重试');
    }
  };

  // 处理批量删除点击
  const handleBatchDeleteClick = () => {
    if (selectedRowKeys.length === 0) {
      showWarning('请选择至少1条数据');
      return;
    }
    // 如果有选中项，触发确认对话框
  };

  // 处理批量删除确认
  const handleBatchDelete = () => {
    try {
      selectedRowKeys.forEach((id) => {
        dispatch(deleteLink(id as string));
      });
      showSuccess(`成功删除 ${selectedRowKeys.length} 个链接`);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('批量删除失败:', error);
      showError('批量删除失败，请重试');
    }
  };

  // 处理批量分类点击
  const handleBatchCategoryClick = () => {
    if (selectedRowKeys.length === 0) {
      showWarning('请选择至少1条数据');
      return;
    }
    setBatchCategoryModalOpen(true);
  };

  // 处理批量分类提交
  const handleBatchCategorySubmit = (category: string) => {
    try {
      selectedRowKeys.forEach((id) => {
        dispatch(updateLink({
          id: id as string,
          category,
        }));
      });
      showSuccess(`成功将 ${selectedRowKeys.length} 个链接分类到"${category}"`);
      setSelectedRowKeys([]);
      setBatchCategoryModalOpen(false);
    } catch (error) {
      console.error('批量分类失败:', error);
      showError('批量分类失败，请重试');
    }
  };

  // 处理编辑分类
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryEditModalOpen(true);
  };

  // 处理删除分类
  const handleDeleteCategory = (category: Category) => {
    // 查找该分类下的链接数量
    const linksInCategory = links.filter(link => link.category === category.name);
    
    showConfirm({
      title: '确认删除分类',
      content: linksInCategory.length > 0 
        ? `该分类下有 ${linksInCategory.length} 个链接，删除后这些链接的分类将被清空。确定要删除吗？`
        : '确定要删除这个分类吗？',
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        // 将该分类下的所有链接的分类字段置空
        if (linksInCategory.length > 0) {
          linksInCategory.forEach(link => {
            dispatch(updateLink({
              id: link.id,
              category: '',
            }));
          });
        }
        
        // 删除分类
        dispatch(deleteCategory(category.id));
        showSuccess('分类已删除');
      },
    });
  };

  // 处理分类编辑提交
  const handleCategorySubmit = (data: { name: string; icon: string }) => {
    if (currentCategory) {
      try {
        // 更新分类
        const oldName = currentCategory.name;
        dispatch(updateCategory({
          id: currentCategory.id,
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
        
        showSuccess('分类已更新');
        setCategoryEditModalOpen(false);
        setCurrentCategory(null);
      } catch (error) {
        console.error('更新分类失败:', error);
        showError('更新失败，请重试');
      }
    }
  };

  // 处理添加新链接
  const handleAddNew = () => {
    setCurrentLink(null);
    setEditModalOpen(true);
  };

  // 处理编辑弹窗提交
  const handleModalSubmit = (linkData: Partial<Link>) => {
    try {
      if (linkData.id) {
        // 更新现有链接
        dispatch(updateLink(linkData as any));
        showSuccess('更新成功');
      } else {
        // 添加新链接
        dispatch(addLink(linkData as any));
        showSuccess('添加成功');
      }
      setEditModalOpen(false);
      setCurrentLink(null);
    } catch (error) {
      console.error('保存链接失败:', error);
      showError('保存失败，请重试');
    }
  };

  // 处理编辑弹窗取消
  const handleModalCancel = () => {
    setEditModalOpen(false);
    setCurrentLink(null);
  };

  // 返回主页
  const handleBack = () => {
    router.push('/');
  };

  // 打开重置确认对话框
  const handleResetClick = () => {
    setResetModalOpen(true);
  };

  // 处理数据重置
  const handleResetConfirm = async () => {
    try {
      // 清除 LocalStorage
      const clearResult = storageService.clear();
      
      if (!clearResult.success) {
        showError(clearResult.error || '清除数据失败，请检查浏览器设置');
        return;
      }

      // 重置 Redux store 为默认数据
      dispatch(resetLinks(defaultLinks));
      dispatch(resetCategories(defaultCategories));

      // 保存默认数据到 LocalStorage
      const saveResult = storageService.saveLinks(defaultLinks);
      
      if (!saveResult.success) {
        showError(saveResult.error || '保存默认数据失败');
        return;
      }

      // 保存默认分类到 LocalStorage
      localStorage.setItem('nav_categories', JSON.stringify(defaultCategories));

      // 关闭对话框
      setResetModalOpen(false);

      // 显示成功提示
      showSuccess('数据已重置为默认状态');

      // 延迟刷新页面以确保用户看到成功提示
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Reset data error:', error);
      showError('重置数据时发生错误，请重试');
    }
  };

  // 取消重置
  const handleResetCancel = () => {
    setResetModalOpen(false);
  };

  // 在挂载前显示加载状态，避免 hydration 错误
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        {/* 页头 */}
        <header className="mb-4" role="banner">
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-between items-center">
              {/* Logo/标题 */}
              <div className="flex items-center gap-3 py-2">
                <img 
                  src="/logo.png" 
                  alt="网站Logo" 
                  className="w-6 h-6 object-contain"
                />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  数据管理
                </h1>
              </div>
              <Button
                icon={<ArrowLeftOutlined aria-hidden="true" />}
                onClick={handleBack}
                type="text"
                aria-label="返回主页"
              >
                返回主页
              </Button>
            </div>
          </Space>
        </header>

        {/* 导入导出工具栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <ImportExport />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                已选择 {selectedRowKeys.length} 项
              </span>
            </div>
            <div className='flex flex-wrap gap-2 lg:gap-4'>
              <Button
                danger
                icon={<ReloadOutlined aria-hidden="true" />}
                onClick={handleResetClick}
                aria-label="重置数据"
              >
                <span className="hidden md:inline">重置数据</span>
              </Button>
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个链接吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
                disabled={selectedRowKeys.length === 0}
              >
                <Button 
                  danger
                  icon={<DeleteOutlined aria-hidden="true" />}
                  onClick={handleBatchDeleteClick}
                  aria-label={selectedRowKeys.length > 0 ? `批量删除选中的 ${selectedRowKeys.length} 个链接` : '批量删除'}
                >
                  <span className="hidden md:inline">批量删除</span>
                </Button>
              </Popconfirm>
              <Button
                icon={<TagsOutlined aria-hidden="true" />}
                onClick={handleBatchCategoryClick}
                aria-label={selectedRowKeys.length > 0 ? `批量分类选中的 ${selectedRowKeys.length} 个链接` : '批量分类'}
              >
                <span className="hidden md:inline">批量分类</span>
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined aria-hidden="true" />}
                onClick={handleAddNew}
                aria-label="添加新链接"
              >
                <span className="hidden sm:inline">添加链接</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 数据表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 pt-4">
          <DataTable
            links={links}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={setSelectedRowKeys}
          />
        </div>

        {/* 编辑链接弹窗 */}
        <EditLinkModal
          open={editModalOpen}
          link={currentLink}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
        />

        {/* 编辑分类弹窗 */}
        <EditCategoryModal
          open={categoryEditModalOpen}
          category={currentCategory}
          onCancel={() => {
            setCategoryEditModalOpen(false);
            setCurrentCategory(null);
          }}
          onSubmit={handleCategorySubmit}
        />

        {/* 重置数据确认对话框 */}
        <ResetDataModal
          open={resetModalOpen}
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
        />

        {/* 批量分类弹窗 */}
        <BatchCategoryModal
          open={batchCategoryModalOpen}
          selectedCount={selectedRowKeys.length}
          onCancel={() => setBatchCategoryModalOpen(false)}
          onSubmit={handleBatchCategorySubmit}
        />
      </div>
    </div>
  );
}
