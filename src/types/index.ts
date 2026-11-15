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

export type ConfirmationStatus = 'demo' | 'trailer_rumor' | 'unconfirmed';

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
