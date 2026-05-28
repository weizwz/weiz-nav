import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Link } from '@weiz-nav/core';
import { searchLinks } from '@weiz-nav/core/search';
import { debounce } from '@weiz-nav/core/utils/debounce';
import type { AppDispatch, RootState } from '../index';

/**
 * Search 状态接口
 */
interface SearchState {
  /** 搜索关键词 */
  query: string;
  /** 搜索结果 */
  results: Link[];
  /** 是否正在搜索 */
  isSearching: boolean;
}

/**
 * 初始状态
 */
const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
};

/**
 * Search Slice
 * 管理搜索状态
 */
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * 设置搜索关键词
     */
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.isSearching = action.payload.length > 0;
    },

    /**
     * 设置搜索结果
     */
    setResults: (state, action: PayloadAction<Link[]>) => {
      state.results = action.payload;
    },

    /**
     * 清除搜索
     */
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.isSearching = false;
    },

    /**
     * 设置搜索状态
     */
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
  },
});

/**
 * 导出 actions
 */
export const {
  setQuery,
  setResults,
  clearSearch,
  setSearching,
} = searchSlice.actions;

/**
 * 防抖搜索函数（300ms 延迟）
 * 内部实现，用于延迟执行搜索
 */
const debouncedSearchImpl = debounce((
  dispatch: AppDispatch,
  getState: () => RootState,
  query: string
) => {
  const state = getState();
  const links = state.links.items;
  
  // 执行搜索
  const results = searchLinks(links, query);
  
  // 更新搜索结果
  dispatch(setResults(results));
  dispatch(setSearching(false));
}, 300);

/**
 * 执行防抖搜索
 * Thunk action，带 300ms 防抖延迟
 * 
 * @param query - 搜索关键词
 */
export const performDebouncedSearch = (query: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    // 立即更新查询和搜索状态
    dispatch(setQuery(query));
    
    // 如果查询为空，立即清除结果
    if (!query.trim()) {
      dispatch(setResults([]));
      dispatch(setSearching(false));
      return;
    }
    
    // 设置搜索中状态
    dispatch(setSearching(true));
    
    // 执行防抖搜索
    debouncedSearchImpl(dispatch, getState, query);
  };
};

/**
 * 立即执行搜索（不防抖）
 * 用于需要立即获取结果的场景
 * 
 * @param query - 搜索关键词
 */
export const performImmediateSearch = (query: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setQuery(query));
    
    if (!query.trim()) {
      dispatch(setResults([]));
      dispatch(setSearching(false));
      return;
    }
    
    dispatch(setSearching(true));
    
    const state = getState();
    const links = state.links.items;
    const results = searchLinks(links, query);
    
    dispatch(setResults(results));
    dispatch(setSearching(false));
  };
};

/**
 * 导出 reducer
 */
export default searchSlice.reducer;
