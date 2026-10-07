"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

import { profile } from "@/components/profile";
import Typewriter from "@/components/Typewriter";

const roleParts = profile.headline.split(/\s+and\s+/i);
const solidRole = (roleParts[0] ?? profile.headline).trim();
const outlineRole = (roleParts[1] ?? "").trim();

const deliveryGroup = profile.skills.find((group) =>
  group.category.toLowerCase().includes("delivery"),
);
const pillTop =
  deliveryGroup?.items.find((item) => item.toLowerCase().includes("ui")) ??
  "UI/UX";
const pillBottom = solidRole || "Full-Stack Developer";

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 via-amber-100/30 to-transparent dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent" />
        <div className="absolute top-[8%] right-[-12%] size-[34rem] rounded-full bg-[var(--hero-glow)] blur-3xl" />
        <div className="absolute bottom-[-25%] left-[-12%] size-[26rem] rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      <div
        className="absolute inset-0"
        aria-hidden>
        <span className="hero-drift absolute top-[22%] left-[46%] size-1.5 rounded-full bg-[var(--hero-accent)] motion-safe:animate-[hero-drift_7s_ease-in-out_infinite]" />
        <span className="hero-drift absolute top-[64%] left-[8%] size-1 rounded-full bg-[var(--hero-accent)]/70 motion-safe:animate-[hero-drift_9s_ease-in-out_infinite]" />
        <span className="hero-drift absolute right-[10%] bottom-[18%] size-2 rounded-full border border-[var(--hero-ring)] motion-safe:animate-[hero-drift_11s_ease-in-out_infinite]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-5xl gap-12 px-6 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="min-w-0">
          <p className="border-border bg-muted/50 text-muted-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Open to impactful projects
          </p>
          <p className="text-muted-foreground text-sm tracking-wide">Hi I am</p>
          <h1 className="mt-2">
            <span className="text-foreground block text-2xl font-semibold tracking-tight sm:text-3xl">
              {profile.name}
            </span>
            <span className="font-display mt-4 block text-6xl leading-[0.95] tracking-tight text-[var(--hero-accent)] uppercase sm:text-7xl xl:text-8xl">
              {solidRole}
            </span>
            {outlineRole && (
              <span className="font-display hero-outline mt-1 block text-6xl leading-[0.95] tracking-tight uppercase sm:text-7xl xl:text-8xl">
                {outlineRole}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
            {profile.tagline}
          </p>
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-lg">
            <MapPin size={18} /> {profile.location}
          </p>
          <p className="text-muted-foreground mt-2 text-lg">
            Currently into: <Typewriter />
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-[300px] sm:w-[360px] xl:w-[420px]">
          <div
            className="absolute inset-0 rounded-full bg-[var(--hero-glow)] blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -inset-5 rounded-full border border-dashed border-[var(--hero-ring)] sm:-inset-7"
            aria-hidden
          />
          <div
            className="hero-orbit absolute -inset-5 motion-safe:animate-[hero-orbit_18s_linear_infinite] sm:-inset-7"
            aria-hidden>
            <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--hero-accent)] shadow-[0_0_16px_var(--hero-glow)]" />
          </div>
          <Image
            src="/images/profile.jpg"
            alt={`Portrait of ${profile.name}`}
            width={480}
            height={480}
            priority
            className="relative size-full rounded-full border object-cover shadow-2xl"
          />
          <span className="border-border absolute top-8 -right-2 rounded-full border bg-[var(--background)]/85 px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur sm:-right-5">
            <span
              className="mr-1.5 inline-block size-1.5 rounded-full bg-[var(--hero-accent)]"
              aria-hidden
            />
            {pillTop}
          </span>
          <span className="border-border absolute bottom-8 -left-2 rounded-full border bg-[var(--background)]/85 px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur sm:-left-5">
            <span
              className="mr-1.5 inline-block size-1.5 rounded-full bg-[var(--hero-accent)]"
              aria-hidden
            />
            {pillBottom}
          </span>
        </div>
      </div>
    </section>
  );
}
