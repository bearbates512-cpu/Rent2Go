import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, locale } = useApp();

  if (!settings.features.floatingWhatsAppEnabled) {
    return null;
  }

  const prefilledMessage = encodeURIComponent(
    locale === 'ur'
      ? 'السلام علیکم رینٹ ٹو گو! میں صادق آباد میں گاڑی کرائے پر لینے کے حوالے سے معلومات چاہتا ہوں۔'
      : 'Hello Rent2Go! I would like to inquire about booking a rental car in Sadiqabad.'
  );

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${prefilledMessage}`;

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-8 sm:bottom-10 end-6 z-40 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-lg shadow-emerald-600/30 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block text-sm">
          {locale === 'ur' ? 'واٹس ایپ پر رابطہ' : 'Chat on WhatsApp'}
        </span>
      </a>
    </aside>
  );
};
