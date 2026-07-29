"use client";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { User, GraduationCap, Target, Eye } from "lucide-react";

export const AboutSection = () => {
  const details = [
    {
      icon: GraduationCap,
      label: "Education",
      value: PORTFOLIO_DATA.personal.education,
    },
    {
      icon: Target,
      label: "1-Year Goal",
      value: PORTFOLIO_DATA.personal.oneYearGoal,
    },
    {
      icon: Eye,
      label: "Long-Term Vision",
      value: PORTFOLIO_DATA.personal.longTermVision,
    },
  ];

  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2 inline-flex items-center gap-2 font-mono text-sm tracking-wider text-cyan-400 uppercase">
          <User className="h-4 w-4" /> About Me
        </div>
        <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">
          The Engineer Behind REGIX
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-400">
          {PORTFOLIO_DATA.personal.bio}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {details.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <SpotlightCard
              key={idx}
              className="text-center">
              <div className="mb-4 inline-flex rounded-xl border border-cyan-800/40 bg-cyan-950/60 p-3 text-cyan-400">
                <IconComp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100">
                {item.label}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {item.value}
              </p>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};
