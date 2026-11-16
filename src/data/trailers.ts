import { Language } from '@/types';

export interface OfficialTrailer {
  id: string;
  youtubeId: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  releaseDate: string;
  views: string;
}

export const OFFICIAL_TRAILERS: OfficialTrailer[] = [
  {
    id: 'trailer_1',
    youtubeId: 'QdBZY2fkU-0',
    title: {
      'pt-BR': 'Grand Theft Auto VI — Trailer Oficial 1',
      en: 'Grand Theft Auto VI — Official Trailer 1',
      es: 'Grand Theft Auto VI — Tráiler Oficial 1',
    },
    subtitle: {
      'pt-BR': 'Primeira revelação oficial de Leonida e Vice City pela Rockstar Games.',
      en: 'First official reveal of Leonida and Vice City by Rockstar Games.',
      es: 'Primera revelación oficial de Leonida y Vice City por Rockstar Games.',
    },
    releaseDate: '04/12/2023',
    views: '200M+ views',
  },
];
