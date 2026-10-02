import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import { usePageContent, ContactPageContent, DEFAULT_CONTACT_CONTENT } from '../lib/pageContent.ts';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteAddress = settings.SITE_ADDRESS || 'Shop No. 4, Tech Plaza, Main Market, Mumbai';
  const sitePhone = settings.SITE_PHONE || '+91 9324316048';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const siteEmail = settings.SITE_EMAIL || 'telecomqaswa@gmail.com';

  const { content } = usePageContent<ContactPageContent>('contact');
  const contact = content || DEFAULT_CONTACT_CONTENT;

  const activePhone = contact.info?.phone || sitePhone;
  const activeWhatsApp = contact.info?.whatsapp || rawWhatsApp;
  const cleanWhatsApp = activeWhatsApp.replace(/\D/g, '');
  const activeEmail = contact.info?.email || siteEmail;
  const activeAddress = contact.info?.address || siteAddress;
  const activeHours = contact.info?.operatingHours || 'Mon – Sat: 10:00 AM – 8:30 PM | Sun: 11:00 AM – 6:00 PM';
  const activeMapsUrl = contact.info?.googleMapsUrl || 'https://maps.google.com/?q=Shop+No+4+Tech+Plaza+Main+Market+Mumbai';

  usePageSeo(
    `Contact Us | Get in Touch With Our Display Lab | ${siteName}`,
    `Contact ${siteName} display repair specialists. Get expert diagnosis for cracked touch glass, green screen issues, display lines, and touch digitizers on flagship phones, Apple Watch, and tablets.`
  );

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [deviceBrand, setDeviceBrand] = useState('Apple iPhone');
  const [deviceModel, setDeviceModel] = useState('');
  const [displayIssue, setDisplayIssue] = useState('Display Damaged');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successTicket, setSuccessTicket] = useState<{
    orderNumber: string;
    message: string;
  } | null>(null);

  const displayIssuesList = [
    'Display Damaged (Broken / Cracked)',
    'Touch Glass Broken (OLED Working)',
    'Green Screen Issue (Blanking / Green Tint)',
    'Touch Not Responding (Digitizer Failure)',
    'Green & Pink Line Issue (Vertical/Horizontal)',
    'Foldable Phone Display Issues',
    'Foldable Phone Hinge & Flex Cable Issues',
    'Black Screen Issue (Power / Backlight)',
    'Display Flickering',
    'Display Malfunction',
  ];

  const deviceBrandsList = [
    'Apple iPhone',
    'Samsung Galaxy S / Z Series',
    'Google Pixel',
    'OnePlus',
    'Apple Watch',
    'Apple iPad',
    'Premium Tablet',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim() || !phoneNumber.trim() || !deviceBrand || !deviceModel.trim() || !displayIssue) {
      setErrorMessage('Please fill in all required fields marked with *');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneNumber: cleanPhone,
          email,
          deviceBrand,
          deviceModel,
          displayIssue,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessTicket({
          orderNumber: data.orderNumber,
          message: data.message,
        });
        // Reset inputs
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setDeviceModel('');
        setMessage('');
      } else {
        setErrorMessage(data.error || 'Failed to submit form. Please reach out via WhatsApp.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Connection error. Please contact us directly via WhatsApp or phone call.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 px-3.5 py-1 text-xs font-bold text-[#00B2A2]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{contact.hero?.badge || 'SPECIALIZED DISPLAY REPAIR LAB'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {contact.hero?.title || 'Get in Touch With Us'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {contact.hero?.subtitle ||
              'QASWA TELECOM specializes exclusively in display diagnostics and optical restoration for high-end flagship smartphones, Apple Watch, iPad, and premium tablets. Submit your device details below or contact our technician desk directly.'}
          </p>
        </div>

        {/* 2. Main Contact Grid: Info Cards + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (5 cols): Contact Information Cards & Direct Actions */}
          <div className="lg:col-span-5 space-y-5">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  `Hello ${siteName}, I need display repair assistance for my flagship device.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">WhatsApp Inquiry</span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      +91 {activeWhatsApp}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-white">
                  Chat
                </span>
              </a>

              <a
                href={`tel:${activePhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#00B2A2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Direct Phone Call</span>
                    <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                      {activePhone}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#00B2A2] text-white">
                  Call
                </span>
              </a>
            </div>

            {/* Information Cards */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Center & Lab Details
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-[#00B2A2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                    Lab & Center Address
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeAddress}
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-[#00B2A2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                    Lab Working Hours
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {activeHours}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="h-4 w-4 text-[#00B2A2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">
                    Email Desk
                  </span>
                  <a
                    href={`mailto:${activeEmail}`}
                    className="text-xs text-[#00B2A2] hover:underline"
                  >
                    {activeEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Specialization Callout */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
              <span className="text-xs font-bold text-[#00B2A2] flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                <span>{contact.noticeCard?.badge || 'Strict Display Specialization'}</span>
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {contact.noticeCard?.title || 'Exclusive Display Repairs Only'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {contact.noticeCard?.description ||
                  'Please note that we exclusively handle display hardware issues (broken touch glass, green screen, colored lines, touch unresponsiveness, and black screens). We do not service internal motherboards, batteries, or software.'}
              </p>
              {contact.noticeCard?.walkinNotice && (
                <p className="text-[11px] font-medium text-[#00B2A2] pt-1">
                  {contact.noticeCard.walkinNotice}
                </p>
              )}
            </div>
          </div>

          {/* Right Column (7 cols): Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Submit a Display Repair Inquiry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill in your device specifications for immediate technician diagnosis review.
                </p>
              </div>

              {/* Success Message Card */}
              {successTicket ? (
                <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/40 space-y-3 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#00B2A2] mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Inquiry Submitted Successfully!
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-lg bg-[#00B2A2]/20 text-[#00B2A2] font-mono text-xs font-bold">
                    Reference ID: {successTicket.orderNumber}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {successTicket.message}
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setSuccessTicket(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hello ${siteName}, I just submitted web inquiry ${successTicket.orderNumber}. Could you check my display repair request?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Speed Up via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs font-semibold text-red-700 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: Full Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sameer Khan"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>

                  {/* Row 3: Device Brand & Model */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Device Brand *
                      </label>
                      <select
                        value={deviceBrand}
                        onChange={(e) => setDeviceBrand(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                      >
                        {deviceBrandsList.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Device Model *
                      </label>
                      <input
                        type="text"
                        required
                        value={deviceModel}
                        onChange={(e) => setDeviceModel(e.target.value)}
                        placeholder="e.g. iPhone 15 Pro, S24 Ultra, Watch Ultra"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 4: Display Issue Dropdown (Strict Display Problems) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Display Issue Observed *
                    </label>
                    <select
                      value={displayIssue}
                      onChange={(e) => setDisplayIssue(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                    >
                      {displayIssuesList.map((issue) => (
                        <option key={issue} value={issue}>
                          {issue}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Additional Message or Symptoms (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what occurred (e.g. display went green after update, glass cracked but touch works, vertical line appeared)..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#009E90] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Display Repair Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3. Embedded Google Map & Laboratory Desk Showcase */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {contact.storeShowcase?.title || 'Visit Our Display Repair Lab'}
              </h2>
              <p className="text-xs text-slate-500">
                {contact.storeShowcase?.subtitle || `Conveniently located at ${activeAddress}.`}
              </p>
            </div>
            <a
              href={activeMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B2A2] hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Open in Google Maps Application</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {contact.storeShowcase?.imageUrl && (
              <div className="lg:col-span-5 relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group">
                <img
                  src={contact.storeShowcase.imageUrl}
                  alt={contact.storeShowcase.title || `${siteName} Store`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5 text-white">
                  <p className="text-xs font-medium text-slate-200">
                    {contact.storeShowcase.caption || 'Specialized in-house cleanroom display stations'}
                  </p>
                </div>
              </div>
            )}

            <div className={`relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${contact.storeShowcase?.imageUrl ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteName} Location Map`}
                className="filter contrast-[1.05] grayscale-[0.2]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
