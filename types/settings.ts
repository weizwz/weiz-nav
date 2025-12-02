/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * 布局模式类型
 */
export type LayoutMode = 'grid' | 'list';

/**
 * Settings 接口定义
 * 表示用户的个性化设置
 */
export interface Settings {
  /** 主题模式 */
  theme: ThemeMode;

  /** 当前搜索引擎 ID */
  searchEngine: string;

  /** 布局模式 */
  layout: LayoutMode;

  /** 是否显示描述 */
  showDescription?: boolean;

  /** 每行显示的卡片数量（仅在 grid 模式下） */
  gridColumns?: number;
}

/**
 * 设置状态接口
 */
export interface SettingsState extends Settings {
  /** 是否正在加载设置 */
  loading: boolean;
  
  /** 错误信息 */
  error: string | null;
}

/**
 * 更新设置时的输入数据类型
 */
export type UpdateSettingsInput = Partial<Settings>;
