import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultCategoryName } from '@/services/defaultData';

/**
 * UI 状态接口
 * 用于管理非持久化的 UI 状态
 */
interface UiState {
  /** 当前选中的分类 */
  currentCategory: string;
}

/**
 * 初始状态
 */
const initialState: UiState = {
  currentCategory: getDefaultCategoryName(),
};

/**
 * UI Slice
 * 管理 UI 相关的临时状态
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * 设置当前分类
     */
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
  },
});

/**
 * 导出 actions
 */
export const {
  setCurrentCategory,
} = uiSlice.actions;

/**
 * 导出 reducer
 */
export default uiSlice.reducer;
