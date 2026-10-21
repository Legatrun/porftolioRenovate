"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { RevealWords } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

const marquee = ["Next.js", "React", "TypeScript", "Node.js", "C# / .NET", "AWS", "Azure DevOps", "Tailwind CSS", "Angular", "Docker", "Jest", "Cypress"];
const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bigX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.15);
    my.set((e.clientY - r.top - r.height / 2) * 0.15);
  };

  return (
    <section
      id="top"
      ref={ref}
      data-theme-section="default"
      onPointerMove={onMove}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24"
    >
      <div aria-hidden className="grid-bg absolute inset-0" />
      <motion.div aria-hidden style={{ x: mx, y: my }} className="glow-orb absolute left-1/2 top-1/2 -ml-[30vmax] -mt-[30vmax] h-[60vmax] w-[60vmax] opacity-60" />

      {/* Giant outlined name drifting with scroll */}
      <motion.div
        aria-hidden
        style={{ x: bigX }}
        className="text-outline pointer-events-none absolute bottom-[8%] left-0 whitespace-nowrap font-display font-bold leading-none tracking-tighter text-[28vw] select-none"
      >
        JAIR MERLO
      </motion.div>

      <motion.div style={{ y: contentY, opacity: fade }} className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Senior Frontend @ Yape · Open to opportunities
        </motion.div>

        <h1 className="mt-8 max-w-5xl font-display text-[13vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold leading-[0.92] tracking-tighter">
          <RevealWords text="Interfaces built" delay={0.1} />
          <br />
          <RevealWords text="for millions." delay={0.25} wordClassName="text-gradient" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          className="mt-8 max-w-xl text-lg md:text-xl leading-relaxed text-muted"
        >
          I&apos;m <span className="text-white">{profile.name}</span>, a {profile.role.toLowerCase()} with 6+ years shipping fast,
          scalable products across fintech, real estate and logistics — React, Next.js, .NET and AWS.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-accent"
            >
              Explore my work
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition hover:border-white"
            >
              Let&apos;s talk
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* HUD metadata */}
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto hidden max-w-7xl justify-between px-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70 md:flex">
        <span>{profile.location}</span>
        <span>Portfolio · {new Date().getFullYear()}</span>
      </div>

      <div className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Scroll to explore</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-accent"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-line bg-black/30 py-3 backdrop-blur">
        <div className="animate-marquee flex w-max gap-10 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          {[...marquee, ...marquee].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
