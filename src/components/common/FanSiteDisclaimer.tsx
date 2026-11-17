import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Language } from '@/types';

interface FanSiteDisclaimerProps {
  lang: Language;
  variant?: 'banner' | 'footer' | 'inline';
  className?: string;
}

export const FanSiteDisclaimer: React.FC<FanSiteDisclaimerProps> = ({
  lang,
  variant = 'banner',
  className = '',
}) => {
  const disclaimerText = {
    'pt-BR': {
      title: 'Aviso Legal de Fãs',
      text: 'GTAVIMap é um site de fãs e projeto comunitário de pesquisa cartográfica independente e não oficial. Não possui qualquer vínculo comercial, afiliação, autorização, patrocínio ou endosso por parte da Rockstar Games ou Take-Two Interactive. "Grand Theft Auto", "GTA VI", "Vice City" e logotipos relacionados são marcas registradas de propriedade da Take-Two Interactive Software, Inc.',
    },
    en: {
      title: 'Fan Project Disclaimer',
      text: 'GTAVIMap is an independent, unofficial fan site and community mapping research project. It is not affiliated with, endorsed, sponsored, authorized, or approved by Rockstar Games or Take-Two Interactive. "Grand Theft Auto", "GTA VI", "Vice City", and associated logos are registered trademarks of Take-Two Interactive Software, Inc.',
    },
    es: {
      title: 'Aviso Legal de Sitio de Fans',
      text: 'GTAVIMap es un sitio web independiente y no oficial creado por fans para la investigación cartográfica comunitaria. No está afiliado, respaldado, autorizado ni patrocinado por Rockstar Games ni Take-Two Interactive. "Grand Theft Auto", "GTA VI", "Vice City" y los logotipos asociados son marcas registradas de Take-Two Interactive Software, Inc.',
    },
  }[lang] || {
    title: 'Fan Project Disclaimer',
    text: 'GTAVIMap is an independent, unofficial fan site and community mapping research project. It is not affiliated with, endorsed, sponsored, authorized, or approved by Rockstar Games or Take-Two Interactive. "Grand Theft Auto", "GTA VI", and associated logos are registered trademarks of Take-Two Interactive Software, Inc.',
  };

  if (variant === 'footer') {
    return (
      <p className={`text-[11px] text-slate-400 leading-relaxed ${className}`}>
        {disclaimerText.text}
      </p>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`text-xs text-slate-300 ${className}`}>
        {disclaimerText.text}
      </span>
    );
  }

  // Variant 'banner'
  return (
    <aside
      role="note"
      aria-label={disclaimerText.title}
      className={`rounded-xl p-4 sm:p-5 bg-[#12141f] border border-amber-500/20 text-slate-300 text-xs flex items-start gap-3.5 ${className}`}
    >
      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">
          {disclaimerText.title}
        </h4>
        <p className="leading-relaxed text-slate-300 text-xs">
          {disclaimerText.text}
        </p>
      </div>
    </aside>
  );
};
