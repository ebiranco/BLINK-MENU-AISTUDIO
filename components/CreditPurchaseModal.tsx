import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface CreditPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (creditAmount: number) => void;
    language: Language;
}

const creditPacks = [
    { credits: 100, price: 100000, fa_price: "۱۰۰,۰۰۰ تومان" },
    { credits: 500, price: 450000, fa_price: "۴۵۰,۰۰۰ تومان" },
    { credits: 1000, price: 800000, fa_price: "۸۰۰,۰۰۰ تومان" },
];

const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({ isOpen, onClose, onPurchase, language }) => {
    const [selectedPack, setSelectedPack] = useState(creditPacks[0]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onPurchase(selectedPack.credits);
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 2000);
        }, 1500);
    };

    if (!isOpen) return null;
    const isRtl = language === 'fa';

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[70] transition-opacity duration-300"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-md w-full m-4 text-gray-800"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('chargeAccount', language)}</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isSuccess ? (
                <div className="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-lg font-semibold">{t('creditPurchaseSuccess', language)}</p>
                </div>
            ) : (
                 <form onSubmit={handlePurchase}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {creditPacks.map(pack => (
                                <button
                                    type="button"
                                    key={pack.credits}
                                    onClick={() => setSelectedPack(pack)}
                                    className={`p-3 border-2 rounded-lg text-center transition-colors ${selectedPack.credits === pack.credits ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                                >
                                    <p className="font-bold text-lg text-purple-700">{pack.credits}</p>
                                    <p className="text-sm text-gray-600">{t('credits', language)}</p>
                                </button>
                            ))}
                        </div>
                        
                        {/* Dummy Payment Fields */}
                        <div className="space-y-3 pt-4 border-t">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="**** **** **** ****" />
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="MM/YY" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="123" />
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-70 flex justify-center items-center"
                        >
                            {isProcessing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                `${t('purchase', language)} - ${selectedPack.fa_price}`
                            )}
                        </button>
                    </div>
                 </form>
            )}
           
          </div>
        </div>
    );
};
// FIX: Added missing default export.
export default CreditPurchaseModal;