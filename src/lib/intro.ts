/**
 * Intro → hero hand-off. A pre-paint script (INTRO_BOOT, inlined in layout.tsx) sets
 * <html data-intro="pending"> when the welcome intro will play; the intro switches it to "running"
 * and always dispatches "viva:intro-done" (also on skip and reduced motion) before removing it.
 */
export const INTRO_DONE = "viva:intro-done";
export const INTRO_KEY = "viva-intro-seen";

/** Runs before first paint: play the intro unless it was already seen this session. */
export const INTRO_BOOT = `try{if(!sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.dataset.intro="pending"}catch(e){document.documentElement.dataset.intro="pending"}`;

export function whenIntroDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const s = document.documentElement.dataset.intro;
  if (s !== "pending" && s !== "running") {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
}
