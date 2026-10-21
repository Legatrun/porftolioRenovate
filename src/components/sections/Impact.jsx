"use client";
import { metrics, profile } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { SCREEN } from "@/lib/utils";

function MetricCard({ m, i }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Reveal delay={(i % 3) * 0.08}>
      <article
        onPointerMove={onMove}
        className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-5 md:p-6 transition-colors hover:border-white/20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(320px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)" }}
        />
        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          <span>{String(i + 1).padStart(2, "0")}</span>
          <span>{m.context}</span>
        </div>
        <Counter
          value={m.value}
          prefix={m.prefix}
          suffix={m.suffix}
          className="relative mt-4 block whitespace-nowrap font-display text-4xl md:text-5xl font-bold tracking-tighter tabular-nums"
        />
        <p className="relative mt-2 text-sm text-muted">{m.label}</p>
      </article>
    </Reveal>
  );
}

export default function Impact() {
  return (
    <section id="impact" data-theme-section="default" className={SCREEN}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="text-accent-ink">01</span>
            <span className="h-px w-10 bg-accent/60" />
            Impact in numbers
          </Reveal>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight">
            <RevealWords text="Performance you can measure." />
          </h2>
          <Reveal delay={0.15} className="mt-6 text-base md:text-lg leading-relaxed text-muted">
            <p>{profile.summary}</p>
            <p className="mt-4 text-white/90">{profile.belief}</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
