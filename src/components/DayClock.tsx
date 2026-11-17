"use client";
/**
 * Fixed day clock (bottom-left): runs 05:00 → 22:00 as you scroll, with a thin progress arc.
 * Each <Section data-clock="HH:MM"> is a waypoint: the clock reads that time when the section's
 * top reaches 40% of the viewport, and interpolates in between. It also drives the page's
 * colour temperature (see applyTemperature in lib/motion).
 */
import { useEffect, useRef } from "react";
import { ScrollTrigger, applyTemperature, dayProgress, formatClock, toMinutes, DAY_END, DAY_START } from "@/lib/motion";

const R = 17;
const C = 2 * Math.PI * R;

type Mark = { at: number; mins: number; label: string };

export default function DayClock() {
  const timeRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let marks: Mark[] = [];
    let maxScroll = 1;
    let lastLabel = "";

    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      let prev = 0;
      marks = Array.from(document.querySelectorAll<HTMLElement>("[data-clock]")).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const at = Math.min(maxScroll, Math.max(prev, top - window.innerHeight * 0.4));
        prev = at;
        return { at, mins: toMinutes(el.dataset.clock!), label: el.dataset.clockLabel ?? "" };
      });
    };

    const update = () => {
      const y = window.scrollY;
      let mins = DAY_START;
      let label = marks[0]?.label ?? "";
      if (marks.length) {
        const i = marks.findLastIndex((m) => m.at <= y);
        if (i === -1) {
          mins = marks[0].mins;
        } else {
          const a = marks[i];
          const b = marks[i + 1] ?? { at: maxScroll, mins: DAY_END, label: a.label };
          const t = b.at > a.at ? Math.min(1, (y - a.at) / (b.at - a.at)) : 1;
          mins = a.mins + (b.mins - a.mins) * t;
          label = a.label;
        }
      }
      const text = formatClock(mins);
      if (timeRef.current && timeRef.current.textContent !== text) timeRef.current.textContent = text;
      if (labelRef.current && label !== lastLabel) {
        labelRef.current.textContent = label;
        lastLabel = label;
      }
      const p = Math.min(1, Math.max(0, dayProgress(mins)));
      arcRef.current?.setAttribute("stroke-dashoffset", String(C * (1 - p)));
      if (dotRef.current) {
        const ang = -Math.PI / 2 + p * Math.PI * 2;
        dotRef.current.setAttribute("cx", String(20 + R * Math.cos(ang)));
        dotRef.current.setAttribute("cy", String(20 + R * Math.sin(ang)));
      }
      applyTemperature(mins);
    };

    const onRefresh = () => {
      measure();
      update();
    };
    measure();
    update();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });
    window.addEventListener("scroll", update, { passive: true }); // covers reduced-motion (no Lenis)
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      st.kill();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div aria-hidden className="day-clock">
      <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
        <circle cx="20" cy="20" r={R} fill="none" stroke="rgb(255 244 220 / 0.14)" strokeWidth="1" />
        <circle
          ref={arcRef}
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="url(#dc-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          transform="rotate(-90 20 20)"
        />
        <circle ref={dotRef} cx="20" cy={20 - R} r="2" fill="var(--light)" className="dc-dot" />
        <defs>
          <linearGradient id="dc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2D48A" />
            <stop offset="1" stopColor="#9C7631" />
          </linearGradient>
        </defs>
      </svg>
      <span className="flex flex-col leading-none">
        <span ref={timeRef} className="dc-time">
          05:00
        </span>
        <span ref={labelRef} className="dc-label">
          Lights on
        </span>
      </span>
    </div>
  );
}
