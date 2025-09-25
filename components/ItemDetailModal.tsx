import React, { useState, useEffect } from 'react';
import { MenuItem, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';

interface ItemDetailModalProps {
  item: MenuItem | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, language, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
      if(item) {
          setShow(true);
          setQuantity(1); // Reset quantity when a new item is selected
      } else {
          setShow(false);
      }
  }, [item]);

  if (!item) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Allow for animation
  };

  const handleAddToCartClick = () => {
    onAddToCart(item, quantity);
    setAdded(true);
    setTimeout(() => {
        handleClose();
        setAdded(false);
    }, 1000);
  };
  
  const isRtl = language === 'fa';

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg overflow-hidden shadow-2xl max-w-lg w-full m-4 transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        <div className="relative">
          <img src={item.imageUrl} alt={item.name[language]} className="w-full h-64 object-cover" />
          <button onClick={handleClose} className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-black hover:bg-white transition-colors`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">{item.name[language]}</h2>
          <p className="text-gray-700 mb-4">{item.description[language]}</p>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(item.price, language)}</span>
            <div className="flex items-center">
              <button onClick={() => setQuantity(q => q + 1)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md font-bold text-lg hover:bg-gray-300">+</button>
              <span className="px-4 py-1 text-lg font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md font-bold text-lg hover:bg-gray-300">-</button>
            </div>
          </div>
          <button 
            onClick={handleAddToCartClick} 
            className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 text-white flex justify-center items-center gap-2 ${
                added 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {added ? (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('addedToCart', language)}
                </>
            ) : (
                t('addToCart', language)
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
