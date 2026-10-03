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
} from './BrandLogos.tsx';

export interface RepairBrandItem {
  id: number;
  name: string;
  slug: string;
  categorySlug: string;
  logoUrl?: string | null;
  Component?: React.FC<{ className?: string }> | null;
}

// 10 requested smartphone manufacturer brands as baseline
export const REPAIR_BRANDS: RepairBrandItem[] = [
  { id: 1, name: 'Apple', slug: 'apple', categorySlug: 'mobile', Component: AppleLogo },
  { id: 2, name: 'Samsung', slug: 'samsung', categorySlug: 'mobile', Component: SamsungLogo },
  { id: 3, name: 'Google Pixel', slug: 'google-pixel', categorySlug: 'mobile', Component: GooglePixelLogo },
  { id: 4, name: 'OnePlus', slug: 'oneplus', categorySlug: 'mobile', Component: OnePlusLogo },
  { id: 5, name: 'Vivo', slug: 'vivo', categorySlug: 'mobile', Component: VivoLogo },
  { id: 6, name: 'Oppo', slug: 'oppo', categorySlug: 'mobile', Component: OppoLogo },
  { id: 7, name: 'Poco', slug: 'poco', categorySlug: 'mobile', Component: PocoLogo },
  { id: 8, name: 'Realme', slug: 'realme', categorySlug: 'mobile', Component: RealmeLogo },
  { id: 9, name: 'Motorola', slug: 'motorola', categorySlug: 'mobile', Component: MotorolaLogo },
  { id: 10, name: 'Tecno', slug: 'tecno', categorySlug: 'mobile', Component: TecnoLogo },
];

export const ExploreTopBrands: React.FC = () => {
  const { brands: allBrands, navigate } = useApp();
  const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);

  // STRICTLY filter active brands belonging to the 'mobile' category
  const mobileBrandsFromDb = useMemo(() => {
    return allBrands.filter(
      (b) =>
        (b.categorySlug === 'mobile' || (!b.categorySlug && (b as any).categoryId === 1)) &&
        b.isActive !== false
    );
  }, [allBrands]);

  // Combine database brands with matching high-fidelity SVG logos
  const displayBrands = useMemo<RepairBrandItem[]>(() => {
    if (mobileBrandsFromDb.length > 0) {
      return mobileBrandsFromDb.map((b) => {
        const matchingPreset = REPAIR_BRANDS.find(
          (p) =>
            p.slug === b.slug ||
            p.name.toLowerCase() === b.name.toLowerCase() ||
            (b.slug === 'iphone' && p.slug === 'apple') ||
            (b.slug.includes('samsung') && p.slug === 'samsung') ||
            (b.slug.includes('pixel') && p.slug === 'google-pixel')
        );

        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          categorySlug: 'mobile',
          logoUrl: b.logoUrl,
          Component: matchingPreset ? matchingPreset.Component : null,
        };
      });
    }
    return REPAIR_BRANDS;
  }, [mobileBrandsFromDb]);

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
            const LogoComponent = brand.Component;

            return (
              <div
                key={brand.id}
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
                  <div className="w-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                    {LogoComponent ? (
                      <LogoComponent className="max-h-8 sm:max-h-10 md:max-h-11 max-w-[85%]" />
                    ) : brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        className="max-h-8 sm:max-h-10 md:max-h-11 max-w-[85%] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <Smartphone className="h-8 w-8 text-[#00B2A2]" />
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
