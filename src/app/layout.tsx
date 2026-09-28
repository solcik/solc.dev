import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';

import { themeBootstrap } from '@/component/theme';

import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'wdth'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://solc.dev'),
  title: 'solc.dev',
  description: 'David Šolc — developer. Code, links and ways to get in touch.',
  authors: [{ name: 'David Šolc', url: 'https://solc.dev' }],
  openGraph: {
    title: 'solc.dev',
    description: 'David Šolc — developer.',
    url: 'https://solc.dev',
    siteName: 'solc.dev',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e16' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={display.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
