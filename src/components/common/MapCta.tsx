import React from 'react';
import Link from 'next/link';
import { Map, ArrowRight, Compass } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export interface MapCtaProps {
  lang: Language;
  c?: string; // categoryId ou slug
  r?: string; // regionId
  m?: string; // markerId ou slug
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Componente MapCta (Server Component): Bloco final para páginas de conteúdo
 * incentivando a exploração no mapa interativo com suporte a deep links.
 */
export const MapCta: React.FC<MapCtaProps> = ({
  lang,
  c,
  r,
  m,
  title,
  subtitle,
  className = '',
}) => {
  const dict = getDictionary(lang);
  const langPrefix = `/${lang.toLowerCase()}`;

  // Montar parâmetros de busca deep link se informados
  const params = new URLSearchParams();
  if (c) params.set('c', c);
  if (r) params.set('r', r);
  if (m) params.set('m', m);

  const queryString = params.toString();
  const mapHref = `${langPrefix}/map${queryString ? `?${queryString}` : ''}`;

  const ctaTitle = title || dict.mapCta?.title || 'Veja onde tudo acontece';
  const ctaSubtitle =
    subtitle ||
    dict.mapCta?.subtitle ||
    'Explore o mapa interativo completo de Vice City e Leonida com filtros em tempo real e rastreamento GPS.';
  const buttonText = dict.mapCta?.buttonText || 'Abrir Mapa Interativo';

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[#222433] bg-gradient-to-br from-[#0f111a] via-[#141624] to-[#0d0f17] p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl ${className}`}
    >
      {/* Detalhe de fundo em degradê neon */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#ff2a85]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b1e2c] border border-[#2b3044] text-[11px] font-mono text-[#38f8ff] font-bold">
          <Compass size={13} className="text-[#38f8ff] animate-spin-slow" />
          <span className="uppercase tracking-wider">LEONIDA GPS</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {ctaTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {ctaSubtitle}
        </p>
      </div>

      <div className="relative z-10 shrink-0 w-full sm:w-auto">
        <Link
          href={mapHref}
          className="min-h-[48px] px-6 py-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#a855f7] hover:from-[#ff3d95] hover:to-[#b768ff] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-[#ff2a85]/20 hover:shadow-[#ff2a85]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
        >
          <Map size={18} className="shrink-0" />
          <span>{buttonText}</span>
          <ArrowRight size={16} className="shrink-0" />
        </Link>
      </div>
    </section>
  );
};
