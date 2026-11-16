import { ImageResponse } from 'next/og';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export const alt = 'Interactive Map — GTAVIMap';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt-br' }, { lang: 'es' }];
}

interface ImageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Image({ params }: ImageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const dict = getDictionary(currentLang);

  const mapTitles: Record<Language, string> = {
    'pt-BR': 'Mapa Interativo de Leonida',
    es: 'Mapa Interactivo de Leonida',
    en: 'Interactive Map of Leonida',
  };

  const mapSubtitles: Record<Language, string> = {
    'pt-BR': 'Explore pontos de interesse, colecionáveis, armas e rastreie seu progresso em tempo real.',
    es: 'Explora puntos de interés, coleccionables, armas y rastrea tu progreso en tiempo real.',
    en: 'Explore points of interest, collectibles, weapons, and track your completion in real-time.',
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#0a0b10',
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.25) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(255, 42, 133, 0.25) 0%, transparent 45%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          border: '12px solid #141722',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff' }}>GTAVI</span>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#ff2a85' }}>Map</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 42, 133, 0.1)',
              border: '1px solid rgba(255, 42, 133, 0.3)',
              fontSize: '13px',
              fontWeight: 800,
              color: '#ff2a85',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            LIVE CARTOGRAPHY
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#00e5ff',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {dict.nav.map}
          </span>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            {mapTitles[currentLang]}
          </h1>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 500,
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '900px',
              margin: 0,
            }}
          >
            {mapSubtitles[currentLang]}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['SMOOTH ZOOM', 'PROGRESS SYNC', 'DEEP LINKING'].map((pill) => (
              <div
                key={pill}
                style={{
                  display: 'flex',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#cbd5e1',
                }}
              >
                {pill}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', fontSize: '18px', fontWeight: 800, color: '#00e5ff' }}>
            {`gtavimap.com/${normalizedLang}/map`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
