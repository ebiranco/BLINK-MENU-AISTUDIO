import React, { useState, useEffect } from 'react';
// FIX: The User type should be imported from '../types', not '../App'.
import { NavigateFunction } from '../App';
import { User, Order, MenuItem, MenuCategory, OrderStatus, Language, Transaction, Restaurant, Customer } from '../types';
import { t, formatCurrency } from '../utils/translations';
import MenuItemForm from './MenuItemForm';
import CategoryForm from './CategoryForm';
import AIStudio from './AIStudio';
import FinancialsView from './FinancialsView';
import CreditPurchaseModal from './CreditPurchaseModal';

interface DashboardProps {
    user: User;
    currentRestaurant: Restaurant;
    menuItems: MenuItem[];
    menuCategories: MenuCategory[];
    orders: Order[];
    transactions: Transaction[];
    customers: Customer[];
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    setMenuCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
    onPurchaseCredits: (restaurantId: string, creditAmount: number) => void;
    onToggleFeature: (restaurantId: string, feature: 'game' | 'customerClub', cost: number) => void;
    onNavigate: NavigateFunction;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const {
        user, currentRestaurant, menuItems, menuCategories, orders, transactions, customers, 
        setMenuItems, setMenuCategories, onUpdateOrderStatus, onPurchaseCredits, onToggleFeature,
        onNavigate, onLogout
    } = props;
    
    const [language, setLanguage] = useState<Language>('fa');
    const [activeTab, setActiveTab] = useState<'orders' | 'menuItems' | 'menuCategories' | 'aiStudio' | 'financials' | 'customers' | 'upgrades'>('orders');
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            onNavigate('');
        }
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [user, onNavigate, language]);
    
    const restaurantId = currentRestaurant.id;

    const handleSaveItem = (item: Omit<MenuItem, 'id' | 'restaurantId'>) => {
        if (editingItem) {
            setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...editingItem, ...item } : i));
        } else {
            const newItem: MenuItem = { ...item, id: Date.now(), restaurantId };
            setMenuItems(prev => [...prev, newItem]);
        }
        setIsItemFormOpen(false);
        setEditingItem(null);
    };

    const handleSaveCategory = (category: Omit<MenuCategory, 'id' | 'restaurantId'>) => {
        if (editingCategory) {
            setMenuCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...editingCategory, ...category } : c));
        } else {
             const newCategory: MenuCategory = { 
                 ...category, 
                 id: `${restaurantId}-${category.name.en.toLowerCase().replace(/\s+/g, '-')}`,
                 restaurantId
             };
             setMenuCategories(prev => [...prev, newCategory]);
        }
        setIsCategoryFormOpen(false);
        setEditingCategory(null);
    };

    const handleDeleteItem = (itemId: number) => {
        if (window.confirm(t('confirmDelete', language))) {
            setMenuItems(prev => prev.filter(i => i.id !== itemId));
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (window.confirm(t('confirmDelete', language))) {
            // Also delete items within this category to prevent orphans
            setMenuItems(prev => prev.filter(i => i.categoryId !== categoryId));
            setMenuCategories(prev => prev.filter(c => c.id !== categoryId));
        }
    };

    const handleOpenItemForm = (item: MenuItem | null = null) => {
        setEditingItem(item);
        setIsItemFormOpen(true);
    };

    const handleOpenCategoryForm = (category: MenuCategory | null = null) => {
        setEditingCategory(category);
        setIsCategoryFormOpen(true);
    };
    
    const handleTabClick = (tabName: typeof activeTab) => {
        if (tabName === 'customers' && !currentRestaurant.isCustomerClubActive) {
            alert('Please activate the Customer Club feature from the Upgrades tab.');
            setIsCreditModalOpen(true);
            return;
        }
        setActiveTab(tabName);
    };
    
    const handleActivateFeature = (feature: 'game' | 'customerClub') => {
        const cost = feature === 'game' ? 100 : 50;
        if (currentRestaurant.credits < cost) {
            alert(t('insufficientCredits', language));
            setIsCreditModalOpen(true);
        } else {
            onToggleFeature(restaurantId, feature, cost);
        }
    }


    const NavButton = ({ tabName, icon, label, disabled = false }: { tabName: typeof activeTab, icon: React.ReactElement, label: string, disabled?: boolean }) => (
      <button 
        onClick={() => handleTabClick(tabName)} 
        disabled={disabled}
        className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors w-full ${activeTab === tabName ? 'bg-gray-700' : 'hover:bg-gray-800'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon}
        {label}
        {disabled && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
      </button>
    );

    const SideNav = () => (
        <nav className="w-64 bg-gray-900 text-gray-200 flex flex-col p-4 space-y-2 flex-shrink-0 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">B</span>
                </div>
                <h1 className="text-xl font-bold text-white">{currentRestaurant.name}</h1>
            </div>
            
             <div className="p-3 bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-gray-400">{t('yourCredits', language)}</p>
                <p className="text-2xl font-bold text-yellow-400">{currentRestaurant.credits}</p>
                <button onClick={() => setIsCreditModalOpen(true)} className="mt-2 text-sm w-full bg-yellow-500 text-black font-semibold py-1 px-3 rounded-md hover:bg-yellow-400 transition-colors">
                    {t('buyCredits', language)}
                </button>
            </div>
            
            <NavButton tabName="orders" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>} label={t('orders', language)} />
            <NavButton tabName="customers" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 4a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5zm2 5a3 3 0 116 0 3 3 0 01-6 0zm3-4a5 5 0 005 5v1h-4v-1a5 5 0 00-1-4z" /></svg>} label={t('customerClub', language)} disabled={!currentRestaurant.isCustomerClubActive}/>
            <NavButton tabName="menuItems" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7zm0 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" /></svg>} label={t('items', language)} />
            <NavButton tabName="menuCategories" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>} label={t('categories', language)} />
            <NavButton tabName="aiStudio" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>} label={t('blinkCreativeHub', language)} />
            <NavButton tabName="financials" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} label={t('financials', language)} />
            <NavButton tabName="upgrades" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h1V6a1 1 0 112 0v3h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6a1 1 0 01-1-1z" /><path d="M10 4a6 6 0 100 12 6 6 0 000-12zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" /></svg>} label={t('upgrades', language)} />

            <div className="flex-grow"></div>
             <button onClick={onLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-left w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                {t('logout', language)}
            </button>
        </nav>
    );

    const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 p-4 rounded-lg shadow-md mb-3 transform transition-transform hover:scale-[1.02] hover:shadow-xl">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600">{t('table', language)}: <span className="font-semibold text-gray-800">{order.tableNumber}</span></p>
                </div>
                <p className="font-bold text-gray-900">{formatCurrency(order.total, language)}</p>
            </div>
            <ul className="text-sm text-gray-700 my-3 pl-4 list-disc space-y-1">
              {order.items.map(item => <li key={item.id}>{item.quantity}x {item.name[language]}</li>)}
            </ul>
             <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200/50">
                <span className="text-xs text-gray-500">{order.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <select 
                    value={order.status} 
                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="p-1 border rounded-md text-xs bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <option value="New">{t('new', language)}</option>
                    <option value="In Progress">{t('inprogress', language)}</option>
                    <option value="Completed">{t('completed', language)}</option>
                </select>
            </div>
        </div>
    );

    const OrderKanbanView = () => (
        <>
            <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('orders', language)}</h2>
            <p className="text-gray-200 mb-6">Track and manage incoming orders in real-time.</p>
             {orders.length === 0 ? <p className="text-white/80">{t('noOrders', language)}</p> :
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['New', 'In Progress', 'Completed'] as OrderStatus[]).map(status => (
                        <div key={status} className="bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
                            <h3 className="font-bold text-lg mb-4 text-white text-center pb-2 border-b border-white/20" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.3)'}}>{t(status.toLowerCase().replace(' ','') as any, language)}</h3>
                            <div className="space-y-3 h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                {orders.filter(o => o.status === status).map(order => <OrderCard key={order.id} order={order} />)}
                            </div>
                        </div>
                    ))}
                </div>
             }
        </>
    );
    
    const MenuItemsView = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('items', language)}</h2>
                    <p className="text-gray-200">Manage all food and drink items on your menu.</p>
                </div>
                <button onClick={() => handleOpenItemForm()} className="btn-animated-border bg-gray-800 text-white font-bold py-2 px-5 rounded-lg">
                    {t('addNewItem', language)}
                </button>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-gray-400/30">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">Image</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">Name</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">Category</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">Price</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-400/20 hover:bg-black/5 transition-colors">
                                    <td className="p-2"><img src={item.imageUrl} alt={item.name[language]} className="w-16 h-12 object-cover rounded-md"/></td>
                                    <td className="p-2 font-semibold text-gray-900">{item.name[language]}</td>
                                    <td className="p-2 text-gray-700">{menuCategories.find(c => c.id === item.categoryId)?.name[language]}</td>
                                    <td className="p-2 text-gray-700">{formatCurrency(item.price, language)}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleOpenItemForm(item)} className="text-blue-600 hover:text-blue-800 font-semibold mr-4">{t('edit', language)}</button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 font-semibold">{t('delete', language)}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const MenuCategoriesView = () => (
         <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('categories', language)}</h2>
                    <p className="text-gray-200">Organize your menu items into categories.</p>
                </div>
                <button onClick={() => handleOpenCategoryForm()} className="btn-animated-border bg-gray-800 text-white font-bold py-2 px-5 rounded-lg">
                    {t('addNewCategory', language)}
                </button>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg">
                 {menuCategories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-3 border-b border-gray-400/20 last:border-b-0">
                        <span className="font-semibold text-gray-900 text-lg">{cat.name[language]}</span>
                         <div>
                            <button onClick={() => handleOpenCategoryForm(cat)} className="text-blue-600 hover:text-blue-800 font-semibold mr-4">{t('edit', language)}</button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 font-semibold">{t('delete', language)}</button>
                        </div>
                    </div>
                 ))}
            </div>
        </>
    );
    
    const CustomersView = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('customerClub', language)}</h2>
                    <p className="text-gray-200">View registered customers and their activity.</p>
                </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-gray-400/30">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('name', language)}</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('phoneNumber', language)}</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('joinDate', language)}</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('totalOrders', language)}</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('totalScore', language)}</th>
                                <th className="p-3 text-left text-sm font-semibold text-gray-800 uppercase">{t('highScore', language)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-400/20 hover:bg-black/5 transition-colors">
                                    <td className="p-2 font-semibold text-gray-900">{customer.name}</td>
                                    <td className="p-2 text-gray-700">{customer.phone}</td>
                                    <td className="p-2 text-gray-700">{customer.joinDate}</td>
                                    <td className="p-2 text-gray-700">{customer.orderHistory.length}</td>
                                    <td className="p-2 text-gray-700">{customer.gameProgress.totalScore}</td>
                                    <td className="p-2 text-gray-700">{customer.gameProgress.highScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const UpgradesView = () => (
         <>
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('upgradeFeatures', language)}</h2>
                <p className="text-gray-200">{t('upgradeFeaturesDesc', language)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Club Card */}
                <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{t('customerClub', language)}</h3>
                        <p className="text-gray-700 my-2">Unlock a powerful dashboard to see customer data, order history, and game scores.</p>
                        <p className="font-semibold text-gray-800">{t('customerClubCost', language)}</p>
                    </div>
                    <button 
                        onClick={() => handleActivateFeature('customerClub')}
                        disabled={currentRestaurant.isCustomerClubActive}
                        className={`mt-4 w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                            currentRestaurant.isCustomerClubActive 
                                ? 'bg-green-200 text-green-800 cursor-default' 
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                        {currentRestaurant.isCustomerClubActive ? t('active', language) : t('activate', language)}
                    </button>
                </div>
                {/* Game Card */}
                <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                     <div>
                        <h3 className="text-2xl font-bold text-gray-900">{t('playGame', language)}</h3>
                        <p className="text-gray-700 my-2">Add a fun game to your menu to keep customers engaged while they wait for their order.</p>
                        <p className="font-semibold text-gray-800">{t('gameCost', language)}</p>
                    </div>
                    <button 
                        onClick={() => handleActivateFeature('game')}
                        disabled={currentRestaurant.isGameActive}
                        className={`mt-4 w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                            currentRestaurant.isGameActive 
                                ? 'bg-green-200 text-green-800 cursor-default' 
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                       {currentRestaurant.isGameActive ? t('active', language) : t('activate', language)}
                    </button>
                </div>
            </div>
         </>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'orders': return <OrderKanbanView />;
            case 'customers': return <CustomersView />;
            case 'menuItems': return <MenuItemsView />;
            case 'menuCategories': return <MenuCategoriesView />;
            case 'aiStudio': return <AIStudio language={language} />;
            case 'financials': return <FinancialsView language={language} transactions={transactions} />;
            case 'upgrades': return <UpgradesView />;
            default: return <OrderKanbanView />;
        }
    }


    return (
        <div className="flex h-screen bg-gray-900" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <SideNav />
            <main className="flex-1 relative overflow-y-auto">
                 <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1490818387583-1b48b9093c2b?q=80&w=2070&auto=format=fit=crop')`,
                      filter: 'blur(6px)',
                      transform: 'scale(1.05)'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 -z-10" />

                <div className="p-8">
                  <div className="flex justify-end mb-4">
                       <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex items-center text-sm border border-white/20">
                         <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full transition-colors text-white ${language === 'en' ? 'bg-white/20' : ''}`}>EN</button>
                         <button onClick={() => setLanguage('fa')} className={`px-3 py-1 rounded-full transition-colors text-white ${language === 'fa' ? 'bg-white/20' : ''}`}>FA</button>
                      </div>
                  </div>
                  {renderActiveTab()}
                </div>
            </main>

            {isItemFormOpen && <MenuItemForm item={editingItem} restaurantId={restaurantId} onClose={() => setIsItemFormOpen(false)} onSave={handleSaveItem} categories={menuCategories} language={language} />}
            {isCategoryFormOpen && <CategoryForm category={editingCategory} restaurantId={restaurantId} onClose={() => setIsCategoryFormOpen(false)} onSave={handleSaveCategory} language={language}/>}
            {isCreditModalOpen && <CreditPurchaseModal 
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
                onPurchase={(amount) => onPurchaseCredits(restaurantId, amount)}
                language={language}
            />}
        </div>
    );
};

export default Dashboard;