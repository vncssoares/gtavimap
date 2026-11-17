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
    color: '#38f8ff', // Azul Ciano brilhante otimizado WCAG AA (>= 4.5:1)
    badgeBg: 'rgba(0, 229, 255, 0.08)',
  },
  {
    id: 'hidden_package',
    group: 'COLLECTIBLES',
    nameKey: 'categories.hidden_package',
    shortLabel: 'HIDDEN PACKAGE',
    descriptionKey: 'categories.hidden_package_desc',
    iconName: 'Trophy',
    color: '#60a5fa', // Azul Celeste otimizado
    badgeBg: 'rgba(96, 165, 250, 0.08)',
  },
  {
    id: 'collectibles',
    group: 'COLLECTIBLES',
    nameKey: 'categories.collectibles',
    shortLabel: 'COLLECTIBLE',
    descriptionKey: 'categories.collectibles_desc',
    iconName: 'MapPin',
    color: '#c084fc', // Roxo Neon otimizado
    badgeBg: 'rgba(192, 132, 252, 0.08)',
  },
  {
    id: 'points_of_interest',
    group: 'COLLECTIBLES',
    nameKey: 'categories.points_of_interest',
    shortLabel: 'WILDLIFE / POI',
    descriptionKey: 'categories.points_of_interest_desc',
    iconName: 'Eye',
    color: '#fb923c', // Laranja Coral otimizado
    badgeBg: 'rgba(251, 146, 60, 0.08)',
  },

  // ================= ACTIVITIES =================
  {
    id: 'robbery',
    group: 'ACTIVITIES',
    nameKey: 'categories.robbery',
    shortLabel: 'ROBBERY',
    descriptionKey: 'categories.robbery_desc',
    iconName: 'Crosshair',
    color: '#ff4d9e', // Rosa Choque Neon otimizado
    badgeBg: 'rgba(255, 77, 158, 0.08)',
  },
  {
    id: 'race',
    group: 'ACTIVITIES',
    nameKey: 'categories.race',
    shortLabel: 'RACE',
    descriptionKey: 'categories.race_desc',
    iconName: 'Flag',
    color: '#f472b6', // Rosa Pink otimizado
    badgeBg: 'rgba(244, 114, 182, 0.08)',
  },
  {
    id: 'activities',
    group: 'ACTIVITIES',
    nameKey: 'categories.activities',
    shortLabel: 'ENCOUNTER',
    descriptionKey: 'categories.activities_desc',
    iconName: 'Gamepad2',
    color: '#38f8ff', // Ciano otimizado
    badgeBg: 'rgba(0, 229, 255, 0.08)',
  },
  {
    id: 'missions',
    group: 'ACTIVITIES',
    nameKey: 'categories.missions',
    shortLabel: 'CAMP / MISSION',
    descriptionKey: 'categories.missions_desc',
    iconName: 'Sparkles',
    color: '#22d3ee', // Teal/Ciano otimizado
    badgeBg: 'rgba(34, 211, 238, 0.08)',
  },

  // ================= SERVICES =================
  {
    id: 'ammunition',
    group: 'SERVICES',
    nameKey: 'categories.ammunition',
    shortLabel: 'AMMUNITION',
    descriptionKey: 'categories.ammunition_desc',
    iconName: 'Crosshair',
    color: '#ff4d9e', // Rosa Choque otimizado
    badgeBg: 'rgba(255, 77, 158, 0.08)',
  },
  {
    id: 'safehouse',
    group: 'SERVICES',
    nameKey: 'categories.safehouse',
    shortLabel: 'SAFEHOUSE',
    descriptionKey: 'categories.safehouse_desc',
    iconName: 'MapPin',
    color: '#60a5fa', // Azul Claro otimizado
    badgeBg: 'rgba(96, 165, 250, 0.08)',
  },
  {
    id: 'pay_n_spray',
    group: 'SERVICES',
    nameKey: 'categories.pay_n_spray',
    shortLabel: 'PAY \'N\' SPRAY',
    descriptionKey: 'categories.pay_n_spray_desc',
    iconName: 'Car',
    color: '#c084fc', // Roxo Neon otimizado
    badgeBg: 'rgba(192, 132, 252, 0.08)',
  },
  {
    id: 'shops',
    group: 'SERVICES',
    nameKey: 'categories.shops',
    shortLabel: 'SHOPS',
    descriptionKey: 'categories.shops_desc',
    iconName: 'ShoppingBag',
    color: '#fcd34d', // Dourado otimizado
    badgeBg: 'rgba(252, 211, 77, 0.08)',
  },

  // ================= LOCATIONS & WEAPONS =================
  {
    id: 'locations',
    group: 'LOCATIONS',
    nameKey: 'categories.locations',
    shortLabel: 'LOCATIONS',
    descriptionKey: 'categories.locations_desc',
    iconName: 'Compass',
    color: '#22d3ee', // Ciano Neon otimizado
    badgeBg: 'rgba(34, 211, 238, 0.08)',
  },
  {
    id: 'vehicles',
    group: 'LOCATIONS',
    nameKey: 'categories.vehicles',
    shortLabel: 'VEHICLES',
    descriptionKey: 'categories.vehicles_desc',
    iconName: 'Car',
    color: '#fb923c', // Laranja otimizado
    badgeBg: 'rgba(251, 146, 60, 0.08)',
  },
  {
    id: 'weapons',
    group: 'WEAPONS',
    nameKey: 'categories.weapons',
    shortLabel: 'WEAPONS',
    descriptionKey: 'categories.weapons_desc',
    iconName: 'Crosshair',
    color: '#fb7185', // Rosa Avermelhado otimizado
    badgeBg: 'rgba(251, 113, 133, 0.08)',
  },
];
