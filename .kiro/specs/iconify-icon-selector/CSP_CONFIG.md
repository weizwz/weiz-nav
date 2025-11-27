# Iconify 功能的 CSP 配置说明

## 概述

为了使 Iconify 图标选择功能正常工作，需要在 Content Security Policy (CSP) 中允许从 `api.iconify.design` 加载资源。

## 所需的 CSP 指令

### 1. connect-src

允许 JavaScript 代码连接到 Iconify API：

```
connect-src 'self' https://api.iconify.design;
```

### 2. img-src

允许加载 Iconify 图标图片：

```
img-src 'self' data: https://api.iconify.design https://favicon.im;
```

## 完整的 CSP 配置示例

### 方式 1: 在 Next.js 中间件中配置

创建或修改 `middleware.ts` 文件：

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 设置 CSP 头
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://api.iconify.design https://favicon.im",
      "connect-src 'self' https://api.iconify.design",
      "font-src 'self' data:",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 方式 2: 在 next.config.ts 中配置

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://api.iconify.design https://favicon.im",
              "connect-src 'self' https://api.iconify.design",
              "font-src 'self' data:",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // ... 其他配置
};
```

### 方式 3: 在 HTML meta 标签中配置

在 `app/layout.tsx` 中添加：

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.iconify.design https://favicon.im; connect-src 'self' https://api.iconify.design; font-src 'self' data:;"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 静态导出项目的特殊说明

由于本项目使用 `output: 'export'` 进行静态导出，CSP 配置需要在部署时由 Web 服务器（如 Nginx、Apache）或 CDN（如 Cloudflare、Vercel）设置。

### Nginx 配置示例

```nginx
location / {
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.iconify.design https://favicon.im; connect-src 'self' https://api.iconify.design; font-src 'self' data:;" always;
}
```

### Cloudflare Workers 配置示例

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  newResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.iconify.design https://favicon.im; connect-src 'self' https://api.iconify.design; font-src 'self' data:;"
  )
  
  return newResponse
}
```

### Vercel 配置示例

在 `vercel.json` 中添加：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.iconify.design https://favicon.im; connect-src 'self' https://api.iconify.design; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

## 验证 CSP 配置

### 1. 使用浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 切换到"网络"（Network）标签
3. 刷新页面
4. 查看响应头中的 `Content-Security-Policy`

### 2. 测试 Iconify 功能

1. 打开编辑链接对话框
2. 选择"Iconify图标"
3. 搜索图标
4. 如果能正常显示搜索结果，说明 CSP 配置正确

### 3. 检查控制台错误

如果 CSP 配置不正确，浏览器控制台会显示类似以下的错误：

```
Refused to connect to 'https://api.iconify.design/...' because it violates the following Content Security Policy directive: "connect-src 'self'"
```

或

```
Refused to load the image 'https://api.iconify.design/...' because it violates the following Content Security Policy directive: "img-src 'self'"
```

## 安全考虑

### 为什么需要允许 api.iconify.design？

- Iconify API 是一个可信的第三方服务
- 提供开源图标的 CDN 服务
- 使用 HTTPS 加密传输
- 不会执行任何脚本，只提供图标数据

### 最小权限原则

建议的 CSP 配置遵循最小权限原则：

- 只允许必需的域名
- 只允许必需的资源类型
- 不允许不安全的内联脚本（除非必要）

### 替代方案

如果出于安全考虑不能允许外部 API 访问，可以考虑：

1. **自建 Iconify API 服务**
   - 部署自己的 Iconify API 实例
   - 更新 `NEXT_PUBLIC_API_ICONIFY_URL` 环境变量

2. **使用本地图标库**
   - 下载常用图标到项目中
   - 使用"自定义图标"功能上传本地图标

3. **禁用 Iconify 功能**
   - 只使用 Favicon 和自定义图标功能
   - 不需要修改 CSP 配置

## 故障排查

### 问题：图标搜索失败

**检查步骤：**

1. 打开浏览器控制台
2. 查看是否有 CSP 相关错误
3. 检查网络请求是否被阻止
4. 验证 CSP 配置是否包含 `api.iconify.design`

### 问题：图标无法显示

**检查步骤：**

1. 检查 `img-src` 指令是否包含 `https://api.iconify.design`
2. 查看浏览器控制台的错误信息
3. 验证图标 URL 是否正确

## 更多资源

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Iconify API 文档](https://iconify.design/docs/api/)
