"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  Alpha Systems stage backdrop (2D canvas, no WebGL): La Paz at night. Static layers (night sky,
  Illimani's snowy peaks, the city bowl with its lights) are pre-rendered on resize; each frame
  adds twinkling stars and city lights, a green ground grid, and the Bolivian ATM network:
  transactions travelling from city ATMs to the La Paz back-office. Paused off-screen.
*/

const GREEN = "149,203,77";
const AMBER = "245,158,11";
const MAX_DPR = 1.5;

export const HORIZON = 0.62;
/** Screen y (fraction of the stage height) of a ground point at depth z. */
export const groundY = (z) => HORIZON + (1 - HORIZON) / z;
const Z_FAR = 30;

// Network nodes (normalized inside the network area). 0 = La Paz back-office (HQ).
const CITIES = [
  ["LA PAZ", 0.2, 0.5],
  ["EL ALTO", 0.08, 0.38],
  ["COBIJA", 0.06, 0.02],
  ["TRINIDAD", 0.46, 0.14],
  ["ORURO", 0.27, 0.78],
  ["COCHABAMBA", 0.45, 0.6],
  ["SANTA CRUZ", 0.82, 0.48],
  ["SUCRE", 0.6, 0.85],
  ["POTOSÍ", 0.44, 0.98],
  ["TARIJA", 0.74, 1.0],
];
const LINKS = [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 5], [7, 5], [8, 4], [9, 7], [3, 6]];

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGlow(size, rgb) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, `rgba(${rgb},0.6)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  return c;
}

/** Static scenery: sky, Illimani, the city bowl. Returns city-light positions for twinkling. */
function buildScene({ w, h, dpr, wide }) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const x = c.getContext("2d");
  x.scale(dpr, dpr);
  const r = rng(5);
  const u = h / 900;
  const hz = h * HORIZON;

  const sky = x.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "#070d1d");
  sky.addColorStop(0.7, "#0f1c3a");
  sky.addColorStop(1, "#1b2d52");
  x.fillStyle = sky;
  x.fillRect(0, 0, w, hz);

  // Moon
  const mx = w * (wide ? 0.92 : 0.88), my = h * 0.1, mr = 18 * u;
  const mg = x.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 6);
  mg.addColorStop(0, "rgba(220,235,255,0.35)");
  mg.addColorStop(1, "rgba(220,235,255,0)");
  x.fillStyle = mg;
  x.fillRect(mx - mr * 6, my - mr * 6, mr * 12, mr * 12);
  x.fillStyle = "#eef4ff";
  x.beginPath();
  x.arc(mx, my, mr, 0, Math.PI * 2);
  x.fill();

  // Illimani: three snowy peaks
  const ix = w * (wide ? 0.78 : 0.62), base = hz - 40 * u, pk = 210 * u;
  const peaks = [[-170, 0.78], [-60, 1], [60, 0.92], [170, 0.7]];
  x.fillStyle = "#24365e";
  x.beginPath();
  x.moveTo(ix - 360 * u, base + 10 * u);
  peaks.forEach(([dx, f], i) => {
    x.lineTo(ix + (dx - 45) * u, base - pk * f * 0.55);
    x.lineTo(ix + dx * u, base - pk * f);
    if (i === peaks.length - 1) x.lineTo(ix + (dx + 70) * u, base - pk * f * 0.45);
  });
  x.lineTo(ix + 360 * u, base + 10 * u);
  x.closePath();
  x.fill();
  // snow caps
  x.fillStyle = "#e6eefc";
  peaks.forEach(([dx, f]) => {
    const tx = ix + dx * u, ty = base - pk * f;
    x.beginPath();
    x.moveTo(tx, ty);
    x.lineTo(tx - 34 * u, ty + 46 * u * f);
    x.lineTo(tx - 16 * u, ty + 38 * u * f);
    x.lineTo(tx - 4 * u, ty + 52 * u * f);
    x.lineTo(tx + 12 * u, ty + 36 * u * f);
    x.lineTo(tx + 32 * u, ty + 44 * u * f);
    x.closePath();
    x.fill();
  });
  // haze over the mountain base
  const hzg = x.createLinearGradient(0, base - pk * 0.4, 0, hz);
  hzg.addColorStop(0, "rgba(27,45,82,0)");
  hzg.addColorStop(1, "rgba(27,45,82,0.9)");
  x.fillStyle = hzg;
  x.fillRect(0, base - pk * 0.4, w, hz - base + pk * 0.4);

  // City bowl: layered hills dotted with lights
  const lights = [];
  const hills = [
    { y: hz - 70 * u, amp: 26 * u, col: "#121f3d", n: 260 },
    { y: hz - 30 * u, amp: 18 * u, col: "#0e1830", n: 320 },
  ];
  hills.forEach((hl, li) => {
    const pts = [];
    for (let px = 0; px <= w + 20; px += 20) pts.push([px, hl.y + Math.sin(px * 0.006 + li) * hl.amp + Math.sin(px * 0.017) * hl.amp * 0.4]);
    x.fillStyle = hl.col;
    x.beginPath();
    x.moveTo(0, hz);
    pts.forEach(([px, py]) => x.lineTo(px, py));
    x.lineTo(w, hz);
    x.closePath();
    x.fill();
    const x0 = wide ? w * 0.32 : 0;
    for (let i = 0; i < hl.n * (w / 1400); i++) {
      const lx = x0 + r() * (w - x0);
      const top = pts[Math.min(pts.length - 1, Math.round(lx / 20))][1];
      const ly = top + 4 * u + r() * (hz - top - 6 * u);
      const warm = r() < 0.75;
      x.fillStyle = warm ? "rgba(255,200,120,0.75)" : "rgba(200,225,255,0.7)";
      const s = (1 + r() * 1.4) * u + 0.4;
      x.fillRect(lx, ly, s, s);
      if (r() < 0.12) lights.push([lx, ly, s, warm]);
    }
  });
  return { canvas: c, lights };
}

export default function AlphaBackdrop({ wide }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const glow = makeGlow(64, GREEN);
    const amber = makeGlow(64, AMBER);
    let w = 0, h = 0, dpr = 1;
    let raf = 0, last = 0, time = 0, intro = reduce ? 1 : 0;
    let running = false;
    let scene = null, stars = [];
    const r = rng(9);
    const packets = LINKS.map((_, i) => ({ p: (i * 0.31) % 1, speed: 0.22 + (i % 3) * 0.07 }));
    const flash = new Float32Array(CITIES.length);
    let maint = { i: 3, t: 0 }, nextMaint = 2;
    const ptr = { x: 0, sx: 0 };

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = b.width;
      h = b.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      scene = buildScene({ w, h, dpr, wide });
      const x0 = wide ? w * 0.3 : 0;
      stars = Array.from({ length: 90 }, () => [x0 + r() * (w - x0), r() * h * HORIZON * 0.75, r() * 1.4 + 0.4, r() * 6]);
      if (!running) draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!scene) return;
      const a = intro;
      const u = h / 900;
      const hz = h * HORIZON;
      ctx.globalAlpha = a;
      ctx.drawImage(scene.canvas, 0, 0, w, h);

      // Stars
      for (const [sx, sy, s, p] of stars) {
        ctx.fillStyle = `rgba(230,240,255,${0.35 + 0.5 * Math.max(0, Math.sin(time * 1.5 + p))})`;
        ctx.fillRect(sx, sy, s, s);
      }
      // City lights twinkle
      for (const [lx, ly, s, warm] of scene.lights) {
        const k = Math.max(0, Math.sin(time * 2 + lx * 0.05));
        ctx.fillStyle = warm ? `rgba(255,220,150,${k})` : `rgba(220,240,255,${k})`;
        ctx.fillRect(lx - 0.5, ly - 0.5, s + 1, s + 1);
      }
      ctx.globalAlpha = 1;

      // Ground grid (green, fades into the horizon)
      const floorH = h - hz;
      const vpX = w * (wide ? 0.65 : 0.5) + ptr.sx * w * 0.03;
      const spread = Math.max(w, 700) * 0.08;
      const sx = (X, z) => vpX + (X * spread) / z;
      const sy = (z) => hz + floorH / z;
      ctx.fillStyle = `rgba(10,17,33,${a})`;
      ctx.fillRect(0, hz, w, floorH);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${GREEN},${0.22 * a})`;
      ctx.beginPath();
      for (let X = -40; X <= 40; X += 2.5) {
        ctx.moveTo(sx(X, 0.55), sy(0.55));
        ctx.lineTo(sx(X, Z_FAR), sy(Z_FAR));
      }
      const gap = 1.6, off = (time * 0.8) % gap;
      for (let z = 1 + gap - off; z < Z_FAR; z += gap) {
        ctx.moveTo(0, sy(z));
        ctx.lineTo(w, sy(z));
      }
      ctx.stroke();
      ctx.globalCompositeOperation = "destination-out";
      const fog = ctx.createLinearGradient(0, hz, 0, hz + floorH * 0.3);
      fog.addColorStop(0, "rgba(0,0,0,0.85)");
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, hz, w, floorH * 0.3);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(${GREEN},${0.45 * a})`;
      ctx.fillRect(0, hz - 1, w, 1.5);

      // ---- ATM network over the sky
      const nx = wide ? w * 0.38 : w * 0.06;
      const nw = wide ? w * 0.34 : w * 0.72;
      const ny = h * 0.08;
      const nh = h * (wide ? 0.34 : 0.3);
      const node = (i) => [nx + CITIES[i][1] * nw + ptr.sx * -8, ny + CITIES[i][2] * nh];

      ctx.strokeStyle = `rgba(${GREEN},${0.22 * a})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      for (const [i, j] of LINKS) {
        const [x0, y0] = node(i), [x1, y1] = node(j);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      LINKS.forEach(([i, j], k) => {
        const [x0, y0] = node(i), [x1, y1] = node(j);
        const t = packets[k].p;
        const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
        const tx = x0 + (x1 - x0) * Math.max(0, t - 0.12), ty = y0 + (y1 - y0) * Math.max(0, t - 0.12);
        const g = ctx.createLinearGradient(tx, ty, px, py);
        g.addColorStop(0, `rgba(${GREEN},0)`);
        g.addColorStop(1, `rgba(${GREEN},${0.9 * a})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.globalAlpha = a;
        ctx.drawImage(glow, px - 9, py - 9, 18, 18);
        ctx.globalAlpha = 1;
      });

      ctx.font = `500 ${Math.max(8, 10 * u)}px ui-monospace, SFMono-Regular, monospace`;
      ctx.textBaseline = "middle";
      CITIES.forEach(([name], i) => {
        const [x, y] = node(i);
        const hq = i === 0;
        const f = flash[i];
        if (f > 0) {
          ctx.strokeStyle = `rgba(${GREEN},${f * a})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, (hq ? 10 : 6) + (1 - f) * 16, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (maint.i === i && maint.t < 1.6) {
          const k = maint.t / 1.6;
          ctx.globalAlpha = (1 - k) * a;
          ctx.drawImage(amber, x - 16 - k * 10, y - 16 - k * 10, 32 + k * 20, 32 + k * 20);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = hq ? "#ffffff" : `rgba(${GREEN},${a})`;
        const s = hq ? 7 : 5;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
        ctx.fillStyle = `rgba(203,213,225,${(hq ? 0.95 : 0.6) * a})`;
        ctx.textAlign = CITIES[i][1] > 0.7 ? "right" : "left";
        ctx.fillText(hq ? "LA PAZ · HQ" : name, x + (ctx.textAlign === "right" ? -8 : 8), y);
      });

      // Keep the text column (left 30%) readable on desktop
      if (wide) {
        ctx.globalCompositeOperation = "destination-out";
        const m = ctx.createLinearGradient(0, 0, w * 0.44, 0);
        m.addColorStop(0, "rgba(0,0,0,1)");
        m.addColorStop(0.6, "rgba(0,0,0,0.9)");
        m.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = m;
        ctx.fillRect(0, 0, w * 0.44, h);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    const step = (dt) => {
      time += dt;
      intro = Math.min(1, intro + dt / 1.2);
      ptr.sx += (ptr.x - ptr.sx) * Math.min(1, dt * 4);
      packets.forEach((p, k) => {
        p.p += p.speed * dt;
        if (p.p >= 1) {
          p.p -= 1;
          flash[LINKS[k][1]] = 1;
        }
      });
      for (let i = 0; i < flash.length; i++) flash[i] = Math.max(0, flash[i] - dt * 1.4);
      maint.t += dt;
      if (time > nextMaint) {
        nextMaint = time + 3 + r() * 2;
        maint = { i: 1 + ((r() * (CITIES.length - 1)) | 0), t: 0 };
      }
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let inView = false;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      inView ? start() : stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onVis = () => (document.hidden ? stop() : inView && start());
    const onMove = (e) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, wide]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
