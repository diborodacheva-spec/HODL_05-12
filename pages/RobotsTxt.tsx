
import React from 'react';

const RobotsTxt: React.FC = () => {
  const content = `User-agent: *
Allow: /

# Sitemap location
Sitemap: https://hodl-jewelry.ru/sitemap.xml
Host: https://hodl-jewelry.ru`;

  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace', 
      padding: '20px', 
      backgroundColor: '#fff', 
      color: '#000',
      margin: 0,
      minHeight: '100vh'
    }}>
      {content}
    </pre>
  );
};

export default RobotsTxt;
