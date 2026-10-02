import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Camera,
  Filter,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone,
  Watch,
  Tablet,
  CheckCircle2,
  ArrowRight,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { GalleryItem } from '../types/index.ts';

const CATEGORY_NAMES: Record<string, string> = {
  mobile: 'Mobile',
  ipad: 'iPad',
  'apple-watch': 'Apple Watch',
  tablet: 'Tablet',
};

export const GalleryPage: React.FC = () => {
  const { categories, brands, navigate } = useApp();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch gallery items
  const fetchItems = useCallback(
    async (pageNum: number, isAppend: boolean = false) => {
      try {
        if (isAppend) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = new URLSearchParams({
          page: String(pageNum),
          limit: '8',
        });
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedBrand !== 'all') params.append('brand', selectedBrand);

        const res = await fetch(`/api/gallery?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isAppend) {
            setItems((prev) => [...prev, ...(data.items || [])]);
          } else {
            setItems(data.items || []);
          }
          setTotal(data.total || 0);
          setHasMore(Boolean(data.hasMore));
          setPage(pageNum);
          if (data.availableCategories) setAvailableCategories(data.availableCategories);
          if (data.availableBrands) setAvailableBrands(data.availableBrands);
        }
      } catch (err) {
        console.error('Failed to fetch gallery items:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, selectedBrand]
  );

  // Refetch when filters change
  useEffect(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchItems(page + 1, true);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items.length]);

  // Touch gestures for Lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const distance = touchStartX - e.changedTouches[0].clientX;
    if (distance > 40) {
      // Swipe left -> next
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
    } else if (distance < -40) {
      // Swipe right -> prev
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1110] text-slate-900 dark:text-white transition-colors pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 md:py-28 text-white border-b border-slate-800">
        {/* Background Image with Dark Tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80"
            alt="Cleanroom Repair Lab Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 text-[#00B2A2] text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md">
            <Camera className="h-4 w-4" />
            <span>Precision Display Lab Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Our Repair Gallery
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore our display repair work for premium and flagship devices.
          </p>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* 3. Gallery Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
          {/* Category Filter Pills (Only categories with published images) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#00B2A2] text-white shadow-md shadow-[#00B2A2]/25'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#00B2A2]'
              }`}
            >
              All Categories
            </button>

            {availableCategories.map((catSlug) => {
              const label = CATEGORY_NAMES[catSlug] || catSlug.toUpperCase();
              const isSelected = selectedCategory === catSlug;
              return (
                <button
                  key={catSlug}
                  onClick={() => {
                    setSelectedCategory(catSlug);
                    setSelectedBrand('all');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00B2A2] text-white shadow-md shadow-[#00B2A2]/25'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#00B2A2]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Brand Filter Dropdown / Pills (Only brands with published images) */}
          {availableBrands.length > 0 && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Brand:
              </span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-[#00B2A2] cursor-pointer"
              >
                <option value="all">All Brands</option>
                {availableBrands.map((bSlug) => (
                  <option key={bSlug} value={bSlug} className="capitalize">
                    {bSlug.replace(/-/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 4. Gallery Image Grid
            Responsive layout:
            - Desktop: 4 images per row (lg:grid-cols-4)
            - Tablet: 3 images per row (sm:grid-cols-3)
            - Mobile: 2 images per row (grid-cols-2)
        */}
        {loading && items.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-4/3 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Camera className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No gallery images found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              No display repair images match the selected category or brand filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group h-full flex flex-col justify-between rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all duration-300 hover:border-[#00B2A2] hover:-translate-y-1 cursor-pointer select-none"
              >
                <div>
                  {/* Clean Image Container at top - No text overlays */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Content Area - All text cleanly positioned below image */}
                  <div className="p-3.5 sm:p-5">
                    {/* Category & Brand Metadata */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#00B2A2]/10 text-[#00B2A2] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                        {item.categorySlug || 'Display'}
                      </span>
                      {item.brandSlug && (
                        <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 capitalize line-clamp-1">
                          {item.brandSlug.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description directly underneath title */}
                    {item.caption && (
                      <p className="mt-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4 pt-0">
                  <div className="pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#00B2A2] group-hover:translate-x-0.5 transition-transform">
                      <span>View Photo</span>
                      <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Load More Button */}
        {hasMore && (
          <div className="text-center mt-12 sm:mt-16">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#00B2A2] hover:bg-[#009e90] active:scale-95 shadow-md shadow-[#00B2A2]/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Loading More Images...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* 6. Image Lightbox with Next & Previous Navigation & Touch Swiping */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#00B2A2] transition-colors border border-white/20 focus:outline-hidden"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Left */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null))
              }
              className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-[#00B2A2] transition-colors border border-white/20 focus:outline-hidden"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Navigation Right */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null))
              }
              className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-[#00B2A2] transition-colors border border-white/20 focus:outline-hidden"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Container */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={items[lightboxIndex].imageUrl}
                alt={items[lightboxIndex].title}
                className="max-h-[75vh] max-w-full object-contain rounded-xl select-none"
              />
            </div>

            {/* Lightbox Caption & Details */}
            <div className="mt-4 text-center max-w-2xl px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B2A2]/20 text-[#00B2A2] text-xs font-bold mb-2">
                <span>{items[lightboxIndex].categorySlug?.toUpperCase() || 'DISPLAY REPAIR'}</span>
                {items[lightboxIndex].brandSlug && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{items[lightboxIndex].brandSlug}</span>
                  </>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {items[lightboxIndex].title}
              </h3>
              {items[lightboxIndex].caption && (
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                  {items[lightboxIndex].caption}
                </p>
              )}
              <div className="mt-2 text-xs text-slate-400">
                Image {lightboxIndex + 1} of {items.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
