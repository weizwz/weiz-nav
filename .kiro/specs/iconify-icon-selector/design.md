# Design Document

## Overview

本设计文档描述了在 EditLinkModal 组件中集成 Iconify API 图标选择功能的技术实现方案。该功能将为用户提供第三种图标选择方式（除了 Favicon 和自定义 URL），允许用户从 Iconify 的海量图标库中搜索和选择图标。

核心设计理念：
- **渐进增强**：在现有的图标选择机制基础上添加新选项，不破坏现有功能
- **用户体验优先**：提供流畅的搜索和选择体验，包括实时预览和智能节流
- **可维护性**：使用清晰的组件结构和配置管理，便于后续维护和扩展

## Architecture

### 组件层次结构

```
EditLinkModal (现有组件)
├── Form (Ant Design)
│   ├── URL Input
│   ├── Name Input
│   ├── Description TextArea
│   ├── Category Select
│   ├── Icon Section (修改)
│   │   ├── Icon Type Select (扩展: 添加 Iconify 选项)
│   │   └── IconifySelector (新组件) - 条件渲染
│   │       ├── Popover (Ant Design)
│   │       │   ├── Trigger Button (显示当前选择)
│   │       │   └── Content
│   │       │       ├── Search Input
│   │       │       └── Icon List
│   │       │           └── Icon Option Items
│   │       └── Hidden Input (存储 URL)
│   ├── Background Color Picker
│   └── Preview Section
└── Action Buttons
```

### 数据流

```
用户输入搜索关键词
    ↓
节流处理 (300ms)
    ↓
调用 Iconify API
    ↓
解析响应数据
    ↓
更新图标选项列表
    ↓
用户选择图标
    ↓
更新表单字段 (icon URL)
    ↓
触发预览更新
```

## Components and Interfaces

### 1. IconifySelector 组件

新建的独立组件，负责 Iconify 图标的搜索和选择。

**Props 接口：**

```typescript
interface IconifySelectorProps {
  /** 当前选中的图标 URL */
  value?: string;
  /** 图标变化回调 */
  onChange?: (iconUrl: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}
```

**内部状态：**

```typescript
interface IconifySelectorState {
  /** 下拉框打开状态 */
  open: boolean;
  /** 加载状态 */
  loading: boolean;
  /** 搜索关键词 */
  query: string;
  /** 图标选项列表 */
  options: IconOption[];
  /** 当前选中的图标 */
  selectedIcon: IconOption | null;
}
```

### 2. IconOption 数据结构

```typescript
interface IconOption {
  /** 图标的完整标识符，格式: "prefix:name" (如 "mdi:home") */
  value: string;
  /** 图标显示名称 (如 "home") */
  label: string;
  /** 图标的完整 URL */
  url: string;
}
```

### 3. Iconify API 服务

创建新的 API 服务模块 `api/iconify.ts`：

```typescript
interface IconifySearchResponse {
  icons: string[];
  total: number;
}

interface IconifyApiOptions {
  /** 搜索关键词 */
  query: string;
  /** 返回结果数量限制 */
  limit?: number;
  /** 指定图标集前缀 */
  prefix?: string;
}

class IconifyApi {
  private baseUrl: string;
  
  constructor(baseUrl?: string);
  
  /** 搜索图标 */
  async searchIcons(options: IconifyApiOptions): Promise<IconOption[]>;
  
  /** 获取图标 URL */
  getIconUrl(iconIdentifier: string): string;
  
  /** 验证图标标识符格式 */
  isValidIconIdentifier(identifier: string): boolean;
}
```

### 4. EditLinkModal 组件修改

**扩展图标类型：**

```typescript
// 原有: '1' | '2'
// 新增: '1' | '2' | '3'
type IconType = '1' | '2' | '3';

const iconOptions = [
  { value: '1', label: 'Favicon图标' },
  { value: '2', label: '自定义图标' },
  { value: '3', label: 'Iconify图标' }, // 新增
];
```

**新增状态管理：**

```typescript
const [savedIconifyIcon, setSavedIconifyIcon] = useState<string>('');
```

## Data Models

### 图标类型枚举

```typescript
enum IconSourceType {
  FAVICON = '1',
  CUSTOM = '2',
  ICONIFY = '3',
}
```

### 图标数据模型

现有的 `Link` 接口已经包含 `icon?: string` 字段，无需修改。Iconify 图标的 URL 将直接存储在此字段中。

**图标 URL 格式：**
- Favicon: `https://favicon.im/{domain}?larger=true`
- 自定义: 任意有效的图片 URL
- Iconify: `https://api.iconify.design/{prefix}:{name}.svg` (如 `https://api.iconify.design/mdi:home.svg`)

### 配置模型

```typescript
interface IconifyConfig {
  /** API 基础 URL */
  apiBaseUrl: string;
  /** 默认搜索限制 */
  defaultLimit: number;
  /** 节流延迟 (ms) */
  throttleDelay: number;
}

const DEFAULT_ICONIFY_CONFIG: IconifyConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_ICONIFY_URL || 'https://api.iconify.design',
  defaultLimit: 100,
  throttleDelay: 300,
};
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

基于需求分析，以下是可测试的正确性属性：

### Property 1: API 搜索调用正确性
*For any* 有效的搜索关键词，当用户输入并触发搜索时，系统应该调用 Iconify API 搜索接口，并返回包含该关键词的图标列表。
**Validates: Requirements 1.3**

### Property 2: 图标选项完整显示
*For any* API 返回的图标列表，每个图标选项都应该同时显示图标的预览图和名称。
**Validates: Requirements 1.4, 7.1**

### Property 3: 图标选择后 URL 填充
*For any* 用户选择的图标，系统应该将该图标的完整 URL 正确填充到输入框中，并在预览区域显示该图标。
**Validates: Requirements 1.5, 2.1, 2.2, 7.3**

### Property 4: 缩放和颜色同步更新
*For any* 图标缩放比例或背景颜色的更改，预览区域应该实时同步更新显示效果。
**Validates: Requirements 2.4, 2.5**

### Property 5: 搜索节流机制
*For any* 连续的搜索输入，系统应该使用节流机制限制 API 请求频率，在指定时间窗口内（300ms）最多发起一次请求。
**Validates: Requirements 3.1**

### Property 6: 加载状态显示
*For any* 正在进行的搜索请求，系统应该显示加载状态指示器，直到请求完成或失败。
**Validates: Requirements 3.2**

### Property 7: 图标类型切换状态保持
*For any* Iconify 图标 URL，当用户从 Iconify 类型切换到其他类型再切换回来时，系统应该恢复之前保存的 Iconify 图标。
**Validates: Requirements 4.1, 4.2**

### Property 8: Favicon 自动获取
*For any* 有效的链接 URL，当用户从 Iconify 模式切换到 Favicon 模式时，系统应该自动获取该 URL 对应的 Favicon。
**Validates: Requirements 4.4**

### Property 9: 表单提交数据完整性
*For any* 表单提交操作，系统应该保存当前选择的图标类型和完整的图标 URL。
**Validates: Requirements 4.5**

### Property 10: API URL 配置正确性
*For any* 配置的 Iconify API 基础 URL，系统在调用 API 时应该使用该 URL 构建完整的请求地址。
**Validates: Requirements 6.3**

### Property 11: Iconify URL 解析正确性
*For any* 符合 Iconify 格式的图标 URL（格式：`{prefix}:{name}`），系统应该正确解析并生成可访问的图标 SVG URL。
**Validates: Requirements 7.4**

## Error Handling

### API 错误处理

1. **网络错误**
   - 场景：API 请求失败（网络断开、超时等）
   - 处理：显示友好的错误提示，保留用户已输入的搜索关键词
   - 用户操作：允许用户重试搜索

2. **API 响应错误**
   - 场景：API 返回非 200 状态码或无效数据
   - 处理：记录错误日志，显示通用错误提示
   - 降级方案：允许用户切换到其他图标类型

3. **搜索结果为空**
   - 场景：API 返回空数组
   - 处理：显示"未找到相关图标"提示
   - 用户操作：建议用户尝试其他关键词

### 图标加载错误

1. **图标预览加载失败**
   - 场景：选中的图标 URL 无法加载
   - 处理：在预览区域显示占位符或错误图标
   - 用户操作：允许用户重新选择图标

2. **图标列表项加载失败**
   - 场景：下拉列表中的图标预览无法加载
   - 处理：显示默认图标占位符，保留图标名称
   - 用户操作：不影响用户选择该图标

### 配置错误

1. **API URL 未配置**
   - 场景：环境变量未设置
   - 处理：使用默认值 `https://api.iconify.design`
   - 日志：记录使用默认配置的信息

2. **API URL 格式无效**
   - 场景：配置的 URL 格式不正确
   - 处理：回退到默认 URL，记录警告日志
   - 用户影响：功能正常使用

### 用户输入错误

1. **搜索关键词为空**
   - 场景：用户清空搜索框
   - 处理：清空搜索结果列表，不发起 API 请求
   - 用户操作：等待用户输入新关键词

2. **搜索关键词过长**
   - 场景：用户输入超长关键词
   - 处理：截断到合理长度（如 100 字符）
   - 用户提示：可选的长度限制提示

## Testing Strategy

### 单元测试

使用 Jest 和 React Testing Library 进行组件单元测试。

**测试范围：**

1. **IconifySelector 组件测试**
   - 组件渲染测试
   - 用户交互测试（打开/关闭下拉框、选择图标）
   - Props 传递和回调测试
   - 错误状态渲染测试

2. **Iconify API 服务测试**
   - API 调用参数正确性
   - 响应数据解析
   - 错误处理逻辑
   - URL 构建正确性

3. **EditLinkModal 集成测试**
   - 图标类型切换逻辑
   - 状态保存和恢复
   - 表单提交数据完整性
   - 预览更新同步

**测试工具：**
- Jest: 测试运行器和断言库
- React Testing Library: React 组件测试
- MSW (Mock Service Worker): API 请求模拟

### 属性测试

使用 fast-check 进行属性测试，验证系统在各种输入下的正确性。

**属性测试库选择：** fast-check
- 原因：fast-check 是 JavaScript/TypeScript 生态中最成熟的属性测试库
- 特性：支持复杂数据生成、收缩（shrinking）、异步测试

**测试配置：**
- 每个属性测试运行至少 100 次迭代
- 使用自定义生成器生成有效的测试数据

**属性测试用例：**

1. **Property 1: API 搜索调用正确性**
   - 标签：`**Feature: iconify-icon-selector, Property 1: API 搜索调用正确性**`
   - 生成器：随机字符串作为搜索关键词
   - 验证：API 被调用且参数正确

2. **Property 2: 图标选项完整显示**
   - 标签：`**Feature: iconify-icon-selector, Property 2: 图标选项完整显示**`
   - 生成器：随机图标列表
   - 验证：每个选项都包含预览图和名称

3. **Property 3: 图标选择后 URL 填充**
   - 标签：`**Feature: iconify-icon-selector, Property 3: 图标选择后 URL 填充**`
   - 生成器：随机图标选项
   - 验证：URL 正确填充且预览更新

4. **Property 4: 缩放和颜色同步更新**
   - 标签：`**Feature: iconify-icon-selector, Property 4: 缩放和颜色同步更新**`
   - 生成器：随机缩放值（0.3-1.5）和颜色值
   - 验证：预览区域样式正确更新

5. **Property 5: 搜索节流机制**
   - 标签：`**Feature: iconify-icon-selector, Property 5: 搜索节流机制**`
   - 生成器：随机搜索输入序列
   - 验证：API 调用次数符合节流限制

6. **Property 6: 加载状态显示**
   - 标签：`**Feature: iconify-icon-selector, Property 6: 加载状态显示**`
   - 生成器：随机 API 延迟时间
   - 验证：加载状态在请求期间显示

7. **Property 7: 图标类型切换状态保持**
   - 标签：`**Feature: iconify-icon-selector, Property 7: 图标类型切换状态保持**`
   - 生成器：随机 Iconify URL 和类型切换序列
   - 验证：往返切换后状态恢复

8. **Property 8: Favicon 自动获取**
   - 标签：`**Feature: iconify-icon-selector, Property 8: Favicon 自动获取**`
   - 生成器：随机有效 URL
   - 验证：切换到 Favicon 模式后自动获取

9. **Property 9: 表单提交数据完整性**
   - 标签：`**Feature: iconify-icon-selector, Property 9: 表单提交数据完整性**`
   - 生成器：随机表单数据
   - 验证：提交数据包含所有必需字段

10. **Property 10: API URL 配置正确性**
    - 标签：`**Feature: iconify-icon-selector, Property 10: API URL 配置正确性**`
    - 生成器：随机 API 基础 URL
    - 验证：请求地址正确构建

11. **Property 11: Iconify URL 解析正确性**
    - 标签：`**Feature: iconify-icon-selector, Property 11: Iconify URL 解析正确性**`
    - 生成器：随机 Iconify 格式标识符
    - 验证：生成的 SVG URL 格式正确

### 边缘情况测试

通过单元测试覆盖以下边缘情况：

1. **图标加载失败** - 使用无效 URL 测试错误处理
2. **API 请求失败** - 模拟网络错误
3. **搜索结果为空** - 使用不存在的关键词
4. **API URL 未配置** - 测试默认值使用
5. **图标名称过长** - 测试文本截断

### 集成测试

测试 EditLinkModal 与 IconifySelector 的集成：

1. 完整的用户流程测试（选择 Iconify 类型 → 搜索 → 选择 → 预览 → 提交）
2. 图标类型切换流程测试
3. 表单验证和提交测试

### 测试覆盖率目标

- 语句覆盖率：≥ 80%
- 分支覆盖率：≥ 75%
- 函数覆盖率：≥ 85%
- 行覆盖率：≥ 80%

## Implementation Notes

### 性能优化

1. **搜索节流**
   - 使用 lodash.throttle 或自定义节流函数
   - 延迟设置为 300ms，平衡响应速度和请求频率

2. **图标预览懒加载**
   - 下拉列表中的图标使用懒加载
   - 仅加载可见区域的图标预览

3. **缓存策略**
   - 缓存搜索结果，避免重复请求相同关键词
   - 缓存时间：5 分钟

### 可访问性

1. **键盘导航**
   - 支持 Tab 键在图标选项间导航
   - 支持 Enter 键选择图标
   - 支持 Escape 键关闭下拉框

2. **屏幕阅读器**
   - 为图标选项添加 aria-label
   - 为加载状态添加 aria-live 区域
   - 为错误提示添加 role="alert"

3. **焦点管理**
   - 打开下拉框时自动聚焦搜索输入框
   - 选择图标后焦点返回触发按钮

### 国际化

1. **文本内容**
   - 所有用户可见文本支持国际化
   - 包括：按钮文本、占位符、错误提示等

2. **图标名称**
   - Iconify 图标名称保持英文（来自 API）
   - 可选：添加本地化的图标描述

### 浏览器兼容性

- 支持现代浏览器（Chrome、Firefox、Safari、Edge 最新两个版本）
- 使用 Ant Design 组件确保基础兼容性
- 图标 SVG 格式具有良好的跨浏览器支持

### 安全考虑

1. **XSS 防护**
   - 图标 URL 来自可信的 Iconify API
   - 使用 React 的自动转义防止 XSS

2. **CSP 策略**
   - 确保 CSP 策略允许从 api.iconify.design 加载资源
   - 添加到 img-src 和 connect-src 指令

3. **输入验证**
   - 验证搜索关键词长度
   - 验证图标 URL 格式

## Migration and Rollout

### 向后兼容性

- 现有的 Favicon 和自定义图标功能完全保留
- 现有链接数据无需迁移
- 新功能作为可选项添加

### 部署策略

1. **阶段 1：开发和测试**
   - 在开发环境实现功能
   - 完成单元测试和属性测试
   - 内部测试和代码审查

2. **阶段 2：预发布**
   - 部署到测试环境
   - 进行集成测试和用户验收测试
   - 收集反馈并优化

3. **阶段 3：生产发布**
   - 部署到生产环境
   - 监控错误和性能指标
   - 根据用户反馈持续改进

### 监控指标

- Iconify API 请求成功率
- 平均搜索响应时间
- 图标加载失败率
- 用户使用 Iconify 功能的比例

## Future Enhancements

1. **图标收藏功能**
   - 允许用户收藏常用图标
   - 在下拉框顶部显示收藏的图标

2. **图标集筛选**
   - 允许用户按图标集（如 Material Design、Font Awesome）筛选
   - 提供图标集选择器

3. **图标颜色自定义**
   - 支持修改 SVG 图标的颜色
   - 提供颜色选择器

4. **离线支持**
   - 缓存常用图标到本地
   - 离线时使用缓存的图标

5. **批量导入**
   - 支持从 Iconify 批量导入多个图标
   - 用于快速创建多个链接
