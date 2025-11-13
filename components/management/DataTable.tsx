'use client';

import React, { useState, createContext, useContext } from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@/types/link';
import { showSuccess, showWarning } from '@/utils/feedback';

// 创建 Context 用于传递拖拽句柄
const DragHandleContext = createContext<{
  listeners?: any;
  attributes?: any;
}>({});

interface DataTableProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedKeys: React.Key[]) => void;
}

/**
 * 可拖拽的表格行组件
 */
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const DraggableRow: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  // 将拖拽监听器存储在 context 中，供子组件使用
  return (
    <DragHandleContext.Provider value={{ listeners, attributes }}>
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
      />
    </DragHandleContext.Provider>
  );
};

/**
 * 数据表格组件
 * 支持拖拽排序、行内编辑、批量删除
 */
export const DataTable: React.FC<DataTableProps> = ({
  links,
  onEdit,
  onDelete,
  onBatchDelete,
  onReorder,
  selectedRowKeys: externalSelectedRowKeys,
  onSelectionChange,
}) => {
  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // 使用外部传入的 selectedRowKeys 或内部状态
  const selectedRowKeys = externalSelectedRowKeys !== undefined ? externalSelectedRowKeys : internalSelectedRowKeys;

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
        showSuccess('排序已更新');
      }
    }
  };



  // 拖拽句柄组件
  const DragHandle = () => {
    const { listeners, attributes } = useContext(DragHandleContext);
    return (
      <div {...listeners} {...attributes} style={{ cursor: 'move', display: 'inline-block' }}>
        <DragOutlined style={{ color: '#999' }} />
      </div>
    );
  };

  // 获取所有唯一的分类用于筛选
  const categoryFilters = React.useMemo(() => {
    const categories = Array.from(new Set(links.map(link => link.category || '未分类')));
    return categories.map(category => ({
      text: category,
      value: category,
    }));
  }, [links]);

  // 表格列定义
  const columns: ColumnsType<Link> = [
    {
      title: '',
      key: 'drag',
      width: 50,
      render: () => <DragHandle />,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
          {url}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 240,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      filters: categoryFilters,
      onFilter: (value, record) => (record.category || '未分类') === value,
      render: (category: string) => (
        <Tag color="blue">{category || '未分类'}</Tag>
      ),
    },
    {
      title: '背景颜色',
      dataIndex: 'backgroundColor',
      key: 'backgroundColor',
      width: 120,
      render: (color: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: color || '#1890ff' }}
          />
          <span className="text-xs text-gray-500">{color || '#1890ff'}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
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
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      if (onSelectionChange) {
        onSelectionChange(newSelectedRowKeys);
      } else {
        setInternalSelectedRowKeys(newSelectedRowKeys);
      }
    },
  };

  return (
    <div>
      {/* 数据表格 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((link) => link.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={columns}
            dataSource={links}
            rowKey="id"
            size="middle"
            rowSelection={rowSelection}
            components={{
              body: {
                row: DraggableRow,
              },
            }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 1200 }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DataTable;
