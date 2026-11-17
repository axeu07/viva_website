"use client";
/**
 * Sunlight shafts: soft diagonal beams from the top-right with drifting dust.
 * Brightness and angle come from the day clock (--sun-a, --sun-angle on <html>), so the
 * sun "moves" as you scroll. `strength` scales it per section; `minimum` keeps a faint
 * beam even at night (useful for the hero before the clock starts).
 */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = { strength?: number; minimum?: number; dust?: boolean; className?: string };

export default function SunBeam({ strength = 1, minimum = 0, dust = true, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`sunbeam ${className}`}
      style={{ ["--sb-k" as string]: strength, ["--sb-min" as string]: minimum }}
    >
      <span className="sb-ray sb-ray-1" />
      <span className="sb-ray sb-ray-2" />
      <span className="sb-ray sb-ray-3" />
      <span className="sb-ray sb-ray-4" />
      {dust && <Dust />}
    </div>
  );
}

/** Lightweight 2D-canvas dust motes. Only animates while on screen. */
function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Mote = { x: number; y: number; r: number; vx: number; vy: number; p: number; s: number };
    let motes: Mote[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.6,
        vx: -0.05 - Math.random() * 0.12,
        vy: 0.03 + Math.random() * 0.1,
        p: Math.random() * Math.PI * 2,
        s: 0.004 + Math.random() * 0.01,
      }));
    };

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (animate) {
          m.p += m.s;
          m.x += m.vx + Math.sin(m.p) * 0.08;
          m.y += m.vy + Math.cos(m.p * 0.7) * 0.05;
          if (m.x < -4) m.x = w + 4;
          if (m.y > h + 4) m.y = -4;
        }
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(m.p * 2));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 236, 196, ${a.toFixed(3)})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(false);
    const ro = new ResizeObserver(() => {
      resize();
      draw(false);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className="sb-dust" />;
}
