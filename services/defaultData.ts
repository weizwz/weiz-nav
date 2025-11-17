import { Link } from '@/types/link';

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
 */
export const defaultLinks: Link[] = [
  // 常用工具
  createLink('Can I use', 'https://caniuse.com', '前端 API 兼容性查询', '常用工具', 'https://caniuse.com/img/favicon-128.png'),
  createLink('TinyPNG', 'https://tinypng.com', '在线图片压缩工具', '常用工具', 'https://tinypng.com/images/apple-touch-icon.png'),
  createLink('在线工具', 'https://tool.lu', '开发人员的工具箱', '常用工具', 'https://tool.lu/favicon.ico'),
  createLink('ProcessOn', 'https://processon.com/', '免费在线流程图思维导图', '常用工具', 'https://processon.com/favicon.ico'),
  createLink('Json 中文网', 'https://www.json.cn', 'JSON 在线解析及格式化验证', '常用工具'),
  createLink('Terminal Gif Maker', 'https://www.terminalgif.com', '在线生成 Terminal GIF', '常用工具'),
  createLink('AST Explorer', 'https://astexplorer.net/', '一个 Web 工具，用于探索由各种解析器生成的 AST 语法树', '常用工具'),
  createLink('transform', 'https://transform.tools', '各类数据格式与对象转换', '常用工具'),
  createLink('Hoppscotch', 'https://hoppscotch.io/', '开源 API 开发生态系统', '常用工具'),
  createLink('Apifox', 'https://www.apifox.cn/', 'API 文档、API 调试、API Mock、API 自动化测试', '常用工具'),

  // React
  createLink('React', 'https://zh-hans.reactjs.org', '用于构建用户界面的 JavaScript 库', 'React', 'https://zh-hans.reactjs.org/favicon.ico'),
  createLink('React Router', 'https://reactrouter.com', 'React 的声明式路由', 'React', 'https://reactrouter.com/favicon-light.png'),
  createLink('Next.js', 'https://nextjs.org', '一个用于 Web 的 React 框架', 'React', 'https://nextjs.org/static/favicon/safari-pinned-tab.svg'),
  createLink('UmiJS', 'https://umijs.org', '插件化的企业级前端应用框架', 'React', 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg'),
  createLink('Ant Design', 'https://ant.design', '一套企业级 UI 设计语言和 React 组件库', 'React', 'https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png'),
  createLink('Ant Design Mobile', 'https://mobile.ant.design', '构建移动 WEB 应用程序的 React 组件库', 'React', 'https://gw.alipayobjects.com/zos/bmw-prod/69a27fcc-ce52-4f27-83f1-c44541e9b65d.svg'),
  createLink('Zustand', 'https://docs.pmnd.rs/zustand/getting-started/introduction', '一个小型、快速、可扩展的 React 状态管理解决方案', 'React', 'https://docs.pmnd.rs/apple-touch-icon.png'),
  createLink('Valtio', 'https://valtio.pmnd.rs', 'makes proxy-state simple for React and Vanilla', 'React', 'https://valtio.pmnd.rs/favicon.ico'),
  createLink('Jotai', 'https://jotai.org', 'primitive and flexible state management for React', 'React', 'https://jotai.org/favicon.svg'),
  createLink('Redux', 'https://cn.redux.js.org', 'JavaScript 应用的状态容器，提供可预测的状态管理', 'React', 'https://cn.redux.js.org/img/redux.svg'),
  createLink('MobX', 'https://zh.mobx.js.org', '一个小型、快速、可扩展的 React 状态管理解决方案', 'React', 'https://zh.mobx.js.org/assets/mobx.png'),
  createLink('ahooks', 'https://ahooks.js.org/zh-CN', '一套高质量可靠的 React Hooks 库', 'React', 'https://ahooks.js.org/simple-logo.svg'),

  // Vue
  createLink('Vue 3', 'https://cn.vuejs.org', '渐进式 JavaScript 框架', 'Vue', 'https://cn.vuejs.org/logo.svg'),
  createLink('Vue 2', 'https://v2.cn.vuejs.org', '渐进式 JavaScript 框架', 'Vue', 'https://cn.vuejs.org/logo.svg'),
  createLink('Vue Router', 'https://router.vuejs.org/zh', 'Vue.js 的官方路由', 'Vue', 'https://cn.vuejs.org/logo.svg'),
  createLink('Pinia', 'https://pinia.vuejs.org/zh', '符合直觉的 Vue.js 状态管理库', 'Vue', 'https://pinia.vuejs.org/logo.svg'),
  createLink('Nuxt.js', 'https://nuxt.com', '一个基于 Vue.js 的通用应用框架', 'Vue', 'https://nuxt.com/icon.png'),
  createLink('VueUse', 'https://vueuse.org', 'Vue Composition API 的常用工具集', 'Vue', 'https://vueuse.org/favicon.svg'),
  createLink('Vitest', 'https://cn.vitest.dev/', '一个 Vite 原生单元测试框架', 'Vue', 'https://vitest.dev/favicon.ico'),
  createLink('Element Plus', 'https://element-plus.org', '基于 Vue 3，面向设计师和开发者的组件库', 'Vue', 'https://element-plus.org/images/element-plus-logo-small.svg'),
  createLink('Ant Design Vue', 'https://antdv.com', 'Ant Design 的 Vue 实现', 'Vue', 'https://www.antdv.com/assets/logo.1ef800a8.svg'),
  createLink('Vant', 'https://vant-ui.github.io/vant', '轻量、可定制的移动端 Vue 组件库', 'Vue', 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png'),
  createLink('NutUI', 'https://nutui.jd.com', '京东风格的轻量级移动端组件库', 'Vue', 'https://img14.360buyimg.com/imagetools/jfs/t1/167902/2/8762/791358/603742d7E9b4275e3/e09d8f9a8bf4c0ef.png'),

  // Node
  createLink('Node.js', 'https://nodejs.org/zh-cn', 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境', 'Node', 'https://nodejs.org/static/images/favicons/favicon.png'),
  createLink('Deno', 'https://deno.com/', 'Deno is the open-source JavaScript runtime for the modern web', 'Node', 'https://deno.com/logo.svg'),
  createLink('Express', 'https://expressjs.com', '基于 Node.js 平台，快速、开放、极简的 Web 开发框架', 'Node', 'https://expressjs.com/images/favicon.png'),
  createLink('Koa', 'https://koajs.com', '基于 Node.js 平台的下一代 web 开发框架', 'Node', 'https://nodejs.org/static/images/favicons/favicon.png'),
  createLink('Nest.js', 'https://docs.nestjs.cn', '用于构建高效且可伸缩的服务端应用程序的渐进式 Node.js 框架', 'Node'),
  createLink('Axios', 'https://axios-http.cn/', 'Axios 是一个基于 promise 的网络请求库', 'Node'),
  createLink('NPM', 'https://www.npmjs.com', 'NPM是世界上最大的包管理器', 'Node', 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png'),
  createLink('Yarn', 'https://www.yarnpkg.cn', 'Yarn 是一个软件包管理器', 'Node', 'https://www.yarnpkg.cn/favicon-32x32.png'),
  createLink('Pnpm', 'https://pnpm.io', '速度快、节省磁盘空间的软件包管理器', 'Node', 'https://www.pnpm.cn/img/favicon.png'),

  // 构建工具
  createLink('Webpack', 'https://www.webpackjs.com', '一个用于现代 JavaScript 应用程序的静态模块打包工具', '构建工具', 'https://www.webpackjs.com/icon_180x180.png'),
  createLink('Vite', 'https://cn.vitejs.dev', '下一代前端工具链', '构建工具', 'https://cn.vitejs.dev/logo.svg'),
  createLink('Rollup', 'https://www.rollupjs.com', 'Rollup 是一个 JavaScript 模块打包器', '构建工具', 'https://www.rollupjs.com/img/favicon.png'),
  createLink('Turbo', 'https://turbo.build', 'Turbo is an incremental bundler and build system', '构建工具', 'https://turbo.build/images/favicon-dark/apple-touch-icon.png'),
  createLink('Babel', 'https://www.babeljs.cn', 'Babel 是一个 JavaScript 编译器', '构建工具', 'https://www.babeljs.cn/img/favicon.png'),
  createLink('esbuild', 'https://esbuild.github.io', 'An extremely fast bundler for the web', '构建工具', 'https://esbuild.github.io/favicon.svg'),
  createLink('SWC', 'https://swc.rs', 'Rust-based platform for the Web', '构建工具', 'https://swc.rs/favicon/apple-touch-icon.png'),

  // CSS
  createLink('TailwindCSS', 'https://www.tailwindcss.cn', '一个功能类优先的 CSS 框架', 'CSS', 'https://www.tailwindcss.cn/apple-touch-icon.png'),
  createLink('Sass', 'https://sass-lang.com', '一个成熟，稳定，功能强大的专业级 CSS 扩展语言', 'CSS', 'https://sass-lang.com/assets/img/logos/logo-b6e1ef6e.svg'),
  createLink('PostCSS', 'https://postcss.org', '一个用 JavaScript 转换 CSS 的工具', 'CSS', 'https://postcss.org/assets/logo-3e39b0aa.svg'),
  createLink('UnoCSS', 'https://uno.antfu.me/', '即时按需原子 CSS 引擎', 'CSS'),
  createLink('Bootstrap', 'https://v5.bootcss.com/', 'Bootstrap 是全球最受欢迎的前端开源工具库', 'CSS'),

  // 社区
  createLink('Stack Overflow', 'https://stackoverflow.com', '全球最大的技术问答网站', '社区', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a'),
  createLink('稀土掘金', 'https://juejin.cn', '面向全球中文开发者的技术内容分享与交流平台', '社区', 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/apple-touch-icon.png'),
  createLink('V2EX', 'https://www.v2ex.com', '一个关于分享和探索的地方', '社区', 'https://www.v2ex.com/static/icon-192.png'),
  createLink('SegmentFault', 'https://segmentfault.com', '技术问答开发者社区', '社区', 'https://static.segmentfault.com/main_site_next/0dc4bace/touch-icon.png'),
  createLink('博客园', 'https://www.cnblogs.com', '博客园是一个面向开发者的知识分享社区', '社区'),
  createLink('知乎', 'https://zhihu.com', '中文互联网高质量的问答社区和创作者聚集的原创内容平台', '社区', 'https://static.zhihu.com/heifetz/assets/apple-touch-icon-60.362a8eac.png'),

  // 代码托管
  createLink('Github', 'https://github.com', '一个面向开源及私有软件项目的托管平台', '代码托管'),
  createLink('Gitee', 'https://gitee.com/', 'Gitee 是中国领先的基于 Git 的代码托管平台', '代码托管'),
  createLink('Gitlab', 'https://gitlab.com/', '更快地交付安全代码，部署到任何云', '代码托管', 'https://gitlab.com/uploads/-/system/group/avatar/6543/logo-extra-whitespace.png?width=64'),

  // 网站托管
  createLink('Vercel', 'https://vercel.com', 'Vercel将最好的开发人员体验与对最终用户性能的执着关注相结合', '网站托管'),
  createLink('Netlify', 'https://www.netlify.com', 'Netlify 是一家提供静态网站托管的云平台', '网站托管'),
  createLink('Railway', 'https://railway.app/', '带上你的代码，剩下交给我们', '网站托管'),
  createLink('Supabase', 'https://supabase.com/', 'Supabase 是一个开源的后端即服务（BaaS）平台', '网站托管'),
].map((link, index) => ({ ...link, order: index }));
