import Hero from "@/components/Hero";
import NeonWall from "@/components/NeonWall";
import CrossingTapes from "@/components/CrossingTapes";
import Section from "@/components/Section";
import LightStrip from "@/components/LightStrip";
import { MicroLabel, Tag } from "@/components/ui";
import { sections } from "@/lib/content";

/** Objects still to build (Phase 5), kept as lit placeholders so the clock and nav work end to end. */
const UPCOMING: Record<string, string> = {
  goals: "The treadmill console",
  facilities: "The locker room",
  classes: "The studio scoreboard",
  cafe: "The shake bar",
  crew: "Giant names",
  memories: "The memory wall",
  proof: "Big numbers",
  plans: "The access card",
  book: "The day pass",
  visit: "Lights off",
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <NeonWall />
      <CrossingTapes />

      {sections
        .filter((s) => s.id in UPCOMING)
        .map((s) => (
          <div key={s.id}>
            <LightStrip length="min(1100px, 88vw)" intensity={0.8} />
            <Section id={s.id} time={s.time} label={s.label} showLabel={false} className="overflow-hidden">
              <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center gap-6 px-4 py-24 sm:px-8">
                <MicroLabel index={s.index || s.time}>{s.label}</MicroLabel>
                <h2 className="headline outline-type text-[clamp(56px,10vw,150px)]">{UPCOMING[s.id]}</h2>
                <Tag className="self-start">Next phase</Tag>
              </div>
            </Section>
          </div>
        ))}
    </main>
  );
}
