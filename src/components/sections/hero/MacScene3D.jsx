"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createTerminal, drawTerminal } from "./terminalScreen";
import { useContextRecovery } from "@/lib/webgl";

export const MAC_URL = "/macbook.glb";
const LID_NODE = "RcexTyyhpuJYATQ_61";
const SCREEN_MATERIAL = "HlQwFCAPWzetDQy";
const LID_CLOSED = 1.97; // rad around the hinge (X axis)
const SCALE = 10; // model is ~0.31 units wide

// Timeline (seconds after `delay`)
const RISE = [0, 1.1];
const OPEN = [1.0, 2.4];
const POWER = [2.3, 2.8];
const TYPE_START = 3.0;
const CHAR = 0.07;
const LINE = 0.22;

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const seg = (t, [a, b]) => clamp01((t - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function useMac(term) {
  const { scene } = useGLTF(MAC_URL);
  return useMemo(() => {
    const model = scene.clone(true);
    model.updateMatrixWorld(true);

    // Centre the laptop on its base.
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -box.min.y, -center.z);
    model.updateMatrixWorld(true);

    // Re-parent the lid onto a hinge pivot so it can open/close.
    const lid = model.getObjectByName(LID_NODE);
    let hinge = null;
    if (lid) {
      const lb = new THREE.Box3().setFromObject(lid);
      hinge = new THREE.Group();
      hinge.position.set(0, lb.min.y, lb.max.z);
      model.add(hinge);
      hinge.updateMatrixWorld(true);
      hinge.attach(lid);
    }

    // Terminal on the display. `color` doubles as the power-on fade (no canvas redraws needed).
    const screen = new THREE.MeshBasicMaterial({ map: term.texture, toneMapped: false, color: 0x000000 });
    model.traverse((o) => {
      if (o.isMesh && o.material?.name === SCREEN_MATERIAL) o.material = screen;
    });

    const wrap = new THREE.Group();
    wrap.add(model);
    wrap.scale.setScalar(SCALE);
    return { root: wrap, hinge, screen };
  }, [scene, term]);
}

function Scene({ script, delay, reduce, onReady }) {
  const term = useMemo(() => createTerminal(), []);
  const { root, hinge, screen } = useMac(term);
  const hingeRef = useRef(null);
  useEffect(() => {
    hingeRef.current = hinge;
  }, [hinge]);
  const group = useRef();
  const glow = useRef();
  const { clock, size, invalidate } = useThree();
  const st = useRef({ t0: null, key: "" });
  const introEnd = TYPE_START + script.command.length * CHAR + 0.35 + script.output.length * LINE;

  useEffect(() => {
    drawTerminal(term, script, { typed: 0, lines: 0, cursor: false });
    onReady?.();
  }, [term, script, onReady]);

  // On-demand rendering: after the intro only the mouse and the cursor blink (2 fps) trigger frames.
  useEffect(() => {
    const onMove = () => invalidate();
    window.addEventListener("pointermove", onMove, { passive: true });
    const blink = setInterval(invalidate, 500);
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(blink);
    };
  }, [invalidate]);

  useFrame((state, dt) => {
    const s = st.current;
    if (s.t0 === null) s.t0 = clock.elapsedTime + delay;
    const t = reduce ? 99 : clock.elapsedTime - s.t0;
    const g = group.current;
    if (!g) return;

    // Rise (closed) → open lid → power on → type.
    const r = easeOut(seg(t, RISE));
    const open = easeInOut(seg(t, OPEN));
    const power = seg(t, POWER);
    g.visible = t > 0;
    g.scale.setScalar(Math.min(1, size.width / size.height / 1.45)); // shrink on portrait screens
    g.position.y = THREE.MathUtils.lerp(-3.2, -0.75, r);
    const rx = 0.18 + (reduce ? 0 : state.pointer.y * -0.04) + (1 - r) * 0.25;
    const ry = (reduce ? 0 : state.pointer.x * 0.1) + (1 - r) * -0.3;
    const d = Math.min(dt, 0.05);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx, 4, d);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ry, 4, d);
    if (hingeRef.current) hingeRef.current.rotation.x = LID_CLOSED * (1 - open);
    if (glow.current) glow.current.intensity = power;
    screen.color.setScalar(power);

    // Keep rendering only while something is still moving.
    const settling = Math.abs(g.rotation.x - rx) + Math.abs(g.rotation.y - ry) > 0.0005;
    if (t < introEnd || settling) invalidate();

    // Terminal state
    const tt = t - TYPE_START;
    const typed = Math.max(0, Math.min(script.command.length, Math.floor(tt / CHAR)));
    const typedDone = TYPE_START + script.command.length * CHAR + 0.35;
    const lines = Math.max(0, Math.min(script.output.length, Math.floor((t - typedDone) / LINE) + 1));
    const cursor = Math.floor(clock.elapsedTime * 2) % 2 === 0;
    const key = `${typed}|${t > typedDone ? lines : 0}|${cursor}`;
    if (key !== s.key) {
      s.key = key;
      drawTerminal(term, script, { typed, lines: t > typedDone ? lines : 0, cursor });
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 5]} intensity={1.4} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 3]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#d4ff3f" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#f2f2f2" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      </Environment>
      <group ref={group} visible={false}>
        <primitive object={root} />
        {/* green spill from the screen onto the keyboard */}
        <pointLight ref={glow} position={[0, 1.1, 0.15]} color="#d4ff3f" intensity={0} distance={2.6} decay={2} />
      </group>
    </>
  );
}

export default function MacScene3D({ script, delay = 0.8, reduce = false, running = true, onReady, onFail }) {
  const { key, onCreated } = useContextRecovery(onFail);
  return (
    <Canvas
      key={key}
      frameloop={running ? "demand" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.9, 6.2], fov: 32 }}
      onCreated={(state) => {
        state.camera.lookAt(0, 0.05, 0);
        onCreated(state);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Scene script={script} delay={delay} reduce={reduce} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MAC_URL);
