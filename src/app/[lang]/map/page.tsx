import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { InteractiveMapClient } from '@/components/map/InteractiveMapClient';

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

  const title = `${dict.nav.map} — ${dict.common.siteName}`;
  const description = dict.hero.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}/map`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/map/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/map',
        'pt-BR': '/pt-br/map',
        es: '/es/map',
        'x-default': '/en/map',
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

export default async function MapPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';
  const dict = getDictionary(currentLang);

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-[#070b12] text-slate-100 overflow-hidden">
      <Header lang={currentLang} />
      <div className="flex-1 w-full relative overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
              <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
                {dict.common.loading}
              </span>
            </div>
          }
        >
          <InteractiveMapClient lang={currentLang} />
        </Suspense>
      </div>
    </div>
  );
}
