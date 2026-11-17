'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, X, MapPin, Compass } from 'lucide-react';
import { CategoryId, Language, MarkerLocation, UserProgress } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getMarkers } from '@/data/markerRepository';
import { MarkerService } from '@/services/markerService';
import { getDictionary } from '@/i18n/translations';
import { DynamicIcon } from '@/components/common/DynamicIcon';

// Carrega o Leaflet dinamicamente sem SSR
const CustomLeafletMap = dynamic(
  () => import('@/components/map/CustomLeafletMap').then((mod) => mod.CustomLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#12131a] text-slate-400 gap-3">
        <div className="w-9 h-9 border-2 border-[#ff2a85] border-t-transparent rounded-full animate-spin"></div>
        <span className="font-mono text-xs uppercase tracking-wider text-[#00e5ff]">
          Loading Cartography...
        </span>
      </div>
    ),
  }
);

interface EmbedMapClientProps {
  lang: Language;
}

// Progresso estático vazio: o embed NUNCA lê nem grava localStorage
const STATIC_PROGRESS: UserProgress = {
  foundMarkerIds: [],
  favoriteMarkerIds: [],
  userNotes: {},
  updatedAt: '',
};

const NOOP = () => {};

export const EmbedMapClient: React.FC<EmbedMapClientProps> = ({ lang }) => {
  const searchParams = useSearchParams();
  const markerParam = searchParams?.get('m') || null;
  const categoryParam = searchParams?.get('c') || null;
  const dict = getDictionary(lang);

  // Validação silenciosa de categoria (?c=<categoryId>)
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

  // Validação silenciosa de marcador (?m=<markerId>)
  const [selectedMarker, setSelectedMarker] = useState<MarkerLocation | null>(() => {
    if (markerParam) {
      return getMarkers().find((m) => m.id === markerParam) || null;
    }
    return null;
  });

  // Filtra marcadores visíveis
  const visibleMarkers = useMemo(() => {
    return MarkerService.filterMarkers(
      getMarkers(),
      {
        searchQuery: '',
        selectedCategories,
        filterStatus: 'all',
        selectedRegion: 'all',
      },
      STATIC_PROGRESS,
      lang
    );
  }, [selectedCategories, lang]);

  const handleSelectMarker = useCallback((marker: MarkerLocation) => {
    setSelectedMarker(marker);
    setSelectedCategories((prev) =>
      prev.includes(marker.category) ? prev : [...prev, marker.category]
    );
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Constrói URL para abrir a versão completa com os mesmos parâmetros
  const fullMapUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedMarker) {
      params.set('m', selectedMarker.id);
    } else if (categoryParam && CATEGORIES.some((c) => c.id === categoryParam)) {
      params.set('c', categoryParam);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return `https://gtavimap.com/${lang.toLowerCase()}/map${query}`;
  }, [selectedMarker, categoryParam, lang]);

  const activeCategory = selectedMarker
    ? CATEGORIES.find((c) => c.id === selectedMarker.category)
    : null;

  return (
    <div className="relative w-full h-full h-[100dvh] overflow-hidden bg-[#070b12]">
      {/* Mapa Leaflet em tela cheia */}
      <CustomLeafletMap
        markers={visibleMarkers}
        lang={lang}
        progress={STATIC_PROGRESS}
        selectedMarker={selectedMarker}
        onSelectMarker={handleSelectMarker}
        onToggleFound={NOOP}
        onToggleFavorite={NOOP}
        onOpenMobileFilters={NOOP}
      />

      {/* Faixa discreta "Powered by GTAVIMap" (rel="noopener", SEM nofollow para contar backlink) */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto">
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12131a]/95 backdrop-blur-md border border-[#2d3042] text-xs text-slate-300 hover:text-white hover:border-[#00e5ff] shadow-xl hover:shadow-[#00e5ff]/20 transition-all group"
        >
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Powered by
          </span>
          <span className="font-black text-white tracking-tight">
            GTAVI<span className="text-[#ff2a85]">Map</span>
          </span>
          <ExternalLink
            size={12}
            className="text-[#00e5ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </a>
      </div>

      {/* Card Flutuante de Detalhes do Marcador no Embed (sem progresso, sem anotações) */}
      {selectedMarker && (
        <div className="absolute top-3 right-3 left-3 sm:left-auto sm:w-84 max-h-[calc(100%-48px)] z-[1000] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 rounded-2xl bg-[#12131a]/95 backdrop-blur-md border border-[#2d3042] shadow-2xl space-y-3">
            {/* Header com Categoria & Fechar */}
            <div className="flex items-center justify-between gap-2 border-b border-[#222433] pb-2">
              <div className="flex items-center gap-2">
                {activeCategory && (
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: activeCategory.badgeBg }}
                  >
                    <DynamicIcon
                      name={activeCategory.iconName}
                      size={13}
                      color={activeCategory.color}
                    />
                  </div>
                )}
                <span className="text-[10px] font-mono uppercase font-bold text-slate-300">
                  {(activeCategory ? (dict.categories as Record<string, string>)[activeCategory.id] : null) || activeCategory?.shortLabel || selectedMarker.category}
                </span>
              </div>

              <button
                onClick={handleCloseDetail}
                className="w-11 h-11 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#1a1c27] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38f8ff]"
                aria-label="Fechar detalhes"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nome & Região */}
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white leading-snug">
                {selectedMarker.name}
              </h3>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-[#ff2a85]">
                  <MapPin size={11} />
                  {selectedMarker.region}
                </span>
                <span className="text-[#00e5ff] font-bold">
                  X:{selectedMarker.x} | Y:{selectedMarker.y}
                </span>
              </div>
            </div>

            {/* Descrição */}
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {selectedMarker.description[lang] || selectedMarker.description.en}
            </p>

            {/* Recompensa */}
            {selectedMarker.reward && (
              <div className="text-[10px] font-mono text-amber-300/90 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                {selectedMarker.reward}
              </div>
            )}

            {/* Link para abrir no mapa completo em nova aba */}
            <div className="pt-2 border-t border-[#1c1e2b]">
              <a
                href={`https://gtavimap.com/${lang.toLowerCase()}/map?m=${selectedMarker.id}`}
                target="_blank"
                rel="noopener"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#00e5ff] text-black font-black text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all"
              >
                <Compass size={14} />
                <span>{dict.common.exploreMap}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
