import React, { useEffect, useState } from 'react';
import { CustomPage as CustomPageType } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { ChevronLeft } from 'lucide-react';

interface CustomPageProps {
  slug: string;
}

export const CustomPage: React.FC<CustomPageProps> = ({ slug }) => {
  const { navigate } = useApp();
  const [page, setPage] = useState<CustomPageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/custom-pages/${slug}`);
        if (!res.ok) throw new Error('Page not found');
        setPage(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Page not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-xs font-semibold text-[#00B2A2] hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 mb-6 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Home</span>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            {page.title}
          </h1>

          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};
