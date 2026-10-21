"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* Illustrations for each experience chapter (CSS + inline SVG, no images). */

const FRAME = "relative h-[clamp(190px,30vh,320px)] overflow-hidden";
const DISPLAY = "var(--font-grotesk), sans-serif";

function Chip({ children, className = "" }) {
  return (
    <div className={cn("rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-semibold backdrop-blur", className)}>
      {children}
    </div>
  );
}

/* ---------- Yape: iPhone mockup with app-loading animation ---------- */
export function YapeVisual() {
  return (
    <div className={`${FRAME} grid place-items-center rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 to-white/0`}>
      <div aria-hidden className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10cbb4]/35 blur-3xl" />

      <motion.div
        role="img"
        aria-label="iPhone showing the Yape app loading"
        className="relative h-[88%] aspect-[9/19] rounded-[2.1rem] bg-[#0c0c0f] p-[5px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/25"
        animate={{ y: [0, -6, 0], rotate: [-2, 1, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.8rem] bg-[#790699]">
          {/* Dynamic Island */}
          <span className="absolute left-1/2 top-2 h-[7%] max-h-4 w-[34%] -translate-x-1/2 rounded-full bg-black" />
          <motion.span
            className="font-bold text-white"
            style={{ fontFamily: DISPLAY, fontSize: "clamp(1.2rem, 3.4vh, 2rem)" }}
            animate={{ scale: [0.94, 1.04, 0.94], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Yape
          </motion.span>
          {/* Loader dots */}
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#10cbb4]"
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-[12%] h-1 w-[46%] overflow-hidden rounded-full bg-white/20">
            <motion.span
              className="block h-full rounded-full bg-white"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
          <span className="absolute bottom-[4%] h-1 w-[34%] rounded-full bg-white/60" />
        </div>
      </motion.div>

      <Chip className="absolute left-5 top-5">20M+ users</Chip>
      <Chip className="absolute bottom-5 right-5 border-0 bg-[#10cbb4] text-[#2a0335]">+22 Lighthouse</Chip>
    </div>
  );
}

/* ---------- DeltaX: freight truck on a moving road ---------- */
export function DeltaXVisual() {
  const wheels = [92, 128, 300, 336, 392];
  return (
    <div className={`${FRAME} border border-[#eb9705]/30 bg-[#090d15]`}>
      <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#eb970530 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="relative flex items-center justify-between px-5 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#eb9705]">
        <span>Fleet · Live</span>
        <span className="text-white">10+ countries</span>
      </div>

      <svg viewBox="0 0 480 200" className="absolute inset-x-0 bottom-0 h-[82%] w-full" role="img" aria-label="DeltaX freight truck driving">
        {/* Road */}
        <rect x="0" y="170" width="480" height="30" fill="#141a26" />
        <motion.line
          x1="0" y1="186" x2="480" y2="186" stroke="#eb9705" strokeOpacity="0.6" strokeWidth="3" strokeDasharray="26 22"
          animate={{ strokeDashoffset: [0, -48] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
        {/* Speed lines */}
        {[70, 100, 130].map((y, i) => (
          <motion.line
            key={y} x1="0" y1={y} x2="40" y2={y} stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round"
            animate={{ x: [60, -60], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
          />
        ))}

        <motion.g animate={{ y: [0, -1.5, 0] }} transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}>
          {/* Trailer */}
          <rect x="60" y="56" width="300" height="96" rx="6" fill="#eb9705" />
          <rect x="60" y="140" width="300" height="12" fill="#c07a00" />
          {[110, 160, 210, 260, 310].map((x) => (
            <line key={x} x1={x} y1="64" x2={x} y2="136" stroke="#090d15" strokeOpacity="0.12" strokeWidth="2" />
          ))}
          <text x="210" y="112" textAnchor="middle" fill="#fff" fontFamily={DISPLAY} fontWeight="700" fontSize="34" letterSpacing="1">
            DeltaX
          </text>
          {/* Hitch */}
          <rect x="360" y="132" width="16" height="10" fill="#4b5563" />
          {/* Cab (white) */}
          <path d="M372 152 V86 a10 10 0 0 1 10 -10 h44 l30 34 a10 10 0 0 1 3 7 V152 Z" fill="#ffffff" />
          <path d="M392 86 h32 l24 28 h-56 Z" fill="#0f1624" />
          <rect x="374" y="140" width="85" height="12" fill="#d7dbe2" />
          <rect x="448" y="128" width="12" height="8" rx="2" fill="#eb9705" />
          <rect x="376" y="62" width="6" height="22" rx="2" fill="#9aa3b2" />
        </motion.g>

        {/* Wheels */}
        {wheels.map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="160" r="15" fill="#05070b" />
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            >
              <circle cx={cx} cy="160" r="7" fill="#9aa3b2" />
              <rect x={cx - 1} y="151" width="2" height="18" fill="#05070b" />
            </motion.g>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Trem Group: house with For Sale / For Rent yard sign ---------- */
export function TremVisual() {
  const [rent, setRent] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setRent((r) => !r), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`${FRAME} border border-white/10 bg-gradient-to-b from-[#23272e] to-[#1b1e23]`}>
      <div className="relative flex items-center justify-between px-6 pt-4 text-[10px] uppercase tracking-[0.35em] text-[#84a7ff]">
        <span>1,000+ brands</span>
        <span>B2B · SaaS</span>
      </div>

      <svg viewBox="0 0 480 220" className="absolute inset-x-0 bottom-0 h-[84%] w-full" role="img" aria-label="House with a Trem Group yard sign">
        {/* Ground */}
        <rect x="0" y="196" width="480" height="24" fill="#16191d" />
        <rect x="0" y="192" width="480" height="6" fill="#2a3a2c" />

        {/* House */}
        <path d="M90 196 V110 L190 48 L290 110 V196 Z" fill="#e9ecf1" />
        <path d="M72 116 L190 40 L308 116" fill="none" stroke="#3a3f47" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="246" y="58" width="18" height="34" fill="#3a3f47" />
        {/* Door */}
        <rect x="172" y="140" width="36" height="56" rx="3" fill="#3870fb" />
        <circle cx="200" cy="170" r="2.5" fill="#fff" />
        {/* Windows with lights */}
        {[
          [110, 128], [234, 128], [172, 84],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="40" height="30" rx="3" fill="#2b3038" />
            <motion.rect
              x={x + 3} y={y + 3} width="34" height="24" rx="2" fill="#ffd27a"
              animate={{ opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
            />
            <line x1={x + 20} y1={y} x2={x + 20} y2={y + 30} stroke="#2b3038" strokeWidth="2" />
          </g>
        ))}
        {/* Bushes */}
        <circle cx="96" cy="192" r="14" fill="#2f4a33" />
        <circle cx="286" cy="192" r="12" fill="#2f4a33" />

        {/* Yard sign */}
        <rect x="370" y="104" width="6" height="92" fill="#cfd5de" />
        <rect x="330" y="104" width="86" height="6" fill="#cfd5de" />
        <line x1="340" y1="110" x2="340" y2="118" stroke="#cfd5de" strokeWidth="2" />
        <line x1="406" y1="110" x2="406" y2="118" stroke="#cfd5de" strokeWidth="2" />
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="326" y="118" width="94" height="58" rx="4" fill="#3870fb" />
          <AnimatePresence mode="wait">
            <motion.text
              key={rent ? "rent" : "sale"}
              x="373" y="143" textAnchor="middle" fill="#fff" fontFamily={DISPLAY} fontWeight="700" fontSize="15" letterSpacing="1.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {rent ? "FOR RENT" : "FOR SALE"}
            </motion.text>
          </AnimatePresence>
          <line x1="338" y1="152" x2="408" y2="152" stroke="#fff" strokeOpacity="0.5" />
          <text x="373" y="167" textAnchor="middle" fill="#fff" fontFamily={DISPLAY} fontWeight="500" fontSize="11">
            Trem Group
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

/* ---------- Alpha Systems: ATM with an illuminated green screen ---------- */
export function AlphaVisual() {
  return (
    <div className={`${FRAME} rounded-xl border border-slate-600/40 bg-[#111c33]`}>
      <div className="relative flex items-center justify-between px-5 pt-4 text-xs">
        <span className="font-semibold text-slate-200">ATM Network</span>
        <span className="flex items-center gap-1.5 text-[#95cb4d]">
          <motion.span className="h-1.5 w-1.5 rounded-full bg-[#95cb4d]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
          75% of Bolivia
        </span>
      </div>

      <svg viewBox="0 0 480 220" className="absolute inset-x-0 bottom-0 h-[86%] w-full" role="img" aria-label="ATM displaying Alpha Systems">
        <defs>
          <radialGradient id="atm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#95cb4d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#95cb4d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="240" cy="80" rx="150" ry="70" fill="url(#atm-glow)" />
        <rect x="0" y="206" width="480" height="14" fill="#0b1324" />

        {/* Body */}
        <rect x="160" y="14" width="160" height="196" rx="10" fill="#334155" />
        <rect x="160" y="14" width="160" height="22" rx="10" fill="#1e293b" />
        <rect x="172" y="44" width="136" height="80" rx="5" fill="#0b1220" />
        {/* Screen */}
        <motion.rect
          x="178" y="50" width="124" height="68" rx="3" fill="#95cb4d"
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <text x="240" y="80" textAnchor="middle" fill="#0f172a" fontFamily={DISPLAY} fontWeight="700" fontSize="15">
          Alpha Systems
        </text>
        <motion.text
          x="240" y="102" textAnchor="middle" fill="#0f172a" fontSize="9" fontFamily="var(--font-jetbrains), monospace"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          INSERT CARD
        </motion.text>

        {/* Keypad */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={184 + (i % 3) * 22} y={134 + Math.floor(i / 3) * 14} width="18" height="10" rx="2" fill="#94a3b8" fillOpacity="0.55" />
        ))}
        <rect x="256" y="134" width="40" height="10" rx="2" fill="#95cb4d" />
        <rect x="256" y="148" width="40" height="10" rx="2" fill="#f59e0b" fillOpacity="0.8" />
        <rect x="256" y="162" width="40" height="10" rx="2" fill="#ef4444" fillOpacity="0.8" />

        {/* Card slot + card */}
        <rect x="256" y="180" width="40" height="5" rx="2" fill="#0b1220" />
        <motion.rect
          x="262" width="28" height="18" rx="2" fill="#38bdf8"
          animate={{ y: [196, 176, 176, 196], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }}
        />
        {/* Cash slot + bills */}
        <rect x="186" y="192" width="58" height="5" rx="2" fill="#0b1220" />
        <motion.rect
          x="192" width="46" height="14" rx="1" fill="#95cb4d" fillOpacity="0.8"
          animate={{ y: [190, 197, 190], opacity: [0, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: 1.6, ease: "easeInOut" }}
        />
      </svg>

      <div className="absolute bottom-4 left-5 grid gap-2 text-xs">
        <div className="rounded-lg bg-slate-800/80 px-3 py-2"><span className="text-slate-400">Duplicates </span><span className="font-semibold text-white">-50%</span></div>
        <div className="rounded-lg bg-slate-800/80 px-3 py-2"><span className="text-slate-400">QA catch </span><span className="font-semibold text-white">+30%</span></div>
      </div>
    </div>
  );
}
