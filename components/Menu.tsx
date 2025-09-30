import React, { useState, useEffect, useMemo } from 'react';
import { MenuCategory, MenuItem, Language, CartItem, Restaurant, Customer, Reservation, GameInvite } from '../types';
import Header from './Header';
import CategoryView from './CategoryView';
import ImmersiveView from './ImmersiveView';
import ItemDetailModal from './ItemDetailModal';
import CartModal from './CartModal';
import OrderPaymentModal from './OrderPaymentModal';
import ReservationModal from './ReservationModal';
import AuthModal from './AuthModal';
import GameModal from './GameModal';
import LeaderboardModal from './LeaderboardModal';
import GameSelectionModal from './GameSelectionModal';
import OnlineUsersModal from './OnlineUsersModal';
import InvitationModal from './InvitationModal';
import EsmFamilGameModal from './EsmFamilGameModal';
import { t } from '../utils/translations';
import { menuItems as mockMenuItems, menuCategories as mockMenuCategories } from '../data/menuData';
import { customers as mockCustomers } from '../data/customerData';
import { restaurants as mockRestaurants } from '../data/platformData';

const API_BASE_URL = '/api';

interface MenuProps {
  restaurantId: string;
  gameInvites: GameInvite[];
  onSendInvite: (from: Customer, to: Customer, settings: { timer: number }) => void;
  onRespondToInvite: (invite: GameInvite, response: 'accepted' | 'declined' | 'cancelled') => void;
  onNavigate: (path: string) => void;
}

const Menu: React.FC<MenuProps> = (props) => {
    const { restaurantId, gameInvites, onSendInvite, onRespondToInvite, onNavigate } = props;
    
    // Data states fetched from the backend
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI and interaction states
    const [language, setLanguage] = useState<Language>('fa');
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [tableNumber, setTableNumber] = useState('');
    const [viewMode, setViewMode] = useState<'immersive' | 'grid'>('immersive');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isGameSelectionModalOpen, setIsGameSelectionModalOpen] = useState(false);
    const [isBlinkBitesModalOpen, setIsBlinkBitesModalOpen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
    const [isOnlineUsersModalOpen, setIsOnlineUsersModalOpen] = useState(false);
    const [isEsmFamilModalOpen, setIsEsmFamilModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [esmFamilOpponent, setEsmFamilOpponent] = useState<Customer | 'AI' | null>(null);
    const [esmFamilTimer, setEsmFamilTimer] = useState(30);

    // --- Data Fetching from Mock Data ---
    useEffect(() => {
        setIsLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            try {
                const currentRestaurant = mockRestaurants.find(r => r.id === restaurantId);
                if (!currentRestaurant) {
                    throw new Error('Restaurant not found in mock data.');
                }
                setRestaurant(currentRestaurant);
                setMenuItems(mockMenuItems.filter(i => i.restaurantId === restaurantId));
                setMenuCategories(mockMenuCategories.filter(c => c.restaurantId === restaurantId));
                setCustomers(mockCustomers.filter(c => c.restaurantId === restaurantId));
                setError(null);
            } catch (err) {
                 setError(err instanceof Error ? err.message : 'An unknown error occurred');
                 console.error("Mock data loading error:", err);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms delay
    }, [restaurantId]);


    // --- Real-time Invite Handling ---
    const incomingInvite = useMemo(() => {
        return gameInvites.find(inv => inv.to.id === currentCustomer?.id && inv.status === 'pending');
    }, [gameInvites, currentCustomer]);

    const acceptedInvite = useMemo(() => {
        return gameInvites.find(inv => inv.status === 'accepted' && (inv.from.id === currentCustomer?.id || inv.to.id === currentCustomer?.id));
    }, [gameInvites, currentCustomer]);
    
    useEffect(() => {
        if (acceptedInvite) {
            const opponent = acceptedInvite.from.id === currentCustomer?.id ? acceptedInvite.to : acceptedInvite.from;
            setEsmFamilOpponent(opponent);
            setEsmFamilTimer(acceptedInvite.settings.timer);
            setIsOnlineUsersModalOpen(false);
            setIsGameSelectionModalOpen(false);
            setIsEsmFamilModalOpen(true);
            onRespondToInvite(acceptedInvite, 'accepted'); 
        }
    }, [acceptedInvite, currentCustomer, onRespondToInvite]);
    
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [language]);

    const onlineUsers = useMemo(() => customers.filter(c => c.id !== currentCustomer?.id), [customers, currentCustomer]);

    const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
        setCartItems(prev => {
            const existing = prev.find(cartItem => cartItem.id === item.id);
            if (existing) {
                return prev.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
                );
            }
            return [...prev, { ...item, quantity }];
        });
    };
    
    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
        } else {
            setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        }
    };
    
    const handleRemoveItem = (itemId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSubmitOrder = () => {
        if (!tableNumber) {
            alert(language === 'fa' ? 'لطفا شماره میز را وارد کنید.' : 'Please enter your table number.');
            return;
        }
        setIsCartOpen(false);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        const orderData = {
            tableNumber,
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            restaurantId: restaurantId,
            customerId: currentCustomer?.id || null,
        };
        
        console.log("DEMO: Submitting order", orderData);
        // In a real app, this would be a fetch call.
        // const response = await fetch(`${API_BASE_URL}/orders`, { ... });
        
        setIsPaymentModalOpen(false);
        setCartItems([]);
        setTableNumber('');
    };

    const handleLogin = async (phone: string) => {
        const customer = mockCustomers.find(c => c.phone === phone);
        if (customer) {
            setCurrentCustomer(customer);
            return { success: true };
        }
        return { success: false, message: 'User not found.' };
    };

    const handleRegister = async (name: string, phone: string) => {
         const existing = mockCustomers.find(c => c.phone === phone);
         if (existing) {
            return { success: false, message: 'Phone number already registered.' };
         }
         const newCustomer: Customer = {
             id: phone,
             name,
             phone,
             restaurantId,
             joinDate: new Date().toISOString().split('T')[0],
             gameProgress: { level: 1, totalScore: 0, highScore: 0 },
             orderHistory: [],
         };
         setCustomers(prev => [...prev, newCustomer]);
         setCurrentCustomer(newCustomer);
         return { success: true };
    };
    
    const handleGameEnd = async (finalScore: number) => {
        if (currentCustomer) {
            // DEMO: Update mock data in state
            const updatedCustomer = {
                ...currentCustomer,
                gameProgress: {
                    ...currentCustomer.gameProgress,
                    totalScore: currentCustomer.gameProgress.totalScore + finalScore,
                    highScore: Math.max(currentCustomer.gameProgress.highScore, finalScore),
                }
            };
            // This is a simplified level up logic for the demo
            if (updatedCustomer.gameProgress.totalScore > (updatedCustomer.gameProgress.level * 1000)) {
                updatedCustomer.gameProgress.level += 1;
            }
            
            setCurrentCustomer(updatedCustomer);
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        }
    };

    const handleStartEsmFamilAI = () => {
        setEsmFamilOpponent('AI');
        setEsmFamilTimer(45);
        setIsGameSelectionModalOpen(false);
        setIsEsmFamilModalOpen(true);
    };

    const handleStartEsmFamilHuman = () => {
        setIsGameSelectionModalOpen(false);
        setIsOnlineUsersModalOpen(true);
    };

    if (isLoading) return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-xl">Loading Menu...</div>;
    if (error || !restaurant) return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-red-400 text-xl">Error: {error || 'Restaurant not found'}</div>;

    const backgroundImageUrl = selectedCategory ? selectedCategory.imageUrl : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format=fit=crop';
    const itemsForCategory = menuItems.filter(item => item.categoryId === selectedCategory?.id);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans transition-colors duration-500">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out" style={{ backgroundImage: `url(${backgroundImageUrl})`, filter: 'blur(8px) brightness(0.7)', transform: 'scale(1.05)' }} />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header 
                    restaurant={restaurant} 
                    language={language} 
                    setLanguage={setLanguage} 
                    onCartClick={() => setIsCartOpen(true)} 
                    cartItemCount={cartItemCount} 
                    isGameActive={restaurant.isGameActive}
                    onGameZoneClick={() => setIsGameSelectionModalOpen(true)}
                    onlineUserCount={onlineUsers.length}
                    onOnlineUsersClick={() => setIsOnlineUsersModalOpen(true)}
                    onAuthClick={() => setIsAuthModalOpen(true)}
                    currentCustomer={currentCustomer}
                    onNavigate={onNavigate}
                />
                
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    {selectedCategory ? (
                        <div>
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                                <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-white hover:text-gray-300 font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    {t('backToCategories', language)}
                                </button>
                                <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full">
                                    <button onClick={() => setViewMode('immersive')} className={`px-4 py-1.5 text-sm rounded-full ${viewMode === 'immersive' ? 'bg-white text-black' : ''}`}>{t('immersive', language)}</button>
                                    <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 text-sm rounded-full ${viewMode === 'grid' ? 'bg-white text-black' : ''}`}>{t('grid', language)}</button>
                                </div>
                            </div>
                            <ImmersiveView items={itemsForCategory} language={language} onAddToCart={(item) => handleAddToCart(item)} viewMode={viewMode} onItemClick={setSelectedItem}/>
                        </div>
                    ) : (
                        <CategoryView categories={menuCategories} language={language} onCategoryClick={setSelectedCategory} />
                    )}
                </main>
                
                <footer className="py-6 text-center text-gray-400 text-sm">
                    <button onClick={() => setIsLeaderboardModalOpen(true)} className="hover:text-white transition-colors mx-2">{t('leaderboard', language)}</button>
                     | 
                    <button onClick={() => setIsReservationModalOpen(true)} className="hover:text-white transition-colors mx-2">{t('reserveTable', language)}</button>
                </footer>
            </div>
            
            <ItemDetailModal item={selectedItem} language={language} onClose={() => setSelectedItem(null)} onAddToCart={handleAddToCart} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} language={language} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} tableNumber={tableNumber} setTableNumber={setTableNumber} onSubmitOrder={handleSubmitOrder} />
            <OrderPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} cartItems={cartItems} tableNumber={tableNumber} onConfirmPayment={handlePaymentSuccess} language={language} />
            <ReservationModal isOpen={isReservationModalOpen} onClose={() => setIsReservationModalOpen(false)} onSubmit={(reservation: Omit<Reservation, 'id' | 'restaurantId'>) => { alert('Reservation submitted!'); setIsReservationModalOpen(false); }} language={language} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onRegister={handleRegister} language={language} />
            <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={() => setIsLeaderboardModalOpen(false)} language={language} customers={customers} currentCustomerId={currentCustomer?.id || null} />

            {/* --- Game Modals --- */}
            <GameSelectionModal
                isOpen={isGameSelectionModalOpen}
                onClose={() => setIsGameSelectionModalOpen(false)}
                language={language}
                onSelectBlinkBites={() => { setIsGameSelectionModalOpen(false); setIsBlinkBitesModalOpen(true); }}
                onSelectEsmFamilAI={handleStartEsmFamilAI}
                onSelectEsmFamilHuman={handleStartEsmFamilHuman}
            />
             <OnlineUsersModal
                isOpen={isOnlineUsersModalOpen}
                onClose={() => setIsOnlineUsersModalOpen(false)}
                language={language}
                onlineUsers={onlineUsers}
                onChallenge={(user, timer) => currentCustomer && onSendInvite(currentCustomer, user, { timer })}
                currentCustomer={currentCustomer}
            />
            {incomingInvite && <InvitationModal
                invite={incomingInvite}
                onAccept={() => onRespondToInvite(incomingInvite, 'accepted')}
                onDecline={() => onRespondToInvite(incomingInvite, 'declined')}
                language={language}
            />}
            <GameModal isOpen={isBlinkBitesModalOpen} onClose={() => setIsBlinkBitesModalOpen(false)} language={language} onGameEnd={handleGameEnd} currentLevel={currentCustomer?.gameProgress.level || 1} />
            {isEsmFamilModalOpen && esmFamilOpponent && currentCustomer && (
                <EsmFamilGameModal
                    isOpen={isEsmFamilModalOpen}
                    onClose={() => setIsEsmFamilModalOpen(false)}
                    language={language}
                    currentUser={currentCustomer}
                    opponent={esmFamilOpponent}
                    timerDuration={esmFamilTimer}
                    onGameEnd={handleGameEnd}
                />
            )}
        </div>
    );
};

export default Menu;
