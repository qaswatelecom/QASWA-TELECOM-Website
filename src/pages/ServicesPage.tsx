import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Clock, ChevronRight, Wrench, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, navigate } = useApp();

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00B2A2] mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Specialized Display Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Flagship Display Repair Services
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            QASWA TELECOM focuses exclusively on display restoration for high-end flagship smartphones, Apple Watch, iPad, and premium tablets.
          </p>

          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
              <span>Cleanroom Optical Lamination</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4 text-[#00B2A2]" />
              <span>Preserves Factory OLED Panel</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#00B2A2]" />
              <span>Laser Micro-Welding</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serv) => (
            <div
              key={serv.id}
              onClick={() => navigate(`/services/${serv.slug}`)}
              className="cursor-pointer group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-[#00B2A2] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#00B2A2]">
                    Display Specialist
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors mb-2">
                  {serv.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {serv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  {serv.estimatedDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{serv.estimatedDuration}</span>
                    </span>
                  )}
                  <span className="text-[#00B2A2] font-medium">In-Lab Diagnosis</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#00B2A2] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
