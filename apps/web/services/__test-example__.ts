/**
 * 这是一个示例文件，展示如何使用搜索功能
 * 实际使用时可以删除此文件
 */

import { searchLinks, SEARCH_ENGINES, getSearchUrl, getSearchEngine } from './search';
import { Link } from '@weiz-nav/core/link';

// 示例链接数据
const exampleLinks: Link[] = [
  {
    id: '1',
    name: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的代码托管平台',
    tags: ['开发', '代码', 'git'],
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Web 开发文档和学习资源',
    tags: ['文档', '学习', 'web'],
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: '程序员问答社区',
    tags: ['问答', '社区', '开发'],
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// 示例 1: 搜索链接
console.log('=== 搜索示例 ===');
console.log('搜索 "github":', searchLinks(exampleLinks, 'github'));
console.log('搜索 "文档":', searchLinks(exampleLinks, '文档'));
console.log('搜索 "开发" (标签):', searchLinks(exampleLinks, '开发'));
console.log('空搜索:', searchLinks(exampleLinks, ''));

// 示例 2: 搜索引擎列表
console.log('\n=== 搜索引擎列表 ===');
SEARCH_ENGINES.forEach(engine => {
  console.log(`${engine.name} (${engine.id}): ${engine.searchUrl}`);
});

// 示例 3: 获取搜索 URL
console.log('\n=== 搜索 URL 示例 ===');
console.log('Google 搜索 "Next.js":', getSearchUrl('google', 'Next.js'));
console.log('Baidu 搜索 "React":', getSearchUrl('baidu', 'React'));
console.log('未知引擎 (默认 Google):', getSearchUrl('unknown', 'test'));

// 示例 4: 获取搜索引擎配置
console.log('\n=== 搜索引擎配置 ===');
console.log('Google 配置:', getSearchEngine('google'));
console.log('DuckDuckGo 配置:', getSearchEngine('duckduckgo'));
