// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
    'https://arcsignals.com'; // <- byt till din domän om du vill hårdkoda

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Sidor vi inte vill att sökmotorer ska indexera/crawla
        disallow: [
          '/api/',         // API-routes
          '/auth/',        // inloggning/callbacks
          '/dashboard',    // privata sidor
          '/callback/',    // ev. auth-callbacks
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
