import { Category, CategoryId, MarkerLocation } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getMarkers } from '@/data/markerRepository';
import { REGIONS, RegionData, getRegionById } from '@/data/regions';
import { siteConfig } from '@/config/siteConfig';

/**
 * Converte um CategoryId (formato snake_case, ex: 'stunt_jump')
 * para slug de URL (formato kebab-case, ex: 'stunt-jump').
 */
export function categoryIdToSlug(categoryId: CategoryId): string {
  return categoryId.replace(/_/g, '-');
}

/**
 * Converte um slug de URL (kebab-case, ex: 'stunt-jump')
 * de volta para CategoryId (snake_case, ex: 'stunt_jump').
 * Retorna null se não pertencer à taxonomia oficial de categorias.
 */
export function slugToCategoryId(slug: string): CategoryId | null {
  if (!slug || typeof slug !== 'string') return null;
  const candidate = slug.replace(/-/g, '_') as CategoryId;
  const exists = CATEGORIES.some((cat) => cat.id === candidate);
  return exists ? candidate : null;
}

/**
 * Retorna exclusivamente os marcadores cujo status é 'verified'.
 * Marcadores 'demo', 'trailer_rumor' ou 'unconfirmed' nunca são retornados.
 */
export function getIndexableMarkers(): MarkerLocation[] {
  return getMarkers().filter((marker) => marker.confirmationStatus === 'verified');
}

/**
 * Retorna exclusivamente as categorias que possuem pelo menos 1 marcador verificado.
 */
export function getIndexableCategories(): Category[] {
  const verifiedMarkers = getIndexableMarkers();
  return CATEGORIES.filter((category) =>
    verifiedMarkers.some((marker) => marker.category === category.id)
  );
}

/**
 * Retorna todos os marcadores verificados de uma categoria específica.
 */
export function getVerifiedMarkersByCategory(categoryId: CategoryId): MarkerLocation[] {
  return getIndexableMarkers().filter((marker) => marker.category === categoryId);
}

/**
 * Retorna um marcador verificado específico por categoria e slug.
 */
export function getVerifiedMarkerBySlug(
  categoryId: CategoryId,
  slug: string
): MarkerLocation | null {
  return (
    getIndexableMarkers().find(
      (marker) => marker.category === categoryId && marker.slug === slug
    ) || null
  );
}

/**
 * Verifica se um marcador pertence aos limites (bounds) geográficos de uma região
 * ou possui o campo marker.region correspondente ao id ou nome da região.
 */
export function isMarkerInRegion(marker: MarkerLocation, region: RegionData): boolean {
  if (!marker || !region) return false;

  // 1. Checagem por coordenadas cartográficas dentro de bounds [[minY, minX], [maxY, maxX]]
  const [[minY, minX], [maxY, maxX]] = region.bounds;
  const inBounds =
    marker.y >= minY && marker.y <= maxY && marker.x >= minX && marker.x <= maxX;
  if (inBounds) return true;

  // 2. Matching semântico complementar pelo campo marker.region
  const regionId = region.id.toLowerCase();
  const regionName = region.name.toLowerCase();
  const markerRegion = (marker.region || '').toLowerCase();

  return (
    markerRegion.includes(regionId) ||
    regionId.includes(markerRegion) ||
    markerRegion.includes(regionName)
  );
}

/**
 * Retorna todos os marcadores verificados de uma região específica.
 */
export function getVerifiedMarkersByRegion(regionId: string): MarkerLocation[] {
  const region = getRegionById(regionId);
  if (!region) return [];
  const verifiedList = getIndexableMarkers();
  return verifiedList.filter((m) => isMarkerInRegion(m, region));
}

/**
 * Retorna exclusivamente as regiões que atendem ao critério de conteúdo indexável
 * (quantidade de marcadores verificados >= REGION_MIN_VERIFIED).
 */
export function getIndexableRegions(): RegionData[] {
  const minRequired = siteConfig.regionMinVerified || 3;
  return REGIONS.filter((region) => getVerifiedMarkersByRegion(region.id).length >= minRequired);
}

/**
 * Indica se uma região específica possui marcadores suficientes para indexação.
 */
export function isRegionIndexable(regionId: string): boolean {
  const minRequired = siteConfig.regionMinVerified || 3;
  return getVerifiedMarkersByRegion(regionId).length >= minRequired;
}
