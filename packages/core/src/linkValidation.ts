import type { Link } from './link';

/**
 * 链接验证工具函数
 */

/**
 * 检查同一分类中是否存在相同的 URL
 * @param url 要检查的 URL
 * @param category 分类名称
 * @param links 所有链接列表
 * @param excludeLinkId 排除的链接 ID（用于更新时排除自身）
 * @returns 如果存在重复返回 true，否则返回 false
 */
export const isDuplicateUrlInCategory = (
  url: string,
  category: string | undefined,
  links: Link[],
  excludeLinkId?: string
): boolean => {
  return links.some(
    (link) => link.url === url && link.category === category && link.id !== excludeLinkId
  );
};

/**
 * 获取分类中重复的 URL 链接
 * @param url 要检查的 URL
 * @param category 分类名称
 * @param links 所有链接列表
 * @returns 重复的链接对象，如果不存在返回 undefined
 */
export const getDuplicateLinkInCategory = (
  url: string,
  category: string | undefined,
  links: Link[]
): Link | undefined => {
  return links.find((link) => link.url === url && link.category === category);
};

/**
 * 统计 URL 在所有分类中出现的次数
 * @param url 要检查的 URL
 * @param links 所有链接列表
 * @returns 出现次数
 */
export const countUrlOccurrences = (url: string, links: Link[]): number => {
  return links.filter((link) => link.url === url).length;
};

/**
 * 获取 URL 在哪些分类中出现
 * @param url 要检查的 URL
 * @param links 所有链接列表
 * @returns 分类名称数组
 */
export const getCategoriesWithUrl = (url: string, links: Link[]): string[] => {
  const categories = links
    .filter((link) => link.url === url)
    .map((link) => link.category || '')
    .filter((cat) => cat !== '');

  return Array.from(new Set(categories));
};
