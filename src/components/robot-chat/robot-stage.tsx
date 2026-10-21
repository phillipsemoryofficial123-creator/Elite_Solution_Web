"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { RobotModel } from "./robot-model";
import type { RobotMood } from "./types";

type Props = {
  mood: RobotMood;
  reduced: boolean;
};

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function RobotStage({ mood, reduced }: Props) {
  const [ready] = useState(canUseWebGL);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!ready) {
    return (
      <div className={`rw-fallback is-${mood}`} aria-hidden="true">
        <span className="rw-fallback-glow" />
        <span className="rw-fallback-head">
          <i />
          <i />
        </span>
      </div>
    );
  }

  const mobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 720px)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);

  return (
    <Canvas
      className="rw-canvas"
      dpr={dpr}
      frameloop={hidden ? "never" : "always"}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.08, 3.15], fov: 30, near: 0.1, far: 20 }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        camera.lookAt(0, 0.02, 0);
      }}
    >
      <hemisphereLight args={["#d5e6ff", "#0b1526", 0.62]} />
      <directionalLight position={[2.2, 3.4, 4.2]} intensity={2.5} color="#f7fbff" />
      <directionalLight position={[-2.4, 1.4, -1.6]} intensity={0.85} color="#38DFFF" />
      <pointLight position={[0, -0.4, 1.6]} intensity={0.55} color="#168BFF" distance={5} />
      <RobotModel mood={mood} reduced={reduced} />
    </Canvas>
  );
}
