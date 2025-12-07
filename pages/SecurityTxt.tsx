
import React from 'react';

const SecurityTxt: React.FC = () => {
  const content = `Contact: mailto:security@hodl-jewelry.ru
Expires: 2026-01-01T00:00:00.000Z
Preferred-Languages: ru, en
Canonical: https://hodl-jewelry.ru/.well-known/security.txt`;

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

export default SecurityTxt;
