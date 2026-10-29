import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Phone, MessageSquare, Mail, MapPin, ShieldCheck, Share2, Sparkles, Download } from 'lucide-react';

interface Premium3DBusinessCardProps {
  name?: string;
  titleRole?: string;
  compact?: boolean;
}

export const Premium3DBusinessCard: React.FC<Premium3DBusinessCardProps> = ({
  name = 'Muhammad Tariq Gondal',
  titleRole = 'MANAGING DIRECTOR & FOUNDER',
  compact = false
}) => {
  const { settings, locale } = useApp();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [rotation, setRotation] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [copied, setCopied] = useState<boolean>(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 16;
    const rotateX = (0.5 - y) * 12;

    setMousePos({ x: x * 100, y: y * 100 });
    setRotation({ rx: rotateX, ry: rotateY });
  };

  const handlePointerLeave = () => {
    setMousePos({ x: 50, y: 50 });
    setRotation({ rx: 0, ry: 0 });
  };

  const handleShareCard = () => {
    soundFX.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Rent2Go Car Rental Sadiqabad - ${name} (${titleRole})\nPhone: ${settings.phoneFormatted}\nAddress: ${settings.address.en}\nWebsite: https://rent2go-sadiqabad.pk`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-md" style={{ perspective: '1200px' }}>
        <article
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onMouseEnter={() => soundFX.playHover()}
          style={{
            transform: `perspective(1200px) rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg) translateY(${rotation.rx !== 0 ? -6 : 0}px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 400ms ease, border-color 400ms ease'
          }}
          className="relative aspect-16/10 w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#101615] p-6 sm:p-8 text-white shadow-2xl overflow-hidden group cursor-pointer hover:border-[#d4af68]/50 hover:shadow-[0_28px_70px_rgba(0,0,0,0.5),0_5px_20px_rgba(198,164,92,0.15)]"
        >
          {/* Soft ambient highlight tracking mouse cursor */}
          <div
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(220, 190, 130, 0.16), transparent 48%)`,
              transition: 'opacity 300ms ease'
            }}
            className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100"
          />

          {/* Decorative highlight light sweep */}
          <div className="pointer-events-none absolute top-[-60%] left-[-70%] w-[45%] h-[220%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[24deg] transition-all duration-750 ease-out group-hover:left-[140%]" />

          {/* Background Concentric Circular Gold Ribbons */}
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#d4af68]/10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-[#d4af68]/10"
            aria-hidden="true"
          />

          {/* 3D Elevated Content Layer */}
          <div
            style={{ transform: 'translateZ(26px)' }}
            className="relative z-10 flex h-full flex-col justify-between"
          >
            {/* Header: Brand Mark & Status Badge */}
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af68]/40 bg-[#d4af68]/10 text-[#e8cb91] shadow-inner"
                  aria-label="Rent2Go brand mark"
                >
                  <img
                    src="/assets/aistudio/Rent2Go_icon_transparent.png"
                    alt="Rent2Go"
                    className="w-7 h-7 object-contain brightness-125"
                  />
                </div>

                <div>
                  <p className="text-sm font-black tracking-[0.22em] text-white">
                    RENT<span className="text-[#F5B301]">2GO</span>
                  </p>
                  <p className="mt-0.5 text-[9px] tracking-[0.25em] text-white/50 uppercase font-mono">
                    SADIQABAD FLEET
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-[#d4af68]/30 bg-[#d4af68]/5 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-[#e8cb91] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>OFFICIAL VIP</span>
              </span>
            </header>

            {/* Gold Divider Line */}
            <div
              style={{
                background: 'linear-gradient(90deg, #9b783c, #ead6a3, #9b783c)'
              }}
              className="h-px w-full opacity-70 my-2"
            />

            {/* Identity & Mission */}
            <section className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {name}
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              <p className="text-[10px] sm:text-xs tracking-[0.14em] text-[#d8b979] font-mono font-semibold uppercase">
                {titleRole}
              </p>

              <p className="text-[11px] leading-relaxed text-white/60 max-w-sm pt-1">
                {locale === 'ur'
                  ? 'محفوظ سفر، جدید ترین گاڑیاں اور بااخلاق ڈرائیورز کی ضمانت۔'
                  : 'Premium chauffeur service, luxury convoys & verified car rental in Sadiqabad.'}
              </p>
            </section>

            {/* Footer Contact Details */}
            <footer className="flex items-end justify-between gap-3 border-t border-white/10 pt-3">
              <div className="space-y-1 text-[10px] text-white/70 sm:text-[11px] font-mono">
                <a
                  href={`tel:${settings.phone}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                  }}
                  className="block transition-colors hover:text-[#e8cb91] flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-[#d4af68]" />
                  <span>{settings.phoneFormatted}</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                  }}
                  className="block transition-colors hover:text-[#25D366] flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>24/7 WhatsApp Desk</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareCard();
                  }}
                  className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer font-mono"
                  title="Copy Contact Info"
                >
                  <Share2 className="w-3 h-3 text-amber-400" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Assalam-o-Alaikum%20Director%20Rent2Go!%20I%20would%20like%20to%20discuss%20a%20car%20rental.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                  }}
                  className="whitespace-nowrap text-[10px] tracking-wide text-[#e8cb91] transition-colors hover:text-white sm:text-[11px] font-mono font-bold"
                >
                  rent2go.pk ↗
                </a>
              </div>
            </footer>
          </div>
        </article>
      </div>

      <p className="mt-3 text-center text-xs tracking-wide text-slate-500 font-mono">
        {locale === 'ur' ? 'ماؤس یا ٹچ سے 3D کارڈ گھما کر دیکھیں' : 'Interactive 3D Executive Pass · Move cursor to tilt in 3D'}
      </p>
    </div>
  );
};
