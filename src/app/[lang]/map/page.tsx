import React from 'react';
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

  return {
    title: `${dict.nav.map} — ${dict.common.siteName}`,
    description: dict.hero.subtitle,
    alternates: {
      canonical: `/${currentLang.toLowerCase()}/map`,
      languages: {
        en: '/en/map',
        'pt-BR': '/pt-br/map',
        es: '/es/map',
      },
    },
    openGraph: {
      title: `${dict.nav.map} — ${dict.common.siteName}`,
      description: dict.hero.subtitle,
      url: `https://gtavimap.com/${currentLang.toLowerCase()}/map`,
      siteName: 'GTAVIMap',
      locale: currentLang === 'pt-BR' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function MapPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-[#070b12] text-slate-100 overflow-hidden">
      <Header lang={currentLang} />
      <div className="flex-1 w-full relative overflow-hidden">
        <InteractiveMapClient lang={currentLang} />
      </div>
    </div>
  );
}
