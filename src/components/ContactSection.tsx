"use client";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Magnet } from "@/components/reactbits/Magnet";
import { Code2, Link, Globe, Camera, Play, Mail, Send } from "lucide-react";

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Github: Code2,
  Linkedin: Link,
  Facebook: Globe,
  Instagram: Camera,
  Youtube: Play,
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

      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-md">
        <h3 className="mb-2 text-2xl font-bold text-slate-100">
          Let&apos;s Build Something Together
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
