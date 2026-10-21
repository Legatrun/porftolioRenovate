"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Atom, Cloud } from "lucide-react";
import { achievements, coreTech } from "@/lib/data";
import { SCREEN, cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const CYCLE_MS = 5000;
const ICONS = { react: Atom, aws: Cloud };

export default function ImpactStack() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-30% 0px" });
  const tech = coreTech[idx];

  // Auto-advance while visible, until the visitor picks a technology.
  useEffect(() => {
    if (!auto || !inView) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % coreTech.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [auto, inView]);

  const pick = (i) => {
    setAuto(false);
    setIdx(i);
  };

  return (
    <section id="tech-impact" ref={ref} data-theme-section="default" className={SCREEN}>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="05"
          kicker="Impact & tech stack"
          title="The tools, and what they shipped."
          intro="Core technologies behind six years of production work — and the results each one delivered."
        />

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Technology selector */}
          <div role="tablist" aria-label="Core technologies" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 lg:pb-0">
            {coreTech.map((t, i) => {
              const on = i === idx;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="tech-panel"
                  onClick={() => pick(i)}
                  className={cn(
                    "group relative flex-none overflow-hidden rounded-xl border p-3 text-left transition-colors lg:flex lg:items-center lg:gap-4 lg:px-5 lg:py-4 short:lg:py-3",
                    on ? "border-accent bg-accent/10" : "border-line bg-white/[0.02] hover:border-white/25"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 flex-none place-items-center rounded-lg font-mono text-sm font-bold transition-colors",
                      on ? "btn-accent" : "bg-white/[0.06] text-white/80"
                    )}
                    aria-hidden
                  >
                    {ICONS[t.id] ? (() => { const I = ICONS[t.id]; return <I size={18} />; })() : t.glyph}
                  </span>
                  <span className="mt-2 block text-xs font-semibold sm:text-sm lg:mt-0 lg:text-base">{t.name}</span>
                  <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-widest text-muted lg:block">{t.usedAt[0]}</span>
                  {on && auto && (
                    <motion.span
                      key={`bar-${idx}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: inView ? 1 : 0 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div id="tech-panel" role="tabpanel" className="relative min-h-[22rem] short:min-h-0 overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-6 md:p-8 short:md:p-6">
            <div aria-hidden className="glow-orb absolute -right-24 -top-24 h-72 w-72 opacity-40" />
            <AnimatePresence mode="wait">
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid gap-6 md:grid-cols-[auto_1fr] md:gap-10"
              >
                <div>
                  <p className="font-display text-6xl md:text-7xl font-bold tracking-tighter text-accent">{tech.stat}</p>
                  <p className="mt-1 text-sm text-muted">{tech.statLabel}</p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Used at</p>
                  <p className="mt-1 text-sm">{tech.usedAt.join(" · ")}</p>
                </div>
                <div>
                  <p className="text-lg short:text-base leading-relaxed">{tech.achievement}</p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-ink">Solutions engineered</p>
                  <ul className="mt-3 space-y-2.5">
                    {tech.solutions.map((s, i) => (
                      <motion.li
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.07 }}
                        className="flex gap-3 text-sm text-white/85"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {tech.tools.map((t) => (
                      <span key={t} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* High-impact achievements */}
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {achievements.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.06} className="bg-[var(--bg)] p-4 md:p-5">
              <p className="font-display text-2xl md:text-3xl font-bold tracking-tight">{a.value}</p>
              <p className="mt-1 text-xs md:text-sm text-muted">{a.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
