"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export default function Counter({ value, prefix = "", suffix = "", duration = 1.8, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, duration, reduce]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}0{suffix}
    </span>
  );
}
