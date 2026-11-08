import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
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
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-20 sm:bottom-8 end-4 sm:end-6 z-40 flex items-center group">
      <a
        onMouseEnter={() => soundFX.playHover()}
        onClick={() => soundFX.playClick()}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative z-10 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold shadow-xl border border-white/20 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block text-xs font-mono font-bold">
          {locale === 'ur' ? '24/7 واٹس ایپ ڈیسک' : '24/7 LIVE DESK'}
        </span>
      </a>
    </aside>
  );
};
