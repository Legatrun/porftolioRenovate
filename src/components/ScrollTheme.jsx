"use client";
import { useEffect } from "react";

/**
 * Watches every element with [data-theme-section] and sets <html data-theme>
 * to the one crossing the middle of the viewport. CSS (@property) fades the palette.
 */
export default function ScrollTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = document.querySelectorAll("[data-theme-section]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const theme = e.target.getAttribute("data-theme-section");
            if (theme === "default") root.removeAttribute("data-theme");
            else root.setAttribute("data-theme", theme);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return null;
}
