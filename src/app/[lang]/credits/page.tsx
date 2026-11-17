import React from 'react';
import { Metadata } from 'next';
import { ExternalLink, Code2, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FanSiteDisclaimer } from '@/components/common/FanSiteDisclaimer';
import { OPEN_SOURCE_LIBRARIES } from '@/data/credits';

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

  const titles: Record<Language, string> = {
    'pt-BR': 'Créditos e Atribuições — GTAVIMap',
    en: 'Credits and Attributions — GTAVIMap',
    es: 'Créditos y Atribuciones — GTAVIMap',
  };

  const descriptions: Record<Language, string> = {
    'pt-BR': 'Créditos do mapa interativo de GTA VI: bibliotecas open-source, base cartográfica de Leonida, metodologia de dados e termos de marcas registradas.',
    en: 'Interactive GTA VI map credits: open-source software libraries, Leonida cartographic base, observation methodology, and official trademark notices.',
    es: 'Créditos del mapa interactivo de GTA VI: librerías de código abierto, base cartográfica de Leonida, metodología de datos y avisos de marcas registradas.',
  };

  const title = titles[currentLang];
  const description = descriptions[currentLang];
  const canonicalPath = `/${currentLang.toLowerCase()}/credits`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/credits',
        'pt-BR': '/pt-br/credits',
        es: '/es/credits',
        'x-default': '/en/credits',
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

export default async function CreditsPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const dict = getDictionary(currentLang);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'takedowns@gtavimap.com';
  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    dict.contactPage?.mailtoSubject || 'GTAVIMap - Copyright / Removal Request'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Cabeçalho da Página com o único H1 */}
        <div className="space-y-2 border-b border-[#1b1c26] pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {dict.creditsPage?.title || 'Créditos e Atribuições'}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {dict.creditsPage?.subtitle || 'Metodologia, bibliotecas de código aberto, fontes cartográficas e avisos legais.'}
          </p>
        </div>

        {/* ================= SEÇÃO 1: BASE CARTOGRÁFICA ================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#38f8ff]" />
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {dict.creditsPage?.mapSectionTitle || 'Base Cartográfica e Assets'}
            </h2>
          </div>
          <div className="rounded-xl border border-[#222433] bg-[#0e1017] p-5 sm:p-6 space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <p>
              {dict.creditsPage?.mapSectionDesc || 'Vetores cartográficos e interpretações geográficas baseados em materiais públicos e trailers divulgados.'}
            </p>
            <p className="text-slate-400 text-xs font-mono">
              Renderizado nativamente através de camadas vetoriais SVG e geometrias matemáticas escaláveis sem inclusão de arte proprietária ou capturas de tela protegidas por copyright.
            </p>
          </div>
        </section>

        {/* ================= SEÇÃO 2: METODOLOGIA DE DADOS ================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#ff2a85]" />
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {dict.creditsPage?.dataSectionTitle || 'Metodologia de Dados'}
            </h2>
          </div>
          <div className="rounded-xl border border-[#222433] bg-[#0e1017] p-5 sm:p-6 space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <p>
              {dict.creditsPage?.dataSectionDesc || 'Todas as coordenadas, pontos de interesse e checkpoints são verificados por observação visual no jogo e trailers.'}
            </p>
            <p className="text-slate-400 text-xs font-mono">
              Todos os pontos exibidos no mapa seguem critérios rigorosos de observação empírica direta, identificação visual de referências geográficas e validação documental.
            </p>
          </div>
        </section>

        {/* ================= SEÇÃO 3: BIBLIOTECAS OPEN SOURCE ================= */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-[#38f8ff]" />
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {dict.creditsPage?.libsSectionTitle || 'Software e Bibliotecas de Código Aberto'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OPEN_SOURCE_LIBRARIES.map((lib) => {
              const desc = lib.description[currentLang] || lib.description.en;

              return (
                <div
                  key={lib.name}
                  className="rounded-xl border border-[#222433] bg-[#0e1017] p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-[#38f8ff]/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {lib.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-[#161a26] border border-[#2c3149] text-[10px] font-mono text-[#38f8ff]">
                        {lib.license}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <a
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-mono text-[#38f8ff] hover:text-white transition-colors"
                  >
                    <span>{lib.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SEÇÃO 4: AVISO LEGAL E SITE DE FÃS ================= */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
            {dict.creditsPage?.disclaimerTitle || 'Aviso de Site de Fãs e Marcas Registradas'}
          </h2>
          <FanSiteDisclaimer lang={currentLang} />
        </section>

        {/* ================= SEÇÃO 5: CONTATO E REMOÇÃO ================= */}
        <section className="rounded-2xl border border-[#222433] bg-gradient-to-br from-[#12141f] to-[#0a0b10] p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#38f8ff]" />
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {dict.creditsPage?.contactTitle || 'Pedidos de Remoção e Direitos Autorais'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {dict.creditsPage?.contactDesc || 'Para solicitações de remoção ou questões de direitos autorais, contate diretamente nossa equipe.'}
          </p>

          <div>
            <a
              href={mailtoUrl}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#a855f7] hover:from-[#ff3d95] hover:to-[#b768ff] text-white font-bold text-xs sm:text-sm transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
            >
              <Mail size={16} />
              <span>{contactEmail}</span>
            </a>
          </div>
        </section>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
