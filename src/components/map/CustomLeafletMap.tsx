'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MarkerLocation, Language, UserProgress } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { getDictionary } from '@/i18n/translations';
import {
  Plus,
  Minus,
  Crosshair,
  Hand,
  PenTool,
  SlidersHorizontal,
} from 'lucide-react';

interface CustomLeafletMapProps {
  markers: MarkerLocation[];
  selectedMarker: MarkerLocation | null;
  onSelectMarker: (marker: MarkerLocation) => void;
  lang: Language;
  progress: UserProgress;
  onToggleFound: (markerId: string) => void;
  onToggleFavorite: (markerId: string) => void;
  onOpenMobileFilters?: () => void;
}

export const CustomLeafletMap: React.FC<CustomLeafletMapProps> = ({
  markers,
  selectedMarker,
  onSelectMarker,
  lang,
  progress,
  onToggleFound,
  onToggleFavorite,
  onOpenMobileFilters,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const [mapTheme, setMapTheme] = useState<'default' | 'detailed'>('default');
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);

  // Inicializa mapa com CRS.Simple
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [1000, 1000],
    ];

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 3,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [
        [-200, -200],
        [1200, 1200],
      ],
      maxBoundsViscosity: 0.8,
    });

    const overlayUrl = '/map/leonida-vibrant-map.svg';
    const overlay = L.imageOverlay(overlayUrl, bounds, { interactive: false }).addTo(map);
    imageOverlayRef.current = overlay;

    map.fitBounds(bounds);
    map.setView([500, 500], 0);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const x = Math.round(e.latlng.lng);
      const y = Math.round(e.latlng.lat);
      if (x >= 0 && x <= 1000 && y >= 0 && y <= 1000) {
        setCursorCoords({ x, y });
      } else {
        setCursorCoords(null);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Observa mudanças de dimensão no container do mapa (redimensionamento de janela ou abertura/fecho de sidebars)
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
        }
      }, 60);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Alterna o estilo visual do mapa (Default vibrante estilo imagem do usuário vs Detailed escuro)
  useEffect(() => {
    if (!imageOverlayRef.current) return;
    const url =
      mapTheme === 'default'
        ? '/map/leonida-vibrant-map.svg'
        : '/map/leonida-demo-map.svg';

    imageOverlayRef.current.setUrl(url);
  }, [mapTheme]);

  // Cria o marcador em formato exato de GOTA (Teardrop Pin) com ícone circular branco central
  const createTeardropPinIcon = useCallback(
    (marker: MarkerLocation) => {
      const isFound = progress.foundMarkerIds.includes(marker.id);
      const isFav = progress.favoriteMarkerIds.includes(marker.id);
      const isSelected = selectedMarker?.id === marker.id;
      const category = CATEGORIES.find((c) => c.id === marker.category);
      const pinColor = category ? category.color : '#00e5ff';

      const opacity = isFound ? '0.4' : '1';
      const pulseGlow = isSelected
        ? `filter: drop-shadow(0 0 10px #ffffff); transform: scale(1.15);`
        : isFav
        ? `filter: drop-shadow(0 0 8px #fbbf24);`
        : `filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));`;

      // Ícone ou símbolo abreviado no círculo interno branco
      let innerIcon = '●';
      if (marker.category === 'stunt_jump') innerIcon = '★';
      else if (marker.category === 'hidden_package') innerIcon = '■';
      else if (marker.category === 'robbery') innerIcon = '$';
      else if (marker.category === 'race') innerIcon = '⚑';
      else if (marker.category === 'ammunition') innerIcon = '▲';
      else if (marker.category === 'safehouse') innerIcon = '⌂';
      else if (marker.category === 'pay_n_spray') innerIcon = '⚙';
      else if (marker.category === 'weapons') innerIcon = '✦';
      else if (marker.category === 'vehicles') innerIcon = '🚘';
      else if (marker.category === 'points_of_interest') innerIcon = '👁';

      // SVG do formato exato de Gota (Teardrop)
      const html = `
        <div class="gtavi-teardrop-pin" style="
          position: relative;
          width: 32px;
          height: 42px;
          opacity: ${opacity};
          ${pulseGlow}
          transition: transform 0.2s ease, opacity 0.2s ease;
          cursor: pointer;
        ">
          <svg viewBox="0 0 32 42" width="32" height="42" xmlns="http://www.w3.org/2000/svg">
            <path d="M 16 0 C 7.16 0 0 7.16 0 16 C 0 25.5 16 42 16 42 C 16 42 32 25.5 32 16 C 32 7.16 24.84 0 16 0 Z" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5" />
            <circle cx="16" cy="15" r="9" fill="#ffffff" />
            <text x="16" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="${pinColor}" text-anchor="middle">${innerIcon}</text>
          </svg>
          ${
            isFav
              ? `<div style="position:absolute; top:-3px; right:-2px; width:14px; height:14px; background:#fbbf24; border-radius:50%; border:1.5px solid #000; color:#000; font-size:9px; display:flex; align-items:center; justify-content:center; font-weight:bold;">★</div>`
              : ''
          }
          ${
            isFound
              ? `<div style="position:absolute; bottom:6px; right:-2px; width:14px; height:14px; background:#00e5ff; border-radius:50%; border:1.5px solid #000; color:#000; font-size:9px; display:flex; align-items:center; justify-content:center; font-weight:bold;">✓</div>`
              : ''
          }
        </div>
      `;

      return L.divIcon({
        html,
        className: 'custom-teardrop-icon',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -38],
      });
    },
    [progress, selectedMarker]
  );

  // Renderiza marcadores no mapa
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const dict = getDictionary(lang);
    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const latLng: L.LatLngExpression = [marker.y, marker.x];
      const icon = createTeardropPinIcon(marker);
      const isFound = progress.foundMarkerIds.includes(marker.id);
      const isFav = progress.favoriteMarkerIds.includes(marker.id);

      const leafletMarker = L.marker(latLng, { icon });
      const category = CATEGORIES.find((c) => c.id === marker.category);
      const catColor = category ? category.color : '#00e5ff';
      const catLabel = category ? ((dict.categories as Record<string, string>)[category.id] || category.shortLabel) : marker.category;
      const descText = marker.description[lang] || marker.description.en;

      const popupHtml = document.createElement('div');
      popupHtml.className = 'gtavimap-hud-popup';
      popupHtml.innerHTML = `
        <div style="font-family: inherit; color: #fff; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: ${catColor};">
              ${catLabel}
            </span>
            <span style="font-size: 9px; font-family: monospace; color: #94a3b8;">X:${marker.x} Y:${marker.y}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 900; margin: 0 0 5px 0; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
            ${marker.name}
          </h4>
          <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 8px 0; line-height: 1.35;">
            ${descText.length > 85 ? descText.slice(0, 85) + '...' : descText}
          </p>
          <div style="display: flex; gap: 5px; padding-top: 6px; border-top: 1px solid #2d3748;">
            <button id="popup-btn-found-${marker.id}" style="
              flex: 1;
              padding: 5px 8px;
              border-radius: 6px;
              background: ${isFound ? '#00e5ff' : '#1e293b'};
              color: ${isFound ? '#000' : '#fff'};
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              border: 1px solid ${isFound ? '#00e5ff' : '#334155'};
              cursor: pointer;
            ">
              ${isFound ? '✓ FOUND' : 'MARK FOUND'}
            </button>
            <button id="popup-btn-fav-${marker.id}" style="
              padding: 5px 10px;
              border-radius: 6px;
              background: ${isFav ? '#fbbf24' : '#1e293b'};
              color: ${isFav ? '#000' : '#fff'};
              font-size: 11px;
              font-weight: bold;
              border: 1px solid ${isFav ? '#fbbf24' : '#334155'};
              cursor: pointer;
            ">
              ★
            </button>
            <button id="popup-btn-detail-${marker.id}" style="
              padding: 5px 8px;
              border-radius: 6px;
              background: #ff2a85;
              color: #fff;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              border: none;
              cursor: pointer;
            ">
              INFO
            </button>
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'gtavimap-neon-popup',
      });

      leafletMarker.on('popupopen', () => {
        const btnFound = document.getElementById(`popup-btn-found-${marker.id}`);
        const btnFav = document.getElementById(`popup-btn-fav-${marker.id}`);
        const btnDetail = document.getElementById(`popup-btn-detail-${marker.id}`);

        if (btnFound) {
          btnFound.onclick = () => {
            onToggleFound(marker.id);
            leafletMarker.closePopup();
          };
        }
        if (btnFav) {
          btnFav.onclick = () => {
            onToggleFavorite(marker.id);
            leafletMarker.closePopup();
          };
        }
        if (btnDetail) {
          btnDetail.onclick = () => {
            onSelectMarker(marker);
            leafletMarker.closePopup();
          };
        }
      });

      leafletMarker.on('click', () => {
        onSelectMarker(marker);
      });

      markersLayerRef.current?.addLayer(leafletMarker);
    });
  }, [markers, lang, progress, onSelectMarker, onToggleFound, onToggleFavorite, createTeardropPinIcon]);

  // Centraliza o mapa se um marcador for selecionado externamente
  useEffect(() => {
    if (!selectedMarker || !mapInstanceRef.current) return;
    mapInstanceRef.current.setView([selectedMarker.y, selectedMarker.x], 1, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedMarker]);

  return (
    <div className="relative w-full h-full bg-[#3b9cb0] overflow-hidden select-none">
      {/* Contêiner Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Botão Mobile para Abrir HUD de Filtros */}
      <div className="absolute top-4 left-4 z-20 md:hidden flex items-center gap-2">
        <button
          onClick={onOpenMobileFilters}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#12131a]/95 backdrop-blur-md border border-[#ff2a85] text-white text-xs font-bold shadow-xl active:scale-95"
          aria-label="Abrir Filtros"
        >
          <SlidersHorizontal size={14} className="text-[#ff2a85]" />
          <span className="font-mono uppercase tracking-wider text-[11px]">FILTERS</span>
          <span className="px-1.5 py-0.5 rounded bg-[#ff2a85] text-white text-[10px] font-bold">
            {markers.length}
          </span>
        </button>
      </div>

      {/* ================= CONTROLES FLUTUANTES (CANTO INFERIOR DIREITO) ================= */}
      {/* Empilhados verticalmente exatamente como na imagem do usuário */}
      <div
        className="absolute right-4 z-20 flex flex-col gap-1.5 items-end"
        style={{
          bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="flex flex-col bg-[#12131a]/95 backdrop-blur-md rounded-lg border border-[#2d303e] shadow-2xl p-1 gap-1">
          <button
            onClick={() => {}}
            className="w-8 h-8 rounded bg-[#1a1c26] hover:bg-[#252836] text-slate-300 hover:text-[#00e5ff] flex items-center justify-center transition-colors shadow-sm"
            title="Pan / Navegação"
          >
            <Hand size={15} />
          </button>
          <button
            onClick={() => {
              alert('Modo de marcador customizado (Recurso Pro): Clique no mapa para criar um waypoint.');
            }}
            className="w-8 h-8 rounded bg-[#1a1c26] hover:bg-[#252836] text-slate-300 hover:text-[#ff2a85] flex items-center justify-center transition-colors shadow-sm"
            title="Adicionar Marcador Pessoal (Pro)"
          >
            <PenTool size={14} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded bg-[#1a1c26] hover:bg-[#252836] text-slate-200 hover:text-[#00e5ff] flex items-center justify-center transition-colors shadow-sm"
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded bg-[#1a1c26] hover:bg-[#252836] text-slate-200 hover:text-[#00e5ff] flex items-center justify-center transition-colors shadow-sm"
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.setView([500, 500], 0, { animate: true })}
            className="w-8 h-8 rounded bg-[#1a1c26] hover:bg-[#252836] text-slate-200 hover:text-[#00e5ff] flex items-center justify-center transition-colors shadow-sm"
            title="Centralizar Mapa"
          >
            <Crosshair size={15} />
          </button>
        </div>
      </div>

      {/* ================= SELETOR DE CAMADA COMPACTO (BASE INFERIOR DIREITA) ================= */}
      <div
        className="absolute right-4 z-20 flex items-center gap-1 bg-[#12131a]/95 backdrop-blur-md p-1 rounded-lg border border-[#2d303e] shadow-2xl"
        style={{
          bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <button
          onClick={() => setMapTheme('default')}
          className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
            mapTheme === 'default'
              ? 'bg-[#1e202d] text-[#00e5ff] border border-[#00e5ff]/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Default
        </button>
        <button
          onClick={() => setMapTheme('detailed')}
          className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
            mapTheme === 'detailed'
              ? 'bg-[#1e202d] text-[#ff2a85] border border-[#ff2a85]/50 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Detailed
        </button>
      </div>

      {/* Barra de Coordenadas na Base Inferior Esquerda */}
      <div
        className="absolute left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-[#12131a]/90 backdrop-blur-md border border-[#2d303e] text-[10px] font-mono text-slate-400"
        style={{
          bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
        <span>{cursorCoords ? `X: ${cursorCoords.x} | Y: ${cursorCoords.y}` : 'X: --- | Y: ---'}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-semibold">{markers.length} PINS</span>
      </div>
    </div>
  );
};
