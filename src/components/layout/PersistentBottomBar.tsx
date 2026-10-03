import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MessageCircle, Phone } from 'lucide-react';

export const PersistentBottomBar: React.FC = () => {
  const { settings } = useApp();
  const rawWhatsApp = settings.WHATSAPP_NUMBER || '9324316048';
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  const rawPhone = settings.SITE_PHONE || '+91 9324316048';
  const siteName = settings.SITE_NAME || 'QASWA TELECOM';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md p-2 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-2 gap-2">
        {/* WhatsApp Button (Brand Green) */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
            `Hello ${siteName}, I need display repair consultation for my device.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] py-3 px-4 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          <span>WhatsApp</span>
        </a>

        {/* Call Button (Brand Teal) */}
        <a
          href={`tel:${rawPhone.replace(/\s+/g, '')}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00B2A2] to-[#009E90] hover:from-[#009E90] hover:to-[#008F82] active:scale-[0.98] py-3 px-4 text-sm font-bold text-white shadow-md shadow-[#00B2A2]/20 transition-all"
        >
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </a>
      </div>
    </div>
  );
};
