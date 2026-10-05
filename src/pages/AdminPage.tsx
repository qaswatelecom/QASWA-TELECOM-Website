import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Smartphone,
  Layers,
  Wrench,
  MapPin,
  FileText,
  HelpCircle,
  Star,
  Globe,
  Sliders,
  CheckSquare,
  Settings,
  Image as ImageIcon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  MessageCircle,
  Eye,
  X,
  Save,
  Menu,
  Sun,
  Moon,
  Shield,
  AlertCircle,
  ArrowUpDown,
  Camera,
} from 'lucide-react';
import {
  Order,
  Customer,
  Brand,
  Model,
  Service,
  CustomerFormField,
  OrderStatus,
  CMSSection,
  ServiceCenter,
  Blog,
  FAQ,
  Testimonial,
  CustomPage,
  MediaItem,
} from '../types/index.ts';
import { SeoManagementTab } from '../components/admin/SeoManagementTab.tsx';
import { ContentManagementTab } from '../components/admin/ContentManagementTab.tsx';
import { MediaManagerTab } from '../components/admin/MediaManagerTab.tsx';
import { DeviceCatalogManagementTab } from '../components/admin/DeviceCatalogManagementTab.tsx';
import { GalleryManagementTab } from '../components/admin/GalleryManagementTab.tsx';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { settings, categories, brands, refreshConfig, navigate } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();

  // If not authenticated, immediately redirect to login
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State data for sub-views
  const [stats, setStats] = useState<any | null>(null);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [modelsList, setModelsList] = useState<Model[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [formFieldsList, setFormFieldsList] = useState<CustomerFormField[]>([]);
  const [statusesList, setStatusesList] = useState<OrderStatus[]>([]);
  const [sectionsList, setSectionsList] = useState<CMSSection[]>([]);
  const [centersList, setCentersList] = useState<ServiceCenter[]>([]);
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [faqsList, setFaqsList] = useState<FAQ[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [pagesList, setPagesList] = useState<CustomPage[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});

  // Loading states
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Selected Order for Modal Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Generic Edit Modal State
  const [genericModalOpen, setGenericModalOpen] = useState(false);
  const [genericModalType, setGenericModalType] = useState<string>('');
  const [genericModalData, setGenericModalData] = useState<any>({});

  // Fetch data on tab change
  useEffect(() => {
    if (!isAdmin) return;

    const loadTabData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === 'dashboard') {
          const res = await fetch('/api/admin/stats');
          if (res.ok) setStats(await res.json());
        } else if (activeTab === 'orders') {
          const res = await fetch(
            `/api/admin/orders?status=${orderStatusFilter}&search=${encodeURIComponent(orderSearch)}`
          );
          if (res.ok) setOrdersList(await res.json());
        } else if (activeTab === 'customers') {
          const res = await fetch('/api/admin/customers');
          if (res.ok) setCustomersList(await res.json());
        } else if (activeTab === 'brands') {
          const res = await fetch('/api/admin/brands');
          if (res.ok) setBrandsList(await res.json());
        } else if (activeTab === 'models') {
          const res = await fetch('/api/admin/models');
          if (res.ok) setModelsList(await res.json());
          const bRes = await fetch('/api/admin/brands');
          if (bRes.ok) setBrandsList(await bRes.json());
        } else if (activeTab === 'services') {
          const res = await fetch('/api/admin/services');
          if (res.ok) setServicesList(await res.json());
        } else if (activeTab === 'form_fields') {
          const res = await fetch('/api/admin/form-fields');
          if (res.ok) setFormFieldsList(await res.json());
        } else if (activeTab === 'statuses') {
          const res = await fetch('/api/admin/order-statuses');
          if (res.ok) setStatusesList(await res.json());
        } else if (activeTab === 'cms') {
          const res = await fetch('/api/admin/cms-sections');
          if (res.ok) setSectionsList(await res.json());
        } else if (activeTab === 'service_centers') {
          const res = await fetch('/api/admin/service-centers');
          if (res.ok) setCentersList(await res.json());
        } else if (activeTab === 'blogs') {
          const res = await fetch('/api/admin/blogs');
          if (res.ok) setBlogsList(await res.json());
        } else if (activeTab === 'faqs') {
          const res = await fetch('/api/admin/faqs');
          if (res.ok) setFaqsList(await res.json());
        } else if (activeTab === 'testimonials') {
          const res = await fetch('/api/admin/testimonials');
          if (res.ok) setTestimonialsList(await res.json());
        } else if (activeTab === 'pages') {
          const res = await fetch('/api/admin/custom-pages');
          if (res.ok) setPagesList(await res.json());
        } else if (activeTab === 'media') {
          const res = await fetch('/api/admin/media');
          if (res.ok) setMediaList(await res.json());
        } else if (activeTab === 'settings') {
          const res = await fetch('/api/admin/settings');
          if (res.ok) setSettingsMap(await res.json());
        }
      } catch (err) {
        console.error('Failed to load admin tab data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadTabData();
  }, [activeTab, isAdmin, orderStatusFilter, orderSearch]);

  // Auth gate if not authenticated
  if (!isAdmin) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00B2A2]/10 text-[#00B2A2] mb-4">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Authentication Required
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Please log in with the authorized administrator account (telecomqaswa@gmail.com) to access this dashboard.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full rounded-xl bg-[#00B2A2] py-3 text-xs font-bold text-white shadow-md hover:bg-[#009e90] transition-colors cursor-pointer"
            >
              Go to Administrator Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Order status & notes update
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
        }),
      });

      if (res.ok) {
        showToast('Order details updated successfully!');
        setOrderModalOpen(false);
        // Refresh orders list
        const updated = await fetch(`/api/admin/orders`);
        if (updated.ok) setOrdersList(await updated.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generic Delete Handler with confirmation
  const handleDeleteRecord = async (type: string, id: number, label?: string) => {
    const itemTitle = label ? `"${label}"` : 'this record';
    if (!window.confirm(`Are you sure you want to permanently delete ${itemTitle}? This action cannot be undone.`)) {
      return;
    }

    let endpoint = '';
    if (type === 'brand') endpoint = '/api/admin/brands';
    else if (type === 'model') endpoint = '/api/admin/models';
    else if (type === 'service') endpoint = '/api/admin/services';
    else if (type === 'form_field') endpoint = '/api/admin/form-fields';
    else if (type === 'status') endpoint = '/api/admin/order-statuses';
    else if (type === 'cms') endpoint = '/api/admin/cms-sections';
    else if (type === 'service_center') endpoint = '/api/admin/service-centers';
    else if (type === 'blog') endpoint = '/api/admin/blogs';
    else if (type === 'faq') endpoint = '/api/admin/faqs';
    else if (type === 'testimonial') endpoint = '/api/admin/testimonials';
    else if (type === 'custom_page') endpoint = '/api/admin/custom-pages';
    else if (type === 'media') endpoint = '/api/admin/media';

    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${label ? `"${label}"` : 'Item'} deleted successfully.`);
        if (type === 'brand') setBrandsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'model') setModelsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'service') setServicesList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'form_field') setFormFieldsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'status') setStatusesList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'cms') setSectionsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'service_center') setCentersList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'blog') setBlogsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'faq') setFaqsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'testimonial') setTestimonialsList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'custom_page') setPagesList((prev) => prev.filter((i) => i.id !== id));
        else if (type === 'media') setMediaList((prev) => prev.filter((i) => i.id !== id));
        refreshConfig();
      } else {
        showToast('Failed to delete item. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting item.');
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (ordersList.length === 0) return;
    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'Mobile',
      'WhatsApp',
      'Brand',
      'Model',
      'Service',
      'Preferred Date',
      'Preferred Time',
      'Status',
      'WhatsApp Clicked',
    ];
    const rows = ordersList.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString(),
      o.customerName,
      o.customerMobile,
      o.customerWhatsapp || '',
      o.brandName,
      o.modelName,
      o.serviceName,
      o.preferredDate || '',
      o.preferredTime || '',
      o.status,
      o.whatsappClicked ? 'Yes' : 'No',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qaswa_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sidebar navigation menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders / Enquiries', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'brands', label: 'Brands We Repair', icon: Smartphone },
    { id: 'device_catalog', label: 'Device Categories & Models', icon: Smartphone },
    { id: 'services', label: 'Display Services', icon: Wrench },
    { id: 'form_fields', label: 'Customer Form', icon: CheckSquare },
    { id: 'statuses', label: 'Order Statuses', icon: Sliders },
    { id: 'cms', label: 'Homepage CMS', icon: Globe },
    { id: 'service_centers', label: 'Service Centers', icon: MapPin },
    { id: 'blogs', label: 'Blog CMS', icon: FileText },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'gallery_management', label: 'Gallery Management', icon: Camera },
    { id: 'pages', label: 'Custom Pages', icon: FileText },
    { id: 'content_management', label: 'Content Management', icon: Edit },
    { id: 'seo_management', label: 'SEO Management', icon: Search },
    { id: 'media', label: 'Media Manager', icon: ImageIcon },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-xs font-semibold shadow-2xl dark:bg-white dark:text-slate-900 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-[#00B2A2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B2A2] text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight">Admin Console</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="h-[calc(100vh-8rem)] overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#00B2A2] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#00B2A2]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Customer Site</span>
            </button>

            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              title="Sign Out"
              className="text-slate-500 hover:text-rose-500 p-1 cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Modern Theme Switcher */}
            <button
              onClick={toggleTheme}
              type="button"
              role="switch"
              aria-checked={resolvedTheme === 'dark'}
              title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex h-9 items-center rounded-full border border-[#E5E7EB] bg-[#F7FAFA] p-1 text-xs font-medium text-[#111827] shadow-inner transition-colors duration-200 hover:border-[#00B2A2] dark:border-[#263331] dark:bg-[#16201F] dark:text-[#F9FAFB]"
            >
              <div className="flex items-center gap-1.5 px-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
                    resolvedTheme !== 'dark'
                      ? 'bg-amber-400 text-slate-900 shadow-sm'
                      : 'text-[#A7B0AE]'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold tracking-wide pr-1">
                  {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                </span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 ${
                    resolvedTheme === 'dark'
                      ? 'bg-[#00B2A2] text-white shadow-sm'
                      : 'text-[#6B7280]'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-semibold text-[#111827] hover:bg-[#F7FAFA] dark:border-[#263331] dark:text-[#F9FAFB] dark:hover:bg-[#16201F] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#00B2A2]" />
              <span>Customer Site</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8">
          {loadingData ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
              <p className="mt-3 text-xs text-slate-500">Retrieving database records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-8">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-slate-500 block">Total Orders</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                        {stats.totalOrders}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-emerald-600 block">Today's Orders</span>
                      <span className="text-2xl font-black text-emerald-600 mt-1 block">
                        {stats.todayOrders}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-[#00B2A2] block">New Enquiries</span>
                      <span className="text-2xl font-black text-[#00B2A2] mt-1 block">
                        {stats.newOrders}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-blue-500 block">Confirmed</span>
                      <span className="text-2xl font-black text-blue-500 mt-1 block">
                        {stats.confirmedOrders}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-teal-600 block">Completed</span>
                      <span className="text-2xl font-black text-teal-600 mt-1 block">
                        {stats.completedOrders}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <span className="text-[11px] text-purple-600 block">Customers</span>
                      <span className="text-2xl font-black text-purple-600 mt-1 block">
                        {stats.totalCustomers}
                      </span>
                    </div>
                  </div>

                  {/* Popular Charts & Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Top Requested Brands
                      </h3>
                      <div className="space-y-3">
                        {stats.popularBrands.map((b: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {b.name}
                            </span>
                            <span className="font-bold text-[#00B2A2]">{b.count} orders</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Top Requested Services
                      </h3>
                      <div className="space-y-3">
                        {stats.popularServices.map((s: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {s.name}
                            </span>
                            <span className="font-bold text-[#00B2A2]">{s.count} orders</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Top Smartphone Models
                      </h3>
                      <div className="space-y-3">
                        {stats.popularModels.map((m: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {m.name}
                            </span>
                            <span className="font-bold text-[#00B2A2]">{m.count} orders</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders table */}
                  <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Recent Walk-In Enquiries
                        </h3>
                        <p className="text-xs text-slate-500">Live submissions saved in PostgreSQL</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-[#00B2A2] hover:underline"
                      >
                        View All Orders
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Device</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Slot</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {stats.recentOrders.map((o: any) => (
                            <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="py-3 px-4 font-mono font-bold text-[#00B2A2]">
                                {o.orderNumber}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold block">{o.customerName}</span>
                                <span className="text-[11px] text-slate-400">{o.customerMobile}</span>
                              </td>
                              <td className="py-3 px-4">
                                {o.brandName} {o.modelName}
                              </td>
                              <td className="py-3 px-4 font-medium">{o.serviceName}</td>
                              <td className="py-3 px-4 text-slate-500">
                                {o.preferredDate} ({o.preferredTime || 'Any'})
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold bg-[#00B2A2]/10 text-[#00B2A2]">
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setEditNotes(o.internalNotes || '');
                                    setEditStatus(o.status);
                                    setOrderModalOpen(true);
                                  }}
                                  className="text-xs font-semibold text-[#00B2A2] hover:underline"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Search, Filter & Export */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search customer, phone, device or order ID..."
                          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Service">In Service</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                          <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Date & Time</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Device</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Appointment</th>
                            <th className="py-3 px-4">WhatsApp</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {ordersList.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="py-3 px-4 font-mono font-bold text-[#00B2A2]">
                                {o.orderNumber}
                              </td>
                              <td className="py-3 px-4 text-slate-500">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold block">{o.customerName}</span>
                                <span className="text-[11px] text-slate-400">{o.customerMobile}</span>
                              </td>
                              <td className="py-3 px-4">
                                {o.brandName} {o.modelName}
                              </td>
                              <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                                {o.serviceName}
                              </td>
                              <td className="py-3 px-4 text-slate-500">
                                {o.preferredDate || '—'} {o.preferredTime ? `(${o.preferredTime})` : ''}
                              </td>
                              <td className="py-3 px-4">
                                {o.whatsappClicked ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                    <MessageCircle className="h-3 w-3 fill-current" />
                                    <span>Redirected</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold bg-[#00B2A2]/10 text-[#00B2A2]">
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setEditNotes(o.internalNotes || '');
                                    setEditStatus(o.status);
                                    setOrderModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Details</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {ordersList.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-500">
                        No orders found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Registered Customers ({customersList.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">Customer ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Mobile</th>
                          <th className="py-3 px-4">WhatsApp</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">City</th>
                          <th className="py-3 px-4">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customersList.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="py-3 px-4 font-mono font-bold text-slate-500">
                              {c.customerId}
                            </td>
                            <td className="py-3 px-4 font-semibold">{c.name}</td>
                            <td className="py-3 px-4">{c.mobile}</td>
                            <td className="py-3 px-4">{c.whatsapp || '—'}</td>
                            <td className="py-3 px-4">{c.email || '—'}</td>
                            <td className="py-3 px-4">{c.city || '—'}</td>
                            <td className="py-3 px-4 text-slate-400">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: DEVICE CATEGORIES, BRANDS & MODELS */}
              {(activeTab === 'device_catalog' || activeTab === 'brands' || activeTab === 'models') && (
                <DeviceCatalogManagementTab
                  showToast={showToast}
                  onRefreshAll={refreshConfig}
                  initialSection="mobile"
                  initialSubTab={activeTab === 'models' ? 'models' : 'brands'}
                />
              )}

              {/* TAB 6: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Manage Repair Services</h3>
                    <button
                      onClick={() => {
                        setGenericModalType('service');
                        setGenericModalData({
                          name: '',
                          slug: '',
                          description: '',
                          priceEstimate: '',
                          estimatedDuration: '45 - 60 mins',
                          warrantyInfo: '',
                          isActive: true,
                          sortOrder: 0,
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Display Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servicesList.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-bold">{s.name}</span>
                            <span className="text-xs font-bold text-[#00B2A2]">Display Lab</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{s.description}</p>
                          <div className="text-[11px] text-slate-400 space-y-1">
                            <div>Duration: {s.estimatedDuration || '45 - 60 mins'}</div>
                            <div>Status: {s.isActive ? 'Active' : 'Disabled'}</div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleDeleteRecord('service', s.id, s.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setGenericModalType('service');
                              setGenericModalData(s);
                              setGenericModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Service</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CUSTOMER FORM FIELDS */}
              {activeTab === 'form_fields' && (
                <div className="space-y-4 max-w-4xl">
                  <div>
                    <h3 className="text-sm font-bold">Customer Details Form Configuration</h3>
                    <p className="text-xs text-slate-500">
                      Enable, disable, mark required/optional, or rename any customer input field without changing source code.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {formFieldsList.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {f.label}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              ({f.fieldKey})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Placeholder: "{f.placeholder || 'None'}"
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={f.isRequired}
                              onChange={async (e) => {
                                await fetch(`/api/admin/form-fields/${f.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ ...f, isRequired: e.target.checked }),
                                });
                                showToast(`Updated ${f.label} required status`);
                                refreshConfig();
                                const updated = await fetch('/api/admin/form-fields');
                                setFormFieldsList(await updated.json());
                              }}
                              className="rounded text-[#00B2A2]"
                            />
                            <span>Required</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={f.isEnabled}
                              onChange={async (e) => {
                                await fetch(`/api/admin/form-fields/${f.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ ...f, isEnabled: e.target.checked }),
                                });
                                showToast(`Updated ${f.label} visibility`);
                                refreshConfig();
                                const updated = await fetch('/api/admin/form-fields');
                                setFormFieldsList(await updated.json());
                              }}
                              className="rounded text-[#00B2A2]"
                            />
                            <span>Enabled</span>
                          </label>

                          <button
                            onClick={() => {
                              setGenericModalType('form_field');
                              setGenericModalData(f);
                              setGenericModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-[#00B2A2]"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: ORDER STATUSES */}
              {activeTab === 'statuses' && (
                <div className="space-y-4 max-w-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold">Manage Order Statuses</h3>
                      <p className="text-xs text-slate-500">Add, edit and color-code workflow stages.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGenericModalType('status');
                        setGenericModalData({ name: '', color: '#00B2A2', sortOrder: statusesList.length + 1, isActive: true });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-3.5 py-1.5 text-xs font-semibold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Status</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {statusesList.map((st) => (
                      <div
                        key={st.id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: st.color }}
                            className="h-4 w-4 rounded-full"
                          />
                          <span className="font-bold text-xs">{st.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setGenericModalType('status');
                              setGenericModalData(st);
                              setGenericModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-[#00B2A2]"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: HOMEPAGE CMS BUILDER */}
              {activeTab === 'cms' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold">Homepage Section Builder</h3>
                      <p className="text-xs text-slate-500">
                        Toggle visibility, reorder, or edit texts/images for any section on the homepage.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sectionsList.map((sec) => (
                      <div
                        key={sec.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold uppercase text-[#00B2A2]">
                              {sec.sectionType}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-bold text-sm">{sec.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {sec.description || 'Custom configured block'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sec.isVisible}
                              onChange={async (e) => {
                                await fetch(`/api/admin/cms-sections/${sec.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ ...sec, isVisible: e.target.checked }),
                                });
                                showToast(`Toggled visibility for ${sec.sectionType}`);
                                const updated = await fetch('/api/admin/cms-sections');
                                setSectionsList(await updated.json());
                              }}
                              className="rounded text-[#00B2A2]"
                            />
                            <span>Visible</span>
                          </label>

                          <button
                            onClick={() => {
                              setGenericModalType('cms');
                              setGenericModalData(sec);
                              setGenericModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Section</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: SETTINGS (CRITICAL FOR WHATSAPP NUMBER, SEO, SOCIAL & THEME) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Business, SEO & Integration Settings</h3>
                    <p className="text-xs text-slate-500">
                      Manage official business contact info, Google SEO meta descriptions, social media profiles, and appearance.
                    </p>
                  </div>

                  {/* Section 1: Business Contact & WhatsApp */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      <span>1. Core Business & WhatsApp Dispatch</span>
                    </h4>

                    {/* Official WhatsApp Number */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-emerald-600 fill-current" />
                        <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          Official Business WhatsApp Number (Destination for enquiries) *
                        </label>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mb-2">
                        When customers tap "Proceed with WhatsApp" or "Contact Us", they are directed here with device details.
                      </p>
                      <input
                        type="text"
                        value={settingsMap.WHATSAPP_NUMBER ?? '9324316048'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, WHATSAPP_NUMBER: e.target.value }))
                        }
                        placeholder="e.g. 9324316048"
                        className="w-full rounded-xl border border-emerald-300 bg-white p-2.5 text-xs text-slate-900 font-mono font-bold focus:border-emerald-500 focus:outline-none dark:bg-slate-900 dark:border-emerald-800 dark:text-white"
                      />
                    </div>

                    {/* Brand Logo URL */}
                    <div>
                      <label className="block text-xs font-semibold mb-1">Brand Logo Image URL (Header & Footer)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={settingsMap.SITE_LOGO ?? '/qaswa-logo.svg'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_LOGO: e.target.value }))
                          }
                          placeholder="/qaswa-logo.svg or https://..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <img
                          src={settingsMap.SITE_LOGO || '/qaswa-logo.svg'}
                          alt="Logo Preview"
                          className="h-10 w-auto max-w-[100px] object-contain rounded-lg border border-slate-200 p-1 dark:border-slate-700 bg-white"
                        />
                      </div>
                    </div>

                    {/* Site Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Site / Brand Name</label>
                        <input
                          type="text"
                          value={settingsMap.SITE_NAME ?? 'QASWA TELECOM'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_NAME: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Tagline</label>
                        <input
                          type="text"
                          value={settingsMap.SITE_TAGLINE ?? 'Display Repair Specialists for Flagship Devices'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_TAGLINE: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Helpline Phone</label>
                        <input
                          type="text"
                          value={settingsMap.SITE_PHONE ?? '+91 9324316048'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_PHONE: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Support Email</label>
                        <input
                          type="email"
                          value={settingsMap.SITE_EMAIL ?? 'telecomqaswa@gmail.com'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_EMAIL: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Address & Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Central Store Address</label>
                        <input
                          type="text"
                          value={
                            settingsMap.SITE_ADDRESS ??
                            'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092'
                          }
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SITE_ADDRESS: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Business Operating Hours</label>
                        <input
                          type="text"
                          value={settingsMap.BUSINESS_HOURS ?? 'Everyday: 11:00 AM – 9:00 PM'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, BUSINESS_HOURS: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Google Maps Embed URL */}
                    <div>
                      <label className="block text-xs font-semibold mb-1">Google Maps Embed / Link URL</label>
                      <input
                        type="text"
                        value={settingsMap.GOOGLE_MAPS_URL ?? 'https://share.google/JdvLGimvQe18jUJNp'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, GOOGLE_MAPS_URL: e.target.value }))
                        }
                        placeholder="https://share.google/..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Section 2: Social Media Profiles */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="h-4 w-4" />
                      <span>2. Social Media & Channel Links</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={settingsMap.SOCIAL_INSTAGRAM ?? 'https://instagram.com/qaswatelecom'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SOCIAL_INSTAGRAM: e.target.value }))
                          }
                          placeholder="https://instagram.com/..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Facebook URL</label>
                        <input
                          type="text"
                          value={settingsMap.SOCIAL_FACEBOOK ?? 'https://facebook.com/qaswatelecom'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SOCIAL_FACEBOOK: e.target.value }))
                          }
                          placeholder="https://facebook.com/..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">YouTube Channel URL</label>
                        <input
                          type="text"
                          value={settingsMap.SOCIAL_YOUTUBE ?? 'https://youtube.com/@qaswatelecom'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SOCIAL_YOUTUBE: e.target.value }))
                          }
                          placeholder="https://youtube.com/..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={settingsMap.SOCIAL_LINKEDIN ?? 'https://linkedin.com/company/qaswa-telecom'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, SOCIAL_LINKEDIN: e.target.value }))
                          }
                          placeholder="https://linkedin.com/..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2.5: Page Content Management */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>Core Pages Content Management</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => setActiveTab('content_management')}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#00B2A2]/10 px-3 py-1.5 text-xs font-bold text-[#00B2A2] hover:bg-[#00B2A2]/20 transition cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Open Content Management Tab →</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[#00B2A2]/20 bg-[#00B2A2]/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Directly Edit HomePage, About Us & Contact Us Content
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Edit headings, hero text, slideshow images, device categories, technician details, and lab showcases live without hardcoded data.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('content_management')}
                        className="rounded-lg bg-[#00B2A2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#009e90] flex-shrink-0 cursor-pointer"
                      >
                        Manage Content
                      </button>
                    </div>
                  </div>

                  {/* Section 3: Search Engine Optimization (SEO) */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider flex items-center gap-1.5">
                        <Search className="h-4 w-4" />
                        <span>3. Search Engine Optimization (SEO) & Meta Settings</span>
                      </h4>

                      <button
                        type="button"
                        onClick={() => setActiveTab('seo_management')}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#00B2A2]/10 px-3 py-1.5 text-xs font-bold text-[#00B2A2] hover:bg-[#00B2A2]/20 transition"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Open Per-Page SEO & Schema Manager →</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[#00B2A2]/20 bg-[#00B2A2]/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Per-Page SEO & Schema.org Rich Snippets
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Edit titles, meta descriptions, keywords, social sharing cards, and JSON-LD structured data for every page individually.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('seo_management')}
                        className="rounded-lg bg-[#00B2A2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#009e90] flex-shrink-0"
                      >
                        Manage All Pages
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Default Global Page Title</label>
                      <input
                        type="text"
                        value={settingsMap.SEO_TITLE ?? 'QASWA TELECOM | Flagship Display Repair Specialists'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, SEO_TITLE: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Global Meta Description (for Google Search Results)</label>
                      <textarea
                        rows={3}
                        value={settingsMap.SEO_DESCRIPTION ?? 'QASWA TELECOM specializes exclusively in display repairs for high-end flagship devices: iPhone, Samsung Galaxy S & Z, Pixel, OnePlus, Apple Watch, and iPad. Laser bonding and touch glass replacement.'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, SEO_DESCRIPTION: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Focus Meta Keywords (comma separated)</label>
                      <input
                        type="text"
                        value={settingsMap.SEO_KEYWORDS ?? 'display repair, screen replacement, touch glass replacement, green screen fix, AMOLED repair, Apple Watch screen repair, iPad display'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, SEO_KEYWORDS: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">OpenGraph Social Share Image URL</label>
                      <input
                        type="text"
                        value={settingsMap.OG_IMAGE ?? '/qaswa-logo.svg'}
                        onChange={(e) =>
                          setSettingsMap((prev) => ({ ...prev, OG_IMAGE: e.target.value }))
                        }
                        placeholder="/qaswa-logo.svg or https://..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Section 4: Theme & Appearance */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider flex items-center gap-1.5">
                      <Sun className="h-4 w-4" />
                      <span>4. Theme & Appearance Controls</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Default Theme Mode</label>
                        <select
                          value={settingsMap.DEFAULT_THEME ?? 'system'}
                          onChange={(e) =>
                            setSettingsMap((prev) => ({ ...prev, DEFAULT_THEME: e.target.value }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option value="system">System Preference (Auto)</option>
                          <option value="light">Always Light Mode</option>
                          <option value="dark">Always Dark Mode</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Brand Accent Color</label>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-xl bg-[#00B2A2] border border-slate-200 dark:border-slate-700 shrink-0" />
                          <input
                            type="text"
                            disabled
                            value="#00b2a2 (Official Brand Turquoise Teal)"
                            className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Live Appearance Preview:</span>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {resolvedTheme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-[#00B2A2]" />}
                        <span>Toggle Preview ({resolvedTheme === 'dark' ? 'Dark' : 'Light'})</span>
                      </button>
                    </div>
                  </div>

                  {/* Save Button Bar */}
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Changes will take effect instantly across all client pages.
                    </span>

                    <button
                      onClick={async () => {
                        const res = await fetch('/api/admin/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(settingsMap),
                        });
                        if (res.ok) {
                          showToast('All settings and SEO configurations saved successfully!');
                          refreshConfig();
                        } else {
                          showToast('Failed to save settings.');
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#009e90] cursor-pointer transition-all"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save All Site Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 11: SERVICE CENTERS */}
              {activeTab === 'service_centers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Manage Walk-In Service Centers</h3>
                    <button
                      onClick={() => {
                        setGenericModalType('service_center');
                        setGenericModalData({
                          name: '',
                          city: '',
                          address: '',
                          phone: '',
                          whatsapp: '',
                          timing: 'Mon-Sat: 9:30 AM - 8:30 PM',
                          isActive: true,
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Center</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {centersList.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-[#00B2A2] uppercase block mb-1">
                            {c.city}
                          </span>
                          <h4 className="text-base font-bold mb-2">{c.name}</h4>
                          <p className="text-xs text-slate-500 mb-2">{c.address}</p>
                          <div className="text-xs text-slate-400 space-y-1">
                            <div>Phone: {c.phone}</div>
                            <div>Timing: {c.timing}</div>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                          <button
                            onClick={() => {
                              setGenericModalType('service_center');
                              setGenericModalData(c);
                              setGenericModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Center</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 12: BLOG CMS */}
              {activeTab === 'blogs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Manage Blog Articles</h3>
                    <button
                      onClick={() => {
                        setGenericModalType('blog');
                        setGenericModalData({
                          title: '',
                          slug: '',
                          content: '',
                          excerpt: '',
                          category: 'Repair Guides',
                          status: 'published',
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Article</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {blogsList.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#00B2A2] block mb-1">
                            {b.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {b.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">/{b.slug}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setGenericModalType('blog');
                              setGenericModalData(b);
                              setGenericModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline p-1"
                            title="Edit Article"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRecord('blog', b.id, b.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 13: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Manage FAQs</h3>
                    <button
                      onClick={() => {
                        setGenericModalType('faq');
                        setGenericModalData({
                          question: '',
                          answer: '',
                          category: 'General Questions',
                          pageTarget: 'home',
                          sortOrder: 0,
                          isActive: true,
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {faqsList.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-start justify-between gap-4"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-[#00B2A2] uppercase block mb-1">
                            {f.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {f.question}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.answer}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setGenericModalType('faq');
                              setGenericModalData(f);
                              setGenericModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#00B2A2]"
                            title="Edit FAQ"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord('faq', f.id, f.question)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete FAQ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 14: REVIEWS / TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">Manage Customer Testimonials</h3>
                    <button
                      onClick={() => {
                        setGenericModalType('testimonial');
                        setGenericModalData({
                          customerName: '',
                          rating: 5,
                          review: '',
                          deviceRepaired: '',
                          isFeatured: true,
                          isPublished: true,
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Review</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testimonialsList.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold">{t.customerName}</span>
                            <span className="text-[11px] text-amber-500">★ {t.rating}/5</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                            "{t.review}"
                          </p>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Device: {t.deviceRepaired || 'Smartphone'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setGenericModalType('testimonial');
                              setGenericModalData(t);
                              setGenericModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#00B2A2]"
                            title="Edit Review"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord('testimonial', t.id, t.customerName)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 14.5: GALLERY MANAGEMENT */}
              {activeTab === 'gallery_management' && (
                <GalleryManagementTab
                  categories={categories}
                  brands={brands}
                  onShowToast={showToast}
                />
              )}

              {/* TAB 15: CUSTOM PAGES */}
              {activeTab === 'pages' && (
                <div className="space-y-4 max-w-4xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold">Manage Website Pages (About Us, Terms, Contact, Custom)</h3>
                      <p className="text-xs text-slate-500">Edit titles, body copy, and metadata without modifying code.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGenericModalType('custom_page');
                        setGenericModalData({
                          title: '',
                          slug: '',
                          content: '',
                          isPublished: true,
                        });
                        setGenericModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Page</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {pagesList.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">/{p.slug}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setGenericModalType('custom_page');
                              setGenericModalData(p);
                              setGenericModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00B2A2] hover:underline p-1"
                            title="Edit Page"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Content</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRecord('custom_page', p.id, p.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Page"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 15.5: SEO MANAGEMENT */}
              {activeTab === 'seo_management' && (
                <SeoManagementTab
                  showToast={showToast}
                  siteName={settings.SITE_NAME || 'QASWA TELECOM'}
                  refreshConfig={refreshConfig}
                  navigate={navigate}
                />
              )}

              {/* TAB 15.6: PAGE CONTENT MANAGEMENT */}
              {activeTab === 'content_management' && (
                <ContentManagementTab
                  showToast={showToast}
                  siteName={settings.SITE_NAME || 'QASWA TELECOM'}
                  refreshConfig={refreshConfig}
                  navigate={navigate}
                  onNavigateToMedia={() => setActiveTab('media')}
                />
              )}

              {/* TAB 16: MEDIA MANAGER */}
              {activeTab === 'media' && (
                <MediaManagerTab
                  showToast={showToast}
                  navigate={navigate}
                  onNavigateToContentManagement={() => setActiveTab('content_management')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* ORDER DETAIL & STATUS UPDATE MODAL */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block">
                  Enquiry Details
                </span>
                <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                  Customer Information
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Name:</span> {selectedOrder.customerName}
                  </div>
                  <div>
                    <span className="text-slate-400">Mobile:</span> {selectedOrder.customerMobile}
                  </div>
                  <div>
                    <span className="text-slate-400">WhatsApp:</span>{' '}
                    {selectedOrder.customerWhatsapp || '—'}
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>{' '}
                    {selectedOrder.customerEmail || '—'}
                  </div>
                  <div>
                    <span className="text-slate-400">City:</span>{' '}
                    {selectedOrder.customerCity || '—'}
                  </div>
                  <div>
                    <span className="text-slate-400">Address:</span>{' '}
                    {selectedOrder.customerAddress || '—'}
                  </div>
                </div>
              </div>

              {/* Device Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                  Repair Device & Service
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Brand:</span> {selectedOrder.brandName}
                  </div>
                  <div>
                    <span className="text-slate-400">Model:</span> {selectedOrder.modelName}
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Requested Service:</span>{' '}
                    <span className="font-bold text-[#00B2A2]">{selectedOrder.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Preferred Date:</span>{' '}
                    {selectedOrder.preferredDate || '—'}
                  </div>
                  <div>
                    <span className="text-slate-400">Preferred Time:</span>{' '}
                    {selectedOrder.preferredTime || '—'}
                  </div>
                </div>
                {selectedOrder.additionalNote && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Customer Note:</span>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{selectedOrder.additionalNote}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status and Notes Change */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">Update Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Service">In Service</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Internal Admin Notes</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add private technician notes, parts stock status, etc..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleUpdateOrder}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B2A2] px-6 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERIC CRUD EDIT MODAL */}
      {genericModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold capitalize">
                {genericModalData?.id ? 'Edit' : 'Create'} {genericModalType.replace('_', ' ')}
              </h3>
              <button
                onClick={() => setGenericModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                let endpoint = '';
                if (genericModalType === 'brand') endpoint = '/api/admin/brands';
                else if (genericModalType === 'model') endpoint = '/api/admin/models';
                else if (genericModalType === 'service') endpoint = '/api/admin/services';
                else if (genericModalType === 'form_field') endpoint = '/api/admin/form-fields';
                else if (genericModalType === 'status') endpoint = '/api/admin/order-statuses';
                else if (genericModalType === 'cms') endpoint = '/api/admin/cms-sections';
                else if (genericModalType === 'service_center') endpoint = '/api/admin/service-centers';
                else if (genericModalType === 'blog') endpoint = '/api/admin/blogs';
                else if (genericModalType === 'faq') endpoint = '/api/admin/faqs';
                else if (genericModalType === 'testimonial') endpoint = '/api/admin/testimonials';
                else if (genericModalType === 'custom_page') endpoint = '/api/admin/custom-pages';
                else if (genericModalType === 'media') endpoint = '/api/admin/media';

                const url = genericModalData.id ? `${endpoint}/${genericModalData.id}` : endpoint;
                const method = genericModalData.id ? 'PUT' : 'POST';

                try {
                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(genericModalData),
                  });

                  if (res.ok) {
                    showToast('Saved successfully!');
                    setGenericModalOpen(false);
                    refreshConfig();
                    // trigger tab reload
                    setActiveTab((curr) => curr);
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="space-y-3 text-xs"
            >
              {/* Dynamic Inputs based on type */}
              {Object.keys(genericModalData).map((k) => {
                if (k === 'id' || k === 'createdAt' || k === 'updatedAt') return null;

                const isCheckbox = typeof genericModalData[k] === 'boolean';
                const isLong = k === 'content' || k === 'description' || k === 'answer' || k === 'review';

                if (isCheckbox) {
                  return (
                    <label key={k} className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={genericModalData[k]}
                        onChange={(e) =>
                          setGenericModalData({ ...genericModalData, [k]: e.target.checked })
                        }
                        className="rounded text-[#00B2A2]"
                      />
                      <span className="font-semibold capitalize">{k}</span>
                    </label>
                  );
                }

                return (
                  <div key={k}>
                    <label className="block text-xs font-semibold mb-1 capitalize">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {isLong ? (
                      <textarea
                        rows={3}
                        value={genericModalData[k] || ''}
                        onChange={(e) =>
                          setGenericModalData({ ...genericModalData, [k]: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    ) : (
                      <input
                        type="text"
                        value={genericModalData[k] ?? ''}
                        onChange={(e) =>
                          setGenericModalData({ ...genericModalData, [k]: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                      />
                    )}
                  </div>
                );
              })}

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGenericModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00B2A2] px-6 py-2 text-xs font-semibold text-white hover:bg-[#009e90]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
