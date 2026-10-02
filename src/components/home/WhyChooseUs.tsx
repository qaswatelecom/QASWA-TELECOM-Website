import React from 'react';
import {
  Sparkles,
  Smartphone,
  Cpu,
  Users,
  CheckCircle2,
  Award,
  Layers,
  Shield,
} from 'lucide-react';

interface FeatureCard {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WHY_CHOOSE_ITEMS: FeatureCard[] = [
  {
    number: '01',
    title: 'Display Repair Specialists',
    description: 'We do not dilute our focus with general phone fixes. 100% of our training, precision tooling, and diagnostic labs are dedicated exclusively to display optics and glass restoration.',
    icon: <Sparkles className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    number: '02',
    title: 'Expertise in Flagship Devices',
    description: 'Deep technical proficiency in high-end flagship architectures: Apple Super Retina XDR, Samsung Dynamic AMOLED 2X, Google Super Actua, and OnePlus LTPO 120Hz displays.',
    icon: <Smartphone className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    number: '03',
    title: 'Specialized Display Repair Equipment',
    description: 'Our in-house cleanroom features laser micro-welding machines for green lines, computerized freezing separators, OCA vacuum laminators, and high-pressure bubble-removing autoclaves.',
    icon: <Cpu className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    number: '04',
    title: 'Experienced Technicians',
    description: 'Our micro-technicians possess years of dedicated experience specifically focused on curved glass separation, flex cable micro-soldering, and microscopic display trace restoration.',
    icon: <Users className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    number: '05',
    title: 'Professional Repair Process',
    description: 'Transparent end-to-end diagnosis with systematic multi-point testing: touch grid response, TrueTone calibration, optical sensor verification, and uniform luminescence inspection.',
    icon: <CheckCircle2 className="h-6 w-6 text-[#00B2A2]" />,
  },
  {
    number: '06',
    title: 'Quality-Focused Workmanship',
    description: 'We employ optical-grade OCA films, OEM-spec frame adhesive seals, and precision jig alignments to deliver a clean, flawless finish indistinguishable from factory assembly.',
    icon: <Award className="h-6 w-6 text-[#00B2A2]" />,
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us-section" className="py-12 sm:py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
            <Layers className="h-4 w-4" />
            <span>The Qaswa Advantage</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">Excellence in Display Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose QASWA TELECOM
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            When your high-value flagship smartphone, Apple Watch, iPad, or tablet suffers display damage, trust specialized display technicians equipped with laboratory-grade machinery.
          </p>
        </div>

        {/* 6 Key Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.number}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-[#00B2A2] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-[#00B2A2]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Specialized Engineering Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
