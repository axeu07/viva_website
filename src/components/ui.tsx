"use client";
/** Small shared UI: mono micro-labels, demo-honesty tags and the live open/closed chip. */
import { useEffect, useState, type ReactNode } from "react";
import { gymStatus, type GymStatus } from "@/lib/hours";

/** `01 —— WRITTEN ON OUR WALLS` style label. Turns exit-sign green when the lights are off. */
export function MicroLabel({ index, children, className = "" }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`micro ${className}`}>
      {index && (
        <>
          <span className="micro-index">{index}</span>
          <span aria-hidden className="micro-rule" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}

/** Dashed pill marking demo content: SAMPLE / TO CONFIRM / PHOTO COMING. */
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`demo-tag ${className}`}>{children}</span>;
}

/** Live status from IST: "● OPEN NOW · UNTIL 10:00 PM" / "● CLOSED · OPENS 5:00 AM". */
export function StatusChip({ className = "", bare = false }: { className?: string; bare?: boolean }) {
  const [status, setStatus] = useState<GymStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(gymStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  const text = status?.text ?? "Mon–Sat · 5 AM – 10 PM";
  const state = status ? (status.open ? "open" : "closed") : "unknown";
  return (
    <span className={`${bare ? "status-bare" : "chip"} status ${className}`} data-state={state}>
      <span aria-hidden className="status-dot" />
      <span>{text}</span>
    </span>
  );
}

export function Chip({ children, href, className = "" }: { children: ReactNode; href?: string; className?: string }) {
  if (href) {
    return (
      <a href={href} className={`chip chip-link ${className}`}>
        {children}
      </a>
    );
  }
  return <span className={`chip ${className}`}>{children}</span>;
}
