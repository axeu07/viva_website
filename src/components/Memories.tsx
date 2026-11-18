"use client";
/**
 * 07 Beyond the gym: THE MEMORY WALL. A film strip of Polaroid frames (classes, the trek, festivals,
 * the member spotlight) with slight random tilts. Desktop pins and slides it sideways; mobile swipes.
 * Hover lifts a frame; click opens it in a lightbox (native <dialog>: Esc and backdrop close it).
 */
import { useRef, useState } from "react";
import { useSideScroll } from "@/lib/useSideScroll";
import { memoryWall, sectionById, type Frame } from "@/lib/content";
import { LoopVideo, Picture } from "./Media";
import { MicroLabel, Tag } from "./ui";
import "@/styles/memories.css";

const meta = sectionById("memories");
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5];

function FrameMedia({ f, play }: { f: Frame; play: boolean }) {
  if (f.media?.video) return <LoopVideo id={f.media.video} play={play} className="mw-media" />;
  if (f.media?.photo) return <Picture id={f.media.photo} alt="" className="block h-full w-full" imgClassName="mw-media" sizes="320px" />;
  return (
    <div className="mw-empty">
      <Tag>Photo coming</Tag>
    </div>
  );
}

export default function Memories() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Frame | null>(null);
  useSideScroll(root, track, scroller, bar);

  const openFrame = (f: Frame) => {
    setActive(f);
    dialog.current?.showModal();
  };

  return (
    <section ref={root} id="memories" data-clock={meta.time} data-clock-label={meta.label} className="memory-wall relative">
      <div className="lr-stage flex min-h-dvh flex-col justify-center py-24">
        <div className="mx-auto flex w-full flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
          <header className="max-w-3xl">
            <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
            <h2 className="headline mt-6 text-[clamp(38px,5.4vw,80px)] font-bold tracking-[0.02em] text-ink">
              {memoryWall.line1}
              <span className="mw-accent block">{memoryWall.line2}</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{memoryWall.sub}</p>
          </header>
          <div className="lr-progress-wrap">
            <span className="micro">
              <span className="hidden lg:inline">Scroll</span>
              <span className="lg:hidden">Swipe</span> <span aria-hidden>→</span>
            </span>
            <span className="lr-progress" aria-hidden>
              <span ref={bar} className="lr-progress-fill" />
            </span>
          </div>
        </div>

        <div ref={scroller} className="lr-scroller mt-12">
          <ul ref={track} className="lr-track mw-track" aria-label="Memories">
            {memoryWall.frames.filter((f) => f.media).map((f, i) => (
              <li key={f.id} className="mw-item" style={{ ["--tilt" as string]: `${TILT[i % TILT.length]}deg` }}>
                <button type="button" className="polaroid" data-cursor="Open" onClick={() => openFrame(f)} aria-label={`Open: ${f.caption}`}>
                  <span className="pol-photo">
                    <FrameMedia f={f} play />
                  </span>
                  <span className="pol-caption">{f.caption}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="mw-lightbox"
        aria-label={active?.caption}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        {active && (
          <figure className="polaroid polaroid-lg">
            <span className="pol-photo">
              <FrameMedia f={active} play />
            </span>
            <figcaption className="pol-caption">{active.caption}</figcaption>
          </figure>
        )}
        <button type="button" className="mw-close" onClick={() => dialog.current?.close()} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </section>
  );
}
