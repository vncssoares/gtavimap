import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Sparkles,
  Zap,
  Cloud,
  CheckCircle2,
  Shield,
  Layers,
  ArrowLeft,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { NotifyMeButton } from '@/components/premium/NotifyMeButton';

export const instant = false;

interface PageProps {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt-br' }, { lang: 'es' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const dict = getDictionary(currentLang);

  return {
    title: `${dict.premium.badge} — ${dict.common.siteName}`,
    description: dict.premium.subtitle,
    alternates: {
      canonical: `/${currentLang.toLowerCase()}/premium`,
      languages: {
        en: '/en/premium',
        'pt-BR': '/pt-br/premium',
        es: '/es/premium',
      },
    },
  };
}

export default async function PremiumPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const langPrefix = `/${normalizedLang}`;

  const perks = [
    {
      icon: <Zap size={20} className="text-[#00e5ff]" />,
      title: dict.premium.feature1Title,
      description: dict.premium.feature1Desc,
      status: 'PRONTO NO PROTÓTIPO',
      statusColor: '#00e5ff',
    },
    {
      icon: <Cloud size={20} className="text-[#ff2a85]" />,
      title: dict.premium.feature2Title,
      description: dict.premium.feature2Desc,
      status: 'PLANEJADO',
      statusColor: '#ff2a85',
    },
    {
      icon: <Sliders size={20} className="text-[#fbbf24]" />,
      title: dict.premium.feature3Title,
      description: dict.premium.feature3Desc,
      status: 'PLANEJADO',
      statusColor: '#fbbf24',
    },
    {
      icon: <Layers size={20} className="text-[#a855f7]" />,
      title: dict.premium.feature4Title,
      description: dict.premium.feature4Desc,
      status: 'PLANEJADO',
      statusColor: '#a855f7',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f15] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161722] border border-[#ff2a85] text-xs font-mono font-black text-[#ff2a85] uppercase shadow-lg shadow-[#ff2a85]/10">
              <Sparkles size={13} className="text-[#ff2a85]" />
              <span>{dict.premium.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              {dict.premium.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {dict.premium.subtitle}
            </p>
          </div>

          {/* Aviso de Transparência */}
          <div className="p-4 rounded-xl bg-[#12131a] border border-[#ff2a85]/40 flex items-start gap-3 shadow-lg">
            <AlertTriangle size={18} className="text-[#ff2a85] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black text-[#ff2a85] uppercase font-mono tracking-wider">
                TRANSPARÊNCIA DO PROTÓTIPO
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {dict.premium.plannedNotice}
              </p>
            </div>
          </div>

          {/* Grid de Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perks.map((perk, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#12131a] border border-[#222433] hover:border-[#383d54] transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#090a0e] flex items-center justify-center border border-[#1e202d]">
                    {perk.icon}
                  </div>
                  <span
                    className="text-[9.5px] font-mono font-black uppercase px-2 py-0.5 rounded border"
                    style={{
                      color: perk.statusColor,
                      borderColor: `${perk.statusColor}44`,
                      backgroundColor: `${perk.statusColor}15`,
                    }}
                  >
                    {perk.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  {perk.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>

          {/* Caixa de Assinatura no Estilo HUD com Degradê */}
          <div
            className="p-8 sm:p-10 rounded-3xl bg-[#12131a] border-2 border-[#ff2a85] shadow-2xl text-center space-y-6 relative"
            style={{
              boxShadow: '0 0 35px rgba(255, 42, 133, 0.25)',
            }}
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] font-bold">
                PROJETADO PARA O LANÇAMENTO
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                {dict.premium.monthlyPrice}
              </div>
              <p className="text-xs text-slate-400">
                Ou {dict.premium.annualPrice} no plano anual (2 meses grátis)
              </p>
            </div>

            <div className="pt-2">
              <NotifyMeButton label={dict.premium.cta} />
            </div>

            <div className="pt-4 border-t border-[#1e202d] flex items-center justify-center gap-6 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-[#00e5ff]" />
                Zero cobrança no protótipo
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#00e5ff]" />
                Cancelamento instantâneo
              </span>
            </div>
          </div>

          {/* Botão de Retorno */}
          <div className="text-center pt-2">
            <Link
              href={`${langPrefix}/map`}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00e5ff] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>{dict.common.backToMap}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
