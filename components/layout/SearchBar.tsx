'use client';

import React, { useState, useEffect } from 'react';
import { Input, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  GoogleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { performDebouncedSearch, clearSearch } from '@/store/slices/searchSlice';
import { setSearchEngine } from '@/store/slices/settingsSlice';
import { SEARCH_ENGINES, getSearchUrl, getSearchEngine } from '@/services/search';
import { storageService } from '@/services/storage';

const { Search } = Input;

/**
 * SearchBar 组件
 * 实现搜索栏功能，包括：
 * - 站内实时搜索（防抖）
 * - 搜索引擎切换
 * - 回车键打开外部搜索引擎
 * - 清除搜索
 */
export default function SearchBar() {
  const dispatch = useAppDispatch();
  
  // 从 Redux 获取状态
  const searchQuery = useAppSelector((state) => state.search.query);
  const currentEngineId = useAppSelector((state) => state.settings.searchEngine);
  const settings = useAppSelector((state) => state.settings);
  
  // 本地状态
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // 获取当前搜索引擎配置
  const currentEngine = getSearchEngine(currentEngineId);
  
  // 同步 Redux 状态到本地输入框
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  /**
   * 处理输入变化
   * 触发防抖搜索
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 触发防抖搜索
    dispatch(performDebouncedSearch(value));
  };

  /**
   * 处理回车键
   * 在新标签页打开外部搜索引擎
   */
  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      // 打开外部搜索引擎
      const searchUrl = getSearchUrl(currentEngineId, trimmedValue);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * 清除搜索
   */
  const handleClear = () => {
    setInputValue('');
    dispatch(clearSearch());
  };

  /**
   * 处理搜索引擎切换
   */
  const handleEngineChange = (engineId: string) => {
    dispatch(setSearchEngine(engineId));
    
    // 保存到 LocalStorage
    const updatedSettings = {
      ...settings,
      searchEngine: engineId,
    };
    storageService.saveSettings(updatedSettings);
  };

  /**
   * 构建搜索引擎下拉菜单
   */
  const menuItems: MenuProps['items'] = SEARCH_ENGINES.map((engine) => ({
    key: engine.id,
    label: (
      <Space>
        {getEngineIcon(engine.icon)}
        <span>{engine.name}</span>
      </Space>
    ),
    onClick: () => handleEngineChange(engine.id),
  }));

  /**
   * 获取搜索引擎图标组件
   */
  function getEngineIcon(iconName: string) {
    switch (iconName) {
      case 'GoogleOutlined':
        return <GoogleOutlined />;
      case 'YahooOutlined':
        return <SearchOutlined />; // Yahoo 图标使用通用搜索图标
      default:
        return <SearchOutlined />;
    }
  }

  /**
   * 搜索引擎切换按钮
   */
  const searchEngineButton = (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft">
      <button
        className="flex items-center justify-center h-full px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-0 bg-transparent"
        aria-label="选择搜索引擎"
      >
        {getEngineIcon(currentEngine.icon)}
      </button>
    </Dropdown>
  );

  return (
    <div className="w-full max-w-2xl">
      <Search
        placeholder={`使用 ${currentEngine.name} 搜索或在站内查找...`}
        value={inputValue}
        onChange={handleInputChange}
        onSearch={handleSearch}
        allowClear
        size="large"
        addonBefore={searchEngineButton}
        suffix={
          inputValue && (
            <CloseCircleOutlined
              className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleClear}
            />
          )
        }
        className="search-bar"
      />
    </div>
  );
}
