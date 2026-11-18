"use client";
/**
 * 08 The scoreboard: BIG NUMBERS. "4.8 STARS." / "378 REVIEWS." / "5 AM TO 10 PM." in huge solid and
 * outline type; the numbers count up when the section lights. Beside them, three praise themes from
 * the public Google reviews (summaries, never invented quotes) and a link to the reviews.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { bigNumbers, contact, mapsUrl, rating, sectionById } from "@/lib/content";
import { MicroLabel } from "./ui";
import Button from "./Button";
import Section from "./Section";
import "@/styles/proof.css";

const meta = sectionById("proof");

export default function Proof() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const dp = Number(el.dataset.dp ?? 0);
        const n = { v: 0 };
        el.textContent = (0).toFixed(dp);
        gsap.to(n, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = n.v.toFixed(dp);
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <Section id="proof" time={meta.time} label={meta.label} showLabel={false} className="big-numbers">
      <div ref={root} className="mx-auto px-4 pt-28 pb-28 sm:px-8 md:pt-36 md:pb-36">
        <MicroLabel index={meta.index}>{meta.label}</MicroLabel>

        <div className="mt-10 grid items-end gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
          <p className="bn-lines">
            <span className="sr-only">{`${rating.value} stars from ${rating.count} Google reviews. Open 5 AM to 10 PM, Monday to Saturday.`}</span>
            <span className="bn-line bn-solid" aria-hidden>
              <span data-count={rating.value} data-dp="1">
                {rating.value}
              </span>{" "}
              Stars.
            </span>
            <span className="bn-line bn-outline" aria-hidden>
              <span data-count={rating.count}>{rating.count}</span> Reviews.
            </span>
            <span className="bn-line bn-solid" aria-hidden>
              <span data-count="5">5</span> AM to <span data-count="10">10</span> PM.
            </span>
          </p>

          <div>
            <ul className="grid gap-3">
              {bigNumbers.themes.map((t) => (
                <li key={t.title} className="bn-card">
                  <p className="bn-card-title">{t.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{t.line}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-muted">{bigNumbers.note}</p>
            <Button href={contact.googleReviews ?? mapsUrl} variant="outline" size="sm" className="mt-6" cursor="Read">
              Read the Google reviews <span aria-hidden>↗</span>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
