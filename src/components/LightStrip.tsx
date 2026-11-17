"use client";
/**
 * A warm-white LED strip: thin glowing line with bloom and a soft reflection on the wall.
 * state="auto": flickers on like a tube light the first time it scrolls into view.
 * state="on" | "off": controlled (intro, booking success, footer switch-off).
 */
import { useEffect, useRef } from "react";
import { flickerOn, switchOff, ScrollTrigger, gsap } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  state?: "auto" | "on" | "off";
  delay?: number;
  /** CSS width, e.g. "100%", "60vw" */
  length?: string;
  vertical?: boolean;
  /** show the soft light pool on the wall */
  reflection?: boolean;
  /** 0–1 brightness multiplier */
  intensity?: number;
  className?: string;
  onLit?: () => void;
};

export default function LightStrip({
  state = "auto",
  delay = 0,
  length = "100%",
  vertical = false,
  reflection = true,
  intensity = 1,
  className = "",
  onLit,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lit = useRef(false);

  useEffect(() => {
    const el = light.current;
    if (!el || !root.current) return;

    if (state === "on") {
      if (!lit.current) {
        lit.current = true;
        const tl = flickerOn(el, { delay, reduced });
        tl.eventCallback("onComplete", () => onLit?.());
      }
      return;
    }
    if (state === "off") {
      if (lit.current) switchOff(el, { delay, reduced });
      else gsap.set(el, { opacity: 0 });
      lit.current = false;
      return;
    }
    // auto: flicker on once when it enters the viewport
    gsap.set(el, { opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 88%",
      once: true,
      onEnter: () => {
        lit.current = true;
        flickerOn(el, { delay, reduced }).eventCallback("onComplete", () => onLit?.());
      },
    });
    return () => st.kill();
    // onLit is a callback prop; re-running on identity change would replay the flicker
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, delay, reduced]);

  return (
    <div
      ref={root}
      aria-hidden
      className={`light-strip ${vertical ? "is-vertical" : ""} ${className}`}
      style={{ [vertical ? "height" : "width"]: length, ["--ls-i" as string]: intensity }}
    >
      <div ref={light} className="ls-light" style={{ opacity: state === "on" ? undefined : 0 }}>
        {reflection && <span className="ls-pool" />}
        <span className="ls-bloom" />
        <span className="ls-core" />
      </div>
    </div>
  );
}
