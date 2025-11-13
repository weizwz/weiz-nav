'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { showError } from '@/utils/feedback';
import { Category } from '@/types/category';
import { IconPicker } from '@/components/common/IconPicker';

interface EditCategoryModalProps {
  open: boolean;
  category: Category | null;
  onCancel: () => void;
  onSubmit: (data: { name: string; icon: string }) => void;
}

/**
 * 分类编辑弹窗组件
 */
export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  category,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // 当弹窗打开或分类变化时，更新表单
  useEffect(() => {
    if (open) {
      if (category) {
        form.setFieldsValue({
          name: category.name,
          icon: category.icon,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, category, form]);

  // 处理表单提交
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      showError('请检查表单填写是否正确');
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={category ? '编辑分类' : '添加分类'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={category ? '保存' : '添加'}
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          icon: 'AppstoreOutlined',
        }}
      >
        <Form.Item
          label="分类名称"
          name="name"
          rules={[
            { required: true, message: '请输入分类名称' },
            { max: 20, message: '分类名称不能超过20个字符' },
          ]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>

        <Form.Item
          label="图标"
          name="icon"
          rules={[{ required: true, message: '请选择图标' }]}
        >
          <IconPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};
