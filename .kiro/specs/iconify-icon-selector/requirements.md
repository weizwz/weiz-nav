# Requirements Document

## Introduction

本文档定义了在编辑链接表单中集成 Iconify API 图标选择功能的需求。该功能允许用户通过搜索和选择 Iconify 图标库中的图标来自定义链接图标，提供比传统 Favicon 和自定义 URL 更丰富的图标选择方式。

## Glossary

- **Iconify API**: 一个提供统一访问多个图标库的 API 服务，地址为 https://api.iconify.design
- **EditLinkModal**: 编辑链接的模态框组件，用于添加或编辑导航链接
- **图标类型**: 用户可选择的图标来源方式，包括 Favicon、自定义 URL 和 Iconify 图标
- **下拉搜索框**: 支持搜索和选择的下拉选择组件
- **预览区域**: 实时显示所选图标效果的区域

## Requirements

### Requirement 1

**User Story:** 作为用户，我希望在编辑链接时能够选择 Iconify 图标，以便使用更丰富和专业的图标库。

#### Acceptance Criteria

1. WHEN 用户打开编辑链接模态框 THEN 系统 SHALL 在图标类型选择器中显示"Iconify图标"选项
2. WHEN 用户选择"Iconify图标"类型 THEN 系统 SHALL 显示一个支持搜索的下拉选择框
3. WHEN 用户在下拉框中输入搜索关键词 THEN 系统 SHALL 调用 Iconify API 搜索接口并返回匹配的图标列表
4. WHEN API 返回图标列表 THEN 系统 SHALL 在下拉选项中显示图标预览和名称
5. WHEN 用户点击选择某个图标 THEN 系统 SHALL 将图标的 URL 填充到输入框中

### Requirement 2

**User Story:** 作为用户，我希望在选择 Iconify 图标后能够实时预览效果，以便确认图标是否符合预期。

#### Acceptance Criteria

1. WHEN 用户选择一个 Iconify 图标 THEN 系统 SHALL 在预览区域实时显示该图标
2. WHEN 图标 URL 更新 THEN 系统 SHALL 使用新的 URL 更新预览图标
3. WHEN 预览图标加载失败 THEN 系统 SHALL 显示占位符或错误提示
4. WHEN 用户调整图标缩放比例 THEN 系统 SHALL 同步更新预览区域的图标大小
5. WHEN 用户更改背景颜色 THEN 系统 SHALL 同步更新预览区域的背景色

### Requirement 3

**User Story:** 作为用户，我希望图标搜索功能响应迅速且不会频繁请求 API，以便获得流畅的使用体验。

#### Acceptance Criteria

1. WHEN 用户输入搜索关键词 THEN 系统 SHALL 使用节流机制限制 API 请求频率
2. WHEN 搜索请求正在进行中 THEN 系统 SHALL 显示加载状态指示器
3. WHEN API 请求失败 THEN 系统 SHALL 显示友好的错误提示信息
4. WHEN 搜索结果为空 THEN 系统 SHALL 显示"未找到相关图标"提示
5. WHEN 用户清空搜索框 THEN 系统 SHALL 清空搜索结果列表

### Requirement 4

**User Story:** 作为用户，我希望在不同图标类型之间切换时，系统能够保留我的选择，以便灵活调整配置。

#### Acceptance Criteria

1. WHEN 用户从 Iconify 切换到其他图标类型 THEN 系统 SHALL 保存当前选择的 Iconify 图标 URL
2. WHEN 用户切换回 Iconify 类型 THEN 系统 SHALL 恢复之前保存的 Iconify 图标
3. WHEN 用户在 Favicon 模式下切换到 Iconify THEN 系统 SHALL 清空 Favicon URL
4. WHEN 用户在 Iconify 模式下切换到 Favicon THEN 系统 SHALL 根据链接 URL 自动获取 Favicon
5. WHEN 用户提交表单 THEN 系统 SHALL 保存当前选择的图标类型和 URL

### Requirement 5

**User Story:** 作为用户，我希望 Iconify 图标选择器的界面与现有的编辑表单风格一致，以便获得统一的用户体验。

#### Acceptance Criteria

1. WHEN 显示 Iconify 选择器 THEN 系统 SHALL 使用与现有表单相同的 Ant Design 组件样式
2. WHEN 显示图标选项 THEN 系统 SHALL 使用与参考代码相似的布局和间距
3. WHEN 在移动设备上显示 THEN 系统 SHALL 确保选择器具有响应式布局
4. WHEN 用户与选择器交互 THEN 系统 SHALL 提供与其他表单元素一致的视觉反馈
5. WHEN 显示错误或加载状态 THEN 系统 SHALL 使用项目统一的提示样式

### Requirement 6

**User Story:** 作为开发者，我希望 Iconify API 的配置是可维护的，以便在需要时可以轻松更改 API 端点。

#### Acceptance Criteria

1. WHEN 系统初始化 THEN 系统 SHALL 从配置中读取 Iconify API 的基础 URL
2. WHEN API URL 未配置 THEN 系统 SHALL 使用默认值 'https://api.iconify.design'
3. WHEN 调用 API 接口 THEN 系统 SHALL 使用配置的 URL 构建完整的请求地址
4. WHEN API 配置更改 THEN 系统 SHALL 无需修改业务逻辑代码
5. WHEN 系统构建生产版本 THEN 系统 SHALL 正确处理环境变量配置

### Requirement 7

**User Story:** 作为用户，我希望能够看到图标的完整信息，以便更好地识别和选择合适的图标。

#### Acceptance Criteria

1. WHEN 显示图标选项 THEN 系统 SHALL 同时显示图标的预览图和名称
2. WHEN 图标名称过长 THEN 系统 SHALL 使用省略号截断显示
3. WHEN 用户选择图标后 THEN 系统 SHALL 在输入框中显示完整的图标 URL
4. WHEN 图标 URL 格式为 Iconify 格式 THEN 系统 SHALL 正确解析并显示图标
5. WHEN 用户悬停在图标选项上 THEN 系统 SHALL 提供视觉高亮反馈
