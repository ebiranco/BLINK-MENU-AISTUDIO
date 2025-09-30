import React, { useState, useEffect } from 'react';
import { MenuCategory, MenuItem, Language, CartItem, Restaurant, Customer, Reservation } from '../types';
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
import { t } from '../utils/translations';

interface MenuProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Menu: React.FC<MenuProps> = ({ restaurant, menuItems, menuCategories, customers, setCustomers }) => {
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
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [language]);

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

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setCartItems([]);
        setTableNumber('');
    };

    const handleLogin = (phone: string) => {
        const customer = customers.find(c => c.phone === phone);
        if (customer) {
            setCurrentCustomer(customer);
            return { success: true };
        }
        return { success: false, message: 'User not found.' };
    };

    const handleRegister = (name: string, phone: string) => {
        if (customers.some(c => c.phone === phone)) {
            return { success: false, message: 'Phone number already registered.' };
        }
        const newCustomer: Customer = {
            id: phone, name, phone, joinDate: new Date().toISOString().split('T')[0],
            gameProgress: { level: 1, totalScore: 0, highScore: 0 },
            orderHistory: [],
            restaurantId: restaurant.id,
        };
        setCustomers(prev => [...prev, newCustomer]);
        setCurrentCustomer(newCustomer);
        return { success: true };
    };
    
    const handleGameEnd = (finalScore: number) => {
        if (currentCustomer) {
            const updateUser = (user: Customer) => {
                const newHighScore = Math.max(user.gameProgress.highScore, finalScore);
                const newTotalScore = user.gameProgress.totalScore + finalScore;
                const newLevel = LEVEL_THRESHOLDS.filter(t => newTotalScore >= t).length || 1;
                return {...user, gameProgress: {highScore: newHighScore, totalScore: newTotalScore, level: newLevel }};
            };
            
            setCurrentCustomer(prev => prev ? updateUser(prev) : null);
            setCustomers(prevCustomers => prevCustomers.map(c => c.id === currentCustomer.id ? updateUser(c) : c));
        }
    };

    const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000];

    const backgroundImageUrl = selectedCategory ? selectedCategory.imageUrl : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto-format=fit=crop';
    const itemsForCategory = menuItems.filter(item => item.categoryId === selectedCategory?.id);
    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans transition-colors duration-500">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out" style={{ backgroundImage: `url(${backgroundImageUrl})`, filter: 'blur(8px) brightness(0.7)', transform: 'scale(1.05)' }} />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header restaurant={restaurant} language={language} setLanguage={setLanguage} onCartClick={() => setIsCartOpen(true)} cartItemCount={cartItemCount} />
                
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
                    {restaurant.isGameActive && (
                        <div className="mb-4">
                             {!currentCustomer ? (
                                <button onClick={() => setIsAuthModalOpen(true)} className="btn-glass font-bold py-2 px-6 rounded-full text-lg mx-2">{t('customerClub', language)}</button>
                            ) : (
                                <>
                                <button onClick={() => setIsGameModalOpen(true)} className="btn-glass font-bold py-2 px-6 rounded-full text-lg mx-2">{t('playGame', language)}</button>
                                <button onClick={() => setIsLeaderboardModalOpen(true)} className="btn-glass font-bold py-2 px-6 rounded-full text-lg mx-2">{t('leaderboard', language)}</button>
                                </>
                            )}
                        </div>
                    )}
                    <button onClick={() => setIsReservationModalOpen(true)} className="hover:text-white transition-colors">{t('reserveTable', language)}</button>
                </footer>
            </div>
            
            <ItemDetailModal item={selectedItem} language={language} onClose={() => setSelectedItem(null)} onAddToCart={handleAddToCart} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} language={language} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} tableNumber={tableNumber} setTableNumber={setTableNumber} onSubmitOrder={handleSubmitOrder} />
            <OrderPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} cartItems={cartItems} tableNumber={tableNumber} onConfirmPayment={() => { /* Logic to send order to kitchen */ }} onSuccess={handlePaymentSuccess} language={language} />
            <ReservationModal isOpen={isReservationModalOpen} onClose={() => setIsReservationModalOpen(false)} onSubmit={(reservation: Omit<Reservation, 'id' | 'restaurantId'>) => { alert('Reservation submitted!'); setIsReservationModalOpen(false); }} language={language} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} onRegister={handleRegister} language={language} />
            <GameModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} language={language} onGameEnd={handleGameEnd} currentLevel={currentCustomer?.gameProgress.level || 1} />
            <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={() => setIsLeaderboardModalOpen(false)} language={language} customers={customers} currentCustomerId={currentCustomer?.id || null} />
        </div>
    );
};

export default Menu;
