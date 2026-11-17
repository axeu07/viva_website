"use client";
/**
 * Magnetic button / link. Pulls slightly toward the cursor (mouse only, not under reduced motion).
 * href="#section" scrolls smoothly via Lenis; external hrefs open in a new tab.
 */
import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from "react";
import { gsap, scrollToTarget } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";

type Common = {
  children: ReactNode;
  variant?: "gold" | "outline" | "ghost";
  size?: "md" | "sm";
  /** label shown in the custom cursor, e.g. "Book" */
  cursor?: string;
  magnetic?: boolean;
  className?: string;
};
type LinkProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">;
type BtnProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;

export default function Button(props: LinkProps | BtnProps) {
  const { children, variant = "gold", size = "md", cursor, magnetic = true, className = "", ...rest } = props;
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const live = magnetic && fine && !reduced;

  const onMove = (e: MouseEvent) => {
    if (!live || !outer.current) return;
    const r = outer.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(outer.current, { x: x * 0.28, y: y * 0.36, duration: 0.4, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.12, y: y * 0.16, duration: 0.4, ease: "power3.out" });
  };
  const onLeave = () => {
    if (!live) return;
    gsap.to([outer.current, inner.current], { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const cls = `btn btn-${variant} btn-${size} ${className}`;
  const content = (
    <span ref={inner} className="btn-inner">
      {children}
    </span>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, onClick, ...a } = rest as LinkProps;
    const isHash = href.startsWith("#");
    const external = /^https?:/.test(href);
    return (
      <a
        ref={outer as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        data-cursor={cursor}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          onClick?.(e);
          if (isHash && !e.defaultPrevented) {
            e.preventDefault();
            scrollToTarget(href);
            history.replaceState(null, "", href);
          }
        }}
        {...a}
      >
        {content}
      </a>
    );
  }

  const b = rest as Omit<BtnProps, keyof Common>;
  return (
    <button
      ref={outer as React.RefObject<HTMLButtonElement>}
      type={b.type ?? "button"}
      className={cls}
      data-cursor={cursor}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...b}
    >
      {content}
    </button>
  );
}
