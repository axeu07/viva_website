/**
 * 06 The crew: one row of minimal portrait cards. Each card is a dark 4:5 frame with a portrait
 * (AI stand-ins until real photos arrive; outline initial as fallback), an index, the name and role.
 * Hover/focus warms the frame to gold and lifts the photo. 4-up on desktop/laptop, 2-up on tablet, swipe row on phones.
 */
import { crew, sectionById } from "@/lib/content";
import { MicroLabel, Tag } from "./ui";
import Section from "./Section";
import "@/styles/crew.css";

const meta = sectionById("crew");

/** AI-generated stand-in portraits (public/media/img/crew-*), by card order. Swap for real photos when they arrive. */
const PHOTOS = ["crew-ashmita", "crew-deepak", "crew-trainer-03", "crew-trainer-04"];

export default function Coaches() {
  return (
    <Section id="crew" time={meta.time} label={meta.label} showLabel={false} className="crew">
      <div className="mx-auto px-4 pt-16 pb-16 sm:px-8 md:pt-20 md:pb-20">
        <header className="max-w-xl">
          <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
          <h2 className="mt-6 text-[clamp(22px,2.4vw,30px)] font-semibold text-ink">{crew.heading}</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{crew.sub}</p>
        </header>

        <ul className="cr-row mt-10">
          {crew.people.map((p, i) => (
            <li key={p.name} className="cr-card" tabIndex={0}>
              <div className="cr-frame">
                {PHOTOS[i] ? (
                  <picture>
                    <source srcSet={`/media/img/${PHOTOS[i]}-640.avif`} type="image/avif" />
                    <img
                      className="cr-photo"
                      src={`/media/img/${PHOTOS[i]}-640.webp`}
                      alt={p.confirmed ? `${p.name}, ${p.role}` : "Trainer portrait placeholder"}
                      width={640}
                      height={800}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <span className="cr-initial" aria-hidden>
                    {p.name[0]}
                  </span>
                )}
                <span className="cr-index">{String(i + 1).padStart(2, "0")}</span>
                {!p.confirmed && <Tag className="cr-tag">To confirm</Tag>}
              </div>
              <div className="cr-meta">
                <h3 className="cr-name">{p.name}</h3>
                <p className="cr-role">{p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
