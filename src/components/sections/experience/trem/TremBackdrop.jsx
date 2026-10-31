"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  Trem Group stage backdrop (2D canvas, no WebGL): a sunny Miami waterfront. Static layers
  (sky, sun, Brickell-style skyline across the bay, ocean, beach, striped lawn, waterfront
  villas) are pre-rendered on resize; each frame only adds drifting clouds, gulls, ocean
  glints, swaying palms and listing pins dropping onto the villas. Paused off-screen.
*/

const BLUE = "56,112,251";
const MAX_DPR = 1.5;

export const HORIZON = 0.56; // sea line, fraction of the stage height
/** Screen y (fraction of the stage height) of a ground point at depth z. */
export const groundY = (z) => HORIZON + (1 - HORIZON) / z;
const OCEAN = 0.05; // ocean band height (fraction of h)
const SAND = 0.016;

const LABELS = ["SOLD · $4.2M", "LISTED · $6.8M", "RENTED", "SOLD · $12.5M", "OPEN HOUSE"];

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cloudSprite(wpx) {
  const c = document.createElement("canvas");
  c.width = wpx;
  c.height = Math.round(wpx * 0.45);
  const x = c.getContext("2d");
  const r = rng(wpx);
  const h = c.height;
  for (let i = 0; i < 9; i++) {
    const cx = wpx * (0.18 + r() * 0.64);
    const cy = h * (0.5 + r() * 0.25);
    const rad = h * (0.2 + r() * 0.22);
    const g = x.createRadialGradient(cx, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.7, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, rad, 0, Math.PI * 2);
    x.fill();
  }
  return c;
}

/** Static scenery → offscreen canvas. Returns villa rooftops for the pins. */
function buildScene({ w, h, dpr, wide }) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const x = c.getContext("2d");
  x.scale(dpr, dpr);
  const r = rng(31);
  const u = h / 900;
  const hz = h * HORIZON;

  // Sky
  const sky = x.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "#2f7fde");
  sky.addColorStop(0.55, "#7cc0f2");
  sky.addColorStop(1, "#dcefff");
  x.fillStyle = sky;
  x.fillRect(0, 0, w, hz);

  // Sun + glow
  const sunX = w * 0.86, sunY = h * 0.15, sunR = 34 * u;
  const glow = x.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 7);
  glow.addColorStop(0, "rgba(255,244,200,0.9)");
  glow.addColorStop(0.25, "rgba(255,236,170,0.35)");
  glow.addColorStop(1, "rgba(255,236,170,0)");
  x.fillStyle = glow;
  x.fillRect(0, 0, w, hz);
  x.fillStyle = "#fff8dc";
  x.beginPath();
  x.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  x.fill();

  // Skyline across the bay (light, hazy glass towers)
  let tx = wide ? w * 0.34 : 0;
  while (tx < w) {
    const bw = (22 + r() * 34) * u;
    const bh = (50 + r() * 120) * u;
    const top = hz - bh;
    const g = x.createLinearGradient(tx, 0, tx + bw, 0);
    g.addColorStop(0, "#b9d3ea");
    g.addColorStop(1, "#9dbcd8");
    x.fillStyle = g;
    x.fillRect(tx, top, bw, bh);
    x.fillStyle = "rgba(255,255,255,0.35)";
    for (let wy = top + 5 * u; wy < hz - 3 * u; wy += 7 * u) x.fillRect(tx + 2 * u, wy, bw - 4 * u, 1.2 * u);
    if (r() < 0.3) {
      x.fillStyle = "#c9dcee";
      x.fillRect(tx + bw / 2 - 1 * u, top - 14 * u, 2 * u, 14 * u);
    }
    tx += bw + (r() < 0.3 ? 30 * u : 3 * u);
  }

  // Ocean
  const oy = hz, oh = h * OCEAN;
  const sea = x.createLinearGradient(0, oy, 0, oy + oh);
  sea.addColorStop(0, "#2b9bd6");
  sea.addColorStop(1, "#1fb5c9");
  x.fillStyle = sea;
  x.fillRect(0, oy, w, oh);
  // Sand
  x.fillStyle = "#f1e2bf";
  x.fillRect(0, oy + oh, w, h * SAND);

  // Striped lawn in perspective
  const lawnTop = oy + oh + h * SAND;
  x.fillStyle = "#4f9e3c";
  x.fillRect(0, lawnTop, w, h - lawnTop);
  const vpX = w * (wide ? 0.65 : 0.5);
  const floorH = h - hz;
  const spread = Math.max(w, 700) * 0.08;
  const zTop = floorH / (lawnTop - hz);
  const sx = (X, z) => vpX + (X * spread) / z;
  const sy = (z) => hz + floorH / z;
  x.fillStyle = "#5bb146";
  for (let X = -60; X < 60; X += 6) {
    x.beginPath();
    x.moveTo(sx(X, 0.5), sy(0.5));
    x.lineTo(sx(X + 3, 0.5), sy(0.5));
    x.lineTo(sx(X + 3, zTop), lawnTop);
    x.lineTo(sx(X, zTop), lawnTop);
    x.closePath();
    x.fill();
  }
  // soft haze near the waterline
  const haze = x.createLinearGradient(0, lawnTop, 0, lawnTop + h * 0.05);
  haze.addColorStop(0, "rgba(220,240,255,0.45)");
  haze.addColorStop(1, "rgba(220,240,255,0)");
  x.fillStyle = haze;
  x.fillRect(0, lawnTop, w, h * 0.05);

  // Waterfront villas (modern, white, flat roofs, glass)
  const roofs = [];
  let vx = wide ? w * 0.38 : w * 0.02;
  const base = lawnTop + 10 * u;
  while (vx < w - 30 * u) {
    const bw = (60 + r() * 50) * u;
    const lower = (22 + r() * 10) * u;
    const upper = r() < 0.7 ? (16 + r() * 8) * u : 0;
    x.fillStyle = "rgba(0,0,0,0.12)";
    x.fillRect(vx + 4 * u, base - 2 * u, bw, 4 * u);
    x.fillStyle = "#f6f5f1";
    x.fillRect(vx, base - lower, bw, lower);
    x.fillStyle = "#3f7fb8";
    x.fillRect(vx + bw * 0.12, base - lower + 6 * u, bw * 0.55, lower - 9 * u);
    let top = base - lower;
    if (upper) {
      const uw = bw * 0.62, ux = vx + bw * 0.25;
      x.fillStyle = "#ffffff";
      x.fillRect(ux, top - upper, uw, upper);
      x.fillStyle = "#5b98cc";
      x.fillRect(ux + uw * 0.1, top - upper + 4 * u, uw * 0.8, upper - 7 * u);
      x.fillStyle = "#dedcd4";
      x.fillRect(ux - 4 * u, top - upper - 3 * u, uw + 8 * u, 3 * u);
      top -= upper;
    }
    x.fillStyle = "#dedcd4";
    x.fillRect(vx - 4 * u, base - lower - 3 * u, bw + 8 * u, 3 * u);
    roofs.push([vx + bw / 2, top - 3 * u]);
    vx += bw + (40 + r() * 50) * u;
  }

  return { canvas: c, roofs, lawnTop, base };
}

/** Procedural palm: curved trunk + swaying fronds. */
function palm(ctx, x, y, hgt, lean, sway, u) {
  const tipX = x + lean * hgt;
  const tipY = y - hgt;
  ctx.strokeStyle = "#8a6a45";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(2, hgt * 0.045);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + lean * hgt * 0.2, y - hgt * 0.6, tipX, tipY);
  ctx.stroke();
  ctx.lineWidth = Math.max(1.4, hgt * 0.03);
  ctx.strokeStyle = "#6f5536";
  ctx.stroke();
  const len = hgt * 0.42;
  const angles = [-2.9, -2.4, -1.9, -1.3, -0.7, -0.25, 0.25];
  for (let i = 0; i < angles.length; i++) {
    const a = angles[i] + sway * (0.6 + (i % 3) * 0.2);
    const ex = tipX + Math.cos(a) * len;
    const ey = tipY + Math.sin(a) * len * 0.55 + len * 0.35;
    const cx = tipX + Math.cos(a) * len * 0.5;
    const cy = tipY + Math.sin(a) * len * 0.6 - len * 0.12;
    ctx.fillStyle = i % 2 ? "#2f8a3b" : "#247a32";
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(cx, cy - len * 0.08, ex, ey);
    ctx.quadraticCurveTo(cx, cy + len * 0.08, tipX, tipY);
    ctx.fill();
  }
  ctx.fillStyle = "#5c4428";
  ctx.beginPath();
  ctx.arc(tipX, tipY + 2 * u, Math.max(2, hgt * 0.03), 0, Math.PI * 2);
  ctx.fill();
}

export default function TremBackdrop({ wide }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let raf = 0, last = 0, time = 0, intro = reduce ? 1 : 0;
    let running = false;
    let scene = null, clouds = [], glints = [], palms = [];
    let pins = [];
    let nextPin = 0.8;
    const ptr = { x: 0, sx: 0 };
    const r = rng(7);

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = b.width;
      h = b.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      const u = h / 900;
      scene = buildScene({ w, h, dpr, wide });
      const x0 = wide ? w * 0.3 : 0;
      clouds = [0.1, 0.32, 0.55, 0.8].map((f, i) => {
        const sw = Math.round((160 + i * 50) * u * (i % 2 ? 1 : 1.3));
        return { img: cloudSprite(Math.max(40, sw)), x: x0 + f * (w - x0), y: h * (0.05 + (i % 3) * 0.08), v: (6 + i * 3) * u };
      });
      const hz = h * HORIZON;
      glints = Array.from({ length: 40 }, () => ({
        x: x0 + r() * (w - x0),
        y: hz + 3 * u + r() * (h * OCEAN - 6 * u),
        l: (6 + r() * 14) * u,
        p: r() * Math.PI * 2,
      }));
      // Palms: a row along the shore (small) + tall ones framing the scene
      const shoreY = scene.base;
      palms = [];
      for (let px = x0 + 40 * u; px < w; px += (70 + r() * 90) * u)
        palms.push({ x: px, y: shoreY + 2 * u, h: (70 + r() * 40) * u, lean: (r() - 0.5) * 0.35, p: r() * 6 });
      const big = wide ? [[0.97, 0.99, 0.5], [0.91, 0.93, 0.38]] : [[0.96, 0.99, 0.42]];
      big.forEach(([fx, fy, fh], i) => palms.push({ x: w * fx, y: h * fy, h: h * fh, lean: -0.16, p: i * 2, big: true }));
      pins = [];
      if (!running) draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!scene) return;
      const a = intro;
      const u = h / 900;
      ctx.globalAlpha = a;
      ctx.drawImage(scene.canvas, 0, 0, w, h);

      // Clouds
      for (const c of clouds) ctx.drawImage(c.img, c.x + ptr.sx * -8, c.y, c.img.width, c.img.height);

      // Gulls
      ctx.strokeStyle = "rgba(40,55,75,0.7)";
      ctx.lineWidth = 1.5 * u + 0.5;
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const span = w * 1.3;
        const gx = w - ((time * (28 + i * 9) * u + i * span * 0.37) % span) + w * 0.15;
        const gy = h * (0.18 + i * 0.07) + Math.sin(time * 0.8 + i) * 8 * u;
        const flap = Math.sin(time * 7 + i * 2) * 4 * u;
        const s = (7 - i) * u;
        ctx.beginPath();
        ctx.moveTo(gx - s, gy - flap);
        ctx.quadraticCurveTo(gx - s * 0.4, gy - s * 0.4, gx, gy);
        ctx.quadraticCurveTo(gx + s * 0.4, gy - s * 0.4, gx + s, gy - flap);
        ctx.stroke();
      }

      // Ocean glints
      for (const g of glints) {
        const al = Math.max(0, Math.sin(time * 2.2 + g.p));
        ctx.fillStyle = `rgba(255,255,255,${0.75 * al})`;
        ctx.fillRect(g.x, g.y, g.l, 1.5 * u + 0.5);
      }

      // Shoreline palms (behind the pins)
      for (const p of palms) if (!p.big) palm(ctx, p.x, p.y, p.h, p.lean, Math.sin(time * 1.3 + p.p) * 0.08, u);

      // Listing pins dropping onto the villas
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.max(9, 11 * u)}px ui-sans-serif, system-ui, sans-serif`;
      for (const p of pins) {
        const [x, top] = scene.roofs[p.i];
        const t = p.t;
        const drop = Math.min(1, t / 0.45);
        const bounce = drop < 1 ? 1 - Math.pow(1 - drop, 3) : 1 + Math.sin(Math.min(1, (t - 0.45) / 0.3) * Math.PI) * 0.06;
        const fade = t > 2.4 ? Math.max(0, 1 - (t - 2.4) / 0.5) : 1;
        const s = 12 * u;
        const y = top - 4 * u - (1 - bounce) * 60 * u - s;
        ctx.globalAlpha = fade * a;
        if (t > 0.45 && t < 1.6) {
          const k = (t - 0.45) / 1.15;
          ctx.strokeStyle = `rgba(${BLUE},${1 - k})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, top + 2 * u, 4 * u + k * 30 * u, (4 * u + k * 30 * u) * 0.3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = `rgb(${BLUE})`;
        ctx.beginPath();
        ctx.arc(x, y, s, Math.PI * 0.85, Math.PI * 2.15);
        ctx.lineTo(x, y + s * 1.9);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x, y, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
        if (t > 0.5) {
          const la = Math.min(1, (t - 0.5) / 0.25);
          ctx.globalAlpha = fade * a * la;
          const tw = ctx.measureText(p.label).width + 14 * u;
          const ly = y - s - 15 * u - la * 4 * u;
          ctx.fillStyle = `rgb(${BLUE})`;
          ctx.fillRect(x - tw / 2, ly - 10 * u, tw, 20 * u);
          ctx.fillStyle = "#fff";
          ctx.fillText(p.label, x, ly + 0.5);
        }
        ctx.globalAlpha = a;
      }

      // Tall framing palms in front
      for (const p of palms) if (p.big) palm(ctx, p.x, p.y, p.h, p.lean, Math.sin(time * 1.1 + p.p) * 0.06, u);
      ctx.globalAlpha = 1;

      // ---- Keep the text column (left 30%) readable on desktop: fade the scene into the light page bg
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
      if (!scene) return;
      const x0 = wide ? w * 0.3 : 0;
      for (const c of clouds) {
        c.x -= c.v * dt;
        if (c.x < x0 - c.img.width) c.x = w + 20;
      }
      if (time >= nextPin && pins.length < 3 && scene.roofs.length) {
        nextPin = time + 0.9 + r() * 0.6;
        const minX = wide ? w * 0.5 : w * 0.18;
        for (let k = 0; k < 6; k++) {
          const i = (r() * scene.roofs.length) | 0;
          const rx = scene.roofs[i][0];
          if (rx > minX && rx < w - 50 && !pins.some((p) => p.i === i)) {
            pins.push({ i, t: 0, label: LABELS[(r() * LABELS.length) | 0] });
            break;
          }
        }
      }
      for (const p of pins) p.t += dt;
      pins = pins.filter((p) => p.t < 2.9);
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
