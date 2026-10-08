import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Eye,
  X,
  Plus,
  RefreshCw,
  FolderOpen,
  Sparkles,
  Link as LinkIcon,
  Check,
  AlertTriangle,
  Info,
  Maximize2,
  Image as ImageIcon,
  Sliders,
  Calendar,
  Tag,
  Loader2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MediaItem } from '../../types/index.ts';
import {
  uploadImageToFirebaseStorage,
  deleteImageFromFirebaseStorage,
  validateImageFile,
} from '../../lib/firebaseStorage.ts';

interface MediaManagerTabProps {
  showToast: (msg: string) => void;
  navigate?: (path: string) => void;
  onNavigateToContentManagement?: () => void;
}

export const MediaManagerTab: React.FC<MediaManagerTabProps> = ({
  showToast,
  navigate,
  onNavigateToContentManagement,
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadCurrentIndex, setUploadCurrentIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview / Lightbox modal state
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Link to CMS modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [itemToLink, setItemToLink] = useState<MediaItem | null>(null);
  const [targetCmsLocation, setTargetCmsLocation] = useState<string>('home-hero');
  const [linkSlideTitle, setLinkSlideTitle] = useState('');
  const [linkSlideSubtitle, setLinkSlideSubtitle] = useState('');
  const [linkSectionId, setLinkSectionId] = useState<string>('');
  const [linking, setLinking] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all media from API
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      } else {
        throw new Error('Failed to load media items');
      }
    } catch (err: any) {
      console.error('Failed to load media:', err);
      showToast('Error loading media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Category definitions
  const categories = [
    { id: 'all', label: 'All Media', count: mediaList.length },
    {
      id: 'banners',
      label: 'Banners & Hero',
      count: mediaList.filter((m) => m.category === 'banners').length,
    },
    {
      id: 'cleanroom',
      label: 'Cleanroom Lab',
      count: mediaList.filter((m) => m.category === 'cleanroom').length,
    },
    {
      id: 'gallery',
      label: 'Repair Gallery',
      count: mediaList.filter((m) => m.category === 'gallery').length,
    },
    {
      id: 'store',
      label: 'Store Showcase',
      count: mediaList.filter((m) => m.category === 'store').length,
    },
    {
      id: 'brands',
      label: 'Brands & Logos',
      count: mediaList.filter((m) => m.category === 'brands').length,
    },
    {
      id: 'services',
      label: 'Services',
      count: mediaList.filter((m) => m.category === 'services').length,
    },
    {
      id: 'general',
      label: 'General',
      count: mediaList.filter((m) => !m.category || m.category === 'general').length,
    },
  ];

  // Filtering & Sorting
  const filteredMedia = mediaList
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'all' ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  // Handle files selection
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const val = validateImageFile(file);
      if (!val.valid) {
        showToast(val.error || `Invalid file ${file.name}`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setUploadModalOpen(true);
    }
  };

  // Upload handler to Firebase Storage & Database
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadCurrentIndex(i + 1);
      setUploadProgress(10);

      try {
        // 1. Upload to Firebase Storage
        const uploadResult = await uploadImageToFirebaseStorage(file, {
          category: uploadCategory,
          onProgress: (p) => setUploadProgress(p),
        });

        // 2. Persist metadata into database
        const token = typeof window !== 'undefined' ? localStorage.getItem('qaswa_admin_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const dbRes = await fetch('/api/admin/media', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: uploadResult.url,
            altText: uploadAltText || file.name,
            category: uploadCategory,
          }),
        });

        if (dbRes.ok) {
          successCount++;
        }
      } catch (err: any) {
        console.error(`Failed to upload ${file.name}:`, err);
        showToast(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadModalOpen(false);
    fetchMedia();
    showToast(
      `Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''} to Firebase Storage!`
    );
  };

  // Copy URL with toast
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Firebase image URL copied to clipboard!');
  };

  // Copy Markdown
  const handleCopyMarkdown = (item: MediaItem) => {
    const md = `![${item.altText || item.name}](${item.url})`;
    navigator.clipboard.writeText(md);
    showToast('Markdown snippet copied to clipboard!');
  };

  // Open Link to CMS modal
  const handleOpenLinkModal = (item: MediaItem) => {
    setItemToLink(item);
    setLinkSlideTitle(item.name || 'Component-Level Repair');
    setLinkSlideSubtitle('State-of-the-Art Cleanroom Facility');
    setLinkModalOpen(true);
  };

  // Execute Link to CMS
  const handleExecuteLink = async () => {
    if (!itemToLink) return;
    setLinking(true);

    try {
      const res = await fetch(`/api/admin/media/${itemToLink.id}/link-cms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetCmsLocation,
          slideTitle: linkSlideTitle,
          slideSubtitle: linkSlideSubtitle,
          sectionId: linkSectionId ? Number(linkSectionId) : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to link image to CMS');
      }

      const data = await res.json();
      showToast(data.message || 'Image linked to CMS successfully!');
      setLinkModalOpen(false);
      setItemToLink(null);
    } catch (err: any) {
      console.error('Failed to link media to CMS:', err);
      showToast(`Error linking: ${err.message || 'Unknown error'}`);
    } finally {
      setLinking(false);
    }
  };

  // Open Delete Confirmation modal
  const handleOpenDeleteModal = (item: MediaItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // Confirm delete from Firebase Storage & Database
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      // 1. Delete from Firebase Storage
      await deleteImageFromFirebaseStorage(itemToDelete.url);

      // 2. Delete record from database
      const res = await fetch(`/api/admin/media/${itemToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete media record from database');
      }

      setMediaList((prev) => prev.filter((m) => m.id !== itemToDelete.id));
      showToast(`Image "${itemToDelete.name}" deleted from Firebase Storage & database.`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      if (previewItem?.id === itemToDelete.id) {
        setPreviewItem(null);
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(`Delete failed: ${err.message || 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Storage Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00B2A2]/10 text-[#00B2A2] dark:bg-[#00B2A2]/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Firebase Cloud Storage
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                quick-empire-qsmzh.firebasestorage.app
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Media Manager & CMS Asset Library
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Upload, preview, organize, and delete media files stored securely in Firebase Storage.
              Quickly link any image directly into Homepage hero slides, cleanroom banners, before/after repair showcase, or custom CMS sections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#00B2A2]/20 hover:bg-[#009e90] transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Images</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFilesSelected(e.target.files)}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
              className="hidden"
            />

            <button
              onClick={fetchMedia}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {onNavigateToContentManagement && (
              <button
                onClick={onNavigateToContentManagement}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#00B2A2]/30 bg-[#00B2A2]/5 px-3.5 py-2.5 text-xs font-semibold text-[#00B2A2] hover:bg-[#00B2A2]/10 transition-colors"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Page Content CMS</span>
              </button>
            )}
          </div>
        </div>

        {/* Storage Quick Summary Pills */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{mediaList.length}</span>
            <span>Total Images</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {categories.filter((c) => c.id !== 'all' && c.count > 0).length}
            </span>
            <span>Active Categories</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Firebase Storage Bucket Live</span>
          </div>
        </div>
      </div>

      {/* 2. Drag & Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00B2A2] dark:hover:border-[#00B2A2] rounded-2xl p-6 transition-all duration-200 bg-slate-50/50 dark:bg-slate-900/40 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-[#00B2A2]/10 text-[#00B2A2] group-hover:scale-110 flex items-center justify-center transition-transform duration-200 mb-3 shadow-xs">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Drag & Drop image files here or click to browse
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            Directly uploads to Firebase Storage with automatic download URL generation, image optimization, and CMS synchronization.
          </p>
          <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">JPG / JPEG</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">WebP</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">SVG</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono">Max 10MB</span>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs & Toolbar */}
      <div className="space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00B2A2] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search, Sort, View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name or alt text..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 pl-2">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none pr-2"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#00B2A2] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#00B2A2] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Media Gallery (Grid / List) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-[#00B2A2] mb-3" />
          <span className="text-xs font-semibold">Loading Firebase Media assets...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="h-14 w-14 rounded-2xl bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center mb-3">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No media items found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            {searchQuery
              ? `No images match your search "${searchQuery}". Try clearing the search term.`
              : 'Start by uploading images to your Firebase Storage Media Manager.'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] shadow-sm"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload First Image</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Image thumbnail container */}
              <div
                onClick={() => setPreviewItem(item)}
                className="relative h-36 w-full bg-slate-100 dark:bg-slate-950 cursor-pointer overflow-hidden"
              >
                <img
                  src={item.url}
                  alt={item.altText || item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 rounded-xl bg-white/90 text-slate-800 hover:bg-white text-xs font-bold shadow-md flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </span>
                </div>
                {/* Category badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs uppercase tracking-wider">
                  {item.category || 'general'}
                </span>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3">
                <h4
                  onClick={() => setPreviewItem(item)}
                  title={item.name}
                  className="text-xs font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-[#00B2A2] transition-colors"
                >
                  {item.name}
                </h4>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="font-mono text-[#00B2A2]">Firebase</span>
                </div>

                {/* Action buttons */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleOpenLinkModal(item)}
                    title="Link directly to CMS section"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-[#00B2A2]/10 text-[#00B2A2] hover:bg-[#00B2A2]/20 transition-colors"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span>Link CMS</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyUrl(item.url)}
                      title="Copy Firebase URL"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(item)}
                      title="Delete from Firebase Storage"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Name / Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Alt Text</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMedia.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-4">
                      <div
                        onClick={() => setPreviewItem(item)}
                        className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        onClick={() => setPreviewItem(item)}
                        className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-[#00B2A2] block truncate max-w-xs"
                      >
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block max-w-xs">
                        {item.url}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                        {item.category || 'general'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">
                      {item.altText || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenLinkModal(item)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#00B2A2]/10 text-[#00B2A2] hover:bg-[#00B2A2]/20 flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span>Link to CMS</span>
                        </button>
                        <button
                          onClick={() => handleCopyUrl(item.url)}
                          title="Copy Firebase URL"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewItem(item)}
                          title="Preview Lightbox"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          title="Delete from Firebase Storage"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. UPLOAD MODAL */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Upload to Firebase Storage
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selected {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Preview list of files */}
              <div className="max-h-40 overflow-y-auto space-y-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon className="h-4 w-4 text-[#00B2A2] shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-slate-400">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="text-rose-500 hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                >
                  <option value="banners">Banners & Hero (Homepage / About)</option>
                  <option value="cleanroom">Cleanroom Lab (Equipment / Cleanroom)</option>
                  <option value="gallery">Repair Gallery (Before / After Showcase)</option>
                  <option value="store">Store & Physical Lab Showcase</option>
                  <option value="brands">Brands & Manufacturer Logos</option>
                  <option value="services">Services Icons & Photos</option>
                  <option value="general">General Media Assets</option>
                </select>
              </div>

              {/* Optional Alt text for first/single */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alt Text (SEO Description)
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="e.g. Technician repairing iPhone logic board under stereo microscope"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                />
              </div>

              {/* Progress info */}
              {uploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>
                      Uploading file {uploadCurrentIndex} of {selectedFiles.length}...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#00B2A2] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#00B2A2]/20"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Start Upload ({selectedFiles.length})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FULL PREVIEW / LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row rounded-2xl border border-slate-800 bg-slate-900 text-white overflow-hidden shadow-2xl">
            {/* Left: Image canvas */}
            <div className="flex-1 bg-black/60 flex items-center justify-center p-4 min-h-[300px] md:min-h-[500px] relative">
              <img
                src={previewItem.url}
                alt={previewItem.altText || previewItem.name}
                className="max-h-[75vh] max-w-full object-contain rounded-lg"
              />
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-slate-800 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Right: Metadata & Actions Panel */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#00B2A2]/20 text-[#00B2A2] uppercase tracking-wider">
                    {previewItem.category || 'general'}
                  </span>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="hidden md:block p-1 text-slate-400 hover:text-white rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white break-words">
                    {previewItem.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Added {new Date(previewItem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {previewItem.altText && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase mb-1">
                      Alt Text / Caption:
                    </span>
                    {previewItem.altText}
                  </div>
                )}

                {/* Storage URL display & copy */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Firebase Storage URL
                  </span>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="text"
                      readOnly
                      value={previewItem.url}
                      className="w-full bg-transparent text-[11px] text-slate-300 font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyUrl(previewItem.url)}
                      className="p-1 text-[#00B2A2] hover:text-white rounded"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Quick copy markdown / HTML */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyMarkdown(previewItem)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 text-center"
                  >
                    Copy Markdown
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `<img src="${previewItem.url}" alt="${previewItem.altText || previewItem.name}" />`
                      );
                      showToast('HTML snippet copied to clipboard!');
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 text-center"
                  >
                    Copy HTML
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 space-y-2">
                <button
                  onClick={() => {
                    handleOpenLinkModal(previewItem);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] shadow-md shadow-[#00B2A2]/20"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Link This Image to CMS</span>
                </button>

                <button
                  onClick={() => handleOpenDeleteModal(previewItem)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete from Firebase Storage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LINK TO CMS MODAL */}
      {/* ========================================================================= */}
      {linkModalOpen && itemToLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Link Image to CMS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directly assign this Firebase image to a website page or section.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLinkModalOpen(false)}
                disabled={linking}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Selected image preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <img
                  src={itemToLink.url}
                  alt={itemToLink.name}
                  className="h-14 w-20 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                />
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {itemToLink.name}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase block">
                    {itemToLink.category || 'general'}
                  </span>
                  <span className="text-[10px] font-mono text-[#00B2A2] truncate block max-w-xs">
                    {itemToLink.url}
                  </span>
                </div>
              </div>

              {/* Target Location Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Website Page / Field
                </label>
                <select
                  value={targetCmsLocation}
                  onChange={(e) => setTargetCmsLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                >
                  <optgroup label="Homepage">
                    <option value="home-hero">Homepage • Add New Hero Slideshow Slide</option>
                    <option value="home-cleanroom">Homepage • Cleanroom Lab Feature Banner</option>
                    <option value="home-gallery">Homepage • Before / After Repair Showcase</option>
                  </optgroup>
                  <optgroup label="About Us Page">
                    <option value="about-hero">About Us • Hero Background Banner</option>
                    <option value="about-lab1">About Us • Cleanroom Facility Photo 1</option>
                    <option value="about-lab2">About Us • Cleanroom Facility Photo 2</option>
                  </optgroup>
                  <optgroup label="Contact Us Page">
                    <option value="contact-store">Contact Us • Store & Lab Showcase Photo</option>
                  </optgroup>
                </select>
              </div>

              {/* Contextual inputs for Slideshow / Gallery */}
              {targetCmsLocation === 'home-hero' && (
                <div className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Hero Slide Headline
                    </label>
                    <input
                      type="text"
                      value={linkSlideTitle}
                      onChange={(e) => setLinkSlideTitle(e.target.value)}
                      placeholder="e.g. Precision Motherboard & Micro-Soldering"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Slide Subtitle
                    </label>
                    <input
                      type="text"
                      value={linkSlideSubtitle}
                      onChange={(e) => setLinkSlideSubtitle(e.target.value)}
                      placeholder="e.g. ISO Class 5 Cleanroom Lab with advanced diagnostic workstations"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {targetCmsLocation === 'home-gallery' && (
                <div className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Repair Title
                    </label>
                    <input
                      type="text"
                      value={linkSlideTitle}
                      onChange={(e) => setLinkSlideTitle(e.target.value)}
                      placeholder="e.g. OLED Flex Cable Micro-Jumper"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Device Model
                    </label>
                    <input
                      type="text"
                      value={linkSlideSubtitle}
                      onChange={(e) => setLinkSlideSubtitle(e.target.value)}
                      placeholder="e.g. Samsung Galaxy S24 Ultra"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#00B2A2]/10 border border-[#00B2A2]/20 flex items-start gap-2.5 text-xs text-[#00B2A2]">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  This will immediately update the database and display this Firebase Storage image on the selected live page.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  disabled={linking}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteLink}
                  disabled={linking}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] shadow-md shadow-[#00B2A2]/20 disabled:opacity-50"
                >
                  {linking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Applying to CMS...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Confirm & Apply to CMS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-950 dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Media Asset?
                </h3>
                <p className="text-xs text-slate-500">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4">
              <img
                src={itemToDelete.url}
                alt={itemToDelete.name}
                className="h-12 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {itemToDelete.name}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Category: {itemToDelete.category || 'general'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5">
              The image file will be deleted from <strong>Firebase Storage</strong> and removed from your media library records. Any CMS page using this image will need to be updated.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting from Storage...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
