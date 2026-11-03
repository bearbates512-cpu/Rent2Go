import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundFX } from '../../utils/soundEffects.ts';
import { Zap } from 'lucide-react';

interface BoltSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  color: string;
}

interface BlastParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export const triggerThunderBlast = (originX?: number, originY?: number, intensity: number = 1) => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('rent2go:thunder-blast', {
    detail: {
      x: originX ?? window.innerWidth / 2,
      y: originY ?? window.innerHeight / 3,
      intensity
    }
  });
  window.dispatchEvent(event);
};

export const ThunderBlastSystem: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [bolts, setBolts] = useState<BoltSegment[][]>([]);
  const [shockwave, setShockwave] = useState<{ x: number; y: number; active: boolean; scale: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<BlastParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const generateLightningBranch = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    displace: number = 80,
    depth: number = 0
  ): BoltSegment[] => {
    if (depth > 5 || displace < 6) {
      return [
        {
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          width: Math.max(1, 4 - depth * 0.6),
          color: depth === 0 ? '#FFFFFF' : depth % 2 === 0 ? '#F5B301' : '#38BDF8'
        }
      ];
    }

    const midX = (startX + endX) / 2 + (Math.random() - 0.5) * displace;
    const midY = (startY + endY) / 2 + (Math.random() - 0.5) * displace;

    let segments = [
      ...generateLightningBranch(startX, startY, midX, midY, displace / 1.7, depth + 1),
      ...generateLightningBranch(midX, midY, endX, endY, displace / 1.7, depth + 1)
    ];

    // Branch fork
    if (Math.random() < 0.45 && depth < 3) {
      const forkEndX = midX + (Math.random() - 0.5) * displace * 2;
      const forkEndY = midY + Math.random() * displace * 1.5;
      segments = segments.concat(
        generateLightningBranch(midX, midY, forkEndX, forkEndY, displace / 2, depth + 1)
      );
    }

    return segments;
  };

  const executeBlast = useCallback((x: number, y: number) => {
    soundFX.playThunderBlast();
    setIsActive(true);

    // 1. Generate multiple branched lightning bolts
    const newBolts: BoltSegment[][] = [];
    const boltCount = 3 + Math.floor(Math.random() * 3);

    for (let b = 0; b < boltCount; b++) {
      const targetX = x + (Math.random() - 0.5) * window.innerWidth * 0.8;
      const targetY = y + Math.random() * (window.innerHeight * 0.6) + 100;
      newBolts.push(generateLightningBranch(x, y, targetX, targetY));
    }

    setBolts(newBolts);

    // 2. Shockwave ring
    setShockwave({ x, y, active: true, scale: 1 });

    // 3. Electric spark particles
    const sparks: BlastParticle[] = [];
    const sparkCount = 38;
    const colors = ['#F5B301', '#38BDF8', '#FFFFFF', '#FCD34D', '#67E8F9'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3.5 + 1.5,
        life: 0,
        maxLife: Math.random() * 22 + 18
      });
    }
    particlesRef.current = sparks;

    // Fade out bolts quickly like real lightning
    setTimeout(() => {
      setBolts([]);
    }, 280);

    setTimeout(() => {
      setIsActive(false);
      setShockwave(null);
    }, 600);
  }, []);

  // Particle loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sparks = particlesRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.94; // air resistance

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = 1 - progress;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (sparks.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (particlesRef.current.length > 0) {
      render();
    }

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  // Handle global events
  useEffect(() => {
    const handleBlastEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail || {};
      executeBlast(x ?? window.innerWidth / 2, y ?? window.innerHeight / 3);
    };

    window.addEventListener('rent2go:thunder-blast', handleBlastEvent);
    return () => window.removeEventListener('rent2go:thunder-blast', handleBlastEvent);
  }, [executeBlast]);

  // Canvas size sync
  useEffect(() => {
    const syncCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    syncCanvas();
    window.addEventListener('resize', syncCanvas);
    return () => window.removeEventListener('resize', syncCanvas);
  }, []);

  return (
    <>
      {/* Thunder Flash Ambient Screen Lightening */}
      {isActive && (
        <div
          className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-150 animate-pulse bg-cyan-400/10 dark:bg-amber-400/15 backdrop-brightness-125"
          aria-hidden="true"
        />
      )}

      {/* Lightning Bolts SVG Canvas */}
      {bolts.length > 0 && (
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-50 filter drop-shadow-[0_0_15px_#38bdf8]"
          aria-hidden="true"
        >
          {bolts.map((branch, branchIdx) => (
            <g key={branchIdx}>
              {branch.map((seg, sIdx) => (
                <line
                  key={sIdx}
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={seg.color}
                  strokeWidth={seg.width}
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))}
        </svg>
      )}

      {/* Expanding Shockwave Ring */}
      {shockwave && shockwave.active && (
        <div
          className="fixed pointer-events-none z-50 rounded-full border-2 border-cyan-400 dark:border-amber-400 -translate-x-1/2 -translate-y-1/2 animate-ping shadow-[0_0_40px_#f5b301]"
          style={{
            left: `${shockwave.x}px`,
            top: `${shockwave.y}px`,
            width: '180px',
            height: '180px'
          }}
          aria-hidden="true"
        />
      )}

      {/* Spark Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
        aria-hidden="true"
      />
    </>
  );
};
