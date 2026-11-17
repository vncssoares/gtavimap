import React from 'react';
import {
  MapPin,
  Star,
  Trophy,
  Eye,
  Crosshair,
  Flag,
  Gamepad2,
  Sparkles,
  Car,
  ShoppingBag,
  Compass,
  LucideIcon,
} from 'lucide-react';

/**
 * Mapa estático com apenas os ícones estritamente necessários para categorias cartográficas,
 * viabilizando tree-shaking do lucide-react sem importar o catálogo completo.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Star,
  Trophy,
  Eye,
  Crosshair,
  Flag,
  Gamepad2,
  Sparkles,
  Car,
  ShoppingBag,
  Compass,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 18, className = '', color }) => {
  const IconComponent = ICON_MAP[name] || MapPin;
  return <IconComponent size={size} className={className} color={color} />;
};

