import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  // ================= COLLECTIBLES =================
  {
    id: 'stunt_jump',
    group: 'COLLECTIBLES',
    nameKey: 'categories.stunt_jump',
    shortLabel: 'STUNT JUMP',
    descriptionKey: 'categories.stunt_jump_desc',
    iconName: 'Star',
    color: '#00e5ff', // Azul Ciano brilhante
    badgeBg: 'rgba(0, 229, 255, 0.15)',
  },
  {
    id: 'hidden_package',
    group: 'COLLECTIBLES',
    nameKey: 'categories.hidden_package',
    shortLabel: 'HIDDEN PACKAGE',
    descriptionKey: 'categories.hidden_package_desc',
    iconName: 'Trophy',
    color: '#38bdf8', // Azul Celeste
    badgeBg: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 'collectibles',
    group: 'COLLECTIBLES',
    nameKey: 'categories.collectibles',
    shortLabel: 'COLLECTIBLE',
    descriptionKey: 'categories.collectibles_desc',
    iconName: 'MapPin',
    color: '#a855f7', // Roxo Neon
    badgeBg: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 'points_of_interest',
    group: 'COLLECTIBLES',
    nameKey: 'categories.points_of_interest',
    shortLabel: 'WILDLIFE / POI',
    descriptionKey: 'categories.points_of_interest_desc',
    iconName: 'Eye',
    color: '#ff7043', // Laranja Coral
    badgeBg: 'rgba(255, 112, 67, 0.15)',
  },

  // ================= ACTIVITIES =================
  {
    id: 'robbery',
    group: 'ACTIVITIES',
    nameKey: 'categories.robbery',
    shortLabel: 'ROBBERY',
    descriptionKey: 'categories.robbery_desc',
    iconName: 'Crosshair',
    color: '#ff2a85', // Rosa Choque Neon
    badgeBg: 'rgba(255, 42, 133, 0.15)',
  },
  {
    id: 'race',
    group: 'ACTIVITIES',
    nameKey: 'categories.race',
    shortLabel: 'RACE',
    descriptionKey: 'categories.race_desc',
    iconName: 'Flag',
    color: '#ec4899', // Rosa Pink
    badgeBg: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'activities',
    group: 'ACTIVITIES',
    nameKey: 'categories.activities',
    shortLabel: 'ENCOUNTER',
    descriptionKey: 'categories.activities_desc',
    iconName: 'Gamepad2',
    color: '#00e5ff', // Ciano
    badgeBg: 'rgba(0, 229, 255, 0.15)',
  },
  {
    id: 'missions',
    group: 'ACTIVITIES',
    nameKey: 'categories.missions',
    shortLabel: 'CAMP / MISSION',
    descriptionKey: 'categories.missions_desc',
    iconName: 'Sparkles',
    color: '#06b6d4', // Teal/Ciano
    badgeBg: 'rgba(6, 182, 212, 0.15)',
  },

  // ================= SERVICES =================
  {
    id: 'ammunition',
    group: 'SERVICES',
    nameKey: 'categories.ammunition',
    shortLabel: 'AMMUNITION',
    descriptionKey: 'categories.ammunition_desc',
    iconName: 'Crosshair',
    color: '#ff2a85', // Rosa Choque
    badgeBg: 'rgba(255, 42, 133, 0.15)',
  },
  {
    id: 'safehouse',
    group: 'SERVICES',
    nameKey: 'categories.safehouse',
    shortLabel: 'SAFEHOUSE',
    descriptionKey: 'categories.safehouse_desc',
    iconName: 'MapPin',
    color: '#38bdf8', // Azul Claro
    badgeBg: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 'pay_n_spray',
    group: 'SERVICES',
    nameKey: 'categories.pay_n_spray',
    shortLabel: 'PAY \'N\' SPRAY',
    descriptionKey: 'categories.pay_n_spray_desc',
    iconName: 'Car',
    color: '#a855f7', // Roxo Neon
    badgeBg: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 'shops',
    group: 'SERVICES',
    nameKey: 'categories.shops',
    shortLabel: 'SHOPS',
    descriptionKey: 'categories.shops_desc',
    iconName: 'ShoppingBag',
    color: '#fbbf24', // Dourado
    badgeBg: 'rgba(251, 191, 36, 0.15)',
  },

  // ================= LOCATIONS & WEAPONS =================
  {
    id: 'locations',
    group: 'LOCATIONS',
    nameKey: 'categories.locations',
    shortLabel: 'LOCATIONS',
    descriptionKey: 'categories.locations_desc',
    iconName: 'Compass',
    color: '#00ff66', // Verde Neon
    badgeBg: 'rgba(0, 255, 102, 0.15)',
  },
  {
    id: 'vehicles',
    group: 'LOCATIONS',
    nameKey: 'categories.vehicles',
    shortLabel: 'VEHICLES',
    descriptionKey: 'categories.vehicles_desc',
    iconName: 'Car',
    color: '#fb923c', // Laranja
    badgeBg: 'rgba(251, 146, 60, 0.15)',
  },
  {
    id: 'weapons',
    group: 'WEAPONS',
    nameKey: 'categories.weapons',
    shortLabel: 'WEAPONS',
    descriptionKey: 'categories.weapons_desc',
    iconName: 'Crosshair',
    color: '#f43f5e', // Rosa Avermelhado
    badgeBg: 'rgba(244, 63, 94, 0.15)',
  },
];
