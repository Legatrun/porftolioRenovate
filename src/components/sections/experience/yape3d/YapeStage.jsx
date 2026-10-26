"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";
import { YapeVisual } from "../Visuals";

// three.js is only downloaded when the Yape chapter gets close to the viewport.
const YapePhones3D = dynamic(() => import("./YapePhones3D"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * 3D stage for the Yape chapter (iPhone 15 Pro Max glTF, two phones + money transfer).
 * Starts its chained sequence once the chapter locks into view.
 * Falls back to the CSS phone illustration when WebGL isn't available.
 */
export default function YapeStage({ eventSource }) {
  const ref = useRef(null);
  const [wide, setWide] = useState(false);
  const active = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const [mode, setMode] = useState("pending"); // pending | webgl | css
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // ≥ lg: the canvas covers the whole section and the stage sits at 67% of its width.
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

  useEffect(() => {
    const t = setTimeout(() => setMode(hasWebGL() ? "webgl" : "css"), 0);
    const el = ref.current;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "0px" });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      clearTimeout(t);
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  if (mode === "css")
    return (
      <div className="relative mx-auto mt-8 w-full max-w-xl px-5 lg:absolute lg:right-[8%] lg:top-1/2 lg:mt-0 lg:w-[40%] lg:-translate-y-1/2 lg:px-0">
        <YapeVisual />
      </div>
    );

  return (
    <div
      ref={ref}
      className="pointer-events-none relative mt-6 h-[60svh] w-full lg:absolute lg:inset-0 lg:z-30 lg:mt-0 lg:h-auto"
    >
      {/* Neon glow: drop-shadow follows the phones' silhouettes on the transparent canvas */}
      <div
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 0 14px rgba(16,203,180,0.55)) drop-shadow(0 28px 50px rgba(16,203,180,0.35))" }}
      >
        {mode === "webgl" && near && (
          <YapePhones3D
            active={active}
            running={visible}
            reduce={!!reduce}
            onReady={onReady}
            focusX={wide ? 0.15 : 0}
            eventSource={eventSource}
          />
        )}
      </div>

      {/* Loading shimmer until the model is on screen */}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center lg:left-[35%]" aria-hidden>
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#10cbb4]" />
        </div>
      )}

      <span className="sr-only">Two iPhones running Yape: money flies from one phone to the other and the balance counts up.</span>
    </div>
  );
}
