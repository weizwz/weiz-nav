/**
 * 颜色工具函数
 * 提供预设颜色和颜色验证功能
 */

// 预设颜色列表
export const PRESET_COLORS = [
  // 1-8: 黑色到白色渐变
  '#000000', '#262626', '#434343', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#ffffff',
  
  // 9-16: 红色到紫色的浅色系
  '#ffccc7', '#ffd8bf', '#ffe7ba', '#fff1b8', '#d9f7be', '#b5f5ec', '#d6e4ff', '#efdbff',
  
  // 17-24: 红色到紫色的亮色系
  '#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#52c41a', '#13c2c2', '#1890ff', '#722ed1',
  
  // 25-32: 红色到紫色的深色系
  '#cf1322', '#d4380d', '#d46b08', '#d48806', '#389e0d', '#08979c', '#0958d9', '#531dab',

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
