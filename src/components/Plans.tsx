"use client";
/**
 * 09 Membership: THE ACCESS CARD (ivory, daylight). Each plan is a matte-black member card with a
 * gold foil logo, embossed name and a chip. Cards tilt toward the cursor with a moving reflection
 * (mouse, motion OK). The term slider (1 / 3 / 6 / 12 months) flips every card to the new term.
 * Prices are demo per-month figures (content.ts), tagged SAMPLE PRICE. Perks print in gold on the card.
 */
import { useRef, useState, type PointerEvent } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { accessCards, sectionById } from "@/lib/content";
import { MicroLabel, Tag } from "./ui";
import Logo from "./Logo";
import Button from "./Button";
import Section from "./Section";
import Daylight from "./Daylight";
import "@/styles/plans.css";

const meta = sectionById("plans");
const TERMS = accessCards.terms;
const termLabel = (m: number) => `${m} month${m > 1 ? "s" : ""}`;

function Chip() {
  return (
    <svg viewBox="0 0 44 34" className="ac-chip" aria-hidden>
      <rect x="0.5" y="0.5" width="43" height="33" rx="6" fill="url(#ac-chip-gold)" stroke="#6f5434" />
      <path d="M0 12h14M0 22h14M30 12h14M30 22h14M14 0v34M30 0v34M14 17h16" stroke="#6f5434" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function Plans() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const tilt = fine && !reduced;
  const [term, setTerm] = useState(1); // index into TERMS
  const [shown, setShown] = useState(1);
  const grid = useRef<HTMLUListElement>(null);

  const changeTerm = (i: number) => {
    setTerm(i);
    const cards = grid.current?.querySelectorAll(".ac-flip");
    if (reduced || !cards?.length) return setShown(i);
    gsap
      .timeline()
      .to(cards, { rotateY: 90, duration: 0.22, ease: "power2.in", stagger: 0.06 })
      .call(() => setShown(i))
      .fromTo(cards, { rotateY: -90 }, { rotateY: 0, duration: 0.4, ease: "power3.out", stagger: 0.06 });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    const s = e.currentTarget.style;
    ["--rx", "--ry"].forEach((p) => s.setProperty(p, "0deg"));
    s.setProperty("--gx", "30%");
    s.setProperty("--gy", "20%");
  };

  return (
    <>
      <Daylight dir="up" />
      <Section id="plans" time={meta.time} label={meta.label} showLabel={false} className="ivory access">
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <linearGradient id="ac-chip-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2dca8" />
              <stop offset="0.5" stopColor="#c8a46b" />
              <stop offset="1" stopColor="#927047" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mx-auto px-4 pt-16 pb-28 sm:px-8 md:pb-36">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <header className="max-w-xl">
              <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
              <h2 className="headline mt-6 text-[clamp(38px,4.8vw,68px)] font-bold tracking-[0.02em] text-ink">{accessCards.heading}</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{accessCards.sub}</p>
            </header>

            <div className="ac-term">
              <label htmlFor="ac-term" className="micro">
                Term · <span className="text-ink">{termLabel(TERMS[term])}</span>
              </label>
              <input
                id="ac-term"
                type="range"
                min={0}
                max={TERMS.length - 1}
                step={1}
                value={term}
                aria-valuetext={termLabel(TERMS[term])}
                onChange={(e) => changeTerm(Number(e.target.value))}
                style={{ ["--p" as string]: `${(term / (TERMS.length - 1)) * 100}%` }}
              />
              <div className="ac-ticks" aria-hidden>
                {TERMS.map((m, i) => (
                  <button key={m} type="button" tabIndex={-1} className={i === term ? "is-on" : ""} onClick={() => changeTerm(i)}>
                    {m}M
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ul ref={grid} className="ac-grid mt-14">
            {accessCards.plans.map((p) => (
              <li key={p.id} className="ac-item">
                <div className="ac-tilt" onPointerMove={onMove} onPointerLeave={onLeave}>
                  <div className="ac-flip">
                    <div className="ac-card">
                      <span className="ac-glare" aria-hidden />
                      <div className="ac-top">
                        <Logo sheen={false} className="ac-logo" />
                        <span className="ac-kind">Member access</span>
                      </div>
                      <Chip />
                      <ul className="ac-perks" aria-label={`${p.name} includes`}>
                        {p.perks.map((perk) => (
                          <li key={perk}>{perk}</li>
                        ))}
                      </ul>
                      <p className="ac-name">{p.name}</p>
                      <div className="ac-bottom">
                        <span className="ac-term-label">{termLabel(TERMS[shown])}</span>
                        <span className="ac-price">
                          ₹{p.monthly.toLocaleString("en-IN")}
                          <span className="ac-per"> / month</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <Tag>Sample price</Tag>
                  <Button href="#book" variant="outline" size="sm" cursor="Book">
                    Ask about it
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Daylight dir="down" />
    </>
  );
}
