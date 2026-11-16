'use client';

import React, { useState } from 'react';
import { Code, CheckCheck } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

interface EmbedSnippetButtonProps {
  lang: Language;
  type: 'marker' | 'category';
  id: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact';
}

export const EmbedSnippetButton: React.FC<EmbedSnippetButtonProps> = ({
  lang,
  type,
  id,
  className = '',
  variant = 'secondary',
}) => {
  const [copied, setCopied] = useState(false);
  const dict = getDictionary(lang);

  const handleCopyEmbed = async () => {
    if (typeof window === 'undefined') return;

    const origin = window.location.origin || 'https://gtavimap.com';
    const paramKey = type === 'marker' ? 'm' : 'c';
    const embedUrl = `${origin}/embed/${lang.toLowerCase()}/map?${paramKey}=${encodeURIComponent(id)}`;
    const iframeSnippet = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(iframeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy iframe snippet:', err);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopyEmbed}
        type="button"
        title={dict.common.embedDesc}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#2d3042] bg-[#1a1c27] hover:border-[#00e5ff] text-xs font-mono text-slate-300 transition-colors ${className}`}
      >
        {copied ? (
          <>
            <CheckCheck size={13} className="text-[#00e5ff]" />
            <span className="text-[#00e5ff] font-bold">{dict.common.embedCopied}</span>
          </>
        ) : (
          <>
            <Code size={13} className="text-slate-400" />
            <span>{dict.common.embed}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopyEmbed}
      type="button"
      title={dict.common.embedDesc}
      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-[#2d3042] bg-[#12131a] hover:bg-[#1a1c27] hover:border-[#00e5ff] text-xs font-bold uppercase tracking-wider text-slate-200 transition-all shadow-md active:scale-98 ${className}`}
    >
      <span className="flex items-center gap-2">
        <Code size={15} className="text-[#00e5ff]" />
        <span>{dict.common.embed}</span>
      </span>

      {copied ? (
        <span className="text-[11px] font-mono text-[#00e5ff] font-bold flex items-center gap-1 animate-in fade-in">
          <CheckCheck size={14} />
          {dict.common.embedCopied}
        </span>
      ) : (
        <span className="text-[10px] font-mono text-slate-400 font-bold">&lt;IFRAME&gt;</span>
      )}
    </button>
  );
};
