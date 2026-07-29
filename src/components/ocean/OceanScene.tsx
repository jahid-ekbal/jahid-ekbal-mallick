"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sea from "./Sea";
import FishSchool from "./Fish";

const OceanScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      gl={{ antialias: true }}
      className="h-full w-full">
      <Suspense fallback={null}>
        <Sea />
        <FishSchool />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0.1}
        />
      </Suspense>
    </Canvas>
  );
};

export default OceanScene;
