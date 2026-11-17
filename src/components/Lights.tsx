"use client";
/**
 * Site-wide lights. A physical wall switch (fixed bottom-right) turns the whole gym's lights
 * off and on. Lights off: media, text and strips go dark; only neon and exit-green micro-labels
 * stay lit, and the cursor becomes a flashlight that reveals the room. Lights on comes back
 * with a flicker. State lives on <html> as .lights-off so every section reacts via CSS.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { useSound } from "./Sound";

type LightsApi = { on: boolean; toggle: () => void };
const LightsContext = createContext<LightsApi>({ on: true, toggle: () => {} });
export const useLights = () => useContext(LightsContext);

export function LightsProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(true);
  const sound = useSound();
  const reduced = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    const html = document.documentElement;
    if (first.current) {
      first.current = false;
      return;
    }
    html.classList.toggle("lights-off", !on);
    if (on && !reduced) {
      html.classList.add("lights-flicker");
      const t = setTimeout(() => html.classList.remove("lights-flicker"), 900);
      return () => clearTimeout(t);
    }
  }, [on, reduced]);

  const toggle = useCallback(() => {
    sound.click();
    setOn((v) => !v);
  }, [sound]);

  const api = useMemo(() => ({ on, toggle }), [on, toggle]);
  return (
    <LightsContext.Provider value={api}>
      {children}
      <LightSwitch />
      <Flashlight />
    </LightsContext.Provider>
  );
}

/** The chunky wall-plate rocker switch. */
function LightSwitch() {
  const { on, toggle } = useLights();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Gym lights"
      title={on ? "Switch the lights off" : "Switch the lights on"}
      data-cursor="Flip"
      className="wall-switch"
      data-on={on}
      onClick={toggle}
    >
      <span className="ws-plate">
        <i className="ws-screw" aria-hidden />
        <span className="ws-well" aria-hidden>
          <span className="ws-rocker" />
        </span>
        <i className="ws-screw" aria-hidden />
      </span>
    </button>
  );
}

/**
 * Flashlight beam for lights-off mode (pointer, touch point, or focused element).
 * Two parts: a soft warm `screen` pool that lights the wall and lifts dimmed text, and per-media
 * masks: every visible photo/video gets --mx/--my (beam centre in its own box), so inside the
 * beam the room shows in true colour and outside it falls to black.
 */
function Flashlight() {
  const { on } = useLights();
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    // measure on-screen media each frame we need it (only while the lights are off)
    let raf = 0;
    const write = () => {
      raf = 0;
      el.style.setProperty("--fx", `${pos.x}px`);
      el.style.setProperty("--fy", `${pos.y}px`);
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".media-lit").forEach((m) => {
        const r = m.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh || r.width === 0) return;
        m.style.setProperty("--mx", `${pos.x - r.left}px`);
        m.style.setProperty("--my", `${pos.y - r.top}px`);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    const onScroll = schedule;
    window.addEventListener("scroll", onScroll, { passive: true });
    const to = (x: number, y: number, d = 0.35) => gsap.to(pos, { x, y, duration: d, ease: "power3.out", overwrite: true, onUpdate: schedule });
    const move = (e: PointerEvent) => to(e.clientX, e.clientY, e.pointerType === "mouse" ? 0.25 : 0.4);
    const focus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.getBoundingClientRect) return;
      const r = t.getBoundingClientRect();
      to(r.left + r.width / 2, r.top + r.height / 2, 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("focusin", focus);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", focus);
      cancelAnimationFrame(raf);
      document.querySelectorAll<HTMLElement>(".media-lit").forEach((m) => {
        m.style.removeProperty("--mx");
        m.style.removeProperty("--my");
      });
      gsap.killTweensOf(pos);
    };
  }, [on]);

  return <div ref={ref} aria-hidden className={`flashlight ${fine ? "is-fine" : "is-touch"}`} />;
}
