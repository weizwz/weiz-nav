import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings, ThemeMode, LayoutMode, UpdateSettingsInput } from '@/types';
import { getDefaultCategoryName } from '@/services/defaultData';

/**
 * Settings 状态接口
 */
interface SettingsState extends Settings {
  /** 是否正在加载设置 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
}

/**
 * 默认设置
 */
const defaultSettings: Settings = {
  theme: 'system',
  searchEngine: 'google',
  layout: 'grid',
  currentCategory: getDefaultCategoryName(),
  showDescription: true,
  gridColumns: 6,
};

/**
 * 初始状态
 */
const initialState: SettingsState = {
  ...defaultSettings,
  loading: false,
  error: null,
};

/**
 * Settings Slice
 * 管理用户设置
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /**
     * 设置主题
     */
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      state.error = null;
    },

    /**
     * 设置搜索引擎
     */
    setSearchEngine: (state, action: PayloadAction<string>) => {
      state.searchEngine = action.payload;
      state.error = null;
    },

    /**
     * 设置布局模式
     */
    setLayout: (state, action: PayloadAction<LayoutMode>) => {
      state.layout = action.payload;
      state.error = null;
    },

    /**
     * 设置当前分类
     */
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
      state.error = null;
    },

    /**
     * 设置是否显示描述
     */
    setShowDescription: (state, action: PayloadAction<boolean>) => {
      state.showDescription = action.payload;
      state.error = null;
    },

    /**
     * 设置网格列数
     */
    setGridColumns: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1 && action.payload <= 12) {
        state.gridColumns = action.payload;
        state.error = null;
      } else {
        state.error = 'Grid columns must be between 1 and 12';
      }
    },

    /**
     * 批量更新设置
     */
    updateSettings: (state, action: PayloadAction<UpdateSettingsInput>) => {
      Object.assign(state, action.payload);
      state.error = null;
    },

    /**
     * 加载设置
     */
    loadSettings: (state, action: PayloadAction<Settings>) => {
      Object.assign(state, action.payload);
      state.loading = false;
      state.error = null;
    },

    /**
     * 重置设置到默认值
     */
    resetSettings: (state) => {
      Object.assign(state, defaultSettings);
      state.error = null;
    },

    /**
     * 设置加载状态
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * 设置错误信息
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * 清除错误信息
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

/**
 * 导出 actions
 */
export const {
  setTheme,
  setSearchEngine,
  setLayout,
  setCurrentCategory,
  setShowDescription,
  setGridColumns,
  updateSettings,
  loadSettings,
  resetSettings,
  setLoading,
  setError,
  clearError,
} = settingsSlice.actions;

/**
 * 导出 reducer
 */
export default settingsSlice.reducer;
