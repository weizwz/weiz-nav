#!/bin/bash

# Cloudflare Workers 部署脚本（使用 OpenNext adapter）
# 用于快速部署到 Cloudflare Workers

set -e

echo "🚀 开始部署到 Cloudflare Workers..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装。请先安装 pnpm。"
    exit 1
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf .next out .open-next

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 运行 lint
echo "🔍 运行代码检查..."
pnpm lint

# 构建并部署（opennextjs-cloudflare 会自动调用 next build）
echo "🏗️  构建并部署到 Cloudflare Workers..."
pnpm deploy:cloudflare

echo ""
echo "🎉 部署完成！"
echo ""
echo "访问你的网站："
echo "  - 生产环境: https://nav.weizwz.com"
echo "  - 或你配置的自定义域名"
echo ""
echo "管理你的项目："
echo "  https://dash.cloudflare.com"
