import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { usePageSeo, generateBreadcrumbSchema, useJsonLd } from '../lib/seo.ts';
import { DISPLAY_ARTICLES, DisplayArticle } from '../data/displayBlogs.ts';
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  MessageCircle,
  Twitter,
  Linkedin,
  Copy,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface BlogDetailPageProps {
  slug: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug }) => {
  const { settings, navigate } = useApp();
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const [copied, setCopied] = useState(false);

  const baselineArticle = DISPLAY_ARTICLES.find((a) => a.slug === slug) || DISPLAY_ARTICLES[0];
  const [article, setArticle] = useState<DisplayArticle>(baselineArticle);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((b: any) => b.slug === slug);
          if (found) {
            setArticle({
              id: found.id,
              title: found.title,
              slug: found.slug,
              excerpt: found.excerpt || found.title,
              content: found.content,
              category: found.category || 'Display Repair',
              featuredImage: found.featuredImage || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&q=80',
              author: found.author || 'Display Engineering Team',
              publishedDate: found.publishedAt || (found.createdAt ? new Date(found.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Service Guide'),
              readTime: found.readTime || '5 min read',
              tags: found.tags ? (typeof found.tags === 'string' ? JSON.parse(found.tags) : found.tags) : ['Display Repair', 'Flagship'],
            });
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  usePageSeo(
    `${article.title} | ${siteName}`,
    article.excerpt
  );

  const articleSchema = React.useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.featuredImage,
      datePublished: article.publishedDate,
      author: {
        '@type': 'Organization',
        name: article.author || siteName,
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com'}/qaswa-logo.svg`,
        },
      },
    };
  }, [article, siteName]);
  useJsonLd(`blog-${slug}`, articleSchema);

  const breadcrumbs = React.useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
    return generateBreadcrumbSchema([
      { name: 'Home', url: `${origin}/` },
      { name: 'Blogs & Articles', url: `${origin}/blogs` },
      { name: article.title, url: `${origin}/blogs/${slug}` },
    ]);
  }, [article.title, slug]);
  useJsonLd(`breadcrumb-blog-${slug}`, breadcrumbs);

  // Related articles (articles in same category or adjacent)
  const relatedArticles = DISPLAY_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} - ${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`${article.title} via ${siteName}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-white dark:bg-[#0B1110] transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#00B2A2] transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#00B2A2]/15 border border-[#00B2A2]/30 px-3 py-1 text-xs font-bold text-[#00B2A2]">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.publishedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Social Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-y border-slate-200 dark:border-slate-800 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <User className="h-4 w-4 text-[#00B2A2]" />
              <span>By {article.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Share:</span>
              <button
                onClick={shareWhatsApp}
                title="Share on WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                onClick={shareTwitter}
                title="Share on Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={shareLinkedIn}
                title="Share on LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopyLink}
                title="Copy Link"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 h-64 sm:h-96 w-full">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="h-full w-full object-cover filter brightness-95"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-4">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-100 dark:border-slate-800"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ');
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Related Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles Section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Related Display Articles
            </h3>
            <button
              onClick={() => navigate('/blogs')}
              className="text-xs font-bold text-[#00B2A2] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/blogs/${rel.slug}`)}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-[#00B2A2] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-28 rounded-lg overflow-hidden mb-2.5">
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#00B2A2] block mb-1">
                  {rel.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#00B2A2] line-clamp-2">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
