#!/bin/bash

# Cloudflare Pages 部署脚本
# 用于快速部署到 Cloudflare Pages

set -e

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装。请先安装 pnpm。"
    exit 1
fi

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler CLI 未安装。正在安装..."
    npm install -g wrangler
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf out .next

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 运行 lint
echo "🔍 运行代码检查..."
pnpm lint

# 构建项目
echo "🏗️  构建项目..."
pnpm build

# 检查构建是否成功
if [ -d "out" ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "📊 构建统计："
    echo "   文件总数: $(find out -type f | wc -l | tr -d ' ')"
    echo "   总大小: $(du -sh out | cut -f1)"
    echo ""
else
    echo "❌ 构建失败！请检查上面的错误信息。"
    exit 1
fi

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
wrangler pages deploy out --project-name=weiz-nav

echo ""
echo "🎉 部署完成！"
echo ""
echo "访问你的网站："
echo "  - 生产环境: https://nav.weizwz.com"
echo "  - 或你配置的自定义域名"
echo ""
echo "管理你的项目："
echo "  https://dash.cloudflare.com"
