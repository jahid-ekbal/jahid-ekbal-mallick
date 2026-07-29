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
          Skills paired with official documentation links for easy reference.
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
