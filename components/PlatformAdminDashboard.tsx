import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PlatformAdmin, Restaurant, Order, Transaction } from '../types';
import { formatCurrency } from '../utils/translations';

const API_BASE_URL = '/api';

interface PlatformAdminDashboardProps {
    adminUser: PlatformAdmin;
    onLogout: () => void;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg flex items-center gap-4">
        <div className="bg-gray-700 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const PlatformAdminDashboard: React.FC<PlatformAdminDashboardProps> = ({ adminUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'admins'>('overview');
    
    // Data states fetched from backend
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Assuming an endpoint exists
    const [admins, setAdmins] = useState<PlatformAdmin[]>([]); // Assuming an endpoint exists
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch all necessary data for the admin panel
            const [resRestaurants, resOrders] = await Promise.all([
                fetch(`${API_BASE_URL}/restaurants`),
                fetch(`${API_BASE_URL}/orders`),
                // Add fetches for admins and transactions if endpoints exist
            ]);
            if (!resRestaurants.ok || !resOrders.ok) throw new Error('Failed to fetch admin data');

            setRestaurants(await resRestaurants.json());
            setAllOrders(await resOrders.json());
            // setAllTransactions(...)
            setAdmins([{ id: 'admin-001', email: 'admin@blink.com', role: 'Super Admin' }]); // Mock admin data
            
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalRevenue = useMemo(() => allTransactions.reduce((sum, tx) => sum + tx.amount, 0), [allTransactions]);
    const activeRestaurants = useMemo(() => restaurants.filter(r => r.status === 'active').length, [restaurants]);

    const handleRestaurantStatusChange = (id: string, newStatus: 'active' | 'inactive') => {
        // This should be an API call in a real app
        setRestaurants(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const TabButton: React.FC<{ tabName: typeof activeTab, children: React.ReactNode }> = ({ tabName, children }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading data...</div>;

        switch (activeTab) {
            case 'overview':
                return (
                    <div>
                         <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Revenue" value={formatCurrency(totalRevenue, 'fa')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                            <StatCard title="Total Orders" value={allOrders.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                            <StatCard title="Total Restaurants" value={restaurants.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                            <StatCard title="Active Restaurants" value={`${activeRestaurants} / ${restaurants.length}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>} />
                         </div>
                    </div>
                );
            case 'restaurants':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Manage Restaurants</h2>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Join Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {restaurants.map(r => (
                                        <tr key={r.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{r.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{r.owner}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(r.joinDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleRestaurantStatusChange(r.id, r.status === 'active' ? 'inactive' : 'active')} className="text-purple-400 hover:text-purple-300">
                                                    {r.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'admins':
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Platform Administrators</h2>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {admins.map(a => (
                                        <tr key={a.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{a.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{a.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-poppins">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">BLINK - Platform Admin</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">Welcome, {adminUser.email}</span>
                        <button onClick={onLogout} className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <nav className="flex items-center gap-2">
                        <TabButton tabName="overview">Overview</TabButton>
                        <TabButton tabName="restaurants">Restaurants</TabButton>
                        <TabButton tabName="admins">Admins</TabButton>
                    </nav>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default PlatformAdminDashboard;
