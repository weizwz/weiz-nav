# 数据初始化和导入更新逻辑梳理

## 📋 需求说明

**核心规则：**

- ✅ 允许相同的 URL 卡片在**不同分类**中重复出现
- ❌ 同一分类中，不允许 URL 重复

## 🏗️ 数据模型

### Link 接口

```typescript
interface Link {
  id: string; // 全局唯一标识符
  name: string;
  url: string;
  description: string;
  icon?: string;
  backgroundColor?: string;
  iconScale?: number;
  category?: string; // 分类名称（关联字段）
  tags?: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
}
```

**唯一性标识：** `url + category` 组合作为复合键

## 🔄 数据流程

### 1. 初始化流程

**文件：** `store/index.ts` → `initializeStore()`

**流程：**

```
应用启动
  ↓
检查 LocalStorage
  ↓
有数据？
  ├─ 是 → 加载到 Redux Store
  └─ 否 → 加载默认数据 (defaultData.ts)
```

**代码位置：**

- `store/index.ts` - `initializeStore()` 函数
- `components/Providers.tsx` - `DataInitializer` 组件
- `services/defaultData.ts` - 默认数据定义

### 2. 添加链接流程

**文件：** `store/slices/linksSlice.ts` → `addLink`

**验证逻辑：**

```typescript
// 检查同一分类中是否已存在相同的 URL
const isDuplicate = isDuplicateUrlInCategory(url, category, existingLinks);

if (isDuplicate) {
  // 阻止添加，返回错误
  state.error = `该分类中已存在相同的 URL: ${url}`;
  return;
}
```

**特点：**

- ✅ 相同 URL 可以添加到不同分类
- ❌ 相同分类中不能添加重复 URL
- 错误信息会被页面捕获并显示给用户

### 3. 更新链接流程

**文件：** `store/slices/linksSlice.ts` → `updateLink`

**验证逻辑：**

```typescript
// 如果 URL 或分类改变，检查新的 URL + 分类组合是否重复
if (urlChanged || categoryChanged) {
  const isDuplicate = isDuplicateUrlInCategory(
    newUrl,
    newCategory,
    existingLinks,
    linkId // 排除自身
  );

  if (isDuplicate) {
    state.error = `目标分类中已存在相同的 URL: ${newUrl}`;
    return;
  }
}
```

**特点：**

- 支持将链接移动到其他分类（如果目标分类中没有相同 URL）
- 更新时排除自身，避免误判
- 分类改变时自动调整 order 到新分类末尾

### 4. 导入数据流程

**文件：** `components/management/ImportExport.tsx` → `handleImport`

**合并策略（已修改）：**

```typescript
// 使用 URL + 分类 作为复合键
const compositeKey = `${url}::${category}`;

// 判断逻辑
if (existingLinksMap.has(compositeKey)) {
  // URL + 分类都相同 → 更新现有链接
  updateExistingLink();
} else {
  // 新的 URL + 分类组合 → 添加新链接
  addNewLink();
}
```

**导入结果：**

- 相同 URL 在不同分类中 → 作为独立的链接存在
- 相同 URL + 分类 → 更新现有链接的其他字段
- 保留原有 ID 和创建时间，更新修改时间

**示例：**

```
导入前：
- 分类A: Google (https://google.com)
- 分类B: Bing (https://bing.com)

导入数据：
- 分类A: Google (https://google.com) [更新]
- 分类B: Google (https://google.com) [新增]
- 分类C: Google (https://google.com) [新增]

导入后：
- 分类A: Google (https://google.com) [已更新]
- 分类B: Bing (https://bing.com) [保留]
- 分类B: Google (https://google.com) [新增]
- 分类C: Google (https://google.com) [新增]
```

## 🛠️ 工具函数

**文件：** `utils/linkValidation.ts`

### isDuplicateUrlInCategory

检查同一分类中是否存在相同的 URL

```typescript
isDuplicateUrlInCategory(
  url: string,
  category: string | undefined,
  links: Link[],
  excludeLinkId?: string  // 更新时排除自身
): boolean
```

### getDuplicateLinkInCategory

获取分类中重复的 URL 链接对象

### countUrlOccurrences

统计 URL 在所有分类中出现的次数

### getCategoriesWithUrl

获取 URL 在哪些分类中出现

## 📊 数据持久化

### LocalStorage 同步

**文件：** `store/index.ts` - `localStorageSyncMiddleware`

**机制：**

- Redux action 触发后自动同步到 LocalStorage
- 监听 `links/` 和 `categories/` 前缀的 action
- 错误处理：存储失败时在控制台记录错误

**存储键：**

- `nav_links` - 链接数据
- `nav_categories` - 分类数据
- `nav_settings` - 设置数据

## 🎯 错误处理

### Redux Store 错误状态

```typescript
interface LinksState {
  items: Link[];
  loading: boolean;
  error: string | null; // 错误信息
}
```

### 页面错误处理

**文件：** `app/page.tsx`, `app/manage/page.tsx`

```typescript
// 添加/更新后检查错误
dispatch(addLink(linkData));

const error = store.getState().links.error;
if (error) {
  showError(error); // 显示错误提示
  dispatch({ type: 'links/clearError' }); // 清除错误
  return; // 阻止关闭弹窗
}

showSuccess('操作成功');
```

## 📝 修改文件清单

### 新增文件

- ✅ `utils/linkValidation.ts` - 链接验证工具函数

### 修改文件

- ✅ `store/slices/linksSlice.ts` - 添加 URL 重复检查逻辑
- ✅ `components/management/ImportExport.tsx` - 修改导入合并策略
- ✅ `app/page.tsx` - 添加错误处理
- ✅ `app/manage/page.tsx` - 添加错误处理

## 🧪 测试场景

### 场景 1：添加链接

```
操作：在分类A中添加 Google (https://google.com)
结果：✅ 成功添加

操作：在分类A中再次添加 Google (https://google.com)
结果：❌ 提示"该分类中已存在相同的 URL"

操作：在分类B中添加 Google (https://google.com)
结果：✅ 成功添加（不同分类允许相同 URL）
```

### 场景 2：更新链接

```
操作：将分类A中的 Google 移动到分类B（分类B中没有 Google）
结果：✅ 成功移动

操作：将分类A中的 Google 移动到分类B（分类B中已有 Google）
结果：❌ 提示"目标分类中已存在相同的 URL"
```

### 场景 3：导入数据

```
现有数据：
- 分类A: Google (https://google.com)

导入数据：
- 分类A: Google (https://google.com) [名称改为 "谷歌"]
- 分类B: Google (https://google.com)

结果：
- 分类A: 谷歌 (https://google.com) [已更新]
- 分类B: Google (https://google.com) [新增]
```

## 🔍 注意事项

1. **复合键唯一性：** 使用 `url + category` 作为唯一性判断依据
2. **ID 保持不变：** 更新时保留原有 ID，确保引用关系不变
3. **时间戳管理：** 创建时间保持不变，更新时间自动更新
4. **排序处理：** 分类改变时自动调整到新分类末尾
5. **错误反馈：** 所有验证错误都会通过 UI 提示用户
6. **数据同步：** Redux 和 LocalStorage 自动保持同步

## 📚 相关文件索引

- **类型定义：** `types/link.ts`, `types/category.ts`
- **数据服务：** `services/storage.ts`, `services/defaultData.ts`
- **状态管理：** `store/slices/linksSlice.ts`, `store/index.ts`
- **UI 组件：** `app/page.tsx`, `app/manage/page.tsx`
- **导入导出：** `components/management/ImportExport.tsx`
- **工具函数：** `utils/linkValidation.ts`
