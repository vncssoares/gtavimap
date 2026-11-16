'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { CategoryId, FilterStatus, Language, MarkerLocation } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { DEMO_MARKERS } from '@/data/markers';
import { MarkerService } from '@/services/markerService';
import { useUserProgress } from '@/hooks/useUserProgress';
import { CategoryFilterSidebar } from './CategoryFilterSidebar';
import { RightProgressTrackerSidebar } from './RightProgressTrackerSidebar';

const CustomLeafletMap = dynamic(
  () => import('./CustomLeafletMap').then((mod) => mod.CustomLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
        <div className="w-10 h-10 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
        <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
          LOADING GTAVIMAP CARTOGRAPHY...
        </span>
      </div>
    ),
  }
);

interface InteractiveMapClientProps {
  lang: Language;
}

export const InteractiveMapClient: React.FC<InteractiveMapClientProps> = ({ lang }) => {
  const searchParams = useSearchParams();
  const markerParam = searchParams?.get('m') || null;
  const categoryParam = searchParams?.get('c') || null;

  const {
    progress,
    toggleFound,
    toggleFavorite,
    saveNote,
    resetAll,
  } = useUserProgress();

  const [searchQuery, setSearchQuery] = useState('');

  // Inicializa categoria com suporte a deep link (?c=<categoryId>)
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(() => {
    if (categoryParam) {
      const isValid = CATEGORIES.some((c) => c.id === categoryParam);
      if (isValid) {
        const list: CategoryId[] = [categoryParam as CategoryId];
        if (markerParam) {
          const foundMarker = DEMO_MARKERS.find((m) => m.id === markerParam);
          if (foundMarker && !list.includes(foundMarker.category)) {
            list.push(foundMarker.category);
          }
        }
        return list;
      }
    }
    return CATEGORIES.map((c) => c.id);
  });

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Inicializa marcador com suporte a deep link (?m=<markerId>)
  const [selectedMarker, setSelectedMarker] = useState<MarkerLocation | null>(() => {
    if (markerParam) {
      return DEMO_MARKERS.find((m) => m.id === markerParam) || null;
    }
    return null;
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sincroniza se o parâmetro ?m= mudar externamente (ex: navegação no histórico)
  const [prevParamM, setPrevParamM] = useState(markerParam);
  if (markerParam !== prevParamM) {
    setPrevParamM(markerParam);
    const found = markerParam ? DEMO_MARKERS.find((m) => m.id === markerParam) || null : null;
    setSelectedMarker(found);
    if (found) {
      setSelectedCategories((prev) =>
        prev.includes(found.category) ? prev : [...prev, found.category]
      );
    }
  }

  // Atualiza a URL com history.replaceState sem recarregar e sem criar histórico
  const updateUrlMarker = useCallback((markerId: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (markerId) {
        url.searchParams.set('m', markerId);
      } else {
        url.searchParams.delete('m');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.error('Falha ao atualizar URL com replaceState:', e);
    }
  }, []);

  const handleSelectMarker = useCallback(
    (marker: MarkerLocation) => {
      setSelectedMarker(marker);
      updateUrlMarker(marker.id);
    },
    [updateUrlMarker]
  );

  const handleCloseMarkerDetails = useCallback(() => {
    setSelectedMarker(null);
    updateUrlMarker(null);
  }, [updateUrlMarker]);

  const handleToggleCategory = (catId: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(CATEGORIES.map((c) => c.id));
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const filteredMarkers = useMemo(() => {
    return MarkerService.filterMarkers(
      DEMO_MARKERS,
      {
        searchQuery,
        selectedCategories,
        filterStatus,
        selectedRegion,
      },
      progress,
      lang
    );
  }, [searchQuery, selectedCategories, filterStatus, selectedRegion, progress, lang]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] flex overflow-hidden bg-[#12131a]">
      {/* Sidebar Esquerda: HUD de Filtros em 2 Colunas */}
      <CategoryFilterSidebar
        lang={lang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onSelectAllCategories={handleSelectAllCategories}
        onClearCategories={handleClearCategories}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        allMarkers={DEMO_MARKERS}
        progress={progress}
        onResetProgress={resetAll}
        isOpenMobile={isMobileFiltersOpen}
        onCloseMobile={() => setIsMobileFiltersOpen(false)}
      />

      {/* Área Central: Mapa com Teardrop Pins e Controles */}
      <main className="relative flex-1 min-w-0 h-full overflow-hidden">
        <CustomLeafletMap
          markers={filteredMarkers}
          selectedMarker={selectedMarker}
          onSelectMarker={handleSelectMarker}
          lang={lang}
          progress={progress}
          onToggleFound={toggleFound}
          onToggleFavorite={toggleFavorite}
          onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        />
      </main>

      {/* Sidebar Direita: Progress Tracker & Detalhes do Marcador */}
      <RightProgressTrackerSidebar
        lang={lang}
        progress={progress}
        allMarkers={DEMO_MARKERS}
        selectedMarker={selectedMarker}
        onCloseMarkerDetails={handleCloseMarkerDetails}
        onToggleFound={toggleFound}
        onToggleFavorite={toggleFavorite}
        onSaveNote={saveNote}
      />
    </div>
  );
};
