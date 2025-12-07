

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const { isAdmin, toggleAdmin, brandLogo, headerLinks } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const renderLink = (link: { id: string, label: string, url: string, isHighlight?: boolean }, isMobile: boolean = false) => {
    const isExternal = link.url.startsWith('http');
    
    // Determine classes based on link type (Highlight vs Normal) and View (Mobile vs Desktop)
    let baseClasses = "";
    
    if (isMobile) {
        baseClasses = link.isHighlight 
            ? "block text-sm font-bold uppercase tracking-widest text-cyan-400"
            : "block text-sm font-bold uppercase tracking-widest text-white hover:text-cyan-400";
    } else {
        if (link.isHighlight) {
            baseClasses = "text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1";
        } else {
            const isActive = location.pathname === link.url;
            baseClasses = `text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-cyan-400 ${isActive ? 'text-white' : 'text-gray-400'}`;
        }
    }

    if (isExternal) {
        return (
            <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClasses}
                onClick={isMobile ? () => setIsMenuOpen(false) : undefined}
            >
                {link.label}
                {!isMobile && link.isHighlight && <ExternalLink size={10} />}
            </a>
        );
    }

    return (
        <Link
            key={link.id}
            to={link.url}
            className={baseClasses}
            onClick={isMobile ? () => setIsMenuOpen(false) : undefined}
        >
            {link.label}
        </Link>
    );
  };

  return (
    <nav className="bg-dark-900/90 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-center group">
              {brandLogo ? (
                  <img 
                    src={brandLogo} 
                    alt="HODL Jewelry" 
                    className="h-12 w-auto object-contain hover:opacity-80 transition-opacity"
                  />
              ) : (
                  <>
                    <span className="font-display text-2xl tracking-[0.2em] font-black text-white group-hover:text-cyan-400 transition-colors">
                        HODL
                    </span>
                    <span className="text-[0.6rem] tracking-[0.4em] text-gray-400 uppercase">Jewelry</span>
                  </>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {headerLinks.map(link => renderLink(link))}

            {/* Admin Toggle */}
             <button 
              onClick={toggleAdmin}
              className={`p-2 rounded-full transition-colors ${isAdmin ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-600 hover:text-gray-400'}`}
              title="Staff Login"
            >
              {isAdmin ? <ShieldCheck size={18} /> : <Lock size={18} />}
            </button>

            {isAdmin && (
               <Link
               to="/admin"
               className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                 location.pathname === '/admin' ? 'text-cyan-400' : 'text-red-500'
               }`}
             >
               Admin
             </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:text-cyan-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col items-center text-center">
            {headerLinks.map(link => renderLink(link, true))}
            
             {isAdmin && (
               <Link
               to="/admin"
               onClick={() => setIsMenuOpen(false)}
               className="block text-sm font-bold uppercase tracking-widest text-red-500"
             >
               Панель управления
             </Link>
            )}
             <button
              onClick={() => {
                toggleAdmin();
                setIsMenuOpen(false);
              }}
              className="text-xs text-gray-600 mt-4 uppercase tracking-widest"
            >
              {isAdmin ? 'Выйти' : 'Staff'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;