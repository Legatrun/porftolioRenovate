"use client";
import { motion } from "framer-motion";

/* Signature visuals — abstract design cues inspired by each company's digital identity. */

export function YapeVisual() {
  const dots = Array.from({ length: 64 }, (_, i) => i);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5b10a8] via-[#9b2bd8] to-[#ff2d9b] p-6">
      <motion.div
        aria-hidden
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">Super-app</span>
          <span className="font-mono text-xs text-white/80">20M+ users</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-white/80">Lighthouse</p>
            <p className="font-display text-6xl font-bold leading-none">+22</p>
          </div>
          <div className="grid grid-cols-8 gap-1.5 rounded-2xl bg-white p-3" aria-hidden>
            {dots.map((d) => (
              <motion.span
                key={d}
                className="h-2 w-2 rounded-[3px] bg-[#5b10a8]"
                initial={{ opacity: 0.1 }}
                whileInView={{ opacity: (d * 7) % 5 > 1 ? 1 : 0.1 }}
                viewport={{ once: true }}
                transition={{ delay: d * 0.012 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeltaXVisual() {
  const route = "M20 200 C 90 60, 170 220, 240 110 S 360 40, 400 150";
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-[#00e5ff]/30 bg-[#020608] p-5">
      <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#00e5ff33 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#00e5ff]">
        <span>Fleet · Live</span>
        <span className="text-[#ff7a1a]">10+ countries</span>
      </div>
      <svg viewBox="0 0 420 240" className="relative mt-2 w-full" aria-hidden>
        <motion.path
          d={route}
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {[ [20, 200], [240, 110], [400, 150] ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill="#ff7a1a22" />
            <circle cx={x} cy={y} r="4" fill="#ff7a1a" />
          </g>
        ))}
        <motion.circle
          r="6"
          fill="#fff"
          style={{ offsetPath: `path("${route}")` }}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <div className="relative mt-1 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-widest">
        {["Load", "Transit", "Unload"].map((s, i) => (
          <div key={s} className="border border-white/10 px-2 py-2">
            <span className="text-white/50">0{i + 1}</span> <span className="text-white">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TremVisual() {
  const bars = [42, 68, 54, 88, 62, 100, 74, 50, 82, 58];
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-[#d4b27a]/25 bg-gradient-to-b from-[#0d0d0d] to-[#050505] p-7">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-[#d4b27a]">
        <span>1,000+ brands</span>
        <span>B2B · SaaS</span>
      </div>
      <div className="absolute inset-x-7 bottom-16 flex h-[55%] items-end gap-2" aria-hidden>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 border-t border-x border-[#d4b27a]/40 bg-gradient-to-t from-transparent to-[#d4b27a]/15"
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="absolute inset-x-7 bottom-7 flex items-baseline justify-between border-t border-[#d4b27a]/30 pt-3">
        <span className="font-display text-3xl font-medium tracking-tight text-[#f5f1e8]">10x</span>
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#f5f1e8]/60">Rendering speed</span>
      </div>
    </div>
  );
}

export function AlphaVisual() {
  const nodes = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-600/40 bg-[#0a1222] p-5">
      <div className="flex items-center justify-between border-b border-slate-600/40 pb-3 text-xs">
        <span className="font-semibold text-slate-200">ATM Network · Back-office</span>
        <span className="flex items-center gap-1.5 text-[#60a5fa]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#60a5fa]" /> Operational
        </span>
      </div>
      <div className="mt-4 grid grid-cols-8 gap-2" aria-hidden>
        {nodes.map((n) => (
          <motion.div
            key={n}
            className="aspect-square rounded-md border border-[#3b82f6]/30 bg-[#3b82f6]/10"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1, backgroundColor: n % 4 === 0 ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.1)" }}
            viewport={{ once: true }}
            transition={{ delay: n * 0.03 }}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
        {[["Coverage", "75%"], ["Duplicates", "-50%"], ["QA catch", "+30%"]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-800/60 p-3">
            <p className="text-slate-400">{k}</p>
            <p className="mt-1 text-lg font-semibold text-white">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
