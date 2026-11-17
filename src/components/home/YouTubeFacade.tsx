'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, Film, Sparkles } from 'lucide-react';
import { Language } from '@/types';
import { OFFICIAL_TRAILERS } from '@/data/trailers';
import { trackEvent } from '@/services/telemetry';

interface YouTubeFacadeProps {
  lang: Language;
}

export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const trailer = OFFICIAL_TRAILERS[0];

  const content = {
    'pt-BR': {
      badge: 'MATERIAL OFICIAL',
      heading: 'Trailer de Revelação',
      subheading:
        'Acompanhe o primeiro olhar oficial sobre o estado de Leonida, Vice City e os protagonistas Jason e Lucia.',
      playAction: 'Reproduzir Trailer Oficial',
      watchOnYoutube: 'Assistir no YouTube (Restrição de idade)',
      disclaimer: 'Vídeo transmitido via youtube-nocookie.com. Nenhum cookie de terceiros é carregado antes do play.',
    },
    en: {
      badge: 'OFFICIAL MEDIA',
      heading: 'Reveal Trailer',
      subheading:
        'Watch the official first look at the state of Leonida, Vice City, and dual protagonists Jason & Lucia.',
      playAction: 'Play Official Trailer',
      watchOnYoutube: 'Watch on YouTube (Age-restricted)',
      disclaimer: 'Streamed via youtube-nocookie.com. No third-party tracking scripts loaded prior to play.',
    },
    es: {
      badge: 'MATERIAL OFICIAL',
      heading: 'Tráiler de Presentación',
      subheading:
        'Disfruta del primer vistazo oficial al estado de Leonida, Vice City y los protagonistas Jason y Lucia.',
      playAction: 'Reproducir Tráiler Oficial',
      watchOnYoutube: 'Ver en YouTube (Restricción de edad)',
      disclaimer: 'Transmitido vía youtube-nocookie.com. Sin cookies de terceros antes de reproducir.',
    },
  }[lang] || {
    badge: 'OFFICIAL MEDIA',
    heading: 'Reveal Trailer',
    subheading: 'Watch the official first look at Leonida.',
    playAction: 'Play Official Trailer',
    watchOnYoutube: 'Watch on YouTube',
    disclaimer: 'Streamed via youtube-nocookie.com',
  };

  const handlePlay = () => {
    setIsPlaying(true);
    trackEvent('trailer_play', { videoId: trailer.youtubeId });
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2230]/80 border border-[#ff2a85]/30 text-[#ff2a85] text-xs font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,42,133,0.15)]">
          <Film className="w-3.5 h-3.5" />
          <span>{content.badge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
          {content.heading}
        </h2>
        <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
          {content.subheading}
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0f1118] shadow-2xl">
        <div className="relative aspect-video w-full">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={trailer.title[lang] || trailer.title.en}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div
              onClick={handlePlay}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer group bg-gradient-to-br from-[#121420] via-[#1a1329] to-[#0a0b10] select-none p-6"
            >
              {/* CSS Decorative Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ff2a85 1px, transparent 1px), linear-gradient(to bottom, #00e5ff 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Ambient Glow */}
              <div className="absolute w-72 h-72 rounded-full bg-[#ff2a85]/15 blur-3xl group-hover:bg-[#ff2a85]/25 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <button
                  type="button"
                  aria-label={content.playAction}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#ff2a85] to-[#ff7300] flex items-center justify-center text-white shadow-[0_0_35px_rgba(255,42,133,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(255,42,133,0.8)] transition-all duration-300 mb-6"
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-white ml-1.5" />
                </button>

                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38f8ff] tracking-wider uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{trailer.views}</span>
                  <span className="text-slate-400">•</span>
                  <span>{trailer.releaseDate}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2 max-w-xl">
                  {trailer.title[lang] || trailer.title.en}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 max-w-lg mb-6">
                  {trailer.subtitle[lang] || trailer.subtitle.en}
                </p>

                <div className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/10 transition-colors">
                  {content.playAction}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls & Age-restricted fallback */}
        <div className="p-4 bg-[#141622] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-400 text-center sm:text-left">
            {content.disclaimer}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${trailer.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#00e5ff] transition-colors font-medium whitespace-nowrap"
          >
            <span>{content.watchOnYoutube}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
