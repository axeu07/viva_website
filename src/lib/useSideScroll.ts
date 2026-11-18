"use client";
/**
 * Horizontal row driven by scroll. Desktop (≥1024px, motion OK): pins `root` and translates `track`
 * sideways. Mobile / reduced motion: `scroller` is a native swipe row. `bar` shows progress either way.
 */
import type { RefObject } from "react";
import { gsap, useGSAP } from "./motion";
import { useReducedMotion } from "./useReducedMotion";

type El<T extends HTMLElement> = RefObject<T | null>;

export function useSideScroll(root: El<HTMLElement>, track: El<HTMLElement>, scroller: El<HTMLElement>, bar: El<HTMLElement>) {
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const setBar = (p: number) => bar.current && (bar.current.style.transform = `scaleX(${p})`);
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth + 64);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => setBar(self.progress),
          },
        });
      });
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const s = scroller.current!;
        const onScroll = () => {
          const max = s.scrollWidth - s.clientWidth;
          setBar(max > 0 ? s.scrollLeft / max : 0);
        };
        s.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // Mouse / pen drag-to-scroll (touch already swipes natively). A drag swallows the
        // click that follows, so it doesn't toggle a locker by accident.
        let startX = 0;
        let startLeft = 0;
        let dragging = false;
        let moved = false;
        const onDown = (e: PointerEvent) => {
          if (e.pointerType === "touch" || e.button !== 0) return;
          dragging = true;
          moved = false;
          startX = e.clientX;
          startLeft = s.scrollLeft;
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          if (!moved && Math.abs(dx) > 6) {
            moved = true;
            s.style.scrollSnapType = "none";
            s.style.cursor = "grabbing";
            s.setPointerCapture(e.pointerId);
          }
          if (moved) s.scrollLeft = startLeft - dx;
        };
        const onUp = (e: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          if (s.hasPointerCapture(e.pointerId)) s.releasePointerCapture(e.pointerId);
          if (!moved) return;
          // re-enable snap and settle on the nearest locker
          const left = s.scrollLeft;
          s.style.scrollSnapType = "";
          s.style.cursor = "";
          s.scrollLeft = left;
          s.scrollBy({ left: 0, behavior: "smooth" });
        };
        const onClick = (e: MouseEvent) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
            moved = false;
          }
        };
        const noDragImg = (e: DragEvent) => e.preventDefault();
        s.addEventListener("pointerdown", onDown);
        s.addEventListener("pointermove", onMove);
        s.addEventListener("pointerup", onUp);
        s.addEventListener("pointercancel", onUp);
        s.addEventListener("click", onClick, true);
        s.addEventListener("dragstart", noDragImg);
        return () => {
          s.removeEventListener("scroll", onScroll);
          s.removeEventListener("pointerdown", onDown);
          s.removeEventListener("pointermove", onMove);
          s.removeEventListener("pointerup", onUp);
          s.removeEventListener("pointercancel", onUp);
          s.removeEventListener("click", onClick, true);
          s.removeEventListener("dragstart", noDragImg);
          s.style.scrollSnapType = "";
          s.style.cursor = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );
}
