/**
 * 颜色工具函数
 * 提供预设颜色和颜色验证功能
 */

// 预设颜色列表
export const PRESET_COLORS = [
  // 1-8: 黑色到白色渐变
  '#000000',
  '#262626',
  '#434343',
  '#595959',
  '#8c8c8c',
  '#bfbfbf',
  '#d9d9d9',
  '#ffffff',

  // 9-16: 红色到紫色的浅色系
  '#ffccc7',
  '#ffd8bf',
  '#ffe7ba',
  '#fff1b8',
  '#d9f7be',
  '#b5f5ec',
  '#bae0ff',
  '#efdbff',

  // 17-24: 红色到紫色的亮色系
  '#ff4d4f',
  '#ff7a45',
  '#ffa940',
  '#ffc53d',
  '#52c41a',
  '#13c2c2',
  '#1890ff',
  '#722ed1',

  // 25-32: 红色到紫色的深色系
  '#cf1322',
  '#d4380d',
  '#d46b08',
  '#d48806',
  '#389e0d',
  '#08979c',
  '#0958d9',
  '#531dab'
]

/**
 * 验证颜色格式是否有效
 * 支持 hex 格式 (#RGB, #RRGGBB, #RRGGBBAA)
 */
export const isValidColor = (color: string): boolean => {
  if (!color) return false

  // 验证 hex 格式
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/
  return hexRegex.test(color)
}

/**
 * 获取默认颜色
 */
export const getDefaultColor = (): string => {
  return '#ffffff'
}

/**
 * 判断颜色是否为白色或接近白色
 */
export const isWhiteColor = (color?: string): boolean => {
  if (!color) return false
  const normalizedColor = color.toLowerCase().trim()
  return (
    normalizedColor === '#ffffff' ||
    normalizedColor === '#fff' ||
    normalizedColor === 'white' ||
    normalizedColor === 'rgb(255, 255, 255)' ||
    normalizedColor === 'rgb(255,255,255)' ||
    normalizedColor.startsWith('rgba(255, 255, 255') ||
    normalizedColor.startsWith('rgba(255,255,255')
  )
}

/**
 * 判断颜色是否为浅色（高亮度）
 */
export const isLightColor = (color?: string): boolean => {
  if (!color) return false
  if (isWhiteColor(color)) return true

  const c = color.trim().toLowerCase()
  if (c.startsWith('#')) {
    const hex = c.slice(1)
    let r = 0,
      g = 0,
      b = 0
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    }
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 180
  }
  return false
}
