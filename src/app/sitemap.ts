import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://docprompt.ai';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/ai-rewrite', '/file-convert', '/remove-watermark',
    '/add-watermark', '/ocr', '/pricing', '/login', '/shares',
    '/announcements', '/feedback'
  ];
  const legalPages = [
    '/legal/terms-of-service', '/legal/privacy-policy',
    '/legal/cookie-policy', '/legal/dmca'
  ];

  const now = new Date();
  const allPages = [...pages, ...legalPages];

  return allPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : path.startsWith('/legal') ? 0.3 : 0.8,
  }));
}
