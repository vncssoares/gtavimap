'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Maximize2 } from 'lucide-react';
import { Language } from '@/types';
import { trackEvent } from '@/services/telemetry';

interface HomeHeroProps {
  lang: Language;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ lang }) => {
  const content = {
    'pt-BR': {
      badge: 'CARTOGRAFIA TÁTICA DE LEONIDA',
      h1: 'Mapa Interativo & Rastreador de GTA VI',
      subtitle:
        'Explore o estado de Leonida, rastreie colecionáveis em tempo real, descubra locais de interesse e filtre categorias com alta performance.',
      primaryCta: 'Explorar o mapa',
      secondaryCta: 'Tela cheia',
    },
    en: {
      badge: 'LEONIDA TACTICAL CARTOGRAPHY',
      h1: 'GTA VI Interactive Map & Progress Tracker',
      subtitle:
        'Explore the state of Leonida, track collectibles in real time, uncover points of interest, and filter categories with high performance.',
      primaryCta: 'Explore the map',
      secondaryCta: 'Full screen',
    },
    es: {
      badge: 'CARTOGRAFÍA TÁCTICA DE LEONIDA',
      h1: 'Mapa Interactivo y Rastreador de GTA VI',
      subtitle:
        'Explora el estado de Leonida, rastrea coleccionables en tiempo real, descubre puntos de interés y filtra categorías con alto rendimiento.',
      primaryCta: 'Explorar el mapa',
      secondaryCta: 'Pantalla completa',
    },
  }[lang] || {
    badge: 'LEONIDA TACTICAL CARTOGRAPHY',
    h1: 'GTA VI Interactive Map & Progress Tracker',
    subtitle: 'Explore the state of Leonida with high performance.',
    primaryCta: 'Explore the map',
    secondaryCta: 'Full screen',
  };

  const scrollToMap = (e: React.MouseEvent) => {
    e.preventDefault();
    const mapElement = document.getElementById('map-preview');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFullScreenClick = () => {
    trackEvent('open_fullscreen');
  };

  const fullMapUrl = `/${lang.toLowerCase()}/map`;

  return (
    <section className="relative overflow-hidden py-12 md:py-16 border-b border-white/5 bg-gradient-to-b from-[#11131c] via-[#0d0e15] to-[#0a0b10]">
      {/* Pure CSS Ambient Gradients - No game art / characters */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff2a85]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-[#00e5ff]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181b26] border border-[#38f8ff]/40 text-xs font-mono text-[#38f8ff] tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <span className="w-2 h-2 rounded-full bg-[#38f8ff] animate-pulse" />
          <span>{content.badge}</span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4 max-w-4xl mx-auto">
          {content.h1}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
          {content.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#map-preview"
            onClick={scrollToMap}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#ff599c] hover:from-[#e02474] hover:to-[#ff3b8d] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.35)] transition-all hover:scale-102 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>{content.primaryCta}</span>
          </a>

          <Link
            href={fullMapUrl}
            onClick={handleFullScreenClick}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-200 border border-white/10 hover:border-[#38f8ff]/40 font-bold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <Maximize2 className="w-4 h-4 text-[#38f8ff]" />
            <span>{content.secondaryCta}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
