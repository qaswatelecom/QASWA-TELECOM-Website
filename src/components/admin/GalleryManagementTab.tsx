import React, { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Plus,
  Upload,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  Smartphone,
  Save,
  X,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { GalleryItem, DeviceCategory, Brand } from '../../types/index.ts';

interface GalleryManagementTabProps {
  categories: DeviceCategory[];
  brands: Brand[];
  onShowToast: (msg: string) => void;
}

export const GalleryManagementTab: React.FC<GalleryManagementTabProps> = ({
  categories,
  brands,
  onShowToast,
}) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterHomepage, setFilterHomepage] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Bulk Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [bulkUrls, setBulkUrls] = useState<string>('');
  const [bulkCategory, setBulkCategory] = useState<string>('mobile');
  const [bulkBrand, setBulkBrand] = useState<string>('apple');
  const [bulkShowHomepage, setBulkShowHomepage] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    imageUrl: '',
    beforeImageUrl: '',
    categorySlug: 'mobile',
    brandSlug: 'apple',
    showOnHomepage: true,
    homepageOrder: 1,
    sortOrder: 1,
    isPublished: true,
  });

  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      onShowToast('Error loading gallery items');
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      caption: '',
      imageUrl: '',
      beforeImageUrl: '',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      showOnHomepage: true,
      homepageOrder: items.length + 1,
      sortOrder: items.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      caption: item.caption || '',
      imageUrl: item.imageUrl,
      beforeImageUrl: item.beforeImageUrl || '',
      categorySlug: item.categorySlug || 'mobile',
      brandSlug: item.brandSlug || 'apple',
      showOnHomepage: item.showOnHomepage,
      homepageOrder: item.homepageOrder || 0,
      sortOrder: item.sortOrder || 0,
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      onShowToast('Image URL is required');
      return;
    }

    try {
      const url = editingItem
        ? `/api/admin/gallery/${editingItem.id}`
        : '/api/admin/gallery';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save gallery item');

      onShowToast(editingItem ? 'Gallery item updated' : 'Gallery item added');
      setIsModalOpen(false);
      fetchGalleryItems();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Operation failed');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = bulkUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      onShowToast('Please provide at least one image URL');
      return;
    }

    try {
      const bulkPayload = urls.map((url, idx) => ({
        title: `${bulkBrand.toUpperCase()} Display Repair`,
        caption: `Cleanroom optical restoration for ${bulkBrand} device`,
        imageUrl: url,
        categorySlug: bulkCategory,
        brandSlug: bulkBrand,
        showOnHomepage: bulkShowHomepage,
        homepageOrder: items.length + idx + 1,
        sortOrder: items.length + idx + 1,
        isPublished: true,
      }));

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkPayload),
      });

      if (!res.ok) throw new Error('Failed to add bulk gallery items');

      onShowToast(`Successfully added ${urls.length} gallery images`);
      setIsBulkModalOpen(false);
      setBulkUrls('');
      fetchGalleryItems();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || 'Bulk upload failed');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this gallery image?')) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      onShowToast('Gallery image deleted');
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      onShowToast(err.message || 'Delete failed');
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      onShowToast(`Image ${!item.isPublished ? 'published' : 'unpublished'}`);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPublished: !i.isPublished } : i))
      );
    } catch (err: any) {
      onShowToast('Failed to toggle publish status');
    }
  };

  const handleToggleHomepage = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, showOnHomepage: !item.showOnHomepage }),
      });
      if (!res.ok) throw new Error('Failed to update homepage status');
      onShowToast(`Image ${!item.showOnHomepage ? 'added to' : 'removed from'} homepage slideshow`);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, showOnHomepage: !i.showOnHomepage } : i))
      );
    } catch (err: any) {
      onShowToast('Failed to toggle homepage status');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update order numbers
    const payload = newItems.map((itm, i) => ({
      id: itm.id,
      sortOrder: i + 1,
      homepageOrder: itm.homepageOrder || i + 1,
    }));

    setItems(newItems);

    try {
      await fetch('/api/admin/gallery/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      onShowToast('Gallery order updated');
    } catch (err) {
      onShowToast('Failed to save new order');
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.brandSlug && item.brandSlug.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      filterCategory === 'all' || item.categorySlug === filterCategory;

    const matchesHomepage =
      filterHomepage === 'all' ||
      (filterHomepage === 'homepage' && item.showOnHomepage) ||
      (filterHomepage === 'not_homepage' && !item.showOnHomepage);

    return matchesSearch && matchesCategory && matchesHomepage;
  });

  const homepageCount = items.filter((i) => i.showOnHomepage && i.isPublished).length;
  const publishedCount = items.filter((i) => i.isPublished).length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#00B2A2]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Repair Gallery Management
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload, categorize, reorder display repair photos, and choose which appear on the homepage slideshow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-[#00B2A2] transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 text-[#00B2A2]" />
            <span>Upload Multiple</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B2A2] hover:bg-[#009e90] text-white text-xs font-bold shadow-md shadow-[#00B2A2]/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Single Image</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Gallery Images</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {items.length}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Homepage Slideshow Active</div>
            <div className="text-xl font-extrabold text-[#00B2A2] mt-1">
              {homepageCount} images
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#00B2A2]/10 text-[#00B2A2]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Published / Live</div>
            <div className="text-xl font-extrabold text-emerald-500 mt-1">
              {publishedCount} of {items.length}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden focus:border-[#00B2A2]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-[#00B2A2]"
          >
            <option value="all">All Categories</option>
            <option value="mobile">Mobile</option>
            <option value="ipad">iPad</option>
            <option value="apple-watch">Apple Watch</option>
            <option value="tablet">Tablet</option>
          </select>

          <select
            value={filterHomepage}
            onChange={(e) => setFilterHomepage(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:border-[#00B2A2]"
          >
            <option value="all">All Placements</option>
            <option value="homepage">Homepage Slideshow Only</option>
            <option value="not_homepage">Gallery Page Only</option>
          </select>

          <button
            onClick={fetchGalleryItems}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:text-[#00B2A2] transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 4. Gallery Items Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading gallery items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Camera className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No gallery images found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Add images using the button above to populate the homepage slideshow and gallery page.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4 w-24">Image</th>
                  <th className="py-3 px-4">Title & Caption</th>
                  <th className="py-3 px-4 w-32">Category / Brand</th>
                  <th className="py-3 px-4 w-28 text-center">Homepage</th>
                  <th className="py-3 px-4 w-24 text-center">Status</th>
                  <th className="py-3 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Reorder Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-[#00B2A2] disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">
                          {item.sortOrder || idx + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === filteredItems.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-[#00B2A2] disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Image Preview */}
                    <td className="py-3 px-4">
                      <div className="h-14 w-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-800 relative group">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>

                    {/* Title & Caption */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </div>
                      {item.caption && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.caption}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">ID: #{item.id}</div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#00B2A2]/10 text-[#00B2A2] font-semibold text-[11px] capitalize mb-1">
                        {item.categorySlug || 'Mobile'}
                      </span>
                      {item.brandSlug && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                          {item.brandSlug}
                        </div>
                      )}
                    </td>

                    {/* Homepage Slideshow Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleHomepage(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          item.showOnHomepage
                            ? 'bg-[#00B2A2]/15 text-[#00B2A2]'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{item.showOnHomepage ? `Slot #${item.homepageOrder || 1}` : 'Off'}</span>
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          item.isPublished
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {item.isPublished ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#00B2A2] hover:text-[#00B2A2] transition-colors cursor-pointer"
                          title="Edit Image Details"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
                          title="Delete Image"
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

      {/* 5. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#00B2A2]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Image URL */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2]"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-28 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-contain"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Image Title / Device Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 15 Pro Max Ceramic Shield Restoration"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2]"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Caption / Repair Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the optical de-bonding or laser flex bonding..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2]"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Device Category
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2]"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="ipad">iPad</option>
                    <option value="apple-watch">Apple Watch</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Brand
                  </label>
                  <select
                    value={formData.brandSlug}
                    onChange={(e) => setFormData({ ...formData, brandSlug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2] capitalize"
                  >
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="google-pixel">Google Pixel</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="xiaomi">Xiaomi</option>
                    <option value="other">Other Flagship</option>
                  </select>
                </div>
              </div>

              {/* Homepage Slot & Order */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">
                      Show in Homepage Slideshow
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Display this photo in the auto-sliding homepage carousel
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showOnHomepage}
                    onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    className="h-4 w-4 rounded text-[#00B2A2] focus:ring-[#00B2A2]"
                  />
                </div>

                {formData.showOnHomepage && (
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                      Homepage Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.homepageOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, homepageOrder: parseInt(e.target.value) || 1 })
                      }
                      className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Published Switch */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Publish Status</div>
                  <div className="text-[11px] text-slate-500">
                    Live on website or saved as hidden draft
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded text-[#00B2A2] focus:ring-[#00B2A2]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B2A2] hover:bg-[#009e90] text-white font-bold transition-all shadow-md shadow-[#00B2A2]/20"
                >
                  {editingItem ? 'Save Changes' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#00B2A2]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Bulk Add Gallery Images
                </h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Image URLs (One URL per line) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2...&#10;https://images.unsplash.com/photo-3..."
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2] font-mono text-[11px]"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Paste high-resolution images of display repair work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Category for this Batch
                  </label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2]"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="ipad">iPad</option>
                    <option value="apple-watch">Apple Watch</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Brand for this Batch
                  </label>
                  <select
                    value={bulkBrand}
                    onChange={(e) => setBulkBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:border-[#00B2A2] capitalize"
                  >
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="google-pixel">Google Pixel</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white">
                    Show in Homepage Slideshow
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Automatically feature these images in the homepage carousel
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={bulkShowHomepage}
                  onChange={(e) => setBulkShowHomepage(e.target.checked)}
                  className="h-4 w-4 rounded text-[#00B2A2] focus:ring-[#00B2A2]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B2A2] hover:bg-[#009e90] text-white font-bold transition-all shadow-md shadow-[#00B2A2]/20"
                >
                  Upload Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
