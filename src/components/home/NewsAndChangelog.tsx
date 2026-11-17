import React from 'react';
import Link from 'next/link';
import { ExternalLink, Calendar, Gamepad2, Globe, AlertCircle, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary, formatReviewDate } from '@/i18n/translations';
import { getNewsItems, LAST_REVIEWED_NEWS_ISO } from '@/data/news';
import { FreshnessBadge } from '@/components/common/FreshnessBadge';

interface NewsAndChangelogProps {
  lang: Language;
}

export const NewsAndChangelog: React.FC<NewsAndChangelogProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const items = getNewsItems();
  const homeCards = items.slice(0, 3);
  const normalizedLang = lang.toLowerCase();
  const formattedReviewDate = formatReviewDate(LAST_REVIEWED_NEWS_ISO, lang);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-[#222433]">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4d9e]">
              UPDATES & DISPATCHES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {dict.newsSection.title}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {dict.newsSection.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Data da Última Revisão */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12131a] border border-[#222433] text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>{dict.newsSection.reviewedAt.replace('{date}', formattedReviewDate)}</span>
          </div>

          {/* Botão Ver Tudo para /[lang]/news */}
          <Link
            href={`/${normalizedLang}/news`}
            className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-[#161a26] hover:bg-[#1e2334] text-white hover:text-[#38f8ff] text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#38f8ff]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <span>{dict.newsSection.viewAll}</span>
            <ArrowRight size={14} className="text-[#38f8ff]" />
          </Link>
        </div>
      </div>

      {/* Grid com no máximo 3 cards na Home */}
      {homeCards.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0e1017] border border-[#222433] text-center max-w-xl mx-auto">
          <p className="text-sm text-slate-300">{dict.newsSection.emptyProductionNotice}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeCards.map((item) => {
            const formattedItemDate = formatReviewDate(item.publishedAt, lang);

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#0e1017] border border-[#222433] hover:border-[#38f8ff]/40 transition-all shadow-lg shadow-black/20"
              >
                <div className="space-y-4">
                  {/* Badges de Tipo, Confiança e Data */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.kind === 'game' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#ff2a85]/15 text-[#ff4d9e] border border-[#ff2a85]/30 text-[10px] font-mono font-black uppercase">
                          <Gamepad2 size={11} />
                          <span>{dict.newsSection.gameBadge}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#38f8ff]/15 text-[#38f8ff] border border-[#38f8ff]/30 text-[10px] font-mono font-black uppercase">
                          <Globe size={11} />
                          <span>{dict.newsSection.siteBadge}</span>
                        </span>
                      )}

                      {item.confidence === 'official' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-[10px] font-mono font-bold uppercase">
                          <ShieldCheck size={11} />
                          <span>{dict.newsSection.officialBadge}</span>
                        </span>
                      )}

                      {item.confidence === 'community_analysis' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30 text-[10px] font-mono font-bold uppercase">
                          <Users size={11} />
                          <span>{dict.newsSection.communityBadge}</span>
                        </span>
                      )}

                      {item.placeholder && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-black uppercase">
                          <AlertCircle size={10} />
                          <span>{dict.newsSection.placeholderBadge}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <FreshnessBadge date={item.publishedAt} lang={lang} />
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formattedItemDate}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug line-clamp-2">
                    {item.title[lang] || item.title.en}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {item.summary[lang] || item.summary.en}
                  </p>
                </div>

                {/* Link da Fonte Oficial se existir */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono font-bold text-[#38f8ff] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                      aria-label={`${dict.newsSection.readSource}: ${item.title[lang] || item.title.en}`}
                    >
                      <span>{dict.newsSection.readSource}</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">
                      GTAVIMap Changelog
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
