'use client';

import React from 'react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

/**
 * Header 组件
 * 页面顶部导航栏，包含：
 * - 网站标题/Logo
 * - 搜索栏
 * - 主题切换按钮
 * 
 * 响应式设计：
 * - Desktop: 水平布局，搜索栏居中
 * - Mobile: 垂直布局，搜索栏全宽
 */
export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-theme">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop 布局 */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Logo/标题 */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              前端导航
            </h1>
          </div>

          {/* 搜索栏 - 居中 */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>

          {/* 主题切换 */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile 布局 */}
        <div className="md:hidden space-y-4">
          {/* 顶部行：标题和主题切换 */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              前端导航
            </h1>
            <ThemeToggle />
          </div>

          {/* 搜索栏 - 全宽 */}
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
