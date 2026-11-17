"use client";
/**
 * 01 Written on our walls: THE NEON WALL.
 * Pinned. Viva's real neon signs stack as giant outline type and ignite one after another as you
 * scroll; the sticky frame swaps to the photo of that sign with a light-wipe. Click a sign to jump
 * to it. Ends on "Champions aren't born. / They're built at Viva."
 * Reduced motion: no pin, every sign lit, clicking a sign swaps the frame.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, getLenis } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { neonSigns, neonWallClose, sectionById } from "@/lib/content";
import NeonText from "./NeonText";
import { Picture } from "./Media";
import { MicroLabel } from "./ui";

const N = neonSigns.length;
const meta = sectionById("walls");

export default function NeonWall() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0); // how many signs are lit
  const [shown, setShown] = useState(0); // which photo is in the frame
  const prevShown = useRef(0);

  useGSAP(
    () => {
      if (reduced) {
        setLit(N);
        return;
      }
      st.current = ScrollTrigger.create({
        trigger: stage.current,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 0.75 * N)}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const count = self.progress > 0 ? Math.min(N, Math.floor(self.progress * N) + 1) : 0;
          setLit((v) => (v === count ? v : count));
          setShown((v) => (count ? (v === count - 1 ? v : count - 1) : v));
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        },
      });
      return () => {
        st.current = null;
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  // light-wipe the new photo in over the old one
  useEffect(() => {
    const f = frame.current;
    if (!f) return;
    const layers = Array.from(f.querySelectorAll<HTMLElement>(".wf-layer"));
    const line = f.querySelector<HTMLElement>(".wf-wipe");
    const from = prevShown.current;
    prevShown.current = shown;
    layers.forEach((l, i) => {
      l.style.zIndex = i === shown ? "3" : i === from ? "2" : "1";
      if (i !== shown && i !== from) l.style.opacity = "0";
    });
    const next = layers[shown];
    if (!next) return;
    next.style.opacity = "1";
    if (from === shown || reduced) {
      gsap.set(next, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(next, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power2.inOut" }, 0)
      .fromTo(next.querySelector("img"), { scale: 1.12 }, { scale: 1.02, duration: 1.6, ease: "power2.out" }, 0);
    if (line) tl.fromTo(line, { top: "0%", opacity: 1 }, { top: "100%", duration: 0.85, ease: "power2.inOut" }, 0).to(line, { opacity: 0, duration: 0.25 }, 0.7);
    // once covered, the old photo goes away (otherwise it shows through in lights-off mode)
    tl.eventCallback("onComplete", () => layers.forEach((l, i) => i !== shown && (l.style.opacity = "0")));
    return () => {
      tl.kill();
    };
  }, [shown, reduced]);

  const jump = (i: number) => {
    const t = st.current;
    if (!t) {
      setShown(i);
      return;
    }
    const y = t.start + ((i + 0.5) / N) * (t.end - t.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const sign = neonSigns[shown];

  return (
    <section ref={root} id="walls" data-clock={meta.time} data-clock-label={meta.label} className="neon-wall relative">
      <div ref={stage} className="nw-stage relative flex min-h-dvh flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 pt-24 sm:px-8 md:pt-28">
          <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
          <p className="micro hidden sm:flex" aria-hidden>
            <span>
              Sign {String(Math.max(1, lit)).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <span className="nw-progress">
              <span ref={bar} className="nw-progress-fill" />
            </span>
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-rows-[auto_1fr] gap-6 px-4 pt-6 pb-10 sm:px-8 md:grid-cols-[1.15fr_1fr] md:grid-rows-1 md:items-center md:gap-12 md:pt-4">
          {/* the wall: signs as giant outline type */}
          <ol className="nw-signs order-2 md:order-1" aria-label="Neon signs on Viva's walls">
            {neonSigns.map((s, i) => (
              <li key={s.word}>
                <button
                  type="button"
                  className={`nw-sign ${i === shown && lit > 0 ? "is-active" : ""}`}
                  aria-current={i === shown && lit > 0 ? "true" : undefined}
                  onClick={() => jump(i)}
                  data-cursor="Light"
                >
                  <span className="nw-num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <NeonText text={s.word} mode="manual" lit={i < lit} tone={i === 0 ? "gold" : "ivory"} stagger={0.05} className="headline nw-word" />
                </button>
              </li>
            ))}
          </ol>

          {/* the doorway frame: real footage of the sign */}
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <figure className="nw-frame-wrap">
              <div ref={frame} className="nw-frame">
                {neonSigns.map((s, i) => (
                  <div key={s.word} className="wf-layer" style={{ opacity: i === 0 ? 1 : 0 }}>
                    <Picture
                      id={s.image}
                      alt={`The ${s.word.toUpperCase()} neon sign at Viva`}
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                      style={{ objectPosition: s.focus }}
                      sizes="(min-width: 768px) 520px, 90vw"
                    />
                  </div>
                ))}
                <span aria-hidden className="wf-wipe" />
                <span aria-hidden className="wf-shade" />
              </div>
              <figcaption className="nw-caption">
                <span aria-hidden className="status-dot" />
                On our wall · {sign.word} · {sign.where}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* the line it all comes back to */}
      <div className="nw-close mx-auto max-w-[1100px] px-4 pt-[24vh] pb-[28vh] text-center sm:px-8">
        <NeonText as="p" text={neonWallClose.line1} className="headline nw-close-1" stagger={0.035} />
        <NeonText as="p" text={neonWallClose.line2} tone="gold" className="headline nw-close-2" delay={0.9} stagger={0.04} />
        <p className="accent mx-auto mt-10 max-w-xl text-[clamp(20px,2vw,28px)] leading-snug text-ink/80">{neonWallClose.sub}</p>
      </div>
    </section>
  );
}
