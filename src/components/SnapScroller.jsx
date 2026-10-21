"use client";
import { useEffect } from "react";

const QUERY = "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const LOCK_MS = 900;

/** True if `el` (or an ancestor below <main>) can still scroll in the wheel direction. */
function innerCanScroll(el, dy) {
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Complements CSS `scroll-snap-type: y mandatory`: one wheel gesture = one screen,
 * so a small mouse notch or trackpad flick never snaps back to the same section.
 * Keyboard, touch and scrollbar keep native snapping.
 */
export default function SnapScroller() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let locked = false;

    const onWheel = (e) => {
      if (!mq.matches || e.ctrlKey || Math.abs(e.deltaY) < 4 || innerCanScroll(e.target, e.deltaY)) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      // Document-relative tops (offsetTop is relative to the nearest positioned ancestor).
      const screens = [...document.querySelectorAll("main .snap-start")].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + y, bottom: r.bottom + y };
      });
      const current = screens.findLast((s) => s.top <= y + 2) ?? screens[0];
      const { top, bottom } = current;

      // Let taller-than-viewport screens scroll natively until their edge.
      if (e.deltaY > 0 && bottom > y + vh + 2) return;
      if (e.deltaY < 0 && top < y - 2) return;

      e.preventDefault();
      if (locked) return;
      const i = screens.indexOf(current);
      const target = screens[e.deltaY > 0 ? i + 1 : i - 1];
      if (!target) return;
      locked = true;
      window.scrollTo({ top: target.top, behavior: "smooth" });
      setTimeout(() => (locked = false), LOCK_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
