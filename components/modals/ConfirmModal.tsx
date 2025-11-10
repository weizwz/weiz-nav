'use client';

import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
  onOk: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * 可复用的确认对话框组件
 * 用于删除链接、重置数据等需要二次确认的操作
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = '确认操作',
  content = '确定要执行此操作吗？',
  okText = '确定',
  cancelText = '取消',
  okType = 'primary',
  onOk,
  onCancel,
  loading = false,
  icon,
}) => {
  const handleOk = async () => {
    await onOk();
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon || <ExclamationCircleOutlined style={{ color: '#faad14' }} />}
          <span>{title}</span>
        </div>
      }
      onOk={handleOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: okType === 'danger', loading }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
    >
      {typeof content === 'string' ? <p>{content}</p> : content}
    </Modal>
  );
};

export default ConfirmModal;
