"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Atom, Cloud, Pause, Play } from "lucide-react";
import { achievements, coreTech } from "@/lib/data";
import { SCREEN, cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";

const CYCLE_MS = 6000;
const EASE = [0.16, 1, 0.3, 1];
const ICONS = { react: Atom, aws: Cloud };
const pad = (n) => String(n).padStart(2, "0");

function Glyph({ t, size = 18 }) {
  const I = ICONS[t.id];
  return I ? <I size={size} /> : <span className="font-mono text-sm font-bold">{t.glyph}</span>;
}

export default function ImpactStack() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const tabs = useRef([]);
  const inView = useInView(ref, { margin: "-30% 0px" });
  const tech = coreTech[idx];
  const n = coreTech.length;

  // Auto-advance while visible, until the visitor takes control.
  useEffect(() => {
    if (!auto || !inView) return;
    const id = setTimeout(() => setIdx((i) => (i + 1) % n), CYCLE_MS);
    return () => clearTimeout(id);
  }, [auto, inView, idx, n]);

  const go = (i, focus = false) => {
    const next = (i + n) % n;
    setAuto(false);
    setIdx(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), go(idx + 1, true));
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), go(idx - 1, true));
  };

  const ticker = [...achievements, ...achievements];

  return (
    <section id="tech-impact" ref={ref} data-theme-section="default" className={cn(SCREEN, "overflow-hidden")}>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="05"
            kicker="Impact & tech stack"
            title="The tools, and what they shipped."
            intro="Core technologies behind six years of production work — and the results each one delivered."
          />
          {/* Controls */}
          <div className="mb-8 md:mb-10 short:mb-5 flex flex-none items-center gap-2">
            <span className="mr-2 font-mono text-xs tracking-[0.2em] text-muted">
              <span className="text-fg">{pad(idx + 1)}</span> / {pad(n)}
            </span>
            {[
              { label: "Previous technology", Icon: ArrowLeft, on: () => go(idx - 1) },
              { label: "Next technology", Icon: ArrowRight, on: () => go(idx + 1) },
            ].map(({ label, Icon, on }) => (
              <button key={label} onClick={on} aria-label={label} className="grid h-10 w-10 place-items-center rounded-sm border border-line text-muted transition hover:border-accent hover:text-accent-ink">
                <Icon size={16} />
              </button>
            ))}
            <button
              onClick={() => setAuto((a) => !a)}
              aria-label={auto ? "Pause autoplay" : "Resume autoplay"}
              aria-pressed={!auto}
              className="grid h-10 w-10 place-items-center rounded-sm border border-line text-muted transition hover:border-accent hover:text-accent-ink"
            >
              {auto ? <Pause size={15} /> : <Play size={15} />}
            </button>
          </div>
        </div>

        {/* Technology tabs */}
        <div
          role="tablist"
          aria-label="Core technologies"
          onKeyDown={onKey}
          className="-mx-5 flex overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"
        >
          {coreTech.map((t, i) => {
            const on = i === idx;
            return (
              <button
                key={t.id}
                ref={(el) => (tabs.current[i] = el)}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={on}
                aria-controls="tech-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className={cn(
                  "group relative flex flex-none items-center gap-3 whitespace-nowrap border border-line px-4 py-3.5 text-left transition-colors md:flex-1 [&:not(:first-child)]:-ml-px",
                  "first:rounded-l-xl last:rounded-r-xl",
                  on ? "z-10 border-accent bg-accent text-on-accent" : "bg-white/[0.02] hover:z-10 hover:border-white/30"
                )}
              >
                <span className={cn("font-mono text-[10px] tracking-[0.2em]", on ? "text-on-accent/60" : "text-muted")}>{pad(i + 1)}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid h-8 w-8 flex-none place-items-center rounded-sm transition-colors",
                    on ? "bg-on-accent text-accent" : "bg-white/[0.06] text-white/80 group-hover:text-white"
                  )}
                >
                  <Glyph t={t} size={16} />
                </span>
                <span className="font-display text-base font-semibold lg:text-lg">{t.name}</span>
                {on && auto && (
                  <motion.span
                    key={`bar-${idx}`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-on-accent/50"
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
        <div
          id="tech-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tech.id}`}
          className="relative mt-3 min-h-[20rem] short:min-h-0 overflow-hidden rounded-xl border border-line bg-white/[0.02]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tech.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative grid lg:grid-cols-[0.7fr_1.3fr]"
            >
              {/* Oversized outline name, streetwear-poster style */}
              <motion.span
                aria-hidden
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="text-outline pointer-events-none absolute -bottom-7 right-0 hidden select-none whitespace-nowrap font-display text-[8rem] font-bold leading-none tracking-tighter lg:block short:text-[6.5rem]"
              >
                {tech.name}
              </motion.span>

              {/* Stat column */}
              <div className="relative border-b border-line p-6 md:p-8 short:md:p-6 lg:border-b-0 lg:border-r">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-ink">Headline result</p>
                <motion.p
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mt-3 font-display text-6xl md:text-7xl short:md:text-6xl font-bold leading-none tracking-tighter text-accent"
                >
                  {tech.stat}
                </motion.p>
                <p className="mt-2 text-sm text-muted">{tech.statLabel}</p>

                <p className="mt-6 short:mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Shipped at</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {tech.usedAt.map((u) => (
                    <li key={u} className="rounded-sm bg-white/[0.07] px-2.5 py-1 text-sm font-medium">{u}</li>
                  ))}
                </ul>
              </div>

              {/* Story column */}
              <div className="relative p-6 md:p-8 lg:pb-24 short:md:p-6 short:lg:pb-20">
                <motion.p
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  className="max-w-2xl font-display text-xl md:text-2xl short:md:text-xl font-medium leading-snug tracking-tight"
                >
                  {tech.achievement}
                </motion.p>

                <ol className="mt-5 short:mt-3 divide-y divide-line border-y border-line">
                  {tech.solutions.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.07, duration: 0.4 }}
                      className="flex gap-4 py-2.5 short:py-2 text-sm text-white/85"
                    >
                      <span className="font-mono text-[11px] text-accent-ink">{pad(i + 1)}</span>
                      {s}
                    </motion.li>
                  ))}
                </ol>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tech.tools.map((t) => (
                    <span key={t} className="rounded-sm border border-line bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* High-impact achievements ticker */}
      <div className="mask-x group mt-6 short:mt-4 overflow-hidden border-y border-line py-4 short:py-3" aria-label="High-impact achievements">
        <ul className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {ticker.map((a, i) => (
            <li key={i} aria-hidden={i >= achievements.length} className="flex items-center gap-4 pr-10">
              <span className="font-display text-3xl md:text-4xl short:md:text-3xl font-bold tracking-tighter">{a.value}</span>
              <span className="max-w-[12rem] text-xs leading-tight text-muted md:text-sm">{a.label}</span>
              <span aria-hidden className="ml-6 h-2 w-2 rotate-45 bg-accent" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
