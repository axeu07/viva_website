"use client";
/**
 * 04 Classes: THE STUDIO SCOREBOARD. A SAMPLE timetable: flip-clock times, big condensed class
 * names, room/duration in mono and an intensity meter. Today's tab shows a live NOW line (IST) and
 * a pulsing NEXT UP badge. Switching days flips the digits. Mouse: a video preview follows the cursor.
 */
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "@/lib/motion";
import { istNow } from "@/lib/hours";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { scoreboard, sectionById } from "@/lib/content";
import { LoopVideo } from "./Media";
import { MicroLabel, Tag } from "./ui";
import SignalBars from "./SignalBars";
import Section from "./Section";
import "@/styles/scoreboard.css";

const meta = sectionById("classes");
const PREVIEWS = ["class-lead", "class-wide", "trainer"];
const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3);
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Flip-clock time. Each digit remounts when the day changes, which replays its flip. */
function Flip({ value, k }: { value: string; k: string }) {
  return (
    <span className="fd" role="img" aria-label={value}>
      {value.split("").map((c, i) =>
        c === ":" ? (
          <span key={i} className="fd-sep" aria-hidden>
            :
          </span>
        ) : (
          <span key={`${k}-${i}-${c}`} className="fd-cell" style={{ animationDelay: `${i * 60}ms` }} aria-hidden>
            {c}
          </span>
        ),
      )}
    </span>
  );
}

function NowLine({ mins }: { mins: number }) {
  return (
    <div className="sb-now">
      <span className="sb-now-dot" aria-hidden />
      Now · {fmt(mins)} IST
      <span className="sb-now-rule" aria-hidden />
    </div>
  );
}

export default function Classes() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [day, setDay] = useState(0);
  const [now, setNow] = useState<{ day: number; mins: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const move = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  // IST clock, read after mount (no hydration mismatch). Opens on today's tab (Sunday → Monday).
  useEffect(() => {
    const first = istNow();
    /* eslint-disable react-hooks/set-state-in-effect -- syncing with an external clock */
    setNow(first);
    if (first.day >= 1) setDay(first.day - 1);
    /* eslint-enable react-hooks/set-state-in-effect */
    const id = setInterval(() => setNow(istNow()), 30_000);
    return () => clearInterval(id);
  }, []);

  const live = fine && !reduced;
  useEffect(() => {
    if (!live || !preview.current) return;
    move.current = {
      x: gsap.quickTo(preview.current, "x", { duration: 0.45, ease: "power3.out" }),
      y: gsap.quickTo(preview.current, "y", { duration: 0.45, ease: "power3.out" }),
    };
  }, [live]);

  const slots = scoreboard.schedule[day];
  const isToday = now !== null && now.day === day + 1;
  const nextIdx = isToday ? slots.findIndex((s) => toMin(s.time) > now.mins) : -1;
  const showNow = isToday && now.mins >= 5 * 60 && now.mins < 22 * 60;
  const nowAt = showNow ? (nextIdx === -1 ? slots.length : nextIdx) : -1;

  const onMove = (e: MouseEvent) => {
    move.current?.x(e.clientX + 24);
    move.current?.y(e.clientY - 120);
  };

  return (
    <Section id="classes" time={meta.time} label={meta.label} showLabel={false} className="scoreboard">
      <div className="mx-auto px-4 pt-28 pb-28 sm:px-8 md:pt-36 md:pb-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <header className="max-w-xl">
            <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
            <h2 className="headline mt-6 text-[clamp(38px,4.8vw,68px)] font-bold tracking-[0.02em] text-ink">{scoreboard.heading}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{scoreboard.sub}</p>
          </header>
          <Tag>Sample timetable</Tag>
        </div>

        <div className="sb-board mt-12">
          <div role="tablist" aria-label="Day" className="sb-tabs">
            {scoreboard.days.map((d, i) => (
              <button key={d} role="tab" type="button" aria-selected={day === i} className="sb-tab" onClick={() => setDay(i)}>
                {d}
                {now?.day === i + 1 && (
                  <span className="sb-today">
                    <span className="sr-only">(today)</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          <ol className="sb-rows" role="tabpanel" aria-label={`${scoreboard.days[day]} classes`} onMouseMove={live ? onMove : undefined} onMouseLeave={() => setHover(null)}>
            {slots.map((s, i) => (
              <li key={i}>
                {nowAt === i && <NowLine mins={now!.mins} />}
                <div className={`sb-row ${nextIdx === i ? "is-next" : ""}`} data-cursor={live ? "Play" : undefined} onMouseEnter={() => live && setHover(s.video)}>
                  <Flip value={s.time} k={String(day)} />
                  <div className="sb-name-wrap">
                    <p className="sb-name">{s.name}</p>
                    {nextIdx === i && <span className="sb-next">Next up</span>}
                  </div>
                  <p className="sb-meta">
                    {s.room} · {s.mins} min · until {fmt(toMin(s.time) + s.mins)}
                  </p>
                  <div className="sb-int">
                    <SignalBars level={s.intensity} />
                  </div>
                </div>
              </li>
            ))}
            {nowAt === slots.length && (
              <li>
                <NowLine mins={now!.mins} />
              </li>
            )}
          </ol>
        </div>
      </div>

      {live && (
        <div ref={preview} className={`sb-preview ${hover ? "is-on" : ""}`} aria-hidden>
          {PREVIEWS.map((id) => (
            <div key={id} className="sb-pv" style={{ opacity: hover === id ? 1 : 0 }}>
              <LoopVideo id={id} play={hover === id} />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
