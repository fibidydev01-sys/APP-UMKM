import type { Metadata } from 'next';
// Temporarily disabled due to Google Fonts fetch issues in build environment
// import { Inter } from 'next/font/google';
import { Providers } from '@umkm/shared';
import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fibidy - Discover UMKM',
  description: 'Discover local businesses and products from UMKM across Indonesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
