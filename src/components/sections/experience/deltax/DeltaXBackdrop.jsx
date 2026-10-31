"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  DeltaX stage backdrop (2D canvas, no WebGL). Side-tracking camera: the truck stays put while
  the perspective ground, the road dashes and the roadside posts slide left, so it reads as the
  truck driving forward. Above the horizon, a LATAM route network with cargo pulses between hubs.
  One canvas, no CSS filters, paused off-screen / in hidden tabs.
*/

const ORANGE = "235,151,5";
const MAX_DPR = 1.5;

export const HORIZON = 0.5; // fraction of the stage height
const Z_FAR = 34;
const ROAD_NEAR = 1.5;
const ROAD_FAR = 2.3;
export const TRUCK_Z = 1.72; // depth of the lane the truck drives on
/** Screen y (fraction of the stage height) of a ground point at depth z. */
export const groundY = (z) => HORIZON + (1 - HORIZON) / z;
export const SPEED = 6; // world units / s

// Hubs in normalized coords of the network area (≈ the 10+ countries served).
const HUBS = [
  [0.08, 0.55], [0.22, 0.25], [0.3, 0.7], [0.42, 0.4], [0.5, 0.82],
  [0.58, 0.18], [0.66, 0.58], [0.78, 0.32], [0.86, 0.74], [0.95, 0.45], [0.36, 0.08],
];
const ROUTES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7],
  [6, 8], [7, 9], [8, 9], [1, 10], [10, 5],
];

function makeSprite(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,236,200,1)");
  g.addColorStop(0.25, `rgba(${ORANGE},0.55)`);
  g.addColorStop(1, `rgba(${ORANGE},0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  return c;
}

const mod = (a, n) => ((a % n) + n) % n;

export default function DeltaXBackdrop({ wide }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const glow = makeSprite(64);
    let w = 0, h = 0, dpr = 1;
    let raf = 0, last = 0, time = 0, intro = reduce ? 1 : 0;
    let running = false;
    const ptr = { x: 0, sx: 0 };

    const pulses = ROUTES.map((_, i) => ({ p: (i * 0.37) % 1, speed: 0.18 + (i % 4) * 0.05 }));
    const hubFlash = new Float32Array(HUBS.length);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      if (!running) draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const a = intro;
      const horizon = h * HORIZON;
      const floorH = h - horizon;
      const vpX = w * (wide ? 0.66 : 0.5) + ptr.sx * w * 0.03;
      const spread = Math.max(w, 700) * 0.09;
      const off = time * SPEED; // camera travel along X
      const sx = (X, z) => vpX + ((X - off) * spread) / z;
      const sy = (z) => horizon + floorH / z;

      // ---- Ground: depth lines slide left (camera tracking), cross lines stay fixed
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ORANGE},${0.28 * a})`;
      ctx.beginPath();
      const step = 3;
      const base = off - mod(off, step);
      for (let X = base - 60; X <= base + 60; X += step) {
        ctx.moveTo(sx(X, 0.55), sy(0.55));
        ctx.lineTo(sx(X, Z_FAR), sy(Z_FAR));
      }
      for (const z of [1.1, 1.3, 2.8, 3.6, 4.8, 6.5, 9, 13, 20]) {
        ctx.moveTo(0, sy(z));
        ctx.lineTo(w, sy(z));
      }
      ctx.stroke();

      // ---- Horizon fog
      ctx.globalCompositeOperation = "destination-out";
      const fog = ctx.createLinearGradient(0, horizon, 0, horizon + floorH * 0.3);
      fog.addColorStop(0, "rgba(0,0,0,1)");
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, horizon - 2, w, floorH * 0.3 + 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(${ORANGE},${0.5 * a})`;
      ctx.fillRect(0, horizon - 1, w, 1.5);

      // ---- Road band
      const yFar = sy(ROAD_FAR);
      const yNear = sy(ROAD_NEAR);
      ctx.fillStyle = `rgba(20,26,38,${0.92 * a})`;
      ctx.fillRect(0, yFar, w, yNear - yFar);
      ctx.fillStyle = `rgba(${ORANGE},${0.75 * a})`;
      ctx.fillRect(0, yFar - 1, w, 2);
      ctx.fillRect(0, yNear - 1, w, 2);
      // Center dashes
      const zc = (ROAD_NEAR + ROAD_FAR) / 2;
      const yc = sy(zc);
      const dashH = Math.max(1.5, (yNear - yFar) * 0.05);
      ctx.fillStyle = `rgba(255,255,255,${0.6 * a})`;
      const dStep = 4;
      const dBase = off - mod(off, dStep);
      for (let X = dBase - 40; X <= dBase + 40; X += dStep) {
        const x0 = sx(X, zc), x1 = sx(X + 2, zc);
        if (x1 < 0 || x0 > w) continue;
        ctx.fillRect(x0, yc - dashH / 2, x1 - x0, dashH);
      }

      // ---- Roadside posts behind the road (strong speed cue)
      const zp = 2.9;
      const pStep = 7;
      const pBase = off - mod(off, pStep);
      const ph = (0.35 * floorH) / zp;
      ctx.lineWidth = 2;
      for (let X = pBase - 50; X <= pBase + 50; X += pStep) {
        const x = sx(X, zp);
        if (x < -10 || x > w + 10) continue;
        const y = sy(zp);
        ctx.strokeStyle = `rgba(163,172,187,${0.35 * a})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - ph);
        ctx.stroke();
        ctx.globalAlpha = 0.8 * a;
        ctx.drawImage(glow, x - 7, y - ph - 7, 14, 14);
        ctx.globalAlpha = 1;
      }

      // ---- Route network above the horizon
      const nx = wide ? w * 0.38 : w * 0.06;
      const nw = wide ? w * 0.58 : w * 0.88;
      const ny = h * 0.07;
      const nh = horizon - ny - h * 0.1;
      const hub = (i) => [nx + HUBS[i][0] * nw + ptr.sx * -10, ny + HUBS[i][1] * nh];
      const ctrl = ([x0, y0], [x1, y1]) => [(x0 + x1) / 2, Math.min(y0, y1) - Math.abs(x1 - x0) * 0.25];
      const bez = (p0, c, p1, t) => {
        const u = 1 - t;
        return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
      };

      ctx.strokeStyle = `rgba(255,214,150,${0.42 * a})`;
      ctx.lineWidth = 1.75;
      ctx.lineCap = "round";
      ctx.setLineDash([7, 6]);
      ctx.lineDashOffset = -time * 14; // dashes drift along the route
      ctx.beginPath();
      for (const [i, j] of ROUTES) {
        const p0 = hub(i), p1 = hub(j), c = ctrl(p0, p1);
        ctx.moveTo(p0[0], p0[1]);
        ctx.quadraticCurveTo(c[0], c[1], p1[0], p1[1]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.lineCap = "butt";

      ROUTES.forEach(([i, j], k) => {
        const p0 = hub(i), p1 = hub(j), c = ctrl(p0, p1);
        const t = pulses[k].p;
        ctx.strokeStyle = `rgba(${ORANGE},${0.7 * a})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let q = 0; q <= 5; q++) {
          const [x, y] = bez(p0, c, p1, Math.max(0, t - q * 0.025));
          q ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        const [x, y] = bez(p0, c, p1, t);
        ctx.globalAlpha = a;
        ctx.drawImage(glow, x - 11, y - 11, 22, 22);
        ctx.globalAlpha = 1;
      });

      HUBS.forEach((_, i) => {
        const [x, y] = hub(i);
        const f = hubFlash[i];
        if (f > 0) {
          ctx.strokeStyle = `rgba(${ORANGE},${f * a})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 6 + (1 - f) * 18, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${ORANGE},${a})`;
        ctx.fillRect(x - 3, y - 3, 6, 6);
        ctx.fillStyle = `rgba(9,13,21,${a})`;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      });

      // ---- Keep the text column (left 30%) readable on desktop
      if (wide) {
        ctx.globalCompositeOperation = "destination-out";
        const m = ctx.createLinearGradient(0, 0, w * 0.42, 0);
        m.addColorStop(0, "rgba(0,0,0,0.95)");
        m.addColorStop(0.65, "rgba(0,0,0,0.85)");
        m.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = m;
        ctx.fillRect(0, 0, w * 0.42, h);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    const stepFn = (dt) => {
      time += dt;
      intro = Math.min(1, intro + dt / 1.2);
      ptr.sx += (ptr.x - ptr.sx) * Math.min(1, dt * 4);
      pulses.forEach((p, k) => {
        p.p += p.speed * dt;
        if (p.p >= 1) {
          p.p -= 1;
          hubFlash[ROUTES[k][1]] = 1;
        }
      });
      for (let i = 0; i < hubFlash.length; i++) hubFlash[i] = Math.max(0, hubFlash[i] - dt * 1.2);
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      stepFn(dt);
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
