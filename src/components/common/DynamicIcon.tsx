import React from 'react';
import {
  MapPin,
  ShoppingBag,
  Car,
  Crosshair,
  Gamepad2,
  Trophy,
  Flag,
  Eye,
  Search,
  Check,
  Star,
  Compass,
  Filter,
  Layers,
  Info,
  Maximize2,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
  Zap,
  Menu,
  X,
  Share2,
  Copy,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  ShoppingBag,
  Car,
  Crosshair,
  Gamepad2,
  Trophy,
  Flag,
  Eye,
  Search,
  Check,
  Star,
  Compass,
  Filter,
  Layers,
  Info,
  Maximize2,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
  Zap,
  Menu,
  X,
  Share2,
  Copy,
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
