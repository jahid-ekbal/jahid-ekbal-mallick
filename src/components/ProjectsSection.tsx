"use client";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  Bot,
  Cpu,
  Monitor,
  Layout,
  ExternalLink,
  Briefcase,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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
