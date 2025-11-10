# 实施计划

- [x] 1. 初始化项目和配置开发环境
  - 使用 `pnpm create next-app` 创建 Next.js 15 项目，启用 TypeScript、Tailwind CSS 4.x、App Router
  - 安装核心依赖：`antd`, `@ant-design/icons`, `@reduxjs/toolkit`, `react-redux`, `framer-motion`, `next-themes`
  - 配置 `tailwind.config.ts` 启用 dark mode 和自定义主题颜色（使用 Tailwind CSS 4.x 新语法）
  - 配置 `tsconfig.json` 设置路径别名（@/components, @/store, @/types, @/api 等）
  - 创建基础目录结构（api, components, store, services, types, utils）
  - _需求: 1.1, 7.1, 9.1_

- [x] 2. 定义 TypeScript 类型和接口
  - 创建 `types/link.ts` 定义 Link 接口（id, name, url, description, icon, backgroundColor, category, tags, order, timestamps）
  - 创建 `types/search.ts` 定义 SearchEngine 接口和搜索相关类型
  - 创建 `types/settings.ts` 定义 Settings 接口（theme, searchEngine, layout）
  - 定义 Category 类型用于分类管理（主页、工作、娱乐等）
  - _需求: 1.1, 2.1, 3.1, 6.1, 7.1_

- [ ] 3. 实现数据持久化服务和 Favicon API
  - 创建 `services/storage.ts` 封装 LocalStorage 操作
  - 实现 `saveLinks`, `loadLinks`, `saveSettings`, `loadSettings`, `clear` 方法
  - 添加错误处理和数据验证
  - 创建 `services/defaultData.ts` 定义默认导航链接数据（包含 GitHub, MDN, Stack Overflow 等常用资源，按分类组织）
  - 创建 `api/favicon.ts` 封装 Favicon.im API 调用，用于自动获取网站图标
  - 实现图标获取函数，支持根据 URL 自动获取网站 favicon
  - _需求: 6.1, 6.2, 6.3, 6.4_

- [ ] 4. 配置 Redux 状态管理
  - 创建 `store/index.ts` 配置 Redux store
  - 创建 `store/slices/linksSlice.ts` 管理链接数据（actions: addLink, updateLink, deleteLink, reorderLinks, loadLinks, resetLinks）
  - 创建 `store/slices/searchSlice.ts` 管理搜索状态（actions: setQuery, setResults, clearSearch）
  - 创建 `store/slices/settingsSlice.ts` 管理用户设置（actions: setTheme, setSearchEngine, setLayout, setCurrentCategory）
  - 实现 Redux middleware 自动同步数据到 LocalStorage
  - 创建 `store/hooks.ts` 导出类型化的 useAppDispatch 和 useAppSelector hooks
  - _需求: 6.2, 6.5_

- [ ] 5. 实现搜索功能服务
  - 创建 `services/search.ts` 实现搜索算法
  - 实现 `searchLinks` 函数支持名称、描述、URL、标签的模糊匹配
  - 创建 `utils/debounce.ts` 实现防抖工具函数
  - 在 searchSlice 中集成防抖搜索（300ms 延迟）
  - 定义预设搜索引擎列表（Google, Bing, Yahoo, Baidu, Yandex, DuckDuckGo）
  - _需求: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 10.3_

- [ ] 6. 创建根布局和主题系统
  - 配置 `app/layout.tsx` 集成 Redux Provider 和 Ant Design ConfigProvider
  - 使用 `next-themes` 的 ThemeProvider 实现主题管理
  - 配置 Ant Design 主题算法（light/dark）
  - 添加全局样式到 `app/globals.css`（主题过渡动画、自定义 CSS 变量）
  - 实现页面加载时从 LocalStorage 恢复数据的逻辑
  - _需求: 6.4, 7.1, 7.3, 7.4, 7.5_

- [ ] 7. 实现主题切换组件
  - 创建 `components/layout/ThemeToggle.tsx` 组件
  - 使用 Ant Design Switch 或自定义按钮实现切换 UI
  - 集成 next-themes 的 useTheme hook
  - 实现平滑的主题过渡动画（300ms）
  - 点击时切换主题并保存到 Redux store 和 LocalStorage
  - _需求: 7.1, 7.2, 7.4_

- [ ] 8. 实现搜索栏组件
  - 创建 `components/layout/SearchBar.tsx` 组件
  - 使用 Ant Design Input.Search 组件
  - 实现搜索引擎图标按钮和下拉菜单（使用 Dropdown 组件）
  - 集成 Redux 搜索状态，输入时触发防抖搜索
  - 实现回车键打开外部搜索引擎功能
  - 添加清除搜索按钮
  - 保存用户选择的搜索引擎到 LocalStorage
  - _需求: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. 实现页头组件
  - 创建 `components/layout/Header.tsx` 组件
  - 集成 SearchBar 和 ThemeToggle 组件
  - 实现响应式布局（移动端调整搜索栏和按钮位置）
  - 添加网站标题或 Logo
  - _需求: 1.1, 1.2, 1.3_

- [ ] 10. 实现链接卡片组件
  - 创建 `components/navigation/LinkCard.tsx` 组件
  - 使用 Ant Design Card 组件作为基础
  - 显示图标（支持 Ant Design 图标或自定义图片 URL）、名称、描述
  - 应用自定义背景颜色
  - 使用 framer-motion 实现悬停动画（上浮 + 阴影增强）
  - 实现点击跳转到链接 URL（在新标签页打开）
  - _需求: 9.1, 9.2, 9.3, 9.5_

- [ ] 11. 实现右键菜单功能
  - 在 LinkCard 组件中集成 Ant Design Dropdown 组件
  - 监听 onContextMenu 事件，阻止默认浏览器菜单
  - 显示"编辑"和"删除"菜单项
  - 点击"编辑"时触发 onEdit 回调
  - 点击"删除"时触发 onDelete 回调
  - _需求: 4.1, 4.4_

- [ ] 12. 实现编辑链接弹窗组件
  - 创建 `components/modals/EditLinkModal.tsx` 组件
  - 使用 Ant Design Modal 和 Form 组件
  - 添加表单字段：地址（URL，必填）、名称（必填）、描述（可选）、分类选择、图标（可选）、背景颜色（颜色选择器）
  - 实现表单验证规则（URL 格式、必填字段、字符长度限制）
  - 创建 `utils/colorUtils.ts` 提供预设颜色和颜色验证
  - 集成 Favicon API：当用户输入 URL 后，自动调用 API 获取网站图标作为默认图标
  - 提交时 dispatch Redux action 更新或添加链接
  - _需求: 4.2, 4.3, 4.6, 4.7_

- [ ] 13. 实现确认对话框组件
  - 创建 `components/modals/ConfirmModal.tsx` 可复用的确认对话框组件
  - 使用 Ant Design Modal.confirm 或自定义 Modal
  - 支持自定义标题、内容、确认/取消按钮文本
  - 用于删除链接和重置数据的二次确认
  - _需求: 4.4, 4.5, 8.2, 8.3_

- [ ] 14. 实现分类导航和链接网格组件
  - 创建 `components/navigation/CategorySidebar.tsx` 左侧分类导航组件
  - 显示分类列表（主页、工作、娱乐等），支持点击切换分类
  - 高亮当前选中的分类
  - 创建 `components/navigation/LinkGrid.tsx` 组件
  - 使用 CSS Grid 或 Tailwind Grid 实现响应式布局
  - 配置断点：Desktop (6列), Laptop (4列), Tablet (3列), Mobile (2列), Small Mobile (1列)
  - 根据当前选中的分类和搜索状态过滤显示的链接
  - 显示空状态提示（无链接或搜索无结果）
  - 渲染 LinkCard 组件列表
  - _需求: 1.1, 1.2, 1.3, 1.4, 2.4_

- [ ] 15. 实现主页面
  - 创建 `app/page.tsx` 主页组件
  - 实现左右布局：左侧 CategorySidebar，右侧内容区域（Header + LinkGrid）
  - 集成 Header、CategorySidebar 和 LinkGrid 组件
  - 添加"添加链接"浮动按钮（使用 Ant Design FloatButton 或自定义按钮）
  - 点击添加按钮打开 EditLinkModal（空表单）
  - 实现页面加载时从 Redux store 加载链接数据
  - 处理编辑和删除链接的回调函数
  - 实现响应式布局：移动端隐藏或折叠侧边栏
  - _需求: 4.6, 4.7, 6.4, 9.6_

- [ ] 16. 实现数据管理页面
  - 创建 `app/manage/page.tsx` 数据管理页面
  - 创建 `components/management/DataTable.tsx` 数据表格组件
  - 使用 Ant Design Table 组件显示所有链接
  - 实现拖拽排序功能（使用 @dnd-kit/sortable 或 react-beautiful-dnd）
  - 添加行内编辑和删除按钮
  - 实现批量选择和批量删除功能
  - _需求: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 17. 实现数据导入导出功能
  - 创建 `components/management/ImportExport.tsx` 组件
  - 实现导出功能：将链接数据转换为 JSON 并下载
  - 实现导入功能：上传 JSON 文件并解析（使用 Ant Design Upload 组件）
  - 添加数据验证确保导入的 JSON 格式正确
  - 导入成功后更新 Redux store 和 LocalStorage
  - _需求: 5.5_

- [ ] 18. 实现数据重置功能
  - 在数据管理页面添加"重置数据"按钮
  - 点击时显示警告确认对话框
  - 实现二次确认机制（例如输入"确认"文本或点击两次）
  - 确认后 dispatch resetLinks action 清除所有数据
  - 重新加载默认数据并刷新页面
  - 显示成功提示消息
  - _需求: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 19. 优化性能和用户体验
  - 使用 React.memo 优化 LinkCard 组件避免不必要的重渲染
  - 使用 useMemo 缓存搜索结果和过滤后的链接列表
  - 使用 useCallback 缓存事件处理函数
  - 实现图片懒加载（使用 Next.js Image 组件或 Intersection Observer）
  - 添加页面加载动画和骨架屏（使用 Ant Design Skeleton）
  - 优化 Tailwind CSS 配置移除未使用的样式
  - _需求: 9.4, 9.5, 9.6, 10.1, 10.2, 10.3, 10.4_

- [ ] 20. 实现错误处理和用户反馈
  - 创建 `app/error.tsx` 全局错误边界组件
  - 在关键操作中添加 try-catch 错误处理
  - 使用 Ant Design message 组件显示操作成功/失败提示
  - 处理 LocalStorage 配额超限错误
  - 处理图标加载失败（显示默认图标）
  - 添加表单验证错误提示
  - _需求: 2.4_

- [ ] 21. 实现可访问性优化
  - 为所有交互元素添加合适的 ARIA 标签
  - 确保键盘导航支持（Tab 顺序、Enter/Space 触发）
  - 为图标添加 alt 文本或 aria-label
  - 确保颜色对比度符合 WCAG 2.1 AA 标准
  - 添加焦点指示样式
  - 测试屏幕阅读器兼容性
  - _需求: 9.1, 9.5_

- [ ]* 22. 配置静态导出和部署
  - 配置 `next.config.js` 启用静态导出（output: 'export'）
  - 配置图片优化选项（unoptimized: true 用于静态导出）
  - 创建部署脚本或 CI/CD 配置文件
  - 测试构建输出（`pnpm build`）
  - 验证静态文件可以正常运行
  - _需求: 9.6, 10.5_

- [ ]* 23. 编写项目文档
  - 创建 README.md 包含项目介绍、功能特性、技术栈
  - 添加安装和运行说明
  - 添加使用指南和截图
  - 创建 CONTRIBUTING.md 贡献指南
  - 添加 LICENSE 文件
  - _需求: 所有需求_
