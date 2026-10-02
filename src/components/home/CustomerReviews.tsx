import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Quote, ShieldCheck, User, ArrowRight } from 'lucide-react';
import { Testimonial } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

export const CustomerReviews: React.FC = () => {
  const { navigate } = useApp();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Fetch actual testimonials from database via public API
  useEffect(() => {
    let mounted = true;
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data) && data.length > 0) {
            setReviews(data);
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const totalReviews = reviews.length;
  // Total slide positions: loop wrap-around
  const maxIndex = Math.max(0, totalReviews - visibleCount);

  const nextSlide = useCallback(() => {
    if (totalReviews <= visibleCount) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [totalReviews, visibleCount, maxIndex]);

  const prevSlide = useCallback(() => {
    if (totalReviews <= visibleCount) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [totalReviews, visibleCount, maxIndex]);

  // Automatic slideshow timer
  useEffect(() => {
    if (isPaused || totalReviews <= visibleCount) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalReviews, visibleCount]);

  // Adjust currentIndex when visibleCount changes
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

  if (loading && reviews.length === 0) {
    return (
      <section id="reviews-section" className="py-12 sm:py-16 md:py-20 bg-slate-50/60 dark:bg-slate-950/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto animate-pulse" />
          <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded mx-auto mt-4 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  // Calculate total pages for pagination dots
  const totalDots = Math.max(1, totalReviews - visibleCount + 1);

  return (
    <section
      id="reviews-section"
      className="py-12 sm:py-16 md:py-20 bg-slate-50/60 dark:bg-slate-950/60 transition-colors overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
              <MessageSquare className="h-4 w-4" />
              <span>Customer Feedback</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">Display Lab Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Customer Testimonials
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Authentic feedback from device owners who trusted our cleanroom lab for display and touch glass restoration.
            </p>
          </div>

          {/* View All Customer Reviews & Navigation Controls */}
          <div className="flex flex-col items-end gap-2.5 self-end">
            <button
              onClick={() => navigate('/testimonials')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2A2] hover:text-[#009e90] transition-colors cursor-pointer"
            >
              <span>View All Customer Reviews</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Testimonial"
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] dark:hover:border-[#00B2A2] dark:hover:text-[#00B2A2] shadow-sm transition-all focus:outline-hidden cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Testimonial"
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
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="h-full flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-5 sm:p-6 md:p-7 shadow-[0_2px_14px_-3px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_14px_-3px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#00B2A2] hover:shadow-lg">
                  <div>
                    {/* Top row: Rating & Date */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(Math.max(1, Math.min(5, rev.rating || 5)))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {rev.date && (
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {rev.date}
                        </span>
                      )}
                    </div>

                    {/* Device Repaired Badge */}
                    {rev.deviceRepaired && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00B2A2]/10 text-[#00B2A2] text-xs font-semibold mb-3">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{rev.deviceRepaired}</span>
                      </div>
                    )}

                    {/* Customer Review Quote */}
                    <div className="relative mb-4">
                      <Quote className="h-6 w-6 text-slate-200 dark:text-slate-800 absolute -top-1 -left-1 -z-0 opacity-60" />
                      <p className="relative z-10 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 sm:line-clamp-5">
                        "{rev.review}"
                      </p>
                    </div>
                  </div>

                  {/* Customer Info Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/70 flex items-center gap-3">
                    {rev.photoUrl ? (
                      <img
                        src={rev.photoUrl}
                        alt={rev.customerName}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to avatar if broken
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center font-bold text-sm">
                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {rev.customerName}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Verified Display Client
                      </p>
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
      </div>
    </section>
  );
};
