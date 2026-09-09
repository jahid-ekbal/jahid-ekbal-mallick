"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { profile } from "@/components/profile";

const GLYPHS = ["<", ">", "{", "}", ";", "/", "=", "#", "(", ")", "[", "]"];
const TINTS = ["#38bdf8", "#22d3ee", "#818cf8"];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGlyphTexture(char: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "700 84px ui-monospace, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(char, 64, 70);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type GlyphSpec = {
  key: number;
  texture: number;
  tint: string;
  position: [number, number, number];
  scale: number;
  phase: number;
  speed: number;
  opacity: number;
};

function GlyphField({
  count,
  spreadX,
  spreadY,
}: {
  count: number;
  spreadX: number;
  spreadY: number;
}) {
  const group = useRef<THREE.Group>(null);
  const textures = useMemo(() => GLYPHS.map((g) => makeGlyphTexture(g)), []);

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  const sprites = useMemo<GlyphSpec[]>(() => {
    const random = mulberry32(count * 1000 + Math.round(spreadX * 10));
    const rand = (min: number, max: number) => min + random() * (max - min);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      texture: Math.floor(random() * GLYPHS.length),
      tint: TINTS[i % TINTS.length],
      position: [
        (random() - 0.5) * spreadX,
        (random() - 0.5) * spreadY,
        (random() - 0.5) * 6 - 1,
      ],
      scale: rand(0.32, 0.62),
      phase: random() * Math.PI * 2,
      speed: rand(0.3, 0.8),
      opacity: rand(0.35, 0.8),
    }));
  }, [count, spreadX, spreadY]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < g.children.length; i++) {
      const s = g.children[i] as THREE.Sprite;
      const baseY = s.userData.baseY as number;
      const phase = s.userData.phase as number;
      const speed = s.userData.speed as number;
      s.position.y = baseY + Math.sin(t * speed + phase) * 0.35;
    }
    g.rotation.y = Math.sin(t * 0.05) * 0.08;
  });

  return (
    <group ref={group}>
      {sprites.map((s) => (
        <sprite
          key={s.key}
          position={s.position}
          scale={[s.scale, s.scale, 1]}
          userData={{ baseY: s.position[1], phase: s.phase, speed: s.speed }}>
          <spriteMaterial
            map={textures[s.texture]}
            color={s.tint}
            transparent
            opacity={s.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function GridFloor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(
      44,
      44,
      new THREE.Color("#38bdf8"),
      new THREE.Color("#1e293b"),
    );
    const mat = g.material as THREE.Material;
    mat.transparent = true;
    mat.opacity = 0.28;
    return g;
  }, []);

  useEffect(() => {
    return () => {
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
    };
  }, [grid]);

  return (
    <primitive
      object={grid}
      position={[0, -3.4, -2]}
    />
  );
}

function Scene() {
  const width = useThree((s) => s.size.width);
  const narrow = width < 640;
  const wide = width >= 1024;

  return (
    <>
      <GlyphField
        count={narrow ? 200 : 320}
        spreadX={
          wide ? 17
          : narrow ?
            9
          : 13
        }
        spreadY={
          wide ? 10
          : narrow ?
            12
          : 10
        }
      />
      <GridFloor />
      <mesh
        position={
          wide ? [4.6, -0.9, -2]
          : narrow ?
            [2.4, 2.8, -3]
          : [3.6, -1.4, -2.4]
        }
        scale={narrow ? 0.65 : 1}>
        <torusGeometry args={[0.7, 0.16, 12, 40]} />
        <meshStandardMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={narrow ? 0.25 : 0.35}
        />
      </mesh>
    </>
  );
}

function HeroCanvas() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setEnabled(false);
      } else if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setEnabled(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent"
      />
    );
  }

  return (
    <Canvas
      aria-hidden
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute !inset-0">
      <ambientLight intensity={0.7} />
      <pointLight
        position={[4, 3, 4]}
        intensity={12}
      />
      <Scene />
    </Canvas>
  );
}

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0">
        <HeroCanvas />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]"
        />
      </div>
      <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center">
        <Image
          src="/images/profile.jpg"
          alt={`Portrait of ${profile.name}`}
          width={176}
          height={176}
          priority
          className="size-36 shrink-0 rounded-full border object-cover shadow-lg sm:size-44"
        />
        <div className="min-w-0">
          <p className="border-border bg-muted/50 text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Open to impactful projects
          </p>
          <h1 className="font-heading text-[2rem] leading-tight font-semibold tracking-tight sm:text-6xl">
            Hi, I am {profile.name}.
            <br />
            <span className="text-muted-foreground">{profile.headline}.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
            {profile.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              prefetch={false}
              href="/resume"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-all hover:opacity-80">
              Resume
            </Link>
            <Link
              prefetch={false}
              href="/projects"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-medium shadow-xs transition-all hover:bg-[var(--muted)]">
              View projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
