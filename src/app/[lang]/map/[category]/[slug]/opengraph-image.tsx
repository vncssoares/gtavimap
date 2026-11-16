import { ImageResponse } from 'next/og';
import { Language } from '@/types';
import { CATEGORIES } from '@/data/categories';
import {
  categoryIdToSlug,
  slugToCategoryId,
  getIndexableMarkers,
  getVerifiedMarkerBySlug,
} from '@/data/seoSelectors';

export const alt = 'Verified Location — GTAVIMap';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  const markers = getIndexableMarkers();
  const languages: Language[] = ['en', 'pt-BR', 'es'];
  const params: { lang: string; category: string; slug: string }[] = [];

  for (const lang of languages) {
    const langSlug = lang.toLowerCase();
    for (const marker of markers) {
      params.push({
        lang: langSlug,
        category: categoryIdToSlug(marker.category),
        slug: marker.slug,
      });
    }
  }

  if (params.length === 0) {
    return [{ lang: 'en', category: '_empty', slug: '_empty' }];
  }

  return params;
}

interface ImageProps {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
}

export default async function Image({ params }: ImageProps) {
  const { lang, category: categorySlug, slug: markerSlug } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const categoryId = slugToCategoryId(categorySlug);
  const category = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : null;
  const marker = categoryId ? getVerifiedMarkerBySlug(categoryId, markerSlug) : null;

  const markerName = marker ? marker.name : 'Verified Location';
  const regionName = marker ? marker.region : 'Leonida State';
  const categoryName = category ? category.shortLabel : 'Location';
  const coords = marker ? `X: ${marker.x} | Y: ${marker.y}` : '';

  const badgeText =
    currentLang === 'pt-BR' || currentLang === 'es' ? 'MARCADOR VERIFICADO' : 'VERIFIED MARKER';

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
            'radial-gradient(circle at 15% 75%, rgba(255, 42, 133, 0.25) 0%, transparent 45%), radial-gradient(circle at 85% 25%, rgba(0, 229, 255, 0.25) 0%, transparent 45%)',
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
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              fontSize: '13px',
              fontWeight: 800,
              color: '#00e5ff',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {badgeText}
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: category ? category.badgeBg : 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '14px',
                fontWeight: 800,
                color: category ? category.color : '#00e5ff',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {categoryName}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '16px',
                fontWeight: 700,
                color: '#ff2a85',
                letterSpacing: '1px',
              }}
            >
              {`• ${regionName}`}
            </div>
          </div>

          <h1
            style={{
              fontSize: '60px',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-1.5px',
            }}
          >
            {markerName}
          </h1>

          {coords && (
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#00e5ff',
                letterSpacing: '1px',
              }}
            >
              {`COORDINATES: ${coords}`}
            </div>
          )}
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
            {['VERIFIED PROOF', 'GPS COORDS', 'INTERACTIVE PIN'].map((pill) => (
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
            {`gtavimap.com/${normalizedLang}/map/${categorySlug}/${markerSlug}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
