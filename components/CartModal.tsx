import React, { useEffect, useRef } from 'react';
import { CartItem, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  language: Language;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  tableNumber: string;
  setTableNumber: (value: string) => void;
  onSubmitOrder: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ 
    isOpen, onClose, cartItems, language, onUpdateQuantity, onRemoveItem, tableNumber, setTableNumber, onSubmitOrder 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isRtl = language === 'fa';

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={modalRef}
        className={`fixed top-0 h-full bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col w-full max-w-md transition-transform duration-300 ease-in-out
            ${isRtl ? 'left-0' : 'right-0'}
            ${isOpen 
                ? 'transform-none' 
                : (isRtl ? '-translate-x-full' : 'translate-x-full')
            }`
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{t('cart', language)}</h2>
          <button onClick={onClose} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-16">{t('emptyCart', language)}</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between text-white"
                  style={isOpen ? {
                      animation: `slide-in-item 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                      animationDelay: `${index * 75}ms`,
                      opacity: 0
                  } : {}}
                >
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name[language]} className="w-16 h-16 object-cover rounded-md"/>
                    <div>
                      <h3 className="font-semibold">{item.name[language]}</h3>
                      <p className="text-sm text-gray-300">{formatCurrency(item.price, language)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full font-bold">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full font-bold">+</button>
                     <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-300 p-1 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-black/30">
             <div className="mb-4">
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-300 mb-2">{t('tableNumber', language)}</label>
                <input
                    type="text"
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder={t('enterTableNumber', language)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="flex justify-between items-center mb-4 text-white">
              <span className="text-lg font-semibold">{t('total', language)}</span>
              <span className="text-xl font-bold">{formatCurrency(total, language)}</span>
            </div>
            <button onClick={onSubmitOrder} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
              {t('submitOrder', language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;