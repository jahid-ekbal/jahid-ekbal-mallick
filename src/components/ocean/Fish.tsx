"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FishProps {
  color: string;
  finColor: string;
  speed: number;
  radius: number;
  offset: number;
  heightOffset: number;
}

const Fish = ({
  color,
  finColor,
  speed,
  radius,
  offset,
  heightOffset,
}: FishProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);
  const topFinRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !tailRef.current || !bodyRef.current) return;

    const t = state.clock.elapsedTime * speed + offset;

    groupRef.current.position.x = Math.sin(t) * radius;
    groupRef.current.position.z = Math.cos(t) * radius;
    groupRef.current.position.y =
      Math.sin(t * 1.5) * 0.8 + Math.sin(t * 0.7) * 0.5 + heightOffset;
    groupRef.current.rotation.y = -t + Math.PI / 2;

    bodyRef.current.rotation.x = Math.sin(t * 2) * 0.15;
    bodyRef.current.rotation.z = Math.sin(t * 2.5) * 0.1;

    tailRef.current.rotation.y = Math.sin(t * 4) * 0.6;

    if (topFinRef.current) {
      topFinRef.current.rotation.z = Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={bodyRef}
        castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      <group
        ref={tailRef}
        position={[-0.65, 0, 0]}>
        <mesh
          position={[0, 0.25, 0]}
          rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshStandardMaterial
            color={finColor}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh
          position={[0, -0.25, 0]}
          rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshStandardMaterial
            color={finColor}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      <mesh
        ref={topFinRef}
        position={[0.1, 0.55, 0]}
        rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial
          color={finColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh
        position={[0.2, -0.35, 0.2]}
        rotation={[0.3, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial
          color={finColor}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh
        position={[0.2, -0.35, -0.2]}
        rotation={[-0.3, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial
          color={finColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      <group position={[0.45, 0.15, 0.35]}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      </group>
      <group position={[0.45, 0.15, -0.35]}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

interface FishConfig {
  color: string;
  finColor: string;
  speed: number;
  radius: number;
  offset: number;
  heightOffset: number;
}

const fishConfigs: FishConfig[] = [
  {
    color: "#00f2fe",
    finColor: "#4facfe",
    speed: 0.4,
    radius: 4,
    offset: 0,
    heightOffset: 0.5,
  },
  {
    color: "#4facfe",
    finColor: "#00f2fe",
    speed: 0.5,
    radius: 3.5,
    offset: 1.5,
    heightOffset: -0.3,
  },
  {
    color: "#f093fb",
    finColor: "#fa709a",
    speed: 0.45,
    radius: 3,
    offset: 3,
    heightOffset: 0.8,
  },
  {
    color: "#f5576c",
    finColor: "#f093fb",
    speed: 0.55,
    radius: 4.5,
    offset: 0.8,
    heightOffset: -0.5,
  },
  {
    color: "#43e97b",
    finColor: "#84fab0",
    speed: 0.35,
    radius: 3.8,
    offset: 2.5,
    heightOffset: 0.1,
  },
  {
    color: "#fa709a",
    finColor: "#f5576c",
    speed: 0.48,
    radius: 2.8,
    offset: 4,
    heightOffset: -0.7,
  },
];

const FishSchool = () => {
  return (
    <>
      {fishConfigs.map((config, idx) => (
        <Fish
          key={idx}
          {...config}
        />
      ))}
    </>
  );
};

export default FishSchool;
