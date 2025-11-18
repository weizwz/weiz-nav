# 前端导航网站

现代化的个人前端导航网站，基于 Next.js 15 构建。

> 🚀 **快速部署**：查看 [QUICKSTART.md](./.kiro/specs/frontend-navigation-site/QUICKSTART.md) 了解如何在 5 分钟内部署到 Cloudflare Pages

## 技术栈

- **框架**: Next.js 15.x (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 4.x
- **UI 组件库**: Ant Design 5.x
- **图标**: @ant-design/icons
- **动画库**: framer-motion
- **状态管理**: Redux Toolkit 2.x
- **主题管理**: next-themes
- **包管理器**: pnpm

## 开始使用

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

### 部署

```bash
# 构建静态文件
pnpm build

# 本地预览静态文件
pnpm serve:static

# 部署到 Cloudflare Pages（推荐）
pnpm deploy

# 或部署到 Vercel
pnpm deploy:vercel
```

详细的部署指南请查看 [DEPLOYMENT.md](./.kiro/specs/frontend-navigation-site/DEPLOYMENT.md)

**推荐使用 Cloudflare Pages**：免费额度大，中国访问速度快，全球 CDN

## 项目结构

```
weiz-nav/
├── api/                      # API 接口
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页
│   └── globals.css          # 全局样式
├── components/              # React 组件
├── store/                   # Redux 状态管理
├── services/                # 业务逻辑服务
├── types/                   # TypeScript 类型定义
└── utils/                   # 工具函数
```

## 功能特性

- 响应式设计，支持多种设备
- 实时搜索功能
- 搜索引擎切换
- 链接卡片管理（添加、编辑、删除）
- 可视化数据管理界面
- 本地数据持久化
- 明暗主题切换
- 数据导入导出

## 开发规范

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码规范检查
- 使用 Tailwind CSS 进行样式开发
- 使用 Redux Toolkit 进行状态管理

## License

MIT
