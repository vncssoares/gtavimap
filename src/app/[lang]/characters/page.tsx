import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MapCta } from '@/components/common/MapCta';
import { PROTAGONISTS, OFFICIAL_GALLERY, SUPPORTING_CAST } from '@/data/characters';

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

  const title = `${dict.nav.characters} — ${dict.common.siteName}`;
  const description = dict.charactersPage.subtitle;
  const canonicalPath = `/${currentLang.toLowerCase()}/characters`;
  const ogImageUrl = `/${currentLang.toLowerCase()}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en/characters',
        'pt-BR': '/pt-br/characters',
        es: '/es/characters',
        'x-default': '/en/characters',
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

export default async function CharactersPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = (['en', 'pt-br', 'es'].includes(lang.toLowerCase())
    ? lang === 'pt-br'
      ? 'pt-BR'
      : lang
    : 'en') as Language;

  const dict = getDictionary(currentLang);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-[#ff2a85]/30 selection:text-[#ff2a85]">
      <Header lang={currentLang} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Cabeçalho da Página */}
        <div className="space-y-1.5 border-b border-[#1b1c26] pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {dict.charactersPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {dict.charactersPage.subtitle}
          </p>
        </div>

        {/* ================= SEÇÃO 1: PROTAGONISTAS JOGÁVEIS ================= */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            {dict.charactersPage.playableSectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROTAGONISTS.map((p) => {
              const bio = p.bio[currentLang] || p.bio.en;
              const role = p.role[currentLang] || p.role.en;

              return (
                <div
                  key={p.id}
                  className="bg-[#12131a] rounded-2xl border border-[#222433] overflow-hidden hover:border-[#ff2a85]/50 transition-all duration-300 shadow-xl group flex flex-col"
                >
                  {/* Foto do Protagonista */}
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#0a0b10]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover object-top group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Detalhes do Protagonista */}
                  <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {p.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#1a1c27] border border-[#2e3247] text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
                          {role}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {bio}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SEÇÃO 2: NOVAS IMAGENS OFICIAIS ================= */}
        <section className="space-y-3 pt-2">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              {dict.charactersPage.gallerySectionTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {dict.charactersPage.gallerySectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
            {OFFICIAL_GALLERY.map((item) => {
              const title = item.title[currentLang] || item.title.en;

              return (
                <div
                  key={item.id}
                  className="relative aspect-video rounded-xl overflow-hidden bg-[#12131a] border border-[#222433] hover:border-[#00e5ff]/60 transition-all duration-300 shadow-lg group"
                >
                  <Image
                    src={item.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-[11px] font-mono text-white font-bold tracking-tight drop-shadow-md">
                      {title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SEÇÃO 3: ELENCO DE APOIO ================= */}
        <section className="space-y-4 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            {dict.charactersPage.supportingSectionTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SUPPORTING_CAST.map((char) => {
              const bio = char.bio[currentLang] || char.bio.en;
              const role = char.role[currentLang] || char.role.en;

              return (
                <div
                  key={char.id}
                  className="bg-[#12131a] rounded-2xl border border-[#222433] overflow-hidden hover:border-[#00e5ff]/40 transition-all duration-300 shadow-xl flex flex-col group"
                >
                  {/* Foto do Personagem */}
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#0a0b10]">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover object-top group-hover:scale-104 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Informações */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h4 className="text-base font-black text-white leading-tight">
                        {char.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00e5ff] block mt-0.5">
                        {role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Map CTA para explorar os locais dos personagens */}
        <section className="pt-2">
          <MapCta lang={currentLang} />
        </section>

        {/* Rodapé informativo */}
        <div className="pt-6 border-t border-[#1b1c26] text-center">
          <p className="text-[11px] font-mono text-slate-400">
            {dict.charactersPage.footerNotice}
          </p>
        </div>
      </main>

      <Footer lang={currentLang} />
    </div>
  );
}
