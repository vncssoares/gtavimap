/**
 * Configurações da Projeção e Camadas do Mapa
 * Permite alternar facilmente entre o mapa vetorial estilizado de demonstração
 * e futuras bases cartográficas oficiais baseadas em Tiles (XYZ / TMS).
 */

export interface MapLayerConfig {
  type: 'image' | 'tile';
  url: string;
  attribution: string;
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  bounds: [[number, number], [number, number]];
  isDemoNotice: boolean;
}

export const MAP_CONFIG: MapLayerConfig = {
  // Atualmente usando a imagem vetorial cartográfica estilizada do estado de Leonida / Vice City
  type: 'image',
  url: '/map/leonida-vibrant-map.v1.svg',
  attribution: 'GTAVIMap • Mapa Cartográfico Fictício para Demonstração (Não Oficial)',
  width: 2000,
  height: 2000,
  minZoom: -1,
  maxZoom: 3,
  defaultZoom: 0,
  bounds: [
    [0, 0],
    [1000, 1000],
  ],
  isDemoNotice: true,
};

// Exemplo de como plugar os tiles quando o jogo for lançado e o mapa for extraído:
// export const PRODUCTION_TILE_CONFIG: MapLayerConfig = {
//   type: 'tile',
//   url: 'https://tiles.gtavimap.com/{z}/{x}/{y}.webp',
//   ...
// };
