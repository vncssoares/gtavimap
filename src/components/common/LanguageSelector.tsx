'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

interface LanguageSelectorProps {
  currentLang: Language;
}

interface LanguageOption {
  code: Language;
  label: string; // "PT-BR — Português (BR)", etc.
  shortCode: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', label: 'PT-BR — Português (BR)', shortCode: 'PT-BR' },
  { code: 'en', label: 'EN — English (US)', shortCode: 'EN' },
  { code: 'es', label: 'ES — Español', shortCode: 'ES' },
];

function saveLanguagePreferenceCookie(lang: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dict = getDictionary(currentLang);
  const normalizedCurrent = currentLang.toLowerCase();

  const closeDropdown = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar com tecla Escape e devolver o foco ao botão
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closeDropdown(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDropdown]);

  const handleLanguageChange = (newLang: Language) => {
    closeDropdown(true);
    const targetLangRoute = newLang.toLowerCase();

    // Grava a preferência de idioma por 1 ano
    saveLanguagePreferenceCookie(targetLangRoute);

    if (newLang.toLowerCase() === normalizedCurrent) return;

    // Substitui o primeiro segmento da rota pelo novo idioma
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && ['en', 'pt-br', 'es'].includes(segments[0].toLowerCase())) {
      segments[0] = targetLangRoute;
      router.push('/' + segments.join('/'));
    } else {
      router.push('/' + targetLangRoute);
    }
  };

  const currentOption =
    LANGUAGES.find((l) => l.code.toLowerCase() === normalizedCurrent) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={dict.nav?.selectLanguage || 'Selecionar idioma'}
        className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[40px] rounded-xl border border-white/10 bg-[#141622] hover:bg-[#1c1f30] hover:border-[#38f8ff]/50 text-slate-200 text-xs font-mono font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] whitespace-nowrap shrink-0"
      >
        <Globe size={14} className="text-[#38f8ff] shrink-0" />
        <span className="font-mono uppercase tracking-wider">{currentOption.shortCode}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 text-slate-400 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={dict.nav?.selectLanguage || 'Selecionar idioma'}
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f111a] border border-white/10 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/5">
            {dict.nav?.selectLanguage || 'Selecionar Idioma'}
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code.toLowerCase() === normalizedCurrent;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#38f8ff]/15 text-[#38f8ff] font-bold border-l-2 border-[#38f8ff]'
                    : 'text-slate-300 hover:bg-[#181a26] hover:text-white'
                }`}
              >
                <span>{lang.label}</span>
                {isSelected && <Check size={14} className="text-[#38f8ff] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
