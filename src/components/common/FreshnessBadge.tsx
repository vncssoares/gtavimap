import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '@/types';
import { siteConfig } from '@/config/siteConfig';
import { getDictionary } from '@/i18n/translations';

export interface FreshnessBadgeProps {
  date: string; // ISO 8601 string
  lang?: Language;
  className?: string;
  daysThreshold?: number;
}

function checkIsFresh(dateStr: string, thresholdDays: number): boolean {
  try {
    const itemTimestamp = new Date(dateStr).getTime();
    if (isNaN(itemTimestamp)) return false;

    // Utiliza a data de referência estável do site para compatibilidade com cacheComponents do Next.js 16
    const referenceTimestamp = new Date(siteConfig.buildTimeIso).getTime();
    const diffMs = referenceTimestamp - itemTimestamp;
    const maxAgeMs = thresholdDays * 24 * 60 * 60 * 1000;

    return diffMs >= 0 && diffMs <= maxAgeMs;
  } catch {
    return false;
  }
}

/**
 * Selo "NOVO" / "NEW" / "NUEVO" que desaparece automaticamente após N dias
 * (N configurável em siteConfig.freshnessDaysThreshold, padrão 14 dias).
 */
export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  date,
  lang = 'pt-BR',
  className = '',
  daysThreshold,
}) => {
  if (!date) return null;

  const threshold = daysThreshold ?? siteConfig.freshnessDaysThreshold ?? 14;
  const isFresh = checkIsFresh(date, threshold);

  if (!isFresh) {
    return null;
  }

  const dict = getDictionary(lang);
  const label = dict.freshnessBadge || 'NOVO';

  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gradient-to-r from-[#ff2a85] to-[#a855f7] text-white text-[9px] font-mono font-black tracking-wider uppercase shadow-[0_0_10px_rgba(255,42,133,0.35)] ${className}`}
      title={`${label} (< ${threshold} dias)`}
    >
      <Sparkles size={9} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
};
