'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Compass, Maximize2, Sparkles } from 'lucide-react';
import { Language } from '@/types';
import { trackEvent } from '@/services/telemetry';
import { getDictionary } from '@/i18n/translations';

const DynamicInteractiveMap = dynamic(
  () =>
    import('@/components/map/InteractiveMapClient').then(
      (mod) => mod.InteractiveMapClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
        <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
        <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
          Iniciando cartografia de Leonida...
        </span>
      </div>
    ),
  }
);

interface HomeMapPreviewProps {
  lang: Language;
}

export const HomeMapPreview: React.FC<HomeMapPreviewProps> = ({ lang }) => {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dict = getDictionary(lang);

  const fullMapUrl = `/${lang.toLowerCase()}/map`;

  // Carrega ao entrar na viewport (com margem de 200px)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      const timer = setTimeout(() => {
        setShouldLoadMap(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleManualActivate = () => {
    if (!shouldLoadMap) {
      setShouldLoadMap(true);
      trackEvent('map_activate', { source: 'home_preview_button' });
    }
  };

  return (
    <div
      id="map-preview"
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[420px] max-h-[680px] rounded-2xl overflow-hidden border-2 border-[#24283b] bg-[#0c0e15] shadow-2xl group transition-all"
    >
      {/* Botão permanente no topo direito para Tela Cheia */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <Link
          href={fullMapUrl}
          onClick={() => trackEvent('open_fullscreen', { source: 'home_preview_header' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12131a]/95 backdrop-blur-md border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95"
        >
          <Maximize2 size={13} />
          <span>{dict.common.exploreMap}</span>
        </Link>
      </div>

      {shouldLoadMap ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
              <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
                Carregando mapa...
              </span>
            </div>
          }
        >
          <DynamicInteractiveMap lang={lang} variant="embed" />
        </Suspense>
      ) : (
        /* Pôster Estático de Alta Fidelidade (Zero CLS) */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#0c0e15] via-[#121420] to-[#0a0b12]">
          {/* Grid de fundo sutil */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #00e5ff 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Brilho radial Vice City */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-[#ff2a85]/15 to-[#00e5ff]/15 blur-3xl pointer-events-none" />

          {/* Conteúdo Central */}
          <div className="relative z-10 max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181a28] border border-[#ff2a85]/40 text-[#ff2a85] text-xs font-mono">
              <Sparkles size={13} />
              <span>Leonida Interactive Cartography</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Mapa Interativo de Vice City & Leonida
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore distritos, colecionáveis, pontos de salto acrobático e arsenais
              com navegação vetorial e rastreamento de progresso local.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleManualActivate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff2a85]/25 transform hover:scale-105 active:scale-95 transition-all"
              >
                <Compass size={16} />
                <span>Tocar para explorar</span>
              </button>

              <Link
                href={fullMapUrl}
                onClick={() => trackEvent('open_fullscreen', { source: 'home_preview_cta' })}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#161824] hover:bg-[#1f2233] border border-[#2d3248] text-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Maximize2 size={14} />
                <span>Tela cheia</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
