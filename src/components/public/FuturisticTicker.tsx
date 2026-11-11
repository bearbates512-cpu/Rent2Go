import React from 'react';

export const FuturisticTicker: React.FC = () => {
  const tickerItems = [
    'JAM RENT A CAR RAHIM YAR KHAN',
    '7 DAYS 24 HOURS SERVICE · 24/7 OPEN',
    'CALL & WHATSAPP: 03006756054',
    'RAHIM YAR KHAN FLEET & MOTORWAY TRAVEL',
    'TOYOTA FORTUNER · CIVIC RS · ALTIS GRANDE · YARIS',
    'VERIFIED CHAUFFEURS & LUXURY SELF-DRIVE',
    'RENTAL SAWARI APP VERIFIED FLEET',
    '7 دن 24 گھنٹے سروس · جام رینٹ اے کار',
    'FACEBOOK: JAM BROTHERS RENT A CAR',
    'AIRPORT TRANSFERS & WEDDING FLEETS'
  ];

  return (
    <div className="relative z-20 w-full overflow-hidden bg-slate-950 text-white border-y border-white/10 py-4 select-none">
      <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
        {tickerItems.concat(tickerItems).map((text, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-slate-300 hover:text-[#F5B301] transition-colors">
              {text}
            </span>
            <span className="text-[#F5B301] text-base font-bold select-none">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
