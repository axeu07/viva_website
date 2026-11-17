"use client";
/**
 * Custom cursor: a small gold dot plus a larger trailing ring.
 * Over [data-cursor="Book"] / "Play" / "Watch" it grows and shows the label;
 * over other links and buttons it just grows. Hidden on touch devices.
 */
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const lag = reduced ? 0.01 : 0.45;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: lag, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: lag, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        html.classList.add("cursor-visible");
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], [role='radio'], label, summary");
      const text = labelled?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      ring.current!.dataset.state = text ? "label" : interactive ? "hover" : "";
      dot.current!.dataset.state = text || interactive ? "hover" : "";
    };

    const leave = () => {
      html.classList.remove("cursor-visible");
      shown = false;
    };
    const down = () => ring.current!.classList.add("is-down");
    const up = () => ring.current!.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-cursor", "cursor-visible");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [fine, reduced]);

  if (!fine) return null;
  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
