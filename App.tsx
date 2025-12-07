import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WinterPopup from './components/WinterPopup';
import { StoreProvider } from './context/StoreContext';
import PageLoader from './components/PageLoader';

// Lazy load pages to split the bundle size and improve initial load speed (SEO Core Web Vitals)
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Mag = lazy(() => import('./pages/Mag'));
const ArticleDetails = lazy(() => import('./pages/ArticleDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const Cart = lazy(() => import('./pages/Cart')); // Assuming Cart exists or will exist
const NotFound = lazy(() => import('./pages/NotFound'));
const HodlProtection = lazy(() => import('./pages/HodlProtection'));

// Technical pages
const SitemapXml = lazy(() => import('./pages/SitemapXml'));
// RobotsTxt handled by static public file
const RssXml = lazy(() => import('./pages/RssXml'));
const SecurityTxt = lazy(() => import('./pages/SecurityTxt'));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <StoreProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans text-white relative overflow-hidden">
            
            {/* Global Background Layer - Neon Iridescent Effect */}
            {/* Added print:hidden to prevent fixed background issues in PDF generation */}
            <div className="fixed inset-0 z-[-1] bg-dark-900 overflow-hidden print:hidden">
               {/* Gradient Blobs */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-60">
                  {/* Cyan Blob */}
                  <div 
                    className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
                  ></div>
                  
                  {/* Purple/Pink Blob */}
                  <div 
                    className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
                    style={{ animationDelay: '2s' }}
                  ></div>
                  
                  {/* Blue Blob */}
                  <div 
                    className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-blue-700 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
                    style={{ animationDelay: '4s' }}
                  ></div>

                  {/* Accent Blob */}
                  <div 
                    className="absolute top-[40%] right-[30%] w-[40vw] h-[40vw] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"
                    style={{ animationDelay: '6s' }}
                  ></div>
               </div>
              
              {/* Noise Texture Overlay for Premium Feel */}
              <div className="absolute inset-0 opacity-[0.04]" 
                   style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                   }}
              ></div>
            </div>

            <WinterPopup />

            {/* Suspense handles the loading state while the lazy component is being fetched */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                  {/* Regular Routes with Layout */}
                  <Route path="/" element={<><Navbar /><main className="flex-grow relative z-10"><Home /></main><Footer /></>} />
                  <Route path="/shop" element={<><Navbar /><main className="flex-grow relative z-10"><Shop /></main><Footer /></>} />
                  <Route path="/product/:slug" element={<><Navbar /><main className="flex-grow relative z-10"><ProductDetails /></main><Footer /></>} />
                  <Route path="/mag" element={<><Navbar /><main className="flex-grow relative z-10"><Mag /></main><Footer /></>} />
                  <Route path="/mag/:slug" element={<><Navbar /><main className="flex-grow relative z-10"><ArticleDetails /></main><Footer /></>} />
                  <Route path="/admin" element={<><Navbar /><main className="flex-grow relative z-10"><Admin /></main><Footer /></>} />
                  <Route path="/sitemap" element={<><Navbar /><main className="flex-grow relative z-10"><Sitemap /></main><Footer /></>} />
                  <Route path="/cart" element={<><Navbar /><main className="flex-grow relative z-10"><Cart /></main><Footer /></>} />
                  
                  {/* NEW ROUTE */}
                  <Route path="/protection" element={<><Navbar /><main className="flex-grow relative z-10"><HodlProtection /></main><Footer /></>} />
                  
                  {/* Special Routes (No Layout) */}
                  <Route path="/sitemap.xml" element={<SitemapXml />} />
                  <Route path="/rss.xml" element={<RssXml />} />
                  <Route path="/security.txt" element={<SecurityTxt />} />
                  <Route path="/.well-known/security.txt" element={<SecurityTxt />} />

                  {/* 404 Not Found */}
                  <Route path="*" element={<><Navbar /><main className="flex-grow relative z-10"><NotFound /></main><Footer /></>} />
              </Routes>
            </Suspense>
            
          </div>
        </Router>
      </StoreProvider>
    </HelmetProvider>
  );
};

export default App;