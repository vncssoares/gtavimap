import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Compass,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Tag,
  Gift,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { EmbedSnippetButton } from '@/components/common/EmbedSnippetButton';
import { CATEGORIES } from '@/data/categories';
import {
  categoryIdToSlug,
  slugToCategoryId,
  getIndexableMarkers,
  getVerifiedMarkerBySlug,
} from '@/data/seoSelectors';

interface MarkerPageProps {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
}

export function generateStaticParams() {
  const markers = getIndexableMarkers();
  const languages: Language[] = ['en', 'pt-BR', 'es'];
  const params: { lang: string; category: string; slug: string }[] = [];

  for (const lang of languages) {
    const langSlug = lang.toLowerCase();
    for (const marker of markers) {
      params.push({
        lang: langSlug,
        category: categoryIdToSlug(marker.category),
        slug: marker.slug,
      });
    }
  }

  // Com Cache Components ativado, generateStaticParams precisa retornar pelo menos 1 item
  // para permitir a validação em tempo de build. Se não houver itens verificados, retorna
  // um placeholder que aciona notFound() na renderização sem quebrar o build.
  if (params.length === 0) {
    return [{ lang: 'en', category: '_empty', slug: '_empty' }];
  }

  return params;
}

export async function generateMetadata({ params }: MarkerPageProps): Promise<Metadata> {
  const { lang, category: categorySlug, slug: markerSlug } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const categoryId = slugToCategoryId(categorySlug);
  if (!categoryId) {
    return { title: 'Not Found — GTAVIMap' };
  }

  const marker = getVerifiedMarkerBySlug(categoryId, markerSlug);
  if (!marker) {
    return { title: 'Not Found — GTAVIMap' };
  }

  const rawDesc = marker.description[currentLang] || marker.description.en;
  const desc = marker.spoiler
    ? currentLang === 'pt-BR'
      ? `${marker.name} em ${marker.region} — Ponto confirmado em Leonida. Detalhes de história ocultos contra spoilers.`
      : currentLang === 'es'
      ? `${marker.name} en ${marker.region} — Punto confirmado en Leonida. Detalles de historia ocultos contra spoilers.`
      : `${marker.name} in ${marker.region} — Confirmed location in Leonida. Story details hidden to prevent spoilers.`
    : rawDesc;

  const title = `${marker.name} — GTAVIMap`;
  const canonicalPath = `/${normalizedLang}/map/${categorySlug}/${markerSlug}`;
  const ogImageUrl = `/${normalizedLang}/map/${categorySlug}/${markerSlug}/opengraph-image`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/map/${categorySlug}/${markerSlug}`,
        'pt-BR': `/pt-br/map/${categorySlug}/${markerSlug}`,
        es: `/es/map/${categorySlug}/${markerSlug}`,
        'x-default': `/en/map/${categorySlug}/${markerSlug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
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
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

export default async function MarkerLandingPage({ params }: MarkerPageProps) {
  const { lang, category: categorySlug, slug: markerSlug } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const categoryId = slugToCategoryId(categorySlug);
  if (!categoryId) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) {
    notFound();
  }

  const marker = getVerifiedMarkerBySlug(categoryId, markerSlug);
  if (!marker) {
    notFound();
  }

  const dict = getDictionary(currentLang);
  const langPrefix = `/${normalizedLang}`;
  const categoryName = (dict.categories as Record<string, string>)[category.id] || category.shortLabel;
  const desc = marker.description[currentLang] || marker.description.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.markerLanding.breadcrumbHome,
        item: `https://gtavimap.com/${normalizedLang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.markerLanding.breadcrumbCategories,
        item: `https://gtavimap.com/${normalizedLang}/categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `https://gtavimap.com/${normalizedLang}/map/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: marker.name,
        item: `https://gtavimap.com/${normalizedLang}/map/${categorySlug}/${markerSlug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f15] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Header lang={currentLang} />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb visual */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap"
          >
            <Link
              href={langPrefix}
              className="hover:text-white transition-colors"
            >
              {dict.markerLanding.breadcrumbHome}
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link
              href={`${langPrefix}/categories`}
              className="hover:text-white transition-colors"
            >
              {dict.markerLanding.breadcrumbCategories}
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link
              href={`${langPrefix}/map/${categorySlug}`}
              className="hover:text-white transition-colors"
            >
              {categoryName}
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-[#00e5ff] font-bold line-clamp-1">{marker.name}</span>
          </nav>

          {/* Card Principal do Ponto */}
          <article className="p-6 sm:p-10 rounded-3xl bg-[#12131a] border border-[#222433] shadow-2xl space-y-8 relative">
            {/* Header com Categoria & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222433] pb-5">
              <Link
                href={`${langPrefix}/map/${categorySlug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold uppercase transition-all hover:border-[#00e5ff]"
                style={{ backgroundColor: category.badgeBg, color: category.color }}
              >
                <DynamicIcon name={category.iconName} size={16} color={category.color} />
                <span>{categoryName}</span>
              </Link>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                <ShieldCheck size={14} />
                <span>{dict.markerLanding.verifiedBadge}</span>
              </div>
            </div>

            {/* Título & Descrição */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                {marker.name}
              </h1>

              {marker.spoiler ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-mono space-y-1">
                  <span className="font-bold uppercase tracking-wider block">⚠️ Contém Spoilers da História</span>
                  <span className="text-slate-300">
                    {currentLang === 'pt-BR'
                      ? 'A descrição detalhada deste ponto está oculta para preservar sua experiência de jogo. Abra o ponto no mapa interativo para revelar.'
                      : currentLang === 'es'
                      ? 'La descripción detallada de este punto está oculta para preservar su experiencia de juego. Ábralo en el mapa interactivo para revelarla.'
                      : 'The detailed description of this location is hidden to preserve your gameplay experience. Open it in the interactive map to reveal.'}
                  </span>
                </div>
              ) : (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  {desc}
                </p>
              )}
            </div>

            {/* Dados Cartográficos e Atributos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1c1e2b]">
              <div className="p-4 rounded-2xl bg-[#090a0e] border border-[#1d202c] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/20 text-[#ff2a85]">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {dict.markerLanding.region}
                  </span>
                  <span className="text-sm font-black text-white">{marker.region}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#090a0e] border border-[#1d202c] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff]">
                  <Compass size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {dict.markerLanding.coordinates}
                  </span>
                  <span className="text-sm font-mono font-bold text-[#00e5ff]">
                    X: {marker.x} | Y: {marker.y}
                  </span>
                </div>
              </div>
            </div>

            {/* Recompensa se existir */}
            {marker.reward && (
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex items-start gap-3">
                <Gift size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                    {dict.markerLanding.reward}
                  </span>
                  <span className="text-sm font-bold text-slate-200">{marker.reward}</span>
                </div>
              </div>
            )}

            {/* Tags se existirem */}
            {marker.tags && marker.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Tag size={13} className="text-[#ff2a85]" />
                  <span>{dict.markerLanding.tags}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {marker.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-[#181a25] border border-[#272a3b] text-xs font-mono text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fonte e Verificação */}
            {marker.source && (
              <div className="p-4 rounded-2xl bg-[#090a0e] border border-[#1d202c] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  {dict.markerLanding.source}
                </span>
                <p className="text-xs text-slate-300">{marker.source}</p>
                {marker.updatedAt && (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 pt-1">
                    <Calendar size={11} />
                    {new Date(marker.updatedAt).toLocaleDateString(
                      currentLang === 'pt-BR' ? 'pt-BR' : currentLang === 'es' ? 'es-ES' : 'en-US'
                    )}
                  </span>
                )}
              </div>
            )}

            {/* Ações principais */}
            <div className="pt-6 border-t border-[#1c1e2b] flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href={`${langPrefix}/map/${categorySlug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#272a3b] bg-[#161722] hover:bg-[#1d1f2e] text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>
                  {dict.markerLanding.backToCategory.replace('{category}', categoryName)}
                </span>
              </Link>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <EmbedSnippetButton
                  lang={currentLang}
                  type="marker"
                  id={marker.id}
                  variant="compact"
                />

                {/* Botão de Ação Primária: Abrir no Mapa com ?m=<markerId> */}
                <Link
                  href={`${langPrefix}/map?m=${marker.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff2a85]/20 hover:scale-102 active:scale-98 transition-all"
                >
                  <Compass size={18} />
                  <span>{dict.markerLanding.openInMap}</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
