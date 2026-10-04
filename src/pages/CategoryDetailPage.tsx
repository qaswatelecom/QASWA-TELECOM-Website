import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { DeviceCategory, Brand, Model } from '../types/index.ts';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Smartphone,
  Tablet,
  Watch,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { generateBreadcrumbSchema, useJsonLd } from '../lib/seo.ts';

interface CategoryDetailPageProps {
  categorySlug: string;
}

const BASELINE_CATEGORIES: Record<string, DeviceCategory> = {
  mobile: {
    id: 1,
    name: 'Mobile',
    slug: 'mobile',
    tagline: 'Flagship Smartphone OLED & Display Specialists',
    description:
      'Specialized display repairs for Apple iPhone, Samsung Galaxy, Google Pixel, OnePlus, Vivo, Oppo, Xiaomi, and other flagship smartphones with original AMOLED panels and laser bonding.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    icon: 'Smartphone',
    hasBrands: true,
    sortOrder: 1,
    isActive: true,
  },
  ipad: {
    id: 2,
    name: 'iPad',
    slug: 'ipad',
    tagline: 'Ultra Retina Tandem OLED & Liquid Retina XDR',
    description:
      'Precision display repair, laminated digitizer restoration, and Apple Pencil sensitivity preservation for iPad Pro, iPad Air, iPad mini, and standard iPad generations.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    icon: 'Tablet',
    hasBrands: false,
    sortOrder: 2,
    isActive: true,
  },
  'apple-watch': {
    id: 3,
    name: 'Apple Watch',
    slug: 'apple-watch',
    tagline: 'Sapphire Crystal & Retinal OLED Calibration',
    description:
      'Micro-precision sapphire crystal touch glass refurbishing, OLED display repair, and Force Touch sensor calibration for Apple Watch Ultra, Series, and SE generations.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    icon: 'Watch',
    hasBrands: false,
    sortOrder: 3,
    isActive: true,
  },
  tablet: {
    id: 4,
    name: 'Tablet',
    slug: 'tablet',
    tagline: 'Flagship Large-Format AMOLED & Display Glass',
    description:
      'Specialized large-screen display repairs for Samsung Galaxy Tab, OnePlus Pad, Xiaomi Pad, Lenovo Tab, and flagship tablet AMOLED panels.',
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
    icon: 'Tablet',
    hasBrands: true,
    sortOrder: 4,
    isActive: true,
  },
};

const BASELINE_MODELS: Record<string, Partial<Model>[]> = {
  ipad: [
    {
      id: 201,
      name: 'iPad Pro 13-inch (M4 Tandem OLED)',
      slug: 'ipad-pro-13-inch-m4',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Ultra Retina Tandem OLED display repair and glass refurbishing.',
    },
    {
      id: 202,
      name: 'iPad Pro 11-inch (M4 Tandem OLED)',
      slug: 'ipad-pro-11-inch-m4',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Ultra Retina Tandem OLED display restoration.',
    },
    {
      id: 203,
      name: 'iPad Pro 12.9-inch (M2 Liquid Retina XDR)',
      slug: 'ipad-pro-12-9-inch-m2',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Mini-LED Liquid Retina XDR screen replacement and touch glass bonding.',
    },
    {
      id: 204,
      name: 'iPad Pro 11-inch (M2 Liquid Retina)',
      slug: 'ipad-pro-11-inch-m2',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: '120Hz ProMotion Liquid Retina display repair.',
    },
    {
      id: 205,
      name: 'iPad Air 13-inch (M2)',
      slug: 'ipad-air-13-inch-m2',
      series: 'iPad Air',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '13-inch Liquid Retina display glass refurbishing.',
    },
    {
      id: 206,
      name: 'iPad Air 11-inch (M2)',
      slug: 'ipad-air-11-inch-m2',
      series: 'iPad Air',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: 'Fully laminated Liquid Retina display repair.',
    },
    {
      id: 207,
      name: 'iPad mini (7th Gen / A17 Pro)',
      slug: 'ipad-mini-7th-gen',
      series: 'iPad mini',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Liquid Retina display glass replacement and TrueTone calibration.',
    },
    {
      id: 208,
      name: 'iPad (10th Gen)',
      slug: 'ipad-10th-gen',
      series: 'iPad',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '10.9-inch display and touch digitizer glass replacement.',
    },
  ],
  'apple-watch': [
    {
      id: 301,
      name: 'Apple Watch Ultra 3',
      slug: 'apple-watch-ultra-3',
      series: 'Apple Watch Ultra',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Sapphire crystal screen replacement and 3000-nit OLED display calibration.',
    },
    {
      id: 302,
      name: 'Apple Watch Ultra 2',
      slug: 'apple-watch-ultra-2',
      series: 'Apple Watch Ultra',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Sapphire crystal glass refurbishing and OLED display repair.',
    },
    {
      id: 303,
      name: 'Apple Watch Series 10',
      slug: 'apple-watch-series-10',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: 'Wide-angle OLED curved panel display repair.',
    },
    {
      id: 304,
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: '2000-nit edge-to-edge curved OLED screen replacement.',
    },
    {
      id: 305,
      name: 'Apple Watch Series 8',
      slug: 'apple-watch-series-8',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: 'Curved OLED screen repair and touch glass refurbishing.',
    },
    {
      id: 306,
      name: 'Apple Watch SE (2nd Gen)',
      slug: 'apple-watch-se-2nd-gen',
      series: 'Apple Watch SE',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Retina OLED screen replacement and Ion-X front glass repair.',
    },
  ],
};

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ categorySlug }) => {
  const { categories, brands: contextBrands, navigate } = useApp();
  const cleanCatSlug = (categorySlug || 'mobile').toLowerCase();

  const [category, setCategory] = useState<DeviceCategory | null>(() => {
    return BASELINE_CATEGORIES[cleanCatSlug] || null;
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSearch('');
    setSelectedSeries('All');

    // Pre-populate baseline category immediately so UI never flickers with "Not Found"
    const baseline = BASELINE_CATEGORIES[cleanCatSlug];
    if (baseline) {
      setCategory(baseline);
      if (BASELINE_MODELS[cleanCatSlug]) {
        setModels(BASELINE_MODELS[cleanCatSlug] as Model[]);
      }
    }

    fetch(`/api/categories/${cleanCatSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Category not found in API');
        return res.json();
      })
      .then((data) => {
        if (data.category) setCategory(data.category);
        if (data.brands && data.brands.length > 0) {
          setBrands(data.brands);
        } else if (cleanCatSlug === 'mobile' || cleanCatSlug === 'tablet') {
          // Context brands fallback
          const matchingBrands = contextBrands.filter((b) => {
            const bCat = (b.categorySlug || '').toLowerCase();
            return cleanCatSlug === 'tablet' ? bCat === 'tablet' : !bCat || bCat === 'mobile';
          });
          if (matchingBrands.length > 0) setBrands(matchingBrands);
        }

        if (data.models && data.models.length > 0) {
          setModels(data.models);
        }
      })
      .catch(() => {
        // Fallback to searching category in context or baseline
        const found =
          categories.find((c) => c.slug === cleanCatSlug) ||
          BASELINE_CATEGORIES[cleanCatSlug] ||
          null;
        if (found) setCategory(found);

        // Fallback brands from context
        if (cleanCatSlug === 'mobile' || cleanCatSlug === 'tablet') {
          const matchingBrands = contextBrands.filter((b) => {
            const bCat = (b.categorySlug || '').toLowerCase();
            return cleanCatSlug === 'tablet' ? bCat === 'tablet' : !bCat || bCat === 'mobile';
          });
          if (matchingBrands.length > 0) setBrands(matchingBrands);
        }

        // Fallback models from baseline
        if (BASELINE_MODELS[cleanCatSlug]) {
          setModels(BASELINE_MODELS[cleanCatSlug] as Model[]);
        }
      })
      .finally(() => setLoading(false));
  }, [cleanCatSlug, categories, contextBrands]);

  // Breadcrumbs schema for SEO
  const breadcrumbItems = React.useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
    return [
      { name: 'Home', url: `${origin}/` },
      { name: category?.name || 'Device Categories', url: `${origin}/categories/${categorySlug}` },
    ];
  }, [category, categorySlug]);

  const breadcrumbSchema = React.useMemo(() => generateBreadcrumbSchema(breadcrumbItems), [breadcrumbItems]);
  useJsonLd(`breadcrumb-cat-${categorySlug}`, breadcrumbSchema);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-[#00B2A2] border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Loading {categorySlug} display repair options...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center mx-auto max-w-md px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Category Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">The requested device category could not be located.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded-xl bg-[#00B2A2] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const isMobile = category.slug === 'mobile';
  const isTablet = category.slug === 'tablet';
  const isIPad = category.slug === 'ipad';
  const isAppleWatch = category.slug === 'apple-watch';

  // Category Icon
  const CategoryIcon = isAppleWatch ? Watch : isMobile ? Smartphone : Tablet;

  // Filter brands or models
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  // For direct model categories (iPad & Apple Watch)
  const availableSeries = Array.from(new Set(models.map((m) => m.series).filter(Boolean))) as string[];

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()));

    const matchesSeries = selectedSeries === 'All' || m.series === selectedSeries;

    return matchesSearch && matchesSeries;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50/50 dark:bg-[#0B1110] transition-colors min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li>
              <button
                onClick={() => navigate('/')}
                className="hover:text-[#00B2A2] transition-colors cursor-pointer"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="text-[#00B2A2]">{category.name}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Header Banner */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 mb-8 sm:mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#00B2A2]/10 text-[#00B2A2] dark:bg-[#00B2A2]/20 shrink-0 shadow-xs">
                <CategoryIcon className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Dedicated Display Repair Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {category.name} Display Repair Services
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {category.description ||
                    `Specialized optical cleanroom display restoration and touch glass repair for flagship ${category.name} devices.`}
                </p>
              </div>
            </div>

            {/* Quick stats badge */}
            <div className="hidden lg:flex flex-col items-end text-right border-l border-slate-200 dark:border-slate-800 pl-6 shrink-0">
              <span className="text-2xl font-black text-[#00B2A2]">
                {category.hasBrands ? brands.length : models.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {category.hasBrands ? 'Brands Available' : 'Models Supported'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE A: MOBILE or TABLET CATEGORY -> Displays Brands listed in Admin Panel */}
        {/* ========================================================================= */}
        {category.hasBrands && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Select {category.name} Brand
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredBrands.length} listed {category.name.toLowerCase()} brands
                </p>
              </div>

              {/* Search Bar for Brands */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${category.name} brands (e.g. Apple, Samsung)...`}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            {filteredBrands.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold">No {category.name} brands found matching "{search}"</p>
                <p className="text-xs mt-1 text-slate-400">Try searching for Apple, Samsung, OnePlus, or other flagship brands.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => navigate(`/categories/${category.slug}/${brand.slug}`)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#00B2A2] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                  >
                    <div>
                      {/* Brand Logo / Icon */}
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-50 dark:bg-slate-800/80 mx-auto mb-4 flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={`${brand.name} logo`}
                            className="max-h-full max-w-full object-contain filter dark:brightness-110"
                            loading="lazy"
                          />
                        ) : (
                          <Smartphone className="h-8 w-8 text-[#00B2A2]" />
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white text-center group-hover:text-[#00B2A2] transition-colors">
                        {brand.name}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 font-medium line-clamp-2">
                        {brand.description || `Explore all ${brand.name} ${category.name.toLowerCase()} models for display repair.`}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#00B2A2]">
                      <span className="group-hover:underline">Explore Models</span>
                      <div className="h-6 w-6 rounded-full bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CASE B: IPAD or APPLE WATCH CATEGORY -> Displays Models directly          */}
        {/* ========================================================================= */}
        {!category.hasBrands && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Select {category.name} Model
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredModels.length} supported {category.name} models for display repair
                </p>
              </div>

              {/* Search Bar for Models */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${category.name} models...`}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            {/* Series Filter Tabs (e.g. iPad Pro, iPad Air, iPad mini or Ultra, Series, SE) */}
            {availableSeries.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                <button
                  onClick={() => setSelectedSeries('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedSeries === 'All'
                      ? 'bg-[#00B2A2] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#00B2A2]'
                  }`}
                >
                  All Models ({models.length})
                </button>
                {availableSeries.map((series) => {
                  const countInSeries = models.filter((m) => m.series === series).length;
                  return (
                    <button
                      key={series}
                      onClick={() => setSelectedSeries(series)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        selectedSeries === series
                          ? 'bg-[#00B2A2] text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#00B2A2]'
                      }`}
                    >
                      {series} ({countInSeries})
                    </button>
                  );
                })}
              </div>
            )}

            {filteredModels.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold">No {category.name} models found matching your search</p>
                <p className="text-xs mt-1 text-slate-400">Try adjusting your search terms or series filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => navigate(`/models/${model.slug}`)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3.5 md:p-4 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00B2A2] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer select-none"
                  >
                    <div>
                      {/* Model Image Container */}
                      <div className="relative h-24 sm:h-28 md:h-32 w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/80 mb-2 sm:mb-2.5 flex items-center justify-center p-1.5 sm:p-2">
                        {model.imageUrl ? (
                          <img
                            src={model.imageUrl}
                            alt={`${model.name} display repair`}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-108"
                            loading="lazy"
                          />
                        ) : (
                          <CategoryIcon className="h-8 w-8 sm:h-10 sm:w-10 text-[#00B2A2]" />
                        )}
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-bold text-[#00B2A2] uppercase tracking-wider block mb-0.5 truncate">
                        {category.name}
                      </span>

                      <h3 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors line-clamp-2 leading-tight">
                        {model.name}
                      </h3>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#00B2A2]">
                      <span className="truncate group-hover:underline">Display Services</span>
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors shrink-0">
                        <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
