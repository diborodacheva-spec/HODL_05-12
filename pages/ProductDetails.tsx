
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Zap, Truck, Hexagon, ChevronLeft, ChevronRight, Home, FileText, ArrowRight, Flame, HelpCircle, ChevronDown, Check, ShoppingBag, CreditCard, Divide, Sparkles, Ruler, BookOpen, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, scarcitySettings, addToCart } = useStore();
  
  // Find product by slug OR by id (fallback)
  const product = products.find((p) => p.slug === slug || p.id === slug);

  // Gallery State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Determine images to show
  const galleryImages = (product?.images && product.images.length > 0) 
    ? product.images 
    : (product?.imageUrl ? [product.imageUrl] : []);

  // Scarcity Logic Helper
  const getProductScarcity = (id: string) => {
    if (!scarcitySettings.isEnabled) return null;

    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalRange = scarcitySettings.maxTotal - scarcitySettings.minTotal;
    const safeTotalRange = totalRange > 0 ? totalRange : 1;
    let total = scarcitySettings.minTotal + (seed % safeTotalRange);
    total = Math.ceil(total / 10) * 10;

    const pctRange = scarcitySettings.maxSoldPct - scarcitySettings.minSoldPct;
    const safePctRange = pctRange > 0 ? pctRange : 1;
    const percentage = scarcitySettings.minSoldPct + (seed % safePctRange);
    
    const sold = Math.floor((total * percentage) / 100);
    
    return { sold, total, percentage };
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-display font-bold mb-4">Товар не найден</h2>
        <Link to="/shop" className="text-cyan-400 hover:text-white border-b border-cyan-400 pb-1">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Logic for Related Products
  let relatedProducts = [];
  if (product.relatedIds && product.relatedIds.length > 0) {
      relatedProducts = products.filter(p => product.relatedIds?.includes(p.id));
  } else {
      relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
  }

  const scarcity = getProductScarcity(product.id);

  // Schemas
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": galleryImages,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "HODL Jewelry" },
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://hodl-jewelry.ru/product/${product.slug || product.id}`,
      "priceCurrency": "RUB",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://hodl-jewelry.ru/" },
        { "@type": "ListItem", "position": 2, "name": "Каталог", "item": "https://hodl-jewelry.ru/shop" },
        { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://hodl-jewelry.ru/product/${product.slug || product.id}` }
      ]
  };

  const faqSchema = product.faq && product.faq.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": product.faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
  } : null;

  const schemas: any[] = [productSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <div className="min-h-screen bg-dark-900 relative">
        <style>{`
        /* CUSTOM STYLES FOR PRODUCT SEO TEXT (HTML from Admin) */
        .product-copy {
            color: #d1d5db; /* text-gray-300 */
            font-weight: 300;
            line-height: 1.8;
            font-size: 1.125rem; /* text-lg */
        }
        
        .product-copy__section {
            margin-bottom: 3rem;
        }

        .product-copy h2 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            color: white;
            font-size: 1.875rem; /* 3xl */
            line-height: 1.2;
            margin-bottom: 1.5rem;
            letter-spacing: -0.02em;
        }

        .product-copy h3 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            color: #22d3ee; /* cyan-400 */
            font-size: 1.5rem; /* 2xl */
            margin-bottom: 1rem;
            margin-top: 2rem;
        }

        .product-copy p {
            margin-bottom: 1.5rem;
        }

        .product-copy strong {
            color: white;
            font-weight: 700;
        }

        .product-copy ul {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
        }

        .product-copy li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
            color: #e5e7eb; /* gray-200 */
        }

        .product-copy li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.6em;
            width: 6px;
            height: 6px;
            background-color: #22d3ee; /* cyan-400 */
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
        }

        .product-copy a {
            color: #22d3ee;
            text-decoration: none;
            border-bottom: 1px solid rgba(34, 211, 238, 0.3);
            transition: all 0.2s;
        }

        .product-copy a:hover {
            color: #67e8f9;
            border-bottom-color: #67e8f9;
        }

        .article-cta {
            margin-top: 3rem;
            margin-bottom: 3rem;
            text-align: center;
        }

        .cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 2rem;
            background: linear-gradient(to right, #22d3ee, #3b82f6, #9333ea);
            color: white !important;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-radius: 9999px;
            text-decoration: none !important;
            border: none;
            box-shadow: 0 0 20px rgba(0, 224, 255, 0.3);
            transition: all 0.3s;
        }

        .cta:hover {
            filter: brightness(1.1);
            box-shadow: 0 0 30px rgba(0, 224, 255, 0.5);
            transform: translateY(-2px);
        }

        /* FAQ Styles */
        .product-copy__section--faq {
            margin-top: 4rem;
        }

        .faq-details {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            overflow: hidden;
            transition: border-color 0.3s;
        }

        .faq-details:hover {
            border-color: rgba(34, 211, 238, 0.3);
        }

        .faq-details[open] {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(34, 211, 238, 0.3);
        }

        .faq-summary {
            padding: 1.5rem;
            font-weight: 700;
            color: white;
            cursor: pointer;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .faq-summary::after {
            content: '+';
            font-size: 1.5rem;
            color: #22d3ee;
            transition: transform 0.3s;
        }

        .faq-details[open] .faq-summary::after {
            transform: rotate(45deg);
        }

        .faq-body {
            padding: 0 1.5rem 1.5rem 1.5rem;
            color: #9ca3af;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 0;
        }
        
        .faq-body h3 {
            font-size: 1rem;
            color: white;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            text-transform: none;
        }
      `}</style>
       <SEO 
         title={product.seo?.title || `${product.name} | HODL Jewelry`}
         description={product.seo?.description || product.description}
         keywords={product.seo?.keywords}
         image={galleryImages[0]}
         schema={schemas}
         type="product"
       />
       
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-gray-500 mb-8 uppercase tracking-widest flex-wrap">
            <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Home size={12} className="mb-0.5" /> Главная
            </Link>
            <ChevronRight size={12} className="mx-2 text-gray-700" />
            <Link to="/shop" className="hover:text-cyan-400 transition-colors">Каталог</Link>
            {product.category && (
              <>
                <ChevronRight size={12} className="mx-2 text-gray-700" />
                <Link to={`/shop?category=${product.category}`} className="hover:text-cyan-400 transition-colors">
                    {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={12} className="mx-2 text-gray-700" />
            <span className="text-white font-bold truncate max-w-[200px] md:max-w-none">
                {product.name}
            </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12 items-start">
          
          {/* LEFT COLUMN: Gallery + Tech Specs */}
          <div className="space-y-12">
              {/* Gallery Block */}
              <div>
                  {/* Main Image */}
                  <div className="relative group aspect-square bg-dark-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                        src={galleryImages[selectedImageIndex]} 
                        alt={product.imageAlt || product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {galleryImages.length > 1 && (
                        <>
                            <button 
                                onClick={() => setSelectedImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-white/10 print:hidden"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={() => setSelectedImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-white/10 print:hidden"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Tech Corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyan-400 opacity-50"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyan-400 opacity-50"></div>
                  </div>

                  {/* Thumbnails (Beautiful Scroll) */}
                  {galleryImages.length > 1 && (
                      <div className="relative group/thumbs mt-6 print:hidden">
                          {/* Gradient Fade Masks */}
                          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none transition-opacity duration-300"></div>
                          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none transition-opacity duration-300"></div>

                          <div className="flex gap-3 overflow-x-auto pb-4 pt-4 px-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-white/5 hover:scrollbar-thumb-cyan-400/50 transition-all">
                              {galleryImages.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`
                                        relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ease-out snap-center
                                        ${selectedImageIndex === idx 
                                            ? 'border-cyan-400 scale-105 shadow-[0_0_20px_rgba(0,224,255,0.4)] z-10 opacity-100 ring-2 ring-cyan-400/20' 
                                            : 'border-white/5 opacity-50 hover:opacity-100 hover:scale-105 hover:border-white/30 grayscale hover:grayscale-0'
                                        }
                                    `}
                                  >
                                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {/* TECH SPECS (Full Width) */}
              <div className="print:hidden">
                 <h4 className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                     <Hexagon size={12} className="text-cyan-400"/> Характеристики
                 </h4>
                 
                 <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                         <span className="text-gray-500">Материал</span>
                         <span className="text-white font-medium text-right">{product.material}</span>
                     </div>
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                         <span className="text-gray-500">Тип</span>
                         <span className="text-white font-medium text-right">{product.category}</span>
                     </div>
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                         <span className="text-gray-500">Стиль</span>
                         <span className="text-white font-medium text-right">Минимализм · Urban · Tech</span>
                     </div>
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                         <span className="text-gray-500">Гипоаллергенность</span>
                         <span className="text-white font-medium text-right">Да · 100% биосовместимость</span>
                     </div>
                     <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                         <span className="text-gray-500">Водостойкость</span>
                         <span className="text-white font-medium text-right">Устойчив к пресной и соленой воде</span>
                     </div>
                     <div className="flex justify-between items-baseline">
                         <span className="text-gray-500">Гарантия</span>
                         <span className="text-white font-medium text-right text-cyan-400">Пожизненная</span>
                     </div>
                 </div>
              </div>
          </div>

          {/* RIGHT COLUMN: Info Section - Sticky on Desktop */}
          <div className="flex flex-col justify-center lg:sticky lg:top-24 h-fit">
             <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {product.category}
                </span>
                <span className="text-gray-500 text-xs font-mono uppercase">
                    ID: {product.id.substring(0, 6)}
                </span>
             </div>

             {/* SCARCITY COUNTER */}
             {scarcity && (
                <div className="mb-8 inline-flex flex-col gap-2 bg-gradient-to-r from-white/5 to-transparent border-l-2 border-orange-500 p-4 rounded-r-xl backdrop-blur-sm print:hidden">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold w-full gap-8">
                        <div className="flex items-center gap-1.5 text-orange-400">
                            <Flame size={12} className="animate-pulse fill-orange-400" />
                            {scarcitySettings.label}
                        </div>
                        <span className="text-gray-400">
                            <span className="text-white">{scarcity.sold.toLocaleString()}</span> / {scarcity.total.toLocaleString()}
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden relative w-full mt-1">
                         <div 
                            className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full"
                            style={{ width: `${scarcity.percentage}%` }}
                         ></div>
                         <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
             )}

             <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
                {product.name}
             </h1>

             <div className="flex items-baseline gap-4 mb-8">
                 <span className="text-3xl font-bold text-white font-display">
                     {formatPrice(product.price)}
                 </span>
                 {/* Installment/Split Hint */}
                 <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] text-gray-400 uppercase tracking-wide print:hidden">
                     <CreditCard size={10} />
                     <span>Сплит: {formatPrice(Math.round(product.price / 4))} x 4</span>
                 </div>
             </div>

             {/* SINGLE ACTION BUTTON: BUY ON MARKET */}
             <div className="mb-10 print:hidden">
                 <a 
                    href={product.marketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] flex items-center justify-center gap-3 group text-sm md:text-base animate-pulse-slow"
                 >
                     <ShoppingBag size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                     Купить на Яндекс Маркете
                     <ArrowUpRight size={20} />
                 </a>
             </div>

             <p className="text-gray-300 text-lg leading-relaxed font-light mb-10 border-l-2 border-white/10 pl-6">
                 {product.description}
             </p>

             {/* Mini Features Icons Row */}
             <div className="flex gap-6 mb-8 text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-8">
                 <div className="flex items-center gap-2">
                     <Truck size={16} className="text-cyan-400" />
                     <span>Доставка 0₽</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Zap size={16} className="text-purple-400" />
                     <span>Гарантия</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-blue-400" />
                     <span>HODL Protect</span>
                 </div>
             </div>

             {/* HELPFUL WIDGETS (Right sticky column) */}
             <div className="grid grid-cols-2 gap-4 print:hidden">
                {/* Size Guide Card */}
                <a href="/size-calculator.html" target="_blank" rel="noopener noreferrer" className="group bg-dark-800/50 p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 hover:bg-dark-800 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-1.5 bg-cyan-900/20 rounded-lg text-cyan-400 group-hover:text-white group-hover:bg-cyan-400 transition-colors">
                            <Ruler size={16} />
                        </div>
                        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors">Размер?</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Гид по подбору</p>
                </a>

                {/* Mag Card */}
                <Link to="/mag" className="group bg-dark-800/50 p-4 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-dark-800 transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-1.5 bg-purple-900/20 rounded-lg text-purple-400 group-hover:text-white group-hover:bg-purple-500 transition-colors">
                            <BookOpen size={16} />
                        </div>
                        <ArrowRight size={14} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">HODL MAG</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed">О стиле и Tech</p>
                </Link>
             </div>
          </div>
        </div>

        {/* FULL WIDTH SECTION: SEO Text & FAQ */}
        <div className="border-t border-white/5 pt-16 pb-16">
            <div className="max-w-4xl mx-auto">
                {/* SEO Text / Long Description */}
                {product.seoText && (
                    <div className="mb-16">
                        {/* Removed 'History and Details' header here */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: product.seoText }} />
                        </div>
                    </div>
                )}
                
                {/* Fallback for old FAQ if it exists in DB schema but user wants to use HTML FAQ from seoText */}
                {!product.seoText?.includes('faq-details') && product.faq && product.faq.length > 0 && (
                    <div className="print:hidden">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                            <HelpCircle size={20} className="text-cyan-400" /> Частые вопросы
                        </h3>
                        <div className="space-y-3">
                            {product.faq.map((item, idx) => (
                                <div key={idx} className="border border-white/10 rounded-xl overflow-hidden bg-dark-800/30 transition-all hover:border-white/20">
                                    <button 
                                       onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                       className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors group"
                                    >
                                        <span className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">{item.question}</span>
                                        <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                                    </button>
                                    <div 
                                       className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
            <div className="border-t border-white/10 pt-16 print:hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-display font-bold uppercase text-white">Вам может понравиться</h3>
                    <Link to="/shop" className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                        Смотреть все
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
