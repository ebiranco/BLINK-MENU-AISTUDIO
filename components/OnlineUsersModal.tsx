import React, { useState } from 'react';
import { Language, Customer } from '../types';
import { t } from '../utils/translations';

interface OnlineUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    onlineUsers: Customer[];
    onChallenge: (user: Customer, timer: number) => void;
    currentCustomer: Customer | null;
}

const OnlineUsersModal: React.FC<OnlineUsersModalProps> = ({ isOpen, onClose, language, onlineUsers, onChallenge, currentCustomer }) => {
    const [sentInvites, setSentInvites] = useState<string[]>([]);
    const [timerDuration, setTimerDuration] = useState(30);

    if (!isOpen) return null;
    
    const handleChallenge = (user: Customer) => {
        onChallenge(user, timerDuration);
        setSentInvites(prev => [...prev, user.id]);
    };

    const getStarRating = (totalScore: number) => {
        if (totalScore < 500) return '⭐';
        if (totalScore < 2000) return '⭐⭐';
        if (totalScore < 5000) return '⭐⭐⭐';
        if (totalScore < 10000) return '⭐⭐⭐⭐';
        return '🌟🌟🌟🌟🌟';
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 border border-green-500 rounded-xl shadow-2xl p-6 text-white max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-300">{t('onlineUsers', language)} ({onlineUsers.length})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-4 p-2 bg-black/20 rounded-md">
                    <label className="text-sm font-semibold">{t('esmFamil_setTimer', language)}:</label>
                    <select value={timerDuration} onChange={e => setTimerDuration(Number(e.target.value))} className="bg-gray-700 text-white rounded p-1 text-sm">
                        <option value={30}>30 {t('esmFamil_seconds', language)}</option>
                        <option value={45}>45 {t('esmFamil_seconds', language)}</option>
                        <option value={60}>60 {t('esmFamil_seconds', language)}</option>
                        <option value={90}>90 {t('esmFamil_seconds', language)}</option>
                    </select>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {onlineUsers.length > 0 ? onlineUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-300">{getStarRating(user.gameProgress.totalScore)}</p>
                            </div>
                            <button 
                                onClick={() => handleChallenge(user)}
                                disabled={sentInvites.includes(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-full text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {sentInvites.includes(user.id) ? t('inviteSent', language) : t('challenge', language)}
                            </button>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-8">No other players online right now.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineUsersModal;