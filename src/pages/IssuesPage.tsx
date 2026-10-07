import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AlertTriangle, Check, CheckCircle2, MessageCircle, Sparkles, Shield, Wrench } from 'lucide-react';
import { getIssueIcon, getIssueStyles } from '../lib/issueIcons.ts';
import { usePageSeo } from '../lib/seo.ts';

export const IssuesPage: React.FC = () => {
  const { settings, displayIssues: appIssues, navigate } = useApp();
  const [selectedIssues, setSelectedIssues] = useState<string[]>(() => {
    if (appIssues && appIssues.length > 0) {
      return [appIssues[0].title];
    }
    return ['Cracked or Shattered Front Glass (Touch & OLED Working)'];
  });

  const [customerName, setCustomerName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageSeo(
    'Display Hardware Issues & Diagnosis | QASWA TELECOM Mumbai',
    'Specialized display hardware diagnosis for flagship devices in Borivali West, Mumbai. Glass replacement, green screen laser repair, vertical line bonding, and touchscreen restoration.'
  );

  const toggleIssue = (issueTitle: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueTitle) ? prev.filter((i) => i !== issueTitle) : [...prev, issueTitle]
    );
  };

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  const handleWhatsAppEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssues.length === 0) {
      alert('Please select at least one display issue above.');
      return;
    }

    setIsSubmitting(true);
    const issuesText = selectedIssues.map((iss) => `- ${iss}`).join('\n');
    const message =
      `Hello QASWA TELECOM, I would like to consult about display repair for my device.\n\n` +
      `Reported Issue(s):\n${issuesText}\n\n` +
      (deviceModel ? `Device Model: ${deviceModel}\n` : '') +
      (customerName ? `Customer Name: ${customerName}\n` : '') +
      (customerPhone ? `Contact Phone: ${customerPhone}\n` : '') +
      `Location: Borivali West, Mumbai Lab`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/91${cleanWhatsApp}?text=${encoded}`;
    window.location.href = waUrl;
    setIsSubmitting(false);
  };

  return (
    <div className="py-10 sm:py-16 bg-white dark:bg-[#0B1110] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div id="display-issues-section" className="mb-12">
          <div className="mb-6 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Diagnostic Problem Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Display-Related Hardware Issues We Repair
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Select one or multiple display faults your device is experiencing. You can choose all problems that apply for an accurate diagnosis by our cleanroom display lab:
            </p>
          </div>

          {/* Multi-Select Issue Cards with Issue Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appIssues.map((issueItem, idx) => {
              const issueTitle = issueItem.title;
              const issueIconName = issueItem.icon;
              const issueBadge = issueItem.badge;
              const issueColor = issueItem.color;

              const isSelected = selectedIssues.includes(issueTitle);
              const IssueIcon = getIssueIcon(issueIconName);
              const styles = getIssueStyles(issueColor);

              return (
                <div
                  key={issueItem.id || idx}
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
                        className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 border transition-transform duration-200 group-hover:scale-105 ${styles.color}`}
                      >
                        {issueItem.customIconUrl ? (
                          <img
                            src={issueItem.customIconUrl}
                            alt={issueTitle}
                            className="h-7 w-7 object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <IssueIcon className="h-6 w-6" />
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
                      {issueBadge || 'Certified cleanroom repair'}
                    </span>
                  </div>

                  {/* Bottom selection state */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-[#00B2A2]' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
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

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Proceed With WhatsApp Enquiry
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
                Connect directly with our display laboratory technicians in Borivali West, Mumbai for free consultation and diagnosis estimate.
              </p>

              {/* Selected Issues Chips */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl">
                {selectedIssues.length === 0 ? (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    Please click at least one display issue above to continue
                  </span>
                ) : (
                  selectedIssues.map((iss) => (
                    <span
                      key={iss}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-xs"
                    >
                      <Check className="h-3 w-3 text-[#00B2A2]" />
                      <span>{iss}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleIssue(iss);
                        }}
                        className="ml-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove issue"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Quick Details Inputs Form */}
              <form onSubmit={handleWhatsAppEnquiry} className="mt-6 w-full max-w-md space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00B2A2]"
                  />
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="Device Model (e.g. iPhone 15 Pro)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00B2A2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={selectedIssues.length === 0 || isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white px-6 py-3.5 text-sm sm:text-base font-extrabold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>Proceed With WhatsApp ({selectedIssues.length} Issues Selected)</span>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Original OLED Preserved</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Cold Laser Micro-Bonding</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Cleanroom Optical Lamination</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
