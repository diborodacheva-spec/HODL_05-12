
import React from 'react';
import { useStore } from '../context/StoreContext';

const RssXml: React.FC = () => {
  const { articles } = useStore();
  const baseUrl = "https://hodl-jewelry.ru";
  const now = new Date().toUTCString();

  // Helper to convert DD.MM.YYYY to Date object
  const parseDate = (dateStr: string) => {
      try {
          const parts = dateStr.split('.');
          if(parts.length === 3) {
              return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).toUTCString();
          }
          return new Date().toUTCString();
      } catch (e) {
          return new Date().toUTCString();
      }
  };

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>HODL Jewelry Mag</title>
  <link>${baseUrl}</link>
  <description>Журнал о культуре, технологиях и стиле от HODL Jewelry.</description>
  <language>ru</language>
  <lastBuildDate>${now}</lastBuildDate>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${articles.map(a => `
  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${baseUrl}/mag/${a.slug || a.id}</link>
    <guid isPermaLink="true">${baseUrl}/mag/${a.slug || a.id}</guid>
    <description><![CDATA[${a.excerpt}]]></description>
    <pubDate>${parseDate(a.date)}</pubDate>
    <author><![CDATA[${a.author || 'HODL Jewelry'}]]></author>
    ${a.imageUrl ? `<enclosure url="${a.imageUrl}" type="image/jpeg" />` : ''}
    <category><![CDATA[${a.category}]]></category>
    <content:encoded><![CDATA[${a.content}]]></content:encoded>
  </item>`).join('')}
</channel>
</rss>`;

  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      wordBreak: 'break-all', 
      fontFamily: 'monospace', 
      fontSize: '12px',
      backgroundColor: '#fff', 
      color: '#000',
      padding: '20px',
      margin: 0,
      minHeight: '100vh'
    }}>
      {xml}
    </pre>
  );
};

export default RssXml;
