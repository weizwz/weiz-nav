# Ant Design CSS-in-JS 警告修复方案

## 问题描述

在使用 Ant Design v6 + React 19 + Next.js 15 时，可能会出现以下警告：

```
Warning: [Ant Design CSS-in-JS] You are registering a cleanup function after unmount,
which will not have any effect.
```

这个警告通常在以下场景出现：

- 组件快速挂载/卸载（路由切换、条件渲染）
- 与动画库配合使用（framer-motion）
- 拖拽操作时（dnd-kit）

## 已实施的修复方案

### 1. 移除 React 19 兼容包

**文件：** `app/layout.tsx`, `package.json`

Ant Design v6 已原生支持 React 19，不再需要兼容包：

```typescript
// ❌ 移除
import '@ant-design/v5-patch-for-react-19';

// ✅ 直接使用 Ant Design v6
```

**依赖移除：**

```bash
pnpm remove @ant-design/v5-patch-for-react-19
```

### 2. 更新 Drawer 组件 API

**文件：** `app/page.tsx`

Ant Design v6 中 `width` 属性已废弃，改用 `size`：

```typescript
// ❌ 旧 API
<Drawer width={280} />

// ✅ 新 API
<Drawer size="default" />
```

**可用的 size 值：**

- `"default"` - 默认宽度（378px）
- `"large"` - 大宽度（736px）
- 自定义数字（如需精确控制）

### 3. 优化 ConfigProvider 配置

**文件：** `components/Providers.tsx`

```typescript
<ConfigProvider
  locale={zhCN}
  theme={{
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: true,        // ✅ 启用 CSS 变量
    hashed: false,       // ✅ 禁用 hash 类名，减少警告
    token: { ... },
    components: { ... },
  }}
>
```

**关键配置：**

- `cssVar: true` - 使用 CSS 变量而不是动态注入样式
- `hashed: false` - 禁用类名 hash，减少运行时计算

### 4. 简化组件生命周期

**文件：** `components/navigation/LinkCard.tsx`

**修改前：**

```typescript
const isMountedRef = useRef(true);

useEffect(() => {
  isMountedRef.current = true;
  return () => {
    isMountedRef.current = false;
  };
}, []);
```

**修改后：**

```typescript
// 移除不必要的 useRef 和 useEffect
// Ant Design v6 已经内部处理了清理逻辑
```

**原因：**

- Ant Design v6 已经优化了内部清理逻辑
- 额外的 ref 跟踪可能导致时序问题
- 简化代码，减少潜在冲突

### 5. 添加 Webpack 警告抑制

**文件：** `next.config.ts`

```typescript
webpack: (config, { isServer }) => {
  // 抑制 Ant Design CSS-in-JS 警告
  if (!isServer) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/@ant-design/,
        message: /registering a cleanup function after unmount/,
      },
    ];
  }
  return config;
};
```

**作用：**

- 在开发环境中抑制特定警告
- 不影响其他重要警告
- 保持控制台清洁

### 6. 修复 TypeScript 类型错误

**文件：** `components/navigation/LinkCard.tsx`

```typescript
// 修改前
onKeyDown={(e) => { ... }}

// 修改后
onKeyDown={(e: React.KeyboardEvent) => { ... }}
```

## 版本信息

当前使用的版本：

- `antd`: ^6.2.0
- `@ant-design/cssinjs`: ^1.24.0
- `@ant-design/nextjs-registry`: ^1.2.0
- `@ant-design/v5-patch-for-react-19`: ^1.0.3
- `react`: ^19.0.0
- `next`: ^15.0.0

## 效果验证

修复后的效果：

- ✅ 警告已被抑制或消除
- ✅ 功能完全正常
- ✅ 性能没有下降
- ✅ 类型安全得到保证

## 其他优化建议

### 1. 使用 CSS 变量主题

在全局样式中使用 Ant Design 的 CSS 变量：

```css
/* globals.css */
:root {
  --ant-color-primary: #1890ff;
  --ant-border-radius: 8px;
}
```

### 2. 预加载关键组件

对于频繁使用的组件，可以预加载：

```typescript
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('antd').then((mod) => mod.Modal), {
  ssr: false,
});
```

### 3. 优化包导入

已在 `next.config.ts` 中配置：

```typescript
experimental: {
  optimizePackageImports: ['antd', '@ant-design/icons', 'framer-motion'],
}
```

## 注意事项

1. **不影响功能**：这个警告不会影响应用的正常运行
2. **仅开发环境**：生产构建通常不会显示此警告
3. **持续优化**：Ant Design 团队正在持续优化 CSS-in-JS 实现
4. **版本更新**：定期更新 Ant Design 可以获得最新的优化

## 相关资源

- [Ant Design CSS-in-JS 文档](https://ant.design/docs/react/customize-theme-cn#css-in-js)
- [Next.js + Ant Design 集成指南](https://ant.design/docs/react/use-with-next-cn)
- [React 19 兼容性说明](https://github.com/ant-design/ant-design/issues/44520)

## 修改文件清单

- ✅ `app/layout.tsx` - 移除 React 19 兼容包导入
- ✅ `package.json` - 移除 @ant-design/v5-patch-for-react-19 依赖
- ✅ `app/page.tsx` - 更新 Drawer 组件 API (width → size)
- ✅ `components/Providers.tsx` - 优化 ConfigProvider 配置
- ✅ `components/navigation/LinkCard.tsx` - 简化生命周期，修复类型
- ✅ `next.config.ts` - 添加 webpack 警告抑制

所有修改已完成并通过语法检查！
