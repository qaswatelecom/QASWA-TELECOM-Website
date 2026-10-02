import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Model, Brand, DeviceCategory, Service } from '../types/index.ts';
import {
  ChevronLeft,
  Smartphone,
  Tablet,
  Watch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Layers,
  Cpu,
  MessageCircle,
  Clock,
  Shield,
  HelpCircle,
  Calendar,
  X,
  ArrowRight,
} from 'lucide-react';
import { generateBreadcrumbSchema, useJsonLd } from '../lib/seo.ts';

interface ModelDetailPageProps {
  modelSlug: string;
}

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ modelSlug }) => {
  const { settings, navigate } = useApp();
  const [model, setModel] = useState<Model | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [category, setCategory] = useState<DeviceCategory | null>(null);
  const [displayIssues, setDisplayIssues] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/models/${modelSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Model not found');
        return res.json();
      })
      .then((data) => {
        setModel(data.model);
        setBrand(data.brand);
        setCategory(data.category);
        setDisplayIssues(data.displayIssues || []);
        setServices(data.services || []);
        if (data.displayIssues && data.displayIssues.length > 0) {
          setSelectedIssue(data.displayIssues[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load model details:', err);
      })
      .finally(() => setLoading(false));
  }, [modelSlug]);

  const categoryName = category?.name || (model?.categorySlug === 'apple-watch' ? 'Apple Watch' : model?.categorySlug === 'ipad' ? 'iPad' : model?.categorySlug === 'tablet' ? 'Tablet' : 'Mobile');
  const categorySlug = category?.slug || model?.categorySlug || 'mobile';

  // Breadcrumbs Schema for SEO
  const breadcrumbItems = React.useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
    const items = [
      { name: 'Home', url: `${origin}/` },
      { name: categoryName, url: `${origin}/categories/${categorySlug}` },
    ];

    if (brand) {
      items.push({
        name: brand.name,
        url: `${origin}/categories/${categorySlug}/${brand.slug}`,
      });
    }

    if (model) {
      items.push({
        name: model.name,
        url: `${origin}/models/${model.slug}`,
      });
      items.push({
        name: 'Display Repair Services',
        url: `${origin}/models/${model.slug}`,
      });
    }

    return items;
  }, [categoryName, categorySlug, brand, model]);

  const breadcrumbSchema = React.useMemo(() => generateBreadcrumbSchema(breadcrumbItems), [breadcrumbItems]);
  useJsonLd(`breadcrumb-model-${modelSlug}`, breadcrumbSchema);

  // WhatsApp click handler
  const handleWhatsAppConsult = (issueName?: string) => {
    const issueToReport = issueName || selectedIssue || 'Display Malfunction / Broken Glass';
    const deviceName = model ? model.name : 'Flagship Device';
    const text = encodeURIComponent(
      `Hello QASWA TELECOM, I would like to enquire about display repair diagnosis for my ${deviceName}.\n\nReported Issue: ${issueToReport}\nDevice Category: ${categoryName}`
    );
    window.open(`https://wa.me/${cleanWhatsApp}?text=${text}`, '_blank');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerMobile || !model) return;

    setSubmittingBooking(true);
    try {
      const orderPayload = {
        customerName,
        customerMobile,
        customerCity,
        brandId: brand?.id || null,
        brandName: brand?.name || categoryName,
        modelId: model.id,
        modelName: model.name,
        serviceName: selectedIssue || 'Display Diagnosis',
        additionalNote: `Display Issue: ${selectedIssue}. Note: ${additionalNote}`,
        source: 'website_model_page',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingModalOpen(false);
          setCustomerName('');
          setCustomerMobile('');
          setAdditionalNote('');
        }, 2500);
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-[#00B2A2] border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Loading display repair services for model...</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="py-20 text-center mx-auto max-w-md px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Model Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">The requested model could not be found in our database.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded-xl bg-[#00B2A2] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const DeviceIcon = categorySlug === 'apple-watch' ? Watch : categorySlug === 'ipad' || categorySlug === 'tablet' ? Tablet : Smartphone;

  return (
    <div className="py-8 sm:py-12 bg-slate-50/50 dark:bg-[#0B1110] transition-colors min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* BREADCRUMB NAVIGATION:                                                    */}
        {/* Examples:                                                                 */}
        {/* Home → Mobile → Apple → iPhone 17 Pro Max → Display Repair Services       */}
        {/* Home → Apple Watch → Apple Watch Ultra 3 → Display Repair Services        */}
        {/* Home → iPad → iPad Pro 13-inch → Display Repair Services                  */}
        {/* Home → Tablet → Samsung → Galaxy Tab S10 Ultra → Display Repair Services  */}
        {/* ========================================================================= */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-[#00B2A2] transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li>
              <button
                onClick={() => navigate(`/categories/${categorySlug}`)}
                className="hover:text-[#00B2A2] transition-colors cursor-pointer"
              >
                {categoryName}
              </button>
            </li>

            {brand && (
              <>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <button
                    onClick={() => navigate(`/categories/${categorySlug}/${brand.slug}`)}
                    className="hover:text-[#00B2A2] transition-colors cursor-pointer"
                  >
                    {brand.name}
                  </button>
                </li>
              </>
            )}

            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="font-semibold text-slate-700 dark:text-slate-200">
              {model.name}
            </li>

            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="font-bold text-[#00B2A2]">
              Display Repair Services
            </li>
          </ol>
        </nav>

        {/* Model Hero Showcase Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 mb-10 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Device Image Showcase */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative h-64 sm:h-72 w-full max-w-sm rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group">
                {model.imageUrl ? (
                  <img
                    src={model.imageUrl}
                    alt={`${model.name} display`}
                    className="h-full w-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <DeviceIcon className="h-28 w-28 text-[#00B2A2]" />
                )}

                {/* Corner Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                    {categoryName}
                  </span>
                  {model.series && (
                    <span className="rounded-lg bg-[#00B2A2]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
                      {model.series}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Model Info & Highlights */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>Specialized Display Laboratory</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {model.name} Display Repair
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {model.description ||
                    `Specialized display repair and outer touch glass refurbishing for ${model.name}. Performed in our Class-5 dust-free optical cleanroom with original panel preservation.`}
                </p>

                {/* Display Engineering Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Original Panel Preservation
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Keep your original AMOLED/Retina panel when only front glass is cracked
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Laser Flex Bonding Available
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Eliminate green lines and white screen issues with cold laser bonding
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Cleanroom OCA Lamination
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Bubble-free optical autoclave bonding identical to factory standards
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                    <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        TrueTone & Sensor Calibration
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        Ambient light and digitizer sensor data programmed to ensure 100% fidelity
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="rounded-xl bg-[#00B2A2] px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#009b8d] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Display Diagnosis</span>
                </button>

                <button
                  onClick={() => handleWhatsAppConsult()}
                  className="rounded-xl bg-[#25D366] px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#1eb956] transition-all cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Consult Display Specialist on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: DISPLAY-RELATED ISSUES FOR THIS MODEL                          */}
        {/* ========================================================================= */}
        <div className="mb-12">
          <div className="mb-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Diagnostic Problem Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Display-Related Issues Reported & Solved for {model.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select the display fault your device is experiencing to consult our technicians:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayIssues.map((issue, idx) => {
              const isSelected = selectedIssue === issue;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIssue(issue)}
                  className={`group relative flex flex-col justify-between rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'border-[#00B2A2] bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10 ring-2 ring-[#00B2A2]/30 shadow-md'
                      : 'border-slate-200 bg-white hover:border-[#00B2A2]/60 dark:border-slate-800 dark:bg-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#00B2A2] text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:text-[#00B2A2]'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block group-hover:text-[#00B2A2] transition-colors">
                        {issue}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                        Fully repairable in our display cleanroom lab
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#00B2A2]">
                      {isSelected ? '✓ Selected Issue' : 'Click to select'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppConsult(issue);
                      }}
                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>Ask via WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: DEDICATED DISPLAY REPAIR SERVICES FOR THIS MODEL              */}
        {/* ========================================================================= */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
              <Layers className="h-4 w-4" />
              <span>Available Display Repair Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Specialized Display Solutions for {model.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Our certified screen laboratory handles every level of display repair, from glass lamination to laser micro-bonding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#00B2A2] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] dark:bg-[#00B2A2]/20">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      Display Exclusive
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {service.description ||
                      `High-precision display repair procedure designed specifically for ${model.name} panel specifications.`}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00B2A2]">
                    Cleanroom Calibrated
                  </span>
                  <button
                    onClick={() => handleWhatsAppConsult(service.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 px-3 py-1.5 text-xs font-bold text-[#00B2A2] hover:bg-[#00B2A2] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cleanroom Lab Standards Section */}
        <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/70 via-white to-teal-50/40 p-6 sm:p-8 dark:border-teal-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 shadow-xs mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 px-3 py-1 text-xs font-bold text-[#00B2A2] mb-2">
                <Cpu className="h-3.5 w-3.5" />
                <span>QASWA Cleanroom Engineering Standards</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Need Help Diagnosing Your {model.name} Screen?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Bring or send your device to our specialized laboratory for high-magnification optical stereomicroscope inspection. Our technicians will inspect the display flex cables, digitizer grid, and glass layer to recommend the exact solution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="rounded-xl bg-[#00B2A2] px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#009b8d] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Screen Diagnosis</span>
              </button>

              <button
                onClick={() => handleWhatsAppConsult()}
                className="rounded-xl border border-[#25D366] bg-transparent text-[#25D366] dark:text-[#25D366] hover:bg-[#25D366] hover:text-white px-5 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIAGNOSTIC BOOKING MODAL                                                  */}
      {/* ========================================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Diagnosis Request Registered!
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Our screen specialist for {model.name} will contact you shortly to coordinate intake.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#00B2A2] uppercase tracking-wider block mb-1">
                    Display Diagnostic Intake
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    Book Diagnosis for {model.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Selected Issue: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedIssue || 'Screen Malfunction'}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="e.g. Mumbai, Navi Mumbai, Thane"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Issue Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Describe how the damage occurred (e.g. dropped on corner, touch not responding, green lines after update)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="rounded-xl bg-[#00B2A2] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#009b8d] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submittingBooking ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
