'use client';

import React, { useState } from 'react';
import { Button, Upload, Space } from 'antd';
import { DownloadOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadLinks } from '@/store/slices/linksSlice';
import { loadCategories } from '@/store/slices/categoriesSlice';
import { Link } from '@/types/link';
import type { Category } from '@/types/category';
import { showSuccess, showError, showConfirm, showWarning } from '@/utils/feedback';
import packageInfo from '@/package.json';

/**
 * 验证链接数据格式
 */
const validateLinkData = (data: any): data is Link[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((item) => {
    // 检查必需字段
    if (
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.url !== 'string' ||
      typeof item.description !== 'string' ||
      typeof item.order !== 'number' ||
      typeof item.createdAt !== 'number' ||
      typeof item.updatedAt !== 'number'
    ) {
      return false;
    }

    // 检查可选字段类型
    if (item.icon !== undefined && typeof item.icon !== 'string') {
      return false;
    }
    if (item.backgroundColor !== undefined && typeof item.backgroundColor !== 'string') {
      return false;
    }
    if (item.category !== undefined && typeof item.category !== 'string') {
      return false;
    }
    if (item.tags !== undefined && !Array.isArray(item.tags)) {
      return false;
    }
    if (item.tags && !item.tags.every((tag: any) => typeof tag === 'string')) {
      return false;
    }

    return true;
  });
};

/**
 * 导入导出组件
 * 提供数据的导入和导出功能
 */
export const ImportExport: React.FC = () => {
  const dispatch = useAppDispatch();
  const links = useAppSelector((state) => state.links.items);
  const categories = useAppSelector((state) => state.categories.items);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /**
   * 导出数据为 JSON 文件（树结构格式）
   */
  const handleExport = () => {
    try {
      if (links.length === 0) {
        showWarning('没有可导出的数据');
        return;
      }

      // 构建树结构：将链接按分类组织
      const categoryTree = categories.map((category) => {
        // 找到属于该分类的所有链接
        const categoryLinks = links
          .filter((link) => link.category === category.name)
          .sort((a, b) => a.order - b.order);

        return {
          id: category.id,
          name: category.name,
          icon: category.icon,
          order: category.order,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          links: categoryLinks,
        };
      });

      // 导出树结构格式
      const exportData = {
        version: packageInfo.version,
        exportTime: Date.now(),
        data: categoryTree,
      };

      const jsonData = JSON.stringify(exportData, null, 2);

      // 创建 Blob 对象
      const blob = new Blob([jsonData], { type: 'application/json' });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weiz_nav_${Date.now()}.json`;

      // 触发下载
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('导出成功');
    } catch (error) {
      console.error('Export error:', error);
      showError('导出失败，请重试');
    }
  };

  /**
   * 处理文件上传前的验证
   */
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isJSON = file.type === 'application/json' || file.name.endsWith('.json');

    if (!isJSON) {
      showError('只能上传 JSON 文件');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showError('文件大小不能超过 5MB');
      return Upload.LIST_IGNORE;
    }

    return false; // 阻止自动上传
  };

  /**
   * 处理文件导入
   */
  const handleImport = () => {
    if (fileList.length === 0) {
      showWarning('请先选择要导入的文件');
      return;
    }

    const uploadFile = fileList[0];
    const file = uploadFile.originFileObj;

    if (!file) {
      showError('无法读取文件，请重新选择');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        if (!content || content.trim() === '') {
          showError('文件内容为空');
          return;
        }

        let parsedData;
        try {
          parsedData = JSON.parse(content);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          showError('文件格式错误，无法解析 JSON 数据');
          return;
        }

        let linksData: Link[] = [];
        let categoriesData: Category[] = [];

        // 判断数据格式：树结构 vs 扁平结构
        if (parsedData.data && Array.isArray(parsedData.data)) {
          // 新格式：树结构
          parsedData.data.forEach((categoryNode: any) => {
            // 提取分类信息
            categoriesData.push({
              id: categoryNode.id,
              name: categoryNode.name,
              icon: categoryNode.icon,
              order: categoryNode.order,
              createdAt: categoryNode.createdAt,
              updatedAt: categoryNode.updatedAt,
            });

            // 提取该分类下的链接
            if (categoryNode.links && Array.isArray(categoryNode.links)) {
              linksData.push(...categoryNode.links);
            }
          });
        } else if (parsedData.links && Array.isArray(parsedData.links)) {
          // 旧格式：扁平结构（兼容）
          linksData = parsedData.links;
          categoriesData = parsedData.categories || [];
        } else {
          showError('文件格式不正确，请确保是有效的导航数据');
          return;
        }

        // 验证链接数据格式
        if (!validateLinkData(linksData)) {
          showError('链接数据格式不正确');
          return;
        }

        if (linksData.length === 0) {
          showWarning('导入的文件中没有链接数据');
          return;
        }

        // 合并链接数据：根据 URL 判断是否为同一链接
        const existingLinksMap = new Map(links.map((link) => [link.url, link]));
        const mergedLinks: Link[] = [];
        let newLinksCount = 0;
        let updatedLinksCount = 0;

        linksData.forEach((importedLink: Link) => {
          const existingLink = existingLinksMap.get(importedLink.url);
          if (existingLink) {
            // URL 相同，更新其他字段
            mergedLinks.push({
              ...existingLink,
              ...importedLink,
              id: existingLink.id, // 保留原有 ID
              createdAt: existingLink.createdAt, // 保留创建时间
              updatedAt: Date.now(), // 更新修改时间
            });
            updatedLinksCount++;
            existingLinksMap.delete(importedLink.url); // 标记为已处理
          } else {
            // 新链接
            mergedLinks.push({
              ...importedLink,
              updatedAt: Date.now(),
            });
            newLinksCount++;
          }
        });

        // 添加未被更新的现有链接
        existingLinksMap.forEach((link) => {
          mergedLinks.push(link);
        });

        // 重新排序
        const sortedLinks = mergedLinks.map((link, index) => ({
          ...link,
          order: index,
        }));

        // 合并分类数据：根据分类名称判断
        const existingCategoriesMap = new Map(categories.map((cat) => [cat.name, cat]));
        const updatedCategories: Category[] = [];
        const newCategories: Category[] = [];
        let updatedCategoriesCount = 0;

        categoriesData.forEach((importedCategory: Category) => {
          const existingCategory = existingCategoriesMap.get(importedCategory.name);
          if (existingCategory) {
            // 名称相同，更新其他字段（保留原有排序）
            updatedCategories.push({
              ...existingCategory,
              ...importedCategory,
              id: existingCategory.id, // 保留原有 ID
              order: existingCategory.order, // 保留原有排序
              createdAt: existingCategory.createdAt, // 保留创建时间
              updatedAt: Date.now(), // 更新修改时间
            });
            updatedCategoriesCount++;
            existingCategoriesMap.delete(importedCategory.name); // 标记为已处理
          } else {
            // 新分类，暂存
            newCategories.push({
              ...importedCategory,
              updatedAt: Date.now(),
            });
          }
        });

        // 添加未被更新的现有分类
        const unchangedCategories: Category[] = [];
        existingCategoriesMap.forEach((cat) => {
          unchangedCategories.push(cat);
        });

        // 合并所有分类并按原有 order 排序
        const allCategories = [...updatedCategories, ...unchangedCategories].sort(
          (a, b) => a.order - b.order
        );

        // 为新分类分配排序位置
        const usedOrders = new Set(allCategories.map((cat) => cat.order));
        newCategories.forEach((newCat) => {
          let targetOrder = newCat.order;
          // 如果目标位置已被占用，找到下一个可用位置
          while (usedOrders.has(targetOrder)) {
            targetOrder++;
          }
          newCat.order = targetOrder;
          usedOrders.add(targetOrder);
          allCategories.push(newCat);
        });

        // 最终排序
        const sortedCategories = allCategories.sort((a, b) => a.order - b.order);
        const newCategoriesCount = newCategories.length;

        // 显示确认对话框
        const message =
          `即将导入数据：\n` +
          `• 链接：新增 ${newLinksCount} 个，更新 ${updatedLinksCount} 个\n` +
          `• 分类：新增 ${newCategoriesCount} 个，更新 ${updatedCategoriesCount} 个\n` +
          `是否继续？`;

        showConfirm({
          title: '确认导入',
          icon: <ExclamationCircleOutlined />,
          content: message,
          okText: '确认导入',
          cancelText: '取消',
          onOk: () => {
            try {
              // 更新 Redux store
              dispatch(loadLinks(sortedLinks));
              dispatch(loadCategories(sortedCategories));

              // 保存到 LocalStorage
              localStorage.setItem('nav_links', JSON.stringify(sortedLinks));
              localStorage.setItem('nav_categories', JSON.stringify(sortedCategories));

              showSuccess(
                `成功导入：新增 ${newLinksCount} 个链接，更新 ${updatedLinksCount} 个链接`
              );
              setFileList([]);
            } catch (saveError) {
              console.error('Save error:', saveError);
              showError('保存导入数据失败，请重试');
            }
          },
        });
      } catch (error) {
        console.error('Import error:', error);
        showError('导入失败，请重试');
      }
    };

    reader.onerror = (error) => {
      console.error('File read error:', error);
      showError('文件读取失败，请重试');
    };

    reader.readAsText(file);
  };

  /**
   * 处理文件列表变化
   */
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 只保留最新的一个文件
    setFileList(newFileList.slice(-1));
  };

  /**
   * 处理文件移除
   */
  const handleRemove = () => {
    setFileList([]);
  };

  return (
    <Space size="middle">
      {/* 导出按钮 */}
      <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={links.length === 0}>
        导出数据
      </Button>

      {/* 导入区域 */}
      <div className="flex items-center gap-2">
        <Upload
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          maxCount={1}
          accept=".json"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>

        {/* 已选择文件显示 */}
        {fileList.length > 0 && (
          <span
            className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate"
            title={fileList[0].name}
          >
            {fileList[0].name}
          </span>
        )}

        <Button type="primary" onClick={handleImport} disabled={fileList.length === 0}>
          导入
        </Button>
      </div>
    </Space>
  );
};
