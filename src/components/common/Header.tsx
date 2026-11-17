'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, Sparkles } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { LanguageSelector } from './LanguageSelector';
import { siteConfig } from '@/config/siteConfig';

interface HeaderProps {
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ lang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(lang);

  const langPrefix = `/${lang.toLowerCase()}`;

  // UM único array de links de navegação usado tanto pelo desktop quanto pelo drawer móvel
  // Início, Categorias, Personagens, Premium (sem link "Mapa interativo")
  const NAV_LINKS = [
    { href: `${langPrefix}`, label: dict.nav.home },
    { href: `${langPrefix}/categories`, label: dict.nav.categories },
    { href: `${langPrefix}/characters`, label: dict.nav.characters },
    {
      href: `${langPrefix}/premium`,
      label: dict.nav.premium,
      isPremium: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === langPrefix) return pathname === href;
    return pathname.startsWith(href);
  };

  const isMapActive = pathname.startsWith(`${langPrefix}/map`);

  // Fecha o drawer móvel ao mudar de rota (padrão oficial React para ajuste de estado em render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Fechar o drawer móvel ao pressionar Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/10 bg-[#0a0a0f]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        {/* Layout: Abaixo de lg: flex justify-between; De lg em diante: grid grid-cols-[1fr_auto_1fr] */}
        <div className="flex justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-full gap-4">
          
          {/* ================= ZONA 1: ESQUERDA (LOGO + TAG DEMO) ================= */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link
              href={langPrefix}
              className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] rounded-xl"
              aria-label="GTAVIMap Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2a85] via-[#a855f7] to-[#00e5ff] flex items-center justify-center shadow-lg shadow-[#ff2a85]/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="font-black text-black text-sm">VI</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white flex items-center shrink-0">
                GTAVI<span className="text-[#ff2a85]">Map</span>
              </span>
            </Link>

            {/* Tag compacta DEMO (exibida apenas quando houver dados de demonstração) */}
            {siteConfig.isDemoMode && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                DEMO
              </span>
            )}
          </div>

          {/* ================= ZONA 2: CENTRO (DESKTOP NAV LINKS) ================= */}
          <nav className="hidden lg:flex items-center justify-center gap-1 shrink-0">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const showPremiumBadge = link.isPremium && siteConfig.premiumPaymentsEnabled;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium normal-case whitespace-nowrap transition-all ${
                    active
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : showPremiumBadge
                      ? 'text-[#ff2a85] hover:bg-[#ff2a85]/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {showPremiumBadge && (
                      <Sparkles size={13} className="text-[#ff2a85] shrink-0" />
                    )}
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ================= ZONA 3: DIREITA (DESKTOP SELETOR + CTA) ================= */}
          <div className="hidden lg:flex items-center justify-end gap-3 shrink-0 whitespace-nowrap">
            <LanguageSelector currentLang={lang} />

            <Link
              href={`${langPrefix}/map`}
              aria-current={isMapActive ? 'page' : undefined}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-xl font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] ${
                isMapActive
                  ? 'bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black ring-2 ring-[#38f8ff] shadow-lg shadow-[#00e5ff]/30'
                  : 'bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black hover:opacity-95 shadow-[#ff2a85]/20 hover:scale-[1.02]'
              }`}
            >
              <Compass size={15} className="shrink-0" />
              <span>{dict.common.exploreMap}</span>
            </Link>
          </div>

          {/* ================= MOBILE CONTROLS (< lg): [SELETOR] [HAMBURGUER] ================= */}
          <div className="flex lg:hidden items-center gap-2 shrink-0 whitespace-nowrap">
            <LanguageSelector currentLang={lang} />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={
                mobileMenuOpen
                  ? dict.nav?.toggleMenuClose || 'Fechar menu de navegação'
                  : dict.nav?.toggleMenuOpen || 'Abrir menu de navegação'
              }
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-[#141622] text-slate-200 hover:text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] shrink-0"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* ================= MOBILE DRAWER MENU (< lg) ================= */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-white/10 bg-[#0a0a0f] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-2xl"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const showPremiumBadge = link.isPremium && siteConfig.premiumPaymentsEnabled;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 min-h-11 rounded-xl text-sm font-medium normal-case transition-all ${
                  active
                    ? 'bg-white/10 text-white font-semibold border border-white/10 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="flex items-center gap-2">
                  {showPremiumBadge && (
                    <Sparkles size={14} className="text-[#ff2a85] shrink-0" />
                  )}
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href={`${langPrefix}/map`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isMapActive ? 'page' : undefined}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 min-h-11 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
                isMapActive
                  ? 'bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black ring-2 ring-[#38f8ff]'
                  : 'bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] text-black active:scale-98'
              }`}
            >
              <Compass size={16} className="shrink-0" />
              <span>{dict.common.exploreMap}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
