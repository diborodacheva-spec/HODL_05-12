

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Hash, ArrowUpRight, Terminal, Cpu, Quote, Feather, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const TypewriterTitle = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'HODL MAG';

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150); // Typing speed

    return () => clearInterval(interval);
  }, []);

  const hodlPart = displayText.length > 4 ? 'HODL ' : displayText;
  const magPart = displayText.length > 5 ? displayText.slice(5) : '';

  return (
    <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight uppercase min-h-[1.1em]">
      {hodlPart}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        {magPart}
      </span>
      <span className="inline-block w-4 h-[0.8em] bg-cyan-400 ml-2 align-middle animate-blink"></span>
    </h1>
  );
};

const Mag: React.FC = () => {
  const { articles, magSubtitle, magDescription, curatorProfile, magPromo } = useStore();

  // Sort articles by date (assuming ISO string or comparable format, or fallback to index)
  // For simplicity, we just reverse to show newest first if no date parsing
  const sortedArticles = [...articles].reverse();

  // Find Featured article
  const featuredArticle = sortedArticles.find(a => a.isFeatured) || sortedArticles[0];
  
  // List of other articles (exclude featured one)
  const regularArticles = sortedArticles.filter(a => a.id !== featuredArticle?.id);

  // Extract all unique tags
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || []))).slice(0, 10);

  return (
    <div className="min-h-screen py-20">
      <SEO page="mag" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative mb-16 border-b border-white/10 pb-10">
            <div className="absolute -top-10 -left-10 text-9xl font-black text-white/5 select-none pointer-events-none overflow-hidden">
                MAG
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <Terminal className="text-cyan-400" size={24} />
                    <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">System.Log_</span>
                </div>
                
                <TypewriterTitle />

                <div className="max-w-2xl">
                    <h3 className="text-xl text-white font-bold mb-2 leading-tight">
                        {magSubtitle}
                    </h3>
                    <p className="text-lg text-gray-400 font-light leading-relaxed">
                        {magDescription}
                    </p>
                </div>
            </div>
        </div>

        {/* Featured Article - Full Width */}
        {featuredArticle && (
            <div className="mb-20">
                <Link to={`/mag/${featuredArticle.slug || featuredArticle.id}`} className="block group relative grid grid-cols-1 md:grid-cols-2 gap-0 bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden rounded-xl">
                    <div className="aspect-video md:aspect-auto relative overflow-hidden">
                        <img 
                            src={featuredArticle.imageUrl} 
                            alt={featuredArticle.imageAlt || featuredArticle.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent md:hidden"></div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Cpu size={100} />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-400/20 rounded-full flex items-center gap-2">
                                <Star size={10} className="fill-current"/> Editor's Choice
                            </span>
                            <span className="text-gray-500 font-mono text-xs flex items-center gap-2">
                                <Calendar size={12} /> {featuredArticle.date}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight group-hover:text-cyan-400 transition-colors">
                            {featuredArticle.title}
                        </h2>
                        <p className="text-gray-400 mb-8 font-light leading-relaxed line-clamp-3">
                            {featuredArticle.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-4">
                            <span className="text-white font-bold uppercase tracking-widest text-sm border-b border-white pb-1 group-hover:text-cyan-400 group-hover:border-cyan-400 transition-colors">
                                Читать статью
                            </span>
                            <span className="text-gray-600 text-xs font-mono flex items-center gap-1">
                                <Clock size={12} /> {featuredArticle.readTime}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        )}
        
        {/* Content Layout: Articles (Left) + Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Column: Articles */}
            <div className="lg:col-span-8">
                {regularArticles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-12">
                        {regularArticles.map((article) => (
                            <Link to={`/mag/${article.slug || article.id}`} key={article.id} className="group flex flex-col md:flex-row gap-6 bg-transparent hover:bg-white/5 p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-white/5">
                                <div className="w-full md:w-1/3 aspect-[3/2] overflow-hidden rounded-lg relative shrink-0">
                                    <img 
                                        src={article.imageUrl} 
                                        alt={article.imageAlt || article.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-full">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {article.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-gray-500 font-mono flex items-center">
                                                <Hash size={10} className="mr-0.5" />{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-white mb-3 leading-tight group-hover:text-cyan-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-4 font-light leading-relaxed line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                                        <span className="text-gray-600 text-xs font-mono">
                                            {article.date} · {article.readTime}
                                        </span>
                                        <span className="text-cyan-400/80 group-hover:text-cyan-400 transition-colors flex items-center gap-1 text-xs uppercase tracking-widest font-bold">
                                            Читать <ArrowUpRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : !featuredArticle ? (
                     <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
                        <p className="text-gray-500">Скоро открытие журнала...</p>
                    </div>
                ) : null}
            </div>

            {/* Right Column: Curator & Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* Curator Card: Dynamic from Store */}
                <div className="relative bg-dark-800 rounded-xl p-6 border border-white/10 overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,224,255,0.3)]">
                                <img 
                                    src={curatorProfile.imageUrl} 
                                    alt={curatorProfile.name} 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-display font-bold text-lg leading-none">{curatorProfile.name}</h3>
                                <p className="text-xs text-cyan-400 uppercase tracking-wider font-bold mt-1">{curatorProfile.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-gray-400 font-light leading-relaxed mb-6">
                            <p>{curatorProfile.descriptionP1}</p>
                            {curatorProfile.descriptionP2 && <p>{curatorProfile.descriptionP2}</p>}
                        </div>

                        <div className="relative bg-black/20 p-4 rounded-lg border-l-2 border-cyan-400 italic text-gray-300 text-sm">
                            <Quote size={16} className="text-cyan-400 absolute top-2 right-2 opacity-50" />
                            {curatorProfile.quote}
                            <div className="mt-3 flex justify-end">
                                <span className="font-handwriting text-gray-500 text-lg opacity-80" style={{fontFamily: 'cursive'}}>{curatorProfile.signature}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tag Cloud / Topics */}
                {allTags.length > 0 && (
                    <div className="p-6 border border-white/5 rounded-xl bg-dark-800/30">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Hash size={14} className="text-purple-500"/> Темы
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                 {/* Mini Newsletter (Sidebar version) */}
                 <div className="p-6 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-white/10 rounded-xl text-center">
                    <Feather className="mx-auto text-white mb-3" size={24} />
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">
                        Инсайды HODL
                    </h4>
                    <p className="text-xs text-gray-400 mb-4">
                        Закрытые дропы и статьи от Виктора — раз в неделю.
                    </p>
                    <button className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors rounded">
                        Подписаться
                    </button>
                 </div>

            </div>
        </div>

        {/* NATIVE PROMO BLOCK (Moved to Bottom) */}
        {magPromo.isVisible && (
            <div className="mt-24 border-y border-white/10 py-16 relative">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                     
                     {/* Text Side */}
                     <div className="order-2 md:order-1">
                         <div className="flex items-center gap-2 mb-6">
                            <span className="w-12 h-[1px] bg-cyan-400"></span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Коллекция HODL</span>
                         </div>
                         
                         <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-none">
                             {magPromo.title}
                         </h3>
                         
                         <p className="text-lg text-gray-400 font-light mb-8 leading-relaxed max-w-md">
                             {magPromo.text}
                         </p>
                         
                         <a 
                            href={magPromo.linkUrl} 
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-widest text-sm group"
                         >
                             <span className="border-b border-cyan-400 pb-1 group-hover:text-cyan-400 group-hover:border-white transition-colors">
                                {magPromo.buttonText}
                             </span>
                             <ArrowRight size={18} className="text-cyan-400 group-hover:translate-x-2 transition-transform" />
                         </a>
                     </div>

                     {/* Image Side */}
                     <div className="order-1 md:order-2 relative aspect-[4/3] bg-dark-800 rounded-sm overflow-hidden group">
                         <img 
                            src={magPromo.imageUrl} 
                            alt={magPromo.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                         />
                         
                         {/* Native Ad Badge */}
                         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-300 border border-white/10">
                             Promo
                         </div>
                     </div>
                 </div>
            </div>
        )}

        {/* Bottom Full Width Newsletter Section */}
        <div className="mt-24 pt-16">
            <div className="bg-dark-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-5"></div>
                <div className="relative z-10 max-w-lg">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                        HODL COMMUNITY
                    </h3>
                    <p className="text-gray-400">
                        Присоединяйтесь к тем, кто выбирает осознанное потребление и технологичный стиль.
                    </p>
                </div>
                <form className="relative z-10 w-full md:w-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                     <input 
                        type="email" 
                        placeholder="email@hodl.ru" 
                        className="bg-dark-900 border border-gray-700 text-white px-6 py-3 rounded-full text-sm outline-none focus:border-cyan-400 w-full md:w-64"
                     />
                     <button className="bg-cyan-400 text-black font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-white transition-colors text-xs">
                         Join
                     </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Mag;