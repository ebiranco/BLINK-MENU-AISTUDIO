import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';
import FoodCard from './FoodCard'; // Keep for grid view

type ViewMode = 'immersive' | 'grid';

interface ImmersiveViewProps {
  items: MenuItem[];
  language: Language;
  onAddToCart: (item: MenuItem) => void;
  viewMode: ViewMode;
  onItemClick: (item: MenuItem) => void;
}

const ImmersiveView: React.FC<ImmersiveViewProps> = ({ items, language, onAddToCart, viewMode, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(items[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  useEffect(() => {
    // Reset index when items change (category changes)
    setCurrentIndex(0);
    setCurrentItem(items[0]);
  }, [items]);

  useEffect(() => {
    if (!items[currentIndex]) return;
    
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setCurrentItem(items[currentIndex]);
      setIsAnimating(false);
    }, 200); // Animation duration

    return () => clearTimeout(timer);
  }, [currentIndex, items]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };
  
  const handleAddToCartClick = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

  const chefsPick = useMemo(() => {
    const favoriteItems = items.filter(i => i.isFavorite);
    if (favoriteItems.length > 0) {
      return favoriteItems[Math.floor(Math.random() * favoriteItems.length)];
    }
    return items[Math.floor(Math.random() * items.length)];
  }, [items]);


  // GRID VIEW LOGIC
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <FoodCard key={item.id} item={item} language={language} onItemClick={onItemClick} />
        ))}
      </div>
    );
  }

  // IMMERSIVE VIEW
  if (!currentItem) {
    return <div className="text-center py-10">{/* Handle empty category */}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[75vh]">
      {/* Left/Main Content */}
      <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="relative text-center lg:text-left">
          {currentItem.isFavorite && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 lg:left-0 lg:-translate-x-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                {t('chefsPick', language)}
              </div>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>
            {currentItem.name[language]}
          </h1>
          <p className="max-w-md text-gray-200 mb-6 mx-auto lg:mx-0">
            {currentItem.description[language]}
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-6 mb-8 text-white">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>
              <span>{currentItem.prepTime} {t('prepTime', language)}</span>
            </div>
            {currentItem.allergens.length > 0 && <span className="opacity-50">|</span>}
            {currentItem.allergens.length > 0 && (
                <div className="flex items-center gap-2" title={t('allergens', language)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>{currentItem.allergens.map(a => a[language]).join(', ')}</span>
                </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
             <span className="text-4xl font-bold text-white">{formatCurrency(currentItem.price, language)}</span>
            <button 
                onClick={() => handleAddToCartClick(currentItem)}
                className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${addedItemId === currentItem.id ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'}`}
            >
                {addedItemId === currentItem.id ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                )}
              <span>{addedItemId === currentItem.id ? t('addedToCart', language) : t('addToCart', language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Image */}
      <div className="relative flex-shrink-0">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            <img 
              src={currentItem.imageUrl} 
              alt={currentItem.name[language]}
              className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full shadow-2xl border-4 border-white/20"
            />
          </div>
           <button onClick={handlePrev} className="absolute top-1/2 -left-6 md:-left-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNext} className="absolute top-1/2 -right-6 md:-right-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
      </div>
      
    </div>
  );
};

export default ImmersiveView;
