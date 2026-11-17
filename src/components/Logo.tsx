/**
 * The one place the Viva logo is rendered: bull head + VIVA + gold rules + PREMIUM GYM, as inline SVG
 * built from brand/geometry (traced from the client's end-card logo). Used in the nav, intro and footer.
 *
 * When the client sends the real logo file, set REAL_LOGO (e.g. "/media/logo.svg") and every
 * instance switches to it.
 *
 * Parts carry classes so the intro can animate them: .lg-letter[data-l], .lg-head, .lg-rule-l,
 * .lg-rule-r, .lg-sub, .lg-sweep.
 */
import { useId } from "react";
import "./brand/brand.css";
import { site } from "@/lib/content";
import { HEAD_DETAILS, HEAD_OUTLINE, LETTERS, LETTER_ORDER, LOGO_VIEWBOX, RULES, SUBLINE } from "./brand/geometry";

/** TODO(client): path to the real logo file (SVG preferred). */
const REAL_LOGO: string | null = null;

type Props = {
  /** "wordmark" (intro, hero, footer) or "image" (nav: compact, no engraved details). */
  variant?: "wordmark" | "image";
  className?: string;
  /** slow specular sheen across the gold */
  sheen?: boolean;
};

/** Champagne-gold metal (VIVA_ADDENDUM §3); ids are namespaced per instance. */
export function GoldDefs({ id }: { id: string }) {
  return (
    <>
      <linearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="340">
        <stop offset="0" stopColor="#F2DCA8" />
        <stop offset=".24" stopColor="#DEC28C" />
        <stop offset=".5" stopColor="#C8A46B" />
        <stop offset=".58" stopColor="#A6834F" />
        <stop offset=".74" stopColor="#C8A46B" />
        <stop offset="1" stopColor="#E4CA98" />
      </linearGradient>
      <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </>
  );
}

export function HeadDetails({ compact = false }: { compact?: boolean }) {
  const e = HEAD_DETAILS.eye;
  return (
    <g className="lg-details">
      {!compact && (
        <g fill="none" stroke="#3b2a0e" strokeWidth="4" strokeLinecap="round">
          {HEAD_DETAILS.creases.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={HEAD_DETAILS.jaw} />
        </g>
      )}
      <ellipse cx={e.cx} cy={e.cy} rx={e.rx * (compact ? 1.4 : 1)} ry={e.ry * (compact ? 1.4 : 1)} transform={`rotate(${e.rotate} ${e.cx} ${e.cy})`} fill="#3b2a0e" />
    </g>
  );
}

export default function Logo({ variant = "wordmark", className = "", sheen = true }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const label = site.name;

  if (REAL_LOGO) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={REAL_LOGO} alt={label} className={`block h-auto ${className}`} />;
  }

  const compact = variant === "image";
  const gold = `url(#${uid}-gold)`;
  const { x, y, w, h } = LOGO_VIEWBOX;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${x} ${y} ${w} ${h}`}
      className={`viva-logo block h-auto ${sheen ? "has-sheen" : ""} ${className}`}
    >
      <defs>
        <GoldDefs id={uid} />
        <clipPath id={`${uid}-clip`}>
          {LETTER_ORDER.map((k) => (
            <path key={k} d={LETTERS[k]} clipRule="evenodd" />
          ))}
          <path d={HEAD_OUTLINE} />
        </clipPath>
      </defs>

      <g fill={gold} stroke={gold} strokeWidth="7" strokeLinejoin="round" fillRule="evenodd">
        {LETTER_ORDER.map((k) => (
          <path key={k} className="lg-letter" data-l={k} d={LETTERS[k]} />
        ))}
      </g>
      <g className="lg-head">
        <path d={HEAD_OUTLINE} fill={gold} />
        <HeadDetails compact={compact} />
      </g>

      {/* specular sheen / light sweep, clipped to the gold */}
      <g clipPath={`url(#${uid}-clip)`} aria-hidden>
        <rect className="lg-sweep" x={x - 260} y={y} width="220" height={h} fill={`url(#${uid}-sweep)`} transform="skewX(-18)" />
      </g>

      <g stroke={gold} strokeWidth="5" strokeLinecap="round">
        <line className="lg-rule-l" x1={RULES.left.x1} y1={RULES.left.y} x2={RULES.left.x2} y2={RULES.left.y} />
        <line className="lg-rule-r" x1={RULES.right.x1} y1={RULES.right.y} x2={RULES.right.x2} y2={RULES.right.y} />
      </g>
      {/* each letter centred in its own slot: wide, even tracking that doesn't depend on font metrics */}
      <g className="lg-sub" fill="#EAE4DA" textAnchor="middle" style={{ fontFamily: "var(--ff-body), system-ui, sans-serif", fontWeight: 800, fontSize: SUBLINE.size }}>
        {Array.from(SUBLINE.text).map((ch, i, all) => {
          if (ch === " ") return null;
          const slot = (SUBLINE.x2 - SUBLINE.x1) / all.length;
          const x = SUBLINE.x1 + (i + 0.5) * slot;
          return (
            <text key={i} className="lg-sub-ch" x={x} y={SUBLINE.baseline} data-dx={((SUBLINE.x1 + SUBLINE.x2) / 2 - x) * 0.6}>
              {ch}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
