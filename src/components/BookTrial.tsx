"use client";
/**
 * 10 Book your first day: an honest WhatsApp enquiry (no backend). A check-in terminal form: name,
 * mobile, interest and preferred date, validated on submit. Valid → a pre-filled WhatsApp message
 * opens in a new tab. The day-pass ticket beside it is only a live preview, labelled "Your request".
 * The goal picked on the treadmill console is carried in (lib/booking.ts).
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { GOAL_EVENT, getGoalPrefill } from "@/lib/booking";
import { contact, enquiry, mapsUrl, sectionById } from "@/lib/content";
import { MicroLabel } from "./ui";
import Button from "./Button";
import LightStrip from "./LightStrip";
import Section from "./Section";
import "@/styles/book.css";

const meta = sectionById("book");
type Interest = (typeof enquiry.interests)[number];
type Errors = Partial<Record<"name" | "phone" | "interest" | "date", string>>;

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};
const prettyDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "—";
const cleanPhone = (v: string) => v.replace(/[^\d]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

function validate(name: string, phone: string, interest: Interest | "", date: string): Errors {
  const e: Errors = {};
  if (name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(cleanPhone(phone))) e.phone = "Enter a 10-digit Indian mobile number.";
  if (!interest) e.interest = "Choose what you're interested in.";
  if (!date) e.date = "Pick a preferred date.";
  else if (date < todayISO()) e.date = "That date has passed. Pick today or later.";
  return e;
}

/** Decorative barcode from the name, so the preview changes as you type. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 34 }, (_, i) => 1 + ((seed.charCodeAt(i % Math.max(1, seed.length)) || 7) * (i + 3)) % 3);
  return (
    <span className="dp-barcode" aria-hidden>
      {bars.map((w, i) => (
        <i key={i} style={{ width: w }} />
      ))}
    </span>
  );
}

export default function BookTrial() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<Interest | "">("");
  const [date, setDate] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  // the goal chosen on the treadmill console (stored, or live from the event)
  useEffect(() => {
    setGoal(getGoalPrefill()); // eslint-disable-line react-hooks/set-state-in-effect -- reads sessionStorage after mount
    const on = (e: Event) => setGoal((e as CustomEvent<string>).detail);
    window.addEventListener(GOAL_EVENT, on);
    return () => window.removeEventListener(GOAL_EVENT, on);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(name, phone, interest, date);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      setSent(false);
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const lines = [
      `Hi Viva! I'd like to book my first day.`,
      `Name: ${name.trim()}`,
      `Mobile: ${cleanPhone(phone)}`,
      `Interested in: ${interest}`,
      `Preferred date: ${prettyDate(date)}`,
      goal ? `My goal: ${goal}` : "",
    ].filter(Boolean);
    setSent(true);
    window.open(`${contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`err-${k}`} className="bk-error">
        {errors[k]}
      </p>
    ) : null;
  const clear = (k: keyof Errors) => errors[k] && setErrors((x) => ({ ...x, [k]: undefined }));

  return (
    <Section id="book" time={meta.time} label={meta.label} showLabel={false} className="book">
      <div className="mx-auto px-4 pt-28 pb-28 sm:px-8 md:pt-36 md:pb-36">
        <header className="max-w-2xl">
          <MicroLabel index={meta.index}>{meta.label}</MicroLabel>
          <h2 className="headline mt-6 text-[clamp(38px,4.8vw,68px)] font-bold tracking-[0.02em] text-ink">{enquiry.heading}</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">{enquiry.sub}</p>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          {/* the check-in terminal */}
          <form ref={form} className="bk-terminal" onSubmit={submit} noValidate>
            <div className="bk-top">
              <span>Viva · Check-in</span>
              <span>Enquiry via WhatsApp</span>
            </div>

            <div className="bk-field">
              <label htmlFor="bk-name">Full name</label>
              <input
                id="bk-name"
                data-field="name"
                autoComplete="name"
                value={name}
                onChange={(e) => (setName(e.target.value), clear("name"))}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
              />
              {err("name")}
            </div>

            <div className="bk-field">
              <label htmlFor="bk-phone">Mobile number</label>
              <input
                id="bk-phone"
                data-field="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => (setPhone(e.target.value), clear("phone"))}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : undefined}
              />
              {err("phone")}
            </div>

            <fieldset className="bk-field" aria-describedby={errors.interest ? "err-interest" : undefined}>
              <legend>Interested in</legend>
              <div className="bk-options">
                {enquiry.interests.map((opt, i) => (
                  <label key={opt} className="bk-option">
                    <input
                      type="radio"
                      name="interest"
                      value={opt}
                      data-field={i === 0 ? "interest" : undefined}
                      checked={interest === opt}
                      onChange={() => (setInterest(opt), clear("interest"))}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {err("interest")}
            </fieldset>

            <div className="bk-field">
              <label htmlFor="bk-date">Preferred date</label>
              <input
                id="bk-date"
                data-field="date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => (setDate(e.target.value), clear("date"))}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "err-date" : "bk-date-hint"}
              />
              <p id="bk-date-hint" className="bk-hint">
                Open Mon–Sat, 5 AM – 10 PM.
              </p>
              {err("date")}
            </div>

            {goal && (
              <p className="bk-goal">
                Goal from the console: <strong>{goal}</strong>
              </p>
            )}

            <Button type="submit" className="mt-2 w-full justify-center" cursor="Send">
              Send on WhatsApp <span aria-hidden>→</span>
            </Button>
            <p className="bk-status" role="status">
              {sent ? "Opening WhatsApp to send your request…" : ""}
            </p>
          </form>

          {/* the request preview + direct contact */}
          <div className="flex flex-col gap-8">
            <div className={`day-pass ${sent ? "is-sent" : ""}`} aria-hidden>
              <div className="dp-head">
                <span>Your request</span>
                <span>Viva Premium Gym</span>
              </div>
              <p className="dp-name">{name.trim() || "Your name"}</p>
              <dl className="dp-grid">
                <div>
                  <dt>For</dt>
                  <dd>{interest || "—"}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{prettyDate(date)}</dd>
                </div>
                <div>
                  <dt>Goal</dt>
                  <dd>{goal ?? "—"}</dd>
                </div>
              </dl>
              <div className="dp-foot">
                <Barcode seed={name || "viva"} />
                <span>Not a booking · we confirm on WhatsApp</span>
              </div>
            </div>
            <LightStrip state={sent ? "on" : "off"} length="100%" intensity={0.7} reflection={false} />

            <ul className="bk-contact">
              <li>
                <a href={`tel:${contact.phoneE164}`} className="bk-link">
                  <span className="micro">Call</span>
                  <span>{contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="bk-link">
                  <span className="micro">Directions</span>
                  <span>
                    {contact.address.street}, {contact.address.city} <span aria-hidden>↗</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="bk-link">
                  <span className="micro">Instagram</span>
                  <span>
                    @viva_premium_gym <span aria-hidden>↗</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
