import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Smartphone,
  Layers,
  Activity,
  Sparkles,
  Fingerprint,
  EyeOff,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

interface DisplayServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedProcess: string;
  highlightPoints: string[];
  imageUrl: string;
  icon: React.ReactNode;
}

const DISPLAY_SERVICES: DisplayServiceItem[] = [
  {
    id: 'broken-displays',
    title: 'Broken or Cracked Displays',
    shortDescription: 'Complete restoration for severely shattered, cracked, or shattered front glass and punctured display assemblies.',
    detailedProcess: 'We perform micro-precision de-bonding of the fractured front panel, inspect frame trueness, and fit authentic OLED/AMOLED display units with factory adhesive gaskets.',
    highlightPoints: ['Precision frame alignment', 'Seamless bezel fitting', 'Original brightness & contrast'],
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    icon: <Smartphone className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'touch-glass',
    title: 'Touch Glass Replacement',
    shortDescription: 'Preserve your original factory OLED or AMOLED panel when only the top protective glass is cracked.',
    detailedProcess: 'Using computerized freezing separators and high-purity optically clear adhesives (OCA), we strip the damaged glass while leaving your original factory display panel 100% intact.',
    highlightPoints: ['Saves original OEM panel', 'Zero bubble autoclave lamination', 'Retains 120Hz ProMotion & TrueTone'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    icon: <Layers className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'green-screen',
    title: 'Green Screen Issues',
    shortDescription: 'Targeted laser micro-welding for sudden green screen of death or white screen flash on flagship OLED panels.',
    detailedProcess: 'Green screen glitches on Samsung Galaxy S-series, iPhone, and OnePlus devices frequently stem from micro-fractures in the flex bonding. Our laser machine repairs flex traces without requiring costly panel replacement.',
    highlightPoints: ['Direct laser flex micro-welding', 'No panel replacement required', 'Permanent trace restoration'],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    icon: <Sparkles className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'display-lines',
    title: 'Display Lines (Vertical & Horizontal)',
    shortDescription: 'Elimination of bright green, pink, or white vertical and horizontal lines across flagship AMOLED panels.',
    detailedProcess: 'Colored lines are caused by degraded chip-on-film (COF) bonding. We utilize specialized hot-bar pulse heating and flex bonding machines to restore electrical continuity across every microscopic pixel channel.',
    highlightPoints: ['Pulse-heat flex re-bonding', 'Clears single or multiple lines', 'Microscopic trace realignment'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    icon: <Activity className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'touchscreen-issues',
    title: 'Touchscreen Issues',
    shortDescription: 'Correction of ghost touches, unresponsive touch quadrants, intermittent touch lag, or erratic digitizer behavior.',
    detailedProcess: 'We diagnose digitizer controller circuits, re-calibrate capacitive touch sensors, and repair micro-soldered touch flex traces to bring response times back to zero latency.',
    highlightPoints: ['Digitizer capacitive recalibration', 'Micro-soldered touch line repair', 'Elimination of phantom touches'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    icon: <Fingerprint className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'black-screen',
    title: 'Black Screen & Display Malfunction',
    shortDescription: 'Reviving devices that turn on or vibrate but present an entirely black or unilluminated display.',
    detailedProcess: 'We carry out component-level diagnostics on the display power rails (VBOOST, VDD, VSYNC), repair detached display FPC connectors, and restore backlight and OLED driver integrity.',
    highlightPoints: ['OLED power rail diagnostics', 'Display FPC connector repair', 'Backlight driver restoration'],
    imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&q=80',
    icon: <EyeOff className="h-5 w-5 text-[#00B2A2]" />,
  },
  {
    id: 'other-display-problems',
    title: 'Other Display-Related Problems',
    shortDescription: 'Specialized diagnosis for display flicker, color banding, ambient light sensor mismatch, and TrueTone data loss.',
    detailedProcess: 'We utilize EEPROM screen programmers to copy display identity data, calibrate proximity and ambient lux sensors, and resolve PWM flicker or uneven color reproduction.',
    highlightPoints: ['TrueTone EEPROM reprogramming', 'Ambient sensor calibration', 'PWM flicker elimination'],
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80',
    icon: <Wrench className="h-5 w-5 text-[#00B2A2]" />,
  },
];

export const DisplayServices: React.FC = () => {
  const { settings, navigate } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  const handleInquire = (serviceTitle: string) => {
    const el = document.getElementById('booking-section') || document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/mobile-repair');
    }
  };

  return (
    <section id="display-repairs-section" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Dedicated Display Engineering</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Exclusively Screen & Glass Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Specialized Display Repair Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike general repair shops, QASWA TELECOM focuses exclusively on flagship display technologies. We invest in high-end optical laminators, cleanrooms, and laser micro-welding equipment to resolve complex display failures.
          </p>
        </div>

        {/* Display Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DISPLAY_SERVICES.map((serv, index) => (
            <div
              key={serv.id}
              className={`group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all duration-300 hover:border-[#00B2A2] hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:hover:border-[#00B2A2] ${
                index === DISPLAY_SERVICES.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-5">
                  <img
                    src={serv.imageUrl}
                    alt={serv.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 h-10 w-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center shadow-md">
                    {serv.icon}
                  </div>
                </div>

                {/* Title & Short Description */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                  {serv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  {serv.shortDescription}
                </p>

                {/* Detailed Process */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed border-l-2 border-[#00B2A2]/40 pl-3">
                  {serv.detailedProcess}
                </p>

                {/* Technical Highlights */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  {serv.highlightPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#00B2A2] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleInquire(serv.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B2A2] hover:underline cursor-pointer"
                >
                  <span>Book Diagnosis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    `Hello ${siteName}, I need display repair assistance for: ${serv.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="h-3 w-3 text-emerald-500 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
