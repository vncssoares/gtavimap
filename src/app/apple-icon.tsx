import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff2a85 0%, #a855f7 50%, #00e5ff 100%)',
          borderRadius: '40px',
        }}
      >
        <span
          style={{
            color: '#08090e',
            fontSize: 104,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          VI
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
