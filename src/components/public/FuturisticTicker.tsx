import React from 'react';
import { motion } from 'motion/react';
import { Radio, Zap, ShieldCheck, Snowflake, MessageSquare, Star, Navigation } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects.ts';

export const FuturisticTicker: React.FC = () => {
  const tickerItems = [
    { icon: <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />, text: 'SADIQABAD CENTRAL FLEET HUB · 8 PREMIUM VEHICLES DISPATCH-READY' },
    { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, text: 'M-5 MOTORWAY EXPRESS CORRIDOR · RAPID AIRPORT & CITY CONVOY' },
    { icon: <Snowflake className="w-3.5 h-3.5 text-blue-400" />, text: '100% CHILLED DUAL AC INSPECTED & GUARANTEED ON EVERY TRIP' },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, text: 'LICENSED POLITE LOCAL CHAUFFEURS · 24/7 SATELLITE GPS ACTIVE' },
    { icon: <MessageSquare className="w-3.5 h-3.5 text-green-400" />, text: 'INSTANT WHATSAPP BOOKING CONFIRMATION IN LESS THAN 5 MINUTES' },
    { icon: <Star className="w-3.5 h-3.5 text-amber-300" />, text: '4.9/5 RATED SERVICE ACROSS SADIQABAD, RAHIM YAR KHAN & SUKKUR' }
  ];

  return (
    <div
      onMouseEnter={() => soundFX.playHover()}
      className="relative z-20 w-full overflow-hidden bg-[#071324] border-y border-cyan-500/20 py-2.5 text-xs select-none shadow-md"
    >
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 25
          }}
          className="flex items-center gap-8 shrink-0"
        >
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-300 tracking-wider hover:text-amber-300 transition-colors cursor-default"
            >
              {item.icon}
              <span>{item.text}</span>
              <span className="text-cyan-500/40 text-xs">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
