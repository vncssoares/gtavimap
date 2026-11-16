import React from 'react';
import { Metadata } from 'next';
import { Mail, ArrowLeft, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FanSiteDisclaimer } from '@/components/common/FanSiteDisclaimer';
import { siteConfig } from '@/config/siteConfig';

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
  const title = `${dict.contactPage.title} — ${dict.common.siteName}`;
  const description = dict.contactPage.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}/contact`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    robots: siteConfig.isIndexingEnabled
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/contact',
        'pt-BR': '/pt-br/contact',
        es: '/es/contact',
        'x-default': '/en/contact',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://gtavimap.com${canonicalPath}`,
      siteName: 'GTAVIMap',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: currentLang === 'pt-BR' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const c = dict.contactPage;

  // Lê de NEXT_PUBLIC_CONTACT_EMAIL via siteConfig (sem e-mail fixo no código)
  const contactEmail = siteConfig.contactEmail || 'contact@gtavimap.com';
  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    c.mailtoSubject
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b10] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-10">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${normalizedLang}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#00e5ff] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{dict.common.backToHome}</span>
          </Link>
          <span className="text-xs font-mono text-slate-500">GTAVIMap Support</span>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b26] border border-[#00e5ff]/30 text-xs font-mono text-[#00e5ff] uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Official Communications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {c.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            {c.subtitle}
          </p>
        </div>

        {/* Seção 1: Pedidos de Remoção & Direitos Autorais (DMCA) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#161826] to-[#10121d] border-2 border-amber-500/30 space-y-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{c.takedownSubtitle}</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {c.takedownTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {c.takedownDesc}
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-[#0c0e16] border border-white/5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Itens Obrigatórios na Notificação:
            </h3>
            <ul className="space-y-2">
              {c.takedownRequirements.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div>
              <span className="block text-[11px] font-mono uppercase text-slate-400">
                {c.emailLabel}
              </span>
              <span className="text-sm font-mono font-bold text-white selection:bg-[#ff2a85]/30">
                {contactEmail}
              </span>
            </div>

            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all text-center"
            >
              <Mail className="w-4 h-4" />
              <span>{c.mailtoButton}</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-white/5 pt-4">
            {c.noFormNotice}
          </p>
        </section>

        {/* Seção 2: Contato Geral */}
        <section className="p-6 rounded-2xl bg-[#12141f] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <MessageSquare className="w-5 h-5 text-[#00e5ff]" />
            <h2>{c.generalTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {c.generalDesc}
          </p>
          <div className="text-xs font-mono text-[#00e5ff]">
            {contactEmail}
          </div>
        </section>

        {/* Fan Site Disclaimer */}
        <FanSiteDisclaimer lang={currentLang} variant="banner" />
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
