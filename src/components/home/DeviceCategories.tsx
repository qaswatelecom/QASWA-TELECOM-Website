import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Smartphone, Watch, Tablet, ArrowRight, Sparkles } from 'lucide-react';
import { DeviceCategory } from '../../types/index.ts';

interface DeviceCategoriesProps {
  onSelectCategory?: (categorySlug: string) => void;
}

const DEFAULT_FOUR: Array<{
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  icon: string;
}> = [
  {
    id: 1,
    name: 'Mobile',
    slug: 'mobile',
    tagline: 'Apple, Samsung, OnePlus, Google Pixel, Vivo, Oppo, Xiaomi',
    description: 'Specialized AMOLED, OLED, and Super Retina display repair solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    icon: 'Smartphone',
  },
  {
    id: 2,
    name: 'iPad',
    slug: 'ipad',
    tagline: 'iPad, iPad mini, iPad Air, iPad Pro',
    description: 'Precision display & glass repair with digitizer optical alignment.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    icon: 'Tablet',
  },
  {
    id: 3,
    name: 'Apple Watch',
    slug: 'apple-watch',
    tagline: 'Apple Watch Ultra, Series & SE Generations',
    description: 'Sapphire crystal glass replacement and OLED panel restoration.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    icon: 'Watch',
  },
  {
    id: 4,
    name: 'Tablet',
    slug: 'tablet',
    tagline: 'Samsung, OnePlus, Xiaomi, Lenovo & more',
    description: 'Large-format AMOLED display restoration and touch digitizer repair.',
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    icon: 'Tablet',
  },
];

export const DeviceCategories: React.FC<DeviceCategoriesProps> = ({ onSelectCategory }) => {
  const { categories, navigate } = useApp();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Get active categories from AppContext / DB or fallback to default 4
  const displayCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      const allowed = ['mobile', 'ipad', 'apple-watch', 'tablet'];
      const filtered = categories.filter((c) => allowed.includes(c.slug));
      if (filtered.length >= 4) {
        return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return categories.slice(0, 4);
    }
    return DEFAULT_FOUR;
  }, [categories]);

  const handleCategoryClick = (cat: { slug: string; name: string }) => {
    if (onSelectCategory) {
      onSelectCategory(cat.slug);
    }
    navigate(`/categories/${cat.slug}`);
  };

  const getIcon = (slug: string, iconStr?: string | null) => {
    if (slug === 'apple-watch' || iconStr === 'Watch') return Watch;
    if (slug === 'mobile' || iconStr === 'Smartphone') return Smartphone;
    return Tablet;
  };

  return (
    <section id="device-categories-section" className="py-10 sm:py-14 bg-slate-50/70 dark:bg-slate-900/40 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header - Search bar intentionally removed as requested */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Dedicated Display Specialization</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">4 Core Device Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select Your Device Category
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              Cleanroom laboratory calibrated for Mobile, iPad, Apple Watch, and Tablet display restoration.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate('/brands')}
              className="text-xs sm:text-sm font-bold text-[#00B2A2] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayCategories.map((cat) => {
            const CatIcon = getIcon(cat.slug, (cat as DeviceCategory).icon);
            const isHovered = hoveredSlug === cat.slug;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onClick={() => handleCategoryClick(cat)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-4 sm:p-5 bg-white dark:bg-slate-900 ${
                  isHovered
                    ? 'border-[#00B2A2] shadow-xl -translate-y-1.5'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 p-1.5 sm:p-2 flex items-center justify-center">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={`${cat.name} display repair`}
                        className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CatIcon className="h-12 w-12 text-[#00B2A2]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-30 pointer-events-none" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                      <CatIcon className="h-3.5 w-3.5 text-[#00B2A2]" />
                      <span>{cat.name}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-2">
                    {cat.tagline || cat.description}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00B2A2] group-hover:underline">
                    {cat.slug === 'mobile'
                      ? 'Browse Mobile Brands'
                      : cat.slug === 'tablet'
                      ? 'Browse Tablet Brands'
                      : `View ${cat.name} Models`}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
