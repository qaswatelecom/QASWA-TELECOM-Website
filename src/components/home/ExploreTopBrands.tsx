import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Brand } from '../../types/index.ts';

// High-fidelity fallback brands list ensuring this section is ALWAYS visible and functional
const DEFAULT_TOP_BRANDS: Array<{
  id: number;
  name: string;
  slug: string;
  categorySlug: string;
  logoUrl: string;
  isDarkLogo?: boolean;
}> = [
  {
    id: 101,
    name: 'Apple',
    slug: 'apple',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    isDarkLogo: true,
  },
  {
    id: 102,
    name: 'Samsung',
    slug: 'samsung',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  },
  {
    id: 103,
    name: 'Google Pixel',
    slug: 'google-pixel',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
  {
    id: 104,
    name: 'OnePlus',
    slug: 'oneplus',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_RGB_RED_copy.svg',
  },
  {
    id: 105,
    name: 'Xiaomi',
    slug: 'xiaomi',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
  },
  {
    id: 106,
    name: 'Vivo',
    slug: 'vivo',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png',
  },
  {
    id: 107,
    name: 'Oppo',
    slug: 'oppo',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
  },
  {
    id: 108,
    name: 'Realme',
    slug: 'realme',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg',
  },
  {
    id: 109,
    name: 'Motorola',
    slug: 'motorola',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Motorola-logo.svg',
    isDarkLogo: true,
  },
  {
    id: 110,
    name: 'Nothing',
    slug: 'nothing',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Nothing_logo.svg/512px-Nothing_logo.svg.png',
    isDarkLogo: true,
  },
  {
    id: 111,
    name: 'iQOO',
    slug: 'iqoo',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/IQOO_logo.svg/512px-IQOO_logo.svg.png',
  },
  {
    id: 112,
    name: 'Honor',
    slug: 'honor',
    categorySlug: 'mobile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Honor_Logo.svg/512px-Honor_Logo.svg.png',
  },
];

export const ExploreTopBrands: React.FC = () => {
  const { brands, navigate } = useApp();
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  // Filter active mobile / top brands and order by sortOrder; fallback to defaults if database is still bootstrapping
  const topBrands = React.useMemo(() => {
    if (brands && brands.length > 0) {
      const filtered = brands.filter(
        (b) =>
          b.isActive &&
          (b.categorySlug === 'mobile' || !b.categorySlug) &&
          !['nokia', 'asus'].includes(b.slug.toLowerCase()) &&
          !['nokia', 'asus'].includes(b.name.toLowerCase())
      );
      if (filtered.length >= 4) {
        return filtered.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      }
    }
    return DEFAULT_TOP_BRANDS;
  }, [brands]);

  const handleBrandClick = (brand: Brand | (typeof DEFAULT_TOP_BRANDS)[0]) => {
    const categorySlug = brand.categorySlug || 'mobile';
    navigate(`/categories/${categorySlug}/${brand.slug}`);
  };

  const handleImageError = (brandId: number) => {
    setBrokenImages((prev) => ({ ...prev, [brandId]: true }));
  };

  return (
    <section id="explore-top-brands" className="py-12 sm:py-16 md:py-20 bg-slate-50/70 dark:bg-slate-950/60 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
            BRANDS WE REPAIR
          </h2>
          {/* Brand Color Accent Bar */}
          <div className="w-14 sm:w-16 h-1 bg-[#00B2A2] rounded-full mx-auto mt-2.5 sm:mt-3 shadow-xs" />
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Expert display restoration and laser flex bonding for all major smartphone manufacturers
          </p>
        </div>

        {/* Responsive Brand Logos Grid:
            - Desktop: 6 per row (lg:grid-cols-6)
            - Tablet: 4 per row (sm:grid-cols-4)
            - Mobile: 3 per row (grid-cols-3)
        */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
          {topBrands.map((brand) => {
            const isHovered = hoveredBrandId === brand.id;
            const isBlackLogo =
              ('isDarkLogo' in brand && brand.isDarkLogo) ||
              ['apple', 'nothing', 'asus', 'motorola'].includes(brand.slug.toLowerCase());

            return (
              <div
                key={brand.id}
                onMouseEnter={() => setHoveredBrandId(brand.id)}
                onMouseLeave={() => setHoveredBrandId(null)}
                onClick={() => handleBrandClick(brand)}
                title={`Explore ${brand.name} display repair services`}
                className={`group relative flex items-center justify-center p-3 sm:p-5 aspect-square rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer select-none bg-white dark:bg-slate-900 ${
                  isHovered
                    ? 'border-[#00B2A2] shadow-xl -translate-y-1 ring-2 ring-[#00B2A2]/20'
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
                      className={`max-h-8 sm:max-h-10 md:max-h-12 max-w-[75%] sm:max-w-[80%] object-contain transition-transform duration-300 ease-out group-hover:scale-110 ${
                        isBlackLogo ? 'dark:invert dark:brightness-125' : 'dark:brightness-105'
                      }`}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-[#00B2A2] transition-colors line-clamp-1 text-center">
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
