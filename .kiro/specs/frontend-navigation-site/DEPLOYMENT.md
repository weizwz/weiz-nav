# 部署指南

本文档提供将前端导航网站部署到 Cloudflare Pages 和 Vercel 的详细说明。

## 推荐部署平台

- **Cloudflare Pages**（推荐）：免费额度大，中国访问速度快，全球 CDN
- **Vercel**：部署简单，生态完善，适合熟悉 Vercel 的用户

---

# Cloudflare Pages 部署指南（推荐）

## 前置要求

- Node.js 20.x 或更高版本
- pnpm 10.x 或更高版本
- Git（用于版本控制）
- Cloudflare 账号（免费）

## 为什么选择 Cloudflare Pages？

- ✅ **免费额度大**：无限请求，500 次构建/月
- ✅ **中国访问快**：相比其他平台在中国访问速度更快
- ✅ **全球 CDN**：自动分发到全球 300+ 数据中心
- ✅ **零配置**：直接支持 Next.js 静态导出
- ✅ **自动 HTTPS**：免费 SSL 证书
- ✅ **Git 集成**：推送代码自动部署

## 构建配置

项目已配置为静态导出，在 `next.config.ts` 中的设置如下：

```typescript
{
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

## 本地构建和预览

### 构建项目

```bash
pnpm build
```

这将在 `out` 目录中生成静态文件。

### 本地预览构建结果

```bash
pnpm serve:static
```

然后在浏览器中打开 http://localhost:3000 查看。

## 部署到 Cloudflare Pages

### 方式一：通过 Git 集成（推荐）

这是最简单的方式，支持自动部署。

1. **推送代码到 Git 仓库**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **连接 Cloudflare Pages**

- 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
- 登录你的账号（没有账号则免费注册）
- 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

3. **选择仓库**

- 授权 Cloudflare 访问你的 GitHub/GitLab 账号
- 选择 `weiz-nav` 仓库

4. **配置构建设置**

```
项目名称: weiz-nav（或自定义）
生产分支: main
构建命令: pnpm build
构建输出目录: out
```

**高级设置**（可选）：
```
Node 版本: 20
环境变量: 如需要可添加
```

5. **开始部署**

- 点击 **Save and Deploy**
- 等待构建完成（通常 2-3 分钟）
- 部署成功后会获得一个 `.pages.dev` 域名

6. **自动部署**

配置完成后，每次推送到 `main` 分支都会自动触发部署。

### 方式二：通过 Wrangler CLI（快速部署）

适合快速测试或手动部署。

1. **安装 Wrangler CLI**

```bash
npm install -g wrangler
```

2. **登录 Cloudflare**

```bash
wrangler login
```

这会打开浏览器进行授权。

3. **构建项目**

```bash
pnpm build
```

4. **部署到 Cloudflare Pages**

```bash
# 首次部署
wrangler pages deploy out --project-name=weiz-nav

# 或使用 npm script
pnpm deploy
```

5. **后续部署**

```bash
pnpm deploy
```

### 方式三：通过拖拽上传

最简单但不支持自动部署。

1. 构建项目：`pnpm build`
2. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
3. 点击 **Create a project** → **Upload assets**
4. 将 `out` 文件夹拖拽到上传区域
5. 等待部署完成

## 环境变量配置

如果需要配置环境变量：

1. 在 Cloudflare Pages 项目中，进入 **Settings** → **Environment variables**

2. 添加环境变量：
   - **Variable name**: 变量名（如 `NEXT_PUBLIC_API_URL`）
   - **Value**: 变量值
   - **Environment**: 选择应用环境（Production/Preview）

3. 重新部署以应用更改

**注意**：只有以 `NEXT_PUBLIC_` 开头的环境变量才能在浏览器中访问。

## 自定义域名

### 添加自定义域名

1. 在 Cloudflare Pages 项目中，进入 **Custom domains**

2. 点击 **Set up a custom domain**

3. 输入你的域名（如 `nav.example.com`）

4. 如果域名已在 Cloudflare：
   - 自动配置 DNS 记录
   - 自动配置 SSL 证书
   - 几分钟内生效

5. 如果域名不在 Cloudflare：
   - 添加 CNAME 记录指向 `<project-name>.pages.dev`
   - 等待 DNS 生效
   - Cloudflare 会自动配置 SSL

### DNS 配置示例

如果域名不在 Cloudflare，需要在你的 DNS 提供商添加：

```
类型: CNAME
名称: nav（或 @）
目标: weiz-nav.pages.dev
TTL: 自动
```

## 项目配置文件

项目已包含以下配置文件：

### wrangler.toml

```toml
name = "weiz-nav"
compatibility_date = "2025-11-18"
pages_build_output_dir = "out"

[build]
command = "pnpm build"
```

### public/_redirects

用于支持客户端路由：

```
/* /index.html 200
```

### public/_headers

用于优化性能和安全性：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

## 常见问题

### 构建失败

- 确保所有依赖已安装：`pnpm install`
- 检查 TypeScript 错误：`pnpm lint`
- 清除缓存：`rm -rf .next out`
- 在本地测试构建：`pnpm build`

### 图片无法加载

- 确认 `next.config.ts` 中设置了 `images.unoptimized: true`
- 检查图片路径是否相对于 `public` 目录
- 确保图片文件已提交到 Git 仓库

### 刷新页面出现 404

- 确认 `public/_redirects` 文件存在
- 检查 `trailingSlash: true` 是否在 `next.config.ts` 中设置
- Cloudflare Pages 会自动处理 Next.js 的路由

### LocalStorage 不工作

- 确保网站通过 HTTPS 访问（Cloudflare 自动提供）
- 检查浏览器隐私设置
- 确认没有使用无痕模式

### 部署后样式丢失

- 检查 CSS 文件是否正确生成
- 清除浏览器缓存
- 检查 Tailwind CSS 配置
- 查看浏览器控制台是否有 404 错误

### 中国访问速度慢

Cloudflare Pages 在中国的访问速度通常很好，但如果遇到问题：
- 确保使用了自定义域名（而不是 `.pages.dev`）
- 考虑使用 Cloudflare 的中国网络优化服务
- 检查是否有大文件影响加载速度

## 性能优化

部署后验证性能：

1. **使用 Cloudflare Analytics**
   - 在项目设置中启用 Web Analytics
   - 免费监控访问量和性能指标

2. **优化建议**
   - 启用 Cloudflare 的 Auto Minify（自动压缩）
   - 使用 Cloudflare 的 Rocket Loader（延迟加载 JS）
   - 配置缓存规则优化静态资源

3. **性能检测**
   - 使用 Chrome DevTools Lighthouse
   - 检查 Core Web Vitals
   - 使用 [PageSpeed Insights](https://pagespeed.web.dev/)

## Cloudflare Pages 功能

### 预览部署

- 每个 Pull Request 自动创建预览部署
- 独立的预览 URL，方便测试
- 合并后自动部署到生产环境

### 回滚

- 在 Cloudflare Dashboard 中查看部署历史
- 一键回滚到任何历史版本
- 支持快速恢复

### 分析

- 免费的 Web Analytics
- 实时访问统计
- 性能指标监控
- 无需添加额外代码

### 边缘函数（可选）

如果未来需要服务端功能：
- 支持 Cloudflare Workers
- 可以添加 API 端点
- 支持服务端渲染

## 成本对比

| 特性 | Cloudflare Pages（免费） | 说明 |
|------|------------------------|------|
| 请求数 | 无限 | 完全免费 |
| 带宽 | 无限 | 完全免费 |
| 构建次数 | 500 次/月 | 足够使用 |
| 构建时间 | 20,000 分钟/月 | 非常充足 |
| 自定义域名 | 无限 | 完全免费 |
| SSL 证书 | 自动 | 完全免费 |
| 并发构建 | 1 个 | 免费版限制 |

---

# Vercel 部署指南（备选）

如果你更熟悉 Vercel 或需要 Vercel 的特定功能，也可以选择 Vercel。

## 前置要求

- Vercel 账号（免费）

## 部署到 Vercel

### 方式一：通过 Vercel CLI

1. 安装 Vercel CLI：

```bash
npm i -g vercel
```

2. 在项目根目录运行：

```bash
vercel
```

3. 首次部署时，按照提示操作：
   - 登录 Vercel 账号
   - 选择或创建项目
   - 确认项目设置

4. 后续部署只需运行：

```bash
vercel --prod
```

### 方式二：通过 Git 集成（推荐用于持续部署）

1. 将代码推送到 GitHub/GitLab/Bitbucket

2. 访问 [vercel.com](https://vercel.com) 并登录

3. 点击 "Add New Project"

4. 导入你的 Git 仓库

5. Vercel 会自动检测 Next.js 项目并配置构建设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `out`
   - **Install Command**: `pnpm install`

6. 点击 "Deploy"

7. 部署完成后，Vercel 会提供一个预览 URL

### 自动部署

通过 Git 集成部署后，每次推送到主分支都会自动触发新的部署。

## 环境变量配置

如果需要配置环境变量：

1. 在 Vercel 项目设置中，进入 "Settings" → "Environment Variables"

2. 添加环境变量：
   - **Name**: 变量名（如 `NEXT_PUBLIC_API_URL`）
   - **Value**: 变量值
   - **Environment**: 选择应用环境（Production/Preview/Development）

3. 重新部署以应用更改

**注意**：只有以 `NEXT_PUBLIC_` 开头的环境变量才能在浏览器中访问。

## 自定义域名

### 添加自定义域名

1. 在 Vercel 项目设置中，进入 "Settings" → "Domains"

2. 输入你的域名（如 `example.com` 或 `nav.example.com`）

3. 按照 Vercel 的指引配置 DNS 记录：
   - **A 记录**: 指向 Vercel 的 IP 地址
   - **CNAME 记录**: 指向 `cname.vercel-dns.com`

4. DNS 配置生效后，Vercel 会自动配置 SSL 证书

### DNS 配置示例

对于根域名（example.com）：
```
Type: A
Name: @
Value: 76.76.21.21
```

对于子域名（nav.example.com）：
```
Type: CNAME
Name: nav
Value: cname.vercel-dns.com
```

## 项目配置

项目已包含 `vercel.json` 配置文件：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

## 常见问题

### 构建失败

- 确保所有依赖已安装：`pnpm install`
- 检查 TypeScript 错误：`pnpm lint`
- 清除缓存：`rm -rf .next out`
- 在本地测试构建：`pnpm build`

### 图片无法加载

- 确认 `next.config.ts` 中设置了 `images.unoptimized: true`
- 检查图片路径是否相对于 `public` 目录
- 确保图片文件已提交到 Git 仓库

### 刷新页面出现 404

- 确认 `next.config.ts` 中设置了 `trailingSlash: true`
- Vercel 会自动处理 Next.js 的路由

### LocalStorage 不工作

- 确保网站通过 HTTPS 访问（Vercel 自动提供）
- 检查浏览器隐私设置

### 部署后样式丢失

- 检查 CSS 文件是否正确生成
- 清除浏览器缓存
- 检查 Tailwind CSS 配置

## 性能优化

部署后验证性能：

1. 在 Chrome DevTools 中运行 Lighthouse 审计
2. 检查 Core Web Vitals
3. 使用 Vercel Analytics 监控性能指标
4. 启用 Vercel 的边缘缓存功能

## Vercel 功能

### Analytics

在项目设置中启用 Vercel Analytics 以监控：
- 页面访问量
- 性能指标
- 用户体验数据

### 预览部署

每个 Pull Request 都会自动创建预览部署，方便在合并前测试更改。

### 回滚

如果新部署出现问题，可以在 Vercel 控制台中快速回滚到之前的版本。

## 支持

遇到问题时：
- 查看 [Vercel 文档](https://vercel.com/docs)
- 查看 [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- 在 Vercel 控制台查看部署日志
- 联系 Vercel 支持团队

---

## 平台选择建议

### 选择 Cloudflare Pages 如果：
- ✅ 需要更大的免费额度
- ✅ 目标用户在中国或亚太地区
- ✅ 需要更好的全球 CDN 性能
- ✅ 想要免费的 Web Analytics
- ✅ 未来可能需要边缘函数

### 选择 Vercel 如果：
- ✅ 已经熟悉 Vercel 生态
- ✅ 需要 Vercel 的特定功能
- ✅ 团队已在使用 Vercel
- ✅ 需要更快的构建速度

## 快速命令参考

```bash
# 本地开发
pnpm dev

# 构建项目
pnpm build

# 本地预览
pnpm serve:static

# 部署到 Cloudflare Pages
pnpm deploy

# 部署到 Vercel
pnpm deploy:vercel
```

## 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
