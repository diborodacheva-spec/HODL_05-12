
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize category from URL or default to 'All'
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Sync state if URL changes (e.g. back button)
  useEffect(() => {
      const catFromUrl = searchParams.get('category') || 'All';
      setSelectedCategory(catFromUrl);
  }, [searchParams]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleCategoryChange = (cat: string) => {
      setSelectedCategory(cat);
      if (cat === 'All') {
          setSearchParams({});
      } else {
          setSearchParams({ category: cat });
      }
  };

  return (
    <div className="min-h-screen py-20">
      <SEO 
        page="shop" 
        title={selectedCategory !== 'All' ? `Купить ${selectedCategory} из титана | HODL Jewelry` : undefined}
        description={selectedCategory !== 'All' ? `Каталог ${selectedCategory} HODL Jewelry. Ручная работа, титан и сталь. Гарантия качества.` : undefined}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-gray-500 mb-8 uppercase tracking-widest">
            <Link to="/" className="hover:text-cyan-400 transition-colors" title="На главную">Главная</Link>
            <ChevronRight size={12} className="mx-2 text-gray-700" />
            <button 
                onClick={() => handleCategoryChange('All')} 
                className={`transition-colors ${selectedCategory === 'All' ? 'text-white cursor-default' : 'hover:text-cyan-400'}`}
                disabled={selectedCategory === 'All'}
            >
                Коллекции
            </button>
            {selectedCategory !== 'All' && (
                <>
                    <ChevronRight size={12} className="mx-2 text-gray-700" />
                    <span className="text-white">{selectedCategory}</span>
                </>
            )}
        </nav>

        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight uppercase">
              {selectedCategory === 'All' ? 'Все Коллекции' : selectedCategory}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Титан, сталь и философия свободы. Выбирайте артефакты, которые останутся с вами надолго.
          </p>
        </div>
        
        {/* Filters - using semantic buttons that update URL */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-full backdrop-blur-sm border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white border-transparent shadow-[0_0_15px_rgba(0,224,255,0.4)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-cyan-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'Все' : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg bg-dark-900/30">
            <p className="text-gray-500 uppercase tracking-widest">В этой категории пока пусто.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
