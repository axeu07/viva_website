"use client";
/**
 * Swap stacked layers with a light-wipe: the new layer is uncovered top→bottom behind a bright
 * LED line, over the old one, which is hidden once covered.
 * Markup: container with `.lw-layer` children (one per item) and an optional `.lw-line`.
 */
import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "./motion";

export function useLightWipe(container: RefObject<HTMLElement | null>, active: number, reduced: boolean) {
  const prev = useRef(active);

  useEffect(() => {
    const box = container.current;
    if (!box) return;
    const layers = Array.from(box.querySelectorAll<HTMLElement>(":scope > .lw-layer"));
    const line = box.querySelector<HTMLElement>(":scope > .lw-line");
    const from = prev.current;
    prev.current = active;
    const next = layers[active];
    if (!next) return;

    layers.forEach((l, i) => {
      l.style.zIndex = i === active ? "3" : i === from ? "2" : "1";
      if (i !== active && i !== from) l.style.opacity = "0";
    });
    next.style.opacity = "1";

    if (from === active || reduced) {
      gsap.set(next, { clipPath: "inset(0% 0% 0% 0%)" });
      layers.forEach((l, i) => i !== active && (l.style.opacity = "0"));
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => layers.forEach((l, i) => i !== active && (l.style.opacity = "0")),
    });
    tl.fromTo(next, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" }, 0);
    const media = next.querySelector("img, video");
    if (media) tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
    if (line) tl.fromTo(line, { top: "0%", opacity: 1 }, { top: "100%", duration: 0.8, ease: "power2.inOut" }, 0).to(line, { opacity: 0, duration: 0.2 }, 0.68);
    return () => {
      tl.kill();
    };
  }, [container, active, reduced]);
}
