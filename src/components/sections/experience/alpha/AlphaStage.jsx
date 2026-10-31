"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import AlphaBackdrop, { groundY } from "./AlphaBackdrop";

const GREEN = "#95cb4d";
const DISPLAY = "var(--font-grotesk), var(--font-inter), sans-serif";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";
const EASE = [0.16, 1, 0.3, 1];
// ATM base (bottom of its viewBox) stands on the ground at this depth.
const ATM_BOTTOM = `${((1 - groundY(1.4)) * 100).toFixed(2)}%`;

// Transaction cycle: idle → card → PIN → processing → cash
const PHASES = [
  { id: "idle", ms: 1500 },
  { id: "card", ms: 1100 },
  { id: "pin", ms: 1700 },
  { id: "processing", ms: 1300 },
  { id: "cash", ms: 2000 },
];
const ATMS = ["LPZ-014", "EAL-207", "CBB-033", "SCZ-118", "SRE-009", "ORU-041", "PTI-022", "TJA-015"];
const AMOUNTS = [100, 200, 500, 1000, 300];

function Screen({ phase }) {
  const common = { textAnchor: "middle", fill: "#0f172a" };
  return (
    <AnimatePresence mode="wait">
      <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {phase === "idle" && (
          <>
            <text {...common} x="160" y="112" fontFamily={DISPLAY} fontWeight="700" fontSize="22">Welcome</text>
            <motion.text {...common} x="160" y="146" fontFamily={MONO} fontSize="12" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
              INSERT CARD
            </motion.text>
          </>
        )}
        {phase === "card" && (
          <>
            <text {...common} x="160" y="118" fontFamily={DISPLAY} fontWeight="700" fontSize="18">Reading card…</text>
            <motion.rect x="110" y="136" height="5" rx="2.5" fill="#0f172a" initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 1 }} />
          </>
        )}
        {phase === "pin" && (
          <>
            <text {...common} x="160" y="110" fontFamily={MONO} fontSize="12">ENTER PIN</text>
            {[0, 1, 2, 3].map((i) => (
              <motion.circle key={i} cx={127 + i * 22} cy="138" r="6" fill="#0f172a" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.3 }} />
            ))}
          </>
        )}
        {phase === "processing" && (
          <>
            <text {...common} x="160" y="112" fontFamily={DISPLAY} fontWeight="700" fontSize="18">Processing</text>
            <motion.circle
              cx="160" cy="140" r="11" fill="none" stroke="#0f172a" strokeWidth="3" strokeDasharray="40 30"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
        {phase === "cash" && (
          <>
            <text {...common} x="160" y="108" fontFamily={MONO} fontSize="12">TAKE YOUR CASH</text>
            <text {...common} x="160" y="142" fontFamily={DISPLAY} fontWeight="700" fontSize="26">Bs 200</text>
          </>
        )}
      </motion.g>
    </AnimatePresence>
  );
}

/** ATM (front + side face) running a full withdrawal. */
function Atm({ phase, reduce }) {
  return (
    <svg viewBox="0 0 330 430" className="block h-auto w-full overflow-visible" role="img" aria-label="Alpha Systems ATM processing a withdrawal">
      <defs>
        <radialGradient id="al-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={GREEN} stopOpacity="0.5" />
          <stop offset="1" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="al-body" x1="0" x2="1">
          <stop offset="0" stopColor="#3b4a63" />
          <stop offset="1" stopColor="#2b374b" />
        </linearGradient>
        <radialGradient id="al-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="426" rx="170" ry="12" fill="url(#al-shadow)" />
      <ellipse cx="160" cy="130" rx="190" ry="120" fill="url(#al-glow)" />

      {/* Side face (depth) */}
      <path d="M290 30 L322 44 V418 L290 424 Z" fill="#1f2937" />
      {/* Body */}
      <rect x="30" y="20" width="262" height="404" rx="14" fill="url(#al-body)" />
      {/* Header */}
      <rect x="30" y="20" width="262" height="44" rx="14" fill="#1e293b" />
      <rect x="30" y="50" width="262" height="14" fill="#1e293b" />
      <rect x="52" y="34" width="16" height="16" rx="3" fill={GREEN} />
      <text x="76" y="47" fill="#e2e8f0" fontFamily={DISPLAY} fontWeight="700" fontSize="15">Alpha Systems</text>
      <motion.circle cx="270" cy="42" r="4" fill={GREEN} animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />

      {/* Screen bezel + screen */}
      <rect x="52" y="76" width="216" height="118" rx="8" fill="#0b1220" />
      <motion.rect
        x="62" y="86" width="196" height="98" rx="4" fill={GREEN}
        animate={reduce ? undefined : { opacity: [0.9, 1, 0.9] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <Screen phase={phase} />

      {/* Keypad */}
      {Array.from({ length: 12 }, (_, i) => {
        const k = [1, 5, 7, 10].indexOf(i); // keys pressed for the PIN, in order (synced with the dots)
        return (
          <g key={i}>
            <rect x={62 + (i % 3) * 34} y={214 + Math.floor(i / 3) * 24} width="28" height="18" rx="3" fill="#94a3b8" fillOpacity="0.55" />
            {k >= 0 && phase === "pin" && (
              <motion.rect
                x={62 + (i % 3) * 34} y={214 + Math.floor(i / 3) * 24} width="28" height="18" rx="3" fill={GREEN}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 0.1 + k * 0.3, duration: 0.35 }}
              />
            )}
          </g>
        );
      })}
      <rect x="176" y="214" width="62" height="18" rx="3" fill={GREEN} />
      <rect x="176" y="238" width="62" height="18" rx="3" fill="#f59e0b" fillOpacity="0.85" />
      <rect x="176" y="262" width="62" height="18" rx="3" fill="#ef4444" fillOpacity="0.85" />

      {/* Card slot + card */}
      <rect x="250" y="226" width="10" height="44" rx="3" fill="#0b1220" />
      <motion.circle cx="255" cy="216" r="3" fill={phase === "card" ? GREEN : "#475569"} />
      <motion.g
        animate={{ x: phase === "idle" ? 46 : 0, opacity: phase === "idle" || phase === "cash" ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <rect x="256" y="232" width="44" height="30" rx="4" fill="#38bdf8" />
        <rect x="262" y="240" width="10" height="8" rx="1.5" fill="#fde68a" />
      </motion.g>

      {/* Receipt slot */}
      <rect x="62" y="316" width="70" height="6" rx="3" fill="#0b1220" />
      {/* Cash slot + bills */}
      <rect x="150" y="320" width="110" height="8" rx="3" fill="#0b1220" />
      <g clipPath="url(#al-cash-clip)">
        <motion.g animate={{ y: phase === "cash" ? 0 : -46 }} transition={{ duration: 0.7, ease: EASE }}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={160 + i * 3} y={326 + i * 2} width="86" height="38" rx="2" fill={i === 2 ? "#a7d86a" : "#7fb33f"} stroke="#5d8a2b" />
          ))}
          <text x="206" y="352" textAnchor="middle" fill="#2d4a10" fontFamily={DISPLAY} fontWeight="700" fontSize="14">Bs 200</text>
        </motion.g>
      </g>
      <defs>
        <clipPath id="al-cash-clip">
          <rect x="140" y="324" width="140" height="80" />
        </clipPath>
      </defs>

      {/* Plinth */}
      <rect x="30" y="394" width="262" height="30" rx="6" fill="#1e293b" />
    </svg>
  );
}

/** Back-office (Angular + .NET) live monitor: a row lands each time the ATM pays out. */
function BackOffice({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-600/50 bg-[#0f172a]/95 text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-700/70 px-3 py-2">
        <span className="text-[11px] font-semibold text-slate-200">Back-office · ATM network</span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#95cb4d]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#95cb4d]" /> Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-slate-700/50 text-center">
        {[
          ["75%", "of Bolivia"],
          ["99.9%", "uptime"],
          ["-50%", "duplicates"],
        ].map(([v, l]) => (
          <div key={l} className="bg-[#0f172a] px-1 py-2">
            <p className="font-display text-base font-bold text-[#95cb4d] lg:text-lg">{v}</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400">{l}</p>
          </div>
        ))}
      </div>
      <ul className="space-y-1 p-2 font-mono text-[10px]">
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, x: -12, backgroundColor: "rgba(149,203,77,0.25)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(149,203,77,0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between gap-2 rounded px-2 py-1 text-slate-300"
            >
              <span className="text-slate-400">ATM-{r.atm}</span>
              <span>Bs {r.amount}</span>
              <span className="text-[#95cb4d]">✓ OK</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/**
 * Alpha Systems stage: La Paz at night + the national ATM network (canvas), an ATM running a
 * withdrawal, and the back-office monitor that logs each payout.
 * ≥ lg it covers the whole chapter (right 70%); below lg it's a block under the text.
 */
export default function AlphaStage() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [phase, setPhase] = useState(0);
  const [rows, setRows] = useState(() =>
    // Newest first, so ids descend: the next row gets rows[0].id + 1 and keys never repeat.
    [3, 2, 1, 0].map((i) => ({ id: i, atm: ATMS[(i * 3) % ATMS.length], amount: AMOUNTS[i % AMOUNTS.length] }))
  );
  const inView = useInView(ref, { amount: 0.4, once: true });
  const visible = useInView(ref, { amount: 0.1 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    const t = setTimeout(on, 0);
    mq.addEventListener("change", on);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", on);
    };
  }, []);

  // Drive the transaction cycle only while the stage is on screen.
  useEffect(() => {
    if (!visible || reduce) return;
    const id = setTimeout(() => {
      const next = (phase + 1) % PHASES.length;
      setPhase(next);
      if (PHASES[next].id === "cash") {
        setRows((rs) => {
          const n = rs[0].id + 1;
          return [{ id: n, atm: ATMS[n % ATMS.length], amount: AMOUNTS[n % AMOUNTS.length] }, ...rs].slice(0, 4);
        });
      }
    }, PHASES[phase].ms);
    return () => clearTimeout(id);
  }, [phase, visible, reduce]);

  return (
    <div ref={ref} className="pointer-events-none relative mt-6 h-[52svh] w-full overflow-hidden lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      <AlphaBackdrop wide={wide} />

      <motion.div
        className="absolute left-[6%] w-[36%] lg:left-[46%] lg:w-[18%]"
        style={{ bottom: ATM_BOTTOM }}
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
      >
        <Atm phase={reduce ? "cash" : PHASES[phase].id} reduce={!!reduce} />
      </motion.div>

      <motion.div
        className="absolute right-[3%] top-[48%] w-[52%] max-w-[280px] lg:right-[4%] lg:top-[60%] lg:w-[24%] lg:max-w-[320px]"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.94 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.5, ease: EASE }}
      >
        <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <BackOffice rows={rows} />
        </motion.div>
      </motion.div>

      <span className="sr-only">
        La Paz at night under Illimani: an Alpha Systems ATM runs a withdrawal while the back-office monitor logs payouts from ATMs across Bolivia.
      </span>
    </div>
  );
}
