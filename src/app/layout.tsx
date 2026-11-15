import type { Metadata, Viewport } from 'next';
import './globals.css';

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
        url: '/map/leonida-demo-map.svg',
        width: 1200,
        height: 630,
        alt: 'GTAVIMap Interactive Cartography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTAVIMap — Interactive Map for GTA VI',
    description: 'Track your progress across Vice City and Leonida with fluid interactive controls.',
    images: ['/map/leonida-demo-map.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#070b12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-[#070b12] text-[#f1f5f9] antialiased selection:bg-[#00ff66]/30 selection:text-[#00ff66]">
        {children}
      </body>
    </html>
  );
}
