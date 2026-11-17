import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Compass,
  ArrowLeft,
  MapPin,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge';
import { SourceLine } from '@/components/common/SourceLine';
import { MapCta } from '@/components/common/MapCta';
import { REGIONS, getRegionById } from '@/data/regions';
import { getVerifiedMarkersByRegion, isRegionIndexable } from '@/data/seoSelectors';

export const instant = false;

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export function generateStaticParams() {
  const languages = ['en', 'pt-br', 'es'];
  const paramsList: { lang: string; id: string }[] = [];

  for (const lang of languages) {
    for (const region of REGIONS) {
      paramsList.push({ lang, id: region.id });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const region = getRegionById(id);

  if (!region) {
    return { title: 'Region Not Found — GTAVIMap' };
  }

  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const regionName = region.name;
  const canonicalPath = `/${currentLang.toLowerCase()}/region/${region.id}`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  // Títulos concisos dentro da faixa de 20 a 65 caracteres
  const titles: Record<Language, string> = {
    'pt-BR': `${regionName} — Regiões de Leonida | GTAVIMap`,
    en: `${regionName} — Regions of Leonida | GTAVIMap`,
    es: `${regionName} — Regiones de Leonida | GTAVIMap`,
  };

  // Descrições informativas dentro da faixa de 70 a 170 caracteres
  const descriptions: Record<Language, string> = {
    'pt-BR': `Explore o território de ${regionName} em GTA VI: fronteiras geográficas, inspiração real, pontos de interesse e coordenadas no mapa interativo de Leonida.`,
    en: `Explore the territory of ${regionName} in GTA VI: geographic boundaries, real-world setting, verified points of interest, and interactive map coordinates.`,
    es: `Explora el territorio de ${regionName} en GTA VI: límites geográficos, inspiración real, puntos de interés verificados y coordenadas interactivas de Leonida.`,
  };

  const title = titles[currentLang];
  const description = descriptions[currentLang];

  // Regra de Conteúdo Fino: se a região tiver menos que REGION_MIN_VERIFIED marcadores, aplica noindex
  const isIndexable = isRegionIndexable(region.id);

  return {
    title,
    description,
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : {
          index: false,
          follow: true,
        },
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/region/${region.id}`,
        'pt-BR': `/pt-br/region/${region.id}`,
        es: `/es/region/${region.id}`,
        'x-default': `/en/region/${region.id}`,
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

export default async function RegionDetailPage({ params }: PageProps) {
  const { lang, id } = await params;
  const region = getRegionById(id);

  if (!region) {
    notFound();
  }

  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const isProd = process.env.NODE_ENV === 'production';

  const subtitle = region.subtitle[currentLang] || region.subtitle.en;
  const description = region.description[currentLang] || region.description.en;
  const inspirationText =
    region.realWorldInspiration[currentLang] || region.realWorldInspiration.en;
  const summaryText = region.summary[currentLang] || region.summary.en;

  // Marcadores verificados da região
  const verifiedMarkers = getVerifiedMarkersByRegion(region.id);

  // Mapeamento de status de confirmação
  const confirmationStatus =
    region.inspirationConfidence === 'official' ? 'verified' : 'trailer_rumor';

  // Montagem da lista de fontes para SourceLine
  const sources = region.officialSourceUrl
    ? [
        {
          label:
            region.inspirationConfidence === 'official'
              ? 'Rockstar Games Official'
              : 'Community Mapping Analysis',
          url: region.officialSourceUrl,
        },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Breadcrumb / Voltar ao Hub */}
        <div>
          <Link
            href={`/${normalizedLang}/region`}
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono font-bold text-slate-400 hover:text-[#38f8ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <ArrowLeft size={14} />
            <span>{dict.regionDetail?.backToRegions || 'Todas as Regiões'}</span>
          </Link>
        </div>

        {/* Cabeçalho da Região com o único H1 */}
        <div className="relative rounded-3xl border border-[#222433] bg-gradient-to-br from-[#12141f] via-[#0e1017] to-[#08090e] p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Efeito Glow Neon decorativo */}
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: region.color }}
          />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border"
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

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {region.name}
              </h1>
              <p className="text-sm sm:text-base font-mono text-[#38f8ff]">
                {subtitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {description}
            </p>

            {/* Linha com limites de coordenadas cartográficas */}
            <div className="pt-4 border-t border-[#1e2230] flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Compass size={14} className="text-[#38f8ff]" />
                <span>
                  Bounds: [{region.bounds[0].join(', ')}] — [{region.bounds[1].join(', ')}]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEÇÃO: INSPIRAÇÃO GEOGRÁFICA REAL ================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#ff2a85]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              {dict.regionDetail?.realInspiration || 'Inspiração Geográfica Real'}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#222433] bg-[#0e1017] p-5 sm:p-6 space-y-3">
            {inspirationText && (!region.placeholder || !isProd) ? (
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {inspirationText}
                </p>
                <div className="flex items-center gap-2">
                  <ConfidenceBadge status={confirmationStatus} lang={currentLang} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 italic">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span>
                  {dict.regionHub?.unconfirmedInspiration ||
                    'Aguardando confirmação oficial'}
                </span>
                {region.placeholder && !isProd && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold not-italic">
                    PLACEHOLDER (DEV)
                  </span>
                )}
              </div>
            )}

            {/* Linha de Fontes oficiais */}
            {sources.length > 0 && (
              <SourceLine sources={sources} lang={currentLang} />
            )}
          </div>
        </section>

        {/* ================= SEÇÃO: VISÃO GERAL E CENÁRIO (SUMMARY) ================= */}
        {summaryText && (!region.placeholder || !isProd) ? (
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              {dict.regionDetail?.summaryTitle || 'Visão Geral e Cenário Regional'}
            </h2>
            <div className="rounded-2xl border border-[#222433] bg-[#0e1017] p-5 sm:p-6 text-sm text-slate-300 leading-relaxed">
              <p>{summaryText}</p>
            </div>
          </section>
        ) : region.placeholder && !isProd ? (
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              {dict.regionDetail?.summaryTitle || 'Visão Geral e Cenário Regional'}
            </h2>
            <div className="rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-4 text-xs font-mono text-amber-300/80 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-amber-400" />
              <span>
                {dict.regionDetail?.placeholderNotice ||
                  'A visão geral regional está em verificação editorial e será publicada após confirmação oficial.'}
              </span>
            </div>
          </section>
        ) : null}

        {/* ================= SEÇÃO: MARCADORES VERIFICADOS ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#10b981]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                {dict.regionDetail?.verifiedMarkersTitle || 'Localizações Verificadas no Jogo'}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              ({verifiedMarkers.length})
            </span>
          </div>

          {verifiedMarkers.length === 0 ? (
            <div className="rounded-2xl border border-[#222433] bg-[#0e1017] p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-300">
                {dict.regionDetail?.emptyVerified || 'Localizações verificadas em breve'}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {dict.regionDetail?.emptyVerifiedDesc ||
                  'Pontos de interesse deste território estão em processo de verificação manual no jogo.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="rounded-xl border border-[#222433] bg-[#0e1017] p-4 space-y-2 hover:border-[#38f8ff]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{marker.name}</h3>
                    <ConfidenceBadge status={marker.confirmationStatus} lang={currentLang} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {marker.description[currentLang] || marker.description.en}
                  </p>
                  <Link
                    href={`/${normalizedLang}/map?r=${region.id}&m=${marker.id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#38f8ff] hover:text-white transition-colors pt-1"
                  >
                    <span>Ver Ponto no Mapa</span>
                    <MapPin size={11} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= MAP CTA ENQUADRADO NA REGIÃO (?r=<regionId>) ================= */}
        <section className="pt-4">
          <MapCta
            lang={currentLang}
            r={region.id}
            title={`${dict.regionDetail?.openInMap || 'Abrir Região no Mapa'}: ${region.name}`}
            subtitle={description}
          />
        </section>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
