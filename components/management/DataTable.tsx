'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Link } from '@/types/link';
import { Category } from '@/types/category';
import { useAppSelector } from '@/store/hooks';

// 树节点类型
interface TreeNode {
  key: string;
  id: string;
  name: string;
  url?: string;
  description?: string;
  category?: string;
  backgroundColor?: string;
  icon?: string;
  iconScale?: number;
  order: number;
  createdAt: number;
  updatedAt: number;
  isCategory?: boolean;
  children?: TreeNode[];
}

interface DataTableProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedKeys: React.Key[]) => void;
}

/**
 * 数据表格组件
 * 使用树表格展示分类和链接的层级关系
 * 支持批量选择、编辑和删除
 */
export const DataTable: React.FC<DataTableProps> = ({
  links,
  onEdit,
  onDelete,
  onEditCategory,
  onDeleteCategory,
  selectedRowKeys: externalSelectedRowKeys,
  onSelectionChange,
}) => {
  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 获取分类数据
  const categories = useAppSelector((state) => state.categories.items);

  // 使用外部传入的 selectedRowKeys 或内部状态
  const selectedRowKeys = externalSelectedRowKeys !== undefined ? externalSelectedRowKeys : internalSelectedRowKeys;

  // 构建树形数据结构
  const treeData = useMemo(() => {
    const tree: TreeNode[] = [];

    // 按分类组织链接
    categories.forEach(category => {
      const categoryLinks = links
        .filter(link => link.category === category.name)
        .sort((a, b) => a.order - b.order)
        .map(link => ({
          key: link.id,
          id: link.id,
          name: link.name,
          url: link.url,
          description: link.description,
          category: link.category,
          backgroundColor: link.backgroundColor,
          icon: link.icon,
          iconScale: link.iconScale,
          order: link.order,
          createdAt: link.createdAt,
          updatedAt: link.updatedAt,
          isCategory: false,
        }));

      tree.push({
        key: `category-${category.id}`,
        id: category.id,
        name: category.name,
        icon: category.icon,
        order: category.order,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        isCategory: true,
        children: categoryLinks,
      });
    });

    // 添加未分类节点（如果有未分类的链接）
    const uncategorizedLinks = links
      .filter(link => !link.category || link.category === '')
      .sort((a, b) => a.order - b.order)
      .map(link => ({
        key: link.id,
        id: link.id,
        name: link.name,
        url: link.url,
        description: link.description,
        category: link.category,
        backgroundColor: link.backgroundColor,
        icon: link.icon,
        iconScale: link.iconScale,
        order: link.order,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        isCategory: false,
      }));

    if (uncategorizedLinks.length > 0) {
      tree.push({
        key: 'category-uncategorized',
        id: 'uncategorized',
        name: '未分类',
        icon: 'InboxOutlined',
        order: 9999, // 放在最后
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isCategory: true,
        children: uncategorizedLinks,
      });
    }

    return tree.sort((a, b) => a.order - b.order);
  }, [links, categories]);

  // 默认展开所有分类（包括未分类）
  useEffect(() => {
    const allCategoryKeys = categories.map(cat => `category-${cat.id}`);
    // 如果有未分类链接，也展开未分类节点
    const hasUncategorized = links.some(link => !link.category || link.category === '');
    if (hasUncategorized) {
      allCategoryKeys.push('category-uncategorized');
    }
    setExpandedRowKeys(allCategoryKeys);
  }, [categories, links]);

  // 表格列定义
  const columns: ColumnsType<TreeNode> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      ellipsis: true,
      render: (name: string, record: TreeNode) => (
        <span className={record.isCategory ? 'font-semibold text-base' : ''}>
          {name}
        </span>
      ),
    },
    {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      ellipsis: true,
      render: (url: string, record: TreeNode) => 
        record.isCategory ? (
          <span className="text-gray-400">-</span>
        ) : url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
            {url}
          </a>
        ) : null,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
      render: (description: string, record: TreeNode) => 
        record.isCategory ? (
          <span className="text-gray-500">共 {record.children?.length || 0} 条链接</span>
        ) : (
          description
        ),
    },
    {
      title: '背景颜色',
      dataIndex: 'backgroundColor',
      key: 'backgroundColor',
      width: 100,
      render: (color: string, record: TreeNode) => 
        record.isCategory ? (
          <span className="text-gray-400">-</span>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color || '#d9d9d9' }}
            />
            <span className="text-xs text-gray-500">{color || '#d9d9d9'}</span>
          </div>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: TreeNode) => {
        if (record.isCategory) {
          // 未分类节点不允许编辑和删除
          if (record.id === 'uncategorized') {
            return <span className="text-gray-400">-</span>;
          }
          
          // 分类节点的操作
          const category: Category = {
            id: record.id,
            name: record.name,
            icon: record.icon || 'AppstoreOutlined',
            order: record.order,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          };
          
          return (
            <Space size="small">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => onEditCategory(category)}
                size="small"
              >
                编辑
              </Button>
              <Popconfirm
                title={
                  record.children && record.children.length > 0
                    ? `该分类下有 ${record.children.length} 个链接，删除后这些链接的分类将被清空。确定要删除吗？`
                    : '确定要删除这个分类吗？'
                }
                onConfirm={() => onDeleteCategory(category)}
                okText="删除"
                cancelText="取消"
                okType="danger"
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        
        // 链接节点的操作
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record as unknown as Link)}
              size="small"
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个链接吗？"
              onConfirm={() => onDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 行选择配置 - 只允许选择链接，不允许选择分类
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      // 过滤掉分类节点
      const linkKeys = newSelectedRowKeys.filter(key => !String(key).startsWith('category-'));
      if (onSelectionChange) {
        onSelectionChange(linkKeys);
      } else {
        setInternalSelectedRowKeys(linkKeys);
      }
    },
    getCheckboxProps: (record: TreeNode) => ({
      disabled: record.isCategory, // 禁用分类节点的复选框
    }),
  };

  return (
    <div>
      {/* 树形数据表格 */}
      <Table
        columns={columns}
        dataSource={treeData}
        rowKey="key"
        size="middle"
        rowSelection={rowSelection}
        rowClassName={(record) => 
          record.isCategory 
            ? 'category-row' 
            : ''
        }
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
          defaultExpandAllRows: true,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showTotal: () => {
            const categoryCount = treeData.length;
            const linkCount = links.length;
            return `共 ${categoryCount} 个分类，${linkCount} 条链接`;
          },
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1200 }}
        className="[&_.ant-empty]:z-0 [&_.category-row>td]:bg-blue-50! [&_.category-row>td]:dark:bg-blue-900/30! [&_.category-row:hover>td]:bg-blue-100! [&_.category-row:hover>td]:dark:bg-blue-800/40!"
      />
    </div>
  );
};

export default DataTable;
