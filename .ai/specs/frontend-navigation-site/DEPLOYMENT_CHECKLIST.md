# 部署检查清单

## 🚀 部署步骤

### 1. 提交代码

```bash
# 查看修改
git status

# 添加所有修改
git add .

# 提交
git commit -m "fix: 更新 CSP 配置和 Service Worker v4"

# 推送到远程
git push origin main
```

### 2. Cloudflare Pages 部署

访问 Cloudflare Pages 控制台：
1. 等待自动部署完成（约 2-3 分钟）
2. 查看部署日志确认成功
3. 记录部署 URL

### 3. 清除 Cloudflare 缓存

**重要！** 必须清除缓存才能让新的 `_headers` 生效

**方法 1：通过控制台**
```
1. 登录 Cloudflare Dashboard
2. 选择你的域名
3. Caching → Configuration
4. 点击 "Purge Everything"
5. 确认清除
```

**方法 2：通过 API**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### 4. 验证部署

**检查 CSP 配置**：
```bash
# 检查 HTTP 头
curl -I https://nav.weizwz.com | grep -i content-security-policy

# 应该看到：
# content-security-policy: ... connect-src 'self' https: ...
```

**检查 Service Worker**：
```bash
# 访问网站
open https://nav.weizwz.com

# 打开控制台
# 应该看到：Service Worker 注册成功
# 不应该看到：CSP 错误
```

### 5. 用户端清除缓存

**提供清除工具**：
```
https://nav.weizwz.com/clear-cache.html
```

**通知用户**（可选）：
- 在网站上显示更新提示
- 或发送通知
- 或等待自动更新（可能需要几小时）

## ✅ 验证清单

部署后检查以下项目：

- [ ] Cloudflare Pages 部署成功
- [ ] Cloudflare 缓存已清除
- [ ] CSP 配置正确（`connect-src 'self' https:`）
- [ ] Service Worker 版本正确（v4）
- [ ] 控制台无 CSP 错误
- [ ] 图标正常加载
- [ ] 页面不会频繁刷新
- [ ] 清除缓存工具可访问

## 🔍 故障排查

### 问题 1：仍然有 CSP 错误

**原因**：Cloudflare 缓存未清除

**解决**：
```bash
# 清除 Cloudflare 缓存
# 等待 5-10 分钟
# 硬刷新浏览器（Ctrl+Shift+R）
```

### 问题 2：页面频繁刷新

**原因**：Service Worker 不断检测到更新

**解决**：
```bash
# 检查 Service Worker 版本是否一致
# 确保所有文件都已部署
# 清除浏览器缓存
```

### 问题 3：图标仍然加载失败

**原因**：浏览器缓存了旧的 Service Worker

**解决**：
```
1. 访问 /clear-cache.html
2. 点击"全部清除并刷新"
3. 或手动清除浏览器缓存
```

## 📊 监控

部署后监控以下指标：

### Cloudflare Analytics
```
- 请求数
- 错误率
- 缓存命中率
```

### 浏览器控制台
```
- CSP 错误数量（应该为 0）
- Service Worker 状态
- 网络请求状态
```

### 用户反馈
```
- 图标加载问题
- 页面刷新问题
- 功能异常
```

## 🔄 回滚计划

如果部署出现问题：

### 快速回滚
```bash
# 回滚到上一个版本
git revert HEAD
git push origin main

# 或回滚到特定版本
git reset --hard <commit-hash>
git push origin main --force
```

### Cloudflare Pages 回滚
```
1. 进入 Cloudflare Pages 控制台
2. 选择项目
3. Deployments → 选择之前的部署
4. 点击 "Rollback to this deployment"
```

## 📝 部署记录

记录每次部署的信息：

```
日期：2024-11-18
版本：v1.0.4 (SW v4)
修改：
- 更新 CSP 配置（connect-src 'self' https:）
- 优化 Service Worker 自动刷新逻辑
- 修复图标闪烁问题
- 添加清除缓存工具

部署人：[你的名字]
部署时间：[时间]
验证状态：✅ 通过
```

## 🎯 下次部署优化

- [ ] 自动化部署流程
- [ ] 添加部署前测试
- [ ] 设置 Staging 环境
- [ ] 配置自动回滚
- [ ] 添加部署通知

---

**记住**：
1. 每次修改 `_headers` 必须清除 Cloudflare 缓存
2. 每次更新 Service Worker 必须递增版本号
3. 部署后必须验证 CSP 配置
4. 提供用户清除缓存的工具
