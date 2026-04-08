import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { ContentProvider, useContent } from './ContentContext';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/LoginPage';

import PortfolioSection from './components/PortfolioSection';
import CreativeArsenal from './components/CreativeArsenal';
import ContactFooter from './components/ContactFooter';
import TeamSection from './components/TeamSection';
import AboutSection from './components/AboutSection';
import OnboardingBrief from './components/OnboardingBrief';
import TrustBadges from './components/TrustBadges';

type Page = 'home' | 'about' | 'contact' | 'onboarding';

const HomePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const { content } = useContent();
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <TrustBadges />
      <ServicesSection />
      {content.portfolioItems && content.portfolioItems.length > 0 && <PortfolioSection />}
      {content.arsenalItems && content.arsenalItems.length > 0 && <CreativeArsenal />}
      {content.aboutVisible && <AboutSection />}
      {content.teamVisible && <TeamSection />}
      <ContactFooter onNavigate={onNavigate} />
    </>
  );
};

const AppContent: React.FC = () => {
  const { isAdmin, setIsAdmin } = useContent();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Map URL paths to page keys
  const pathToPage = (path: string): Page => {
    const p = path.replace(/^\//, '').toLowerCase();
    if (p === 'about') return 'about';
    if (p === 'contact') return 'contact';
    if (p === 'onboarding' || p === 'brief') return 'onboarding';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(() => pathToPage(window.location.pathname));

  useEffect(() => {
    checkAuth();
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAuthenticated) setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      }
    } catch {
      // Not authenticated
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleAdminToggle = () => {
    const now = Date.now();
    if (now - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(now);
    if (clickCount >= 2) {
      setShowLogin(true);
      setClickCount(0);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setIsAdmin(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setShowLogin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigate = (page: string) => {
    const p = page as Page;
    const pathMap: Record<Page, string> = {
      home: '/',
      about: '/about',
      contact: '/contact',
      onboarding: '/onboarding',
    };
    history.pushState({ page: p }, '', pathMap[p] || '/');
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle browser back/forward
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      setCurrentPage(e.state?.page ?? pathToPage(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Beacon SPA page view to server on every page change
  useEffect(() => {
    if (checkingAuth) return; // don't fire until auth is settled
    fetch('/api/analytics/log-page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: currentPage }),
    }).catch(() => {}); // silently ignore network errors
  }, [currentPage, checkingAuth]);

  if (showLogin && !isAuthenticated) return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  if (isAdmin && isAuthenticated) return <AdminDashboard onLogout={handleLogout} />;
  if (checkingAuth) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding': return <OnboardingBrief />;
      case 'about': return <AboutPage onNavigate={navigate} />;
      case 'contact': return <ContactPage onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={navigate} currentPage={currentPage} />
      {renderPage()}

      {/* Invisible Admin Toggle — Triple Click */}
      <button
        onClick={handleAdminToggle}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-transparent opacity-0 hover:opacity-10 cursor-default z-50"
        aria-label="Admin Access"
      />

      {/* Visible admin re-entry when session is active */}
      {isAuthenticated && !isAdmin && (
        <button
          onClick={() => setIsAdmin(true)}
          className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
          title="Open Admin Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      )}
      {/* ── Mobile FAB: Let's Talk ── only visible on mobile, hidden when on onboarding */}
      {currentPage !== 'onboarding' && (
        <button
          onClick={() => navigate('onboarding')}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 relative flex items-center gap-2 bg-primary text-slate-900 font-black px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,229,255,0.4)] hover:shadow-[0_8px_40px_rgba(0,229,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
          aria-label="Start a project"
        >
          <span className="material-icons text-[18px]">chat_bubble_outline</span>
          Let's Talk
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping pointer-events-none" />
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
