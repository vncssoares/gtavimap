import { MarkerLocation, CategoryId, MapFilterState, UserProgress, Language } from '@/types';
import { getMarkers } from '@/data/markerRepository';
import { CATEGORIES } from '@/data/categories';

export interface CategoryStats {
  categoryId: CategoryId;
  total: number;
  found: number;
  percentage: number;
}

export const MarkerService = {
  getAllMarkers(): MarkerLocation[] {
    return getMarkers();
  },

  getMarkerById(id: string): MarkerLocation | undefined {
    return getMarkers().find((m) => m.id === id);
  },

  filterMarkers(
    markers: MarkerLocation[],
    filterState: MapFilterState,
    progress: UserProgress,
    lang: Language = 'en'
  ): MarkerLocation[] {
    return markers.filter((marker) => {
      // 1. Filtro por Categoria
      if (filterState.selectedCategories.length > 0 && !filterState.selectedCategories.includes(marker.category)) {
        return false;
      }

      // 2. Filtro por Status de Progresso
      if (filterState.filterStatus === 'found') {
        if (!progress.foundMarkerIds.includes(marker.id)) return false;
      } else if (filterState.filterStatus === 'unfound') {
        if (progress.foundMarkerIds.includes(marker.id)) return false;
      } else if (filterState.filterStatus === 'favorites') {
        if (!progress.favoriteMarkerIds.includes(marker.id)) return false;
      }

      // 3. Filtro por Região
      if (filterState.selectedRegion && filterState.selectedRegion !== 'all') {
        if (marker.region !== filterState.selectedRegion) return false;
      }

      // 4. Filtro por Pesquisa Textual
      if (filterState.searchQuery && filterState.searchQuery.trim() !== '') {
        const query = filterState.searchQuery.toLowerCase().trim();
        const desc = (marker.description[lang] || marker.description.en).toLowerCase();
        const name = marker.name.toLowerCase();
        const region = marker.region.toLowerCase();
        const subCat = (marker.subCategory || '').toLowerCase();
        const tags = (marker.tags || []).map((t) => t.toLowerCase()).join(' ');

        const matches =
          name.includes(query) ||
          desc.includes(query) ||
          region.includes(query) ||
          subCat.includes(query) ||
          tags.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  },

  getCategoryStats(markers: MarkerLocation[], progress: UserProgress): CategoryStats[] {
    return CATEGORIES.map((cat) => {
      const catMarkers = markers.filter((m) => m.category === cat.id);
      const total = catMarkers.length;
      const found = catMarkers.filter((m) => progress.foundMarkerIds.includes(m.id)).length;
      const percentage = total > 0 ? Math.round((found / total) * 100) : 0;

      return {
        categoryId: cat.id,
        total,
        found,
        percentage,
      };
    });
  },

  getOverallStats(markers: MarkerLocation[], progress: UserProgress) {
    const total = markers.length;
    const found = markers.filter((m) => progress.foundMarkerIds.includes(m.id)).length;
    const percentage = total > 0 ? Math.round((found / total) * 100) : 0;

    return {
      total,
      found,
      percentage,
      favoritesCount: progress.favoriteMarkerIds.length,
    };
  },

  getUniqueRegions(markers: MarkerLocation[]): string[] {
    const regions = new Set<string>();
    markers.forEach((m) => {
      if (m.region) regions.add(m.region);
    });
    return Array.from(regions).sort();
  },
};
