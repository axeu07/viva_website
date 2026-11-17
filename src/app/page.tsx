import { site } from "@/lib/content";

// Phase 1 placeholder: confirms theme tokens and fonts. Sections arrive in Phases 3–5.
export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-3xl bg-light shadow-[0_0_24px_6px_rgb(255_244_220/0.45)]"
      />
      <p className="mb-6 text-xs tracking-[0.3em] text-gold-1 uppercase">05:00 · Lights on</p>
      <h1 className="headline text-lit text-6xl sm:text-8xl">
        Champions aren&apos;t born.
      </h1>
      <p className="accent text-gold mt-3 text-4xl sm:text-6xl">They&apos;re built at Viva.</p>
      <p className="mt-8 max-w-md text-muted">
        {site.name}, {site.city}. Setup check: theme tokens and fonts loaded.
      </p>
    </main>
  );
}
