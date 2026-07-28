# IMPLEMENTATION.md - Portfolio Website Step-by-Step Build Guide

This guide provides a comprehensive, production-ready, step-by-step implementation blueprint for building **Jahid Ekbal Mallick's** personal portfolio and brand hub for **REGIX**.

It incorporates:

- **Framework:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **UI Components & Animations:** [React Bits](https://reactbits.dev) (BlurText, ShinyText, DecryptedText, Magnet, SpotlightCard, TiltedCard, Particles, VariableProximity, TrueFocus)
- **Iconography:** Lucide Icons (`lucide-react`)
- **UI System:** shadcn/ui + Glassmorphism aesthetic

---

## 1. Prerequisites & Tech Stack Summary

| Layer                       | Technology / Library                                | Usage                                        |
| --------------------------- | --------------------------------------------------- | -------------------------------------------- |
| **Framework**               | Next.js 14 (App Router)                             | SSR/SSG, Routing, Optimization               |
| **Language**                | TypeScript                                          | Strict type safety                           |
| **Styling**                 | Tailwind CSS + CSS Modules                          | Glassmorphism, animations, responsive design |
| **Component Kit**           | shadcn/ui + Radix UI                                | Accessible primitives                        |
| **Special FX / Animations** | [React Bits](https://reactbits.dev) + Framer Motion | High-performance interactive UI effects      |
| **Icons**                   | Lucide React (`lucide-react`)                       | Clean, modern vector iconography             |
| **Deployment**              | Netlify / Vercel                                    | Production edge hosting                      |

---

## 2. Step 1: Project Initialization & Dependency Setup

Run the following commands in your terminal to initialize the project directory:

```bash
# 1. Create Next.js app with TypeScript, Tailwind, App Router
npx create-next-app@latest regix-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# 2. Change into project directory
cd regix-portfolio

# 3. Install core UI & animation dependencies
npm install lucide-react framer-motion clsx tailwind-merge canvas-confetti
npm install -D @types/canvas-confetti

# 4. Initialize shadcn/ui
npx shadcn-ui@latest init
```

_When prompted by `shadcn init`, choose:_

- Style: `Default`
- Base Color: `Slate`
- CSS Variables: `Yes`

---

## 3. Step 2: Configuration Files & Utilities

### A. Helper Function (`src/lib/utils.ts`)

Ensure your class merging utility is configured:

```typescript
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### B. Tailwind CSS Configuration (`tailwind.config.ts`)

Update `tailwind.config.ts` to support glassmorphism, glowing borders, custom keyframes, and dark theme defaults:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        foreground: "#f8fafc",
        card: "rgba(15, 23, 42, 0.6)",
        brand: {
          50: "#ecfeff",
          100: "#cff wash",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          cyan: "#00f2fe",
          purple: "#4facfe",
        },
      },
      backdropBlur: {
        xs: "2px",
        md: "12px",
        xl: "24px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-spin": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. Step 3: Integrating React Bits Components

Extract and add the following [React Bits](https://reactbits.dev) interactive components under `src/components/reactbits/`:

### A. `BlurText.tsx` (`src/components/reactbits/BlurText.tsx`)

_Animates text revealing with a blur effect._

```tsx
"use client";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText = ({
  text,
  className = "",
  delay = 0.05,
}: BlurTextProps) => {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 15 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * delay }}
          className="mr-[0.25em] inline-block">
          {word}
        </motion.span>
      ))}
    </span>
  );
};
```

### B. `ShinyText.tsx` (`src/components/reactbits/ShinyText.tsx`)

_Gives a metallic, animated gradient sweep to headers and badges._

```tsx
"use client";
import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-[linear-gradient(120deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.4)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent ${
        !disabled ? "animate-shiny" : ""
      } ${className}`}
      style={{ animationDuration }}>
      {text}
    </span>
  );
};
```

### C. `SpotlightCard.tsx` (`src/components/reactbits/SpotlightCard.tsx`)

_Interactive card with a radial cursor spotlight glow._

```tsx
"use client";
import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(6, 182, 212, 0.15)",
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-colors duration-300 ${className}`}
      {...props}>
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

### D. `Magnet.tsx` (`src/components/reactbits/Magnet.tsx`)

_Magnetic pull effect for buttons and call-to-action elements._

```tsx
"use client";
import React, { useRef, useState } from "react";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !magnetRef.current) return;
    const { left, top, width, height } =
      magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < padding && distY < padding) {
      setPosition({
        x: (e.clientX - centerX) * 0.3,
        y: (e.clientY - centerY) * 0.3,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={magnetRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
        transition: "transform 0.15s ease-out",
      }}
      className="inline-block">
      {children}
    </div>
  );
};
```

---

## 5. Step 4: Centralized Data File (`src/data/portfolioData.ts`)

Store Jahid's core personal profile, doc links, social media handles, and projects in a structured TypeScript data file:

```typescript
export const PORTFOLIO_DATA = {
  personal: {
    fullName: "Jahid Ekbal Mallick",
    nickname: "Jahid",
    role: "Founder, CEO & Lead Engineer",
    company: "REGIX",
    location: "Kolkata, West Bengal, India",
    education: "Diploma in Computer Science & Technology (CST / IT)",
    bio: "Self-taught software and systems engineer passionate about full-stack web applications, desktop optimization, IoT automation, and building scalable tech products.",
    oneYearGoal: "Build REGIX into an international technology brand.",
  },
  socialLinks: [
    {
      name: "GitHub",
      handle: "jahid-ekbal",
      url: "https://github.com/jahid-ekbal",
      icon: "Github",
    },
    {
      name: "LinkedIn",
      handle: "jahid-developer",
      url: "https://www.linkedin.com/in/jahid-developer",
      icon: "Linkedin",
    },
    {
      name: "Facebook",
      handle: "jahid.developer",
      url: "https://facebook.com/jahid.developer",
      icon: "Facebook",
    },
    {
      name: "Instagram",
      handle: "jahid.developer",
      url: "https://instagram.com/jahid.developer",
      icon: "Instagram",
    },
    {
      name: "YouTube",
      handle: "GURU ESPORTS",
      url: "https://youtube.com/@GURU_ESPORTS",
      icon: "Youtube",
    },
    {
      name: "EKBAL STUDIO",
      handle: "Brand Platform",
      url: "https://ekbal-studio.netlify.app/",
      icon: "Globe",
    },
  ],
  techStack: [
    {
      name: "HTML5",
      category: "Frontend",
      docUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
      name: "CSS3",
      category: "Frontend",
      docUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
      name: "JavaScript",
      category: "Frontend",
      docUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "TypeScript",
      category: "Frontend",
      docUrl: "https://www.typescriptlang.org/docs/",
    },
    { name: "React", category: "Frontend", docUrl: "https://react.dev/" },
    {
      name: "Next.js",
      category: "Frontend",
      docUrl: "https://nextjs.org/docs",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      docUrl: "https://tailwindcss.com/docs",
    },
    {
      name: "shadcn/ui",
      category: "Frontend",
      docUrl: "https://ui.shadcn.com/docs",
    },
    {
      name: "Node.js",
      category: "Backend",
      docUrl: "https://nodejs.org/en/docs",
    },
    {
      name: "C# (.NET / WinForms)",
      category: "Systems",
      docUrl: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    },
    {
      name: "C++",
      category: "Systems",
      docUrl: "https://en.cppreference.com/w/",
    },
    {
      name: "Discord.js",
      category: "Backend",
      docUrl: "https://discord.js.org/",
    },
    {
      name: "ESP8266 / NodeMCU",
      category: "IoT Hardware",
      docUrl: "https://docs.arduino.cc/",
    },
    {
      name: "Netlify",
      category: "DevOps",
      docUrl: "https://docs.netlify.app/",
    },
  ],
  projects: [
    {
      title: "REGIX AI & Discord Platform",
      description:
        "Custom AI-integrated Discord bot platform providing moderation, server automation, and smart response workflows.",
      tags: ["Node.js", "Discord.js", "JSON Engine"],
      icon: "Bot",
      link: "https://github.com/jahid-ekbal",
    },
    {
      title: "Smart Home AC Controller",
      description:
        "Hardware IoT automation project utilizing NodeMCU V3 (ESP8266) and relay switches to control high-power AC appliances over Wi-Fi.",
      tags: ["NodeMCU V3", "C++", "IoT Hardware"],
      icon: "Cpu",
      link: "https://github.com/jahid-ekbal",
    },
    {
      title: "Windows System Optimizer",
      description:
        "High-performance desktop utility application designed using C# WinForms, Guna2 UI, and low-level C++ DLL optimization routines.",
      tags: ["C#", "WinForms", "C++ DLL", "Guna2 UI"],
      icon: "Monitor",
      link: "https://github.com/jahid-ekbal",
    },
    {
      title: "REGIX Brand Platform",
      description:
        "Official web application for REGIX featuring iOS-inspired glassmorphism design and responsive layout.",
      tags: ["React", "Next.js", "Tailwind CSS"],
      icon: "Layout",
      link: "https://ekbal-studio.netlify.app/",
    },
  ],
};
```

---

## 6. Step 5: Building Core Components & Pages

### A. Navigation Bar (`src/components/Navbar.tsx`)

Uses **Lucide Icons** (`Home`, `User`, `Code2`, `Briefcase`, `Mail`, `Sparkles`) in a floating glass bar:

```tsx
"use client";
import Link from "next/link";
import { Home, User, Code2, Briefcase, Mail, Sparkles } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-6 rounded-full border border-slate-700/60 bg-slate-900/70 px-6 py-3 shadow-2xl backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-cyan-400">
          <Sparkles className="h-5 w-5 animate-pulse text-cyan-400" />
          <span>REGIX</span>
        </Link>
        <div className="h-4 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-5 text-sm text-slate-300">
          <Link
            href="#hero"
            className="flex items-center gap-1 transition hover:text-cyan-400">
            <Home className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="#about"
            className="flex items-center gap-1 transition hover:text-cyan-400">
            <User className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">About</span>
          </Link>
          <Link
            href="#skills"
            className="flex items-center gap-1 transition hover:text-cyan-400">
            <Code2 className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Skills</span>
          </Link>
          <Link
            href="#projects"
            className="flex items-center gap-1 transition hover:text-cyan-400">
            <Briefcase className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-1 transition hover:text-cyan-400">
            <Mail className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Contact</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};
```

### B. Hero Section (`src/components/HeroSection.tsx`)

Combines React Bits (`BlurText`, `ShinyText`, `Magnet`) with **Lucide Icons** (`Terminal`, `MapPin`, `ArrowRight`, `ExternalLink`):

```tsx
"use client";
import { BlurText } from "@/components/reactbits/BlurText";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { Magnet } from "@/components/reactbits/Magnet";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Terminal, MapPin, ArrowRight, ExternalLink } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12 text-center">
      {/* Location Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-md">
        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
        <span>{PORTFOLIO_DATA.personal.location}</span>
      </div>

      {/* Main Title */}
      <h1 className="mb-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-100 sm:text-6xl md:text-7xl">
        <BlurText text={`Hi, I'm ${PORTFOLIO_DATA.personal.fullName}`} />
      </h1>

      {/* Role Subtitle with Shiny Text */}
      <div className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-slate-300 sm:text-2xl">
        <Terminal className="h-6 w-6 text-cyan-400" />
        <ShinyText
          text={`${PORTFOLIO_DATA.personal.role} @ ${PORTFOLIO_DATA.personal.company}`}
          speed={4}
        />
      </div>

      {/* Bio Description */}
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        {PORTFOLIO_DATA.personal.bio}
      </p>

      {/* Magnetic CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Magnet>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400">
            <span>Explore Work</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </Magnet>

        <Magnet>
          <a
            href="https://ekbal-studio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500">
            <span>REGIX Studio</span>
            <ExternalLink className="h-4 w-4 text-cyan-400" />
          </a>
        </Magnet>
      </div>
    </section>
  );
};
```

### C. Skills & Doc Links Section (`src/components/SkillsSection.tsx`)

Uses React Bits `SpotlightCard` and Lucide icons (`Code2`, `Server`, `Cpu`, `Globe`, `Wrench`, `BookOpen`):

```tsx
"use client";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Code2, BookOpen, ExternalLink } from "lucide-react";

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2 inline-flex items-center gap-2 font-mono text-sm tracking-wider text-cyan-400 uppercase">
          <Code2 className="h-4 w-4" /> Technical Stack
        </div>
        <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">
          Languages & Frameworks
        </h2>
        <p className="mt-2 text-slate-400">
          All skills paired with official documentation links for easy
          reference.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {PORTFOLIO_DATA.techStack.map((tech, index) => (
          <SpotlightCard
            key={index}
            className="flex h-36 flex-col justify-between">
            <div>
              <span className="font-mono text-xs tracking-wide text-cyan-400 uppercase">
                {tech.category}
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-100">
                {tech.name}
              </h3>
            </div>
            <a
              href={tech.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-cyan-300">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Official Docs</span>
              <ExternalLink className="ml-auto h-3 w-3 opacity-70" />
            </a>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};
```

### D. Projects Section (`src/components/ProjectsSection.tsx`)

Displays projects inside React Bits `SpotlightCard` with icons (`Bot`, `Cpu`, `Monitor`, `Layout`, `Github`, `ExternalLink`):

```tsx
"use client";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  Bot,
  Cpu,
  Monitor,
  Layout,
  Github,
  ExternalLink,
  Briefcase,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Bot,
  Cpu,
  Monitor,
  Layout,
};

export const ProjectsSection = () => {
  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2 inline-flex items-center gap-2 font-mono text-sm tracking-wider text-cyan-400 uppercase">
          <Briefcase className="h-4 w-4" /> Engineering Showcase
        </div>
        <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">
          Featured Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PORTFOLIO_DATA.projects.map((proj, idx) => {
          const IconComp = ICON_MAP[proj.icon] || Briefcase;
          return (
            <SpotlightCard
              key={idx}
              className="flex flex-col justify-between">
              <div>
                <div className="mb-4 w-fit rounded-xl border border-cyan-800/40 bg-cyan-950/60 p-3 text-cyan-400">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-100">
                  {proj.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">
                  {proj.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300">
                <span>View Project Details</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
```

### E. Social Links & Contact Section (`src/components/ContactSection.tsx`)

Uses Lucide icons (`Github`, `Linkedin`, `Facebook`, `Instagram`, `Youtube`, `Globe`, `Mail`, `Send`):

```tsx
"use client";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Magnet } from "@/components/reactbits/Magnet";
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Send,
} from "lucide-react";

const SOCIAL_ICONS: Record<string, any> = {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
};

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl px-4 py-20 text-center">
      <div className="mb-2 inline-flex items-center gap-2 font-mono text-sm tracking-wider text-cyan-400 uppercase">
        <Mail className="h-4 w-4" /> Connect
      </div>
      <h2 className="mb-4 text-3xl font-bold text-slate-100 sm:text-4xl">
        Social Accounts & Platforms
      </h2>
      <p className="mx-auto mb-10 max-w-xl text-slate-400">
        Reach out on social media or explore my active web profiles across
        platforms.
      </p>

      {/* Social Badges Grid */}
      <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PORTFOLIO_DATA.socialLinks.map((s, idx) => {
          const IconComponent = SOCIAL_ICONS[s.icon] || Globe;
          return (
            <SpotlightCard
              key={idx}
              className="flex flex-col items-center justify-center p-4 text-center">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full flex-col items-center gap-2">
                <IconComponent className="h-6 w-6 text-cyan-400" />
                <span className="text-sm font-bold text-slate-100">
                  {s.name}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  @{s.handle}
                </span>
              </a>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Direct Contact Banner */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-md">
        <h3 className="mb-2 text-2xl font-bold text-slate-100">
          Let's Build Something Together
        </h3>
        <p className="mb-6 text-sm text-slate-400">
          Open for technology partnerships, system engineering, and project
          collaborations.
        </p>
        <Magnet>
          <a
            href="mailto:contact@regix.com"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400">
            <Send className="h-4 w-4" />
            <span>Send Direct Message</span>
          </a>
        </Magnet>
      </div>
    </section>
  );
};
```

### F. Main Landing Page (`src/app/page.tsx`)

```tsx
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />

      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {PORTFOLIO_DATA.personal.fullName}. All
          rights reserved.
        </p>
        <p className="mt-1 font-mono text-cyan-500/80">Powered by REGIX</p>
      </footer>
    </main>
  );
}
```

---

## 7. Step 6: Testing & Deployment

### Build Verification

Run local build verification before deploying:

```bash
npm run build
npm run start
```

### Deploying to Netlify

1. Connect your GitHub repository (`jahid-ekbal/regix-portfolio`) to Netlify.
2. Build Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
3. Click **Deploy Site**.
