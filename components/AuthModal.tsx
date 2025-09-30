import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (phone: string) => { success: boolean, message?: string };
    onRegister: (name: string, phone: string) => { success: boolean, message?: string };
    language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, language }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;
        if (activeTab === 'login') {
            result = onLogin(phone);
        } else {
            if (!name) {
                setError("Name is required.");
                return;
            }
            result = onRegister(name, phone);
        }

        if (result.success) {
            onClose();
            setName('');
            setPhone('');
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };
    
    const handleClose = () => {
        setName('');
        setPhone('');
        setError('');
        onClose();
    }

    if (!isOpen) return null;
    const isRtl = language === 'fa';

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-sm w-full m-4 text-gray-800"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div className="flex border-b">
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`w-1/2 p-4 font-bold text-center transition-colors ${activeTab === 'login' ? 'bg-gray-100 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {t('login', language)}
                </button>
                <button 
                    onClick={() => setActiveTab('register')}
                    className={`w-1/2 p-4 font-bold text-center transition-colors ${activeTab === 'register' ? 'bg-gray-100 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {t('register', language)}
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                     {activeTab === 'register' && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('yourName', language)}</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                     )}
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phoneNumber', language)}</label>
                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="09123456789" required />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="p-4 bg-gray-50">
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                        {activeTab === 'login' ? t('login', language) : t('register', language)}
                    </button>
                </div>
            </form>
          </div>
        </div>
    );
};

export default AuthModal;
