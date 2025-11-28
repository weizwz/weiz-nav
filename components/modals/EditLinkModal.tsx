'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, Select, ColorPicker, Space, Button, Row, Col } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { UndoOutlined, ZoomInOutlined, ZoomOutOutlined, BgColorsOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { Link } from '@/types/link';
import { PRESET_COLORS, isValidColor, getDefaultColor } from '@/utils/colorUtils';
import { getFaviconUrl } from '@/api/favicon';
import { showError } from '@/utils/feedback';
import { useAppSelector } from '@/store/hooks';
import { IconifySelector } from './IconifySelector';

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
  const [iconType, setIconType] = useState<'1' | '2' | '3'>('1'); // 1: Favicon, 2: Iconify, 3: 自定义
  const [previewIcon, setPreviewIcon] = useState<string>('');
  const [previewBgColor, setPreviewBgColor] = useState<string>(getDefaultColor());
  const [iconScale, setIconScale] = useState<number>(0.7);
  const [savedCustomIcon, setSavedCustomIcon] = useState<string>(''); // 保存自定义图标
  const [savedIconifyIcon, setSavedIconifyIcon] = useState<string>(''); // 保存 Iconify 图标
  const [iconifyColor, setIconifyColor] = useState<string>(''); // Iconify 图标颜色
  const categories = useAppSelector((state) => state.categories.items);

  // 检查是否支持 EyeDropper API
  const supportsEyeDropper = React.useMemo(() => {
    return typeof window !== 'undefined' && 'EyeDropper' in window;
  }, []);

  // 渲染图标
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : <Icons.AppstoreOutlined />;
  };

  // 使用 useMemo 计算默认分类，避免 useEffect 依赖项大小变化
  const defaultCategory = React.useMemo(() => {
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    return sortedCategories[0]?.name || '主页';
  }, [categories]);

  // 当弹窗打开或链接数据变化时，更新表单
  useEffect(() => {
    if (open) {
      if (link) {
        // 编辑模式：填充现有数据
        const bgColor = link.backgroundColor || getDefaultColor();
        const scale = link.iconScale || 0.7;
        let iconUrl = link.icon || '';
        
        // 如果图标为空，自动获取 favicon
        if (!iconUrl && link.url) {
          iconUrl = getFaviconUrl(link.url, { larger: true }) || '';
        }
        
        form.setFieldsValue({
          name: link.name,
          url: link.url,
          description: link.description || '',
          category: link.category || '', // 允许为空，不使用默认分类
          icon: iconUrl,
          backgroundColor: bgColor,
          iconScale: scale,
        });
        
        setPreviewIcon(iconUrl);
        setPreviewBgColor(bgColor);
        setIconScale(scale);
        
        // 判断图标类型
        if (iconUrl && iconUrl.includes('api.iconify.design')) {
          setIconType('2'); // Iconify 图标
          // 提取颜色参数
          const urlParams = new URLSearchParams(iconUrl.split('?')[1]);
          const color = urlParams.get('color') || '';
          setIconifyColor(color);
          setSavedIconifyIcon(iconUrl); // 保存 Iconify 图标
        } else if (iconUrl && !iconUrl.includes('favicon.im')) {
          setIconType('3'); // 自定义图标
          setSavedCustomIcon(iconUrl); // 保存自定义图标
        } else {
          setIconType('1'); // Favicon 图标
        }
      } else {
        // 添加模式：重置表单，使用第一个分类作为默认值
        const defaultBg = getDefaultColor();
        form.resetFields();
        form.setFieldsValue({
          category: '', // 新建时也不设置默认分类
          backgroundColor: defaultBg,
          iconScale: 0.7,
        });
        
        setPreviewIcon('');
        setPreviewBgColor(defaultBg);
        setIconScale(0.7);
        setIconType('1');
        setSavedCustomIcon('');
        setSavedIconifyIcon('');
        setIconifyColor('');
      }
    }
  }, [open, link, form, defaultCategory]);

  // 处理 URL 输入变化，自动获取 favicon
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
    // 验证 URL 格式
    if (!url || !/^https?:\/\/.+/.test(url)) {
      setPreviewIcon('');
      return;
    }

    // 只有在 Favicon 模式下才自动更新
    if (iconType === '1') {
      const faviconUrl = getFaviconUrl(url, {larger: true});
      form.setFieldsValue({ icon: faviconUrl || '' });
      setPreviewIcon(faviconUrl || '');
    }
  }, [iconType, form]);

  // 处理图标类型切换
  const handleIconTypeChange = useCallback((value: '1' | '2' | '3') => {
    setIconType(value);
    
    if (value === '1') {
      // 切换到 Favicon 模式，保存当前图标并自动获取 favicon
      const currentIcon = form.getFieldValue('icon');
      if (currentIcon) {
        if (currentIcon.includes('api.iconify.design')) {
          setSavedIconifyIcon(currentIcon);
        } else if (!currentIcon.includes('favicon.im')) {
          setSavedCustomIcon(currentIcon);
        }
      }
      
      const url = form.getFieldValue('url');
      if (url && /^https?:\/\/.+/.test(url)) {
        const faviconUrl = getFaviconUrl(url, {larger: true});
        form.setFieldsValue({ icon: faviconUrl || '' });
        setPreviewIcon(faviconUrl || '');
      }
    } else if (value === '2') {
      // 切换到 Iconify 模式，恢复之前保存的 Iconify 图标
      const iconToRestore = savedIconifyIcon || '';
      form.setFieldsValue({ icon: iconToRestore });
      setPreviewIcon(iconToRestore);
    } else if (value === '3') {
      // 切换到自定义模式，恢复之前保存的自定义图标
      const iconToRestore = savedCustomIcon || '';
      form.setFieldsValue({ icon: iconToRestore });
      setPreviewIcon(iconToRestore);
    }
  }, [form, savedCustomIcon, savedIconifyIcon]);

  // 处理图标 URL 输入
  const handleIconUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const iconUrl = e.target.value.trim();
    form.setFieldsValue({ icon: iconUrl });
    setPreviewIcon(iconUrl);
    // 实时保存自定义图标
    if (iconType === '3') {
      setSavedCustomIcon(iconUrl);
    }
  }, [form, iconType]);

  // 处理 Iconify 图标选择
  const handleIconifyChange = useCallback((iconUrl: string) => {
    form.setFieldsValue({ icon: iconUrl });
    setPreviewIcon(iconUrl);
    setSavedIconifyIcon(iconUrl);
  }, [form]);

  // 处理 Iconify 颜色变化
  const handleIconifyColorChange = useCallback((color: string) => {
    setIconifyColor(color);
    const currentIcon = form.getFieldValue('icon');
    if (currentIcon) {
      // 移除现有的 color 参数
      const baseUrl = currentIcon.split('?')[0];
      // 添加新的颜色参数
      const newUrl = color ? `${baseUrl}?color=${encodeURIComponent(color)}` : baseUrl;
      form.setFieldsValue({ icon: newUrl });
      setPreviewIcon(newUrl);
      setSavedIconifyIcon(newUrl);
    }
  }, [form]);

  // 处理背景色变化
  const handleBgColorChange = useCallback((color: Color) => {
    const colorValue = color.toHexString();
    setPreviewBgColor(colorValue);
    form.setFieldsValue({ backgroundColor: colorValue });
  }, [form]);

  // 处理图标缩放
  const handleScaleChange = useCallback((delta: number) => {
    const newScale = Math.max(0.3, Math.min(1.5, iconScale + delta));
    setIconScale(newScale);
    form.setFieldsValue({ iconScale: newScale });
  }, [form, iconScale]);

  // 重置缩放
  const handleResetScale = useCallback(() => {
    setIconScale(0.7);
    form.setFieldsValue({ iconScale: 0.7 });
  }, [form]);

  // 使用吸管工具选择颜色
  const handleEyeDropper = useCallback(async () => {
    try {
      // @ts-ignore - EyeDropper API 还没有 TypeScript 类型定义
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      
      if (result?.sRGBHex) {
        const color = result.sRGBHex;
        setPreviewBgColor(color);
        form.setFieldsValue({ backgroundColor: color });
      }
    } catch (error: any) {
      // 用户取消选择
      if (error?.message?.includes('cancel')) {
        return;
      }
      // 其他错误
      console.error('吸管工具出错:', error);
      showError('使用吸管工具失败，请确保网站在 HTTPS 或 localhost 下运行');
    }
  }, [form]);

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

      // 构建链接数据 - 确保 iconScale 被包含
      const linkData: Partial<Link> = {
        ...values,
        id: link?.id, // 编辑模式时保留 ID
        iconScale: iconScale, // 使用 state 中的值而不是 form 值
      };

      console.log('提交的链接数据:', linkData); // 调试日志

      onSubmit(linkData);
      form.resetFields();
      setPreviewIcon('');
      setPreviewBgColor(getDefaultColor());
      setIconScale(0.7);
      setIconType('1');
      setSavedCustomIcon('');
      setSavedIconifyIcon('');
      setIconifyColor('');
      setLoading(false);
    } catch (error) {
      // 表单验证失败，界面已有提示
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    setPreviewIcon('');
    setPreviewBgColor(getDefaultColor());
    setIconScale(0.7);
    setIconType('1');
    setSavedCustomIcon('');
    setSavedIconifyIcon('');
    setIconifyColor('');
    onCancel();
  };

  const iconOptions = [
    {
      value: '1',
      label: 'Favicon图标',
    },
    {
      value: '2',
      label: 'Iconify图标',
    },
    {
      value: '3',
      label: '自定义图标',
    },
  ];

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
      aria-labelledby="edit-link-modal-title"
      aria-describedby="edit-link-modal-description"
    >
      <span id="edit-link-modal-title" className="sr-only">
        {link ? '编辑链接表单' : '添加新链接表单'}
      </span>
      <span id="edit-link-modal-description" className="sr-only">
        填写表单以{link ? '编辑' : '添加'}导航链接信息
      </span>
      <div className="pt-2"></div>
      <Form
        form={form}
        labelCol={{ flex: '54px' }}
        autoComplete="off"
        aria-label={link ? '编辑链接表单' : '添加链接表单'}
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
          <Input placeholder="https://example.com" onChange={handleUrlChange} />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入链接名称' },
            { max: 30, message: '名称长度不能超过 30 个字符' },
          ]}
        >
          <Input placeholder="链接名称" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ max: 200, message: '描述长度不能超过 200 个字符' }]}
        >
          <Input.TextArea placeholder="链接描述（可选）" rows={3} showCount maxLength={200} />
        </Form.Item>

        <Form.Item label="分类" name="category">
          <Select placeholder="选择分类（可选）" allowClear>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.name}>
                <span className="mr-2">{renderIcon(category.icon)}</span>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="图标">
          <Space.Compact className="w-full flex">
            <Select
              className="w-32!"
              value={iconType}
              onChange={handleIconTypeChange}
              options={iconOptions}
            />
            {iconType === '2' ? (
              <Form.Item name="icon" className="flex-1 mb-0!">
                <IconifySelector
                  value={form.getFieldValue('icon')}
                  onChange={handleIconifyChange}
                  onColorChange={handleIconifyColorChange}
                  iconColor={iconifyColor}
                />
              </Form.Item>
            ) : (
              <Form.Item name="icon" className="flex-1 mb-0!">
                <Input
                  placeholder={iconType === '1' ? '自动获取' : '输入图标 URL'}
                  disabled={iconType === '1'}
                  onChange={handleIconUrlChange}
                />
              </Form.Item>
            )}
          </Space.Compact>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="背景">
              <Space.Compact>
                <Form.Item name="backgroundColor" noStyle>
                  <ColorPicker
                    presets={[
                      {
                        label: '预设颜色',
                        colors: PRESET_COLORS,
                      },
                    ]}
                    showText
                    format="hex"
                    onChange={handleBgColorChange}
                  />
                </Form.Item>
                {supportsEyeDropper && (
                  <Button
                    icon={<BgColorsOutlined />}
                    onClick={handleEyeDropper}
                    title="使用吸管工具选择颜色"
                  />
                )}
              </Space.Compact>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="预览">
              <div className="flex items-center gap-3">
                {/* 预览卡片 */}
                <div
                  className="w-25 h-25 rounded-xl flex items-center justify-center relative overflow-hidden border border-input-border dark:border-dark-input-border dark:brightness-[0.8] transition-all"
                  style={{ backgroundColor: previewBgColor }}
                >
                  {previewIcon ? (
                    <img
                      key={previewIcon}
                      src={previewIcon}
                      alt="图标预览"
                      className="w-25 h-25 object-contain transition-all"
                      style={{
                        transform: `scale(${iconScale})`,
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-white/40 text-xs text-center px-2">暂无图标</div>
                  )}
                </div>

                {/* 缩放控制按钮 */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="small"
                    icon={<ZoomInOutlined />}
                    onClick={() => handleScaleChange(0.1)}
                    disabled={iconScale >= 1.5}
                    title="放大"
                  />
                  <Button
                    size="small"
                    icon={<ZoomOutOutlined />}
                    onClick={() => handleScaleChange(-0.1)}
                    disabled={iconScale <= 0.3}
                    title="缩小"
                  />
                  <Button
                    size="small"
                    icon={<UndoOutlined />}
                    onClick={handleResetScale}
                    title="重置"
                  />
                </div>

                {/* 缩放比例显示 */}
                <div className="text-sm text-gray-500">{Math.round(iconScale * 100)}%</div>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="iconScale" hidden>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLinkModal;
