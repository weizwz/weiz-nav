'use client';

import React, { useState } from 'react';
import { Input, Popover, Tabs } from 'antd';
import * as Icons from '@ant-design/icons';

/**
 * 常用图标列表 - 按分类组织
 */
const ICON_CATEGORIES = {
  常用: [
    'HomeOutlined', 'AppstoreOutlined', 'SettingOutlined', 'UserOutlined', 'TeamOutlined',
    'StarOutlined', 'HeartOutlined', 'LikeOutlined', 'FireOutlined', 'ThunderboltOutlined',
    'FileOutlined', 'FolderOutlined', 'BookOutlined', 'ReadOutlined', 'TagOutlined',
    'ShoppingCartOutlined', 'ShopOutlined', 'CrownOutlined', 'TrophyOutlined', 'GiftOutlined',
    'ToolOutlined', 'BuildOutlined', 'RocketOutlined', 'BulbOutlined', 'ExperimentOutlined',
    'PlayCircleOutlined', 'CustomerServiceOutlined', 'VideoCameraOutlined', 'PictureOutlined', 'CameraOutlined',
  ],
  办公: [
    'FileTextOutlined', 'FilePdfOutlined', 'FileWordOutlined', 'FileExcelOutlined', 'FilePptOutlined',
    'CopyOutlined', 'SnippetsOutlined', 'AuditOutlined', 'ScheduleOutlined', 'EditOutlined',
    'FormOutlined', 'SaveOutlined', 'UploadOutlined', 'DownloadOutlined', 'PrinterOutlined',
    'BarChartOutlined', 'LineChartOutlined', 'PieChartOutlined', 'FundOutlined', 'StockOutlined',
    'MailOutlined', 'MessageOutlined', 'PhoneOutlined', 'ContactsOutlined', 'CalendarOutlined',
    'ClockCircleOutlined', 'EnvironmentOutlined', 'CompassOutlined', 'PushpinOutlined', 'FlagOutlined',
  ],
  技术: [
    'CodeOutlined', 'BugOutlined', 'ApiOutlined', 'DatabaseOutlined', 'CloudServerOutlined',
    'LaptopOutlined', 'DesktopOutlined', 'MobileOutlined', 'TabletOutlined', 'HddOutlined',
    'GlobalOutlined', 'WifiOutlined', 'CloudOutlined', 'LinkOutlined', 'ShareAltOutlined',
    'GithubOutlined', 'GitlabOutlined', 'ChromeOutlined', 'Html5Outlined', 'AndroidOutlined',
    'AppleOutlined', 'WindowsOutlined', 'LinuxOutlined', 'UsbOutlined', 'ScanOutlined',
    'DashboardOutlined', 'ControlOutlined', 'MonitorOutlined', 'SecurityScanOutlined', 'SafetyOutlined',
  ],
  其他: [
    'ShoppingOutlined', 'DollarOutlined', 'PayCircleOutlined', 'CreditCardOutlined', 'WalletOutlined',
    'BankOutlined', 'AccountBookOutlined', 'PropertySafetyOutlined', 'InsuranceOutlined', 'MoneyCollectOutlined',
    'ShopOutlined', 'AppstoreAddOutlined', 'CarOutlined', 'RocketOutlined', 'TrophyOutlined',
    'TeamOutlined', 'SolutionOutlined', 'IdcardOutlined', 'ProfileOutlined', 'ProjectOutlined',
    'ReconciliationOutlined', 'ContainerOutlined', 'CarryOutOutlined', 'AuditOutlined', 'FileDoneOutlined',
  ],
};

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 图标选择器组件
 */
export const IconPicker: React.FC<IconPickerProps> = ({ value = 'AppstoreOutlined', onChange }) => {
  const [open, setOpen] = useState(false);

  const handleIconSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
  };

  // 渲染图标
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const content = (
    <div className="w-[420px]">
      <Tabs
        size="small"
        items={Object.entries(ICON_CATEGORIES).map(([category, icons]) => ({
          key: category,
          label: category,
          children: (
            <div className="h-36 overflow-y-auto">
              <div className="grid grid-cols-10 gap-1 p-2">
                {icons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    className="w-9 h-9 flex items-center justify-center text-base hover:bg-blue-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors border border-transparent hover:border-blue-400"
                    onClick={() => handleIconSelect(iconName)}
                    title={iconName}
                  >
                    {renderIcon(iconName)}
                  </button>
                ))}
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      title="选择图标"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      <Input
        value={value}
        readOnly
        placeholder="点击选择图标"
        prefix={<span className="text-lg">{renderIcon(value)}</span>}
        className="cursor-pointer"
      />
    </Popover>
  );
};
