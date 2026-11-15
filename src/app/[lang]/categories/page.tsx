import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Compass, MapPin } from 'lucide-react';
import { CategoryGroup, Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CATEGORIES } from '@/data/categories';
import { DEMO_MARKERS } from '@/data/markers';
import { DynamicIcon } from '@/components/common/DynamicIcon';

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
    title: `${dict.nav.categories} — ${dict.common.siteName}`,
    description: 'Explore all categorized markers for GTA VI: weapons, vehicles, locations, collectibles, and missions.',
    alternates: {
      canonical: `/${currentLang.toLowerCase()}/categories`,
      languages: {
        en: '/en/categories',
        'pt-BR': '/pt-br/categories',
        es: '/es/categories',
      },
    },
    openGraph: {
      title: `${dict.nav.categories} — ${dict.common.siteName}`,
      description: 'Explore all categorized markers for GTA VI: weapons, vehicles, locations, collectibles, and missions.',
      url: `https://gtavimap.com/${currentLang.toLowerCase()}/categories`,
      siteName: 'GTAVIMap',
      locale: currentLang === 'pt-BR' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function CategoriesPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const langPrefix = `/${normalizedLang}`;

  const groups: CategoryGroup[] = ['COLLECTIBLES', 'ACTIVITIES', 'SERVICES', 'LOCATIONS', 'WEAPONS'];

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f15] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header da Página no Estilo HUD */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161722] border border-[#ff2a85]/40 text-xs font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] font-black">
                DATABASE & DIRECTORY
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Categorias Catalogadas de Leonida
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Acesse a lista completa de pontos de interesse, atividades e colecionáveis identificados na nossa base cartográfica interativa.
            </p>
          </div>

          {/* Agrupamento por Seções Estilo HUD */}
          <div className="space-y-12">
            {groups.map((groupName) => {
              const groupCategories = CATEGORIES.filter((c) => c.group === groupName);
              if (groupCategories.length === 0) return null;

              return (
                <div key={groupName} className="space-y-6">
                  {/* Cabeçalho do Grupo */}
                  <div className="flex items-center justify-between border-b-2 border-[#ff2a85] pb-2">
                    <h2 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00e5ff]">
                      {groupName}
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                      {groupCategories.length} CATEGORIAS
                    </span>
                  </div>

                  {/* Grid das Categorias do Grupo */}
                  <div className="space-y-6">
                    {groupCategories.map((category) => {
                      const categoryMarkers = DEMO_MARKERS.filter(
                        (m) => m.category === category.id
                      );

                      return (
                        <div
                          key={category.id}
                          id={category.id}
                          className="p-5 sm:p-6 rounded-2xl bg-[#12131a] border border-[#222433] space-y-4 shadow-xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1d202c] pb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                                style={{ backgroundColor: category.badgeBg }}
                              >
                                <DynamicIcon
                                  name={category.iconName}
                                  size={18}
                                  color={category.color}
                                />
                              </div>
                              <div>
                                <h3 className="text-base font-black text-white uppercase tracking-wider">
                                  {category.shortLabel}
                                </h3>
                                <p className="text-xs text-slate-400">
                                  {(dict.categories as Record<string, string>)[`${category.id}_desc`] || ''}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`${langPrefix}/map`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black font-black text-[10px] uppercase tracking-wider transition-all self-start sm:self-center"
                            >
                              <Compass size={13} />
                              <span>VER NO MAPA</span>
                            </Link>
                          </div>

                          {/* Marcadores desta Categoria */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categoryMarkers.map((marker) => {
                              const desc = marker.description[currentLang] || marker.description.en;
                              return (
                                <div
                                  key={marker.id}
                                  className="p-3.5 rounded-xl bg-[#090a0e] border border-[#1b1c26] hover:border-[#2d3040] transition-colors space-y-2 flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                                      <span className="text-slate-400 uppercase">
                                        {marker.subCategory || category.shortLabel}
                                      </span>
                                      <span className="text-[#00e5ff] font-bold">
                                        X:{marker.x} Y:{marker.y}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-black text-white leading-snug">
                                      {marker.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                      {desc}
                                    </p>
                                  </div>

                                  <div className="pt-2 border-t border-[#161720] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                    <span className="flex items-center gap-1">
                                      <MapPin size={11} className="text-[#ff2a85]" />
                                      {marker.region}
                                    </span>
                                    <span className="text-[#fbbf24]">DEMO</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
