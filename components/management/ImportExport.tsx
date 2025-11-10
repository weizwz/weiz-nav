'use client';

import React, { useState } from 'react';
import { Button, Upload, Space, Modal } from 'antd';
import { DownloadOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadLinks } from '@/store/slices/linksSlice';
import { Link } from '@/types/link';
import { showSuccess, showError, showWarning } from '@/utils/feedback';

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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  /**
   * 导出数据为 JSON 文件
   */
  const handleExport = () => {
    try {
      if (links.length === 0) {
        showWarning('没有可导出的数据');
        return;
      }

      // 将链接数据转换为 JSON 字符串
      const jsonData = JSON.stringify(links, null, 2);
      
      // 创建 Blob 对象
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `navigation-links-${Date.now()}.json`;
      
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

    const file = fileList[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (!content || content.trim() === '') {
          showError('文件内容为空');
          return;
        }

        let data;
        try {
          data = JSON.parse(content);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          showError('文件格式错误，无法解析 JSON 数据');
          return;
        }

        // 验证数据格式
        if (!validateLinkData(data)) {
          showError('文件格式不正确，请确保是有效的导航链接数据');
          return;
        }

        if (data.length === 0) {
          showWarning('导入的文件中没有链接数据');
          return;
        }

        // 显示确认对话框
        Modal.confirm({
          title: '确认导入',
          icon: <ExclamationCircleOutlined />,
          content: `即将导入 ${data.length} 个链接，这将覆盖当前所有数据。是否继续？`,
          okText: '确认导入',
          cancelText: '取消',
          onOk: () => {
            try {
              // 更新 Redux store
              dispatch(loadLinks(data));
              
              // 保存到 LocalStorage
              localStorage.setItem('nav_links', JSON.stringify(data));
              
              showSuccess(`成功导入 ${data.length} 个链接`);
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

    reader.readAsText(file as any);
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
      <Button
        icon={<DownloadOutlined />}
        onClick={handleExport}
        disabled={links.length === 0}
      >
        导出数据
      </Button>

      {/* 导入区域 */}
      <Space.Compact>
        <Upload
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          maxCount={1}
          accept=".json"
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleImport}
          disabled={fileList.length === 0}
        >
          导入
        </Button>
      </Space.Compact>
    </Space>
  );
};
