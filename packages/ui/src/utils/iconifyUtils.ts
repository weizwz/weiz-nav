/**
 * Iconify 图标解析与格式化工具函数
 */

export interface ParsedIconify {
  iconName: string;
  color?: string;
}

/**
 * 判断字符串是否为 Iconify 图标格式
 * 支持：
 * 1. 历史 URL 直连格式：https://api.iconify.design/...
 * 2. 标识符格式：prefix:name (如 mdi:home, uil:react, devicon:threejs)
 * 3. 带参数格式：prefix:name?color=...
 */
export function isIconify(icon?: string): boolean {
  if (!icon || typeof icon !== 'string') return false;

  // 历史 API URL 格式
  if (icon.includes('api.iconify.design')) {
    return true;
  }

  // 排除常规 URL 和 Base64
  if (
    icon.startsWith('http://') ||
    icon.startsWith('https://') ||
    icon.startsWith('/') ||
    icon.startsWith('data:image/')
  ) {
    return false;
  }

  // 提取纯标识符部分
  const rawIdentifier = icon.split('?')[0].trim();
  // 匹配 prefix:name (允许包含中划线、下划线、字母数字)
  return /^[a-z0-9-_]+:[a-z0-9-_]+$/i.test(rawIdentifier);
}

/**
 * 解析 Iconify 字符串，提取出 iconName 和 color
 */
export function parseIconify(icon?: string): ParsedIconify | null {
  if (!icon || !isIconify(icon)) return null;

  try {
    let rawIdentifier = '';
    let color: string | undefined;

    if (icon.includes('api.iconify.design')) {
      // 历史 URL: https://api.iconify.design/mdi:wechat.svg?color=%23ffffff 或 /simple-icons/hoppscotch.svg
      const [baseUrl, query] = icon.split('?');
      if (query) {
        const params = new URLSearchParams(query);
        const c = params.get('color');
        if (c) color = c;
      }

      // 提取文件名部分
      const match = baseUrl.match(/api\.iconify\.design\/([^?#]+)/);
      if (match) {
        let path = match[1].replace(/\.svg$/, '');
        // 兼容 /prefix/name 和 prefix:name
        if (path.includes('/') && !path.includes(':')) {
          path = path.replace('/', ':');
        }
        rawIdentifier = path;
      }
    } else {
      // 标识符格式: prefix:name 或 prefix:name?color=...
      const [id, query] = icon.split('?');
      rawIdentifier = id.trim();
      if (query) {
        const params = new URLSearchParams(query);
        const c = params.get('color');
        if (c) color = c;
      }
    }

    if (!rawIdentifier) return null;

    return {
      iconName: rawIdentifier,
      color: color || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * 格式化 Iconify 标识符和颜色为存储字符串
 */
export function formatIconify(iconName: string, color?: string): string {
  if (!iconName) return '';
  const cleanName = iconName.split('?')[0].trim();
  if (!color) return cleanName;
  return `${cleanName}?color=${encodeURIComponent(color)}`;
}
