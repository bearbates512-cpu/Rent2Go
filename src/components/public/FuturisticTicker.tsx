import React from 'react';

export const FuturisticTicker: React.FC = () => {
  const tickerItems = [
    'RENT2GO®',
    'YOUR JOURNEY. YOUR RIDE. YOUR FREEDOM.',
    'LESS NOISE. MORE CLARITY.',
    'SADIQABAD & M-5 MOTORWAY FLEET',
    'TOYOTA FORTUNER · CIVIC · CAMRY · COROLLA',
    'VERIFIED CHAUFFEURS & SELF-DRIVE',
    '24/7 HIGHWAY ASSISTANCE',
    'INSTANT BOOKING CONFIRMATION'
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
