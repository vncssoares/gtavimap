import { Category, CategoryId, MarkerLocation } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { DEMO_MARKERS } from '@/data/markers';

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
  return DEMO_MARKERS.filter((marker) => marker.confirmationStatus === 'verified');
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
