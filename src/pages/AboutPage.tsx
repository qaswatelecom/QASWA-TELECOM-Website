import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import { usePageContent, AboutPageContent, DEFAULT_ABOUT_CONTENT } from '../lib/pageContent.ts';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Wrench,
  Activity,
  Phone,
  MessageCircle,
  Eye,
  Microscope,
  Zap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigate } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const sitePhone = settings.SITE_PHONE || '+91 9324316048';
  const siteAddress =
    settings.SITE_ADDRESS ||
    'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092';

  const { content } = usePageContent<AboutPageContent>('about');
  const about = content || DEFAULT_ABOUT_CONTENT;

  usePageSeo(
    `About Us | Dedicated Flagship Display Specialists | ${siteName}`,
    `Learn about ${siteName}, a dedicated display repair facility focused exclusively on optical glass refurbishment, laser bonding, and display diagnosis for high-end flagship devices.`
  );

  const displayExpertise = about.specialization?.items?.length
    ? about.specialization.items
    : DEFAULT_ABOUT_CONTENT.specialization.items;

  const galleryImages = about.gallery?.images?.length
    ? about.gallery.images
    : DEFAULT_ABOUT_CONTENT.gallery.images;

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 1. Premium Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 px-3.5 py-1 text-xs font-bold text-[#00B2A2]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{about.hero?.badge || 'EXCLUSIVE DISPLAY REPAIR SPECIALIST'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {about.hero?.title || `About ${siteName}`}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {about.hero?.subtitle ||
              'A dedicated repair laboratory focused exclusively on flagship smartphone, Apple Watch, iPad, and tablet display restoration. We believe that modern high-refresh-rate displays demand specialized optical engineering.'}
          </p>
        </div>

        {/* 2. Our Story Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00B2A2]">
                {about.story?.badge || 'Background & Foundation'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {about.story?.title || 'Our Story'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {about.story?.paragraph1 ||
                  `Operating from our specialized service facility at ${siteAddress}, ${siteName} was established to solve a critical gap in the device servicing industry: the lack of dedicated, focused expertise for delicate modern display hardware.`}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {about.story?.paragraph2 ||
                  'While conventional mobile repair shops attempt broad repairs across batteries, charging ports, speakers, and logic boards, our team recognized that advanced displays—such as Super Retina XDR OLEDs, Dynamic AMOLED 2X, and tandem OLEDs—require surgical cleanroom equipment, micro-laser bonding stations, and optical autoclaves.'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {about.story?.paragraph3 ||
                  'By maintaining a single, uninterrupted focus on display-related problems, we provide device owners with transparent diagnostics and specialized procedures designed to preserve original display panels whenever technically feasible.'}
              </p>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
              <img
                src={about.story?.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'}
                alt={`${siteName} Optical cleanroom laboratory`}
                className="h-full w-full object-cover filter brightness-95"
              />
            </div>
          </div>
        </div>

        {/* 3. Our Specialization Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B2A2]">
            {about.specialization?.badge || 'Laser-Sharp Focus'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {about.specialization?.title || 'Our Specialization'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {about.specialization?.description ||
              'We do not service batteries, charging ports, cameras, motherboards, or software. Our entire lab space, equipment investment, and technician training are dedicated exclusively to display-related issues:'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Cracked Glass (OCA)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Green/White Screen</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Vertical Line Laser Fix</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#00B2A2] shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Touch Digitizers</span>
            </div>
          </div>
        </div>

        {/* 4. Display Expertise Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Comprehensive Display Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Specialized procedures engineered to solve complex screen failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayExpertise.map((exp, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-[#00B2A2]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#00B2A2]/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-[#00B2A2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Our Approach Section */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-950/20 via-slate-900/60 to-slate-950 p-6 sm:p-10 text-white space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00B2A2]">
              {about.mission?.badge || 'Lab Standards'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {about.mission?.title || 'Our Mission & Quality Standards'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {about.mission?.description || 'How we approach every flagship display restoration with surgical care:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Microscope className="h-6 w-6 text-[#00B2A2]" />
              <h3 className="text-sm font-bold text-white">1. Microscopic Diagnosis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We inspect the display under high-magnification stereomicroscopes to verify if the OLED emitter, digitizer, or flex ribbon traces are intact before suggesting any procedure.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <Layers className="h-6 w-6 text-[#00B2A2]" />
              <h3 className="text-sm font-bold text-white">2. Selective Restoration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Whenever the factory OLED panel functions properly beneath cracked glass, we preserve the original panel through precision OCA lamination, retaining authentic color calibration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <ShieldCheck className="h-6 w-6 text-[#00B2A2]" />
              <h3 className="text-sm font-bold text-white">3. Quality-Focused Workmanship</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every serviced display is evaluated for TrueTone calibration, touch response uniformity, 120Hz refresh stability, and bubble-free optical clarity before return.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Image Gallery Featuring Display Repair Work */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00B2A2]">
              {about.gallery?.badge || 'Behind The Scenes'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {about.gallery?.title || 'Display Lab Gallery'}
            </h2>
            <p className="text-xs text-slate-500">
              {about.gallery?.subtitle || 'Inside our cleanroom optical bonding and laser micro-welding stations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative h-60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#00B2A2] transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Action CTA Section */}
        <div className="rounded-3xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Need Expert Diagnosis for Your Flagship Display?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Contact our technicians directly to schedule a diagnosis or check repair feasibility for your smartphone, Apple Watch, or tablet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href={`tel:${sitePhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#009E90] transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us ({sitePhone})</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello ${siteName}, I would like to consult your display lab regarding my device.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-6 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-xs"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Chat on WhatsApp (+91 {rawWhatsApp})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

