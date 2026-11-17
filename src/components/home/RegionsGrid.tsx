'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MapPin } from 'lucide-react';
import { Language } from '@/types';
import { REGIONS } from '@/data/regions';
import { trackEvent } from '@/services/telemetry';

interface RegionsGridProps {
  lang: Language;
}

export const RegionsGrid: React.FC<RegionsGridProps> = ({ lang }) => {
  const sectionTitles = {
    'pt-BR': {
      badge: 'TERRITÓRIOS DE LEONIDA',
      heading: 'Regiões em Destaque',
      subheading:
        'Navegue pelos principais setores geográficos confirmados no estado de Leonida com enquadramento tático imediato.',
      exploreAction: 'Explorar no mapa',
    },
    en: {
      badge: 'LEONIDA TERRITORIES',
      heading: 'Featured Regions',
      subheading:
        'Browse major confirmed geographic sectors across the state of Leonida with instant tactical framing.',
      exploreAction: 'Explore on map',
    },
    es: {
      badge: 'TERRITORIOS DE LEONIDA',
      heading: 'Regiones Destacadas',
      subheading:
        'Explora los principales sectores geográficos confirmados en el estado de Leonida con encuadre táctico instantáneo.',
      exploreAction: 'Explorar en el mapa',
    },
  }[lang] || {
    badge: 'LEONIDA TERRITORIES',
    heading: 'Featured Regions',
    subheading: 'Browse major confirmed geographic sectors across the state of Leonida.',
    exploreAction: 'Explore on map',
  };

  const handleRegionClick = (regionId: string) => {
    trackEvent('region_click', { regionId });
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2230]/80 border border-[#38f8ff]/40 text-[#38f8ff] text-xs font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <Compass className="w-3.5 h-3.5" />
          <span>{sectionTitles.badge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
          {sectionTitles.heading}
        </h2>
        <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
          {sectionTitles.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REGIONS.map((region) => {
          const mapUrl = `/${lang.toLowerCase()}/map?r=${region.id}`;
          return (
            <Link
              key={region.id}
              href={mapUrl}
              onClick={() => handleRegionClick(region.id)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#181a24] to-[#11131c] border border-white/5 hover:border-[#ff2a85]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,42,133,0.15)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative background glow */}
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
                style={{ backgroundColor: region.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase border"
                    style={{
                      color: region.color,
                      borderColor: `${region.color}40`,
                      backgroundColor: `${region.color}15`,
                    }}
                  >
                    <MapPin className="w-3 h-3" />
                    {region.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    0-1000 Grid
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#38f8ff] transition-colors mb-1">
                  {region.name}
                </h3>
                <p className="text-xs font-medium text-slate-300 mb-3">
                  {region.subtitle[lang] || region.subtitle.en}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {region.description[lang] || region.description.en}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#38f8ff]" />
                  {sectionTitles.exploreAction}
                </span>
                <ArrowRight className="w-4 h-4 text-[#ff2a85] transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
