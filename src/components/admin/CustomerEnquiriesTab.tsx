import React, { useState, useEffect, useMemo } from 'react';
import { CustomerEnquiry } from '../../types/index.ts';
import {
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Phone,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  X,
  Layers,
} from 'lucide-react';

export const CustomerEnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter options derived from data
  const deviceOptions = useMemo(() => {
    return Array.from(new Set(enquiries.map((e) => e.deviceCategory).filter(Boolean)));
  }, [enquiries]);

  const brandOptions = useMemo(() => {
    return Array.from(new Set(enquiries.map((e) => e.brand).filter(Boolean)));
  }, [enquiries]);

  const issueOptions = useMemo(() => {
    return Array.from(new Set(enquiries.map((e) => e.displayIssue).filter(Boolean)));
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      // Device filter
      if (selectedDevice !== 'all' && e.deviceCategory !== selectedDevice) return false;
      // Brand filter
      if (selectedBrand !== 'all' && e.brand !== selectedBrand) return false;
      // Issue filter
      if (selectedIssue !== 'all' && e.displayIssue !== selectedIssue) return false;
      // Status filter
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      // Date filter
      if (selectedDate !== 'all') {
        const itemDate = e.enquiryDate || (e.createdAt ? e.createdAt.split('T')[0] : '');
        if (!itemDate.toLowerCase().includes(selectedDate.toLowerCase())) return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = e.customerName?.toLowerCase().includes(q);
        const matchPhone = e.customerPhone?.toLowerCase().includes(q);
        const matchCity = e.customerCity?.toLowerCase().includes(q);
        const matchBrand = e.brand?.toLowerCase().includes(q);
        const matchModel = e.model?.toLowerCase().includes(q);
        const matchIssue = e.displayIssue?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCity && !matchBrand && !matchModel && !matchIssue) {
          return false;
        }
      }
      return true;
    });
  }, [enquiries, selectedDevice, selectedBrand, selectedIssue, selectedStatus, selectedDate, search]);

  // Statistics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'New').length;
    const inProgress = enquiries.filter((e) => e.status === 'In Progress').length;
    const contacted = enquiries.filter((e) => e.status === 'Contacted').length;
    const closed = enquiries.filter((e) => e.status === 'Closed').length;

    const todayStr = new Date().toLocaleDateString('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const todayCount = enquiries.filter((e) => e.enquiryDate === todayStr).length;

    return { total, newCount, inProgress, contacted, closed, todayCount };
  }, [enquiries]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'Contacted':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      case 'Closed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Time', 'Name', 'Phone', 'City', 'Device Category', 'Brand', 'Model', 'Display Issue(s)', 'Status', 'Timestamp'];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${e.enquiryDate || ''}"`,
      `"${e.enquiryTime || ''}"`,
      `"${e.customerName || ''}"`,
      `"${e.customerPhone || ''}"`,
      `"${e.customerCity || ''}"`,
      `"${e.deviceCategory}"`,
      `"${e.brand}"`,
      `"${e.model}"`,
      `"${e.displayIssue}"`,
      `"${e.status}"`,
      `"${e.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qaswa_customer_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-[#00B2A2]" />
            <span>Customer Enquiries & WhatsApp Tracking</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time display repair enquiries received via website issue selection and WhatsApp redirects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            title="Refresh Enquiries"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredEnquiries.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B2A2] hover:bg-[#009e90] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Enquiries
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 shadow-xs dark:border-rose-950 dark:bg-rose-950/20">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            New / Unopened
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {stats.newCount}
          </span>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs dark:border-amber-950 dark:bg-amber-950/20">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Contacted
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {stats.contacted}
          </span>
        </div>

        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-xs dark:border-blue-950 dark:bg-blue-950/20">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {stats.inProgress}
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Closed
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {stats.closed}
          </span>
        </div>

        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/50 p-4 shadow-xs dark:border-teal-950 dark:bg-teal-950/20">
          <span className="text-[11px] font-bold text-[#00B2A2] uppercase tracking-wider block">
            Today
          </span>
          <span className="text-2xl font-black text-[#00B2A2] mt-1 block">
            {stats.todayCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, phone, brand, model, issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Device Filter */}
          <div>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
            >
              <option value="all">All Devices</option>
              {deviceOptions.map((dev) => (
                <option key={dev} value={dev}>{dev}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
            >
              <option value="all">All Brands</option>
              {brandOptions.map((br) => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Display Issue Filter Subrow */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Display Issue:</span>
          </span>
          <button
            onClick={() => setSelectedIssue('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              selectedIssue === 'all'
                ? 'bg-[#00B2A2] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Issues
          </button>
          {issueOptions.map((issue) => (
            <button
              key={issue}
              onClick={() => setSelectedIssue(issue)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedIssue === issue
                  ? 'bg-[#00B2A2] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* Main Enquiries Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
                <th className="py-3.5 px-4 whitespace-nowrap">Date & Time</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Name</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Phone Number</th>
                <th className="py-3.5 px-4 whitespace-nowrap">City</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Device Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Brand</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Model</th>
                <th className="py-3.5 px-4 min-w-[200px]">Display Issue(s)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#00B2A2]" />
                    <span>Loading customer enquiries...</span>
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <span className="font-semibold block">No customer enquiries found</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Enquiries submitted through the website issue selector will appear here in real-time.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#00B2A2]" />
                        <span>{enquiry.enquiryDate || (enquiry.createdAt ? enquiry.createdAt.split('T')[0] : '—')}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{enquiry.enquiryTime || (enquiry.createdAt ? enquiry.createdAt.split('T')[1]?.substring(0, 5) : '—')}</span>
                      </div>
                    </td>

                    {/* 2. Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      {enquiry.customerName ? (
                        <span>{enquiry.customerName}</span>
                      ) : (
                        <span className="text-slate-400 italic font-normal">Not Provided</span>
                      )}
                    </td>

                    {/* 3. Phone Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {enquiry.customerPhone ? (
                        <a
                          href={`https://wa.me/${enquiry.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${enquiry.customerName || ''}, thank you for contacting QASWA TELECOM regarding your ${enquiry.brand} ${enquiry.model} display repair.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#00B2A2] hover:text-[#009e90] font-semibold hover:underline"
                          title="Message customer on WhatsApp"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{enquiry.customerPhone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* 4. City */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {enquiry.customerCity || '—'}
                      </span>
                    </td>

                    {/* 5. Device Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Smartphone className="h-3 w-3 text-[#00B2A2]" />
                        {enquiry.deviceCategory}
                      </span>
                    </td>

                    {/* 6. Brand */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      {enquiry.brand}
                    </td>

                    {/* 7. Model */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {enquiry.model}
                      </span>
                    </td>

                    {/* 8. Display Issue(s) */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {enquiry.displayIssue.split(',').map((iss, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-[#00B2A2]/10 text-[#00B2A2] dark:bg-[#00B2A2]/20 border border-[#00B2A2]/20"
                          >
                            <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                            <span>{iss.trim()}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 9. Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                        disabled={actionLoading === enquiry.id}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none ${getStatusBadge(
                          enquiry.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* 10. Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Direct WhatsApp Customer */}
                        {enquiry.customerPhone && (
                          <a
                            href={`https://wa.me/${enquiry.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${enquiry.customerName || ''}, thank you for contacting QASWA TELECOM regarding your ${enquiry.brand} ${enquiry.model} display repair.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Open WhatsApp Chat with Customer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#00B2A2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Complete Enquiry"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        {deleteConfirmId === enquiry.id ? (
                          <div className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg">
                            <button
                              onClick={() => handleDelete(enquiry.id)}
                              disabled={actionLoading === enquiry.id}
                              className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-slate-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(enquiry.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#00B2A2]/10 flex items-center justify-center text-[#00B2A2]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Enquiry #{selectedEnquiry.id} Details
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Recorded on {selectedEnquiry.enquiryDate} at {selectedEnquiry.enquiryTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Device & Issue Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Device Category</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">
                    {selectedEnquiry.deviceCategory}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Brand</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">
                    {selectedEnquiry.brand}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Model</span>
                  <span className="font-black text-slate-900 dark:text-white text-base mt-0.5 block">
                    {selectedEnquiry.model}
                  </span>
                </div>
              </div>

              {/* Display Issue Box */}
              <div className="p-4 rounded-xl border border-[#00B2A2]/30 bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10">
                <span className="text-[11px] font-bold text-[#00B2A2] uppercase tracking-wider block">
                  Reported Display Issues ({selectedEnquiry.displayIssue.split(',').length})
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedEnquiry.displayIssue.split(',').map((iss, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs shadow-xs border border-slate-200 dark:border-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#00B2A2]" />
                      <span>{iss.trim()}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Customer Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedEnquiry.customerName || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone Number:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedEnquiry.customerPhone || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">City:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedEnquiry.customerCity || '—'}
                    </span>
                  </div>
                </div>

                {selectedEnquiry.customerMessage && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 mt-2">
                    <span className="text-slate-400 block text-[11px]">Customer Note / Message:</span>
                    <p className="font-normal text-slate-800 dark:text-slate-200 mt-1 whitespace-pre-line">
                      {selectedEnquiry.customerMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update In Modal */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Enquiry Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value)}
                  className={`text-xs font-bold rounded-xl px-3 py-1.5 border transition-colors cursor-pointer focus:outline-none ${getStatusBadge(
                    selectedEnquiry.status
                  )}`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
              {selectedEnquiry.customerPhone ? (
                <a
                  href={`https://wa.me/${selectedEnquiry.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.customerName || ''}, thank you for contacting QASWA TELECOM regarding your ${selectedEnquiry.brand} ${selectedEnquiry.model} display issue (${selectedEnquiry.displayIssue}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open WhatsApp with Customer</span>
                </a>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
