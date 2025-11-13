'use client';

import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, Popconfirm } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLink, updateLink, deleteLink, reorderLinks, resetLinks } from '@/store/slices/linksSlice';
import { DataTable } from '@/components/management/DataTable';
import { EditLinkModal } from '@/components/modals/EditLinkModal';
import { ImportExport } from '@/components/management/ImportExport';
import { ResetDataModal } from '@/components/modals/ResetDataModal';
import { Link } from '@/types/link';
import { defaultLinks } from '@/services/defaultData';
import { storageService } from '@/services/storage';
import { showSuccess, showError, showWarning } from '@/utils/feedback';

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
  const [resetModalOpen, setResetModalOpen] = useState(false);
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

  // 处理拖拽排序
  const handleReorder = (fromIndex: number, toIndex: number) => {
    dispatch(reorderLinks({ fromIndex, toIndex }));
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

      // 保存默认数据到 LocalStorage
      const saveResult = storageService.saveLinks(defaultLinks);
      
      if (!saveResult.success) {
        showError(saveResult.error || '保存默认数据失败');
        return;
      }

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
              <div className='text-xl font-bold py-2 text-gray-900 dark:text-white whitespace-nowrap'>数据管理</div>
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ImportExport />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                已选择 {selectedRowKeys.length} 项
              </span>
            </div>
            <div className='flex gap-4'>
              <Button
                danger
                onClick={handleResetClick}
              >
                重置数据
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
                  onClick={handleBatchDeleteClick}
                  aria-label={selectedRowKeys.length > 0 ? `批量删除选中的 ${selectedRowKeys.length} 个链接` : '批量删除'}
                >
                  批量删除
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                icon={<PlusOutlined aria-hidden="true" />}
                onClick={handleAddNew}
                aria-label="添加新链接"
              >
                添加链接
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
            onBatchDelete={handleBatchDelete}
            onReorder={handleReorder}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={setSelectedRowKeys}
          />
        </div>

        {/* 编辑弹窗 */}
        <EditLinkModal
          open={editModalOpen}
          link={currentLink}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
        />

        {/* 重置数据确认对话框 */}
        <ResetDataModal
          open={resetModalOpen}
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
        />
      </div>
    </div>
  );
}
