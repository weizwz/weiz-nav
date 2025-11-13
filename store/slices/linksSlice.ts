import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Link, CreateLinkInput, UpdateLinkInput } from '@/types';

/**
 * Links 状态接口
 */
interface LinksState {
  /** 所有链接 */
  items: Link[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: LinksState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Links Slice
 * 管理导航链接的状态
 */
const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    /**
     * 添加新链接
     */
    addLink: (state, action: PayloadAction<CreateLinkInput>) => {
      const now = Date.now();
      const newLink: Link = {
        ...action.payload,
        id: generateId(),
        order: state.items.length,
        createdAt: now,
        updatedAt: now,
      };
      state.items.push(newLink);
      state.error = null;
    },

    /**
     * 更新链接
     */
    updateLink: (state, action: PayloadAction<UpdateLinkInput>) => {
      const index = state.items.findIndex(link => link.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          updatedAt: Date.now(),
        };
        state.error = null;
      } else {
        state.error = `Link with id ${action.payload.id} not found`;
      }
    },

    /**
     * 删除链接
     */
    deleteLink: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(link => link.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
        // 重新排序
        state.items.forEach((link, idx) => {
          link.order = idx;
        });
        state.error = null;
      } else {
        state.error = `Link with id ${action.payload} not found`;
      }
    },

    /**
     * 重新排序链接
     */
    reorderLinks: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      
      if (fromIndex < 0 || fromIndex >= state.items.length ||
          toIndex < 0 || toIndex >= state.items.length) {
        state.error = 'Invalid reorder indices';
        return;
      }

      const [movedItem] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, movedItem);
      
      // 更新所有链接的 order 属性
      state.items.forEach((link, index) => {
        link.order = index;
        link.updatedAt = Date.now();
      });
      
      state.error = null;
    },

    /**
     * 加载链接数据
     */
    loadLinks: (state, action: PayloadAction<Link[]>) => {
      state.items = [...action.payload].sort((a, b) => a.order - b.order);
      state.loading = false;
      state.error = null;
    },

    /**
     * 重置链接数据
     */
    resetLinks: (state, action: PayloadAction<Link[]>) => {
      state.items = action.payload.sort((a, b) => a.order - b.order);
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
  addLink,
  updateLink,
  deleteLink,
  reorderLinks,
  loadLinks,
  resetLinks,
  setLoading,
  setError,
  clearError,
} = linksSlice.actions;

/**
 * 导出 reducer
 */
export default linksSlice.reducer;
