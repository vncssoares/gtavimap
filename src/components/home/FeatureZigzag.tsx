import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Users, AlertCircle, Compass } from 'lucide-react';
import { Language, GameplayItem } from '@/types';
import { getDictionary, formatReviewDate } from '@/i18n/translations';
import { getGameplayItems, LAST_REVIEWED_GAMEPLAY_ISO } from '@/data/gameplay';

interface FeatureZigzagProps {
  lang: Language;
}

/**
 * Ilustrações vetoriais geométricas próprias em SVG/CSS puro.
 * Nenhuma arte ou screenshot proprietária de terceiros.
 */
const IllustrationHeist = () => (
  <svg
    viewBox="0 0 500 320"
    className="w-full h-full select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hz-heist-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff2a85" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#38f8ff" stopOpacity="0.8" />
      </linearGradient>
      <pattern id="hz-heist-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </pattern>
    </defs>

    {/* Fundo técnico com grade */}
    <rect width="500" height="320" rx="16" fill="#0d1017" />
    <rect width="500" height="320" rx="16" fill="url(#hz-heist-grid)" />

    {/* Radar / Círculos de perímetro de segurança */}
    <circle cx="250" cy="160" r="110" stroke="#222738" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx="250" cy="160" r="70" stroke="#ff2a85" strokeWidth="1.5" strokeOpacity="0.4" />
    <circle cx="250" cy="160" r="30" stroke="#38f8ff" strokeWidth="1.5" strokeOpacity="0.6" />

    {/* Planta arquitetônica estilizada */}
    <rect x="150" y="80" width="200" height="160" rx="8" stroke="#38f8ff" strokeWidth="2" strokeOpacity="0.5" fill="#121622" fillOpacity="0.6" />
    <path d="M 150 140 L 350 140" stroke="#2a3045" strokeWidth="1.5" />
    <path d="M 230 80 L 230 240" stroke="#2a3045" strokeWidth="1.5" />

    {/* Rota tática de fuga */}
    <path
      d="M 170 210 Q 210 180 250 160 T 330 110"
      fill="none"
      stroke="url(#hz-heist-grad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />

    {/* Ponto de Incursão */}
    <circle cx="170" cy="210" r="6" fill="#ff2a85" />
    <circle cx="170" cy="210" r="12" stroke="#ff2a85" strokeWidth="1.5" strokeOpacity="0.5" />

    {/* Cofre / Objetivo Central */}
    <rect x="238" y="148" width="24" height="24" rx="4" fill="#38f8ff" fillOpacity="0.2" stroke="#38f8ff" strokeWidth="2" />
    <circle cx="250" cy="160" r="4" fill="#38f8ff" />

    {/* Ponto de Extração */}
    <circle cx="330" cy="110" r="6" fill="#38f8ff" />
    <circle cx="330" cy="110" r="12" stroke="#38f8ff" strokeWidth="1.5" strokeOpacity="0.5" />

    {/* Etiquetas digitais de telemetria */}
    <text x="180" y="235" fill="#ff4d9e" fontSize="10" fontFamily="monospace" fontWeight="bold">PONTO DE INGRESSO</text>
    <text x="270" y="105" fill="#38f8ff" fontSize="10" fontFamily="monospace" fontWeight="bold">EXTRAÇÃO TÁTICA</text>
    <text x="25" y="40" fill="#94a3b8" fontSize="11" fontFamily="monospace">LEONIDA SECURITY GRID // SYS-01</text>
  </svg>
);

const IllustrationTuning = () => (
  <svg
    viewBox="0 0 500 320"
    className="w-full h-full select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hz-tuning-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38f8ff" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#ff2a85" />
      </linearGradient>
      <pattern id="hz-tuning-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </pattern>
    </defs>

    {/* Fundo técnico */}
    <rect width="500" height="320" rx="16" fill="#0d1017" />
    <rect width="500" height="320" rx="16" fill="url(#hz-tuning-grid)" />

    {/* Tacômetro Vetorial / Gauge */}
    <path
      d="M 170 210 A 100 100 0 1 1 330 210"
      fill="none"
      stroke="#1f2538"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <path
      d="M 170 210 A 100 100 0 1 1 290 120"
      fill="none"
      stroke="url(#hz-tuning-grad)"
      strokeWidth="16"
      strokeLinecap="round"
    />

    {/* Ponteiro de rotação */}
    <line x1="250" y1="200" x2="280" y2="135" stroke="#ff2a85" strokeWidth="3" strokeLinecap="round" />
    <circle cx="250" cy="200" r="10" fill="#121622" stroke="#38f8ff" strokeWidth="3" />

    {/* Traçado aerodinâmico esportivo */}
    <path
      d="M 60 260 C 130 250, 180 230, 240 230 C 320 230, 390 250, 440 260"
      fill="none"
      stroke="#38f8ff"
      strokeWidth="2.5"
      strokeOpacity="0.7"
    />
    <path
      d="M 100 245 C 160 235, 200 215, 250 215 C 310 215, 360 235, 410 245"
      fill="none"
      stroke="#ff2a85"
      strokeWidth="2"
      strokeOpacity="0.5"
    />

    {/* Indicadores numéricos de telemetria */}
    <text x="250" y="185" textAnchor="middle" fill="#ffffff" fontSize="22" fontFamily="monospace" fontWeight="900">7.2K</text>
    <text x="250" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">RPM / TELEMETRIA</text>
    <text x="25" y="40" fill="#94a3b8" fontSize="11" fontFamily="monospace">DYNAMICS & TUNING TELEMETRY // SPEC-04</text>
    <text x="350" y="285" fill="#38f8ff" fontSize="10" fontFamily="monospace">PERFORMANCE MODS: ACTIVE</text>
  </svg>
);

const IllustrationWildlife = () => (
  <svg
    viewBox="0 0 500 320"
    className="w-full h-full select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hz-wild-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#38f8ff" />
      </linearGradient>
    </defs>
    <rect width="500" height="320" rx="16" fill="#0d1017" />
    <circle cx="250" cy="160" r="90" stroke="#1f293d" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M 120 220 Q 250 140 380 220" stroke="url(#hz-wild-grad)" strokeWidth="3" fill="none" />
    <circle cx="250" cy="160" r="8" fill="#10b981" />
    <circle cx="250" cy="160" r="18" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />
    <text x="25" y="40" fill="#94a3b8" fontSize="11" fontFamily="monospace">FAUNA & HABITAT SENSOR // FL-02</text>
  </svg>
);

const getIllustration = (type: GameplayItem['illustration']) => {
  switch (type) {
    case 'heist':
      return <IllustrationHeist />;
    case 'tuning':
      return <IllustrationTuning />;
    default:
      return <IllustrationWildlife />;
  }
};

export const FeatureZigzag: React.FC<FeatureZigzagProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const items = getGameplayItems();
  const normalizedLang = lang.toLowerCase();
  const formattedReviewDate = formatReviewDate(LAST_REVIEWED_GAMEPLAY_ISO, lang);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-[#222433]">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38f8ff] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38f8ff]">
              LEONIDA GAMEPLAY DATABASE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {dict.gameplaySection.title}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {dict.gameplaySection.subtitle}
          </p>
        </div>

        {/* Data da Última Revisão */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12131a] border border-[#222433] text-xs font-mono text-slate-300 self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>{dict.gameplaySection.reviewedAt.replace('{date}', formattedReviewDate)}</span>
        </div>
      </div>

      {/* Conteúdo: Zigue-zague ou Estado de Produção sem Itens */}
      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0e1017] border border-[#222433] text-center space-y-3 max-w-2xl mx-auto">
          <Compass className="w-8 h-8 text-[#38f8ff] mx-auto opacity-70" />
          <p className="text-sm text-slate-300 leading-relaxed">
            {dict.gameplaySection.emptyProductionNotice}
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {items.map((item, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={item.id}
                className={`flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 lg:gap-12`}
              >
                {/* Ilustração Técnica Própria */}
                <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden border border-[#222433] shadow-xl shadow-black/40 bg-[#0d1017]">
                  {getIllustration(item.illustration)}
                </div>

                {/* Bloco de Texto e Ações */}
                <div className="w-full lg:w-1/2 space-y-4">
                  {/* Badges de Confiança e Placeholder */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.confidence === 'official' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/30 text-xs font-mono font-bold uppercase tracking-wider">
                        <ShieldCheck size={13} />
                        <span>{dict.gameplaySection.officialBadge}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/30 text-xs font-mono font-bold uppercase tracking-wider">
                        <Users size={13} />
                        <span>{dict.gameplaySection.communityBadge}</span>
                      </span>
                    )}

                    {item.placeholder && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-black uppercase tracking-wider">
                        <AlertCircle size={11} />
                        <span>{dict.gameplaySection.placeholderBadge}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {item.title[lang] || item.title.en}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.summary[lang] || item.summary.en}
                  </p>

                  {/* Botão de Redirecionamento Filtrado para o Mapa (?c=<categoryId>) */}
                  <div className="pt-2">
                    <Link
                      href={`/${normalizedLang}/map?c=${item.categoryId}`}
                      className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#161a26] hover:bg-[#1e2334] text-white hover:text-[#38f8ff] text-xs font-black uppercase tracking-wider border border-white/10 hover:border-[#38f8ff]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                    >
                      <span>{dict.gameplaySection.viewInMap}</span>
                      <ArrowUpRight size={16} className="text-[#38f8ff]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
