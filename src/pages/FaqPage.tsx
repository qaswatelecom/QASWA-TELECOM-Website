import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo, generateFaqSchema, useJsonLd } from '../lib/seo.ts';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Layers,
  Wrench,
  Smartphone,
  Cpu,
} from 'lucide-react';

interface FaqEntry {
  id: number;
  question: string;
  answer: string;
  category: 'General Questions' | 'Display Issues' | 'Supported Devices' | 'Repair Process';
}

const FAQ_DATA: FaqEntry[] = [
  {
    id: 1,
    question: 'What types of display issues does QASWA TELECOM handle?',
    answer:
      'QASWA TELECOM specializes exclusively in display-related hardware problems on flagship devices. We handle broken or cracked outer touch glass, green screen and white display malfunctions, vertical or horizontal lines, unresponsive touch digitizers, foldable phone hinge flex cable issues, display flickering, and black screens.',
    category: 'Display Issues',
  },
  {
    id: 2,
    question: 'Do you repair iPhone displays?',
    answer:
      'Yes. We provide specialized display restoration for Apple iPhone flagship models (including Super Retina XDR OLED and ProMotion 120Hz panels). Our optical cleanroom refurbishing replaces cracked outer glass while preserving your original factory OLED panel and TrueTone sensor calibration.',
    category: 'Supported Devices',
  },
  {
    id: 3,
    question: 'Do you repair Samsung Galaxy flagship displays?',
    answer:
      'Yes. We service Samsung Galaxy S-series (S24, S23, S22, Ultra models) and Z-series foldable phones (Z Fold and Z Flip). We repair flexible Dynamic AMOLED 2X panels, perform touch glass replacement, resolve crease flex issues, and repair green screen or display line malfunctions.',
    category: 'Supported Devices',
  },
  {
    id: 4,
    question: 'Do you repair Apple Watch displays?',
    answer:
      'Yes. We handle dedicated display and sapphire crystal refurbishing for Apple Watch Ultra 2, Ultra, and Apple Watch Series models. Our micro-bonding process separates broken crystal and laminates new sapphire glass without degrading capacitive touch response.',
    category: 'Supported Devices',
  },
  {
    id: 5,
    question: 'Do you repair iPad and tablet displays?',
    answer:
      'Yes. We restore displays on Apple iPad Pro (Liquid Retina XDR & Tandem OLED), iPad Air, iPad mini, and premium Android tablets such as Samsung Galaxy Tab S-series. Our optical procedures maintain complete Apple Pencil pressure and tilt sensitivity.',
    category: 'Supported Devices',
  },
  {
    id: 6,
    question: 'Can you fix green display issues?',
    answer:
      'Yes. Green screen of death and sudden screen blanking on flexible AMOLED panels are frequently caused by micro-fractures or oxidation in the polyimide flex cable conductive traces. Using specialized infrared laser micro-welding stations, our technicians reconnect severed traces to restore normal display illumination.',
    category: 'Display Issues',
  },
  {
    id: 7,
    question: 'Can you repair vertical or horizontal lines on a display?',
    answer:
      'Yes. Single or multiple vertical lines (often bright green, pink, or white) typically occur when conductive microscopic bonding leads between the display driver IC and panel substrate detach. We utilize precision COP/COF laser bonding equipment to restore trace continuity.',
    category: 'Display Issues',
  },
  {
    id: 8,
    question: 'Do you handle touchscreen problems?',
    answer:
      'Yes. If your display registers ghost touches, erratic cursor jumps, or dead zones where touch is unresponsive, we inspect and calibrate the capacitive digitizer layer and flex connectors to restore accurate multi-touch input.',
    category: 'Display Issues',
  },
  {
    id: 9,
    question: 'How can I contact QASWA TELECOM?',
    answer:
      'You can contact our display repair desk by calling +91 9324316048, messaging us directly on WhatsApp (+91 9324316048), submitting an inquiry through our Contact Us page form, or visiting our service lab at Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092.',
    category: 'General Questions',
  },
  {
    id: 10,
    question: 'How does the display repair process work?',
    answer:
      'The repair process begins with microscopic optical diagnosis to evaluate the condition of your OLED panel and digitizer. Next, specialized machines safely separate shattered glass or laser-weld flex traces. New optical clear adhesive (OCA) is applied inside an ISO cleanroom, followed by autoclave debubbling and comprehensive TrueTone/touch verification before return.',
    category: 'Repair Process',
  },
  {
    id: 11,
    question: 'Why choose glass refurbishing instead of an aftermarket screen assembly?',
    answer:
      'When your touch and OLED are functioning beneath cracked glass, refurbishing replaces only the broken glass. This preserves your authentic factory display panel, ensuring 100% original color accuracy, factory contrast ratio, 120Hz dynamic refresh rates, and original touch sensitivity.',
    category: 'General Questions',
  },
  {
    id: 12,
    question: 'Do you service components other than displays?',
    answer:
      'No. QASWA TELECOM is strictly an exclusive display repair specialist. We do not service batteries, charging ports, cameras, speakers, motherboards, or software. Our entire facility and technical investment are committed to display engineering.',
    category: 'General Questions',
  },
];

export const FaqPage: React.FC = () => {
  const { settings } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  usePageSeo(
    `Display Repair FAQs | ${siteName} Borivali West, Mumbai`,
    `Frequently asked questions about smartphone, iPad, Apple Watch, and tablet display repair, cracked touch glass replacement, green line fixes, and OLED restoration in Mumbai.`
  );

  const [faqsList, setFaqsList] = useState<FaqEntry[]>(FAQ_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<number[]>([1, 6]); // Default open 1 and 6

  // Fetch live FAQs from API if configured via Admin Panel
  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiFaqs: FaqEntry[] = data.map((item: any) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            category: item.category || 'General Questions',
          }));
          setFaqsList(apiFaqs);
        }
      })
      .catch(() => console.log('Notice: Loaded baseline display FAQs'));
  }, []);

  // Injects Schema.org FAQPage structured data for rich snippet search results
  const faqSchema = useMemo(() => {
    return generateFaqSchema(faqsList.map((f) => ({ question: f.question, answer: f.answer })));
  }, [faqsList]);
  useJsonLd('faq-page', faqSchema);

  const categories = [
    'All',
    'General Questions',
    'Display Issues',
    'Supported Devices',
    'Repair Process',
  ];

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return faqsList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [faqsList, searchQuery, selectedCategory]);

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 px-3.5 py-1 text-xs font-bold text-[#00B2A2]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>KNOWLEDGE BASE & COMMON QUESTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need to know about our specialized flagship display repair procedures, touch glass refurbishing, green screen laser restoration, and supported devices.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 shadow-xs focus-within:border-[#00B2A2] transition-colors">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. green screen, iPhone, lines, touch, process)..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-semibold text-slate-400 mr-2 hidden sm:inline">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00B2A2] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. Expandable Accordion-Style FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching questions found
            </h3>
            <p className="text-xs text-slate-500">
              Try searching with different keywords or contact our team directly below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-[#00B2A2]/50 transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#00B2A2]/10 text-[#00B2A2]' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#00B2A2] bg-[#00B2A2]/10 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. WhatsApp Contact Button Below FAQs */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/60 to-teal-950/30 p-6 sm:p-8 text-center text-white space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Still Have a Question Regarding Your Device Display?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Our diagnostic team is available on WhatsApp to answer technical inquiries regarding cracked touch glass, green screen laser feasibility, or display line repairs.
          </p>
          <div>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                `Hello ${siteName}, I have a specific display question regarding my device.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask Our Display Lab on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
