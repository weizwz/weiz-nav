# 搜索功能实现说明

## 概述

本文档说明了任务 5 的实现细节：搜索功能服务。

## 实现的功能

### 1. 防抖工具函数 (`utils/debounce.ts`)

实现了两个防抖函数：

- **`debounce<T>`**: 基础防抖函数，延迟执行函数直到指定时间后无新调用
- **`debounceCancelable<T>`**: 可取消的防抖函数，返回防抖函数和取消方法

**特性：**
- 支持泛型，保持类型安全
- 自动清理定时器
- 支持 `this` 上下文绑定

### 2. 搜索服务 (`services/search.ts`)

实现了完整的搜索功能：

#### 核心函数

**`searchLinks(links: Link[], query: string): Link[]`**
- 支持名称、描述、URL、标签的模糊匹配
- 不区分大小写
- 空查询返回所有链接
- 高效的过滤算法

**`getSearchUrl(engineId: string, query: string): string`**
- 根据搜索引擎 ID 和查询词生成完整的搜索 URL
- 自动 URL 编码
- 未知引擎默认使用 Google

**`getSearchEngine(engineId: string): SearchEngine`**
- 获取搜索引擎配置
- 未找到时返回默认引擎（Google）

#### 预设搜索引擎

实现了 6 个主流搜索引擎：

1. **Google** - `https://www.google.com/search?q={query}`
2. **Bing** - `https://www.bing.com/search?q={query}`
3. **Yahoo** - `https://search.yahoo.com/search?p={query}`
4. **Baidu** - `https://www.baidu.com/s?wd={query}`
5. **Yandex** - `https://yandex.com/search/?text={query}`
6. **DuckDuckGo** - `https://duckduckgo.com/?q={query}`

### 3. 搜索状态管理 (`store/slices/searchSlice.ts`)

增强了搜索 slice，添加了两个 thunk actions：

**`performDebouncedSearch(query: string)`**
- 带 300ms 防抖延迟的搜索
- 立即更新查询状态
- 空查询立即清除结果
- 自动管理搜索中状态

**`performImmediateSearch(query: string)`**
- 立即执行搜索，不防抖
- 用于需要即时结果的场景

## 使用示例

### 在组件中使用防抖搜索

```typescript
import { useAppDispatch } from '@/store/hooks';
import { performDebouncedSearch } from '@/store/slices/searchSlice';

function SearchBar() {
  const dispatch = useAppDispatch();
  
  const handleSearch = (value: string) => {
    // 自动防抖 300ms
    dispatch(performDebouncedSearch(value));
  };
  
  return <Input onChange={(e) => handleSearch(e.target.value)} />;
}
```

### 直接使用搜索函数

```typescript
import { searchLinks } from '@/services/search';

const results = searchLinks(allLinks, 'github');
```

### 使用搜索引擎

```typescript
import { getSearchUrl, SEARCH_ENGINES } from '@/services/search';

// 获取搜索 URL
const url = getSearchUrl('google', 'Next.js');
// 结果: https://www.google.com/search?q=Next.js

// 在新标签页打开
window.open(url, '_blank');
```

## 性能优化

1. **防抖处理**: 300ms 延迟避免频繁搜索
2. **即时清除**: 空查询立即清除结果，无需等待
3. **高效过滤**: 使用原生数组方法，性能优异
4. **类型安全**: 完整的 TypeScript 类型支持

## 满足的需求

- ✅ 需求 2.1: 提供搜索输入功能
- ✅ 需求 2.2: 300ms 内实时过滤
- ✅ 需求 2.3: 支持名称、描述、标签模糊匹配
- ✅ 需求 2.5: 高亮匹配关键词（数据层支持）
- ✅ 需求 3.1: 搜索引擎图标和配置
- ✅ 需求 3.2: 6 个主流搜索引擎
- ✅ 需求 10.3: 防抖处理优化性能

## 测试建议

虽然本任务不包含测试实现，但建议测试以下场景：

1. 空查询返回所有链接
2. 名称匹配
3. 描述匹配
4. URL 匹配
5. 标签匹配
6. 不区分大小写
7. 防抖延迟 300ms
8. 搜索引擎 URL 生成
9. 未知搜索引擎默认处理

## 下一步

此搜索功能已完全实现，可以在以下任务中使用：

- 任务 8: 实现搜索栏组件
- 任务 14: 实现链接网格组件（搜索结果展示）
