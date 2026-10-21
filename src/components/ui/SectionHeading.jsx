import { Reveal, RevealWords } from "./Reveal";

export default function SectionHeading({ index, kicker, title, intro }) {
  return (
    <div className="mb-8 md:mb-10 short:mb-5 max-w-3xl">
      <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span className="text-accent-ink">{index}</span>
        <span className="h-px w-10 bg-accent/60" />
        {kicker}
      </Reveal>
      <h2 className="mt-4 font-display text-3xl md:text-5xl short:md:text-4xl font-bold tracking-tight leading-[1.02]">
        <RevealWords text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.15} className="mt-4 short:mt-2 text-base md:text-lg short:md:text-base text-muted leading-relaxed">
          <p>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
