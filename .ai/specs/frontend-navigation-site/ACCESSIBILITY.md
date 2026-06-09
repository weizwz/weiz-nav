# 可访问性实现文档

本文档描述了前端导航网站的可访问性优化实现，确保符合 WCAG 2.1 AA 标准。

## 实现的可访问性功能

### 1. ARIA 标签和语义化 HTML

#### 页面结构
- **跳转链接**: 添加了"跳转到主内容"链接，方便键盘和屏幕阅读器用户快速导航
- **语义化标签**: 使用 `<header>`, `<nav>`, `<main>`, `<aside>` 等语义化 HTML5 标签
- **地标角色**: 为主要区域添加了 `role` 属性（banner, navigation, main, search 等）

#### 组件级别的 ARIA 标签

**SearchBar 组件**
- `role="search"` 和 `aria-label="搜索导航"`
- 搜索输入框添加 `role="searchbox"` 和 `aria-describedby`
- 搜索引擎切换按钮添加 `aria-haspopup="menu"` 和详细的 `aria-label`
- 图标添加 `aria-hidden="true"` 避免屏幕阅读器重复读取

**ThemeToggle 组件**
- `role="switch"` 和 `aria-checked` 表示开关状态
- `aria-pressed` 表示按钮按下状态
- 动态的 `aria-label` 描述当前主题和切换操作

**LinkCard 组件**
- `role="article"` 标识卡片为独立内容单元
- `role="button"` 和 `tabIndex={0}` 使卡片可键盘访问
- 详细的 `aria-label` 包含链接名称和描述
- 图标添加 `aria-hidden="true"` 或适当的 `alt` 文本
- 描述文本使用 `aria-describedby` 关联

**LinkGrid 组件**
- `role="region"` 标识内容区域
- 动态的 `aria-label` 显示当前分类和链接数量

**CategorySidebar 组件**
- `<nav>` 标签和 `role="navigation"`
- `aria-label="分类导航"` 描述导航用途
- 菜单添加 `aria-labelledby` 关联标题

**Header 组件**
- `role="banner"` 标识页头
- `role="toolbar"` 标识工具栏区域
- 表情符号添加 `role="img"` 和 `aria-label`

**Modal 组件**
- `aria-labelledby` 和 `aria-describedby` 关联标题和内容
- 按钮添加详细的 `aria-label`
- 警告信息添加 `role="alert"` 和 `aria-live="polite"`
- 表单输入添加 `aria-required`, `aria-invalid`, `aria-describedby`

**FloatButton 组件**
- 浮动按钮组添加 `aria-label="快捷操作"`
- 每个按钮添加描述性的 `aria-label`

**DataTable 组件**
- 工具栏添加 `role="toolbar"`
- 选择状态添加 `role="status"` 和 `aria-live="polite"`

### 2. 键盘导航支持

#### Tab 顺序
- 所有交互元素按逻辑顺序可通过 Tab 键访问
- 使用 `tabIndex={0}` 使自定义组件可聚焦
- 跳转链接在页面顶部，Tab 键首先访问

#### 键盘快捷键
- **Enter 键**: 激活链接卡片、按钮、搜索
- **Space 键**: 激活链接卡片和按钮
- **Escape 键**: 关闭模态框和下拉菜单（Ant Design 默认支持）
- **方向键**: 在菜单和列表中导航（Ant Design 默认支持）

#### 实现细节
```typescript
// LinkCard 组件中的键盘事件处理
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleCardClick();
  }
}}
```

### 3. 焦点指示样式

#### 全局焦点样式
- 3px 蓝色轮廓线（`outline: 3px solid var(--primary)`）
- 2px 偏移量（`outline-offset: 2px`）
- 4px 蓝色阴影（`box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2)`）
- 圆角边框（`border-radius: 4px`）

#### 特定元素焦点样式
- 按钮、链接、输入框、文本域、选择框
- 卡片组件（`:focus-within` 和 `:focus-visible`）
- 使用 `:focus-visible` 避免鼠标点击时显示焦点样式

#### CSS 实现
```css
:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible,
input:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
}
```

### 4. 颜色对比度（WCAG 2.1 AA）

#### 对比度标准
- 普通文本: ≥ 4.5:1
- 大文本 (18pt+): ≥ 3:1
- UI 组件和图形: ≥ 3:1

#### 浅色主题
```css
--foreground: #1a1a1a;          /* 对比度 15.8:1 */
--foreground-secondary: #4a4a4a; /* 对比度 8.6:1 */
--foreground-tertiary: #6b6b6b;  /* 对比度 5.7:1 */
```

#### 深色主题
```css
--foreground: #f5f5f5;          /* 对比度 15.5:1 */
--foreground-secondary: #b8b8b8; /* 对比度 8.3:1 */
--foreground-tertiary: #8a8a8a;  /* 对比度 5.4:1 */
```

#### 主题色
- 主色调 `#1890ff` 在白色背景上对比度为 3.4:1（适用于大文本和 UI 组件）
- 按钮和链接使用足够的对比度

### 5. 屏幕阅读器支持

#### 隐藏装饰性内容
- 图标添加 `aria-hidden="true"` 避免重复读取
- 使用 `.sr-only` 类添加仅供屏幕阅读器的文本

#### 屏幕阅读器专用文本
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### 动态内容通知
- 使用 `aria-live="polite"` 通知非紧急更新
- 使用 `aria-live="assertive"` 通知紧急错误
- 使用 `role="status"` 标识状态信息
- 使用 `role="alert"` 标识警告信息

#### 表单可访问性
- 所有表单字段有关联的标签
- 使用 `aria-required` 标识必填字段
- 使用 `aria-invalid` 标识验证错误
- 使用 `aria-describedby` 关联错误消息

### 6. 其他可访问性功能

#### 跳转链接
```html
<a href="#main-content" className="skip-to-content">
  跳转到主内容
</a>
```
- 默认隐藏在屏幕外
- 获得焦点时显示在页面顶部
- 允许键盘用户快速跳过导航

#### 语言声明
```html
<html lang="zh-CN">
```
- 帮助屏幕阅读器选择正确的语音

#### 响应式设计
- 支持文本缩放至 200% 而不丢失功能
- 移动端友好的触摸目标（≥ 44x44px）
- 响应式布局适配不同屏幕尺寸

#### 动画和过渡
- 使用 `prefers-reduced-motion` 媒体查询（可选实现）
- 过渡时间适中（300ms）不会引起不适

## 测试建议

### 键盘导航测试
1. 使用 Tab 键遍历所有交互元素
2. 使用 Enter/Space 键激活按钮和链接
3. 使用 Escape 键关闭模态框
4. 确保焦点指示清晰可见

### 屏幕阅读器测试
推荐工具：
- **NVDA** (Windows, 免费)
- **JAWS** (Windows, 商业)
- **VoiceOver** (macOS/iOS, 内置)
- **TalkBack** (Android, 内置)

测试要点：
1. 页面结构是否清晰
2. 所有交互元素是否可访问
3. 图片和图标是否有适当的替代文本
4. 表单字段是否有标签和错误提示
5. 动态内容更新是否被通知

### 颜色对比度测试
推荐工具：
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Chrome DevTools**: Lighthouse 审计
- **axe DevTools**: 浏览器扩展

### 自动化测试
推荐工具：
- **Lighthouse**: Chrome DevTools 内置
- **axe-core**: 自动化可访问性测试库
- **Pa11y**: 命令行可访问性测试工具

运行 Lighthouse 审计：
```bash
# 在 Chrome DevTools 中
1. 打开开发者工具 (F12)
2. 切换到 Lighthouse 标签
3. 选择 "Accessibility" 类别
4. 点击 "Generate report"
```

## 已知限制

1. **第三方组件**: Ant Design 组件的可访问性依赖于库本身的实现
2. **动画**: 未实现 `prefers-reduced-motion` 支持（可作为未来改进）
3. **自定义颜色**: 用户自定义的卡片背景色可能不符合对比度标准（需要用户注意）

## 未来改进

1. 添加 `prefers-reduced-motion` 支持
2. 实现更多键盘快捷键（如 Cmd/Ctrl+K 快速搜索）
3. 添加高对比度模式
4. 实现自定义焦点指示颜色
5. 添加可访问性设置面板
6. 实现语音控制支持（Web Speech API）

## 参考资源

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Ant Design Accessibility](https://ant.design/docs/spec/accessibility)
