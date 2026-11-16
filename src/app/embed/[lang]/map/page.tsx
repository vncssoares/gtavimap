import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { EmbedMapClient } from '@/components/embed/EmbedMapClient';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt-br' }, { lang: 'es' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);

  return {
    title: `${dict.nav.map} (Embed) — ${dict.common.siteName}`,
    description: dict.hero.subtitle,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `/${normalizedLang}/map`,
    },
  };
}

export default async function EmbedMapPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  return (
    <div className="w-full h-full h-[100dvh] overflow-hidden bg-[#070b12]">
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
            <div className="w-9 h-9 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
              Loading Embed Map...
            </span>
          </div>
        }
      >
        <EmbedMapClient lang={currentLang} />
      </Suspense>
    </div>
  );
}
