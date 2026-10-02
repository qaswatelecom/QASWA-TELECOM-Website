import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import { DISPLAY_ARTICLES, DisplayArticle } from '../data/displayBlogs.ts';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  Filter,
} from 'lucide-react';

export const BlogsPage: React.FC = () => {
  const { settings, navigate } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  usePageSeo(
    `Blogs & Articles | Flagship Display Repair Insights | ${siteName}`,
    `Explore technical articles, display technology breakdowns, green screen troubleshooting, and touch glass refurbishment guides from ${siteName} display specialists.`
  );

  const [articlesList, setArticlesList] = useState<DisplayArticle[]>(DISPLAY_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiArticles: DisplayArticle[] = data.map((b: any) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt || b.title,
            content: b.content,
            category: b.category || 'Display Repair',
            featuredImage: b.featuredImage || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80',
            author: b.author || 'Display Engineering Team',
            publishedDate: b.publishedAt || (b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Service Guide'),
            readTime: b.readTime || '5 min read',
            tags: b.tags ? (typeof b.tags === 'string' ? JSON.parse(b.tags) : b.tags) : ['Display Repair', 'Flagship'],
          }));
          setArticlesList(apiArticles);
        }
      })
      .catch(() => console.log('Notice: Loaded baseline display articles'));
  }, []);

  const categories = [
    'All',
    'Display Repair',
    'Smartphone Display Issues',
    'Apple Devices',
    'Samsung Devices',
    'Display Technology',
  ];

  // Featured article is the first article in the collection
  const featuredArticle = articlesList[0] || DISPLAY_ARTICLES[0];

  // Filtered articles excluding the featured one when showing "All", or filtered by search/category
  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [articlesList, searchQuery, selectedCategory]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. Attractive Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 px-3.5 py-1 text-xs font-bold text-[#00B2A2]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>DISPLAY KNOWLEDGE & HARDWARE GUIDES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Blogs & Articles
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            In-depth guides on OLED, AMOLED, ProMotion, laser micro-bonding, and touch glass refurbishing for flagship smartphones, Apple Watch, and tablets.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 shadow-xs focus-within:border-[#00B2A2] transition-colors">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles (e.g. green screen, OLED, Apple Watch, lines)..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Featured Article Section (Magazine Highlight) */}
        {!searchQuery && selectedCategory === 'All' && featuredArticle && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-950/20 via-slate-900/50 to-slate-950 p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
              {/* Left Column: Image */}
              <div className="lg:col-span-6 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#00B2A2] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured Display Insight</span>
                </div>
              </div>

              {/* Right Column: Text & CTA */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-bold text-[#00B2A2] uppercase tracking-wider">
                    {featuredArticle.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/blogs/${featuredArticle.slug}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#009E90] transition-all cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-semibold text-slate-400 mr-2 hidden sm:inline">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00B2A2] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Responsive Grid of Blog Cards */}
        {displayedArticles.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Layers className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching display articles found
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/blogs/${article.slug}`)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-[#00B2A2] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <div>
                  {/* Article Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#00B2A2]">
                      {article.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.publishedDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Read More Link */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-[#00B2A2]">
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 5. Pagination / Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#00B2A2] hover:text-[#00B2A2] transition-all shadow-xs cursor-pointer"
            >
              <span>Load More Articles</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
