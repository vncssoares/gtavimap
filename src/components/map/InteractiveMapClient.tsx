'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
  const {
    progress,
    toggleFound,
    toggleFavorite,
    saveNote,
    resetAll,
  } = useUserProgress();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    CATEGORIES.map((c) => c.id)
  );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedMarker, setSelectedMarker] = useState<MarkerLocation | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-[#12131a]">
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
      <main className="relative flex-1 h-full overflow-hidden">
        <CustomLeafletMap
          markers={filteredMarkers}
          selectedMarker={selectedMarker}
          onSelectMarker={(marker) => setSelectedMarker(marker)}
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
        onCloseMarkerDetails={() => setSelectedMarker(null)}
        onToggleFound={toggleFound}
        onToggleFavorite={toggleFavorite}
        onSaveNote={saveNote}
      />
    </div>
  );
};
