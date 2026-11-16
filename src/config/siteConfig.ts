export const siteConfig = {
  isIndexingEnabled: process.env.SITE_INDEXING !== 'off',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  analyticsSrc: process.env.NEXT_PUBLIC_ANALYTICS_SRC || '',
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  siteUrl: 'https://gtavimap.com',
};
