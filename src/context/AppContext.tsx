import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DeviceCategory, Brand, Service, CustomerFormField, OrderStatus, SiteSettings } from '../types/index.ts';

interface AppContextType {
  settings: SiteSettings;
  categories: DeviceCategory[];
  brands: Brand[];
  services: Service[];
  formFields: CustomerFormField[];
  orderStatuses: OrderStatus[];
  loading: boolean;
  error: string | null;
  currentPath: string;
  navigate: (path: string) => void;
  refreshConfig: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    WHATSAPP_NUMBER: '9324316048',
    SITE_NAME: 'Qaswa Telecom',
    SITE_TAGLINE: 'Certified Mobile Phone Repair Center',
    SITE_PHONE: '+91 9324316048',
    SITE_EMAIL: 'telecomqaswa@gmail.com',
    SITE_ADDRESS:
      'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
    BUSINESS_HOURS: 'Everyday: 11:00 AM – 9:00 PM',
    GOOGLE_MAPS_URL: 'https://share.google/JdvLGimvQe18jUJNp',
  });
  const [categories, setCategories] = useState<DeviceCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formFields, setFormFields] = useState<CustomerFormField[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchBootstrap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/public/bootstrap');
      if (!res.ok) throw new Error('Failed to load site configuration');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      if (data.categories) setCategories(data.categories);
      if (data.brands) setBrands(data.brands);
      if (data.services) setServices(data.services);
      if (data.formFields) setFormFields(data.formFields);
      if (data.orderStatuses) setOrderStatuses(data.orderStatuses);
    } catch (err: any) {
      console.error('Bootstrap fetch error:', err);
      setError(err.message || 'Unable to connect to database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBootstrap();
  }, [fetchBootstrap]);

  return (
    <AppContext.Provider
      value={{
        settings,
        categories,
        brands,
        services,
        formFields,
        orderStatuses,
        loading,
        error,
        currentPath,
        navigate,
        refreshConfig: fetchBootstrap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
