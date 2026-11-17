import { MetadataRoute } from 'next';
import {
  getIndexableCategories,
  getIndexableMarkers,
  categoryIdToSlug,
} from '@/data/seoSelectors';
import { siteConfig } from '@/config/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexingEnabled) {
    return [];
  }

  const baseUrl = 'https://gtavimap.com';
  const languages = ['en', 'pt-br', 'es'];
  const buildDate = new Date();

  // Rotas estáticas base
  const staticRoutes = [
    { path: '', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/map', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/categories', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/characters', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/news', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/premium', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Rotas base nos 3 idiomas com hreflang
  for (const lang of languages) {
    for (const route of staticRoutes) {
      const url = `${baseUrl}/${lang}${route.path}`;
      sitemapEntries.push({
        url,
        lastModified: buildDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route.path}`,
            'pt-br': `${baseUrl}/pt-br${route.path}`,
            es: `${baseUrl}/es${route.path}`,
            'x-default': `${baseUrl}/en${route.path}`,
          },
        },
      });
    }
  }

  // Rotas de categoria indexáveis (apenas com pontos verificados)
  const indexableCategories = getIndexableCategories();
  const indexableMarkers = getIndexableMarkers();

  for (const cat of indexableCategories) {
    const catSlug = categoryIdToSlug(cat.id);
    const catMarkers = indexableMarkers.filter((m) => m.category === cat.id);

    let catLastMod = buildDate;
    const markerDates = catMarkers
      .map((m) => (m.updatedAt ? new Date(m.updatedAt).getTime() : 0))
      .filter((t) => t > 0);
    if (markerDates.length > 0) {
      catLastMod = new Date(Math.max(...markerDates));
    }

    for (const lang of languages) {
      const url = `${baseUrl}/${lang}/map/${catSlug}`;
      sitemapEntries.push({
        url,
        lastModified: catLastMod,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/map/${catSlug}`,
            'pt-br': `${baseUrl}/pt-br/map/${catSlug}`,
            es: `${baseUrl}/es/map/${catSlug}`,
            'x-default': `${baseUrl}/en/map/${catSlug}`,
          },
        },
      });
    }
  }

  // Rotas de pontos individuais indexáveis (apenas pontos verificados)
  for (const marker of indexableMarkers) {
    const catSlug = categoryIdToSlug(marker.category);
    const markerLastMod = marker.updatedAt ? new Date(marker.updatedAt) : buildDate;

    for (const lang of languages) {
      const url = `${baseUrl}/${lang}/map/${catSlug}/${marker.slug}`;
      sitemapEntries.push({
        url,
        lastModified: markerLastMod,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/map/${catSlug}/${marker.slug}`,
            'pt-br': `${baseUrl}/pt-br/map/${catSlug}/${marker.slug}`,
            es: `${baseUrl}/es/map/${catSlug}/${marker.slug}`,
            'x-default': `${baseUrl}/en/map/${catSlug}/${marker.slug}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
