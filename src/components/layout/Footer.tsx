import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Layers,
  Shield,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigate } = useApp();

  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteLogo = settings.SITE_LOGO || '/qaswa-logo.svg';
  const rawPhone = settings.SITE_PHONE || '+91 9324316048';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteAddress = settings.SITE_ADDRESS || 'Shop No. 4, Tech Plaza, Main Market';
  const siteEmail = settings.SITE_EMAIL || 'telecomqaswa@gmail.com';

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Supported Devices', path: '/brands' },
    { label: 'Display Repair Services', path: '/services' },
    { label: 'Repair Gallery', path: '/gallery' },
    { label: 'Customer Testimonials', path: '/testimonials' },
    { label: 'Blogs & Articles', path: '/blogs' },
    { label: 'Frequently Asked Questions', path: '/faqs' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin Portal', path: '/admin' },
  ];

  const supportedDevices = [
    { name: 'Apple iPhone (Super Retina XDR OLED)', slug: 'iphone' },
    { name: 'Samsung Galaxy (S24/S23 & Z Fold/Flip)', slug: 'samsung-galaxy' },
    { name: 'Google Pixel (Actua & Super Actua OLED)', slug: 'google-pixel' },
    { name: 'OnePlus (ProXDR Fluid AMOLED)', slug: 'oneplus' },
    { name: 'Apple Watch (Ultra 2 & Series Sapphire)', slug: 'apple-watch' },
    { name: 'iPad (Liquid Retina XDR & Tandem OLED)', slug: 'ipad' },
    { name: 'Premium Tablets (Galaxy Tab Ultra & Surface)', slug: 'premium-tablets' },
  ];

  const displaySpecialties = [
    'Broken or Cracked Displays',
    'Touch Glass Replacement',
    'Green Screen Issues',
    'Display Lines (Vertical & Horizontal)',
    'Touchscreen & Digitizer Issues',
    'Black Screen & Malfunction Diagnosis',
    'TrueTone & Optical Sensor Calibration',
  ];

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-300 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div
              onClick={() => handleNav('/')}
              className="flex cursor-pointer items-center transition-opacity hover:opacity-90"
              title={siteName}
            >
              <img
                src={siteLogo}
                alt={siteName}
                className="h-12 sm:h-15 w-auto max-w-[190px] object-contain drop-shadow-sm"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              QASWA TELECOM is a specialized mobile repair service focused exclusively on <strong className="text-white">display repairs for high-end flagship devices</strong>: Apple iPhone, Samsung Galaxy S and Z series, Google Pixel, OnePlus, Apple Watch, iPad, and premium tablets.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#00B2A2] shrink-0" />
                <span>{siteAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00B2A2] shrink-0" />
                <a href={`tel:${rawPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {rawPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00B2A2] shrink-0" />
                <a href={`mailto:${siteEmail}`} className="hover:text-white transition-colors">
                  {siteEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00B2A2] shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:30 PM | Sun: 11:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.path)}
                    className="text-slate-400 hover:text-[#00B2A2] transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Devices */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Supported Flagship Devices
            </h4>
            <ul className="space-y-2 text-xs">
              {supportedDevices.map((d) => (
                <li key={d.name}>
                  <button
                    onClick={() => handleNav(`/brands/${d.slug}`)}
                    className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="h-3 w-3 text-[#00B2A2]" />
                    <span>{d.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Display Specialties */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Display Specialties
            </h4>
            <ul className="space-y-2 text-xs">
              {displaySpecialties.map((spec) => (
                <li key={spec}>
                  <button
                    onClick={() => handleNav('display-repairs-section')}
                    className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <Layers className="h-3 w-3 text-[#00B2A2]" />
                    <span>{spec}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello ${siteName}, I need display repair consultation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors w-full justify-center"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>Instant WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Dedicated Page Navigation */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">QASWA TELECOM</strong>. All Rights Reserved. Display Repair Specialists for Flagship Devices.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
            <button
              onClick={() => handleNav('/about')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/testimonials')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              Testimonials
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/blogs')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              Blogs
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/faqs')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              FAQs
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/terms')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/contact')}
              className="hover:text-[#00B2A2] transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => handleNav('/admin')}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] text-slate-400"
              title="Admin Login & Management Console"
            >
              <Shield className="h-3 w-3 text-[#00B2A2]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
