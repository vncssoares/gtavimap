export type Language = 'en' | 'pt-BR' | 'es';

export type CategoryGroup = 'COLLECTIBLES' | 'ACTIVITIES' | 'SERVICES' | 'WEAPONS' | 'LOCATIONS';

export type CategoryId =
  | 'locations'
  | 'shops'
  | 'vehicles'
  | 'weapons'
  | 'activities'
  | 'collectibles'
  | 'missions'
  | 'points_of_interest'
  // Itens específicos alinhados com a HUD da imagem:
  | 'stunt_jump'
  | 'hidden_package'
  | 'ammunition'
  | 'safehouse'
  | 'pay_n_spray'
  | 'race'
  | 'robbery'
  | 'encounter';

export type ConfirmationStatus = 'demo' | 'trailer_rumor' | 'unconfirmed' | 'verified';

export interface Category {
  id: CategoryId;
  group: CategoryGroup;
  nameKey: string;
  shortLabel: string;
  descriptionKey: string;
  iconName: string;
  color: string;
  badgeBg: string;
}

export interface MarkerLocation {
  id: string;
  slug: string; // kebab-case, único por categoria
  name: string;
  category: CategoryId;
  subCategory?: string;
  x: number; // Coordenada X no espaço cartográfico (0 - 1000)
  y: number; // Coordenada Y no espaço cartográfico (0 - 1000)
  description: {
    en: string;
    'pt-BR': string;
    es: string;
  };
  region: string;
  confirmationStatus: ConfirmationStatus;
  source: string;
  imageUrl?: string;
  recommendedTime?: string;
  reward?: string;
  tags?: string[];
  updatedAt?: string; // Data ISO da última atualização (usado no sitemap)
  verifiedAt?: string; // Data ISO de quando o ponto foi verificado no jogo
  spoiler?: boolean; // Se verdadeiro, oculta a descrição até o clique para evitar spoilers
}

export interface UserProgress {
  foundMarkerIds: string[];
  favoriteMarkerIds: string[];
  userNotes: Record<string, string>;
  updatedAt: string;
}

export type FilterStatus = 'all' | 'unfound' | 'found' | 'favorites';

export interface MapFilterState {
  searchQuery: string;
  selectedCategories: CategoryId[];
  filterStatus: FilterStatus;
  selectedRegion?: string;
}

export type ConfidenceLevel = 'official' | 'community_analysis';
export type ContentKind = 'game' | 'site';

export interface GameplayItem {
  id: string;
  slug: string;
  categoryId: CategoryId;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  kind: 'game';
  sourceUrl: string; // Exigido para fatos do jogo
  publishedAt: string; // Data ISO 8601
  confidence: ConfidenceLevel;
  placeholder?: boolean;
  updatedAt: string; // Data ISO 8601
  illustration: 'heist' | 'tuning' | 'wildlife';
}

export interface NewsItem {
  id: string;
  slug: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  kind: ContentKind;
  sourceUrl?: string; // Exigido se kind === 'game', opcional para kind === 'site'
  publishedAt: string; // Data ISO 8601
  confidence?: ConfidenceLevel; // Exigido para fatos do jogo
  placeholder?: boolean;
  updatedAt: string; // Data ISO 8601
}
