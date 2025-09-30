import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PlatformLogin from './components/PlatformLogin';
import PlatformAdminDashboard from './components/PlatformAdminDashboard';
import { menuItems as initialMenuItems, menuCategories as initialMenuCategories } from './data/menuData';
import { initialRestaurants, initialPlatformAdmins } from './data/platformData';
import { initialCustomers } from './data/customerData';
import { MenuItem, MenuCategory, Order, Restaurant, User, PlatformAdmin, Customer, Transaction, OrderStatus } from './types';

export type NavigateFunction = (path: string) => void;

const App: React.FC = () => {
    const [path, setPath] = useState(window.location.hash.substring(2)); // remove #/
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(initialMenuCategories);
    const [orders, setOrders] = useState<Order[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [platformAdmins, setPlatformAdmins] = useState<PlatformAdmin[]>(initialPlatformAdmins);
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [adminUser, setAdminUser] = useState<PlatformAdmin | null>(null);

    const navigate: NavigateFunction = (newPath) => {
        window.location.hash = `/${newPath}`;
        setPath(newPath);
    };

    useEffect(() => {
        const handleHashChange = () => {
            setPath(window.location.hash.substring(2));
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const handleLogin = (restaurantId: string = 'blink-restaurant') => {
        setUser({ id: 'owner-001', name: 'Restaurant Owner', restaurantId });
        navigate('dashboard');
    }
    
    const handleLogout = () => {
        setUser(null);
        navigate('');
    }
    
    const handlePlatformLogin = (email: string) => {
        const admin = platformAdmins.find(a => a.email === email);
        if (admin) {
            setAdminUser(admin);
            navigate('platform-dashboard');
        } else {
            alert('Invalid admin credentials.');
        }
    }
    
    const handlePlatformLogout = () => {
        setAdminUser(null);
        navigate('platform-login');
    }

    const currentRestaurant = restaurants.find(r => r.id === (user?.restaurantId || 'blink-restaurant')) || restaurants[0];

    const renderPage = () => {
        const [page, param] = path.split('/');
        
        switch (page) {
            case 'menu':
                const restaurantId = param || 'blink-restaurant';
                const restaurant = restaurants.find(r => r.id === restaurantId);
                if (!restaurant) return <div>Restaurant not found</div>;
                return <Menu 
                    restaurant={restaurant}
                    menuItems={menuItems.filter(i => i.restaurantId === restaurantId)}
                    menuCategories={menuCategories.filter(c => c.restaurantId === restaurantId)}
                    customers={customers.filter(c => c.restaurantId === restaurantId)}
                    setCustomers={setCustomers}
                />;
            case 'dashboard':
                if (!user) {
                     navigate('');
                     return null;
                }
                return <Dashboard 
                    user={user}
                    currentRestaurant={currentRestaurant}
                    menuItems={menuItems.filter(i => i.restaurantId === currentRestaurant.id)}
                    menuCategories={menuCategories.filter(c => c.restaurantId === currentRestaurant.id)}
                    orders={orders.filter(o => o.restaurantId === currentRestaurant.id)}
                    transactions={transactions.filter(t => t.restaurantId === currentRestaurant.id)}
                    customers={customers.filter(c => c.restaurantId === currentRestaurant.id)}
                    setMenuItems={setMenuItems}
                    setMenuCategories={setMenuCategories}
                    onUpdateOrderStatus={(orderId: string, newStatus: OrderStatus) => {
                        setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o))
                    }}
                    onPurchaseCredits={(restaurantId: string, amount: number) => {
                        setRestaurants(prev => prev.map(r => r.id === restaurantId ? {...r, credits: r.credits + amount} : r))
                    }}
                    onToggleFeature={(restaurantId: string, feature: 'game' | 'customerClub', cost: number) => {
                        setRestaurants(prev => prev.map(r => {
                            if (r.id === restaurantId) {
                                if (feature === 'game') return {...r, isGameActive: true, credits: r.credits - cost};
                                if (feature === 'customerClub') return {...r, isCustomerClubActive: true, credits: r.credits - cost};
                            }
                            return r;
                        }))
                    }}
                    onNavigate={navigate}
                    onLogout={handleLogout}
                />;
            case 'platform-login':
                return <PlatformLogin onLogin={handlePlatformLogin} />;
            case 'platform-dashboard':
                 if (!adminUser) {
                     navigate('platform-login');
                     return null;
                }
                return <PlatformAdminDashboard 
                    adminUser={adminUser}
                    restaurants={restaurants}
                    setRestaurants={setRestaurants}
                    admins={platformAdmins}
                    setAdmins={setPlatformAdmins}
                    allOrders={orders}
                    allTransactions={transactions}
                    onLogout={handlePlatformLogout}
                />;
            default:
                return <LandingPage onNavigate={navigate} onLogin={handleLogin} />;
        }
    };

    return <div>{renderPage()}</div>;
};

export default App;
