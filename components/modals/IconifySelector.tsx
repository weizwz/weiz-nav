'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Input, List, Popover, Spin, Empty, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { iconifyApi, type IconOption } from '@/api/iconify';
import { PRESET_COLORS } from '@/utils/colorUtils';

/**
 * IconifySelector 组件 Props
 */
interface IconifySelectorProps {
  /** 当前选中的图标 URL */
  value?: string;
  /** 图标变化回调 */
  onChange?: (iconUrl: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 图标颜色变化回调 */
  onColorChange?: (color: string) => void;
  /** 当前图标颜色 */
  iconColor?: string;
}

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 图标选项渲染组件
 */
const IconOptionItem: React.FC<{
  icon: IconOption;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, selected, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <List.Item
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={selected}
      aria-label={`${icon.label} 图标`}
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-4 py-2"
      style={{
        backgroundColor: selected ? 'rgba(24, 144, 255, 0.1)' : undefined,
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!imageError ? (
            <img
              src={icon.url}
              alt={icon.label}
              className="w-6 h-6 shrink-0"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-6 h-6 shrink-0 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
              ?
            </div>
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {icon.label}
          </span>
        </div>
        {selected && (
          <CheckOutlined className="text-blue-500 shrink-0 ml-2" />
        )}
      </div>
    </List.Item>
  );
};

/**
 * IconifySelector 组件
 * 提供 Iconify 图标搜索和选择功能
 */
export const IconifySelector: React.FC<IconifySelectorProps> = ({
  value = '',
  onChange,
  disabled = false,
  placeholder = '搜索 Iconify 图标',
  onColorChange,
  iconColor = '',
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<IconOption[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconOption | null>(null);
  const [error, setError] = useState<string>('');
  
  const searchInputRef = useRef<any>(null);
  const searchCacheRef = useRef<Map<string, { results: IconOption[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟

  // 初始化：如果有 value，尝试解析为 IconOption
  useEffect(() => {
    if (value) {
      const identifier = extractIconIdentifier(value);
      console.log('IconifySelector 初始化:', { value, identifier });
      
      if (identifier && iconifyApi.isValidIconIdentifier(identifier)) {
        const label = identifier.split(':')[1] || identifier;
        console.log('设置选中图标:', { identifier, label });
        setSelectedIcon({
          value: identifier,
          label,
          url: value,
        });
      }
    }
  }, [value]);

  // 从 URL 提取图标标识符
  const extractIconIdentifier = (url: string): string => {
    // URL 格式: https://api.iconify.design/prefix:name.svg 或 https://api.iconify.design/prefix:name.svg?color=white
    // 先移除查询参数
    const urlWithoutParams = url.split('?')[0];
    const match = urlWithoutParams.match(/\/([^/]+)\.svg$/);
    return match ? match[1] : '';
  };

  // 搜索图标
  const searchIcons = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setOptions([]);
      setError('');
      return;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();

    // 检查缓存
    const cached = searchCacheRef.current.get(trimmedQuery);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('使用缓存的搜索结果:', trimmedQuery);
      setOptions(cached.results);
      if (cached.results.length === 0) {
        setError('未找到相关图标');
      }
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await iconifyApi.searchIcons({
        query: trimmedQuery,
        limit: 200,
      });

      // 缓存结果
      searchCacheRef.current.set(trimmedQuery, {
        results,
        timestamp: Date.now(),
      });

      setOptions(results);
      
      if (results.length === 0) {
        setError('未找到相关图标');
      }
    } catch (err) {
      console.error('搜索图标失败:', err);
      setError('搜索失败，请稍后重试');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [CACHE_DURATION]);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(searchIcons, 500),
    [searchIcons]
  );

  // 处理搜索输入
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  // 处理图标选择
  const handleIconSelect = useCallback(
    (icon: IconOption) => {
      setSelectedIcon(icon);
      setOpen(false);
      
      if (onChange) {
        // 如果有颜色，添加 color 参数
        const iconUrl = iconColor ? `${icon.url}?color=${encodeURIComponent(iconColor)}` : icon.url;
        onChange(iconUrl);
      }
    },
    [onChange, iconColor]
  );

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    []
  );

  // 处理下拉框打开
  const handleOpenChange = useCallback((visible: boolean) => {
    console.log('下拉框状态变化:', { visible, selectedIcon });
    setOpen(visible);
    
    if (visible) {
      // 打开时，如果有选中的图标，回填图标名称到搜索框
      if (selectedIcon) {
        console.log('回填图标名称:', selectedIcon.label);
        setQuery(selectedIcon.label);
        // 自动搜索该图标名称
        searchIcons(selectedIcon.label);
      }
      // 聚焦搜索框
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // 关闭时清空搜索
      setQuery('');
      setOptions([]);
      setError('');
    }
  }, [selectedIcon, searchIcons]);

  // 渲染下拉内容
  const renderContent = () => (
    <div 
      className="w-80" 
      style={{ maxHeight: '400px' }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label="Iconify 图标选择器"
    >
      {/* 搜索输入框 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <Input
          ref={searchInputRef}
          prefix={<SearchOutlined />}
          placeholder={placeholder}
          value={query}
          onChange={handleSearchChange}
          allowClear
          aria-label="搜索图标"
        />
      </div>

      {/* 图标列表 */}
      <div 
        className="overflow-y-auto" 
        style={{ maxHeight: '320px' }}
        role="listbox"
        aria-label="图标列表"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
            <Spin />
            <span className="ml-2 text-gray-500">搜索中...</span>
          </div>
        ) : error ? (
          <div role="alert">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={error}
              className="py-8"
            />
          </div>
        ) : options.length > 0 ? (
          <List
            dataSource={options}
            renderItem={(icon) => (
              <IconOptionItem
                key={icon.value}
                icon={icon}
                selected={selectedIcon?.value === icon.value}
                onClick={() => handleIconSelect(icon)}
              />
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="请输入关键词搜索图标"
            className="py-8"
          />
        )}
      </div>
    </div>
  );

  // 处理颜色变化
  const handleColorChange = useCallback((color: Color) => {
    const colorValue = color.toHexString();
    if (onColorChange) {
      onColorChange(colorValue);
    }
  }, [onColorChange]);

  return (
    <div className="flex items-center flex-1">
      <Popover
        content={renderContent()}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        placement="bottomLeft"
      >
        <Button
          disabled={disabled}
          className="flex-1 justify-start rounded-r-none! border-r-0!"
          style={{ textAlign: 'left' }}
          aria-label="选择 Iconify 图标"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {selectedIcon ? (
            <div className="flex items-center gap-2">
              <img
                src={iconColor ? `${selectedIcon.url}?color=${encodeURIComponent(iconColor)}` : selectedIcon.url}
                alt={selectedIcon.label}
                className="w-5 h-5"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="overflow-hidden text-ellipsis">
                {selectedIcon.label}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">选择 Iconify 图标</span>
          )}
        </Button>
      </Popover>
      <ColorPicker
        className='w-28'
        value={iconColor || '#000000'}
        onChange={handleColorChange}
        presets={[
          {
            label: '预设颜色',
            colors: PRESET_COLORS,
          },
        ]}
        showText
        format="hex"
      />
    </div>
  );
};

export default IconifySelector;
