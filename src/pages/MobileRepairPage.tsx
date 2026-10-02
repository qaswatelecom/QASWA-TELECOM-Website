import React from 'react';
import { BookingWizard } from '../components/booking/BookingWizard.tsx';
import { Sparkles, Clock, CheckCircle2, MessageCircle, Wrench, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const MobileRepairPage: React.FC = () => {
  const { settings } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00B2A2] mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Specialized Display Laboratory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Book Flagship Display Repair Diagnosis
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select your flagship device category, model, and specific display issue. Our specialized display technicians will examine your screen in our cleanroom facility.
          </p>

          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
              <span>Dedicated Display Specialists</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-[#00B2A2]" />
              <span>Original Panel Preservation</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#00B2A2]" />
              <span>Cleanroom Optical Lamination</span>
            </span>
          </div>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
};
