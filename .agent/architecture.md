# weiz-nav 架构与技术要点分析

## 1. 整体架构

采用基于 `pnpm` workspace 的 Monorepo 架构，将应用层（Apps）与共享逻辑层（Packages）解耦，实现代码的高度复用与模块化管理。

### 目录结构抽象

- **apps/** (应用侧)
  - `web/`: 核心 Web 端导航项目，基于 Next.js 16 (App Router)。
  - `extension/`: Chrome 浏览器扩展端，基于 React + Vite 构建。
- **packages/** (公共依赖侧)
  - `core/`: 核心领域逻辑、全局类型定义、数据校验及通用工具函数。
  - `services/`: 基础服务层，包括数据持久化（Local Storage 等）及外部 API 封装（Iconify、Favicon服务）。
  - `store/`: 状态管理层，基于 Redux Toolkit，封装了应用的 slices（Links, Search, Settings, Categories, UI）及 Hooks。

## 2. 核心技术栈

- **框架引擎**: Next.js 16, React 19
- **语言类型**: TypeScript 5
- **样式方案**: Tailwind CSS 4 + Ant Design 6
- **状态管理**: Redux Toolkit
- **拖拽交互**: `@dnd-kit` (支持书签、分类拖拽排序)
- **动画引擎**: Framer Motion
- **构建部署**: OpenNext + Cloudflare Workers

## 3. 技术架构亮点

### 3.1 极致的模块化与逻辑复用

通过拆分 `core`、`services` 和 `store` 为独立的 packages，将底层数据结构、状态流转和外部服务调用抽象出来。无论是 Next.js 主站还是 Chrome 扩展，都可以直接 `workspace:*` 引入，消除了重复代码，降低了多端维护成本。

### 3.2 边缘侧 Serverless 部署

借助 `@opennextjs/cloudflare` 方案，将 Next.js 应用完整编译并部署至 Cloudflare Workers 边缘计算节点。此方案不仅支持全量 SSR 能力，还能充分利用边缘节点的全球分布加速访问，大幅降低延迟与服务器成本。

### 3.3 现代化 UI 与交互设计

深度结合 Tailwind CSS 的原子化能力与 Ant Design 的成熟组件，实现复杂与灵活兼顾的 UI 开发。引入 `@dnd-kit` 处理复杂的列表与网格拖拽排序，结合 `framer-motion` 为主题切换、弹窗、列表变化提供顺滑的过渡动效。

### 3.4 PWA 与离线可用性

原生支持 PWA（Progressive Web App）特性，并配套了本地 HTTPS 开发环境脚本 (`dev:https`)。配合离线缓存策略，允许用户将导航站作为原生桌面/移动应用安装并使用。
