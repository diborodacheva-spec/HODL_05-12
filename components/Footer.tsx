
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { brandLogo, footerLinks, footerContacts, products } = useStore();

  // Extract unique categories for SEO linking
  const categories = useMemo(() => {
      const unique = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
      return unique.slice(0, 6); // Limit to top 6 to prevent footer bloat
  }, [products]);

  const renderLink = (link: { id: string, label: string, url: string }) => {
      const isExternal = link.url.startsWith('http');
      if (isExternal) {
          return <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors" title={link.label}>{link.label}</a>;
      }
      return <Link to={link.url} className="hover:text-cyan-400 transition-colors" title={link.label}>{link.label}</Link>;
  };

  return (
    <footer className="bg-black/80 backdrop-blur-xl text-white py-16 border-t border-white/5 relative z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Column 1: Brand */}
            <div>
            {brandLogo ? (
                <Link to="/" title="HODL Jewelry Главная">
                    <img 
                        src={brandLogo} 
                        alt="HODL Jewelry" 
                        className="h-10 w-auto object-contain mb-6 opacity-80 hover:opacity-100 transition-opacity"
                    />
                </Link>
            ) : (
                <Link to="/" title="HODL Jewelry Главная" className="block font-display text-2xl font-black text-white mb-6 uppercase tracking-widest hover:text-cyan-400 transition-colors">
                    HODL Jewelry
                </Link>
            )}
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Мужские и женские кольца из титана и стали. Сделано в Москве для тех, кто выбирает себя.
            </p>
            </div>

            {/* Column 2: Info Links */}
            <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Инфо</h4>
            <ul className="space-y-4 text-sm text-gray-500">
                {footerLinks.map(link => (
                    <li key={link.id}>
                        {renderLink(link)}
                    </li>
                ))}
                <li>
                    <Link to="/sitemap" className="hover:text-cyan-400 transition-colors" title="Карта сайта">
                        Карта сайта
                    </Link>
                </li>
            </ul>
            </div>

            {/* Column 3: Collections (SEO Links) - New! */}
            <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Коллекции</h4>
            <ul className="space-y-4 text-sm text-gray-500">
                {categories.length > 0 ? categories.map(cat => (
                    <li key={cat}>
                        <Link 
                            to={`/shop?category=${cat}`} 
                            className="hover:text-cyan-400 transition-colors"
                            title={`Купить ${cat}`}
                        >
                            {cat}
                        </Link>
                    </li>
                )) : (
                    <li>
                        <Link to="/shop" className="hover:text-cyan-400 transition-colors">Каталог</Link>
                    </li>
                )}
            </ul>
            </div>

            {/* Column 4: Contacts */}
            <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Контакты</h4>
            <ul 
                className="space-y-4 text-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: footerContacts }}
            >
            </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center md:text-left text-xs text-gray-700 uppercase tracking-widest flex flex-col md:flex-row justify-between gap-4">
            <span>&copy; {new Date().getFullYear()} HODL Jewelry. All rights reserved.</span>
            <span className="opacity-50">Designed for Future.</span>
        </div>
    </footer>
  );
};

export default Footer;
