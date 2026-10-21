import { Reveal, RevealWords } from "./Reveal";

export default function SectionHeading({ index, kicker, title, intro }) {
  return (
    <div className="mb-14 md:mb-20 max-w-3xl">
      <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span className="text-accent">{index}</span>
        <span className="h-px w-10 bg-accent/60" />
        {kicker}
      </Reveal>
      <h2 className="mt-5 font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">
        <RevealWords text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.15} className="mt-6 text-lg text-muted leading-relaxed">
          <p>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
