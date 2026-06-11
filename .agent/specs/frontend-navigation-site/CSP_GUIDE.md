# Content Security Policy (CSP) 配置指南

## 当前 CSP 配置

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:; 
  connect-src 'self' https://cloudflareinsights.com https://favicon.im; 
  frame-ancestors 'none';
```

## 配置说明

### 1. `default-src 'self'`
**默认策略**：只允许同源资源

### 2. `script-src`
**允许的脚本来源**：
- ✅ `'self'` - 本站脚本
- ✅ `'unsafe-inline'` - 内联脚本（Next.js 需要）
- ✅ `'unsafe-eval'` - eval() 函数（某些库需要）
- ✅ `https://static.cloudflareinsights.com` - Cloudflare 分析

**可能被阻止的**：
- ❌ 其他第三方脚本（如 Google Analytics、百度统计等）

### 3. `style-src`
**允许的样式来源**：
- ✅ `'self'` - 本站样式
- ✅ `'unsafe-inline'` - 内联样式（Ant Design、Tailwind 需要）

**可能被阻止的**：
- ❌ 外部 CDN 样式表（如 Google Fonts）

### 4. `img-src`
**允许的图片来源**：
- ✅ `'self'` - 本站图片
- ✅ `data:` - Base64 图片
- ✅ `https:` - **所有 HTTPS 协议的图片（不限域名）**

**这意味着**：
- ✅ favicon.im 的图标
- ✅ 用户自定义的任意 HTTPS 图标 URL
- ✅ `https://example.com/icon.png`
- ✅ `https://cdn.example.com/logo.svg`
- ✅ `https://any-domain.com/image.jpg`
- ❌ `http://insecure.com/icon.png`（不安全的 HTTP 会被阻止）

**重要**：`https:` 是协议通配符，允许所有 HTTPS 来源，非常适合用户自定义图标的场景

### 5. `font-src`
**允许的字体来源**：
- ✅ `'self'` - 本站字体
- ✅ `data:` - Base64 字体

**可能被阻止的**：
- ❌ 外部字体 CDN（如 Google Fonts）

### 6. `connect-src`
**允许的网络连接**：
- ✅ `'self'` - 本站 API
- ✅ `https://cloudflareinsights.com` - Cloudflare 分析
- ✅ `https://favicon.im` - Favicon API

**可能被阻止的**：
- ❌ 其他第三方 API
- ❌ WebSocket 连接（如果需要）

### 7. `frame-ancestors`
**iframe 嵌入限制**：
- ✅ `'none'` - 禁止被任何网站嵌入

## 潜在问题和解决方案

### 问题 1：添加第三方分析工具

**场景**：想添加 Google Analytics、百度统计等

**解决方案**：
```diff
script-src 'self' 'unsafe-inline' 'unsafe-eval' 
  https://static.cloudflareinsights.com
+ https://www.googletagmanager.com
+ https://www.google-analytics.com
+ https://hm.baidu.com;

connect-src 'self' 
  https://cloudflareinsights.com 
  https://favicon.im
+ https://www.google-analytics.com
+ https://hm.baidu.com;
```

### 问题 2：使用 Google Fonts

**场景**：想使用 Google Fonts 字体

**解决方案**：
```diff
style-src 'self' 'unsafe-inline'
+ https://fonts.googleapis.com;

font-src 'self' data:
+ https://fonts.gstatic.com;
```

### 问题 3：嵌入外部视频

**场景**：想嵌入 YouTube、Bilibili 视频

**解决方案**：
```diff
Content-Security-Policy: 
  default-src 'self'; 
  ...
+ frame-src https://www.youtube.com https://player.bilibili.com;
```

### 问题 4：使用 CDN 加速

**场景**：使用 CDN 托管静态资源

**解决方案**：
```diff
script-src 'self' 'unsafe-inline' 'unsafe-eval'
+ https://cdn.jsdelivr.net
+ https://unpkg.com;

style-src 'self' 'unsafe-inline'
+ https://cdn.jsdelivr.net
+ https://unpkg.com;
```

### 问题 5：WebSocket 连接

**场景**：需要 WebSocket 实时通信

**解决方案**：
```diff
connect-src 'self' 
  https://cloudflareinsights.com 
  https://favicon.im
+ wss://your-websocket-server.com;
```

## 当前配置的安全性

### ✅ 已保护的攻击

1. **XSS 攻击**：限制脚本来源
2. **点击劫持**：`frame-ancestors 'none'`
3. **数据泄露**：限制连接目标
4. **内容注入**：限制资源来源

### ⚠️ 潜在风险

1. **`'unsafe-inline'`**：
   - 允许内联脚本和样式
   - Next.js 和 Ant Design 需要
   - 风险：可能被 XSS 利用

2. **`'unsafe-eval'`**：
   - 允许 eval() 函数
   - 某些库需要
   - 风险：可能执行恶意代码

3. **`img-src https:`**：
   - 允许所有 HTTPS 图片
   - **必需**：用户可以自定义任意图标 URL
   - 权衡：功能性 > 严格性
   - 风险：可能加载恶意图片（但只是图片，不会执行代码）

### 🔒 如何提高安全性

**方法 1：使用 Nonce**
```html
<!-- 为每个内联脚本生成唯一的 nonce -->
<script nonce="random-value">...</script>
```

**方法 2：使用 Hash**
```
script-src 'self' 'sha256-hash-of-script';
```

**方法 3：严格限制图片来源**
```diff
- img-src 'self' data: https:;
+ img-src 'self' data: https://favicon.im https://your-cdn.com;
```

**注意**：对于导航网站，**不推荐**严格限制图片来源，因为：
- 用户需要自定义任意网站的图标
- 无法预知所有可能的图标域名
- `https:` 通配符是最佳选择

## 测试 CSP 配置

### 1. 浏览器开发者工具

```
F12 → Console
查看 CSP 违规报告
```

### 2. CSP 报告模式

```
Content-Security-Policy-Report-Only: ...
```
- 不阻止资源，只报告违规
- 用于测试新配置

### 3. 在线工具

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Validator](https://cspvalidator.org/)

## 监控 CSP 违规

### 添加报告端点

```diff
Content-Security-Policy: 
  default-src 'self'; 
  ...
+ report-uri https://your-domain.com/csp-report;
+ report-to csp-endpoint;
```

### 处理报告

```javascript
// 服务器端接收 CSP 报告
app.post('/csp-report', (req, res) => {
  console.log('CSP Violation:', req.body);
  // 记录到日志系统
  res.status(204).end();
});
```

## 常见问题

### Q: 为什么需要 `'unsafe-inline'`？

**A**: Next.js 和 Ant Design 使用内联样式和脚本。移除会导致样式失效。

**更好的方案**：
- 使用 Nonce 或 Hash
- 配置 Next.js 使用外部样式

### Q: `img-src https:` 是否太宽松？

**A**: 是的，但有原因：
- 用户可以添加任意网站的链接
- 这些网站的图标来自不同域名
- 无法预知所有可能的域名

**权衡**：
- 安全性 vs 功能性
- 当前配置优先功能性

### Q: 如何知道哪些资源被阻止？

**A**: 查看浏览器控制台：
```
Refused to load ... because it violates the following 
Content Security Policy directive: ...
```

### Q: 可以完全禁用 CSP 吗？

**A**: 可以，但不推荐：
```diff
- Content-Security-Policy: ...
```

**风险**：
- 失去 XSS 保护
- 失去点击劫持保护
- 降低整体安全性

## 推荐配置

### 开发环境（宽松）

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:; 
  connect-src 'self' https:;
```

### 生产环境（当前配置）

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:; 
  connect-src 'self' https://cloudflareinsights.com https://favicon.im; 
  frame-ancestors 'none';
```

### 高安全环境（严格）

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'nonce-{random}'; 
  style-src 'self' 'nonce-{random}'; 
  img-src 'self' data: https://favicon.im; 
  font-src 'self'; 
  connect-src 'self' https://favicon.im; 
  frame-ancestors 'none';
  report-uri /csp-report;
```

## 总结

### 当前配置的优点

✅ 保护基本的 XSS 攻击
✅ 防止点击劫持
✅ 允许必要的第三方服务
✅ 支持用户自定义图标
✅ 平衡安全性和功能性

### 当前配置的缺点

⚠️ `'unsafe-inline'` 和 `'unsafe-eval'` 降低安全性
⚠️ `img-src https:` 过于宽松
⚠️ 没有 CSP 报告机制

### 建议

1. **短期**：保持当前配置，监控控制台错误
2. **中期**：添加 CSP 报告端点，收集违规数据
3. **长期**：迁移到 Nonce/Hash，移除 `'unsafe-*'`

---

**记住**：CSP 是安全的一层防护，不是唯一防护。还需要：
- 输入验证
- 输出转义
- HTTPS
- 安全的依赖管理
- 定期安全审计
