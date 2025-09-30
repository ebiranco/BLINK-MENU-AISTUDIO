import React from 'react';
import { Language, Restaurant, Customer } from '../types';
import { t } from '../utils/translations';

interface HeaderProps {
    restaurant: Restaurant;
    language: Language;
    setLanguage: (lang: Language) => void;
    onCartClick: () => void;
    cartItemCount: number;
    isGameActive: boolean;
    onGameZoneClick: () => void;
    onlineUserCount: number;
    onOnlineUsersClick: () => void;
    onAuthClick: () => void;
    currentCustomer: Customer | null;
    onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { restaurant, language, setLanguage, onCartClick, cartItemCount, isGameActive, onGameZoneClick, onlineUserCount, onOnlineUsersClick, onAuthClick, currentCustomer, onNavigate } = props;
    
    const getStarRating = (totalScore: number) => {
        if (totalScore < 500) return '⭐';
        if (totalScore < 2000) return '⭐⭐';
        if (totalScore < 5000) return '⭐⭐⭐';
        if (totalScore < 10000) return '⭐⭐⭐⭐';
        return '🌟🌟🌟🌟🌟';
    };

    return (
        <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate('')} title={t('backToHome', language)} className="p-2 text-white hover:bg-white/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-white tracking-wider">{restaurant.name}</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {isGameActive && currentCustomer && (
                            <>
                                <button onClick={onGameZoneClick} className="btn-glass font-bold py-2 px-4 rounded-full text-sm sm:text-base text-yellow-300 border-yellow-400 hover:bg-yellow-400/20">
                                    {t('gameZone', language)}
                                </button>
                                <button onClick={onOnlineUsersClick} className="relative btn-glass py-2 px-4 rounded-full text-sm sm:text-base flex items-center gap-2 text-green-300 border-green-400 hover:bg-green-400/20">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    {onlineUserCount} {t('onlineUsers', language)}
                                </button>
                            </>
                        )}
                        
                         {currentCustomer ? (
                             <div className="btn-glass px-3 py-1.5 rounded-full text-center">
                                 <p className="font-semibold text-white text-sm truncate max-w-[100px]">{currentCustomer.name}</p>
                                 <p className="text-xs">{getStarRating(currentCustomer.gameProgress.totalScore)}</p>
                             </div>
                         ) : (
                            <button onClick={onAuthClick} className="btn-glass font-bold py-2 px-4 rounded-full text-sm">
                                {t('login', language)} / {t('register', language)}
                            </button>
                         )}

                        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex items-center text-sm border border-white/20">
                            <button onClick={() => setLanguage('en')} className={`px-2 py-1 sm:px-3 rounded-full transition-colors text-white text-xs sm:text-sm ${language === 'en' ? 'bg-white/20' : ''}`}>EN</button>
                            <button onClick={() => setLanguage('fa')} className={`px-2 py-1 sm:px-3 rounded-full transition-colors text-white text-xs sm:text-sm ${language === 'fa' ? 'bg-white/20' : ''}`}>FA</button>
                        </div>

                        <button onClick={onCartClick} className="relative p-2 text-white hover:bg-white/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0-0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;