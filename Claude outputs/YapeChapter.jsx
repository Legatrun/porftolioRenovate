"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn, SCREEN } from "@/lib/utils";
import YapeStage from "./yape3d/YapeStage";

const EASE = [0.65, 0, 0.35, 1];
const MASK_DURATION = 0.9;
const MASK_STAGGER = 0.08;

const mask = {
  hidden: { clipPath: "inset(0 100% 0 0)", x: -12 },
  shown: ({ i, reduce }) => ({
    clipPath: "inset(0 0% 0 0)",
    x: 0,
    transition: { duration: reduce ? 0 : MASK_DURATION, delay: reduce ? 0 : i * MASK_STAGGER, ease: EASE },
  }),
};

/** A block that unmasks left → right when its parent switches to "shown". */
function M({ i, reduce, className, children, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag custom={{ i, reduce }} variants={mask} className={className}>
      {children}
    </Tag>
  );
}

/*
  Chained sequence:
  1. Section locks into view → text blocks unmask left-to-right (staggered).
  2. When the last block finishes → the phones slide in and the transfer starts.
  3. Scrolling on → <MorphBridge /> turns the receiving phone into the DeltaX trailer.
*/
export default function YapeChapter({ job, index }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const locked = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const [revealed, setRevealed] = useState(false);
  const [sceneActive, setSceneActive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);

  const blocks = 7; // number of masked blocks below
  const revealTime = reduce ? 0 : (MASK_DURATION + MASK_STAGGER * (blocks - 1)) * 1000;

  useEffect(() => {
    if (!locked) {
      const t = setTimeout(() => setSceneActive(false), 0);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setRevealed(true), 0);
    const t2 = setTimeout(() => setSceneActive(true), revealed ? 150 : revealTime * 0.75);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [locked, revealed, revealTime]);

  return (
    <article ref={ref} id={`exp-${job.id}`} data-theme-section={job.id} className={cn(SCREEN, "overflow-x-clip")}>
      <motion.div
        aria-hidden
        style={{ x: bgX }}
        className="text-outline pointer-events-none absolute top-10 whitespace-nowrap font-display text-[22vw] font-bold leading-none tracking-tight select-none"
      >
        {job.company}
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        {/* Text — unmasks left → right */}
        <motion.div initial="hidden" animate={revealed ? "shown" : "hidden"}>
          <M i={0} reduce={reduce} className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.25em] text-accent-ink">
            <span>Chapter {String(index + 1).padStart(2, "0")}</span>
            <span className="hidden h-px w-8 bg-accent/60 sm:block" />
            <span className="text-muted">{job.sector}</span>
          </M>
          <M i={1} reduce={reduce} as="h3" className="mt-3 font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl short:md:text-5xl">
            {job.company}
          </M>
          <M i={2} reduce={reduce} className="mt-3">
            <p className="text-lg text-white/90">{job.role}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 font-mono text-xs uppercase tracking-widest text-muted">
              <span>{job.period}</span>
              <span aria-hidden>·</span>
              <span>{job.location}</span>
            </p>
          </M>
          <M i={3} reduce={reduce} className="mt-4 max-w-lg text-sm leading-relaxed text-muted short:hidden">
            <p>{job.summary}</p>
          </M>
          <M i={4} reduce={reduce} className="mt-5 short:mt-3 grid max-w-lg grid-cols-3 gap-3">
            {job.highlights.map((h) => (
              <div key={h.label} className="rounded-2xl border border-line bg-white/[0.06] p-3">
                <p className="font-display text-2xl font-bold tabular-nums text-accent md:text-3xl">{h.stat}</p>
                <p className="mt-1 text-xs text-muted">{h.label}</p>
              </div>
            ))}
          </M>
          <M i={5} reduce={reduce} as="ol" className="mt-5 short:mt-3 max-w-lg space-y-2">
            {job.bullets.map((b, i) => (
              <li key={i} className="group flex gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-accent transition-transform group-hover:scale-150" />
                <span className="text-[13px] leading-snug text-white/85 md:text-sm">{b}</span>
              </li>
            ))}
          </M>
          <M i={6} reduce={reduce} className="mt-5 short:mt-3 flex flex-wrap items-center gap-1.5">
            {job.stack.map((t) => (
              <span key={t} className="rounded-full border border-line bg-white/[0.06] px-2.5 py-1 text-xs text-white/85">
                {t}
              </span>
            ))}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group ml-1 inline-flex items-center gap-1 text-xs text-muted transition hover:text-accent-ink"
            >
              Visit {job.company}
              <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </M>
        </motion.div>

        {/* Money transfer scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={revealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <YapeStage active={sceneActive} />
        </motion.div>
      </div>
    </article>
  );
}
