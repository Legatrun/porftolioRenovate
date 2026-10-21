"use client";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 28, className, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits a line into words that rise in sequence.
 * The observer sits on the unclipped wrapper; words are clipped by their mask and
 * driven through variants (an observer on a clipped child would never fire).
 */
export function RevealWords({ text, className, wordClassName = "", delay = 0 }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden>
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
            transition={{ duration: 0.9, delay: delay + i * 0.05, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
