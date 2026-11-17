import type { GameplayItem } from '../types/index.ts';

/**
 * Data da última revisão editorial do conteúdo de gameplay e mecânicas.
 */
export const LAST_REVIEWED_GAMEPLAY_ISO = '2026-11-16T18:00:00.000Z';

/**
 * Catálogo de Gameplay e Mecânicas de Leonida.
 * Fatos do jogo exigem sourceUrl oficial, publishedAt ISO e confidence.
 * Itens com placeholder: true são renderizados apenas em desenvolvimento com selo visual.
 */
export const GAMEPLAY_ITEMS: GameplayItem[] = [
  {
    id: 'gameplay-heist-planning',
    slug: 'planejamento-assaltos-infiltracao',
    categoryId: 'robbery',
    kind: 'game',
    sourceUrl: 'https://www.rockstargames.com/VI',
    publishedAt: '2023-12-05T00:00:00.000Z',
    confidence: 'official',
    placeholder: true,
    updatedAt: '2026-11-16T18:00:00.000Z',
    illustration: 'heist',
    title: {
      en: 'Dynamic Heist & Robbery Operations [Placeholder]',
      'pt-BR': 'Planejamento de Assaltos e Operações Táticas [Placeholder]',
      es: 'Planificación de Asaltos y Operaciones Tácticas [Placeholder]',
    },
    summary: {
      en: 'Structured coordination for cash register incursions, convenience store robberies, and coordinated getaway routes across Vice City districts.',
      'pt-BR': 'Coordenação estruturada para incursões em caixas registradoras, assaltos a estabelecimentos comerciais e rotas de fuga sincronizadas pelos distritos de Vice City.',
      es: 'Coordinación estructurada para incursiones en cajas registradoras, asaltos a establecimientos comerciales y rutas de escape sincronizadas por los distritos de Vice City.',
    },
  },
  {
    id: 'gameplay-vehicle-tuning',
    slug: 'dinamica-veicular-customizacao',
    categoryId: 'pay_n_spray',
    kind: 'game',
    sourceUrl: 'https://www.rockstargames.com/VI',
    publishedAt: '2023-12-05T00:00:00.000Z',
    confidence: 'community_analysis',
    placeholder: true,
    updatedAt: '2026-11-16T18:00:00.000Z',
    illustration: 'tuning',
    title: {
      en: 'High-Fidelity Vehicle Customization & Physics [Placeholder]',
      'pt-BR': 'Física Veicular e Customização em Oficinas [Placeholder]',
      es: 'Física Vehicular y Personalización en Talleres [Placeholder]',
    },
    summary: {
      en: 'Community analysis of vehicle telemetry, tire deformation on wetland terrain, and specialized tuning shops identified throughout Leonida.',
      'pt-BR': 'Análise comunitária sobre telemetria veicular, deformação de pneus em terrenos pantanosos e oficinas especializadas de modificação observadas em Leonida.',
      es: 'Análisis comunitario sobre telemetría vehicular, deformación de neumáticos en terrenos pantanosos y talleres especializados de modificación observados en Leonida.',
    },
  },
];

/**
 * Retorna os itens de gameplay respeitando o ambiente.
 * Em produção, itens com placeholder: true são estritamente excluídos.
 */
export function getGameplayItems(
  includePlaceholders: boolean = process.env.NODE_ENV !== 'production' && process.env.DATA_MODE !== 'verified'
): GameplayItem[] {
  if (includePlaceholders) {
    return GAMEPLAY_ITEMS;
  }
  return GAMEPLAY_ITEMS.filter((item) => !item.placeholder);
}
