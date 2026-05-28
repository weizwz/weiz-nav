/**
 * Iconify API 服务
 * 使用 Iconify API 搜索和获取图标
 * API 文档: https://iconify.design/docs/api/
 */

/**
 * Iconify API 配置
 */
export interface IconifyConfig {
  /** API 基础 URL */
  apiBaseUrl: string;
  /** 默认搜索限制 */
  defaultLimit: number;
  /** 节流延迟 (ms) */
  throttleDelay: number;
}

/**
 * 默认配置
 */
const DEFAULT_ICONIFY_CONFIG: IconifyConfig = {
  apiBaseUrl: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_ICONIFY_URL 
    ? process.env.NEXT_PUBLIC_API_ICONIFY_URL 
    : 'https://api.iconify.design',
  defaultLimit: 100,
  throttleDelay: 300,
};

/**
 * 图标选项数据结构
 */
export interface IconOption {
  /** 图标的完整标识符，格式: "prefix:name" (如 "mdi:home") */
  value: string;
  /** 图标显示名称 (如 "home") */
  label: string;
  /** 图标的完整 URL */
  url: string;
}

/**
 * Iconify API 搜索响应
 */
interface IconifySearchResponse {
  icons?: string[];
  total?: number;
}

/**
 * Iconify API 搜索选项
 */
export interface IconifyApiOptions {
  /** 搜索关键词 */
  query: string;
  /** 返回结果数量限制 */
  limit?: number;
  /** 指定图标集前缀 */
  prefix?: string;
}

/**
 * Iconify API 服务类
 */
class IconifyApiService {
  private config: IconifyConfig;

  constructor(config?: Partial<IconifyConfig>) {
    this.config = {
      ...DEFAULT_ICONIFY_CONFIG,
      ...config,
    };
  }

  /**
   * 获取配置
   */
  getConfig(): IconifyConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<IconifyConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 搜索图标
   * @param options 搜索选项
   * @returns Promise<IconOption[]> 图标选项列表
   */
  async searchIcons(options: IconifyApiOptions): Promise<IconOption[]> {
    const { query, limit = this.config.defaultLimit, prefix } = options;

    // 验证搜索关键词
    if (!query || query.trim() === '') {
      console.warn('Iconify API: 搜索关键词为空');
      return [];
    }

    // 截断过长的关键词
    const trimmedQuery = query.trim().slice(0, 100);

    try {
      // 构建请求 URL
      const url = this.buildSearchUrl(trimmedQuery, limit, prefix);
      
      console.log('Iconify API: 搜索图标', { query: trimmedQuery, limit, prefix, url });

      // 发起请求
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: IconifySearchResponse = await response.json();

      // 解析响应数据
      if (!data.icons || !Array.isArray(data.icons)) {
        console.warn('Iconify API: 响应数据格式无效', data);
        return [];
      }

      // 转换为 IconOption 格式
      const options: IconOption[] = data.icons.map((iconIdentifier: string) => {
        const label = this.extractIconName(iconIdentifier);
        const url = this.getIconUrl(iconIdentifier);
        
        return {
          value: iconIdentifier,
          label,
          url,
        };
      });

      console.log(`Iconify API: 找到 ${options.length} 个图标`);
      
      return options;
    } catch (error) {
      console.error('Iconify API: 搜索失败', error);
      throw new Error(`搜索图标失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取图标 URL
   * @param iconIdentifier 图标标识符 (格式: "prefix:name")
   * @returns 图标 SVG URL
   */
  getIconUrl(iconIdentifier: string): string {
    if (!this.isValidIconIdentifier(iconIdentifier)) {
      console.warn('Iconify API: 无效的图标标识符', iconIdentifier);
      return '';
    }

    return `${this.config.apiBaseUrl}/${iconIdentifier}.svg`;
  }

  /**
   * 验证图标标识符格式
   * @param identifier 图标标识符
   * @returns 是否有效
   */
  isValidIconIdentifier(identifier: string): boolean {
    if (!identifier || typeof identifier !== 'string') {
      return false;
    }

    // 格式: "prefix:name"
    const pattern = /^[a-z0-9-]+:[a-z0-9-]+$/i;
    return pattern.test(identifier);
  }

  /**
   * 从图标标识符中提取图标名称
   * @param iconIdentifier 图标标识符 (格式: "prefix:name")
   * @returns 图标名称
   */
  private extractIconName(iconIdentifier: string): string {
    const parts = iconIdentifier.split(':');
    return parts.length === 2 ? parts[1] : iconIdentifier;
  }

  /**
   * 构建搜索 URL
   * @param query 搜索关键词
   * @param limit 结果数量限制
   * @param prefix 图标集前缀
   * @returns 完整的搜索 URL
   */
  private buildSearchUrl(query: string, limit: number, prefix?: string): string {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('limit', limit.toString());
    
    if (prefix) {
      params.append('prefix', prefix);
    }

    return `${this.config.apiBaseUrl}/search?${params.toString()}`;
  }
}

// 导出单例实例
export const iconifyApi = new IconifyApiService();

// 导出类以便测试
export { IconifyApiService };
