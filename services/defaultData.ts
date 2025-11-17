import { Link } from '@/types/link';
import { Category } from '@/types/category';

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 创建链接对象的辅助函数
 */
function createLink(
  name: string,
  url: string,
  description: string,
  category: string,
  icon?: string,
  backgroundColor?: string
): Link {
  const now = Date.now();
  return {
    id: generateId(),
    name,
    url,
    description,
    category,
    icon,
    backgroundColor: backgroundColor || '#bae0ff',
    iconScale: 0.7,
    tags: [],
    order: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 默认导航链接数据
 * 分类：主页、框架、工具、社区、API
 */
export const defaultLinks: Link[] = [
  // 主页 - 常用网站和资源
  createLink('Github', 'https://github.com', '全球最大的代码托管平台', '主页', 'https://github.githubassets.com/favicons/favicon.svg'),
  createLink('Stack Overflow', 'https://stackoverflow.com', '全球最大的技术问答网站', '主页', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a'),
  createLink('MDN', 'https://developer.mozilla.org/zh-CN/', 'Web 开发者文档', '主页', 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png'),
  createLink('Can I use', 'https://caniuse.com', '前端 API 兼容性查询', '主页', 'https://caniuse.com/img/favicon-128.png'),

  // 框架 - React、Vue、Node 等
  createLink('React', 'https://zh-hans.reactjs.org', '用于构建用户界面的 JavaScript 库', '框架', 'https://zh-hans.reactjs.org/favicon.ico'),
  createLink('Next.js', 'https://nextjs.org', '用于 Web 的 React 框架', '框架', 'https://nextjs.org/static/favicon/safari-pinned-tab.svg'),
  createLink('Vue 3', 'https://cn.vuejs.org', '渐进式 JavaScript 框架', '框架', 'https://cn.vuejs.org/logo.svg'),
  createLink('Nuxt.js', 'https://nuxt.com', '基于 Vue.js 的通用应用框架', '框架', 'https://nuxt.com/icon.png'),
  createLink('Node.js', 'https://nodejs.org/zh-cn', '基于 Chrome V8 引擎的 JavaScript 运行环境', '框架', 'https://nodejs.org/static/images/favicons/favicon.png'),
  createLink('Express', 'https://expressjs.com', '快速、开放、极简的 Web 开发框架', '框架', 'https://expressjs.com/images/favicon.png'),
  createLink('Nest.js', 'https://docs.nestjs.cn', '渐进式 Node.js 框架', '框架'),
  createLink('Ant Design', 'https://ant.design', '企业级 UI 设计语言和 React 组件库', '框架', 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png'),
  createLink('Element Plus', 'https://element-plus.org', '基于 Vue 3 的组件库', '框架', 'https://element-plus.org/images/element-plus-logo-small.svg'),
  createLink('TailwindCSS', 'https://www.tailwindcss.cn', '功能类优先的 CSS 框架', '框架', 'https://www.tailwindcss.cn/apple-touch-icon.png'),

  // 工具 - 开发工具、构建工具、在线工具
  createLink('Vite', 'https://cn.vitejs.dev', '下一代前端工具链', '工具', 'https://cn.vitejs.dev/logo.svg'),
  createLink('Webpack', 'https://www.webpackjs.com', '现代 JavaScript 应用程序的静态模块打包工具', '工具', 'https://www.webpackjs.com/icon_180x180.png'),
  createLink('NPM', 'https://www.npmjs.com', '世界上最大的包管理器', '工具', 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png'),
  createLink('Pnpm', 'https://pnpm.io', '速度快、节省磁盘空间的软件包管理器', '工具', 'https://www.pnpm.cn/img/favicon.png'),
  createLink('TinyPNG', 'https://tinypng.com', '在线图片压缩工具', '工具', 'https://tinypng.com/images/apple-touch-icon.png'),
  createLink('在线工具', 'https://tool.lu', '开发人员的工具箱', '工具', 'https://tool.lu/favicon.ico'),
  createLink('ProcessOn', 'https://processon.com/', '免费在线流程图思维导图', '工具', 'https://processon.com/favicon.ico'),
  createLink('Json 中文网', 'https://www.json.cn', 'JSON 在线解析及格式化验证', '工具'),
  createLink('transform', 'https://transform.tools', '各类数据格式与对象转换', '工具'),
  createLink('AST Explorer', 'https://astexplorer.net/', '探索由各种解析器生成的 AST 语法树', '工具'),
  createLink('Vercel', 'https://vercel.com', '网站部署和托管平台', '工具'),
  createLink('Netlify', 'https://www.netlify.com', '静态网站托管平台', '工具'),

  // 社区 - 技术社区和问答平台
  createLink('稀土掘金', 'https://juejin.cn', '面向全球中文开发者的技术内容分享与交流平台', '社区', 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/apple-touch-icon.png'),
  createLink('V2EX', 'https://www.v2ex.com', '创意工作者们的社区', '社区', 'https://www.v2ex.com/static/icon-192.png'),
  createLink('SegmentFault', 'https://segmentfault.com', '技术问答开发者社区', '社区', 'https://static.segmentfault.com/main_site_next/0dc4bace/touch-icon.png'),
  createLink('博客园', 'https://www.cnblogs.com', '开发者的网上家园', '社区'),
  createLink('知乎', 'https://zhihu.com', '中文互联网高质量的问答社区', '社区', 'https://static.zhihu.com/heifetz/assets/apple-touch-icon-60.362a8eac.png'),

  // API - API 工具和文档
  createLink('Apifox', 'https://www.apifox.cn/', 'API 文档、调试、Mock、自动化测试', 'API'),
  createLink('Hoppscotch', 'https://hoppscotch.io/', '开源 API 开发生态系统', 'API'),
  createLink('Postman', 'https://www.postman.com/', 'API 开发协作平台', 'API'),
  createLink('Swagger', 'https://swagger.io/', 'API 文档和设计工具', 'API'),
].map((link, index) => ({ ...link, order: index }));

/**
 * 分类图标映射
 * 为每个分类名称指定对应的图标
 */
const categoryIconMap: Record<string, string> = {
  '主页': 'HomeOutlined',
  '框架': 'CodeOutlined',
  '工具': 'ToolOutlined',
  '社区': 'TeamOutlined',
  'API': 'ApiOutlined',
};

/**
 * 默认分类数据
 * 从链接数据中提取唯一分类并生成分类对象
 */
export const defaultCategories: Category[] = (() => {
  // 从链接中提取唯一的分类名称（过滤掉空值）
  const uniqueCategories = Array.from(
    new Set(
      defaultLinks
        .map(link => link.category)
        .filter((category): category is string => Boolean(category))
    )
  );

  // 生成分类对象
  return uniqueCategories.map((categoryName, index) => ({
    id: categoryName.toLowerCase().replace(/\s+/g, '-'),
    name: categoryName,
    icon: categoryIconMap[categoryName] || 'AppstoreOutlined',
    order: index,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
})();
