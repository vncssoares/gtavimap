'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Menu, X } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ lang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(lang);

  const langPrefix = `/${lang.toLowerCase()}`;

  const navLinks = [
    { href: `${langPrefix}`, label: dict.nav.home },
    { href: `${langPrefix}/map`, label: dict.nav.map },
    { href: `${langPrefix}/categories`, label: dict.nav.categories },
    { href: `${langPrefix}/characters`, label: dict.nav.characters },
    { href: `${langPrefix}/premium`, label: dict.nav.premium, isHighlight: true },
  ];

  const isActive = (href: string) => {
    if (href === langPrefix) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222433] bg-[#12131a]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href={langPrefix} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2a85] via-[#a855f7] to-[#00e5ff] flex items-center justify-center shadow-lg shadow-[#ff2a85]/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-black text-sm">VI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center">
                  GTAVI<span className="text-[#ff2a85]">Map</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#00e5ff] -mt-1 uppercase">
                  Leonida Interactive
                </span>
              </div>
            </Link>

            {/* Tag Demo */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#ff2a85]/10 text-[#ff2a85] border border-[#ff2a85]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85] animate-pulse"></span>
              {dict.common.demoBadge}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs uppercase font-bold tracking-wider transition-all ${
                    active
                      ? 'bg-[#1c1e2b] text-[#00e5ff] border border-[#00e5ff]/30'
                      : link.isHighlight
                      ? 'text-[#ff2a85] hover:bg-[#ff2a85]/10'
                      : 'text-slate-300 hover:text-white hover:bg-[#181a25]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.isHighlight && <Sparkles size={13} className="text-[#ff2a85]" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Language */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector currentLang={lang} />

            <Link
              href={`${langPrefix}/map`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#ff2a85]/20"
            >
              <Compass size={16} />
              <span>{dict.common.exploreMap}</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector currentLang={lang} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#1a1c27] text-slate-200 hover:text-white border border-[#2d3042] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
              aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#222433] bg-[#12131a] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-all ${
                isActive(link.href)
                  ? 'bg-[#1c1e2b] text-[#00e5ff] border border-[#00e5ff]/30 shadow-md shadow-[#00e5ff]/10'
                  : 'text-slate-300 hover:text-white hover:bg-[#181a25]'
              }`}
            >
              <span className="flex items-center gap-2">
                {link.isHighlight && <Sparkles size={14} className="text-[#ff2a85]" />}
                {link.label}
              </span>
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href={`${langPrefix}/map`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff2a85]/25 active:scale-98 transition-all"
            >
              <Compass size={16} />
              <span>{dict.common.exploreMap}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
