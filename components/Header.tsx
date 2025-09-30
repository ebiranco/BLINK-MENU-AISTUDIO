import React from 'react';
import { Language, Restaurant } from '../types';

interface HeaderProps {
    restaurant: Restaurant;
    language: Language;
    setLanguage: (lang: Language) => void;
    onCartClick: () => void;
    cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ restaurant, language, setLanguage, onCartClick, cartItemCount }) => {
    return (
        <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white tracking-wider">{restaurant.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center text-sm border border-white/20">
                            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full transition-colors text-white ${language === 'en' ? 'bg-white/20' : ''}`}>EN</button>
                            <button onClick={() => setLanguage('fa')} className={`px-3 py-1 rounded-full transition-colors text-white ${language === 'fa' ? 'bg-white/20' : ''}`}>FA</button>
                        </div>
                        <button onClick={onCartClick} className="relative p-2 text-white hover:bg-white/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
