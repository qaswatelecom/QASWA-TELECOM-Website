import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Blog } from '../../types/index.ts';

export const DisplayBlogs: React.FC = () => {
  const { navigate } = useApp();
  const [blogs, setBlogs] = useState<Blog[]>([]);
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

  // Fetch blogs dynamically from database via public API
  useEffect(() => {
    let mounted = true;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data) && data.length > 0) {
            setBlogs(data);
          }
        }
      } catch (err) {
        console.error('Failed to load blogs for homepage carousel:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => {
      mounted = false;
    };
  }, []);

  const totalBlogs = blogs.length;
  const maxIndex = Math.max(0, totalBlogs - visibleCount);

  const nextSlide = useCallback(() => {
    if (totalBlogs <= visibleCount) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [totalBlogs, visibleCount, maxIndex]);

  const prevSlide = useCallback(() => {
    if (totalBlogs <= visibleCount) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [totalBlogs, visibleCount, maxIndex]);

  // Automatic slideshow timer
  useEffect(() => {
    if (isPaused || totalBlogs <= visibleCount) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalBlogs, visibleCount]);

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

  const handleCardClick = (slug: string) => {
    navigate(`/blogs/${slug}`);
  };

  if (loading && blogs.length === 0) {
    return (
      <section id="blogs-section" className="py-12 sm:py-16 md:py-20 bg-slate-50/50 dark:bg-slate-950/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto animate-pulse" />
          <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded mx-auto mt-4 animate-pulse" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  const totalDots = Math.max(1, totalBlogs - visibleCount + 1);

  return (
    <section
      id="blogs-section"
      className="py-12 sm:py-16 md:py-20 bg-slate-50/50 dark:bg-slate-950/40 transition-colors overflow-hidden border-t border-slate-100 dark:border-slate-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#00B2A2] tracking-wide mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Display Knowledge Base</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400">Engineering Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Blogs & Articles
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              In-depth technical guides on AMOLED panel architecture, green line laser welding, and optical OCA lamination.
            </p>
          </div>

          {/* View All Articles & Navigation Controls */}
          <div className="flex flex-col items-end gap-2.5 self-end">
            <button
              onClick={() => navigate('/blogs')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2A2] hover:text-[#009e90] transition-colors cursor-pointer"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Article"
                className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] dark:hover:border-[#00B2A2] dark:hover:text-[#00B2A2] shadow-sm transition-all focus:outline-hidden cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Article"
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
            {blogs.map((blog) => {
              const formattedDate = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={blog.id}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div
                    onClick={() => handleCardClick(blog.slug)}
                    className="group h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:border-[#00B2A2] hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      {/* Featured Image */}
                      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                        <img
                          src={
                            blog.featuredImage ||
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'
                          }
                          alt={blog.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[#00B2A2] border border-[#00B2A2]/30 text-xs font-semibold">
                          <span>{blog.category || 'Display Tech'}</span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 sm:p-6">
                        {/* Publication Date */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
                          <Calendar className="h-3.5 w-3.5 text-[#00B2A2]" />
                          <span>{formattedDate}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>5 min read</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>

                        {/* Short Description */}
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {blog.excerpt ||
                            blog.content.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...'}
                        </p>
                      </div>
                    </div>

                    {/* Footer with Read More Button */}
                    <div className="px-5 sm:px-6 pb-5 pt-0">
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B2A2] group-hover:translate-x-1 transition-transform">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
