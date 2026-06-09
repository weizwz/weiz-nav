'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import * as Icons from '@ant-design/icons';
import { useAppSelector } from '@weiz-nav/store/hooks';

interface BatchCategoryModalProps {
  open: boolean;
  selectedCount: number;
  onCancel: () => void;
  onSubmit: (category: string) => void;
}

/**
 * 批量分类弹窗组件
 * 用于批量修改选中链接的分类
 */
export const BatchCategoryModal: React.FC<BatchCategoryModalProps> = ({
  open,
  selectedCount,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const categories = useAppSelector((state) => state.categories.items);

  // 渲染图标
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : <Icons.AppstoreOutlined />;
  };

  // 当弹窗打开时，重置表单
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.category);
      form.resetFields();
    } catch (error) {
      // 表单验证失败
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="批量分类"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      width={500}
    >
      <div className="mb-4 text-gray-600">
        已选择 <span className="font-semibold text-blue-600">{selectedCount}</span> 个链接
      </div>
      <Form
        form={form}
        labelCol={{ flex: '54px' }}
        autoComplete="off"
      >
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="选择分类">
            {categories
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <Select.Option key={category.id} value={category.name}>
                  <span className="mr-2">{renderIcon(category.icon)}</span>
                  {category.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BatchCategoryModal;
