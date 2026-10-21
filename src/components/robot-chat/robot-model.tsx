"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RobotMood } from "./types";

type Props = {
  mood: RobotMood;
  reduced: boolean;
};

const metal = {
  color: "#121821",
  metalness: 0.74,
  roughness: 0.42,
} as const;

const shell = {
  color: "#090d14",
  metalness: 0.86,
  roughness: 0.28,
  clearcoat: 0.55,
  clearcoatRoughness: 0.38,
} as const;

function blinkAmount(time: number) {
  const cycle = 3.8;
  const local = time % cycle;
  const start = 3.28;
  const close = (from: number, dur: number) => {
    if (local < from || local > from + dur) return 1;
    const p = (local - from) / dur;
    const tri = p < 0.5 ? p * 2 : (1 - p) * 2;
    return 1 - tri * 0.9;
  };
  const primary = close(start, 0.14);
  const turn = Math.floor(time / cycle);
  if (turn % 4 === 0) return Math.min(primary, close(start + 0.22, 0.12));
  return primary;
}

function useGlowTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const glow = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    glow.addColorStop(0, "rgba(56,223,255,0.42)");
    glow.addColorStop(0.42, "rgba(22,139,255,0.14)");
    glow.addColorStop(1, "rgba(22,139,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 128, 128);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

export function RobotModel({ mood, reduced }: Props) {
  const rig = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Mesh>(null);
  const pupilR = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const tip = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMatL = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMatR = useRef<THREE.MeshStandardMaterial>(null);
  const mouth = useRef<(THREE.MeshStandardMaterial | null)[]>([
    null,
    null,
    null,
  ]);
  const moodRef = useRef(mood);
  const reducedRef = useRef(reduced);
  const glowMap = useGlowTexture();

  useEffect(() => {
    moodRef.current = mood;
    reducedRef.current = reduced;
  }, [mood, reduced]);

  useFrame((_, delta) => {
    const time = (rig.current?.userData.t as number | undefined) ?? 0;
    const t = time + delta;
    if (rig.current) rig.current.userData.t = t;

    const state = moodRef.current;
    const calm = reducedRef.current;

    const lift = calm ? 0 : Math.sin(t * 1.25) * 0.045 + Math.sin(t * 0.5) * 0.01;
    if (rig.current) {
      rig.current.position.x = 0;
      rig.current.position.y = lift;
      rig.current.rotation.set(0, 0, 0);
    }

    if (shadow.current) {
      const spread = 1 - lift * 3.2;
      shadow.current.scale.setScalar(THREE.MathUtils.clamp(spread, 0.78, 1.08));
      const material = shadow.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.34 - lift * 1.4;
    }

    if (head.current) {
      const thinkTilt = state === "think" ? 0.08 : 0;
      const sweep = calm ? 0 : Math.sin(t * 0.65) * 0.48;
      head.current.position.x = 0;
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, sweep, 4, delta);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, thinkTilt, 4, delta);
      head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, 0, 4, delta);
    }

    const lid = calm ? 1 : blinkAmount(t);
    if (eyeL.current) eyeL.current.scale.y = lid;
    if (eyeR.current) eyeR.current.scale.y = lid;

    const sweepNow = head.current ? head.current.rotation.y : 0;
    const px = sweepNow * 0.07;
    if (pupilL.current) {
      pupilL.current.position.set(-0.13 + px, 0.045, 0.455);
      pupilL.current.scale.y = lid;
    }
    if (pupilR.current) {
      pupilR.current.position.set(0.13 + px, 0.045, 0.455);
      pupilR.current.scale.y = lid;
    }

    const eyeGlow =
      state === "think"
        ? 1.1 + Math.sin(t * 7) * 0.7
        : state === "speak"
          ? 2.1
          : 1.55 + Math.sin(t * 1.6) * 0.15;
    if (eyeMatL.current) eyeMatL.current.emissiveIntensity = eyeGlow;
    if (eyeMatR.current) eyeMatR.current.emissiveIntensity = eyeGlow;

    if (antenna.current) {
      const speed = state === "think" ? 2.8 : 1.15;
      antenna.current.rotation.z = calm
        ? -0.28
        : -0.28 + Math.sin(t * speed) * (state === "think" ? 0.16 : 0.08);
    }
    if (tip.current) {
      tip.current.emissiveIntensity =
        state === "think" ? 1.2 + Math.sin(t * 8) * 0.8 : 1.35;
    }

    if (armL.current) {
      let z = -0.22;
      let x = 0.08;
      if (!calm && state === "greet") {
        z = -1.05 + Math.sin(t * 7.2) * 0.28;
        x = 0.42;
      } else if (!calm && state === "hover") {
        z = -0.62;
        x = 0.2;
      } else if (!calm) {
        z = -0.22 + Math.sin(t * 1.1) * 0.05;
      }
      armL.current.rotation.z = THREE.MathUtils.damp(armL.current.rotation.z, z, 6, delta);
      armL.current.rotation.x = THREE.MathUtils.damp(armL.current.rotation.x, x, 6, delta);
    }

    if (armR.current && !calm) {
      armR.current.rotation.z = 0.2 + Math.sin(t * 1.1 + 1) * 0.04;
    }

    if (core.current) {
      core.current.emissiveIntensity =
        state === "think"
          ? 0.7 + Math.sin(t * 8) * 0.55
          : state === "speak"
            ? 1.15 + Math.sin(t * 5) * 0.25
            : 0.55 + Math.sin(t * 1.8) * 0.12;
    }

    mouth.current.forEach((mat, index) => {
      if (!mat) return;
      if (calm) {
        mat.emissiveIntensity = index === 1 ? 0.45 : 0.16;
        return;
      }
      if (state === "speak") {
        mat.emissiveIntensity = 0.2 + Math.max(0, Math.sin(t * 11 - index * 0.8)) * 1.5;
      } else if (state === "think") {
        mat.emissiveIntensity = 0.15 + (0.5 + 0.5 * Math.sin(t * 6)) * 0.35;
      } else {
        mat.emissiveIntensity = index === 1 ? 0.4 : 0.14;
      }
    });
  });

  return (
    <group scale={0.84}>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0.02]}>
        <circleGeometry args={[0.46, 32]} />
        <meshBasicMaterial color="#02060e" transparent opacity={0.38} depthWrite={false} />
      </mesh>
      {glowMap ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.03, 0.02]}>
          <circleGeometry args={[0.62, 32]} />
          <meshBasicMaterial map={glowMap} transparent depthWrite={false} />
        </mesh>
      ) : null}

      <group ref={rig} position={[0, 0, 0]}>
        <mesh position={[-0.16, -0.7, 0.04]} scale={[1.05, 0.42, 1.25]}>
          <sphereGeometry args={[0.08, 14, 12]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.16, -0.7, 0.04]} scale={[1.05, 0.42, 1.25]}>
          <sphereGeometry args={[0.08, 14, 12]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[-0.16, -0.74, 0.08]}>
          <boxGeometry args={[0.1, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#071018"
            emissive="#168BFF"
            emissiveIntensity={0.45}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.16, -0.74, 0.08]}>
          <boxGeometry args={[0.1, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#071018"
            emissive="#168BFF"
            emissiveIntensity={0.45}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[-0.12, -0.52, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.12, -0.52, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshStandardMaterial {...metal} />
        </mesh>

        <mesh position={[0, -0.08, 0]} scale={[0.3, 0.3, 0.25]}>
          <sphereGeometry args={[1, 28, 22]} />
          <meshStandardMaterial color="#101722" metalness={0.7} roughness={0.46} />
        </mesh>
        <mesh position={[0, -0.04, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.028, 6]} />
          <meshStandardMaterial color="#14243A" metalness={0.62} roughness={0.38} />
        </mesh>
        <mesh position={[0, -0.04, 0.322]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.02, 6]} />
          <meshStandardMaterial
            ref={core}
            color="#071422"
            emissive="#38DFFF"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>

        <group ref={armL} position={[-0.34, 0.08, 0.02]}>
          <mesh>
            <sphereGeometry args={[0.078, 16, 12]} />
            <meshStandardMaterial color="#1a2436" metalness={0.72} roughness={0.38} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.046, 0.14, 4, 8]} />
            <meshStandardMaterial color="#1c2838" metalness={0.7} roughness={0.36} />
          </mesh>
          <mesh position={[0, -0.3, 0.02]}>
            <sphereGeometry args={[0.052, 12, 12]} />
            <meshStandardMaterial color="#101820" metalness={0.8} roughness={0.32} />
          </mesh>
          <mesh position={[0, -0.22, 0.05]}>
            <sphereGeometry args={[0.016, 10, 10]} />
            <meshStandardMaterial
              color="#071018"
              emissive="#38DFFF"
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
        </group>

        <group ref={armR} position={[0.34, 0.08, 0.02]} rotation={[0.08, 0, 0.18]}>
          <mesh>
            <sphereGeometry args={[0.078, 16, 12]} />
            <meshStandardMaterial color="#1a2436" metalness={0.72} roughness={0.38} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.046, 0.14, 4, 8]} />
            <meshStandardMaterial color="#1c2838" metalness={0.7} roughness={0.36} />
          </mesh>
          <mesh position={[0, -0.3, 0.02]}>
            <sphereGeometry args={[0.052, 12, 12]} />
            <meshStandardMaterial color="#101820" metalness={0.8} roughness={0.32} />
          </mesh>
        </group>

        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.1, 16]} />
          <meshStandardMaterial color="#0e1522" metalness={0.72} roughness={0.4} />
        </mesh>

        <group ref={head} position={[0, 0.66, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 40, 32]} />
            <meshPhysicalMaterial {...shell} />
          </mesh>
          <mesh position={[0, 0.02, 0.08]} scale={[0.86, 0.7, 0.46]}>
            <sphereGeometry args={[0.42, 28, 20]} />
            <meshStandardMaterial color="#050B16" metalness={0.35} roughness={0.22} />
          </mesh>
          <mesh rotation={[1.15, 0, 0]}>
            <torusGeometry args={[0.4, 0.008, 8, 48]} />
            <meshStandardMaterial
              color="#102033"
              emissive="#168BFF"
              emissiveIntensity={0.4}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[-0.46, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.1, 0.022, 10, 28]} />
            <meshStandardMaterial
              color="#121820"
              emissive="#168BFF"
              emissiveIntensity={0.55}
              metalness={0.8}
              roughness={0.3}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.46, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.1, 0.022, 10, 28]} />
            <meshStandardMaterial
              color="#121820"
              emissive="#168BFF"
              emissiveIntensity={0.55}
              metalness={0.8}
              roughness={0.3}
              toneMapped={false}
            />
          </mesh>

          <group ref={antenna} position={[0.18, 0.34, 0]}>
            <mesh position={[0.05, 0.14, 0]} rotation={[0, 0, -0.42]}>
              <cylinderGeometry args={[0.012, 0.014, 0.28, 8]} />
              <meshStandardMaterial color="#1a2434" metalness={0.82} roughness={0.28} />
            </mesh>
            <mesh position={[0.11, 0.28, 0]}>
              <sphereGeometry args={[0.034, 14, 14]} />
              <meshStandardMaterial
                ref={tip}
                color="#071422"
                emissive="#38DFFF"
                emissiveIntensity={1.3}
                toneMapped={false}
              />
            </mesh>
          </group>

          <group ref={eyeL} position={[-0.13, 0.045, 0.4]}>
            <mesh>
              <torusGeometry args={[0.072, 0.012, 8, 28]} />
              <meshStandardMaterial
                color="#061018"
                emissive="#168BFF"
                emissiveIntensity={1.05}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <sphereGeometry args={[0.048, 16, 16]} />
              <meshStandardMaterial
                ref={eyeMatL}
                color="#04121c"
                emissive="#38DFFF"
                emissiveIntensity={1.6}
                toneMapped={false}
              />
            </mesh>
          </group>
          <group ref={eyeR} position={[0.13, 0.045, 0.4]}>
            <mesh>
              <torusGeometry args={[0.072, 0.012, 8, 28]} />
              <meshStandardMaterial
                color="#061018"
                emissive="#168BFF"
                emissiveIntensity={1.05}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <sphereGeometry args={[0.048, 16, 16]} />
              <meshStandardMaterial
                ref={eyeMatR}
                color="#04121c"
                emissive="#38DFFF"
                emissiveIntensity={1.6}
                toneMapped={false}
              />
            </mesh>
          </group>
          <mesh ref={pupilL} position={[-0.13, 0.045, 0.455]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color="#f7feff" toneMapped={false} />
          </mesh>
          <mesh ref={pupilR} position={[0.13, 0.045, 0.455]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color="#f7feff" toneMapped={false} />
          </mesh>

          {[-0.055, 0, 0.055].map((x, index) => (
            <mesh key={x} position={[x, -0.14, 0.4]}>
              <boxGeometry args={[0.034, 0.016, 0.012]} />
              <meshStandardMaterial
                ref={(node) => {
                  mouth.current[index] = node;
                }}
                color="#071018"
                emissive="#38DFFF"
                emissiveIntensity={0.2}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
