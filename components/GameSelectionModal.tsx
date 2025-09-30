import React from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface GameSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectBlinkBites: () => void;
    onSelectEsmFamilAI: () => void;
    onSelectEsmFamilHuman: () => void;
    language: Language;
}

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({ isOpen, onClose, onSelectBlinkBites, onSelectEsmFamilAI, onSelectEsmFamilHuman, language }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 border border-purple-500 rounded-xl shadow-2xl p-8 text-white max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">{t('selectGame', language)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blink Bites Card */}
                    <div className="bg-gray-700/50 p-6 rounded-lg text-center border border-gray-600 flex flex-col items-center">
                        <span className="text-6xl mb-4">🍔</span>
                        <h3 className="text-2xl font-semibold mb-2">{t('blinkBites', language)}</h3>
                        <p className="text-sm text-gray-300 mb-4">Catch falling food, avoid the junk!</p>
                        <button onClick={onSelectBlinkBites} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full w-full">
                            {t('playGame', language)}
                        </button>
                    </div>

                    {/* Esm Famil Card */}
                    <div className="bg-gray-700/50 p-6 rounded-lg text-center border border-gray-600 flex flex-col items-center">
                         <span className="text-6xl mb-4">✍️</span>
                        <h3 className="text-2xl font-semibold mb-2">{t('esmFamil', language)}</h3>
                        <p className="text-sm text-gray-300 mb-4">The classic word game of categories.</p>
                        <div className="flex flex-col gap-3 w-full">
                           <button onClick={onSelectEsmFamilAI} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full w-full">
                                {t('esmFamil_playWithAI', language)}
                           </button>
                           <button onClick={onSelectEsmFamilHuman} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full w-full">
                                {t('esmFamil_playWithHuman', language)}
                           </button>
                        </div>
                    </div>
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default GameSelectionModal;