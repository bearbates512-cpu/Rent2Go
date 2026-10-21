import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, locale, announcementDismissed, setAnnouncementDismissed, navigateToBooking } = useApp();

  if (!settings.announcementBar.enabled || announcementDismissed) {
    return null;
  }

  const text = settings.announcementBar.text[locale] || settings.announcementBar.text.en;

  return (
    <div className="bg-[#0B1F3A] text-white border-b border-amber-500/30 px-4 py-2.5 text-xs sm:text-sm font-medium transition-all relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <Sparkles className="w-4 h-4 text-[#F5B301] shrink-0 animate-pulse" />
          <span className="line-clamp-1 sm:line-clamp-none">{text}</span>
          <button
            onClick={() => navigateToBooking()}
            className="hidden sm:inline-flex items-center text-[#F5B301] underline underline-offset-2 hover:text-amber-300 font-semibold ms-2"
          >
            {locale === 'ur' ? 'ابھی بک کریں ←' : 'Book Now →'}
          </button>
        </div>
        <button
          onClick={() => setAnnouncementDismissed(true)}
          className="text-slate-300 hover:text-white p-1 rounded-md shrink-0 hover:bg-white/10"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
