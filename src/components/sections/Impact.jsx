"use client";
import { metrics, profile } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import ScrubText from "@/components/ui/ScrubText";
import { Reveal } from "@/components/ui/Reveal";

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
        className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-7 md:p-8 transition-colors hover:border-white/20"
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
          className="relative mt-8 block font-display text-6xl md:text-7xl font-bold tracking-tighter tabular-nums"
        />
        <p className="relative mt-3 text-muted">{m.label}</p>
      </article>
    </Reveal>
  );
}

export default function Impact() {
  return (
    <section id="impact" data-theme-section="default" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">01</span>
          <span className="h-px w-10 bg-accent/60" />
          Impact in numbers
        </div>
        <ScrubText
          text={`${profile.summary} I believe ${profile.belief.charAt(0).toLowerCase()}${profile.belief.slice(1)}`}
          className="max-w-5xl font-display text-3xl md:text-5xl font-medium leading-[1.15] tracking-tight"
        />

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
