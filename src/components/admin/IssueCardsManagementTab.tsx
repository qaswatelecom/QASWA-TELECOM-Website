import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Edit,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  Upload,
  FolderOpen,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { DisplayIssueItem } from '../../types/index.ts';
import {
  AVAILABLE_ISSUE_ICONS,
  DEFAULT_DISPLAY_ISSUES,
  ISSUE_COLOR_STYLES,
  getIssueIcon,
  getIssueStyles,
} from '../../lib/issueIcons.ts';
import { uploadImageToFirebaseStorage } from '../../lib/firebaseStorage.ts';
import { MediaPickerModal } from './MediaPickerModal.tsx';

interface IssueCardsManagementTabProps {
  showToast: (msg: string) => void;
  onRefreshAll?: () => void;
}

export const IssueCardsManagementTab: React.FC<IssueCardsManagementTabProps> = ({
  showToast,
  onRefreshAll,
}) => {
  const [issuesList, setIssuesList] = useState<DisplayIssueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<DisplayIssueItem | null>(null);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch current issue cards from API
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('qaswa_admin_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let res = await fetch('/api/admin/display-issues', { headers });
      if (!res.ok) {
        res = await fetch('/api/public/display-issues');
      }
      if (!res.ok) throw new Error('Failed to load display issues');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setIssuesList(data);
      } else {
        setIssuesList(DEFAULT_DISPLAY_ISSUES);
      }
    } catch (err: any) {
      console.error('Error fetching display issues:', err);
      setIssuesList(DEFAULT_DISPLAY_ISSUES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Save full issues list to backend
  const saveIssuesToBackend = async (newList: DisplayIssueItem[]) => {
    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('qaswa_admin_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/display-issues', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ issues: newList }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save display issues');
      }
      setIssuesList(newList);
      showToast('Display Issue Cards saved successfully');
      if (onRefreshAll) {
        onRefreshAll();
      }
      return true;
    } catch (err: any) {
      console.error('Error saving display issues:', err);
      showToast(err.message || 'Error saving display issues');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal for a specific card
  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...issuesList[index] });
    setIconSearchQuery('');
    setEditModalOpen(true);
  };

  // Save changes from modal
  const handleSaveModal = async () => {
    if (!editingItem || editingIndex === null) return;
    if (!editingItem.title.trim()) {
      showToast('Please enter an issue title/text');
      return;
    }

    const updatedList = [...issuesList];
    updatedList[editingIndex] = {
      ...editingItem,
      title: editingItem.title.trim(),
      icon: editingItem.icon || 'Layers',
      customIconUrl: editingItem.customIconUrl?.trim() || null,
    };

    const success = await saveIssuesToBackend(updatedList);
    if (success) {
      setEditModalOpen(false);
      setEditingItem(null);
      setEditingIndex(null);
    }
  };

  // Upload custom icon file for currently edited issue card
  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, SVG, JPG, WebP)');
      return;
    }

    try {
      setUploadingIcon(true);

      // 1. Read file immediately via FileReader (instant preview & zero hang)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      });

      let finalUrl = dataUrl;

      // 2. Try server endpoint upload for persistent file URL
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('qaswa_admin_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const uploadRes = await fetch('/api/admin/upload-icon', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            image: dataUrl,
            filename: file.name,
            category: 'issue-icons',
          }),
        });

        if (uploadRes.ok) {
          const resData = await uploadRes.json();
          if (resData && resData.url) {
            finalUrl = resData.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Server upload not reachable, using data URL fallback:', uploadErr);
      }

      setEditingItem((prev) => (prev ? { ...prev, customIconUrl: finalUrl } : null));
      showToast('Custom icon uploaded successfully');
    } catch (err: any) {
      console.error('Failed to upload custom icon:', err);
      showToast(err.message || 'Failed to upload icon');
    } finally {
      setUploadingIcon(false);
      if (e.target) e.target.value = '';
    }
  };

  // Remove custom icon and revert to default/built-in icon
  const handleRemoveCustomIcon = () => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, customIconUrl: null });
    showToast('Custom icon removed, reverted to built-in icon');
  };

  // Add new blank issue card
  const handleAddNewCard = () => {
    const newId = `issue-${Date.now()}`;
    const newItem: DisplayIssueItem = {
      id: newId,
      title: 'New Display Hardware Issue',
      icon: 'Layers',
      customIconUrl: null,
      badge: 'Certified cleanroom repair',
      color: 'teal',
    };
    const updated = [...issuesList, newItem];
    setIssuesList(updated);
    handleOpenEdit(updated.length - 1);
  };

  // Delete an issue card
  const handleDeleteCard = async (index: number) => {
    if (issuesList.length <= 1) {
      showToast('At least one issue card must remain');
      return;
    }
    const item = issuesList[index];
    if (window.confirm(`Are you sure you want to remove Issue Card "${item.title}"?`)) {
      const updated = issuesList.filter((_, i) => i !== index);
      await saveIssuesToBackend(updated);
    }
  };

  // Reset to default cards
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all Issue Cards to the default 8 display issues?')) {
      await saveIssuesToBackend(DEFAULT_DISPLAY_ISSUES);
    }
  };

  // Filtered available icons for picker
  const filteredIcons = AVAILABLE_ISSUE_ICONS.filter(
    (ico) =>
      ico.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      ico.label.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00B2A2] mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Customer Issues Page Management</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Display Issue Cards ({issuesList.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Edit the icon and issue title/text for each Issue Card. Changes saved here automatically update on the Customer/Frontend Issues Page and Device Model selection pages.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset to default 8 issues"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleAddNewCard}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00B2A2] hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Issue Card</span>
          </button>
        </div>
      </div>

      {/* Grid of Issue Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {issuesList.map((issue, idx) => {
            const IssueIcon = getIssueIcon(issue.icon);
            const styles = getIssueStyles(issue.color);

            return (
              <div
                key={issue.id || idx}
                className="group relative flex flex-col justify-between rounded-2xl p-5 border border-slate-200 bg-white hover:border-[#00B2A2]/60 dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Card Index & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-xl shrink-0 border transition-transform duration-200 group-hover:scale-105 ${styles.color}`}
                    >
                      {issue.customIconUrl ? (
                        <img
                          src={issue.customIconUrl}
                          alt={issue.title}
                          className="h-8 w-8 object-contain rounded-xs"
                        />
                      ) : (
                        <IssueIcon className="h-7 w-7" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {issue.customIconUrl && (
                        <span className="text-[9px] font-bold text-[#00B2A2] bg-[#00B2A2]/10 border border-[#00B2A2]/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Custom</span>
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteCard(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete issue card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Issue Title / Text */}
                  <span className="text-sm font-black text-slate-900 dark:text-white block group-hover:text-[#00B2A2] transition-colors leading-snug">
                    {issue.title}
                  </span>

                  {/* Icon label & Diagnostic Badge */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#00B2A2] font-semibold">
                      <span className="text-slate-400 font-normal">Icon:</span>
                      {issue.customIconUrl ? (
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Custom Upload
                        </span>
                      ) : (
                        <span className="font-mono bg-[#00B2A2]/10 px-1.5 py-0.5 rounded text-[10px]">
                          {issue.icon || 'Layers'}
                        </span>
                      )}
                    </div>
                    {issue.badge && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {issue.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Edit Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Frontend Issue Card
                  </span>
                  <button
                    onClick={() => handleOpenEdit(idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#00B2A2] bg-[#00B2A2]/10 hover:bg-[#00B2A2] hover:text-white transition-all cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Card</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT ISSUE CARD MODAL                                                    */}
      {/* ========================================================================= */}
      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B2A2] text-white">
                  <Edit className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Edit Issue Card #{editingIndex !== null ? editingIndex + 1 : ''}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Change the icon and issue title/text below
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* 1. Issue Title / Text Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Issue Title / Text <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Green Line / Vertical & Horizontal Display Lines"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00B2A2] transition-all"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  This text appears prominently on the customer-facing Issue Card.
                </p>
              </div>

              {/* 2. Current Selected Icon & Live Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Selected Icon
                </label>
                {(() => {
                  const CurrentIcon = getIssueIcon(editingItem.icon);
                  const styles = getIssueStyles(editingItem.color);
                  const isCustom = Boolean(editingItem.customIconUrl);

                  return (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl border bg-white dark:bg-slate-900 shrink-0 ${styles.color}`}
                      >
                        {isCustom ? (
                          <img
                            src={editingItem.customIconUrl!}
                            alt={editingItem.title}
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <CurrentIcon className="h-8 w-8" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span>{isCustom ? 'Custom Uploaded Icon' : editingItem.icon || 'Layers'}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCustom
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-[#00B2A2]/10 text-[#00B2A2]'
                            }`}
                          >
                            {isCustom ? 'Active Custom Icon' : 'Active Built-in Icon'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isCustom
                            ? 'Appears on customer-facing Issue Page and device selection'
                            : 'Upload a custom icon below or choose a built-in icon to replace'}
                        </p>
                      </div>

                      {isCustom && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingIcon}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#00B2A2] bg-white dark:bg-slate-800 border border-[#00B2A2]/30 hover:bg-[#00B2A2] hover:text-white transition-all cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveCustomIcon}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Remove custom icon and use built-in icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 3. Custom Icon Upload / Replace Section */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-850 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Upload className="h-4 w-4 text-[#00B2A2]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload Custom Icon
                    </span>
                  </div>
                  {editingItem.customIconUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomIcon}
                      className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Revert to Built-in</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Upload an SVG, PNG, WebP, or JPG icon. The custom icon will automatically display in place of the default icon on the website.
                </p>

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomIconUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingIcon}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#00B2A2] hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
                  >
                    {uploadingIcon ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Uploading Icon...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>{editingItem.customIconUrl ? 'Replace Icon File' : 'Upload Icon File'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    disabled={uploadingIcon}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-[#00B2A2]" />
                    <span>Choose from Media Manager</span>
                  </button>
                </div>

                {/* Optional Custom Icon Image URL input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Or paste icon URL directly:
                  </label>
                  <input
                    type="text"
                    value={editingItem.customIconUrl || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        customIconUrl: e.target.value.trim() ? e.target.value.trim() : null,
                      })
                    }
                    placeholder="https://... (or upload file above)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#00B2A2]"
                  />
                </div>
              </div>

              {/* 4. Icon Selection Grid (Built-in Library) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Or Choose from Built-in Icons ({filteredIcons.length})
                  </label>
                  {editingItem.customIconUrl && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      (Selecting will switch to built-in)
                    </span>
                  )}
                </div>

                {/* Search icon */}
                <div className="relative mb-2.5">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    placeholder="Search icons (e.g. line, touch, screen, laser)..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00B2A2]"
                  />
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                  {filteredIcons.map((ico) => {
                    const IconComp = ico.component;
                    const isSelected = !editingItem.customIconUrl && editingItem.icon === ico.name;

                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            ...editingItem,
                            icon: ico.name,
                            customIconUrl: null, // Selecting built-in icon switches from custom
                          })
                        }
                        className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-[#00B2A2] bg-[#00B2A2]/15 text-[#00B2A2] ring-2 ring-[#00B2A2]/30 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                            isSelected
                              ? 'bg-[#00B2A2] text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs truncate leading-tight font-semibold">
                            {ico.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 truncate leading-tight">
                            {ico.label.replace(/^[^(]+\(([^)]+)\)$/, '$1')}
                          </span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#00B2A2] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Diagnostic Badge Input (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Diagnostic Badge Text
                </label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="e.g. Laser Line Fault • Certified cleanroom repair"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00B2A2]"
                />
              </div>

              {/* 5. Color Scheme Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Card Accent Color
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.keys(ISSUE_COLOR_STYLES).map((colorKey) => {
                    const isSelected = (editingItem.color || 'teal') === colorKey;
                    const style = ISSUE_COLOR_STYLES[colorKey];
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, color: colorKey })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#00B2A2] ring-2 ring-[#00B2A2]/30 font-bold bg-white dark:bg-slate-800'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full border ${style.color}`} />
                        <span className="text-[10px] capitalize text-slate-600 dark:text-slate-300 truncate w-full">
                          {colorKey}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveModal}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00B2A2] hover:bg-[#009e90] transition-colors shadow-xs cursor-pointer"
              >
                {saving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          suggestedCategory="issue-icons"
          title="Select Custom Issue Icon"
          showToast={showToast}
          onSelectImage={(url) => {
            if (editingItem) {
              setEditingItem({ ...editingItem, customIconUrl: url });
              showToast('Custom icon selected from Media Library');
            }
            setMediaPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};
