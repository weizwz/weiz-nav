/**
 * 分类数据类型定义
 */

/**
 * 分类接口
 */
export interface Category {
  /** 唯一标识符 */
  id: string;
  /** 分类名称 */
  name: string;
  /** 图标（emoji 或图标名称） */
  icon: string;
  /** 排序顺序 */
  order: number;
  /** 创建时间戳 */
  createdAt: number;
  /** 更新时间戳 */
  updatedAt: number;
}

/**
 * 创建分类输入类型
 */
export interface CreateCategoryInput {
  name: string;
  icon: string;
}

/**
 * 更新分类输入类型
 */
export interface UpdateCategoryInput {
  id: string;
  name?: string;
  icon?: string;
  order?: number;
}
