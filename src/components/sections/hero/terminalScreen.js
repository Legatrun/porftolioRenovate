import * as THREE from "three";

/*
  Draws a phosphor-green terminal onto a <canvas> used as the MacBook screen texture.
  `progress` drives the typing; `power` (0..1) fades the screen on.
*/

export const TERM_W = 1536;
export const TERM_H = 960;
const GREEN = "#39ff14";

function monoFamily() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
  return v ? `${v}, ui-monospace, monospace` : "ui-monospace, SFMono-Regular, Menlo, monospace";
}

export function createTerminal() {
  const canvas = document.createElement("canvas");
  canvas.width = TERM_W;
  canvas.height = TERM_H;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false; // the model's screen UVs are already 0..1 top-left
  texture.anisotropy = 8;
  return { canvas, ctx: canvas.getContext("2d"), texture, font: monoFamily() };
}

/**
 * @param {{ prompt: string, command: string, output: string[] }} script
 * @param {{ typed: number, lines: number, cursor: boolean, power: number }} s
 */
export function drawTerminal(term, script, s) {
  const { ctx, texture, font } = term;
  const W = TERM_W;
  const H = TERM_H;

  // Background: deep phosphor black with a faint green vignette.
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#010601";
  ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(57,255,20,0.07)");
  v.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  // Window chrome
  ctx.fillStyle = "#0b140b";
  ctx.fillRect(0, 0, W, 64);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(40 + i * 34, 32, 11, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  });
  ctx.fillStyle = "rgba(57,255,20,0.55)";
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
  ctx.shadowBlur = 16;

  const line = (text, color = GREEN, x = 64) => {
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    y += lh;
  };

  line(script.banner, "rgba(57,255,20,0.6)");
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
      ctx.fillStyle = "rgba(57,255,20,0.6)";
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

  // CRT scanlines
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);

  // Power-on fade
  if (s.power < 1) {
    ctx.fillStyle = `rgba(0,0,0,${1 - s.power})`;
    ctx.fillRect(0, 0, W, H);
    // Horizontal "CRT on" line
    if (s.power > 0 && s.power < 0.6) {
      ctx.fillStyle = `rgba(57,255,20,${0.8 - s.power})`;
      ctx.fillRect(0, H / 2 - 3, W, 6);
    }
  }

  texture.needsUpdate = true;
}
