"use client";
/**
 * Welcome intro: the opening of the site, shown once per session.
 *
 * Contract with the hero: a pre-paint script in layout.tsx sets <html data-intro="pending"> when
 * the intro will play (INTRO_BOOT below). The intro switches it to "running", and when it pushes into
 * the hero it ALWAYS dispatches "viva:intro-done" and removes data-intro (also on skip and reduced
 * motion). If the intro was already seen this session, data-intro is never set and the hero starts
 * immediately.
 *
 * Sequence now: strips flicker on → the logo builds (head lit, VIVA left to right) → light sweep →
 * PREMIUM GYM letter-spaces in, rules draw outward → "Step in →" → the logo shrinks and flies into the
 * nav logo (top-left) while the hero lights up underneath.
 * TODO(phase 4, after the bull stills are approved): the galloping bull + morph replace the
 * "logo builds" beat; see docs/PLAN.md and brand/geometry.ts.
 */
import { useEffect, useRef, useState } from "react";
import "./brand/intro.css";
import { gsap, getLenis, prefersReducedMotion } from "@/lib/motion";
import { INTRO_DONE, INTRO_KEY } from "@/lib/intro";
import Logo from "./Logo";
import LightStrip from "./LightStrip";
import { useSound } from "./Sound";

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [strips, setStrips] = useState<"off" | "on">("off");
  const [gone, setGone] = useState(false);
  const [ready, setReady] = useState(false);
  const sound = useSound();
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  const api = useRef<{ skip: () => void; enter: () => void } | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (html.dataset.intro !== "pending" || !el) return;

    html.dataset.intro = "running";
    const reduced = prefersReducedMotion();
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => getLenis()?.stop());
    const q = gsap.utils.selector(el);

    // ── loading readout: real signals (fonts, window load), paced by the timeline ──
    let loaded = 0;
    const bump = (n: number) => (loaded = Math.min(1, loaded + n));
    document.fonts?.ready.then(() => bump(0.4));
    if (document.readyState === "complete") bump(0.6);
    else window.addEventListener("load", () => bump(0.6), { once: true });
    const counter = { v: 0 };
    let doneAt = 0;
    const pct = el.querySelector<HTMLElement>(".it-pct");
    const tick = () => {
      const target = Math.min(loaded, 0.08 + tl.progress()) * 100;
      counter.v += (target - counter.v) * 0.12;
      if (pct) pct.textContent = String(Math.round(counter.v));
      // after the sequence, wait at most ~2.5 s for slow resources; the site is usable by then
      if (tl.progress() === 1 && !doneAt) doneAt = performance.now();
      if (doneAt && performance.now() - doneAt > 2500) loaded = 1;
      if (counter.v > 99.4 && doneAt && !stepShown) showStep();
    };

    // ── hand-off into the hero ──
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      window.dispatchEvent(new Event(INTRO_DONE));
      delete html.dataset.intro;
      getLenis()?.start();
      setGone(true);
    };

    let pushing = false;
    const push = () => {
      if (pushing) return;
      pushing = true;
      auto?.kill();
      tl.progress(1);
      // the hero starts lighting up underneath while the logo flies home to the nav
      window.dispatchEvent(new Event(INTRO_DONE));
      // "landing": the nav shows, but its own logo waits until ours arrives (see intro.css)
      html.dataset.intro = "landing";

      const from = el.querySelector<SVGSVGElement>(".it-logo svg, .it-logo img");
      const to = document.querySelector<HTMLElement | SVGSVGElement>(".site-nav .viva-logo, .site-nav a img");
      const a = from?.getBoundingClientRect();
      const b = to?.getBoundingClientRect();
      if (reduced || !a || !b || !a.width || !b.width) {
        gsap.to(el, { opacity: 0, duration: 0.6, ease: "none", onComplete: finish });
        return;
      }

      // FLIP: same SVG, same viewBox, so one translate + scale lands it exactly on the nav logo
      gsap
        .timeline({ onComplete: finish })
        .to(q(".it-ui"), { opacity: 0, duration: 0.25 }, 0)
        .to(q(".it-strips"), { opacity: 0, y: -40, duration: 0.6, ease: "power2.in" }, 0)
        .to(q(".it-backdrop, .it-dust"), { opacity: 0, duration: 0.9, ease: "power1.inOut" }, 0.15)
        .to(q(".it-logo"), { filter: "drop-shadow(0 0 0px rgb(200 164 107 / 0))", duration: 0.6 }, 0.2)
        .to(
          from,
          {
            x: b.left - a.left,
            y: b.top - a.top,
            scale: b.width / a.width,
            transformOrigin: "0 0",
            duration: 1.05,
            ease: "power3.inOut",
          },
          0.1,
        );
    };

    let stepShown = false;
    let auto: gsap.core.Tween | null = null;
    const showStep = () => {
      stepShown = true;
      setReady(true);
      gsap.fromTo(q(".it-step"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      auto = gsap.delayedCall(1.2 + 2.4, push); // waits for a click, then steps in on its own
    };

    // ── the sequence ──
    const L = q(".lg-letter");
    const tl = gsap.timeline({ paused: true });
    gsap.set(q(".lg-head"), { opacity: 0 });
    gsap.set(L, { opacity: 0 });
    gsap.set(q(".lg-sub-ch"), { opacity: 0 });
    gsap.set([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 0 });
    gsap.set(q(".lg-rule-l"), { transformOrigin: "100% 50%" });
    gsap.set(q(".lg-rule-r"), { transformOrigin: "0% 50%" });

    if (reduced) {
      gsap.set([q(".lg-head"), L, q(".lg-sub-ch")], { opacity: 1 });
      gsap.set([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 1 });
      tl.call(() => setStrips("on"), [], 0).fromTo(q(".it-logo"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, 0);
    } else {
      tl.call(() => {
        setStrips("on");
        soundRef.current.click();
      }, [], 0.25)
        // head emerges from the dark first, then VIVA builds left to right
        .fromTo(q(".lg-head"), { opacity: 0, filter: "brightness(0.2)" }, { opacity: 1, filter: "brightness(1)", duration: 0.9, ease: "power2.out" }, 1.0)
        .fromTo(L, { opacity: 0, y: 26, filter: "brightness(2.2)" }, { opacity: 1, y: 0, filter: "brightness(1)", duration: 0.55, stagger: 0.13, ease: "power3.out" }, 1.35)
        .fromTo(q(".lg-sweep"), { x: 0 }, { x: 1500, duration: 1.0, ease: "power2.inOut" }, 2.2)
        // PREMIUM GYM letter-spaces in: letters start bunched at the centre and spread to their slots
        .fromTo(
          q(".lg-sub-ch"),
          { opacity: 0, x: (_: number, t: Element) => Number((t as SVGElement).dataset.dx) || 0 },
          { opacity: 1, x: 0, duration: 0.95, ease: "power3.out" },
          2.45,
        )
        .to([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 2.55);
    }
    tl.play();
    gsap.ticker.add(tick);

    api.current = {
      skip: () => {
        tl.progress(1);
        push();
      },
      enter: push,
    };
    (el.querySelector(".it-skip") as HTMLElement | null)?.focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      tl.kill();
      auto?.kill();
      if (finished) return;
      // Strict Mode re-runs this effect (cleanup → setup) in development: rewind to "pending" so the
      // next run plays it again. If the intro is really gone, never leave the hero waiting.
      html.dataset.intro = "pending";
      window.setTimeout(() => {
        if (html.dataset.intro === "pending" && !document.querySelector(".intro")) {
          window.dispatchEvent(new Event(INTRO_DONE));
          delete html.dataset.intro;
          getLenis()?.start();
        }
      }, 0);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="intro" role="dialog" aria-modal="true" aria-label="Welcome to Viva Premium Gym">
      <div className="it-backdrop" aria-hidden />
      <div className="it-strips" aria-hidden>
        <LightStrip state={strips} delay={0} length="78%" />
        <LightStrip state={strips} delay={0.3} length="64%" />
        <LightStrip state={strips} delay={0.6} length="50%" />
      </div>
      <div className="it-dust" aria-hidden />

      <div className="it-stage">
        <div className="it-logo">
          <Logo sheen={false} className="w-[min(86vw,760px)]" />
        </div>
      </div>

      <div className="it-ui">
        <button type="button" className="it-skip" onClick={() => api.current?.skip()}>
          Skip intro
        </button>
        <p className="it-counter" aria-hidden>
          Warming up the floor… <span className="it-pct">0</span>%
        </p>
        <div className="it-step-wrap">
          <button type="button" className="it-step btn btn-gold btn-md" data-cursor="Enter" tabIndex={ready ? 0 : -1} onClick={() => api.current?.enter()}>
            <span className="btn-inner">Step in →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
