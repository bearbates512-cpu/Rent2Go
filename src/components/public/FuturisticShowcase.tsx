import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Navigation,
  ShieldCheck,
  Zap,
  Gauge,
  Snowflake,
  Radio,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FuturisticShowcaseProps {
  onSelectCar?: (carId: string) => void;
  onOpenSpecsModal?: (car: Vehicle) => void;
}

export const FuturisticShowcase: React.FC<FuturisticShowcaseProps> = ({
  onSelectCar,
  onOpenSpecsModal
}) => {
  const { vehicles, locale, navigateToCar, navigateToBooking } = useApp();
  const publishedVehicles = vehicles.filter(v => v.visibility === 'published');

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const activeVehicle = publishedVehicles[selectedIndex] || publishedVehicles[0];

  // 1. High Performance Futuristic Cyber Runway Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 480;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.42;

      // Subtle ambient horizon gradient
      const horizonGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 60);
      horizonGrad.addColorStop(0, 'rgba(11, 31, 58, 0)');
      horizonGrad.addColorStop(0.5, 'rgba(245, 179, 1, 0.08)');
      horizonGrad.addColorStop(1, 'rgba(11, 31, 58, 0)');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, horizonY - 40, w, 100);

      // Vanishing point perspective grid (Cyber Runway)
      const vpX = w / 2;
      const vpY = horizonY;

      offset = (offset + 1.2) % 35;

      ctx.lineWidth = 1;

      // Perspective longitudinal lines
      const totalLines = 14;
      for (let i = 0; i <= totalLines; i++) {
        const bottomX = (w / totalLines) * i;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(245, 179, 1, 0.15)' : 'rgba(56, 189, 248, 0.12)';
        ctx.beginPath();
        ctx.moveTo(vpX + (bottomX - vpX) * 0.08, vpY);
        ctx.lineTo(bottomX, h);
        ctx.stroke();
      }

      // Moving horizontal grid lines (towards the viewer)
      for (let yOffset = offset; yOffset < (h - vpY); yOffset += 28) {
        // Exponential perspective scaling
        const progress = yOffset / (h - vpY);
        const y = vpY + progress * progress * (h - vpY);
        const alpha = Math.min(progress * 0.25, 0.25);

        ctx.strokeStyle = `rgba(245, 179, 1, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Floating ambient particle dust
      for (let i = 0; i < 20; i++) {
        const px = ((i * 1234 + offset * 8) % w);
        const py = ((i * 987 - offset * 4) % (h * 0.8)) + horizonY * 0.2;
        const pAlpha = 0.1 + (Math.sin(offset * 0.05 + i) + 1) * 0.15;
        ctx.fillStyle = `rgba(245, 179, 1, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 2. Mouse 3D tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const triggerLaserScan = () => {
    soundFX.playScan();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const handleCarSelect = (idx: number) => {
    soundFX.playClick();
    setSelectedIndex(idx);
    if (onSelectCar && publishedVehicles[idx]) {
      onSelectCar(publishedVehicles[idx].id);
    }
  };

  if (!activeVehicle) return null;

  const title = activeVehicle.title[locale] || activeVehicle.title.en;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-radial from-[#132A4A] via-[#0B1F3A] to-[#071324] border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 p-4 sm:p-6 lg:p-7 select-none">
      {/* Background Interactive Perspective Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85 z-0"
      />

      {/* Cyber Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Futuristic Hologram Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>VERIFIED FLEET SHOWCASE</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>LIVE VEHICLE TELEMETRY</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerLaserScan}
            disabled={isScanning}
            onMouseEnter={() => soundFX.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isScanning ? 'Scanning Hardware...' : 'Diagnostic Scan'}</span>
          </button>

          {onOpenSpecsModal && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenSpecsModal(activeVehicle);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-300" />
              <span>Full HUD Specs</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Stage with Tilt Perspective */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 10}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="relative z-10 py-6 sm:py-8 my-2 rounded-2xl transition-all"
      >
        {/* Holographic Frame Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

        {/* Dynamic Laser Scanning Line */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: ['0%', '100%', '0%'], opacity: [0.8, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] z-30 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Vehicle Showcase Image with Crossfade */}
        <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[340px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950/80">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeVehicle.id}
              src={activeVehicle.coverImage}
              alt={title}
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full object-cover object-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
              }}
            />
          </AnimatePresence>

          {/* Holographic Spec Callout Overlay during Scan */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-cyan-950/40 backdrop-blur-xs flex items-center justify-around p-4 z-20 pointer-events-none"
              >
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-400/50 text-cyan-300 font-mono text-xs shadow-lg space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ENGINE & CHASSIS</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{activeVehicle.variant || 'Standard 100% Inspected'}</p>
                  <p className="text-[10px] text-cyan-400/90">Odo: {activeVehicle.customFields?.odometerKm || '35,000'} KM</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-400/50 text-amber-300 font-mono text-xs shadow-lg space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Snowflake className="w-3.5 h-3.5 text-amber-400" />
                    <span>CLIMATE CONTROL</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Dual Chilled Condenser AC</p>
                  <p className="text-[10px] text-emerald-400">100% Chilled Guarantee</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Vehicle Category & Registration HUD */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 pointer-events-none z-10">
            <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              {activeVehicle.category} · {activeVehicle.transmission}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/90 text-[#0B1F3A] font-mono text-[10px] font-bold w-fit shadow-xs">
              PLATE: {activeVehicle.customFields?.registrationNumber || 'RYK-REGISTERED'}
            </span>
          </div>

          {/* Floating Pricing HUD */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-400/40 text-end pointer-events-none z-10 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
              {locale === 'ur' ? 'یومیہ کرایہ' : 'DAILY RATE'}
            </span>
            <div className="flex items-baseline justify-end gap-1 font-mono">
              <span className="text-xs text-amber-400 font-bold">PKR</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {activeVehicle.dailyRatePKR ? activeVehicle.dailyRatePKR.toLocaleString() : 'Quote'}
              </span>
              <span className="text-[10px] text-slate-400">/day</span>
            </div>
          </div>
        </div>

        {/* Live Cyber Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
            <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Transmission</span>
              <span className="text-xs font-bold text-white capitalize truncate block">{activeVehicle.transmission}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
            <Snowflake className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">AC System</span>
              <span className="text-xs font-bold text-emerald-400 truncate block">Chilled Super Cool</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">GPS Satellite</span>
              <span className="text-xs font-bold text-white truncate block">Live 24/7 Tracked</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Chauffeur</span>
              <span className="text-xs font-bold text-white truncate block">
                {activeVehicle.driverOption === 'with_driver' ? 'Driver Only' : activeVehicle.driverOption === 'self_drive' ? 'Self Drive' : 'Both Options'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Fleet Selector Carousel Chips */}
      <div className="relative z-10 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Vehicle Model ({publishedVehicles.length} Active in Hub)</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Click to preview 3D specs</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {publishedVehicles.map((veh, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={veh.id}
                onClick={() => handleCarSelect(idx)}
                onMouseEnter={() => soundFX.playHover()}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-start transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <img
                  src={veh.coverImage}
                  alt={veh.make}
                  className="w-8 h-6 rounded-md object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                  }}
                />
                <div className="text-start">
                  <span className="text-xs font-bold block leading-tight truncate max-w-[120px]">
                    {veh.make} {veh.model}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 block">
                    Rs. {veh.dailyRatePKR ? (veh.dailyRatePKR / 1000).toFixed(1) + 'k' : 'Quote'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="relative z-10 mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-300 text-xs">
          <span className="font-bold text-white">{title}</span>
          <span className="text-slate-400 text-[11px] ms-2">· Sadiqabad Hub Fast Dispatch Ready</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              soundFX.playClick();
              navigateToCar(activeVehicle.slug);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/15 text-center cursor-pointer"
          >
            {locale === 'ur' ? 'تفصیلات دیکھیں' : 'Vehicle Details'}
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              navigateToBooking(activeVehicle.id);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5B301] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0B1F3A] font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{locale === 'ur' ? 'گاڑی بک کریں' : 'Instant Book'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
