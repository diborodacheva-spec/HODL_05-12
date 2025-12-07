import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import SEO from '../components/SEO';
import { Map, FileText, ShoppingBag, Home, LayoutTemplate } from 'lucide-react';

const Sitemap: React.FC = () => {
  const { products, articles } = useStore();

  const sections = [
    {
      title: 'Основные страницы',
      icon: <Home size={18} className="text-cyan-400" />,
      links: [
        { label: 'Главная', url: '/' },
        { label: 'Каталог Коллекций', url: '/shop' },
        { label: 'Журнал HODL MAG', url: '/mag' },
      ]
    },
    {
      title: 'Коллекции',
      icon: <ShoppingBag size={18} className="text-purple-400" />,
      links: products.map(p => ({
        label: p.name,
        url: `/product/${p.slug || p.id}`,
        meta: p.category
      }))
    },
    {
      title: 'Статьи',
      icon: <FileText size={18} className="text-orange-400" />,
      links: articles.map(a => ({
        label: a.title,
        url: `/mag/${a.slug || a.id}`,
        meta: a.date
      }))
    }
  ];

  return (
    <div className="min-h-screen py-20 bg-dark-900 text-white">
      <SEO 
        title="Карта сайта | HODL Jewelry" 
        description="Полный список страниц, товаров и статей HODL Jewelry." 
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
            <div className="p-3 bg-dark-800 rounded-xl border border-white/10">
                <Map className="text-cyan-400" size={32} />
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-wider mb-2">
                    Карта сайта
                </h1>
                <p className="text-gray-400 text-sm">
                    Навигация по всем разделам HODL Jewelry
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
                <div key={idx} className="bg-dark-800 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-dark-900 rounded-lg border border-white/5">
                            {section.icon}
                        </div>
                        <h2 className="font-bold text-lg uppercase tracking-wide">
                            {section.title}
                        </h2>
                    </div>
                    
                    <ul className="space-y-3">
                        {section.links.map((link, lIdx) => (
                            <li key={lIdx}>
                                <Link 
                                    to={link.url} 
                                    className="flex items-start justify-between group"
                                >
                                    <span className="text-gray-300 group-hover:text-cyan-400 transition-colors border-b border-transparent group-hover:border-cyan-400/30 pb-0.5 text-sm">
                                        {link.label}
                                    </span>
                                    {link.meta && (
                                        <span className="text-[10px] text-gray-600 font-mono group-hover:text-gray-500 transition-colors uppercase ml-4 text-right">
                                            {link.meta}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;