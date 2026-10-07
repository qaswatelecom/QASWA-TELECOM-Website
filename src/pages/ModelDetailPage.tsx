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
  Check,
  Zap,
  Moon,
  Fingerprint,
  Sliders,
  ShieldAlert,
  Monitor,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { generateBreadcrumbSchema, generateServiceSchema, useJsonLd, usePageSeo } from '../lib/seo.ts';
import { getIssueIcon, getIssueStyles } from '../lib/issueIcons.ts';

const getIssueMeta = (issue: string) => {
  const lower = issue.toLowerCase();
  if (lower.includes('glass') || lower.includes('cracked')) {
    return {
      icon: Layers,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20',
      badge: 'Glass Layer Malfunction',
      selectedClass: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10',
    };
  }
  if (lower.includes('green & pink') || lower.includes('green and pink') || lower.includes('pink line') || lower.includes('vertical')) {
    return {
      icon: Sliders,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20',
      badge: 'Laser Line Fault',
      selectedClass: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10',
    };
  }
  if (lower.includes('green screen') || lower.includes('white screen')) {
    return {
      icon: Monitor,
      color: 'text-green-500 bg-green-500/10 border-green-500/20 dark:bg-green-500/20',
      badge: 'Panel Controller Bias',
      selectedClass: 'border-green-500 ring-2 ring-green-500/20 bg-green-500/5 dark:bg-green-500/10',
    };
  }
  if (lower.includes('black screen') || lower.includes('blank')) {
    return {
      icon: Moon,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 dark:bg-indigo-500/20',
      badge: 'No Display / Backlight Off',
      selectedClass: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10',
    };
  }
  if (lower.includes('touch') || lower.includes('digitizer')) {
    return {
      icon: Fingerprint,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20 dark:bg-sky-500/20',
      badge: 'Digitizer Touch Lag',
      selectedClass: 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10',
    };
  }
  if (lower.includes('flicker') || lower.includes('tint') || lower.includes('distortion')) {
    return {
      icon: Zap,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:bg-purple-500/20',
      badge: 'Refresh Voltage Flickering',
      selectedClass: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10',
    };
  }
  if (lower.includes('foldable') || lower.includes('hinge') || lower.includes('flex')) {
    return {
      icon: Cpu,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20',
      badge: 'Hinge & Flex Stress',
      selectedClass: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10',
    };
  }
  if (lower.includes('damage') || lower.includes('broken')) {
    return {
      icon: ShieldAlert,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20',
      badge: 'Physical Screen Impact',
      selectedClass: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10',
    };
  }
  return {
    icon: Sparkles,
    color: 'text-[#00B2A2] bg-[#00B2A2]/10 border-[#00B2A2]/20 dark:bg-[#00B2A2]/20',
    badge: 'Hardware Screen Issue',
    selectedClass: 'border-[#00B2A2] ring-2 ring-[#00B2A2]/20 bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10',
  };
};

interface ModelDetailPageProps {
  modelSlug: string;
}

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ modelSlug }) => {
  const { settings, navigate } = useApp();
  const [model, setModel] = useState<Model | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [category, setCategory] = useState<DeviceCategory | null>(null);
  const [displayIssues, setDisplayIssues] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerCity, setCustomerCity] = useState('Mumbai');
  const [additionalNote, setAdditionalNote] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Customer WhatsApp Enquiry Submission State
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquiryCustomerName, setEnquiryCustomerName] = useState('');
  const [enquiryCustomerPhone, setEnquiryCustomerPhone] = useState('');
  const [enquiryCustomerCity, setEnquiryCustomerCity] = useState('');
  const [touchedFields, setTouchedFields] = useState<{
    name?: boolean;
    phone?: boolean;
    city?: boolean;
  }>({});
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
    city?: string;
    issues?: string;
  }>({});

  const validateEnquiryForm = (name: string, phone: string, city: string, issues: string[]) => {
    const errors: { name?: string; phone?: string; city?: string; issues?: string } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Full Name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Please enter your full name.';
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errors.phone = 'Phone Number is required.';
    } else {
      let digits = trimmedPhone.replace(/\D/g, '');
      if (digits.startsWith('91') && digits.length === 12) {
        digits = digits.substring(2);
      } else if (digits.startsWith('0') && digits.length === 11) {
        digits = digits.substring(1);
      }

      if (digits.length !== 10) {
        errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
      } else if (!/^[6-9]/.test(digits)) {
        errors.phone = 'Indian mobile number must start with 6, 7, 8, or 9.';
      }
    }

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      errors.city = 'City is required.';
    } else if (trimmedCity.length < 2) {
      errors.city = 'Please enter your city.';
    }

    if (issues.length === 0) {
      errors.issues = 'Please select at least one display issue.';
    }

    return errors;
  };

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
          const firstTitle = typeof data.displayIssues[0] === 'object' && data.displayIssues[0]?.title
            ? data.displayIssues[0].title
            : String(data.displayIssues[0]);
          setSelectedIssues([firstTitle]);
        }
      })
      .catch((err) => {
        console.error('Failed to load model details:', err);
      })
      .finally(() => setLoading(false));
  }, [modelSlug]);

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

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
      const bSlugLower = (brand.slug || '').toLowerCase();
      const bNameLower = (brand.name || '').toLowerCase();
      const targetBrandSlug =
        bSlugLower === 'apple' || bSlugLower === 'iphone' || bNameLower === 'apple'
          ? 'apple-iphone'
          : brand.slug;
      items.push({
        name: brand.name,
        url: `${origin}/repair-models/${categorySlug}/${targetBrandSlug}`,
      });
    }

    if (model) {
      items.push({
        name: model.name,
        url: `${origin}/repair/${model.slug}`,
      });
      items.push({
        name: 'Display Repair Services',
        url: `${origin}/repair/${model.slug}`,
      });
    }

    return items;
  }, [categoryName, categorySlug, brand, model]);

  const breadcrumbSchema = React.useMemo(() => generateBreadcrumbSchema(breadcrumbItems), [breadcrumbItems]);
  useJsonLd(`breadcrumb-model-${modelSlug}`, breadcrumbSchema);

  // Dynamic Model Page SEO & Service Schema
  const modelPageTitle =
    model?.seoTitle || `${model?.name || 'Device'} Display Repair in Mumbai | QASWA TELECOM`;
  const modelPageDesc =
    model?.seoDescription ||
    `Dedicated display repair solutions for ${model?.name || 'device'} in Borivali West, Mumbai. Screen replacement, cracked touch glass refurbishing, and green line laser fix.`;

  usePageSeo(modelPageTitle, modelPageDesc);

  const modelServiceSchema = React.useMemo(() => {
    if (!model) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
    return generateServiceSchema({
      name: `${model.name} Display Repair Service`,
      description: modelPageDesc,
      serviceType: 'Display Repair & Screen Replacement',
      url: `${origin}/repair/${model.slug}`,
      providerName: 'QASWA TELECOM',
      providerUrl: origin,
    });
  }, [model, modelPageDesc]);
  useJsonLd(`service-model-${modelSlug}`, modelServiceSchema);

  // WhatsApp click handler
  const handleWhatsAppConsult = (issueName?: string) => {
    const issueToReport = issueName || (selectedIssues.length > 0 ? selectedIssues.join(', ') : 'Display Malfunction / Broken Glass');
    const deviceName = model ? model.name : 'Flagship Device';
    const text = encodeURIComponent(
      `Hello QASWA TELECOM, I would like to enquire about display repair diagnosis for my ${deviceName}.\n\nReported Issue: ${issueToReport}\nDevice Category: ${categoryName}`
    );
    window.open(`https://wa.me/${cleanWhatsApp}?text=${text}`, '_blank');
  };

  // Flow: Device -> Brand -> Model -> Display Issues (Multi-Select) -> Proceed With WhatsApp
  // Saves enquiry in PostgreSQL database first, then opens WhatsApp with formatted message
  const handleProceedWithWhatsApp = async () => {
    if (!model || submittingEnquiry) return;

    // Mark fields as touched for inline validation UI
    setTouchedFields({ name: true, phone: true, city: true });

    const errors = validateEnquiryForm(
      enquiryCustomerName,
      enquiryCustomerPhone,
      enquiryCustomerCity,
      selectedIssues
    );
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = errors.name || errors.phone || errors.city || errors.issues;
      setEnquiryError(firstError || 'Please complete all required fields.');
      return;
    }

    setSubmittingEnquiry(true);
    setEnquiryError(null);

    try {
      let cleanPhone = enquiryCustomerPhone.trim().replace(/\D/g, '');
      if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
        cleanPhone = cleanPhone.substring(2);
      } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
        cleanPhone = cleanPhone.substring(1);
      }

      const payload = {
        deviceCategory: categoryName,
        brand: brand?.name || 'Mobile',
        model: model.name,
        displayIssue: selectedIssues.join(', '),
        displayIssues: selectedIssues,
        customerName: enquiryCustomerName.trim(),
        customerPhone: cleanPhone,
        customerCity: enquiryCustomerCity.trim(),
        customerMessage: additionalNote.trim() || undefined,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setEnquirySuccess(true);

      // WhatsApp message matching the required format:
      // Hello QASWA TELECOM,
      //
      // I would like to enquire about a display repair.
      //
      // Name: [Customer Name]
      // Phone: [Customer Phone]
      // City: [Customer City]
      //
      // Device: [Device Category]
      // Brand: [Brand]
      // Model: [Model]
      //
      // Display Issue(s):
      // - [Issue 1]
      // - [Issue 2]
      //
      // Please contact me regarding this enquiry.
      const issuesListFormatted = selectedIssues.map((iss) => `- ${iss}`).join('\n');
      const formattedWhatsAppMsg =
        `Hello QASWA TELECOM,\n\n` +
        `I would like to enquire about a display repair.\n\n` +
        `Name: ${payload.customerName}\n` +
        `Phone: ${payload.customerPhone}\n` +
        `City: ${payload.customerCity}\n\n` +
        `Device: ${payload.deviceCategory}\n` +
        `Brand: ${payload.brand}\n` +
        `Model: ${payload.model}\n\n` +
        `Display Issue(s):\n` +
        `${issuesListFormatted}\n\n` +
        `Please contact me regarding this enquiry.`;

      const targetUrl = data.whatsappUrl || `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(formattedWhatsAppMsg)}`;

      setTimeout(() => {
        window.open(targetUrl, '_blank');
        setSubmittingEnquiry(false);
      }, 500);
    } catch (err: any) {
      console.error('Enquiry submission failed:', err);
      setEnquiryError(err.message || 'Failed to record enquiry. Please try again.');
      setSubmittingEnquiry(false);
    }
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
        serviceName: selectedIssues.length > 0 ? selectedIssues.join(' + ') : 'Display Diagnosis',
        additionalNote: `Display Issues: ${selectedIssues.join(', ')}. Note: ${additionalNote}`,
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
                    onClick={() => {
                      const bSlugLower = (brand.slug || '').toLowerCase();
                      const bNameLower = (brand.name || '').toLowerCase();
                      const targetBrandSlug =
                        bSlugLower === 'apple' || bSlugLower === 'iphone' || bNameLower === 'apple'
                          ? 'apple-iphone'
                          : brand.slug;
                      navigate(`/repair-models/${categorySlug}/${targetBrandSlug}`);
                    }}
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
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: DISPLAY-RELATED ISSUES FOR THIS MODEL (MULTI-SELECT)           */}
        {/* ========================================================================= */}
        <div id="display-issues-section" className="mb-12">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Diagnostic Problem Assessment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Display-Related Issues Reported & Solved for {model.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Select one or multiple display faults your device is experiencing. You can choose all problems that apply:
            </p>
          </div>

          {/* Multi-Select Issue Cards with Issue Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayIssues.map((issueItem, idx) => {
              const issueTitle = typeof issueItem === 'object' && issueItem?.title ? issueItem.title : String(issueItem);
              const issueIconName = typeof issueItem === 'object' && issueItem?.icon ? issueItem.icon : undefined;
              const issueBadge = typeof issueItem === 'object' && issueItem?.badge ? issueItem.badge : undefined;
              const issueColor = typeof issueItem === 'object' && issueItem?.color ? issueItem.color : undefined;

              const isSelected = selectedIssues.includes(issueTitle);
              const meta = getIssueMeta(issueTitle);
              const IssueIcon = issueIconName ? getIssueIcon(issueIconName) : meta.icon;
              const styles = issueColor ? getIssueStyles(issueColor) : { color: meta.color, selectedClass: meta.selectedClass };

              return (
                <div
                  key={idx}
                  onClick={() => toggleIssue(issueTitle)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border select-none ${
                    isSelected
                      ? styles.selectedClass + ' shadow-md'
                      : 'border-slate-200 bg-white hover:border-[#00B2A2]/60 dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Issue Icon & Checkbox */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className={`flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-xl shrink-0 border transition-transform duration-200 group-hover:scale-105 ${styles.color}`}
                      >
                        {typeof issueItem === 'object' && issueItem?.customIconUrl ? (
                          <img
                            src={issueItem.customIconUrl}
                            alt={issueTitle}
                            className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <IssueIcon className="h-7 w-7 sm:h-8 sm:w-8" />
                        )}
                      </div>

                      {/* Custom Multi-Select Checkbox */}
                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#00B2A2] text-white shadow-xs'
                            : 'border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-[#00B2A2]'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Issue Name & Diagnostic Badge */}
                    <span className="text-sm font-black text-slate-900 dark:text-white block group-hover:text-[#00B2A2] transition-colors leading-snug">
                      {issueTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      {issueBadge || `${meta.badge} • Certified cleanroom repair`}
                    </span>
                  </div>

                  {/* Bottom selection state */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-[#00B2A2]' : 'text-slate-400 dark:text-slate-500'}`}>
                      {isSelected ? '✓ Selected' : 'Click to select'}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Added to Enquiry
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* PROMINENT "PROCEED WITH WHATSAPP" ENQUIRY PANEL (BOTTOM CENTRE)          */}
          {/* ========================================================================= */}
          <div className="mt-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-white via-emerald-50/30 to-teal-50/40 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20 p-6 sm:p-8 text-center shadow-lg dark:border-emerald-500/30">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Selected Display Issues ({selectedIssues.length})</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Proceed With WhatsApp Enquiry
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
                Device: <strong className="text-slate-800 dark:text-slate-200">{categoryName}</strong> • Brand: <strong className="text-slate-800 dark:text-slate-200">{brand?.name || 'Device'}</strong> • Model: <strong className="text-slate-800 dark:text-slate-200">{model.name}</strong>
              </p>

              {/* Badges of all currently selected issues */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {selectedIssues.length === 0 ? (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                    Please click at least one display issue above to continue
                  </span>
                ) : (
                  selectedIssues.map((iss, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-extrabold shadow-xs"
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>{iss}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIssue(iss);
                        }}
                        className="ml-1 hover:text-rose-200 cursor-pointer"
                        title="Remove issue"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Mandatory Customer Details Form */}
              <div className="mt-6 w-full max-w-xl text-left bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#00B2A2]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Customer Information
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                    * All fields mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Full Name Field */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={enquiryCustomerName}
                      onChange={(e) => {
                        setEnquiryCustomerName(e.target.value);
                        if (touchedFields.name) {
                          const errs = validateEnquiryForm(e.target.value, enquiryCustomerPhone, enquiryCustomerCity, selectedIssues);
                          setValidationErrors((prev) => ({ ...prev, name: errs.name }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields((prev) => ({ ...prev, name: true }));
                        const errs = validateEnquiryForm(enquiryCustomerName, enquiryCustomerPhone, enquiryCustomerCity, selectedIssues);
                        setValidationErrors((prev) => ({ ...prev, name: errs.name }));
                      }}
                      placeholder="Enter your full name"
                      className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                        touchedFields.name && validationErrors.name
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2]'
                      }`}
                    />
                    {touchedFields.name && validationErrors.name && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{validationErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Phone Number <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="tel"
                      value={enquiryCustomerPhone}
                      onChange={(e) => {
                        setEnquiryCustomerPhone(e.target.value);
                        if (touchedFields.phone) {
                          const errs = validateEnquiryForm(enquiryCustomerName, e.target.value, enquiryCustomerCity, selectedIssues);
                          setValidationErrors((prev) => ({ ...prev, phone: errs.phone }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields((prev) => ({ ...prev, phone: true }));
                        const errs = validateEnquiryForm(enquiryCustomerName, enquiryCustomerPhone, enquiryCustomerCity, selectedIssues);
                        setValidationErrors((prev) => ({ ...prev, phone: errs.phone }));
                      }}
                      placeholder="Enter your phone number"
                      className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                        touchedFields.phone && validationErrors.phone
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2]'
                      }`}
                    />
                    {touchedFields.phone && validationErrors.phone && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{validationErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* City Field */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      City <span className="text-rose-500 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={enquiryCustomerCity}
                      onChange={(e) => {
                        setEnquiryCustomerCity(e.target.value);
                        if (touchedFields.city) {
                          const errs = validateEnquiryForm(enquiryCustomerName, enquiryCustomerPhone, e.target.value, selectedIssues);
                          setValidationErrors((prev) => ({ ...prev, city: errs.city }));
                        }
                      }}
                      onBlur={() => {
                        setTouchedFields((prev) => ({ ...prev, city: true }));
                        const errs = validateEnquiryForm(enquiryCustomerName, enquiryCustomerPhone, enquiryCustomerCity, selectedIssues);
                        setValidationErrors((prev) => ({ ...prev, city: errs.city }));
                      }}
                      placeholder="Enter your city"
                      className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition-colors ${
                        touchedFields.city && validationErrors.city
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2]'
                      }`}
                    />
                    {touchedFields.city && validationErrors.city && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{validationErrors.city}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Centre "Proceed With WhatsApp" CTA */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleProceedWithWhatsApp}
                  disabled={submittingEnquiry}
                  className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base sm:text-lg font-black text-white shadow-xl transition-all cursor-pointer ${
                    submittingEnquiry
                      ? 'bg-[#008f82] opacity-90 cursor-wait'
                      : 'bg-[#00b2a2] hover:bg-[#009b8d] hover:shadow-[#00b2a2]/35 hover:scale-[1.02] active:scale-[0.99]'
                  }`}
                >
                  {submittingEnquiry ? (
                    <RefreshCw className="h-6 w-6 animate-spin text-white" />
                  ) : enquirySuccess ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <MessageCircle className="h-6 w-6 fill-current" />
                  )}
                  <span>
                    {submittingEnquiry
                      ? 'Saving enquiry...'
                      : enquirySuccess
                      ? 'Saved! Opening WhatsApp...'
                      : 'Proceed With WhatsApp'}
                  </span>
                  {!submittingEnquiry && !enquirySuccess && <ArrowRight className="h-5 w-5" />}
                </button>

                {enquiryError && (
                  <div className="text-xs font-semibold text-rose-500 text-center flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{enquiryError}</span>
                  </div>
                )}
                {enquirySuccess && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Enquiry saved successfully to database! Opening WhatsApp...
                  </span>
                )}

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-md">
                  All {selectedIssues.length} selected display issue{selectedIssues.length !== 1 ? 's' : ''} and customer details are saved securely into our database before connecting to WhatsApp.
                </p>
              </div>

            </div>
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
                    Selected Issues: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedIssues.length > 0 ? selectedIssues.join(', ') : 'Screen Malfunction'}</span>
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
                    placeholder="e.g. Mumbai"
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
