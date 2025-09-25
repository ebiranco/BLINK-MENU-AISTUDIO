import React, { useState, useEffect } from 'react';
import { User, NavigateFunction } from '../App';
import { Order, MenuItem, MenuCategory, OrderStatus, Language } from '../types';
import { t, formatCurrency } from '../utils/translations';
import MenuItemForm from './MenuItemForm';
import CategoryForm from './CategoryForm';
import AIStudio from './AIStudio';

interface DashboardProps {
    user: User;
    menuItems: MenuItem[];
    menuCategories: MenuCategory[];
    orders: Order[];
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    setMenuCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
    onNavigate: NavigateFunction;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    user, menuItems, menuCategories, orders, setMenuItems, setMenuCategories, onUpdateOrderStatus, onNavigate, onLogout
}) => {
    const [language, setLanguage] = useState<Language>('fa');
    const [activeTab, setActiveTab] = useState<'orders' | 'menuItems' | 'menuCategories'>('orders');
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);


    useEffect(() => {
        if (!user) {
            onNavigate('');
        }
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [user, onNavigate, language]);

    const handleSaveItem = (item: MenuItem) => {
        if (editingItem) {
            setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
        } else {
            // Create a new item
            const newItem = { ...item, id: Date.now() };
            setMenuItems(prev => [...prev, newItem]);
        }
        setIsItemFormOpen(false);
        setEditingItem(null);
    };

    const handleSaveCategory = (category: MenuCategory) => {
        if (editingCategory) {
            setMenuCategories(prev => prev.map(c => c.id === category.id ? category : c));
        } else {
             // Create a new category
             const newCategory = { ...category, id: category.name.en.toLowerCase().replace(/\s+/g, '-') };
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
            // Also delete items in this category
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

    const SideNav = () => (
        <nav className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-2 flex-shrink-0">
            <h1 className="text-2xl font-bold mb-6">{t('restaurantName', language)}</h1>
            <button onClick={() => setActiveTab('orders')} className={`p-3 rounded-lg text-left ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>{t('orders', language)}</button>
            <button onClick={() => setActiveTab('menuItems')} className={`p-3 rounded-lg text-left ${activeTab === 'menuItems' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>{t('items', language)}</button>
            <button onClick={() => setActiveTab('menuCategories')} className={`p-3 rounded-lg text-left ${activeTab === 'menuCategories' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>{t('categories', language)}</button>
            <button onClick={() => setIsAiStudioOpen(true)} className={`p-3 rounded-lg text-left hover:bg-gray-700`}>{t('aiStudio', language)}</button>
            <div className="flex-grow"></div>
            <button onClick={onLogout} className="p-3 rounded-lg hover:bg-gray-700 text-left">{t('logout', language)}</button>
        </nav>
    );

    const OrderView = () => (
        <div>
            <h2 className="text-3xl font-bold mb-6">{t('orders', language)}</h2>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">{t('orderId', language)}: {order.id}</p>
                                    <p>{t('table', language)}: {order.tableNumber}</p>
                                    <p>{t('time', language)}: {order.timestamp.toLocaleTimeString()}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-xl">{formatCurrency(order.total, language)}</p>
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                        className="mt-2 p-2 border rounded-md"
                                    >
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p>{t('noOrders', language)}</p>}
        </div>
    );
    
    const MenuItemsView = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{t('items', language)}</h2>
                <button onClick={() => handleOpenItemForm()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{t('addNewItem', language)}</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                {menuItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border-b">
                        <img src={item.imageUrl} alt={item.name[language]} className="w-12 h-12 object-cover rounded-md mr-4"/>
                        <span className="flex-grow font-semibold">{item.name[language]}</span>
                        <div>
                            <button onClick={() => handleOpenItemForm(item)} className="text-blue-600 hover:underline mr-4">{t('edit', language)}</button>
                            <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:underline">{t('delete', language)}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const MenuCategoriesView = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{t('categories', language)}</h2>
                <button onClick={() => handleOpenCategoryForm()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{t('addNewCategory', language)}</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                 {menuCategories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-2 border-b">
                        <span className="font-semibold">{cat.name[language]}</span>
                         <div>
                            <button onClick={() => handleOpenCategoryForm(cat)} className="text-blue-600 hover:underline mr-4">{t('edit', language)}</button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:underline">{t('delete', language)}</button>
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <SideNav />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-end mb-4">
                     <div className="bg-white rounded-full p-1 flex items-center text-sm border">
                       <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-gray-200' : ''}`}>EN</button>
                       <button onClick={() => setLanguage('fa')} className={`px-3 py-1 rounded-full transition-colors ${language === 'fa' ? 'bg-gray-200' : ''}`}>FA</button>
                    </div>
                </div>

                {activeTab === 'orders' && <OrderView />}
                {activeTab === 'menuItems' && <MenuItemsView />}
                {activeTab === 'menuCategories' && <MenuCategoriesView />}
            </main>

            {isItemFormOpen && <MenuItemForm item={editingItem} onClose={() => setIsItemFormOpen(false)} onSave={handleSaveItem} categories={menuCategories} language={language} />}
            {isCategoryFormOpen && <CategoryForm category={editingCategory} onClose={() => setIsCategoryFormOpen(false)} onSave={handleSaveCategory} language={language}/>}
            {isAiStudioOpen && <AIStudio onClose={() => setIsAiStudioOpen(false)} language={language} onGenerate={() => {}} />}
        </div>
    );
};

export default Dashboard;
