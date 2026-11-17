'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Maximize2, Compass } from 'lucide-react';
import { CategoryId, FilterStatus, Language, MarkerLocation } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getMarkers } from '@/data/markerRepository';
import { getRegionById } from '@/data/regions';
import { MarkerService } from '@/services/markerService';
import { useUserProgress } from '@/hooks/useUserProgress';
import { trackEvent } from '@/services/telemetry';
import { getDictionary } from '@/i18n/translations';
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

export interface InteractiveMapClientProps {
  lang: Language;
  variant?: 'full' | 'embed';
  initialMarkerId?: string;
  initialCategory?: CategoryId;
  initialRegion?: string;
  className?: string;
}

export const InteractiveMapClient: React.FC<InteractiveMapClientProps> = ({
  lang,
  variant = 'full',
  initialMarkerId,
  initialCategory,
  initialRegion,
  className = '',
}) => {
  const searchParams = useSearchParams();
  const dict = getDictionary(lang);

  const markerParam = searchParams?.get('m') || initialMarkerId || null;
  const categoryParam = searchParams?.get('c') || (initialCategory as string) || null;
  const regionParam = searchParams?.get('r') || initialRegion || null;

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
          const foundMarker = getMarkers().find((m) => m.id === markerParam);
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
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    if (regionParam && getRegionById(regionParam)) {
      return regionParam;
    }
    return 'all';
  });

  // Bounds para enquadramento da região (?r=<regionId>)
  const targetRegionBounds = useMemo(() => {
    if (regionParam) {
      const reg = getRegionById(regionParam);
      return reg ? reg.bounds : null;
    }
    return null;
  }, [regionParam]);

  // Inicializa marcador com suporte a deep link (?m=<markerId>)
  const [selectedMarker, setSelectedMarker] = useState<MarkerLocation | null>(() => {
    if (markerParam) {
      return getMarkers().find((m) => m.id === markerParam) || null;
    }
    return null;
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // No modo embed, o scrollWheelZoom e drag começam desativados até o usuário interagir
  const [isMapActive, setIsMapActive] = useState(variant === 'full');

  // Sincroniza se o parâmetro ?m= mudar externamente
  const [prevParamM, setPrevParamM] = useState(markerParam);
  if (markerParam !== prevParamM) {
    setPrevParamM(markerParam);
    const found = markerParam ? getMarkers().find((m) => m.id === markerParam) || null : null;
    setSelectedMarker(found);
    if (found) {
      setSelectedCategories((prev) =>
        prev.includes(found.category) ? prev : [...prev, found.category]
      );
    }
  }

  // Sincroniza se o parâmetro ?r= mudar externamente
  const [prevParamR, setPrevParamR] = useState(regionParam);
  if (regionParam !== prevParamR) {
    setPrevParamR(regionParam);
    if (regionParam && getRegionById(regionParam)) {
      setSelectedRegion(regionParam);
    }
  }

  // Atualiza a URL com history.replaceState sem recarregar e sem criar entradas no histórico
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
    } catch {
      // Silencioso
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

  const handleActivateMap = () => {
    if (!isMapActive) {
      setIsMapActive(true);
      trackEvent('map_activate', { variant });
    }
  };

  const filteredMarkers = useMemo(() => {
    return MarkerService.filterMarkers(
      getMarkers(),
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

  const isEmbed = variant === 'embed';
  const fullScreenHref = `/${lang.toLowerCase()}/map${
    selectedMarker ? `?m=${selectedMarker.id}` : regionParam ? `?r=${regionParam}` : ''
  }`;

  return (
    <div
      onClick={handleActivateMap}
      className={`relative w-full flex overflow-hidden bg-[#12131a] ${
        isEmbed ? 'h-full rounded-2xl border border-[#222538] shadow-2xl' : 'h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)]'
      } ${className}`}
    >
      {/* Botão sempre visível de Abrir em Tela Cheia (especialmente no modo embed) */}
      {isEmbed && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <Link
            href={fullScreenHref}
            onClick={() => trackEvent('open_fullscreen', { source: 'embed_preview' })}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] min-w-[44px] rounded-lg bg-[#12131a]/95 backdrop-blur-md border border-[#38f8ff] text-[#38f8ff] hover:bg-[#38f8ff] hover:text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
          >
            <Maximize2 size={13} />
            <span>{dict.common.exploreMap}</span>
          </Link>
        </div>
      )}

      {/* Overlay de ativação no modo embed (evita prender scroll da página antes do clique) */}
      {isEmbed && !isMapActive && (
        <div
          onClick={handleActivateMap}
          className="absolute inset-0 z-20 bg-black/30 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/20"
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#a855f7] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
          >
            <Compass size={16} />
            <span>Tocar para interagir</span>
          </button>
        </div>
      )}

      {/* Sidebar Esquerda: apenas renderizada na versão completa para máxima performance */}
      {!isEmbed && (
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
          allMarkers={getMarkers()}
          progress={progress}
          onResetProgress={resetAll}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />
      )}

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
          onOpenMobileFilters={!isEmbed ? () => setIsMobileFiltersOpen(true) : undefined}
          targetRegionBounds={targetRegionBounds}
          interactiveScroll={isMapActive}
        />
      </main>

      {/* Sidebar Direita: Progress Tracker & Detalhes do Marcador (apenas na versão full) */}
      {!isEmbed && (
        <RightProgressTrackerSidebar
          lang={lang}
          progress={progress}
          allMarkers={getMarkers()}
          selectedMarker={selectedMarker}
          onCloseMarkerDetails={handleCloseMarkerDetails}
          onToggleFound={toggleFound}
          onToggleFavorite={toggleFavorite}
          onSaveNote={saveNote}
        />
      )}
    </div>
  );
};
