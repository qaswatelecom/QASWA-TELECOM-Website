import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  UploadCloud,
  Check,
  ImageIcon,
  Sparkles,
  Loader2,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { MediaItem } from '../../types/index.ts';
import {
  uploadImageToFirebaseStorage,
  validateImageFile,
} from '../../lib/firebaseStorage.ts';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, mediaItem?: MediaItem) => void;
  title?: string;
  suggestedCategory?: string;
  showToast?: (msg: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Image from Media Manager',
  suggestedCategory,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>(suggestedCategory || 'general');
  const [uploadName, setUploadName] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch media library items
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      if (suggestedCategory) {
        setSelectedCategory(suggestedCategory);
        setUploadCategory(suggestedCategory);
      }
    }
  }, [isOpen, suggestedCategory]);

  if (!isOpen) return null;

  // Filter media items
  const filteredItems = mediaList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.altText && m.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' ||
      (m.category && m.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Assets' },
    { id: 'banners', label: 'Banners & Hero' },
    { id: 'cleanroom', label: 'Cleanroom Lab' },
    { id: 'gallery', label: 'Repair Showcase' },
    { id: 'store', label: 'Store & Lab' },
    { id: 'brands', label: 'Brands & Logos' },
    { id: 'services', label: 'Services' },
    { id: 'general', label: 'General' },
  ];

  // Handle local file select for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      if (showToast) showToast(validation.error || 'Invalid image file');
      return;
    }

    setUploadFile(file);
    setUploadName(file.name.replace(/\.[^/.]+$/, ''));
    setUploadPreview(URL.createObjectURL(file));
  };

  // Perform upload to Firebase Storage & DB
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // 1. Upload to Firebase Storage
      const result = await uploadImageToFirebaseStorage(uploadFile, {
        category: uploadCategory,
        customName: uploadName,
        onProgress: (p) => setUploadProgress(p),
      });

      // 2. Persist metadata to database
      const dbRes = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.name,
          url: result.url,
          altText: uploadAlt || uploadName,
          category: uploadCategory,
        }),
      });

      if (!dbRes.ok) {
        throw new Error('Failed to save media metadata');
      }

      const created = await dbRes.json();
      if (showToast) showToast('Image uploaded and saved to Firebase Storage!');

      // Instantly select and apply to CMS field
      onSelectImage(created.url, created);
      onClose();
    } catch (err: any) {
      console.error('Upload failed:', err);
      if (showToast) showToast(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center font-bold">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an existing image or upload a new asset to Firebase Storage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'library'
                ? 'border-[#00B2A2] text-[#00B2A2]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Browse Library ({mediaList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-[#00B2A2] text-[#00B2A2]'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New to Firebase Storage</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[350px]">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search media by name or alt text..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`whitespace-nowrap px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        selectedCategory === c.id
                          ? 'bg-[#00B2A2] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Images */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00B2A2] mb-2" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No images match your criteria
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Try another search term or click "Upload New to Firebase Storage" to add your image.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B2A2] text-white text-xs font-semibold hover:bg-[#009e90]"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Image Now</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#00B2A2] ring-2 ring-[#00B2A2]/30 bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.altText || item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#00B2A2] text-white flex items-center justify-center shadow-md">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-[9px] font-bold rounded bg-slate-900/70 text-white backdrop-blur-xs uppercase">
                            {item.category || 'general'}
                          </span>
                        </div>
                        <div className="p-2">
                          <span className="text-xs font-semibold block truncate text-slate-800 dark:text-slate-200">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Upload to Firebase tab */
            <form onSubmit={handleUploadSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-[#00B2A2]/5 border border-[#00B2A2]/20 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#00B2A2] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#00B2A2] block">
                    Firebase Cloud Storage Active
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    Uploaded images are stored in Firebase Storage and linked directly to this CMS field.
                  </p>
                </div>
              </div>

              {/* Dropzone */}
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-[#00B2A2] dark:hover:border-[#00B2A2] transition-colors bg-slate-50/50 dark:bg-slate-950/30">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploadPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="h-32 w-auto max-w-full object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-3"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {uploadFile?.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {(uploadFile ? uploadFile.size / 1024 : 0).toFixed(1)} KB • Click or drop another to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#00B2A2]/10 text-[#00B2A2] flex items-center justify-center mb-3">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to choose an image or drag and drop
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, WebP, SVG, GIF up to 10MB
                    </span>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Image Name / Title
                  </label>
                  <input
                    type="text"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    placeholder="e.g. Cleanroom Microscope Station"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category Tag
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                  >
                    <option value="banners">Banners & Hero</option>
                    <option value="cleanroom">Cleanroom Lab</option>
                    <option value="gallery">Repair Showcase</option>
                    <option value="store">Store & Lab</option>
                    <option value="brands">Brands & Logos</option>
                    <option value="services">Services</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Alt Text (SEO Description)
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="e.g. Technicians performing micro-soldering under microscope"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:border-[#00B2A2] focus:outline-none"
                />
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Uploading to Firebase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#00B2A2] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!uploadFile || uploading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#00B2A2]/20"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading & Linking...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload to Firebase & Use in CMS</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500">
            {selectedItem ? (
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Selected: {selectedItem.name}
              </span>
            ) : (
              <span>Select an image to use in CMS</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            {activeTab === 'library' && (
              <button
                onClick={() => {
                  if (selectedItem) {
                    onSelectImage(selectedItem.url, selectedItem);
                    onClose();
                  }
                }}
                disabled={!selectedItem}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B2A2] text-white text-xs font-bold hover:bg-[#009e90] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Check className="h-4 w-4" />
                <span>Use Selected Image</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
