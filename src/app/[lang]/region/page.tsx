import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Compass, ArrowRight, MapPin } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge';
import { MapCta } from '@/components/common/MapCta';
import { REGIONS } from '@/data/regions';

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

  const titles: Record<Language, string> = {
    'pt-BR': 'Regiões de Leonida — GTAVIMap',
    en: 'Regions of Leonida — GTAVIMap',
    es: 'Regiones de Leonida — GTAVIMap',
  };

  const descriptions: Record<Language, string> = {
    'pt-BR': 'Guia completo dos territórios de GTA VI: Vice City, Leonida Keys, pântanos de Grassrivers, Mount Kalaga, Port Gellhorn e Ambrosia com mapa interativo.',
    en: 'Complete guide to the territories of GTA VI: Vice City, Leonida Keys, Grassrivers wetlands, Mount Kalaga, Port Gellhorn, and Ambrosia on the map.',
    es: 'Guía completa de los territorios de GTA VI: Vice City, Leonida Keys, humedales de Grassrivers, Mount Kalaga, Port Gellhorn y Ambrosia en el mapa.',
  };

  const title = titles[currentLang];
  const description = descriptions[currentLang];
  const canonicalPath = `/${currentLang.toLowerCase()}/region`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/region',
        'pt-BR': '/pt-br/region',
        es: '/es/region',
        'x-default': '/en/region',
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

export default async function RegionHubPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const dict = getDictionary(currentLang);
  const langPrefix = `/${currentLang.toLowerCase()}`;
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Cabeçalho da Página com o único H1 */}
        <div className="space-y-2 border-b border-[#1b1c26] pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b1e2c] border border-[#2b3044] text-[11px] font-mono text-[#38f8ff] font-bold">
            <Compass size={13} className="text-[#38f8ff]" />
            <span className="uppercase tracking-wider">STATE OF LEONIDA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {dict.regionHub?.title || 'Regiões de Leonida'}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            {dict.regionHub?.subtitle ||
              'Explore os territórios confirmados, distritos metropolitanos e biomas selvagens do estado de Leonida.'}
          </p>
        </div>

        {/* Grade de 6 Cards Regionais estilizados 100% com CSS e Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONS.map((region) => {
            const subtitle = region.subtitle[currentLang] || region.subtitle.en;
            const description = region.description[currentLang] || region.description.en;
            const inspirationText =
              region.realWorldInspiration[currentLang] || region.realWorldInspiration.en;
            const hasInspiration = inspirationText && (!region.placeholder || !isProd);

            // Mapeamento do status de confirmação da inspiração para o ConfidenceBadge
            const confirmationStatus =
              region.inspirationConfidence === 'official' ? 'verified' : 'trailer_rumor';

            return (
              <div
                key={region.id}
                className="group relative rounded-2xl border border-[#222433] bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#090b10] p-6 flex flex-col justify-between overflow-hidden shadow-xl hover:border-[#38f8ff]/50 transition-all duration-300"
              >
                {/* Efeito de iluminação neon sutil de fundo baseado na cor da região */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                  style={{ backgroundColor: region.color }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Tag superior & Badge de Confiança */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${region.color}15`,
                        color: region.color,
                        borderColor: `${region.color}40`,
                      }}
                    >
                      {region.tag}
                    </span>

                    <ConfidenceBadge status={confirmationStatus} lang={currentLang} />
                  </div>

                  {/* Nome da Região & Subtítulo */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-white transition-colors">
                      {region.name}
                    </h2>
                    <p className="text-xs font-mono text-[#38f8ff]">{subtitle}</p>
                  </div>

                  {/* Descrição territorial */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {description}
                  </p>

                  {/* Bloco de Inspiração Real */}
                  <div className="pt-3 border-t border-[#1e2230] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                      {dict.regionHub?.realInspirationLabel || 'Inspiração Real'}:
                    </span>
                    {hasInspiration ? (
                      <p className="text-xs font-semibold text-slate-200">
                        {inspirationText}
                      </p>
                    ) : (
                      <p className="text-xs font-mono text-slate-400 italic">
                        {dict.regionHub?.unconfirmedInspiration ||
                          'Aguardando confirmação oficial'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações inferiores: Link para a página da região e deep link do mapa */}
                <div className="pt-6 mt-6 border-t border-[#1e2230] flex items-center justify-between gap-2 relative z-10">
                  <Link
                    href={`${langPrefix}/region/${region.id}`}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161a26] hover:bg-[#202538] text-white border border-[#2b3046] hover:border-[#38f8ff] text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                  >
                    <span>{dict.regionHub?.viewRegion || 'Explorar Região'}</span>
                    <ArrowRight size={13} className="shrink-0" />
                  </Link>

                  <Link
                    href={`${langPrefix}/map?r=${region.id}`}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-[#ff2a85] text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                    title={`${dict.regionHub?.viewOnMap || 'Ver no Mapa'}: ${region.name}`}
                  >
                    <MapPin size={13} className="shrink-0 text-[#ff2a85]" />
                    <span className="hidden sm:inline">
                      {dict.regionHub?.viewOnMap || 'Ver no Mapa'}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map CTA ao final do Hub */}
        <section className="pt-4">
          <MapCta lang={currentLang} />
        </section>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
