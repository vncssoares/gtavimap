import { MarkerLocation } from '@/types';
import { DEMO_MARKERS } from './markers.demo';
import VERIFIED_MARKERS_RAW from './verified/markers.json';

export type DataMode = 'demo' | 'verified' | 'both';

export function getDataMode(): DataMode {
  const envMode = (process.env.NEXT_PUBLIC_DATA_MODE || process.env.DATA_MODE || '').toLowerCase().trim();

  if (envMode === 'verified') return 'verified';
  if (envMode === 'demo') return 'demo';
  if (envMode === 'both') {
    // Modo 'both' só é permitido em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return 'verified';
    }
    return 'both';
  }

  // Padrão: 'verified' em produção, 'demo' em desenvolvimento
  return process.env.NODE_ENV === 'production' ? 'verified' : 'demo';
}

export function isDemoOrBoth(): boolean {
  const mode = getDataMode();
  return mode === 'demo' || mode === 'both';
}

function normalizeMarker(marker: MarkerLocation): MarkerLocation {
  // Categoria missions: spoiler padrão true se não especificado
  const isMission = marker.category === 'missions';
  const spoiler = marker.spoiler !== undefined ? marker.spoiler : (isMission ? true : false);

  return {
    ...marker,
    spoiler,
  };
}

export function getMarkers(): MarkerLocation[] {
  const mode = getDataMode();
  const verifiedList = (VERIFIED_MARKERS_RAW as MarkerLocation[]).map(normalizeMarker);
  const demoList = DEMO_MARKERS.map(normalizeMarker);

  if (mode === 'verified') {
    return verifiedList;
  }

  if (mode === 'demo') {
    return demoList;
  }

  // mode === 'both' (só dev): mescla verified e demo (itens verified têm prioridade em caso de ID duplicado)
  const markerMap = new Map<string, MarkerLocation>();
  for (const m of demoList) {
    markerMap.set(m.id, m);
  }
  for (const m of verifiedList) {
    markerMap.set(m.id, m);
  }

  return Array.from(markerMap.values());
}

export function getMarkerById(id: string): MarkerLocation | undefined {
  if (!id) return undefined;
  return getMarkers().find((m) => m.id === id);
}

export function getMarkerBySlug(category: string, slug: string): MarkerLocation | undefined {
  if (!category || !slug) return undefined;
  return getMarkers().find((m) => m.category === category && m.slug === slug);
}
