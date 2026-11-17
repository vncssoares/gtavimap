import { MarkerLocation } from '@/types';
import { getMarkers } from './markerRepository';
import { DEMO_MARKERS as RAW_DEMO_MARKERS } from './markers.demo';

export { getMarkers } from './markerRepository';
export const DEMO_MARKERS: MarkerLocation[] = RAW_DEMO_MARKERS;
export const ALL_MARKERS: MarkerLocation[] = getMarkers();
