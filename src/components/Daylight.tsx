"use client";
/**
 * The lights coming up to daylight: a tall gradient band between a dark section and an ivory one,
 * with a soft sun bloom that brightens as you scroll through it. dir="down" is the dusk on the way out.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "@/styles/ivory.css";

export default function Daylight({ dir = "up" }: { dir?: "up" | "down" }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        ".dl-sun",
        { opacity: dir === "up" ? 0 : 0.9, scale: dir === "up" ? 0.6 : 1 },
        {
          opacity: dir === "up" ? 0.9 : 0,
          scale: dir === "up" ? 1 : 0.6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced, dir] },
  );
  return (
    <div ref={root} className={`daylight daylight-${dir}`} aria-hidden>
      <span className="dl-sun" />
    </div>
  );
}
