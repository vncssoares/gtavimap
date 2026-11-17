'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Language } from '@/types';

interface LanguageSelectorProps {
  currentLang: Language;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'es', label: 'Español (ES)', flag: '🇪🇸' },
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setIsOpen(false);
    const targetLangRoute = newLang.toLowerCase();

    // Grava a preferência de idioma por 1 ano (SameSite=Lax)
    saveLanguagePreferenceCookie(targetLangRoute);

    if (newLang === currentLang) return;

    // Converte a rota atual substituindo o prefixo de idioma
    // Por exemplo /en/map -> /pt-br/map
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 0 && ['en', 'pt-br', 'es'].includes(segments[0].toLowerCase())) {
      segments[0] = targetLangRoute;
      router.push('/' + segments.join('/'));
    } else {
      router.push('/' + targetLangRoute);
    }
  };

  const currentInfo = LANGUAGES.find((l) => l.code.toLowerCase() === currentLang.toLowerCase()) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-xl border border-[#2d3042] bg-[#1a1c27] hover:bg-[#252838] hover:border-[#38f8ff] text-slate-200 text-xs font-bold transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
        aria-label="Selecionar idioma da interface"
      >
        <Globe size={14} className="text-[#38f8ff]" />
        <span>{currentInfo.flag}</span>
        <span className="hidden sm:inline font-mono uppercase">{currentLang}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 text-slate-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#12131a] border border-[#2d3042] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-300 border-b border-[#222433]">
            Selecionar Idioma
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code.toLowerCase() === currentLang.toLowerCase();
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff] ${
                  isSelected
                    ? 'bg-[#38f8ff]/15 text-[#38f8ff] font-bold border-l-2 border-[#38f8ff]'
                    : 'text-slate-200 hover:bg-[#1a1c27] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <Check size={14} className="text-[#38f8ff]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
