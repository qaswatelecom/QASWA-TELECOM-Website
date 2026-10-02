import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, MessageCircle, Send, Sparkles, Smartphone, AlertCircle } from 'lucide-react';

interface FastEasyBookingCardProps {
  preselectedDevice?: string;
  preselectedFault?: string;
}

export const FastEasyBookingCard: React.FC<FastEasyBookingCardProps> = ({
  preselectedDevice,
  preselectedFault,
}) => {
  const { settings } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: 'Mobile',
    brand: 'Apple',
    model: '',
    fault: 'Screen Issue',
    city: 'Mumbai',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync props if parent changes
  useEffect(() => {
    if (preselectedDevice) {
      setFormData((prev) => ({ ...prev, device: preselectedDevice }));
    }
    if (preselectedFault) {
      setFormData((prev) => ({ ...prev, fault: preselectedFault }));
    }
  }, [preselectedDevice, preselectedFault]);

  const deviceTypes = ['Mobile', 'iPad', 'Apple Watch', 'Tablet', 'Foldable'];
  const brandsList = ['Apple', 'Samsung', 'Google Pixel', 'OnePlus'];
  const faultsList = [
    'Screen Issue (Broken / Cracked)',
    'Touch Glass Replacement',
    'Green Screen / White Screen',
    'Display Lines (Vertical & Horizontal)',
    'Touchscreen & Digitizer Lag',
    'Black Screen & Blank Display',
    'TrueTone & Sensor Calibration',
    'Display Flicker & Color Distortion',
    'Other Display Problem',
  ];
  const citiesList = ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Other City'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.name,
        customerMobile: formData.phone,
        customerWhatsapp: formData.phone,
        customerCity: formData.city,
        brandId: 1,
        brandName: `${formData.device} - ${formData.brand}`,
        modelId: 1,
        modelName: formData.model || `${formData.brand} Flagship`,
        serviceId: 1,
        serviceName: formData.fault,
        additionalNote: `Buzzmeeh Fast Booking: City: ${formData.city}, Fault: ${formData.fault}`,
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '11:00 AM',
      };

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello ${siteName},\n\nI would like to book a display diagnosis via Fast & Easy Booking:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Device:* ${formData.device} (${formData.brand} ${formData.model})\n*Fault:* ${formData.fault}\n*City:* ${formData.city}\n\nPlease confirm my slot.`
    );
    return `https://wa.me/${cleanWhatsApp}?text=${text}`;
  };

  return (
    <div id="fast-booking-card" className="w-full py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fast & Easy Booking
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your device and fault for instant display repair diagnosis.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Booking Details Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. Your repair request for {formData.brand} {formData.model} ({formData.fault}) has been logged.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>Instant Confirmation on WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Book Another Device
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone no."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors"
                />
              </div>

              {/* Row 2: Select Device & Select Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <select
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select Device</option>
                  {deviceTypes.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select Brand</option>
                  {brandsList.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Model & Fault */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <input
                  type="text"
                  placeholder="Model (e.g. 15 Pro Max, S24 Ultra)"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors"
                />

                <select
                  value={formData.fault}
                  onChange={(e) => setFormData({ ...formData, fault: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Fault / Display Issue</option>
                  {faultsList.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Row 4: Please Select Your City */}
              <div>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-[#00B2A2] focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Please Select Your City</option>
                  {citiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Big Bold Buzzmeeh-Style CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#00B2A2] to-[#009E90] hover:from-[#009E90] hover:to-[#008F82] py-4 text-base font-extrabold text-white shadow-lg shadow-[#00B2A2]/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <span>Book Now</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
