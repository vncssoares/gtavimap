import React from 'react';
import { ExternalLink, Database, AlertCircle, ShieldCheck, Users, HelpCircle } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { getQuickFacts } from '@/data/quickFacts';

interface QuickFactsProps {
  lang: Language;
}

/**
 * Seção QuickFacts (Server Component): Tabela de especificações essenciais do jogo.
 * Itens marcados como placeholder: true são renderizados exclusivamente em desenvolvimento
 * com aviso visual. Em ambiente de produção, itens placeholder nunca são renderizados.
 */
export const QuickFacts: React.FC<QuickFactsProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const items = getQuickFacts();

  // Em produção, se não houver fatos confirmados sem placeholder, a seção não renderiza
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto border-t border-[#222433]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#38f8ff]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38f8ff]">
              DATABASE SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            {dict.quickFacts.title}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {dict.quickFacts.subtitle}
          </p>
        </div>
      </div>

      {/* Tabela Responsiva de Especificações */}
      <div className="overflow-x-auto rounded-2xl border border-[#24283b] bg-[#0c0e15] shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#24283b] bg-[#12141f] text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">{dict.quickFacts.colFeature}</th>
              <th className="py-3.5 px-4 sm:px-6">{dict.quickFacts.colDetail}</th>
              <th className="py-3.5 px-4 sm:px-6 text-right sm:text-left">
                {dict.quickFacts.colStatus}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2233] text-xs sm:text-sm">
            {items.map((item) => {
              const label = item.label[lang] || item.label.en;
              const value = item.value[lang] || item.value.en;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#141824]/60 transition-colors"
                >
                  {/* Característica */}
                  <td className="py-4 px-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                    {label}
                  </td>

                  {/* Valor / Detalhes */}
                  <td className="py-4 px-4 sm:px-6 text-slate-300">
                    <span className="font-mono text-xs sm:text-sm">{value}</span>
                    {item.placeholder && (
                      <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-black uppercase">
                        <AlertCircle size={10} />
                        <span>PLACEHOLDER</span>
                      </span>
                    )}
                  </td>

                  {/* Confiança e Link para Fonte Oficial */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 sm:justify-start justify-end">
                      {item.confidence === 'official' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-[11px] font-mono font-bold uppercase">
                          <ShieldCheck size={12} className="shrink-0 text-[#10b981]" />
                          <span>{dict.quickFacts.officialSource}</span>
                        </span>
                      )}

                      {item.confidence === 'community_estimate' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30 text-[11px] font-mono font-bold uppercase">
                          <Users size={12} className="shrink-0 text-[#c084fc]" />
                          <span>{dict.quickFacts.communityEstimate}</span>
                        </span>
                      )}

                      {item.confidence === 'unconfirmed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00e5ff]/15 text-[#38f8ff] border border-[#00e5ff]/30 text-[11px] font-mono font-bold uppercase">
                          <HelpCircle size={12} className="shrink-0 text-[#00e5ff]" />
                          <span>{dict.quickFacts.unconfirmed}</span>
                        </span>
                      )}

                      {/* Link da fonte oficial se fornecido */}
                      {item.source && (
                        <a
                          href={item.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#181b28] hover:bg-[#202538] text-slate-400 hover:text-[#38f8ff] text-[11px] font-mono border border-white/5 transition-colors"
                          title={item.source}
                        >
                          <ExternalLink size={12} />
                          <span className="sr-only sm:not-sr-only">Link</span>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
