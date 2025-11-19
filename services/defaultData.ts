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
  backgroundColor?: string,
  iconScale?: number
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
    iconScale: iconScale || 0.7,
    tags: [],
    order: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 默认导航链接数据
 * 分类：主页、技术框架、工具资源、社区论坛、影音视听
 */
export const defaultLinks: Link[] = [
  // 主页
  createLink('Gmail', 'https://mail.google.com/', 'Google提供的免费电子邮件服务', '主页', 'https://favicon.im/mail.google.com?larger=true', '#ffffff'),
  createLink('微信网页版', 'https://wx.qq.com', '使用手机微信扫码登录', '主页', 'https://api.iconify.design/ant-design/wechat-filled.svg?color=%23ffffff', '#08c15f'),
  createLink('唯知主页', 'https://weizwz.com', '分享编码世界，拥抱现代科技生活', '主页', 'https://p.weizwz.com/home_white_0e91e04b62808beb.webp', '#1890ff'),
  createLink('Cloudflare', 'https://dash.cloudflare.com', '一站式配置和托管网站', '主页', 'https://cdn.simpleicons.org/cloudflare/ffffff', '#f38020'),
  createLink('码云', 'https://gitee.com', '代码托管和研发协作平台', '主页', 'https://cdn.simpleicons.org/gitee/ffffff', '#c71d23'),
  createLink('Github', 'https://github.com', '全球最大的代码托管平台', '主页', 'https://cdn.simpleicons.org/github/ffffff', '#181717', 0.6),
  createLink('QQ邮箱', 'https://mail.qq.com', '腾讯提供的高效稳定便捷的电子邮件服务', '主页', 'https://favicon.im/mail.qq.com?larger=true', '#ffffff'),
  createLink('语雀', 'https://www.yuque.com', '优雅高效的在线文档编辑与协同工具', '主页', 'https://favicon.im/www.yuque.com?larger=true', '#4bce75'),
  createLink('唯知笔记', 'https://note.weizwz.com/', '探索知识的无限可能', '主页', 'https://p.weizwz.com/logo_white.svg?', '#1890ff'),
  createLink('IT Dog', 'https://www.itdog.cn/ping', '多地Ping，网络延迟测试', '主页', 'https://api.iconify.design/roentgen/dog.svg?color=%23ffffff', '#ffc53d'),
  createLink('网易云音乐', 'https://music.163.com', '一款专注于发现与分享的音乐产品', '主页', 'https://cdn.simpleicons.org/neteasecloudmusic/ffffff', '#fc4a47'),
  createLink('MDN', 'https://developer.mozilla.org/zh-CN/', '面向 Web 开发者的技术文档', '主页', 'https://cdn.simpleicons.org/mdnwebdocs/ffffff', '#000000', 0.5),
  createLink('163邮箱', 'https://mail.163.com', '中文邮箱第一品牌', '主页', 'https://favicon.im/mail.163.com?larger=true', '#ffffff'),
  createLink('Ctool', 'https://ctool.dev/', '程序开发常用工具\n', '主页', 'https://favicon.im/ctool.dev?larger=true', '#d9d9d9', 1.0),
  createLink('飞书文档', 'https://docs.feishu.cn/', '一站式企业沟通与协作平台', '主页', 'https://favicon.im/docs.feishu.cn?larger=true', '#bae0ff'),
  createLink('Stack Overflow', 'https://stackoverflow.com', '全球最大的技术问答网站', '主页', 'https://cdn.simpleicons.org/stackoverflow/ffffff', '#f58025', 0.6),
  createLink('youtube', 'https://www.youtube.com', '全球最大的在线视频分享平台', '主页', 'https://cdn.simpleicons.org/youtube/ffffff', '#ff0000', 0.6),
  createLink('Vercel', 'https://vercel.com', '网站部署和托管平台', '主页', 'https://cdn.simpleicons.org/vercel/ffffff', '#000000', 0.5),
  createLink('通义', 'https://www.tongyi.com', '你的超级个人助理', '主页', 'https://favicon.im/www.tongyi.com?larger=true', '#ffffff'),
  createLink('Netlify', 'https://www.netlify.com', '静态网站托管平台', '主页', 'https://cdn.simpleicons.org/netlify/ffffff', '#00c7b7', 0.6),
  createLink('Google 学术', 'https://scholar.google.com/', '免费学术搜索引擎，可检索全球学术论文、专利、书籍及引用信息', '主页', 'https://cdn.simpleicons.org/googlescholar/ffffff', '#4285f4'),
  createLink('ES6', 'https://es6.ruanyifeng.com/', '阮一峰 ES6 入门教程', '主页', 'https://cdn.simpleicons.org/javascript/ffffff', '#ffc53d', 0.6),
  createLink('阿里云', 'https://aliyun.com/', '全球知名的云服务，提供弹性计算、数据库、安全、AI 等', '主页', 'https://api.iconify.design/ant-design/aliyun-outlined.svg?color=%23ffffff', '#ff6a00'),
  createLink('Next.js', 'https://nextjs.org', '用于 Web 的 React 框架', '主页', 'https://cdn.simpleicons.org/nextdotjs/ffffff', '#000000', 0.6),
  createLink('夸克网盘', 'https://pan.quark.cn', '夸克浏览器推出的一款云服务产品，功能包括云存储、高清看剧、文件在线解压、PDF一键转换等', '主页', 'https://favicon.im/pan.quark.cn?larger=true', '#ffffff'),
  createLink('iconfont', 'https://www.iconfont.cn/', '流行的矢量图标库', '主页', 'https://favicon.im/www.iconfont.cn?larger=true', '#13c2c2', 0.6),
  createLink('百度网盘', 'https://pan.baidu.com', '提供文件的网络备份、同步和分享服务', '主页', 'https://api.iconify.design/arcticons/baidu-netdisk.svg?color=%23ffffff', '#237bfe'),

  // 技术框架
  createLink('Vite', 'https://cn.vitejs.dev/guide/', '下一代的前端工具链', '技术框架', 'https://favicon.im/cn.vitejs.dev?larger=true', '#ffffff', 0.6),
  createLink('Vue', 'https://cn.vuejs.org', '渐进式 JavaScript 框架', '技术框架', 'https://cdn.simpleicons.org/vuedotjs/ffffff', '#4fc08d', 0.6),
  createLink('React', 'https://zh-hans.reactjs.org', '用于构建用户界面的 JavaScript 库', '技术框架', 'https://cdn.simpleicons.org/react/ffffff', '#61dafb', 0.6),
  createLink('TypeScript', 'https://www.tslang.cn/docs/handbook/basic-types.html', 'TypeScript是 JS 类型的超集', '技术框架', 'https://cdn.simpleicons.org/typescript/ffffff', '#3178c6', 0.6),
  createLink('NPM', 'https://www.npmjs.com', '世界上最大的包管理器', '技术框架', 'https://favicon.im/www.npmjs.com?larger=true', '#cb0200', 0.8),
  createLink('Express', 'https://expressjs.com', '快速、开放、极简的 Web 开发框架', '技术框架', 'https://cdn.simpleicons.org/express/ffffff', '#000000', 0.6),
  createLink('微信官方文档', 'https://developers.weixin.qq.com/miniprogram/dev/framework/', '微信开发者文档', '技术框架', 'https://favicon.im/developers.weixin.qq.com?larger=true', '#ffffff', 0.6),
  createLink('Node.js', 'https://nodejs.org/zh-cn', '基于 Chrome V8 引擎的 JavaScript 运行环境', '技术框架', 'https://cdn.simpleicons.org/nodedotjs/ffffff', '#5fa04e', 0.6),
  createLink('Webpack', 'https://www.webpackjs.com', '现代 JavaScript 应用程序的静态模块打包工具', '技术框架', 'https://www.webpackjs.com/icon_180x180.png', '#8ed5fa'),
  createLink('VitePress', 'https://vitepress.dev', 'VitePress 是一个静态站点生成器 (SSG)', '技术框架', 'https://cdn.simpleicons.org/vitepress/ffffff', '#5c73e7'),
  createLink('Sass', 'https://sass-lang.com.cn/documentation/', 'Sass官方中文文档\n', '技术框架', 'https://favicon.im/sass-lang.com.cn?larger=true', '#cc6699'),
  createLink('shadcn/ui', 'https://ui.shadcn.com/docs/installation', 'shadcn/ui 是一组设计精美、易于访问的组件和代码分发平台', '技术框架', 'https://favicon.im/ui.shadcn.com?larger=true', '#000000', 0.8),
  createLink('DataV', 'http://datav.jiaminghi.com', '开源的可视化大屏组件库，支持 vue3 和 react', '技术框架', 'https://favicon.im/datav.jiaminghi.com?larger=true', '#ffffff'),
  createLink('uni-app', 'https://uniapp.dcloud.net.cn/', '一个使用 Vue.js 开发所有前端应用的框架', '技术框架', 'https://favicon.im/uniapp.dcloud.net.cn?larger=true', '#2b9939'),
  createLink('TailwindCSS', 'https://www.tailwindcss.cn', '功能类优先的 CSS 框架', '技术框架', 'https://cdn.simpleicons.org/tailwindcss/ffffff', '#16bcff'),
  createLink('Element Plus', 'https://element-plus.org/zh-CN/component/overview', '基于 Vue 3 的组件库', '技术框架', 'https://api.iconify.design/ep/element-plus.svg?color=%23ffffff', '#409eff'),
  createLink('Nest.js', 'https://docs.nestjs.cn', '渐进式 Node.js 框架', '技术框架', 'https://cdn.simpleicons.org/nestjs/ffffff', '#e0234e', 0.6),
  createLink('Unsplash', 'https://unsplash.com/developers', '免费、高质图片的 API 接入服务平台', '技术框架', 'https://cdn.simpleicons.org/unsplash/ffffff', '#000000', 0.6),
  createLink('Iconify', 'https://iconify.design/docs/', '统一调用多图标库的开发者工具。', '技术框架', 'https://favicon.im/iconify.design?larger=true', '#ffffff'),
  createLink('Nuxt.js', 'https://nuxt.com', '基于 Vue.js 的通用应用框架', '技术框架', 'https://cdn.simpleicons.org/nuxt/ffffff', '#00dc82'),
  createLink('Ant Design', 'https://ant.design', '企业级 UI 设计语言和 React 组件库', '技术框架', 'https://favicon.im/ant.design?larger=true', '#bae0ff', 0.6),
  createLink('Font Awesome', 'https://fontawesome.com/search', '可查找并使用数千个免费和高级的 SVG 图标。', '技术框架', 'https://cdn.simpleicons.org/fontawesome/ffffff', '#538dd7', 0.6),
  createLink('ECharts', 'https://echarts.apache.org/zh/api.html#echarts', '最流行的基于 JS 的数据可视化图表库', '技术框架', 'https://favicon.im/echarts.apache.org?larger=true', '#aa314d', 0.8),
  createLink('Simeple Icons', 'https://simpleicons.org/', '免费提供超 2500 个开源品牌图标的 SVG 库', '技术框架', 'https://cdn.simpleicons.org/simpleicons/ffffff', '#111111'),
  createLink('NutUI', 'https://nutui.jd.com/', '京东出品的、支持多端的、轻量级移动端组件库', '技术框架', 'https://favicon.im/nutui.jd.com?larger=true', '#ffffff'),
  createLink('PrimeVue', 'https://primevue.org/', 'Vuejs 的下一代  UI 套件', '技术框架', 'https://cdn.simpleicons.org/primevue/ffffff', '#41b883', 0.6),
  createLink('百度地图 API', 'https://lbsyun.baidu.com/index.php?title=jspopularGL', '基于 WebGL 的 3D 地图开发接口，支持高性能、多端交互式地图应用构建', '技术框架', 'https://api.iconify.design/ph/map-pin-area-fill.svg?color=%23ffffff', '#73d9ff'),
  createLink('高德地图 API', 'https://lbs.amap.com/api/javascript-api-v2/summary', '基于 WebGL 的 Web 地图渲染引擎，支持高性能、多端适配的地理可视化与交互开发', '技术框架', 'https://api.iconify.design/fa-solid/paper-plane.svg?color=%23ffffff', '#2285fe', 0.6),
  createLink('Lucide', 'https://lucide.dev/icons/', '开源图标库，提供众多矢量（SVG）图片', '技术框架', 'https://cdn.simpleicons.org/lucide/ffffff', '#f56565', 0.6),
  createLink('CodePen', 'https://codepen.io/trending', '展示当前社区中最受欢迎和最新颖的前端代码作品', '技术框架', 'https://cdn.simpleicons.org/codepen/ffffff', '#000000'),
  createLink('Remix Icon', 'https://remixicon.com', '免费、开源的中性风格系统图标', '技术框架', 'https://favicon.im/remixicon.com?larger=true', '#ffffff'),
  createLink('Inspira UI', 'https://inspira-ui.com/docs/components', '基于 Tailwind CSS 的现代组件库，提供丰富炫酷的 UI 组件与交互动效，助力快速构建高颜值 Web 应用', '技术框架', 'https://favicon.im/inspira-ui.com?larger=true', '#ffffff'),
  createLink('pnpm', 'https://www.pnpm.cn/installation', '速度快、节省磁盘空间的软件包管理器', '技术框架', 'https://cdn.simpleicons.org/pnpm/ffffff', '#f69220', 0.6),
  createLink('Motion', 'https://motion.dev/docs/quick-start', '轻量级 JS 动画库，支持 HTML、SVG 和 WebGL，提供高性能、易用的声明式动画 API', '技术框架', 'https://favicon.im/motion.dev?larger=true', '#fdeb0e', 0.8),

  // 工具资源
  createLink('TinyPNG', 'https://tinypng.com', '在线图片压缩工具', '工具资源', 'https://tinypng.com/images/apple-touch-icon.png', '#ffffff', 0.6),
  createLink('在线工具', 'https://tool.lu/tool', '开发人员的工具箱', '工具资源', 'https://tool.lu/favicon.ico', '#019a61', 0.6),
  createLink('ProccessOn', 'https://www.processon.com/', '一款优秀的国产在线协作画图软件', '工具资源', 'https://favicon.im/www.processon.com?larger=true', '#1f7bef'),
  createLink('100font', 'https://www.100font.com/', '免费商用中英文字体下载站，聚合开源与可商用字体资源', '工具资源', 'https://favicon.im/www.100font.com?larger=true', '#f7c600'),
  createLink('Google Analytics', 'https://analytics.google.com/', '免费的网站与应用数据分析平台', '工具资源', 'https://cdn.simpleicons.org/googleanalytics/ffffff', '#e37400', 0.6),
  createLink('Figma', 'https://www.figma.com/', '最专业的协作式界面设计工具，支持实时协同、原型交互与设计系统管理', '工具资源', 'https://favicon.im/www.figma.com?larger=true', '#2b2c34'),
  createLink('AST Explorer', 'https://astexplorer.net/', '探索由各种解析器生成的 AST 语法树', '工具资源', 'https://favicon.im/astexplorer.net?larger=true', '#ffffff', 0.6),
  createLink('Swagger', 'https://swagger.io/', 'API 文档和设计工具', '工具资源', 'https://cdn.simpleicons.org/swagger/ffffff', '#85ea2d', 0.6),
  createLink('transform', 'https://transform.tools/json-to-typescript', 'JSON to TS，还支持其他各类数据格式与对象转换', '工具资源', 'https://favicon.im/transform.tools?larger=true', '#2091ff'),
  createLink('在线抠图', 'https://www.remove.bg/zh', 'AI 驱动的在线抠图工具，一键自动去除图片背景，支持人像、产品、汽车等多场景', '工具资源', 'https://favicon.im/www.remove.bg?larger=true', '#fec83d'),
  createLink('Postman', 'https://www.postman.com/', 'API 开发协作平台', '工具资源', 'https://cdn.simpleicons.org/postman/ffffff', '#ff6c37', 0.6),
  createLink('Easy Mock', 'https://mock.mengxuegu.com/docs', '基于 Easy Mock 的在线接口模拟平台，用于快速生成和调试 API', '工具资源', 'https://favicon.im/mock.mengxuegu.com?larger=true', '#1f2d3d'),
  createLink('Favicon.im', 'https://favicon.im/zh/', '即时获取和下载任何网站的图标', '工具资源', 'https://favicon.im/favicon.im?larger=true', '#ffffff'),
  createLink('Json 中文网', 'https://www.json.cn', 'JSON 在线解析及格式化验证', '工具资源', 'https://api.iconify.design/tabler/json.svg?color=%23ffffff', '#0fd59d'),
  createLink('ThisCover', 'https://cover.weizwz.com/', '一个免费、漂亮的封面生成器', '工具资源', 'https://p.weizwz.com/cover/cover_full_441653186ab35580.webp', '#4c38da', 1.0),
  createLink('Can I use', 'https://caniuse.com', '前端 API 兼容性查询', '工具资源', 'https://caniuse.com/img/favicon-128.png', '#f2e8d4'),
  createLink('Apifox', 'https://www.apifox.cn/', 'API 文档、调试、Mock、自动化测试', '工具资源', 'https://api.iconify.design/simple-icons/apifox.svg?color=%23ffffff', '#fe4b6e', 0.6),
  createLink('MockUPhone', 'https://mockuphone.com/', '免费在线的带壳截图网站，一键将设计稿嵌入 iPhone、三星等设备截图', '工具资源', 'https://favicon.im/mockuphone.com?larger=true', '#000000'),
  createLink('Gradients.app', 'https://gradients.app/zh/gradient', '下载漂亮的CSS和PNG渐变色', '工具资源', 'https://favicon.im/gradients.app?larger=true', '#ffffff'),
  createLink('Hoppscotch', 'https://hoppscotch.io/', '开源 API 开发生态系统', '工具资源', 'https://api.iconify.design/simple-icons/hoppscotch.svg?color=%23ffffff', '#10b981'),
  createLink('UU 在线工具', 'https://uutool.cn/uuid/', '用来生成 uuid，还有其他更多免费实用工具', '工具资源', 'https://favicon.im/uutool.cn?larger=true', '#1779ba'),
  createLink('Shields.io', 'https://shields.io/badges', '提供简洁、美观的开源项目徽章', '工具资源', 'https://cdn.simpleicons.org/shieldsdotio/ffffff', '#000000', 0.6),

  // 社区论坛
  createLink('今日头条', 'https://www.toutiao.com', '今日头条为您推荐有价值的、个性化的信息', '社区论坛', 'https://favicon.im/www.toutiao.com?larger=true', '#ffffff'),
  createLink('SegmentFault', 'https://segmentfault.com', '技术问答开发者社区', '社区论坛', 'https://favicon.im/segmentfault.com?larger=true', '#019a61'),
  createLink('博客园', 'https://www.cnblogs.com', '开发者的网上家园', '社区论坛', undefined, '#bae0ff'),
  createLink('远景论坛', 'https://www.pcbeta.com/', '微软极客社区', '社区论坛', 'https://favicon.im/www.pcbeta.com?larger=true', '#1a85db'),
  createLink('小红书', 'https://www.xiaohongshu.com', '一个年轻生活方式分享平台', '社区论坛', 'https://cdn.simpleicons.org/xiaohongshu/ffffff', '#ff2341'),
  createLink('V2EX', 'https://www.v2ex.com', '创意工作者们的社区', '社区论坛', 'https://cdn.simpleicons.org/v2ex/ffffff', '#000000', 0.6),
  createLink('简书', 'https://www.jianshu.com/', '中文创作与阅读社区，支持图文排版、连载写作与知识分享', '社区论坛', 'https://favicon.im/www.jianshu.com?larger=true', '#ffffff'),
  createLink('BOSS直聘', 'https://www.zhipin.com', '权威领先的招聘网，开启人才网招聘求职新时代', '社区论坛', 'https://api.iconify.design/arcticons/boss-zhipin.svg?color=%23ffffff', '#5dd5c6', 0.8),
  createLink('稀土掘金', 'https://juejin.cn', '面向全球中文开发者的技术内容分享与交流平台', '社区论坛', 'https://cdn.simpleicons.org/juejin/ffffff', '#007fff'),
  createLink('知乎', 'https://zhihu.com', '中文互联网高质量的问答社区', '社区论坛', 'https://favicon.im/zhihu.com?larger=true', '#bae0ff', 1.0),
  createLink('CSDN', 'https://www.csdn.net/', '中国专业的中文开发者社区', '社区论坛', 'https://cdn.simpleicons.org/csdn/ffffff', '#fc5531'),

  // 影音视听
  createLink('哔哩哔哩', 'https://www.bilibili.com', '国内知名的视频弹幕网站', '影音视听', 'https://cdn.simpleicons.org/bilibili/ffffff', '#13aeec'),
  createLink('直播吧', 'https://www.zhibo8.cc', '知名体育平台', '影音视听', 'https://favicon.im/www.zhibo8.cc?larger=true', '#2e9fff'),
  createLink('爱奇艺', 'https://www.iqiyi.com', '大型视频网站，专业的网络视频播放平台', '影音视听', 'https://api.iconify.design/arcticons/iqiyi.svg?color=%23ffffff', '#479f06'),
  createLink('虎牙直播', 'https://www.huya.com', '以游戏直播为主的弹幕式互动直播平台', '影音视听', 'https://api.iconify.design/arcticons/huya-live.svg?color=%23ffffff', '#ff9601'),
].map((link, index) => ({ ...link, order: index }));

/**
 * 分类图标映射
 * 为每个分类名称指定对应的图标
 */
const categoryIconMap: Record<string, string> = {
  '主页': 'HomeOutlined',
  '技术框架': 'CodeOutlined',
  '工具资源': 'ToolOutlined',
  '社区论坛': 'TeamOutlined',
  '影音视听': 'VideoCameraOutlined',
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

/**
 * 获取默认分类名称
 * 返回第一个分类的名称，如果没有分类则返回空字符串
 */
export const getDefaultCategoryName = (): string => {
  return defaultCategories.length > 0 ? defaultCategories[0].name : '';
};
