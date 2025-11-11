import { App } from 'antd';

/**
 * 用户反馈工具函数
 * 封装 Ant Design message 组件，提供统一的用户反馈接口
 * 
 * 注意：这些函数需要在 App 组件的上下文中使用
 * 如果在组件外使用，请使用 useMessage hook
 */

// 全局 message 实例（通过 App.useApp() 获取）
let messageApi: ReturnType<typeof App.useApp>['message'] | null = null;

/**
 * 设置全局 message 实例
 * 此函数应该在应用初始化时调用
 */
export const setMessageApi = (api: ReturnType<typeof App.useApp>['message']) => {
  messageApi = api;
};

/**
 * 获取 message 实例
 * 如果未设置，返回一个空操作的 fallback
 */
const getMessageApi = () => {
  if (!messageApi) {
    console.warn('Message API not initialized. Please use MessageProvider or call setMessageApi.');
    // 返回一个 fallback，避免应用崩溃
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      loading: () => () => {},
      destroy: () => {},
    };
  }
  return messageApi;
};

/**
 * 显示成功消息
 */
export const showSuccess = (content: string, duration: number = 2) => {
  getMessageApi().success(content, duration);
};

/**
 * 显示错误消息
 */
export const showError = (content: string, duration: number = 3) => {
  getMessageApi().error(content, duration);
};

/**
 * 显示警告消息
 */
export const showWarning = (content: string, duration: number = 3) => {
  getMessageApi().warning(content, duration);
};

/**
 * 显示信息消息
 */
export const showInfo = (content: string, duration: number = 2) => {
  getMessageApi().info(content, duration);
};

/**
 * 显示加载中消息
 * @returns 关闭函数
 */
export const showLoading = (content: string = '加载中...') => {
  return getMessageApi().loading(content, 0);
};

/**
 * 销毁所有消息
 */
export const destroyAllMessages = () => {
  getMessageApi().destroy();
};

/**
 * 处理操作结果并显示相应的反馈
 */
export const handleOperationResult = (
  result: { success: boolean; error?: string },
  successMessage: string,
  errorPrefix: string = '操作失败'
) => {
  if (result.success) {
    showSuccess(successMessage);
  } else {
    showError(result.error || errorPrefix);
  }
};

/**
 * 处理异步操作并显示反馈
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  successMessage: string,
  errorMessage: string = '操作失败，请重试'
): Promise<T | null> => {
  const hide = showLoading();
  try {
    const result = await operation();
    hide();
    showSuccess(successMessage);
    return result;
  } catch (error) {
    hide();
    console.error('Async operation failed:', error);
    showError(error instanceof Error ? error.message : errorMessage);
    return null;
  }
};
