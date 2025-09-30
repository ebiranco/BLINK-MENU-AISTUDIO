import React, { useState } from 'react';
import { t } from '../utils/translations';

interface PlatformLoginProps {
    onLogin: (email: string) => void;
}

const PlatformLogin: React.FC<PlatformLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@blink.com');
    const [password, setPassword] = useState('password'); // Dummy password

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">{t('platformAdminLogin', 'en')}</h1>
                    <p className="mt-2 text-gray-400">Access the SaaS management dashboard.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('email', 'en')}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">{t('password', 'en')}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                        >
                            {t('login', 'en')}
                        </button>
                    </div>
                </form>
                 <div className="text-center">
                    <a href="/#" className="text-sm text-gray-400 hover:text-gray-200">← Back to main site</a>
                </div>
            </div>
        </div>
    );
};

export default PlatformLogin;