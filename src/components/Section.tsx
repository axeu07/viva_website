"use client";
/**
 * Page section with a clock time. Every section starts darker and gets lit as it enters view
 * ("light is the reveal"). reveal="wipe" adds a light-wipe: a bright horizontal line sweeps
 * down, uncovering the section behind it.
 */
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  id: string;
  time: string;
  label: string;
  children: ReactNode;
  className?: string;
  reveal?: "lit" | "wipe" | "none";
  /** render the "06:30 Our story" label at the top */
  showLabel?: boolean;
};

export function SectionLabel({ time, label, className = "" }: { time: string; label: string; className?: string }) {
  return (
    <p className={`section-label ${className}`}>
      <span className="sl-time">{time}</span>
      <span className="sl-rule" aria-hidden />
      <span>{label}</span>
    </p>
  );
}

export default function Section({ id, time, label, children, className = "", reveal = "lit", showLabel = true }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      // .is-lit triggers the light sweep on .lit-sweep words inside the section
      ScrollTrigger.create({ trigger: el, start: "top 65%", once: true, onEnter: () => el.classList.add("is-lit") });
      if (reveal === "none") return;
      const shade = el.querySelector<HTMLElement>(":scope > .section-shade");
      if (shade) {
        if (reduced) {
          gsap.fromTo(shade, { opacity: 0.7 }, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 75%", once: true } });
        } else {
          gsap.fromTo(shade, { opacity: 0.88 }, { opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 30%", scrub: true } });
        }
      }
      if (reveal === "wipe" && !reduced) {
        const body = el.querySelector<HTMLElement>(":scope > .section-body");
        const line = el.querySelector<HTMLElement>(":scope > .section-wipe");
        if (body && line) {
          const tl = gsap.timeline({ paused: true });
          tl.set(line, { opacity: 1, top: "0%" })
            .fromTo(body, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power2.inOut" }, 0)
            .to(line, { top: "100%", duration: 1.3, ease: "power2.inOut" }, 0)
            .to(line, { opacity: 0, duration: 0.3 }, 1.1)
            .set(body, { clearProps: "clipPath" });
          ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => tl.play() });
        }
      }
    },
    { scope: root, dependencies: [reduced, reveal] },
  );

  return (
    <section ref={root} id={id} data-clock={time} data-clock-label={label} className={`section relative ${className}`}>
      <div className="section-body relative">
        {showLabel && (
          <div className="relative z-[1] mx-auto px-4 pt-14 sm:px-8 lg:pt-20">
            <SectionLabel time={time} label={label} />
          </div>
        )}
        {children}
      </div>
      {reveal === "wipe" && <span aria-hidden className="section-wipe" />}
      {reveal !== "none" && <span aria-hidden className="section-shade" />}
    </section>
  );
}
