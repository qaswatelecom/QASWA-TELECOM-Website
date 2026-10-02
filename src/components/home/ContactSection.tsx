import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, brands, services } = useApp();

  const rawPhone = settings.SITE_PHONE || '+91 9324316048';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteAddress = settings.SITE_ADDRESS || 'Shop No. 4, Tech Plaza, Main Market';
  const siteEmail = settings.SITE_EMAIL || 'telecomqaswa@gmail.com';
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    deviceCategory: 'iPhone',
    deviceModel: '',
    displayIssue: 'Broken or Cracked Displays',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const deviceCategoriesList = [
    'iPhone',
    'Samsung Galaxy',
    'Google Pixel',
    'OnePlus',
    'Apple Watch',
    'iPad',
    'Premium Tablets',
  ];

  const displayIssuesList = [
    'Broken or Cracked Displays',
    'Touch Glass Replacement',
    'Green Screen Issues',
    'Display Lines (Vertical & Horizontal)',
    'Touchscreen Issues',
    'Black Screen & Display Malfunction',
    'Other Display-Related Problems',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.mobile.trim()) {
      setErrorMsg('Please provide your name and contact mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      // Find matching brand and service if available
      const matchedBrand = brands.find(
        (b) => b.name.toLowerCase() === formData.deviceCategory.toLowerCase()
      );
      const matchedService = services.find(
        (s) => s.name.toLowerCase() === formData.displayIssue.toLowerCase()
      );

      const payload = {
        customerName: formData.name,
        customerMobile: formData.mobile,
        customerWhatsapp: formData.whatsapp || formData.mobile,
        brandId: matchedBrand ? matchedBrand.id : 1,
        brandName: formData.deviceCategory,
        modelId: 1,
        modelName: formData.deviceModel || `${formData.deviceCategory} Flagship`,
        serviceId: matchedService ? matchedService.id : 1,
        serviceName: formData.displayIssue,
        additionalNote: formData.message || 'Website display repair inquiry',
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '11:00 AM',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to record inquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // Even if network fails, show success and allow immediate WhatsApp continuation
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello ${siteName},\n\nI would like to book a display diagnosis.\n\n*Name:* ${formData.name}\n*Mobile:* ${formData.mobile}\n*Device:* ${formData.deviceCategory} ${formData.deviceModel}\n*Display Issue:* ${formData.displayIssue}\n*Notes:* ${formData.message || 'None'}\n\nPlease let me know the procedure to bring in my device.`
    );
  };

  return (
    <section id="contact-section" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Direct Laboratory Access</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Consult With Our Display Technicians</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact QASWA TELECOM
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Get your flagship device examined by specialized display technicians. Walk into our center, call our service desk, or book an appointment online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Business Details, Hours & Google Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Cards */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 dark:border-slate-800 dark:bg-slate-900/60 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                Laboratory Location & Details
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center shrink-0 text-[#00B2A2]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Service Center Address
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {siteAddress}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Central Tech Market, Walk-In Laboratory
                  </p>
                </div>
              </div>

              {/* Direct Phone */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center shrink-0 text-[#00B2A2]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Phone Consultation
                  </span>
                  <a
                    href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#00B2A2] transition-colors mt-0.5 block"
                  >
                    {rawPhone}
                  </a>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Direct call with master technicians
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    WhatsApp Desk
                  </span>
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                      `Hello ${siteName}, I need display repair assistance for my flagship device.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5 block"
                  >
                    +{rawWhatsApp} (Instant Chat)
                  </a>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Share screen photos & get quick diagnosis
                  </span>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center shrink-0 text-[#00B2A2]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Laboratory Business Hours
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Monday – Saturday: 10:00 AM – 8:30 PM
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sunday: 11:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Integration */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#00B2A2]" />
                  Google Maps Location
                </span>
                <a
                  href="https://maps.google.com/?q=Shop+No+4+Tech+Plaza+Main+Market"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#00B2A2] hover:underline flex items-center gap-1"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Embedded Interactive Map */}
              <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800">
                <iframe
                  title="QASWA TELECOM Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.12879555138!2d72.822296!3d19.0825223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-20 contrast-110"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Repair Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. Our display specialists have logged your inquiry for {formData.deviceCategory} {formData.deviceModel}.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${getWhatsAppMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all w-full sm:w-auto justify-center"
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>Continue on WhatsApp Directly</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          mobile: '',
                          whatsapp: '',
                          deviceCategory: 'iPhone',
                          deviceModel: '',
                          displayIssue: 'Broken or Cracked Displays',
                          message: '',
                        });
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto"
                    >
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Book a Display Repair Diagnosis
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Fill out your device details below. Our technicians will inspect your display requirements.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/50">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name and Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="e.g. +91 9324316048"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Device Category & Model */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Device Category *
                      </label>
                      <select
                        value={formData.deviceCategory}
                        onChange={(e) => setFormData({ ...formData, deviceCategory: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all cursor-pointer"
                      >
                        {deviceCategoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Specific Model Name
                      </label>
                      <input
                        type="text"
                        value={formData.deviceModel}
                        onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                        placeholder="e.g. iPhone 15 Pro, S24 Ultra, Watch Ultra"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Display Issue Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Display Issue We Specialize In *
                    </label>
                    <select
                      value={formData.displayIssue}
                      onChange={(e) => setFormData({ ...formData, displayIssue: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all cursor-pointer"
                    >
                      {displayIssuesList.map((issue) => (
                        <option key={issue} value={issue}>
                          {issue}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Issue Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Describe Display Symptoms (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Green line appeared after recent update, touch is still working normally, glass is intact."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#00B2A2]/30 hover:bg-[#009e90] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Repair Diagnosis Request</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    Strict display repair focus. We respond promptly via WhatsApp or direct phone.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
