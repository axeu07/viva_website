/**
 * Shared motion setup: GSAP plugin registration, the Lenis instance, day-clock maths,
 * the colour-temperature curve and the light-strip flicker.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── Lenis singleton (set by <SmoothScroll />) ───────────────────────────────
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Scroll to a section id or element, through Lenis when it's running. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target.startsWith("#") ? target : `#${target}`) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

// ── Day clock ───────────────────────────────────────────────────────────────
export const DAY_START = 5 * 60; // 05:00
export const DAY_END = 22 * 60; // 22:00

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatClock = (mins: number) => {
  const m = Math.round(Math.min(DAY_END, Math.max(DAY_START, mins)));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** 0 at 05:00, 1 at 22:00 */
export const dayProgress = (mins: number) => (mins - DAY_START) / (DAY_END - DAY_START);

// ── Colour temperature follows the clock ────────────────────────────────────
// cool and dark at dawn → gold sunlight by midday → warm amber evening → the gym's white-gold lights at night
type Stop = { at: number; tint: [number, number, number]; tintA: number; dark: number; sunA: number; sunAngle: number };
const STOPS: Stop[] = [
  { at: toMinutes("05:00"), tint: [70, 98, 160], tintA: 0.11, dark: 0.16, sunA: 0.0, sunAngle: 28 },
  { at: toMinutes("06:30"), tint: [255, 170, 110], tintA: 0.04, dark: 0.08, sunA: 0.22, sunAngle: 26 },
  { at: toMinutes("09:00"), tint: [255, 196, 120], tintA: 0.045, dark: 0.03, sunA: 0.34, sunAngle: 34 },
  { at: toMinutes("12:30"), tint: [255, 206, 128], tintA: 0.055, dark: 0.0, sunA: 0.42, sunAngle: 44 },
  { at: toMinutes("16:30"), tint: [255, 160, 70], tintA: 0.065, dark: 0.0, sunA: 0.36, sunAngle: 56 },
  { at: toMinutes("18:30"), tint: [255, 128, 48], tintA: 0.07, dark: 0.04, sunA: 0.18, sunAngle: 64 },
  { at: toMinutes("20:00"), tint: [255, 226, 180], tintA: 0.035, dark: 0.04, sunA: 0.0, sunAngle: 66 },
  { at: toMinutes("22:00"), tint: [255, 236, 200], tintA: 0.03, dark: 0.08, sunA: 0.0, sunAngle: 66 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function temperatureAt(mins: number) {
  let i = STOPS.findIndex((s) => s.at > mins);
  if (i === -1) i = STOPS.length - 1;
  if (i === 0) i = 1;
  const a = STOPS[i - 1];
  const b = STOPS[i];
  const t = Math.min(1, Math.max(0, (mins - a.at) / (b.at - a.at)));
  return {
    tint: a.tint.map((v, k) => Math.round(lerp(v, b.tint[k], t))) as [number, number, number],
    tintA: lerp(a.tintA, b.tintA, t),
    dark: lerp(a.dark, b.dark, t),
    sunA: lerp(a.sunA, b.sunA, t),
    sunAngle: lerp(a.sunAngle, b.sunAngle, t),
  };
}

/**
 * Write the clock state to CSS variables on <html> so any layer can react to it.
 * Each write to <html> restyles the whole page, and this runs on every scroll frame (often twice),
 * so a variable is only written when its value actually changed.
 */
const lastTemp: Record<string, string> = {};
export function applyTemperature(mins: number) {
  const s = temperatureAt(mins);
  const r = document.documentElement.style;
  const set = (k: string, v: string) => {
    if (lastTemp[k] === v) return;
    lastTemp[k] = v;
    r.setProperty(k, v);
  };
  set("--tint", s.tint.join(" "));
  set("--tint-a", s.tintA.toFixed(3));
  set("--dark-a", s.dark.toFixed(3));
  set("--sun-a", s.sunA.toFixed(3));
  set("--sun-angle", s.sunAngle.toFixed(2));
  set("--day", dayProgress(mins).toFixed(4));
}

// ── Light-strip flicker (real tube-light start-up: two quick flickers, then steady) ──
export function flickerOn(el: Element, { delay = 0, reduced = prefersReducedMotion() } = {}) {
  if (reduced) return gsap.to(el, { opacity: 1, duration: 0.4, delay, ease: "none" });
  return gsap
    .timeline({ delay })
    .set(el, { opacity: 0 })
    .to(el, { opacity: 0.85, duration: 0.04, ease: "none" })
    .to(el, { opacity: 0.08, duration: 0.07, ease: "none" })
    .to(el, { opacity: 1, duration: 0.03, ease: "none" })
    .to(el, { opacity: 0.12, duration: 0.12, ease: "none" })
    .to(el, { opacity: 0.9, duration: 0.03, ease: "none" })
    .to(el, { opacity: 0.45, duration: 0.06, ease: "none" })
    .to(el, { opacity: 1, duration: 0.35, ease: "power2.out" });
}

export function switchOff(el: Element, { delay = 0, reduced = prefersReducedMotion() } = {}) {
  if (reduced) return gsap.to(el, { opacity: 0, duration: 0.3, delay, ease: "none" });
  return gsap
    .timeline({ delay })
    .to(el, { opacity: 0.3, duration: 0.05, ease: "none" })
    .to(el, { opacity: 0.8, duration: 0.04, ease: "none" })
    .to(el, { opacity: 0, duration: 0.5, ease: "power2.in" });
}
