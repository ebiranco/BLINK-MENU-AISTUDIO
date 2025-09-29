import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import { menuItems as initialMenuItems, menuCategories as initialMenuCategories } from './data/menuData';
import { MenuItem, MenuCategory, CartItem, Order, OrderStatus, Reservation, Transaction } from './types';

export type NavigateFunction = (path: 'menu' | 'dashboard' | '') => void;
export type User = { name: string } | null;

function App() {
  const getRouteFromHash = () => {
    return window.location.hash.startsWith('#/') ? window.location.hash.substring(2) : '';
  };
  
  const [route, setRoute] = useState(getRouteFromHash());
  const [user, setUser] = useState<User>(null);
  
  // Lift state up to be managed here
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(initialMenuCategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash());
      window.scrollTo(0, 0); // Scroll to top on page change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate: NavigateFunction = (path) => {
    window.location.hash = path ? `/${path}` : '';
  };

  const handleLogin = () => {
    // Simulate a successful Google Sign-In
    setUser({ name: 'کاربر مهمان' });
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('');
  };

  const handlePlaceOrder = (orderItems: CartItem[], tableNumber: string, total: number) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      tableNumber,
      items: orderItems,
      total,
      status: 'New',
      timestamp: new Date(),
      isPaid: true
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    const newTransaction: Transaction = {
      orderId: newOrder.id,
      amount: total,
      date: new Date(),
      status: 'Paid'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  
  const handleAddReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation = { ...reservation, id: `RES-${Date.now()}`};
    setReservations(prev => [newReservation, ...prev]);
  };


  // Simple hash-based routing
  switch (route) {
    case 'menu':
      return <Menu 
                menuItems={menuItems} 
                menuCategories={menuCategories} 
                onNavigate={navigate}
                onPlaceOrder={handlePlaceOrder}
                onAddReservation={handleAddReservation}
             />;
    case 'dashboard':
      return <Dashboard 
                user={user}
                menuItems={menuItems} 
                menuCategories={menuCategories} 
                orders={orders}
                transactions={transactions}
                setMenuItems={setMenuItems} 
                setMenuCategories={setMenuCategories}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onNavigate={navigate} 
                onLogout={handleLogout}
             />;
    default:
      return <LandingPage onNavigate={navigate} onLogin={handleLogin} />;
  }
}

export default App;