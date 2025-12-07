
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Clock, Calendar, ArrowLeft, User, Share2, ShoppingBag, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const ArticleDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { articles, products } = useStore();
    const article = articles.find(a => a.slug === slug || a.id === slug);

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-display font-bold mb-4">Статья не найдена</h2>
                <Link to="/mag" className="text-cyan-400 hover:text-white border-b border-cyan-400 pb-1">
                  Вернуться в журнал
                </Link>
            </div>
        );
    }

    // Resolve related items
    const linkedProducts = article.relatedProductIds 
        ? products.filter(p => article.relatedProductIds?.includes(p.id)) 
        : [];
    
    const linkedArticles = article.relatedArticleIds
        ? articles.filter(a => article.relatedArticleIds?.includes(a.id))
        : [];

    // JSON-LD Schema for BlogPosting
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "image": article.imageUrl,
        "editor": article.author,
        "genre": article.category,
        "keywords": article.tags ? article.tags.join(" ") : "",
        "url": `https://hodl-jewelry.ru/mag/${article.slug || article.id}`,
        "datePublished": article.date, // Note: Expects ISO format for best results, assuming simple string here
        "dateCreated": article.date,
        "dateModified": article.date,
        "description": article.excerpt,
        "articleBody": article.content.replace(/<[^>]+>/g, '').substring(0, 150) + "...", // Strip HTML for body preview
        "author": {
            "@type": "Person",
            "name": article.author || "HODL Jewelry"
        },
        "publisher": {
            "@type": "Organization",
            "name": "HODL Jewelry",
            "logo": {
              "@type": "ImageObject",
              "url": "https://hodl-jewelry.ru/logo.png" // Replace with actual logo URL
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            <SEO 
                title={article.seo?.title || `${article.title} | HODL MAG`}
                description={article.seo?.description || article.excerpt}
                image={article.imageUrl}
                schema={articleSchema}
                type="article"
            />

            {/* Hero Image */}
            <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10"></div>
                <img 
                    src={article.imageUrl} 
                    alt={article.imageAlt || article.title} 
                    className="w-full h-full object-cover"
                />
                
                <div className="absolute top-8 left-4 md:left-8 z-20">
                    <Link to="/mag" className="flex items-center gap-2 text-white/80 hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs font-bold bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={16} /> Назад в Журнал
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20 -mt-24">
                <div className="bg-dark-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
                    
                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs font-mono text-gray-400 mb-6 uppercase tracking-widest">
                        <span className="text-cyan-400 font-bold border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 rounded-full">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} /> {article.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} /> {article.readTime}
                        </div>
                         {article.author && (
                            <div className="flex items-center gap-2 text-white">
                                <User size={14} /> {article.author}
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-8 leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl text-gray-300 font-light leading-relaxed mb-10 border-l-4 border-cyan-400 pl-6 italic">
                        {article.excerpt}
                    </p>

                    {/* HTML Content */}
                    <div 
                        className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wide
                        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
                        prose-img:rounded-xl prose-img:border prose-img:border-white/10
                        prose-blockquote:border-purple-500 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        "
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    
                    {/* Tags Footer */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Теги</h4>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CROSS-LINKING SECTIONS --- */}
            
            {/* 1. Related Products (Buy in Topic) */}
            {linkedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <div className="flex items-center gap-4 mb-8">
                        <ShoppingBag className="text-cyan-400" size={24} />
                        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                            Выбор редакции
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {linkedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Related Articles (Read Next) */}
            {linkedArticles.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-white/10 pt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <BookOpen className="text-purple-400" size={24} />
                        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                            Читать также
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {linkedArticles.map(relArticle => (
                            <Link to={`/mag/${relArticle.slug || relArticle.id}`} key={relArticle.id} className="group flex gap-4 bg-dark-800 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all">
                                <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-black/20">
                                    <img 
                                        src={relArticle.imageUrl} 
                                        alt={relArticle.imageAlt || relArticle.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1 block">
                                        {relArticle.category}
                                    </span>
                                    <h4 className="text-lg font-bold text-white leading-tight group-hover:text-purple-300 transition-colors mb-2">
                                        {relArticle.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {relArticle.readTime}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ArticleDetails;
