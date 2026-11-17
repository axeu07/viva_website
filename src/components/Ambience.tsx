/**
 * Global colour-temperature wash, fixed over the page. Its colour and darkness come from the
 * day clock via CSS variables (--tint, --tint-a, --dark-a), set by <DayClock />.
 */
export default function Ambience() {
  return (
    <div aria-hidden className="ambience">
      <span className="amb-tint" />
      <span className="amb-dark" />
      <span className="amb-grain" />
    </div>
  );
}
