import { Language } from '@/types';

export interface RegionData {
  id: string;
  name: string;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  bounds: [[number, number], [number, number]]; // [[minY, minX], [maxY, maxX]]
  color: string;
  tag: string;
}

export const REGIONS: RegionData[] = [
  {
    id: 'vice_city',
    name: 'Vice City',
    subtitle: {
      'pt-BR': 'Metrópole Neon & Litoral',
      en: 'Neon Metropolis & Coastline',
      es: 'Metrópolis Neón y Costa',
    },
    description: {
      'pt-BR':
        'A metrópole banhada a neon de Ocean Beach, arranha-céus reluzentes de Downtown e o centro econômico de Leonida.',
      en:
        'The iconic neon-lit metropolis of Ocean Beach, Downtown commercial high-rises, and the vibrant economic core of Leonida.',
      es:
        'La metrópolis iluminada por neón de Ocean Beach, los rascacielos de Downtown y el corazón económico de Leonida.',
    },
    bounds: [
      [350, 550],
      [700, 950],
    ],
    color: '#ff2a85',
    tag: 'METROPOLIS',
  },
  {
    id: 'leonida_keys',
    name: 'Leonida Keys',
    subtitle: {
      'pt-BR': 'Arquipélago & Pontes Oceânicas',
      en: 'Archipelago & Overseas Highway',
      es: 'Archipiélago y Puentes Marítimos',
    },
    description: {
      'pt-BR':
        'Cadeia de ilhas tropicais interligadas por longas pontes sobre o mar, marinas de iates e esconderijos remotos.',
      en:
        'Chain of tropical islands linked by extensive overseas causeways, private yacht docks, and quiet maritime hideouts.',
      es:
        'Cadena de islas tropicales unidas por largos viaductos sobre el océano, puertos deportivos y refugios costeros.',
    },
    bounds: [
      [50, 280],
      [280, 780],
    ],
    color: '#00e5ff',
    tag: 'ARCHIPELAGO',
  },
  {
    id: 'grassrivers',
    name: 'Grassrivers',
    subtitle: {
      'pt-BR': 'Pântanos & Fauna Selvagem',
      en: 'Subtropical Swamps & Wildlife',
      es: 'Humedales y Fauna Salvaje',
    },
    description: {
      'pt-BR':
        'Vasto ecossistema de pântanos subtropicais com aligátores selvagens, canais navegáveis por aerobarco e lamaçais off-road.',
      en:
        'Expansive subtropical wetland ecosystem teeming with wild alligators, narrow airboat waterways, and muddy trails.',
      es:
        'Extenso ecosistema de pantanos subtropicales con caimanes salvajes, canales de aerodeslizadores y senderos de barro.',
    },
    bounds: [
      [280, 150],
      [580, 520],
    ],
    color: '#10b981',
    tag: 'WETLANDS',
  },
  {
    id: 'mount_kalaga',
    name: 'Mount Kalaga',
    subtitle: {
      'pt-BR': 'Cordilheiras & Florestas do Norte',
      en: 'Northern Peaks & Wilderness',
      es: 'Cumbres y Bosques del Norte',
    },
    description: {
      'pt-BR':
        'Picos montanhosos escarpados ao norte do estado, cercados por florestas densas, mirantes panorâmicos e trilhas sinuosas.',
      en:
        'Rugged highland terrain to the far north featuring scenic ridge vistas, state park trails, and communications relays.',
      es:
        'Terreno montañoso al extremo norte con miradores panorámicos, densos parques forestales y caminos sinuosos.',
    },
    bounds: [
      [680, 200],
      [960, 620],
    ],
    color: '#a855f7',
    tag: 'HIGHLANDS',
  },
  {
    id: 'port_gellhorn',
    name: 'Port Gellhorn',
    subtitle: {
      'pt-BR': 'Porto Industrial & Refinarias',
      en: 'Industrial Port & Shipyards',
      es: 'Puerto Industrial y Astilleros',
    },
    description: {
      'pt-BR':
        'Complexo portuário e centro industrial no litoral oeste, repleto de galpões logísticos, docas de carga e pistas de teste.',
      en:
        'Western industrial port district characterized by cargo shipping yards, logistics warehouses, and drag strips.',
      es:
        'Distrito portuario industrial al oeste, con astilleros de carga, almacenes de distribución y zonas de prueba.',
    },
    bounds: [
      [380, 40],
      [680, 320],
    ],
    color: '#fbbf24',
    tag: 'INDUSTRIAL',
  },
  {
    id: 'ambrosia',
    name: 'Ambrosia',
    subtitle: {
      'pt-BR': 'Campos Agrícolas & Interior',
      en: 'Heartland & Farmlands',
      es: 'Campos Agrícolas e Interior',
    },
    description: {
      'pt-BR':
        'Polo agrícola do interior com extensos canaviais, comunidades rurais de interior, rodeios e pistas de pouso em terra batida.',
      en:
        'Central agricultural heartland known for vast sugarcane plantations, rural ranches, local speedways, and dirt airstrips.',
      es:
        'Zona rural central con plantaciones de caña de azúcar, haciendas ganaderas, rodeos locales y aeródromos rurales.',
    },
    bounds: [
      [580, 430],
      [860, 780],
    ],
    color: '#f97316',
    tag: 'HEARTLAND',
  },
];

export function getRegionById(id: string): RegionData | undefined {
  if (!id) return undefined;
  const normalized = id.toLowerCase().trim();
  return REGIONS.find((r) => r.id === normalized);
}

export function isValidRegionId(id: string): boolean {
  return !!getRegionById(id);
}
