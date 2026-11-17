"use client";
/**
 * Crossing tapes: two tilted marquee bands in an X, running opposite ways.
 * Gold tape (black text) and black tape (glowing ivory outline text). Speed follows scroll
 * velocity and the tapes skew slightly on fast scrolls. Paused when off screen; static under
 * reduced motion.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { tapes } from "@/lib/content";

function Run({ items, reps = 4 }: { items: readonly string[]; reps?: number }) {
  return (
    <>
      {Array.from({ length: reps }, (_, r) => (
        <span key={r} className="tape-set">
          {items.map((t) => (
            <span key={t} className="tape-item">
              {t}
              <span className="tape-sep" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function CrossingTapes() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const a = root.current!.querySelector<HTMLElement>(".tape-gold .tape-track")!;
      const b = root.current!.querySelector<HTMLElement>(".tape-neon .tape-track")!;
      const setW = () => [a, b].map((t) => (t.querySelector(".tape-set") as HTMLElement).offsetWidth);
      let [wa, wb] = setW();
      let xa = 0;
      let xb = -wb;
      let vel = 0;
      let skew = 0;
      let active = false;

      const trig = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (active = self.isActive),
        onUpdate: (self) => (vel = self.getVelocity()),
        onRefresh: () => ([wa, wb] = setW()),
      });

      const tick = (_t: number, dt: number) => {
        if (!active) return;
        vel *= 0.92; // ease back to cruise speed
        const boost = Math.min(Math.abs(vel) / 900, 6);
        const dir = vel < 0 ? -1 : 1;
        const s = (dt / 1000) * 60 * (1.1 + boost * 2.2);
        xa -= s * dir;
        xb += s * dir;
        if (xa <= -wa) xa += wa;
        if (xa > 0) xa -= wa;
        if (xb >= 0) xb -= wb;
        if (xb < -wb) xb += wb;
        skew += (gsap.utils.clamp(-9, 9, vel / -260) - skew) * 0.12;
        a.style.transform = `translate3d(${xa}px,0,0) skewX(${skew}deg)`;
        b.style.transform = `translate3d(${xb}px,0,0) skewX(${-skew}deg)`;
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        trig.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="tapes" role="region" aria-label="What's inside Viva">
      <p className="sr-only">
        {tapes.gold.join(", ")}. {tapes.neon.join(", ")}.
      </p>
      <div className="tape tape-neon" aria-hidden>
        <div className="tape-track">
          <Run items={tapes.neon} reps={6} />
        </div>
      </div>
      <div className="tape tape-gold" aria-hidden>
        <div className="tape-track">
          <Run items={tapes.gold} reps={4} />
        </div>
      </div>
    </div>
  );
}
