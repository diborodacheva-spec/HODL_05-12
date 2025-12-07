

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Snowflake, Clock, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PopupSettings } from '../types';

interface WinterPopupProps {
    forceVisible?: boolean;
    overrideSettings?: PopupSettings;
    onCloseOverride?: () => void;
}

const WinterPopup: React.FC<WinterPopupProps> = ({ forceVisible = false, overrideSettings, onCloseOverride }) => {
    const { popupSettings: storeSettings } = useStore();
    // Use override settings (from Admin preview) or store settings (live site)
    const settings = overrideSettings || storeSettings;

    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [snowflakes, setSnowflakes] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(settings.timerMinutes ? settings.timerMinutes * 60 * 1000 : 30 * 60 * 1000);

    useEffect(() => {
        // Initialize snow
        const flakes = Array.from({ length: 20 }, (_, i) => i);
        setSnowflakes(flakes);

        // PREVIEW MODE: Force visible
        if (forceVisible) {
            setIsVisible(true);
            return;
        }

        // LIVE MODE Checks:
        
        // 1. Check if enabled
        if (!settings.isEnabled) {
            setIsVisible(false);
            return;
        }

        // 2. Check page filtering
        if (settings.pageFilter !== 'all') {
            const isShop = location.pathname.includes('shop') || location.pathname.includes('product');
            const isMag = location.pathname.includes('mag');
            
            if (settings.pageFilter === 'shop' && !isShop) {
                setIsVisible(false);
                return;
            }
            if (settings.pageFilter === 'mag' && !isMag) {
                setIsVisible(false);
                return;
            }
        }

        // 3. Check session storage (Frequency Capping)
        const hasSeen = sessionStorage.getItem('hodl_winter_popup_seen');
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, settings, forceVisible]);

    // Timer Logic
    useEffect(() => {
        if (!isVisible || !settings.timerMinutes) return;

        // Reset timer logic for preview or live
        const targetTime = settings.timerMinutes * 60 * 1000;
        
        // If in preview/override mode, always reset to full time when opened
        if (overrideSettings) {
             setTimeLeft(targetTime);
        } else {
             // Basic drift correction for live mode
             if (Math.abs(targetTime - timeLeft) > 60000 && timeLeft === 30 * 60 * 1000) {
                 setTimeLeft(targetTime);
             }
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) return 0;
                return prev - 10; 
            });
        }, 10);
        return () => clearInterval(interval);
    }, [isVisible, settings.timerMinutes, overrideSettings]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const cents = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`;
    };

    const handleClose = () => {
        if (onCloseOverride) {
            onCloseOverride(); // Close preview
        } else {
            setIsVisible(false);
            sessionStorage.setItem('hodl_winter_popup_seen', 'true');
        }
    };

    if (!isVisible) return null;

    // --- SIDE IMAGE STYLE (3D Composition / Transparent) ---
    if (settings.style === 'side-image') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden print:hidden">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-500" onClick={handleClose}></div>
                
                {/* Clean Split Layout Container */}
                <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-8 animate-puzzle-reveal p-6 md:p-0">
                     
                     {/* Close Button - Top Right */}
                     <button 
                        onClick={handleClose} 
                        className="absolute top-0 right-0 z-50 p-3 text-white hover:text-cyan-400 transition-colors"
                    >
                        <X size={32} />
                    </button>

                     {/* Image Side - Left */}
                     <div className="relative h-[300px] md:h-[500px] w-full flex items-center justify-center order-2 md:order-1 pointer-events-none">
                          {settings.imageUrl ? (
                             <img 
                                src={settings.imageUrl} 
                                alt="Visual" 
                                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,224,255,0.4)] animate-float" 
                             />
                          ) : (
                             <div className="text-8xl animate-bounce">💎</div>
                          )}
                     </div>

                     {/* Content Side - Right */}
                     <div className="flex flex-col items-center md:items-start text-center md:text-left z-30 order-1 md:order-2">
                          <h3 className="text-4xl md:text-6xl font-display font-black text-white leading-[0.9] mb-6 uppercase drop-shadow-lg">
                            {settings.title}
                          </h3>
                          
                          <p className="text-gray-300 mb-10 text-lg md:text-xl font-light leading-relaxed max-w-lg drop-shadow-md">
                            {settings.text}
                          </p>
                          
                          {/* Action Button */}
                          <div className="hover:scale-105 transition-transform duration-300">
                              {settings.linkUrl.startsWith('http') ? (
                                <a 
                                    href={settings.linkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black text-xl uppercase tracking-wider rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                >
                                    {settings.buttonText} <ArrowRight size={24} />
                                </a>
                              ) : (
                                <Link 
                                    to={settings.linkUrl}
                                    onClick={handleClose}
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black text-xl uppercase tracking-wider rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                >
                                    {settings.buttonText} <ArrowRight size={24} />
                                </Link>
                              )}
                          </div>
                          
                          {/* Secondary Logo */}
                          {settings.secondaryImageUrl && (
                              <img src={settings.secondaryImageUrl} className="h-16 w-auto object-contain mt-12 opacity-80" alt="Partner Logo" />
                          )}
                     </div>
                </div>
            </div>
        );
    }

    // --- FESTIVE ORANGE STYLE ---
    if (settings.style === 'festive') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 print:hidden">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
                    onClick={handleClose}
                ></div>

                <div className="relative w-full max-w-sm bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl overflow-visible pt-16 px-6 pb-8 text-center animate-puzzle-reveal">
                    
                    {/* Close Button */}
                    <button 
                        onClick={handleClose} 
                        className="absolute top-4 right-4 z-20 p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Floating Character Image (Top Center) */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 z-20">
                         {settings.imageUrl ? (
                             <img 
                                src={settings.imageUrl} 
                                alt="Promo Character" 
                                className="w-full h-full object-contain drop-shadow-2xl animate-float"
                             />
                         ) : (
                             // Fallback placeholder if empty
                             <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-4xl animate-float">🎁</div>
                         )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h3 className="text-3xl font-display font-black text-white leading-tight mb-2 drop-shadow-md">
                            {settings.title}
                        </h3>
                        <p className="text-white/90 text-sm font-medium leading-relaxed mb-6 px-2">
                            {settings.text}
                        </p>

                        <div className="flex flex-col gap-3">
                             {/* Timer Button */}
                             <div className="w-full py-3 border-2 border-white/30 rounded-2xl bg-white/10 text-white font-mono font-bold text-xl flex items-center justify-center gap-2">
                                <Clock size={20} />
                                {formatTime(timeLeft)}
                             </div>

                             {/* Action Button */}
                             {settings.linkUrl.startsWith('http') ? (
                                <a 
                                    href={settings.linkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 bg-[#FFEB3B] text-black font-black text-lg uppercase tracking-wider rounded-2xl hover:brightness-110 transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                                >
                                    {settings.buttonText}
                                    <ExternalLink size={18} />
                                </a>
                             ) : (
                                <Link 
                                    to={settings.linkUrl}
                                    onClick={handleClose}
                                    className="w-full py-4 bg-[#FFEB3B] text-black font-black text-lg uppercase tracking-wider rounded-2xl hover:brightness-110 transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                                >
                                    {settings.buttonText}
                                </Link>
                             )}
                        </div>
                    </div>

                    {/* Secondary Logo (Winter in Moscow) */}
                    {settings.secondaryImageUrl && (
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-90 w-full flex justify-center">
                            <img 
                                src={settings.secondaryImageUrl} 
                                alt="Project Logo" 
                                className="h-14 w-auto object-contain drop-shadow-lg"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- CYBER / WINTER GLASS STYLE (Default) ---
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 print:hidden">
            {/* Backdrop with frost effect */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-dark-900 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,224,255,0.2)] overflow-hidden animate-puzzle-reveal">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors border border-white/10"
                >
                    <X size={18} />
                </button>

                {/* Snow Animation Layer */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    {snowflakes.map((i) => (
                        <div 
                            key={i}
                            className="absolute text-white/30 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                fontSize: `${Math.random() * 20 + 10}px`,
                                animationDuration: `${Math.random() * 5 + 5}s`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        >
                            <Snowflake />
                        </div>
                    ))}
                </div>

                {/* Image Section */}
                <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10"></div>
                    <img 
                        src={settings.imageUrl} 
                        alt="Winter Promo" 
                        className="w-full h-full object-cover"
                    />
                     {/* Frost overlay texture */}
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/ice-age.png')] z-0 pointer-events-none"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-2 text-center relative z-20">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-wide mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {settings.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-8 leading-relaxed font-light">
                        {settings.text}
                    </p>

                    {settings.buttonText && (
                        settings.linkUrl.startsWith('http') ? (
                            <a 
                                href={settings.linkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] transition-all hover:scale-[1.02]"
                            >
                                {settings.buttonText}
                                <ExternalLink size={16} className="ml-2" />
                            </a>
                        ) : (
                            <Link 
                                to={settings.linkUrl}
                                onClick={handleClose}
                                className="inline-flex items-center justify-center w-full py-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,224,255,0.4)] hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] transition-all hover:scale-[1.02]"
                            >
                                {settings.buttonText}
                            </Link>
                        )
                    )}

                    {/* Secondary Logo (Winter in Moscow) - Centered Bottom for Cyber Style */}
                    {settings.secondaryImageUrl && (
                        <div className="mt-6 flex justify-center opacity-70">
                            <img 
                                src={settings.secondaryImageUrl} 
                                alt="Partner Logo" 
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WinterPopup;