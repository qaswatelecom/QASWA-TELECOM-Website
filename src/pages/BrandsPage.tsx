import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Smartphone,
  Tablet,
  Watch,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { generateBreadcrumbSchema, useJsonLd, usePageSeo } from '../lib/seo.ts';

export const BrandsPage: React.FC = () => {
  const { categories, brands, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  usePageSeo(
    'Mobile Brands We Repair | Display Repair Specialists in Mumbai | QASWA TELECOM',
    'Explore supported smartphone brands for precision display repair in Mumbai: Apple iPhone, Samsung Galaxy, OnePlus, Google Pixel, Vivo, Oppo, Xiaomi, and more.'
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
  const breadcrumbSchema = React.useMemo(() => {
    return generateBreadcrumbSchema([
      { name: 'Home', url: `${origin}/` },
      { name: 'Device Categories', url: `${origin}/brands` },
    ]);
  }, [origin]);
  useJsonLd('breadcrumb-brands-catalog', breadcrumbSchema);

  // Four main categories
  const allowedCategories = ['mobile', 'ipad', 'apple-watch', 'tablet'];
  const mainCategories = categories
    .filter((c) => allowedCategories.includes(c.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Filtered brands
  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      activeCategoryFilter === 'All' ||
      b.categorySlug === activeCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-8 sm:py-14 bg-slate-50/50 dark:bg-[#0B1110] transition-colors min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Flagship Device Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Four Main Device Categories
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore our four specialized device categories for certified display repair, outer glass lamination, and green line laser bonding.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands & categories..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
            />
          </div>
        </div>

        {/* 1. Four Main Device Categories Grid */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-[#00B2A2]" />
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Primary Device Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mainCategories.map((cat) => {
              const IconComponent =
                cat.slug === 'apple-watch'
                  ? Watch
                  : cat.slug === 'mobile'
                  ? Smartphone
                  : Tablet;

              const targetUrl =
                cat.slug === 'mobile'
                  ? '/repair-brands'
                  : cat.slug === 'ipad'
                  ? '/ipad'
                  : cat.slug === 'apple-watch'
                  ? '/apple-watch'
                  : '/tablet';

              return (
                <a
                  key={cat.id}
                  href={targetUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(targetUrl);
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00B2A2] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer block text-inherit no-underline"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-4 flex items-center justify-center p-2">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                          loading="lazy"
                        />
                      ) : (
                        <IconComponent className="h-12 w-12 text-[#00B2A2]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[11px] font-bold text-white shadow-xs">
                        <IconComponent className="h-3.5 w-3.5 text-[#00B2A2]" />
                        <span>{cat.name}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-2">
                      {cat.tagline || cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#00B2A2]">
                    <span>
                      {cat.hasBrands ? 'Explore Brands' : 'Explore Models'}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* 2. Supported Brands Filter & Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#00B2A2]" />
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Listed Brands ({filteredBrands.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All mobile and tablet brands managed directly from the admin panel
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Mobile', 'Tablet'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveCategoryFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === filter
                      ? 'bg-[#00B2A2] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#00B2A2]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredBrands.map((b) => {
              const catSlug = b.categorySlug || 'mobile';
              const bSlugLower = (b.slug || '').toLowerCase();
              const bNameLower = (b.name || '').toLowerCase();
              const targetBrandSlug =
                bSlugLower === 'apple' || bSlugLower === 'iphone' || bNameLower === 'apple'
                  ? 'apple-iphone'
                  : b.slug;

              return (
                <div
                  key={b.id}
                  onClick={() => navigate(`/repair-models/${catSlug}/${targetBrandSlug}`)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#00B2A2] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                >
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 mx-auto mb-3.5 p-3 group-hover:scale-105 transition-transform border border-slate-100 dark:border-slate-800">
                      {b.logoUrl && !imageErrors[b.id] ? (
                        <img
                          src={b.logoUrl}
                          alt={b.name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [b.id]: true }))
                          }
                          className="max-h-full max-w-full object-contain filter dark:brightness-110"
                        />
                      ) : (
                        <Smartphone className="h-7 w-7 text-[#00B2A2]" />
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00B2A2] block mb-0.5">
                        {b.categorySlug === 'tablet' ? 'Tablet' : 'Mobile'}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                        {b.name}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {b.description || `Specialized display repair services for ${b.name}.`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#00B2A2] font-bold">
                    <span className="group-hover:underline">View Models</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
