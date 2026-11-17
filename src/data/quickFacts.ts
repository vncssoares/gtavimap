import { LAUNCH_AT_ISO } from './gameInfo';

export type FactConfidence = 'official' | 'community_estimate' | 'unconfirmed';

export interface QuickFactItem {
  id: string;
  label: {
    en: string;
    'pt-BR': string;
    es: string;
  };
  value: {
    en: string;
    'pt-BR': string;
    es: string;
  };
  source?: string; // URL oficial
  confidence: FactConfidence;
  placeholder?: boolean;
}

/**
 * Fatos Rápidos e Especificações de GTA VI.
 * Itens marcados com placeholder: true NÃO renderizam em produção
 * (ficam disponíveis apenas em desenvolvimento para conferência antes do preenchimento oficial com fontes).
 */
export const QUICK_FACTS_ITEMS: QuickFactItem[] = [
  {
    id: 'developer',
    label: {
      en: 'Developer',
      'pt-BR': 'Desenvolvedora',
      es: 'Desarrolladora',
    },
    value: {
      en: '[Placeholder: Rockstar Games]',
      'pt-BR': '[Placeholder: Rockstar Games]',
      es: '[Placeholder: Rockstar Games]',
    },
    source: 'https://www.rockstargames.com/VI',
    confidence: 'official',
    placeholder: true,
  },
  {
    id: 'release-date',
    label: {
      en: 'Release Window',
      'pt-BR': 'Data de Lançamento',
      es: 'Fecha de Lanzamiento',
    },
    value: {
      en: `[Placeholder: ${LAUNCH_AT_ISO.split('T')[0]}]`,
      'pt-BR': `[Placeholder: ${LAUNCH_AT_ISO.split('T')[0]}]`,
      es: `[Placeholder: ${LAUNCH_AT_ISO.split('T')[0]}]`,
    },
    source: 'https://www.rockstargames.com/VI',
    confidence: 'official',
    placeholder: true,
  },
  {
    id: 'platforms',
    label: {
      en: 'Platforms',
      'pt-BR': 'Plataformas',
      es: 'Plataformas',
    },
    value: {
      en: '[Placeholder: PlayStation 5, Xbox Series X|S]',
      'pt-BR': '[Placeholder: PlayStation 5, Xbox Series X|S]',
      es: '[Placeholder: PlayStation 5, Xbox Series X|S]',
    },
    source: 'https://www.rockstargames.com/VI',
    confidence: 'official',
    placeholder: true,
  },
  {
    id: 'setting',
    label: {
      en: 'Setting',
      'pt-BR': 'Cenário / Ambientação',
      es: 'Ambientación',
    },
    value: {
      en: '[Placeholder: State of Leonida, Vice City]',
      'pt-BR': '[Placeholder: Estado de Leonida, Vice City]',
      es: '[Placeholder: Estado de Leonida, Vice City]',
    },
    source: 'https://www.rockstargames.com/VI',
    confidence: 'official',
    placeholder: true,
  },
  {
    id: 'protagonists',
    label: {
      en: 'Protagonists',
      'pt-BR': 'Protagonistas',
      es: 'Protagonistas',
    },
    value: {
      en: '[Placeholder: Lucia & Jason]',
      'pt-BR': '[Placeholder: Lucia e Jason]',
      es: '[Placeholder: Lucia y Jason]',
    },
    source: 'https://www.rockstargames.com/VI',
    confidence: 'official',
    placeholder: true,
  },
  {
    id: 'map-size',
    label: {
      en: 'Map Scale & Scope',
      'pt-BR': 'Dimensão do Mapa',
      es: 'Escala del Mapa',
    },
    value: {
      en: '[Placeholder: Community cartography estimate]',
      'pt-BR': '[Placeholder: Estimativa cartográfica comunitária]',
      es: '[Placeholder: Estimación cartográfica comunitaria]',
    },
    confidence: 'community_estimate',
    placeholder: true,
  },
];

/**
 * Retorna os itens de QuickFacts filtrados conforme o ambiente:
 * Em produção, itens com placeholder: true são estritamente ocultados.
 */
export function getQuickFacts(): QuickFactItem[] {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return QUICK_FACTS_ITEMS.filter((item) => !item.placeholder);
  }
  return QUICK_FACTS_ITEMS;
}
