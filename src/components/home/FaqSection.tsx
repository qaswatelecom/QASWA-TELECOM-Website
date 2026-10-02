import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Display Specialization',
    question: 'Why does QASWA TELECOM focus exclusively on display repairs?',
    answer:
      'Modern flagship smartphones, Apple Watch, and tablets feature extraordinarily sophisticated display technologies (such as curved Dynamic AMOLED 2X, 120Hz ProMotion LTPO, tandem OLEDs, and sapphire crystal glass). By dedicating 100% of our laboratory equipment, optical laminators, cleanrooms, and technicians exclusively to displays, we achieve a far higher precision and success rate than general repair shops.',
  },
  {
    id: 'faq-2',
    category: 'Touch Glass',
    question: 'Can you replace just the broken glass if my touch and screen still work?',
    answer:
      'Yes! If your OLED/AMOLED display panel and touch sensitivity are working normally beneath the cracked glass, we perform OCA optical glass de-bonding. We separate the shattered glass and bond a brand-new factory-grade glass panel in our dust-free autoclave. This preserves your authentic factory display panel and TrueTone calibration.',
  },
  {
    id: 'faq-3',
    category: 'Green Screen & Display Lines',
    question: 'How do you fix green screen or vertical line issues without replacing the whole display?',
    answer:
      'Green screens and vertical colored lines on flagship OLEDs (frequent on Samsung Galaxy, iPhone, and OnePlus models) often arise from microscopic circuit breaks or detached chip-on-film (COF) bonding. We use specialized laser micro-welding and pulse-heating flex bonding machines to restore electrical conductivity across the flex trace directly.',
  },
  {
    id: 'faq-4',
    category: 'Supported Devices',
    question: 'Which device brands and models do you support for display repairs?',
    answer:
      'We support Apple iPhone (all flagship models including 15 Pro Max, 14 Pro, 13 Pro), Samsung Galaxy (S24 Ultra, S23 series, Z Fold, and Z Flip foldable panels), Google Pixel (Pixel 8 Pro, 7 Pro, Pixel Fold), OnePlus (OnePlus 12, Open, 11), Apple Watch (Ultra 2, Ultra, Series 9, Series 8), iPad (iPad Pro Liquid Retina XDR / OLED, iPad Air, iPad mini), and premium tablets.',
  },
  {
    id: 'faq-5',
    category: 'Repair Procedures',
    question: 'What is the standard procedure when I bring or send in my device?',
    answer:
      'Our repair process consists of four simple steps: 1) Initial contact via WhatsApp or phone with your device details; 2) Microscopic diagnostic examination to determine whether glass refurbishment, flex bonding, or panel restoration is required; 3) Precision repair in our specialized cleanroom facility; 4) Comprehensive multi-touch, TrueTone, and optical sensor quality testing.',
  },
  {
    id: 'faq-6',
    category: 'Contact & Consultation',
    question: 'How do I contact QASWA TELECOM to book a display diagnosis?',
    answer:
      'You can reach us immediately on WhatsApp at +91 9324316048, call our service line directly at +91 9324316048, visit our repair facility at Shop No. 4, Tech Plaza, Main Market, or fill out our online repair booking inquiry form on this website.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { settings } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs-section" className="py-12 sm:py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Expert Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need to know about our specialized display repair techniques, supported devices, and consultation process.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="pr-4">
                    <span className="text-[11px] font-semibold text-[#00B2A2] uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#00B2A2] text-white border-transparent' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-2xl bg-[#00B2A2]/10 border border-[#00B2A2]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Have a specific display issue not listed above?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Send us a photo or video of your display screen for instant technical feedback.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
              `Hello QASWA TELECOM, I have a specific display question regarding my device.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#009e90] transition-colors shrink-0"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
