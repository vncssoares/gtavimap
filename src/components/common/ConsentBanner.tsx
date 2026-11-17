'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '@/types';
import { getConsent, saveConsent } from '@/lib/consent';

interface ConsentBannerProps {
  lang: Language;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [measurement, setMeasurement] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const t = {
    'pt-BR': {
      title: 'Privacidade & Preferências de Cookies',
      description:
        'Utilizamos cookies necessários para manter suas preferências de idioma e consentimento. Recursos opcionais de medição e publicidade permanecem desativados por padrão e requerem sua autorização explícita.',
      necessaryTitle: 'Cookies Necessários',
      necessaryBadge: 'Sempre Ativo',
      necessaryDesc:
        'Essenciais para o funcionamento seguro da aplicação, persistência de preferências de idioma e gravação das suas escolhas de privacidade.',
      measurementTitle: 'Medição & Desempenho',
      measurementDesc:
        'Coleta anônima de métricas de navegação para aprimorar a estabilidade da cartografia e a velocidade de carregamento.',
      marketingTitle: 'Publicidade & Marketing',
      marketingDesc:
        'Permite a veiculação de anúncios contextuais ou personalizados para viabilizar custos operacionais de hospedagem.',
      acceptAll: 'Aceitar todos',
      rejectOptional: 'Apenas necessários',
      saveCustom: 'Salvar preferências',
      customize: 'Personalizar escolhas',
      hideCustomize: 'Ocultar detalhes',
      privacyLink: 'Política de Privacidade',
    },
    en: {
      title: 'Privacy & Cookie Preferences',
      description:
        'We use strictly necessary cookies to store your language preferences and consent choices. Optional measurement and advertising features are disabled by default and require your explicit opt-in.',
      necessaryTitle: 'Strictly Necessary',
      necessaryBadge: 'Always Active',
      necessaryDesc:
        'Essential for core application security, language state persistence, and recording your privacy choices.',
      measurementTitle: 'Measurement & Performance',
      measurementDesc:
        'Anonymous navigation telemetry to improve cartographic rendering speeds and application stability.',
      marketingTitle: 'Advertising & Marketing',
      marketingDesc:
        'Allows contextual or targeted advertising partners to support continuous hosting infrastructure costs.',
      acceptAll: 'Accept all',
      rejectOptional: 'Necessary only',
      saveCustom: 'Save preferences',
      customize: 'Customize choices',
      hideCustomize: 'Hide details',
      privacyLink: 'Privacy Policy',
    },
    es: {
      title: 'Privacidad y Preferencias de Cookies',
      description:
        'Utilizamos cookies estrictamente necesarias para recordar su idioma y consentimiento. Las funciones opcionales de medición y publicidad están desactivadas de forma predeterminada y requieren su autorización explícita.',
      necessaryTitle: 'Cookies Necesarias',
      necessaryBadge: 'Siempre Activo',
      necessaryDesc:
        'Esenciales para el funcionamiento seguro de la aplicación, el idioma y el almacenamiento de sus opciones de privacidad.',
      measurementTitle: 'Medición y Rendimiento',
      measurementDesc:
        'Telemetría de navegación anónima para optimizar la velocidad y la estabilidad de la cartografía.',
      marketingTitle: 'Publicidad y Marketing',
      marketingDesc:
        'Permite anuncios contextuales o personalizados para financiar los costes de servidores y alojamiento.',
      acceptAll: 'Aceptar todo',
      rejectOptional: 'Solo necesarias',
      saveCustom: 'Guardar preferencias',
      customize: 'Personalizar',
      hideCustomize: 'Ocultar detalles',
      privacyLink: 'Política de Privacidad',
    },
  }[lang] || {
    title: 'Privacy & Cookie Preferences',
    description: 'We use cookies to maintain your preferences.',
    necessaryTitle: 'Strictly Necessary',
    necessaryBadge: 'Always Active',
    necessaryDesc: 'Essential for operation.',
    measurementTitle: 'Measurement',
    measurementDesc: 'Anonymous analytics.',
    marketingTitle: 'Marketing',
    marketingDesc: 'Advertising partners.',
    acceptAll: 'Accept all',
    rejectOptional: 'Necessary only',
    saveCustom: 'Save preferences',
    customize: 'Customize',
    hideCustomize: 'Hide details',
    privacyLink: 'Privacy Policy',
  };

  useEffect(() => {
    // 1. Verifica se já existe consentimento salvo (agendado assincronamente)
    const timer = setTimeout(() => {
      const current = getConsent();
      if (!current) {
        setIsOpen(true);
      } else {
        setMeasurement(current.measurement);
        setMarketing(current.marketing);
      }
    }, 0);

    // 2. Escuta pedido externo para reabrir (ex: botão no Footer)
    const handleOpen = () => {
      const existing = getConsent();
      if (existing) {
        setMeasurement(existing.measurement);
        setMarketing(existing.marketing);
      }
      setShowDetails(true);
      setIsOpen(true);
    };

    window.addEventListener('gtavimap_open_consent', handleOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('gtavimap_open_consent', handleOpen);
    };
  }, []);

  if (!isOpen) return null;

  const handleAcceptAll = () => {
    saveConsent({ measurement: true, marketing: true });
    setMeasurement(true);
    setMarketing(true);
    setIsOpen(false);
  };

  const handleRejectOptional = () => {
    saveConsent({ measurement: false, marketing: false });
    setMeasurement(false);
    setMarketing(false);
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    saveConsent({ measurement, marketing });
    setIsOpen(false);
  };

  const privacyPath = `/${lang.toLowerCase()}/privacy`;

  return (
    <div
      role="region"
      aria-label={t.title}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 bg-[#0c0e17]/95 backdrop-blur-xl border-t border-[#26283b] shadow-2xl transition-all"
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header do Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff2a85]/15 border border-[#ff2a85]/40 flex items-center justify-center text-[#ff2a85]">
              <Cookie className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {t.title}
            </h3>
          </div>

          <Link
            href={privacyPath}
            className="text-xs text-[#00e5ff] hover:underline font-mono"
          >
            {t.privacyLink}
          </Link>
        </div>

        {/* Descrição geral */}
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {t.description}
        </p>

        {/* Detalhes expansíveis com categorias */}
        {showDetails && (
          <div className="p-4 rounded-xl bg-[#141724] border border-white/5 space-y-3.5 my-3 animate-in fade-in duration-200">
            {/* Categoria 1: Necessários */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[#0e1019] border border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00e5ff]" />
                  <span className="text-xs font-bold text-white">
                    {t.necessaryTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00e5ff]/20 text-[#00e5ff]">
                    {t.necessaryBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.necessaryDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={true}
                disabled={true}
                aria-label={t.necessaryTitle}
                className="w-4 h-4 mt-1 accent-[#00e5ff] cursor-not-allowed opacity-60"
              />
            </div>

            {/* Categoria 2: Medição */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[#0e1019] border border-white/5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white">
                  {t.measurementTitle}
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.measurementDesc}
                </p>
              </div>
              <input
                type="checkbox"
                id="consent-measurement"
                checked={measurement}
                onChange={(e) => setMeasurement(e.target.checked)}
                className="w-4 h-4 mt-1 accent-[#ff2a85] cursor-pointer"
              />
            </div>

            {/* Categoria 3: Anúncios */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[#0e1019] border border-white/5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white">
                  {t.marketingTitle}
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.marketingDesc}
                </p>
              </div>
              <input
                type="checkbox"
                id="consent-marketing"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="w-4 h-4 mt-1 accent-[#ff2a85] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-2 min-h-[44px] font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showDetails ? t.hideCustomize : t.customize}</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {showDetails ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 min-h-[44px] inline-flex items-center justify-center rounded-lg bg-[#1e2233] hover:bg-[#282d44] text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
              >
                {t.saveCustom}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2 min-h-[44px] inline-flex items-center justify-center rounded-lg bg-[#1a1c27] hover:bg-[#222535] text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
              >
                {t.rejectOptional}
              </button>
            )}

            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-5 py-2 min-h-[44px] inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ff599c] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#ff2a85]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
            >
              {t.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
