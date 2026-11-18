/** Intensity meter: rising signal bars, `level` of `max` lit. Bars light in sequence via CSS. */
export default function SignalBars({ level, max = 5, label = "Intensity", className = "" }: { level: number; max?: number; label?: string; className?: string }) {
  return (
    <div className={`signal ${className}`} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={level}>
      <span className="signal-bars" aria-hidden>
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={i < level ? "is-on" : ""} style={{ ["--i" as string]: i, height: `${30 + (i * 70) / (max - 1)}%` }} />
        ))}
      </span>
    </div>
  );
}
