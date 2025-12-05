import { Link } from '@/types/link';
import { Category } from '@/types/category';
import jsonData from './data.json';

const rawData = jsonData.data;

/**
 * 默认分类数据
 */
export const defaultCategories: Category[] = rawData.map((item) => ({
  id: item.id,
  name: item.name,
  icon: item.icon,
  order: item.order,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
}));

/**
 * 默认导航链接数据
 */
export const defaultLinks: Link[] = rawData.flatMap((item) => item.links as Link[]);

/**
 * 获取默认分类名称
 * 返回第一个分类的名称，如果没有分类则返回空字符串
 */
export const getDefaultCategoryName = (): string => {
  return defaultCategories.length > 0 ? defaultCategories[0].name : '';
};
