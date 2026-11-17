export const siteConfig = {
  isIndexingEnabled: process.env.SITE_INDEXING !== 'off',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  analyticsSrc: process.env.NEXT_PUBLIC_ANALYTICS_SRC || '',
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  siteUrl: 'https://gtavimap.com',
  freshnessDaysThreshold: 14,
  buildTimeIso: '2026-11-17T00:00:00.000Z',
  regionMinVerified: 3, // REGION_MIN_VERIFIED: mínimo de marcadores verificados para indexação (padrão 3)
  premiumPaymentsEnabled: false, // Habilita destaque e fluxos reais de pagamento premium
  isDemoMode: process.env.NEXT_PUBLIC_DATA_MODE !== 'verified', // Exibe tag compacta DEMO enquanto o site utilizar dados demonstrativos
};
