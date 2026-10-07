import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Watch,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Image as ImageIcon,
  Layers,
  Wrench,
  Check,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Filter,
  Upload,
} from 'lucide-react';
import { DeviceCategory, Brand, Model, Service } from '../../types/index.ts';
import { MediaPickerModal } from './MediaPickerModal.tsx';
import { IssueCardsManagementTab } from './IssueCardsManagementTab.tsx';

interface DeviceCatalogManagementTabProps {
  showToast: (msg: string) => void;
  onRefreshAll?: () => void;
  initialSection?: 'mobile' | 'ipad' | 'apple-watch' | 'tablet' | 'categories' | 'issue_cards';
  initialSubTab?: 'brands' | 'models';
}

const COMMON_DISPLAY_ISSUES = [
  'Cracked or Shattered Front Glass (Touch & OLED Working)',
  'Green Line / Vertical & Horizontal Display Lines',
  'OLED Black Screen / Blank Display Malfunction',
  'Touch Digitizer Not Responding / Ghost Touch',
  'Flickering, Pink Tint or Distorted Display',
  'TrueTone & Ambient Light Sensor Calibration Required',
  'Internal AMOLED Ink Bleed / Pressure Damage',
  'White Screen Flex Bonding Laser Issue',
];

export const DeviceCatalogManagementTab: React.FC<DeviceCatalogManagementTabProps> = ({
  showToast,
  onRefreshAll,
  initialSection = 'mobile',
  initialSubTab = 'brands',
}) => {
  // Main Selected Section: 'mobile' | 'ipad' | 'apple-watch' | 'tablet' | 'categories' | 'issue_cards'
  const [activeSection, setActiveSection] = useState<'mobile' | 'ipad' | 'apple-watch' | 'tablet' | 'categories' | 'issue_cards'>(initialSection);
  // Secondary sub-tab for Mobile & Tablet: 'brands' | 'models'
  const [subTab, setSubTab] = useState<'brands' | 'models'>(initialSubTab);

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSection, initialSubTab]);

  // Data states
  const [categoriesList, setCategoriesList] = useState<DeviceCategory[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [modelsList, setModelsList] = useState<Model[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'categoryImage' | 'brandLogo' | 'modelImage' | null>(null);

  // Edit/Create Modal states
  const [modalType, setModalType] = useState<'category' | 'brand' | 'model' | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>({});
  const [savingItem, setSavingItem] = useState(false);

  // Load all catalog data
  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, brandsRes, modelsRes, servRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
        fetch('/api/admin/models'),
        fetch('/api/admin/services'),
      ]);

      if (catsRes.ok) setCategoriesList(await catsRes.json());
      if (brandsRes.ok) setBrandsList(await brandsRes.json());
      if (modelsRes.ok) setModelsList(await modelsRes.json());
      if (servRes.ok) setServicesList(await servRes.json());
    } catch (err) {
      console.error('Failed to load catalog data:', err);
      showToast('Failed to load device catalog data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered lists
  const currentCategorySlug = activeSection;

  // Brands for the active section (mobile or tablet)
  const currentSectionBrands = brandsList.filter(
    (b) => b.categorySlug === currentCategorySlug || (currentCategorySlug === 'mobile' && !b.categorySlug)
  );

  // Models for the active section
  const currentSectionModels = modelsList.filter((m) => {
    const matchesSection =
      m.categorySlug === currentCategorySlug ||
      (currentCategorySlug === 'mobile' && (!m.categorySlug || m.categorySlug === 'mobile'));

    const matchesBrand =
      selectedBrandFilter === 'all' || String(m.brandId) === selectedBrandFilter;

    const matchesSeries =
      selectedSeriesFilter === 'all' || m.series === selectedSeriesFilter;

    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.series && m.series.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.brandName && m.brandName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSection && matchesBrand && matchesSeries && matchesSearch;
  });

  // Unique series for dropdown
  const availableSeries = Array.from(
    new Set(
      modelsList
        .filter((m) => m.categorySlug === currentCategorySlug)
        .map((m) => m.series)
        .filter(Boolean)
    )
  ) as string[];

  // Open Add Modal
  const handleOpenAdd = (type: 'category' | 'brand' | 'model') => {
    setModalType(type);
    if (type === 'category') {
      setEditingItem({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        imageUrl: '',
        icon: 'Smartphone',
        hasBrands: true,
        isActive: true,
        sortOrder: categoriesList.length + 1,
      });
    } else if (type === 'brand') {
      const defaultCat = categoriesList.find((c) => c.slug === currentCategorySlug) || categoriesList[0];
      setEditingItem({
        categoryId: defaultCat?.id || null,
        categorySlug: currentCategorySlug === 'tablet' ? 'tablet' : 'mobile',
        name: '',
        slug: '',
        logoUrl: '',
        description: '',
        isActive: true,
        sortOrder: currentSectionBrands.length + 1,
      });
    } else if (type === 'model') {
      const defaultCat = categoriesList.find((c) => c.slug === currentCategorySlug);
      const defaultBrand = currentSectionBrands[0];
      setEditingItem({
        categoryId: defaultCat?.id || null,
        categorySlug: currentCategorySlug,
        brandId: currentCategorySlug === 'ipad' || currentCategorySlug === 'apple-watch' ? null : defaultBrand?.id || null,
        series: '',
        name: '',
        slug: '',
        imageUrl: '',
        description: '',
        displayIssues: COMMON_DISPLAY_ISSUES,
        serviceIds: servicesList.map((s) => s.id),
        isActive: true,
        sortOrder: currentSectionModels.length + 1,
      });
    }
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (type: 'category' | 'brand' | 'model', item: any) => {
    setModalType(type);
    if (type === 'model') {
      let issues: string[] = [];
      if (item.displayIssues) {
        try {
          issues = typeof item.displayIssues === 'string' ? JSON.parse(item.displayIssues) : item.displayIssues;
        } catch {
          issues = item.displayIssues.split(',').map((s: string) => s.trim());
        }
      } else {
        issues = COMMON_DISPLAY_ISSUES;
      }

      setEditingItem({
        ...item,
        displayIssues: issues,
        serviceIds: item.serviceIds || servicesList.map((s) => s.id),
      });
    } else {
      setEditingItem({ ...item });
    }
    setModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType) return;

    setSavingItem(true);
    let endpoint = '';
    if (modalType === 'category') endpoint = '/api/admin/categories';
    else if (modalType === 'brand') endpoint = '/api/admin/brands';
    else if (modalType === 'model') endpoint = '/api/admin/models';

    const isEdit = Boolean(editingItem.id);
    const url = isEdit ? `${endpoint}/${editingItem.id}` : endpoint;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }

      showToast(`${modalType.toUpperCase()} saved successfully!`);
      setModalOpen(false);
      await loadData();
      if (onRefreshAll) onRefreshAll();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error saving item');
    } finally {
      setSavingItem(false);
    }
  };

  // Delete Record
  const handleDelete = async (type: 'category' | 'brand' | 'model', id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${type} "${name}"?`)) return;

    let endpoint = '';
    if (type === 'category') endpoint = '/api/admin/categories';
    else if (type === 'brand') endpoint = '/api/admin/brands';
    else if (type === 'model') endpoint = '/api/admin/models';

    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${name} deleted successfully!`);
        await loadData();
        if (onRefreshAll) onRefreshAll();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      showToast('Error deleting item');
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (type: 'brand' | 'model' | 'category', item: any) => {
    let endpoint = '';
    if (type === 'category') endpoint = `/api/admin/categories/${item.id}`;
    else if (type === 'brand') endpoint = `/api/admin/brands/${item.id}`;
    else if (type === 'model') endpoint = `/api/admin/models/${item.id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isActive: !item.isActive }),
      });
      if (res.ok) {
        showToast(`Status updated to ${!item.isActive ? 'Active' : 'Inactive'}`);
        await loadData();
        if (onRefreshAll) onRefreshAll();
      }
    } catch {
      showToast('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Device Catalog & Display Services Manager</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage the four device categories, mobile brands & models, iPad & Apple Watch generations, and display issues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSection === 'categories' ? (
            <button
              onClick={() => handleOpenAdd('category')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          ) : activeSection === 'mobile' || activeSection === 'tablet' ? (
            subTab === 'brands' ? (
              <button
                onClick={() => handleOpenAdd('brand')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add {activeSection === 'mobile' ? 'Mobile' : 'Tablet'} Brand</span>
              </button>
            ) : (
              <button
                onClick={() => handleOpenAdd('model')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add {activeSection === 'mobile' ? 'Mobile' : 'Tablet'} Model</span>
              </button>
            )
          ) : (
            <button
              onClick={() => handleOpenAdd('model')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add {activeSection === 'ipad' ? 'iPad' : 'Apple Watch'} Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Category Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 w-fit">
        <button
          onClick={() => {
            setActiveSection('mobile');
            setSearchQuery('');
            setSelectedBrandFilter('all');
            setSelectedSeriesFilter('all');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'mobile'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>1. Mobile</span>
          <span className="ml-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
            {modelsList.filter((m) => m.categorySlug === 'mobile' || !m.categorySlug).length} models
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection('ipad');
            setSearchQuery('');
            setSelectedBrandFilter('all');
            setSelectedSeriesFilter('all');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'ipad'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tablet className="h-4 w-4" />
          <span>2. iPad</span>
          <span className="ml-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
            {modelsList.filter((m) => m.categorySlug === 'ipad').length} models
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection('apple-watch');
            setSearchQuery('');
            setSelectedBrandFilter('all');
            setSelectedSeriesFilter('all');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'apple-watch'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Watch className="h-4 w-4" />
          <span>3. Apple Watch</span>
          <span className="ml-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
            {modelsList.filter((m) => m.categorySlug === 'apple-watch').length} models
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection('tablet');
            setSearchQuery('');
            setSelectedBrandFilter('all');
            setSelectedSeriesFilter('all');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'tablet'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tablet className="h-4 w-4" />
          <span>4. Tablet</span>
          <span className="ml-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
            {modelsList.filter((m) => m.categorySlug === 'tablet').length} models
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSection('categories');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'categories'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>4 Categories Setup (Website Home)</span>
        </button>

        <button
          onClick={() => {
            setActiveSection('issue_cards');
            setSearchQuery('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeSection === 'issue_cards'
              ? 'bg-white dark:bg-slate-900 text-[#00B2A2] shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Issue Cards (Issues Page)</span>
        </button>
      </div>

      {/* Sub-tab switcher for Mobile & Tablet */}
      {(activeSection === 'mobile' || activeSection === 'tablet') && (
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setSubTab('brands')}
            className={`text-xs font-extrabold pb-1.5 transition-colors cursor-pointer border-b-2 ${
              subTab === 'brands'
                ? 'border-[#00B2A2] text-[#00B2A2]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Manage {activeSection === 'mobile' ? 'Mobile' : 'Tablet'} Brands ({currentSectionBrands.length})
          </button>
          <button
            onClick={() => setSubTab('models')}
            className={`text-xs font-extrabold pb-1.5 transition-colors cursor-pointer border-b-2 ${
              subTab === 'models'
                ? 'border-[#00B2A2] text-[#00B2A2]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Manage {activeSection === 'mobile' ? 'Mobile' : 'Tablet'} Models ({currentSectionModels.length})
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. SECTION: DEVICE CATEGORIES SETUP                                  */}
      {/* ===================================================================== */}
      {activeSection === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-3.5 flex items-center justify-center p-2">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="h-full w-full object-contain object-center"
                      />
                    ) : (
                      <Smartphone className="h-10 w-10 text-[#00B2A2]" />
                    )}
                    <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Order: {cat.sortOrder}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span
                      onClick={() => handleToggleActive('category', cat)}
                      className={`cursor-pointer px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400 mt-0.5">slug: /{cat.slug}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {cat.tagline || cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit('category', cat)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00B2A2]/10 hover:bg-[#00B2A2] text-[#00B2A2] hover:text-white px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Category & Image</span>
                  </button>
                  <button
                    onClick={() => handleDelete('category', cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISSUE CARDS (ISSUES PAGE) */}
      {activeSection === 'issue_cards' && (
        <IssueCardsManagementTab
          showToast={showToast}
          onRefreshAll={onRefreshAll}
        />
      )}

      {/* ===================================================================== */}
      {/* 2. BRANDS MANAGEMENT (Mobile Brands or Tablet Brands)                */}
      {/* ===================================================================== */}
      {(activeSection === 'mobile' || activeSection === 'tablet') && subTab === 'brands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentSectionBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Smartphone className="h-6 w-6 text-[#00B2A2]" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {brand.name}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">/{brand.slug}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {brand.description || `Display repair services for ${brand.name}.`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => handleToggleActive('brand', brand)}
                      className={`cursor-pointer px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        brand.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {brand.isActive ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full" title="Display Order">
                      #{brand.sortOrder ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit('brand', brand)}
                      className="p-1.5 text-slate-500 hover:text-[#00B2A2] cursor-pointer"
                      title="Edit Brand"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('brand', brand.id, brand.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODELS MANAGEMENT (Mobile models, iPad models, Watch models, Tablet)*/}
      {/* ===================================================================== */}
      {(activeSection === 'ipad' ||
        activeSection === 'apple-watch' ||
        ((activeSection === 'mobile' || activeSection === 'tablet') && subTab === 'models')) && (
        <div className="space-y-4">
          {/* Controls: Search, Brand Filter, Series Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model name..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#00B2A2]"
                />
              </div>

              {/* Brand filter for mobile and tablet */}
              {(activeSection === 'mobile' || activeSection === 'tablet') && (
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="all">All Brands ({currentSectionBrands.length})</option>
                  {currentSectionBrands.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Series filter */}
              {availableSeries.length > 0 && (
                <select
                  value={selectedSeriesFilter}
                  onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="all">All Series</option>
                  {availableSeries.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <span className="text-xs font-medium text-slate-500">
              Showing {currentSectionModels.length} models
            </span>
          </div>

          {/* Models Table View */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Device Model</th>
                    <th className="py-3 px-4">Brand / Category</th>
                    <th className="py-3 px-4">Series</th>
                    <th className="py-3 px-4">Display Issues</th>
                    <th className="py-3 px-4">Services Linked</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentSectionModels.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        No models found for {activeSection} matching your search.
                      </td>
                    </tr>
                  ) : (
                    currentSectionModels.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                              {m.imageUrl ? (
                                <img src={m.imageUrl} alt={m.name} className="h-full w-full object-contain" />
                              ) : (
                                <Smartphone className="h-5 w-5 text-[#00B2A2]" />
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block">
                                {m.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                /{m.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {m.brandName || m.categoryName || activeSection}
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          {m.series ? (
                            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                              {m.series}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium">
                            {m.displayIssues ? 'Configured' : 'Default'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          <span className="rounded-md bg-[#00B2A2]/10 text-[#00B2A2] px-2 py-0.5 text-[10px] font-bold">
                            {(m as any).serviceIds?.length || servicesList.length} services
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleActive('model', m)}
                            className={`cursor-pointer px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {m.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/models/${m.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-400 hover:text-[#00B2A2] transition-colors"
                              title="View Live Page"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => handleOpenEdit('model', m)}
                              className="text-xs font-bold text-[#00B2A2] hover:underline px-2 py-1 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('model', m.id, m.name)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete Model"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MODAL: EDIT / ADD CATEGORY, BRAND, OR MODEL                        */}
      {/* ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white capitalize">
                {editingItem.id ? 'Edit' : 'Add'}{' '}
                {modalType === 'category'
                  ? 'Device Category'
                  : modalType === 'brand'
                  ? `${editingItem.categorySlug || activeSection} Brand`
                  : `${activeSection} Model`}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-4 space-y-4 text-xs">
              {/* BRAND MODAL FIELDS */}
              {modalType === 'brand' && (
                <>
                  {/* 1. Category & 3. Order Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={editingItem.categorySlug || 'mobile'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const foundCat = categoriesList.find((c) => c.slug === val);
                          setEditingItem({
                            ...editingItem,
                            categorySlug: val,
                            categoryId: foundCat?.id || null,
                          });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold focus:border-[#00B2A2] focus:outline-none"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                        {!categoriesList.length && (
                          <>
                            <option value="mobile">Mobile</option>
                            <option value="ipad">iPad</option>
                            <option value="apple-watch">Apple Watch</option>
                            <option value="tablet">Tablet</option>
                          </>
                        )}
                      </select>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Admin/database field for identifying the brand category.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Order Number
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingItem.sortOrder ?? 0}
                        onChange={(e) => setEditingItem({ ...editingItem, sortOrder: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-bold focus:border-[#00B2A2] focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Controls display order of brands (lower numbers appear first).</span>
                    </div>
                  </div>

                  {/* 2. Brand Name & 4. URL Slug + 6. No Need Brand Url */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.name || ''}
                        onChange={(e) => {
                          const name = e.target.value;
                          const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          setEditingItem({
                            ...editingItem,
                            name,
                            slug: editingItem.noNeedBrandUrl ? '#' : (editingItem.slug && editingItem.slug !== '#' ? editingItem.slug : autoSlug),
                          });
                        }}
                        placeholder="e.g. Apple, Samsung, OnePlus"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 focus:border-[#00B2A2] focus:outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          URL Slug {editingItem.noNeedBrandUrl || editingItem.slug === '#' ? '(Disabled)' : '*'}
                        </label>
                        {/* 6. No Need Brand Url option */}
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-[#00B2A2] font-semibold select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(editingItem.noNeedBrandUrl || editingItem.slug === '#')}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEditingItem({
                                ...editingItem,
                                noNeedBrandUrl: checked,
                                slug: checked ? '#' : (editingItem.name ? editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
                              });
                            }}
                            className="rounded text-[#00B2A2] focus:ring-[#00B2A2]"
                          />
                          <span>No Need Brand URL</span>
                        </label>
                      </div>

                      <input
                        type="text"
                        disabled={Boolean(editingItem.noNeedBrandUrl || editingItem.slug === '#')}
                        required={!Boolean(editingItem.noNeedBrandUrl || editingItem.slug === '#')}
                        value={editingItem.slug === '#' ? '' : (editingItem.slug || '')}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        placeholder={editingItem.noNeedBrandUrl || editingItem.slug === '#' ? 'Brand URL disabled (No dedicated page)' : 'e.g. apple, samsung'}
                        className={`w-full rounded-xl border p-2.5 text-xs font-mono transition-colors ${
                          editingItem.noNeedBrandUrl || editingItem.slug === '#'
                            ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed italic'
                            : 'border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {editingItem.noNeedBrandUrl || editingItem.slug === '#'
                          ? '✓ Brand URL is disabled. This brand card will display normally without an external link.'
                          : 'Internal SEO URL identifier (admin-only, not displayed as raw text to customers).'}
                      </span>
                    </div>
                  </div>

                  {/* 5. Brand Image Upload & 7. Brand Image Preview */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Brand Image Upload
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Manages brand image in "Brands We Repair" section (upload controls hidden on live site)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      {/* Upload controls */}
                      <div className="md:col-span-2 space-y-2.5">
                        {/* Direct File Upload */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#00B2A2] dark:hover:border-[#00B2A2] cursor-pointer transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Upload className="h-4 w-4 text-[#00B2A2]" />
                            <span>Choose Image File (PNG, SVG, WEBP, JPG)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const dataUrl = ev.target?.result as string;
                                  setEditingItem((prev: any) => ({ ...prev, logoUrl: dataUrl }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTarget('brandLogo');
                              setMediaPickerOpen(true);
                            }}
                            className="rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] px-3.5 py-2.5 text-xs font-bold hover:bg-[#00B2A2] hover:text-white transition-colors cursor-pointer shrink-0"
                            title="Select from Media Manager"
                          >
                            🖼️ Media Manager
                          </button>
                        </div>

                        {/* Direct Image URL input */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">or Image URL:</span>
                          <input
                            type="text"
                            value={editingItem.logoUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, logoUrl: e.target.value })}
                            placeholder="/brands/apple.svg or https://..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-[#00B2A2] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* 7. Brand Image Preview */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Brand Image Preview
                        </label>
                        <div className="h-20 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
                          {editingItem.logoUrl ? (
                            <>
                              <img
                                src={editingItem.logoUrl}
                                alt="Brand preview"
                                className="max-h-12 max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingItem({ ...editingItem, logoUrl: '' })}
                                className="absolute top-1 right-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md p-1 text-[10px] transition-colors cursor-pointer"
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No image selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 8. Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Description
                      </label>
                      <span className="text-[10px] text-slate-400">Admin-only notes (Not displayed on live website)</span>
                    </div>
                    <textarea
                      rows={3}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Internal administration notes regarding display repairs for this brand..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 focus:border-[#00B2A2] focus:outline-none"
                    />
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive !== false}
                      onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                      className="rounded text-[#00B2A2] focus:ring-[#00B2A2]"
                    />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Active (Visible on website)
                    </span>
                  </label>
                </>
              )}

              {/* MODEL MODAL FIELDS */}
              {modalType === 'model' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <select
                        value={editingItem.categorySlug || activeSection}
                        onChange={(e) => {
                          const val = e.target.value;
                          const foundCat = categoriesList.find((c) => c.slug === val);
                          setEditingItem({
                            ...editingItem,
                            categorySlug: val,
                            categoryId: foundCat?.id || null,
                          });
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-bold"
                      >
                        <option value="mobile">Mobile</option>
                        <option value="ipad">iPad</option>
                        <option value="apple-watch">Apple Watch</option>
                        <option value="tablet">Tablet</option>
                      </select>
                    </div>

                    {(editingItem.categorySlug === 'mobile' || editingItem.categorySlug === 'tablet') && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Brand
                        </label>
                        <select
                          value={editingItem.brandId || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, brandId: e.target.value ? Number(e.target.value) : null })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-bold"
                        >
                          <option value="">Select Brand</option>
                          {brandsList
                            .filter((b) => b.categorySlug === editingItem.categorySlug)
                            .map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Series (e.g. Pro, Ultra)
                      </label>
                      <input
                        type="text"
                        value={editingItem.series || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, series: e.target.value })}
                        placeholder="e.g. iPad Pro, Ultra 3, Galaxy S"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.name || ''}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          setEditingItem({
                            ...editingItem,
                            name,
                            slug: editingItem.slug ? editingItem.slug : slug,
                          });
                        }}
                        placeholder="e.g. iPhone 17 Pro Max, Apple Watch Ultra 3"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.slug || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        placeholder="e.g. iphone-17-pro-max"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Device Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.imageUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        placeholder="https://... or upload in Media Manager"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget('modelImage');
                          setMediaPickerOpen(true);
                        }}
                        className="rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] px-3 py-2 text-xs font-bold hover:bg-[#00B2A2] hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        🖼️ Media Manager
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Specialized display repair and glass refurbishing..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  {/* DISPLAY ISSUES ASSIGNMENT */}
                  <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                      <span>Assign Display-Related Issues for this Model</span>
                      <span className="text-[10px] text-slate-400 font-normal">Check all applicable faults</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMMON_DISPLAY_ISSUES.map((issue) => {
                        const currentIssues: string[] = Array.isArray(editingItem.displayIssues)
                          ? editingItem.displayIssues
                          : [];
                        const isChecked = currentIssues.includes(issue);

                        return (
                          <label
                            key={issue}
                            className={`flex items-start gap-2 p-2 rounded-xl border text-[11px] cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-[#00B2A2] bg-[#00B2A2]/10 font-bold text-slate-900 dark:text-white'
                                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let updated: string[] = [];
                                if (e.target.checked) {
                                  updated = [...currentIssues, issue];
                                } else {
                                  updated = currentIssues.filter((i) => i !== issue);
                                }
                                setEditingItem({ ...editingItem, displayIssues: updated });
                              }}
                              className="mt-0.5 rounded text-[#00B2A2]"
                            />
                            <span>{issue}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* DISPLAY REPAIR SERVICES ASSIGNMENT */}
                  <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                      <span>Assign Display Services for this Model</span>
                      <span className="text-[10px] text-slate-400 font-normal">Active display services</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {servicesList.map((service) => {
                        const currentServiceIds: number[] = Array.isArray(editingItem.serviceIds)
                          ? editingItem.serviceIds
                          : [];
                        const isChecked = currentServiceIds.includes(service.id);

                        return (
                          <label
                            key={service.id}
                            className={`flex items-start gap-2 p-2 rounded-xl border text-[11px] cursor-pointer transition-colors ${
                              isChecked
                                ? 'border-[#00B2A2] bg-[#00B2A2]/10 font-bold text-slate-900 dark:text-white'
                                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let updated: number[] = [];
                                if (e.target.checked) {
                                  updated = [...currentServiceIds, service.id];
                                } else {
                                  updated = currentServiceIds.filter((id) => id !== service.id);
                                }
                                setEditingItem({ ...editingItem, serviceIds: updated });
                              }}
                              className="mt-0.5 rounded text-[#00B2A2]"
                            />
                            <span>{service.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingItem.sortOrder ?? 0}
                        onChange={(e) => setEditingItem({ ...editingItem, sortOrder: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-4">
                      <input
                        type="checkbox"
                        checked={editingItem.isActive !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                        className="rounded text-[#00B2A2]"
                      />
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        Active (Visible on website)
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* CATEGORY MODAL FIELDS */}
              {modalType === 'category' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.name || ''}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          setEditingItem({
                            ...editingItem,
                            name,
                            slug: editingItem.slug ? editingItem.slug : slug,
                          });
                        }}
                        placeholder="e.g. Mobile, iPad, Apple Watch, Tablet"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.slug || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                        placeholder="e.g. mobile, ipad, apple-watch, tablet"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={editingItem.tagline || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, tagline: e.target.value })}
                        placeholder="e.g. Flagship Smartphone OLED Specialists"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Icon Type
                      </label>
                      <select
                        value={editingItem.icon || 'Smartphone'}
                        onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700 font-bold"
                      >
                        <option value="Smartphone">Smartphone</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Watch">Watch</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Image Upload & Preview */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Category Image Upload & Preview
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Updates the 4 Categories section on the website (Upload new image, replace, or URL)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      {/* Upload controls */}
                      <div className="md:col-span-2 space-y-2.5">
                        {/* Direct File Upload */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#00B2A2] dark:hover:border-[#00B2A2] cursor-pointer transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Upload className="h-4 w-4 text-[#00B2A2]" />
                            <span>Choose Image File (PNG, JPG, WEBP, SVG)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const dataUrl = ev.target?.result as string;
                                  setEditingItem((prev: any) => ({ ...prev, imageUrl: dataUrl }));
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTarget('categoryImage');
                              setMediaPickerOpen(true);
                            }}
                            className="rounded-xl bg-[#00B2A2]/10 text-[#00B2A2] px-3.5 py-2.5 text-xs font-bold hover:bg-[#00B2A2] hover:text-white transition-colors cursor-pointer shrink-0"
                            title="Select from Media Manager"
                          >
                            🖼️ Media Manager
                          </button>
                        </div>

                        {/* Direct Image URL input */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">or Image URL:</span>
                          <input
                            type="text"
                            value={editingItem.imageUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                            placeholder="https://... or /images/category.webp"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:border-[#00B2A2] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Category Image Preview */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Category Image Preview
                        </label>
                        <div className="h-24 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
                          {editingItem.imageUrl ? (
                            <>
                              <img
                                src={editingItem.imageUrl}
                                alt="Category preview"
                                className="max-h-20 max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                                className="absolute top-1 right-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md p-1 text-[10px] transition-colors cursor-pointer"
                                title="Remove / Replace image"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No image selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Specialized display repair services..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingItem.sortOrder ?? 0}
                        onChange={(e) => setEditingItem({ ...editingItem, sortOrder: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <div className="pt-4 flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingItem.hasBrands !== false}
                          onChange={(e) => setEditingItem({ ...editingItem, hasBrands: e.target.checked })}
                          className="rounded text-[#00B2A2]"
                        />
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          Has Intermediate Brands Step
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingItem.isActive !== false}
                          onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                          className="rounded text-[#00B2A2]"
                        />
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          Active (Visible on website)
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="rounded-xl bg-[#00B2A2] px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#009b8d] transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingItem ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        suggestedCategory="devices"
        title="Select Image from Media Manager"
        showToast={showToast}
        onSelectImage={(url) => {
          if (mediaPickerTarget === 'categoryImage') {
            setEditingItem({ ...editingItem, imageUrl: url });
          } else if (mediaPickerTarget === 'brandLogo') {
            setEditingItem({ ...editingItem, logoUrl: url });
          } else if (mediaPickerTarget === 'modelImage') {
            setEditingItem({ ...editingItem, imageUrl: url });
          }
          setMediaPickerOpen(false);
        }}
      />
    </div>
  );
};
