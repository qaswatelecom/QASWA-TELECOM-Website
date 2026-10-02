import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Brand, Model, Service, CustomerFormField } from '../../types/index.ts';
import {
  Smartphone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  MessageCircle,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BookingWizardProps {
  initialBrandSlug?: string;
  initialModelSlug?: string;
  initialServiceSlug?: string;
  onSuccess?: (order: any) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialBrandSlug,
  initialModelSlug,
  initialServiceSlug,
  onSuccess,
}) => {
  const { brands, services: allServices, formFields, settings } = useApp();

  // Wizard Step: 1 = Brand, 2 = Model, 3 = Service, 4 = Details, 5 = Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Dynamic models & services for chosen selection
  const [brandModels, setBrandModels] = useState<Model[]>([]);
  const [modelAvailableServices, setModelAvailableServices] = useState<Service[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  // Search filters
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  // Customer Form Data
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    city: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    additionalNote: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Default date to today / tomorrow
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      preferredDate: prev.preferredDate || today,
      preferredTime: prev.preferredTime || '11:00 AM',
    }));
  }, []);

  // Handle initial pre-selections if provided in URL or props
  useEffect(() => {
    if (initialBrandSlug && brands.length > 0) {
      const match = brands.find((b) => b.slug === initialBrandSlug);
      if (match) {
        setSelectedBrand(match);
        setCurrentStep(2);
      }
    }
  }, [initialBrandSlug, brands]);

  // Load models when brand is selected
  useEffect(() => {
    if (!selectedBrand) {
      setBrandModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const res = await fetch(`/api/models?brandId=${selectedBrand.id}`);
        if (!res.ok) throw new Error('Failed to load models');
        const data = await res.json();
        setBrandModels(data);

        if (initialModelSlug) {
          const matchModel = data.find((m: Model) => m.slug === initialModelSlug);
          if (matchModel) {
            setSelectedModel(matchModel);
            setCurrentStep(3);
          }
        }
      } catch (err) {
        console.error('Error loading models:', err);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedBrand, initialModelSlug]);

  // Load available services when model is selected
  useEffect(() => {
    if (!selectedModel) {
      setModelAvailableServices(allServices);
      return;
    }

    const fetchModelServices = async () => {
      try {
        setLoadingServices(true);
        const res = await fetch(`/api/models/${selectedModel.slug}`);
        if (!res.ok) throw new Error('Failed to load services for model');
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          setModelAvailableServices(data.services);
        } else {
          setModelAvailableServices(allServices);
        }

        if (initialServiceSlug) {
          const matchServ = (data.services || allServices).find(
            (s: Service) => s.slug === initialServiceSlug
          );
          if (matchServ) {
            setSelectedService(matchServ);
            setCurrentStep(4);
          }
        }
      } catch (err) {
        console.error('Error loading model services:', err);
        setModelAvailableServices(allServices);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchModelServices();
  }, [selectedModel, allServices, initialServiceSlug]);

  // Filtered lists
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = brandModels.filter((m) =>
    m.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  // Field change handler
  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Validate Step 4 (Customer Details)
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const activeFields = formFields.length > 0 ? formFields : [];

    // Check all enabled and required fields
    activeFields.forEach((field) => {
      if (field.isEnabled && field.isRequired) {
        const val = formData[field.fieldKey];
        if (!val || val.trim() === '') {
          errors[field.fieldKey] = `${field.label} is required`;
        }
      }
    });

    // Check basic phone validation
    if (formData.mobileNumber && formData.mobileNumber.replace(/\D/g, '').length < 7) {
      errors.mobileNumber = 'Please enter a valid mobile number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proceed to Step 5
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(5);
    }
  };

  // The Critical Submit Action:
  // 1. Save in PostgreSQL FIRST
  // 2. Generate WhatsApp redirect URL
  // 3. Open WhatsApp
  const handleProceedWithWhatsApp = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        brandId: selectedBrand?.id,
        brandName: selectedBrand?.name,
        modelId: selectedModel?.id,
        modelName: selectedModel?.name,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        ...formData,
      };

      const res = await fetch('/api/orders/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Database save failed. Please try again.');
      }

      // Success! Order is saved in PostgreSQL!
      setCompletedOrder(data);
      if (onSuccess) onSuccess(data);

      // Give customer 1.2s to see confirmation ticket and order number, then redirect to WhatsApp
      setTimeout(() => {
        if (data.whatsappUrl) {
          window.location.href = data.whatsappUrl;
        }
      }, 1200);
    } catch (err: any) {
      console.error('Order save error:', err);
      // DO NOT redirect to WhatsApp if DB save fails
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already successfully submitted, show success state with direct WhatsApp button
  if (completedOrder) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-lg dark:border-emerald-900/40 dark:bg-slate-900 text-center max-w-2xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Enquiry Successfully Saved in PostgreSQL
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Redirecting to WhatsApp...
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Your repair ticket has been permanently registered in our system. WhatsApp will open with your pre-filled details.
        </p>

        <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Order / Enquiry ID</span>
            <span className="text-sm font-mono font-bold text-[#00B2A2]">
              {completedOrder.orderNumber}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div>
              <span className="text-slate-400 block">Customer</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {completedOrder.order?.customerName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Device</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {completedOrder.order?.brandName} {completedOrder.order?.modelName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Service</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {completedOrder.order?.serviceName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Appointment</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {completedOrder.order?.preferredDate} ({completedOrder.order?.preferredTime})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={completedOrder.whatsappUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Open WhatsApp Now</span>
          </a>

          <button
            onClick={() => {
              setCompletedOrder(null);
              setCurrentStep(1);
              setSelectedBrand(null);
              setSelectedModel(null);
              setSelectedService(null);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Book Another Device</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-xl shadow-slate-100/50 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none transition-colors">
      {/* Progress Steps Header */}
      <div className="mb-8 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          {[
            { num: 1, label: '1. Brand' },
            { num: 2, label: '2. Model' },
            { num: 3, label: '3. Service' },
            { num: 4, label: '4. Details' },
            { num: 5, label: '5. Review' },
          ].map((s) => {
            const isPassed = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                disabled={!isPassed && !isCurrent}
                onClick={() => isPassed && setCurrentStep(s.num)}
                className={`flex items-center gap-1.5 transition-colors ${
                  isCurrent
                    ? 'text-[#00B2A2] font-semibold'
                    : isPassed
                    ? 'text-slate-800 dark:text-slate-200 hover:text-[#00B2A2]'
                    : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? 'bg-[#00B2A2] text-white shadow-sm'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.label.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Breadcrumb trail */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Selected:</span>
          {selectedBrand ? (
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedBrand.name}
            </span>
          ) : (
            <span className="text-slate-400 italic">Select Brand</span>
          )}

          {selectedModel && (
            <>
              <span>/</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedModel.name}
              </span>
            </>
          )}

          {selectedService && (
            <>
              <span>/</span>
              <span className="font-semibold text-[#00B2A2]">
                {selectedService.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Error banner if database save failed */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Booking Submission Failed</span>
            <p className="text-xs mt-0.5">{submitError}</p>
            <p className="text-xs mt-1 text-rose-600 font-medium">
              Note: As per our security protocol, you will not be redirected to WhatsApp until your enquiry is saved in the database.
            </p>
          </div>
          <button
            onClick={() => handleProceedWithWhatsApp()}
            className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Retry Save
          </button>
        </div>
      )}

      {/* STEP 1: SELECT BRAND */}
      {currentStep === 1 && (
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Select Phone Brand
              </h3>
              <p className="text-xs text-slate-500">
                Choose the manufacturer of your mobile device
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand (e.g. Apple)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredBrands.map((brand) => {
              const isSelected = selectedBrand?.id === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedModel(null);
                    setSelectedService(null);
                    setCurrentStep(2);
                  }}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                    isSelected
                      ? 'border-[#00B2A2] bg-[#00B2A2]/5 ring-2 ring-[#00B2A2]'
                      : 'border-slate-200 bg-white hover:border-[#00B2A2]/60 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 group-hover:scale-105 transition-transform">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <Smartphone className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {brand.name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">
              No brands found matching "{brandSearch}".
            </div>
          )}
        </div>
      )}

      {/* STEP 2: SELECT MODEL */}
      {currentStep === 2 && (
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 2: Select {selectedBrand?.name} Model
              </h3>
              <p className="text-xs text-slate-500">
                Choose your specific smartphone model
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Search model (e.g. iPhone 17)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#00B2A2] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {loadingModels ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading models for {selectedBrand?.name}...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredModels.map((model) => {
                const isSelected = selectedModel?.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setSelectedService(null);
                      setCurrentStep(3);
                    }}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-[#00B2A2] bg-[#00B2A2]/5 ring-2 ring-[#00B2A2]'
                        : 'border-slate-200 bg-white hover:border-[#00B2A2]/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                          {model.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {selectedBrand?.name}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}

          {filteredModels.length === 0 && !loadingModels && (
            <div className="p-8 text-center text-sm text-slate-500">
              No models found matching "{modelSearch}".
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Brands</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT SERVICE (NO PROBLEMS / FAULTS DISPLAYED!) */}
      {currentStep === 3 && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 3: Select Display Issue for {selectedModel?.name}
            </h3>
            <p className="text-xs text-slate-500">
              Choose the specific display issue requiring diagnosis by our specialists.
            </p>
          </div>

          {loadingServices ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading display services...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {modelAvailableServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setCurrentStep(4);
                    }}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#00B2A2] bg-[#00B2A2]/5 ring-2 ring-[#00B2A2]'
                        : 'border-slate-200 bg-white hover:border-[#00B2A2]/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {service.name}
                        </span>
                        <span className="text-xs font-semibold text-[#00B2A2]">
                          In-Lab Diagnosis
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-700/50">
                      {service.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{service.estimatedDuration}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#00B2A2]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Display Specialist</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Models</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CUSTOMER DETAILS (DYNAMIC FORM FROM DATABASE) */}
      {currentStep === 4 && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 4: Customer Contact & Appointment Preference
            </h3>
            <p className="text-xs text-slate-500">
              Please enter your details to generate your walk-in service ticket.
            </p>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formFields
                .filter((f) => f.isEnabled)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((field) => {
                  const hasError = formErrors[field.fieldKey];
                  const isFullWidth =
                    field.fieldKey === 'address' || field.fieldKey === 'additionalNote';

                  return (
                    <div
                      key={field.id}
                      className={isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}
                    >
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {field.label}{' '}
                        {field.isRequired ? (
                          <span className="text-rose-500">*</span>
                        ) : (
                          <span className="text-slate-400 font-normal">(Optional)</span>
                        )}
                      </label>

                      {field.fieldType === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={formData[field.fieldKey] || ''}
                          onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className={`w-full rounded-xl border p-2.5 text-xs text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white ${
                            hasError
                              ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
                              : 'border-slate-200 bg-slate-50 focus:border-[#00B2A2] focus:bg-white dark:border-slate-700'
                          }`}
                        />
                      ) : (
                        <input
                          type={field.fieldType}
                          value={formData[field.fieldKey] || ''}
                          onChange={(e) => handleInputChange(field.fieldKey, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className={`w-full rounded-xl border p-2.5 text-xs text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white ${
                            hasError
                              ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
                              : 'border-slate-200 bg-slate-50 focus:border-[#00B2A2] focus:bg-white dark:border-slate-700'
                          }`}
                        />
                      )}

                      {hasError && (
                        <p className="mt-1 text-[11px] text-rose-500">{hasError}</p>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-8 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Services</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00B2A2] px-6 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#00B2A2]/30 hover:bg-[#009e90] transition-colors"
              >
                <span>Review Enquiry</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 5: REVIEW DETAILS & PROCEED WITH WHATSAPP */}
      {currentStep === 5 && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 5: Review Enquiry & Proceed
            </h3>
            <p className="text-xs text-slate-500">
              Please verify your repair summary below. Clicking proceed will save your order in PostgreSQL and continue to WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            {/* Device & Service Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Repair Request
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Brand:</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedBrand?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Model:</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedModel?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Service:</span>
                  <span className="text-sm font-semibold text-[#00B2A2]">
                    {selectedService?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Customer Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Full Name:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formData.fullName || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mobile Number:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formData.mobileNumber || '—'}
                  </span>
                </div>
                {formData.email && (
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {formData.email}
                    </span>
                  </div>
                )}
                {formData.city && (
                  <div>
                    <span className="text-slate-400 block">City:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {formData.city}
                    </span>
                  </div>
                )}
                {formData.address && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Address:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {formData.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Slot Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Preferred Appointment Slot
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#00B2A2]" />
                  <span>Date: {formData.preferredDate || 'Upon walk-in'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#00B2A2]" />
                  <span>Time: {formData.preferredTime || 'Any slot'}</span>
                </div>
                {formData.additionalNote && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Note:</span>
                    <span className="italic text-slate-700 dark:text-slate-300">
                      "{formData.additionalNote}"
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Crucial Zero Payment Notice */}
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                <strong>Zero Prepayment Required:</strong> You will not be asked for credit cards or online payment. You only pay in person at our walk-in service center after your device is repaired.
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 order-2 sm:order-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Edit Details</span>
            </button>

            {/* THE CRITICAL CTA: Proceed with WhatsApp */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleProceedWithWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 transition-all order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving Enquiry in Database...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>Proceed with WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
