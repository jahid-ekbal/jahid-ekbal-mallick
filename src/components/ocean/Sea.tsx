"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BUBBLE_COUNT = 80;

interface BubbleData {
  positions: Float32Array;
  speeds: Float32Array;
}

const bubbleData: BubbleData = (() => {
  const pos = new Float32Array(BUBBLE_COUNT * 3);
  const spd = new Float32Array(BUBBLE_COUNT);
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 1] = Math.random() * 8 - 4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    spd[i] = 0.2 + Math.random() * 0.4;
  }
  return { positions: pos, speeds: spd };
})();

const Bubbles = () => {
  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      pos[i * 3 + 1] += bubbleData.speeds[i] * 0.01;
      pos[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      if (pos[i * 3 + 1] > 4) {
        pos[i * 3 + 1] = -4;
        pos[i * 3] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[bubbleData.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#88ccff"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const Caustics = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.02) * 0.05;
    meshRef.current.rotation.y = t * 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 1, 1]} />
      <meshBasicMaterial
        color="#4facfe"
        transparent
        opacity={0.06}
        depthWrite={false}
      />
    </mesh>
  );
};

const SeaFloor = () => {
  return (
    <mesh
      position={[0, -3.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#1a2a3a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

interface KelpPos {
  x: number;
  z: number;
}

const kelpPositions: KelpPos[] = (() => {
  const pts: KelpPos[] = [];
  for (let i = 0; i < 20; i++) {
    pts.push({
      x: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
    });
  }
  return pts;
})();

const Kelp = ({ x, z }: KelpPos) => {
  const stemRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!stemRef.current) return;
    stemRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.8 + x) * 0.1;
  });

  return (
    <group position={[x, -3.2, z]}>
      <mesh
        ref={stemRef}
        position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 1.2, 4]} />
        <meshStandardMaterial color="#1a5a3a" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial
          color="#2a7a4a"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

const KelpForest = () => {
  return (
    <>
      {kelpPositions.map((p, idx) => (
        <Kelp
          key={idx}
          x={p.x}
          z={p.z}
        />
      ))}
    </>
  );
};

const Sea = () => {
  return (
    <>
      <color
        attach="background"
        args={["#0a1628"]}
      />
      <fog
        attach="fog"
        args={["#0a1628", 8, 18]}
      />

      <ambientLight
        intensity={0.4}
        color="#4488cc"
      />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#88ddff"
      />

      <Caustics />
      <Bubbles />
      <SeaFloor />
      <KelpForest />
    </>
  );
};

export default Sea;
