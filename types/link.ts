/**
 * Link 接口定义
 * 表示一个导航链接的完整数据结构
 */
export interface Link {
  /** 唯一标识符 */
  id: string;
  
  /** 链接名称 */
  name: string;
  
  /** 链接地址 */
  url: string;
  
  /** 描述信息 */
  description: string;
  
  /** 图标 URL 或 Ant Design 图标名称 */
  icon?: string;
  
  /** 背景颜色（HEX 格式） */
  backgroundColor?: string;
  
  /** 分类 */
  category?: string;
  
  /** 标签列表 */
  tags?: string[];
  
  /** 排序序号 */
  order: number;
  
  /** 创建时间戳 */
  createdAt: number;
  
  /** 更新时间戳 */
  updatedAt: number;
}

/**
 * 创建链接时的输入数据类型
 * 省略自动生成的字段
 */
export type CreateLinkInput = Omit<Link, 'id' | 'createdAt' | 'updatedAt' | 'order'>;

/**
 * 更新链接时的输入数据类型
 * 所有字段都是可选的，除了 id
 */
export type UpdateLinkInput = Partial<Omit<Link, 'id'>> & { id: string };
