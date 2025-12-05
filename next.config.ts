import type { NextConfig } from 'next';
import { updateVersion } from './scripts/update-version';

import pkg from './package.json';

// 自动更新版本号
updateVersion();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  // 启用静态导出
  output: 'export',

  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出需要
  },

  // URL 配置
  trailingSlash: true,

  // 编译优化
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['antd', '@ant-design/icons', 'framer-motion'],
  },

  // 压缩配置
  compress: true,

  // 生产环境源码映射（可选，用于调试）
  productionBrowserSourceMaps: false,

  // 严格模式
  reactStrictMode: true,

  // 性能指标
  poweredByHeader: false, // 移除 X-Powered-By 头
};

export default nextConfig;
