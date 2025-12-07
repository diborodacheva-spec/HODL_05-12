
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <SEO 
        title="404 — Страница не найдена | HODL Jewelry"
        description="К сожалению, запрашиваемая страница не существует. Перейдите в каталог уникальных украшений."
      />
      
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-white/5 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
             <AlertTriangle size={64} className="text-cyan-400 animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 uppercase tracking-wider">
        Ошибка в матрице
      </h2>
      
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed font-light">
        Страница, которую вы ищете, была удалена, переименована или временно недоступна. 
        Но это отличный повод вернуться к выбору артефактов.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all gap-2 text-xs"
        >
            <Home size={14} /> На Главную
        </Link>
        <Link 
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-lg shadow-cyan-900/20 gap-2 text-xs"
        >
            <Search size={14} /> В Каталог
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
