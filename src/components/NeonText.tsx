"use client";
/**
 * Neon type. Starts as a faint 1px outline (unlit tube); when lit, letters ignite one at a time
 * with a real-tube flicker (two quick dips, then steady) and a layered glow.
 *
 * mode="view": ignites the first time it scrolls into view.
 * mode="manual": controlled by the `lit` prop (hero timeline, pinned neon wall).
 * Screen readers get the plain text; the per-letter spans are aria-hidden.
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { ScrollTrigger } from "@/lib/motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  tone?: "ivory" | "gold";
  mode?: "view" | "manual";
  lit?: boolean;
  /** seconds before the first letter */
  delay?: number;
  /** seconds between letters */
  stagger?: number;
  className?: string;
  style?: CSSProperties;
};

export default function NeonText({ text, as = "span", tone = "ivory", mode = "view", lit = false, delay = 0, stagger = 0.07, className = "", style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const on = mode === "manual" ? lit : inView;

  useEffect(() => {
    if (mode !== "view" || !ref.current) return;
    const st = ScrollTrigger.create({ trigger: ref.current, start: "top 80%", once: true, onEnter: () => setInView(true) });
    return () => st.kill();
  }, [mode]);

  let i = 0;
  const words = text.split(" ");
  const chars = words.map((w, wi) => (
    <span key={wi} className="nw">
      {Array.from(w).map((c) => (
        <span key={i} className="nc" style={{ ["--i" as string]: i++ }}>
          {c}
        </span>
      ))}
      {wi < words.length - 1 && <span className="nsp"> </span>}
    </span>
  ));

  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={`neon neon-${tone} ${on ? "is-on" : ""} ${className}`}
      style={{ ["--d0" as string]: `${delay}s`, ["--st" as string]: `${stagger}s`, ...style }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="neon-chars">
        {chars}
      </span>
    </Tag>
  );
}
