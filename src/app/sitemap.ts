import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gtavimap.com';
  const languages = ['en', 'pt-br', 'es'];
  const routes = ['', '/map', '/categories', '/premium'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${lang}${route}`;
      let priority = 0.8;
      if (route === '/map') priority = 1.0;
      if (route === '') priority = 0.9;
      if (route === '/categories') priority = 0.8;
      if (route === '/premium') priority = 0.6;

      sitemapEntries.push({
        url,
        lastModified: '2026-11-15T00:00:00.000Z',
        changeFrequency: route === '/map' ? 'daily' : 'weekly',
        priority,
      });
    });
  });

  return sitemapEntries;
}
