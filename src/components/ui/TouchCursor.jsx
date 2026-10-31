"use client";
import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], [role='tab'], input, select, textarea, label, summary";

/**
 * Phone-style cursor: a translucent white circle that eases toward the pointer,
 * swells over interactive elements and shrinks on press. Mouse/trackpad only.
 */
export default function TouchCursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: -100, y: -100 }, cur = { x: -100, y: -100 };
    let scale = 1, target = 1, hover = false, down = false, raf = 0, shown = false;

    const loop = () => {
      const k = reduce ? 1 : 0.35;
      cur.x += (pos.x - cur.x) * k;
      cur.y += (pos.y - cur.y) * k;
      target = down ? 0.75 : hover ? 1.9 : 1;
      scale += (target - scale) * (reduce ? 1 : 0.25);
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        shown = true;
        cur.x = pos.x;
        cur.y = pos.y;
        root.classList.add("has-touch-cursor");
      }
      el.style.opacity = "1";
      const h = !!e.target.closest?.(INTERACTIVE);
      if (h !== hover) {
        hover = h;
        el.dataset.hover = h ? "1" : "";
      }
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => (el.style.opacity = "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-touch-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="touch-cursor" />;
}
