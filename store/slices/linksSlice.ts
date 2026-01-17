import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Link, CreateLinkInput, UpdateLinkInput } from '@/types';
import { isDuplicateUrlInCategory } from '@/utils/linkValidation';

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
      // 检查同一分类中是否已存在相同的 URL
      const isDuplicate = isDuplicateUrlInCategory(
        action.payload.url,
        action.payload.category,
        state.items
      );

      if (isDuplicate) {
        state.error = `该分类中已存在相同的 URL: ${action.payload.url}`;
        return;
      }

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
      const index = state.items.findIndex((link) => link.id === action.payload.id);
      if (index !== -1) {
        const oldLink = state.items[index];
        const newUrl = action.payload.url || oldLink.url;
        const newCategory =
          action.payload.category !== undefined ? action.payload.category : oldLink.category;

        // 检查是否 URL 或分类发生了变化
        const urlChanged = action.payload.url && action.payload.url !== oldLink.url;
        const categoryChanged =
          action.payload.category !== undefined && action.payload.category !== oldLink.category;

        // 如果 URL 或分类改变，检查新的 URL + 分类组合是否在目标分类中重复
        if (urlChanged || categoryChanged) {
          const isDuplicate = isDuplicateUrlInCategory(
            newUrl,
            newCategory,
            state.items,
            action.payload.id // 排除自身
          );

          if (isDuplicate) {
            state.error = `目标分类中已存在相同的 URL: ${newUrl}`;
            return;
          }
        }

        // 如果分类改变，将链接移到新分类的最后
        let newOrder = oldLink.order;
        if (categoryChanged) {
          // 找到新分类中所有链接的最大 order 值
          const linksInNewCategory = state.items.filter(
            (link) => link.category === newCategory && link.id !== action.payload.id
          );

          if (linksInNewCategory.length > 0) {
            const maxOrder = Math.max(...linksInNewCategory.map((link) => link.order));
            newOrder = maxOrder + 1;
          } else {
            // 如果新分类中没有其他链接，使用当前所有链接的最大 order + 1
            const maxOrder = Math.max(...state.items.map((link) => link.order));
            newOrder = maxOrder + 1;
          }
        }

        state.items[index] = {
          ...oldLink,
          ...action.payload,
          order: newOrder,
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
      const index = state.items.findIndex((link) => link.id === action.payload);
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

      if (
        fromIndex < 0 ||
        fromIndex >= state.items.length ||
        toIndex < 0 ||
        toIndex >= state.items.length
      ) {
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
      state.items = [...action.payload].sort((a, b) => a.order - b.order);
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
