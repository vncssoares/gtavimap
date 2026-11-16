import { ImageResponse } from 'next/og';
import { Language } from '@/types';
import { getDictionary } from '@/i18n/translations';

export const alt = 'GTAVIMap — Interactive Map for GTA VI';
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
            'radial-gradient(circle at 15% 20%, rgba(255, 42, 133, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(0, 229, 255, 0.22) 0%, transparent 45%)',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          border: '12px solid #141722',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: '#00e5ff',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '2px',
                color: '#00e5ff',
                textTransform: 'uppercase',
              }}
            >
              LEONIDA CARTOGRAPHY
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '14px',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            FAN-MADE UTILITY • 2026
          </div>
        </div>

        {/* Center Main Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #ff2a85 0%, #a855f7 50%, #00e5ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(255, 42, 133, 0.35)',
              }}
            >
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '-1px',
                }}
              >
                VI
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '78px', fontWeight: 900, letterSpacing: '-2px', color: '#ffffff' }}>
                GTAVI
              </span>
              <span style={{ fontSize: '78px', fontWeight: 900, letterSpacing: '-2px', color: '#ff2a85' }}>
                Map
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: '28px',
              fontWeight: 500,
              lineHeight: 1.35,
              color: '#cbd5e1',
              maxWidth: '920px',
              margin: 0,
            }}
          >
            {dict.common.tagline}
          </p>
        </div>

        {/* Footer Tagline & Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            {['VICE CITY', 'LEONIDA STATE', 'PROGRESS TRACKER'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#94a3b8',
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              fontWeight: 800,
              color: '#00e5ff',
              letterSpacing: '1px',
            }}
          >
            gtavimap.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
