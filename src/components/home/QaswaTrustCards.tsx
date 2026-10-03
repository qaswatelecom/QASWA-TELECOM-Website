import React from 'react';
import { Home, Layers, Users, Cpu, Sparkles } from 'lucide-react';
import { usePageContent, HomePageContent, DEFAULT_HOME_CONTENT } from '../../lib/pageContent.ts';

export const QaswaTrustCards: React.FC = () => {
  const { content } = usePageContent<HomePageContent>('home');
  const trustData = content?.trustCards || DEFAULT_HOME_CONTENT.trustCards;

  const defaultIcons = [
    <Home className="h-5 w-5 text-[#00B2A2]" key="home" />,
    <Layers className="h-5 w-5 text-[#00B2A2]" key="layers" />,
    <Users className="h-5 w-5 text-[#00B2A2]" key="users" />,
    <Cpu className="h-5 w-5 text-[#00B2A2]" key="cpu" />,
  ];

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{trustData.badge || 'QASWA TELECOM DISPLAY REPAIR'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {trustData.title || 'One Trusted Place for All Your Flagship Display Repairs'}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {trustData.subtitle || 'From smartphones and tablets to Apple Watch and iPads, get professional display repair support with transparent diagnosis, specialized optical equipment, and experienced technicians.'}
          </p>
        </div>

        {/* Trust Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {(trustData.cards || DEFAULT_HOME_CONTENT.trustCards.cards).map((feat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs hover:border-[#00B2A2] hover:shadow-md transition-all"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center mb-3">
                  {defaultIcons[idx % defaultIcons.length]}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

