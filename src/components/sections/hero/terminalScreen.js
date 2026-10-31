import * as THREE from "three";

/*
  Draws a acid-green terminal onto a <canvas> used as the MacBook screen texture.
  Static layers (background, vignette, scanlines) are pre-rendered once; each redraw only paints text.
  Drawn in 1536×960 logical units onto a smaller backing canvas to cut texture upload cost.
*/

export const TERM_W = 1536;
export const TERM_H = 960;
const RES = 2 / 3; // backing canvas = 1024×640
const GREEN = "#d4ff3f";

function monoFamily() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
  return v ? `${v}, ui-monospace, monospace` : "ui-monospace, SFMono-Regular, Menlo, monospace";
}

function layer(draw) {
  const c = document.createElement("canvas");
  c.width = Math.round(TERM_W * RES);
  c.height = Math.round(TERM_H * RES);
  const x = c.getContext("2d");
  x.scale(RES, RES);
  draw(x);
  return c;
}

export function createTerminal() {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(TERM_W * RES);
  canvas.height = Math.round(TERM_H * RES);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false; // the model's screen UVs are already 0..1 top-left
  texture.anisotropy = 4;

  // Background: deep phosphor black with a faint green vignette + window chrome.
  const bg = layer((ctx) => {
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, TERM_W, TERM_H);
    const v = ctx.createRadialGradient(TERM_W / 2, TERM_H / 2, TERM_H * 0.2, TERM_W / 2, TERM_H / 2, TERM_H * 0.95);
    v.addColorStop(0, "rgba(212,255,63,0.07)");
    v.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, TERM_W, TERM_H);
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, TERM_W, 64);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(40 + i * 34, 32, 11, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });
  });
  // CRT scanlines
  const scan = layer((ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let sy = 0; sy < TERM_H; sy += 4) ctx.fillRect(0, sy, TERM_W, 2);
  });

  return { canvas, ctx: canvas.getContext("2d"), texture, font: monoFamily(), bg, scan };
}

/**
 * @param {{ prompt: string, command: string, output: string[] }} script
 * @param {{ typed: number, lines: number, cursor: boolean }} s
 */
export function drawTerminal(term, script, s) {
  const { ctx, texture, font, bg, scan } = term;
  const W = TERM_W;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(bg, 0, 0);
  ctx.setTransform(RES, 0, 0, RES, 0, 0);

  // Window title
  ctx.fillStyle = "rgba(212,255,63,0.55)";
  ctx.font = `500 26px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("jair — zsh — 120×32", W / 2, 33);
  ctx.textAlign = "left";

  // Text with phosphor glow
  const size = 46;
  const lh = 74;
  let y = 150;
  ctx.font = `500 ${size}px ${font}`;
  ctx.shadowColor = GREEN;
  ctx.shadowBlur = 10; // in device px (not scaled by the transform)

  const line = (text, color = GREEN, x = 64) => {
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    y += lh;
  };

  line(script.banner, "rgba(212,255,63,0.6)");
  y += 10;

  // Prompt + typed command
  ctx.fillStyle = GREEN;
  ctx.fillText(script.prompt, 64, y);
  const px = 64 + ctx.measureText(script.prompt + " ").width;
  const typed = script.command.slice(0, s.typed);
  ctx.fillText(typed, px, y);
  let cursorX = px + ctx.measureText(typed).width;
  let cursorY = y;
  y += lh;

  // Output
  script.output.slice(0, s.lines).forEach(([label, value]) => {
    if (label) {
      ctx.fillStyle = "rgba(212,255,63,0.6)";
      ctx.fillText(label.padEnd(8, " "), 64, y);
      ctx.fillStyle = GREEN;
      ctx.fillText(value, 64 + ctx.measureText("        ").width, y);
    } else {
      ctx.fillStyle = GREEN;
      ctx.font = `700 ${size + 8}px ${font}`;
      ctx.fillText(value, 64, y);
      ctx.font = `500 ${size}px ${font}`;
    }
    y += lh;
  });

  // Final prompt once everything is printed
  if (s.lines >= script.output.length && s.typed >= script.command.length) {
    y += 6;
    ctx.fillStyle = GREEN;
    ctx.fillText(script.prompt, 64, y);
    cursorX = 64 + ctx.measureText(script.prompt + " ").width;
    cursorY = y;
  }

  // Block cursor
  if (s.cursor) {
    ctx.fillStyle = GREEN;
    ctx.fillRect(cursorX + 4, cursorY - size * 0.42, size * 0.58, size * 0.9);
  }
  ctx.shadowBlur = 0;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(scan, 0, 0);

  texture.needsUpdate = true;
}
