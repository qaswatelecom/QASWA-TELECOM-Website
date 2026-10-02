import React, { useState, useEffect, useMemo } from 'react';
import { PageSeoConfig } from '../../types/index.ts';
import { getSchemaTemplate, DEFAULT_PAGE_SEO_MAP } from '../../lib/seo.ts';
import {
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  Plus,
  Layers,
  Wrench,
  Smartphone,
  FileText,
  HelpCircle,
  Eye,
  Check,
  Copy,
  Code,
  Share2,
  Laptop,
  CheckSquare,
} from 'lucide-react';

interface SeoManagementTabProps {
  showToast: (msg: string) => void;
  siteName: string;
  refreshConfig: () => Promise<void>;
  navigate: (path: string) => void;
}

export const SeoManagementTab: React.FC<SeoManagementTabProps> = ({
  showToast,
  siteName = 'QASWA TELECOM',
  refreshConfig,
  navigate,
}) => {
  const [pagesList, setPagesList] = useState<PageSeoConfig[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Active form state for the currently selected page
  const [editingConfig, setEditingConfig] = useState<PageSeoConfig>({
    path: '/',
    pageName: 'Home',
    category: 'Core',
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'LocalBusiness',
    schemaJson: '',
  });

  // SERP preview mode: 'desktop' | 'mobile' | 'social'
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'social'>('desktop');

  // Schema validation feedback
  const [schemaValidation, setSchemaValidation] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
  }>({ status: 'idle', message: '' });

  // Add custom route modal
  const [customRouteModalOpen, setCustomRouteModalOpen] = useState(false);
  const [newRoutePath, setNewRoutePath] = useState('');
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteCategory, setNewRouteCategory] = useState('Custom');

  // Import JSON modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Fetch all pages and their SEO metadata from the backend
  const fetchSeoPages = async (preferredPath?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      if (!res.ok) throw new Error('Failed to load SEO pages');
      const data: PageSeoConfig[] = await res.json();
      setPagesList(data);

      const targetPath = preferredPath || selectedPath || '/';
      const match = data.find((p) => p.path === targetPath) || data[0];
      if (match) {
        setSelectedPath(match.path);
        setEditingConfig({ ...match });
        validateSchemaDirectly(match.schemaJson);
      }
    } catch (err: any) {
      console.error('Error fetching SEO data:', err);
      showToast('Failed to load SEO page registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoPages();
  }, []);

  // When switching pages from the list
  const handleSelectPage = (page: PageSeoConfig) => {
    setSelectedPath(page.path);
    setEditingConfig({ ...page });
    validateSchemaDirectly(page.schemaJson);
  };

  // Live Schema validator helper
  const validateSchemaDirectly = (jsonStr?: string) => {
    if (!jsonStr || jsonStr.trim() === '') {
      setSchemaValidation({
        status: 'idle',
        message: 'No custom Schema.org structured data entered.',
      });
      return;
    }
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed['@context']) {
        setSchemaValidation({
          status: 'invalid',
          message: 'Missing standard "@context": "https://schema.org"',
        });
        return;
      }
      if (!parsed['@type']) {
        setSchemaValidation({
          status: 'invalid',
          message: 'Missing "@type" specification (e.g. "LocalBusiness", "Service")',
        });
        return;
      }
      setSchemaValidation({
        status: 'valid',
        message: `Valid Schema.org structured data (${parsed['@type']})`,
      });
    } catch (e: any) {
      setSchemaValidation({
        status: 'invalid',
        message: `JSON Syntax Error: ${e.message}`,
      });
    }
  };

  const handleSchemaJsonChange = (val: string) => {
    setEditingConfig((prev) => ({ ...prev, schemaJson: val }));
    validateSchemaDirectly(val);
  };

  // Auto-scaffold schema template
  const handleInsertSchemaTemplate = () => {
    const template = getSchemaTemplate(editingConfig.schemaType || 'WebPage', {
      path: editingConfig.path,
      title: editingConfig.title || editingConfig.pageName,
      description: editingConfig.description,
      siteName,
    });
    setEditingConfig((prev) => ({ ...prev, schemaJson: template }));
    validateSchemaDirectly(template);
    showToast(`Scaffolded ${editingConfig.schemaType} schema template`);
  };

  // Format / beautify JSON
  const handleFormatJson = () => {
    if (!editingConfig.schemaJson) return;
    try {
      const parsed = JSON.parse(editingConfig.schemaJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setEditingConfig((prev) => ({ ...prev, schemaJson: formatted }));
      setSchemaValidation({ status: 'valid', message: `Formatted valid JSON schema` });
      showToast('Schema JSON formatted successfully');
    } catch (e: any) {
      showToast('Cannot format: invalid JSON syntax.');
    }
  };

  // Save the currently edited page SEO
  const handleSavePageSeo = async () => {
    setSaving(true);
    try {
      // Validate schema if provided
      if (editingConfig.schemaJson && editingConfig.schemaJson.trim() !== '') {
        try {
          JSON.parse(editingConfig.schemaJson);
        } catch (e: any) {
          showToast(`Cannot save: Invalid Schema JSON (${e.message})`);
          setSaving(false);
          return;
        }
      }

      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingConfig),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save SEO configuration');
      }

      showToast(`SEO settings for "${editingConfig.pageName}" saved & live!`);
      await refreshConfig();
      await fetchSeoPages(editingConfig.path);
    } catch (err: any) {
      console.error('Error saving SEO:', err);
      showToast(err.message || 'Error saving SEO configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Reset page to system default
  const handleResetToDefault = async () => {
    if (
      !window.confirm(
        `Reset SEO metadata for "${editingConfig.pageName}" (${editingConfig.path}) back to defaults?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/admin/seo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: editingConfig.path }),
      });

      if (!res.ok) throw new Error('Failed to reset SEO');
      showToast(`Reset "${editingConfig.pageName}" to default SEO configuration.`);
      await refreshConfig();
      await fetchSeoPages(editingConfig.path);
    } catch (err: any) {
      showToast(err.message || 'Failed to reset SEO');
    }
  };

  // Add custom route
  const handleAddCustomRoute = () => {
    let cleanPath = newRoutePath.trim();
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (!cleanPath || cleanPath === '/') {
      showToast('Please enter a valid unique route path (e.g. /offers)');
      return;
    }

    const newPage: PageSeoConfig = {
      path: cleanPath,
      pageName: newRouteName.trim() || cleanPath,
      category: (newRouteCategory as any) || 'Custom',
      title: `${newRouteName.trim() || cleanPath} | ${siteName}`,
      description: `Specialized display repair and assistance for ${newRouteName || cleanPath} at ${siteName}.`,
      keywords: `${newRouteName.toLowerCase()}, display repair, qaswa telecom`,
      ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
      ogType: 'website',
      canonicalUrl: '',
      robots: 'index, follow',
      twitterCard: 'summary_large_image',
      schemaType: 'WebPage',
      schemaJson: getSchemaTemplate('WebPage', { path: cleanPath, title: newRouteName, siteName }),
      isCustom: true,
    };

    setPagesList((prev) => [newPage, ...prev]);
    setSelectedPath(newPage.path);
    setEditingConfig(newPage);
    setCustomRouteModalOpen(false);
    setNewRoutePath('');
    setNewRouteName('');
    showToast(`Added custom route ${cleanPath}. Don't forget to save!`);
  };

  // Export all SEO configs as JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pagesList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `qaswa_telecom_seo_metadata_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported complete SEO metadata JSON file');
  };

  // Import JSON handler
  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch('/api/admin/seo/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: parsed }),
      });
      if (!res.ok) throw new Error('Failed to import SEO configs');
      showToast('Imported SEO configurations successfully!');
      setImportModalOpen(false);
      setImportJsonText('');
      await refreshConfig();
      await fetchSeoPages();
    } catch (err: any) {
      showToast(`Import error: ${err.message}`);
    }
  };

  // Filter pages list
  const filteredPages = useMemo(() => {
    return pagesList.filter((p) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.pageName.toLowerCase().includes(query) ||
        p.path.toLowerCase().includes(query) ||
        (p.title && p.title.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [pagesList, categoryFilter, searchQuery]);

  // SEO Health Audits for active page
  const titleLength = (editingConfig.title || '').length;
  const isTitleOptimal = titleLength >= 30 && titleLength <= 60;
  const descLength = (editingConfig.description || '').length;
  const isDescOptimal = descLength >= 120 && descLength <= 160;
  const hasKeywords = (editingConfig.keywords || '').split(',').filter(Boolean).length >= 2;
  const isSchemaValid = schemaValidation.status === 'valid';

  // Overall Score Calculation
  const seoHealthScore = useMemo(() => {
    let score = 0;
    if (isTitleOptimal) score += 25;
    else if (titleLength > 10 && titleLength <= 75) score += 15;

    if (isDescOptimal) score += 30;
    else if (descLength > 50 && descLength <= 200) score += 20;

    if (hasKeywords) score += 15;
    if (editingConfig.ogImage) score += 15;
    if (isSchemaValid) score += 15;
    return score;
  }, [isTitleOptimal, titleLength, isDescOptimal, descLength, hasKeywords, editingConfig.ogImage, isSchemaValid]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00B2A2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00B2A2]">
                <Sparkles className="h-3.5 w-3.5" />
                Live SEO & Rich Snippets Manager
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {pagesList.length} Pages Configured
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              SEO & Structured Data (JSON-LD) Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Control the Google search titles, meta descriptions, focus keywords, OpenGraph share
              cards, and Schema.org structured data for every page across QASWA TELECOM without
              touching code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCustomRouteModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            >
              <Plus className="h-4 w-4 text-[#00B2A2]" />
              <span>Add Custom Route</span>
            </button>

            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Download backup JSON of all SEO data"
            >
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </button>

            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Import SEO configuration"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Quick Health Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-400 block">Total Pages Tracked</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {pagesList.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-400 block">Schema.org Structured Data</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              100% Active
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-400 block">Current Page SEO Score</span>
            <span className={`text-lg font-extrabold ${seoHealthScore >= 80 ? 'text-emerald-600' : seoHealthScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
              {seoHealthScore}% / 100
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-400 block">Selected Route</span>
            <span className="text-xs font-mono font-bold text-[#00B2A2] truncate block" title={selectedPath}>
              {selectedPath}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Dual Panel: Left Selector / Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Page Selection & Filters (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-[780px]">
          {/* Search & Category Pills */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search page or route URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'core', label: 'Core' },
                { id: 'services', label: 'Services' },
                { id: 'brands', label: 'Brands' },
                { id: 'content', label: 'Content' },
                { id: 'legal', label: 'Legal' },
                { id: 'custom', label: 'Custom' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    categoryFilter === c.id
                      ? 'bg-[#00B2A2] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Page Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading pages...</div>
            ) : filteredPages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No matching pages found</div>
            ) : (
              filteredPages.map((page) => {
                const isSelected = page.path === selectedPath;
                return (
                  <button
                    key={page.path}
                    onClick={() => handleSelectPage(page)}
                    className={`w-full text-left rounded-xl p-3 transition flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#00B2A2]/10 border border-[#00B2A2] text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold truncate">{page.pageName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        {page.category || 'Page'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#00B2A2] truncate">
                      {page.path}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {page.title || 'No title set'}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {page.schemaType && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Code className="h-3 w-3 text-emerald-500" />
                          {page.schemaType}
                        </span>
                      )}
                      {page.updatedAt && (
                        <span className="text-[10px] text-slate-400 ml-auto">
                          Updated {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: SEO Editor for Selected Page (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Page Header & Save Bar */}
          <div className="sticky top-4 z-20 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-4 dark:border-slate-800 dark:bg-slate-900/95 shadow-md flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingConfig.pageName}
                </h3>
                <span className="text-xs font-mono font-bold text-[#00B2A2] bg-[#00B2A2]/10 px-2 py-0.5 rounded-lg">
                  {editingConfig.path}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Editing SEO tags & structured data. All modifications update the live website immediately upon saving.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(editingConfig.path)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                title="View page in live preview"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Page</span>
              </button>

              <button
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Reset to default baseline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleSavePageSeo}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#009e90] active:scale-95 disabled:opacity-50 transition"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Live SEO'}</span>
              </button>
            </div>
          </div>

          {/* Section A: Search Engine Snippet & Meta Tags */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#00B2A2]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  1. Search Engine Title & Meta Description
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Google Search Snippet
              </span>
            </div>

            {/* Page Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Page Title (`&lt;title&gt;` & Google Headline)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    isTitleOptimal
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : titleLength > 60
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}
                >
                  {titleLength} / 60 chars {isTitleOptimal && '• Optimal'}
                </span>
              </div>
              <input
                type="text"
                value={editingConfig.title || ''}
                onChange={(e) =>
                  setEditingConfig((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. QASWA TELECOM | Flagship Display Repair Specialists"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-medium focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Recommendation: 30 to 60 characters for optimal rendering in Google desktop and mobile SERPs without truncation.
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Meta Description (`&lt;meta name="description"&gt;`)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    isDescOptimal
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : descLength > 160
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}
                >
                  {descLength} / 160 chars {isDescOptimal && '• Optimal'}
                </span>
              </div>
              <textarea
                rows={3}
                value={editingConfig.description || ''}
                onChange={(e) =>
                  setEditingConfig((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief, compelling 1-2 sentence overview of this page..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Recommendation: 120 to 160 characters. Provide clear value proposition and call to action.
              </p>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                Focus Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={editingConfig.keywords || ''}
                onChange={(e) =>
                  setEditingConfig((prev) => ({ ...prev, keywords: e.target.value }))
                }
                placeholder="e.g. display repair, screen replacement, green line fix, Mumbai"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {editingConfig.keywords && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingConfig.keywords
                    .split(',')
                    .map((k) => k.trim())
                    .filter(Boolean)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        #{kw}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Canonical URL & Robots Directives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Canonical URL (`rel="canonical"`)
                </label>
                <input
                  type="text"
                  value={editingConfig.canonicalUrl || ''}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, canonicalUrl: e.target.value }))
                  }
                  placeholder={`https://qaswatelecom.com${editingConfig.path}`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave blank to auto-resolve to current origin + path.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Robots Indexing Directive
                </label>
                <select
                  value={editingConfig.robots || 'index, follow'}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, robots: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="index, follow">index, follow (Standard - Index in Google)</option>
                  <option value="noindex, follow">noindex, follow (Hide from Google, follow links)</option>
                  <option value="index, nofollow">index, nofollow (Index page, do not follow links)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Complete exclusion)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Tells Googlebot whether to index and crawl this page.
                </p>
              </div>
            </div>
          </div>

          {/* Section B: OpenGraph & Social Media Share Cards */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[#00B2A2]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  2. Social Share Cards (OpenGraph & Twitter / WhatsApp)
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Visual Link Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">OpenGraph Type (`og:type`)</label>
                <select
                  value={editingConfig.ogType || 'website'}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, ogType: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="website">website (Standard Page)</option>
                  <option value="article">article (Blog / Tech Guide)</option>
                  <option value="business.business">business.business (Local Service Center)</option>
                  <option value="product">product (Service Catalog)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Twitter Card Format</label>
                <select
                  value={editingConfig.twitterCard || 'summary_large_image'}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, twitterCard: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                  <option value="summary">summary (Compact Square Thumbnail)</option>
                </select>
              </div>
            </div>

            {/* Social Share Image URL */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Share Banner Image URL (`og:image` & `twitter:image`)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  value={editingConfig.ogImage || ''}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, ogImage: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {editingConfig.ogImage && (
                  <img
                    src={editingConfig.ogImage}
                    alt="OG Preview"
                    className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />
                )}
              </div>

              {/* Quick Image Presets */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-400">Quick presets:</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingConfig((prev) => ({
                      ...prev,
                      ogImage:
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
                    }))
                  }
                  className="text-[10px] text-[#00B2A2] hover:underline"
                >
                  Cleanroom Lab
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingConfig((prev) => ({
                      ...prev,
                      ogImage:
                        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',
                    }))
                  }
                  className="text-[10px] text-[#00B2A2] hover:underline"
                >
                  Repair Bench
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingConfig((prev) => ({
                      ...prev,
                      ogImage:
                        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
                    }))
                  }
                  className="text-[10px] text-[#00B2A2] hover:underline"
                >
                  Smartphones
                </button>
              </div>
            </div>
          </div>

          {/* Section C: Schema.org Structured Data (JSON-LD) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-[#00B2A2]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Schema.org Structured Data (JSON-LD)
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleInsertSchemaTemplate}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Sparkles className="h-3 w-3 text-[#00B2A2]" />
                  <span>Insert Template</span>
                </button>
                <button
                  type="button"
                  onClick={handleFormatJson}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span>Format JSON</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-64">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Schema Type Preset
                </label>
                <select
                  value={editingConfig.schemaType || 'WebPage'}
                  onChange={(e) =>
                    setEditingConfig((prev) => ({ ...prev, schemaType: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="LocalBusiness">LocalBusiness (Store / Repair Center)</option>
                  <option value="Service">Service (Repair Offerings)</option>
                  <option value="FAQPage">FAQPage (Question & Answer)</option>
                  <option value="WebPage">WebPage (General Web Page)</option>
                  <option value="Organization">Organization (Company Profile)</option>
                  <option value="BreadcrumbList">BreadcrumbList (Navigation)</option>
                  <option value="Article">Article (Blog Post)</option>
                  <option value="Custom">Custom Schema JSON</option>
                </select>
              </div>

              {/* Validation Status Pill */}
              <div className="sm:ml-auto">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Syntax Validation
                </label>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
                    schemaValidation.status === 'valid'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : schemaValidation.status === 'invalid'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {schemaValidation.status === 'valid' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : schemaValidation.status === 'invalid' ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Code className="h-3.5 w-3.5" />
                  )}
                  <span>{schemaValidation.message}</span>
                </div>
              </div>
            </div>

            {/* JSON Editor Textarea */}
            <div>
              <textarea
                rows={10}
                value={editingConfig.schemaJson || ''}
                onChange={(e) => handleSchemaJsonChange(e.target.value)}
                placeholder='{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "..."\n}'
                className="w-full rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono text-xs p-3 focus:border-[#00B2A2] focus:outline-none dark:border-slate-800 leading-relaxed shadow-inner"
                spellCheck={false}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Injected automatically into document `&lt;head&gt;` as `&lt;script type="application/ld+json"&gt;` when users visit this page.
              </p>
            </div>
          </div>

          {/* Section D: Live SERP & Social Preview Simulator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#00B2A2]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  4. Live Search Engine & Social Media Simulator
                </h4>
              </div>

              {/* Simulator Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                    previewMode === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Google Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                    previewMode === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Google Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('social')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                    previewMode === 'social'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  WhatsApp / Social
                </button>
              </div>
            </div>

            {/* Google Desktop Preview */}
            {previewMode === 'desktop' && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 max-w-2xl font-sans">
                <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 truncate">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {siteName}
                  </span>
                  <span>https://qaswatelecom.com{editingConfig.path}</span>
                </div>
                <div className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug line-clamp-1 mb-1">
                  {editingConfig.title || 'Page Title | QASWA TELECOM'}
                </div>
                <div className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                  {editingConfig.description ||
                    'Display repair specialists for flagship devices: Apple iPhone, Samsung Galaxy, and more.'}
                </div>
              </div>
            )}

            {/* Google Mobile Preview */}
            {previewMode === 'mobile' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 max-w-sm font-sans shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#00B2A2] flex items-center justify-center text-white text-[10px] font-bold">
                    Q
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-none">
                      {siteName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      qaswatelecom.com{editingConfig.path}
                    </div>
                  </div>
                </div>
                <div className="text-[16px] text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-snug line-clamp-2 mb-1">
                  {editingConfig.title || 'Page Title | QASWA TELECOM'}
                </div>
                <div className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-3">
                  {editingConfig.description ||
                    'Display repair specialists for flagship devices: Apple iPhone, Samsung Galaxy, and more.'}
                </div>
              </div>
            )}

            {/* WhatsApp / Social Card Preview */}
            {previewMode === 'social' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden max-w-md dark:border-slate-800 dark:bg-slate-950 shadow-sm">
                {editingConfig.ogImage ? (
                  <img
                    src={editingConfig.ogImage}
                    alt="Social Banner"
                    className="w-full h-48 object-cover border-b border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-[#00B2A2] to-[#046a60] flex items-center justify-center text-white font-bold text-sm">
                    {siteName} Display Repair
                  </div>
                )}
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    qaswatelecom.com
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {editingConfig.title || 'QASWA TELECOM Display Repair'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {editingConfig.description ||
                      'Flagship display repairs, green line laser bonding, and touch screen refurbishing.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Route */}
      {customRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Route for SEO Management
            </h3>
            <p className="text-xs text-slate-500">
              Configure SEO and structured data for any internal route, custom page, or landing URL.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1">Route Path (Starting with /) *</label>
              <input
                type="text"
                placeholder="e.g. /screen-warranty or /offers"
                value={newRoutePath}
                onChange={(e) => setNewRoutePath(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Page Name / Label *</label>
              <input
                type="text"
                placeholder="e.g. Screen Warranty Policy"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                value={newRouteCategory}
                onChange={(e) => setNewRouteCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Custom">Custom Page</option>
                <option value="Core">Core Page</option>
                <option value="Services">Services</option>
                <option value="Brands">Brands</option>
                <option value="Content">Content / Blog</option>
                <option value="Legal">Legal & Policy</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomRouteModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomRoute}
                className="rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
              >
                Add Route & Configure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import JSON */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Import SEO Configuration (JSON)
            </h3>
            <p className="text-xs text-slate-500">
              Paste a previously exported SEO metadata JSON array or dictionary to restore settings in bulk.
            </p>

            <div>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[\n  {\n    "path": "/",\n    "title": "..."\n  }\n]'
                className="w-full rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono text-xs p-3 focus:border-[#00B2A2] focus:outline-none dark:border-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                disabled={!importJsonText.trim()}
                className="rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90] disabled:opacity-50"
              >
                Import & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
