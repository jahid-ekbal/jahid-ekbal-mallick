"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { profile } from "@/components/profile";
import Typewriter from "@/components/Typewriter";

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      <div
        className="absolute inset-0"
        aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(129,140,248,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start gap-8 px-6 py-14 sm:flex-row sm:items-center sm:py-16">
        <Image
          src="/images/profile.jpg"
          alt={`Portrait of ${profile.name}`}
          width={224}
          height={224}
          priority
          className="size-48 shrink-0 rounded-full border object-cover shadow-lg sm:size-56"
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
          <p className="text-muted-foreground mt-6 flex items-center gap-2 text-lg">
            <MapPin size={18} /> {profile.location}
          </p>
          <p className="text-muted-foreground mt-2 text-lg">
            Currently into: <Typewriter />
          </p>
        </div>
      </div>
    </section>
  );
}
