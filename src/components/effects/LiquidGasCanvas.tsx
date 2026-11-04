import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface LiquidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  hue: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface FluidWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

/**
 * Dispatches a global liquid gas splash ripple event that causes
 * luminous plasma waves and particle surges across the canvas.
 */
export const triggerLiquidGasSplash = (originX?: number, originY?: number, intensity: number = 1) => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('rent2go:liquid-gas-splash', {
    detail: {
      x: originX ?? window.innerWidth / 2,
      y: originY ?? (typeof window !== 'undefined' ? window.innerHeight / 3 : 300),
      intensity
    }
  });
  window.dispatchEvent(event);
};

export const LiquidGasCanvas: React.FC = () => {
  const { themeMode } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef<{ x: number; y: number; active: boolean; radius: number }>({
    x: 0,
    y: 0,
    active: false,
    radius: 180
  });

  const wavesRef = useRef<FluidWave[]>([]);
  const isDark = themeMode === 'dark';

  // Splash interactive wave
  const splashLiquidGas = (x?: number, y?: number, intensity: number = 1) => {
    const splashX = x ?? window.innerWidth / 2;
    const splashY = y ?? window.innerHeight / 2;
    wavesRef.current.push({
      x: splashX,
      y: splashY,
      radius: 10,
      maxRadius: 360 * intensity,
      alpha: 0.85
    });
    // add secondary delayed wave
    setTimeout(() => {
      wavesRef.current.push({
        x: splashX,
        y: splashY,
        radius: 15,
        maxRadius: 260 * intensity,
        alpha: 0.55
      });
    }, 120);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Occasional micro-ripples when moving mouse fast
      if (Math.random() < 0.08) {
        wavesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 5,
          maxRadius: 100,
          alpha: 0.35
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = (currentScrollY - lastScrollY) * 0.08;
      lastScrollY = currentScrollY;

      // Impart scroll momentum to liquid gas particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].vy += delta * (i % 2 === 0 ? 0.4 : -0.2);
        particles[i].vx += Math.sin(i) * 0.25;
      }
    };

    // Global event listener for programmatic splash triggers (e.g. Opening Car Details or Booking Form)
    const handleSplashEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      splashLiquidGas(detail.x, detail.y, detail.intensity || 1);

      // Impart explosive radial outward velocity to neighboring particles
      const sx = detail.x ?? width / 2;
      const sy = detail.y ?? height / 2;
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - sx;
        const dy = particles[i].y - sy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 500) {
          const power = (1 - dist / 500) * 3.5;
          particles[i].vx += (dx / dist) * power;
          particles[i].vy += (dy / dist) * power;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('rent2go:liquid-gas-splash', handleSplashEvent);

    // Initialize rich liquid gas particles
    const particleCount = Math.min(Math.floor(width / 24), 55);
    const particles: LiquidParticle[] = [];

    // Vivid Hues: Golden Amber (38), Vivid Cyan (190), Electric Purple (275), Neon Emerald (155)
    const hues = [38, 190, 275, 155, 45, 180];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 90 + 50;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius,
        baseRadius: radius,
        hue: hues[Math.floor(Math.random() * hues.length)],
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.025 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Composite mode for rich bioluminescent fluid plasma
      ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';

      const mouse = mouseRef.current;

      // Update and draw liquid fluid waves/ripples
      for (let w = wavesRef.current.length - 1; w >= 0; w--) {
        const wave = wavesRef.current[w];
        wave.radius += 5.2;
        wave.alpha *= 0.955;

        if (wave.alpha < 0.01 || wave.radius > wave.maxRadius) {
          wavesRef.current.splice(w, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = isDark
          ? `hsla(190, 100%, 70%, ${wave.alpha * 0.85})`
          : `hsla(38, 95%, 50%, ${wave.alpha * 0.55})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render liquid particles with viscous tendrils
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid motion with organic harmonic swirl
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 20;

        // Swirling gas turbulence
        p.vx += Math.cos(time + p.y * 0.004) * 0.02;
        p.vy += Math.sin(time + p.x * 0.004) * 0.02;

        // Friction dampening
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Mouse displacement with fluid repulsion & swirl
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 2.2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            // Swirl spin
            p.vx += (-dy / dist) * 0.4;
            p.vy += (dx / dist) * 0.4;
          }
        }

        // Screen wrap
        if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
        if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
        if (p.y < -p.radius * 2) p.y = height + p.radius * 2;
        if (p.y > height + p.radius * 2) p.y = -p.radius * 2;

        // Connect neighboring droplets with liquid tendrils
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.save();
            const tendrilAlpha = (1 - dist / 130) * (isDark ? 0.25 : 0.12);
            ctx.strokeStyle = isDark
              ? `hsla(${(p.hue + p2.hue) / 2}, 90%, 65%, ${tendrilAlpha})`
              : `hsla(${(p.hue + p2.hue) / 2}, 85%, 50%, ${tendrilAlpha})`;
            ctx.lineWidth = (1 - dist / 130) * 3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Draw soft liquid gas blob with radial gradient
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        const currentAlpha = isDark ? p.alpha * 0.95 : p.alpha * 0.45;

        grad.addColorStop(0, `hsla(${p.hue}, 95%, ${isDark ? '68%' : '52%'}, ${currentAlpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue + 15}, 85%, ${isDark ? '52%' : '60%'}, ${currentAlpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 45%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('rent2go:liquid-gas-splash', handleSplashEvent);
    };
  }, [isDark]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full filter blur-[18px] opacity-85 dark:opacity-90"
      />
    </div>
  );
};

/**
 * Ambient Liquid Gas Aura component to wrap or place behind
 * modals, booking wizards, or car detail cards for an undeniable glowing fluid effect.
 */
export const LiquidGasAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-3xl ${className}`}
      aria-hidden="true"
    >
      {/* Floating fluid plasma nebulas */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/20 via-cyan-400/15 to-transparent blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-400/20 via-purple-500/15 to-transparent blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
    </div>
  );
};
