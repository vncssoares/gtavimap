import React from 'react';
import { Play, ExternalLink, Film } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import {
  getVisibleHighlights,
  ROCKSTAR_OFFICIAL_TRAILER_URL,
} from '@/data/highlights';

export interface TimestampedHighlightsProps {
  lang: Language;
  className?: string;
}

/**
 * Componente TimestampedHighlights (Server Component): Tabela editorial com
 * momentos-chave e timestamps exatos apontando diretamente para o vídeo oficial da Rockstar.
 * Zero incorporação de vídeos pesados (sem iframes / zero overhead de terceiros).
 */
export const TimestampedHighlights: React.FC<TimestampedHighlightsProps> = ({
  lang,
  className = '',
}) => {
  const dict = getDictionary(lang);
  const items = getVisibleHighlights();

  if (items.length === 0) {
    return null;
  }

  const title = dict.highlights?.title || 'Linha do Tempo e Destaques do Trailer';
  const subtitle =
    dict.highlights?.subtitle ||
    'Timestamps diretos para os momentos-chave do trailer oficial da Rockstar Games.';
  const colTime = dict.highlights?.colTime || 'Timestamp';
  const colDescription = dict.highlights?.colDescription || 'Cena e Detalhes';
  const colLink = dict.highlights?.colLink || 'Assistir';
  const officialTrailerNotice =
    dict.highlights?.officialTrailerNotice ||
    'Todos os links redirecionam diretamente para o vídeo oficial da Rockstar Games no YouTube.';

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Film size={18} className="text-[#ff2a85]" />
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {title}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#222433] bg-[#0e1017]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#222433] bg-[#141622] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th scope="col" className="px-4 py-3 w-28 font-bold">
                {colTime}
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                {colDescription}
              </th>
              <th scope="col" className="px-4 py-3 w-32 text-right font-bold">
                {colLink}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2230] text-slate-300">
            {items.map((item) => {
              const itemTitle = item.title[lang] || item.title.en;
              const itemDesc = item.description[lang] || item.description.en;
              const youtubeUrl = `${ROCKSTAR_OFFICIAL_TRAILER_URL}&t=${item.seconds}s`;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#161824] transition-colors group"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[#38f8ff] whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161a26] border border-[#38f8ff]/30 group-hover:border-[#38f8ff]">
                      <Play size={10} className="fill-[#38f8ff] text-[#38f8ff]" />
                      <span>{item.timestamp}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 space-y-0.5">
                    <span className="font-bold text-white block group-hover:text-[#38f8ff] transition-colors">
                      {itemTitle}
                    </span>
                    <span className="text-slate-400 text-xs block leading-relaxed">
                      {itemDesc}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1d2c] hover:bg-[#ff2a85] text-slate-200 hover:text-white border border-[#2c3149] hover:border-[#ff2a85] text-xs font-mono font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                      aria-label={`${itemTitle} (${item.timestamp}) no YouTube`}
                    >
                      <span>YouTube</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] font-mono text-slate-500 italic">
        {officialTrailerNotice}
      </p>
    </div>
  );
};
