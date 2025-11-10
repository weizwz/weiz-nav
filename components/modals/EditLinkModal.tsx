'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { Link } from '@/types/link';
import { PRESET_COLORS, isValidColor, getDefaultColor } from '@/utils/colorUtils';
import { getFaviconUrl } from '@/api/favicon';
import { showError } from '@/utils/feedback';

interface EditLinkModalProps {
  open: boolean;
  link?: Link | null;
  onCancel: () => void;
  onSubmit: (link: Partial<Link>) => void;
}

/**
 * 编辑链接弹窗组件
 * 支持添加新链接和编辑现有链接
 */
export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  open,
  link,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingIcon, setFetchingIcon] = useState(false);

  // 当弹窗打开或链接数据变化时，更新表单
  useEffect(() => {
    if (open) {
      if (link) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          name: link.name,
          url: link.url,
          description: link.description || '',
          category: link.category || '主页',
          icon: link.icon || '',
          backgroundColor: link.backgroundColor || getDefaultColor(),
        });
      } else {
        // 添加模式：重置表单
        form.resetFields();
        form.setFieldsValue({
          category: '主页',
          backgroundColor: getDefaultColor(),
        });
      }
    }
  }, [open, link, form]);

  // 处理 URL 输入变化，自动获取 favicon
  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
    // 验证 URL 格式
    if (!url || !/^https?:\/\/.+/.test(url)) {
      return;
    }

    // 如果已经有图标，不自动覆盖
    const currentIcon = form.getFieldValue('icon');
    if (currentIcon) {
      return;
    }

    // 获取 favicon
    setFetchingIcon(true);
    try {
      const faviconUrl = getFaviconUrl(url);
      form.setFieldsValue({ icon: faviconUrl });
    } catch (error) {
      console.error('获取图标失败:', error);
    } finally {
      setFetchingIcon(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 验证背景颜色
      if (values.backgroundColor && !isValidColor(values.backgroundColor)) {
        showError('背景颜色格式无效，请选择有效的颜色');
        setLoading(false);
        return;
      }

      // 构建链接数据
      const linkData: Partial<Link> = {
        ...values,
        id: link?.id, // 编辑模式时保留 ID
      };

      onSubmit(linkData);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // Ant Design 表单验证错误
        showError('请检查表单填写是否正确');
      } else {
        showError('提交失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={link ? '编辑链接' : '添加链接'}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="确定"
      cancelText="取消"
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="地址"
          name="url"
          rules={[
            { required: true, message: '请输入链接地址' },
            { type: 'url', message: '请输入有效的 URL 地址' },
            { max: 500, message: '地址长度不能超过 500 个字符' },
          ]}
        >
          <Input
            placeholder="https://example.com"
            onChange={handleUrlChange}
            disabled={fetchingIcon}
          />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入链接名称' },
            { max: 50, message: '名称长度不能超过 50 个字符' },
          ]}
        >
          <Input placeholder="链接名称" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[
            { max: 200, message: '描述长度不能超过 200 个字符' },
          ]}
        >
          <Input.TextArea
            placeholder="链接描述（可选）"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="选择分类">
            <Select.Option value="主页">主页</Select.Option>
            <Select.Option value="工作">工作</Select.Option>
            <Select.Option value="娱乐">娱乐</Select.Option>
            <Select.Option value="学习">学习</Select.Option>
            <Select.Option value="工具">工具</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="图标"
          name="icon"
          extra="可以输入图标 URL 或留空使用默认图标"
        >
          <Input placeholder="图标 URL（可选）" />
        </Form.Item>

        <Form.Item
          label="背景颜色"
          name="backgroundColor"
        >
          <ColorPicker
            presets={[
              {
                label: '预设颜色',
                colors: PRESET_COLORS,
              },
            ]}
            showText
            format="hex"
            onChange={(color: Color) => {
              form.setFieldsValue({ backgroundColor: color.toHexString() });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLinkModal;
