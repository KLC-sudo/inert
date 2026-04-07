
import React, { useState, useEffect } from 'react';
import { useContent } from '../ContentContext';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { content } = useContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (['home', 'about', 'contact', 'onboarding'].includes(target)) {
      onNavigate(target);
      return;
    }
    const el = document.getElementById(target.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(target.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            alt={content.branding.brandName || "Inertia Studio Logo"}
            className="w-auto object-contain"
            src={content.branding.logoTop}
            style={{ height: `${content.branding.logoTopSize || 40}px` }}
          />
        </button>

        <div className="flex items-center ml-auto">
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={(e) => handleNavClick(e, 'services')} className="font-semibold hover:text-primary transition-colors">Services</button>
            <button onClick={(e) => handleNavClick(e, 'portfolio')} className="font-semibold hover:text-primary transition-colors">Portfolio</button>
            {content.aboutVisible && <button onClick={(e) => handleNavClick(e, 'about')} className="font-semibold hover:text-primary transition-colors">About</button>}
            {content.teamVisible && <button onClick={(e) => handleNavClick(e, 'team')} className="font-semibold hover:text-primary transition-colors">Team</button>}
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => handleNavClick(e, 'onboarding')}
                className="bg-primary hover:bg-opacity-90 text-slate-900 px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105"
              >
                Let's Talk
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden material-icons p-2 text-slate-600 ml-4"
          >
            {isMenuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 py-6 px-6 space-y-4">
          <button onClick={(e) => handleNavClick(e, 'services')} className="block w-full text-left font-semibold hover:text-primary">Services</button>
          <button onClick={(e) => handleNavClick(e, 'portfolio')} className="block w-full text-left font-semibold hover:text-primary">Portfolio</button>
          {content.aboutVisible && <button onClick={(e) => handleNavClick(e, 'about')} className="block w-full text-left font-semibold hover:text-primary">About</button>}
          {content.teamVisible && <button onClick={(e) => handleNavClick(e, 'team')} className="block w-full text-left font-semibold hover:text-primary">Team</button>}
          <button onClick={(e) => handleNavClick(e, 'onboarding')} className="block w-full font-bold text-center bg-primary text-slate-900 py-3 rounded-xl">Let's Talk</button>
        </div>
      )}
    </nav>
  );
};

export default Header;
