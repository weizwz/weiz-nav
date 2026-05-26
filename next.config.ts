import type { NextConfig } from 'next';
import pkg from './package.json';

// 自动更新版本号已移至 prebuild 脚本
// updateVersion();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicon.im',
        pathname: '/**',
      },
    ],
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

  // Turbopack 配置（Next.js 16 默认启用）
  // 空配置用于明确声明使用 Turbopack，避免与 webpack 配置冲突的警告
  turbopack: {},
};

export default nextConfig;

// 本地开发时集成 Cloudflare bindings
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}
