import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';

interface OrderPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    tableNumber: string;
    onConfirmPayment: () => void; // Renamed from onSuccess for clarity
    language: Language;
}

const OrderPaymentModal: React.FC<OrderPaymentModalProps> = ({ isOpen, onClose, cartItems, tableNumber, onConfirmPayment, language }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isRtl = language === 'fa';

    const handlePay = async () => {
        setIsProcessing(true);
        // Simulate payment API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // After fake payment is successful, submit the order to our backend
            await onConfirmPayment(); 
            setIsProcessing(false);
            setPaymentSuccess(true);

            // Reset after showing success message
            setTimeout(() => {
                // The parent component handles closing and resetting state
                setPaymentSuccess(false);
            }, 3000);

        } catch (error) {
            // If order submission fails after payment
            console.error("Failed to confirm order after payment", error);
            alert("Payment was successful, but there was an error confirming your order. Please contact staff.");
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={paymentSuccess ? undefined : onClose}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-md w-full m-4 text-gray-800"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                  {paymentSuccess ? t('paymentSuccessful', language) : t('orderSummary', language)}
              </h2>
              {!paymentSuccess && (
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              )}
            </div>
            
            {paymentSuccess ? (
                <div className="p-8 text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-lg">{t('yourOrderIsConfirmed', language)}</p>
                </div>
            ) : (
                <>
                    <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                        <p>{t('tableNumber', language)}: <span className="font-bold">{tableNumber}</span></p>
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span>{item.quantity}x {item.name[language]}</span>
                                <span>{formatCurrency(item.price * item.quantity, language)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4 font-bold text-xl">
                            <span>{t('total', language)}</span>
                            <span>{formatCurrency(total, language)}</span>
                        </div>
                        <button 
                            onClick={handlePay} 
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100 flex justify-center items-center"
                        >
                            {isProcessing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                t('payNow', language)
                            )}
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
    );
};

export default OrderPaymentModal;
