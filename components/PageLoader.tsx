
import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 text-cyan-400">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Brand Logo Placeholder or Spinner */}
        <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
             <Loader2 size={48} className="animate-spin relative z-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white animate-pulse">
            Loading HODL...
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
