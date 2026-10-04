import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Smartphone } from 'lucide-react';
import {
  AppleLogo,
  SamsungLogo,
  GooglePixelLogo,
  OnePlusLogo,
  VivoLogo,
  OppoLogo,
  PocoLogo,
  RealmeLogo,
  MotorolaLogo,
  TecnoLogo,
  BRAND_SVG_MAP,
} from './BrandLogos.tsx';

export interface RepairBrandItem {
  id: number;
  name: string;
  slug: string;
  categorySlug: string;
  logoUrl?: string | null;
  Component?: React.FC<{ className?: string }> | null;
}

// 10 requested smartphone manufacturer brands as the core baseline standard
export const REPAIR_BRANDS: RepairBrandItem[] = [
  { id: 1, name: 'Apple', slug: 'apple', categorySlug: 'mobile', logoUrl: '/brands/apple.svg', Component: AppleLogo },
  { id: 2, name: 'Samsung', slug: 'samsung', categorySlug: 'mobile', logoUrl: '/brands/samsung.svg', Component: SamsungLogo },
  { id: 3, name: 'Google Pixel', slug: 'google-pixel', categorySlug: 'mobile', logoUrl: '/brands/google-pixel.svg', Component: GooglePixelLogo },
  { id: 4, name: 'OnePlus', slug: 'oneplus', categorySlug: 'mobile', logoUrl: '/brands/oneplus.svg', Component: OnePlusLogo },
  { id: 5, name: 'Vivo', slug: 'vivo', categorySlug: 'mobile', logoUrl: '/brands/vivo.svg', Component: VivoLogo },
  { id: 6, name: 'Oppo', slug: 'oppo', categorySlug: 'mobile', logoUrl: '/brands/oppo.svg', Component: OppoLogo },
  { id: 7, name: 'Poco', slug: 'poco', categorySlug: 'mobile', logoUrl: '/brands/poco.svg', Component: PocoLogo },
  { id: 8, name: 'Realme', slug: 'realme', categorySlug: 'mobile', logoUrl: '/brands/realme.svg', Component: RealmeLogo },
  { id: 9, name: 'Motorola', slug: 'motorola', categorySlug: 'mobile', logoUrl: '/brands/motorola.svg', Component: MotorolaLogo },
  { id: 10, name: 'Tecno', slug: 'tecno', categorySlug: 'mobile', logoUrl: '/brands/tecno.svg', Component: TecnoLogo },
];

export const ExploreTopBrands: React.FC = () => {
  const { brands: allBrands, navigate } = useApp();
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Blacklist to strictly prevent non-mobile categories from leaking into Brands We Repair
  const EXCLUDED_KEYWORDS = ['tablet', 'tablets', 'ipad', 'watch', 'apple-watch', 'premium-tablets'];

  // Start with the 10 smartphone manufacturer brands, synced with DB images, then append extra mobile brands from DB
  const displayBrands = useMemo<RepairBrandItem[]>(() => {
    // Map each baseline smartphone brand with its real database properties if available
    const baselineWithDb: RepairBrandItem[] = REPAIR_BRANDS.map((base) => {
      const baseSlug = base.slug.toLowerCase();
      const baseName = base.name.toLowerCase();

      // Find corresponding mobile brand in DB
      const dbMatch = allBrands.find((b) => {
        const bSlug = (b.slug || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        const bCat = (b.categorySlug || '').toLowerCase();
        if (bCat && bCat !== 'mobile') return false;
        if (EXCLUDED_KEYWORDS.some((kw) => bSlug.includes(kw) || bName.includes(kw))) return false;

        return (
          bSlug === baseSlug ||
          bName === baseName ||
          (baseSlug === 'apple' && (bSlug === 'iphone' || bName.includes('iphone') || bName.includes('apple'))) ||
          (baseSlug === 'samsung' && (bSlug.includes('samsung') || bName.includes('samsung'))) ||
          (baseSlug === 'google-pixel' && (bSlug.includes('pixel') || bName.includes('pixel') || bSlug === 'google'))
        );
      });

      if (dbMatch) {
        return {
          id: dbMatch.id,
          name: base.name,
          slug: dbMatch.slug || base.slug,
          categorySlug: 'mobile',
          logoUrl: dbMatch.logoUrl || base.logoUrl || `/brands/${base.slug}.svg`,
          Component: base.Component,
        };
      }

      return base;
    });

    const extraMobileBrands: RepairBrandItem[] = [];

    allBrands.forEach((b) => {
      const lowerSlug = (b.slug || '').toLowerCase();
      const lowerName = (b.name || '').toLowerCase();
      const catSlug = (b.categorySlug || '').toLowerCase();

      // Strictly mobile only
      if (catSlug && catSlug !== 'mobile') return;
      if (EXCLUDED_KEYWORDS.some((kw) => lowerSlug.includes(kw) || lowerName.includes(kw))) return;

      // Skip if this brand is already covered by the baseline smartphone brands
      const isAlreadyCovered = baselineWithDb.some(
        (base) =>
          base.slug === lowerSlug ||
          base.name.toLowerCase() === lowerName ||
          base.id === b.id ||
          (base.slug === 'apple' && (lowerSlug === 'iphone' || lowerName.includes('iphone') || lowerName.includes('apple'))) ||
          (base.slug === 'samsung' && (lowerSlug.includes('samsung') || lowerName.includes('samsung'))) ||
          (base.slug === 'google-pixel' && (lowerSlug.includes('pixel') || lowerName.includes('pixel') || lowerSlug === 'google'))
      );

      if (!isAlreadyCovered && b.isActive !== false) {
        const cleanSlug = lowerSlug.replace('-mobile', '');
        const matchedComponent =
          BRAND_SVG_MAP[lowerSlug] ||
          BRAND_SVG_MAP[lowerName] ||
          BRAND_SVG_MAP[cleanSlug];

        extraMobileBrands.push({
          id: b.id,
          name: b.name,
          slug: b.slug,
          categorySlug: 'mobile',
          logoUrl: b.logoUrl || `/brands/${cleanSlug}.svg`,
          Component: matchedComponent || null,
        });
      }
    });

    return [...baselineWithDb, ...extraMobileBrands];
  }, [allBrands]);

  const handleBrandClick = (brand: RepairBrandItem) => {
    // Strictly route to the mobile category models page
    navigate(`/categories/mobile/${brand.slug}`);
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
            - Desktop: 6 cards per row (lg:grid-cols-6)
            - Tablet: 4 cards per row (sm:grid-cols-4)
            - Mobile: 3 cards per row (grid-cols-3)
        */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {displayBrands.map((brand) => {
            const isHovered = hoveredBrandId === brand.id;
            const isBroken = imageErrors[brand.id];
            const hasLogoUrl = !!brand.logoUrl && !isBroken;
            const LogoComponent =
              brand.Component ||
              BRAND_SVG_MAP[brand.slug.toLowerCase()] ||
              BRAND_SVG_MAP[brand.name.toLowerCase()] ||
              BRAND_SVG_MAP[brand.slug.toLowerCase().replace('-mobile', '')];

            return (
              <div
                key={`${brand.id}-${brand.slug}`}
                onMouseEnter={() => setHoveredBrandId(brand.id)}
                onMouseLeave={() => setHoveredBrandId(null)}
                onClick={() => handleBrandClick(brand)}
                title={`Explore ${brand.name} smartphone display repair services`}
                className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-5 aspect-square rounded-2xl border transition-all duration-300 cursor-pointer select-none bg-white dark:bg-slate-900 ${
                  isHovered
                    ? 'border-[#00B2A2] shadow-xl -translate-y-1.5 ring-2 ring-[#00B2A2]/25'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3)] hover:border-[#00B2A2]'
                }`}
              >
                {/* Brand Logo Container */}
                <div className="w-full flex-1 flex items-center justify-center p-2">
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                    {hasLogoUrl ? (
                      <img
                        src={brand.logoUrl!}
                        alt={`${brand.name} logo`}
                        className="max-h-8 sm:max-h-10 md:max-h-11 max-w-[85%] object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [brand.id]: true }))
                        }
                      />
                    ) : LogoComponent ? (
                      <LogoComponent className="max-h-8 sm:max-h-10 md:max-h-11 max-w-[85%] object-contain" />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs sm:text-sm text-[#00B2A2]">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Brand Name Label */}
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#00B2A2] transition-colors line-clamp-1 text-center">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
