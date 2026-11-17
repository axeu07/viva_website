/**
 * The one place the Viva logo is rendered. When the client sends the real logo,
 * set REAL_LOGO below (e.g. "/media/logo.svg") and every variant switches to it.
 */
import { logoSrc } from "@/lib/media";
import { site } from "@/lib/content";

/** TODO(client): path to the real logo file (SVG preferred). */
const REAL_LOGO: string | null = null;

type Props = {
  /** wordmark: typeset metallic-gold VIVA + PREMIUM GYM (intro, hero, footer). image: raster logo (nav). */
  variant?: "wordmark" | "image";
  className?: string;
  /** animated specular sheen across the gold */
  sheen?: boolean;
};

export default function Logo({ variant = "wordmark", className = "", sheen = true }: Props) {
  const label = site.name;

  if (REAL_LOGO) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={REAL_LOGO} alt={label} className={`block h-auto ${className}`} />;
  }

  if (variant === "image" && logoSrc) {
    // Stopgap raster (transparent PNG, cut from a reel end card by `npm run media`).
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoSrc} alt={label} width={272} height={118} className={`block h-auto ${className}`} />;
  }

  return (
    <span role="img" aria-label={label} className={`logo-wordmark ${sheen ? "has-sheen" : ""} ${className}`}>
      <span className="lw-viva" data-text="VIVA" aria-hidden>
        VIVA
      </span>
      <span className="lw-sub" aria-hidden>
        Premium Gym
      </span>
    </span>
  );
}
