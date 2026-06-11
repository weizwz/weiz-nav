# 缓存清除指南

## 问题现象

更新网站后，可能出现以下问题：
- ❌ CSP 错误：`connect-src 'self'` 阻止请求
- ❌ 图标加载失败
- ❌ 功能异常
- ❌ 样式不更新

## 原因分析

浏览器缓存了旧版本的文件：
1. **Service Worker 缓存**：缓存了旧的 `_headers` 文件
2. **浏览器缓存**：缓存了旧的静态资源
3. **HTTP 缓存**：CDN 或浏览器的 HTTP 缓存

## 解决方案

### 方法 1：使用清除缓存工具（推荐）

访问：`https://nav.weizwz.com/clear-cache.html`

点击"全部清除并刷新"按钮，自动完成所有清理工作。

### 方法 2：手动清除（开发者）

**Chrome/Edge**：
```
1. F12 打开开发者工具
2. Application → Storage → Clear site data
3. 勾选所有选项
4. 点击 "Clear site data"
5. 刷新页面（Ctrl+Shift+R）
```

**Firefox**：
```
1. F12 打开开发者工具
2. Storage → 右键 → Delete All
3. 刷新页面（Ctrl+Shift+R）
```

### 方法 3：浏览器设置清除

**所有浏览器**：
```
1. Ctrl+Shift+Delete（Mac: Cmd+Shift+Delete）
2. 选择"缓存的图片和文件"
3. 时间范围选择"全部"
4. 点击"清除数据"
5. 刷新页面
```

### 方法 4：隐身模式测试

```
1. Ctrl+Shift+N（Chrome）或 Ctrl+Shift+P（Firefox）
2. 访问网站
3. 验证问题是否解决
```

## 开发者：强制更新

### 1. 更新 Service Worker 版本

```javascript
// public/sw.js
const CACHE_NAME = 'weiz-nav-v5';  // v4 → v5
const RUNTIME_CACHE = 'weiz-nav-runtime-v5';
const IMAGE_CACHE = 'weiz-nav-images-v5';
```

### 2. 更新 version.json

```json
{
  "version": "1.0.5",
  "cacheVersion": "v5"
}
```

### 3. 部署

```bash
git add public/sw.js public/version.json
git commit -m "chore: 强制清除缓存 v5"
git push
```

### 4. 用户端自动更新

用户访问网站时：
1. 检测到新版本 Service Worker
2. 自动下载并安装
3. 删除旧缓存（v1, v2, v3, v4）
4. 激活新版本（v5）
5. 自动刷新页面

## 验证缓存已清除

### 浏览器控制台

```javascript
// 查看 Service Worker 版本
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW:', reg?.active?.scriptURL);
});

// 查看缓存列表
caches.keys().then(keys => {
  console.log('Caches:', keys);
  // 应该只看到 v4 的缓存
});

// 查看 CSP 策略
fetch('/').then(r => {
  console.log('CSP:', r.headers.get('content-security-policy'));
});
```

### DevTools 检查

```
F12 → Application → Service Workers
- 状态应该是 "activated and is running"
- 版本应该是最新的

F12 → Application → Cache Storage
- 应该只有 v4 的缓存
- 旧版本（v1, v2, v3）应该被删除
```

## 常见问题

### Q: 为什么清除后还是有问题？

**A**: 可能的原因：
1. **CDN 缓存**：Cloudflare 边缘节点缓存了旧文件
   - 解决：在 Cloudflare 控制台清除缓存
   
2. **浏览器扩展**：某些扩展会缓存资源
   - 解决：禁用扩展或使用隐身模式

3. **DNS 缓存**：DNS 解析到旧的 IP
   - 解决：`ipconfig /flushdns`（Windows）或 `sudo dscacheutil -flushcache`（Mac）

### Q: 如何防止缓存问题？

**A**: 最佳实践：
1. **版本化资源**：使用哈希文件名
2. **合理的缓存策略**：
   - HTML: `max-age=0`
   - JS/CSS: `max-age=31536000` + 哈希
   - 图片: `max-age=2592000`
3. **Service Worker 版本管理**：每次更新递增版本号

### Q: 用户需要手动清除吗？

**A**: 不需要！
- Service Worker 会自动更新
- 旧缓存会自动清除
- 用户只需刷新页面

但如果遇到问题，可以：
1. 访问 `/clear-cache.html`
2. 点击"全部清除并刷新"

### Q: 清除缓存会丢失数据吗？

**A**: 不会！
- ✅ LocalStorage 数据保留（用户的导航链接）
- ✅ 用户设置保留
- ❌ 只清除缓存的静态资源

## 预防措施

### 1. 开发时禁用缓存

```
DevTools → Network → Disable cache（勾选）
```

### 2. 使用版本号

```javascript
// 在 URL 中添加版本号
<script src="/app.js?v=1.0.4"></script>
```

### 3. 设置正确的缓存头

```
# public/_headers
/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*.js
  Cache-Control: public, max-age=31536000, immutable
```

### 4. 监控缓存状态

```javascript
// 定期检查缓存大小
navigator.storage.estimate().then(estimate => {
  const used = (estimate.usage / 1024 / 1024).toFixed(2);
  const quota = (estimate.quota / 1024 / 1024).toFixed(2);
  console.log(`缓存: ${used}MB / ${quota}MB`);
});
```

## 清除缓存检查清单

部署新版本后：

- [ ] 更新 Service Worker 版本号
- [ ] 更新 version.json
- [ ] 提交并部署
- [ ] 清除 Cloudflare 缓存（如果使用）
- [ ] 测试环境验证
- [ ] 生产环境验证
- [ ] 监控用户反馈

## 紧急清除脚本

如果需要强制所有用户清除缓存：

```javascript
// 在 Service Worker 中添加
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // 删除所有缓存
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
```

## 总结

**用户端**：
- 访问 `/clear-cache.html` 清除缓存
- 或等待 Service Worker 自动更新

**开发者端**：
- 每次更新递增 Service Worker 版本
- 设置合理的缓存策略
- 监控缓存状态

**预防**：
- 使用版本化资源
- 正确的 HTTP 缓存头
- Service Worker 自动更新机制

---

**记住**：缓存是为了性能，但也要确保用户能及时获取更新！
