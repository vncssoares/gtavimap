import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Gamepad2, Globe, AlertCircle, ShieldCheck, Users, ArrowLeft } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary, formatReviewDate } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SourceLine } from '@/components/common/SourceLine';
import { MapCta } from '@/components/common/MapCta';
import { TimestampedHighlights } from '@/components/common/TimestampedHighlights';
import { getNewsItems, LAST_REVIEWED_NEWS_ISO } from '@/data/news';

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
  const title = `${dict.newsSection.pageTitle} — GTAVIMap`;
  const description = dict.newsSection.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}/news`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/news',
        'pt-BR': '/pt-br/news',
        es: '/es/news',
        'x-default': '/en/news',
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

function formatNewsDate(isoDate: string, lang: Language): string {
  try {
    const date = new Date(isoDate);
    const locale = lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoDate;
  }
}

export default async function NewsPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const rawItems = getNewsItems();

  // Linha do tempo ordenada por data decrescente
  const items = [...rawItems].sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  const formattedReviewDate = formatReviewDate(LAST_REVIEWED_NEWS_ISO, currentLang);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b10] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-12">
        {/* Breadcrumb / Botão Voltar */}
        <div>
          <Link
            href={`/${normalizedLang}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono font-bold text-slate-400 hover:text-[#38f8ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <ArrowLeft size={14} />
            <span>{dict.common.backToHome}</span>
          </Link>
        </div>

        {/* Cabeçalho da Página com o único H1 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#222433]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4d9e]">
                GTAVIMAP LOGS & NEWS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {dict.newsSection.pageTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {dict.newsSection.subtitle}
            </p>
          </div>

          {/* Selo de Revisão Editorial */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12131a] border border-[#222433] text-xs font-mono text-slate-300 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>{dict.newsSection.reviewedAt.replace('{date}', formattedReviewDate)}</span>
          </div>
        </div>

        {/* Linha do Tempo Vertical de Notícias */}
        {items.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0e1017] border border-[#222433] text-center max-w-xl mx-auto">
            <p className="text-sm text-slate-300">{dict.newsSection.emptyProductionNotice}</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#1e2333] pl-4 sm:pl-8 ml-2 sm:ml-4 space-y-8 sm:space-y-10">
            {items.map((item) => {
              const formattedItemDate = formatNewsDate(item.publishedAt, currentLang);
              const sources = item.sourceUrl
                ? [
                    {
                      label:
                        item.kind === 'game'
                          ? 'Rockstar Games Official'
                          : 'GTAVIMap Changelog',
                      url: item.sourceUrl,
                    },
                  ]
                : [];

              return (
                <article
                  key={item.id}
                  className="relative p-6 sm:p-8 rounded-2xl bg-[#0e1017] border border-[#222433] hover:border-[#38f8ff]/30 transition-all shadow-xl shadow-black/20 space-y-4"
                >
                  {/* Marcador na linha do tempo vertical */}
                  <span className="absolute -left-[25px] sm:-left-[41px] top-7 w-4 h-4 rounded-full bg-[#12141f] border-2 border-[#ff2a85] shadow-[0_0_8px_#ff2a85]" />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.kind === 'game' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ff2a85]/15 text-[#ff4d9e] border border-[#ff2a85]/30 text-xs font-mono font-black uppercase">
                          <Gamepad2 size={13} />
                          <span>{dict.newsSection.gameBadge}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#38f8ff]/15 text-[#38f8ff] border border-[#38f8ff]/30 text-xs font-mono font-black uppercase">
                          <Globe size={13} />
                          <span>{dict.newsSection.siteBadge}</span>
                        </span>
                      )}

                      {item.confidence === 'official' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-xs font-mono font-bold uppercase">
                          <ShieldCheck size={12} />
                          <span>{dict.newsSection.officialBadge}</span>
                        </span>
                      )}

                      {item.confidence === 'community_analysis' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30 text-xs font-mono font-bold uppercase">
                          <Users size={12} />
                          <span>{dict.newsSection.communityBadge}</span>
                        </span>
                      )}

                      {item.placeholder && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-black uppercase">
                          <AlertCircle size={11} />
                          <span>{dict.newsSection.placeholderBadge}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Calendar size={13} />
                      <time dateTime={item.publishedAt}>{formattedItemDate}</time>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {item.title[currentLang] || item.title.en}
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.summary[currentLang] || item.summary.en}
                  </p>

                  {/* Linha de Fontes Padronizada */}
                  {sources.length > 0 && (
                    <SourceLine
                      sources={sources}
                      lang={currentLang}
                      note={
                        item.kind === 'game'
                          ? dict.sourceLine?.defaultNote
                          : 'Publicação oficial de desenvolvimento da equipe GTAVIMap'
                      }
                    />
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* ================= SEÇÃO: DESTAQUES DO TRAILER ================= */}
        <section className="pt-4 border-t border-[#1e2333]">
          <TimestampedHighlights lang={currentLang} />
        </section>

        {/* ================= MAP CTA AO FINAL DA PÁGINA ================= */}
        <section className="pt-4">
          <MapCta lang={currentLang} />
        </section>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
