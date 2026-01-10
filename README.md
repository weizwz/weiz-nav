# 前端导航网站 🚀

<div align="center">

![](https://p.weizwz.com/nav/20251120_110028_78c15d3713752f31.webp)

现代化的个人前端导航网站，为开发者提供高效、美观的资源导航体验

全程使用 Kiro 的 Spec 模式开发，感谢 Claude Sonnet 4.5

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-1890ff)](https://ant.design/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

<a href="https://nav.weizwz.com" target="_blank">在线演示</a> | [快速开始](#-快速开始) | [文档](./.kiro/specs/frontend-navigation-site/) | [部署指南](./.kiro/specs/frontend-navigation-site/QUICKSTART.md)

</div>

---

## ✨ 核心特性

- 🎨 **响应式设计** - 完美适配桌面、平板、手机
- 🔍 **实时搜索** - 300ms 防抖，多维度匹配
- 📝 **灵活管理** - 添加、编辑、删除、拖拽排序
- 💾 **数据持久化** - LocalStorage 自动保存，支持导入导出
- 🌓 **主题切换** - 明暗主题，平滑过渡
- 📱 **PWA 支持** - 安装到桌面，离线可用
- ⚡ **性能优化** - 代码分割、懒加载、Lighthouse 90+
- ♿ **可访问性** - WCAG 2.1 AA 标准

---

## 🛠️ 技术栈

Next.js 15 · TypeScript 5 · Tailwind CSS 4 · Ant Design 5 · Redux Toolkit · Framer Motion

---

## 🚀 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd frontend-navigation-site

# 安装依赖
pnpm install

# 配置环境变量（可选）
cp .env.example .env.local
# 编辑 .env.local 设置你的网站 URL
# 静态部署时，cloudflare 上的环境变量无效，需要配置 .env.production/.env.local 且提交代码

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 部署到 Cloudflare Pages (静态部署)
pnpm deploy:cloudflare
```

### 切换部署模式

本项目支持**静态导出 (Static Export)** 和 **动态部署 (SSR)** 两种模式。

#### 1. 静态部署 (推荐)

适用于纯静态站点，性能最好，成本最低。

- 修改 `next.config.ts`: 取消注释 `output: 'export'`
- 修改 `wrangler.toml`: 设置 `pages_build_output_dir = "out"`
- 修改 `package.json`: `deploy:cloudflare` 命令使用 `pnpm build` 和 `out` 目录

#### 2. 动态部署 (SSR)

适用于需要服务端渲染或 API 路由的场景。

- 修改 `next.config.ts`: 注释掉 `output: 'export'`
- 修改 `wrangler.toml`: 设置 `pages_build_output_dir = ".vercel/output/static"` 并添加 `compatibility_flags = ["nodejs_compat"]`
- 修改 `package.json`: `deploy:cloudflare` 命令使用 `pnpm pages:build` 和 `.vercel/output/static` 目录

详细说明请查看 [快速开始指南](./.kiro/specs/frontend-navigation-site/QUICKSTART.md)

---

## 🚢 部署

推荐使用 **Cloudflare Pages**（免费额度大，中国访问速度快）

```bash
pnpm build
pnpm deploy
```

也支持 Vercel、GitHub Pages、Netlify 等平台

详细部署指南：[QUICKSTART.md](./.kiro/specs/frontend-navigation-site/QUICKSTART.md) | [DEPLOYMENT.md](./.kiro/specs/frontend-navigation-site/DEPLOYMENT.md)

---

## 📚 文档

**快速指南**

- [快速开始](./.kiro/specs/frontend-navigation-site/QUICKSTART.md) - 5 分钟快速部署
- [部署指南](./.kiro/specs/frontend-navigation-site/DEPLOYMENT.md) - 详细部署说明
- [PWA 使用指南](./.kiro/specs/frontend-navigation-site/PWA_GUIDE.md) - PWA 安装和使用
- [缓存清除指南](./.kiro/specs/frontend-navigation-site/CACHE_CLEAR_GUIDE.md) - 解决缓存问题

**开发文档**

- [需求文档](./.kiro/specs/frontend-navigation-site/requirements.md) - 功能需求
- [设计文档](./.kiro/specs/frontend-navigation-site/design.md) - 技术架构
- [任务列表](./.kiro/specs/frontend-navigation-site/tasks.md) - 开发任务

**技术指南**

- [搜索实现](./.kiro/specs/frontend-navigation-site/SEARCH_IMPLEMENTATION.md) - 搜索功能详解
- [错误处理](./.kiro/specs/frontend-navigation-site/ERROR_HANDLING.md) - 错误处理策略
- [可访问性](./.kiro/specs/frontend-navigation-site/ACCESSIBILITY.md) - 无障碍访问
- [HTTPS 配置](./.kiro/specs/frontend-navigation-site/HTTPS_SETUP.md) - 本地 HTTPS 开发

---

## 📄 许可证

MIT License - 查看 [LICENSE](./LICENSE) 了解详情

---

<div align="center">

Made with ❤️ by [weizwz](https://github.com/weizwz)

[⬆ 回到顶部](#前端导航网站-)

</div>
