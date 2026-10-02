import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowRight,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { GalleryItem } from '../../types/index.ts';

export const RepairGallery: React.FC = () => {
  const { navigate } = useApp();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Responsive visible count: Desktop 3, Tablet 2, Mobile 1
  const [visibleCount, setVisibleCount] = useState<number>(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Fetch homepage gallery images dynamically from admin API
  useEffect(() => {
    let mounted = true;
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/gallery/homepage');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch homepage gallery:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchGallery();
    return () => {
      mounted = false;
    };
  }, []);

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  const nextSlide = useCallback(() => {
    if (totalItems <= visibleCount) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [totalItems, visibleCount, maxIndex]);

  const prevSlide = useCallback(() => {
    if (totalItems <= visibleCount) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [totalItems, visibleCount, maxIndex]);

  // Automatic slideshow timer
  useEffect(() => {
    if (isPaused || totalItems <= visibleCount || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalItems, visibleCount, lightboxIndex]);

  // Adjust index on resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [visibleCount, maxIndex, currentIndex]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
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

  if (loading && items.length === 0) {
    return (
      <section id="gallery" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-[#0B1110] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto animate-pulse" />
          <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded mx-auto mt-4 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-4/3 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const totalDots = Math.max(1, totalItems - visibleCount + 1);

  return (
    <section
      id="gallery"
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-[#0B1110] transition-colors overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
              <Camera className="h-4 w-4" />
              <span>Cleanroom Showcase</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">Display Restoration Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Repair Gallery
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              High-resolution captures of our display repair work for flagship smartphones, Apple Watch, iPad, and tablets.
            </p>
          </div>

          {/* View All Gallery & Navigation Controls */}
          <div className="flex flex-col items-end gap-2.5 self-end">
            <button
              onClick={() => navigate('/gallery')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2A2] hover:text-[#009e90] transition-colors cursor-pointer"
            >
              <span>View All Gallery</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Gallery Image"
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] dark:hover:border-[#00B2A2] dark:hover:text-[#00B2A2] shadow-sm transition-all focus:outline-hidden cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Gallery Image"
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] dark:hover:border-[#00B2A2] dark:hover:text-[#00B2A2] shadow-sm transition-all focus:outline-hidden cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(-${currentIndex * (100 / visibleCount)}%, 0, 0)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div
                  onClick={() => setLightboxIndex(idx)}
                  className="group h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:border-[#00B2A2] hover:shadow-xl cursor-pointer"
                >
                  <div>
                    {/* Clean Image Container at top - No text overlays */}
                    <div className="relative aspect-16/9 sm:aspect-4/3 w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Content Area - All text cleanly positioned below the image */}
                    <div className="p-5 sm:p-6">
                      {/* Category & Brand Metadata */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#00B2A2]/10 text-[#00B2A2] text-xs font-semibold uppercase tracking-wider">
                          {item.categorySlug || 'Display'}
                        </span>
                        {item.brandSlug && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                            {item.brandSlug.replace(/-/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      {/* Caption / Description directly underneath title */}
                      {item.caption && (
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 pb-5 pt-0">
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2A2] group-hover:translate-x-1 transition-transform">
                        <span>Inspect Display Work</span>
                        <Maximize2 className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalDots > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6 sm:mt-8">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-7 h-2 bg-[#00B2A2]'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#00B2A2]/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* "View All Gallery" Button Linking to Dedicated /gallery Page */}
        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#00B2A2] hover:bg-[#009e90] active:scale-95 shadow-md shadow-[#00B2A2]/25 transition-all duration-200 cursor-pointer"
          >
            <span>View All Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
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
    </section>
  );
};
