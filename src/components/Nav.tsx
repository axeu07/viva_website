"use client";
/**
 * Sticky nav: logo, section links, sound toggle and a gold "Book free trial" button.
 * Always visible (never hides on scroll). On mobile a full-screen menu opens with a
 * light-on animation and staggered links.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, getLenis, scrollToTarget, flickerOn } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { nav } from "@/lib/content";
import { tubeJump } from "@/lib/tubeJump";
import Logo from "./Logo";
import Button from "./Button";
import { useSound } from "./Sound";
import { StatusChip } from "./ui";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const sound = useSound();

  // always visible; once scrolled it gets a solid, blurred backing so it stays readable
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => el.classList.toggle("is-scrolled", self.scroll() > 24),
    });
    el.classList.toggle("is-scrolled", st.scroll() > 24);
    return () => st.kill();
  }, []);

  // mobile menu open/close
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.classList.add("menu-open");
      const links = m.querySelectorAll(".mm-link");
      const strip = m.querySelector(".mm-strip");
      gsap.set(m, { autoAlpha: 1 });
      if (reduced) {
        gsap.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      } else {
        gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power3.inOut" });
        if (strip) flickerOn(strip, { delay: 0.35 });
        gsap.fromTo(links, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "power3.out", delay: 0.45 });
      }
      sound.click();
      (m.querySelector(".mm-link") as HTMLElement | null)?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      lenis?.start();
      document.documentElement.classList.remove("menu-open");
      gsap.to(m, { autoAlpha: 0, duration: reduced ? 0 : 0.35, ease: "power2.in" });
    }
    // sound.click identity changes with sound state; only react to open/close
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduced]);

  const go = (href: string) => {
    setOpen(false);
    toggleBtn.current?.focus({ preventScroll: true });
    // wait for the menu to close and Lenis to restart
    setTimeout(() => {
      scrollToTarget(href);
      history.replaceState(null, "", href);
    }, 60);
  };

  return (
    <>
      <header ref={bar} className="site-nav">
        <div className="mx-auto flex h-16 items-center gap-6 px-4 sm:px-8 lg:h-20">
          <a
            href="#top"
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#top");
            }}
          >
            <Logo variant="image" className="w-[92px] lg:w-[110px]" />
          </a>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      tubeJump(l.href, l.label, sound.click);
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <StatusChip bare className="mr-2 hidden xl:inline-flex" />
            <button
              type="button"
              className="sound-toggle"
              aria-pressed={sound.enabled}
              aria-label={sound.enabled ? "Turn sound off" : "Turn sound on"}
              onClick={sound.toggle}
            >
              <span className="st-bars" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="hidden sm:inline">{sound.enabled ? "Sound on" : "Sound off"}</span>
            </button>
            <Button href={nav.cta.href} size="sm" cursor="Book" className="hidden sm:inline-flex">
              {nav.cta.label}
            </Button>
            <button
              ref={toggleBtn}
              type="button"
              className="menu-toggle lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span aria-hidden className={`mt-lines ${open ? "is-open" : ""}`}>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="mobile-menu lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        style={{ visibility: "hidden", opacity: 0 }}
        inert={!open}
      >
        <div className="mm-strip" aria-hidden />
        <ul className="flex flex-col gap-1 px-6 pt-28">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="mm-link"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  toggleBtn.current?.focus({ preventScroll: true });
                  // wait for Lenis to restart after the menu closes
                  setTimeout(() => tubeJump(l.href, l.label, sound.click), 60);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="px-6 pt-8 pb-10">
          <Button
            href={nav.cta.href}
            cursor="Book"
            className="w-full justify-center"
            onClick={(e) => {
              e.preventDefault();
              go(nav.cta.href);
            }}
          >
            {nav.cta.label}
          </Button>
        </div>
      </div>
    </>
  );
}
