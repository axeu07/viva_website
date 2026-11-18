"use client";
/**
 * Welcome intro: the opening of the site, shown once per session. One GSAP timeline:
 *
 *   strips flicker on → a gold bull gallops in from the left (6 leg poses by distance travelled,
 *   motion blur + streaks by speed, hoof dust, a glint along its back) → skid stop on braced forelegs
 *   (dust burst, 150 ms shake); its head settles exactly onto the logo's bull head → the body morphs
 *   into V·I·V·A left to right (MorphSVG), the head never moves → light sweep, PREMIUM GYM spreads
 *   out, rules draw outward → the logo shrinks and flies into the nav logo while the hero lights up.
 *
 * No buttons: it plays and hands over on its own (Esc jumps to the end). Reduced motion: the final
 * logo fades in, then the site.
 *
 * Contract with the hero: a pre-paint script (lib/intro.ts → layout.tsx) sets <html data-intro="pending">.
 * The intro sets "running", then "landing" during the fly-in, ALWAYS dispatches "viva:intro-done", and
 * removes data-intro at the end.
 */
import { useEffect, useId, useRef, useState } from "react";
import "./brand/intro.css";
import { gsap, getLenis, prefersReducedMotion } from "@/lib/motion";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { INTRO_DONE, INTRO_KEY } from "@/lib/intro";
import Logo from "./Logo";
import LightStrip from "./LightStrip";
import BullStage from "./brand/BullStage";
import { useSound } from "./Sound";
import {
  BRACED,
  BRACED_HOOVES,
  GALLOP_FRAMES,
  LETTERS,
  LETTER_ORDER,
  LOGO_VIEWBOX,
  MORPH_MAP,
  TORSO_SLICES,
  gallopBob,
  gallopPose,
  type LegId,
  type Pt,
} from "./brand/geometry";

if (typeof window !== "undefined") gsap.registerPlugin(MorphSVGPlugin);

// the 6 gallop frames are computed once
const FRAMES = Array.from({ length: GALLOP_FRAMES }, (_, i) => {
  const pose = gallopPose(i);
  return { pose, bob: gallopBob(pose) };
});
const STRIDE = 58; // viewBox units travelled per leg pose

type Mote = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);
  const [strips, setStrips] = useState<"off" | "on">("off");
  const [gone, setGone] = useState(false);
  const uid = "bull" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sound = useSound();
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (html.dataset.intro !== "pending" || !el) return;

    html.dataset.intro = "running";
    const reduced = prefersReducedMotion();
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => getLenis()?.stop());
    const q = gsap.utils.selector(el);
    const one = <T extends Element>(s: string) => el.querySelector<T>(s)!;

    // ── loading readout: real signals (fonts, window load), paced by the timeline ──
    let loaded = 0;
    const bump = (n: number) => (loaded = Math.min(1, loaded + n));
    document.fonts?.ready.then(() => bump(0.4));
    if (document.readyState === "complete") bump(0.6);
    else window.addEventListener("load", () => bump(0.6), { once: true });
    const counter = { v: 0 };
    let doneAt = 0;
    const pct = el.querySelector<HTMLElement>(".it-pct");

    // ── hand-off: the logo flies into the nav logo ──
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

    let flying = false;
    const fly = () => {
      if (flying) return;
      flying = true;
      tl.progress(1);
      window.dispatchEvent(new Event(INTRO_DONE)); // the hero lights up underneath
      html.dataset.intro = "landing"; // nav fades in; its own logo waits for ours (intro.css)

      const from = el.querySelector<SVGSVGElement>(".it-logo svg.viva-logo, .it-logo img");
      const to = document.querySelector<HTMLElement | SVGSVGElement>(".site-nav .viva-logo, .site-nav a img");
      const a = from?.getBoundingClientRect();
      const b = to?.getBoundingClientRect();
      if (reduced || !a || !b || !a.width || !b.width) {
        gsap.to(el, { opacity: 0, duration: 0.6, ease: "none", onComplete: finish });
        return;
      }
      // same SVG + viewBox, so one translate + scale lands it exactly on the nav logo
      gsap
        .timeline({ onComplete: finish })
        .to(q(".it-counter"), { opacity: 0, duration: 0.25 }, 0)
        .to(q(".it-strips"), { opacity: 0, y: -40, duration: 0.6, ease: "power2.in" }, 0)
        .to(q(".it-backdrop, .it-dust"), { opacity: 0, duration: 0.9, ease: "power1.inOut" }, 0.15)
        .to(q(".it-logo"), { filter: "drop-shadow(0 0 0px rgb(200 164 107 / 0))", duration: 0.6 }, 0.2)
        .to(from, { x: b.left - a.left, y: b.top - a.top, scale: b.width / a.width, transformOrigin: "0 0", duration: 1.05, ease: "power3.inOut" }, 0.1);
    };

    // ── initial state (also resets after a Strict Mode re-run) ──
    const L = q(".lg-letter");
    gsap.set([q(".lg-head"), L, q(".lg-sub-ch")], { opacity: 0 });
    gsap.set([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 0 });
    gsap.set(q(".lg-rule-l"), { transformOrigin: "100% 50%" });
    gsap.set(q(".lg-rule-r"), { transformOrigin: "0% 50%" });

    const svg = one<SVGSVGElement>(".it-bull");
    const body = one<SVGGElement>(".b-body");
    const motion = one<SVGGElement>(".b-motion");
    const head = one<SVGGElement>(".b-head");
    const blur = one<SVGElement>(".b-blur");
    const streaks = one<SVGGElement>(".b-streaks");
    const legs = Object.fromEntries(Array.from(el.querySelectorAll<SVGPathElement>(".b-leg")).map((p) => [p.dataset.leg, p])) as Record<LegId, SVGPathElement>;
    const slices = Object.fromEntries(Array.from(el.querySelectorAll<SVGPathElement>(".b-slice")).map((p) => [p.dataset.l, p])) as Record<string, SVGPathElement>;
    LETTER_ORDER.forEach((k) => slices[k].setAttribute("d", TORSO_SLICES[k]));
    (Object.keys(legs) as LegId[]).forEach((k) => legs[k].setAttribute("d", FRAMES[0].pose[k].d));
    gsap.set(svg, { opacity: reduced ? 0 : 1 });
    gsap.set([q(".b-tail"), q(".b-facets"), head], { opacity: 1 });
    gsap.set(q(".b-shadow"), { opacity: 1 });
    gsap.set(q(".b-relief"), { attr: { surfaceScale: 30 } });
    motion.setAttribute("filter", `url(#${uid}-blur)`);

    // ── viewBox ↔ screen ──
    const box = svg.getBoundingClientRect();
    const k = box.width / LOGO_VIEWBOX.w || 1;
    const toScreen = ([u, v]: Pt, dx = 0, dy = 0): Pt => [box.left + (u + dx - LOGO_VIEWBOX.x) * k, box.top + (v + dy - LOGO_VIEWBOX.y) * k];
    const startX = -box.left / k - 1080; // the whole bull starts just off-screen left

    // ── dust (one small canvas, only alive while there is dust) ──
    const canvas = dust.current!;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const motes: Mote[] = [];
    const small = window.innerWidth < 640;
    const spawn = ([x, y]: Pt, n: number, spread: number, push: number) => {
      for (let i = 0; i < (small ? Math.ceil(n / 2) : n); i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * spread;
        const s = (0.6 + Math.random()) * push;
        motes.push({ x, y, vx: Math.cos(a) * s - push * 0.6, vy: Math.sin(a) * s * 0.7, life: 0, max: 40 + Math.random() * 40, r: 0.8 + Math.random() * 2.4 });
      }
    };
    const drawDust = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        m.vx *= 0.95;
        m.vy = m.vy * 0.95 - 0.02;
        const t = m.life / m.max;
        if (t >= 1) {
          motes.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(226, 200, 150, ${(0.55 * (1 - t)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * (1 + t * 1.6), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ── the gallop, driven by the timeline through one proxy ──
    const run = { x: startX, bob: 0, pitch: 0, headTilt: -5 };
    let frame = -1;
    let lastX = startX;
    let lastT = performance.now();
    let galloping = true;
    const applyBody = () => {
      gsap.set(body, { x: run.x, y: run.bob, rotation: run.pitch, svgOrigin: "560 300" });
      gsap.set(head, { rotation: run.headTilt, svgOrigin: "905 300" });
    };
    const onRun = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT) / 1000;
      const speed = Math.abs(run.x - lastX) / dt; // units per second
      lastX = run.x;
      lastT = now;
      blur.setAttribute("stdDeviation", `${Math.min(7, speed / 320).toFixed(1)} 0`);
      streaks.setAttribute("opacity", Math.min(0.85, speed / 2600).toFixed(2));
      if (galloping) {
        const f = Math.floor((run.x - startX) / STRIDE) % GALLOP_FRAMES;
        if (f !== frame) {
          frame = f;
          const F = FRAMES[f];
          (Object.keys(legs) as LegId[]).forEach((id) => {
            legs[id].setAttribute("d", F.pose[id].d);
            if (F.pose[id].planted) spawn(toScreen(F.pose[id].hoof, run.x, run.bob), 6, 1.4, 2.2);
          });
          gsap.to(run, { bob: F.bob, headTilt: f % 2 ? -6 : -3, duration: 0.07, ease: "none", overwrite: "auto" });
        }
      }
      applyBody();
    };

    const skid = () => {
      galloping = false;
      (Object.keys(legs) as LegId[]).forEach((id) => legs[id].setAttribute("d", BRACED[id]));
      soundRef.current.click();
    };
    const skidDust = () => BRACED_HOOVES.forEach((h) => spawn(toScreen(h, run.x, run.bob), 3, 1.2, 3.4));
    const stopBurst = () => {
      BRACED_HOOVES.forEach((h) => spawn(toScreen(h, 0, 0), 26, 2.4, 4.2));
      // 150 ms micro camera shake
      gsap.timeline().to(q(".it-stage"), { x: 5, y: -3, duration: 0.03 }).to(q(".it-stage"), { x: -4, y: 2, duration: 0.03 }).to(q(".it-stage"), { x: 3, y: -1, duration: 0.03 }).to(q(".it-stage"), { x: -2, y: 1, duration: 0.03 }).to(q(".it-stage"), { x: 0, y: 0, duration: 0.03 });
    };
    const settle = () => {
      // crisp from here on: no blur filter, no streaks. The logo head (identical, same spot) turns on
      // underneath; the bull's head stays on top until the bull layer cross-fades away.
      motion.removeAttribute("filter");
      streaks.setAttribute("opacity", "0");
      gsap.set(q(".lg-head"), { opacity: 1 });
    };

    const tl = gsap.timeline({ paused: true });
    if (reduced) {
      gsap.set([q(".lg-head"), L, q(".lg-sub-ch")], { opacity: 1 });
      gsap.set([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 1 });
      tl.call(() => setStrips("on"), [], 0)
        .fromTo(q(".it-logo"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, 0)
        .to({}, { duration: 1.2 });
    } else {
      applyBody();
      const T_RUN = 0.55; // gallop starts
      const T_SKID = T_RUN + 1.35; // forelegs brace
      const T_STOP = T_SKID + 0.42; // standing still, head on the logo
      const T_MORPH = T_STOP + 0.28;

      tl.call(() => {
        setStrips("on");
        soundRef.current.click();
      }, [], 0.15)
        // gallop: steady speed across the wall
        .to(run, { x: -70, duration: T_SKID - T_RUN, ease: "none", onUpdate: onRun }, T_RUN)
        // glint runs along the back twice while it gallops
        .fromTo(q(".b-glint"), { attr: { "stroke-dashoffset": 1000 } }, { attr: { "stroke-dashoffset": -80 }, duration: 0.6, repeat: 1, ease: "power1.inOut" }, T_RUN + 0.1)
        // skid: braced forelegs, rear dips, head comes up into the logo pose
        .call(skid, [], T_SKID)
        .to(run, { x: 0, duration: T_STOP - T_SKID, ease: "power3.out", onUpdate: () => (onRun(), skidDust()) }, T_SKID)
        .to(run, { pitch: -2.5, bob: 0, duration: 0.18, ease: "power2.out" }, T_SKID)
        .to(run, { pitch: 0, headTilt: 0, duration: 0.3, ease: "back.out(2)", onUpdate: applyBody }, T_STOP - 0.12)
        .call(stopBurst, [], T_STOP - 0.04)
        .call(settle, [], T_STOP + 0.18)
        // the bull turns into VIVA, left to right; the head never moves
        .to([q(".b-facets"), q(".b-glint")], { opacity: 0, duration: 0.25 }, T_MORPH - 0.2)
        .to(q(".b-shadow"), { opacity: 0, duration: 0.4 }, T_MORPH - 0.2)
        // the sculpted relief flattens as the bull becomes letters, so they match the flat logo gold
        .to(q(".b-relief"), { attr: { surfaceScale: 0 }, duration: 0.9, ease: "power2.inOut" }, T_MORPH)
        .to(q(".b-tail"), { opacity: 0, scaleY: 0.4, svgOrigin: "300 120", duration: 0.35, ease: "power2.in" }, T_MORPH);
      LETTER_ORDER.forEach((l, i) => {
        const { slice, legs: legIds } = MORPH_MAP[l];
        const targets = [slices[slice], ...legIds.map((id) => legs[id])];
        tl.to(targets, { morphSVG: { shape: LETTERS[l], shapeIndex: "auto" }, duration: 0.8, ease: "power2.inOut" }, T_MORPH + i * 0.13);
      });
      const T_LOGO = T_MORPH + 3 * 0.13 + 0.8;
      tl
        // hand the morphed shapes over to the crisp logo letters (identical shapes, logo gold)
        .to(L, { opacity: 1, duration: 0.35, ease: "none" }, T_LOGO - 0.15)
        .to(svg, { opacity: 0, duration: 0.35, ease: "none" }, T_LOGO)
        .fromTo(q(".lg-sweep"), { x: 0 }, { x: 1500, duration: 1.0, ease: "power2.inOut" }, T_LOGO + 0.1)
        .fromTo(q(".lg-sub-ch"), { opacity: 0, x: (_: number, t: Element) => Number((t as SVGElement).dataset.dx) || 0 }, { opacity: 1, x: 0, duration: 0.95, ease: "power3.out" }, T_LOGO + 0.3)
        .to([q(".lg-rule-l"), q(".lg-rule-r")], { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, T_LOGO + 0.4)
        .to({}, { duration: 0.6 }); // a beat to take the logo in
    }

    const tick = () => {
      drawDust();
      const target = Math.min(loaded, 0.08 + tl.progress()) * 100;
      counter.v += (target - counter.v) * 0.12;
      if (pct) pct.textContent = String(Math.round(counter.v));
      if (tl.progress() === 1 && !doneAt) doneAt = performance.now();
      // don't hold the visitor for slow resources: at most ~1.5 s after the sequence
      if (doneAt && performance.now() - doneAt > 1500) loaded = 1;
      if (doneAt && counter.v > 99.4) fly();
    };
    // any key press or click skips straight to the hand-off (accessibility, returning visitors)
    const onKey = () => fly();

    tl.play();
    gsap.ticker.add(tick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onKey);

    return () => {
      window.removeEventListener("pointerdown", onKey);
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      window.removeEventListener("keydown", onKey);
      tl.kill();
      gsap.killTweensOf(run);
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
  }, [uid]);

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
      <canvas ref={dust} className="it-dustfx" aria-hidden />

      <div className="it-stage">
        <div className="it-logo">
          <Logo sheen={false} className="w-[min(86vw,760px)]" />
          <BullStage id={uid} />
        </div>
      </div>

      <p className="sr-only">Press any key or click to skip the intro.</p>
      <p className="it-counter" aria-hidden>
        Warming up the floor… <span className="it-pct">0</span>%
      </p>
    </div>
  );
}
