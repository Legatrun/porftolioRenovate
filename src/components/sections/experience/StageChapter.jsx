"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn, SCREEN } from "@/lib/utils";

const EASE = [0.65, 0, 0.35, 1];

const mask = {
  hidden: { clipPath: "inset(0 100% 0 0)", x: -12 },
  shown: ({ i, reduce }) => ({
    clipPath: "inset(0 0% 0 0)",
    x: 0,
    transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.08, ease: EASE },
  }),
};

function M({ i, reduce, className, children, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag custom={{ i, reduce }} variants={mask} className={className}>
      {children}
    </Tag>
  );
}

/*
  Chapter layout shared by DeltaX / Trem: text in the left 30%, an animated `Stage` in the
  remaining 70% (full-bleed on desktop, a block under the text on mobile).
*/
export default function StageChapter({ job, index, Stage, titleClass, cardClass = "", tone }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const locked = useInView(ref, { margin: "-35% 0px -35% 0px", once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);

  return (
    <article ref={ref} id={`exp-${job.id}`} data-theme-section={job.id} className={cn(SCREEN, "overflow-x-clip", tone === "light" && "tone-light")}>
      <motion.div
        aria-hidden
        style={{ x: bgX }}
        className={cn("text-outline pointer-events-none absolute top-10 whitespace-nowrap text-[22vw] leading-none select-none", titleClass)}
      >
        {job.company}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <motion.div initial="hidden" animate={locked ? "shown" : "hidden"} className="lg:w-[30%]">
          <M i={0} reduce={reduce} className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">
            <span>Chapter {String(index + 1).padStart(2, "0")}</span>
            <span className="hidden h-px w-8 bg-accent/60 sm:block" />
            <span className="text-muted">{job.sector}</span>
          </M>
          <M i={1} reduce={reduce} as="h3" className={cn("mt-3 text-4xl leading-[0.95] md:text-6xl short:md:text-5xl", titleClass)}>
            {job.company}
          </M>
          <M i={2} reduce={reduce} className="mt-3">
            <p className="text-lg text-fg/90">{job.role}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 font-mono text-xs uppercase tracking-widest text-muted">
              <span>{job.period}</span>
              <span aria-hidden>·</span>
              <span>{job.location}</span>
            </p>
          </M>
          <M i={3} reduce={reduce} className="mt-4 text-sm leading-relaxed text-muted">
            <p>{job.summary}</p>
          </M>
          <M i={4} reduce={reduce} className="mt-5 grid grid-cols-3 gap-2 short:mt-3">
            {job.highlights.map((h) => (
              <div key={h.label} className={cn("border border-line bg-fg/[0.04] p-3", cardClass)}>
                <p className="font-display text-2xl font-bold tabular-nums text-accent">{h.stat}</p>
                <p className="mt-1 text-xs text-muted">{h.label}</p>
              </div>
            ))}
          </M>
          {job.bullets.length > 0 && (
            <M i={5} reduce={reduce} as="ol" className="mt-5 space-y-2 short:mt-3">
              {job.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none bg-accent" />
                  <span className="text-[13px] leading-snug text-fg/85 md:text-sm">{b}</span>
                </li>
              ))}
            </M>
          )}
          <M i={6} reduce={reduce} className="mt-5">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent-ink"
            >
              Visit {job.company}
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </M>
        </motion.div>
      </div>

      <Stage />
    </article>
  );
}
