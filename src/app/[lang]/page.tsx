import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Zap,
  Star,
  Layers,
} from 'lucide-react';
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
    title: `${dict.common.siteName} — ${dict.hero.title}`,
    description: dict.hero.subtitle,
    alternates: {
      canonical: `/${currentLang.toLowerCase()}`,
      languages: {
        en: '/en',
        'pt-BR': '/pt-br',
        es: '/es',
      },
    },
    openGraph: {
      title: `${dict.common.siteName} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      url: `https://gtavimap.com/${currentLang.toLowerCase()}`,
      siteName: 'GTAVIMap',
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: PageProps) {
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

      {/* Hero Section Estilo HUD Neon */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-[#222433]">
        {/* Glows de Fundo Vibrantes Neon */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#ff2a85]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-[#00e5ff]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag HUD no topo */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161722] border border-[#ff2a85]/40 text-xs font-mono text-white shadow-lg shadow-[#ff2a85]/10">
              <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-pulse"></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] font-black">
                GTAVIMAP HUD
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 uppercase tracking-wider text-[10px]">
                {dict.common.demoBadge}
              </span>
            </div>

            {/* Logo e Título com Degradê Vibrante */}
            <div className="space-y-2">
              <div className="text-5xl sm:text-7xl font-black tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff]">
                  VI
                </span>{' '}
                <span className="text-white">GTAVIMAP</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-200">
                {dict.hero.title}
              </h1>
            </div>

            {/* Subtítulo */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
              {dict.hero.subtitle}
            </p>

            {/* CTAs em Pílula / Degradê */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href={`${langPrefix}/map`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-[#0e0f15] bg-gradient-to-r from-[#ff2a85] via-[#ec4899] to-[#00e5ff] hover:opacity-95 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#ff2a85]/25"
              >
                <Compass size={17} className="text-[#0e0f15]" />
                <span>{dict.hero.ctaPrimary}</span>
              </Link>

              <Link
                href={`${langPrefix}/premium`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#161722] hover:bg-[#1e202e] text-slate-200 border border-[#ff2a85]/50 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Sparkles size={15} className="text-[#ff2a85]" />
                <span>{dict.hero.ctaSecondary}</span>
              </Link>
            </div>

            {/* Estatísticas no Estilo HUD */}
            <div className="grid grid-cols-3 gap-3.5 pt-8 max-w-xl mx-auto">
              <div className="p-3.5 rounded-xl bg-[#12131a] border border-[#262838] shadow-lg">
                <div className="text-2xl font-black text-[#00e5ff] font-mono">
                  {DEMO_MARKERS.length}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                  {dict.hero.statTotalMarkers}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#12131a] border border-[#262838] shadow-lg">
                <div className="text-2xl font-black text-[#ff2a85] font-mono">
                  {CATEGORIES.length}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                  {dict.hero.statCategories}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#12131a] border border-[#262838] shadow-lg">
                <div className="text-2xl font-black text-[#fbbf24] font-mono">6+</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                  {dict.hero.statRegions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prévia do Mapa Interativo com Moldura Neon */}
      <section className="py-14 bg-[#0a0b10] border-b border-[#222433]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00e5ff]">
                LIVE CARTOGRAPHY PREVIEW
              </span>
              <h2 className="text-2xl font-black uppercase text-white mt-0.5">
                Cartografia Interativa de Leonida
              </h2>
            </div>
            <Link
              href={`${langPrefix}/map`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff2a85] text-[#ff2a85] hover:bg-[#ff2a85] hover:text-black font-black text-xs uppercase tracking-wider transition-all"
            >
              <span>ABRIR MAPA FULLSCREEN</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Moldura com Borda Neon e Efeito de HUD */}
          <Link
            href={`${langPrefix}/map`}
            className="group block relative rounded-2xl overflow-hidden border-2 border-[#ff2a85]/60 bg-[#12131a] shadow-2xl hover:border-[#00e5ff] transition-all"
            style={{
              boxShadow: '0 0 30px rgba(255, 42, 133, 0.15)',
            }}
          >
            <div className="aspect-video sm:aspect-[21/9] w-full relative overflow-hidden bg-[#3b9cb0] flex items-center justify-center">
              <img
                src="/map/leonida-vibrant-map.svg"
                alt="GTAVIMap Live Cartography"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f15]/80 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-6 py-3 rounded-xl bg-[#12131a]/95 backdrop-blur-md border border-[#00e5ff] text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl group-hover:bg-[#00e5ff] group-hover:text-black transition-colors">
                  <Compass size={17} />
                  <span>CLIQUE PARA NAVEGAR NO MAPA INTERATIVO</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Categorias Catalogadas no Estilo HUD (2 Colunas por Grupo) */}
      <section className="py-14 border-b border-[#222433]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ff2a85]">
              CATEGORIES DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Pontos de Interesse Catalogados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((groupName) => {
              const groupCategories = CATEGORIES.filter((c) => c.group === groupName);
              if (groupCategories.length === 0) return null;

              return (
                <div
                  key={groupName}
                  className="p-5 rounded-2xl bg-[#12131a] border border-[#222433] space-y-3 shadow-lg"
                >
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#00e5ff] border-b border-[#1e202d] pb-2">
                    {groupName}
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {groupCategories.map((cat) => {
                      const total = DEMO_MARKERS.filter((m) => m.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between p-2 rounded bg-[#0a0b10] border border-[#1e202d] text-[10px] font-bold"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <DynamicIcon
                              name={cat.iconName}
                              size={12}
                              color={cat.color}
                              className="shrink-0"
                            />
                            <span className="truncate uppercase font-mono text-[9.5px] text-slate-300">
                              {cat.shortLabel}
                            </span>
                          </div>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 ml-1"
                            style={{ color: cat.color, backgroundColor: cat.badgeBg }}
                          >
                            {total}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparativo Gratuito vs Premium com Bordas Neon */}
      <section className="py-16 bg-[#0a0b10] border-b border-[#222433]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00e5ff]">
              MEMBERSHIP TIERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Gratuito vs Premium Club
            </h2>
            <p className="text-xs text-slate-400">
              Todas as funcionalidades do protótipo estão atualmente liberadas para demonstração.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Free */}
            <div className="p-6 rounded-2xl bg-[#12131a] border border-[#262838] space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  {dict.common.freeTier}
                </span>
                <div className="text-3xl font-black text-white font-mono">R$ 0 / Grátis</div>
                <p className="text-xs text-slate-400">
                  Acesso completo às ferramentas essenciais do mapa.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#00e5ff]" />
                  <span>Exploração de todos os marcadores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#00e5ff]" />
                  <span>Filtros em 2 colunas e busca em tempo real</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#00e5ff]" />
                  <span>Progresso salvo localmente no navegador</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#00e5ff]" />
                  <span>Exportação e importação de backup JSON</span>
                </li>
              </ul>

              <Link
                href={`${langPrefix}/map`}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-[#1a1c27] hover:bg-[#252838] text-slate-200 text-xs font-bold uppercase tracking-wider border border-[#2d3044] transition-colors"
              >
                Acessar Gratuitamente
              </Link>
            </div>

            {/* Card Premium com Borda Neon Rosa */}
            <div
              className="p-6 rounded-2xl bg-[#12131a] border-2 border-[#ff2a85] space-y-5 relative shadow-2xl"
              style={{
                boxShadow: '0 0 30px rgba(255, 42, 133, 0.2)',
              }}
            >
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 border border-[#ff2a85] text-[#ff2a85] font-mono text-[10px] font-black uppercase">
                PLANEJADO
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-[#ff2a85]">
                  GTAVIMAP PRO & CLOUD
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {dict.premium.monthlyPrice}
                </div>
                <p className="text-xs text-slate-400">
                  Para jogadores que buscam a conclusão perfeita de 100%.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#ff2a85]" />
                  <span>Zero anúncios e mapa a 60 FPS</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#ff2a85]" />
                  <span>Sincronização na nuvem entre PC, tablet e celular</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#ff2a85]" />
                  <span>Criação ilimitada de waypoints pessoais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#ff2a85]" />
                  <span>Múltiplos perfis de savegame</span>
                </li>
              </ul>

              <Link
                href={`${langPrefix}/premium`}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-[#0e0f15] bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] shadow-lg shadow-[#ff2a85]/25 transition-transform transform active:scale-98"
              >
                Conhecer Recursos Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={currentLang} />
    </div>
  );
}
