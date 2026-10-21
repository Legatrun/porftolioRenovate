/** Decorative HUD brackets in the four corners of the parent (must be relative). */
export default function HudCorners({ className = "" }) {
  const base = "absolute w-3 h-3 border-accent/70";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} left-0 bottom-0 border-l border-b`} />
      <span className={`${base} right-0 bottom-0 border-r border-b`} />
    </div>
  );
}
