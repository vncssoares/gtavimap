import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export interface UnconfirmedItem {
  text: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface UnconfirmedCalloutProps {
  items: UnconfirmedItem[];
  lang?: Language;
  title?: string;
  className?: string;
}

/**
 * Componente UnconfirmedCallout (Server Component): Exibe caixa destacada
 * de transparência editorial para fatos ou elementos divulgados pela comunidade
 * mas ainda não confirmados oficialmente pela Rockstar Games.
 */
export const UnconfirmedCallout: React.FC<UnconfirmedCalloutProps> = ({
  items,
  lang = 'pt-BR',
  title,
  className = '',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const dict = getDictionary(lang);
  const calloutTitle =
    title ||
    dict.unconfirmedCallout?.title ||
    'Divulgado, mas não confirmado oficialmente';
  const sourcePrefix = dict.unconfirmedCallout?.sourcePrefix || 'Origem:';

  return (
    <aside
      className={`rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 text-amber-200/90 space-y-3 ${className}`}
      aria-label={calloutTitle}
    >
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-400 shrink-0" />
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
          {calloutTitle}
        </h4>
      </div>

      <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-amber-400/80 mt-1 shrink-0 font-mono text-[10px]">
              •
            </span>
            <div className="space-y-0.5">
              <span>{item.text}</span>
              {item.sourceLabel && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500">{sourcePrefix}</span>
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300/90 underline hover:text-amber-200 transition-colors inline-flex items-center gap-0.5"
                    >
                      <span>{item.sourceLabel}</span>
                    </a>
                  ) : (
                    <span>{item.sourceLabel}</span>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
