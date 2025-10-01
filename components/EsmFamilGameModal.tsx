import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Language, Customer } from '../types';
import { t } from '../utils/translations';
import { GoogleGenAI, Type } from '@google/genai';

const PERSIAN_ALPHABET = ['ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'];
const CATEGORIES: (keyof EsmFamilAnswers)[] = ['name', 'family', 'city', 'country', 'animal', 'food', 'object'];

type EsmFamilAnswers = {
    name: string;
    family: string;
    city: string;
    country: string;
    animal: string;
    food: string;
    object: string;
};

const initialAnswers: EsmFamilAnswers = {
    name: '', family: '', city: '', country: '', animal: '', food: '', object: ''
};

interface EsmFamilGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    currentUser: Customer;
    opponent: Customer | 'AI';
    timerDuration: number;
    onGameEnd: (score: number) => void;
}

const EsmFamilGameModal: React.FC<EsmFamilGameModalProps> = ({ isOpen, onClose, language, currentUser, opponent, timerDuration, onGameEnd }) => {
    const [gameState, setGameState] = useState<'playing' | 'scoring' | 'finished'>('playing');
    const [letter, setLetter] = useState('');
    const [timer, setTimer] = useState(timerDuration);
    const [myAnswers, setMyAnswers] = useState<EsmFamilAnswers>(initialAnswers);
    const [opponentAnswers, setOpponentAnswers] = useState<EsmFamilAnswers | null>(null);
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

    const isMultiplayer = opponent !== 'AI';

    const finishRound = useCallback(async () => {
        if (gameState !== 'playing') return;
        setGameState('scoring');

        if (opponent === 'AI') {
            try {
                // FIX: API Key must be read from process.env as per guidelines
                if (!process.env.API_KEY) throw new Error("API Key not configured. Please check your environment variables.");
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `You are playing the Persian word game 'Esm Famil'. The starting letter is '${letter}'. Provide a single, valid, common Persian answer for each category.`;
                
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                      responseMimeType: "application/json",
                      responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            family: { type: Type.STRING },
                            city: { type: Type.STRING },
                            country: { type: Type.STRING },
                            animal: { type: Type.STRING },
                            food: { type: Type.STRING },
                            object: { type: Type.STRING },
                        }
                      }
                    }
                });

                const aiResult = JSON.parse(response.text);
                setOpponentAnswers(aiResult);
            } catch (error) {
                console.error("AI opponent failed:", error);
                setOpponentAnswers(initialAnswers); // AI fails, gives no answers
            }
        } else {
            // In a real app, you'd receive opponent's answers via WebSocket.
            // For this demo, we'll simulate it with random valid-looking answers.
            setOpponentAnswers({
                name: 'کامران', family: 'کامیابی', city: 'کرمان', country: 'کانادا',
                animal: 'کبک', food: 'کباب', object: 'کتاب'
            });
        }
    }, [gameState, letter, opponent]);

    // Game Setup and Timer
    useEffect(() => {
        if (isOpen) {
            setGameState('playing');
            setLetter(PERSIAN_ALPHABET[Math.floor(Math.random() * PERSIAN_ALPHABET.length)]);
            setTimer(timerDuration);
            setMyAnswers(initialAnswers);
            setOpponentAnswers(null);
        }
    }, [isOpen, timerDuration]);
    
    useEffect(() => {
        if (gameState === 'playing' && timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            finishRound();
        }
    }, [gameState, timer, finishRound]);
    
    // Scoring Logic
    useEffect(() => {
        if (gameState === 'scoring' && opponentAnswers) {
            let myTotal = 0;
            let opponentTotal = 0;
            CATEGORIES.forEach(cat => {
                const myAns = myAnswers[cat].trim();
                const opAns = opponentAnswers[cat].trim();

                if (myAns && myAns.startsWith(letter)) {
                    if (!opAns || !opAns.startsWith(letter)) {
                        myTotal += 10;
                    } else if (myAns === opAns) {
                        myTotal += 5;
                        opponentTotal += 5;
                    } else {
                        myTotal += 10;
                        opponentTotal += 10;
                    }
                } else if (opAns && opAns.startsWith(letter)) {
                    opponentTotal += 10;
                }
            });
            setMyScore(myTotal);
            setOpponentScore(opponentTotal);
            setGameState('finished');
            onGameEnd(myTotal);
        }
    }, [gameState, opponentAnswers, myAnswers, letter, onGameEnd]);


    const handleAnswerChange = (category: keyof EsmFamilAnswers, value: string) => {
        setMyAnswers(prev => ({ ...prev, [category]: value }));
    };

    if (!isOpen) return null;

    const opponentName = opponent === 'AI' ? 'AI' : opponent.name;

    return (
         <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 border border-purple-500 rounded-xl shadow-2xl p-6 text-white max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-yellow-300">{t('esmFamil', language)}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-400">{t('esmFamil_letter', language)}</div>
                            <div className="text-4xl font-bold">{letter}</div>
                        </div>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90"><circle className="text-gray-600" strokeWidth="5" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" /><circle className="text-purple-500" strokeWidth="5" strokeDasharray={2 * Math.PI * 36} strokeDashoffset={(2 * Math.PI * 36) - (timer / timerDuration) * (2 * Math.PI * 36)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" /></svg>
                            <span className="absolute text-2xl font-bold">{timer}</span>
                        </div>
                    </div>
                </div>

                {gameState === 'playing' && (
                    <div className="space-y-3">
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="grid grid-cols-3 items-center">
                                <label className="font-semibold text-lg col-span-1">{t(`esmFamil_${cat}`, language)}</label>
                                <input type="text" onChange={(e) => handleAnswerChange(cat, e.target.value)} className="col-span-2 bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                        ))}
                        <button onClick={finishRound} className="w-full mt-4 bg-red-600 hover:bg-red-700 font-bold py-3 rounded-lg text-xl">{t('esmFamil_stop', language)}</button>
                    </div>
                )}

                {(gameState === 'scoring' || gameState === 'finished') && (
                     <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">{gameState === 'scoring' ? t('generating', language) : t('esmFamil_results', language)}</h3>
                         {gameState === 'scoring' && <div className="animate-spin h-8 w-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"></div>}
                        {gameState === 'finished' && opponentAnswers && (
                            <div>
                                <div className="grid grid-cols-3 gap-2 text-center font-semibold mb-2 bg-gray-700 p-2 rounded-t-lg">
                                    <div>Category</div>
                                    <div>{t('esmFamil_you', language)}</div>
                                    <div>{opponentName}</div>
                                </div>
                                <div className="space-y-1">
                                    {CATEGORIES.map(cat => (
                                        <div key={cat} className="grid grid-cols-3 gap-2 p-2 bg-gray-900/50 rounded">
                                            <div className="font-semibold text-purple-300">{t(`esmFamil_${cat}`, language)}</div>
                                            <div>{myAnswers[cat]}</div>
                                            <div>{opponentAnswers[cat]}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 mt-4 gap-4">
                                    <div className="bg-blue-900/50 p-4 rounded-lg">
                                        <p className="text-lg font-semibold">{t('esmFamil_yourScore', language)}</p>
                                        <p className="text-3xl font-bold">{myScore}</p>
                                    </div>
                                    <div className="bg-red-900/50 p-4 rounded-lg">
                                        <p className="text-lg font-semibold">{t('esmFamil_opponentScore', language)}</p>
                                        <p className="text-3xl font-bold">{opponentScore}</p>
                                    </div>
                                </div>
                                <h4 className="text-3xl font-bold mt-4 text-yellow-300">
                                    {myScore > opponentScore ? t('esmFamil_youWin', language) : myScore < opponentScore ? t('esmFamil_youLose', language) : t('esmFamil_draw', language)}
                                </h4>
                                <button onClick={onClose} className="mt-4 bg-purple-600 hover:bg-purple-700 font-bold py-2 px-6 rounded-lg">Close</button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default EsmFamilGameModal;
