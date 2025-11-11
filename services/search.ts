import { Link } from '@/types/link';
import { SearchEngine } from '@/types/search';

/**
 * 搜索链接
 * 支持名称、描述、URL、标签的模糊匹配
 * 
 * @param links - 链接列表
 * @param query - 搜索关键词
 * @returns 匹配的链接列表
 */
export function searchLinks(links: Link[], query: string): Link[] {
  // 如果查询为空，返回所有链接
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return links;
  }

  // 转换为小写以进行不区分大小写的搜索
  const lowerQuery = trimmedQuery.toLowerCase();

  // 过滤匹配的链接
  return links.filter(link => {
    // 名称匹配
    const nameMatch = link.name.toLowerCase().includes(lowerQuery);
    
    // 描述匹配
    const descMatch = link.description.toLowerCase().includes(lowerQuery);
    
    // URL 匹配
    const urlMatch = link.url.toLowerCase().includes(lowerQuery);
    
    // 标签匹配
    const tagMatch = link.tags?.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    ) ?? false;

    // 返回任意字段匹配的结果
    return nameMatch || descMatch || urlMatch || tagMatch;
  });
}

/**
 * 预设搜索引擎列表
 */
export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'https://www.google.com',
    searchUrl: 'https://www.google.com/search?q={query}'
  },
  {
    id: 'bing',
    name: 'Bing',
    icon: 'https://www.bing.com',
    searchUrl: 'https://www.bing.com/search?q={query}'
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    icon: 'https://www.yahoo.com',
    searchUrl: 'https://search.yahoo.com/search?p={query}'
  },
  {
    id: 'baidu',
    name: 'Baidu',
    icon: 'https://www.baidu.com',
    searchUrl: 'https://www.baidu.com/s?wd={query}'
  },
  {
    id: 'yandex',
    name: 'Yandex',
    icon: 'https://yandex.com',
    searchUrl: 'https://yandex.com/search/?text={query}'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    icon: 'https://duckduckgo.com',
    searchUrl: 'https://duckduckgo.com/?q={query}'
  }
];

/**
 * 获取搜索引擎的搜索 URL
 * 
 * @param engineId - 搜索引擎 ID
 * @param query - 搜索关键词
 * @returns 完整的搜索 URL
 */
export function getSearchUrl(engineId: string, query: string): string {
  const engine = SEARCH_ENGINES.find(e => e.id === engineId);
  
  if (!engine) {
    // 默认使用 Google
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  return engine.searchUrl.replace('{query}', encodeURIComponent(query));
}

/**
 * 获取搜索引擎配置
 * 
 * @param engineId - 搜索引擎 ID
 * @returns 搜索引擎配置，如果未找到则返回 Google
 */
export function getSearchEngine(engineId: string): SearchEngine {
  const engine = SEARCH_ENGINES.find(e => e.id === engineId);
  return engine || SEARCH_ENGINES[0]; // 默认返回 Google
}
