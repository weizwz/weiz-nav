# Implementation Plan

- [x] 1. 创建 Iconify API 服务模块
  - 创建 `api/iconify.ts` 文件
  - 实现 IconifyApi 类，包含搜索图标、获取图标 URL、验证图标标识符等方法
  - 实现配置管理，支持从环境变量读取 API URL
  - 实现错误处理和日志记录
  - _Requirements: 1.3, 6.1, 6.2, 6.3_

- [ ]* 1.1 编写 Iconify API 服务的单元测试
  - 测试 API 调用参数正确性
  - 测试响应数据解析
  - 测试错误处理逻辑
  - 测试 URL 构建正确性
  - 测试配置读取和默认值
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 1.2 编写属性测试：API URL 配置正确性
  - **Property 10: API URL 配置正确性**
  - **Validates: Requirements 6.3**

- [ ]* 1.3 编写属性测试：Iconify URL 解析正确性
  - **Property 11: Iconify URL 解析正确性**
  - **Validates: Requirements 7.4**

- [x] 2. 创建 IconifySelector 组件
  - 创建 `components/modals/IconifySelector.tsx` 文件
  - 实现基础组件结构，使用 Ant Design 的 Popover、Input、List 等组件
  - 实现状态管理（open、loading、query、options、selectedIcon）
  - 实现图标选项的渲染，包括预览图和名称
  - 实现 Props 接口和回调函数
  - _Requirements: 1.2, 1.4, 7.1_

- [x] 2.1 实现搜索功能
  - 实现搜索输入框的 onChange 处理
  - 集成 Iconify API 服务进行搜索
  - 实现节流机制（300ms）
  - 实现加载状态显示
  - 实现搜索结果更新
  - _Requirements: 1.3, 3.1, 3.2_

- [ ]* 2.2 编写属性测试：API 搜索调用正确性
  - **Property 1: API 搜索调用正确性**
  - **Validates: Requirements 1.3**

- [ ]* 2.3 编写属性测试：搜索节流机制
  - **Property 5: 搜索节流机制**
  - **Validates: Requirements 3.1**

- [ ]* 2.4 编写属性测试：加载状态显示
  - **Property 6: 加载状态显示**
  - **Validates: Requirements 3.2**

- [x] 2.5 实现图标选择功能
  - 实现图标选项的点击处理
  - 实现选中状态的视觉反馈
  - 实现 onChange 回调，传递图标 URL
  - 实现下拉框关闭逻辑
  - _Requirements: 1.5, 7.3_

- [ ]* 2.6 编写属性测试：图标选项完整显示
  - **Property 2: 图标选项完整显示**
  - **Validates: Requirements 1.4, 7.1**

- [ ]* 2.7 编写属性测试：图标选择后 URL 填充
  - **Property 3: 图标选择后 URL 填充**
  - **Validates: Requirements 1.5, 2.1, 2.2, 7.3**

- [x] 2.8 实现错误处理和边缘情况
  - 实现 API 请求失败的错误提示
  - 实现搜索结果为空的提示
  - 实现图标加载失败的占位符
  - 实现清空搜索框的处理
  - _Requirements: 3.3, 3.4, 3.5_

- [ ]* 2.9 编写 IconifySelector 组件的单元测试
  - 测试组件渲染
  - 测试用户交互（打开/关闭下拉框、选择图标）
  - 测试 Props 传递和回调
  - 测试错误状态渲染
  - _Requirements: 1.2, 1.4, 1.5, 3.3, 3.4, 3.5_

- [x] 3. 修改 EditLinkModal 组件集成 Iconify 功能
  - 在图标类型选项中添加 "Iconify图标" 选项（value: '3'）
  - 添加 savedIconifyIcon 状态管理
  - 实现图标类型切换逻辑，支持 Iconify 类型
  - 在图标类型为 '3' 时渲染 IconifySelector 组件
  - 实现 IconifySelector 的 onChange 处理，更新表单和预览
  - _Requirements: 1.1, 1.2, 4.1, 4.2_

- [x] 3.1 实现图标类型切换的状态保持
  - 实现从 Iconify 切换到其他类型时保存 Iconify URL
  - 实现切换回 Iconify 类型时恢复保存的 URL
  - 实现从 Favicon 切换到 Iconify 时清空 Favicon URL
  - 实现从 Iconify 切换到 Favicon 时自动获取 Favicon
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 3.2 编写属性测试：图标类型切换状态保持
  - **Property 7: 图标类型切换状态保持**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 3.3 编写属性测试：Favicon 自动获取
  - **Property 8: Favicon 自动获取**
  - **Validates: Requirements 4.4**

- [x] 3.4 确保预览功能支持 Iconify 图标
  - 验证预览区域能正确显示 Iconify 图标
  - 验证缩放和背景色功能对 Iconify 图标生效
  - 实现图标加载失败时的占位符显示
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.5 编写属性测试：缩放和颜色同步更新
  - **Property 4: 缩放和颜色同步更新**
  - **Validates: Requirements 2.4, 2.5**

- [x] 3.6 确保表单提交包含 Iconify 图标数据
  - 验证提交时正确保存图标类型和 URL
  - 验证编辑模式下正确识别 Iconify 图标
  - 验证 iconScale 等属性正确保存
  - _Requirements: 4.5_

- [ ]* 3.7 编写属性测试：表单提交数据完整性
  - **Property 9: 表单提交数据完整性**
  - **Validates: Requirements 4.5**

- [ ]* 3.8 编写 EditLinkModal 集成测试
  - 测试完整的用户流程（选择 Iconify → 搜索 → 选择 → 预览 → 提交）
  - 测试图标类型切换流程
  - 测试表单验证和提交
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. 添加样式和可访问性优化
  - 确保 IconifySelector 使用与现有表单一致的 Ant Design 样式
  - 实现响应式布局，支持移动设备
  - 添加键盘导航支持（Tab、Enter、Escape）
  - 添加 ARIA 属性（aria-label、aria-live、role）
  - 实现焦点管理
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. 性能优化和最终调整
  - 实现搜索结果缓存（5 分钟）
  - 实现图标预览懒加载
  - 优化节流函数性能
  - 添加错误日志记录
  - 验证所有错误处理路径
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. 更新环境配置和文档
  - 在 `.env.example` 中添加 `NEXT_PUBLIC_API_ICONIFY_URL` 配置项
  - 更新 CSP 策略，允许从 api.iconify.design 加载资源
  - 添加功能使用文档
  - 添加故障排查指南
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户
