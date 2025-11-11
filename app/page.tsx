'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FloatButton, Drawer } from 'antd';
import { PlusOutlined, MenuOutlined } from '@ant-design/icons';
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
  
  // 移动端侧边栏抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 页面加载时从 Redux store 加载链接数据
  useEffect(() => {
    // 如果 store 中没有数据，尝试从 LocalStorage 加载
    if (links.length === 0) {
      try {
        const savedLinks = storageService.loadLinks();
        if (savedLinks && savedLinks.length > 0) {
          dispatch(loadLinks(savedLinks));
        } else {
          // 如果 LocalStorage 也没有数据，加载默认数据
          dispatch(loadLinks(defaultLinks));
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-theme">
      {/* 页头组件 */}
      <Header />
      
      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧分类导航 - Desktop */}
        <aside 
          className="hidden lg:block w-48 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-theme"
          aria-label="分类导航侧边栏"
        >
          <CategorySidebar />
        </aside>

        {/* 右侧内容区域 */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto"
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

      {/* 移动端侧边栏抽屉 */}
      <Drawer
        title="分类"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        aria-label="移动端分类导航菜单"
        className="lg:hidden"
      >
        <CategorySidebar />
      </Drawer>

      {/* 浮动按钮组 */}
      <FloatButton.Group
        shape="circle"
        style={{ right: 24, bottom: 24 }}
        aria-label="快捷操作"
      >
        {/* 移动端菜单按钮 */}
        <FloatButton
          icon={<MenuOutlined aria-hidden="true" />}
          tooltip="分类菜单"
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden"
          aria-label="打开分类菜单"
        />
        
        {/* 添加链接按钮 */}
        <FloatButton
          icon={<PlusOutlined aria-hidden="true" />}
          type="primary"
          tooltip="添加链接"
          onClick={handleAddClick}
          aria-label="添加新链接"
        />
      </FloatButton.Group>

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
    </div>
  );
}
