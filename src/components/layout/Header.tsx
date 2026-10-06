import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import {
  Menu,
  X,
  Sun,
  Moon,
  Wrench,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { settings, currentPath, navigate } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Devices', path: '/brands' },
    { label: 'Display Repairs', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'FAQs', path: '/faqs' },
  ];

  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteLogo = settings.SITE_LOGO || '/qaswa-logo.svg';
  const isDark = resolvedTheme === 'dark';

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookRepairClick = () => {
    setMobileOpen(false);
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm dark:border-[#263331] dark:bg-[#0B1110]/95'
          : 'border-b border-slate-200/50 bg-white/90 backdrop-blur-sm dark:border-[#263331]/50 dark:bg-[#0B1110]/90'
      }`}
    >
      <div className="mx-auto flex h-18 sm:h-20 md:h-22 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Enhanced size, perfectly proportioned */}
        <div
          onClick={() => handleNavClick('/')}
          className="flex cursor-pointer items-center transition-opacity hover:opacity-95 shrink-0 py-1"
          title={siteName}
        >
          <img
            src={siteLogo}
            alt={siteName}
            className="h-13 sm:h-15 md:h-16 lg:h-18 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[270px] lg:max-w-[300px] object-contain drop-shadow-xs transition-transform hover:scale-102"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              className={`text-xs xl:text-sm font-semibold transition-colors cursor-pointer ${
                currentPath === item.path
                  ? 'text-[#00B2A2] font-bold'
                  : 'text-slate-700 hover:text-[#00B2A2] dark:text-slate-300 dark:hover:text-[#00B2A2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls: Theme Switch, Book Repair CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Modern Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            role="switch"
            aria-checked={isDark}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative flex h-9 items-center rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-medium text-slate-900 shadow-inner hover:border-[#00B2A2] dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 px-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
                  !isDark ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-400'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
                  isDark ? 'bg-[#00B2A2] text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
              </div>
            </div>
          </button>

          {/* Book Repair CTA */}
          <button
            onClick={handleBookRepairClick}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Book Repair</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-900 dark:border-slate-700 dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 dark:border-slate-800 dark:bg-[#0B1110] transition-colors space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold transition-colors text-left ${
                  currentPath === item.path
                    ? 'bg-[#00B2A2]/10 text-[#00B2A2]'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {/* Theme / Appearance Toggle inside Mobile Drawer */}
            <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Appearance: {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-[#00B2A2]" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBookRepairClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] px-4 py-3 text-sm font-bold text-white shadow-md"
            >
              <Wrench className="h-4 w-4" />
              <span>Book a Display Repair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
