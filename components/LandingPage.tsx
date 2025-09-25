import React from 'react';
import { t } from '../utils/translations';
import { NavigateFunction } from '../App';

// For simplicity, we'll assume a fixed language for the landing page or detect it.
// Here we'll default to Persian ('fa') as requested.
const lang = 'fa';

interface LandingPageProps {
  onNavigate: NavigateFunction;
  onLogin: () => void;
}

const LandingHeader = ({ onNavigate, onLogin }: { onNavigate: NavigateFunction, onLogin: () => void }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4" dir="rtl">
      <div className="container mx-auto flex justify-between items-center text-white">
        <a href="/#" onClick={(e) => { e.preventDefault(); onNavigate(''); }} className="text-2xl font-bold tracking-wider">BLINK</a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="cursor-pointer hover:text-gray-300 transition-colors">{t('features', lang)}</a>
          <a href="#/menu" onClick={(e) => { e.preventDefault(); onNavigate('menu'); }} className="hover:text-gray-300 transition-colors">{t('demo', lang)}</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="text-sm font-semibold hover:text-gray-300 transition-colors">{t('login', lang)}</a>
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="text-sm font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-colors">
            {t('signUp', lang)}
          </a>
        </div>
      </div>
    </header>
  );
};


const LandingFooter = () => (
  <footer className="bg-gray-900 py-8 text-center text-gray-400" dir="rtl">
    <p>&copy; {new Date().getFullYear()} BLINK Digital Menu. تمامی حقوق محفوظ است.</p>
  </footer>
);

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex justify-center items-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLogin }) => {
  return (
    <div className="bg-gray-900 text-white" style={{fontFamily: "'Vazirmatn', sans-serif"}}>
      <LandingHeader onNavigate={onNavigate} onLogin={onLogin} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden" dir="rtl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
                {t('heroTitle', lang)}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300">
                {t('heroSubtitle', lang)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#/menu" onClick={(e) => { e.preventDefault(); onNavigate('menu'); }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-opacity">
                  {t('viewLiveDemo', lang)}
                </a>
                <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white/20 transition-colors">
                  {t('registerRestaurant', lang)}
                </a>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" dir="rtl">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('whyChooseBlink', lang)}</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">{t('whyChooseSubtitle', lang)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              title={t('featureStunningTitle', lang)}
              description={t('featureStunningDesc', lang)}
            />
             <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title={t('featureUpdatesTitle', lang)}
              description={t('featureUpdatesDesc', lang)}
            />
             <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m0 18a9 9 0 00-9-9m9-9H3" /></svg>}
              title={t('featureMultiLangTitle', lang)}
              description={t('featureMultiLangDesc', lang)}
            />
             <FeatureCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
              title={t('featureOrderingTitle', lang)}
              description={t('featureOrderingDesc', lang)}
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-black/20" dir="rtl">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-bold mb-4">{t('seeItInAction', lang)}</h2>
            <p className="text-gray-400 mb-6">{t('seeItInActionDesc', lang)}</p>
            <a href="#/menu" onClick={(e) => { e.preventDefault(); onNavigate('menu'); }} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              {t('tryInteractiveDemo', lang)}
            </a>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=2070&auto=format&fit=crop" alt="Digital Menu on a tablet" className="rounded-xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" dir="rtl">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">{t('readyToGoDigital', lang)}</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('readyToGoDigitalDesc', lang)}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button onClick={onLogin} className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                {t('signUpWithGoogle', lang)}
              </button>
              <span className="text-gray-500">{t('or', lang)}</span>
               <button onClick={onLogin} className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors">
                 {t('signUpWithEmail', lang)}
                </button>
            </div>
        </div>
      </section>
      
      <LandingFooter />
    </div>
  );
};

export default LandingPage;