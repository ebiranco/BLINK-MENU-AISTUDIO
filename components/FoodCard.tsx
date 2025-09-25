import React from 'react';
import { MenuItem, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';

interface FoodCardProps {
  item: MenuItem;
  language: Language;
  onItemClick: (item: MenuItem) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, language, onItemClick }) => {
  return (
    <div 
      className="bg-white/60 backdrop-filter backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
      onClick={() => onItemClick(item)}
      style={{direction: language === 'fa' ? 'rtl' : 'ltr'}}
    >
      <div className="overflow-hidden h-48">
        <img 
            src={item.imageUrl} 
            alt={item.name[language]} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{item.name[language]}</h3>
        <p className="text-gray-600 text-sm h-10 mt-1 overflow-hidden">
            {item.description[language]}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-gray-900 text-lg">{formatCurrency(item.price, language)}</span>
          <div className="flex items-center text-sm text-gray-500 gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>
            <span>{item.prepTime} {t('prepTime', language)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
