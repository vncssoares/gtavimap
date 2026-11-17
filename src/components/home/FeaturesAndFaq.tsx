import React from 'react';
import {
  BookmarkCheck,
  Filter,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Language } from '@/types';
import { FanSiteDisclaimer } from '@/components/common/FanSiteDisclaimer';

interface FeaturesAndFaqProps {
  lang: Language;
}

interface FaqItem {
  question: string;
  answer: string;
}

export const FeaturesAndFaq: React.FC<FeaturesAndFaqProps> = ({ lang }) => {
  const content = {
    'pt-BR': {
      featuresBadge: 'RECURSOS & FERRAMENTAS',
      featuresHeading: 'Desenvolvido para Navegação Tática',
      featuresSubheading:
        'Explore todo o relevo e locais de interesse de Leonida com alta fidelidade e ferramentas de rastreamento comunitário.',
      features: [
        {
          title: 'Progresso 100% Salvo Localmente',
          description:
            'Marque colecionáveis, missões e saltos únicos como concluídos. Seus dados ficam salvos com segurança no armazenamento do seu navegador, sem necessidade de login.',
          icon: BookmarkCheck,
          accent: '#38f8ff',
        },
        {
          title: 'Filtros Dinâmicos & Busca Instantânea',
          description:
            'Isole rapidamente armas, locais de roubo, pistas de corrida ou refúgios com busca em tempo real e categorias organizadas.',
          icon: Filter,
          accent: '#ff2a85',
        },
        {
          title: 'Rastreamento de Colecionáveis',
          description:
            'Acompanhe sua porcentagem de conclusão por setor e categoria para alcançar o 100% no mapa de Leonida.',
          icon: CheckCircle2,
          accent: '#10b981',
        },
      ],
      comparison: {
        title: 'Versão Gratuita vs. Acesso PRO',
        freeLabel: 'Versão Comunitária (Grátis)',
        freeFeatures: [
          'Acesso completo ao mapa de Leonida',
          'Rastreamento de pontos salvo no navegador',
          'Filtros por categoria e busca tática',
          'Deep links e compartilhamento de rotas',
        ],
        proLabel: 'Acesso PRO (Em breve)',
        proFeatures: [
          'Sincronização em nuvem entre múltiplos aparelhos',
          'Anotações e rotas customizadas ilimitadas',
          'Exportação de estatísticas de conclusão',
        ],
        note: 'O mapa principal e todas as ferramentas de busca permanecerão sempre 100% gratuitas para a comunidade.',
      },
      faqBadge: 'DÚVIDAS FREQUENTES',
      faqHeading: 'Perguntas Frequentes sobre GTA VI',
      faqSubheading:
        'Respostas verificadas baseadas exclusivamente nos comunicados e trailers oficiais da Rockstar Games.',
      faqs: [
        {
          question: 'Quando GTA VI será lançado oficialmente?',
          answer:
            'Grand Theft Auto VI está oficialmente programado para o outono de 2025/2026, com lançamento anunciado pela Rockstar Games para consoles de nova geração.',
        },
        {
          question: 'Em quais plataformas o jogo estará disponível no lançamento?',
          answer:
            'A Rockstar Games confirmou o lançamento inicial de GTA VI nos consoles PlayStation 5 e Xbox Series X|S.',
        },
        {
          question: 'Onde se passa o mapa de Grand Theft Auto VI?',
          answer:
            'O jogo se passa no estado fictício de Leonida, lar da vibrante metrópole de Vice City, das ilhas de Leonida Keys e dos pântanos selvagens de Grassrivers.',
        },
        {
          question: 'Quem são os protagonistas da história?',
          answer:
            'O primeiro trailer oficial confirmou Lucia e Jason como os personagens centrais da trama, atuando em conjunto no submundo do crime de Leonida.',
        },
        {
          question: 'Como funciona o salvamento do meu progresso no GTAVIMap?',
          answer:
            'O rastreamento de pontos concluídos e marcadores é salvo automaticamente no LocalStorage do seu próprio navegador, sem exigir cadastro ou senhas.',
        },
        {
          question: 'Os pontos marcados no mapa são verificados?',
          answer:
            'Sim, os locais de categoria verificada são identificados a partir de marcos geográficos e estruturas mostradas nos trailers oficiais e materiais da Rockstar Games.',
        },
        {
          question: 'O GTAVIMap é afiliado à Rockstar Games?',
          answer:
            'Não. O GTAVIMap é um projeto independente mantido por fãs para navegação comunitária e pesquisa, sem qualquer vínculo comercial, afiliação ou aprovação da Rockstar Games ou Take-Two Interactive.',
        },
      ],
      disclaimerText:
        'Aviso Legal: GTAVIMap é um site de fãs e projeto de pesquisa comunitária. Não é afiliado, associado, autorizado ou endossado pela Rockstar Games ou Take-Two Interactive. Grand Theft Auto e GTA VI são marcas registradas da Take-Two Interactive Software, Inc.',
    },
    en: {
      featuresBadge: 'FEATURES & TOOLKIT',
      featuresHeading: 'Engineered for Tactical Navigation',
      featuresSubheading:
        'Explore the full topography and points of interest across Leonida with high fidelity and community tracking tools.',
      features: [
        {
          title: '100% Local Storage Saving',
          description:
            'Mark collectibles, missions, and stunt jumps as completed. Your data stays securely stored in your browser without requiring any account login.',
          icon: BookmarkCheck,
          accent: '#38f8ff',
        },
        {
          title: 'Dynamic Filters & Instant Search',
          description:
            'Instantly isolate weapons, robberies, race tracks, or safehouses with real-time search and categorized overlays.',
          icon: Filter,
          accent: '#ff2a85',
        },
        {
          title: 'Collectible Progress Tracker',
          description:
            'Monitor completion metrics by region and category to efficiently reach 100% completion in Leonida.',
          icon: CheckCircle2,
          accent: '#10b981',
        },
      ],
      comparison: {
        title: 'Free Community vs. PRO Access',
        freeLabel: 'Community Edition (Free)',
        freeFeatures: [
          'Full access to the interactive Leonida map',
          'Browser-saved progress tracking',
          'Category filters and instant search',
          'Deep linking and shareable map URLs',
        ],
        proLabel: 'PRO Tier (Coming soon)',
        proFeatures: [
          'Cloud sync across desktop and mobile devices',
          'Unlimited custom pin notes and route drawing',
          'Completion data backup and export',
        ],
        note: 'The core interactive map and all exploratory features will always remain 100% free for everyone.',
      },
      faqBadge: 'FREQUENTLY ASKED QUESTIONS',
      faqHeading: 'Frequently Asked Questions about GTA VI',
      faqSubheading:
        'Fact-checked answers based exclusively on official Rockstar Games announcements and trailers.',
      faqs: [
        {
          question: 'When is GTA VI officially launching?',
          answer:
            'Grand Theft Auto VI is officially scheduled for launch in Fall 2025/2026, as announced by Rockstar Games for current-generation consoles.',
        },
        {
          question: 'Which platforms will GTA VI support at launch?',
          answer:
            'Rockstar Games has confirmed the initial release of GTA VI for PlayStation 5 and Xbox Series X|S consoles.',
        },
        {
          question: 'Where is the map of Grand Theft Auto VI located?',
          answer:
            'The game is set in the fictional state of Leonida, encompassing the neon-lit streets of Vice City, the tropical Leonida Keys, and the wetlands of Grassrivers.',
        },
        {
          question: 'Who are the main playable protagonists?',
          answer:
            'The initial reveal trailer introduced Lucia and Jason as the dual lead characters operating across the criminal landscape of Leonida.',
        },
        {
          question: 'How is user progress saved on GTAVIMap?',
          answer:
            'Your checked markers and completed collectibles are stored client-side in your browser LocalStorage without needing an account or password.',
        },
        {
          question: 'Are the locations on this map officially confirmed?',
          answer:
            'Verified markers correspond directly to visual landmarks and locations displayed in official Rockstar Games trailers and promotional materials.',
        },
        {
          question: 'Is GTAVIMap affiliated with Rockstar Games?',
          answer:
            'No. GTAVIMap is an independent fan project created for community navigation and mapping research, with no affiliation, endorsement, or sponsorship from Rockstar Games or Take-Two Interactive.',
        },
      ],
      disclaimerText:
        'Disclaimer: GTAVIMap is an independent fan site and community research project. It is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Rockstar Games or Take-Two Interactive. Grand Theft Auto and GTA VI are registered trademarks of Take-Two Interactive Software, Inc.',
    },
    es: {
      featuresBadge: 'FUNCIONES Y HERRAMIENTAS',
      featuresHeading: 'Diseñado para Navegación Táctica',
      featuresSubheading:
        'Explora la topografía completa y los puntos de interés de Leonida con gran fidelidad y herramientas de seguimiento.',
      features: [
        {
          title: 'Progreso Guardado en Local',
          description:
            'Marca coleccionables, misiones y saltos acrobáticos como completados. Tus datos se guardan en el navegador sin necesidad de registrarte.',
          icon: BookmarkCheck,
          accent: '#38f8ff',
        },
        {
          title: 'Filtros Dinámicos y Búsqueda Inmediata',
          description:
            'Encuentra al instante armas, atracos, carreras o pisos francos con filtros por categoría y búsqueda en tiempo real.',
          icon: Filter,
          accent: '#ff2a85',
        },
        {
          title: 'Seguimiento de Coleccionables',
          description:
            'Supervisa tu porcentaje de progreso por región y categoría para alcanzar el 100% en Leonida.',
          icon: CheckCircle2,
          accent: '#10b981',
        },
      ],
      comparison: {
        title: 'Versión Gratuita vs. Acceso PRO',
        freeLabel: 'Edición Comunitaria (Gratis)',
        freeFeatures: [
          'Acceso completo al mapa interactivo de Leonida',
          'Seguimiento de puntos guardado en tu navegador',
          'Filtros por categoría y buscador táctico',
          'Enlaces directos y compartición de rutas',
        ],
        proLabel: 'Nivel PRO (Próximamente)',
        proFeatures: [
          'Sincronización en la nube entre múltiples dispositivos',
          'Notas y trazado de rutas personalizadas ilimitadas',
          'Exportación de estadísticas de progreso',
        ],
        note: 'El mapa principal y todas las herramientas de búsqueda seguirán siendo siempre 100% gratuitas.',
      },
      faqBadge: 'PREGUNTAS FRECUENTES',
      faqHeading: 'Preguntas Frecuentes sobre GTA VI',
      faqSubheading:
        'Respuestas contrastadas basadas exclusivamente en anuncios y tráileres oficiales de Rockstar Games.',
      faqs: [
        {
          question: '¿Cuándo se lanzará oficialmente GTA VI?',
          answer:
            'Grand Theft Auto VI está oficialmente programado para otoño de 2025/2026, según lo anunciado por Rockstar Games para consolas de última generación.',
        },
        {
          question: '¿En qué plataformas estará disponible de lanzamiento?',
          answer:
            'Rockstar Games ha confirmado el lanzamiento inicial en consolas PlayStation 5 y Xbox Series X|S.',
        },
        {
          question: '¿Dónde se ambienta el mapa de GTA VI?',
          answer:
            'El juego se desarrolla en el estado ficticio de Leonida, que incluye la metrópolis de Vice City, las islas de Leonida Keys y los humedales de Grassrivers.',
        },
        {
          question: '¿Quiénes son los protagonistas de la historia?',
          answer:
            'El primer tráiler oficial presentó a Lucia y Jason como la pareja protagonista que opera en el bajo mundo de Leonida.',
        },
        {
          question: '¿Cómo se guarda mi progreso en GTAVIMap?',
          answer:
            'Tus marcadores completados se guardan localmente en el almacenamiento de tu propio navegador (LocalStorage), sin requerir cuenta ni contraseña.',
        },
        {
          question: '¿Están confirmados los lugares marcados en el mapa?',
          answer:
            'Los puntos verificados provienen de ubicaciones y elementos visibles en los tráileres y comunicados oficiales de Rockstar Games.',
        },
        {
          question: '¿Está GTAVIMap afiliado a Rockstar Games?',
          answer:
            'No. GTAVIMap es un proyecto independiente de fans para exploración y cartografía, sin afiliación, patrocinio ni respaldo de Rockstar Games o Take-Two Interactive.',
        },
      ],
      disclaimerText:
        'Aviso Legal: GTAVIMap es un sitio web independiente creado por fans con fines de investigación comunitaria. No está afiliado, respaldado ni respaldado por Rockstar Games o Take-Two Interactive. Grand Theft Auto y GTA VI son marcas registradas de Take-Two Interactive Software, Inc.',
    },
  }[lang] || {
    featuresBadge: 'FEATURES',
    featuresHeading: 'Tactical Navigation',
    featuresSubheading: 'Explore Leonida.',
    features: [],
    comparison: {
      title: 'Free vs PRO',
      freeLabel: 'Free',
      freeFeatures: [],
      proLabel: 'PRO',
      proFeatures: [],
      note: '',
    },
    faqBadge: 'FAQ',
    faqHeading: 'FAQ',
    faqSubheading: '',
    faqs: [],
    disclaimerText: '',
  };

  // Build JSON-LD FAQPage Schema escaping '<' safely
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq: FaqItem) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const safeJsonLd = JSON.stringify(faqSchema).replace(/</g, '\\u003c');

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto space-y-24">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      {/* Features Grid */}
      <section>
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2230]/80 border border-[#38f8ff]/40 text-[#38f8ff] text-xs font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Zap className="w-3.5 h-3.5" />
            <span>{content.featuresBadge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            {content.featuresHeading}
          </h2>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
            {content.featuresSubheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-[#181a24] to-[#11131c] border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
                  style={{
                    backgroundColor: `${feat.accent}15`,
                    borderColor: `${feat.accent}40`,
                    color: feat.accent,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subtle Free vs PRO Comparison Row */}
      <section className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#141724] via-[#161a29] to-[#141724] border border-white/10">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {content.comparison.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            {content.comparison.note}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-5 rounded-xl bg-[#0e1017] border border-[#00e5ff]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#00e5ff] uppercase tracking-wider font-mono">
                  {content.comparison.freeLabel}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#00e5ff]/15 text-[#00e5ff] font-semibold">
                  100% FREE
                </span>
              </div>
              <ul className="space-y-2.5">
                {content.comparison.freeFeatures.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Tier (Subtle teaser, no aggressive button) */}
          <div className="p-5 rounded-xl bg-[#0e1017]/60 border border-white/5 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {content.comparison.proLabel}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-slate-400">
                  ROADMAP
                </span>
              </div>
              <ul className="space-y-2.5">
                {content.comparison.proFeatures.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-400"
                  >
                    <Sparkles className="w-4 h-4 text-[#ff2a85] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visible FAQ */}
      <section id="faq" className="max-w-4xl mx-auto scroll-mt-28">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2230]/80 border border-[#ff2a85]/30 text-[#ff2a85] text-xs font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,42,133,0.15)]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{content.faqBadge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            {content.faqHeading}
          </h2>
          <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
            {content.faqSubheading}
          </p>
        </div>

        <div className="space-y-4">
          {content.faqs.map((faq: FaqItem, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#141622] border border-white/5 hover:border-white/10 transition-colors"
            >
              <h3 className="text-base font-bold text-white mb-2 flex items-start gap-2">
                <span className="text-[#ff2a85] font-mono text-sm">Q:</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visible Fan-site Disclaimer Banner */}
      <FanSiteDisclaimer lang={lang} variant="banner" className="max-w-4xl mx-auto" />
    </div>
  );
};
