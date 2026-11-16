import React from 'react';
import { Metadata } from 'next';
import { FileText, ArrowLeft, Scale } from 'lucide-react';
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
  const title = `${dict.termsPage.title} — ${dict.common.siteName}`;
  const description = dict.termsPage.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}/terms`;
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
        en: '/en/terms',
        'pt-BR': '/pt-br/terms',
        es: '/es/terms',
        'x-default': '/en/terms',
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

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);
  const t = dict.termsPage;

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
          <span className="text-xs font-mono text-slate-500">{t.lastUpdated}</span>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b26] border border-[#ff2a85]/30 text-xs font-mono text-[#ff2a85] uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>User Terms & Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {t.sections.map((section, idx) => (
            <section
              key={idx}
              className="p-6 rounded-2xl bg-[#12141f] border border-white/5 space-y-3"
            >
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00e5ff]" />
                <span>{section.heading}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Fan Site Disclaimer */}
        <FanSiteDisclaimer lang={currentLang} variant="banner" />
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
