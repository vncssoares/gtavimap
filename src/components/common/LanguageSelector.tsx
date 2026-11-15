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
    if (newLang === currentLang) return;

    // Converte a rota atual substituindo o prefixo de idioma
    // Por exemplo /en/map -> /pt-br/map
    const segments = pathname.split('/').filter(Boolean);
    const targetLangRoute = newLang.toLowerCase();

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#223247] bg-[#0c1420]/80 hover:bg-[#132033] hover:border-[#00ff66]/40 text-slate-200 text-xs font-medium transition-all shadow-sm"
        aria-label="Select Language"
      >
        <Globe size={14} className="text-[#00ff66]" />
        <span>{currentInfo.flag}</span>
        <span className="hidden sm:inline font-mono uppercase">{currentLang}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0d1624] border border-[#223349] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-[#1b2b3f]">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code.toLowerCase() === currentLang.toLowerCase();
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#00ff66]/10 text-[#00ff66] font-semibold'
                    : 'text-slate-300 hover:bg-[#162335] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <Check size={14} className="text-[#00ff66]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
