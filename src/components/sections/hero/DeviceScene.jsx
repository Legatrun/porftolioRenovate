"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { experience, profile } from "@/lib/data";

// three.js + the MacBook model load right after first paint, off the critical path.
const MacScene3D = dynamic(() => import("./MacScene3D"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function useScript() {
  return useMemo(() => {
    const current = experience[0];
    return {
      banner: "Last login: today on ttys001",
      prompt: "jair@merlo ~ %",
      command: "whoami",
      output: [
        [null, profile.name],
        ["role", profile.role],
        ["now", `${current.role} @ ${current.company}`],
        ["exp", "6+ years · fintech · real estate · logistics"],
        ["stack", "React · Next.js · Node.js · .NET · AWS"],
        ["based", profile.location],
      ],
    };
  }, []);
}

/** Text-only fallback when WebGL isn't available. */
function TerminalFallback({ script }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-[#39ff14]/30 bg-[#010601] p-5 text-left font-mono text-sm text-[#39ff14] shadow-[0_0_60px_-15px_#39ff14]">
      <p className="opacity-60">{script.banner}</p>
      <p className="mt-2">
        {script.prompt} {script.command}
      </p>
      {script.output.map(([k, v], i) => (
        <p key={i} className={k ? "" : "font-bold"}>
          {k && <span className="inline-block w-16 opacity-60">{k}</span>}
          {v}
        </p>
      ))}
      <p>
        {script.prompt} <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-[#39ff14]" />
      </p>
    </div>
  );
}

/**
 * Hero device: MacBook Pro 14" (glTF). It rises closed, the lid opens, the screen powers on
 * and a phosphor-green terminal runs `whoami`.
 */
export default function DeviceScene({ delay = 0.8 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const script = useScript();
  const [mode, setMode] = useState("pending");
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const t = setTimeout(() => setMode(hasWebGL() ? "webgl" : "css"), 0);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  if (mode === "css") return <TerminalFallback script={script} />;

  return (
    <div ref={ref} className="relative mx-auto h-[clamp(260px,calc(100svh-360px),640px)] w-full max-w-5xl">
      {/* Neon glow under the laptop (same accent glow as before) */}
      <motion.div
        aria-hidden
        className="absolute bottom-[6%] left-1/2 h-[30%] w-[60%] -translate-x-1/2 rounded-[50%] bg-accent/40 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: delay + 0.6 }}
      />
      <div className="absolute inset-0" style={{ filter: "drop-shadow(0 30px 60px rgba(109,74,255,0.35))" }}>
        {mode === "webgl" && <MacScene3D script={script} delay={delay} reduce={!!reduce} running={visible} onReady={onReady} />}
      </div>
      <p className="sr-only">
        A MacBook opens and its terminal runs whoami: {script.output.map(([, v]) => v).join(", ")}.
      </p>
    </div>
  );
}
