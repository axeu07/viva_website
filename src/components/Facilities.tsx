"use client";
/**
 * 03 Inside Viva: THE LOCKER ROOM.
 * A row of black lockers with gold numbers. Desktop: the section pins and scrolling slides the
 * row sideways (with a progress bar). Mobile / reduced motion: a native swipe row with snap.
 * Hover (mouse) or tap/Enter opens a locker: the door swings open in 3D to reveal the facility.
 * Lockers without footage yet show a lit placeholder with an icon and PHOTO COMING.
 */
import { useRef, useState } from "react";
import { useSideScroll } from "@/lib/useSideScroll";
import { lockerRoom, sectionById, type LockerItem } from "@/lib/content";
import { LoopVideo, Picture } from "./Media";
import { MicroLabel, Tag } from "./ui";
import { useSound } from "./Sound";
import "@/styles/lockers.css";

const meta = sectionById("facilities");

function Icon({ name }: { name: NonNullable<LockerItem["icon"]> }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden>
      {name === "steam" && (
        <g {...common}>
          <path d="M14 34c-3-4 3-6 0-10s3-6 0-10" />
          <path d="M24 34c-3-4 3-6 0-10s3-6 0-10" />
          <path d="M34 34c-3-4 3-6 0-10s3-6 0-10" />
          <path d="M8 40h32" />
        </g>
      )}
      {name === "shower" && (
        <g {...common}>
          <path d="M10 8h14a6 6 0 0 1 6 6v3" />
          <path d="M22 17h16l-2 5H24z" />
          <path d="M26 27v3M30 27v5M34 27v3M28 34v3M32 34v3" />
        </g>
      )}
      {name === "cup" && (
        <g {...common}>
          <path d="M12 18h20v12a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" />
          <path d="M32 21h3a4 4 0 0 1 0 8h-3" />
          <path d="M18 8c-2 2 2 4 0 6M24 8c-2 2 2 4 0 6" />
        </g>
      )}
    </svg>
  );
}

function Locker({ item, n }: { item: LockerItem; n: number }) {
  const [open, setOpen] = useState(false);
  const sound = useSound();
  const num = String(n).padStart(2, "0");
  const toggle = () => {
    setOpen((o) => !o);
    sound.click();
  };

  return (
    <li className={`locker ${open ? "is-open" : ""}`} onMouseLeave={() => setOpen(false)}>
      <div className="lk-inside">
        {item.media?.video && <LoopVideo id={item.media.video} play={open} className="lk-media" />}
        {item.media?.photo && <Picture id={item.media.photo} alt="" className="block h-full w-full" imgClassName="lk-media" sizes="300px" />}
        {!item.media && (
          <div className="lk-placeholder">
            {item.icon && <Icon name={item.icon} />}
            <Tag>Photo coming</Tag>
          </div>
        )}
        <div className="lk-info">
          <p className="lk-name">{item.name}</p>
          <p className="lk-line">{item.line}</p>
        </div>
      </div>
      <button
        type="button"
        className="lk-door"
        aria-expanded={open}
        aria-label={`Locker ${num}: ${item.name}. ${open ? "Close" : "Open"}`}
        data-cursor={open ? "" : "Open"}
        onClick={toggle}
        onMouseEnter={() => {
          if (window.matchMedia("(hover: hover)").matches) setOpen(true);
        }}
      >
        <span className="lk-vents" aria-hidden />
        <span className="lk-num" aria-hidden>
          {num}
        </span>
        <span className="lk-plate" aria-hidden>
          {item.name}
        </span>
        <span className="lk-handle" aria-hidden />
      </button>
    </li>
  );
}

export default function Facilities() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useSideScroll(root, track, scroller, bar);

  return (
    <section ref={root} id="facilities" data-clock={meta.time} data-clock-label={meta.label} className="locker-room relative">
      <div className="lr-stage flex min-h-dvh flex-col justify-center py-24">
        <div className="mx-auto flex w-full flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
          <header className="max-w-xl">
            <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
            <h2 className="headline mt-6 text-[clamp(38px,4.8vw,68px)] font-bold tracking-[0.02em] text-ink">{lockerRoom.heading}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{lockerRoom.sub}</p>
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
          <ul ref={track} className="lr-track" aria-label="Facilities">
            {lockerRoom.lockers.map((item, i) => (
              <Locker key={item.id} item={item} n={i + 1} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
