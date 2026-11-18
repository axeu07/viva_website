"use client";
/**
 * 22:00 Footer: LIGHTS OFF. Scrolling in switches the ceiling strips off one by one until only the
 * backlit bull wall glows, then "See you at 5." ignites in neon. Address, hours, phone, socials.
 */
import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { contact, hours, mapsUrl, sectionById, site } from "@/lib/content";
import { LoopVideo } from "./Media";
import { MicroLabel } from "./ui";
import LightStrip from "./LightStrip";
import NeonText from "./NeonText";
import "@/styles/footer.css";

const meta = sectionById("visit");
const STRIPS = 4;

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [off, setOff] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 85%",
        end: "top 15%",
        onUpdate: (self) => {
          const n = Math.min(STRIPS, Math.floor(self.progress * (STRIPS + 0.999)));
          setOff((o) => (o === n ? o : n));
          root.current?.style.setProperty("--wall-glow", String(0.35 + self.progress * 0.65));
        },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="visit" data-clock={meta.time} data-clock-label={meta.label} className="lights-off-footer relative overflow-hidden">
      <div className="lf-strips" aria-hidden>
        {Array.from({ length: STRIPS }, (_, i) => (
          <LightStrip key={i} state={off > i ? "off" : "on"} length={`${86 - i * 12}%`} intensity={0.7} reflection={false} />
        ))}
      </div>

      <div className="mx-auto px-4 pt-20 pb-12 sm:px-8 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
          <div className="lf-wall" aria-hidden>
            <LoopVideo id="bull-wall" className="h-full w-full object-cover" />
          </div>
          <div>
            <MicroLabel>{meta.label}</MicroLabel>
            <NeonText as="h2" text="See you at 5." tone="gold" className="lf-sign mt-6 block" />
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">Doors open at 5 AM, Monday to Saturday. First day or fiftieth, we&apos;ll have the lights on for you.</p>

            <dl className="lf-info mt-10">
              <div>
                <dt className="micro">Address</dt>
                <dd>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    {contact.address.street}, {contact.address.locality}, {contact.address.city} {contact.address.postalCode}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="micro">Hours</dt>
                <dd>
                  {hours.weekdays.days}, {hours.weekdays.label}
                  <br />
                  <span className="text-muted">Sunday: to confirm</span>
                </dd>
              </div>
              <div>
                <dt className="micro">Call</dt>
                <dd>
                  <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt className="micro">Follow</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1">
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lf-base">
          <span>{site.hashtag}</span>
          <span>
            © {new Date().getFullYear()} {site.altName}, {site.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
