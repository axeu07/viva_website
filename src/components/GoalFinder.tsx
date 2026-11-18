"use client";
/**
 * 02 Your goal: THE TREADMILL CONSOLE.
 * A dark-glass console: LED dot-matrix display, five glowing goal keys (a radio group),
 * an intensity signal meter and a PROGRAM readout. Choosing a goal scrolls the program name
 * across the display, sets the bars and light-wipes the portrait screen to matching footage.
 * START runs the belt, stores the goal for the enquiry form and scrolls there.
 */
import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, scrollToTarget } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useLightWipe } from "@/lib/useLightWipe";
import { setGoalPrefill } from "@/lib/booking";
import { goalConsole, sectionById, type GoalId } from "@/lib/content";
import { LoopVideo, Picture } from "./Media";
import { MicroLabel, Tag } from "./ui";
import SignalBars from "./SignalBars";
import Button from "./Button";
import { useSound } from "./Sound";
import "@/styles/console.css";

const meta = sectionById("goals");
const GOALS = goalConsole.goals;
const IDLE_SCREEN = 1; // show the gym floor until a goal is chosen

export default function GoalFinder() {
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 639px)");
  const sound = useSound();
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const [running, setRunning] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const belt = useRef<HTMLSpanElement>(null);
  const keys = useRef<(HTMLButtonElement | null)[]>([]);

  const index = goalId ? GOALS.findIndex((g) => g.id === goalId) : -1;
  const goal = index >= 0 ? GOALS[index] : null;
  const shown = index >= 0 ? index : IDLE_SCREEN;
  useLightWipe(screen, shown, reduced);

  const choose = (i: number) => {
    setGoalId(GOALS[i].id);
    sound.click();
  };

  // radio-group keyboard: arrows move and select, like native radios
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + GOALS.length) % GOALS.length;
    choose(n);
    keys.current[n]?.focus();
  };

  const start = () => {
    if (!goal || running) return;
    setGoalPrefill(goal.label);
    setRunning(true);
    const go = () => {
      setRunning(false);
      scrollToTarget("#book");
    };
    if (reduced || !belt.current) return go();
    gsap.fromTo(belt.current, { backgroundPositionX: "0px" }, { backgroundPositionX: "-360px", duration: 1.1, ease: "power2.in", onComplete: go });
  };

  // mobile: skip the belt animation, just prefill (if any) and go
  const bookNow = () => {
    if (goal) setGoalPrefill(goal.label);
    sound.click();
    scrollToTarget("#book");
  };

  const display = goal ? `Program ▸ ${goal.program} · Intensity ${goal.intensity}/5 · ` : "Select a goal to begin · ";
  const focusIndex = index >= 0 ? index : 0;
  const caption = goal ? `On screen · ${goal.label}` : "On screen · The gym floor";

  const screenEl = (
    <div ref={screen} className="tc-screen" aria-hidden>
      {GOALS.map((g, i) => (
        <div key={g.id} className="lw-layer" style={{ opacity: i === shown ? 1 : 0 }}>
          {g.media.video ? (
            <LoopVideo id={g.media.video} play={i === shown} className="h-full w-full object-cover" />
          ) : (
            <Picture id={g.media.photo!} alt="" className="block h-full w-full" imgClassName="h-full w-full object-cover" sizes={mobile ? "100vw" : "340px"} />
          )}
        </div>
      ))}
      <span className="lw-line" />
    </div>
  );

  return (
    <section id="goals" data-clock={meta.time} data-clock-label={meta.label} className="goal-console relative">
      <div className="mx-auto px-4 pt-10 pb-28 sm:px-8 sm:pt-28 md:pt-36 md:pb-36">
        <header className="max-w-2xl">
          <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
          <h2 className="headline mt-6 text-[clamp(38px,4.8vw,68px)] font-bold tracking-[0.02em] text-ink">{goalConsole.heading}</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{goalConsole.sub}</p>
        </header>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          {/* the console */}
          <div className={`tc ${running ? "is-running" : ""}`}>
            <div className="tc-top">
              <span>Viva · Program select</span>
              <span className="tc-state">
                <span aria-hidden className="tc-led" data-on={!!goal} />
                {running ? "Starting" : goal ? "Ready" : "Standby"}
              </span>
            </div>

            <div className="tc-display" aria-live="polite">
              <span className="sr-only">{goal ? `Program: ${goal.program}. Intensity ${goal.intensity} of 5.` : "No goal selected."}</span>
              <div key={display} className="tc-marquee" aria-hidden>
                <span>{display.repeat(3)}</span>
                <span>{display.repeat(3)}</span>
              </div>
            </div>

            <div role="radiogroup" aria-label="Your goal" className="tc-keys">
              {GOALS.map((g, i) => (
                <button
                  key={g.id}
                  ref={(el) => {
                    keys.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={goalId === g.id}
                  tabIndex={i === focusIndex ? 0 : -1}
                  className={`tc-key ${g.id === "starting" ? "tc-key-wide" : ""}`}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span aria-hidden className="tc-key-led" />
                  {g.label}
                </button>
              ))}
            </div>

            {mobile ? (
              /* mobile: the footage replaces the readout, with a small trial button on it */
              <figure className="tc-mobile-screen">
                {screenEl}
                <figcaption className="tc-mobile-caption">
                  <span aria-hidden className="status-dot" />
                  {caption}
                </figcaption>
                <Button onClick={bookNow} size="sm" cursor="Book" className="tc-mobile-book">
                  Book free trial <span aria-hidden>→</span>
                </Button>
              </figure>
            ) : (
              <>
                <div className="tc-readout">
                  <div className="tc-meter">
                    <span className="tc-label">Intensity</span>
                    <SignalBars level={goal?.intensity ?? 0} />
                  </div>
                  <dl className="tc-program">
                    {(["classes", "equipment", "recovery"] as const).map((k) => (
                      <div key={k}>
                        <dt className="tc-label">{k}</dt>
                        <dd>{goal ? goal[k].join(" · ") : "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  <Tag className="tc-tag">Sample program</Tag>
                </div>

                <div className="tc-foot">
                  <Button onClick={start} disabled={!goal || running} cursor="Start" className="tc-start" aria-describedby="tc-start-hint">
                    {goal ? goalConsole.start : "Pick a goal first"} <span aria-hidden>→</span>
                  </Button>
                  <p id="tc-start-hint" className="sr-only">
                    Pre-fills your goal in the enquiry form and scrolls to it.
                  </p>
                  <span ref={belt} aria-hidden className="tc-belt" />
                </div>
              </>
            )}
          </div>

          {/* desktop/tablet: the big portrait screen beside it */}
          {!mobile && (
            <figure className="tc-screen-wrap">
              {screenEl}
              <figcaption className="tc-caption">
                <span aria-hidden className="status-dot" />
                {caption}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
