
import React from 'react';
import { useStore } from '../context/StoreContext';

// This component renders a raw XML sitemap for SEO bots.
// Since we are in a pure SPA environment, we render the text directly.
// Note: Normally, sitemap.xml is a static file served by the backend/CDN.
// This is a fallback dynamic implementation.

const SitemapXml: React.FC = () => {
  const { products, articles } = useStore();
  
  const baseUrl = "https://hodl-jewelry.ru";
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/mag</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Products -->
  ${products.map(p => `
  <url>
    <loc>${baseUrl}/product/${p.slug || p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Articles -->
  ${articles.map(a => `
  <url>
    <loc>${baseUrl}/mag/${a.slug || a.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  return (
    <div style={{ backgroundColor: 'white', color: 'black', padding: '20px', minHeight: '100vh', margin: 0 }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' }}>
            {xml}
        </pre>
    </div>
  );
};

export default SitemapXml;
