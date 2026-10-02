import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Smartphone, AlertCircle, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const TrackOrderPage: React.FC = () => {
  const { orderStatuses } = useApp();
  const [orderNumber, setOrderNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !mobile.trim()) {
      setError('Please enter both Order ID and Mobile Number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrderData(null);

      const res = await fetch(
        `/api/track-order?orderNumber=${encodeURIComponent(
          orderNumber.trim()
        )}&mobile=${encodeURIComponent(mobile.trim())}`
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to locate order.');
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please double check details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusName: string) => {
    const match = orderStatuses.find((s) => s.name.toLowerCase() === statusName.toLowerCase());
    return match?.color || '#00B2A2';
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00B2A2] block mb-1">
            Status Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Track Repair Enquiry Status
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter your unique Order ID (received upon submission) and mobile number to see real-time updates.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Order ID / Enquiry Number *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="e.g. RNX-20260929-000001"
                className="w-full font-mono uppercase rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#009e90] active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span>Searching Records...</span>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Check Enquiry Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {orderData && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Order ID</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {orderData.orderNumber}
                </span>
              </div>

              <div>
                <span
                  style={{
                    backgroundColor: `${getStatusColor(orderData.status)}20`,
                    color: getStatusColor(orderData.status),
                    borderColor: `${getStatusColor(orderData.status)}40`,
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border"
                >
                  {orderData.status}
                </span>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {orderData.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Device:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {orderData.brandName} {orderData.modelName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-[#00B2A2]">
                  {orderData.serviceName}
                </span>
              </div>
              {orderData.preferredDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Appointment:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {orderData.preferredDate} ({orderData.preferredTime || 'Any slot'})
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Please present your Order ID at our walk-in service desk upon arrival.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
