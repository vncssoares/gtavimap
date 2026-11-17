import type { NewsItem } from '../types/index.ts';

/**
 * Data da última revisão editorial do feed de notícias e changelog.
 */
export const LAST_REVIEWED_NEWS_ISO = '2026-11-16T20:00:00.000Z';

/**
 * Feed de Notícias Oficiais do Jogo e Notas de Atualização do Site (Changelog).
 * Fatos do jogo exigem sourceUrl oficial, publishedAt ISO e confidence.
 * Atualizações do site usam kind: 'site' e não exigem fonte externa.
 */
export const NEWS_ITEMS: NewsItem[] = [
  // 1. Notícia de Jogo (Exemplo com placeholder: true)
  {
    id: 'news-trailer-1-world-reveal',
    slug: 'revelacao-trailer-1-mundo',
    kind: 'game',
    sourceUrl: 'https://www.rockstargames.com/VI',
    publishedAt: '2023-12-05T00:00:00.000Z',
    confidence: 'official',
    placeholder: true,
    updatedAt: '2026-11-16T18:00:00.000Z',
    title: {
      en: 'Grand Theft Auto VI Trailer 1 World Premiere [Placeholder]',
      'pt-BR': 'Estreia Mundial do Trailer 1 de Grand Theft Auto VI [Placeholder]',
      es: 'Estreno Mundial del Tráiler 1 de Grand Theft Auto VI [Placeholder]',
    },
    summary: {
      en: 'Rockstar Games officially revealed the first look at the state of Leonida, Vice City, and protagonists Lucia and Jason.',
      'pt-BR': 'A Rockstar Games revelou oficialmente o primeiro vislumbre do estado de Leonida, Vice City e dos protagonistas Lucia e Jason.',
      es: 'Rockstar Games reveló oficialmente el primer vistazo al estado de Leonida, Vice City y los protagonistas Lucía y Jason.',
    },
  },
  // 2. Análise de Jogo (Exemplo comunitário com placeholder: true)
  {
    id: 'news-leonida-waterways-analysis',
    slug: 'analise-hidrografica-leonida',
    kind: 'game',
    sourceUrl: 'https://www.rockstargames.com/VI',
    publishedAt: '2023-12-05T00:00:00.000Z',
    confidence: 'community_analysis',
    placeholder: true,
    updatedAt: '2026-11-16T18:00:00.000Z',
    title: {
      en: 'Grassrivers Wetland & Waterway Cartography Breakdown [Placeholder]',
      'pt-BR': 'Mapeamento Hidrográfico e Pântanos de Grassrivers [Placeholder]',
      es: 'Mapeo Hidrográfico y Pantanos de Grassrivers [Placeholder]',
    },
    summary: {
      en: 'Community geospatial cartography identifying navigable canals, airboat docking points, and coastal perimeter zones from trailer footage.',
      'pt-BR': 'Cartografia geoespacial da comunidade identificando canais navegáveis, pontos de atracação de aerobarcos e zonas costeiras.',
      es: 'Cartografía geoespacial de la comunidad identificando canales navegables, atracaderos de hidrodeslizadores y zonas costeras.',
    },
  },
  // 3. Atualização do Site (Changelog Oficial do Projeto - kind: 'site', placeholder: false)
  {
    id: 'site-v1-interactive-map-release',
    slug: 'gtavimap-portal-interativo-v1',
    kind: 'site',
    publishedAt: '2026-11-16T18:00:00.000Z',
    updatedAt: '2026-11-16T18:00:00.000Z',
    placeholder: false,
    title: {
      en: 'GTAVIMap v1.0 — Vector Map & Real-time Progress Tracking',
      'pt-BR': 'GTAVIMap v1.0 — Mapa Vetorial e Rastreamento de Progresso em Tempo Real',
      es: 'GTAVIMap v1.0 — Mapa Vectorial y Seguimiento de Progreso en Tiempo Real',
    },
    summary: {
      en: 'Launch of the high-performance SVG vector map with deep links, category filtering, persistent local storage, and instant viewport zooming.',
      'pt-BR': 'Lançamento do mapa vetorial SVG de alto desempenho com deep links, filtros por categoria, persistência local e zoom responsivo.',
      es: 'Lanzamiento del mapa vectorial SVG de alto rendimiento con enlaces profundos, filtros por categoría y almacenamiento local.',
    },
  },
  // 4. Atualização do Site (Changelog de Performance & Acessibilidade)
  {
    id: 'site-performance-wcag-accessibility',
    slug: 'otimizacoes-wcag-aa-performance',
    kind: 'site',
    publishedAt: '2026-11-16T19:30:00.000Z',
    updatedAt: '2026-11-16T19:30:00.000Z',
    placeholder: false,
    title: {
      en: 'Performance Optimization & WCAG AA Accessibility Overhaul',
      'pt-BR': 'Otimização de Performance e Acessibilidade WCAG AA',
      es: 'Optimización de Rendimiento y Accesibilidad WCAG AA',
    },
    summary: {
      en: 'Achieved 100% accessibility score on map and home views with 44px touch targets, immutable asset caching, and contrast ratio compliance.',
      'pt-BR': 'Alcançada nota 100 de acessibilidade nas visões do mapa e portal com alvos de toque de 44px, cache de assets imutável e contraste WCAG AA.',
      es: 'Alcanzada puntuación 100 de accesibilidad en vistas del mapa y portal con objetivos táctiles de 44px y contraste WCAG AA.',
    },
  },
  // 5. Atualização do Site (Changelog de Internacionalização & Consentimento)
  {
    id: 'site-trilingual-privacy-compliance',
    slug: 'internacionalizacao-trilingue-privacidade',
    kind: 'site',
    publishedAt: '2026-11-16T20:00:00.000Z',
    updatedAt: '2026-11-16T20:00:00.000Z',
    placeholder: false,
    title: {
      en: 'Trilingual Internationalization & Cookie Consent Framework',
      'pt-BR': 'Internacionalização Trilíngue e Estrutura de Consentimento',
      es: 'Internacionalización Trilingüe y Marco de Consentimiento',
    },
    summary: {
      en: 'Seamless language switching across English, Portuguese, and Spanish, accompanied by complete legal transparency and granular cookie management.',
      'pt-BR': 'Alternância fluida entre inglês, português e espanhol, com páginas de transparência jurídica e controle granular de cookies.',
      es: 'Cambio fluido entre inglés, portugués y español, con páginas de transparencia legal y gestión granular de cookies.',
    },
  },
];

/**
 * Retorna os itens de notícias e changelog respeitando o ambiente.
 * Em produção, itens com placeholder: true são estritamente excluídos.
 */
export function getNewsItems(
  includePlaceholders: boolean = process.env.NODE_ENV !== 'production' && process.env.DATA_MODE !== 'verified'
): NewsItem[] {
  if (includePlaceholders) {
    return NEWS_ITEMS;
  }
  return NEWS_ITEMS.filter((item) => !item.placeholder);
}
