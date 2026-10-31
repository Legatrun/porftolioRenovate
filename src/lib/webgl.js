"use client";
import { useCallback, useEffect, useRef, useState } from "react";

let cached = null;

/** WebGL support check. Cached, and the probe context is released right away (it used to leak one per scene). */
export function hasWebGL() {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * Low-end GPUs can drop a WebGL context (often right after a reload, while the old page's
 * contexts are still being freed). This remounts the <Canvas> with a fresh context; after
 * `maxRetries` it gives up and calls `onFail` so the caller can show a fallback.
 * Usage: const { key, onCreated } = useContextRecovery(onFail); <Canvas key={key} onCreated={onCreated} />
 */
export function useContextRecovery(onFail, maxRetries = 2) {
  const [key, setKey] = useState(0);
  const tries = useRef(0);
  const failRef = useRef(onFail);
  useEffect(() => {
    failRef.current = onFail;
  }, [onFail]);

  const onCreated = useCallback(({ gl }) => {
    gl.domElement.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
        if (tries.current < maxRetries) {
          tries.current += 1;
          setTimeout(() => setKey((k) => k + 1), 300);
        } else {
          failRef.current?.();
        }
      },
      { once: true }
    );
  }, [maxRetries]);

  return { key, onCreated };
}
