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
  /** 是否使用较大的图标 */
  larger?: boolean;
  /** 回退图标 URL */
  fallback?: string;
}

/**
 * 从 URL 中提取域名
 * @param url 完整的 URL
 * @returns 域名，如果无效则返回 null
 */
function extractDomain(url: string): string | null {
  try {
    // 如果 URL 不包含协议，添加 https://
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
    
    const urlObject = new URL(urlWithProtocol);
    return urlObject.hostname;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return null;
  }
}

/**
 * 验证 URL 是否有效
 * @param url URL 字符串
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取网站的 Favicon URL
 * @param url 网站 URL
 * @param options Favicon 选项
 * @returns Favicon 图片 URL
 */
export function getFaviconUrl(url: string, options: FaviconOptions = {}): string | null {
  const domain = extractDomain(url);
  if (!domain) {
    return options.fallback || null;
  }

  const { larger = false } = options;
  
  // 构建 Favicon.im API URL
  // 格式: https://favicon.im/{domain}?larger=true
  // 官方文档: https://favicon.im/zh/
  const params = new URLSearchParams();
  if (larger) {
    params.append('larger', 'true');
  }
  
  return `${FAVICON_API_BASE}/${domain}?${params.toString()}`;
}

/**
 * 预加载 Favicon 图片
 * @param url Favicon URL
 * @returns Promise，成功时返回 URL，失败时返回 null
 */
export async function preloadFavicon(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(url);
    };
    
    img.onerror = () => {
      console.error('Failed to load favicon:', url);
      resolve(null);
    };
    
    // 设置超时（5秒）
    const timeout = setTimeout(() => {
      img.src = ''; // 取消加载
      console.warn('Favicon loading timeout:', url);
      resolve(null);
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(url);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error('Failed to load favicon:', url);
      resolve(null);
    };
    
    img.src = url;
  });
}

/**
 * 获取并验证 Favicon
 * @param url 网站 URL
 * @param options Favicon 选项
 * @returns Promise，成功时返回 Favicon URL，失败时返回 fallback 或 null
 */
export async function fetchFavicon(
  url: string,
  options: FaviconOptions = {}
): Promise<string | null> {
  const faviconUrl = getFaviconUrl(url, options);
  
  if (!faviconUrl) {
    return options.fallback || null;
  }

  // 尝试预加载图片以验证其有效性
  const loadedUrl = await preloadFavicon(faviconUrl);
  
  if (!loadedUrl && options.fallback) {
    return options.fallback;
  }
  
  return loadedUrl;
}

/**
 * 批量获取多个网站的 Favicon
 * @param urls 网站 URL 数组
 * @param options Favicon 选项
 * @returns Promise，返回 URL 到 Favicon URL 的映射
 */
export async function fetchMultipleFavicons(
  urls: string[],
  options: FaviconOptions = {}
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  
  // 并发获取所有 Favicon
  const promises = urls.map(async (url) => {
    const faviconUrl = await fetchFavicon(url, options);
    results.set(url, faviconUrl);
  });
  
  await Promise.all(promises);
  
  return results;
}

/**
 * 获取默认的 Favicon URL（不验证）
 * 用于快速显示，不等待加载验证
 * @param url 网站 URL
 * @returns Favicon URL 或 null
 */
export function getDefaultFaviconUrl(url: string): string | null {
  return getFaviconUrl(url);
}

/**
 * 从 URL 获取网站名称（用于 alt 文本）
 * @param url 网站 URL
 * @returns 网站名称
 */
export function getWebsiteName(url: string): string {
  const domain = extractDomain(url);
  if (!domain) {
    return 'Website';
  }
  
  // 移除 www. 前缀
  const name = domain.replace(/^www\./, '');
  
  // 首字母大写
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * 生成 Favicon 的 alt 文本
 * @param url 网站 URL
 * @param name 网站名称（可选）
 * @returns alt 文本
 */
export function getFaviconAlt(url: string, name?: string): string {
  const websiteName = name || getWebsiteName(url);
  return `${websiteName} favicon`;
}
