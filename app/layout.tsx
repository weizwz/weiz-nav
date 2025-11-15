import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: '唯知导航',
  description: '现代化的个人前端导航网站',
  keywords: ['导航', '开发工具', '资源导航', 'weizwz', '唯知为之'],
  authors: [{ name: ' weizwz' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon-128.ico', sizes: '128x128', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-128.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          跳转到主内容
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
