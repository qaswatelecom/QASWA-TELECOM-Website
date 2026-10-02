import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Wrench,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Play,
  Pause,
  Layers,
  Activity,
  Tablet,
  Watch,
} from 'lucide-react';

export interface BannerSlide {
  id: string;
  badge: string;
  badgeIcon: 'sparkles' | 'wrench' | 'layers' | 'activity';
  title: string;
  highlightText: string;
  description: string;
  primaryButtonText: string;
  primaryButtonAction: 'booking' | 'repairs' | 'devices';
  secondaryButtonText: string;
  features: string[];
  bannerBgGradient: string;
  badgeColor: string;
  accentBg: string;
  visualType: 'flagship' | 'greenscreen' | 'glass' | 'tablet';
}

const DISPLAY_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    badge: 'Flagship Display Specialists',
    badgeIcon: 'sparkles',
    title: 'Display Repair Specialists for',
    highlightText: 'Flagship Devices',
    description:
      'Expert display repair solutions for premium smartphones, Apple Watch, iPad, and tablets. Specialized optical bonding, touch glass refurbishment, and TrueTone calibration.',
    primaryButtonText: 'Book a Repair',
    primaryButtonAction: 'booking',
    secondaryButtonText: 'Chat on WhatsApp',
    features: ['Cleanroom Optical Lamination', 'TrueTone & Sensor Calibration', 'Original Touch Response Retained'],
    bannerBgGradient: 'from-emerald-950/50 via-teal-950/30 to-slate-900/80',
    badgeColor: 'text-[#00B2A2] bg-[#00B2A2]/10 border-[#00B2A2]/30',
    accentBg: '#00B2A2',
    visualType: 'flagship',
  },
  {
    id: 'slide-2',
    badge: 'Advanced Laser Bonding',
    badgeIcon: 'activity',
    title: 'Green Screen & Vertical Lines?',
    highlightText: 'Precision Flex Repair',
    description:
      'Specialized laser micro-welding eliminates green screen of death, white display malfunctions, and vertical or horizontal lines on Samsung Galaxy, iPhone, and OnePlus AMOLED panels.',
    primaryButtonText: 'Explore Display Repairs',
    primaryButtonAction: 'repairs',
    secondaryButtonText: 'Inquire on WhatsApp',
    features: ['Flex Trace Micro-Welding', 'Saves Original AMOLED Panel', 'No Unnecessary Assembly Swaps'],
    bannerBgGradient: 'from-teal-950/60 via-slate-900/40 to-slate-950/80',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    accentBg: '#00B2A2',
    visualType: 'greenscreen',
  },
  {
    id: 'slide-3',
    badge: 'Original OLED Preservation',
    badgeIcon: 'layers',
    title: 'Cracked Glass? Keep Your Authentic',
    highlightText: 'Factory Display Panel',
    description:
      'If your touch and display function normally beneath broken glass, our OCA optical lamination replaces only the outer glass layer, preserving factory color accuracy and 120Hz refresh rate.',
    primaryButtonText: 'View Glass Refurbishing',
    primaryButtonAction: 'repairs',
    secondaryButtonText: 'WhatsApp Consultation',
    features: ['Zero-Bubble Autoclave Press', 'Ceramic Shield & Curved Glass', 'Full 120Hz ProMotion Intact'],
    bannerBgGradient: 'from-cyan-950/50 via-teal-950/30 to-slate-900/70',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    accentBg: '#06B6D4',
    visualType: 'glass',
  },
  {
    id: 'slide-4',
    badge: 'Apple Watch & Tablet Lab',
    badgeIcon: 'wrench',
    title: 'Micro-Precision Display Repairs for',
    highlightText: 'Apple Watch, iPad & Tablets',
    description:
      'Specialized sapphire crystal refurbishing for Apple Watch Ultra & Series, plus Liquid Retina and Ultra Retina display restoration for iPad Pro and premium tablets.',
    primaryButtonText: 'Check Supported Devices',
    primaryButtonAction: 'devices',
    secondaryButtonText: 'Instant WhatsApp Desk',
    features: ['Sapphire Glass Refurbishing', 'Apple Pencil Sensitivity Preserved', 'Precision Dust-Free Bonding'],
    bannerBgGradient: 'from-teal-900/50 via-emerald-950/30 to-slate-900/80',
    badgeColor: 'text-[#00B2A2] bg-[#00B2A2]/10 border-[#00B2A2]/30',
    accentBg: '#00B2A2',
    visualType: 'tablet',
  },
];

export const AutoSlideshowBanner: React.FC = () => {
  const { settings, navigate } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  const slides = DISPLAY_SLIDES;
  const slideDuration = 5500;
  const tickRate = 50;

  // Auto-advance logic
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const step = (tickRate / slideDuration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, tickRate);

    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentSlide, isPaused, slides.length]);

  const handlePrev = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setProgress(0);
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  const handleActionClick = (action: string) => {
    if (action === 'booking') {
      const el = document.getElementById('booking-section') || document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else navigate('/mobile-repair');
    } else if (action === 'repairs') {
      const el = document.getElementById('display-repairs-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else navigate('/services');
    } else if (action === 'devices') {
      const el = document.getElementById('device-categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else navigate('/brands');
    }
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Display Repair Showcase Banner"
    >
      {/* Background Decorative Mesh & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#00B2A2] filter blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-teal-600 filter blur-[120px] opacity-30" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-600 filter blur-[90px] opacity-25" />
      </div>

      {/* Main Slide Content Frame */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24 min-h-[500px] sm:min-h-[560px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Clean unboxed category header */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide">
              {slide.badgeIcon === 'sparkles' && <Sparkles className="h-4 w-4" />}
              {slide.badgeIcon === 'activity' && <Activity className="h-4 w-4" />}
              {slide.badgeIcon === 'layers' && <Layers className="h-4 w-4" />}
              {slide.badgeIcon === 'wrench' && <Wrench className="h-4 w-4" />}
              <span>{slide.badge}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-medium">Exclusively Display Solutions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B2A2] via-teal-300 to-cyan-300">
                {slide.highlightText}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {slide.description}
            </p>

            {/* Key Unboxed Highlights */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-slate-300 font-medium">
              {slide.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0" />
                  <span>{feat}</span>
                  {idx < slide.features.length - 1 && (
                    <span aria-hidden="true" className="text-slate-600 hidden sm:inline ml-2">·</span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => handleActionClick(slide.primaryButtonAction)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Wrench className="h-4 w-4" />
                <span>{slide.primaryButtonText}</span>
              </button>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello ${siteName}, I need display repair assistance for my flagship device.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400 fill-current" />
                <span>{slide.secondaryButtonText}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Device & Display Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Glow backdrop behind graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00B2A2]/30 to-teal-400/20 rounded-3xl filter blur-xl transform -rotate-2 scale-95" />

              <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00B2A2] animate-ping" />
                    <span className="text-xs font-semibold text-slate-300">
                      {slide.visualType === 'flagship' && 'Precision Display Refurbishing'}
                      {slide.visualType === 'greenscreen' && 'Laser Micro-Bonding Lab'}
                      {slide.visualType === 'glass' && 'OCA Optical De-Bonding'}
                      {slide.visualType === 'tablet' && 'Large Panel Calibration'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00B2A2]">100% Display Focus</span>
                </div>

                {/* Device Display Visualizer Card */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 p-4">
                  {slide.visualType === 'flagship' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Apple Super Retina XDR & Samsung AMOLED</span>
                        <Smartphone className="h-4 w-4 text-[#00B2A2]" />
                      </div>
                      <div className="h-28 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-[#00B2A2]" />
                        <div className="text-center px-4">
                          <p className="text-xs font-bold text-white">120Hz ProMotion / Dynamic AMOLED 2X</p>
                          <p className="text-[11px] text-slate-400 mt-1">TrueTone & Sensor Data Retained</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Touch Sensitivity</span>
                          <span>Zero Digitizer Lag</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Optical Clarity</span>
                          <span>Factory Luminance</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.visualType === 'greenscreen' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Laser Micro-Bonding Technology</span>
                        <Activity className="h-4 w-4 text-teal-400" />
                      </div>
                      <div className="h-28 rounded-lg bg-slate-900 border border-teal-500/30 flex items-center justify-center relative overflow-hidden">
                        {/* Simulation line */}
                        <div className="absolute inset-y-0 left-1/3 w-0.5 bg-emerald-400 shadow-[0_0_10px_#10B981]" />
                        <div className="text-center px-4 z-10">
                          <p className="text-xs font-bold text-teal-300">Resolves Green Screen & Vertical Lines</p>
                          <p className="text-[11px] text-slate-400 mt-1">Flex Cable Trace Laser Restoration</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Panel Reclaimed</span>
                          <span>Saves Original OLED</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Precision Beam</span>
                          <span>Microscopic Accuracy</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.visualType === 'glass' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Touch Glass Only Refurbishment</span>
                        <Layers className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="h-28 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
                        <div className="text-center px-4">
                          <p className="text-xs font-bold text-cyan-300">Original Panel Stays In Your Device</p>
                          <p className="text-[11px] text-slate-400 mt-1">Only the outer shattered glass is swapped</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Ceramic Shield</span>
                          <span>OEM-Spec Hardness</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">OCA Lamination</span>
                          <span>Bubble-Free Finish</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.visualType === 'tablet' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Apple Watch & Tablet Specialists</span>
                        <Watch className="h-4 w-4 text-[#00B2A2]" />
                      </div>
                      <div className="h-28 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <div className="text-center px-4">
                          <p className="text-xs font-bold text-white">Sapphire Crystal & Tandem OLEDs</p>
                          <p className="text-[11px] text-slate-400 mt-1">Apple Watch Ultra, iPad Pro & Tab S9 Ultra</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Stylus Response</span>
                          <span>Pencil Sensitivity</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-white block font-medium">Sensor Check</span>
                          <span>Force Touch Alignment</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer status in card */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Specialized Display Equipment</span>
                  <span className="text-[#00B2A2] font-semibold">Active Lab Diagnostics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls & Progress Bar */}
      <div className="relative z-20 border-t border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-3">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-[#00B2A2]'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Active Slide Tracker & Controls */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span>
              <strong className="text-white">0{currentSlide + 1}</strong> / 0{slides.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
              </button>
              <button
                onClick={handleNext}
                className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div
            className="h-full bg-[#00B2A2] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
