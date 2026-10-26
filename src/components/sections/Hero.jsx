"use client";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import Magnetic from "@/components/ui/Magnetic";
import DeviceScene from "./hero/DeviceScene";

const APPLE = [0.16, 1, 0.3, 1];

/*
  Entrance timeline (Apple-style):
  0.15s kicker → 0.25s name (fade + scale + blur) → 0.8s device rises (spring)
  → 1.05s subtitle floats up → 1.2s CTAs
*/
export default function Hero() {
  return (
    <section
      id="top"
      data-theme-section="default"
      className="relative flex min-h-svh md:h-svh snap-start snap-always flex-col items-center overflow-hidden pt-24 short:pt-20 text-center"
    >
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div aria-hidden className="glow-orb absolute left-1/2 top-[55%] -ml-[32vmax] -mt-[32vmax] h-[64vmax] w-[64vmax] opacity-50" />

      <div className="relative w-full px-5">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: APPLE }}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {profile.role} · Senior Frontend @ Yape
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 0.25, ease: APPLE }}
          className="mt-5 font-display text-[clamp(3.5rem,11vw,9.5rem)] short:text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tighter"
        >
          Jair <span className="text-gradient">Merlo</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: APPLE }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <a href="#experience" className="btn-accent group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
              Explore my work <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-white"
            >
              Let&apos;s talk <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <div className="relative mt-auto w-full px-5 pt-10 short:pt-6">
        <DeviceScene delay={0.8} />
      </div>
    </section>
  );
}
