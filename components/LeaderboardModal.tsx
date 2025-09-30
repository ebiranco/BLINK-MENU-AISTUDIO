import React, { useMemo } from 'react';
import { Language, Customer } from '../types';
import { t } from '../utils/translations';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    customers: Customer[];
    currentCustomerId: string | null;
    language: Language;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, customers, currentCustomerId, language }) => {

    const sortedCustomers = useMemo(() => {
        return [...customers].sort((a, b) => b.gameProgress.highScore - a.gameProgress.highScore);
    }, [customers]);
    
    const currentUserRank = useMemo(() => {
        if (!currentCustomerId) return -1;
        return sortedCustomers.findIndex(c => c.id === currentCustomerId) + 1;
    }, [sortedCustomers, currentCustomerId]);

    if (!isOpen) return null;
    const isRtl = language === 'fa';

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-md w-full m-4 text-gray-800"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">{t('leaderboard', language)}</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
                <h3 className="font-bold text-lg mb-2 text-center text-purple-700">{t('topPlayers', language)}</h3>
                <ul className="space-y-2">
                    {sortedCustomers.slice(0, 10).map((customer, index) => (
                        <li key={customer.id} className={`flex items-center justify-between p-3 rounded-lg ${customer.id === currentCustomerId ? 'bg-purple-100 border-2 border-purple-400' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg text-gray-700 w-6 text-center">{index + 1}</span>
                                <span className="font-semibold text-gray-900">{customer.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-purple-600">{customer.gameProgress.highScore.toLocaleString()}</span>
                                <span className="block text-xs text-gray-500">{t('highScore', language)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {currentUserRank > 10 && (
                    <div className="mt-4 pt-4 border-t">
                         <div className={`flex items-center justify-between p-3 rounded-lg bg-purple-100 border-2 border-purple-400`}>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg text-gray-700 w-6 text-center">{currentUserRank}</span>
                                <span className="font-semibold text-gray-900">{customers.find(c=>c.id === currentCustomerId)?.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-purple-600">{customers.find(c=>c.id === currentCustomerId)?.gameProgress.highScore.toLocaleString()}</span>
                                <span className="block text-xs text-gray-500">{t('highScore', language)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
};

export default LeaderboardModal;
