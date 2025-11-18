# Cloudflare Pages 配置文件说明

本项目已配置好 Cloudflare Pages 部署，以下是相关配置文件的说明。

## 配置文件列表

### 核心配置

#### `wrangler.toml`
Wrangler CLI 的配置文件，用于命令行部署。

```toml
name = "weiz-nav"                    # 项目名称
compatibility_date = "2025-11-18"    # 兼容性日期
pages_build_output_dir = "out"       # 构建输出目录
```

#### `public/_redirects`
Cloudflare Pages 的重定向规则，用于支持客户端路由。

```
/* /index.html 200
```

这确保所有路由都指向 index.html，支持 SPA 模式。

#### `public/_headers`
自定义 HTTP 响应头，用于优化性能和安全性。

包含：
- 安全头（X-Frame-Options, X-Content-Type-Options 等）
- 缓存策略（静态资源长期缓存，HTML 不缓存）

### 部署脚本

#### `scripts/deploy-cloudflare.sh`
一键部署脚本，执行完整的构建和部署流程。

使用方法：
```bash
./scripts/deploy-cloudflare.sh
```

功能：
- 检查依赖
- 清理旧构建
- 安装依赖
- 运行 lint
- 构建项目
- 部署到 Cloudflare Pages

### CI/CD

#### `.github/workflows/cloudflare-pages.yml`
GitHub Actions 工作流，用于自动部署。

触发条件：
- 推送到 `main` 分支
- 创建 Pull Request

需要配置的 Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

配置说明：[.github/CLOUDFLARE_SETUP.md](../.github/CLOUDFLARE_SETUP.md)

### Next.js 配置

#### `next.config.ts`
Next.js 配置，启用静态导出。

```typescript
{
  output: 'export',              // 启用静态导出
  images: {
    unoptimized: true,          // 禁用图片优化（静态导出需要）
  },
  trailingSlash: true,          // URL 添加尾部斜杠
}
```

### 部署配置

#### `vercel.json`
Vercel 部署配置（备选方案）。

#### `package.json`
包含部署相关的 npm scripts：

```json
{
  "deploy": "pnpm deploy:cloudflare",
  "deploy:cloudflare": "wrangler pages deploy out --project-name=weiz-nav",
  "deploy:vercel": "vercel --prod"
}
```

## 部署方式

### 1. Git 集成（推荐）

最简单的方式，零配置：

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 连接仓库
3. 自动部署

### 2. Wrangler CLI

适合快速测试：

```bash
pnpm build
pnpm deploy
```

### 3. GitHub Actions

适合需要自定义 CI/CD 流程：

1. 配置 Secrets（见 `.github/CLOUDFLARE_SETUP.md`）
2. 推送代码自动触发部署

### 4. 部署脚本

一键完成所有步骤：

```bash
./scripts/deploy-cloudflare.sh
```

## 环境变量

如需配置环境变量：

1. 在 Cloudflare Pages 项目设置中添加
2. 或在 `wrangler.toml` 中配置：

```toml
[env.production.vars]
NEXT_PUBLIC_API_URL = "https://api.example.com"
```

**注意**：只有 `NEXT_PUBLIC_` 开头的变量才能在浏览器中访问。

## 自定义域名

1. 在 Cloudflare Pages 项目中添加自定义域名
2. 如果域名在 Cloudflare，自动配置 DNS
3. 如果不在，添加 CNAME 记录指向 `weiz-nav.pages.dev`

## 性能优化

项目已配置：

- ✅ 静态资源长期缓存（1年）
- ✅ HTML 不缓存（确保更新及时）
- ✅ 安全响应头
- ✅ 全球 CDN 分发

## 故障排查

### 构建失败
```bash
# 本地测试构建
pnpm build

# 检查错误
pnpm lint
```

### 部署失败
```bash
# 检查 Wrangler 登录状态
wrangler whoami

# 重新登录
wrangler login
```

### 路由 404
- 确认 `public/_redirects` 文件存在
- 确认 `trailingSlash: true` 在 `next.config.ts` 中

## 相关文档

- [快速开始](../.kiro/specs/frontend-navigation-site/QUICKSTART.md)
- [完整部署指南](../.kiro/specs/frontend-navigation-site/DEPLOYMENT.md)
- [GitHub Actions 配置](../.github/CLOUDFLARE_SETUP.md)

## 支持

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
