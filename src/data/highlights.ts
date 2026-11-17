import { Language } from '@/types';

export interface TrailerHighlightItem {
  id: string;
  timestamp: string; // formato "mm:ss"
  seconds: number;   // segundos para o parâmetro &t=...s
  title: Record<Language, string>;
  description: Record<Language, string>;
  placeholder?: boolean;
}

export const ROCKSTAR_OFFICIAL_TRAILER_URL = 'https://www.youtube.com/watch?v=QdBZY2fkU-0';

/**
 * Momentos de destaque com timestamps do Trailer Oficial 1 de Grand Theft Auto VI.
 * Itens marcados com placeholder: true só renderizam em desenvolvimento
 * conforme a política de integridade de dados editoriais.
 */
export const TRAILER_HIGHLIGHTS: TrailerHighlightItem[] = [
  {
    id: 'intro_prison',
    timestamp: '00:08',
    seconds: 8,
    title: {
      'pt-BR': 'Penitenciária de Leonida & Diálogo de Lucia',
      en: 'Leonida Correctional Facility & Lucia Interview',
      es: 'Centro Penitenciario de Leonida y Diálogo de Lucia',
    },
    description: {
      'pt-BR': 'Primeira visão oficial de Lucia dentro da penitenciária estadual refletindo sobre más escolhas.',
      en: 'First official look at Lucia inside the state prison discussing life choices with her counselor.',
      es: 'Primer vistazo oficial a Lucia en la prisión estatal reflexionando sobre sus decisiones.',
    },
    placeholder: false,
  },
  {
    id: 'vice_city_pan',
    timestamp: '00:25',
    seconds: 25,
    title: {
      'pt-BR': 'Panorama de Vice Beach & Orla Costeira',
      en: 'Vice Beach Skyline & Coastal Highway',
      es: 'Panorámica de Vice Beach y Costa',
    },
    description: {
      'pt-BR': 'Vista panorâmica do litoral de Vice Beach, lanchas rápidas e tráfego na rodovia costeira.',
      en: 'Sweeping vista of Vice Beach coastline, speedboats, and active coastal highway traffic.',
      es: 'Vista panorámica de la costa de Vice Beach, lanchas rápidas y tráfico en la autopista costera.',
    },
    placeholder: false,
  },
  {
    id: 'everglades_nature',
    timestamp: '00:34',
    seconds: 34,
    title: {
      'pt-BR': 'Pântanos dos Everglades & Aerobarco',
      en: 'Grassrivers Wetlands & Airboat Cruise',
      es: 'Humedales de Grassrivers y Aerodeslizador',
    },
    description: {
      'pt-BR': 'Fauna rica com jacarés, flamingos e navegação em aerobarco pelas áreas alagadas de Leonida.',
      en: 'Rich wetlands wildlife with alligators, wading birds, and high-speed airboats.',
      es: 'Fauna con caimanes, flamencos y navegación en aerodeslizador por los humedales de Leonida.',
    },
    placeholder: false,
  },
  {
    id: 'nightlife_clubs',
    timestamp: '00:46',
    seconds: 46,
    title: {
      'pt-BR': 'Vida Noturna & Ruas Iluminadas por Neon',
      en: 'Nightlife & Neon Strip Clubs',
      es: 'Vida Nocturna y Clubes con Luces de Neón',
    },
    description: {
      'pt-BR': 'Apresentação dos carros rebaixados, clubes noturnos e a atmosfera vibrante da cidade.',
      en: 'Cruising lowriders, bustling nightclubs, and the signature Vice City neon aesthetic.',
      es: 'Coches lowrider, clubes nocturnos y la estética vibrante de neón de Vice City.',
    },
    placeholder: false,
  },
  {
    id: 'duo_heist_store',
    timestamp: '01:10',
    seconds: 110,
    title: {
      'pt-BR': 'Assalto à Loja de Conveniência (Lucia & Jason)',
      en: 'Convenience Store Heist (Lucia & Jason)',
      es: 'Asalto a Tienda de Conveniencia (Lucia y Jason)',
    },
    description: {
      'pt-BR': 'Ação coordenada de assalto à mão armada com máscaras e fuga em alta velocidade.',
      en: 'Synchronized armed robbery sequence with bandana masks and fast getaway vehicle.',
      es: 'Asalto coordinado a mano armada con pañuelos y huida en vehículo a alta velocidad.',
    },
    placeholder: false,
  },
];

export function getVisibleHighlights(): TrailerHighlightItem[] {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return TRAILER_HIGHLIGHTS.filter((item) => !item.placeholder);
  }
  return TRAILER_HIGHLIGHTS;
}
