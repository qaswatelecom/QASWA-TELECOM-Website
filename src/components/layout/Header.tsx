import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Menu,
  X,
  Sun,
  Moon,
  MessageCircle,
  Phone,
  Wrench,
  Sparkles,
  Shield,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { settings, currentPath, navigate } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { label: 'Contact Us', path: '/contact' },
  ];

  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteLogo = settings.SITE_LOGO || '/qaswa-logo.svg';
  const siteTagline = settings.SITE_TAGLINE || 'Display Repair Specialists for Flagship Devices';
  const rawPhone = settings.SITE_PHONE || '+91 9324316048';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
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
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('/')}
          className="flex cursor-pointer items-center transition-opacity hover:opacity-90"
          title={siteName}
        >
          <img
            src={siteLogo}
            alt={siteName}
            className="h-11 sm:h-13 md:h-14 w-auto max-w-[170px] sm:max-w-[200px] object-contain drop-shadow-sm transition-transform hover:scale-105"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
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

        {/* Action Controls: Phone, WhatsApp, Theme Switch, Book Repair */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent Call Button */}
          <a
            href={`tel:${rawPhone.replace(/\s+/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] transition-colors"
            title="Call Our Display Lab"
          >
            <Phone className="h-3.5 w-3.5 text-[#00B2A2]" />
            <span className="hidden xl:inline">{rawPhone}</span>
            <span className="xl:hidden">Call</span>
          </a>

          {/* Prominent WhatsApp Button */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
              `Hello ${siteName}, I need display repair assistance for my flagship device.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-colors shadow-xs"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

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

          {/* Admin Panel Quick Access Button */}
          {isAdmin ? (
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2]/10 border border-[#00B2A2]/40 px-2.5 sm:px-3 py-2 text-xs font-bold text-[#00B2A2] hover:bg-[#00B2A2]/20 transition-all cursor-pointer shadow-xs"
              title="Open Admin Management Dashboard"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/login')}
              className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#00B2A2] transition-colors p-1"
              title="Admin Portal Login"
            >
              <Shield className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Book Repair CTA */}
          <button
            onClick={handleBookRepairClick}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.98] transition-all cursor-pointer"
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

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <Phone className="h-3.5 w-3.5 text-[#00B2A2]" />
                <span>Call Us</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello ${siteName}, I need display repair assistance.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Admin Access inside Mobile Drawer */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/admin');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00B2A2] transition-colors py-1"
              >
                <Shield className="h-3.5 w-3.5 text-[#00B2A2]" />
                <span>{isAdmin ? 'Open Admin Console' : 'Staff / Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
