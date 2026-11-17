'use client';

import React from 'react';
import Link from 'next/link';
import { Map, Compass, HelpCircle, Globe } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

interface HomeStickyNavProps {
  lang: Language;
}

/**
 * Menu sticky de navegação por âncoras na Home (#map, #regions, #faq, idioma).
 * Respeita preferências de movimento reduzido (prefers-reduced-motion)
 * e compensa o deslocamento para não ficar sob o cabeçalho.
 */
export const HomeStickyNav: React.FC<HomeStickyNavProps> = ({ lang }) => {
  const dict = getDictionary(lang);
  const normalizedLang = lang.toLowerCase();

  const handleAnchorScroll = (anchorId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(anchorId);
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    try {
      window.history.pushState(null, '', `#${anchorId}`);
    } catch {
      // Ignora erro em iframes restritos
    }
  };

  const navItems = [
    { id: 'map', label: dict.stickyNav.map, icon: Map },
    { id: 'regions', label: dict.stickyNav.regions, icon: Compass },
    { id: 'faq', label: dict.stickyNav.faq, icon: HelpCircle },
  ];

  const languages = [
    { code: 'pt-br', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <nav
      aria-label="Navegação rápida da página inicial"
      className="sticky top-16 z-30 w-full bg-[#0a0b10]/90 backdrop-blur-md border-b border-[#222433] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Links de Âncoras */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleAnchorScroll(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-[#161a26] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
              >
                <Icon size={14} className="text-[#38f8ff]" />
                <span className="whitespace-nowrap">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Seletor Rápido de Idioma */}
        <div className="flex items-center gap-1.5 border-l border-[#222433] pl-3">
          <Globe size={13} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1">
            {languages.map((l) => {
              const isActive =
                normalizedLang === l.code ||
                (normalizedLang === 'pt-br' && l.code === 'pt-br');

              return (
                <Link
                  key={l.code}
                  href={`/${l.code}`}
                  aria-label={`Mudar idioma para ${l.label}`}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-[#ff2a85]/20 text-[#ff4d9e] border border-[#ff2a85]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#161a26]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
