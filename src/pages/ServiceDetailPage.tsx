import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Service, Model } from '../types/index.ts';
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  MessageCircle,
  Wrench,
  Smartphone,
  Sparkles,
  Layers,
} from 'lucide-react';
import { generateServiceSchema, useJsonLd } from '../lib/seo.ts';

interface ServiceDetailPageProps {
  serviceSlug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceSlug }) => {
  const { services, settings, navigate } = useApp();
  const [service, setService] = useState<Service | null>(null);
  const [compatibleModels, setCompatibleModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  useEffect(() => {
    const found = services.find((s) => s.slug === serviceSlug);
    if (found) {
      setService(found);
      fetch(`/api/services/${found.id}/models`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setCompatibleModels(data))
        .catch(() => setCompatibleModels([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [serviceSlug, services]);

  const serviceSchema = React.useMemo(() => {
    if (!service) return null;
    return generateServiceSchema({
      name: service.name,
      description: service.description || undefined,
      providerName: siteName,
      providerUrl: typeof window !== 'undefined' ? window.location.origin : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }, [service, siteName]);

  useJsonLd(`service-${serviceSlug}`, serviceSchema);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading display service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Display Service Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">The requested display service does not exist or has been updated.</p>
        <button
          onClick={() => navigate('/services')}
          className="mt-4 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white"
        >
          View All Display Services
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/services')}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 mb-6 dark:hover:text-white cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>All Display Services</span>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00B2A2] block mb-1">
                Display Specialization
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {service.name}
              </h1>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-400 block">Service Type</span>
              <span className="text-sm font-extrabold text-[#00B2A2]">
                In-Lab Diagnosis & Repair
              </span>
            </div>
          </div>

          <div className="my-6 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
            {service.estimatedDuration && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-medium">
                <Clock className="h-4 w-4 text-[#00B2A2]" />
                <span>Turnaround: {service.estimatedDuration}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 px-3 py-1.5 font-medium">
              <Sparkles className="h-4 w-4 text-[#00B2A2]" />
              <span>Flagship Precision Lab</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            <p className="text-base">{service.description}</p>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-6 mb-2">
              Why Choose QASWA TELECOM for Display Services?
            </h4>
            <ul className="space-y-2 list-none p-0">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                <span>Original panel preservation whenever possible through OCA glass de-bonding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                <span>Specialized laser micro-welding for green screen and display line restoration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                <span>Cleanroom workstations with optical autoclaves and zero-dust lamination.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                <span>Full TrueTone, under-display biometric sensor, and touch digitizer calibration.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                navigate('/mobile-repair');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#009e90] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Wrench className="h-4 w-4" />
              <span>Book Display Diagnosis</span>
            </button>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello ${siteName}, I would like to consult about: ${service.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600 fill-current" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          {compatibleModels.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Supported Flagship Models for this Service
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {compatibleModels.slice(0, 16).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate('/mobile-repair')}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-center cursor-pointer hover:border-[#00B2A2] transition-colors"
                  >
                    <Smartphone className="h-4 w-4 text-[#00B2A2] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
