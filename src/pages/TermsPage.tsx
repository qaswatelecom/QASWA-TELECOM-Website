import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import {
  FileText,
  Shield,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { settings } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteAddress = settings.SITE_ADDRESS || 'Shop No. 4, Tech Plaza, Main Market, Mumbai';
  const siteEmail = settings.SITE_EMAIL || 'telecomqaswa@gmail.com';
  const sitePhone = settings.SITE_PHONE || '+91 9324316048';

  usePageSeo(
    `Terms & Conditions | Service & Usage Agreement | ${siteName}`,
    `Review the terms and conditions governing display repair diagnosis, customer responsibilities, device data privacy, and service procedures at ${siteName}.`
  );

  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'intro', title: '1. Introduction' },
    { id: 'website-usage', title: '2. Website Usage' },
    { id: 'display-services', title: '3. Display Repair Services' },
    { id: 'inspection-diagnosis', title: '4. Device Inspection and Diagnosis' },
    { id: 'customer-responsibilities', title: '5. Customer Responsibilities' },
    { id: 'data-privacy', title: '6. Device Data and Privacy' },
    { id: 'repair-process', title: '7. Repair Process' },
    { id: 'limitation-liability', title: '8. Limitation of Liability' },
    { id: 'changes-to-terms', title: '9. Changes to Terms' },
    { id: 'contact-info', title: '10. Contact Information' },
  ];

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 px-3.5 py-1 text-xs font-bold text-[#00B2A2]">
            <FileText className="h-3.5 w-3.5" />
            <span>LEGAL & SERVICE GUIDELINES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Terms & Conditions
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 · Effective for all client display repair evaluations and website interactions.
          </p>
        </div>

        {/* 2-Column Content: Sticky Table of Contents + Legal Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents (Sticky on Desktop) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00B2A2] block mb-3">
                Table of Contents
              </span>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-[#00B2A2] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Legal Text Content (8 Columns) */}
          <div className="lg:col-span-8 space-y-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xs leading-relaxed text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
            {/* Section 1 */}
            <section id="intro" className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>{siteName}</strong>. These Terms & Conditions govern your access to our website and any display repair diagnosis, evaluation, or servicing conducted at our facility located at {siteAddress}.
              </p>
              <p>
                By using our website, submitting an online repair inquiry, or handing over a device for display inspection, you agree to comply with and be bound by these terms. If you do not agree to these terms, please refrain from using our services.
              </p>
            </section>

            {/* Section 2 */}
            <section id="website-usage" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Website Usage
              </h2>
              <p>
                The information provided on this website is for general informational and inquiry purposes related to display hardware engineering. You agree to use the site only for legitimate inquiries and will not attempt to disrupt, exploit, or introduce malicious code into the website's infrastructure.
              </p>
              <p>
                All brand logos, model references, and trademarks (including Apple, Samsung, Google, OnePlus, iPad, and Apple Watch) mentioned on this website belong to their respective trademark holders and are utilized solely for identification and compatibility reference.
              </p>
            </section>

            {/* Section 3 */}
            <section id="display-services" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                3. Display Repair Services
              </h2>
              <p>
                {siteName} is exclusively a specialized facility for <strong>display-related repairs</strong>. Our technical operations are restricted strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Broken or shattered outer touch glass refurbishment.</li>
                <li>Green screen of death and display discoloration troubleshooting.</li>
                <li>Vertical and horizontal colored display line elimination.</li>
                <li>Touchscreen digitizer unresponsiveness and sensor calibration.</li>
                <li>Foldable smartphone hinge and flexible display cable servicing.</li>
                <li>Sapphire crystal cover replacement on smartwatches.</li>
                <li>Liquid Retina and tandem OLED display repairs on tablets.</li>
              </ul>
              <p>
                We do not service or repair internal motherboards, batteries, charging ports, cameras, audio components, or software operating systems.
              </p>
            </section>

            {/* Section 4 */}
            <section id="inspection-diagnosis" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                4. Device Inspection and Diagnosis
              </h2>
              <p>
                Before any display procedure is executed, every device undergoes a preliminary technical inspection under laboratory microscopes and diagnostic power supplies.
              </p>
              <p>
                The diagnosis identifies whether the original OLED substrate is structurally viable for touch glass refurbishing or laser flex micro-welding, or whether the internal emitter has sustained irreparable structural impact fractures. Feasibility is confirmed with the customer prior to commencing repair procedures.
              </p>
            </section>

            {/* Section 5 */}
            <section id="customer-responsibilities" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                5. Customer Responsibilities
              </h2>
              <p>
                Customers submitting devices for display evaluation agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Disclose any pre-existing drops, liquid exposure, or prior repair attempts on the device.</li>
                <li>Remove external accessories, cases, SIM cards, and memory cards before handover.</li>
                <li>Backup all important personal data prior to diagnostic handling.</li>
                <li>Verify display touch functionality and visual clarity upon collection of the repaired device.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="data-privacy" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                6. Device Data and Privacy
              </h2>
              <p>
                {siteName} respects your personal privacy. Display repair procedures are purely hardware-based and do not require access to your personal files, photos, or accounts.
              </p>
              <p>
                While hardware display servicing does not deliberately affect onboard flash storage, physical damage sustained by a dropped device can intermittently compromise storage circuitry. Customers are strongly encouraged to maintain a current cloud or offline backup of their data.
              </p>
            </section>

            {/* Section 7 */}
            <section id="repair-process" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                7. Repair Process
              </h2>
              <p>
                Our repair workflow operates under controlled cleanroom conditions:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Intake:</strong> Physical condition and touch matrix logging.</li>
                <li><strong>Microscopic Separation:</strong> Heated vacuum decoupling of shattered glass.</li>
                <li><strong>Cleaning & Surface Prep:</strong> Solvent removal of degraded adhesive.</li>
                <li><strong>Lamination & Autoclave:</strong> High-precision OCA bonding and bubble extraction.</li>
                <li><strong>Final Quality Audit:</strong> Testing TrueTone response, touch fidelity, and optical alignment.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="limitation-liability" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                8. Limitation of Liability
              </h2>
              <p>
                Devices brought to our facility have typically sustained severe mechanical shock, bending, or impact. In rare cases where an internal OLED substrate has concealed micro-cracks beneath intact glass, decoupling procedures may reveal existing emitter failure.
              </p>
              <p>
                {siteName} and its technical staff shall not be liable for any indirect, incidental, or consequential damages resulting from pre-existing internal micro-damage, water damage, or motherboard solder fractures caused by original drop events.
              </p>
            </section>

            {/* Section 9 */}
            <section id="changes-to-terms" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                9. Changes to Terms
              </h2>
              <p>
                {siteName} reserves the right to modify or update these Terms & Conditions periodically. Any updates will be posted directly to this page with an updated revision date. Continued usage of our website or services signifies acceptance of revised terms.
              </p>
            </section>

            {/* Section 10 */}
            <section id="contact-info" className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                10. Contact Information
              </h2>
              <p>
                For questions regarding these Terms & Conditions or to inquire about our display repair standards, please reach us through the following verified contact channels:
              </p>
              <div className="pt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <p><strong>Facility Name:</strong> {siteName}</p>
                <p><strong>Physical Address:</strong> {siteAddress}</p>
                <p><strong>Phone Desk:</strong> {sitePhone}</p>
                <p><strong>Email:</strong> {siteEmail}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
