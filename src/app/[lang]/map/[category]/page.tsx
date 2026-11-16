import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Compass, MapPin, ChevronRight, HelpCircle, ShieldCheck, Layers } from 'lucide-react';
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
  getIndexableCategories,
  getVerifiedMarkersByCategory,
} from '@/data/seoSelectors';

interface CategoryPageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export function generateStaticParams() {
  const categories = getIndexableCategories();
  const languages: Language[] = ['en', 'pt-BR', 'es'];
  const params: { lang: string; category: string }[] = [];

  for (const lang of languages) {
    const langSlug = lang.toLowerCase();
    for (const cat of categories) {
      params.push({
        lang: langSlug,
        category: categoryIdToSlug(cat.id),
      });
    }
  }

  // Com Cache Components ativado, generateStaticParams precisa retornar pelo menos 1 item
  // para permitir a validação em tempo de build. Se não houver itens verificados, retorna
  // um placeholder que aciona notFound() na renderização sem quebrar o build.
  if (params.length === 0) {
    return [{ lang: 'en', category: '_empty' }];
  }

  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, category: categorySlug } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const categoryId = slugToCategoryId(categorySlug);
  if (!categoryId) {
    return { title: 'Not Found — GTAVIMap' };
  }

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const verifiedMarkers = getVerifiedMarkersByCategory(categoryId);

  if (!category || verifiedMarkers.length === 0) {
    return { title: 'Not Found — GTAVIMap' };
  }

  const dict = getDictionary(currentLang);
  const categoryName = (dict.categories as Record<string, string>)[category.id] || category.shortLabel;
  const categoryDesc =
    (dict.categories as Record<string, string>)[`${category.id}_desc`] ||
    dict.categoryLanding.verifiedPointsSubtitle;

  const title = `${categoryName} — ${dict.common.siteName}`;
  const canonicalPath = `/${normalizedLang}/map/${categorySlug}`;
  const ogImageUrl = `/${normalizedLang}/map/${categorySlug}/opengraph-image`;

  return {
    title,
    description: categoryDesc,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/map/${categorySlug}`,
        'pt-BR': `/pt-br/map/${categorySlug}`,
        es: `/es/map/${categorySlug}`,
        'x-default': `/en/map/${categorySlug}`,
      },
    },
    openGraph: {
      title,
      description: categoryDesc,
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
      description: categoryDesc,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryLandingPage({ params }: CategoryPageProps) {
  const { lang, category: categorySlug } = await params;
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

  const verifiedMarkers = getVerifiedMarkersByCategory(categoryId);
  if (verifiedMarkers.length === 0) {
    notFound();
  }

  const dict = getDictionary(currentLang);
  const langPrefix = `/${normalizedLang}`;
  const categoryName = (dict.categories as Record<string, string>)[category.id] || category.shortLabel;
  const categoryDesc =
    (dict.categories as Record<string, string>)[`${category.id}_desc`] ||
    dict.categoryLanding.verifiedPointsSubtitle;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dict.categoryLanding.breadcrumbHome,
          item: `https://gtavimap.com/${normalizedLang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dict.categoryLanding.breadcrumbCategories,
          item: `https://gtavimap.com/${normalizedLang}/categories`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryName,
          item: `https://gtavimap.com/${normalizedLang}/map/${categorySlug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: dict.categoryLanding.faqQ1,
          acceptedAnswer: {
            '@type': 'Answer',
            text: dict.categoryLanding.faqA1,
          },
        },
        {
          '@type': 'Question',
          name: dict.categoryLanding.faqQ2,
          acceptedAnswer: {
            '@type': 'Answer',
            text: dict.categoryLanding.faqA2,
          },
        },
      ],
    },
  ];

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb visual */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-slate-400"
          >
            <Link
              href={langPrefix}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              {dict.categoryLanding.breadcrumbHome}
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link
              href={`${langPrefix}/categories`}
              className="hover:text-white transition-colors"
            >
              {dict.categoryLanding.breadcrumbCategories}
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-[#00e5ff] font-bold uppercase">{categoryName}</span>
          </nav>

          {/* Hero da Categoria */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12131a] border border-[#222433] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 border border-white/10"
                  style={{ backgroundColor: category.badgeBg }}
                >
                  <DynamicIcon name={category.iconName} size={28} color={category.color} />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                    <ShieldCheck size={12} />
                    <span>
                      {dict.categoryLanding.totalVerified.replace(
                        '{count}',
                        String(verifiedMarkers.length)
                      )}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                    {categoryName}
                  </h1>
                  <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                    {categoryDesc}
                  </p>
                </div>
              </div>

              {/* Botões de Ação: Abrir no Mapa & Incorporar */}
              <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2.5 shrink-0 self-start sm:self-center">
                <Link
                  href={`${langPrefix}/map?c=${categoryId}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff2a85]/20 hover:scale-102 active:scale-98 transition-all"
                >
                  <Compass size={18} />
                  <span>{dict.categoryLanding.openInMap}</span>
                </Link>

                <EmbedSnippetButton
                  lang={currentLang}
                  type="category"
                  id={category.id}
                  variant="compact"
                />
              </div>
            </div>
          </div>

          {/* Lista de Pontos Verificados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#222433] pb-3">
              <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Layers size={18} className="text-[#00e5ff]" />
                <span>{dict.categoryLanding.verifiedPoints}</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {verifiedMarkers.length} {verifiedMarkers.length === 1 ? 'LOCAL' : 'LOCAIS'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedMarkers.map((marker) => {
                const desc =
                  marker.description[currentLang] || marker.description.en;
                const pointUrl = `${langPrefix}/map/${categorySlug}/${marker.slug}`;

                return (
                  <article
                    key={marker.id}
                    className="p-5 rounded-2xl bg-[#12131a] border border-[#222433] hover:border-[#00e5ff]/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-[#ff2a85]">
                          <MapPin size={11} />
                          {marker.region}
                        </span>
                        <span className="text-slate-400">
                          X:{marker.x} | Y:{marker.y}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-[#00e5ff] transition-colors">
                        <Link href={pointUrl}>{marker.name}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>

                      {marker.reward && (
                        <div className="text-[11px] font-mono text-amber-300/90 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                          {marker.reward}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#1c1e2b] flex items-center justify-between">
                      <Link
                        href={`${langPrefix}/map?m=${marker.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00e5ff] hover:underline uppercase"
                      >
                        <Compass size={13} />
                        <span>{dict.categoryLanding.openInMap}</span>
                      </Link>
                      <Link
                        href={pointUrl}
                        className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        Detalhes →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Bloco de Perguntas Frequentes (FAQ) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12131a] border border-[#222433] space-y-6">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={20} className="text-[#ff2a85]" />
              <h2 className="text-lg font-black uppercase tracking-wider text-white">
                {dict.categoryLanding.faqTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-[#090a0e] border border-[#1d202c] space-y-2">
                <h3 className="text-sm font-bold text-white">
                  {dict.categoryLanding.faqQ1}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.categoryLanding.faqA1}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090a0e] border border-[#1d202c] space-y-2">
                <h3 className="text-sm font-bold text-white">
                  {dict.categoryLanding.faqQ2}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dict.categoryLanding.faqA2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
