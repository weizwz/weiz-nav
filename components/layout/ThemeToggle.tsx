'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/settingsSlice';
import type { ThemeMode } from '@/types';

/**
 * 主题切换组件
 * 支持明暗主题切换，带有平滑过渡动画
 */
export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const { theme: nextTheme, setTheme: setNextTheme, systemTheme } = useTheme();
  const reduxTheme = useAppSelector((state) => state.settings.theme);

  // 同步 Redux 主题到 next-themes
  useEffect(() => {
    if (reduxTheme && nextTheme !== reduxTheme) {
      setNextTheme(reduxTheme);
    }
  }, [reduxTheme, nextTheme, setNextTheme]);

  // 确定当前实际显示的主题
  const currentTheme = nextTheme === 'system' ? systemTheme : nextTheme;
  const isDark = currentTheme === 'dark';

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    // 在 light 和 dark 之间切换
    const newTheme: ThemeMode = isDark ? 'light' : 'dark';
    
    // 更新 next-themes
    setNextTheme(newTheme);
    
    // 更新 Redux store（会自动保存到 LocalStorage）
    dispatch(setTheme(newTheme));
  };

  /**
   * 获取主题提示文本
   */
  const getTooltipTitle = () => {
    return isDark ? '切换到浅色模式' : '切换到深色模式';
  };

  return (
    <Tooltip title={getTooltipTitle()} placement="bottom">
      <Button
        type="text"
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        className="transition-theme flex items-center justify-center"
        aria-label={getTooltipTitle()}
        style={{
          fontSize: '18px',
          width: '40px',
          height: '40px',
        }}
      />
    </Tooltip>
  );
}
