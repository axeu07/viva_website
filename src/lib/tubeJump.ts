/**
 * Nav transition: the screen goes dark, a fluorescent tube flickers on mid-screen,
 * the page jumps (instantly, while dark) to the chosen section, then the tube cuts out
 * and the section is revealed. The header sits above the overlay so it never disappears.
 * Reduced motion: plain smooth scroll.
 */
import { gsap, getLenis, scrollToTarget, flickerOn, prefersReducedMotion } from "@/lib/motion";

let running: gsap.core.Timeline | null = null;
let pendingHref = "";

function jumpNow(href: string) {
  const el = document.querySelector<HTMLElement>(href.startsWith("#") ? href : `#${href}`);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else el.scrollIntoView({ behavior: "auto", block: "start" });
}

export function tubeJump(href: string, label: string, onLightOn?: () => void) {
  history.replaceState(null, "", href);
  if (prefersReducedMotion()) {
    scrollToTarget(href);
    return;
  }
  // a second click mid-flicker just retargets the jump
  pendingHref = href;
  if (running) {
    const lbl = document.querySelector(".tube-jump .tj-label");
    if (lbl) lbl.textContent = label;
    return;
  }

  const root = document.createElement("div");
  root.className = "tube-jump";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="tj-halo"></div>
    <div class="tj-fixture"><i class="tj-cap"></i><div class="tj-tube"></div><i class="tj-cap"></i></div>
    <div class="tj-label"></div>`;
  (root.querySelector(".tj-label") as HTMLElement).textContent = label;
  document.body.appendChild(root);

  const tube = root.querySelector(".tj-tube")!;
  const halo = root.querySelector(".tj-halo")!;
  const lbl = root.querySelector(".tj-label")!;

  running = gsap
    .timeline({
      onComplete: () => {
        root.remove();
        running = null;
      },
    })
    .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" })
    .add(() => onLightOn?.())
    .add(flickerOn(tube, { reduced: false }), "<0.05")
    .add(flickerOn(halo, { reduced: false }), "<")
    .fromTo(lbl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.3")
    .add(() => jumpNow(pendingHref))
    // tube buzzes once more, then cuts out and the room is revealed
    .to([tube, halo], { opacity: 0.35, duration: 0.05, ease: "none" }, "+=0.12")
    .to([tube, halo], { opacity: 1, duration: 0.04, ease: "none" })
    .to([tube, halo, lbl], { opacity: 0, duration: 0.18, ease: "power2.in" })
    .to(root, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.05");
}
