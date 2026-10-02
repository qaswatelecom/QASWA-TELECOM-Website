import React from 'react';
import {
  Smartphone,
  Layers,
  Sparkles,
  Activity,
  Fingerprint,
  EyeOff,
  Wrench,
  Sun,
  Droplets,
  Cpu,
  Sliders,
  CheckCircle2,
  Watch,
  Tablet,
  ArrowDown,
} from 'lucide-react';

interface BuzzmeehNumberedSectionsProps {
  onSelectProblem: (device: string, fault: string) => void;
}

export const BuzzmeehNumberedSections: React.FC<BuzzmeehNumberedSectionsProps> = ({
  onSelectProblem,
}) => {
  const handleProblemClick = (device: string, fault: string) => {
    onSelectProblem(device, fault);
    const bookingEl = document.getElementById('fast-booking-card');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section 01: Smartphone Display Repair
  const smartphoneProblems = [
    { label: 'Screen Issue', icon: <Smartphone className="h-5 w-5 text-rose-500" /> },
    { label: 'Touch Glass', icon: <Layers className="h-5 w-5 text-orange-500" /> },
    { label: 'Green Screen', icon: <Sparkles className="h-5 w-5 text-emerald-500" /> },
    { label: 'Display Lines', icon: <Activity className="h-5 w-5 text-teal-500" /> },
    { label: 'Touchscreen Lag', icon: <Fingerprint className="h-5 w-5 text-amber-500" /> },
    { label: 'Black Screen', icon: <EyeOff className="h-5 w-5 text-slate-700 dark:text-slate-300" /> },
    { label: 'TrueTone Issue', icon: <Sun className="h-5 w-5 text-yellow-500" /> },
    { label: 'Display Flicker', icon: <Activity className="h-5 w-5 text-cyan-500" /> },
    { label: 'Liquid Damage', icon: <Droplets className="h-5 w-5 text-blue-500" /> },
    { label: 'Flex Cable', icon: <Cpu className="h-5 w-5 text-indigo-500" /> },
    { label: 'Color Banding', icon: <Sliders className="h-5 w-5 text-purple-500" /> },
    { label: 'Other Fault', icon: <Wrench className="h-5 w-5 text-slate-500" /> },
  ];

  // Section 02: iPad Display Repair
  const ipadProblems = [
    { label: 'Screen Issue', icon: <Tablet className="h-5 w-5 text-rose-500" /> },
    { label: 'Touch Glass', icon: <Layers className="h-5 w-5 text-orange-500" /> },
    { label: 'Touchscreen Lag', icon: <Fingerprint className="h-5 w-5 text-amber-500" /> },
    { label: 'Apple Pencil Lag', icon: <Sparkles className="h-5 w-5 text-[#00B2A2]" /> },
    { label: 'Black Screen', icon: <EyeOff className="h-5 w-5 text-slate-700 dark:text-slate-300" /> },
    { label: 'Display Lines', icon: <Activity className="h-5 w-5 text-teal-500" /> },
    { label: 'TrueTone Loss', icon: <Sun className="h-5 w-5 text-yellow-500" /> },
    { label: 'Liquid Ingress', icon: <Droplets className="h-5 w-5 text-blue-500" /> },
    { label: 'Other Fault', icon: <Wrench className="h-5 w-5 text-slate-500" /> },
  ];

  // Section 03: Apple Watch Display Repair
  const watchProblems = [
    { label: 'Sapphire Glass', icon: <Layers className="h-5 w-5 text-rose-500" /> },
    { label: 'Touch Damage', icon: <Fingerprint className="h-5 w-5 text-amber-500" /> },
    { label: 'Black Screen', icon: <EyeOff className="h-5 w-5 text-slate-700 dark:text-slate-300" /> },
    { label: 'Display Lines', icon: <Activity className="h-5 w-5 text-teal-500" /> },
    { label: 'Force Touch', icon: <Watch className="h-5 w-5 text-[#00B2A2]" /> },
    { label: 'Green Screen', icon: <Sparkles className="h-5 w-5 text-emerald-500" /> },
    { label: 'Screen Flicker', icon: <Activity className="h-5 w-5 text-cyan-500" /> },
    { label: 'Water Seal Issue', icon: <Droplets className="h-5 w-5 text-blue-500" /> },
    { label: 'Other Fault', icon: <Wrench className="h-5 w-5 text-slate-500" /> },
  ];

  // Section 04: Samsung Galaxy & Tablets
  const galaxyProblems = [
    { label: 'Green Screen Fix', icon: <Sparkles className="h-5 w-5 text-emerald-500" /> },
    { label: 'Vertical Lines', icon: <Activity className="h-5 w-5 text-teal-500" /> },
    { label: 'Curved Glass', icon: <Layers className="h-5 w-5 text-orange-500" /> },
    { label: 'Fold Crease Lag', icon: <Smartphone className="h-5 w-5 text-[#00B2A2]" /> },
    { label: 'Touchscreen Lag', icon: <Fingerprint className="h-5 w-5 text-amber-500" /> },
    { label: 'Black Screen', icon: <EyeOff className="h-5 w-5 text-slate-700 dark:text-slate-300" /> },
    { label: '120Hz LTPO Lag', icon: <Activity className="h-5 w-5 text-cyan-500" /> },
    { label: 'S-Pen Digitizer', icon: <Tablet className="h-5 w-5 text-indigo-500" /> },
    { label: 'Other Fault', icon: <Wrench className="h-5 w-5 text-slate-500" /> },
  ];

  return (
    <div className="w-full py-8 sm:py-16 space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* ========================================================
            CARD 01: SMARTPHONE DISPLAY REPAIR
            ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Header Pill & Giant Watermark */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Smartphone className="h-3.5 w-3.5 text-[#00B2A2]" />
              <span>Smartphone Display Repair</span>
            </span>
            <span className="text-4xl sm:text-5xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
              01
            </span>
          </div>

          {/* Device Showcase Image Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 p-6 mb-6 flex flex-col items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80"
              alt="Flagship Smartphone Display"
              className="h-56 sm:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom Pill Badge Under Image */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#00B2A2] shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dedicated Cleanroom Optical Lamination</span>
            </div>
          </div>

          {/* Content Block */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block">
              SMARTPHONE DISPLAY REPAIR SERVICE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Professional Display Repair for Flagship Smartphones
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fast diagnosis. Precision engineering. Professional display restoration.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Get convenient display repair support for broken screens, touch glass replacement, green screen issues, display lines, and touchscreen malfunctions.
            </p>
          </div>

          {/* Interactive Common Problems Header with Arrow */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Common Display Problems
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  What's wrong with your smartphone display?
                </span>
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Buzzmeeh Signature 3-Column Interactive Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {smartphoneProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => handleProblemClick('Mobile', prob.label)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 sm:p-4 text-center hover:border-[#00B2A2] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="mb-2 p-2 rounded-xl bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                  {prob.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors">
                  {prob.label}
                </span>
                <span className="text-[10px] text-[#00B2A2] font-semibold mt-0.5">
                  Tap to diagnose
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            CARD 02: IPAD DISPLAY REPAIR
            ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Header Pill & Giant Watermark */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Tablet className="h-3.5 w-3.5 text-[#00B2A2]" />
              <span>iPad Display Repair</span>
            </span>
            <span className="text-4xl sm:text-5xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
              02
            </span>
          </div>

          {/* Device Showcase Image Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 p-6 mb-6 flex flex-col items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&q=80"
              alt="iPad Pro Display"
              className="h-56 sm:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom Pill Badge Under Image */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#00B2A2] shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Liquid Retina XDR & Tandem OLED Specialists</span>
            </div>
          </div>

          {/* Content Block */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block">
              APPLE IPAD DISPLAY REPAIR
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Reliable iPad Display Repair Without the Hassle
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Restore display quality, Apple Pencil sensitivity, and touch response.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Get professional assistance for damaged iPad displays, touch glass replacement, digitizer latency, TrueTone recalibration, and color distortion.
            </p>
          </div>

          {/* Interactive Common Problems Header with Arrow */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Popular iPad Display Repairs
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Select your iPad display issue:
                </span>
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Buzzmeeh Signature 3-Column Interactive Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {ipadProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => handleProblemClick('iPad', prob.label)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 sm:p-4 text-center hover:border-[#00B2A2] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="mb-2 p-2 rounded-xl bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                  {prob.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors">
                  {prob.label}
                </span>
                <span className="text-[10px] text-[#00B2A2] font-semibold mt-0.5">
                  Tap to diagnose
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            CARD 03: APPLE WATCH DISPLAY REPAIR
            ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Header Pill & Giant Watermark */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Watch className="h-3.5 w-3.5 text-[#00B2A2]" />
              <span>Apple Watch Display Repair</span>
            </span>
            <span className="text-4xl sm:text-5xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
              03
            </span>
          </div>

          {/* Device Showcase Image Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 p-6 mb-6 flex flex-col items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&q=80"
              alt="Apple Watch Ultra Display"
              className="h-56 sm:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom Pill Badge Under Image */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#00B2A2] shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Expert Wearable Display Technician</span>
            </div>
          </div>

          {/* Content Block */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block">
              APPLE WATCH DISPLAY REPAIR
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Bring Your Apple Watch Display Back to Life
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Precision repair for the wearable you use every day.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Professional display support for cracked sapphire crystal, unresponsive touch areas, OLED blanking, Force Touch sensor alignment, and screen burn-in.
            </p>
          </div>

          {/* Interactive Common Problems Header with Arrow */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Watch Display Repair Services
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Common Apple Watch display problems:
                </span>
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Buzzmeeh Signature 3-Column Interactive Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {watchProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => handleProblemClick('Apple Watch', prob.label)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 sm:p-4 text-center hover:border-[#00B2A2] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="mb-2 p-2 rounded-xl bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                  {prob.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors">
                  {prob.label}
                </span>
                <span className="text-[10px] text-[#00B2A2] font-semibold mt-0.5">
                  Tap to diagnose
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            CARD 04: SAMSUNG GALAXY & TABLETS
            ======================================================== */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Header Pill & Giant Watermark */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Smartphone className="h-3.5 w-3.5 text-[#00B2A2]" />
              <span>Samsung Galaxy & Tablets</span>
            </span>
            <span className="text-4xl sm:text-5xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
              04
            </span>
          </div>

          {/* Device Showcase Image Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 p-6 mb-6 flex flex-col items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80"
              alt="Samsung Galaxy S24 Ultra & Fold Display"
              className="h-56 sm:h-72 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom Pill Badge Under Image */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#00B2A2] shadow-xs">
              <Cpu className="h-3.5 w-3.5" />
              <span>Dynamic AMOLED 2X & Laser Bonding Station</span>
            </div>
          </div>

          {/* Content Block */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block">
              GALAXY & TABLET DISPLAY REPAIR
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Expert Galaxy & Tablet Display Restoration
            </h3>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Advanced laser micro-bonding for green lines & screen restore.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Specialized laser welding eliminates green lines and green screens on Galaxy S-series, Z Fold, and flagship tablet AMOLED panels without full screen swaps.
            </p>
          </div>

          {/* Interactive Common Problems Header with Arrow */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Common Galaxy & Tablet Problems
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  What's wrong with your display?
                </span>
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Buzzmeeh Signature 3-Column Interactive Button Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {galaxyProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => handleProblemClick('Mobile', prob.label)}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 sm:p-4 text-center hover:border-[#00B2A2] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="mb-2 p-2 rounded-xl bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                  {prob.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors">
                  {prob.label}
                </span>
                <span className="text-[10px] text-[#00B2A2] font-semibold mt-0.5">
                  Tap to diagnose
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
