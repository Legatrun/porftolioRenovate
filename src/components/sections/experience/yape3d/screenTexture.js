import * as THREE from "three";

/*
  Draws the Yape app UI onto a <canvas> used as the iPhone screen texture.
  Redrawn whenever the balance / toast / button state changes.
*/

const W = 720;
const H = 1556; // matches the model's screen aspect (1.482 : 3.2)
const FONT = "'Space Grotesk', 'Inter', system-ui, sans-serif";

const fmt = (n) => `Bs ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function createScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  // The model's screen UVs only cover u 0.453–0.763 / v 0.149–0.790 (bottom → top):
  // stretch the canvas over exactly that window.
  const U0 = 0.4529, U1 = 0.7634, V0 = 0.1492, V1 = 0.7902;
  texture.repeat.set(1 / (U1 - U0), 1 / (V1 - V0));
  texture.offset.set(-U0 / (U1 - U0), -V0 / (V1 - V0));
  return { canvas, ctx: canvas.getContext("2d"), texture };
}

/**
 * @param {object} s  { role: "sender"|"receiver", balance, sending, toast (0..1), flash (0..1) }
 */
export function drawScreen({ ctx, texture }, s) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#9310bb");
  g.addColorStop(1, "#6a0588");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Status bar
  ctx.fillStyle = "#fff";
  ctx.font = `600 34px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText("9:41", 70, 82);
  for (let i = 0; i < 4; i++) ctx.fillRect(520 + i * 14, 92 - (i + 2) * 7, 9, (i + 2) * 7);
  roundRect(ctx, 590, 68, 58, 28, 8);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,.85)";
  ctx.stroke();
  ctx.fillRect(596, 74, 38, 16);

  // Header
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.font = `500 38px ${FONT}`;
  ctx.fillText(s.role === "sender" ? "Hi, Jair" : "Wallet", 70, 230);
  ctx.fillStyle = "#fff";
  ctx.font = `700 104px ${FONT}`;
  ctx.fillText("Yape", 66, 320);

  // Balance card
  roundRect(ctx, 56, 400, W - 112, 220, 44);
  ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.18 * (s.flash || 0)})`;
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.font = `500 34px ${FONT}`;
  ctx.fillText(s.role === "sender" ? "Your balance" : "Balance", 96, 460);
  ctx.fillStyle = s.flash ? `rgb(${255 - 239 * s.flash},${255 - 52 * s.flash},${255 - 75 * s.flash})` : "#fff";
  ctx.font = `700 76px ${FONT}`;
  ctx.fillText(fmt(Math.round(s.balance)), 94, 552);

  if (s.role === "sender") {
    // Contact
    ctx.beginPath();
    ctx.arc(126, 730, 54, 0, Math.PI * 2);
    ctx.fillStyle = "#10cbb4";
    ctx.fill();
    ctx.fillStyle = "#2a0335";
    ctx.font = `700 36px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("JM", 126, 732);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.font = `500 32px ${FONT}`;
    ctx.fillText("Send to", 206, 708);
    ctx.fillStyle = "#fff";
    ctx.font = `700 40px ${FONT}`;
    ctx.fillText("Jair M.", 206, 754);

    // Keypad-ish amount
    ctx.fillStyle = "#fff";
    ctx.font = `700 120px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("Bs 200", W / 2, 1010);
    ctx.textAlign = "left";

    // Button
    const press = s.sending ? 0.96 : 1;
    const bw = (W - 112) * press;
    roundRect(ctx, (W - bw) / 2, 1300, bw, 120, 60);
    ctx.fillStyle = "#10cbb4";
    ctx.fill();
    ctx.fillStyle = "#2a0335";
    ctx.font = `700 44px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(s.sending ? "Sending…" : "Yapear", W / 2, 1362);
    ctx.textAlign = "left";
  } else {
    // Toast
    if (s.toast > 0) {
      ctx.globalAlpha = s.toast;
      roundRect(ctx, 56, 660 - (1 - s.toast) * 30, W - 112, 110, 36);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.fillStyle = "#2a0335";
      ctx.font = `700 38px ${FONT}`;
      ctx.fillText("+ Bs 50.00 received", 96, 716 - (1 - s.toast) * 30);
      ctx.globalAlpha = 1;
    }
    // Recent movements
    ctx.font = `500 34px ${FONT}`;
    [["Payment", "+20.00"], ["Transfer", "+40.00"], ["Cashback", "+5.00"]].forEach(([k, v], i) => {
      const y = 880 + i * 96;
      ctx.beginPath();
      ctx.arc(100, y, 26, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.2)";
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.fillText(k, 148, y);
      ctx.textAlign = "right";
      ctx.fillText(v, W - 80, y);
      ctx.textAlign = "left";
    });
  }

  // Home indicator
  roundRect(ctx, W / 2 - 120, H - 50, 240, 12, 6);
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.fill();

  texture.needsUpdate = true;
}

/** Small "Bs 50" banknote texture for flying bills. */
export function createBillTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 512, 256);
  g.addColorStop(0, "#2fe3cb");
  g.addColorStop(1, "#079486");
  roundRect(x, 6, 6, 500, 244, 34);
  x.fillStyle = g;
  x.fill();
  x.lineWidth = 8;
  x.strokeStyle = "rgba(255,255,255,.85)";
  x.stroke();
  x.beginPath();
  x.arc(256, 128, 70, 0, Math.PI * 2);
  x.fillStyle = "rgba(255,255,255,.18)";
  x.fill();
  x.fillStyle = "#fff";
  x.font = `700 80px ${FONT}`;
  x.textBaseline = "middle";
  x.fillText("Bs", 40, 128);
  x.textAlign = "right";
  x.fillText("50", 472, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
