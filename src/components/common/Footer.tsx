'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Cookie } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { openConsentBanner } from '@/lib/consent';
import { FanSiteDisclaimer } from './FanSiteDisclaimer';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const langPrefix = `/${lang.toLowerCase()}`;

  const legalLabels = {
    'pt-BR': {
      legalTitle: 'Legal & Contato',
      terms: 'Termos de Uso',
      privacy: 'Política de Privacidade',
      contact: 'Contato & Remoção',
      manageCookies: 'Gerenciar cookies',
      navigation: 'Navegação',
      transparency: 'Transparência',
    },
    en: {
      legalTitle: 'Legal & Contact',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      contact: 'Contact & Takedowns',
      manageCookies: 'Manage cookies',
      navigation: 'Navigation',
      transparency: 'Transparency',
    },
    es: {
      legalTitle: 'Legal y Contacto',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      contact: 'Contacto y Retirada',
      manageCookies: 'Gestionar cookies',
      navigation: 'Navegación',
      transparency: 'Transparencia',
    },
  }[lang] || {
    legalTitle: 'Legal & Contact',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    contact: 'Contact & Takedowns',
    manageCookies: 'Manage cookies',
    navigation: 'Navigation',
    transparency: 'Transparency',
  };

  return (
    <footer className="w-full bg-[#090a0e] border-t border-[#222433] text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Marca & Propósito */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff2a85] via-[#a855f7] to-[#00e5ff] flex items-center justify-center font-black text-black text-xs">
                VI
              </div>
              <span className="text-lg font-black text-white">
                GTAVI<span className="text-[#ff2a85]">Map</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {dict.common.tagline}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#38f8ff] font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#38f8ff] animate-pulse" />
              <span>{dict.footer.architecture}</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px]">
              {legalLabels.navigation}
            </h4>
            <ul className="space-y-1 font-mono text-[11px]">
              <li>
                <Link href={`${langPrefix}`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/map`} className="min-h-[44px] inline-flex items-center hover:text-[#ff2a85] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {dict.nav.map}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/categories`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {dict.nav.categories}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/characters`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {dict.nav.characters}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/premium`} className="min-h-[44px] inline-flex items-center hover:text-[#ff2a85] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {dict.nav.premium}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Legal & Contato */}
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px]">
              {legalLabels.legalTitle}
            </h4>
            <ul className="space-y-1 font-mono text-[11px]">
              <li>
                <Link href={`${langPrefix}/terms`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {legalLabels.terms}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/privacy`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {legalLabels.privacy}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/contact`} className="min-h-[44px] inline-flex items-center hover:text-[#00e5ff] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38f8ff]">
                  {legalLabels.contact}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openConsentBanner()}
                  className="inline-flex items-center gap-1.5 min-h-[44px] hover:text-[#ff2a85] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                >
                  <Cookie className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>{legalLabels.manageCookies}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Transparência */}
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px]">
              {legalLabels.transparency}
            </h4>
            <div className="p-3 rounded-lg bg-[#12131a] border border-[#222433] space-y-1">
              <div className="flex items-center gap-1.5 text-[#ff4d9e] font-black text-[10px] uppercase font-mono">
                <ShieldAlert size={13} />
                <span>Base Demonstrativa</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                {dict.common.demoNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Legal Reutilizável */}
        <div className="pt-6 border-t border-[#181922] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="max-w-3xl text-center md:text-left">
            <FanSiteDisclaimer lang={lang} variant="footer" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
            © 2026 GTAVIMap • {dict.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
};
