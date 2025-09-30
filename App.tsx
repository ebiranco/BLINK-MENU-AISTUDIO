import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PlatformLogin from './components/PlatformLogin';
import PlatformAdminDashboard from './components/PlatformAdminDashboard';
import { PlatformAdmin, GameInvite, NavigateFunction } from './types';

const App: React.FC = () => {
    const [path, setPath] = useState(window.location.hash.substring(2)); // remove #/
    
    // Admin state is still managed here as it's a cross-cutting concern for protected routes.
    // In a larger app, this would be in a context.
    const [adminUser, setAdminUser] = useState<PlatformAdmin | null>(null);
    
    // Game invites are kept in top-level state to simulate real-time notifications across the app.
    // In a real app, this would be managed by WebSockets.
    const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);


    const navigate: NavigateFunction = (newPath) => {
        window.location.hash = `/${newPath}`;
        // By removing setPath here, we make the hashchange listener the single source of truth.
        // This prevents potential race conditions between direct state updates and event-driven updates.
    };

    useEffect(() => {
        const handleHashChange = () => {
            setPath(window.location.hash.substring(2));
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    // This is now for the restaurant owner dashboard login
    const handleLogin = () => {
        // In a real app, this would involve a username/password flow
        // and setting a user object in state. For this demo, we just navigate.
        navigate('dashboard');
    }
    
    const handlePlatformLogin = (email: string) => {
        // This would be an API call in a real app
        if (email === 'admin@blink.com') {
            setAdminUser({ id: 'admin-001', email: 'admin@blink.com', role: 'Super Admin' });
            navigate('platform-dashboard');
        } else {
            alert('Invalid admin credentials.');
        }
    }
    
    const handlePlatformLogout = () => {
        setAdminUser(null);
        navigate('platform-login');
    }

    // --- Simulated Real-time Game Logic ---
    // This logic remains on the frontend to simulate invites.
    const handleSendInvite: (from: any, to: any, settings: any) => void = (from, to, settings) => {
        const newInvite: GameInvite = { from, to, status: 'pending', game: 'EsmFamil', settings };
        setGameInvites(prev => [...prev.filter(inv => !(inv.from.id === from.id && inv.to.id === to.id)), newInvite]);
        console.log("DEMO: Invite sent.", newInvite);
    };

    const handleRespondToInvite = (invite: GameInvite, response: 'accepted' | 'declined' | 'cancelled') => {
        setGameInvites(prev => prev.map(inv => inv.from.id === invite.from.id && inv.to.id === invite.to.id ? { ...inv, status: response } : inv));
        // In a real app with WebSockets, you might not need this timeout cleanup.
        setTimeout(() => {
             setGameInvites(prev => prev.filter(inv => inv.from.id !== invite.from.id || inv.to.id !== invite.to.id));
        }, 5000);
    };
    // --- End Simulated Logic ---


    const renderPage = () => {
        const [page, param] = path.split('/');
        
        switch (page) {
            case 'menu':
                const restaurantId = param || 'blink-restaurant';
                return <Menu 
                    restaurantId={restaurantId}
                    gameInvites={gameInvites}
                    onSendInvite={handleSendInvite}
                    onRespondToInvite={handleRespondToInvite}
                    onNavigate={navigate}
                />;
            case 'dashboard':
                 // This route is now conceptually "protected".
                 // In a real app, we'd check for a valid session/token here.
                 // For the demo, we just assume the default restaurant.
                return <Dashboard 
                    restaurantId={'blink-restaurant'}
                    onNavigate={navigate}
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
                    onLogout={handlePlatformLogout}
                />;
            default:
                return <LandingPage onNavigate={navigate} onLogin={handleLogin} />;
        }
    };

    return <div>{renderPage()}</div>;
};

export default App;