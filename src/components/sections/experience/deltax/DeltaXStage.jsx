"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import DeltaXBackdrop, { TRUCK_Z, groundY } from "./DeltaXBackdrop";

const DISPLAY = "var(--font-grotesk), var(--font-inter), sans-serif";
const WHEELS = [92, 128, 300, 336, 392];
// Wheel bottom (y 175) sits on the truck's lane; viewBox is cropped so its bottom edge = y 178.
const TRUCK_BOTTOM = `${((1 - groundY(TRUCK_Z)) * 100).toFixed(2)}%`;

function Truck({ reduce }) {
  return (
    <svg viewBox="40 46 432 132" className="block h-auto w-full overflow-visible" role="img" aria-label="DeltaX freight truck driving">
      <style>{"@keyframes dx-spin { to { transform: rotate(360deg); } }"}</style>
      <defs>
        <linearGradient id="dx-beam" x1="0" x2="1">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dx-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow + headlight beam */}
      <ellipse cx="250" cy="175" rx="230" ry="9" fill="url(#dx-shadow)" />
      <path d="M458 128 L640 108 L640 172 Z" fill="url(#dx-beam)" />

      {/* Wind lines behind the trailer */}
      {!reduce &&
        [72, 100, 128].map((y, i) => (
          <motion.line
            key={y} x1="0" y1={y} x2="40" y2={y} stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round"
            animate={{ x: [40, -80], opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.25, ease: "linear" }}
          />
        ))}

      <motion.g animate={reduce ? undefined : { y: [0, -1.5, 0] }} transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}>
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
        {/* Cab */}
        <path d="M372 152 V86 a10 10 0 0 1 10 -10 h44 l30 34 a10 10 0 0 1 3 7 V152 Z" fill="#ffffff" />
        <path d="M392 86 h32 l24 28 h-56 Z" fill="#0f1624" />
        <rect x="374" y="140" width="85" height="12" fill="#d7dbe2" />
        <rect x="448" y="128" width="12" height="8" rx="2" fill="#ffd27a" />
        <rect x="376" y="62" width="6" height="22" rx="2" fill="#9aa3b2" />
      </motion.g>

      {/* Wheels (spin speed matched to the ground scroll) */}
      {WHEELS.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="160" r="15" fill="#05070b" />
          {/* Plain CSS spin around the hub (framer's SVG origin handling drifted the hubs off-centre) */}
          <g
            style={{
              transformBox: "view-box",
              transformOrigin: `${cx}px 160px`,
              animation: reduce ? "none" : "dx-spin 0.35s linear infinite",
            }}
          >
            <circle cx={cx} cy="160" r="7" fill="#9aa3b2" />
            <rect x={cx - 1} y="151" width="2" height="18" fill="#05070b" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/**
 * DeltaX stage: perspective road + route network (canvas) with the freight truck driving on it.
 * ≥ lg it covers the whole chapter (truck in the right 70%); below lg it's a block under the text.
 */
export default function DeltaXStage() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const inView = useInView(ref, { amount: 0.4, once: true });

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

  return (
    <div ref={ref} className="pointer-events-none relative mt-6 h-[42svh] w-full overflow-hidden lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      <DeltaXBackdrop wide={wide} />
      <motion.div
        className="absolute left-[4%] w-[92%] lg:left-[42%] lg:w-[50%]"
        style={{ bottom: TRUCK_BOTTOM }}
        initial={{ x: reduce ? 0 : "-130%" }}
        animate={{ x: inView ? 0 : reduce ? 0 : "-130%" }}
        transition={{ duration: reduce ? 0 : 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Truck reduce={!!reduce} />
      </motion.div>
      <span className="sr-only">The DeltaX freight truck drives along a highway under a network of logistics routes across 10+ countries.</span>
    </div>
  );
}
