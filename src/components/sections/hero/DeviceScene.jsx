"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPRING = { type: "spring", stiffness: 70, damping: 17, mass: 1 };

const code = [
  [["k", "export default "], ["f", "function "], ["n", "Portfolio"], ["p", "() {"]],
  [["k", "  const "], ["n", "stack "], ["p", "= ["], ["s", '"Next.js"'], ["p", ", "], ["s", '"AWS"'], ["p", "];"]],
  [["k", "  const "], ["n", "lighthouse "], ["p", "= "], ["v", "+22"], ["p", ";"]],
  [["k", "  const "], ["n", "users "], ["p", "= "], ["v", "20_000_000"], ["p", ";"]],
  [["k", "  return "], ["p", "<"], ["f", "Experience "], ["n", "scalable "], ["p", "/>;"]],
  [["p", "}"]],
];
const tone = { k: "text-accent-ink", f: "text-sky-300", n: "text-white", p: "text-white/50", s: "text-emerald-300", v: "text-amber-300" };

function Float({ children, className, delay, drift = 10, duration = 6 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 160 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
    >
      <motion.div animate={{ y: [0, -drift, 0] }} transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** CSS-only laptop + floating code / server blocks, rising from below with spring physics. */
export default function DeviceScene({ delay = 0.8 }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 80, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [9, 1]), { stiffness: 80, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      className="relative mx-auto text-left"
      style={{ width: "clamp(280px, min(84vw, calc((100svh - 450px) * 1.45)), 700px)", perspective: 1600 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* Laptop */}
      <motion.div initial={{ opacity: 0, y: "70vh" }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay }}>
        <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
          <div className="relative rounded-t-[1.4rem] border-[10px] border-b-[14px] border-[#1d1d22] bg-black shadow-[0_40px_120px_-30px_var(--accent)] ring-1 ring-white/10">
            <div className="@container flex aspect-[16/10] flex-col overflow-hidden rounded-md bg-[#0b0b10]">
              <div className="flex items-center gap-[1.2cqw] border-b border-white/10 px-[2.4cqw] py-[1.6cqw]">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-[1.5cqw] font-mono text-[2cqw] text-white/40">portfolio.jsx</span>
              </div>
              <div className="px-[3.5cqw] py-[3cqw] font-mono text-[2.8cqw] leading-[1.6]">
                {code.map((line, i) => (
                  <motion.div
                    key={i}
                    className="whitespace-pre"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay + 0.7 + i * 0.12, duration: 0.4 }}
                  >
                    <span className="mr-[2cqw] text-white/20">{i + 1}</span>
                    {line.map(([t, v], j) => (
                      <span key={j} className={tone[t]}>
                        {v}
                      </span>
                    ))}
                  </motion.div>
                ))}
                <span className="caret ml-[4cqw] inline-block h-[2.2cqw] w-[1cqw] translate-y-[0.3cqw] bg-accent" />
              </div>
              <div className="mt-auto grid grid-cols-3 gap-[1.6cqw] px-[3.5cqw] pb-[3.5cqw]" aria-hidden>
                {[["Lighthouse", "+22"], ["Rendering", "10x"], ["Deploy", "<5m"]].map(([k, v], i) => (
                  <motion.div
                    key={k}
                    className="rounded-[1.2cqw] border border-white/10 bg-white/[0.04] p-[1.8cqw]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay + 1.5 + i * 0.12, duration: 0.5 }}
                  >
                    <p className="font-mono text-[1.9cqw] uppercase tracking-widest text-white/40">{k}</p>
                    <p className="mt-[0.4cqw] font-display text-[4.6cqw] font-bold leading-none text-accent">{v}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          {/* Base */}
          <div className="relative -mx-[7%] h-3 rounded-b-2xl bg-gradient-to-b from-[#3a3a42] to-[#16161a]">
            <span className="absolute left-1/2 top-0 h-1.5 w-[16%] -translate-x-1/2 rounded-b-lg bg-[#0d0d10]" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating blocks */}
      <Float className="right-[calc(100%-2.5rem)] top-[14%] hidden sm:block" delay={delay + 0.25} drift={12}>
        <div className="whitespace-nowrap rounded-xl border border-line bg-black/70 px-3.5 py-2.5 font-mono text-[11px] backdrop-blur-md">
          <span className="text-accent-ink">await</span> <span className="text-white">deploy</span>
          <span className="text-white/50">(</span>
          <span className="text-emerald-300">&quot;edge&quot;</span>
          <span className="text-white/50">)</span>
          <p className="mt-1 text-emerald-300">✓ live in &lt;5 min</p>
        </div>
      </Float>

      <Float className="left-[calc(100%-2.5rem)] top-[4%] hidden sm:block" delay={delay + 0.35} drift={9} duration={7}>
        <div className="w-36 rounded-xl border border-line bg-black/70 p-2.5 backdrop-blur-md" aria-hidden>
          {[0, 1, 2].map((u) => (
            <div key={u} className="mb-1.5 flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 last:mb-0">
              <span className="h-1 flex-1 rounded bg-white/15" />
              {[0, 1, 2].map((l) => (
                <motion.span
                  key={l}
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.2 + l * 0.4, repeat: Infinity, delay: u * 0.3 }}
                />
              ))}
            </div>
          ))}
          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-white/50">EC2 · Lambda · RDS</p>
        </div>
      </Float>

      <Float className="left-[calc(100%-3rem)] bottom-[16%] hidden md:block" delay={delay + 0.45} drift={14} duration={8}>
        <div className="btn-accent whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold">20M+ users</div>
      </Float>
    </div>
  );
}
