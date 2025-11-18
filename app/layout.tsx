import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: {
    default: '唯知导航',
    template: '%s | 唯知导航',
  },
  description: '现代化的个人前端导航网站，提供开发工具、资源导航等功能',
  keywords: ['导航', '开发工具', '资源导航', 'weizwz', '唯知为之', '前端导航', '开发者工具'],
  authors: [{ name: 'weizwz', url: 'https://github.com/weizwz' }],
  creator: 'weizwz',
  publisher: 'weizwz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon-128.ico', sizes: '128x128', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-128.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://nav.weizwz.com',
    title: '唯知导航',
    description: '现代化的个人前端导航网站',
    siteName: '唯知导航',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: '唯知导航 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '唯知导航',
    description: '现代化的个人前端导航网站',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://nav.weizwz.com',
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
