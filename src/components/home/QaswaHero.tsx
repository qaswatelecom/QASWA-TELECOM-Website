import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, Watch, ArrowRight } from 'lucide-react';
import { usePageContent, HomePageContent, DEFAULT_HOME_CONTENT } from '../../lib/pageContent.ts';
import { useApp } from '../../context/AppContext.tsx';
import { DeviceCategory } from '../../types/index.ts';

const DEFAULT_FOUR_CATEGORIES: Array<{
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
    tagline: 'iPhone, Samsung, OnePlus & More',
    description: 'Flagship smartphone display & AMOLED specialists',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    icon: 'Smartphone',
  },
  {
    id: 2,
    name: 'iPad',
    slug: 'ipad',
    tagline: 'Pro, Air, mini & Standard Models',
    description: 'Ultra Retina Tandem OLED & Liquid Retina XDR',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    icon: 'Tablet',
  },
  {
    id: 3,
    name: 'Apple Watch',
    slug: 'apple-watch',
    tagline: 'Ultra, Series & SE Generations',
    description: 'Sapphire crystal glass & retinal OLED repair',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    icon: 'Watch',
  },
  {
    id: 4,
    name: 'Tablet',
    slug: 'tablet',
    tagline: 'Samsung, OnePlus, Xiaomi & Lenovo',
    description: 'Flagship large-format AMOLED & display glass',
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    icon: 'Tablet',
  },
];

interface QaswaHeroProps {
  onSelectCategory?: (categoryName: string) => void;
  onSearchFocus?: () => void;
}

export const QaswaHero: React.FC<QaswaHeroProps> = ({ onSelectCategory }) => {
  const { content } = usePageContent<HomePageContent>('home');
  const { categories, navigate } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = content?.hero?.slides || DEFAULT_HOME_CONTENT.hero.slides;

  // Prefer categories from database/admin panel; filter or fallback to the 4 main categories
  const displayCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      // Find the 4 main categories: mobile, ipad, apple-watch, tablet
      const allowedSlugs = ['mobile', 'ipad', 'apple-watch', 'tablet'];
      const filtered = categories.filter((c) => allowedSlugs.includes(c.slug));
      if (filtered.length >= 4) {
        return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
      }
      // If slugs were adjusted or active categories exist, pick first 4 active sorted
      const activeCats = categories.filter((c) => c.isActive !== false);
      if (activeCats.length >= 4) {
        return [...activeCats].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 4);
      }
      return categories.slice(0, 4);
    }
    return DEFAULT_FOUR_CATEGORIES;
  }, [categories]);

  useEffect(() => {
    if (isPaused || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const handleCategoryClick = (cat: { slug: string; name: string }) => {
    if (onSelectCategory) {
      onSelectCategory(cat.name);
    }
    // Navigate directly to category page
    navigate(`/categories/${cat.slug}`);
  };

  return (
    <div className="w-full pt-3 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. Slideshow Banner (Only banner image, full width, crossfade, no text/overlay) */}
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-white/10 shadow-xl h-[210px] sm:h-[250px] md:h-[280px] select-none bg-slate-900"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || `Banner slide ${idx + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* 2. Device Categories Section (Four Main Categories: Mobile, iPad, Apple Watch, Tablet) */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
            {displayCategories.map((cat, idx) => {
              const iconMap: Record<string, any> = {
                Smartphone: Smartphone,
                Tablet: Tablet,
                Watch: Watch,
              };
              const CatIcon = (cat.icon && iconMap[cat.icon]) || (cat.slug === 'apple-watch' ? Watch : cat.slug === 'mobile' ? Smartphone : Tablet);

              return (
                <div
                  key={cat.id || idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00B2A2] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                >
                  <div>
                    {/* Image Container with Smooth Zoom */}
                    <div className="relative h-28 sm:h-36 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-3.5 flex items-center justify-center">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={`${cat.name} display repair`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                          loading="lazy"
                        />
                      ) : (
                        <CatIcon className="h-12 w-12 text-[#00B2A2]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Floating Category Icon Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[11px] font-bold text-white shadow-xs">
                        <CatIcon className="h-3.5 w-3.5 text-[#00B2A2]" />
                        <span>{cat.name}</span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-1">
                      {cat.tagline || (cat as any).description || 'Specialized display repairs'}
                    </p>
                  </div>

                  {/* Bottom Action Indicator */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold text-[#00B2A2] group-hover:underline">
                      {cat.slug === 'mobile'
                        ? 'View Brands'
                        : cat.slug === 'tablet'
                        ? 'View Tablet Brands'
                        : 'View Models'}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2] group-hover:bg-[#00B2A2] group-hover:text-white transition-colors">
                      <ArrowRight className="h-3 w-3" />
                    </div>
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
