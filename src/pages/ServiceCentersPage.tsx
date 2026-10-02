import React, { useEffect, useState } from 'react';
import { ServiceCenter } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { MapPin, Phone, Clock, MessageCircle, Wrench, Search } from 'lucide-react';

export const ServiceCentersPage: React.FC = () => {
  const { navigate, settings } = useApp();
  const [centers, setCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch('/api/service-centers');
        if (res.ok) setCenters(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const cities = ['all', ...Array.from(new Set(centers.map((c) => c.city)))];

  const filtered = selectedCity === 'all'
    ? centers
    : centers.filter((c) => c.city.toLowerCase() === selectedCity.toLowerCase());

  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00B2A2] block mb-1">
            Walk-In Store Directory
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Our Walk-In Service Centers
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Visit any of our convenient service centers. Relax in our air-conditioned lounge while your device is repaired by master technicians.
          </p>
        </div>

        {/* City Filter Tabs (Segmented control) */}
        {cities.length > 2 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors capitalize ${
                    selectedCity === city
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {city === 'all' ? 'All Centers' : city}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#00B2A2] border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading service centers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <span className="text-xs font-bold text-[#00B2A2] uppercase tracking-wider block mb-1">
                    {c.city}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {c.name}
                  </h3>

                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                      <span>{c.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                    {c.timing && (
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>{c.timing}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {c.mapUrl && (
                      <a
                        href={c.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        Directions
                      </a>
                    )}
                    <button
                      onClick={() => navigate('/mobile-repair')}
                      className="flex-1 text-center rounded-xl bg-[#00B2A2] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#009e90] transition-colors"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
