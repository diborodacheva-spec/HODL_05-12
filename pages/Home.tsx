
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Zap, Hammer, Activity, CheckCircle2, ShieldCheck, ArrowRight, Hexagon, RotateCcw, BadgeCheck, Ruler, Sparkles, ChevronLeft, ChevronRight, Maximize2, Crosshair, Flame, FileDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const { 
      isAdmin,
      products, 
      heroImage, 
      heroPrimaryLink,
      heroSecondaryLink,
      uniquenessImages, 
      uniquenessLink,
      madeInMoscowLogo, 
      madeInMoscowText, 
      madeInMoscowLink, 
      features,
      featuresLink,
      madeForeverMarketLink,
      madeForeverCareLink,
      scarcitySettings
  } = useStore();
  
  // Featured / Collection Slider Logic
  const featuredProducts = products.slice(0, 5); // Take up to 5 for the slider
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };
  
  // Scarcity Logic Helper
  const getProductScarcity = (id: string) => {
    if (!scarcitySettings.isEnabled) return null;

    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Total between minTotal and maxTotal
    const totalRange = scarcitySettings.maxTotal - scarcitySettings.minTotal;
    // Ensure we don't divide by zero if max == min
    const safeTotalRange = totalRange > 0 ? totalRange : 1;
    let total = scarcitySettings.minTotal + (seed % safeTotalRange);
    
    // Round to nearest 10 for cleaner look
    total = Math.ceil(total / 10) * 10;

    // Percentage between minSoldPct and maxSoldPct
    const pctRange = scarcitySettings.maxSoldPct - scarcitySettings.minSoldPct;
    const safePctRange = pctRange > 0 ? pctRange : 1;
    const percentage = scarcitySettings.minSoldPct + (seed % safePctRange);
    
    const sold = Math.floor((total * percentage) / 100);
    
    return { sold, total, percentage };
  };

  // Intersection Observer for scroll animations
  const uniquenessRef = useRef<HTMLDivElement>(null);
  const durabilityRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const [isUniquenessVisible, setIsUniquenessVisible] = useState(false);
  const [isDurabilityVisible, setIsDurabilityVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.target === uniquenessRef.current && entry.isIntersecting) {
                    setTimeout(() => setIsUniquenessVisible(true), 100);
                }
                if (entry.target === durabilityRef.current && entry.isIntersecting) {
                    setIsDurabilityVisible(true);
                }
                if (entry.target === featuresRef.current && entry.isIntersecting) {
                    setIsFeaturesVisible(true);
                }
            });
        },
        { threshold: 0.2 }
    );
    
    if (uniquenessRef.current) observer.observe(uniquenessRef.current);
    if (durabilityRef.current) observer.observe(durabilityRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Animate numbers when durability section is visible
  useEffect(() => {
    if (isDurabilityVisible) {
        let start = 0;
        const end = 100;
        const duration = 2000;
        const increment = end / (duration / 16); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setProgressValue(end);
                clearInterval(timer);
            } else {
                setProgressValue(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }
  }, [isDurabilityVisible]);

  const getFeatureIcon = (iconName: string) => {
    const props = { size: 24, className: "text-cyan-400" };
    switch(iconName) {
        case 'hexagon': return <BadgeCheck {...props} />;
        case 'shield': return <ShieldCheck {...props} />;
        case 'zap': return <Zap {...props} />;
        case 'ru': return <Ruler {...props} />;
        default: return <Hexagon {...props} />;
    }
  };

  const renderButton = (link: string, text: React.ReactNode, className: string) => {
      const isExternal = link.startsWith('http');
      if (isExternal) {
          return (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={className}
              >
                  {text}
              </a>
          );
      }
      return (
          <Link to={link} className={className}>
              {text}
          </Link>
      );
  };
  
  // Consistent gradient class for headers
  const shimmerGradientClass = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 animate-shimmer bg-[length:200%_auto]";
  
  return (
    <div className="flex flex-col min-h-screen">
      <SEO page="home" />
      
      {/* Admin PDF Download Button */}
      {isAdmin && (
        <button 
          onClick={() => window.print()} 
          className="fixed bottom-4 left-4 z-50 p-4 bg-white text-black rounded-full shadow-2xl hover:bg-cyan-400 transition-colors print:hidden flex items-center gap-2 font-bold uppercase text-xs tracking-widest"
          title="Сохранить как PDF"
        >
          <FileDown size={20} />
          Скачать PDF
        </button>
      )}

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden pt-10 lg:pt-0">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center relative">
            
            {/* Text Content */}
            <div className="max-w-4xl z-20 relative order-1">
              <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-gray-400 text-sm uppercase tracking-widest">Коллекции из титана и стали</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] mb-8 tracking-tight">
                ДЛЯ ТЕХ, <br />
                КТО <br/>
                <span className={shimmerGradientClass}>
                  ВЫБИРАЕТ СЕБЯ.
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-xl mb-12 font-light leading-relaxed border-l-2 border-cyan-400 pl-6 lg:bg-transparent lg:backdrop-blur-none rounded-r-lg py-2">
                Премиальные кольца из <strong>титана</strong> и стали 316L с уникальным дизайном для тех, кто не следует за толпой.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                {renderButton(
                    heroPrimaryLink,
                    <>
                        Смотреть на Яндекс Маркете
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                    </>,
                    "inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_40px_rgba(0,224,255,0.7)] rounded-full print:hidden"
                )}
                {renderButton(
                    heroSecondaryLink,
                    "Перейти в каталог",
                    "inline-flex items-center justify-center px-8 py-4 border border-cyan-500/30 bg-cyan-900/10 backdrop-blur-sm text-cyan-400 text-sm font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 rounded-full hover:shadow-[0_0_20px_rgba(0,224,255,0.3)] print:hidden"
                )}
              </div>
            </div>

            {/* Floating Ring Image */}
            <div className="flex justify-center items-center perspective-1000 relative h-auto mt-12 md:mt-0 order-2">
                <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-cyan-400/20 rounded-full blur-[60px] animate-pulse"></div>
                <img 
                    src={heroImage} 
                    alt="Floating Jewelry" 
                    className="w-full max-w-[300px] lg:max-w-lg object-contain animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
                />
            </div>
          </div>
        </div>
      </div>

      {/* Manifesto Section */}
      <div className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-wide leading-tight">
                  <span className="block text-cyan-400 drop-shadow-[0_0_15px_rgba(0,224,255,0.4)]">НЕ СДАВАЙСЯ.</span>
                  <span className="block text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">НЕ ТЕРЯЙ.</span>
                  <span className="block text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">НЕ КОПИРУЙ.</span>
                  <span className={`block mt-4 ${shimmerGradientClass}`}>ЖИВИ.</span>
              </h2>
              <p className="mt-12 text-gray-400 max-w-2xl mx-auto">
                  Мы создаём украшения из титана и стали вручную в Москве. 
                  Купить наши украшения можно онлайн — через витрину HODL Jewelry на Яндекс.Маркете.
              </p>
          </div>
      </div>

      {/* Uniqueness / Philosophy */}
      <div className="py-24 relative overflow-hidden" ref={uniquenessRef}>
          {/* Background Grid Decoration */}
          <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Left: Content */}
                <div>
                     <span className="inline-block px-3 py-1 mb-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                        Лимитированные коллекции
                     </span>
                     <h2 className="text-4xl md:text-5xl font-display font-black leading-tight mb-6">
                        <span className={shimmerGradientClass}>
                            БЫТЬ КАК ВСЕ —
                        </span> <br />
                        <span className="text-gray-500">НЕ В НАШЕМ КОДЕ.</span>
                     </h2>
                     <p className="text-lg text-gray-300 mb-6 italic">
                        Каждый дизайн рождается из идеи — и живёт ограниченное время.
                     </p>
                     <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                        <p>
                            В мире, где всё становится похожим, мы выбрали другой путь. 
                            Каждое украшение HODL — это оригинальный дизайнерский аксессуар, 
                            который делают небольшими партиями.
                        </p>
                        <p>
                            Если хочешь не просто "купить", а найти свой символ — ты на месте.
                            <br/>
                            <strong className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-shimmer bg-[length:200%_auto] font-bold text-xl">
                               Мы не следуем трендам — мы задаём свои.
                            </strong> 
                            <br/>
                             HODL — это не просто украшения. Это <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">манифест уникальности</span>.
                        </p>
                     </div>

                     <div className="mt-10 print:hidden">
                        {renderButton(
                            uniquenessLink,
                            "Посмотреть коллекции на Яндекс Маркете",
                            "inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 rounded-full shadow-[0_0_15px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] print:hidden"
                        )}
                     </div>
                </div>

                {/* Right: Puzzle Grid Images */}
                <div className="grid grid-cols-2 gap-4">
                    {uniquenessImages.map((img, index) => (
                        <div 
                            key={index} 
                            className={`relative aspect-square bg-dark-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group opacity-0 ${isUniquenessVisible ? 'animate-puzzle-reveal' : ''}`}
                            style={{ 
                                animationDelay: `${index * 0.25}s`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            <img 
                                src={img.url} 
                                alt={img.label} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                            />
                            {/* Overlay Label */}
                            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                                <span className="text-[10px] uppercase tracking-widest text-white font-bold">
                                    {img.label}
                                </span>
                            </div>
                            
                            {/* Tech Crosshairs */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/50"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/50"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/50"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/50"></div>
                        </div>
                    ))}
                </div>

            </div>
          </div>
      </div>

      {/* NEW SECTION: Durability / Made Forever */}
      <div className="py-24 relative" ref={durabilityRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  
                  {/* Left: Cool Tech Visual (SVG Chart) */}
                  <div className="relative bg-dark-800/40 backdrop-blur-lg rounded-3xl border border-white/5 p-8 lg:p-12 shadow-2xl overflow-hidden group">
                        {/* Glow Effects */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/10 blur-[80px] rounded-full"></div>
                        
                        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                            {/* Central Counter */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
                                <span className="text-5xl md:text-6xl font-display font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    {progressValue}%
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mt-2">Integrity</span>
                            </div>

                            {/* SVG Charts */}
                            <svg viewBox="0 0 400 400" className="w-full max-w-[350px] transform -rotate-90">
                                <defs>
                                    <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00E0FF" />
                                        <stop offset="100%" stopColor="#0091EA" />
                                    </linearGradient>
                                    <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#A855F7" />
                                        <stop offset="100%" stopColor="#7C3AED" />
                                    </linearGradient>
                                    <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#1D4ED8" />
                                    </linearGradient>
                                </defs>

                                {/* Scale Ticks Background */}
                                <circle cx="200" cy="200" r="190" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="4 6" opacity="0.5" />

                                {/* Track 1 (Outer) */}
                                <circle cx="200" cy="200" r="160" stroke="#1F222E" strokeWidth="12" fill="none" />
                                {/* Progress 1 - Water/Titanium */}
                                <circle 
                                    cx="200" cy="200" r="160" 
                                    stroke="url(#gradCyan)" strokeWidth="12" fill="none" strokeLinecap="round"
                                    strokeDasharray="1005"
                                    strokeDashoffset={isDurabilityVisible ? "0" : "1005"} // 100% fill
                                    className="transition-all duration-[2000ms] ease-out delay-300"
                                />

                                {/* Track 2 (Middle) */}
                                <circle cx="200" cy="200" r="120" stroke="#1F222E" strokeWidth="12" fill="none" />
                                {/* Progress 2 - Sweat/Sport */}
                                <circle 
                                    cx="200" cy="200" r="120" 
                                    stroke="url(#gradPurple)" strokeWidth="12" fill="none" strokeLinecap="round"
                                    strokeDasharray="753"
                                    strokeDashoffset={isDurabilityVisible ? "15" : "753"} // ~98% fill
                                    className="transition-all duration-[2000ms] ease-out delay-500"
                                />

                                {/* Track 3 (Inner) */}
                                <circle cx="200" cy="200" r="80" stroke="#1F222E" strokeWidth="12" fill="none" />
                                {/* Progress 3 - City */}
                                <circle 
                                    cx="200" cy="200" r="80" 
                                    stroke="url(#gradBlue)" strokeWidth="12" fill="none" strokeLinecap="round"
                                    strokeDasharray="502"
                                    strokeDashoffset={isDurabilityVisible ? "25" : "502"} // ~95% fill
                                    className="transition-all duration-[2000ms] ease-out delay-700"
                                />
                            </svg>

                            {/* Floating Labels (Absolute positioning over SVG) */}
                            <div className={`absolute top-[5%] right-[5%] flex flex-col items-end gap-1 transition-opacity duration-1000 delay-1000 ${isDurabilityVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#00E0FF]"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white">Вода</span>
                                </div>
                                <span className="text-xl font-black text-cyan-400 tabular-nums">100%</span>
                            </div>

                             <div className={`absolute bottom-[35%] left-[2%] flex flex-col items-start gap-1 transition-opacity duration-1000 delay-1200 ${isDurabilityVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold uppercase tracking-widest text-white">Спорт</span>
                                     <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]"></div>
                                </div>
                                <span className="text-xl font-black text-purple-500 tabular-nums">98%</span>
                            </div>

                             <div className={`absolute bottom-[10%] right-[15%] flex flex-col items-end gap-1 transition-opacity duration-1000 delay-1400 ${isDurabilityVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_#2563EB]"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white">Город</span>
                                </div>
                                <span className="text-xl font-black text-blue-500 tabular-nums">95%</span>
                            </div>
                        </div>

                        {/* Test Results Card */}
                        <div className={`mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl transform transition-all duration-1000 delay-700 ${isDurabilityVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                             <div className="flex gap-3">
                                 <div className="mt-1">
                                     <Activity size={18} className="text-white" />
                                 </div>
                                 <div>
                                     <p className="text-xs text-gray-300 leading-relaxed font-light">
                                        <strong className="text-white">По результатам годового тестирования</strong> украшения HODL показали минимальный износ и <strong className="text-white">сохранили цвет покрытия</strong> при ежедневной носке в воде, спорте и городском режиме.
                                     </p>
                                 </div>
                             </div>
                        </div>
                  </div>

                  {/* Right: Text Content */}
                  <div>
                      <span className="inline-block px-3 py-1 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                        Материалы и защита
                     </span>
                      <h2 className={`text-4xl md:text-6xl font-display font-black leading-none mb-6 ${shimmerGradientClass}`}>
                        СДЕЛАНО <br/>
                        НАВСЕГДА
                      </h2>
                      <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                          Титан и сталь 316L — чтобы украшение оставалось украшением, а не воспоминанием. 
                          HODL Jewelry выбирают те, кто устал от бижутерии на один сезон и хочет купить украшение HODL, 
                          которое прослужит годами.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                          <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center shrink-0 border border-white/10">
                                  <Shield size={20} className="text-cyan-400" />
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-sm mb-1">Гипоаллергенно</h4>
                                  <p className="text-xs text-gray-500">Стойкие к коррозии сплавы Ti и 316L.</p>
                              </div>
                          </div>
                          <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center shrink-0 border border-white/10">
                                  <Hammer size={20} className="text-blue-500" />
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-sm mb-1">Промышленное покрытие</h4>
                                  <p className="text-xs text-gray-500">Кольцо никогда не облезет.</p>
                              </div>
                          </div>
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center shrink-0 border border-white/10">
                                  <Activity size={20} className="text-purple-500" />
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-sm mb-1">Тесты на износ</h4>
                                  <p className="text-xs text-gray-500">Проверяем на влагу перед отправкой.</p>
                              </div>
                          </div>
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-dark-800/50 flex items-center justify-center shrink-0 border border-white/10">
                                  <CheckCircle2 size={20} className="text-cyan-400" />
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-sm mb-1">Для жизни</h4>
                                  <p className="text-xs text-gray-500">Не только для витрины.</p>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-8 print:hidden">
                           {renderButton(
                               madeForeverMarketLink,
                               "Смотреть отзывы",
                               "px-8 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold rounded-full hover:brightness-110 transition-colors shadow-[0_0_15px_rgba(0,224,255,0.3)] uppercase text-xs tracking-widest flex items-center print:hidden"
                           )}
                           
                           {renderButton(
                               madeForeverCareLink,
                               "Гид по уходу",
                               "px-8 py-3 border border-gray-600 text-gray-300 font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest print:hidden"
                           )}
                      </div>

                      <p className="text-xs text-gray-500 border-l border-white/10 pl-4">
                        Носите спокойно: вода, спорт, городской ритм — это нормально. <br/>
                        Избегайте абразивов и агрессивной химии — так изделие служит дольше.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Features Grid */}
      <div className="py-24" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Section */}
            <div className={`mb-12 transition-all duration-700 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <h2 className={`text-3xl md:text-5xl font-display font-black mb-6 uppercase leading-tight ${shimmerGradientClass}`}>
                            МЫ ВСЁ ПРОДУМАЛИ — <br/>
                            ТЫ ПРОСТО ВЫБИРАЙ.
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Качество, честность, гарантия — без компромиссов. Покупая HODL на Яндекс Маркете, вы получаете официальную гарантию бренда и понятные условия обмена.
                        </p>
                    </div>
                    
                    <div className="shrink-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">HODL-защита активна</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {features.map((feature, index) => (
                    <div 
                        key={feature.id} 
                        className={`p-8 bg-dark-800/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-700 group transform ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {/* Bullet/Icon */}
                            {getFeatureIcon(feature.icon)}
                            
                            <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {feature.title}
                            </h3>
                        </div>
                        {/* Render description as HTML to support links */}
                        <div 
                            className="text-gray-400 text-sm leading-relaxed font-light pl-7"
                            dangerouslySetInnerHTML={{ __html: feature.description }}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom CTA / HODL Protection */}
            <div className={`flex flex-col md:flex-row items-center gap-6 transition-all duration-1000 delay-500 ${isFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {renderButton(
                    featuresLink,
                    <>
                         Как работает HODL-защита
                         <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>,
                    "group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] rounded-full whitespace-nowrap print:hidden"
                )}
                
                <p className="text-gray-400 text-sm font-light text-center md:text-left leading-relaxed">
                    Покупай спокойно — у нас всё под контролем: от размера до пересылки.
                </p>
            </div>

        </div>
      </div>

      {/* Featured Collection / Gallery Slider */}
      <div className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
                <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2 block">Лимитированные дропы</span>
                <h2 className={`text-3xl md:text-5xl font-display font-bold uppercase ${shimmerGradientClass}`}>КОЛЛЕКЦИЯ</h2>
            </div>
            
            <div className="flex gap-2 print:hidden">
                <button onClick={prevSlide} className="p-3 rounded-full border border-white/10 hover:border-cyan-400 text-white hover:text-cyan-400 transition-all">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-3 rounded-full border border-white/10 hover:border-cyan-400 text-white hover:text-cyan-400 transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="relative bg-dark-800/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="grid md:grid-cols-2 min-h-[500px] md:h-[600px]">
                    
                    {/* Left: Product Image & Tech Elements */}
                    <div className="relative h-[400px] md:h-full bg-black/20 group">
                        {/* Main Image with Transition Key */}
                        <img 
                            key={featuredProducts[currentSlide].id}
                            src={featuredProducts[currentSlide].imageUrl} 
                            alt={featuredProducts[currentSlide].name} 
                            className="w-full h-full object-cover animate-fade-in transition-transform duration-700"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-dark-800/50"></div>

                        {/* Tech Decorative Elements */}
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                            <Crosshair size={20} className="text-cyan-400 animate-spin-slow" />
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Target_Locked</span>
                        </div>

                        <div className="absolute bottom-6 left-6 md:left-auto md:right-6 md:bottom-auto md:top-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/10">
                            <span className="block text-[10px] text-gray-400 uppercase">Material</span>
                            <span className="text-sm font-bold text-white uppercase">{featuredProducts[currentSlide].material}</span>
                        </div>
                    </div>

                    {/* Right: Info & Controls */}
                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                        {/* Decorative Background ID */}
                         <div className="absolute top-8 right-8 text-6xl font-black text-white/5 select-none pointer-events-none">
                            {(currentSlide + 1).toString().padStart(2, '0')}
                        </div>

                        <div className="mb-8">
                            {/* SCARCITY COUNTER (Telegram Gift Style) */}
                            {(() => {
                                const scarcity = getProductScarcity(featuredProducts[currentSlide].id);
                                if (!scarcity) return null; // Logic to hide if disabled
                                return (
                                    <div className="mb-6 inline-flex flex-col gap-2 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm shadow-lg w-full max-w-[320px]">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                                            <div className="flex items-center gap-1.5 text-orange-400">
                                                <Flame size={12} className="animate-pulse fill-orange-400" />
                                                {scarcitySettings.label}
                                            </div>
                                            <span className="text-gray-400">
                                                <span className="text-white">{scarcity.sold.toLocaleString()}</span> / {scarcity.total.toLocaleString()} Sold
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                                             <div 
                                                className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full"
                                                style={{ width: `${scarcity.percentage}%` }}
                                             ></div>
                                             {/* Shimmer effect on bar */}
                                             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div>
                                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-900/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">
                                    {featuredProducts[currentSlide].category}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-4 leading-tight">
                                    {featuredProducts[currentSlide].name}
                                </h3>
                                <p className="text-gray-400 text-lg font-light leading-relaxed mb-6 line-clamp-3">
                                    {featuredProducts[currentSlide].description}
                                </p>
                                <div className="text-3xl font-display font-bold text-white">
                                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(featuredProducts[currentSlide].price)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto grid gap-4 print:hidden">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href={featuredProducts[currentSlide].marketUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)] text-sm"
                                >
                                    Купить на Маркете
                                    <ArrowUpRight size={18} className="ml-2" />
                                </a>
                                <Link 
                                    to={`/product/${featuredProducts[currentSlide].id}`}
                                    className="flex-1 flex items-center justify-center px-6 py-4 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-400 font-bold uppercase tracking-widest rounded-full transition-all text-sm"
                                >
                                    Подробнее о товаре
                                </Link>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-mono">
                                <CheckCircle2 size={12} className="text-cyan-400" />
                                <span>Гарантия подлинности</span>
                                <span className="mx-2">|</span>
                                <ShieldCheck size={12} className="text-purple-500" />
                                <span>Safe Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
                <p className="text-gray-500">Коллекция обновляется...</p>
            </div>
          )}
          
           <div className="mt-12 text-center print:hidden">
                <Link to="/shop" className="text-gray-400 hover:text-white transition-colors border-b border-gray-700 hover:border-white pb-1 text-sm uppercase tracking-widest">
                    Перейти ко всем украшениям
                </Link>
           </div>
        </div>
      </div>
      
      {/* Made in Moscow Section */}
       <div className="py-24 relative z-10">
          {/* Radial Gradient Background */}
          <div className="absolute inset-0 bg-radial-gradient from-cyan-900/20 to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative">
              
              {/* Animated Logo Area */}
              <div className="flex justify-center mb-10">
                  <div className="relative group">
                      {/* Glow Behind */}
                      <div className="absolute -inset-8 bg-white/20 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                      
                      <div className="flex items-center justify-center">
                          {madeInMoscowLogo ? (
                             /* Custom Uploaded Logo */
                             <img 
                                src={madeInMoscowLogo} 
                                alt="Сделано в Москве" 
                                className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-pulse" 
                                style={{ animationDuration: '3s' }}
                             />
                          ) : (
                             /* Fallback Default Logo (SVG) */
                             <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 md:w-20 md:h-20">
                                     <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                        <path d="M50 90 C20 70 0 50 0 30 C0 10 20 0 40 10 L50 20 L60 10 C80 0 100 10 100 30 C100 50 80 70 50 90 Z" fill="none" stroke="white" strokeWidth="3" className="animate-pulse" />
                                        <path d="M50 80 C30 65 15 50 15 35" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                                        <path d="M50 80 C70 65 85 50 85 35" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                                        <path d="M30 30 Q40 40 50 40 Q60 40 70 30" fill="none" stroke="white" strokeWidth="1" opacity="0.7" />
                                     </svg>
                                </div>
                                <div className="text-left">
                                    <div className={`text-2xl md:text-4xl font-display font-bold leading-none tracking-tighter ${shimmerGradientClass}`}>
                                        СДЕЛАНО
                                    </div>
                                    <div className={`text-2xl md:text-4xl font-display font-bold leading-none tracking-tighter ${shimmerGradientClass}`}>
                                        В МОСКВЕ
                                    </div>
                                </div>
                             </div>
                          )}
                      </div>
                  </div>
              </div>

              <div 
                className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: madeInMoscowText }}
              >
              </div>

              {renderButton(
                  madeInMoscowLink,
                  "Узнать подробнее",
                  "inline-block px-10 py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] rounded-full print:hidden"
              )}
          </div>
      </div>
    </div>
  );
};

export default Home;
