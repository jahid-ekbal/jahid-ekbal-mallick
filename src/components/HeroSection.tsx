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
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-md">
        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
        <span>{PORTFOLIO_DATA.personal.location}</span>
      </div>

      <h1 className="mb-4 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-100 sm:text-6xl md:text-7xl">
        <BlurText text={`Hi, I'm ${PORTFOLIO_DATA.personal.fullName}`} />
      </h1>

      <div className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-slate-300 sm:text-2xl">
        <Terminal className="h-6 w-6 text-cyan-400" />
        <ShinyText
          text={`${PORTFOLIO_DATA.personal.role} @ ${PORTFOLIO_DATA.personal.company}`}
          speed={4}
        />
      </div>

      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        {PORTFOLIO_DATA.personal.bio}
      </p>

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
