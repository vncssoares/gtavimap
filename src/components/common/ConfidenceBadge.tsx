import React from 'react';
import { ShieldCheck, Eye, HelpCircle } from 'lucide-react';
import { ConfirmationStatus, Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export interface ConfidenceBadgeProps {
  status: ConfirmationStatus;
  lang: Language;
  className?: string;
  showIcon?: boolean;
}

/**
 * Componente ConfidenceBadge reutilizável para exibição do status de confirmação
 * de marcadores e dados nos 3 idiomas (verified, trailer_rumor, demo, unconfirmed).
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  status,
  lang,
  className = '',
  showIcon = true,
}) => {
  const dict = getDictionary(lang);

  switch (status) {
    case 'verified':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-[11px] font-mono font-bold tracking-wide uppercase ${className}`}
          title={dict.confidenceBadges.verified}
        >
          {showIcon && <ShieldCheck size={13} className="shrink-0 text-[#10b981]" />}
          <span>{dict.confidenceBadges.verified}</span>
        </span>
      );

    case 'trailer_rumor':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30 text-[11px] font-mono font-bold tracking-wide uppercase ${className}`}
          title={dict.confidenceBadges.trailer_rumor}
        >
          {showIcon && <Eye size={13} className="shrink-0 text-[#f59e0b]" />}
          <span>{dict.confidenceBadges.trailer_rumor}</span>
        </span>
      );

    case 'demo':
    case 'unconfirmed':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00e5ff]/15 text-[#38f8ff] border border-[#00e5ff]/30 text-[11px] font-mono font-bold tracking-wide uppercase ${className}`}
          title={dict.confidenceBadges.demo_unconfirmed}
        >
          {showIcon && <HelpCircle size={13} className="shrink-0 text-[#00e5ff]" />}
          <span>{dict.confidenceBadges.demo_unconfirmed}</span>
        </span>
      );
  }
};
