import { message } from 'antd';

/**
 * 用户反馈工具函数
 * 封装 Ant Design message 组件，提供统一的用户反馈接口
 */

/**
 * 显示成功消息
 */
export const showSuccess = (content: string, duration: number = 2) => {
  message.success(content, duration);
};

/**
 * 显示错误消息
 */
export const showError = (content: string, duration: number = 3) => {
  message.error(content, duration);
};

/**
 * 显示警告消息
 */
export const showWarning = (content: string, duration: number = 3) => {
  message.warning(content, duration);
};

/**
 * 显示信息消息
 */
export const showInfo = (content: string, duration: number = 2) => {
  message.info(content, duration);
};

/**
 * 显示加载中消息
 * @returns 关闭函数
 */
export const showLoading = (content: string = '加载中...') => {
  return message.loading(content, 0);
};

/**
 * 销毁所有消息
 */
export const destroyAllMessages = () => {
  message.destroy();
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
