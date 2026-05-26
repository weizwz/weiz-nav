# Cloudflare Workers GitHub Actions 配置指南

项目使用 [OpenNext](https://opennext.js.org/cloudflare) 部署到 Cloudflare Workers，GitHub Actions 在推送到 `master` 分支时自动触发构建和部署。

## 获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)

2. 进入 **My Profile** → **API Tokens**

3. 点击 **Create Token** → **Create Custom Token**

4. 配置权限：
   - **Token name**: `GitHub Actions - weiz-nav`
   - **Permissions**:
     - Account - Workers Scripts - Edit
     - Account - Workers KV Storage - Edit（如启用 KV 缓存）
     - Account - R2 Storage - Edit（如启用 R2 缓存）
   - **Account Resources**: Include - Your Account

5. 点击 **Continue to summary** → **Create Token**

6. 复制生成的 Token（只显示一次）

## 获取 Cloudflare Account ID

在 [Cloudflare Dashboard](https://dash.cloudflare.com) 首页右侧可以看到 **Account ID**，复制即可。

## 配置 GitHub Secrets

进入仓库 **Settings → Secrets and variables → Actions**，添加以下两个 Secret：

| Secret | 说明 |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | 上一步获取的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

## 完成

配置完成后，每次推送到 `master` 分支时，GitHub Actions 会自动执行 `pnpm deploy:cloudflare`，即：

1. 运行 `opennextjs-cloudflare build`（内部调用 `next build`）
2. 运行 `opennextjs-cloudflare deploy`，将产物部署到 Cloudflare Workers

## 注意事项

- API Token 请妥善保管，不要泄露或提交到代码库
- Worker 名称由 `wrangler.jsonc` 中的 `name` 字段决定，当前为 `weiz-nav`
- 首次部署前需确保 Cloudflare 账号下已创建对应的 Worker 项目，或由 Wrangler 自动创建
