import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export interface SourceItem {
  label: string;
  url: string;
}

export interface SourceLineProps {
  sources: SourceItem[];
  note?: string;
  lang?: Language;
  className?: string;
}

/**
 * Componente SourceLine (Server Component): Renderiza links para fontes oficiais
 * com rigor editorial e nota sobre conteúdo parafraseado.
 */
export const SourceLine: React.FC<SourceLineProps> = ({
  sources,
  note,
  lang = 'pt-BR',
  className = '',
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const dict = getDictionary(lang);
  const defaultNote = dict.sourceLine?.defaultNote || 'Descrições parafraseadas de fontes oficiais';
  const labelSources = dict.sourceLine?.label || 'Fontes:';

  return (
    <div
      className={`pt-2.5 mt-2 border-t border-[#1e2230] text-xs font-mono text-slate-400 space-y-1.5 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
          <BookOpen size={12} className="text-[#38f8ff]" />
          <span>{labelSources}</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {sources.map((src, index) => (
            <a
              key={index}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161a26] hover:bg-[#1e2436] text-[#38f8ff] hover:text-white border border-[#38f8ff]/30 hover:border-[#38f8ff] text-[11px] transition-colors"
              title={src.url}
            >
              <span>{src.label}</span>
              <ExternalLink size={10} className="shrink-0" />
            </a>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-slate-500 italic">
        {note || defaultNote}
      </p>
    </div>
  );
};
