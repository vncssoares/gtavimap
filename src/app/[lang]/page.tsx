import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { HomeHero } from '@/components/home/HomeHero';
import { LaunchCountdown, LaunchCountdownFallback } from '@/components/home/LaunchCountdown';
import { HomeMapPreview } from '@/components/home/HomeMapPreview';
import { RegionsGrid } from '@/components/home/RegionsGrid';
import { FeatureZigzag } from '@/components/home/FeatureZigzag';
import { YouTubeFacade } from '@/components/home/YouTubeFacade';
import { NewsAndChangelog } from '@/components/home/NewsAndChangelog';
import { FeaturesAndFaq } from '@/components/home/FeaturesAndFaq';

export const instant = false;

interface PageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt-br' }, { lang: 'es' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const dict = getDictionary(currentLang);

  const title = `${dict.common.siteName} — ${dict.hero.title}`;
  const description = dict.hero.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en',
        'pt-BR': '/pt-br',
        es: '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://gtavimap.com${canonicalPath}`,
      siteName: 'GTAVIMap',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: currentLang === 'pt-BR' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'GTAVIMap',
      url: `https://gtavimap.com/${normalizedLang}`,
      description: dict.hero.subtitle,
      inLanguage: currentLang === 'pt-BR' ? 'pt-BR' : currentLang === 'es' ? 'es' : 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'GTAVIMap — Interactive Map & Progress Tracker',
      url: `https://gtavimap.com/${normalizedLang}/map`,
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description: dict.common.tagline,
      inLanguage: currentLang === 'pt-BR' ? 'pt-BR' : currentLang === 'es' ? 'es' : 'en',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b10] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      {/* Structured Data (WebSite & WebApplication) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Header lang={currentLang} />

      <main className="flex-1">
        {/* Compact Hero Section */}
        <HomeHero lang={currentLang} />

        {/* Countdown to Launch */}
        <div className="px-4 -mt-6 sm:-mt-8 relative z-20">
          <Suspense fallback={<LaunchCountdownFallback lang={currentLang} />}>
            <LaunchCountdown lang={currentLang} />
          </Suspense>
        </div>

        {/* Centerpiece Interactive Map Preview */}
        <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[420px] max-h-[680px] rounded-2xl bg-[#0c0e15] border-2 border-[#24283b] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <HomeMapPreview lang={currentLang} />
          </Suspense>
        </section>

        {/* Featured Leonida Regions Grid */}
        <RegionsGrid lang={currentLang} />

        {/* Gameplay & Mechanics Alternating Feature Zigzag */}
        <FeatureZigzag lang={currentLang} />

        {/* Official YouTube Trailer Facade */}
        <YouTubeFacade lang={currentLang} />

        {/* Official Game News & Site Changelog */}
        <NewsAndChangelog lang={currentLang} />

        {/* Features, Free vs PRO, Visible FAQs and Legal Disclaimer */}
        <FeaturesAndFaq lang={currentLang} />
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
