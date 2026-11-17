import Section from "@/components/Section";
import LightStrip from "@/components/LightStrip";
import SunBeam from "@/components/SunBeam";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import LightsSwitchDemo from "@/components/dev/LightsSwitchDemo";
import { sections, sectionById, contact } from "@/lib/content";
import { videos } from "@/lib/media";

/**
 * Phase 3 test page: the real section skeleton (every clock time in place) showing the
 * lighting system. Each placeholder is replaced by its real component in Phases 4–5.
 */
export default function Home() {
  const hero = sectionById("top");
  const rest = sections.filter((s) => s.id !== "top" && s.id !== "visit");
  const visit = sectionById("visit");

  return (
    <main id="main">
      {/* 05:00: hero placeholder (real hero in Phase 4) */}
      <Section id={hero.id} time={hero.time} label={hero.label} reveal="none" showLabel={false} className="min-h-dvh overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 flex flex-col gap-[5vh] pt-[12vh]">
          <LightStrip state="on" delay={0.4} length="78%" />
          <LightStrip state="on" delay={0.9} length="64%" />
          <LightStrip state="on" delay={1.4} length="50%" />
        </div>
        <SunBeam minimum={0.22} />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-[34vh] pb-24 text-center">
          <Logo className="text-[clamp(88px,22vw,220px)]" />
          <p className="mt-10 max-w-md text-muted">
            Phase 3 test page: the lighting system, day clock, nav, cursor and buttons. Scroll to run the day from 05:00 to 22:00.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="#book" cursor="Book">
              Book a free trial
            </Button>
            <Button href="#goals" variant="outline">
              Find your program
            </Button>
          </div>
        </div>
      </Section>

      {rest.map((s, i) => (
        <div key={s.id}>
          <LightStrip length="min(1100px, 88vw)" intensity={0.9} />
          <Section id={s.id} time={s.time} label={s.label} reveal={i % 2 ? "wipe" : "lit"} className="overflow-hidden">
            {i % 3 === 0 && <SunBeam />}
            <div className="relative mx-auto grid min-h-[80vh] max-w-6xl content-center gap-10 px-4 pt-10 pb-28 sm:px-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <h2 className="headline text-[clamp(44px,8vw,104px)]">
                  <span className="lit-sweep">{s.title}</span>
                </h2>
                <p className="mt-6 max-w-md text-muted">
                  {i % 2 ? "Light-wipe reveal: a bright line sweeps down and uncovers the section." : "Lit reveal: the section starts dark and is lit as it scrolls in."}
                  {i % 3 === 0 && " Sunlight shafts and dust follow the clock: watch the angle and warmth change as the day moves."}
                </p>
              </div>
              {i === 0 && (
                <figure className="relative mx-auto w-full max-w-[300px]" data-cursor="Watch">
                  <div className="relative aspect-[5/8] overflow-hidden rounded-sm">
                    <video
                      className="h-full w-full object-cover"
                      src={videos.cardio.mp4}
                      poster={videos.cardio.poster}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="none"
                      aria-hidden
                    />
                  </div>
                  <figcaption className="mt-3 text-xs tracking-[0.18em] text-muted uppercase">Hover: cursor shows &ldquo;Watch&rdquo;</figcaption>
                </figure>
              )}
              {i === 1 && (
                <div className="flex flex-col items-start gap-4">
                  <Button href="#book" cursor="Book">
                    Magnetic gold button
                  </Button>
                  <Button href={contact.whatsapp} variant="outline" cursor="Chat">
                    WhatsApp (external link)
                  </Button>
                </div>
              )}
            </div>
          </Section>
        </div>
      ))}

      {/* 22:00: footer placeholder with controlled switch-off */}
      <LightStrip length="min(1100px, 88vw)" />
      <Section id={visit.id} time={visit.time} label={visit.label} className="overflow-hidden">
        <div className="relative mx-auto flex min-h-[90vh] max-w-4xl flex-col items-center justify-center gap-14 px-4 py-28 text-center">
          <h2 className="headline text-[clamp(44px,8vw,104px)]">
            <span className="lit-sweep">{visit.title}</span>
          </h2>
          <LightsSwitchDemo />
          <Logo className="text-[clamp(56px,10vw,96px)]" />
        </div>
      </Section>
    </main>
  );
}
