"use client";
/**
 * 05 Viva Café: THE SHAKE BAR (ivory, daylight). A black menu board with warm-lit text (sample
 * items, prices TO CONFIRM) beside an SVG shaker that fills as you scroll. Tap it to shake it.
 */
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { sectionById, shakeBar } from "@/lib/content";
import { MicroLabel, Tag } from "./ui";
import { useSound } from "./Sound";
import Section from "./Section";
import Daylight from "./Daylight";
import "@/styles/cafe.css";

const meta = sectionById("cafe");
const BUBBLES = [
  [78, 300, 5],
  [104, 316, 4],
  [128, 296, 6],
  [92, 270, 3],
  [140, 322, 4],
  [116, 282, 3],
];

function Shaker({ shaking }: { shaking: boolean }) {
  return (
    <svg viewBox="0 0 220 380" className={`shaker ${shaking ? "is-shaking" : ""}`} aria-hidden>
      <defs>
        <clipPath id="shaker-body">
          <path d="M52 120h116l-8 214a22 22 0 0 1-22 21H82a22 22 0 0 1-22-21z" />
        </clipPath>
        <linearGradient id="shake-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b77e" />
          <stop offset="1" stopColor="#927047" />
        </linearGradient>
        <linearGradient id="shaker-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* cap + spout */}
      <rect x="96" y="30" width="28" height="22" rx="5" fill="#1b1916" />
      <path d="M58 64h104a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8z" fill="#1b1916" />
      <rect x="50" y="84" width="120" height="4" fill="#927047" opacity="0.7" />
      {/* body */}
      <path d="M52 120h116l-8 214a22 22 0 0 1-22 21H82a22 22 0 0 1-22-21z" fill="url(#shaker-glass)" />
      <g clipPath="url(#shaker-body)">
        <g className="shaker-fill">
          <g className="shaker-wave">
            <path d="M0 0 q27.5 -10 55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 V260 H0z" fill="url(#shake-liquid)" transform="translate(-110 0)" />
          </g>
          <g className="shaker-bubbles">
            {BUBBLES.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y - 140} r={r} fill="#fff4dc" opacity="0.5" style={{ animationDelay: `${i * 90}ms` }} />
            ))}
          </g>
        </g>
      </g>
      <path d="M52 120h116l-8 214a22 22 0 0 1-22 21H82a22 22 0 0 1-22-21z" fill="none" stroke="#927047" strokeWidth="2" />
      {/* measuring marks + mark */}
      {[170, 210, 250, 290].map((y) => (
        <path key={y} d={`M150 ${y}h-12`} stroke="#927047" strokeWidth="1.5" opacity="0.6" />
      ))}
      <text x="110" y="230" textAnchor="middle" className="shaker-mark">
        VIVA
      </text>
    </svg>
  );
}

export default function Cafe() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const sound = useSound();
  const [shaking, setShaking] = useState(false);

  // the liquid rises as the section scrolls through (full straight away under reduced motion)
  useGSAP(
    () => {
      const fill = root.current?.querySelector(".shaker-fill");
      if (!fill) return;
      if (reduced) return void gsap.set(fill, { y: 150 });
      gsap.fromTo(fill, { y: 350 }, { y: 150, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 60%", scrub: 0.6 } });
    },
    { scope: root, dependencies: [reduced] },
  );

  const shake = () => {
    if (shaking) return;
    setShaking(true);
    sound.click();
    window.setTimeout(() => setShaking(false), 900);
  };

  return (
    <>
      <Daylight dir="up" />
      <Section id="cafe" time={meta.time} label={meta.label} showLabel={false} className="ivory shake-bar">
        {/* Grid: header / menu / shaker. Phone: the shaker sits over the menu board's empty right
            side (same cell). Tablet: stacked below. Desktop: its own column beside both. */}
        <div ref={root} className="cafe-grid mx-auto grid items-center gap-y-10 px-4 pt-16 pb-28 sm:px-8 md:pb-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-20">
          <div className="lg:col-start-1 lg:row-start-1">
            <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
            <h2 className="headline mt-6 text-[clamp(44px,6.4vw,96px)] font-bold tracking-[0.02em] text-ink">{shakeBar.heading}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{shakeBar.sub}</p>
          </div>

            <div className="menu-board col-start-1 row-start-2 lg:self-start">
              <div className="mb-head">
                <span>Viva Café · Today</span>
                <Tag>Sample menu</Tag>
              </div>
              <div className="mb-cols">
                {shakeBar.board.map((col) => (
                  <div key={col.title}>
                    <h3 className="mb-title">{col.title}</h3>
                    <ul className="mb-items">
                      {col.items.map((it) => (
                        <li key={it}>
                          <span>{it}</span>
                          <span className="mb-price">₹ to confirm</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          <div className="cafe-shaker z-[1] text-center">
            <button type="button" className="shaker-btn" onClick={shake} data-cursor="Shake" aria-label="Shake the shaker">
              <Shaker shaking={shaking} />
            </button>
            <p className="micro mt-4 justify-center max-sm:mt-1.5">Tap to shake</p>
          </div>
        </div>
      </Section>
      <Daylight dir="down" />
    </>
  );
}
