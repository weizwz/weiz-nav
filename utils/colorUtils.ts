/**
 * 颜色工具函数
 * 提供预设颜色和颜色验证功能
 */

// 预设颜色列表
export const PRESET_COLORS = [
  '#ffffff', // 白色
  '#f5f5f5', // 浅灰
  '#e8f4fd', // 浅蓝
  '#e6f7ff', // 天蓝
  '#f0f9ff', // 冰蓝
  '#fff7e6', // 浅橙
  '#fff1f0', // 浅红
  '#f6ffed', // 浅绿
  '#fcffe6', // 浅黄
  '#f9f0ff', // 浅紫
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 橙色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#eb2f96', // 粉色
  '#fa8c16', // 深橙
];

/**
 * 验证颜色格式是否有效
 * 支持 hex 格式 (#RGB, #RRGGBB, #RRGGBBAA)
 */
export const isValidColor = (color: string): boolean => {
  if (!color) return false;
  
  // 验证 hex 格式
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
};

/**
 * 获取默认颜色
 */
export const getDefaultColor = (): string => {
  return '#ffffff';
};
