"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { BedDouble, Bath, Maximize } from "lucide-react";
import TremBackdrop, { groundY } from "./TremBackdrop";

const DISPLAY = "var(--font-grotesk), var(--font-inter), sans-serif";
const EASE = [0.16, 1, 0.3, 1];
// Villa pool edge (bottom of its viewBox) sits on the lawn at this depth.
const HOUSE_BOTTOM = `${((1 - groundY(1.4)) * 100).toFixed(2)}%`;

const LISTINGS = [
  { site: "starislandestates.com", addr: "42 Star Island Dr, Miami Beach", price: "$12,500,000", tag: "For sale", beds: 6, baths: 7, sqft: "9,200" },
  { site: "fisherislandliving.com", addr: "7 Fisher Island Dr, Miami", price: "$28,000/mo", tag: "For rent", beds: 4, baths: 5, sqft: "4,800" },
  { site: "coralgablesluxury.com", addr: "1120 Granada Blvd, Coral Gables", price: "$6,850,000", tag: "For sale", beds: 5, baths: 6, sqft: "7,100" },
  { site: "keybiscaynehomes.com", addr: "250 Harbor Dr, Key Biscayne", price: "$19,500/mo", tag: "For rent", beds: 5, baths: 5, sqft: "5,600" },
];

const PALM_SWAY = "@keyframes tr-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } } @keyframes tr-shine { 0% { transform: translateX(-120px); } 60%,100% { transform: translateX(260px); } } @keyframes tr-water { to { stroke-dashoffset: -40; } }";

/** SVG palm; fronds sway around the crown with a CSS keyframe (cheap, no JS per frame). */
function Palm({ x, y, h, lean = 0.15, delay = 0, reduce }) {
  const tx = x + lean * h;
  const ty = y - h;
  const fronds = [-170, -140, -110, -70, -40, -10, 15, 200];
  return (
    <g>
      <path d={`M${x} ${y} Q${x + lean * h * 0.2} ${y - h * 0.6} ${tx} ${ty}`} stroke="#8a6a45" strokeWidth={h * 0.05} fill="none" strokeLinecap="round" />
      <g
        style={{
          transformBox: "view-box",
          transformOrigin: `${tx}px ${ty}px`,
          animation: reduce ? "none" : `tr-sway 4s ease-in-out ${delay}s infinite`,
        }}
      >
        {fronds.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const len = h * 0.45;
          const ex = tx + Math.cos(a) * len;
          const ey = ty + Math.sin(a) * len * 0.5 + len * 0.35;
          const cx = tx + Math.cos(a) * len * 0.5;
          const cy = ty + Math.sin(a) * len * 0.6 - len * 0.12;
          return (
            <path
              key={i}
              d={`M${tx} ${ty} Q${cx} ${cy - len * 0.09} ${ex} ${ey} Q${cx} ${cy + len * 0.09} ${tx} ${ty}`}
              fill={i % 2 ? "#2f8a3b" : "#247a32"}
            />
          );
        })}
        <circle cx={tx} cy={ty + 2} r={h * 0.03} fill="#5c4428" />
      </g>
    </g>
  );
}

/** Modern Miami villa: white volumes, floor-to-ceiling glass, wood slats, infinity pool, palms. */
function Villa({ rent, reduce }) {
  return (
    <svg viewBox="30 0 450 218" className="block h-auto w-full overflow-visible" role="img" aria-label="Luxury Miami villa with a pool and a Trem Group yard sign">
      <style>{PALM_SWAY}</style>
      <defs>
        <linearGradient id="tr-glass" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#a9dbff" />
          <stop offset="1" stopColor="#2e6fa8" />
        </linearGradient>
        <linearGradient id="tr-pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fd8f0" />
          <stop offset="1" stopColor="#22a9d2" />
        </linearGradient>
        <linearGradient id="tr-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tr-shadow">
          <stop offset="0" stopColor="#1d4a1a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1d4a1a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="tr-glass-clip">
          <rect x="165" y="62" width="180" height="40" />
          <rect x="108" y="122" width="190" height="64" />
        </clipPath>
      </defs>

      <ellipse cx="250" cy="198" rx="235" ry="14" fill="url(#tr-shadow)" />

      {/* Back palms */}
      <Palm x={118} y={120} h={110} lean={-0.12} delay={0.6} reduce={reduce} />
      <Palm x={392} y={118} h={120} lean={0.14} delay={1.4} reduce={reduce} />

      {/* Upper volume */}
      <rect x="150" y="50" width="210" height="60" fill="#f7f6f2" />
      <rect x="165" y="62" width="180" height="40" fill="url(#tr-glass)" />
      {[210, 255, 300].map((x) => (
        <line key={x} x1={x} y1="62" x2={x} y2="102" stroke="#e9e7e1" strokeWidth="2" />
      ))}
      <rect x="138" y="42" width="236" height="9" fill="#e3e1da" />
      {/* Lower volume */}
      <rect x="90" y="110" width="310" height="86" fill="#fbfaf7" />
      <rect x="84" y="106" width="322" height="6" fill="#e3e1da" />
      <rect x="108" y="122" width="190" height="64" fill="url(#tr-glass)" />
      {[146, 184, 222, 260].map((x) => (
        <line key={x} x1={x} y1="122" x2={x} y2="186" stroke="#e9e7e1" strokeWidth="2" />
      ))}
      {/* Interior warm light */}
      <rect x="150" y="150" width="60" height="36" fill="#ffd9a0" fillOpacity="0.35" />
      {/* Wood slats */}
      <rect x="310" y="118" width="74" height="78" fill="#b5804f" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={316 + i * 8} y1="118" x2={316 + i * 8} y2="196" stroke="#8f5f36" strokeWidth="2" />
      ))}
      {/* Glass balcony rail */}
      <rect x="150" y="98" width="210" height="10" fill="#cfe9ff" fillOpacity="0.5" />
      {/* Sun glare sweeping over the glass */}
      <g clipPath="url(#tr-glass-clip)">
        <rect
          x="120" y="40" width="50" height="160" fill="url(#tr-shine)" transform="skewX(-20)"
          style={{ animation: reduce ? "none" : "tr-shine 5s ease-in-out infinite" }}
        />
      </g>

      {/* Deck + infinity pool */}
      <rect x="60" y="194" width="360" height="6" fill="#e6d7b8" />
      <path d="M70 200 H400 L420 216 H52 Z" fill="url(#tr-pool)" />
      <path
        d="M80 206 H395 M66 211 H410" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="14 26"
        style={{ animation: reduce ? "none" : "tr-water 2.4s linear infinite" }}
      />
      {/* Hedges */}
      <rect x="40" y="182" width="48" height="14" rx="7" fill="#2f7d3b" />
      <rect x="402" y="182" width="58" height="14" rx="7" fill="#2f7d3b" />

      {/* Front palm */}
      <Palm x={58} y={198} h={170} lean={0.1} delay={0} reduce={reduce} />

      {/* Yard sign (synced with the listing card) */}
      <g transform="translate(118 30) scale(0.82)">
        <rect x="370" y="104" width="6" height="96" fill="#f2f2f2" />
        <rect x="330" y="104" width="86" height="6" fill="#f2f2f2" />
        <line x1="340" y1="110" x2="340" y2="118" stroke="#f2f2f2" strokeWidth="2" />
        <line x1="406" y1="110" x2="406" y2="118" stroke="#f2f2f2" strokeWidth="2" />
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          animate={reduce ? undefined : { rotate: [-2, 2, -2] }}
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
      </g>
    </svg>
  );
}

/** A brand website's listing page, as Trem's platform renders it for 1,000+ brands. */
function ListingCard({ item }) {
  const rent = item.tag === "For rent";
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white text-left shadow-[0_30px_60px_-20px_rgba(15,40,90,0.45)]">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <AnimatePresence mode="wait">
          <motion.span
            key={item.site}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-2 truncate rounded-sm bg-white px-2 py-0.5 font-mono text-[10px] text-slate-500 ring-1 ring-slate-200"
          >
            {item.site}
          </motion.span>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.site}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="p-3"
        >
          <div className="relative h-16 overflow-hidden rounded-sm bg-gradient-to-b from-[#3d8de6] to-[#bfe3ff] lg:h-20">
            <svg viewBox="0 0 120 50" className="absolute bottom-0 left-1/2 h-full -translate-x-1/2" aria-hidden>
              <rect x="0" y="44" width="120" height="6" fill="#4f9e3c" />
              <rect x="30" y="18" width="56" height="16" fill="#fff" />
              <rect x="36" y="22" width="44" height="9" fill="#5b98cc" />
              <rect x="18" y="32" width="84" height="14" fill="#fbfaf7" />
              <rect x="24" y="35" width="48" height="10" fill="#3f7fb8" />
              <rect x="76" y="34" width="20" height="12" fill="#b5804f" />
              <rect x="10" y="46" width="100" height="4" fill="#4fd0ec" />
            </svg>
            <span className="absolute left-2 top-2 rounded-sm bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
              {item.tag}
            </span>
          </div>
          <p className="mt-2.5 font-display text-xl font-bold leading-none text-slate-900 lg:text-2xl">{item.price}</p>
          <p className="mt-1 truncate text-[11px] text-slate-500">{item.addr}</p>
          <div className="mt-2 flex gap-3 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1"><BedDouble size={12} /> {item.beds}</span>
            <span className="inline-flex items-center gap-1"><Bath size={12} /> {item.baths}</span>
            <span className="inline-flex items-center gap-1"><Maximize size={12} /> {item.sqft} ft²</span>
          </div>
          <div className="mt-3 rounded-sm bg-[#3870fb] py-1.5 text-center text-[11px] font-semibold text-white">
            {rent ? "Apply now" : "Schedule a tour"}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Trem Group stage: sunny Miami waterfront with listing pins (canvas), the luxury villa with
 * its yard sign, and a brand listing page that cycles in sync with the sign.
 * ≥ lg it covers the whole chapter (right 70%); below lg it's a block under the text.
 */
export default function TremStage() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [idx, setIdx] = useState(0);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const visible = useInView(ref, { amount: 0.1 });
  const item = LISTINGS[idx];

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

  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % LISTINGS.length), 2800);
    return () => clearInterval(id);
  }, [visible, reduce]);

  return (
    <div ref={ref} className="pointer-events-none relative mt-6 h-[50svh] w-full overflow-hidden lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      <TremBackdrop wide={wide} />

      <motion.div
        className="absolute left-[2%] w-[78%] lg:left-[38%] lg:w-[38%]"
        style={{ bottom: HOUSE_BOTTOM }}
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
      >
        <Villa rent={item.tag === "For rent"} reduce={!!reduce} />
      </motion.div>

      <motion.div
        className="absolute right-[3%] top-[4%] w-[46%] max-w-[260px] lg:right-[5%] lg:top-[16%] lg:w-[21%] lg:max-w-[300px]"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.94 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.5, ease: EASE }}
      >
        <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <ListingCard item={item} />
        </motion.div>
      </motion.div>

      <span className="sr-only">
        A sunny Miami waterfront: a luxury villa with a pool and palms, a Trem Group yard sign switching between for sale and for rent, a brand listing website, and listing pins dropping onto waterfront homes.
      </span>
    </div>
  );
}
