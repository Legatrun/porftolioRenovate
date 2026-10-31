"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SRC = "/sound.mp3";
const VOLUME = 0.35;
const KEY = "bg-music-muted";

/** Ramps audio volume over `ms`, resolving when done. */
function fade(audio, to, ms = 700) {
  return new Promise((resolve) => {
    const from = audio.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = from + (to - from) * k;
      k < 1 ? requestAnimationFrame(step) : resolve();
    };
    requestAnimationFrame(step);
  });
}

/**
 * Looping background music with a navbar toggle.
 * Browsers block autoplay with sound, so playback starts on the visitor's first
 * click / tap / key press (unless they muted it before — remembered per browser).
 */
export default function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0;
      await a.play();
      setPlaying(true);
      fade(a, VOLUME);
    } catch {
      /* still blocked — will retry on next interaction */
    }
  };

  const pause = async () => {
    const a = audioRef.current;
    if (!a) return;
    setPlaying(false);
    await fade(a, 0, 400);
    a.pause();
  };

  useEffect(() => {
    let muted = false;
    try {
      muted = localStorage.getItem(KEY) === "1";
    } catch {}
    if (muted) return;

    const start = (e) => {
      // The toggle handles its own clicks.
      if (e.target.closest?.("[data-music-toggle]")) return;
      play();
      remove();
    };
    const events = ["pointerdown", "keydown", "touchstart"];
    const remove = () => events.forEach((ev) => window.removeEventListener(ev, start));
    events.forEach((ev) => window.addEventListener(ev, start, { passive: true }));
    return remove;
  }, []);

  const toggle = () => {
    const next = !playing;
    try {
      localStorage.setItem(KEY, next ? "0" : "1");
    } catch {}
    next ? play() : pause();
  };

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mute background music" : "Play background music"}
        className="group inline-flex h-10 items-center gap-2 rounded-sm border border-line bg-white/[0.04] px-3 text-sm transition hover:border-accent hover:text-accent-ink"
      >
        {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full bg-current ${playing ? "eq-bar" : "h-[3px] opacity-50"}`}
              style={playing ? { animationDelay: `${i * 0.15}s` } : undefined}
            />
          ))}
        </span>
      </button>
    </>
  );
}
