import React, { useState, useEffect } from 'react';
import {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  DEFAULT_HOME_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_CONTACT_CONTENT,
} from '../../lib/pageContent.ts';
import { MediaPickerModal } from './MediaPickerModal.tsx';
import {
  Save,
  RotateCcw,
  Eye,
  Sparkles,
  Home,
  Info,
  Phone,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  Clock,
  MapPin,
  Mail,
  MessageCircle,
} from 'lucide-react';

interface ContentManagementTabProps {
  showToast: (msg: string) => void;
  siteName: string;
  refreshConfig: () => Promise<void>;
  navigate: (path: string) => void;
  onNavigateToMedia?: () => void;
}

export const ContentManagementTab: React.FC<ContentManagementTabProps> = ({
  showToast,
  siteName,
  refreshConfig,
  navigate,
  onNavigateToMedia,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'about' | 'contact'>('home');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ field: string; index?: number } | null>(null);
  const [mediaPickerCategory, setMediaPickerCategory] = useState<string>('general');

  const openMediaPicker = (field: string, index?: number, category: string = 'general') => {
    setMediaPickerTarget({ field, index });
    setMediaPickerCategory(category);
    setMediaPickerOpen(true);
  };

  const handleSelectMediaImage = (imageUrl: string) => {
    if (!mediaPickerTarget) return;
    const { field, index } = mediaPickerTarget;

    if (field === 'heroSlide' && index !== undefined) {
      setHomeContent((prev) => {
        const updated = [...prev.hero.slides];
        updated[index] = { ...updated[index], image: imageUrl };
        return { ...prev, hero: { ...prev.hero, slides: updated } };
      });
    } else if (field === 'cleanroomBanner') {
      setHomeContent((prev) => ({
        ...prev,
        aboutSection: { ...prev.aboutSection, imageUrl },
      }));
    } else if (field === 'storyImage') {
      setAboutContent((prev) => ({
        ...prev,
        story: { ...prev.story, imageUrl },
      }));
    } else if (field === 'aboutGallery' && index !== undefined) {
      setAboutContent((prev) => {
        const updated = [...prev.gallery.images];
        updated[index] = { ...updated[index], url: imageUrl };
        return { ...prev, gallery: { ...prev.gallery, images: updated } };
      });
    } else if (field === 'contactStore') {
      setContactContent((prev) => ({
        ...prev,
        storeShowcase: { ...prev.storeShowcase, imageUrl },
      }));
    }
    showToast('Image updated from Media Manager!');
  };

  // Form states
  const [homeContent, setHomeContent] = useState<HomePageContent>(DEFAULT_HOME_CONTENT);
  const [aboutContent, setAboutContent] = useState<AboutPageContent>(DEFAULT_ABOUT_CONTENT);
  const [contactContent, setContactContent] = useState<ContactPageContent>(DEFAULT_CONTACT_CONTENT);

  // Load all page content from database
  const loadPageContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/page-content');
      if (res.ok) {
        const data = await res.json();
        if (data.home) setHomeContent(data.home);
        if (data.about) setAboutContent(data.about);
        if (data.contact) setContactContent(data.contact);
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
      showToast('Error loading page content from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageContent();
  }, []);

  // Save active page content to database
  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const payload = {
        page: activeSubTab,
        content:
          activeSubTab === 'home'
            ? homeContent
            : activeSubTab === 'about'
            ? aboutContent
            : contactContent,
      };

      const res = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save page content');
      }

      showToast(`Content for ${activeSubTab.toUpperCase()} updated & live on the website!`);
      await refreshConfig();
    } catch (err: any) {
      console.error('Error saving content:', err);
      showToast(err.message || 'Error saving page content.');
    } finally {
      setSaving(false);
    }
  };

  // Reset active page content to default
  const handleResetContent = async () => {
    const pageName = activeSubTab === 'home' ? 'HomePage' : activeSubTab === 'about' ? 'About Us' : 'Contact Us';
    if (!window.confirm(`Reset all content for ${pageName} back to system defaults?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/page-content/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: activeSubTab }),
      });

      if (!res.ok) throw new Error('Failed to reset content');
      const data = await res.json();

      if (activeSubTab === 'home') setHomeContent(data.defaultContent || DEFAULT_HOME_CONTENT);
      else if (activeSubTab === 'about') setAboutContent(data.defaultContent || DEFAULT_ABOUT_CONTENT);
      else setContactContent(data.defaultContent || DEFAULT_CONTACT_CONTENT);

      showToast(`Reset ${pageName} content to system defaults.`);
      await refreshConfig();
    } catch (err: any) {
      showToast(err.message || 'Failed to reset content');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00B2A2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00B2A2]">
                <Sparkles className="h-3.5 w-3.5" />
                Live Page Content CMS
              </span>
              <span className="text-xs font-semibold text-slate-400">
                HomePage · About Us · Contact Us
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Page Content Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Edit all headings, descriptive body text, cleanroom photos, and service pillars directly from this dashboard. Changes save to the database and automatically replace hardcoded content across the live site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const target = activeSubTab === 'home' ? '/' : activeSubTab === 'about' ? '/about' : '/contact';
                navigate(target);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Live Page</span>
            </button>

            <button
              onClick={handleResetContent}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
              title="Reset current page to default content"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#009e90] active:scale-95 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Live Content'}</span>
            </button>
          </div>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'home'
                ? 'bg-[#00B2A2] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>HomePage Content</span>
          </button>

          <button
            onClick={() => setActiveSubTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'about'
                ? 'bg-[#00B2A2] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Info className="h-4 w-4" />
            <span>About Us Page Content</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'contact'
                ? 'bg-[#00B2A2] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Contact Us Page Content</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TAB A: HOMEPAGE CONTENT                                     */}
      {/* ============================================================== */}
      {activeSubTab === 'home' && (
        <div className="space-y-6">
          {/* Section 1: Hero Slideshow & Headlines */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00B2A2]" />
                <span>1. Hero Section & Slideshow Banners</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Primary Viewport Experience
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Hero Badge Pill</label>
                <input
                  type="text"
                  value={homeContent.hero?.badge || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Search Bar Placeholder</label>
                <input
                  type="text"
                  value={homeContent.hero?.searchPlaceholder || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, searchPlaceholder: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Slides Editor */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Slideshow Banner Slides ({homeContent.hero?.slides?.length || 0})
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeContent.hero?.slides?.map((slide, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00B2A2]">Slide {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...homeContent.hero.slides];
                          updated.splice(idx, 1);
                          setHomeContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, slides: updated },
                          }));
                        }}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Slide Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...homeContent.hero.slides];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setHomeContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, slides: updated },
                          }));
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Slide Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...homeContent.hero.slides];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setHomeContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, slides: updated },
                          }));
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-500">Slide Image URL</label>
                        <button
                          type="button"
                          onClick={() => openMediaPicker('heroSlide', idx, 'banners')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00B2A2] hover:underline"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Choose from Media Manager</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const updated = [...homeContent.hero.slides];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setHomeContent((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, slides: updated },
                            }));
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt="Slide preview"
                            className="h-9 w-14 object-cover rounded border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSlide = {
                    title: 'Precision Display Refurbishing',
                    subtitle: 'Cleanroom Technology Restores Original Factory Performance',
                    badge: 'Optical Cleanroom Lab',
                    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
                  };
                  setHomeContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, slides: [...(prev.hero?.slides || []), newSlide] },
                  }));
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#00B2A2] hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Hero Slide</span>
              </button>
            </div>
          </div>

          {/* Section 2: Why Choose Us / Trust Cards */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
                <span>2. Why Choose Us (Trust Cards)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={homeContent.trustCards?.title || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      trustCards: { ...prev.trustCards, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={homeContent.trustCards?.subtitle || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      trustCards: { ...prev.trustCards, subtitle: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {homeContent.trustCards?.cards?.map((card, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                >
                  <label className="block text-[11px] font-bold text-[#00B2A2]">Trust Card {idx + 1}</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...homeContent.trustCards.cards];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setHomeContent((prev) => ({
                        ...prev,
                        trustCards: { ...prev.trustCards, cards: updated },
                      }));
                    }}
                    placeholder="Card Title"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <textarea
                    rows={2}
                    value={card.desc}
                    onChange={(e) => {
                      const updated = [...homeContent.trustCards.cards];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setHomeContent((prev) => ({
                        ...prev,
                        trustCards: { ...prev.trustCards, cards: updated },
                      }));
                    }}
                    placeholder="Card Description"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Cleanroom Engineering & About Us Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="h-4 w-4 text-[#00B2A2]" />
                <span>3. Cleanroom Engineering & About Section (HomePage Preview)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Badge</label>
                <input
                  type="text"
                  value={homeContent.aboutSection?.badge || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Headline Title</label>
                <input
                  type="text"
                  value={homeContent.aboutSection?.title || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Paragraph 1 Text</label>
              <textarea
                rows={2}
                value={homeContent.aboutSection?.description || ''}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    aboutSection: { ...prev.aboutSection, description: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Paragraph 2 Text</label>
              <textarea
                rows={2}
                value={homeContent.aboutSection?.secondaryText || ''}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    aboutSection: { ...prev.aboutSection, secondaryText: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Cleanroom Image */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold">Laboratory Showcase Image URL</label>
                <button
                  type="button"
                  onClick={() => openMediaPicker('cleanroomBanner', undefined, 'cleanroom')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00B2A2] hover:underline"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Choose from Media Manager</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={homeContent.aboutSection?.imageUrl || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, imageUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {homeContent.aboutSection?.imageUrl && (
                  <img
                    src={homeContent.aboutSection.imageUrl}
                    alt="Lab preview"
                    className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <label className="block text-[11px] font-bold text-[#00B2A2]">Pillar 1</label>
                <input
                  type="text"
                  value={homeContent.aboutSection?.pillar1Title || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, pillar1Title: e.target.value },
                    }))
                  }
                  placeholder="Pillar 1 Title"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={homeContent.aboutSection?.pillar1Desc || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, pillar1Desc: e.target.value },
                    }))
                  }
                  placeholder="Pillar 1 Description"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <label className="block text-[11px] font-bold text-[#00B2A2]">Pillar 2</label>
                <input
                  type="text"
                  value={homeContent.aboutSection?.pillar2Title || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, pillar2Title: e.target.value },
                    }))
                  }
                  placeholder="Pillar 2 Title"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={homeContent.aboutSection?.pillar2Desc || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      aboutSection: { ...prev.aboutSection, pillar2Desc: e.target.value },
                    }))
                  }
                  placeholder="Pillar 2 Description"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Call to Action Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Bottom Call-To-Action (CTA) Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Banner Headline</label>
                <input
                  type="text"
                  value={homeContent.ctaBanner?.title || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      ctaBanner: { ...prev.ctaBanner, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Button Text</label>
                <input
                  type="text"
                  value={homeContent.ctaBanner?.buttonText || ''}
                  onChange={(e) =>
                    setHomeContent((prev) => ({
                      ...prev,
                      ctaBanner: { ...prev.ctaBanner, buttonText: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Banner Subtitle / Description</label>
              <input
                type="text"
                value={homeContent.ctaBanner?.subtitle || ''}
                onChange={(e) =>
                  setHomeContent((prev) => ({
                    ...prev,
                    ctaBanner: { ...prev.ctaBanner, subtitle: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. TAB B: ABOUT US PAGE CONTENT                                */}
      {/* ============================================================== */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          {/* Section 1: Hero */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. About Page Hero Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Hero Badge</label>
                <input
                  type="text"
                  value={aboutContent.hero?.badge || ''}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Main Heading</label>
                <input
                  type="text"
                  value={aboutContent.hero?.title || ''}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={aboutContent.hero?.subtitle || ''}
                onChange={(e) =>
                  setAboutContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Our Story */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Our Story Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Story Badge</label>
                <input
                  type="text"
                  value={aboutContent.story?.badge || ''}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,
                      story: { ...prev.story, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Story Heading</label>
                <input
                  type="text"
                  value={aboutContent.story?.title || ''}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,
                      story: { ...prev.story, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Story Paragraph 1</label>
              <textarea
                rows={2}
                value={aboutContent.story?.paragraph1 || ''}
                onChange={(e) =>
                  setAboutContent((prev) => ({
                    ...prev,
                    story: { ...prev.story, paragraph1: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Story Paragraph 2</label>
              <textarea
                rows={2}
                value={aboutContent.story?.paragraph2 || ''}
                onChange={(e) =>
                  setAboutContent((prev) => ({
                    ...prev,
                    story: { ...prev.story, paragraph2: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Story Paragraph 3</label>
              <textarea
                rows={2}
                value={aboutContent.story?.paragraph3 || ''}
                onChange={(e) =>
                  setAboutContent((prev) => ({
                    ...prev,
                    story: { ...prev.story, paragraph3: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold">Our Story Image URL</label>
                <button
                  type="button"
                  onClick={() => openMediaPicker('storyImage', undefined, 'general')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00B2A2] hover:underline"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Choose from Media Manager</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={aboutContent.story?.imageUrl || ''}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,
                      story: { ...prev.story, imageUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {aboutContent.story?.imageUrl && (
                  <img
                    src={aboutContent.story.imageUrl}
                    alt="Story preview"
                    className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Cleanroom Facility Gallery */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Cleanroom Laboratory Gallery Images
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutContent.gallery?.images?.map((img, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-[#00B2A2]">Gallery Image {idx + 1}</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker('aboutGallery', idx, 'cleanroom')}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00B2A2] hover:underline"
                    >
                      <ImageIcon className="h-3 w-3" />
                      <span>Media Manager</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={img.title}
                    onChange={(e) => {
                      const updated = [...aboutContent.gallery.images];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setAboutContent((prev) => ({
                        ...prev,
                        gallery: { ...prev.gallery, images: updated },
                      }));
                    }}
                    placeholder="Image Title"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-bold focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => {
                      const updated = [...aboutContent.gallery.images];
                      updated[idx] = { ...updated[idx], caption: e.target.value };
                      setAboutContent((prev) => ({
                        ...prev,
                        gallery: { ...prev.gallery, images: updated },
                      }));
                    }}
                    placeholder="Caption"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const updated = [...aboutContent.gallery.images];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setAboutContent((prev) => ({
                          ...prev,
                          gallery: { ...prev.gallery, images: updated },
                        }));
                      }}
                      placeholder="Image URL"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                    {img.url && (
                      <img
                        src={img.url}
                        alt="Preview"
                        className="h-8 w-12 object-cover rounded border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. TAB C: CONTACT US PAGE CONTENT                              */}
      {/* ============================================================== */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          {/* Section 1: Hero */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Contact Page Hero & Subtitle
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Hero Badge</label>
                <input
                  type="text"
                  value={contactContent.hero?.badge || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Headline Title</label>
                <input
                  type="text"
                  value={contactContent.hero?.title || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={contactContent.hero?.subtitle || ''}
                onChange={(e) =>
                  setContactContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Contact Details & Store Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Core Contact Information & Dispatch
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Helpline Phone</label>
                <input
                  type="text"
                  value={contactContent.info?.phone || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      info: { ...prev.info, phone: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={contactContent.info?.whatsapp || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      info: { ...prev.info, whatsapp: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Support Email</label>
                <input
                  type="email"
                  value={contactContent.info?.email || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      info: { ...prev.info, email: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={contactContent.info?.operatingHours || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      info: { ...prev.info, operatingHours: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Central Store Address</label>
              <input
                type="text"
                value={contactContent.info?.address || ''}
                onChange={(e) =>
                  setContactContent((prev) => ({
                    ...prev,
                    info: { ...prev.info, address: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Google Maps Embed URL</label>
              <input
                type="text"
                value={contactContent.info?.googleMapsUrl || ''}
                onChange={(e) =>
                  setContactContent((prev) => ({
                    ...prev,
                    info: { ...prev.info, googleMapsUrl: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 3: Specialization Notice Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Service Specialization Notice Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Notice Badge</label>
                <input
                  type="text"
                  value={contactContent.noticeCard?.badge || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      noticeCard: { ...prev.noticeCard, badge: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Notice Headline</label>
                <input
                  type="text"
                  value={contactContent.noticeCard?.title || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      noticeCard: { ...prev.noticeCard, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Notice Explanation</label>
              <textarea
                rows={2}
                value={contactContent.noticeCard?.description || ''}
                onChange={(e) =>
                  setContactContent((prev) => ({
                    ...prev,
                    noticeCard: { ...prev.noticeCard, description: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section 4: Store / Lab Showcase Photo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Store & Laboratory Showcase Photo
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold">Lab / Store Photo URL</label>
                <button
                  type="button"
                  onClick={() => openMediaPicker('contactStore', undefined, 'store')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00B2A2] hover:underline"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Choose from Media Manager</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={contactContent.storeShowcase?.imageUrl || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      storeShowcase: { ...prev.storeShowcase, imageUrl: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono text-[11px] focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {contactContent.storeShowcase?.imageUrl && (
                  <img
                    src={contactContent.storeShowcase.imageUrl}
                    alt="Store preview"
                    className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Showcase Title</label>
                <input
                  type="text"
                  value={contactContent.storeShowcase?.title || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      storeShowcase: { ...prev.storeShowcase, title: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Caption / Subtitle</label>
                <input
                  type="text"
                  value={contactContent.storeShowcase?.caption || ''}
                  onChange={(e) =>
                    setContactContent((prev) => ({
                      ...prev,
                      storeShowcase: { ...prev.storeShowcase, caption: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelectImage={handleSelectMediaImage}
        suggestedCategory={mediaPickerCategory}
        showToast={showToast}
      />
    </div>
  );
};
