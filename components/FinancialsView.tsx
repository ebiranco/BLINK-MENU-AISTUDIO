import React, { useState, useEffect } from 'react';
import { Language, Transaction, GatewaySettings } from '../types';
import { t, formatCurrency } from '../utils/translations';

interface FinancialsViewProps {
  language: Language;
  transactions: Transaction[];
}

const FinancialsView: React.FC<FinancialsViewProps> = ({ language, transactions }) => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'settings'>('transactions');
    const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>({ apiKey: '', secretKey: '' });

    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('blink-gateway-settings');
            if (savedSettings) {
                setGatewaySettings(JSON.parse(savedSettings));
            }
        } catch (e) {
            console.error("Failed to load gateway settings", e);
        }
    }, []);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGatewaySettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('blink-gateway-settings', JSON.stringify(gatewaySettings));
        alert(language === 'fa' ? 'تنظیمات با موفقیت ذخیره شد.' : 'Settings saved successfully.');
    };

    const GatewaySettingsView = () => (
        <div className="bg-white/80 backdrop-blur-md border border-white/20 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('gatewaySettings', language)}</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">{t('apiKey', language)}</label>
                    <input
                        type="text"
                        id="apiKey"
                        name="apiKey"
                        value={gatewaySettings.apiKey}
                        onChange={handleSettingsChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">{t('secretKey', language)}</label>
                    <input
                        type="password"
                        id="secretKey"
                        name="secretKey"
                        value={gatewaySettings.secretKey}
                        onChange={handleSettingsChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="text-right">
                    <button type="submit" className="btn-animated-gradient bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90">
                        {t('saveSettings', language)}
                    </button>
                </div>
            </form>
        </div>
    );
    
    const TransactionsView = () => (
        <div className="bg-white/80 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 px-2 text-gray-800">{t('transactions', language)}</h3>
            {transactions.length === 0 ? <p className="px-2 text-gray-700">{t('noTransactions', language)}</p> : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-gray-400/30">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('orderId', language)}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('amount', language)}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('date', language)}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{t('status', language)}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-400/20">
                            {transactions.map((tx, index) => (
                                <tr key={tx.orderId} className={index % 2 === 0 ? 'bg-black/0' : 'bg-black/5'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(tx.amount, language)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.date.toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            )}
        </div>
    );

    return (
        <>
            <div>
                 <h2 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{t('financials', language)}</h2>
                 <p className="text-gray-200 mb-6">Review transactions and manage payment gateway settings.</p>
            </div>
            <div className="border-b border-white/20 mb-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('transactions')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactions' ? 'border-purple-400 text-white' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'}`}>
                        {t('transactions', language)}
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-purple-400 text-white' : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'}`}>
                        {t('gatewaySettings', language)}
                    </button>
                </nav>
            </div>
            {activeTab === 'transactions' ? <TransactionsView /> : <GatewaySettingsView />}
        </>
    );
};

export default FinancialsView;