'use client';

import React, { useState } from 'react';
import { Input, Popover } from 'antd';

/**
 * 常用图标列表
 */
const COMMON_ICONS = [
  '🏠', '💼', '▶️', '📖', '🔧', '📦',
  '🎮', '🎵', '🎬', '📱', '💻', '🖥️',
  '⚙️', '🔍', '📝', '📊', '📈', '📉',
  '🌐', '🔗', '📁', '📂', '🗂️', '📋',
  '✉️', '📧', '💬', '💭', '🔔', '⏰',
  '🎨', '🖼️', '📷', '📸', '🎯', '🎪',
  '🏆', '🎖️', '🏅', '⭐', '✨', '💡',
  '🔥', '💧', '🌟', '🌈', '☀️', '🌙',
];

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 图标选择器组件
 */
export const IconPicker: React.FC<IconPickerProps> = ({ value = '📁', onChange }) => {
  const [open, setOpen] = useState(false);

  const handleIconSelect = (icon: string) => {
    onChange?.(icon);
    setOpen(false);
  };

  const content = (
    <div className="w-64 max-h-64 overflow-y-auto">
      <div className="grid grid-cols-8 gap-2 p-2">
        {COMMON_ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
            onClick={() => handleIconSelect(icon)}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title="选择图标"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
    >
      <Input
        value={value}
        readOnly
        placeholder="点击选择图标"
        prefix={<span className="text-xl">{value}</span>}
        className="cursor-pointer"
      />
    </Popover>
  );
};
