/**
 * Shared motion constants and helpers. GSAP/Lenis wiring is added in Phase 3.
 */

export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  flicker: "steps(1)",
} as const;

/** Day clock range: scrolling the page runs from 05:00 to 22:00. */
export const DAY_START_MIN = 5 * 60;
export const DAY_END_MIN = 22 * 60;

export function progressToClock(p: number): string {
  const clamped = Math.min(1, Math.max(0, p));
  const mins = Math.round(DAY_START_MIN + clamped * (DAY_END_MIN - DAY_START_MIN));
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
