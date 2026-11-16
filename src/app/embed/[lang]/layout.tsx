import React from 'react';
import { Metadata, Viewport } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#070b12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt-br' }, { lang: 'es' }];
}

interface EmbedLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function EmbedLayout({ children, params }: EmbedLayoutProps) {
  const { lang } = await params;
  const langAttr =
    lang?.toLowerCase() === 'pt-br'
      ? 'pt-BR'
      : lang?.toLowerCase() === 'es'
      ? 'es'
      : 'en';

  return (
    <html lang={langAttr} className="dark h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full w-full overflow-hidden bg-[#070b12] text-[#f1f5f9] antialiased m-0 p-0">
        {children}
      </body>
    </html>
  );
}
