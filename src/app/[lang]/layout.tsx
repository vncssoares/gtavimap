import type { Metadata, Viewport } from 'next';
import { Language } from '@/types';
import { ConsentBanner } from '@/components/common/ConsentBanner';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GTAVIMap — Interactive Map & Progress Tracker for GTA VI',
    template: '%s | GTAVIMap',
  },
  description:
    'Comprehensive interactive map for Grand Theft Auto VI (Leonida / Vice City). Track collectibles, discover rare vehicles, filter weapons, and follow your 100% completion.',
  keywords: [
    'GTA VI Map',
    'GTA 6 Interactive Map',
    'Vice City Map',
    'Leonida Map',
    'GTA VI Collectibles',
    'GTA VI Weapons',
    'GTA VI Vehicles',
    'Grand Theft Auto VI Guide',
  ],
  authors: [{ name: 'GTAVIMap Team' }],
  creator: 'GTAVIMap',
  publisher: 'GTAVIMap',
  metadataBase: new URL('https://gtavimap.com'),
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
  openGraph: {
    title: 'GTAVIMap — Interactive Map & Progress Tracker for GTA VI',
    description:
      'Explore Vice City and the state of Leonida. Filter locations, weapons, shops, and track your game progress.',
    url: 'https://gtavimap.com',
    siteName: 'GTAVIMap',
    images: [
      {
        url: '/en/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'GTAVIMap — Interactive Map for GTA VI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTAVIMap — Interactive Map for GTA VI',
    description: 'Track your progress across Vice City and Leonida with fluid interactive controls.',
    images: ['/en/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
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
      <body className="min-h-full flex flex-col bg-[#070b12] text-[#f1f5f9] antialiased selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
        {children}
        <ConsentBanner lang={langAttr as Language} />
      </body>
    </html>
  );
}
