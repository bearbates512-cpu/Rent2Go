import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { MessageSquare, Radio } from 'lucide-react';

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
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 sm:bottom-8 end-6 z-40 flex items-center group">
      {/* Subtle pulsing radar ring */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

      <motion.a
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onMouseEnter={() => soundFX.playHover()}
        onClick={() => soundFX.playClick()}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative z-10 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold shadow-xl shadow-emerald-950/30 border border-white/20 transition-all cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline-block text-xs font-mono font-bold">
          {locale === 'ur' ? '24/7 واٹس ایپ ڈیسک' : '24/7 LIVE DESK'}
        </span>
      </motion.a>
    </aside>
  );
};
