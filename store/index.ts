import { configureStore, Middleware } from '@reduxjs/toolkit';
import linksReducer from './slices/linksSlice';
import searchReducer from './slices/searchSlice';
import settingsReducer from './slices/settingsSlice';
import { storageService } from '@/services/storage';

/**
 * LocalStorage 同步中间件
 * 自动将 links 和 settings 的变化同步到 LocalStorage
 * 包含错误处理和用户反馈
 */
const localStorageSyncMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // 获取 action 的类型
  const actionType = (action as { type?: string }).type || '';
  
  // 如果是 links 相关的 action，同步 links 数据
  if (typeof actionType === 'string' && actionType.startsWith('links/')) {
    const state = store.getState();
    try {
      const saveResult = storageService.saveLinks(state.links.items);
      if (!saveResult.success) {
        console.error('Failed to sync links to LocalStorage:', saveResult.error);
        // 可以在这里触发一个全局错误通知
        // 但为了避免过多的提示，我们只记录到控制台
      }
    } catch (error) {
      console.error('Failed to sync links to LocalStorage:', error);
    }
  }
  
  // 如果是 settings 相关的 action，同步 settings 数据
  if (typeof actionType === 'string' && actionType.startsWith('settings/')) {
    const state = store.getState();
    try {
      // 提取纯设置数据（排除 loading 和 error）
      const { loading, error, ...settings } = state.settings;
      const saveResult = storageService.saveSettings(settings);
      if (!saveResult.success) {
        console.error('Failed to sync settings to LocalStorage:', saveResult.error);
      }
    } catch (error) {
      console.error('Failed to sync settings to LocalStorage:', error);
    }
  }
  
  return result;
};

/**
 * 配置 Redux Store
 */
export const store = configureStore({
  reducer: {
    links: linksReducer,
    search: searchReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略某些 action 的序列化检查（如果需要）
        ignoredActions: [],
        ignoredPaths: [],
      },
    }).concat(localStorageSyncMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * 从 LocalStorage 初始化 Store
 * 应该在应用启动时调用
 */
export const initializeStore = () => {
  // 加载 links
  const savedLinks = storageService.loadLinks();
  if (savedLinks && savedLinks.length > 0) {
    store.dispatch({ type: 'links/loadLinks', payload: savedLinks });
  }
  
  // 加载 settings
  const savedSettings = storageService.loadSettings();
  if (savedSettings) {
    store.dispatch({ type: 'settings/loadSettings', payload: savedSettings });
  }
};

/**
 * RootState 类型
 * 从 store 本身推断出 RootState 类型
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch 类型
 * 从 store 本身推断出 AppDispatch 类型
 */
export type AppDispatch = typeof store.dispatch;

/**
 * 默认导出 store
 */
export default store;
