'use client';

import React, { useState, useEffect } from 'react';
import { Input, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { performDebouncedSearch } from '@/store/slices/searchSlice';
import { setSearchEngine } from '@/store/slices/settingsSlice';
import { SEARCH_ENGINES, getSearchUrl, getSearchEngine } from '@/services/search';
import { storageService } from '@/services/storage';
import { getFaviconUrl } from '@/api/favicon';

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

  // 使用 useCallback 缓存事件处理函数
  
  /**
   * 处理输入变化
   * 触发防抖搜索
   */
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 触发防抖搜索
    dispatch(performDebouncedSearch(value));
  }, [dispatch]);

  /**
   * 处理回车键
   * 在新标签页打开外部搜索引擎
   */
  const handleSearch = React.useCallback((value: string) => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      // 打开外部搜索引擎
      const searchUrl = getSearchUrl(currentEngineId, trimmedValue);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  }, [currentEngineId]);



  /**
   * 处理搜索引擎切换
   */
  const handleEngineChange = React.useCallback((engineId: string) => {
    dispatch(setSearchEngine(engineId));
    
    // 保存到 LocalStorage
    const updatedSettings = {
      ...settings,
      searchEngine: engineId,
    };
    storageService.saveSettings(updatedSettings);
  }, [dispatch, settings]);

  /**
   * 构建搜索引擎下拉菜单 - 使用 useMemo 缓存
   */
  const menuItems: MenuProps['items'] = React.useMemo(() => SEARCH_ENGINES.map((engine) => ({
    key: engine.id,
    label: (
      <Space>
        <img 
          src={getFaviconUrl(engine.icon, { size: 16 }) || ''} 
          alt={`${engine.name} 图标`}
          width={16}
          height={16}
          style={{ objectFit: 'contain', borderRadius: '50%' }}
        />
        <span>{engine.name}</span>
      </Space>
    ),
    onClick: () => handleEngineChange(engine.id),
  })), [handleEngineChange]);

  /**
   * 获取搜索引擎图标
   */
  const getEngineIcon = React.useCallback((iconUrl: string) => {
    const faviconUrl = getFaviconUrl(iconUrl, { size: 32 });
    return (
      <img 
        src={faviconUrl || ''} 
        alt={`${currentEngine.name} 图标`}
        width={20}
        height={20}
        style={{ objectFit: 'contain', borderRadius: '50%' }}
      />
    );
  }, [currentEngine.name]);

  /**
   * 处理键盘事件 - 使用 useCallback 缓存
   */
  const handleKeyPress = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  }, [handleSearch, inputValue]);

  return (
    <div className="w-full max-w-2xl" role="search" aria-label="搜索导航">
      <Input
        size="large"
        placeholder="搜索"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        allowClear
        prefix={
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity pr-2"
              aria-label={`当前搜索引擎：${currentEngine.name}，点击切换搜索引擎`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).click();
                }
              }}
            >
              {getEngineIcon(currentEngine.icon)}
            </div>
          </Dropdown>
        }
        className="search-bar-modern"
        style={{
          borderRadius: '24px',
          paddingLeft: '12px',
        }}
        aria-label="搜索输入框"
        role="searchbox"
        aria-describedby="search-description"
      />
      <span id="search-description" className="sr-only">
        输入关键词进行站内搜索，或按回车键使用外部搜索引擎搜索
      </span>
    </div>
  );
}
