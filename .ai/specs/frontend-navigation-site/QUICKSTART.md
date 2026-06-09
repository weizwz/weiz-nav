# 快速开始指南

## 5 分钟部署到 Cloudflare Pages

### 方式一：Git 集成（推荐，零配置）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **访问 Cloudflare Pages**
   - 打开 https://dash.cloudflare.com
   - 进入 **Workers & Pages** → **Create application** → **Pages**
   - 点击 **Connect to Git**

3. **选择仓库并配置**
   - 选择你的 GitHub 仓库
   - 构建命令：`pnpm build`
   - 输出目录：`out`
   - 点击 **Save and Deploy**

4. **完成！**
   - 等待 2-3 分钟构建完成
   - 获得 `https://weiz-nav.pages.dev` 域名
   - 每次推送自动部署

### 方式二：命令行部署（快速测试）

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建并部署**
   ```bash
   pnpm build
   pnpm deploy
   ```

4. **完成！**
   - 立即获得部署链接
   - 后续只需运行 `pnpm deploy`

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

## 添加自定义域名

1. 在 Cloudflare Pages 项目中进入 **Custom domains**
2. 输入你的域名（如 `nav.example.com`）
3. 如果域名在 Cloudflare，自动配置完成
4. 如果不在，添加 CNAME 记录指向 `weiz-nav.pages.dev`

## 常用命令

```bash
pnpm dev              # 开发模式
pnpm build            # 构建项目
pnpm serve:static     # 本地预览构建结果
pnpm deploy           # 部署到 Cloudflare Pages
pnpm lint             # 代码检查
```

## 需要帮助？

查看完整文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
