# Cloudflare Workers GitHub Actions 配置

项目使用 [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) 部署到 Cloudflare Workers。GitHub Actions 会在 PR 中执行构建检查，并在推送到 `main` 分支或手动触发 workflow 时部署 Worker。

## 获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)

2. 进入 **My Profile** → **API Tokens**

3. 点击 **Create Token** → **Create Custom Token**

4. 配置权限：

   - **Token name**: `GitHub Actions - weiz-nav`
   - **Permissions**:
     - Account - Workers Scripts - Edit
     - Account - Workers KV Storage - Edit（如启用 KV）
     - Account - R2 Storage - Edit（如启用 R2）
   - **Account Resources**: Include - Your Account

5. 点击 **Continue to summary** → **Create Token**

6. 复制生成的 Token（只显示一次）

## 获取 Cloudflare Account ID

在 [Cloudflare Dashboard](https://dash.cloudflare.com) 首页右侧可以看到 **Account ID**，复制即可。

## 配置 GitHub Secrets

进入仓库 **Settings → Secrets and variables → Actions**，添加以下两个 Secret：

| Secret                  | 说明                   |
| :---------------------- | :--------------------- |
| `CLOUDFLARE_API_TOKEN`  | 上一步获取的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID  |

## 完成

配置完成后：

1. PR 到 `main` 时运行 `opennextjs-cloudflare build`，验证 Worker 产物可以正常生成
2. 推送到 `main` 或手动触发 workflow 时运行 `opennextjs-cloudflare deploy`，部署到 Cloudflare Workers

## 注意事项

- API Token 请妥善保管，不要泄露或提交到代码库
- Worker 名称由 `wrangler.jsonc` 中的 `name` 字段决定，当前为 `weiz-nav`
- workflow 使用 Node.js 22，与当前 Wrangler 版本要求一致
- Pages 项目已迁移为 Workers 后，不再需要 Cloudflare Pages 的部署 workflow
