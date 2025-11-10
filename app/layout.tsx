import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '前端导航网站',
  description: '现代化的个人前端导航网站',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}
