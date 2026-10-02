import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MessageCircle,
  Search,
  Wrench,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Contact Us',
    subtitle: 'Get in touch through WhatsApp or phone',
    description: 'Reach out to our service desk with your device model and describe the display issue (cracked glass, green lines, unresponsive touch, etc.).',
    icon: <MessageCircle className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    step: '02',
    title: 'Device Diagnosis',
    subtitle: 'Our technicians examine the display issue',
    description: 'We test your display under specialized microscopes and diagnostic fixtures to check touch responsiveness, digitizer layers, and OLED flex integrity.',
    icon: <Search className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    step: '03',
    title: 'Expert Display Repair',
    subtitle: 'Our specialists perform the required repair',
    description: 'Using optical laminating machines, vacuum autoclaves, or laser micro-welding equipment, our technicians complete the precision display restoration.',
    icon: <Wrench className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    step: '04',
    title: 'Quality Check',
    subtitle: 'We inspect the display and test its functionality',
    description: 'We perform multi-touch grid verification, color calibration, TrueTone synchronisation, and optical sensor testing before handing back your pristine device.',
    icon: <CheckCircle2 className="h-6 w-6 text-[#00B2A2]" />,
  },
];

export const RepairProcess: React.FC = () => {
  const { settings, navigate } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const rawPhone = settings.SITE_PHONE || '+91 9324316048';

  return (
    <section id="repair-process-section" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Smooth & Professional Journey</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Repair Process
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            From initial consultation to rigorous multi-point testing, our straightforward four-step process ensures transparency and precision at every stage.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all duration-300 hover:border-[#00B2A2] hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700">
                    {s.step}
                  </span>
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-[#00B2A2] mt-1">
                  {s.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>

              {/* Progress Connector (on desktop) */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Phase {s.step} of 04</span>
                {idx < STEPS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 hidden lg:inline" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Process Fast Actions */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold">Ready to get your display diagnosed?</h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with a display specialist right now or initiate an online inquiry.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello QASWA TELECOM, I would like to initiate Step 1 of the repair process for my device.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              <span>WhatsApp Us: {rawWhatsApp}</span>
            </a>

            <a
              href={`tel:${rawPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              <PhoneCall className="h-4 w-4 text-[#00B2A2]" />
              <span>Call Direct</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
