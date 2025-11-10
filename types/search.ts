import { Link } from './link';

/**
 * SearchEngine 接口定义
 * 表示一个搜索引擎的配置
 */
export interface SearchEngine {
  /** 唯一标识符 */
  id: string;
  
  /** 搜索引擎名称 */
  name: string;
  
  /** 图标（Ant Design 图标名称或 URL） */
  icon: string;
  
  /** 搜索 URL 模板（{query} 占位符） */
  searchUrl: string;
}

/**
 * 搜索状态接口
 */
export interface SearchState {
  /** 搜索关键词 */
  query: string;
  
  /** 搜索结果 */
  results: Link[];
  
  /** 是否正在搜索 */
  isSearching: boolean;
}

/**
 * 搜索选项
 */
export interface SearchOptions {
  /** 是否区分大小写 */
  caseSensitive?: boolean;
  
  /** 是否搜索标签 */
  includeTags?: boolean;
  
  /** 是否搜索 URL */
  includeUrl?: boolean;
  
  /** 最大结果数量 */
  maxResults?: number;
}

/**
 * 搜索结果项
 * 包含匹配信息的搜索结果
 */
export interface SearchResultItem {
  /** 链接数据 */
  link: Link;
  
  /** 匹配的字段 */
  matchedFields: ('name' | 'description' | 'url' | 'tags')[];
  
  /** 相关度分数 */
  relevanceScore: number;
}
