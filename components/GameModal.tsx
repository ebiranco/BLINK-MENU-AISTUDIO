import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

// Game configuration
const PLAYER_WIDTH = 60;
const ITEM_SIZE = 40;
const GAME_HEIGHT = window.innerHeight;
const GAME_WIDTH = Math.min(window.innerWidth, 500); // Max width for the game area
const INITIAL_LIVES = 3;
const GOOD_ITEMS = ['🍔', '🍕', '🍓', '🍰', '🍗', '🍣', '🌮', '🍩'];
const BAD_ITEMS = ['🥦', '👟', '🦠', '💣', '🧱', '💀'];
const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000];


interface GameItem {
    id: number;
    x: number;
    y: number;
    emoji: string;
    type: 'good' | 'bad';
    speed: number;
}

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onGameEnd: (finalScore: number) => void;
  currentLevel: number;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, language, onGameEnd, currentLevel }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(INITIAL_LIVES);
    const [items, setItems] = useState<GameItem[]>([]);
    const [playerX, setPlayerX] = useState(GAME_WIDTH / 2);
    const [showLevelUp, setShowLevelUp] = useState(false);
    
    // FIX: Initialize useRef with null to match its type for browser environments.
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    // FIX: setInterval returns a number in browsers, not a NodeJS.Timeout.
    const itemSpawnIntervalId = useRef<number | null>(null);

    const resetGame = useCallback(() => {
        setScore(0);
        setLevel(currentLevel);
        setLives(INITIAL_LIVES);
        setItems([]);
        setGameState('playing');
    }, [currentLevel]);
    
    useEffect(() => {
        setLevel(currentLevel);
    }, [currentLevel]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (gameAreaRef.current) {
            const rect = gameAreaRef.current.getBoundingClientRect();
            let newX = e.clientX - rect.left;
            newX = Math.max(PLAYER_WIDTH / 2, Math.min(newX, GAME_WIDTH - PLAYER_WIDTH / 2));
            setPlayerX(newX);
        }
    }, []);
    
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (gameAreaRef.current && e.touches[0]) {
            e.preventDefault();
            const rect = gameAreaRef.current.getBoundingClientRect();
            let newX = e.touches[0].clientX - rect.left;
            newX = Math.max(PLAYER_WIDTH / 2, Math.min(newX, GAME_WIDTH - PLAYER_WIDTH / 2));
            setPlayerX(newX);
        }
    }, []);

    const spawnItem = useCallback(() => {
        const isGood = Math.random() > 0.3; // 70% chance of good item
        const emojiList = isGood ? GOOD_ITEMS : BAD_ITEMS;
        const newItem: GameItem = {
            id: Date.now() + Math.random(),
            x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
            y: -ITEM_SIZE,
            emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
            type: isGood ? 'good' : 'bad',
            speed: (2 + Math.random() * 2) * (1 + level * 0.1) // Speed increases with level
        };
        setItems(prev => [...prev, newItem]);
    }, [level]);

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        let newScore = score;
        let newLives = lives;

        setItems(prevItems => {
            const newItems: GameItem[] = [];
            
            for (const item of prevItems) {
                const updatedItem = { ...item, y: item.y + item.speed };

                // Collision detection with player
                const playerLeft = playerX - PLAYER_WIDTH / 2;
                const playerRight = playerX + PLAYER_WIDTH / 2;
                const itemRight = updatedItem.x + ITEM_SIZE;
                
                if (updatedItem.y > GAME_HEIGHT - ITEM_SIZE - 20 && updatedItem.y < GAME_HEIGHT - 20 &&
                    updatedItem.x < playerRight && itemRight > playerLeft) {
                    if (item.type === 'good') {
                        newScore += 10 * level;
                    } else {
                        newLives -= 1;
                    }
                    continue; 
                }

                if (updatedItem.y < GAME_HEIGHT) {
                    newItems.push(updatedItem);
                } else {
                    if(item.type === 'good'){
                        newLives -= 1;
                    }
                }
            }
            return newItems;
        });

        const nextLevelThreshold = LEVEL_THRESHOLDS[level] || Infinity;
        if (newScore >= nextLevelThreshold) {
            setLevel(prevLevel => prevLevel + 1);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 1500);
        }
        
        setScore(newScore);

        if (newLives <= 0) {
            setLives(0);
            setGameState('gameOver');
            onGameEnd(score); // pass final score up
        } else {
            setLives(newLives);
        }

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [gameState, playerX, score, lives, level, onGameEnd]);

    useEffect(() => {
        if (isOpen && gameState === 'playing') {
            animationFrameId.current = requestAnimationFrame(gameLoop);
            const spawnRate = Math.max(200, 800 - (level * 40));
            itemSpawnIntervalId.current = window.setInterval(spawnItem, spawnRate);
            
            const gameArea = gameAreaRef.current;
            gameArea?.addEventListener('mousemove', handleMouseMove);
            gameArea?.addEventListener('touchmove', handleTouchMove, { passive: false });

            return () => {
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                if (itemSpawnIntervalId.current) clearInterval(itemSpawnIntervalId.current);
                gameArea?.removeEventListener('mousemove', handleMouseMove);
                gameArea?.removeEventListener('touchmove', handleTouchMove);
            };
        }
    }, [isOpen, gameState, gameLoop, spawnItem, handleMouseMove, handleTouchMove, level]);
    
    useEffect(() => {
        if (!isOpen) {
            setGameState('idle');
            setItems([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;
    const isRtl = language === 'fa';

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center">
            <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-b from-blue-900 to-black rounded-lg shadow-2xl overflow-hidden touch-none"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT, cursor: 'none' }}
            >
                {gameState === 'idle' && (
                    <div 
                        className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-8 text-center bg-cover bg-center"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558221422-038b3c8f85bd?q=80&w=1974&auto=format=fit=crop')` }}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-5xl font-extrabold text-yellow-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{t('gameWelcomeTitle', language)}</h2>
                            <p className="mt-2 text-lg text-gray-200 max-w-sm">{t('gameIntro', language)}</p>
                            
                            <div className="mt-6 space-y-4 text-left bg-black/40 p-6 rounded-lg border border-white/20 max-w-md">
                                <div>
                                    <h3 className="font-bold text-xl text-purple-300">{t('howToPlay', language)}</h3>
                                    <p className="text-gray-200">🍽️ {t('playInstruction', language)}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-purple-300">{t('scoringTitle', language)}</h3>
                                    <ul className="list-disc list-inside text-gray-200 space-y-1">
                                        <li>{t('scoringRule1', language).replace('{good_items}', GOOD_ITEMS.slice(0, 3).join(' '))}</li>
                                        <li>{t('scoringRule2', language).replace('{bad_items}', BAD_ITEMS.slice(0, 3).join(' '))}</li>
                                        <li>{t('scoringRule3', language)}</li>
                                    </ul>
                                </div>
                            </div>

                            <button onClick={resetGame} className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full text-xl transform transition-transform hover:scale-105 shadow-lg">
                                {t('startGame', language)}
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'gameOver' && (
                     <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 bg-black/50">
                        <h2 className="text-5xl font-bold">{t('gameOver', language)}</h2>
                        <p className="text-2xl mt-4">{t('score', language)}: {score}</p>
                        <button onClick={resetGame} className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl transform transition-transform hover:scale-105">
                            {t('playAgain', language)}
                        </button>
                    </div>
                )}
                
                {showLevelUp && (
                     <div className="absolute inset-0 flex justify-center items-center z-30 pointer-events-none">
                        <h2 className="text-6xl font-extrabold text-yellow-300 animate-ping" style={{textShadow: '0 0 15px yellow'}}>{t('levelUp', language)}</h2>
                    </div>
                )}

                {(gameState === 'playing' || gameState === 'gameOver') && (
                    <>
                        {/* Game UI */}
                        <div className="absolute top-4 w-full px-4 flex justify-between items-center text-white text-lg font-bold z-10" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
                           <span>{t('score', language)}: {score}</span>
                           <span>{t('level', language)}: {level}</span>
                            <div className="flex items-center gap-2">
                                <span>{t('lives', language)}:</span>
                                <div className="flex">
                                    {Array.from({ length: lives }).map((_, i) => <span key={i}>❤️</span>)}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="absolute select-none"
                                style={{
                                    left: item.x,
                                    top: item.y,
                                    fontSize: `${ITEM_SIZE}px`,
                                    lineHeight: 1,
                                    willChange: 'transform'
                                }}
                            >
                                {item.emoji}
                            </div>
                        ))}

                        {/* Player */}
                        <div
                            className="absolute bottom-5 select-none"
                            style={{
                                left: playerX - PLAYER_WIDTH / 2,
                                width: PLAYER_WIDTH,
                                height: 30,
                                fontSize: '40px',
                                textAlign: 'center',
                                willChange: 'left'
                            }}
                        >
                            🍽️
                        </div>
                    </>
                )}
                 {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 z-20 p-2 text-white bg-white/10 rounded-full hover:bg-white/20" style={isRtl ? { left: 12 } : { right: 12 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default GameModal;