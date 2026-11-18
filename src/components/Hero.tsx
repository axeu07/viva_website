"use client";
/**
 * 05:00 Hero: THE LIGHT SWITCH.
 * Near-black room with an enormous unlit outline "LIGHTS ON." → letters ignite one by one →
 * ceiling strips flicker on → the backdrop and the three lit doorways (video triptych) fade up →
 * copy and chips → the lit sign shrinks into the wall switch's "Lights on" label. Desktop: triptych spreads apart on scroll. Mobile: the floor loop full-screen.
 * Waits for the intro's `viva:intro-done` event while <html data-intro> is "pending" or "running".
 */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, scrollToTarget } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { hero, rating } from "@/lib/content";
import { sectionMedia } from "@/lib/media";
import NeonText from "./NeonText";
import LightStrip from "./LightStrip";
import SunBeam from "./SunBeam";
import Button from "./Button";
import { LoopVideo } from "./Media";
import { MicroLabel, StatusChip, Chip } from "./ui";

const PANELS = sectionMedia.hero.panels; // floor, class-lead, cardio

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");
  const [neonOn, setNeonOn] = useState(false);
  const [stripsOn, setStripsOn] = useState(false);
  const [play, setPlay] = useState(false);

  // Ignition sequence: stages are classes on the section, so elements that mount later still get them.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = (s: string) => el.classList.add(s);
    const html = document.documentElement;
    const title = el.querySelector<HTMLElement>(".hero-title");
    let tl: gsap.core.Timeline | null = null;
    let dockTl: gsap.core.Timeline | null = null;
    let dockTimer = 0;

    // Once lit, the sign shrinks and flies into the wall switch's "Lights on" label (Lights.tsx),
    // then its slot collapses. The h1 stays in the DOM (sr-only) for headings and screen readers.
    const docked = () => {
      html.dataset.lightsSign = "docked";
      if (title) {
        gsap.set(title, { clearProps: "all" });
        title.classList.add("sr-only");
      }
    };
    const dock = () => {
      const label = document.querySelector<HTMLElement>(".wall-switch .ws-text");
      if (!title || !label) return docked();
      const range = document.createRange();
      range.selectNodeContents(title);
      const from = range.getBoundingClientRect();
      const to = label.getBoundingClientRect();
      const scale = Math.max(0.05, to.height / Math.max(1, from.height));
      dockTl = gsap
        .timeline({ onComplete: docked })
        .to(title, {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale,
          transformOrigin: `${from.left + from.width / 2 - title.getBoundingClientRect().left}px 50%`,
          duration: 1.1,
          ease: "power3.inOut",
        })
        .to(title, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.8)
        .call(() => {
          html.dataset.lightsSign = "docked";
        }, [], 0.85)
        .to(title, { height: 0, marginTop: 0, duration: 0.5, ease: "power2.inOut" }, 1.1);
    };

    const start = () => {
      if (reduced) {
        setNeonOn(true);
        setStripsOn(true);
        setPlay(true);
        ["st-bg", "st-panels", "st-ui"].forEach(stage);
        dockTimer = window.setTimeout(docked, 1800);
        return;
      }
      tl = gsap
        .timeline()
        .call(() => setNeonOn(true), [], 0.5)
        .call(() => setStripsOn(true), [], 1.25)
        .call(() => {
          stage("st-bg");
          setPlay(true);
        }, [], 1.7)
        .call(() => stage("st-panels"), [], 1.9)
        .call(() => stage("st-ui"), [], 2.5)
        .call(dock, [], 3.3);
    };
    // wait while the intro is about to play ("pending", set pre-paint) or playing ("running")
    const intro = document.documentElement.dataset.intro;
    const cleanup = () => {
      tl?.kill();
      dockTl?.kill();
      clearTimeout(dockTimer);
      if (title) gsap.set(title, { clearProps: "all" });
    };
    if (intro === "pending" || intro === "running") {
      window.addEventListener("viva:intro-done", start, { once: true });
      return () => {
        window.removeEventListener("viva:intro-done", start);
        cleanup();
      };
    }
    start();
    return cleanup;
  }, [reduced]);

  // Scroll: the side doorways slide apart, the centre one steps forward.
  useGSAP(
    () => {
      if (reduced || !desktop) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({
          defaults: { force3D: true }, // stay on composited layers for the whole scrub (no re-raster at the ends)
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(q(".hp-0"), { xPercent: -42, rotateY: 10, ease: "none" }, 0)
        .to(q(".hp-2"), { xPercent: 42, rotateY: -10, ease: "none" }, 0)
        .to(q(".hp-1"), { scale: 1.14, ease: "none" }, 0);
    },
    { scope: root, dependencies: [reduced, desktop] },
  );

  return (
    <section ref={root} id="top" data-clock="05:00" data-clock-label="Lights on" className="hero relative isolate overflow-hidden">
      {/* backdrop: the gym floor, dark and blurred (desktop) / the floor loop full-screen (mobile) */}
      <div className="hero-bg absolute inset-0" aria-hidden>
        {desktop ? (
          // static CSS background (AVIF/WebP image-set), dimmed by the vignette layers: no filters, no motion
          <div className="media-lit hero-backdrop" />
        ) : (
          <LoopVideo id={sectionMedia.hero.mobileVideo} play={play} eager className="hero-mobile-video" />
        )}
        <div className="hero-vignette" />
      </div>
      <SunBeam minimum={0.16} className="hero-sun" />

      {/* ceiling strips */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[70px] z-[2] flex justify-center md:top-[84px]">
        <LightStrip state={stripsOn ? "on" : "off"} delay={0} length="min(900px, 80vw)" intensity={0.45} />
      </div>

      <div className="relative z-[3] mx-auto flex min-h-dvh flex-col px-4 pt-[112px] pb-6 sm:px-8 md:pt-[108px]">
        <MicroLabel className="hero-reveal justify-center text-center">{hero.kicker}</MicroLabel>

        {/* the sign sits above the doorways; it never covers the footage */}
        <h1 className="hero-title headline mt-3 text-center md:mt-4">
          <NeonText text="Lights" mode="manual" lit={neonOn} stagger={0.085} />{" "}
          <NeonText text="on." mode="manual" lit={neonOn} tone="gold" delay={0.55} stagger={0.1} />
        </h1>

        {/* the three lit doorways (desktop); on mobile the floor loop is the backdrop */}
        <div className="hero-stage relative flex flex-1 items-center justify-center py-6 md:py-7">
          {desktop && (
            <div className="hero-triptych" aria-hidden>
              {PANELS.map((id, i) => (
                <div key={id} className={`hero-panel hp-${i}`} style={{ ["--n" as string]: i }}>
                  <LoopVideo id={id} play={play} eager className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <p className="hero-reveal max-w-md text-sm leading-relaxed text-ink/80">{hero.sub}</p>
          <div className="hero-reveal flex flex-wrap justify-center gap-3">
            <Button href={hero.ctaPrimary.href} cursor="Book">
              {hero.ctaPrimary.label} <span aria-hidden>→</span>
            </Button>
            <Button href={hero.ctaSecondary.href} variant="outline">
              {hero.ctaSecondary.label}
            </Button>
          </div>
        </div>

        <div className="hero-reveal hero-chips mt-8 flex flex-wrap items-center gap-2 pr-36 md:pr-44">
          <StatusChip />
          <Chip>
            {rating.value}★ Google · {rating.count} reviews
          </Chip>
          <a
            href={hero.stepInside.href}
            className="chip chip-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(hero.stepInside.href);
            }}
          >
            {hero.stepInside.label} <span aria-hidden className="chip-arrow">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
