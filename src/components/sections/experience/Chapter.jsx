"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn, SCREEN } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { DeltaXVisual, TremVisual, AlphaVisual } from "./Visuals";
import { YapeVisual } from "./Visuals";
import YapeChapter from "./YapeChapter";
import DeltaXChapter from "./deltax/DeltaXChapter";
import TremChapter from "./trem/TremChapter";
import AlphaChapter from "./alpha/AlphaChapter";

const styles = {
  yape: {
    visual: YapeVisual,
    title: "font-display font-bold tracking-tight",
    card: "rounded-3xl",
    chip: "rounded-full",
    bullet: "rounded-full",
  },
  deltax: {
    visual: DeltaXVisual,
    title: "font-mono font-medium uppercase tracking-tighter",
    card: "rounded-none",
    chip: "rounded-none font-mono uppercase text-[11px] tracking-wider",
    bullet: "rounded-none",
  },
  trem: {
    visual: TremVisual,
    title: "font-display font-medium uppercase tracking-[0.08em]",
    card: "rounded-none",
    chip: "rounded-none uppercase text-[11px] tracking-[0.2em]",
    bullet: "rounded-none rotate-45",
  },
  alpha: {
    visual: AlphaVisual,
    title: "font-sans font-semibold tracking-tight",
    card: "rounded-xl",
    chip: "rounded-md",
    bullet: "rounded-sm",
  },
};

export default function Chapter({ job, index }) {
  if (job.id === "yape") return <YapeChapter job={job} index={index} />;
  if (job.id === "deltax") return <DeltaXChapter job={job} index={index} />;
  if (job.id === "trem") return <TremChapter job={job} index={index} />;
  if (job.id === "alpha") return <AlphaChapter job={job} index={index} />;
  return <StandardChapter job={job} index={index} />;
}

function StandardChapter({ job, index }) {
  const ref = useRef(null);
  const s = styles[job.id];
  const Visual = s.visual;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);

  return (
    <article
      ref={ref}
      id={`exp-${job.id}`}
      data-theme-section={job.id}
      className={cn(SCREEN, "overflow-x-clip")}
    >
      <motion.div
        aria-hidden
        style={{ x: bgX }}
        className={cn("text-outline pointer-events-none absolute top-10 whitespace-nowrap text-[22vw] leading-none select-none", s.title)}
      >
        {job.company}
      </motion.div>
      <div aria-hidden className="glow-orb absolute -left-[20vmax] top-1/3 h-[45vmax] w-[45vmax] opacity-40" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        {/* Sticky identity column */}
        <div>
          <Reveal className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">
            <span>Chapter {String(index + 1).padStart(2, "0")}</span>
            <span className="hidden h-px w-8 bg-accent/60 sm:block" />
            <span className="text-muted">{job.sector}</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h3 className={cn("mt-3 text-4xl md:text-6xl short:md:text-5xl leading-[0.95]", s.title)}>{job.company}</h3>
          </Reveal>
          <Reveal delay={0.1} className="mt-3 text-lg text-white/90">
            {job.role}
          </Reveal>
          <Reveal delay={0.15} className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted">
            <span>{job.period}</span>
            <span aria-hidden>·</span>
            <span>{job.location}</span>
          </Reveal>

          <Reveal delay={0.2} className="mt-5 max-w-md text-sm md:text-base leading-relaxed text-muted">
            <p>{job.summary}</p>
          </Reveal>

          <div className="mt-6 short:mt-4 grid grid-cols-3 gap-3">
            {job.highlights.map((h, i) => (
              <Reveal key={h.label} delay={0.25 + i * 0.07}>
                <div className={cn("border border-line bg-white/[0.04] p-3 transition-colors hover:border-accent", s.card)}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-accent tabular-nums">{h.stat}</p>
                  <p className="mt-1 text-xs text-muted">{h.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent-ink"
            >
              Visit {job.company}
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        {/* Narrative column */}
        <div>
          <div>
            <Reveal>
              <Visual />
            </Reveal>
          </div>

          <ol className="mt-6 short:mt-4 space-y-3 short:space-y-2">
            {job.bullets.map((b, i) => (
              <Reveal key={i} delay={i * 0.05} as="li" className="group flex gap-5">
                <span className="mt-2 flex-none">
                  <span className={cn("block h-2 w-2 bg-accent transition-transform group-hover:scale-150", s.bullet)} />
                </span>
                <p className="text-sm md:text-[15px] leading-relaxed text-white/85 transition-colors group-hover:text-white">{b}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-6 flex flex-wrap gap-1.5">
            {job.stack.map((t) => (
              <span key={t} className={cn("border border-line bg-white/[0.04] px-2.5 py-1 text-xs text-white/85 transition hover:border-accent hover:text-white", s.chip)}>
                {t}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </article>
  );
}
