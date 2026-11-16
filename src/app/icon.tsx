import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '7px',
        }}
      >
        <span
          style={{
            color: '#08090e',
            fontSize: 18,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-1px',
            lineHeight: 1,
            marginTop: '-1px',
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
