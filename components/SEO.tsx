
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  page?: string; // 'home' | 'shop' | 'mag' | 'global'
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  schema?: object; // JSON-LD Structured Data
  type?: 'website' | 'article' | 'product';
}

const SEO: React.FC<SEOProps> = ({ page, title, description, keywords, image, schema, type = 'website' }) => {
  const { seoSettings } = useStore();
  const location = useLocation();

  // 1. Try to find settings for the specific page
  const pageSettings = page ? seoSettings.find(s => s.page === page) : null;

  // 2. Determine final values (Prop > Page Setting > Default)
  const finalTitle = title || pageSettings?.title || "HODL Jewelry — Титан и Сталь";
  const finalDescription = description || pageSettings?.description || "Премиальные украшения из титана и стали. Сделано в Москве.";
  const finalKeywords = keywords || pageSettings?.keywords || "украшения, титан, сталь, кольца, москва";
  const finalImage = image || "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=1000";
  
  // Construct Canonical URL
  const baseUrl = 'https://hodl-jewelry.ru';
  const canonicalUrl = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />

      {/* JSON-LD Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
