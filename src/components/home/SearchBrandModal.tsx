import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Search, X, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

interface SearchBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelName: string, brandName: string) => void;
}

export const SearchBrandModal: React.FC<SearchBrandModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
}) => {
  const [query, setQuery] = useState('');

  const quickModels = [
    { brand: 'Apple', model: 'iPhone 15 Pro Max', category: 'Mobile' },
    { brand: 'Apple', model: 'iPhone 15 Pro', category: 'Mobile' },
    { brand: 'Apple', model: 'iPhone 14 Pro Max', category: 'Mobile' },
    { brand: 'Apple', model: 'iPhone 13 Pro Max', category: 'Mobile' },
    { brand: 'Samsung', model: 'Galaxy S24 Ultra', category: 'Mobile' },
    { brand: 'Samsung', model: 'Galaxy S23 Ultra', category: 'Mobile' },
    { brand: 'Samsung', model: 'Galaxy Z Fold 5', category: 'Foldable' },
    { brand: 'Google', model: 'Pixel 8 Pro', category: 'Mobile' },
    { brand: 'OnePlus', model: 'OnePlus 12', category: 'Mobile' },
    { brand: 'Apple', model: 'Apple Watch Ultra 2', category: 'Apple Watch' },
    { brand: 'Apple', model: 'Apple Watch Series 9', category: 'Apple Watch' },
    { brand: 'Apple', model: 'iPad Pro 13" (M4 OLED)', category: 'iPad' },
    { brand: 'Apple', model: 'iPad Pro 12.9" (M2)', category: 'iPad' },
    { brand: 'Samsung', model: 'Galaxy Tab S9 Ultra', category: 'Tablet' },
  ];

  if (!isOpen) return null;

  const filtered = quickModels.filter(
    (item) =>
      item.model.toLowerCase().includes(query.toLowerCase()) ||
      item.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-xs p-4 pt-16 sm:pt-24 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-[#00B2A2]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand and model (e.g. iPhone 15, S24 Ultra)..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-11 pr-10 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors"
          />
          <button
            onClick={onClose}
            className="absolute right-3 h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {query ? 'Search Results' : 'Popular Flagship Models'}
          </span>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching model found. You can type your model directly in the Fast Booking form.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectModel(item.model, item.category);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-[#00B2A2]/30 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#00B2A2]/10 dark:bg-[#00B2A2]/20 flex items-center justify-center text-[#00B2A2]">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block group-hover:text-[#00B2A2] transition-colors">
                      {item.model}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.brand} · {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#00B2A2]">
                  <span>Diagnose</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
