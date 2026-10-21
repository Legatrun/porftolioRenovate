"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Database, Server, Zap, HardDrive, Network, Activity, GitCommit, Package, FlaskConical, ShieldCheck, Rocket, Radio } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import HudCorners from "@/components/ui/HudCorners";
import CodeShowcase from "./CodeShowcase";

const nodes = [
  { id: "cf", name: "CloudFront", Icon: Globe, col: 1, row: 2, desc: "Global CDN edge caching with cache-busting invalidations on every release for low-latency delivery." },
  { id: "s3", name: "S3", Icon: HardDrive, col: 2, row: 1, desc: "Versioned static hosting for Next.js / React builds and media assets." },
  { id: "apigw", name: "API Gateway", Icon: Network, col: 2, row: 3, desc: "Managed REST entry point with throttling, auth and request validation." },
  { id: "lambda", name: "Lambda", Icon: Zap, col: 3, row: 3, desc: "Serverless business logic that scales to zero and bursts on demand." },
  { id: "ec2", name: "EC2", Icon: Server, col: 3, row: 1, desc: "Long-running Node.js / .NET services and workers behind load balancers." },
  { id: "rds", name: "RDS", Icon: Database, col: 4, row: 2, desc: "Managed relational data (MySQL) with automated backups and read replicas." },
  { id: "cw", name: "CloudWatch", Icon: Activity, col: 4, row: 4, desc: "Structured logs, metrics and alarms closing the feedback loop." },
];

const edges = [
  ["cf", "s3"], ["cf", "apigw"], ["apigw", "lambda"], ["lambda", "rds"], ["ec2", "rds"], ["s3", "ec2"], ["lambda", "cw"],
];

const pipeline = [
  { name: "Commit", Icon: GitCommit, tool: "GitHub" },
  { name: "Build", Icon: Package, tool: "Vite · Next.js" },
  { name: "Test", Icon: FlaskConical, tool: "Jest · Cypress" },
  { name: "Quality gate", Icon: ShieldCheck, tool: "SonarQube" },
  { name: "Deploy", Icon: Rocket, tool: "CodeDeploy · Azure DevOps" },
  { name: "Live", Icon: Radio, tool: "CloudFront" },
];

// Grid → SVG coordinates (viewBox 400 x 240)
const pos = (n) => ({ x: (n.col - 0.5) * 100, y: (n.row - 0.5) * 60 });

function Architecture() {
  const [active, setActive] = useState("cf");
  const current = nodes.find((n) => n.id === active);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative rounded-2xl border border-line bg-white/[0.02] p-5 md:p-8">
      <HudCorners className="m-2" />
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        <span>Reference architecture</span>
        <span className="text-accent">Select a service</span>
      </div>

      <div className="relative aspect-[5/3]">
        <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden>
          {edges.map(([a, b], i) => {
            const p1 = pos(byId[a]);
            const p2 = pos(byId[b]);
            const on = active === a || active === b;
            const d = `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`;
            return (
              <g key={i}>
                <path d={d} stroke={on ? "var(--accent)" : "rgba(255,255,255,0.12)"} strokeWidth="1" fill="none" style={{ transition: "stroke .3s" }} />
                <circle r="2.2" fill="var(--accent)" opacity={on ? 1 : 0.35}>
                  <animateMotion dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" path={d} />
                </circle>
              </g>
            );
          })}
        </svg>
        {nodes.map((n) => {
          const p = pos(n);
          const on = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              aria-pressed={on}
              style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 240) * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
            >
              <span
                className={`grid h-11 w-11 md:h-14 md:w-14 place-items-center rounded-xl border backdrop-blur transition-all duration-300 ${
                  on ? "scale-110 border-accent bg-accent/15 text-accent shadow-[0_0_30px_-6px_var(--accent)]" : "border-line bg-black/70 text-white/80"
                }`}
              >
                <n.Icon size={20} />
              </span>
              <span className={`whitespace-nowrap font-mono text-[10px] md:text-[11px] ${on ? "text-white" : "text-muted"}`}>{n.name}</span>
            </button>
          );
        })}
      </div>

      <motion.div key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border-t border-line pt-5">
        <p className="font-display text-xl font-bold">{current.name}</p>
        <p className="mt-1 text-muted">{current.desc}</p>
      </motion.div>
    </div>
  );
}

function Pipeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <div ref={ref} className="rounded-2xl border border-line bg-white/[0.02] p-5 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">CI/CD · automated releases</p>
          <p className="mt-2 font-display text-2xl md:text-3xl font-bold">
            30 min <span className="text-muted">→</span> <span className="text-accent">&lt;5 min</span>
          </p>
        </div>
        <p className="max-w-xs text-sm text-muted">GitHub Actions, AWS CodeDeploy and Azure DevOps pipelines with test and quality gates before every release.</p>
      </div>

      <ol className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {pipeline.map((s, i) => (
          <motion.li
            key={s.name}
            initial={{ opacity: 0.25 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.35, duration: 0.4 }}
            className="relative overflow-hidden rounded-xl border border-line bg-black/50 p-4"
          >
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.35, duration: 0.35 }}
            />
            <s.Icon size={18} className="text-accent" />
            <p className="mt-3 text-sm font-semibold">{s.name}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted">{s.tool}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Cloud() {
  return (
    <section id="cloud" data-theme-section="cloud" className="relative border-t border-line py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="04"
          kicker="Cloud & architecture"
          title="From commit to the edge, automated."
          intro="Production experience across AWS — S3, Lambda, EC2, CloudFront, API Gateway, RDS — with CI/CD that removes human error from every release."
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal className="min-w-0">
            <Architecture />
          </Reveal>
          <Reveal delay={0.1} className="min-w-0">
            <CodeShowcase />
          </Reveal>
        </div>
        <Reveal className="mt-5">
          <Pipeline />
        </Reveal>
      </div>
    </section>
  );
}
