"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createBillTexture, createScreen, drawScreen } from "./screenTexture";

export const MODEL_URL = "/iphone_15_pro_max.glb";

const PHONE_X = 1.25;
const PHONE_SCALE = 0.7; // model is 3.31 units tall → ~2.3
const CAM_Z = 8.2;
const FOV = 30;
const VIEW_H = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2)); // world height visible at z = 0
const FACING = 0.42; // rad each phone turns toward the other
const ENTER = 1.6; // s slide-in per phone
const FLIGHT = 1.15; // s per bill / coin
const STAGGER = 0.32;
const BATCH = 4;
const LOOP = 5.6;
const AMOUNT = 50;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const damp = (cur, target, lambda, dt) => THREE.MathUtils.damp(cur, target, lambda, dt);

// Flight curve between the tops of the two phones.
const CURVE = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(-PHONE_X, 1.2, 0.25),
  new THREE.Vector3(0, 2.5, 1.5),
  new THREE.Vector3(PHONE_X, 1.2, 0.25)
);

/** One iPhone: cloned glTF with its own live canvas screen. */
function usePhone(screen) {
  const { scene } = useGLTF(MODEL_URL);
  return useMemo(() => {
    const model = scene.clone(true);
    model.traverse((o) => {
      if (!o.isMesh) return;
      if (o.material?.name === "Material.006") {
        o.material = new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false });
      }
    });
    const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
    model.position.sub(center);
    const wrap = new THREE.Group();
    wrap.add(model);
    wrap.rotation.y = -Math.PI / 2; // model's screen faces +X → turn it to the camera
    wrap.scale.setScalar(PHONE_SCALE);
    return wrap;
  }, [scene, screen]);
}

function Scene({ active, reduce, onReady, focusX }) {
  const { camera, clock, size } = useThree();
  const stageRef = useRef();
  const senderScreen = useMemo(() => createScreen(), []);
  const receiverScreen = useMemo(() => createScreen(), []);
  const left = usePhone(senderScreen);
  const right = usePhone(receiverScreen);
  const leftRef = useRef();
  const rightRef = useRef();
  const pool = useRef([]);
  const billTex = useMemo(() => createBillTexture(), []);

  const st = useRef({
    start: null,
    nextSend: null,
    items: [],
    sender: { balance: 2450, shown: 2450, sending: false },
    receiver: { balance: 1200, shown: 1200, toast: 0, flash: 0 },
    cam: { x: 0, z: CAM_Z, ly: 0.15 },
    drawn: {},
  });

  useEffect(() => {
    drawScreen(senderScreen, { role: "sender", balance: 2450 });
    drawScreen(receiverScreen, { role: "receiver", balance: 1200, toast: 0 });
    onReady?.();
  }, [senderScreen, receiverScreen, onReady]);

  const send = (now) => {
    const s = st.current;
    if (s.items.length) return;
    for (let i = 0; i < BATCH; i++) s.items.push({ start: now + i * STAGGER, kind: i % 2 ? "coin" : "bill", slot: i, launched: false });
  };

  useEffect(() => {
    const s = st.current;
    if (active && s.start === null) s.start = -1; // resolved on next frame (clock time)
    if (!active) s.nextSend = null;
    else if (s.start !== null && s.start >= 0) s.nextSend = -1;
  }, [active]);

  useFrame((state, dt) => {
    const s = st.current;
    const t = state.clock.elapsedTime;
    if (s.start === -1) {
      s.start = t;
      s.nextSend = t + (reduce ? 0.3 : 2.3);
    }
    if (s.nextSend === -1) s.nextSend = t + 0.6;

    // ---- Stage framing: focal point at `focusX` of the canvas width; shrink to fit narrow canvases.
    const viewW = VIEW_H * (size.width / size.height);
    const fit = Math.min(1, viewW / 4.4);
    const stageX = viewW * focusX;
    if (stageRef.current) {
      stageRef.current.position.x = stageX;
      stageRef.current.scale.setScalar(fit);
    }

    // ---- Entrance: each phone slides in from its own edge of the screen (spin + bank), then floats.
    const phones = [
      [leftRef.current, -1, 0],
      [rightRef.current, 1, 0.12],
    ];
    for (const [g, side, delay] of phones) {
      if (!g) continue;
      const e = s.start === null ? 0 : reduce ? 1 : clamp01((t - s.start - delay) / ENTER);
      const k = easeOutBack(e);
      const from = (side * (viewW / 2 + 1.8) - stageX) / fit; // just outside the canvas edge, in stage space
      const float = Math.sin(t * 1.1 + side) * 0.05 * Math.min(1, e * 2);
      g.position.set(THREE.MathUtils.lerp(from, side * PHONE_X, k), Math.sin(Math.PI * e) * 0.35 + float, Math.sin(Math.PI * e) * 0.8);
      g.rotation.y = -side * FACING + (1 - easeOut(e)) * Math.PI * 0.9 * side;
      g.rotation.z = (1 - easeOut(e)) * -0.35 * side + Math.sin(t * 0.9 + side) * 0.015;
      g.visible = e > 0;
    }

    // ---- Transfer loop
    if (active && s.nextSend !== null && s.nextSend > 0 && t >= s.nextSend) {
      send(t);
      s.nextSend = t + LOOP;
    }

    let focus = null;
    s.items = s.items.filter((it) => {
      const mesh = pool.current[it.slot];
      const p = (t - it.start) / (reduce ? 0.01 : FLIGHT);
      if (p < 0) return true;
      if (!it.launched) {
        it.launched = true;
        s.sender.balance -= AMOUNT;
        s.sender.sending = true;
      }
      if (p >= 1) {
        if (mesh) mesh.visible = false;
        s.receiver.balance += AMOUNT;
        s.receiver.toast = 1;
        s.receiver.flash = 1;
        return false;
      }
      focus = focus === null ? p : (focus + p) / 2;
      if (mesh) {
        const q = easeInOut(p);
        CURVE.getPoint(q, mesh.position);
        const sc = Math.sin(Math.PI * p) * 0.75 + 0.25;
        mesh.scale.setScalar(sc);
        mesh.visible = true;
        if (it.kind === "coin") {
          mesh.rotation.set(t * 8, 0.4, 0); // tumbling coin flip
        } else {
          mesh.rotation.set(-0.2, Math.sin(p * Math.PI) * 0.6, (p - 0.5) * 0.9);
        }
      }
      return true;
    });
    if (!s.items.length) s.sender.sending = false;

    // ---- Live screens (redraw only when something visible changed)
    s.sender.shown = damp(s.sender.shown, s.sender.balance, 6, dt);
    s.receiver.shown = damp(s.receiver.shown, s.receiver.balance, 6, dt);
    s.receiver.toast = Math.max(0, s.receiver.toast - dt / 1.6);
    s.receiver.flash = Math.max(0, s.receiver.flash - dt / 0.5);
    const sk = `${Math.round(s.sender.shown)}|${s.sender.sending}`;
    if (s.drawn.sender !== sk) {
      s.drawn.sender = sk;
      drawScreen(senderScreen, { role: "sender", balance: s.sender.shown, sending: s.sender.sending });
    }
    const rk = `${Math.round(s.receiver.shown)}|${s.receiver.toast.toFixed(2)}|${s.receiver.flash.toFixed(2)}`;
    if (s.drawn.receiver !== rk) {
      s.drawn.receiver = rk;
      drawScreen(receiverScreen, { role: "receiver", balance: s.receiver.shown, toast: Math.min(1, s.receiver.toast * 2), flash: s.receiver.flash });
    }

    // ---- Focal camera: follow the money, dolly in, then release. Pointer adds parallax.
    const tracking = focus !== null && !reduce;
    const tx = (tracking ? THREE.MathUtils.lerp(-0.35, 0.35, focus) * fit : 0) + (reduce ? 0 : state.pointer.x * 0.25);
    const tz = tracking ? CAM_Z - 0.2 : CAM_Z;
    const ly = tracking ? 0.45 : 0.15;
    s.cam.x = damp(s.cam.x, tx, 3, dt);
    s.cam.z = damp(s.cam.z, tz, 2.5, dt);
    s.cam.ly = damp(s.cam.ly, ly, 2.5, dt);
    camera.position.set(s.cam.x, 0.15 + (reduce ? 0 : state.pointer.y * 0.2), s.cam.z);
    camera.lookAt(s.cam.x, s.cam.ly, 0);

  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 6]} intensity={1.6} />
      <pointLight position={[-4, 2, -2]} intensity={40} color="#10cbb4" />
      <pointLight position={[4, -1, -2]} intensity={40} color="#ff3dc8" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#10cbb4" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#c13cff" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>

      <group ref={stageRef}>
      <group
        ref={leftRef}
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          send(clock.elapsedTime);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <primitive object={left} />
      </group>
      <group ref={rightRef} visible={false}>
        <primitive object={right} />
      </group>

      {/* Bill / coin pool */}
      {Array.from({ length: BATCH }, (_, i) => (
        <mesh key={i} ref={(m) => (pool.current[i] = m)} visible={false}>
          {i % 2 ? <cylinderGeometry args={[0.17, 0.17, 0.035, 40]} /> : <planeGeometry args={[0.62, 0.31]} />}
          {i % 2 ? (
            <meshStandardMaterial color="#10cbb4" metalness={0.85} roughness={0.25} emissive="#0a6f63" emissiveIntensity={0.4} />
          ) : (
            <meshBasicMaterial map={billTex} side={THREE.DoubleSide} toneMapped={false} />
          )}
        </mesh>
      ))}
      </group>
    </>
  );
}

export default function YapePhones3D({ active, running, reduce, onReady, focusX = 0, eventSource }) {
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.15, CAM_Z], fov: FOV }}
      style={{ position: "absolute", inset: 0 }}
      eventSource={eventSource}
      eventPrefix={eventSource ? "client" : "offset"}
    >
      <Suspense fallback={null}>
        <Scene active={active} reduce={reduce} onReady={onReady} focusX={focusX} />
      </Suspense>
    </Canvas>
  );
}

