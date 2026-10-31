"use client";
import { motion, useReducedMotion } from "framer-motion";
import { metrics, profile } from "@/lib/data";
import Counter from "@/components/ui/Counter";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { SCREEN, cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1];
const VIEW = { once: true, margin: "-10% 0px" };

/* ---------- Mini visualizations (one per metric) ---------- */

/** Dot field: the ecosystem lighting up. Twinkle is CSS so 160 dots cost nothing. */
function UsersViz() {
  const cols = 20, rows = 8;
  return (
    <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} className="h-full w-full" aria-hidden>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) * 10 + 5, y = Math.floor(i / cols) * 10 + 5;
        const lit = (i * 37) % 11 < 3;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={lit ? 2.4 : 1.6}
            className={lit ? "dot-twinkle" : undefined}
            style={{ fill: "var(--on-accent)", opacity: lit ? 0.9 : 0.22, animationDelay: `${(i % 13) * 0.23}s` }}
          />
        );
      })}
    </svg>
  );
}

/** Step line: flat score, then the jump. */
function GaugeViz() {
  return (
    <svg viewBox="0 0 120 36" preserveAspectRatio="xMinYMid meet" className="h-10 w-full max-w-[12rem] overflow-visible" aria-hidden>
      <line x1="0" y1="34" x2="120" y2="34" stroke="var(--line)" />
      <motion.path
        d="M0 28 H58 V8 H120"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      />
      <text x="62" y="22" className="fill-[var(--accent-ink)] font-mono text-[8px]">+22</text>
      <motion.circle cx="120" cy="8" r="3.5" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEW} transition={{ delay: 1.4 }} />
    </svg>
  );
}

/** 1 block before, 10 blocks after. */
function RatioViz() {
  return (
    <div className="space-y-1.5 font-mono text-[9px] uppercase tracking-widest text-muted" aria-hidden>
      {[1, 10].map((n, r) => (
        <div key={n} className="flex items-center gap-2">
          <span className="w-10">{r ? "after" : "before"}</span>
          <div className="grid flex-1 grid-cols-10 gap-[3px]">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.span
                key={i}
                className={cn("h-2.5", i < n ? "bg-accent" : "bg-white/[0.07]")}
                initial={{ opacity: 0, scaleY: 0.2 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={VIEW}
                transition={{ delay: 0.15 + r * 0.25 + i * 0.04, duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Load time bar shrinking to 20%. */
function ProgressViz() {
  return (
    <div className="space-y-1.5 font-mono text-[9px] uppercase tracking-widest text-muted" aria-hidden>
      {[
        { k: "before", w: 1, c: "bg-white/20" },
        { k: "after", w: 0.2, c: "bg-accent" },
      ].map((b, i) => (
        <div key={b.k} className="flex items-center gap-2">
          <span className="w-10">{b.k}</span>
          <div className="h-2.5 flex-1 bg-white/[0.05]">
            <motion.div
              className={cn("h-full origin-left", b.c)}
              style={{ width: `${b.w * 100}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEW}
              transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.25 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Clock face: the 30-minute deploy, with the 5 minutes it takes now. */
function DeployViz({ from = 30, to = 5 }) {
  const r = 15, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-muted" aria-hidden>
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="5" strokeDasharray="2 1.15" />
        <motion.circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - to / from) }}
          viewport={VIEW}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <span className="leading-relaxed">
        <span className="block line-through decoration-white/40">{from} min</span>
        <span className="block text-accent-ink">{to} min</span>
      </span>
    </div>
  );
}

/** Year ruler from the first job to today. */
function YearsViz({ since = 2020 }) {
  const now = new Date().getFullYear();
  const years = Array.from({ length: now - since + 1 }, (_, i) => since + i);
  return (
    <div className="relative w-full pt-1" aria-hidden>
      <div className="relative h-px bg-white/15">
        <motion.div
          className="absolute inset-y-0 left-0 h-[3px] -translate-y-px origin-left bg-accent"
          style={{ width: "100%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEW}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        />
        <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
        </span>
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] tracking-widest text-muted">
        {years.map((y, i) => (
          <span key={y} className={cn("relative pt-2", i === years.length - 1 && "text-accent-ink")}>
            <span className="absolute left-1/2 top-[-12px] h-2 w-px -translate-x-1/2 bg-white/30" />
            {i === years.length - 1 ? "Now" : y}
          </span>
        ))}
      </div>
    </div>
  );
}

const VIZ = { gauge: GaugeViz, ratio: RatioViz, progress: ProgressViz, deploy: DeployViz };

/* ---------- Tiles ---------- */

function TileHead({ i, context, onAccent }) {
  return (
    <div className={cn("flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]", onAccent ? "text-on-accent/70" : "text-muted")}>
      <span>{String(i + 1).padStart(2, "0")}</span>
      <span className={cn("rounded-sm border px-1.5 py-0.5 tracking-[0.18em]", onAccent ? "border-on-accent/30" : "border-line")}>{context}</span>
    </div>
  );
}

const tileBase =
  "group relative flex h-full flex-col overflow-hidden rounded-xl border transition-[transform,box-shadow,border-color] duration-300 hover:-translate-x-1 hover:-translate-y-1";

function FeaturedTile({ m, i }) {
  return (
    <article className={cn(tileBase, "border-accent bg-accent p-5 md:p-7 short:md:p-5 text-on-accent hover:shadow-[6px_6px_0_0_var(--color-fg)]")}>
      <TileHead i={i} context={m.context} onAccent />
      <div className="relative mt-4 min-h-24 flex-1 short:min-h-16">
        <div className="absolute inset-0"><UsersViz /></div>
      </div>
      <div className="relative mt-4">
        <Counter
          value={m.value}
          prefix={m.prefix}
          suffix={m.suffix}
          className="block whitespace-nowrap font-display text-7xl md:text-8xl short:md:text-7xl font-bold leading-[0.85] tracking-tighter tabular-nums"
        />
        <p className="mt-3 max-w-xs text-sm md:text-base font-medium">{m.label}</p>
      </div>
    </article>
  );
}

function Tile({ m, i }) {
  const Viz = VIZ[m.viz];
  return (
    <article className={cn(tileBase, "border-line bg-white/[0.02] p-4 sm:p-5 short:p-4 hover:border-accent hover:shadow-[5px_5px_0_0_var(--accent)]")}>
      <TileHead i={i} context={m.context} />
      <Counter
        value={m.value}
        prefix={m.prefix}
        suffix={m.suffix}
        className="mt-3 block whitespace-nowrap font-display text-3xl sm:text-4xl md:text-5xl short:md:text-4xl font-bold tracking-tighter tabular-nums"
      />
      <p className="mt-1 text-xs sm:text-sm text-muted">{m.label}</p>
      {Viz && <div className="mt-auto pt-4 short:pt-3"><Viz from={m.from} to={m.value} /></div>}
    </article>
  );
}

function YearsTile({ m, i }) {
  return (
    <article className={cn(tileBase, "border-line bg-white/[0.02] p-5 short:py-3 hover:border-accent hover:shadow-[5px_5px_0_0_var(--accent)] md:flex-row md:items-center md:gap-10")}>
      <div className="flex flex-none items-baseline gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{String(i + 1).padStart(2, "0")}</span>
        <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} className="font-display text-4xl md:text-5xl short:md:text-4xl font-bold tracking-tighter tabular-nums" />
        <p className="max-w-[11rem] text-sm leading-snug text-muted">{m.label}</p>
      </div>
      <div className="mt-5 flex-1 md:mt-0">
        <YearsViz since={m.since} />
      </div>
    </article>
  );
}

export default function Impact() {
  const reduce = useReducedMotion();
  const featured = metrics.find((m) => m.viz === "users");
  const years = metrics.find((m) => m.viz === "years");
  const rest = metrics.filter((m) => m !== featured && m !== years);
  const indexOf = (m) => metrics.indexOf(m);

  return (
    <section id="impact" data-theme-section="default" className={SCREEN}>
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <header className="mb-8 short:mb-5 grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
              <span className="text-accent-ink">01</span>
              <span className="h-px w-10 bg-accent/60" />
              Impact in numbers
            </Reveal>
            <h2 className="mt-4 font-display text-4xl md:text-6xl short:md:text-5xl font-bold leading-[0.95] tracking-tighter">
              <RevealWords text="Performance you" />
              <br />
              <RevealWords text="can measure." delay={0.1} wordClassName="text-gradient" />
            </h2>
          </div>
          <Reveal delay={0.15} className="text-sm md:text-base leading-relaxed text-muted">
            <p>{profile.summary}</p>
            <p className="mt-4 short:hidden border-l-2 border-accent pl-4 font-mono text-xs uppercase leading-relaxed tracking-wider text-white/85">
              {profile.belief}
            </p>
          </Reveal>
        </header>

        <motion.div
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          initial={reduce ? false : "hidden"}
          whileInView="shown"
          viewport={VIEW}
          transition={{ staggerChildren: 0.07 }}
        >
          {[featured, ...rest, years].map((m) => {
            const i = indexOf(m);
            const span = m === featured ? "col-span-2 lg:row-span-2" : m === years ? "col-span-2 lg:col-span-4" : "";
            return (
              <motion.div
                key={m.label}
                className={span}
                variants={{ hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {m === featured ? <FeaturedTile m={m} i={i} /> : m === years ? <YearsTile m={m} i={i} /> : <Tile m={m} i={i} />}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
