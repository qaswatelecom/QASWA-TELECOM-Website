import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Brand } from '../../types/index.ts';

export const ExploreTopBrands: React.FC = () => {
  const { brands, navigate } = useApp();
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  // Filter active mobile / top brands and order by sortOrder
  const topBrands = React.useMemo(() => {
    if (!brands || brands.length === 0) return [];
    // Filter active brands belonging to mobile or without category, excluding brands not repaired (Nokia, Asus)
    const filtered = brands.filter(
      (b) =>
        b.isActive &&
        (b.categorySlug === 'mobile' || !b.categorySlug) &&
        !['nokia', 'asus'].includes(b.slug.toLowerCase()) &&
        !['nokia', 'asus'].includes(b.name.toLowerCase())
    );
    return filtered.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [brands]);

  const handleBrandClick = (brand: Brand) => {
    // Navigate to brand models page
    const categorySlug = brand.categorySlug || 'mobile';
    navigate(`/categories/${categorySlug}/${brand.slug}`);
  };

  const handleImageError = (brandId: number) => {
    setBrokenImages((prev) => ({ ...prev, [brandId]: true }));
  };

  if (!topBrands || topBrands.length === 0) {
    return null;
  }

  return (
    <section id="explore-top-brands" className="py-12 sm:py-16 md:py-20 bg-slate-50/50 dark:bg-slate-950/40 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
            BRANDS WE REPAIR
          </h2>
          {/* Centered Brand Color Accent Bar (Matching screenshot layout) */}
          <div className="w-14 sm:w-16 h-1 bg-[#00B2A2] rounded-full mx-auto mt-2.5 sm:mt-3 shadow-xs" />
        </div>

        {/* Responsive Brand Logos Grid:
            - Desktop: 6 per row (lg:grid-cols-6)
            - Tablet: 4 per row (sm:grid-cols-4)
            - Mobile: 3 per row (grid-cols-3)
        */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5">
          {topBrands.map((brand) => {
            const isHovered = hoveredBrandId === brand.id;
            const isBlackLogo = ['apple', 'nothing', 'asus', 'motorola'].includes(brand.slug.toLowerCase());

            return (
              <div
                key={brand.id}
                onMouseEnter={() => setHoveredBrandId(brand.id)}
                onMouseLeave={() => setHoveredBrandId(null)}
                onClick={() => handleBrandClick(brand)}
                title={`Explore ${brand.name} display repair services`}
                className={`group relative flex items-center justify-center p-2.5 sm:p-4 aspect-square rounded-xl sm:rounded-xl border transition-all duration-300 cursor-pointer select-none bg-white dark:bg-slate-900/90 ${
                  isHovered
                    ? 'border-[#00B2A2] shadow-lg -translate-y-1 ring-2 ring-[#00B2A2]/20'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3)] hover:border-[#00B2A2]'
                }`}
              >
                {/* Brand Logo */}
                {brand.logoUrl && !brokenImages[brand.id] ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      onError={() => handleImageError(brand.id)}
                      className={`max-h-8 sm:max-h-10 md:max-h-11 max-w-[75%] sm:max-w-[80%] object-contain transition-transform duration-300 ease-out group-hover:scale-110 ${
                        isBlackLogo ? 'dark:invert dark:brightness-125' : 'dark:brightness-105'
                      }`}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors line-clamp-1">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
