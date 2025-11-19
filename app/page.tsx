'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FloatButton, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLink, updateLink, deleteLink, loadLinks } from '@/store/slices/linksSlice';
import { storageService } from '@/services/storage';
import { defaultLinks } from '@/services/defaultData';
import { showSuccess, showError } from '@/utils/feedback';
import Header from '@/components/layout/Header';
import { CategorySidebar } from '@/components/navigation/CategorySidebar';
import { LinkGrid } from '@/components/navigation/LinkGrid';
import { LinkGridSkeleton } from '@/components/navigation/LinkGridSkeleton';
import { EditLinkModal } from '@/components/modals/EditLinkModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import InstallPrompt from '@/components/common/InstallPrompt';
import { Link } from '@/types/link';

/**
 * 主页组件
 * 实现左右布局：左侧分类导航，右侧内容区域（Header + LinkGrid）
 * 支持添加、编辑、删除链接
 * 响应式布局：移动端使用抽屉式侧边栏
 */
export default function Home() {
  const dispatch = useAppDispatch();
  const links = useAppSelector((state) => state.links.items);
  
  // 编辑弹窗状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  
  // 删除确认弹窗状态
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  
  // 侧边栏抽屉状态（移动端）
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 页面加载时从 Redux store 加载链接数据
  useEffect(() => {
    // 如果 store 中没有数据，尝试从 LocalStorage 加载
    if (links.length === 0) {
      try {
        const savedLinks = storageService.loadLinks();
        if (savedLinks !== null) {
          // localStorage 中有数据（可能是空数组或有内容的数组）
          dispatch(loadLinks(savedLinks));
        } else {
          // localStorage 中没有数据，说明是首次访问，加载默认数据
          dispatch(loadLinks(defaultLinks));
          // 保存默认数据到 localStorage
          storageService.saveLinks(defaultLinks);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        showError('加载数据失败，已使用默认数据');
        // 加载失败时使用默认数据
        dispatch(loadLinks(defaultLinks));
      }
    }
    // 设置加载完成
    setIsLoading(false);
  }, [dispatch, links.length]);

  // 使用 useCallback 缓存事件处理函数，避免子组件不必要的重渲染
  
  // 处理添加链接按钮点击
  const handleAddClick = useCallback(() => {
    setEditingLink(null);
    setEditModalOpen(true);
  }, []);

  // 处理编辑链接
  const handleEdit = useCallback((link: Link) => {
    setEditingLink(link);
    setEditModalOpen(true);
  }, []);

  // 处理删除链接
  const handleDelete = useCallback((id: string) => {
    setDeletingLinkId(id);
    setDeleteModalOpen(true);
  }, []);

  // 处理编辑弹窗提交
  const handleEditSubmit = useCallback((linkData: Partial<Link>) => {
    try {
      if (editingLink) {
        // 更新现有链接
        dispatch(updateLink({
          ...linkData,
          id: editingLink.id,
        }));
        showSuccess('链接更新成功');
      } else {
        // 添加新链接
        dispatch(addLink(linkData as any));
        showSuccess('链接添加成功');
      }
      setEditModalOpen(false);
      setEditingLink(null);
    } catch (error) {
      console.error('保存链接失败:', error);
      showError('保存链接失败，请重试');
    }
  }, [dispatch, editingLink]);

  // 处理编辑弹窗取消
  const handleEditCancel = useCallback(() => {
    setEditModalOpen(false);
    setEditingLink(null);
  }, []);

  // 处理删除确认
  const handleDeleteConfirm = useCallback(() => {
    if (deletingLinkId) {
      try {
        dispatch(deleteLink(deletingLinkId));
        showSuccess('链接删除成功');
        setDeleteModalOpen(false);
        setDeletingLinkId(null);
      } catch (error) {
        console.error('删除链接失败:', error);
        showError('删除链接失败，请重试');
      }
    }
  }, [dispatch, deletingLinkId]);

  // 处理删除取消
  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setDeletingLinkId(null);
  }, []);

  // 获取要删除的链接名称 - 使用 useMemo 缓存
  const deletingLinkName = React.useMemo(() => 
    deletingLinkId
      ? links.find(link => link.id === deletingLinkId)?.name
      : '',
    [deletingLinkId, links]
  );

  return (
    <div className="h-screen flex flex-col bg-(--background) transition-theme overflow-hidden">
      {/* 固定顶部 Header */}
      <div className="flex-none">
        <Header onMenuClick={() => setDrawerOpen(true)} />
      </div>
      
      {/* 主内容区域 - 固定高度，内部滚动 */}
      <div className="flex-1 flex overflow-hidden">

        {/* 左侧分类导航 - Desktop - 固定，内部滚动 */}
        <aside 
          className="hidden lg:flex flex-col w-48 bg-white dark:bg-antd-dark border-r border-gray-200 dark:border-neutral-700 transition-theme overflow-hidden"
          aria-label="分类导航侧边栏"
        >
          <CategorySidebar className="h-full" />
        </aside>

        {/* 移动端抽屉 - 分类导航 */}
        <Drawer
          title="分类"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          className="lg:hidden"
          width={280}
          styles={{
            body: { padding: 0, height: '100%' }
          }}
        >
          <CategorySidebar className="h-full" />
        </Drawer>

        {/* 右侧内容区域 - 只有这里滚动 */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto overflow-x-hidden"
          role="main"
          aria-label="导航链接主内容区"
        >
          {isLoading ? (
            <LinkGridSkeleton />
          ) : (
            <LinkGrid
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      {/* 添加链接浮动按钮 */}
      <FloatButton
        icon={<PlusOutlined aria-hidden="true" />}
        type="primary"
        tooltip="添加链接"
        onClick={handleAddClick}
        aria-label="添加新链接"
        style={{ right: 24, bottom: 24 }}
      />

      {/* 编辑链接弹窗 */}
      <EditLinkModal
        open={editModalOpen}
        link={editingLink}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        open={deleteModalOpen}
        title="确认删除"
        content={`确定要删除链接 "${deletingLinkName}" 吗？此操作无法撤销。`}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="删除"
        cancelText="取消"
        okType="danger"
      />

      {/* PWA 安装提示 */}
      <InstallPrompt />
    </div>
  );
}
