# PWA 使用指南

## 什么是 PWA？

PWA (Progressive Web App) 是一种可以像原生应用一样使用的网页应用。唯知导航支持完整的 PWA 功能，让你可以：

- 📱 **安装到桌面/主屏幕** - 像原生应用一样使用
- 🔌 **离线访问** - 没有网络也能查看已保存的导航链接
- ⚡ **快速加载** - Service Worker 缓存，秒开应用
- 🎯 **应用快捷方式** - 快速访问搜索和管理功能

## 如何安装

### 桌面端（Chrome/Edge）

1. 访问 [https://nav.weizwz.com](https://nav.weizwz.com)
2. 点击地址栏右侧的 **安装图标** ⊕
3. 或者点击右上角菜单 → **安装唯知导航**
4. 在弹出的对话框中点击 **安装**

安装后，应用会出现在：
- Windows: 开始菜单和桌面
- macOS: 应用程序文件夹和 Dock
- Linux: 应用程序菜单

### 移动端（iOS Safari）

1. 使用 Safari 浏览器访问 [https://nav.weizwz.com](https://nav.weizwz.com)
2. 点击底部的 **分享按钮** 📤
3. 向下滚动，选择 **添加到主屏幕**
4. 输入名称（默认为"唯知导航"），点击 **添加**

### 移动端（Android Chrome）

1. 使用 Chrome 浏览器访问 [https://nav.weizwz.com](https://nav.weizwz.com)
2. 页面会自动弹出安装提示，点击 **安装**
3. 或者点击右上角菜单 → **安装应用**
4. 在弹出的对话框中点击 **安装**

## PWA 功能特性

### 1. 离线访问

安装后，即使没有网络连接，你也可以：
- 查看已保存的导航链接
- 浏览分类
- 使用站内搜索

**注意**：以下功能需要网络连接：
- 添加新链接时自动获取网站图标
- 访问外部链接
- 使用搜索引擎搜索

### 2. 应用快捷方式

在桌面或主屏幕上长按应用图标，可以看到快捷方式：
- **搜索** - 直接打开搜索功能
- **数据管理** - 快速进入数据管理页面

### 3. 自动更新

当有新版本发布时：
1. 应用会在后台自动下载更新
2. 弹出提示询问是否立即更新
3. 点击"立即更新"后，应用会刷新到最新版本

### 4. 全屏体验

安装后的应用会以全屏模式运行：
- 没有浏览器地址栏
- 没有浏览器工具栏
- 更大的可用空间
- 更接近原生应用的体验

## 技术实现

### Service Worker

应用使用 Service Worker 实现离线功能和缓存：

**缓存策略**：
- **静态资源**：缓存优先（Cache First）
  - HTML、CSS、JavaScript、图片等
  - 优先从缓存读取，提升加载速度
  
- **API 请求**：网络优先（Network First）
  - Favicon API 等动态内容
  - 优先从网络获取，失败时使用缓存

**缓存管理**：
- 自动清理旧版本缓存
- 智能更新缓存内容
- 避免缓存过期问题

### Manifest 配置

应用的 PWA 配置包括：
- 应用名称和图标
- 启动 URL 和作用域
- 显示模式（独立应用）
- 主题颜色
- 应用快捷方式

## 常见问题

### Q: 如何卸载 PWA？

**桌面端**：
- Windows: 设置 → 应用 → 找到"唯知导航" → 卸载
- macOS: 应用程序文件夹 → 拖动到废纸篓
- Chrome: chrome://apps → 右键应用 → 卸载

**移动端**：
- iOS: 长按图标 → 删除应用
- Android: 长按图标 → 卸载

### Q: PWA 会占用多少存储空间？

应用本身很小（约 2-5 MB），主要包括：
- 应用代码和资源
- Service Worker 缓存
- 你保存的导航链接数据

### Q: 如何清除缓存？

**方法一：通过浏览器**
1. 打开浏览器开发者工具（F12）
2. Application → Storage → Clear site data

**方法二：重新安装**
1. 卸载 PWA
2. 清除浏览器缓存
3. 重新访问网站并安装

### Q: 为什么没有看到安装提示？

可能的原因：
1. 浏览器不支持 PWA（需要 Chrome/Edge/Safari 等现代浏览器）
2. 网站必须通过 HTTPS 访问
3. 已经安装过应用
4. 之前关闭过安装提示（3 天后会再次显示）

### Q: 离线时可以添加新链接吗？

可以！所有数据都保存在本地 LocalStorage 中，离线时可以：
- ✅ 添加、编辑、删除链接
- ✅ 搜索已保存的链接
- ✅ 管理分类
- ❌ 自动获取网站图标（需要网络）

## 性能优化

PWA 带来的性能提升：

1. **首次加载**：正常网络速度
2. **再次访问**：从缓存加载，速度提升 **80%+**
3. **离线访问**：完全从缓存加载，**秒开**
4. **更新检查**：后台静默更新，不影响使用

## 浏览器支持

| 浏览器 | 桌面端 | 移动端 | 备注 |
|--------|--------|--------|------|
| Chrome | ✅ | ✅ | 完整支持 |
| Edge | ✅ | ✅ | 完整支持 |
| Safari | ✅ | ✅ | iOS 需要手动添加 |
| Firefox | ✅ | ✅ | 部分功能受限 |
| Opera | ✅ | ✅ | 完整支持 |

## 开发者信息

### 测试 PWA

```bash
# 本地开发需要 HTTPS
pnpm dev:https

# 或者使用生产构建测试
pnpm build
pnpm serve:static
```

### Service Worker 调试

1. 打开 Chrome DevTools
2. Application → Service Workers
3. 查看 Service Worker 状态和缓存

### Lighthouse 审计

```bash
# 运行 Lighthouse 测试
npx lighthouse https://nav.weizwz.com --view
```

检查项目：
- ✅ PWA 优化建议
- ✅ 性能评分
- ✅ 可访问性
- ✅ 最佳实践
- ✅ SEO

## 相关资源

- [PWA 官方文档](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox](https://developers.google.com/web/tools/workbox) - Service Worker 工具库

---

**享受 PWA 带来的原生应用体验！** 🚀
