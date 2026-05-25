/**
 * Favicon API 服务
 * 使用 Favicon.im API 自动获取网站图标
 * API 文档: https://favicon.im/zh/
 */

/**
 * Favicon.im API 基础 URL
 * 可通过环境变量 NEXT_PUBLIC_FAVICON_API_URL 自定义
 */
const FAVICON_API_BASE = process.env.NEXT_PUBLIC_FAVICON_API_URL || 'https://favicon.im';

/**
 * Favicon API 选项
 */
export interface FaviconOptions {
  /** 是否使用较大的图标（更高质量） */
  larger?: boolean;
  /**
   * 未找到图标时的回退图片 URL
   * 对应 favicon.im 的 default-avatar 参数，URL 会自动编码
   */
  fallback?: string;
  /**
   * 未找到图标时返回 HTTP 404，便于通过 onerror 自定义替代图片
   * 对应 favicon.im 的 throw-error-on-404 参数
   * 默认 true，推荐开启以配合 img 的 onError 事件处理
   */
  throwErrorOn404?: boolean;
}

/**
 * 从 URL 中提取域名
 * @param url 完整的 URL
 * @returns 域名，如果无效则返回 null
 */
function extractDomain(url: string): string | null {
  try {
    const urlWithProtocol =
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const urlObject = new URL(urlWithProtocol);
    return urlObject.hostname;
  } catch {
    return null;
  }
}

/**
 * 提取主域名（去掉子域名，保留 eTLD+1）
 * 例如：events.vercount.one → vercount.one
 *       www.github.com → github.com（www 也视为子域名）
 *       github.com → github.com（已是主域名，不变）
 * 注意：对于 .co.uk / .com.cn 等多级 TLD 仅做简单处理，保留最后两段
 */
function extractRootDomain(hostname: string): string {
  const parts = hostname.split('.');
  // 少于等于 2 段说明已经是根域名（如 github.com）
  if (parts.length <= 2) return hostname;
  // 取最后两段作为根域名（适用于绝大多数 .com/.org/.io/.one 等）
  return parts.slice(-2).join('.');
}

/**
 * 验证 URL 是否有效
 * @param url URL 字符串
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlWithProtocol =
      url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取网站的 Favicon URL
 *
 * 根据 favicon.im 官方建议：
 * - 使用 throw-error-on-404=true 配合 img 的 onError 事件处理 404
 * - 使用 default-avatar 指定找不到图标时的回退图片
 * - 在页面中直接引用 URL，使用 loading="lazy" 避免一次性加载过多图标
 *
 * @param url 网站 URL
 * @param options Favicon 选项
 * @returns Favicon 图片 URL，域名无效时返回 null
 */
export function getFaviconUrl(url: string, options: FaviconOptions = {}): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  const { larger = false, fallback, throwErrorOn404 = true } = options;

  const params = new URLSearchParams();

  if (larger) {
    params.append('larger', 'true');
  }

  // 未找到图标时返回 404，配合 img onError 使用
  if (throwErrorOn404) {
    params.append('throw-error-on-404', 'true');
  }

  // 未找到图标时重定向到该 URL（需编码）
  if (fallback) {
    params.append('default-avatar', encodeURIComponent(fallback));
  }

  const queryString = params.toString();
  return `${FAVICON_API_BASE}/${domain}${queryString ? `?${queryString}` : ''}`;
}

/**
 * 获取根域名的 Favicon URL（用于子域名找不到图标时的回退）
 *
 * 例如 events.vercount.one 找不到图标时，自动尝试 vercount.one
 * 如果传入的已经是根域名，返回 null（无需回退）
 *
 * @param url 网站 URL
 * @param options Favicon 选项
 * @returns 根域名的 Favicon URL，或 null（已是根域名 / 域名无效）
 */
export function getFaviconRootFallbackUrl(
  url: string,
  options: FaviconOptions = {}
): string | null {
  const domain = extractDomain(url);
  if (!domain) return null;

  const rootDomain = extractRootDomain(domain);
  // 已经是根域名，不需要回退
  if (rootDomain === domain) return null;

  const { larger = false, throwErrorOn404 = true } = options;
  const params = new URLSearchParams();
  if (larger) params.append('larger', 'true');
  if (throwErrorOn404) params.append('throw-error-on-404', 'true');

  const queryString = params.toString();
  return `${FAVICON_API_BASE}/${rootDomain}${queryString ? `?${queryString}` : ''}`;
}

/**
 * 从 URL 获取网站名称（用于 alt 文本）
 * @param url 网站 URL
 * @returns 网站名称
 */
export function getWebsiteName(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return 'Website';
  const name = domain.replace(/^www\./, '');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * 生成 Favicon 的 alt 文本
 * @param url 网站 URL
 * @param name 网站名称（可选）
 * @returns alt 文本
 */
export function getFaviconAlt(url: string, name?: string): string {
  return `${name || getWebsiteName(url)} favicon`;
}
