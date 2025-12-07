
import React from 'react';
import { Trash2, ExternalLink, Search, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
  onEditSEO?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdminView = false, onEditSEO, onEdit }) => {
  const { deleteProduct } = useStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Ensure we use the slug if available, otherwise fallback to id
  const productLink = `/product/${product.slug || product.id}`;
  
  // Use first image from array if available, else imageUrl
  const displayImage = product.images?.[0] || product.imageUrl;

  return (
    <article className="group relative bg-dark-800 rounded-xl border border-white/5 hover:border-cyan-400/50 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-lg hover:shadow-cyan-400/10">
      {/* Image Container */}
      <Link 
        to={productLink} 
        className="aspect-square overflow-hidden bg-dark-700 relative block"
        title={`Подробнее о ${product.name}`}
        aria-label={`Перейти к товару ${product.name}`}
      >
        <img
          src={displayImage}
          alt={product.imageAlt || `${product.category} ${product.name} из ${product.material}`}
          className="h-full w-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />
        
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none transition-opacity duration-500 mix-blend-overlay"></div>

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] uppercase tracking-widest text-white z-10">
            {product.material}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-2">
          {product.category}
        </div>
        <Link to={productLink} title={product.name}>
            <h3 className="text-lg font-display font-bold text-white mb-2 leading-tight hover:text-cyan-400 transition-colors">
            {product.name}
            </h3>
        </Link>
        <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow font-light">
          {product.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <span className="text-xl font-bold text-white font-display">
            {formatPrice(product.price)}
          </span>
          
          {isAdminView ? (
            <div className="flex gap-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(product)}
                        className="flex items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black p-2 rounded-full transition-colors"
                        title="Редактировать товар"
                    >
                        <PenTool size={18} />
                    </button>
                )}
                {onEditSEO && (
                    <button
                        onClick={() => onEditSEO(product)}
                        className="flex items-center justify-center bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-black p-2 rounded-full transition-colors"
                        title="Настройки SEO"
                    >
                        <Search size={18} />
                    </button>
                )}
                <button
                onClick={() => deleteProduct(product.id)}
                className="flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors"
                title="Удалить товар"
                >
                <Trash2 size={18} />
                </button>
            </div>
          ) : (
            <a
                href={product.marketUrl}
                target="_blank"
                rel="noopener noreferrer nofollow" // Added nofollow for external link best practice
                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,224,255,0.2)] hover:shadow-[0_0_20px_rgba(0,224,255,0.5)]"
                title="Купить на Яндекс Маркете"
            >
                На Маркет
                <ExternalLink size={14} className="ml-2" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
