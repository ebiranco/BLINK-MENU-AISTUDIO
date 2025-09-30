import React, { useEffect, useState } from 'react';
import { t } from '../utils/translations';
import { NavigateFunction } from '../types';

// Default language for the landing page is Persian ('fa') as requested.
const lang = 'fa';
declare const anime: any; // Declare anime to avoid TypeScript errors

interface LandingPageProps {
  onNavigate: NavigateFunction;
  onLogin: () => void;
}

const LandingHeader = ({ onNavigate, onLogin }: LandingPageProps) => {
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
        <a href="/#" onClick={(e) => { e.preventDefault(); onNavigate(''); }} className="text-2xl font-bold tracking-wider" style={{color: 'var(--color-secondary)'}}>BLINK</a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="cursor-pointer hover:text-gray-300 transition-colors">{t('features', lang)}</a>
          <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="cursor-pointer hover:text-gray-300 transition-colors">{t('pricing', lang)}</a>
          <a href="#testimonials" onClick={(e) => handleScroll(e, 'testimonials')} className="cursor-pointer hover:text-gray-300 transition-colors">{t('testimonials', lang)}</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="cursor-pointer hover:text-gray-300 transition-colors">{t('faq', lang)}</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="text-sm font-semibold hover:text-gray-300 transition-colors">{t('login', lang)}</a>
          <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="btn-lime text-sm px-5 py-2 rounded-full">
            {t('getStartedNow', lang)}
          </a>
        </div>
      </div>
    </header>
  );
};

const LandingFooter = ({ onNavigate }: { onNavigate: NavigateFunction }) => (
  <footer className="bg-transparent py-8 text-center text-gray-400 border-t border-white/10" dir="rtl">
     <div className="mb-4">
        <a href="#/platform-login" onClick={(e) => { e.preventDefault(); onNavigate('platform-login'); }} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Platform Admin Login</a>
    </div>
    <p>&copy; {new Date().getFullYear()} BLINK Digital Menu. تمامی حقوق محفوظ است.</p>
  </footer>
);

const FeatureCard = ({ image, title, description, isComingSoon = false, className }: { image: string, title: string, description: string, isComingSoon?: boolean, className?: string }) => (
    <div className={`card-glass rounded-xl overflow-hidden text-center relative ${className}`}>
        {isComingSoon && <div className="coming-soon-badge">{t('comingSoon', lang)}</div>}
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-300 text-sm">{description}</p>
        </div>
    </div>
);

const TestimonialCard = ({ quote, name, restaurant, className }: { quote: string, name: string, restaurant: string, className?: string }) => (
    <div className={`card-glass p-8 rounded-xl ${className}`}>
        <p className="text-gray-200 italic mb-6">"{quote}"</p>
        <div>
            <p className="font-bold text-white" style={{color: 'var(--color-secondary)'}}>{name}</p>
            <p className="text-sm text-gray-400">{restaurant}</p>
        </div>
    </div>
);

const FaqItem = ({ q, a, lang }: { q: string, a: string, lang: 'fa' | 'en' }) => (
    <details className="faq-item border-b border-white/10 last:border-b-0">
        <summary>
            <span>{t(q, lang)}</span>
            <svg className="faq-icon w-6 h-6 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
            </svg>
        </summary>
        <div className="faq-content">
            <p>{t(a, lang)}</p>
        </div>
    </details>
);

const RegistrationForm: React.FC = () => {
    const [primaryColor, setPrimaryColor] = useState('#6C4EFF');
    const [accentColor, setAccentColor] = useState('#D6FF57');

    return (
        <form className="max-w-4xl mx-auto space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group"><input type="text" placeholder={t('restaurantNameLabel', lang)} className="form-input w-full p-3 rounded-md text-white" /></div>
                <div className="form-group"><input type="text" placeholder={t('ownerNameLabel', lang)} className="form-input w-full p-3 rounded-md text-white" /></div>
                <div className="form-group"><input type="email" placeholder={t('email', lang)} className="form-input w-full p-3 rounded-md text-white" /></div>
                <div className="form-group"><input type="tel" placeholder={t('phoneLabel', lang)} className="form-input w-full p-3 rounded-md text-white" /></div>
            </div>
            <div className="form-group">
                <textarea placeholder={t('addressLabel', lang)} rows={3} className="form-input w-full p-3 rounded-md text-white"></textarea>
            </div>
            <div className="card-glass p-6 rounded-lg text-center">
                <h4 className="font-bold text-lg">{t('brandingTitle', lang)}</h4>
                <p className="text-gray-400 text-sm mb-4">{t('brandingDesc', lang)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div>
                        <label className="text-sm text-gray-300">{t('primaryColorLabel', lang)}</label>
                        <div className="color-picker-wrapper mt-1" style={{ backgroundColor: primaryColor }}>
                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-300">{t('accentColorLabel', lang)}</label>
                        <div className="color-picker-wrapper mt-1" style={{ backgroundColor: accentColor }}>
                            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
             <button type="submit" className="btn-lime w-full py-4 px-8 rounded-full text-lg">
                {t('submitRegistration', lang)}
            </button>
        </form>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLogin }) => {

   useEffect(() => {
    if (typeof anime === 'undefined') return;

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const textContent = heroTitle.textContent || '';
      heroTitle.innerHTML = textContent.split(' ').map(word => `<span class="word-wrapper"><span class="word">${word}</span></span>`).join('');
      
      anime.timeline({loop: false})
        .add({
          targets: '.hero-title .word',
          translateY: ['100%', 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1200,
          delay: anime.stagger(100, {start: 300})
        });
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    if(heroSubtitle && heroButtons) {
        anime({
            targets: [heroSubtitle, heroButtons],
            translateY: [20, 0],
            opacity: [0, 1],
            easing: "easeOutQuad",
            duration: 1000,
            delay: 1200
        });
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationTarget = entry.target.getAttribute('data-animation-target');
                const animationTrigger = entry.target;
                if (animationTarget) {
                    anime({
                        targets: animationTrigger.querySelectorAll(animationTarget),
                        translateY: [40, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150, {start: 100}),
                        easing: 'easeOutExpo',
                        duration: 800,
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animation-target]').forEach(section => observer.observe(section));

    return () => observer.disconnect();

  }, []);

  return (
    <div className="text-white" style={{fontFamily: "'Vazirmatn', sans-serif", backgroundColor: 'var(--color-bg)'}}>
      <LandingHeader onNavigate={onNavigate} onLogin={onLogin} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format=fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
        <div className="relative z-10 p-4">
            <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-4" style={{textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
                {t('heroTitle', lang)}
            </h1>
            <p className="hero-subtitle text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300 opacity-0">
                {t('heroSubtitle', lang)}
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
                <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="btn-lime py-3 px-8 rounded-full text-lg">
                  {t('getStartedNow', lang)}
                </a>
                <a href="/#/menu/blink-restaurant" onClick={(e) => { e.preventDefault(); onNavigate('menu/blink-restaurant'); }} className="btn-glass font-bold py-3 px-8 rounded-full text-lg">
                  {t('viewDemoMenu', lang)}
                </a>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" dir="rtl" data-animation-target=".feature-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('whyChooseBlink', lang)}</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">{t('whyChooseSubtitle', lang)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format=fit=crop"
              title={t('featureStudioTitle', lang)}
              description={t('featureStudioDesc', lang)}
            />
             <FeatureCard 
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1978&auto=format=fit=crop"
              title={t('featureSocialGameTitle', lang)}
              description={t('featureSocialGameDesc', lang)}
            />
             <FeatureCard
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
              title={t('featureLoyaltyTitle', lang)}
              description={t('featureLoyaltyDesc', lang)}
            />
             <FeatureCard 
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format=fit=crop"
              title={t('featureDashboardTitle', lang)}
              description={t('featureDashboardDesc', lang)}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-black/20" dir="rtl">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-4">{t('pricingTitle', lang)}</h2>
              <p className="text-gray-400 mb-16 max-w-2xl mx-auto">{t('pricingSubtitle', lang)}</p>
              
              <div className="flex flex-col lg:flex-row justify-center items-center gap-8" data-animation-target=".pricing-card, .credit-features">
                  {/* Professional Plan */}
                  <div className="pricing-card card-glass p-8 rounded-xl opacity-0 w-full max-w-md">
                      <h3 className="text-2xl font-bold">{t('planProfessional', lang)}</h3>
                      <p className="text-5xl font-extrabold my-4 text-white">{t('planProfessionalPrice', lang)}<span className="text-lg font-normal text-gray-300">{t('perYear', lang)}</span></p>
                      <p className="text-sm text-gray-400 -mt-2 mb-6">{t('quarterlyPayment', lang)}</p>
                      
                      <ul className="text-left my-8 space-y-2 text-gray-300">
                          <li><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{t('featureUnlimitedItems', lang)}</span></li>
                          <li><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{t('featureRealtimeUpdates', lang)}</span></li>
                          <li><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{t('featureAnalytics', lang)}</span></li>
                          <li><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{t('featureOnlineSupport', lang)}</span></li>
                          <li className="!mt-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg><span className="font-bold text-white">{t('featureInitialCredits', lang)}</span></li>
                      </ul>
                      <button className="btn-lime w-full font-bold py-3 px-8 rounded-full text-lg">{t('getStartedNow', lang)}</button>
                  </div>
                  
                   {/* Credit Features */}
                  <div className="credit-features opacity-0 w-full max-w-md text-left">
                     <h3 className="text-3xl font-bold mb-4">{t('creditFeaturesTitle', lang)}</h3>
                     <p className="text-gray-300 mb-6">{t('creditFeaturesDesc', lang)}</p>
                      <div className="space-y-4">
                        <div className="card-glass p-4 rounded-lg">
                          <p className="font-bold text-white">{t('featureStudioTitle', lang)}</p>
                          <p className="text-sm text-gray-300">{t('aiPhotoCredit', lang)}</p>
                        </div>
                        <div className="card-glass p-4 rounded-lg">
                          <p className="font-bold text-white">{t('featureSocialGameTitle', lang)}</p>
                          <p className="text-sm text-gray-300">{t('gameCost', lang)}</p>
                        </div>
                         <div className="card-glass p-4 rounded-lg">
                          <p className="font-bold text-white">{t('featureLoyaltyTitle', lang)}</p>
                          <p className="text-sm text-gray-300">{t('customerClubCost', lang)}</p>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24" dir="rtl" data-animation-target=".testimonial-card">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-16">{t('testimonialsTitle', lang)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                <TestimonialCard 
                    className="testimonial-card opacity-0"
                    quote={t('testimonial1Quote', lang)}
                    name={t('testimonial1Name', lang)}
                    restaurant={t('testimonial1Restaurant', lang)}
                />
                 <TestimonialCard 
                    className="testimonial-card opacity-0"
                    quote={t('testimonial2Quote', lang)}
                    name={t('testimonial2Name', lang)}
                    restaurant={t('testimonial2Restaurant', lang)}
                />
                 <TestimonialCard 
                    className="testimonial-card opacity-0"
                    quote={t('testimonial3Quote', lang)}
                    name={t('testimonial3Name', lang)}
                    restaurant={t('testimonial3Restaurant', lang)}
                />
            </div>
        </div>
      </section>

       {/* Coming Soon Section */}
       <section id="coming-soon" className="py-24 bg-black/20" dir="rtl" data-animation-target=".feature-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('futureOfBlink', lang)}</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">{t('futureSubtitle', lang)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format=fit=crop"
              title={t('featureSocialMediaTitle', lang)}
              description={t('featureSocialMediaDesc', lang)}
              isComingSoon={true}
            />
             <FeatureCard 
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format=fit=crop"
              title={t('featureAnalyticsTitle', lang)}
              description={t('featureAnalyticsDesc', lang)}
              isComingSoon={true}
            />
             <FeatureCard
              className="feature-card opacity-0"
              image="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format=fit=crop"
              title={t('featureChatbotTitle', lang)}
              description={t('featureChatbotDesc', lang)}
              isComingSoon={true}
            />
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="join-us" className="py-24" dir="rtl">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('joinUsTitle', lang)}</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">{t('joinUsSubtitle', lang)}</p>
          <div data-animation-target=".form-group">
            <RegistrationForm />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-24" dir="rtl">
        <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-4xl font-bold mb-12 text-center">{t('faqTitle', lang)}</h2>
            <div className="card-glass faq-section-card rounded-xl" data-animation-target=".faq-item-wrapper">
                <div className="faq-item-wrapper opacity-0"><FaqItem q="faqQ1" a="faqA1" lang={lang} /></div>
                <div className="faq-item-wrapper opacity-0"><FaqItem q="faqQ2" a="faqA2" lang={lang} /></div>
                <div className="faq-item-wrapper opacity-0"><FaqItem q="faqQ3" a="faqA3" lang={lang} /></div>
                <div className="faq-item-wrapper opacity-0"><FaqItem q="faqQ4" a="faqA4" lang={lang} /></div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" dir="rtl">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">{t('readyToGoDigital', lang)}</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('readyToGoDigitalDesc', lang)}</p>
            <div className="flex justify-center">
               <a href="#/dashboard" onClick={(e) => { e.preventDefault(); onLogin(); }} className="btn-lime text-lg py-4 px-10 rounded-full">
                  {t('getStartedNow', lang)}
                </a>
            </div>
        </div>
      </section>
      
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;