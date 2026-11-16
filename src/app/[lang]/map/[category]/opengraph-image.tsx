import { ImageResponse } from 'next/og';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';
import { CATEGORIES } from '@/data/categories';
import {
  categoryIdToSlug,
  slugToCategoryId,
  getIndexableCategories,
  getVerifiedMarkersByCategory,
} from '@/data/seoSelectors';

export const alt = 'Category — GTAVIMap';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  const categories = getIndexableCategories();
  const languages: Language[] = ['en', 'pt-BR', 'es'];
  const params: { lang: string; category: string }[] = [];

  for (const lang of languages) {
    const langSlug = lang.toLowerCase();
    for (const cat of categories) {
      params.push({
        lang: langSlug,
        category: categoryIdToSlug(cat.id),
      });
    }
  }

  if (params.length === 0) {
    return [{ lang: 'en', category: '_empty' }];
  }

  return params;
}

interface ImageProps {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}

export default async function Image({ params }: ImageProps) {
  const { lang, category: categorySlug } = await params;
  const normalizedLang = lang.toLowerCase();
  const currentLang: Language =
    normalizedLang === 'pt-br' ? 'pt-BR' : normalizedLang === 'es' ? 'es' : 'en';

  const categoryId = slugToCategoryId(categorySlug);
  const category = categoryId ? CATEGORIES.find((c) => c.id === categoryId) : null;
  const verifiedCount = categoryId ? getVerifiedMarkersByCategory(categoryId).length : 0;

  const dict = getDictionary(currentLang);
  const categoryName = category
    ? (dict.categories as Record<string, string>)[category.id] || category.shortLabel
    : 'Category Database';
  const categoryDesc = category
    ? (dict.categories as Record<string, string>)[`${category.id}_desc`] || ''
    : '';

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
            'radial-gradient(circle at 20% 30%, rgba(255, 42, 133, 0.22) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.22) 0%, transparent 45%)',
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
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              fontSize: '13px',
              fontWeight: 800,
              color: '#00e5ff',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {`${verifiedCount} ${verifiedCount === 1 ? 'VERIFIED SPOT' : 'VERIFIED SPOTS'}`}
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '9999px',
                backgroundColor: category ? category.color : '#00e5ff',
              }}
            />
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: category ? category.color : '#00e5ff',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {category?.group || 'DIRECTORY'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '66px',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-1.5px',
              textTransform: 'uppercase',
            }}
          >
            {categoryName}
          </h1>

          {categoryDesc && (
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
              {categoryDesc}
            </p>
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
            {['VERIFIED LOCATIONS', 'CARTOGRAPHY', 'FAQ'].map((tag) => (
              <div
                key={tag}
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
                {tag}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', fontSize: '18px', fontWeight: 800, color: '#00e5ff' }}>
            {`gtavimap.com/${normalizedLang}/map/${categorySlug}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
