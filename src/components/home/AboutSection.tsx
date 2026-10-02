import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { usePageContent, HomePageContent, DEFAULT_HOME_CONTENT } from '../../lib/pageContent.ts';
import {
  Sparkles,
  Shield,
  Layers,
  Cpu,
  CheckCircle2,
  Wrench,
  Award,
  ArrowRight,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { navigate, settings } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const { content } = usePageContent<HomePageContent>('home');
  const aboutSec = content?.aboutSection || DEFAULT_HOME_CONTENT.aboutSection;

  return (
    <section id="about-section" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Image Collage / Visual Proof */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle backdrop glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00B2A2]/20 to-teal-400/20 rounded-3xl filter blur-2xl opacity-60" />

              <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl dark:border-slate-800">
                <img
                  src={aboutSec.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=80'}
                  alt={`${siteName} Display Cleanroom Laboratory`}
                  className="h-96 w-full object-cover sm:h-[460px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Laboratory Badge */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/75 backdrop-blur-md p-4 border border-white/10 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#00B2A2] flex items-center justify-center shrink-0">
                      <Cpu className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">
                        {aboutSec.floatingBadgeTitle || 'Dedicated Display Cleanroom'}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {aboutSec.floatingBadgeDesc || 'OCA vacuum laminators & laser flex micro-welding stations'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Engineering Heritage */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>{aboutSec.badge || `About ${siteName}`}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">Exclusive Display Craft</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {aboutSec.title || 'Pioneering Display Repair for High-End Flagship Devices'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {aboutSec.description}
            </p>

            {aboutSec.secondaryText && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {aboutSec.secondaryText}
              </p>
            )}

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
                  {aboutSec.pillar1Title || 'Original Panel Preservation'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {aboutSec.pillar1Desc || 'Retains 120Hz ProMotion, TrueTone, and factory color gamut.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
                  {aboutSec.pillar2Title || 'Laser Trace Micro-Bonding'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {aboutSec.pillar2Desc || 'Resolves green screen of death and vertical line defects directly.'}
                </p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('display-repairs-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/services');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Explore Display Capabilities</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
