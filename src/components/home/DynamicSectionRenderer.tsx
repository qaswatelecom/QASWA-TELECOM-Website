import React, { useState, useEffect } from 'react';
import { CMSSection, ServiceCenter, Testimonial, FAQ } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { BookingWizard } from '../booking/BookingWizard.tsx';
import { AutoSlideshowBanner } from './AutoSlideshowBanner.tsx';
import { generateFaqSchema, useJsonLd } from '../../lib/seo.ts';
import {
  Smartphone,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Award,
  Users,
} from 'lucide-react';

export const DynamicSectionRenderer: React.FC = () => {
  const { brands, services, settings, navigate } = useApp();
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [centers, setCenters] = useState<ServiceCenter[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const [secRes, centRes, testRes, faqRes] = await Promise.all([
          fetch('/api/cms-sections'),
          fetch('/api/service-centers'),
          fetch('/api/testimonials'),
          fetch('/api/faqs?page=home'),
        ]);

        if (secRes.ok) setSections(await secRes.json());
        if (centRes.ok) setCenters(await centRes.json());
        if (testRes.ok) setTestimonials(await testRes.json());
        if (faqRes.ok) setFaqs(await faqRes.json());
      } catch (err) {
        console.error('Failed to load CMS data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCMS();
  }, []);

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  // Injects FAQPage JSON-LD schema into document head
  const faqSchema = React.useMemo(() => {
    return faqs.length > 0 ? generateFaqSchema(faqs) : null;
  }, [faqs]);

  useJsonLd('faq-home', faqSchema);

  if (loading && sections.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading website experience...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* Dynamic Auto Slideshow Banner with Qaswa Telecom Promotions & Controls */}
      <AutoSlideshowBanner />

      {sections
        .filter((s) => s.isVisible && s.sectionType !== 'hero')
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((sec) => {
          switch (sec.sectionType) {
            case 'hero':
              return (
                <section
                  key={sec.id}
                  className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-slate-100 dark:border-slate-800/60"
                >
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                      <div className="lg:col-span-7 space-y-6">
                        {sec.subtitle && (
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#00B2A2] tracking-wide">
                            <Sparkles className="h-4 w-4" />
                            <span>{sec.subtitle}</span>
                          </div>
                        )}

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight dark:text-white">
                          {sec.title}
                        </h1>

                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                          {sec.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <button
                            onClick={() => {
                              const el = document.getElementById('booking-wizard-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                              else navigate(sec.buttonUrl || '/mobile-repair');
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.98] transition-all"
                          >
                            <Wrench className="h-4 w-4" />
                            <span>{sec.buttonText || 'Book Repair Now'}</span>
                          </button>

                          <a
                            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                              `Hello ${settings.SITE_NAME || 'Qaswa Telecom'}, I would like to inquire about walk-in mobile repair service.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 text-emerald-600 fill-current" />
                            <span>WhatsApp Service Desk</span>
                          </a>
                        </div>

                        {/* Unboxed trust metadata (Zero-pill discipline) */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-[#00B2A2]" />
                            <span>Specialized Display Engineering</span>
                          </div>
                          <span aria-hidden="true">·</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#00B2A2]" />
                            <span>30 Min Express Turnaround</span>
                          </div>
                          <span aria-hidden="true">·</span>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
                            <span>No Prepayment Required</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl dark:border-slate-800">
                            <img
                              src={
                                sec.imageUrl ||
                                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'
                              }
                              alt="Mobile repair workbench"
                              className="h-80 w-full object-cover lg:h-96"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'booking_widget':
              return (
                <section
                  key={sec.id}
                  id="booking-wizard-section"
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
                >
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    {sec.subtitle && (
                      <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {sec.title || 'Start Your Repair Enquiry'}
                    </h2>
                    {sec.description && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {sec.description}
                      </p>
                    )}
                  </div>

                  <BookingWizard />
                </section>
              );

            case 'popular_brands':
              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
                    <div>
                      {sec.subtitle && (
                        <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.description && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                          {sec.description}
                        </p>
                      )}
                    </div>
                    {sec.buttonText && (
                      <button
                        onClick={() => navigate(sec.buttonUrl || '/brands')}
                        className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                      >
                        <span>{sec.buttonText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {brands.slice(0, 10).map((b) => {
                      const bSlugLower = (b.slug || '').toLowerCase();
                      const bNameLower = (b.name || '').toLowerCase();
                      const targetBrandSlug =
                        bSlugLower === 'apple' || bSlugLower === 'iphone' || bNameLower === 'apple'
                          ? 'apple-iphone'
                          : b.slug;
                      const catSlug = b.categorySlug || 'mobile';

                      return (
                        <div
                          key={b.id}
                          onClick={() => navigate(`/repair-models/${catSlug}/${targetBrandSlug}`)}
                          className="cursor-pointer group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-[#00B2A2] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 mb-3 group-hover:scale-105 transition-transform">
                          {b.logoUrl ? (
                            <img src={b.logoUrl} alt={b.name} className="h-8 w-8 object-contain" />
                          ) : (
                            <Smartphone className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {b.name}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Explore Models</span>
                      </div>
                    );
                  })}
                  </div>
                </section>
              );

            case 'services':
              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
                    <div>
                      {sec.subtitle && (
                        <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.description && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                          {sec.description}
                        </p>
                      )}
                    </div>
                    {sec.buttonText && (
                      <button
                        onClick={() => navigate(sec.buttonUrl || '/services')}
                        className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                      >
                        <span>{sec.buttonText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((serv) => (
                      <div
                        key={serv.id}
                        onClick={() => navigate(`/services/${serv.slug}`)}
                        className="cursor-pointer group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-[#00B2A2] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                              {serv.name}
                            </span>
                            {serv.priceEstimate && (
                              <span className="text-xs font-semibold text-[#00B2A2]">
                                {serv.priceEstimate}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {serv.description}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800">
                          {serv.estimatedDuration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>{serv.estimatedDuration}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[#00B2A2]">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Display Specialist</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'how_it_works':
              let steps = [
                { step: '01', title: 'Select Device & Service', desc: 'Pick your phone brand, exact model, and needed repair service from our interactive booking tool.' },
                { step: '02', title: 'Enter Customer Details', desc: 'Provide your contact info and preferred appointment date & time slot at our service center.' },
                { step: '03', title: 'Proceed with WhatsApp', desc: 'Your enquiry is securely saved into our system and immediately opens WhatsApp with pre-filled details.' },
                { step: '04', title: 'Visit Service Center', desc: 'Walk into your chosen service center, get your phone repaired in 30 minutes, and pay directly after service.' },
              ];
              if (sec.contentJson) {
                try {
                  steps = JSON.parse(sec.contentJson);
                } catch (e) {}
              }

              return (
                <section
                  key={sec.id}
                  className="bg-slate-50 py-16 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800"
                >
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      {sec.subtitle && (
                        <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.description && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {sec.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {steps.map((st: any, idx: number) => (
                        <div
                          key={idx}
                          className="relative rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
                        >
                          <span className="text-3xl font-black text-[#00B2A2]/30 dark:text-[#00B2A2]/20 block mb-2 font-mono">
                            {st.step || `0${idx + 1}`}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                            {st.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {st.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'statistics':
              let stats = [
                { label: 'Repairs Completed', value: '45,000+' },
                { label: 'Average Turnaround', value: '35 Mins' },
                { label: 'Customer Satisfaction', value: '99.4%' },
                { label: 'Certified Technicians', value: '50+' },
              ];
              if (sec.contentJson) {
                try {
                  stats = JSON.parse(sec.contentJson);
                } catch (e) {}
              }

              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-700/60">
                      {stats.map((item: any, i: number) => (
                        <div key={i} className="pt-4 sm:pt-0 sm:px-4">
                          <span className="text-2xl sm:text-4xl font-extrabold text-[#00B2A2] block mb-1">
                            {item.value}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'why_choose_us':
              let benefits = [
                { title: 'Display Repair Specialists', desc: '100% focused exclusively on display optics, touch glass, and digitizer restoration.' },
                { title: 'Specialized Cleanroom Equipment', desc: 'High-purity OCA autoclaves, freezing separators, and laser flex bonding machines.' },
                { title: 'Transparent Walk-In Service', desc: 'Watch your device being repaired directly at our transparent service counters.' },
                { title: 'Data Privacy Protection', desc: 'We never touch your personal photos, files or private app data during hardware servicing.' },
              ];
              if (sec.contentJson) {
                try {
                  benefits = JSON.parse(sec.contentJson);
                } catch (e) {}
              }

              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    {sec.subtitle && (
                      <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {sec.title}
                    </h2>
                    {sec.description && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {sec.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {benefits.map((b: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00B2A2]/10 text-[#00B2A2] mb-3">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                          {b.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'service_centers':
              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
                    <div>
                      {sec.subtitle && (
                        <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.description && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                          {sec.description}
                        </p>
                      )}
                    </div>
                    {sec.buttonText && (
                      <button
                        onClick={() => navigate(sec.buttonUrl || '/service-centers')}
                        className="mt-3 sm:mt-0 inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                      >
                        <span>{sec.buttonText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {centers.map((c) => (
                      <div
                        key={c.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm"
                      >
                        {c.imageUrl && (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="h-44 w-full object-cover"
                          />
                        )}
                        <div className="p-5">
                          <span className="text-[11px] font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                            {c.city}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            {c.name}
                          </h3>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                              <span>{c.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                              <span>{c.phone}</span>
                            </div>
                            {c.timing && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                                <span>{c.timing}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            {c.mapUrl && (
                              <a
                                href={c.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                              >
                                View Map
                              </a>
                            )}
                            <button
                              onClick={() => {
                                const el = document.getElementById('booking-wizard-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                else navigate('/mobile-repair');
                              }}
                              className="flex-1 text-center rounded-lg bg-[#00B2A2] py-1.5 text-xs font-semibold text-white hover:bg-[#009e90]"
                            >
                              Book Here
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'testimonials':
              return (
                <section
                  key={sec.id}
                  className="bg-slate-50 py-16 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800"
                >
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                      {sec.subtitle && (
                        <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {sec.title}
                      </h2>
                      {sec.description && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {sec.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {testimonials.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div>
                            <div className="flex items-center gap-1 text-amber-400 mb-3">
                              {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                                <Star key={idx} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4">
                              "{t.review}"
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {t.customerName}
                            </span>
                            {t.deviceRepaired && (
                              <span className="text-[11px] text-slate-400">
                                {t.deviceRepaired}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'faq':
              return (
                <section key={sec.id} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8">
                    {sec.subtitle && (
                      <span className="text-xs font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {sec.title}
                    </h2>
                    {sec.description && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {sec.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {faqs.map((f) => {
                      const isOpen = openFaq === f.id;
                      return (
                        <div
                          key={f.id}
                          className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : f.id)}
                            className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white"
                          >
                            <span>{f.question}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 transition-transform ${
                                isOpen ? 'rotate-180 text-[#00B2A2]' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                              {f.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

            case 'cta':
              return (
                <section key={sec.id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-900 p-8 sm:p-12 text-center text-white shadow-xl">
                    <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
                      {sec.title}
                    </h2>
                    <p className="text-sm text-emerald-100 max-w-2xl mx-auto mb-6">
                      {sec.description}
                    </p>
                    <button
                      onClick={() => {
                        const el = document.getElementById('booking-wizard-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else navigate('/mobile-repair');
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-teal-900 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition-all"
                    >
                      <Wrench className="h-4 w-4 text-[#00B2A2]" />
                      <span>{sec.buttonText || 'Book Walk-In Slot'}</span>
                    </button>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
    </div>
  );
};
