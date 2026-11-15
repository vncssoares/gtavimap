import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const langPrefix = `/${lang.toLowerCase()}`;

  return (
    <footer className="w-full bg-[#090a0e] border-t border-[#222433] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Marca & Propósito */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff2a85] via-[#a855f7] to-[#00e5ff] flex items-center justify-center font-black text-black text-xs">
                VI
              </div>
              <span className="text-lg font-black text-white">
                GTAVI<span className="text-[#ff2a85]">Map</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {dict.common.tagline}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#00e5ff] font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
              <span>{dict.footer.architecture}</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px]">
              Navegação
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href={`${langPrefix}`} className="hover:text-[#00e5ff] transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/map`} className="hover:text-[#ff2a85] transition-colors">
                  {dict.nav.map}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/categories`} className="hover:text-[#00e5ff] transition-colors">
                  {dict.nav.categories}
                </Link>
              </li>
              <li>
                <Link href={`${langPrefix}/premium`} className="hover:text-[#ff2a85] transition-colors">
                  {dict.nav.premium}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Transparência */}
          <div className="space-y-2">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px]">
              Transparência
            </h4>
            <div className="p-3 rounded-lg bg-[#12131a] border border-[#222433] space-y-1">
              <div className="flex items-center gap-1.5 text-[#ff2a85] font-black text-[10px] uppercase font-mono">
                <ShieldAlert size={13} />
                <span>Base Demonstrativa</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {dict.common.demoNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Legal */}
        <div className="pt-6 border-t border-[#181922] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-500 max-w-3xl text-center md:text-left leading-relaxed">
            {dict.footer.disclaimer}
          </p>
          <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
            © 2026 GTAVIMap • {dict.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
};
