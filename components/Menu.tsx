import React, { useState, useEffect, useMemo } from 'react';
import { Language, MenuCategory, MenuItem, CartItem, Reservation } from '../types';
import Header from './Header';
import CategoryView from './CategoryView';
import ItemDetailModal from './ItemDetailModal';
import CartModal from './CartModal';
import ImmersiveView from './ImmersiveView';
import ReservationModal from './ReservationModal';
import OrderPaymentModal from './OrderPaymentModal';
import { t } from '../utils/translations';
import { NavigateFunction } from '../App';

type ViewMode = 'immersive' | 'grid';

interface MenuProps {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  onNavigate: NavigateFunction;
  onPlaceOrder: (items: CartItem[], tableNumber: string, total: number) => void;
  onAddReservation: (reservation: Omit<Reservation, 'id'>) => void;
}

function Menu({ menuItems, menuCategories, onNavigate, onPlaceOrder, onAddReservation }: MenuProps) {
  const [language, setLanguage] = useState<Language>('fa');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('immersive');
  const [tableNumber, setTableNumber] = useState('');
  const [isCartAnimating, setIsCartAnimating] = useState(false);


  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (selectedCategory) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity }];
    });
    
    // Trigger cart icon animation
    if (!isCartAnimating) {
        setIsCartAnimating(true);
        setTimeout(() => setIsCartAnimating(false), 500); // Duration of the animation
    }
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems(cartItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };
  
  const handleProceedToPayment = () => {
    if(!tableNumber.trim()) {
        alert(language === 'fa' ? 'لطفاً شماره میز خود را وارد کنید.' : 'Please enter your table number.');
        return;
    }
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };
  
  const handleConfirmPayment = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    onPlaceOrder(cartItems, tableNumber, total);
    // State is reset inside the payment modal after success message
  };
  
  const handleReservationSubmit = (reservation: Omit<Reservation, 'id'>) => {
    onAddReservation(reservation);
    setIsReservationOpen(false);
    alert(t('reservationSuccess', language));
  };

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const itemsForSelectedCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return menuItems.filter(item => item.categoryId === selectedCategory.id);
  }, [selectedCategory, menuItems]);

  return (
    <div className={`min-h-screen bg-transparent text-white ${language === 'fa' ? 'font-vazirmatn' : 'font-poppins'}`}>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 -z-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto-format=fit=crop')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="fixed inset-0 bg-black/60 -z-10" />

      <Header
        language={language}
        setLanguage={setLanguage}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        showBackButton={!!selectedCategory}
        onBack={handleBackToCategories}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isCartAnimating={isCartAnimating}
        onNavigateHome={() => onNavigate('')}
        onReserveClick={() => setIsReservationOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <CategoryView
            categories={menuCategories}
            language={language}
            onCategoryClick={handleCategoryClick}
          />
        ) : (
          <ImmersiveView 
            items={itemsForSelectedCategory}
            language={language}
            onAddToCart={handleAddToCart}
            viewMode={viewMode}
            onItemClick={handleItemClick} // for grid view
          />
        )}
      </main>
      
      {viewMode === 'grid' && (
        <ItemDetailModal
          item={selectedItem}
          language={language}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        language={language}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        onSubmitOrder={handleProceedToPayment}
      />
      
      <ReservationModal 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onSubmit={handleReservationSubmit}
        language={language}
      />

      <OrderPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartItems={cartItems}
        tableNumber={tableNumber}
        onConfirmPayment={handleConfirmPayment}
        language={language}
        onSuccess={() => {
            setCartItems([]);
            setTableNumber('');
            setIsPaymentOpen(false);
        }}
      />
    </div>
  );
}

export default Menu;