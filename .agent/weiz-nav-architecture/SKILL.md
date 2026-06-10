---
name: weiz-nav-architecture
description: 唯知导航 (Weiz Nav) 项目的具体架构、主要文件目录和重点逻辑指南，作为后续开发的参考依据。
---

# Weiz Nav 项目架构与重点逻辑指南

## 1. 整体架构概述

本项目采用基于 `pnpm` workspace 的 Monorepo（单体仓库）架构。其核心理念是**“一套核心逻辑与UI，多端运行”**。将具体的应用入口层（Apps）与共享逻辑/视图层（Packages）解耦，使得同一套代码能够完美同时适配 Web 端（基于 Next.js）和 Chrome 浏览器插件端（基于 React + Vite 的 SPA）。

## 2. 核心技术栈

- **框架引擎**: Next.js 16 (App Router), React 19, Vite (用于 Extension)
- **语言类型**: TypeScript 5
- **样式方案**: Tailwind CSS 4 + Ant Design 6
- **状态管理**: Redux Toolkit
- **拖拽交互**: `@dnd-kit` (支持书签、分类的拖拽排序)
- **动画引擎**: Framer Motion
- **构建部署**: OpenNext + Cloudflare Workers (Web端), Vite Build (Extension端)

## 3. 主要文件目录结构

```text
weiz-nav/
├── apps/
│   ├── web/               # 核心 Web 端应用 (Next.js 16 App Router)
│   └── extension/         # Chrome 浏览器扩展端 (React + Vite SPA)
├── packages/
│   ├── core/              # 核心领域逻辑、全局类型定义、数据默认配置 (如 data.json)
│   ├── services/          # 基础服务层 (数据持久化 Storage、外部 API 封装如 Favicon API)
│   ├── store/             # 全局状态管理层 (Redux Toolkit，包含 links, categories, settings 等切片)
│   └── ui/                # 跨端共享视图层 (包含所有通用 UI 组件，如 LinkCard, ManageView, Header)
└── scripts/               # 工程化脚手架与自动化脚本 (如 sync-version.js 同步各个包版本)
```

## 4. 重点逻辑与开发模式 (必读)

### 4.1 跨端组件共享与路由解耦 (Web vs Extension)
- **UI 复用原则**：所有涉及到业务逻辑的页面或大组件（如“数据管理”视图），必须编写在 `packages/ui` 内（如 `ManageView.tsx`）。
- **Next.js 与纯 React 的差异屏蔽**：在 `packages/ui` 中的组件**禁止直接硬编码使用 Next.js 特有 API**（如 `next/navigation` 的 `useRouter` 或 `<Link href="...">` 直接跳转）。
- **解决方案**：共享组件应通过抛出事件回调（如 `onManageClick`、`onBack`）将路由控制权交还给调用方。
  - Web 端 (`apps/web`) 接收回调并使用 `router.push('/manage')`。
  - Extension 端 (`apps/extension`) 作为单页面应用没有真实的多路由，应通过基于 `#` 的 Hash 路由（如 `window.location.hash = 'manage'`）来实现视图切换，以防止 404 (`ERR_FILE_NOT_FOUND`)。

### 4.2 Ant Design 与 Theme 全局注入
- **样式对齐**：为了让 Web 与 Extension 的 UI（如圆角大小 `borderRadius: 8`，主题色，暗黑模式响应）保持 1:1 的绝对一致，两端的入口文件（Web的 `Providers.tsx` 与 Extension的 `main.tsx`）必须进行相同的包裹。
- **环境要求**：必须在最外层严格包裹以下三个提供者：
  1. `<ConfigProvider>`：注入自定义主题 Token 与算法（区分深色/浅色算法）。
  2. Ant Design 的全局 `<App>` 容器。
  3. 自定义的 `<MessageProvider />` 组件：负责调用 `App.useApp()` 获取弹窗实例，并执行 `setMessageApi`，否则在组件中调用 `showError` / `showSuccess` 会抛出 `Message API not initialized` 的致命警告。

### 4.3 图标与 Favicon 渲染策略 (`LinkCard.tsx`)
- **优先级设定**：用户的显式配置具有最高优先级。
- **动态回退策略**：
  - 若用户未提供图标，系统会调用 `getFaviconUrl(url, { larger: true })` 自动生成自带 `throw-error-on-404=true` 的 URL。如果目标站点未配置图标，它将触发 `onError` 并降级展示默认的字母文本头像。
  - 若用户配置了来源于 `favicon.im` 的 URL，组件会提取原 URL 中是否包含 `larger=true` 的参数进行应用继承，严格尊重用户的预设输入。

### 4.4 数据同步与版本管理
- **跨包版本同步**：项目使用 `scripts/sync-version.js` 进行版本统一发布管理。它会同时更新所有 `package.json`、`manifest.json` 以及 `packages/core/src/data.json` 中的版本号字段。
- **状态同步机制**：Redux Toolkit 与 LocalStorage 高度绑定。在加载应用时会自动通过 `storageService` 进行 Hydration，并通过监听 `storage` 事件（在 `DataInitializer` 组件中）实现多标签页（或不同环境下的）数据联动刷新。

## 5. 开发调试建议
- **Web 端**：在根目录运行 `pnpm --filter @weiz-nav/web run dev`。
- **扩展端**：由于 Extension 依赖 Vite 的打包产物，在修改共享 UI 时，需要执行 `pnpm --filter @weiz-nav/extension run build`，并在 Chrome (`chrome://extensions/`) 中点击“重新加载”图标才能看到完整生效结果。由于某些静态资源（如 `logo.png`）是从项目的 `public` 加载，需确保两者路径在 `manifest.json` 中配置一致，避免资源找不到导致的残缺问题。
