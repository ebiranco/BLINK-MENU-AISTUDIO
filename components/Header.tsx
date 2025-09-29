import React from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

type ViewMode = 'immersive' | 'grid';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartItemCount: number;
  onCartClick: () => void;
  showBackButton: boolean;
  onBack: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isCartAnimating: boolean;
  onNavigateHome: () => void;
  onReserveClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  language, setLanguage, cartItemCount, onCartClick, showBackButton, onBack, viewMode, setViewMode, isCartAnimating, onNavigateHome, onReserveClick
}) => {
  const isRtl = language === 'fa';

  return (
    <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-lg text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button onClick={onBack} className={`flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRtl ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">{t('backToCategories', language)}</span>
          </button>
        )}
        {!showBackButton && (
          <a href="/#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="text-xl font-bold transition-opacity hover:opacity-80">{t('restaurantName', language)}</a>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {showBackButton && (
          <div className="bg-black/20 rounded-full p-1 flex items-center text-sm">
            <button 
              onClick={() => setViewMode('immersive')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'immersive' ? 'bg-white/30' : ''}`}
            >
              {t('viewImmersive', language)}
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white/30' : ''}`}
            >
              {t('viewGrid', language)}
            </button>
          </div>
        )}
        
        {!showBackButton && (
           <button onClick={onReserveClick} className="hidden sm:block bg-white/10 text-white font-semibold py-2 px-4 rounded-full text-sm hover:bg-white/20 transition-colors">
              {t('reserveTable', language)}
            </button>
        )}

        <div className="bg-black/20 rounded-full p-1 flex items-center text-sm">
           <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-white/30' : ''}`}>EN</button>
           <button onClick={() => setLanguage('fa')} className={`px-3 py-1 rounded-full transition-colors ${language === 'fa' ? 'bg-white/30' : ''}`}>FA</button>
        </div>

        <button 
          onClick={onCartClick} 
          className={`relative p-2 hover:bg-white/20 rounded-full transition-colors ${isCartAnimating ? 'animate-cart-shake' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-black/30">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;