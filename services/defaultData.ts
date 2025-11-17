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
 * 分类：主页、技术框架、工具软件、社区论坛、影音视听
 */
export const defaultLinks: Link[] = [
  // 主页
  createLink('MDN', 'https://developer.mozilla.org/zh-CN/', '面向 Web 开发者的技术文档', '主页', 'https://cdn.simpleicons.org/mdnwebdocs/ffffff', '#000000'),
  createLink('Github', 'https://github.com', '全球最大的代码托管平台', '主页', 'https://cdn.simpleicons.org/github/ffffff', '#181717'),
  createLink('唯知主页', 'https://weizwz.com', '分享编码世界，拥抱现代科技生活', '主页', 'https://p.weizwz.com/home_white_0e91e04b62808beb.webp', '#1890ff'),
  createLink('码云', 'https://gitee.com', '代码托管和研发协作平台', '主页', 'https://favicon.im/gitee.com?larger=true', '#d90213'),
  createLink('Stack Overflow', 'https://stackoverflow.com', '全球最大的技术问答网站', '主页', 'https://favicon.im/stackoverflow.com?larger=true', '#ffe7ba'),
  createLink('唯知笔记', 'https://note.weizwz.com/', '探索知识的无限可能', '主页', 'https://favicon.im/note.weizwz.com?larger=true', '#4096ff33'),
  createLink('Vercel', 'https://vercel.com', '网站部署和托管平台', '主页', 'https://cdn.simpleicons.org/vercel/ffffff', '#000000'),
  createLink('Netlify', 'https://www.netlify.com', '静态网站托管平台', '主页', 'https://cdn.simpleicons.org/netlify/ffffff', '#00c7b7'),
  createLink('微信网页版', 'https://wx.qq.com', '使用手机微信扫码登录', '主页', 'https://api.iconify.design/ant-design/wechat-filled.svg?color=%23ffffff', '#08c15f'),
  createLink('QQ邮箱', 'https://mail.qq.com', '腾讯提供的高效稳定便捷的电子邮件服务', '主页', 'https://favicon.im/mail.qq.com?larger=true', '#ffffff'),
  createLink('Gmail', 'https://mail.google.com/', 'Google提供的免费电子邮件服务', '主页', 'https://favicon.im/mail.google.com?larger=true', '#ffffff'),
  createLink('163邮箱', 'https://mail.163.com', '中文邮箱第一品牌', '主页', 'https://favicon.im/mail.163.com?larger=true', '#ff040033'),
  createLink('通义', 'https://www.tongyi.com', '你的超级个人助理', '主页', 'https://favicon.im/www.tongyi.com?larger=true', '#ffffff'),
  createLink('语雀', 'https://www.yuque.com', '优雅高效的在线文档编辑与协同工具', '主页', 'https://favicon.im/www.yuque.com?larger=true', '#ebfbf3'),
  createLink('飞书文档', 'https://docs.feishu.cn/', '一站式企业沟通与协作平台', '主页', 'https://favicon.im/docs.feishu.cn?larger=true', '#eef7fb'),
  createLink('百度网盘', 'https://pan.baidu.com', '提供文件的网络备份、同步和分享服务', '主页', 'https://pan.baidu.com/box-static/disk-theme/theme/white/img/logo@2x.png', '#ffffff'),
  createLink('今日头条', 'https://www.toutiao.com', '今日头条为您推荐有价值的、个性化的信息', '主页', 'https://favicon.im/www.toutiao.com?larger=true', '#ffffff'),
  createLink('夸克网盘', 'https://pan.quark.cn', '夸克浏览器推出的一款云服务产品', '主页', 'https://favicon.im/pan.quark.cn?larger=true', '#ffffff'),

  // 技术框架
  createLink('Vite', 'https://cn.vitejs.dev/guide/', '下一代的前端工具链', '技术框架', 'https://favicon.im/cn.vitejs.dev?larger=true', '#ffffff'),
  createLink('Vue', 'https://cn.vuejs.org', '渐进式 JavaScript 框架', '技术框架', 'https://cdn.simpleicons.org/vuedotjs/ffffff', '#4fc08d'),
  createLink('React', 'https://zh-hans.reactjs.org', '用于构建用户界面的 JavaScript 库', '技术框架', 'https://cdn.simpleicons.org/react/ffffff', '#61dafb'),
  createLink('Next.js', 'https://nextjs.org', '用于 Web 的 React 框架', '技术框架', 'https://cdn.simpleicons.org/nextdotjs/ffffff', '#000000'),
  createLink('Nuxt.js', 'https://nuxt.com', '基于 Vue.js 的通用应用框架', '技术框架', 'https://cdn.simpleicons.org/nuxt/ffffff', '#00dc82'),
  createLink('微信官方文档', 'https://developers.weixin.qq.com/miniprogram/dev/framework/', '微信开发者文档', '技术框架', 'https://favicon.im/developers.weixin.qq.com?larger=true', '#ffffff'),
  createLink('Node.js', 'https://nodejs.org/zh-cn', '基于 Chrome V8 引擎的 JavaScript 运行环境', '技术框架', 'https://cdn.simpleicons.org/nodedotjs/ffffff', '#5fa04e'),
  createLink('NPM', 'https://www.npmjs.com', '世界上最大的包管理器', '技术框架', 'https://favicon.im/www.npmjs.com?larger=true', '#cb0200'),
  createLink('ES6', 'https://es6.ruanyifeng.com/', '阮一峰 ES6 入门教程', '技术框架', 'https://cdn.simpleicons.org/javascript/ffffff', '#f7df1e'),
  createLink('TypeScript', 'https://www.tslang.cn/docs/handbook/basic-types.html', 'TypeScript是 JS 类型的超集', '技术框架', 'https://cdn.simpleicons.org/typescript/ffffff', '#3178c6'),
  createLink('Express', 'https://expressjs.com', '快速、开放、极简的 Web 开发框架', '技术框架', 'https://cdn.simpleicons.org/express/ffffff', '#000000'),
  createLink('Nest.js', 'https://docs.nestjs.cn', '渐进式 Node.js 框架', '技术框架', 'https://cdn.simpleicons.org/nestjs/ffffff', '#e0234e'),
  createLink('Ant Design', 'https://ant.design', '企业级 UI 设计语言和 React 组件库', '技术框架', 'https://favicon.im/ant.design?larger=true', '#bae0ff'),
  createLink('Element Plus', 'https://element-plus.org', '基于 Vue 3 的组件库', '技术框架', 'https://api.iconify.design/ep/element-plus.svg?color=%23ffffff', '#409eff'),
  createLink('TailwindCSS', 'https://www.tailwindcss.cn', '功能类优先的 CSS 框架', '技术框架', 'https://cdn.simpleicons.org/tailwindcss/ffffff', '#16bcff'),
  createLink('Webpack', 'https://www.webpackjs.com', '现代 JavaScript 应用程序的静态模块打包工具', '技术框架', 'https://www.webpackjs.com/icon_180x180.png', '#8ed5fa'),
  createLink('Sass', 'https://sass-lang.com.cn/documentation/', 'Sass官方中文文档', '技术框架', 'https://favicon.im/sass-lang.com.cn?larger=true', '#cc6699'),
  createLink('VitePress', 'https://vitepress.dev', 'VitePress 是一个静态站点生成器 (SSG)', '技术框架', 'https://cdn.simpleicons.org/vitepress/ffffff', '#5c73e7'),
  createLink('ECharts', 'https://echarts.apache.org/zh/api.html#echarts', '最流行的基于 JS 的数据可视化图表库', '技术框架', 'https://favicon.im/echarts.apache.org?larger=true', '#aa314d'),
  createLink('pnpm', 'https://www.pnpm.cn/installation', '速度快、节省磁盘空间的软件包管理器', '技术框架', 'https://cdn.simpleicons.org/pnpm/ffffff', '#f69220'),
  createLink('uni-app', 'https://uniapp.dcloud.net.cn/', '一个使用 Vue.js 开发所有前端应用的框架', '技术框架', 'https://favicon.im/uniapp.dcloud.net.cn?larger=true', '#2b9939'),
  createLink('shadcn/ui', 'https://ui.shadcn.com/docs/installation', 'shadcn/ui 是一组设计精美、易于访问的组件和代码分发平台', '技术框架', 'https://favicon.im/ui.shadcn.com?larger=true', '#000000'),
  createLink('iconfont', 'https://www.iconfont.cn/', '流行的矢量图标库', '技术框架', 'https://favicon.im/www.iconfont.cn?larger=true', '#000000'),

  // 工具软件
  createLink('ThisCover', 'https://cover.weizwz.com/', '一个免费、漂亮的封面生成器', '工具软件', 'https://p.weizwz.com/cover/cover_full_441653186ab35580.webp', '#4c38da'),
  createLink('Can I use', 'https://caniuse.com', '前端 API 兼容性查询', '工具软件', 'https://caniuse.com/img/favicon-128.png', '#f2e8d4'),
  createLink('TinyPNG', 'https://tinypng.com', '在线图片压缩工具', '工具软件', 'https://tinypng.com/images/apple-touch-icon.png', '#ffffff'),
  createLink('在线工具', 'https://tool.lu/tool', '开发人员的工具箱', '工具软件', 'https://tool.lu/favicon.ico', '#019a61'),
  createLink('ProcessOn', 'https://processon.com/', '免费在线流程图思维导图', '工具软件', 'https://processon.com/favicon.ico', '#1f7bef'),
  createLink('Json 中文网', 'https://www.json.cn', 'JSON 在线解析及格式化验证', '工具软件', 'https://api.iconify.design/tabler/json.svg?color=%23ffffff', '#0fd59d'),
  createLink('transform', 'https://transform.tools', '各类数据格式与对象转换', '工具软件', 'https://favicon.im/transform.tools?larger=true', '#2091ff'),
  createLink('AST Explorer', 'https://astexplorer.net/', '探索由各种解析器生成的 AST 语法树', '工具软件', 'https://favicon.im/astexplorer.net?larger=true', '#bae0ff'),
  createLink('Apifox', 'https://www.apifox.cn/', 'API 文档、调试、Mock、自动化测试', '工具软件', 'https://api.iconify.design/simple-icons/apifox.svg?color=%23ffffff', '#fe4b6e'),
  createLink('Hoppscotch', 'https://hoppscotch.io/', '开源 API 开发生态系统', '工具软件', 'https://api.iconify.design/simple-icons/hoppscotch.svg?color=%23ffffff', '#10b981'),
  createLink('Postman', 'https://www.postman.com/', 'API 开发协作平台', '工具软件', 'https://cdn.simpleicons.org/postman/ffffff', '#ff6c37'),
  createLink('Swagger', 'https://swagger.io/', 'API 文档和设计工具', '工具软件', 'https://cdn.simpleicons.org/swagger/ffffff', '#85ea2d'),

  // 社区论坛
  createLink('稀土掘金', 'https://juejin.cn', '面向全球中文开发者的技术内容分享与交流平台', '社区论坛', 'https://cdn.simpleicons.org/juejin/ffffff', '#007fff'),
  createLink('V2EX', 'https://www.v2ex.com', '创意工作者们的社区', '社区论坛', 'https://cdn.simpleicons.org/v2ex/ffffff', '#000000'),
  createLink('SegmentFault', 'https://segmentfault.com', '技术问答开发者社区', '社区论坛', 'https://favicon.im/segmentfault.com?larger=true', '#019a61'),
  createLink('博客园', 'https://www.cnblogs.com', '开发者的网上家园', '社区论坛', undefined, '#bae0ff'),
  createLink('知乎', 'https://zhihu.com', '中文互联网高质量的问答社区', '社区论坛', 'https://favicon.im/zhihu.com?larger=true', '#bae0ff'),
  createLink('远景论坛', 'https://www.pcbeta.com/', '微软极客社区', '社区论坛', 'https://favicon.im/www.pcbeta.com?larger=true', '#1a85db'),
  createLink('小红书', 'https://www.xiaohongshu.com', '一个年轻生活方式分享平台', '社区论坛', 'https://cdn.simpleicons.org/xiaohongshu/ffffff', '#ff2341'),
  createLink('BOSS直聘', 'https://www.zhipin.com', '权威领先的招聘网，开启人才网招聘求职新时代', '社区论坛', 'https://api.iconify.design/arcticons/boss-zhipin.svg?color=%23ffffff', '#5dd5c6'),

  // 影音视听
  createLink('youtube', 'https://www.youtube.com', '全球最大的在线视频分享平台', '影音视听', 'https://cdn.simpleicons.org/youtube/ffffff', '#ff0000'),
  createLink('网易云音乐', 'https://music.163.com', '一款专注于发现与分享的音乐产品', '影音视听', 'https://cdn.simpleicons.org/neteasecloudmusic/ffffff', '#fc4a47'),
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
  '工具软件': 'ToolOutlined',
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
